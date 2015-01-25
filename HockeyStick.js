function HockeyStick(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);
}

HockeyStick.extends(Equipment);

HockeyStick.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 24, 48, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
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
