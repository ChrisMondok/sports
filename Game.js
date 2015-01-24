function Game(domNode) {
	this.engine = this.createEngine(domNode);
	this.gameType =	this.chooseAGame();
	this.players = [];
	this.gym = new Gymnasium(this.engine.world);
}

var gameTypes = ['ultimateFlyingDisc', 'dodgeball'];

Game.prototype.createEngine = function(domNode) {
	var engine = Matter.Engine.create(domNode);

	engine.world.gravity.x = engine.world.gravity.y = 0;

	Matter.Engine.run(engine);

	Matter.Events.on(engine, 'collisionActive', this.onCollisionActive.bind(this));

	Matter.Events.on(engine, 'tick', this.onTick.bind(this));

	return engine;
};

Game.prototype.onTick = function(tickEvent) {
	this.pollGamepads();
};

Game.prototype.pollGamepads = function() {
	var gamepads = navigator.getGamepads();
	
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i]) {
			if(!this.players[i])
				this.players[i] = new Player(this.engine.world);

			this.players[i].handleInput(gamepads[i]);
		}
	}
};

Game.prototype.onCollisionActive = function(collisionEvent) {
	collisionEvent.pairs.forEach(function(pair) {
		if(pair.bodyA.pawn && pair.bodyB.pawn) {
			pair.bodyA.pawn.handleCollision(pair.bodyB.pawn);
			pair.bodyB.pawn.handleCollision(pair.bodyA.pawn);
		}
	});
};

Game.prototype.chooseAGame = function() {
	var i = Math.floor(Math.random() * gameTypes.length);
	return gameTypes[i];
};
