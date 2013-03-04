'use strict';

/*global angular*/
/*global console*/
/* Filters */

var gc = 0;

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

function grayToHexColor(gray) {
  var intval = gray * 16 * 256 * 256 + gray * 16 * 256;
  console.log('calculate gray : ' + gc++ + '\tgray :' + gray);
  return intToHexColor(offsetColor(intval, 0x66));
}

function grayToShadowColor (gray) {
  var intval = gray * 16 * 256 * 256 + gray * 16 * 256;
  return intToHexColor(offsetColor(intval, 0x66) - 0x222200);
}

angular.module('lh.filters', []).
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
    };
  }).filter('grayToHexColor', function(){
    return grayToHexColor;
  }).filter('grayToShadowColor', function(){
    return grayToShadowColor;
  });
