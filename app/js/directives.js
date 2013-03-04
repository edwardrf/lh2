'use strict';

/*global angular, console*/
/* Directives */


angular.module('lh.directives', []).
	directive('appVersion', ['version', function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	}]).
	directive('mouseWheel', ['$parse', function($parse){
		return function(scope, elm, attrs) {
			var fn = $parse(attrs['mouseWheel']);
			elm.bind("mousewheel", function(event){
				scope.$apply(function(){
					fn(scope, {$event:event});
				});
			});
		};
	}]).
	directive('touchStart', ['$parse', function($parse){
		return function(scope, elm, attrs) {
			var fn = $parse(attrs['touchStart']);
			elm.bind("touchstart", function(event){
				scope.$apply(function(){
					fn(scope, {$event:event});
				});
			});
		};
	}]).
	directive('touchMove', ['$parse', function($parse){
		return function(scope, elm, attrs) {
			var fn = $parse(attrs['touchMove']);
			elm.bind("touchmove", function(event){
				scope.$apply(function(){
					fn(scope, {$event:event});
				});
			});
		};
	}]).
	directive('touchStop', ['$parse', function($parse){
		return function(scope, elm, attrs) {
			var fn = $parse(attrs['touchStop']);
			elm.bind("touchstop", function(event){
				scope.$apply(function(){
					fn(scope, {$event:event});
				});
			});
		};
	}]);
