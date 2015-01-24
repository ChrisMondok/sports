function Game(domNode) {
	this.engine = this.createEngine(domNode);
	this.chooseAGame();
	this.players = [];
	this.gym = new Gymnasium(this);

	this.scores = [{}, {}];

	gameTypes.forEach(function(gameType) {
		this.scores[0][gameType] = 0;
		this.scores[1][gameType] = 0;
	}, this);
}

Game.prototype.score = function(team) {
	console.info("Team %s got a point in %s", team, this.gameType);
	this.scores[team][this.gameType]++;
}

var gameTypes = ['Ultimate Flying Disc', 'Dodgeball'];

Game.prototype.createEngine = function(domNode) {
	var gameWidth = 1366;
	var gameHeight = 768;

	var gameDimensions =  {
		min: { x: 0, y: 0},
		max: { x: gameWidth, y: gameHeight }
	};

	var engine = Matter.Engine.create(domNode, {
		world: {
			bounds: gameDimensions
		},
		render: {
			bounds: gameDimensions,
			options: {
				width: gameWidth,
				height: gameHeight,
				showAngleIndicator: true
			}
		}
	});

	var canvas = engine.render.canvas;

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
	this.getWorld().bodies.forEach(function(body) {
		if(body.pawn)
			body.pawn.tick(tickEvent);
	});
	this.pollGamepads(tickEvent);
};

Game.prototype.pollGamepads = function(tickEvent) {
	var gamepads = navigator.getGamepads();
	
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i]) {
			if(!this.players[i]) {
				var player = this.players[i] = new Player(this);
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
	var i = Math.floor(Math.random() * gameTypes.length);
	this.gameType = gameTypes[i];
	var soundName = this.gameType.replace(/ /g,'').toLowerCase();
	this.playSound(soundName);
};

Game.prototype.getWorld = function() {
	return this.engine.world;
};

Game.prototype.playSound = function(sound) {
	var audio = document.querySelector('audio[data-sound='+sound+']');
	if(audio)
		audio.play();
}
