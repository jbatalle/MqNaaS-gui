'use strict';

angular.module('openNaaSApp')
        .controller('ContentController', function ($scope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService) {
            var url = generateUrl("IRootResourceAdministration", $routeParams.id, "IRootResourceProvider");
            console.log(url);
            var tree = localStorageService.get("mqNaaSElements");
            MqNaaSResourceService.action(url).then(function (data) {
                console.log(data);
                $scope.element = $routeParams.id;
                $scope.data = data;
                localStorageService.set("mqNaaSElements", data);
                console.log($scope.data);
            });


        });

function generateUrl(action1, resource, action2) {
    var url;
    url = action1 + "/" + resource + "/" + action2;
    return url;
}