function HockeyPuck(game, x, y) {
	Ball.apply(this, arguments);
};

HockeyPuck.extends(Ball);

HockeyPuck.prototype.radius = 11;

HockeyPuck.prototype.tick = function() {
	Ball.prototype.tick.apply(this, arguments);
	this.updateTexture();
};

HockeyPuck.prototype.canGrab = function() {
	return false;
};

HockeyPuck.prototype.bodyOptions = {density: 0.0005};

HockeyPuck.prototype.updateTexture = function() {
	if(this.game.gameType == 'Hockey')
		this.body.render.sprite.texture = './img/hockeypuck.png';
	else
		this.body.render.sprite.texture = './img/hockeypuck-inactive.png'; //TODO: inactive
};
