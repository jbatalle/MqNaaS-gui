
var services = angular.module('openNaaSApp.services', ['ngResource']);

services.factory('UserService', function ($resource) {
    /*
     var authService = {};
     
     authService.login = function (credentials) {
     return $http
     .post('/login', credentials)
     .then(function (res) {
     Session.create(res.data.id, res.data.user.id,
     res.data.user.role);
     return res.data.user;
     });
     };
     */

    return $resource('rest/user/:action', {},
            {
                authenticate: {
                    method: 'POST',
                    params: {'action': 'authenticate'},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                },
            }
    );
})
        .factory('NewsService', function ($resource) {

            return $resource('rest/news/:id', {id: '@id'});
        })
        .factory('TestMqNaaSService', ['$http', 'x2js', function ($http, x2js) {
                console.log("GET Test MqNaaS")
                return {
                    get: function () {
                        var promise = $http.get('rest/mqnaas/IRootResourceProvider').then(function (response) {
                                // convert the data to JSON and provide
                                // it to the success function below
                                //var x2js = new X2JS();
                                var json = x2js.xml_str2json(response.data);
                                return json;
                            }
                        )
                        return promise;
                    }
                }
            }]);
