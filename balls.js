function Ball(game, x, y, radius) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y, radius);
	Matter.World.add(game.getWorld(), this.body);
}

Ball.extends(Pawn);

Ball.prototype.createBody = function(x, y, radius) {
	var body = Matter.Bodies.circle(x, y, radius);
	body.pawn = this;
	return body;
}

function FlyingDisc() {
	Ball.apply(this, arguments);
}

FlyingDisc.extends(Ball);

function Dodgeball() {
	Ball.apply(this, arguments);
}

Dodgeball.extends(Ball);
