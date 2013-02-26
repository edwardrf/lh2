'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/edit', {templateUrl: 'partials/edit.html'});
    $routeProvider.when('/play', {templateUrl: 'partials/play.html'});
    $routeProvider.when('/export', {templateUrl: 'partials/export.html'});
    $routeProvider.when('/import', {templateUrl: 'partials/import.html'});
    $routeProvider.otherwise({redirectTo: '/edit'});
  }]);
