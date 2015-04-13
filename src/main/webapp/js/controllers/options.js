'use strict';

angular.module('openNaaSApp')
.controller('optionsCtrl', function ($scope, $rootScope, endpointService) {
    var url = "";
    $scope.options = {};
    endpointService.get().then(function (data) {
        //http://admin:123456@84.88.41.171:9000
        var t = data.split(":")
        $scope.options.port = t.pop();
        $scope.options.ip = t.pop().split("//")[1];
        
    });
   
    $scope.update = function(options){
        endpointService.post(options.ip, options.port);
    };
});