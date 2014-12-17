'use strict';

services.factory('RootResourceService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
        console.log("PUT RootResource MqNaaS");
        return {
            get: function () {
                var promise = $http.get('rest/mqnaas/IRootResourceProvider').then(function (response) {
                    var json = x2js.xml_str2json(response.data);
                    var his = new HistoryService();
                    his.content = response.status+" - GET (IRootResourceAdministrastion): "+response.statusText;
                    his.type = "INFO";
                    //his.$save(function (data) {console.log(data);});
                    return json;
                }
                );
                return promise;
            },
            put: function (data) {
                var promise = $http.put('rest/mqnaas/IRootResourceAdministration', data).then(function (response) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    //var x2js = new X2JS();
                    console.log(response);
//                    var json = x2js.xml_str2json(response.data);
                    var his = new HistoryService();
                    his.content = response.status+" - PUT (IRootResourceAdministrastion): "+response.data;
                    his.type = "INFO";
                    his.$save(function (data) {console.log(data);});
//                    return json;
                }
                );
                return promise;
            },
            remove: function (data) {
                console.log(data);
                var promise = $http.delete('rest/mqnaas/IRootResourceAdministration/'+data).then(function (response) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    //var x2js = new X2JS();
                    console.log(response);
//                    var json = x2js.xml_str2json(response.data);
                    var his = new HistoryService();
                    his.content = response.status+" - DELETE (IRootResourceAdministrastion): "+response.data;
                    his.type = "INFO";
                    his.$save(function (data) {console.log(data);});
//                    return json;
                }
                );
                return promise;
            }
        };
    }]);
