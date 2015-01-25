function Gamepad() {
	this.leftJoystick = undefined;
	this.rightJoystick = undefined;
	this.input = undefined;
};

Gamepad.prototype.setupComplete = function() {
	return this.leftJoystick && this.rightJoystick;
};

Gamepad.prototype.getLeftHorizontalAxis = function() {
	if (!this.leftJoystick) {
		return undefined;
	}
	
	return this.leftJoystick.getHorizontalAxis(this.input);
};

Gamepad.prototype.getLeftVerticalAxis = function() {
	if (!this.leftJoystick) {
		return undefined;
	}
	
	return this.leftJoystick.getVerticalAxis(this.input);
};

Gamepad.prototype.getRightHorizontalAxis = function() {
	if (!this.rightJoystick) {
		return undefined;
	}
	
	return this.rightJoystick.getHorizontalAxis(this.input);
};

Gamepad.prototype.getRightVerticalAxis = function() {
	if (!this.rightJoystick) {
		return undefined;
	}
	
	return this.rightJoystick.getVerticalAxis(this.input);
};