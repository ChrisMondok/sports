function TennisBall(game, x, y) {
	Ball.apply(this, arguments);

	this.z = 0;
};

TennisBall.extends(Ball);

TennisBall.prototype.radius = 11;

TennisBall.prototype.tick = function() {
	Ball.prototype.tick.apply(this, arguments);
	this.updateTexture();
};

TennisBall.prototype.canGrab = function() {
	return false;
};

TennisBall.prototype.bodyOptions = {density: 0.0005};

TennisBall.prototype.updateTexture = function() {
	if(this.game.gameType == 'Tennis' || this.game.gameType == 'Bonus')
		this.body.render.sprite.texture = './img/tennis-ball.png';
	else
		this.body.render.sprite.texture = './img/tennis-ball-inactive.png'; //TODO: inactive
};
