'use strict';

angular.module('openNaaSApp')
        .controller('HistoryListController', function ($scope, HistoryService) {
            //.controller('MovieListController', function($scope, $state, popupService, $window, Movie) {
            $scope.history = HistoryService.query(); //fetch all movies. Issues a GET to /api/movies
            $scope.deleteEntry = function (historyEntry) {
                historyEntry.$remove(function () {
                    $scope.history = HistoryService.query();
                });
            };
        })
        .controller('HistoryCreateController', function ($scope, HistoryService) {
            $scope.history = new HistoryService();  //create new movie instance. Properties will be set via ng-model on UI

            $scope.save = function () { //create a new movie. Issues a POST to /api/movies
                $scope.history.$save(function () {
                });
            };
        });