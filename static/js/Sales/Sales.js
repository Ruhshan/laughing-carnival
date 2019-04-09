var app = angular.module('salesApp', []);
app.controller('salesController', function($scope, $http) {
	$scope.productList = [];
	productDTOList = [];

	emptyProduct = {
		product_NUMBER: "",
		product_NAME: "",
		price: ""
	}

	$scope.Product = {
		product_NUMBER: "",
		product_NAME: "",
		price: ""
	}

	$scope.Outlet = {};

	tempProduct = {};

	$scope.menuUrl = view_url;
	$('#menu').kendoMenu();

	$('#outletList').kendoDropDownList({
		dataTextField: "outlet_NAME",
		dataValueField: "outlet_ID",
		dataSource: {
			transport: {
				read: {
					url: base_url + 'outlet/',
					dataType: 'json'
				}
			},
			sort: {
				field: 'outlet_NAME',
				dir: 'asc'
			}
		},
		change: function(e) {
			angular.copy(this.dataItem(this.select()), $scope.Outlet);

			var productListGrid = $('#productListGrid').data("kendoGrid");
			productListGrid.clearSelection();
		},
		dataBound: function(e) {
			angular.copy(this.dataItem(this.select()), $scope.Outlet);
		}
	});

	$('#salesDate').kendoDatePicker({
		format: 'dd MMMM, yyyy'
	});

	$('#salesDate').bind('click', function() {
		$(this).data('kendoDatePicker').open();
	});

	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'dd MMMM, yyyy');
	$('#salesDate').data('kendoDatePicker').value(todayDate);

	$http({
		method: 'GET',
		url: base_url + 'product/'
	}).then(function success(response) {
		angular.copy(response.data, $scope.productList);
	}, function error(response) {

	});

	$('#productListGrid').kendoGrid({
		selectable: true,
		allowCopy: true,
		columns: [
			{
				field: "product_NUMBER",
				title: "ARTICLE #",
				width: 1
			},
			{
				field: "product_NAME",
				title: "PORDUCT NAME",
				width: 2
			},
			{
				field: "price",
				title: "Price",
				width: 1
			}
		],
		sortable: {
			mode: "multiple",
			allowUnsort: true
		},
		filterable: true,
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 5
		},
		dataSource: {
			transport: {
				read: {
					url: base_url + "product/",
					dataType: "json"
				}
			},
			pageSize: 10
		},
		change: function(e) {
			angular.copy(this.dataItem(this.select()), tempProduct);

			if(tempProduct != null && tempProduct.product_NUMBER != undefined) {
				$scope.$apply(function() {
					angular.copy(tempProduct, $scope.Product);
				});
			}

			var stockDTO = stockDTOMaker();

			$http({
				method: 'POST',
				url: base_url + 'stock/findByOutletAndProduct',
				data: stockDTO
			}).then(function success(response) {
				$scope.currentStock = response.data.quantity;
			}, function error(response) {
				$.notify("Something Went Wrong!", "error");
			});
		}
	});

	$scope.SaveCommand = function() {
		var validator = $('#salesUpdateForm').kendoValidator().data('kendoValidator');
		if(validator.validate()) {
			var stockDTO = stockDTOMaker();

			$http({
				method: 'POST',
				url: base_url + 'stock/addSales',
				data: stockDTO
			}).then(function success(response) {
				$.notify("Save Successful", "success");

				$scope.currentStock = response.data.quantity;

			}, function error(response) {
				$.notify("Something Went Wrong!", "error");
				console.log(response);
			});
		}
	};

	function stockDTOMaker() {
		return {
			quantity: $scope.Product.quantity,
			product_NUMBER: $scope.Product.product_NUMBER,
			outlet_ID: $scope.Outlet.outlet_ID
		}
	};
});
