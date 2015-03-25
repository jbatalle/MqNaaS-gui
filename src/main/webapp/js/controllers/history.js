'use strict';

angular.module('openNaaSApp')
    .controller('historyCtrl', function ($scope, HistoryService, $filter, $q) {


        $scope.itemsByPage = 5;
        $scope.rowCollection = [];
        HistoryService.query({}, function (data) {
            $scope.rowCollection = data;

        });


        /*
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    sorting: {
                        date: 'desc'     // initial sorting
                    }
                }, {
                    total: data.length,
                    getData: function ($defer, params) {
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }, $scope: {$data: {}}
                });
                */
    });