function Gymnasium(world) {
	this._super.apply(this, arguments);
	this.walls = this.createWalls(world);
}

Gymnasium.extends(Pawn);

Gymnasium.prototype.wallThickness = 40;

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
