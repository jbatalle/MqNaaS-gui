'use strict';

services.factory('ServiceProviderService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
        console.log("Service Provider MqNaaS");
        return {
            list: function (id) {
                var promise = $http.get('rest/mqnaas/IServiceProvider/services?arg0='+id).then(function (response) {
                    var json = x2js.xml_str2json(response.data);
                    var his = new HistoryService();
                    his.content = response.status+" - GET List (IServiceProvider): "+response.statusText;
                    his.type = "INFO";
                    his.$save();
                    return json;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET List (IServiceProvider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
