'use strict';

angular.module('openNaaSApp')
        .controller('statisticsCtrl', function ($scope, ngTableParams, $filter, localStorageService, arnService) {

            var requestData = getCounter($scope.infId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
                console.log(data);
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    sorting: {
                        date: 'desc'     // initial sorting
                    }
                }, {
                    total: data.length,
                    getData: function ($defer, params) {
                        console.log("data");
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    $scope: {$data: {}}
                });
            });

        });