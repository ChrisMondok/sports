function Dodgeball() {
	Ball.apply(this, arguments);
};

Dodgeball.extends(Ball);

Dodgeball.prototype.hitMinSpeed = 5;

Dodgeball.prototype.bodyOptions = {restitution: 0.2, friction: 1, render: { sprite: { texture: './img/dodgeball-active.png' }}};

Dodgeball.prototype.canGrab = function() {
	return (this.game.gameType == 'Dodgeball' || this.game.gameType == 'Bonus') && this.possessor == null && this.body.speed < 5;
};

Dodgeball.prototype.tick = function() {
	Ball.prototype.tick.apply(this, arguments);
	if(this.game.gameType == 'Dodgeball' || this.game.gameType == 'Bonus')
		this.body.render.sprite.texture = this.body.speed < this.hitMinSpeed ? './img/dodgeball-active.png' : './img/dodgeball-thrown.png';
	else
		this.body.render.sprite.texture = './img/dodgeball-inactive.png';
};


Dodgeball.prototype.handleCollision = function(otherThing) {
	if(otherThing instanceof Player)
		this.hitPlayer(otherThing);
};

Dodgeball.prototype.hitPlayer = function(player) {

	if(this.game.gameType != 'Dodgeball' && this.game.gameType != 'Bonus')
		return;
	
	if(this.canGrab())
		return;

	if(this.lastThrownBy && this.lastThrownBy.team != player.team) {
		player.dropEquipment();
		this.game.playSound('dodgeball-score');
		this.game.score(this.lastThrownBy.team, 1/20);
	}
};
