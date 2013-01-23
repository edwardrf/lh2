'use strict';

/* Filters */

function intToHexColor(input){
	var tmp = ("00000" + input.toString(16));
	tmp = tmp.substr(tmp.length - 6, 6);
	return "#" + tmp;	
}

function offsetColor(input, offset){
	var r = (input & 0xFF0000) >> 16;
	var g = (input & 0x00FF00) >> 8;
	var b = (input & 0x0000FF) >> 0;
	r = r * (0xFF - offset) / 0xFF + offset;
	g = g * (0xFF - offset) / 0xFF + offset;
	b = b * (0xFF - offset) / 0xFF + offset;
	var output = (r << 16) + (g << 8) + b;
	return output;
}

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).filter('color', function() {
  	return intToHexColor;
  }).filter('lampColor', function(){
  	return function(input){
  		return intToHexColor(offsetColor(input, 0x66));
  	};
  }).filter('shadowColor', function(){
  	return function(input){
  		return intToHexColor(offsetColor(input, 0x66) - 0x222222);
  	}
  });
