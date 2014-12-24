'use strict';

angular.module('openNaaSApp')
        .controller('HistoryListController', function ($scope, HistoryService, $filter, ngTableParams) {
            //.controller('MovieListController', function($scope, $state, popupService, $window, Movie) {
//            $scope.history = HistoryService.query(); //fetch all movies. Issues a GET to /api/movies
//            $scope.data = HistoryService.query(); //fetch all movies. Issues a GET to /api/movies

            var data = HistoryService.query({}, function (result) {
                $scope.tableParams.reload();
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
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });
console.log($scope);
            /*
             $scope.history = HistoryService.query();
             var getData = function () {
             return $scope.history;
             };
             
             $scope.$watch("history", function () {
             $scope.tableParams.reload();
             });
             $scope.tableParams = new ngTableParams({
             page: 1, // show first page
             count: 10, // count per page
             data: {},
             sorting: {
             name: 'desc' // initial sorting
             }
             }, {
             total: function () {
             return getData.length;
             }, // length of data
             getData: function ($defer, params) {
             var filteredData = getData();
             var orderedRecentActivity = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
             $scope.history = orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count());
             $defer.resolve($scope.history);
             
             }, $scope: {$data: {}}
             });*/
        })
        .controller('HistoryCreateController', function ($scope, HistoryService) {
            $scope.history = new HistoryService();  //create new movie instance. Properties will be set via ng-model on UI

            $scope.types = [
                'INFO',
                'ERROR',
                'WARN'
            ];

            $scope.history.type = $scope.types[0]; // info

            $scope.save = function () { //create a new movie. Issues a POST to /api/movies
                $scope.history.content = "TEst";
                $scope.history.$save(function (data) {
                    console.log(data);
                });
            };
        });