/*global io*/
/*global console*/

'use strict';
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
		window.console.log([st, at]);
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
