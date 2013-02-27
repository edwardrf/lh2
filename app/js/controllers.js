/*global io*/
/*global console*/

'use strict';

/* Controllers */
function millis(){
	var d = new Date();

}

function EditorCtrl($scope, frame, color){
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
		var g = color.getColor();
		if(e.which == 1) $scope.lamps[b][a] = g * 16 * 256 * 256 + g * 16 * 256;
	};
	$scope.nodrag = function(e) {
		e.preventDefault();
	};
}
// EditorCtrl.$inject = ['$scope'];
function ImportCtrl($scope){
	var socket = io.connect('http://localhost:3000/');
	$scope.msg = 'Message';
	$scope.sendMessage = function(){
		socket.emit('msg', {msg:$scope.msg});
	};

	$scope.sendAll = function(){
		socket.emit('all', {msg:$scope.msg});
	};

	socket.on('update', function(data){
		console.log('Server responded with ', data.msg);
		$scope.$apply(function(){
			$scope.msg = data.msg;
		});
	});
}
// EditorCtrl.$inject = ['$scope'];

function ColorSelectGrayScaleCtrl($scope, color){
	$scope.grayRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	$scope.gray = 0;

	$scope.setGray = function(g){
		$scope.gray = g;
		color.setColor(g);
	};
}