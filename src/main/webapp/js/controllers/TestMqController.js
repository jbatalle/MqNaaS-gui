'use strict';

angular.module('openNaaSApp')
        .controller('TestMqController', function ($scope, TestMqNaaSService) {
            TestMqNaaSService.get().then(function (data) {
                $scope.data = data;
                console.log($scope.data);
            });
        });