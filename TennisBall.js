function TennisBall() {
	Ball.apply(this, arguments);

	this.z = 0;
};

TennisBall.extends(Ball);

TennisBall.prototype.tick = function() {

};

TennisBall.prototype.canGrab = function() {
	return false;
};
