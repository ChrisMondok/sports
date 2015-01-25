function GamepadListener(game) {
	this.leftJoystickLayouts = [
		new Joystick(0, 1),
		new Joystick(1, 0)
	];
	this.rightJoystickLayouts = [
		new Joystick(2, 3),
		new Joystick(3, 2),
		new Joystick(3, 4)
	];

	this.game = game;
	this.gamepads = undefined;
	this.leftSetupCanvases = [
		document.createElement("canvas"),
		document.createElement("canvas")
	];
	this.rightSetupCanvases = [
		document.createElement("canvas"),
		document.createElement("canvas"),
		document.createElement("canvas")
	];
	this.setupPlayer = undefined;
	
	//Left Stick Config
	for (canvasCounter = 0; canvasCounter < this.leftSetupCanvases.length; canvasCounter++) {
		var canvas = this.leftSetupCanvases[canvasCounter];
		canvas.width = canvas.height = this.configCanvasDimension;
		canvas.addEventListener("click", this.handleJoystickConfigClick.bind(this, canvasCounter, "left"));
		document.getElementById('leftStickCanvasContainer').appendChild(this.leftSetupCanvases[canvasCounter]);
	}
	
	//Right Stick Config
	for (canvasCounter = 0; canvasCounter < this.rightSetupCanvases.length; canvasCounter++) {
		var canvas = this.rightSetupCanvases[canvasCounter];
		canvas.width = canvas.height = this.configCanvasDimension;
		canvas.addEventListener("click", this.handleJoystickConfigClick.bind(this, canvasCounter, "right"));
		document.getElementById('rightStickCanvasContainer').appendChild(this.rightSetupCanvases[canvasCounter]);
	}
	
	Matter.Events.on(game.engine, 'tick', this.onTick.bind(this));
}

GamepadListener.prototype.configCanvasDimension = 50;
GamepadListener.prototype.joystickIndicatorRange = 50 / 4;

GamepadListener.prototype.onTick = function(tickEvent) {
	this.pollGamepads(tickEvent);
};

GamepadListener.prototype.handleJoystickConfigClick = function(index, side, mouseEvent) {	
	if (side == "left") {
		this.setupPlayer.gamepad.layout.leftJoystick = this.leftJoystickLayouts[index];
	}
	else if (side == "right") {
		this.setupPlayer.gamepad.layout.rightJoystick = this.rightJoystickLayouts[index];
	}
	
	if (this.setupPlayer.gamepad.setupComplete()) {
		this.setupPlayer.addToWorld();
		this.setupPlayer = undefined;
	}
}

GamepadListener.prototype.pollGamepads = function(tickEvent) {
	var gamepads = navigator.getGamepads();
	this.gamepads = gamepads;
	
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i]) {
			var player = this.game.players[i];
			if(!player) {
				var world = game.getWorld();
				var team = i % 2;
				var x = world.bounds.max.x / 4 + team * world.bounds.max.x / 2;
				player = this.game.players[i] = new Player(this.game, x, 768/2);
				player.team = team;
				player.gamepad = new Gamepad();
			}
			
			var input = gamepads[i];
			player.gamepad.input = input;
			
			if (!player.gamepad.setupComplete() && (!this.setupPlayer || this.setupPlayer == player)) {
				this.setupPlayer = player;
				
				for (layoutCounter = 0; layoutCounter < this.leftJoystickLayouts.length; layoutCounter++) {
					var joystick = this.leftJoystickLayouts[layoutCounter];
					var canvas = this.leftSetupCanvases[layoutCounter];
					var context = canvas.getContext("2d");
					var widthCenter = canvas.width / 2;
					var heightCenter = canvas.height / 2;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.beginPath();
					context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
					context.stroke();
					context.beginPath();
					context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * this.joystickIndicatorRange), heightCenter + (input.axes[joystick.verticalAxis] * this.joystickIndicatorRange), widthCenter / 4, 2 * Math.PI, 0, true);
					context.strokeStyle = "white";
					context.stroke();
				}
				
				for (layoutCounter = 0; layoutCounter < this.rightJoystickLayouts.length; layoutCounter++) {
					var joystick = this.rightJoystickLayouts[layoutCounter];
					var canvas = this.rightSetupCanvases[layoutCounter];
					var context = canvas.getContext("2d");
					var widthCenter = canvas.width / 2;
					var heightCenter = canvas.height / 2;
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.beginPath();
					context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
					context.stroke();
					context.beginPath();
					context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * this.joystickIndicatorRange), heightCenter + (input.axes[joystick.verticalAxis] * this.joystickIndicatorRange), widthCenter / 4, 2 * Math.PI, 0, true);
					context.strokeStyle = "white";
					context.stroke();
				}
				
				document.getElementById("gamepadCanvasContainer").style.display = "block";
			}
			else if (!this.setupPlayer) {
				document.getElementById("gamepadCanvasContainer").style.display = "none";
			
				this.leftSetupCanvases.forEach(function(canvas) {
					var context = canvas.getContext("2d");
					context.clearRect(0, 0, canvas.width, canvas.height);
				});
				this.rightSetupCanvases.forEach(function(canvas) {
					var context = canvas.getContext("2d");
					context.clearRect(0, 0, canvas.width, canvas.height);
				});
			}
		}
	}
};
