var app = angular.module("productApp", []);
		app.controller("productController", function($scope, $http) {
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

			tempProduct = {};

			var index = 0;

			$scope.menuUrl = view_url;
			$('#menu').kendoMenu();

			$('#grid').kendoGrid({
				selectable: "true",
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
							url: base_url + 'product/',
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
				},
				dataBound: function(e) {
					var gridData = this.dataSource._data;

					var i = 0;
					for(i = 0; i < gridData.length; i++) {

						if(gridData[i] != undefined && gridData[i].product_NUMBER == $scope.Product.product_NUMBER) {
							this.select('tr[data-uid="' + gridData[i].uid + '"]');
							break;
						}
					}
				}
			});

			$scope.NewCommand = function() {
				angular.copy(emptyProduct, $scope.Product);
				$('#grid').data('kendoGrid').clearSelection();
			}

			$scope.SaveCommand = function() {
				var validator = $("#productForm").kendoValidator().data("kendoValidator");
				if(validator.validate()) {
					$http({
						method: "POST",
						url: base_url + "product/save",
						data: $scope.Product
					}).then(function success(response) {
						$.notify("Save Successful", "success");
						refreshGrid();
					}, function error() {
						console.log("error");
						$.notify("Something Went Wrong!", "error");
					});
				}
			}

			$scope.DeleteCommand = function() {
				var validator = $("#productForm").kendoValidator().data("kendoValidator");
				if(validator.validate()) {
					$('#deleteConfirmModal').modal('show');
				}
			}

			$scope.deleteProduct = function() {
				console.log("clicked!");
				$http({
						method: "DELETE",
						url: base_url + "product/delete/" + $scope.Product.product_NUMBER
					}).then(function success(response) {
						refreshGrid();
						$.notify("Delete Successful", "info");
					}, function error() {
						console.log("error");
						$.notify("Something Went Wrong!", "error");
					});
					angular.copy(emptyProduct, $scope.Product);
			}

			refreshGrid = function() {
				$('#grid').data('kendoGrid').dataSource.read();
			}
			
		});
