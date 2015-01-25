function GamepadListener(game) {
	this.leftJoystickLayouts = [
		new Joystick(0, 1),
		new Joystick(1, 0)
	];
	this.rightJoystickLayouts = [
		new Joystick(2, 3),
		new Joystick(3, 2)
	];

	this.game = game;
	this.gamepads = undefined;
	this.setupCanvases = [
		document.createElement("canvas"),
		document.createElement("canvas"),
		document.createElement("canvas"),
		document.createElement("canvas")
	];
	this.setupPlayer = undefined;
	
	for (canvasCounter = 0; canvasCounter < this.setupCanvases.length; canvasCounter++) {
		var canvas = this.setupCanvases[canvasCounter];
		canvas.width = 80;
		canvas.height = 80;
		canvas.addEventListener("click", function(mouseEvent) {
			var side = mouseEvent.target.getAttribute("data-joystickSide");
			var index = parseInt(mouseEvent.target.getAttribute("data-joystickIndex"));
			
			if (side == "left") {
				this.setupPlayer.gamepad.layout.leftJoystick = this.leftJoystickLayouts[index];
			}
			else if (side == "right") {
				this.setupPlayer.gamepad.layout.rightJoystick = this.rightJoystickLayouts[index];
			}
			
			if (this.setupPlayer.gamepad.setupComplete()) {
				this.setupPlayer = undefined;
			}
		}.bind(this));
		
		document.body.appendChild(this.setupCanvases[canvasCounter]);
	}
	
	Matter.Events.on(game.engine, 'tick', this.onTick.bind(this));
}

GamepadListener.prototype.onTick = function(tickEvent) {
	this.pollGamepads(tickEvent);
};

GamepadListener.prototype.pollGamepads = function(tickEvent) {
	var gamepads = navigator.getGamepads();
	this.gamepads = gamepads;
	
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i]) {
			var player = this.game.players[i];
			if(!player) {
				player = this.game.players[i] = new Player(this.game);
				player.team = i % 2;
				player.gamepad = new Gamepad();
			}
			var input = gamepads[i];
			player.gamepad.input = input;
			
			if (!player.gamepad.setupComplete() && (!this.setupPlayer || this.setupPlayer == player)) {
				this.setupPlayer = player;
				
				//Render Left Joystick Input Setup 1
				var joystick = this.leftJoystickLayouts[0];
				var canvas = this.setupCanvases[0];
				var context = canvas.getContext("2d");
				var widthCenter = canvas.width / 2;
				var heightCenter = canvas.height / 2;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
				context.stroke();
				context.beginPath();
				context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * 20), heightCenter + (input.axes[joystick.verticalAxis] * 20), widthCenter / 4, 2 * Math.PI, 0, true);
				context.stroke();
				canvas.setAttribute("data-joystickSide", "left");
				canvas.setAttribute("data-joystickIndex", 0);
				
				//Render Left Joystick Input Setup 2
				joystick = this.leftJoystickLayouts[1];
				canvas = this.setupCanvases[1];
				context = canvas.getContext("2d");
				widthCenter = canvas.width / 2;
				heightCenter = canvas.height / 2;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
				context.stroke();
				context.beginPath();
				context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * 20), heightCenter + (input.axes[joystick.verticalAxis] * 20), widthCenter / 4, 2 * Math.PI, 0, true);
				context.stroke();
				canvas.setAttribute("data-joystickSide", "left");
				canvas.setAttribute("data-joystickIndex", 1);
				
				//Render Right Joystick Input Setup 1
				joystick = this.rightJoystickLayouts[0];
				canvas = this.setupCanvases[2];
				context = canvas.getContext("2d");
				widthCenter = canvas.width / 2;
				heightCenter = canvas.height / 2;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
				context.stroke();
				context.beginPath();
				context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * 20), heightCenter + (input.axes[joystick.verticalAxis] * 20), widthCenter / 4, 2 * Math.PI, 0, true);
				context.stroke();
				canvas.setAttribute("data-joystickSide", "right");
				canvas.setAttribute("data-joystickIndex", 0);
				
				//Render Right Joystick Input Setup 2
				joystick = this.rightJoystickLayouts[1];
				canvas = this.setupCanvases[3];
				context = canvas.getContext("2d");
				widthCenter = canvas.width / 2;
				heightCenter = canvas.height / 2;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
				context.stroke();
				context.beginPath();
				context.arc(widthCenter + (input.axes[joystick.horizontalAxis] * 20), heightCenter + (input.axes[joystick.verticalAxis] * 20), widthCenter / 4, 2 * Math.PI, 0, true);
				context.stroke();
				canvas.setAttribute("data-joystickSide", "right");
				canvas.setAttribute("data-joystickIndex", 1);
			}
			else if (!this.setupPlayer) {
				this.setupCanvases.forEach(function(canvas) {
					var context = canvas.getContext("2d");
					context.clearRect(0, 0, canvas.width, canvas.height);
				});
			}
		}
	}
};