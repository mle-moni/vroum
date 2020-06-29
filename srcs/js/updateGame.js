function updateGame(world, dt) {
	const playerModel = world.actors.player.model;

	// update the speed vector considering the inputs of the player
	if (keyboard.right) {
		world.actors.player.physics.goRight(dt);
	}
	if (keyboard.left) {
		world.actors.player.physics.goLeft(dt);
	}
	if (keyboard.up) {
		world.actors.player.physics.accelerate(dt);
	}
	if (keyboard.down) {
		world.actors.player.physics.reverseGear(dt);
	}
	// update player pos with the speed vector
	world.actors.player.physics.updatePos(dt);

	// lock / unlock camera
	if (keyboard.lockCamera) {
		camLock = !camLock;
		if (camLock) {
			playerModel.add(world.camera);
			world.camera.position.set(0, 5, 10);
		} else {
			playerModel.remove(world.camera);
			world.camera.position.y = 100;
			world.camera.position.x = world.actors.player.model.position.x;
			world.camera.position.z = world.actors.player.model.position.z;
		}
		keyboard.lockCamera = false;
	}
	world.camera.lookAt(playerModel.position);
}