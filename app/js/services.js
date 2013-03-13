'use strict';

/* Services */
/*global angular*/
/*global console*/


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('lh.services', []).
	value('version', '0.1').
	factory('frame', function(){
		var SIZE = 8;

		var frame = {};
		var i = 0;
		frame.newFrame = function(){
			var f = [];
			for(var i = 0; i < SIZE; i++){
				var ff = [];
				for(var j = 0; j < SIZE; j++){
					ff.push(15);
				}
				f.push(ff);
			}
			return f;
		};
		frame.clone = function(frm) {
			var copy = [];
			for(var i = 0; i < SIZE; i++){
				copy.push(frm[i].slice(0));
			}
			return copy;
		};
		frame.step = function(frm){
			console.log(i);
			for(var j = 0; j < SIZE; j++){
				for(var k = 0; k < SIZE; k++){
					frm[j][k] = i;
				}
			}
			i++;
			if(i > 0xFFFFFF) i = 0;
		};
		return frame;
	}).factory('color', function(){
		var color = {currentColor: 0};
		color.setColor = function(c){this.currentColor = c;};
		color.getColor = function(){return this.currentColor;};
		return color;
	}).factory('animation', function(frame){
		var animation = {keyFrames : [{frame: frame.newFrame(), time:30}], currentFrame : 0};
		animation.setKeyFrames = function(kf){this.keyFrames = kf;};
		animation.getKeyFrames = function(){return this.keyFrames;};
		animation.setCurrentFrame = function(i){
			console.log('setting current ' + i);
			this.currentFrame = i;
		};
		animation.getCurrentFrame = function(){
			if(this.currentFrame > this.keyFrames.length) this.currentFrame = this.keyFrames.length - 1;
			return this.keyFrames[this.currentFrame];
		};
		return animation;
	});
