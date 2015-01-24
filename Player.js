function Player(game) {
	this._super.apply(this, arguments);

	this.body = this.createBody();

	Matter.World.add(game.getWorld(), this.body); 
}

Player.extends(Pawn);

Player.prototype.walkSpeed = 0.0015;

Player.prototype.xAxis = 0;
Player.prototype.yAxis = 1;

Player.prototype.deadZone = 0.2;

Player.prototype.createBody = function() {
	var x = 200;
	var y = 200;
	var body = Matter.Bodies.circle(x, y, 10, {frictionAir: 0.2});
	body.pawn = this;
	return body;
}

Player.prototype.handleInput = function(gamepad) {

	var joyX = gamepad.axes[this.xAxis];
	if(Math.abs(joyX) < this.deadZone)
		joyX = 0;

	var joyY = gamepad.axes[this.yAxis];
	if(Math.abs(joyY) < this.deadZone)
		joyY = 0;


	var x = joyX * this.walkSpeed;
	var y = joyY * this.walkSpeed;

	Matter.Body.applyForce(this.body, this.body.position, {x: x, y: y});
	if(x || y)
		Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(y, x));
};

Player.prototype.handleCollision = function() {
	console.log("Player collided with something");
}
