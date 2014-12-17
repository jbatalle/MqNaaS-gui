'use strict';

angular.module('openNaaSApp')
        .controller('RootResourceController', function ($scope, RootResourceService) {
            RootResourceService.get().then(function (data) {
                console.log(data);
                $scope.data = data;
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
            var json = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>NETWORK</type><model>Internal</model><version>1.0</version></specification></ns2:rootResourceDescriptor>';
            var x2js = new X2JS();
            json = x2js.xml_str2json(json);
            console.log(json);
            RootResourceService.put(json).then(function (data) {
                $scope.data = data;
                console.log($scope.data);
            });
        });