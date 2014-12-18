'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
  .controller('AboutCtrl', function ($scope, ngDialog) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.open = function () {
        ngDialog.open({ template: 'partials/dialog/popupTmpl.html' });
    };
  });