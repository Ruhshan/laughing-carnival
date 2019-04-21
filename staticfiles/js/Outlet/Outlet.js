var app = angular.module("outletApp", []);
		app.controller("outletController", function($scope, $http) {
			$scope.Outlet = {
				outlet_ID: "0",
				outlet_NAME: ""
			};

			emptyOutlet = {
				outlet_ID: "",
				outlet_NAME: ""
			};

			$scope.menuUrl = view_url;
			$('#menu').kendoMenu();

			$("#grid").kendoGrid({
				selectable: true,
				allowCopy: true,
				columns: [
					{
						field: "outlet_ID",
						title: "OUTLET ID"
					},
					{
						field: "outlet_NAME",
						title: "OUTLET NAME"
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
							url: base_url + 'outlet/',
							dataType: "json"
						}
					},
					pageSize: 10
				},
				change: function(e) {
					tempOutlet = {};
					angular.copy(this.dataItem(this.select()), tempOutlet);

					if(tempOutlet != null && tempOutlet.outlet_ID != undefined) {
						$scope.$apply(function() {
							angular.copy(tempOutlet, $scope.Outlet);
						});
					}
				},
				dataBound: function(e) {
					var gridData = this.dataSource._data;

					var i = 0;
					for(i = 0; i < gridData.length; i++) {
						if(gridData[i] != undefined && gridData[i].outlet_ID == $scope.Outlet.outlet_ID) {
							this.select('tr[data-uid="' + gridData[i].uid + '"]');
							break;
						}
					}
				}
			});

			$scope.NewCommand = function() {
				angular.copy(emptyOutlet, $scope.Outlet);
				$('#grid').data('kendoGrid').clearSelection();
			}

			$scope.SaveCommand = function() {
				var validator = $("#outletForm").kendoValidator().data("kendoValidator");
				if(validator.validate()) {
					$http({
						method: "POST",
						url: base_url + 'outlet/save',
						data: $scope.Outlet
					}).then(function success(response) {
						$.notify("Save Successful", "success");
						angular.copy(response.data, $scope.Outlet);
						refreshGrid();
					}, function error() {
						console.log("ERROR");
						$.notify("Something Went Wrong!", "error");
					});
				}
			}

			$scope.DeleteCommand = function() {
				var validator = $("#outletForm").kendoValidator().data("kendoValidator");
				if(validator.validate()) {
					$('#deleteConfirmModal').modal('show');
				}
			}

			$scope.deleteOutlet = function() {
				$http({
					method: "DELETE",
					url: base_url + "outlet/delete/" + $scope.Outlet.outlet_ID
				}).then(function success(response) {
					$.notify("Delete Successful", "info");
					refreshGrid();
					angular.copy(emptyOutlet, $scope.Outlet);
				}, function error() {
					console.log("error");
				});
			}

			refreshGrid = function() {
				$('#grid').data('kendoGrid').dataSource.read();
			}
		});