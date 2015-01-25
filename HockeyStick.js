function HockeyStick(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);
}

HockeyStick.extends(Equipment);

HockeyStick.prototype.swingRange = 100;
HockeyStick.prototype.swingForce = 0.02;

HockeyStick.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 20, 36, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
	body.pawn = this;
	return body;
};

HockeyStick.prototype.tick = function() {
	this.updateTexture();

	if(this.holder && this.game.gameType != 'Hockey')
		this.holder.dropEquipment();
}

HockeyStick.prototype.updateTexture = function() {
	if(this.game.gameType == 'Hockey')
		this.body.render.sprite.texture = './img/hockey-stick.png';
	else
		this.body.render.sprite.texture = './img/hockey-stick-inactive.png'; //todo: inactive
};

HockeyStick.prototype.canEquip = function() {
	return this.game.gameType == 'Hockey';
};

HockeyStick.prototype.canSwing = function() {
	return Boolean(this.holder); //TODO: cooldown
};

HockeyStick.prototype.swing = function(strength, direction) {
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
