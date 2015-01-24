function Gymnasium(game) {
	Pawn.apply(this, arguments);
	this.walls = this.createWalls(game);
	this.goals = this.createGoals(game);
	this.sportItems = this.createSportItems(game);
}

Gymnasium.extends(Pawn);

Gymnasium.prototype.wallThickness = 25;

Gymnasium.prototype.goalWidth = 30;
Gymnasium.prototype.goalHeight = 150;
Gymnasium.prototype.goalBuffer = 65;

Gymnasium.prototype.totalDodgeBalls = 5;
Gymnasium.prototype.dodgeBallSize = 7;

Gymnasium.prototype.hockeyPuckSize = 5;
Gymnasium.prototype.tennisBallSize = 5;
Gymnasium.prototype.frisbeeSize = 7;

Gymnasium.prototype.createWalls = function(game) {
	var world = game.getWorld();

	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;

	var centerX = (world.bounds.max.x + world.bounds.min.x)/2;
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;

	return [
		new Wall(game, centerX, - 100 + this.wallThickness, gymWidth, 200), //top,
		new Wall(game, world.bounds.max.x + 100 - this.wallThickness, centerY, 200, gymHeight), //right
		new Wall(game, centerX, world.bounds.max.y + 100 - this.wallThickness, gymWidth, 200), //bottom,
		new Wall(game, - 100 + this.wallThickness, centerY, 200, gymHeight) //left
	];
};

Gymnasium.prototype.createGoals = function(game) {
	var world = game.getWorld();

	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;
	
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;
	
	return [
		new Wall(game, world.bounds.min.x + this.goalBuffer + this.wallThickness, centerY, this.goalWidth, this.goalHeight),  //left
		new Wall(game, world.bounds.max.x - this.goalBuffer - this.wallThickness, centerY, this.goalWidth, this.goalHeight)  //right
	];
};

Gymnasium.prototype.createSportItems = function(game) {
	var world = game.getWorld();

	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;

	var centerX = (world.bounds.max.x + world.bounds.min.x)/2;
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;
	
	//Dodgeballs
	for (ballCounter = 0; ballCounter < this.totalDodgeBalls; ballCounter++) {
		new Dodgeball(game, (world.bounds.min.x + this.wallThickness + Dodgeball.prototype.radius) * (ballCounter + 1), world.bounds.min.y + this.wallThickness);
	}
	
	//FlyingDisc
	new FlyingDisc(game, centerX, gymHeight - this.wallThickness - FlyingDisc.prototype.radius);
};
