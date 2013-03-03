/*global io*/
/*global console*/
/*global $*/

'use strict';

var globalColor = 0;
var globalLampDoms = [];
var globalLampDivDoms = [];
var offset;

function fastbrush(e){
	e.preventDefault();
	// alert(e.type);
	// if(e.type && e.type=='touchmove'){
		var touches = e.changedTouches;
		for(var i=0; i<touches.length; i++) {
			var aa = Math.floor((touches[i].pageX - offset.left) / 50);
			var bb = Math.floor((touches[i].pageY - offset.top) / 50);
			console.log('touchmove', bb, aa);
			if(aa >=0 && aa < 10 && bb >= 0 && bb < 10){
				// setTimeout(function(){
					globalLampDivDoms[bb][aa].css({
						'background-color' : grayToHexColor(globalColor),
						// 'box-shadow' : '0 0 10px 5px ' + grayToShadowColor(globalColor)
					});
				// },3000);
			}
		}
	// }
}

/* Controllers */

function EditorCtrl($scope, frame, color, $rootScope){
	$scope.timer = null;
	$scope.lamps = frame.newFrame();
	$scope.message = "No message";

	var st = 0;
	var at = 0;
	var msgcnt = 0;
	// var offset = $('table.large.lamp').offset();

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
			$scope.message = "x:" + e.touches[0].pageX + "y:" + e.touches[0].pageY +
			'a : ' + aa + ' b : ' + bb +
			//"New message " + e + " cnt: " + msgcnt++ + ' gray: ' + g + " color: " +
			// $scope.lamps[b][a] + " which:" + e.which +
			// "b:" + b + " a:" + a +
			// "x:" + e.touches[0].pageX + "y:" + e.touches[0].pageY
			" target:" + e.touches[0].target;
			$scope.lamps[bb][aa] = g * 16 * 256 * 256 + g * 16 * 256;
		}else if(e.which == 1) {
			$scope.lamps[b][a] = g * 16 * 256 * 256 + g * 16 * 256;
			//console.log(g * 16 * 256 * 256 + g * 16 * 256, $scope.lamps[b][a]);
		}
	};
	$scope.nodrag = function(e) {
		e.preventDefault();
	};

	$scope.initGlobal = function(){
		globalLampDoms = [];
		globalLampDivDoms = [];
		// Prepare the global lamps dom
		for(var i = 0; i < 10; i++){
			var row = [];
			var rowDiv = [];
			for(var j = 0; j < 10; j++){
				var td = $('td.col' + j + '.' + 'row' + i);
				row.push(td);
				rowDiv.push(td.find('div'));
			}
			globalLampDoms.push(row);
			globalLampDivDoms.push(rowDiv);
		}
		var table = $('table.large.lamp');
		table.bind('touchmove', fastbrush);
		table.bind('touchstart', fastbrush);
		offset = table.offset();
		console.log(globalLampDoms);
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
		globalColor = g;
	};

	$scope.scroll = function(event){
		event.preventDefault();
		if(event.wheelDeltaY > 0 && $scope.gray > 0)  $scope.gray--;
		if(event.wheelDeltaY < 0 && $scope.gray < 15) $scope.gray++;
		color.setColor($scope.gray);
		globalColor = $scope.gray;
	};
}



