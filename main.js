window.addEventListener('load', function() {
	window.game = new Game(document.body);
	window.gamepadListener = new GamepadListener(window.game);
	window.game.gamepadListener = window.gamepadListener;
});