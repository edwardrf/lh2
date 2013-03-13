/*global io*/
/*global console*/
/*global $*/

'use strict';

/* Controllers */

function EditorCtrl($scope, frame, animation){
	$scope.animation = animation;
	console.log(animation);
	$scope.message = "No message";
	$scope.editable = true;
	$scope.isPlaying = false;

	var timerHandle = null;
	var frameCounter = 0;
	var totalFrames = 0;
	var playingFrame = frame.newFrame();
	var startPlayTime = 0;

	$scope.moveUp = function(){
		var f = animation.getCurrentFrame();
		var top = $.extend([], f.frame[0]);
		for(var i = 0; i < f.frame.length - 1; i++){
			for(var j = 0; j < f.frame[i].length; j++){
				f.frame[i][j] = f.frame[i + 1][j];
			}
		}
		for(var j = 0; j < f.frame[0].length; j++){
			f.frame[f.frame.length - 1][j] = top[j];
		}
	};

	$scope.moveDown = function(){
		var f = animation.getCurrentFrame();
		var bottom = $.extend([], f.frame[f.frame.length - 1]);
		for(var i = f.frame.length - 1; i > 0 ; i --){
			for(var j = 0; j < f.frame[i].length; j++){
				var b = i - 1 < 0 ? f.frame.length -1 : i - 1;
				f.frame[i][j] = f.frame[b][j];
			}
		}
		for(var j = 0; j < f.frame[0].length; j++){
			f.frame[0][j] = bottom[j];
		}
	};

	$scope.moveRight = function(){
		var f = animation.getCurrentFrame();
		for(var i = 0; i < f.frame.length; i++){
			var j;
			var last = f.frame[i][f.frame[i].length - 1];
			for(j = f.frame[i].length - 1; j > 0 ; j--){
				f.frame[i][j] = f.frame[i][j - 1];
			}
			f.frame[i][0] = last;
		}
	};

	$scope.moveLeft = function(){
		var f = animation.getCurrentFrame();
		for(var i = 0; i < f.frame.length; i++){
			var j;
			var first = f.frame[i][0];
			for(j = 0; j < f.frame[i].length - 1; j++){
				f.frame[i][j] = f.frame[i][j + 1];
			}
			f.frame[i][j] = first;
		}
	};

	$scope.run = function(){
		if($scope.isPlaying){
			console.log("Is already playing");
			return;
		}else {
			$scope.isPlaying = true;
		}
		// Point the animation to the local virtual animation where calculation is done.
		var playingAnimation = {
			getCurrentFrame : function(){return {frame: playingFrame};}
		};
		$scope.animation = playingAnimation;
		frameCounter = 0;
		totalFrames = 0;
		for(var i = 0; i < animation.getKeyFrames().length; i++){
			totalFrames += animation.getKeyFrames()[i].time;
		}
		startPlayTime = (new Date()).getTime();
		timerHandle = setInterval(playOneFrame, 10);
	};

	$scope.stop = function(){
		clearInterval(timerHandle);
		$scope.animation = animation;
		$scope.isPlaying = false;
	};

	function playOneFrame(){
		var kfp = 0;
		var sfp = frameCounter;
		var t = (new Date()).getTime() - startPlayTime;
		frameCounter = Math.floor(t / 10) % totalFrames;
		var keyFrames = animation.getKeyFrames();
		while(sfp > keyFrames[kfp].time){
			if(++kfp >= keyFrames.length){frameCounter = 0; sfp = 0;kfp = 0;}
			sfp -= keyFrames[kfp].time;
		}
		var nfp = kfp + 1 >= keyFrames.length ? 0 : kfp + 1;
		for(var i = 0; i < keyFrames[kfp].frame.length; i++){
			for(var j = 0; j < keyFrames[kfp].frame[i].length; j++){
				var a = keyFrames[kfp].frame[i][j];
				var b = keyFrames[nfp].frame[i][j];
				var c = Math.round(a + (b - a) / keyFrames[kfp].time * sfp);
				playingFrame[i][j] = c;
			}
		}
		$scope.$apply();
	}

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
		var e = event.originalEvent || event;
		if(e.wheelDeltaY > 0 && $scope.gray > 0)  $scope.gray--;
		if(e.wheelDeltaY < 0 && $scope.gray < 15) $scope.gray++;
		color.setColor($scope.gray);
	};
}

function TimelineCtrl($scope, animation){
	$scope.animation = animation;

	$scope.addFrameBefore = function(frame){
		var frames = animation.getKeyFrames();
		var newFrame = $.extend(true, {}, frame);
		var index = frames.indexOf(frame);
		frames.splice(index, 0, newFrame);
	};

	$scope.addFrameAfter = function(frame){
		var frames = animation.getKeyFrames();
		var newFrame = $.extend(true, {}, frame);
		var index = frames.indexOf(frame);
		frames.splice(index + 1, 0, newFrame);
		animation.setCurrentFrame(index + 1);
	};

	$scope.remove = function(frame){
		var frames = animation.getKeyFrames();
		var index = frames.indexOf(frame);
		frames.splice(index, 1);
	};

	$scope.select = function(frame){
		var index = animation.getKeyFrames().indexOf(frame);
		animation.setCurrentFrame(index);
	};
}

