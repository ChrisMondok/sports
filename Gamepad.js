function Gamepad() {
	this.layout = new GamepadLayout(undefined, undefined);
	this.input = undefined;
};

Gamepad.prototype.setupComplete = function() {
	return this.layout.leftJoystick && this.layout.rightJoystick;
};

Gamepad.prototype.getLeftVerticalAxis = function() {
	if (!this.layout.leftJoystick) {
		return undefined;
	}
	
	return this.input.axes[this.layout.leftJoystick.verticalAxis];
};

Gamepad.prototype.getLeftHorizontalAxis = function() {
	if (!this.layout.leftJoystick) {
		return undefined;
	}
	
	return this.input.axes[this.layout.leftJoystick.horizontalAxis];
};

Gamepad.prototype.getRightVerticalAxis = function() {
	if (!this.layout.rightJoystick) {
		return undefined;
	}
	
	return this.input.axes[this.layout.rightJoystick.verticalAxis];
};

Gamepad.prototype.getRightHorizontalAxis = function() {
	if (!this.layout.rightJoystick) {
		return undefined;
	}
	
	return this.input.axes[this.layout.rightJoystick.horizontalAxis];
};