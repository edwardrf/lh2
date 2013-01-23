'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit', {templateUrl: 'partials/edit.html', controller: MyCtrl1});
    $routeProvider.when('/play', {templateUrl: 'partials/play.html', controller: MyCtrl2});
    $routeProvider.when('/export', {templateUrl: 'partials/export.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/edit'});
  }]);
