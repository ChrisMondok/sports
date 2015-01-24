function Pawn(world, x, y) {
}

Pawn.prototype.createBody = function(x, y) {
	throw new Error("You need to override this");
}
