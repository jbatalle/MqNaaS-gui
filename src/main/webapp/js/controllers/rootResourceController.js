'use strict';

angular.module('openNaaSApp')
        .controller('RootResourceController', function ($scope, RootResourceService, localStorageService) {
console.log(localStorageService.get("mqNaaSElements"));
            RootResourceService.list().then(function (data) {
                console.log(data);
                console.log(data.length);
                if (data.IRootResource.IRootResourceId instanceof Array) {
                    console.log("IS AN ARRAY");
                } else {
                    console.log("IS NOT AN ARRAY");
                    var el = data.IRootResource.IRootResourceId;
                    data.IRootResource.IRootResourceId = [el];
//                    data.IRootResource.IRootResourceId[0] = el;
                }
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

            $scope.createNetwork = function () {
                console.log("Create network");
                var xml = getNETWORK();
                console.log(xml);
                RootResourceService.put(xml).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
            };

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