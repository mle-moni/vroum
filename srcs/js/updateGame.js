function updateGame(world) {
	const playerModel = world.actors.player.model;

	if (keyboard.right) {
		world.actors.player.physics.goRight();
	}
	if (keyboard.left) {
		world.actors.player.physics.goLeft();
	}
	if (keyboard.up) {
		world.actors.player.physics.accelerate();
	}
	if (keyboard.down) {
		world.actors.player.physics.reverseGear();
	}
	world.actors.player.physics.updatePos();
	if (keyboard.lockCamera) {
		camLock = !camLock;
		if (camLock) {
			playerModel.add(world.camera);
			world.camera.position.set(0, 5, 10);
		} else {
			playerModel.remove(world.camera);
			world.camera.position.set(0, 100, 0);
		}
		keyboard.lockCamera = false;
	}
	world.camera.lookAt(playerModel.position);
}