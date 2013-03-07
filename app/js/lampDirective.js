angular.module('lh.lampDirective', []).
	directive('lamp', ['$parse', 'color', function($parse, color){
		return {
			restrict	: 'E',
			replace		: true,
			transclude	: true,
			scope		: {
				data		: '=',
				editable	: '='
			},
			// templateUrl	: '/partials/lamp.html',
			link		: function(scope, elm, attrs){

				var buf = "<table class='large lamp'>";
				for(var i = 0; i < scope.data.length; i++){
					buf += "<tr>";
					for(var j = 0; j < scope.data[i].length; j++){
						buf += "<td class='row" + i + " col" + j + "'><div style='background-color: " + grayToHexColor(scope.data[i][j]) + "'></div></td>";
					}
					buf += "</tr>";
				}
				buf += "</table>";
				var dom = $(buf);
				elm.append(dom);

				// Assume the size of the array will never change
				scope.$watch(function(scp){
					console.time('serial');
					var str = JSON.stringify(scp.data);
					console.timeEnd('serial');
					return str;
				}, function(n, o){
					console.time('redrawParse');
					var oldVal = JSON.parse(o);
					var newVal = JSON.parse(n);
					console.timeEnd('redrawParse');
					console.time('redraw');
					for(var i = 0; i < scope.data.length; i++){
						for(var j = 0; j < oldVal[i].length; j++){
							if(oldVal[i][j] != newVal[i][j]){
								dot(j, i, newVal[i][j]);
							}
						}
					}
					console.timeEnd('redraw');
				});

				scope.$watch(attrs.editable, function(oldVal, newVal){
					console.log(oldVal, newVal);
				});

				dom.bind('click', brushMouse);
				dom.bind('mousemove', brushMouse);
				dom.bind('touchstart', brushTouch);
				dom.bind('touchmove', brushTouch);

				function brushMouse(event){
					event.preventDefault();
					if(event.which === 1){
						brush(event.pageX, event.pageY);
					}
				}

				function brushTouch(event){
					event.preventDefault();
					var touches = event.changedTouches;
					for (var i=0; i<touches.length; i++) {
						brush(touches[i].pageX, touches[i].pageY);
					}
				}

				function brush(px, py){
					var offset = dom.offset();
					var ex = px - offset.left;
					var ey = py - offset.top;
					var ix = Math.floor(ex / dom.width() * scope.data[0].length);
					var iy = Math.floor(ey / dom.height() * scope.data.length);
					if(ix >=0 && ix < scope.data.length && iy >=0 && iy < scope.data[ix].length){
						scope.$apply(scope.data[iy][ix] = color.getColor());
						//dot(ix, iy, color.getColor());
					}
				}

				function dot(x, y, g){
					var brushColor = grayToHexColor(g);
					dom.find('.row' + y + '.col' + x  + '>div')
						.css('background-color', brushColor);
				}
			}
		};
	}]);