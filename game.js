window.addEventListener('load', function() {
	// Matter.js module aliases
	var Engine = Matter.Engine,
		World = Matter.World,
		Bodies = Matter.Bodies;

	// create a Matter.js engine
	var engine = Engine.create(document.body);

	window.engine = engine;

	// create two boxes and a ground
	var boxA = Bodies.rectangle(400, 200, 80, 80);
	var boxB = Bodies.rectangle(450, 50, 80, 80);

	// add all of the bodies to the world
	World.add(engine.world, [boxA, boxB]);

	engine.world.gravity.y = 0;

	// run the engine
	Engine.run(engine);
});
