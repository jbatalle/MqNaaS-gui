'use strict';

angular.module('openNaaSApp', ['ngResource', 'ngRoute', 'ngCookies', 'openNaaSApp.services', 'LocalStorageModule', 'cb.x2js', 'mgcrea.ngStrap', 'angularBootstrapNavTree', 'smart-table', 'ui.router', 'ncy-angular-breadcrumb'])
        .config(function (localStorageServiceProvider, $breadcrumbProvider) {
            localStorageServiceProvider
                    .setPrefix('openNaaSApp')
                    .setStorageType('sessionStorage')
                    .setNotify(true, true);
            $breadcrumbProvider.setOptions({
              prefixStateName: 'home',
              template: 'bootstrap3'
            });
        }).config(
        ['$stateProvider', '$routeProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', function ($stateProvider, $routeProvider, $locationProvider, $httpProvider, $urlRouterProvider, $rootScope) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'partials/0_dashboard.html',
                    ncyBreadcrumb: {
                      label: 'Home'
                    }
                  })
                .state("network", {
                    url: "/network",
                    templateUrl: 'partials/network/dash.html',
                    controller: 'networkCtrl',
                    ncyBreadcrumb: {
                          label: 'networks',
                            parent: 'home'
                        }
                })
                .state("networkMgt", {
                    url: "/networkMgt",
                    templateUrl: 'partials/network/mgt.html',
                    controller: 'networkMgtCtrl',
                    ncyBreadcrumb: {
                      label: '{{networkId}}',
                        parent: 'network'
                    }
                })
                .state("login", {
                    url: "/login",
                    templateUrl: 'partials/login.html',
                    controller: 'LoginController'
                })
                .state("users", {
                    url: "/users",
                    templateUrl: 'partials/users.html',
                    controller: 'UsersController'
                })
                .state("networkResources", {
                    url: "/networkResources",
                    templateUrl: 'partials/resources/dash.html',
                    controller: 'resourceCtrl'
                })
                .state("networkResources/:id", {
                    url: "/networkResources/:id",
                    templateUrl: 'partials/resources/mgt.html',
                    controller: 'resourceMgtCtrl'
                })
                .state("options", {
                    url: "/options",
                    templateUrl: 'partials/options.html',
                    controller: 'optionsCtrl'
                })
                .state("history", {
                    url: "/history",
                    templateUrl: 'partials/options.html',
                    controller: 'optionsCtrl'
                })
            .state("userMgt", {
                    url: "/userMgt",
                    templateUrl: 'partials/users.html',
                    controller: 'UsersController'
                })
            ;
            
            $urlRouterProvider.otherwise('/home');
            
            /*
                        

                $locationProvider.hashPrefix('!');
*/
                /* Register error provider that shows message on failed requests or redirects to login page on
                 * unauthenticated requests */
                $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                    return {
                        'responseError': function (rejection) {
                            var status = rejection.status;
                            var config = rejection.config;
                            var method = config.method;
                            var url = config.url;

                            if (status == 401) {
                                $location.path("/login");
                            } else {
                                $rootScope.error = method + " on " + url + " failed with status " + status;
                            }

                            return $q.reject(rejection);
                        }
                    };
                }
                );

                /* Registers auth token interceptor, auth token is either passed by header or by query parameter
                 * as soon as there is an authenticated user */
                $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                    return {
                        'request': function (config) {
                            var isRestCall = config.url.indexOf('rest') == 0;
                            if (isRestCall && angular.isDefined($rootScope.authToken)) {
                                var authToken = $rootScope.authToken;
                                if (openNaaSAppConfig.useAuthTokenHeader) {
                                    config.headers['X-Auth-Token'] = authToken;
                                } else {
                                    config.url = config.url + "?token=" + authToken;
                                }
                            }
                            return config || $q.when(config);
                        }
                    };
                }
                );

            }]

        ).run(function ($rootScope, $location, $cookieStore, UserService) {

    /* Reset error when a new view is loaded */
    $rootScope
            .$on('$viewContentLoaded', function () {
                delete $rootScope.error;
        delete $rootScope.info;
            });

    $rootScope.hasRole = function (role) {

        if ($rootScope.user === undefined) {
            return false;
        }

        if ($rootScope.user.roles[role] === undefined) {
            return false;
        }

        return $rootScope.user.roles[role];
    };

    $rootScope.logout = function () {
        delete $rootScope.user;
        delete $rootScope.authToken;
        $cookieStore.remove('authToken');
//        $location.path("/login");
    };

    /* Try getting valid user from cookie or go to login page */
    var originalPath = $location.path();
//    $location.path("/login");
    var authToken = $cookieStore.get('authToken');
    if (authToken !== undefined) {
        $rootScope.authToken = authToken;
        UserService.get(function (user) {
            $rootScope.user = user;
            $location.path(originalPath);
        });
    }

    $rootScope.initialized = true;
});

var services = angular.module('openNaaSApp.services', ['ngResource']);
var genericUrl = "rest/mqnaas/";
var graph;
