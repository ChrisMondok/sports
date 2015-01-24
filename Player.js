function Player(game) {
	Pawn.apply(this, arguments);

	this.body = this.createBody();

	Matter.World.add(game.getWorld(), this.body); 
}

Player.extends(Pawn);

Player.prototype.walkSpeed = 0.0015;

Player.prototype.xAxis = 0;
Player.prototype.yAxis = 1;

Player.prototype.deadZone = 0.2;

Player.prototype.possession = null;

Player.prototype.radius = 10;

Player.prototype.throwForce = 0.005;

Player.prototype.createBody = function() {
	var x = 200;
	var y = 200;
	var body = Matter.Bodies.circle(x, y, this.radius, {frictionAir: 0.2});
	body.pawn = this;
	return body;
}

Player.prototype.setCollisionGroup = function(collisionGroupId) {
	this.body.groupId = collisionGroupId;
};

Player.prototype.handleInput = function(gamepad) {

	var joyX = gamepad.axes[this.xAxis];
	if(Math.abs(joyX) < this.deadZone)
		joyX = 0;

	var joyY = gamepad.axes[this.yAxis];
	if(Math.abs(joyY) < this.deadZone)
		joyY = 0;


	var x = joyX * this.walkSpeed;
	var y = joyY * this.walkSpeed;

	if(this.canWalk())
		Matter.Body.applyForce(this.body, this.body.position, {x: x, y: y});

	if(x || y)
		Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(y, x));
};

Player.prototype.canWalk = function() {
	if(game.gameType == 'ultimateFlyingDisc' && this.possession)
		return false;

	return true;
};

Player.prototype.handleCollision = function(otherThing) {
	if(otherThing instanceof Ball && otherThing.canGrab()) { //can grab ball
		if(this.canAndShouldGrabBall(otherThing))
			this.grab(otherThing);
	}
};

Player.prototype.canAndShouldGrabBall = function(ball) {
	if(this.possession) {
		console.log("Don't grab ball, we've already got one");
		return false;
	}
	if(!ball.canGrab()) {
		console.log("Don't grab ball, it's not grabbable");
		return false;
	}

	return true;
}

Player.prototype.grab = function(ball) {
	ball.possessor = this;

	window.P = this;

	ball.body.groupId = this.body.groupId;

	this.possession = Matter.Constraint.create({
		bodyA: this.body,
		bodyB: ball.body,
		pointA: {
			x: 0,
			y: -(this.radius + ball.radius)
		},
		pointB: {
			x: 0,
			y: 0
		},
		stiffness: 1,
		render: {
			lineWidth: 5,
			strokeStyle: "#F79A42"
		}
	});

	this.possession.length = 1;

	Matter.World.add(this.game.getWorld(), this.possession);
};

Player.prototype.release = function() {
	var ball = this.possession.bodyB.pawn;

	Matter.World.remove(this.game.getWorld(), this.possession);

	ball.body.groupId = 0;
	ball.possessor = null;

	this.possession = null;
};

Player.prototype.throw = function() {
	var ball = this.possession.bodyB.pawn;
	this.release();

	var x = Math.cos(this.body.angle) * this.throwForce;
	var y = Math.sin(this.body.angle) * this.throwForce;

	Matter.Body.applyForce(ball.body, ball.body.position, {x: x, y: y});
}
