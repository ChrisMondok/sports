function Pawn(game, x, y) {
	this.game = game;
}

Pawn.prototype.handleCollision = function(iDontKnowYet) {
};

Pawn.prototype.destroy = function() {
	if(this.body)
		Matter.World.remove(this.game.getWorld(), this.body);

	if(this.composite)
		Matter.World.remove(this.game.getWorld(), this.composite, true);
}

Pawn.prototype.tick = function(tickEvent) {
};
