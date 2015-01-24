Function.prototype.extends = function(base) {
	this.prototype = Object.create(base.prototype, {
		constructor: {
			value: this,
			enumerable: false,
			writeable: true,
			configurable: false
		},
		_super: {
			value: base,
			enumerable: false,
			writeable: true,
			configurable: false
		}
	});
};

navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;
