function TennisNet(game, x, y) {
	Pawn.apply(this, arguments);
	Matter.World.add(game.getWorld(), this.createComposite());
}

TennisNet.extends(Pawn);

TennisNet.prototype.width = 20;
TennisNet.prototype.postRadius = 20;
TennisNet.prototype.netMargin = 80;

TennisNet.prototype.createComposite = function() {
	var composite = Matter.Composite.create();

	var groupId = Matter.Body.nextGroupId();

	var world = this.game.getWorld();
	var centerX = (world.bounds.max.x + world.bounds.min.x)/2;
	var centerY = (world.bounds.max.y + world.bounds.min.x)/2;

	var height = (world.bounds.max.y - world.bounds.min.y) - 2 * (this.game.gym.wallThickness + this.netMargin);


	var net = Matter.Bodies.rectangle(centerX, centerY, this.width, height, { isStatic: true, groupId: groupId });
	var topPost = Matter.Bodies.circle(centerX, centerY - height/2, this.postRadius, { isStatic: true, groupId: groupId });
	var bottomPost = Matter.Bodies.circle(centerX, centerY + height/2, this.postRadius, { isStatic: true, groupId: groupId });

	Matter.Composite.add(composite, net);
	Matter.Composite.add(composite, topPost);
	Matter.Composite.add(composite, bottomPost);

	composite.pawn = this;

	return composite;
};

TennisNet.prototype.tick = function() {
	return;
	if(this.game != 'Tennis')
		this.destroy()
};
