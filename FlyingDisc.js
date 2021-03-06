function FlyingDisc() {
	Ball.apply(this, arguments);
};

FlyingDisc.extends(Ball);

FlyingDisc.prototype.bodyOptions = {restitution: 0};

FlyingDisc.prototype.landedSpeed = 5;

FlyingDisc.prototype.canGrab = function() {
	return (this.game.gameType == 'Ultimate Flying Disc' || this.game.gameType == 'Bonus') && !this.possessor;
};

FlyingDisc.prototype.tick = function(tickEvent) {
	Ball.prototype.tick.apply(this, arguments);

	this.body.frictionAir = (this.body.speed > this.landedSpeed ? 0.005 : 0.1);

	if((this.game.gameType == 'Ultimate Flying Disc' || this.game.gameType == 'Bonus') && this.possessor) {
		var endZone = this.game.gym.getEndZone(this);
		if(endZone !== null && endZone !== this.possessor.team) {
			this.game.score(this.possessor.team, 1);
			this.game.playSound('cheer-short');
			this.reset();
		}
	}

	this.updateTexture();
};

FlyingDisc.prototype.updateTexture = function() {
	if(this.game.gameType == 'Ultimate Flying Disc' || this.game.gameType == 'Bonus')
		this.body.render.sprite.texture = this.body.speed < this.landedSpeed ? './img/flyingdisc-active.png' : './img/flyingdisc-thrown.png';
	else
		this.body.render.sprite.texture = './img/flyingdisc-inactive.png';
};

FlyingDisc.prototype.reset = function() {
	this.game.gym.createFlyingDisc();
	this.destroy();
}
