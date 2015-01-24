Function.prototype.extends = function(base) {
	var cls = this;
	this.prototype = Object.create(base.prototype, {
		constructor: {
			value: this,
			enumerable: false,
			writeable: true,
			configurable: false
		}
	});
};

navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;
