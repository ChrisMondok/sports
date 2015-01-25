<<<<<<< HEAD
function Ball(world, x, y, radius) {
	this._super.apply(this, arguments);

	this.body = this.createBody(x, y, radius);
	Matter.World.add(world, this.body);
=======
function Ball(game, x, y) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y);
	Matter.World.add(game.getWorld(), this.body);

	this.lastThrownBy = null;
>>>>>>> 0760c3c8a7ca43ea2fa279d04e28eb8e84a7d258
}

Ball.extends(Pawn);

<<<<<<< HEAD
Ball.prototype.createBody = function(x, y, radius) {
	return Matter.Bodies.circle(x, y, radius);
}
=======
Ball.prototype.canGrab = function() { return false; };

Ball.prototype.possessor = null;

Ball.prototype.destroy = function() {
	if(this.possessor)
		this.possessor.release();

	Pawn.prototype.destroy.apply(this, arguments);
};

Ball.prototype.tick = function() {
	Pawn.prototype.tick.apply(this, arguments);

	if(this.isOutOfWorld()) {
		var world = this.game.getWorld();

		var translation = {
			x: (world.bounds.max.x + world.bounds.min.x)/2 - this.body.position.x,
			y: (world.bounds.max.y + world.bounds.min.y)/2 - this.body.position.y
		}

		Matter.Body.translate(this.body, translation);
	}
};

Ball.prototype.isOutOfWorld = function() {
	return this.body.position.x < game.getWorld().bounds.min.x
		|| this.body.position.y < game.getWorld().bounds.min.y
		|| this.body.position.x > game.getWorld().bounds.max.x
		|| this.body.position.y > game.getWorld().bounds.max.y;
}

Ball.prototype.radius = 10;

Ball.prototype.bodyOptions = {};

Ball.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.circle(x, y, this.radius, this.bodyOptions);
	body.pawn = this;
	return body;
};
>>>>>>> 0760c3c8a7ca43ea2fa279d04e28eb8e84a7d258
