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
	var onGoingTouches = [];

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

	$scope.brushStart = function(a, b, e){
		e.preventDefault();
		var touches = e.changedTouches;
		for (var i=0; i<touches.length; i++) {
			onGoingTouches.push(touches[i]);
		}
	};

	$scope.brush = function(a, b, e){
		e.preventDefault();
		var g = color.getColor();
		if(e.type=='touchmove'){
			// console.log(e);
			var touches = e.changedTouches;
			for(var i=0; i<touches.length; i++) {
				var idx = ongoingTouchIndexById(touches[i].identifier);
				var fa = pxToX(onGoingTouches[idx].pageX);
				var fb = pxToY(onGoingTouches[idx].pageY);
				var ta = pxToX(touches[i].pageX);
				var tb = pxToY(touches[i].pageY);
				line(fa, fb, ta, tb, g);
				//$scope.lamps[bb][aa] = g;
				console.log(fa, fb, ta, tb, g);
				onGoingTouches.splice(idx, 1, touches[i]);
			}
		}else if(e.which == 1) {
			dot(a, b, g);
		}
	};

	$scope.brushEnd = function(a, b, e){
		e.preventDefault();
		var touches = e.changedTouches;
		for (var i=0; i<touches.length; i++) {
			var idx = ongoingTouchIndexById(touches[i].identifier);
			onGoingTouches.splice(idx, 1);
		}
	};

	function line(x0, y0, x1, y1, g){
		var dx = x1 - x0;
		var dy = y1 - y0;

		var D = 2 * dy - dx;
		dot(x0, y0, g);
		var y = y0;

		for(var x = x0 + 1; x <= x1; x++){
			if(D > 0){
				y = y + 1;
				dot(x,y, g);
				D = D + (2 * dy - 2 * dx);
			}else{
				dot(x, y, g);
				D = D + (2 * dy);
			}
		}
	}

	function dot(x, y, g){
		if(x >= 0 && x < 10 && y >= 0 && y < 10){
			$scope.lamps[y][x] = g * 16 * 256 * 256 + g * 16 * 256;
		}
	}

	function ongoingTouchIndexById(idToFind) {
		for (var i=0; i<onGoingTouches.length; i++) {
			var id = onGoingTouches[i].identifier;
			if (id == idToFind) {
				return i;
			}
		}
		return -1;
	}

	function pxToX(px){
		return Math.floor((px - offset.left) / 50);
	}

	function pxToY(px){
		return Math.floor((px - offset.top) / 50);
	}

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



