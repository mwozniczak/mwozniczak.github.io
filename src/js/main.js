window.onload = function() {
	var canvas = document.getElementById('topBG');
	var backgroundedDiv = document.getElementById('topContent')

	function resize() {
		canvas.width = backgroundedDiv.scrollWidth;
		canvas.height = backgroundedDiv.scrollHeight;
	}

	window.addEventListener('resize', resize, false);
	resize();

	var context = canvas.getContext('2d');
	Image.prototype.opacity = 1.0;

	var images = {
		order: ['xl', 'l', 'm', 's'],
		maxCounts: {
			xl: 3,
			l: 5,
			m: 12,
			s: 9
		},

		items: {},

		loaded: 0,
		total: 0
	};

	var placements = {
		xl: [],
		l: [],
		m: [],
		s: []
	};

	for (var i in images.order) {
		var size = images.order[i];
		for (var j = 1; j <= 4; j++) {
			images.total++;
			if (images.items[size] === undefined) {
				images.items[size] = [];
			}
			var img = new Image();
			img.src = "assets/" + size + "-" + j + ".png";
			img.onload = function() {
				images.loaded++;
			}
			images.items[size].push(img);
		}
	}

	function makeImg(size, respawned) {

		var instance = {
			img: chance.pick(images.items[size]),
			placementX: 0,
			placementY: 0,
			speed: 0
		};

		var respawned = !!respawned;

		var chanceX = { min: 0, max: canvas.width + instance.img.width };
		
		if (respawned) {
			chanceX.min = canvas.width;
		}

		var chanceY = {
			min: -parseInt(instance.img.height * 0.75),
			max: canvas.height + parseInt(instance.img.height * 0.75)
		}
		instance.placementX = chance.integer(chanceX);
		instance.placementY = chance.integer(chanceY);

		instance.speed = chance.integer({min: 1, max: images.order.length});

		return instance;
	}

	function positionImgs(respawned) {
		var respawned = !!respawned;
		for (var i in images.order) {
			var size = images.order[i];
			while (placements[size].length < images.maxCounts[size]) {
				toPlace = makeImg(size, respawned);
				placements[size].push(toPlace);
			}
		}
	}

	function shouldFadeout(imgObj) {
		return imgObj.placementX < (-imgObj.img.width-imgObj.speed);
	}

	function draw_UpdateImgs() {
		for (var idx in images.order) {
			var size = images.order[idx];
			for (var i in placements[size]) {
				var imgObj = placements[size][i];
				context.drawImage(imgObj.img, imgObj.placementX, imgObj.placementY);
				imgObj.placementX = imgObj.placementX - imgObj.speed;
				if (shouldFadeout(imgObj)) {
					placements[size][i] = makeImg(size, true);
				}
			}
		}
	}

	var baseBG = context.createLinearGradient(0, 0, canvas.width, canvas.height);
	baseBG.addColorStop(0, '#063a77');
	baseBG.addColorStop(1, '#a5c300');
	context.fillStyle = baseBG;

	positionImgs();

	function draw() {
		window.requestAnimationFrame(draw);
		context.globalCompositeOperation = "source-over";
		context.fillStyle = baseBG;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.globalCompositeOperation = "hard-light";
		draw_UpdateImgs();
	}
	window.requestAnimationFrame(draw);
};