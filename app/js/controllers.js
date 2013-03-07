/*global io*/
/*global console*/
/*global $*/

'use strict';

/* Controllers */

function EditorCtrl($scope, frame, color, $rootScope){
	$scope.lamps = frame.newFrame();
	$scope.message = "No message";
	$scope.editable = true;

	var st = 0;
	var at = 0;

	$scope.run = function(){
		$scope.lamps[0][0] = 0;
	};

	$scope.stop = function(){
		$scope.editable=false;
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
		if(event.originalEvent.wheelDeltaY > 0 && $scope.gray > 0)  $scope.gray--;
		if(event.originalEvent.wheelDeltaY < 0 && $scope.gray < 15) $scope.gray++;
		color.setColor($scope.gray);
	};
}



