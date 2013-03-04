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
				var fa = (onGoingTouches[idx].pageX - offset.left) / 50;
				var fb = (onGoingTouches[idx].pageY - offset.top) / 50;
				var ta = (touches[i].pageX - offset.left) / 50;
				var tb = (touches[i].pageY - offset.top) / 50;
				// line(Math.round(fa), Math.round(fb), Math.round(ta), Math.round(tb), g);

				aaline(fa, fb, ta, tb, g);
				//$scope.lamps[bb][aa] = g;
				// console.log(fa, fb, ta, tb, g);
				// $scope.message = fa + ', ' + fb + ', ' + ta + ', ' + tb;
				onGoingTouches.splice(idx, 1, touches[i]);
			}
		}else if(e.which == 1) {
			console.log("clicked");
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
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);

		var sx = x0 < x1 ? 1 : -1;
		var sy = y0 < y1 ? 1 : -1;
		var err = dx - dy;

		while(true) {
			dot(x0, y0, g);
			if(x0 == x1 && y0 == y1) break;
			var e2 = 2 * err;
			if(e2 > -dy) {
				err = err - dy;
				x0  = x0 + sx;
			}
			if(e2 < dx){
				err = err + dx;
				y0  = y0 + sy;
			}
		}
	}

	function aaline(x0, y0, x1, y1, g) {
		var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
		var tmp;
		if(steep){
			tmp = x0; x0 = y0; y0 = tmp;
			tmp = x1; x1 = y1; y1 = tmp;
		}
		if(x0 > x1){
			tmp = x0; x0 = x1; x1 = tmp;
			tmp = y0; y0 = y1; y1 = tmp;
		}

		var dx = x1 - x0;
		var dy = y1 - y0;
		var gradient = dy / dx;

		var xend = Math.round(x0);
		var yend = y0 + gradient * (xend - x0);
		var xgap = rfpart(x0 + 0.5);
		var xpxl1 = xend;
		var ypxl1 = Math.floor(yend);
		if(steep){
			aadot(ypxl1    , xpxl1, g, rfpart(yend) * xgap);
			aadot(ypxl1 + 1, xpxl1, g,  fpart(yend) * xgap);
		}else {
			aadot(xpxl1, ypxl1    , g, rfpart(yend) * xgap);
			aadot(xpxl1, ypxl1 + 1, g,  fpart(yend) * xgap);
		}
		var intery = yend + gradient;

		xend = Math.round(x1);
		yend = y1 + gradient * (xend - x1);
		xgap = fpart(x1 + 0.5);
		var xpxl2 = xend;
		var ypxl2 = Math.floor(yend);
		if(steep){
			aadot(ypxl2    , xpxl2, g,  rfpart(yend) * xgap);
			aadot(ypxl2 + 1, xpxl2, g,   fpart(yend) * xgap);
		}else {
			aadot(xpxl2, ypxl2    , g,  rfpart(yend) * xgap);
			aadot(xpxl2, ypxl2 + 1, g,   fpart(yend) * xgap);
		}

		for(var x = xpxl1 + 1;x <= xpxl2 - 1; x ++){
			if(steep){
				aadot(Math.floor(intery)    , x, g,  rfpart(intery));
				aadot(Math.floor(intery) + 1, x, g,   fpart(intery));
			}else {
				aadot(x, Math.floor(intery)    , g,  rfpart(intery));
				aadot(x, Math.floor(intery) + 1, g,   fpart(intery));
			}
			intery = intery + gradient;
		}
	}

	function fpart(x){
		return x - Math.floor(x);
	}

	function rfpart(x){
		return 1 - fpart(x);
	}

	function dot(x, y, g){
		if(x >= 0 && x < 10 && y >= 0 && y < 10){
			$scope.lamps[y][x] = g * 16 * 256 * 256 + g * 16 * 256;
		}
	}

	function aadot(x, y, g, b){
		if(x >= 0 && x < 10 && y >= 0 && y < 10){
			var og = Math.round($scope.lamps[y][x] / 256 / 256 / 16);
			var ig = Math.round(g * b * 2 - 15 + og);
			// alert([g, b, og]);
			// if(ig < 0) ig = 0;
			// if(ig > 15) ig = 15;
			$scope.lamps[y][x] = ig * 16 * 256 * 256 + ig * 16 * 256;
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



