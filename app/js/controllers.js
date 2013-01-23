'use strict';

/* Controllers */
function millis(){
	var d = new Date();

}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

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
	}
}
// EditorCtrl.$inject = ['$scope'];