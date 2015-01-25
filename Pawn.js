function Pawn(game, x, y) {
	this.game = game;
}

Pawn.prototype.handleCollision = function(iDontKnowYet) {
};

Pawn.prototype.destroy = function() {
	if(this.body)
		Matter.World.remove(this.game.getWorld(), this.body);
}

Pawn.prototype.tick = function(tickEvent) {
};
