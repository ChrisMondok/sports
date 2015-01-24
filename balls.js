function Ball(game, x, y) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y);
	Matter.World.add(game.getWorld(), this.body);

	this.lastThrownBy = null;
}

Ball.extends(Pawn);

Ball.prototype.canGrab = function() { return false; };

Ball.prototype.possessor = null;

Ball.prototype.radius = 10;

Ball.prototype.bodyOptions = {};

Ball.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.circle(x, y, this.radius, this.bodyOptions);
	body.pawn = this;
	return body;
};

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
};
