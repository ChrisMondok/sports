function Pawn(game, x, y) {
	this.game = game;
}

Pawn.prototype.handleCollision = function(iDontKnowYet) {
};

Pawn.prototype.destroy = function() {
	if(this.body)
		this.game.getWorld().remove(this.body);
}
