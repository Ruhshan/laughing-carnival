var app = angular.module('invoiceHistoryApp', []);
app.controller('invoiceHistoryController', function($scope, $http) {
	
	$scope.invoiceProductList = [];
	
	$scope.menuUrl = view_url;
	$('#menu').kendoMenu();

	$('#invoiceListGrid').kendoGrid({
		selectable: true,
		allowCopy: true,
		columns: [
			{
				field: 'id',
				title: 'INVOICE ID',
				width: 1
			},
			{
				field: 'outletName',
				title: 'OUTLET',
				width: 2
			},
			{
				field: 'invoiceDate',
				title: 'DATE',
				width: 1
			}
		],
		sortable: {
			mode: 'multiple',
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
				read: base_url + 'invoice/',
				dataType: 'json'
			},
			pageSize: 10
		},
		change: function(e) {
			var invoiceDTO = {};
			angular.copy(this.dataItem(this.select()), invoiceDTO);

			$http({
				method: 'GET',
				url: base_url + 'invoice/' + invoiceDTO.id
			}).then(
				function success(resp) {
					$scope.invoiceProductList = [];

					var totalQuantity = 0;
					var totalprice = 0;

					for(var i = 0; i < resp.data.invoiceDetailsCollection.length; i++) {

						number = resp.data.invoiceDetailsCollection[i].product.product_NUMBER;
						name = resp.data.invoiceDetailsCollection[i].product.product_NAME;
						quantity = resp.data.invoiceDetailsCollection[i].quantity;
						price = resp.data.invoiceDetailsCollection[i].product.price;
						
						var obj = {
							'PRODUCT_NUMBER': number,
							'PRODUCT_NAME': name,
							'UNIT_PRICE': price,
							'QUANTITY': quantity,
							'TOTAL': price * quantity
						};

						totalQuantity += quantity;
						totalprice += (price * quantity);

						$scope.invoiceProductList.push(obj);
					}

					var obj = {
						'PRODUCT_NUMBER': ' ',
						'PRODUCT_NAME': 'GRAND TOTAL',
						'UNIT_PRICE': ' ',
						'QUANTITY': totalQuantity,
						'TOTAL': totalprice
					};

					$scope.invoiceProductList.push(obj);

					var grid = $('#invoiceDetailsGrid').data('kendoGrid');
					grid.dataSource.read();
				},
				function error(resp) {
					console.log(resp);
				}
			);
		}
	});

	$('#invoiceDetailsGrid').kendoGrid({
		columns: [
			{
				field: 'PRODUCT_NUMBER',
				title: 'ATRICLE',
				width: 4
			},
			{
				field: 'PRODUCT_NAME',
				title: 'PRODUCT NAME',
				width: 8
			},
			{
				field: 'UNIT_PRICE',
				title: 'U. P',
				width: 4
			},
			{
				field: 'QUANTITY',
				title: 'QTY.',
				width: 4
			},
			{
				field: 'TOTAL',
				title: 'TL.',
				width: 3
			}
		],
		dataSource: {
			transport: {
				read: function(opt) {
					opt.success($scope.invoiceProductList);
				}
			}
		}
	});
});