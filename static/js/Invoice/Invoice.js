var app = angular.module("invoiceApp", []);
app.controller("invoiceController", function($scope, $http) {
	$("#outletList").kendoDropDownList({
		dataTextField: "outlet_NAME",
		dataValueField: "outlet_ID",
		dataSource: {
			transport: {
				read: {
					url: base_url + 'outlet/',
					dataType: 'json'
				}
			}
		},
		optionLabel:"SELECT OUTLET"
	});

	var isDatePickerOpen = false;
	var productNumberBackUp = "";
	var quantityBackUp = 0;
	var unitPrice = 0;
	var newID = 0;

	$scope.invoiceProductList = [];
	$scope.grandTotalPrice = 0;
	$scope.grandTotalQuantity = 0;

	$scope.menuUrl = view_url;
	$('#menu').kendoMenu();

	$('#madeInvoice').hide();

	$('#invoiceDate').kendoDatePicker({
		format: 'dd MMMM, yyyy'
	});

	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'dd MMMM, yyyy');
	$("#invoiceDate").data('kendoDatePicker').value(todayDate);

	$('#invoiceDate').bind('click', function() {
		if(!isDatePickerOpen)
			$(this).data('kendoDatePicker').open();
		else $(this).data('kendoDatePicker').close();

		isDatePickerOpen = !isDatePickerOpen;
	});

	$(".productNumber").on('change', function() {
		var productNumber = $(this).val();

		if(productNumber != "") {
			productNumberBackUp = productNumber;
		}

		var callingObjRow = $(this).parent().parent();

		var targetTD = callingObjRow.children().eq(1);
		var productNameInput = targetTD.children('input');
		

		targetTD = callingObjRow.children().eq(2);
		var unitPriceInput = targetTD.children('input');

		if(productNameInput.length != 0 && unitPriceInput.length != 0) {
			$http({
				method: "GET",
				url: base_url + 'product/' + productNumberBackUp
			}).then(
				function(resp) {
					productNameInput.val(resp.data.product_NAME);
					unitPriceInput.val(resp.data.price);
					unitPrice = resp.data.price;
				},
				function(resp) {
					console.log(resp);
				}
			);
		}
	});

	$('.quantity').on('input', function() {
		var quantityInput = $(this).val();

		if(quantityInput != "") {
			quantityBackUp = quantityInput;
		}

		var callingObjRow = $(this).parent().parent();
		var totalPriceInput = callingObjRow.children().children('.totalPrice');

		unitPrice = callingObjRow.children().children('.unitPrice').val();
		
		if(totalPriceInput.length != 0) {
			totalPriceInput.val(unitPrice * quantityBackUp);
		}

		if(quantityInput == "") {
			totalPriceInput.val(0);
		}
	});

	$('#append').on('click', function() {
		var obj = $('#invoiceTableRow').clone(true);
		obj.attr('id', obj.attr('id') + newID);
		newID++;

		var tableData = obj.children().eq(0);
		articleInput = tableData.children('input');
		articleInput.val('');

		tableData = obj.children().eq(1);
		productNameInput = tableData.children('input');
		productNameInput.val('');

		tableData = obj.children().eq(2);
		unitPriceInput = tableData.children('input');
		unitPriceInput.val(0);

		tableData = obj.children().eq(3);
		quantityInput = tableData.children('input');
		quantityInput.val(0);

		tableData = obj.children().eq(4);
		totalPriceInput = tableData.children('input');
		totalPriceInput.val(0);

		obj.appendTo('#invoicTableBody');
	});

	$('table').on('click', '.delete', function() {
		if($(this).parents('tr').attr('id') == 'invoiceTableRow') {
			return;
		}

		$(this).parents('tr').remove();
	});

	$('#save').on('click', function() {
		var hasNoError = true;
		$scope.invoiceProductList = [];
		$scope.grandTotalQuantity = 0;
		$scope.grandTotalPrice = 0;
		var uid = 0;

		$('#invoicTableBody tr').each(function() {
			var articleNo = $(this).children().eq(0).children('input').val();
			var productName = $(this).children().eq(1).children('input').val();
			var unitPrice = $(this).children().eq(2).children('input').val();
			var quantity = $(this).children().eq(3).children('input').val();
			var totalPrice = $(this).children().eq(4).children('input').val();
			var outletID = $('#outletList').val();

			if(articleNo == '' || articleNo == undefined || productName == '' || unitPrice == 0 
							|| quantity == 0 || totalPrice == 0 || outletID == '' || outletID == undefined) {
				$.notify("Please Fill up the Empty Field!", "error");
				$scope.invoiceProductList = [];
				$scope.grandTotalQuantity = 0;
				$scope.grandTotalPrice = 0;
				hasNoError = false;
				return;
			}
			else {
				var obj = { uid, articleNo, productName, unitPrice, quantity, totalPrice };
				$scope.invoiceProductList.push(obj);
				$scope.grandTotalQuantity += parseInt(quantity);
				$scope.grandTotalPrice += parseInt(totalPrice);
				uid++;
			}
		});

		if(hasNoError) {
			$('#invoiceMakerDiv').hide();
			$('#madeInvoice').show();

			$scope.printOutletName = $('#outletList').data('kendoDropDownList').text();
			$scope.printDate = $('#invoiceDate').val();

			$http({
				method: "GET",
				url: base_url + 'invoice/getLastInvoiceID/'
			}).then(
				function success(response) {
					$scope.invoiceNo = response.data + 1;
				},
				function error(response) {
					$.notify("Something went wrong!", "error");
				}
			);

			$scope.$apply();
		}
	});

	$('#saveAndPrint').on('click', function() {
		var obj = $('#invoiceToBePrinted').clone();
		$('#mainDiv').hide();

		obj.appendTo('#body');

		var list = [];

		angular.forEach($scope.invoiceProductList, function(val, key){
			var obj = { 
				productID: val.articleNo,
				quantity: val.quantity
			}
			list.push(obj);
		});

		var dt = { 
			outletID: $('#outletList').val(),
			invoiceDate: new Date($('#invoiceDate').val()),
			invoicedProductEntries: list
		}

		$http({
			method: "POST",
			url: base_url + '/invoice/save',
			data: dt
		}).then(
			function success(response) {
				if(response.data == true) {
					setTimeout(function() {
						window.print();
						setTimeout(function() {
							document.location.href = 'http://localhost/personalFiles/apv2/Invoice.html';
						}, 1000);
					}, 1000);
				}
				else {
					$.notify("Something went wrong!", "error");
				}
			},
			function error(response) {
				$.notify("Something went wrong!", "error");
			}
		);
	});

	$('#cancelButton').on('click', function() {
		document.location.href = 'http://localhost/personalFiles/apv2/Invoice.html';
	});
});