function Game(domNode) {
	this.engine = this.createEngine(domNode);
	this.players = [];
	this.gym = new Gymnasium(this);

	this.gym.createSportsObjects();

	this.scores = [{}, {}];

	gameTypes.forEach(function(gameType) {
		this.scores[0][gameType] = 0;
		this.scores[1][gameType] = 0;
	}, this);
};

Game.prototype.score = function(team) {
	console.info("Team %s got a point in %s", team, this.gameType);
	this.scores[team][this.gameType]++;
};

var gameTypes = ['Ultimate Flying Disc', 'Dodgeball'];

Game.prototype.attentionSpan = 25 * 1000;

Game.prototype.createEngine = function(domNode) {
	var gameWidth = 1366;
	var gameHeight = 768;

	var gameDimensions =  {
		min: { x: 0, y: 0},
		max: { x: gameWidth, y: gameHeight }
	};

	var engine = Matter.Engine.create(domNode, {
		world: { bounds: gameDimensions },
		render: {
			bounds: gameDimensions,
			options: {
				wireframes: false,
				width: gameWidth,
				height: gameHeight,
				showAngleIndicator: true
			}
		}
	});

	var canvas = engine.render.canvas;

	Matter.Render.setBackground(engine.render, "url(img/gymnasium.png)");

	//NOTE: this is gross.
	setTimeout(function() {
		canvas.style.backgroundImage = "url(img/gymnasium.png)";
		canvas.style.backgroundSize = gameWidth+"px "+gameHeight+"px";
	});

	window.c = canvas;

	canvas.addEventListener('click', function() {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		} else if (canvas.msRequestFullscreen) {
			canvas.msRequestFullscreen();
		} else if (canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	});

	engine.render.options.showAngleIndicator = true;

	engine.world.gravity.x = engine.world.gravity.y = 0;

	Matter.Engine.run(engine);

	Matter.Events.on(engine, 'collisionStart', this.onCollisionActive.bind(this));

	Matter.Events.on(engine, 'tick', this.onTick.bind(this));

	return engine;
};

Game.prototype.onTick = function(tickEvent) {
	this.timestamp = tickEvent.timestamp;
	this.getWorld().bodies.forEach(function(body) {
		if(body.pawn)
			body.pawn.tick(tickEvent);
	});
	this.pollGamepads(tickEvent);

	if(!this.gameType || (this.timestamp - this.lastGameChangedAt > this.attentionSpan))
		this.chooseAGame();
};

Game.prototype.pollGamepads = function(tickEvent) {
	var gamepads = navigator.getGamepads();
	
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i]) {
			if(!this.players[i]) {
				var team = i % 2;
				var x = this.getWorld().bounds.max.x / 4 + team * this.getWorld().bounds.max.x / 2;
				var player = this.players[i] = new Player(this, x, 300);
				player.team = i % 2;
			}

			this.players[i].handleInput(gamepads[i], tickEvent);
		}
	}
};

Game.prototype.onCollisionActive = function(collisionEvent) {
	collisionEvent.pairs.filter(function(pair) {
		return pair.bodyA.pawn && pair.bodyB.pawn;
	}).forEach(function(pair) {
		pair.bodyA.pawn.handleCollision(pair.bodyB.pawn);
		pair.bodyB.pawn.handleCollision(pair.bodyA.pawn);
	});
};

Game.prototype.chooseAGame = function() {
	this.lastGameChangedAt = this.timestamp;

	var i = Math.floor(Math.random() * gameTypes.length);

	if(this.gameType)
		this.playSound('whistle');

	this.gameType = gameTypes[i];

	var soundName = this.gameType.replace(/ /g,'').toLowerCase();

	setTimeout(this.playSound.bind(this, soundName), 1000);
};

Game.prototype.getWorld = function() {
	return this.engine.world;
};

Game.prototype.playSound = function(sound) {
	var audio = document.querySelector('audio[data-sound='+sound+']');
	if(audio)
		audio.play();
}
