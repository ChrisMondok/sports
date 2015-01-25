function Joystick(horizontalAxis, verticalAxis) {
	this.horizontalAxis = horizontalAxis;
	this.verticalAxis = verticalAxis;
}

Joystick.prototype.deadZone = 0.2;

Joystick.prototype.getHorizontalAxis = function(input) {
	var axis = input.axes[this.horizontalAxis];
	
	if(Math.abs(axis) < this.deadZone) {
		axis = 0;
	}
	
	return axis;
};

Joystick.prototype.getVerticalAxis = function(input) {
	var axis = input.axes[this.verticalAxis];
	
	if(Math.abs(axis) < this.deadZone) {
		axis = 0;
	}
	
	return axis;
};