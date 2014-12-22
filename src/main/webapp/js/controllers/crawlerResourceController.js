'use strict';

angular.module('openNaaSApp')
        .controller('RootResourceController', function ($scope, RootResourceService, localStorageService) {

            RootResourceService.list().then(function (data) {
                console.log(data);
                $scope.data = data;
                localStorageService.set("mqNaaSElements", data);
                console.log($scope.data);
            });

            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                RootResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = RootResourceService.query();
                });
            };

        })
        .controller('CreateRootResourceController', function ($scope, RootResourceService) {
            var xml = getNETWORK();
            console.log(xml);
            RootResourceService.put(xml).then(function (data) {
                $scope.data = data;
                console.log($scope.data);
            });
        })
        .controller('InfoRootResourceController', function ($scope, RootResourceService, $routeParams, localStorageService) {
            RootResourceService.get($routeParams.id).then(function (data) {
                console.log(data);
                console.log("mqEl-" + $routeParams.id);
                $scope.data = data;
                localStorageService.set("mqEl-" + $routeParams.id, data);
                console.log($scope.data);
            });
        });