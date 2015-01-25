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

	setTimeout(this.chooseAGame.bind(this), 1000);
};

Game.prototype.score = function(team) {
	console.info("Team %s got a point in %s", team, this.gameType);
	this.scores[team][this.gameType]++;

	this.updateScoreboard();
};

Game.prototype.updateScoreboard = function() {
	var str = "Blue: "+ this.getTotalScore(0).toFixed(2) + ", Red: "+ this.getTotalScore(1).toFixed(2);
	document.getElementById('scoreboard').innerHTML = str;
};

var gameTypes = ['Hockey', 'Ultimate Flying Disc', 'Dodgeball', 'Kill The Carrier'];

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

	canvas.addEventListener('click', function() {
		if (document.body.requestFullscreen) {
			document.body.requestFullscreen();
		} else if (document.body.msRequestFullscreen) {
			document.body.msRequestFullscreen();
		} else if (document.body.mozRequestFullScreen) {
			document.body.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) {
			document.body.webkitRequestFullscreen();
		}
	});

	engine.render.options.showAngleIndicator = true;

	engine.world.gravity.x = engine.world.gravity.y = 0;

	Matter.Engine.run(engine);

	Matter.Events.on(engine, 'collisionStart', this.onCollisionActive.bind(this));
	Matter.Events.on(engine, 'tick', this.onTick.bind(this));
	Matter.Events.on(engine, 'afterRender', this.afterRender.bind(this));

	return engine;
};

Game.prototype.getTotalScore = function(team) {
	var scores = this.scores[team];
	return scores["Kill The Carrier"]/30 + scores["Dodgeball"]/20 + scores["Hockey"] + scores["Ultimate Flying Disc"];
};

Game.prototype.onTick = function(tickEvent) {
	this.timestamp = tickEvent.timestamp;
	this.getWorld().bodies.forEach(function(body) {
		if(body.pawn)
			body.pawn.tick(tickEvent);
	});

	this.getWorld().composites.forEach(function(composite) {
		if(composite.pawn)
			composite.pawn.tick(tickEvent);
	});

	if(this.timestamp - this.lastGameChangedAt > this.attentionSpan)
		this.chooseAGame();

	this.gym.goals.forEach(function(g) {
		g.tick(tickEvent);
	});
};

Game.prototype.afterRender = function(renderEvent) {
	var context = this.engine.render.canvas.getContext("2d");
	for (playerCounter = 0; playerCounter < this.players.length; playerCounter++) {
		var player = this.players[playerCounter];
		if (player.gamepad.setupComplete()){
			var textColor = player.team ? "darkred" : "blue";

			context.font = "24px sans-serif";
			context.fillStyle = textColor;
			context.fillText(playerCounter,player.body.position.x,  player.body.position.y);
			context.textAlign = "center";
			context.textBaseline = "middle";
		}
	}
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

	document.getElementById('gametypeDisplay').innerHTML = this.gameType;
};

Game.prototype.getWorld = function() {
	return this.engine.world;
};

Game.prototype.playSound = function(sound) {
	var audio = document.querySelector('audio[data-sound='+sound+']');
	if(audio)
		audio.play();
}
