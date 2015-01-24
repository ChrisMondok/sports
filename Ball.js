function Ball(world, x, y) {
	this._super.apply(this, arguments);

	this.body = this.createBody(x, y);
	Matter.World.add(world, this.body);
}

Ball.extends(Pawn);

Ball.prototype.createBody = function(x, y) {
	return Matter.Bodies.circle(x, y, 10);
}
