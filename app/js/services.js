'use strict';

/* Services */
/*global angular console*/


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
	value('version', '0.1').
	factory('frame', function(){
		var SIZE = 10;

		var frame = {};
		var i = 0;
		frame.newFrame = function(){
			var f = [];
			for(var i = 0; i < SIZE; i++){
				var ff = [];
				for(var j = 0; j < SIZE; j++){
					ff.push(0xFFFF00);
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
	});
