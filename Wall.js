function Wall(world, x, y, width, height) {
	this._super.apply(this, arguments);

	this.body = this.createBody(x, y, width, height);
	Matter.World.add(world, this.body);

	console.log("You created a wall at %s %s, with dims %s, %s", x, y, width, height);
}

Wall.extends(Pawn);

Wall.prototype.createBody = function(x, y, width, height) {
	var body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
	return body;
}
