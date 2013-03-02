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
	var lastApplyTime = 0;

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
			var touches = e.changedTouches;
			for(var i=0; i<touches.length; i++) {
				var aa = Math.floor((touches[i].pageX - offset.left) / 50);
				var bb = Math.floor((touches[i].pageY - offset.top) / 50);
				console.log('touchmove', bb, aa);
				if(aa >=0 && aa < 10 && bb >= 0 && bb < 10){
					$scope.lamps[bb][aa] = g;
				}
			}
			if(lastApplyTime == 0){
				lastApplyTime = (new Date()).getTime();
			}
			if((new Date()).getTime() - lastApplyTime > 500){
				$scope.$apply();
				console.log((new Date()).getTime());
			}
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



