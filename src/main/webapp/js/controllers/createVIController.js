'use strict';

angular.module('openNaaSApp')
        .controller('listVIController', function ($scope, MqNaaSResourceService, $filter, ngTableParams, x2js) {
            console.log("LIST VI");
            var urlListVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
            $scope.data = [];
            MqNaaSResourceService.list(urlListVI).then(function(result){
                console.log(result);
                $scope.data = result.IResource.IResourceId;
                $scope.tableParams.reload();
//                return result.IResource;
            });
console.log($scope.data);
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: $scope.data.length,
                getData: function ($defer, params) {
//                    data = '<IResource><IResourceId>req-1</IResourceId><IResourceId>req-2</IResourceId></IResource>';
//                    data = '<IResource><IResourceId>req-1</IResourceId></IResource>';
//                    data = x2js.xml_str2json(data);
//                    data = data.IResource.IResourceId;
//data  = data.$$state.value.IResource;
console.log($scope.data);
//                    console.log(data);
                    var data = checkIfIsArray($scope.data);
                    console.log(data);
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });

            $scope.createVIRequest = function () {
                var urlCreateVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
                MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                    $scope.tableParams.reload();
                });
            };
        })
        .controller('editVIController', function ($scope, MqNaaSResourceService) {

        });

function checkIfIsArray(possibleArray) {
    if (possibleArray instanceof Array) {
        return possibleArray;
    } else {
        return [possibleArray];
    }
}