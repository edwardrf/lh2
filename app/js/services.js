'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
	value('version', '0.1').
	factory('frame', function(){
	  	var frame = {};
	  	var i = 0;
	  	frame.newFrame = function(){
		  	return [
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000],
				[0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000,0xFF0000]
			];
		};
		frame.clone = function(frm) {
			var copy = [];
			for(var i = 0; i < 8; i++){
				copy.push(frm[i].slice(0));
			}
			return copy;
		};
		frame.step = function(frm){
			console.log(i);
			for(var j = 0; j < 10; j++){
				for(var k = 0; k < 10; k++){
					frm[j][k] = i;
				}
			}
			i++;
			if(i > 0xFFFFFF) i = 0;
		};
		return frame;
	});
