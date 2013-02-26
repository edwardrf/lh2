'use strict';

/*global console */

/* Controllers */
function millis(){
	var d = new Date();
}

function EditorCtrl($scope, frame){
	$scope.timer = null;
	$scope.lamps = frame.newFrame();

	var st = 0;
	var at = 0;

	$scope.run = function(){
		var s = Date.now();
		frame.step($scope.lamps);
		st += Date.now() - s;
		s = Date.now();
		$scope.$apply();
		at += Date.now() - s;
		$scope.timer = setTimeout($scope.run, 0);
	};

	$scope.stop = function(){
		clearTimeout($scope.timer);
		console.log([st, at]);
	};

	$scope.clk = function(a, b, e){
		console.log(e);
		if(e.which == 1) $scope.lamps[b][a] = 0xFFFFFF;
	};

	$scope.nodrag = function(e) {
		e.preventDefault();
	};
}
// EditorCtrl.$inject = ['$scope'];

function ColorSelectGrayScaleCtrl($scope){
	$scope.grayRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	$scope.gray = 0;
}