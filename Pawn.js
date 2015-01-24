function Pawn(world, x, y) {
	this.body = this.createBody(x, y);
	Matter.World.add(world, this.body);
}

Pawn.prototype.createBody = function(x, y) {
	throw new Error("You need to override this");
}
