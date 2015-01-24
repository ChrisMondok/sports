function Player(game) {
	Pawn.apply(this, arguments);

	this.body = this.createBody();

	Matter.World.add(game.getWorld(), this.body); 

	this.flickStart = undefined;
}

Player.extends(Pawn);

Player.prototype.walkForce = 0.01;

Player.prototype.xAxis = 0;
Player.prototype.yAxis = 1;
Player.prototype.flickXAxis = 3;
Player.prototype.flickYAxis = 4;

Player.prototype.deadZone = 0.2;
Player.prototype.flickThreshhold = 0.9;

Player.prototype.possession = null;

Player.prototype.radius = 25;

Player.prototype.throwForce = 0.03;

Player.prototype.createBody = function() {
	var x = 200;
	var y = 200;
	var body = Matter.Bodies.circle(x, y, this.radius, {frictionAir: 0.2});
	body.pawn = this;
	body.groupId = Matter.Body.nextGroupId();
	return body;
}

Player.prototype.setCollisionGroup = function(collisionGroupId) {
	this.body.groupId = collisionGroupId;
};

Player.prototype.handleInput = function(gamepad, tickEvent) {
	this.handleMovementInput(gamepad, tickEvent);
	this.handleFlickInput(gamepad, tickEvent);
};

Player.prototype.handleMovementInput = function(gamepad, tickEvent) {
	var joyX = gamepad.axes[this.xAxis];
	if(Math.abs(joyX) < this.deadZone)
		joyX = 0;

	var joyY = gamepad.axes[this.yAxis];
	if(Math.abs(joyY) < this.deadZone)
		joyY = 0;

	var x = joyX * this.walkForce;
	var y = joyY * this.walkForce;

	if(this.canWalk())
		Matter.Body.applyForce(this.body, this.body.position, {x: x, y: y});

	if(x || y)
		Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(y, x));
};

Player.prototype.handleFlickInput = function(gamepad, tickEvent) {
	var joyX = gamepad.axes[this.flickXAxis];
	if(Math.abs(joyX) < this.deadZone)
		joyX = 0;

	var joyY = gamepad.axes[this.flickYAxis];
	if(Math.abs(joyY) < this.deadZone)
		joyY = 0;

	if(joyX === 0 && joyY === 0)
		this.flickStart = tickEvent.timestamp;

	if(Math.sqrt(joyX * joyX + joyY * joyY) > this.flickThreshhold && this.flickStart) {
		var strength = Math.min(1, 30 / (tickEvent.timestamp - this.flickStart));

		var direction = Math.atan2(joyY, joyX);

		if(this.possession)
			this.throw(strength, direction);

		this.flickStart = undefined;
	}
};

Player.prototype.flick = function() {
	if(this.possession) {
		this.throw(x, y);
	}
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
		return false;
	}
	if(!ball.canGrab()) {
		return false;
	}

	return true;
}

Player.prototype.grab = function(ball) {
	ball.possessor = this;

	window.P = this;

	ball.body.groupId = this.body.groupId;

	var desiredBallLocation = {
		x: this.body.position.x + Math.cos(this.body.angle) * (this.radius + ball.radius),
		y: this.body.position.y + Math.sin(this.body.angle) * (this.radius + ball.radius)
	};

	var translation = {
		x: desiredBallLocation.x - ball.body.position.x,
		y: desiredBallLocation.y - ball.body.position.y
	};

	Matter.Body.translate(ball.body, {x: translation.x, y: translation.y});

	this.possession = Matter.Constraint.create({
		bodyA: this.body,
		bodyB: ball.body,
//		pointA: {
//			x: 0,
//			y: -(this.radius + ball.radius)
//		},
//		pointB: {
//			x: 0,
//			y: 0
//		},
		stiffness: 1,
		render: {
			lineWidth: 5,
			strokeStyle: "#F79A42"
		}
	});

	this.possession.length = 0;

	Matter.World.add(this.game.getWorld(), this.possession);
};

Player.prototype.release = function() {
	var ball = this.possession.bodyB.pawn;

	Matter.World.remove(this.game.getWorld(), this.possession);

	ball.body.groupId = 0;
	ball.possessor = null;

	this.possession = null;
};

Player.prototype.throw = function(strength, direction) {
	var ball = this.possession.bodyB.pawn;

	this.release();

	var x = Math.cos(direction) * this.throwForce * strength;
	var y = Math.sin(direction) * this.throwForce * strength;

	this.translateBallOutsideOfPlayer(ball, direction);

	Matter.Body.applyForce(ball.body, ball.body.position, {x: x, y: y});
};

Player.prototype.translateBallOutsideOfPlayer = function(ball, direction) {
	var desiredBallLocation = {
		x: this.body.position.x + Math.cos(direction) * (this.radius + ball.radius + 5),
		y: this.body.position.y + Math.sin(direction) * (this.radius + ball.radius + 5)
	};

	var translation = {
		x: desiredBallLocation.x - ball.body.position.x,
		y: desiredBallLocation.y - ball.body.position.y
	};

	Matter.Body.translate(ball.body, {x: translation.x, y: translation.y});
};
