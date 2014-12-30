'use strict';

angular.module('openNaaSApp')
        .controller('listVIController', function ($scope, MqNaaSResourceService, $filter, ngTableParams, x2js) {
            console.log("LIST VI");
            var urlListVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
            var data = MqNaaSResourceService.get(urlListVI).then(function (result) {
                $scope.tableParams.reload();
                return result.IResource;
            });

            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: data.length,
                getData: function ($defer, params) {
//                    data = '<IResource><IResourceId>req-1</IResourceId><IResourceId>req-2</IResourceId></IResource>';
                    data = '<IResource><IResourceId>req-1</IResourceId></IResource>';
                    data = x2js.xml_str2json(data);
                    data = data.IResource.IResourceId;
                    console.log(data);
                    data = checkIfIsArray(data);
                    console.log(data);
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });
            console.log($scope);
        })
        .controller('createVIController', function ($scope, MqNaaSResourceService, $filter, ngTableParams, x2js) {
            console.log("Create VI VI");
            var urlListVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
            var data = MqNaaSResourceService.put(urlListVI).then(function (result) {
                $scope.tableParams.reload();
                return result.IResource;
            });

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