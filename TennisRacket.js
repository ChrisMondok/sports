function TennisRacket(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);
}

TennisRacket.extends(Equipment);

TennisRacket.prototype.swingRange = 50;
TennisRacket.prototype.swingForce = 0.1;

TennisRacket.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 20, 36, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
	body.pawn = this;
	return body;
};

TennisRacket.prototype.tick = function() {
	this.updateTexture();

	if(this.holder && this.game.gameType != 'Tennis')
		this.holder.dropEquipment();
}

TennisRacket.prototype.updateTexture = function() {
	if(this.game.gameType == 'Tennis')
		this.body.render.sprite.texture = './img/tennis-racket.png';
	else
		this.body.render.sprite.texture = './img/tennis-racket-inactive.png'; //todo: inactive
};

TennisRacket.prototype.canEquip = function() {
	return this.game.gameType == 'Tennis';
};

TennisRacket.prototype.canSwing = function() {
	return Boolean(this.holder); //TODO: cooldown
};

TennisRacket.prototype.swing = function(strength, direction) {
	var balls = this.game.getWorld().bodies.filter(function(body) {
		return body.pawn && body.pawn instanceof Ball;
	});

	var ballsInRange = balls.filter(function(ball) {
		var dx = ball.position.x - this.body.position.x;
		var dy = ball.position.x - this.body.position.y;

		return Math.sqrt(dx * dx + dy * dy) < this.swingRange;
	}, this);

	balls.forEach(function(ball) {
		var force = 
		Matter.Body.applyForce(ball, ball.position, force);
	});
};
