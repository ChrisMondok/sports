window.addEventListener('load', function() {
	// Matter.js module aliases
	var Engine = Matter.Engine,
		World = Matter.World,
		Bodies = Matter.Bodies;

	// create a Matter.js engine
	var engine = Engine.create(document.body);

	window.engine = engine;
	engine.world.gravity.y = 0;

	// run the engine
	Engine.run(engine);

	var gym = new Gymnasium(engine.world);
	
	var players = [];

	Matter.Events.on(engine, 'tick', function() {
		pollGamepads();
	});

	function pollGamepads() {
		var gamepads = navigator.getGamepads();
		
		for(var i = 0; i < gamepads.length; i++)
		{
			if(gamepads[i]) {
				if(!players[i])
					players[i] = new Player(engine.world);

				players[i].handleInput(gamepads[i]);
			}
		}
	}
});


