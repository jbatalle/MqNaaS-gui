'use strict';

angular.module('openNaaSApp')
        .controller('RootResourceController', function ($scope, RootResourceService, localStorageService) {
            console.log(localStorageService.get("mqNaaSElements"));

            $scope.list = function () {
                RootResourceService.list().then(function (data) {
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                    } else {
                        data.IRootResource.IRootResourceId = [data.IRootResource.IRootResourceId];
                    }
                    $scope.data = data;
                    localStorageService.set("mqNaaSElements", data);
                });
            }
            $scope.deleteEntry = function (resourceName) {
                RootResourceService.remove(resourceName).then(function (data) {
                    $scope.list();
                });
            };

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $scope.list();
                });
            };
            $scope.list();

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