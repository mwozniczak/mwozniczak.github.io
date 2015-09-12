// $(function() {
// 	var s = skrollr.init({forceHeight: false});
// });
// var app = angular.module('mwCV', ['angular.vertilize'])
// 				 .controller('CVController', CVController);

// function CVController() {
// 	var vm = this;
// };
domready(function() {
	var BG_WIDTH = 4000;
	var layerPos = [];

	var layerElement = document.getElementById('layers');
	layerElement.style.backgroundPosition = getComputedStyle(layerElement).getPropertyValue('background-position');
	layerCount = layerElement.style.backgroundPosition.split(',');
	for (var i in layerCount) {
		layerPos.push(i*2);
	}

	function moveLayers() {
		var positions = [];
		for (var i in layerPos) {
			layerPos[i] = (layerPos[i] + i*2) % BG_WIDTH;
			positions.push(layerPos[i] + 'px 0px');
		}
		layerElement.style.backgroundPosition = positions.join(',');
		console.log(layerElement.style.backgroundPosition);
	}
	//setInterval(moveLayers, 100);
});