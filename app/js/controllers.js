/*global io*/
/*global console*/
/*global $*/

'use strict';

/* Controllers */

function EditorCtrl($scope, frame, color, $rootScope){
	$scope.timer = null;
	$scope.lamps = frame.newFrame();
	$scope.message = "No message";

	var st = 0;
	var at = 0;
	var msgcnt = 0;
	var offset = $('table.large.lamp').offset();

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
	};

	$scope.brush = function(a, b, e){
		e.preventDefault();
		var g = color.getColor();
		if(e.type=='touchmove'){
			var aa = Math.floor((e.touches[0].pageX - offset.left) / 50);
			var bb = Math.floor((e.touches[0].pageY - offset.top) / 50);
			$scope.lamps[bb][aa] = g * 16 * 256 * 256 + g * 16 * 256;
		}else if(e.which == 1) {
			$scope.lamps[b][a] = g * 16 * 256 * 256 + g * 16 * 256;
			//console.log(g * 16 * 256 * 256 + g * 16 * 256, $scope.lamps[b][a]);
		}
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
	$scope.msg = 'no msg';

	$scope.setGray = function(g){
		$scope.gray = g;
		color.setColor(g);
	};

	$scope.scroll = function(event){
		event.preventDefault();
		if(event.wheelDeltaY > 0 && $scope.gray > 0)  $scope.gray--;
		if(event.wheelDeltaY < 0 && $scope.gray < 15) $scope.gray++;
		color.setColor($scope.gray);
	};
}



