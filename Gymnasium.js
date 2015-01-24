function Gymnasium(world) {
	this._super.apply(this, arguments);
	this.walls = this.createWalls(world);
	this.goals = this.createGoals(world);
	this.sportItems = this.createSportItems(world);
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

Gymnasium.prototype.createWalls = function(world) {
	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;

	var centerX = (world.bounds.max.x + world.bounds.min.x)/2;
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;

	return [
		new Wall(world, centerX, this.wallThickness/2, gymWidth, this.wallThickness), //top,
		new Wall(world, world.bounds.max.x - this.wallThickness/2, centerY, this.wallThickness, gymHeight), //right
		new Wall(world, centerX, world.bounds.max.y - this.wallThickness/2, gymWidth, this.wallThickness), //bottom,
		new Wall(world, this.wallThickness/2, centerY, this.wallThickness, gymHeight) //left
	];
};

Gymnasium.prototype.createGoals = function(world) {
	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;
	
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;
	
	return [
		new Wall(world, world.bounds.min.x + this.goalBuffer + this.wallThickness, centerY, this.goalWidth, this.goalHeight),  //left
		new Wall(world, world.bounds.max.x - this.goalBuffer - this.wallThickness, centerY, this.goalWidth, this.goalHeight)  //right
	];
};

Gymnasium.prototype.createSportItems = function(world) {
	var gymWidth = world.bounds.max.x - world.bounds.min.x;
	var gymHeight = world.bounds.max.y - world.bounds.min.y;

	var centerX = (world.bounds.max.x + world.bounds.min.x)/2;
	var centerY = (world.bounds.max.y + world.bounds.min.y)/2;
	
	//Dodgeballs
	for (ballCounter = 0; ballCounter < this.totalDodgeBalls; ballCounter++) {
		new Ball(world, (world.bounds.min.x + this.wallThickness + this.dodgeBallSize) * (ballCounter + 1), world.bounds.min.y + this.wallThickness, this.dodgeBallSize);
	}
	
	//Frisbee
	new Ball(world, centerX, gymHeight - this.wallThickness - this.frisbeeSize, this.frisbeeSize);
};