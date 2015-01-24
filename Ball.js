function Ball(game, x, y) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y);
	Matter.World.add(game.getWorld(), this.body);

	this.lastThrownBy = null;
}

Ball.extends(Pawn);

Ball.prototype.canGrab = function() { return false; };

Ball.prototype.possessor = null;

Ball.prototype.destroy = function() {
	if(this.possessor)
		this.possessor.release();

	Pawn.prototype.destroy.apply(this, arguments);
}

Ball.prototype.radius = 10;

Ball.prototype.bodyOptions = {};

Ball.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.circle(x, y, this.radius, this.bodyOptions);
	body.pawn = this;
	return body;
};
