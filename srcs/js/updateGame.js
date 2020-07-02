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

	if (keyboard.camera1) {
		cameraView = 1;
		keyboard.camera1 = false;
	} else if (keyboard.camera2) {
		cameraView = 2;
		keyboard.camera2 = false;
	} else if (keyboard.camera3) {
		cameraView = 3;
		keyboard.camera3 = false;
	}
	if (cameraView === 1 && !camLock) { // lock camera to player movements
		camLock = true;
		playerModel.add(world.camera);
		world.camera.position.set(0, 50, 100);
	}
	if (cameraView !== 1 && camLock) { // unlock camera from player for others camera views
		camLock = false;
		playerModel.remove(world.camera);
		world.camera.position.y = 300;
		world.camera.position.x = world.actors.player.model.position.x;
		world.camera.position.z = world.actors.player.model.position.z;
	}
	if (cameraView === 2) {
		let posDiff = world.camera.position.clone().sub(world.actors.player.model.position);

		world.camera.position.x -= posDiff.x / 40;
		world.camera.position.z -= posDiff.z / 40;
		world.camera.position.y = 200;
	} else if (cameraView === 3) {
		if (oldPositions.length > 20) {
			world.camera.position.x = oldPositions[0][0];
			world.camera.position.z = oldPositions[0][1];
			world.camera.position.y = 1000;
		}
	}
	if (oldPositions.length > 20) {
		oldPositions.shift();
	}
	oldPositions.push([
		world.actors.player.model.position.x,
		world.actors.player.model.position.z
	]);
	world.camera.lookAt(playerModel.position);

	if (keyboard.showHitbox) {
		world.actors.player.toggleHitbox();
		keyboard.showHitbox = false;
	}
}