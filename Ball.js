function Ball(world, x, y) {
	console.log('YOU MADE A BALL');
	this._super.apply(this, arguments);
}

Ball.extends(Pawn);

Ball.prototype.createBody = function(x, y) {
	return Matter.Bodies.circle(x, y, 10);
}
