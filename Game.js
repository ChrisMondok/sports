function Game(domNode) {
	this.engine = this.createEngine(domNode);
	this.chooseAGame();
	this.players = [];
	this.gym = new Gymnasium(this);
}

var gameTypes = ['ultimateFlyingDisc', 'dodgeball'];

Game.prototype.createEngine = function(domNode) {
	var gameWidth = 1366;
	var gameHeight = 768;

	var gameDimensions =  {
		min: { x: 0, y: 0},
		max: { x: gameWidth, y: gameHeight }
	};

	var worldOptions = {
		bounds: {
		}
	};

	var engine = Matter.Engine.create(domNode, {
		world: {
			bounds: gameDimensions
		},
		render: {
			bounds: gameDimensions,
			options: {
				width: gameWidth,
				height: gameHeight
			}
		}
	});

	var canvas = engine.render.canvas;

	canvas.addEventListener('click', function() {
		canvas.mozRequestFullScreen();
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
			if(!this.players[i])
				this.players[i] = new Player(this);

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
	console.log("Now playing %s", this.gameType);
};

Game.prototype.getWorld = function() {
	return this.engine.world;
};
