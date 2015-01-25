function Goal(game, x, y, team) {
	Pawn.apply(this, arguments);

	this.x = x;
	this.y = y;

	this.team = team;

	this.createWalls(x, y);
}

Goal.extends(Pawn);

Goal.prototype.thickness = 30;
Goal.prototype.width = 75;
Goal.prototype.height = 150

Goal.prototype.createWalls = function(x, y) {
	var back = new Wall(this.game, x, y, this.thickness, this.height);

	var xo = (this.width - this.thickness) / 2;

	if(this.team)
		xo *= -1;

	var left = new Wall(this.game, x + xo, y - this.height/2, this.width, this.thickness);
	var right = new Wall(this.game, x + xo, y + this.height/2, this.width, this.thickness);
};

Goal.prototype.tick = function(tickEvent) {
	Pawn.prototype.tick.apply(this, arguments);

	var xCenter = this.x;

	if(this.team)
		xCenter -= this.width/2;
	else
		xCenter += this.width/2;

	if(this.game.gameType == "Hockey") {
		game.getWorld().bodies
			.filter(function(b) { return b.pawn && b.pawn instanceof HockeyPuck; })
			.filter(function(puckBody) {
				return Math.abs(puckBody.position.x - xCenter) < (this.width - this.thickness) / 2 && Math.abs(puckBody.position.y - this.y) < this.height / 2;
			}, this)
			.forEach(function(puckBodyInGoal) {
				this.game.playSound("buzzer");
				puckBodyInGoal.pawn.reset();
				this.game.score(this.team ? 0 : 1);
			}, this);
	}
};
