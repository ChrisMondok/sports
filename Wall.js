function Wall(game, x, y, width, height) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y, width, height);
	Matter.World.add(game.getWorld(), this.body);
}

Wall.extends(Pawn);

Wall.prototype.createBody = function(x, y, width, height) {
	var body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
	return body;
}
