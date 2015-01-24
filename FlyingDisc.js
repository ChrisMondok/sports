function FlyingDisc() {
	Ball.apply(this, arguments);
};

FlyingDisc.extends(Ball);

FlyingDisc.prototype.bodyOptions = {restitution: 0};

FlyingDisc.prototype.canGrab = function() {
	return this.game.gameType == 'Ultimate Flying Disc' && !this.possessor;
};

FlyingDisc.prototype.tick = function(tickEvent) {
	this.body.frictionAir = (this.body.speed > 5 ? 0.005 : 0.1);

	if(this.game.gameType == 'Ultimate Flying Disc' && this.possessor) {
		var endZone = this.game.gym.getEndZone(this);
		if(endZone !== null && endZone !== this.possessor.team) {
			this.game.score(this.possessor.team);
			this.reset();
		}
	}
};

FlyingDisc.prototype.reset = function() {
	this.game.gym.createFlyingDisc();
	this.destroy();
}
