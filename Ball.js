function Ball(game, x, y, radius) {
	this._super.apply(this, arguments);

	this.body = this.createBody(x, y, radius);
	Matter.World.add(game.getWorld(), this.body);
}

Ball.extends(Pawn);

Ball.prototype.createBody = function(x, y, radius) {
	var body = Matter.Bodies.circle(x, y, radius);
	body.pawn = this;
	return body;
}
