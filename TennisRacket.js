function TennisRacket(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);
}

TennisRacket.extends(Equipment);

TennisRacket.prototype.swingRange = 100;
TennisRacket.prototype.swingForce = 0.02;

TennisRacket.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 20, 36, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
	body.pawn = this;
	return body;
};

TennisRacket.prototype.tick = function() {
	this.updateTexture();

	if(this.holder && (this.game.gameType != 'Tennis' && this.game.gameType != 'Bonus'))
		this.holder.dropEquipment();
}

TennisRacket.prototype.updateTexture = function() {
	if(this.game.gameType == 'Tennis' || this.game.gameType == 'Bonus')
		this.body.render.sprite.texture = './img/tennis-racket.png';
	else
		this.body.render.sprite.texture = './img/tennis-racket-inactive.png'; //todo: inactive
};

TennisRacket.prototype.canEquip = function() {
	return this.game.gameType == 'Tennis' || this.game.gameType == 'Bonus';
};

TennisRacket.prototype.canSwing = function() {
	return Boolean(this.holder); //TODO: cooldown
};

TennisRacket.prototype.swing = function(strength, direction) {
	var bodiesInRange = this.game.getWorld().bodies.filter(function(body) {
		var dx = body.position.x - this.body.position.x;
		var dy = body.position.y - this.body.position.y;

		var dist = Math.sqrt(dx * dx + dy * dy);
		return dist < this.swingRange;
	}, this);

	bodiesInRange.forEach(function(ball) {
		var force = {
			x: strength * this.swingForce * Math.cos(direction),
			y: strength * this.swingForce * Math.sin(direction)
		};
		
		Matter.Body.applyForce(ball, ball.position, force);
	}, this);
};
