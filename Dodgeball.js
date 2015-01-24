function Dodgeball() {
	Ball.apply(this, arguments);
};

Dodgeball.extends(Ball);

Dodgeball.prototype.bodyOptions = {restitution: 0.2, friction: 1};

Dodgeball.prototype.tick = function() {
}

Dodgeball.prototype.canGrab = function() {
	return this.game.gameType == 'Dodgeball' && this.possessor == null && this.body.speed < 5;
};


Dodgeball.prototype.handleCollision = function(otherThing) {
	if(otherThing instanceof Player)
		this.hitPlayer(otherThing);
};

Dodgeball.prototype.hitPlayer = function(player) {
	if(this.game.gameType != 'Dodgeball')
		return;
	
	if(this.canGrab())
		return;

	if(this.lastThrownBy && this.lastThrownBy.team != player.team)
		this.game.score(this.lastThrownBy.team);
};
