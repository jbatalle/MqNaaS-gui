'use strict';

angular.module('openNaaSApp')
        .controller('dashboardCtrl', function ($scope, HistoryService) {

            
            $scope.slicesSize = 0;
            /*            viService.list().then(function (data) {
             console.log("GET Slices SIZE");
             $scope.slicesSize = data.length;
             });
             */

            HistoryService.query({}, function (data) {
                data.splice(10, Number.MAX_VALUE);
                $scope.lastHistory = data;
                console.log(data);
            });
        });