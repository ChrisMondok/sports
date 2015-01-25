function TennisRacket(game, x, y) {
	Equipment.apply(this, arguments);

	this.body = this.createBody(x, y);

	Matter.World.add(this.game.getWorld(), this.body);
}

TennisRacket.extends(Equipment);

TennisRacket.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.rectangle(x, y, 20, 36, { frictionAir: 0.5, angle: Math.random() * 2 * Math.PI });
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
		this.body.render.sprite.texture = './img/tennis-racket.png'; //todo: inactive
};

TennisRacket.prototype.canEquip = function() {
	return this.game.gameType == 'Tennis';
};
