function Flag(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);

	this.lastPoint = 0;

	this.lastHeld = 0;
}

Flag.extends(Equipment);

Flag.prototype.pointsPerSecond = 1;

Flag.prototype.pickUpCooldown = 300;

Flag.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 24, 24, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
	body.pawn = this;
	return body;
};

Flag.prototype.tick = function(tickEvent) {
	Equipment.prototype.tick.apply(this, arguments);
	this.updateTexture();

	if(this.holder) {
		this.lastHeld = tickEvent.timestamp;
		if(this.game.gameType == 'Kill The Carrier') {
			if(tickEvent.timestamp - this.lastPoint > this.pointsPerSecond * 1000)
				this.score(tickEvent);
		}
		else
			this.holder.dropEquipment();
	}
};

Flag.prototype.score = function(tickEvent) {
	this.game.score(this.holder.team);
	this.lastPoint = tickEvent.timestamp;
};

Flag.prototype.canEquip = function() {
	return this.game.gameType == 'Kill The Carrier' && (this.game.timestamp - this.lastHeld) > this.pickUpCooldown;
};

Flag.prototype.updateTexture = function() {
	if(this.game.gameType == 'Kill The Carrier')
		this.body.render.sprite.texture = './img/flag-active.png';
	else
		this.body.render.sprite.texture = './img/flag-inactive.png';
};
