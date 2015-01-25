function Player(game, x, y) {
	Pawn.apply(this, arguments);

	this.body = this.createBody(x, y);

	this.flickStart = undefined;
	this.gamepad = undefined;
	this.lastLunged = 0;

	new HockeyStick(game, this.body.position.x, this.body.position.y);
}

Player.extends(Pawn);

Player.prototype.walkForce = 0.01;

Player.prototype.flickThreshhold = 0.9;
Player.prototype.lungeForce = 0.2;
Player.prototype.lungeCooldown = 1000;
Player.prototype.attackDuration = 500;

Player.prototype.possession = null;
Player.prototype.equipment = null;

Player.prototype.radius = 25;

Player.prototype.throwForce = 0.03;

Player.prototype.tick = function(tickEvent) {
	this.handleInput(tickEvent);
	if(this.equipment) {
		this.translateEquipmentToSelf();
		this.equipment.tick(tickEvent);
	}
	this.updateTexture();
};

Player.prototype.updateTexture = function() {
	this.body.render.sprite.texture = "./img/player-team" + this.team + "-idle.png";
};

Player.prototype.addToWorld = function() {
	Matter.World.add(game.getWorld(), this.body);
}

Player.prototype.createBody = function(x, y) {
	var body = Matter.Bodies.circle(x, y, this.radius, {frictionAir: 0.2});
	body.pawn = this;
	body.groupId = Matter.Body.nextGroupId();
	return body;
};

Player.prototype.setCollisionGroup = function(collisionGroupId) {
	this.body.groupId = collisionGroupId;
};

Player.prototype.handleInput = function(tickEvent) {
	if (this.gamepad.setupComplete()) {
		this.handleMovementInput(tickEvent);
		this.handleFlickInput(tickEvent);
	}
};

Player.prototype.handleMovementInput = function(tickEvent) {
	var joyX = this.gamepad.getLeftHorizontalAxis();
	var joyY = this.gamepad.getLeftVerticalAxis();

	var x = joyX * this.walkForce;
	var y = joyY * this.walkForce;

	if(this.canWalk())
		Matter.Body.applyForce(this.body, this.body.position, {x: x, y: y});

	if(x || y)
		Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(y, x));
};

Player.prototype.handleFlickInput = function(tickEvent) {
	var joyX = this.gamepad.getRightHorizontalAxis();
	var joyY = this.gamepad.getRightVerticalAxis();

	if(joyX === 0 && joyY === 0)
		this.flickStart = tickEvent.timestamp;

	if(Math.sqrt(joyX * joyX + joyY * joyY) > this.flickThreshhold && this.flickStart) {
		var strength = Math.min(1, 30 / (tickEvent.timestamp - this.flickStart));

		var direction = Math.atan2(joyY, joyX);

		if(this.canThrow())
			this.throw(strength, direction);
		else {
			if(this.equipment) {
				if(this.equipment.canSwing()) {
					this.equipment.swing(strength, direction);
				}
			}
			else {
				if(this.canLunge())
					this.lunge(strength, direction);
			}
		}

		this.flickStart = undefined;
	}
};

Player.prototype.canThrow = function() {
	if(!this.possession)
		return false;

	if(this.game.gameType == 'Dodgeball' && !this.isOnOwnHalfOfField()) {
		console.log("Can't throw, on wrong side");
		return false;
	}

	return true;
};

Player.prototype.canLunge = function() {
	return !this.possession && (this.game.timestamp - this.lastLunged) > this.lungeCooldown;
};

Player.prototype.lunge = function(strength, direction) {
	var force = {
		x: Math.cos(direction) * strength * this.lungeForce,
		y: Math.sin(direction) * strength * this.lungeForce
	};

	this.lastLunged = this.game.timestamp;

	Matter.Body.applyForce(this.body, this.body.position, force);
};

Player.prototype.isOnOwnHalfOfField = function() {
	var half = Math.floor(this.body.position.x / (this.game.getWorld().bounds.max.x / 2));
	return half == this.team;
}

Player.prototype.flick = function() {
	if(this.possession) {
		this.throw(x, y);
	}
};

Player.prototype.canWalk = function() {
	if(this.game.gameType == 'Ultimate Flying Disc' && this.possession)
		return false;

	return true;
};

Player.prototype.handleCollision = function(otherThing) {
	if(otherThing instanceof Ball && this.canAndShouldGrabBall(otherThing))
		this.grab(otherThing);

	if(otherThing instanceof Equipment && this.canAndShouldTakeEquipment(otherThing))
		this.equip(otherThing);

	if(otherThing instanceof Player && this.isAttacking())
		this.attack(otherThing);
};

Player.prototype.isAttacking = function() {
	return this.game.timestamp - this.lastLunged < this.attackDuration;
};

Player.prototype.attack = function(otherPlayer) {
	otherPlayer.dropEquipment();
};

Player.prototype.canAndShouldGrabBall = function(ball) {
	return !this.possession && ball.canGrab();
};

Player.prototype.canAndShouldTakeEquipment = function(equipment) {
	return !this.equipment && equipment.canEquip();
};

Player.prototype.grab = function(ball) {
	ball.possessor = this;

	ball.body.groupId = this.body.groupId;

	this.translateBallOutsideOfPlayer(ball, this.body.angle);

	this.possession = Matter.Constraint.create({
		bodyA: this.body,
		bodyB: ball.body,
		stiffness: 1,
		render: {
			lineWidth: 5,
			strokeStyle: "#F79A42"
		}
	});

	this.possession.length = 0;

	Matter.World.add(this.game.getWorld(), this.possession);
};

Player.prototype.equip = function(equipment) {
	this.equipment = equipment;
	equipment.holder = this;
	Matter.World.remove(this.game.getWorld(), equipment.body);
};

Player.prototype.dropEquipment = function() {
	if(!this.equipment)
		return;

	Matter.World.add(this.game.getWorld(), this.equipment.body);

	this.equipment.holder = null;
	this.equipment = null;
};

Player.prototype.translateEquipmentToSelf = function() {
	var translation = {
		x: this.body.position.x - this.equipment.body.position.x,
		y: this.body.position.y - this.equipment.body.position.y
	};

	Matter.Body.translate(this.equipment.body, translation);
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

	ball.lastThrownBy = this;

	var sound = "throw-"+Math.floor(strength * 2);
	this.game.playSound(sound);
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
