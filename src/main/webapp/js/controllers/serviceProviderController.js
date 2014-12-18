'use strict';

angular.module('openNaaSApp')
        .controller('serviceProviderController', function ($scope, $routeParams, ServiceProviderService, localStorageService) {
            
            ServiceProviderService.list($routeParams.id).then(function (data) {
                console.log(data);
                $scope.element = $routeParams.id;
                $scope.data = data;
                localStorageService.set("mqEl-"+$routeParams.id, data);
                console.log($scope.data);
            });

        })
        .controller('InfoServiceProviderController', function ($scope, RootResourceService, $routeParams, localStorageService) {
            RootResourceService.get($routeParams.id).then(function (data) {
                console.log(data);
                console.log("mqEl-"+$routeParams.id);
                $scope.data = data;
                localStorageService.set("mqEl-"+$routeParams.id, data);
                console.log($scope.data);
            });
        });