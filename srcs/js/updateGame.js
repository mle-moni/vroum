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
		if (!camLock) {
			playerModel.add(world.camera);
			world.camera.position.set(0, 50, 100);
		}
		camLock = true;
	} else {
		if (camLock) {
			playerModel.remove(world.camera);
			world.camera.position.y = 300;
			world.camera.position.x = world.actors.player.model.position.x;
			world.camera.position.z = world.actors.player.model.position.z;
		}
		if (dist2dSq(world.camera.position, world.actors.player.model.position) > 10000) {
			let posDiff = world.camera.position.clone().sub(world.actors.player.model.position);

			world.camera.position.x -= posDiff.x / 50;
			world.camera.position.z -= posDiff.z / 50;
		}
		camLock = false;
	}
	if (keyboard.showHitbox) {
		world.actors.player.toggleHitbox();
		keyboard.showHitbox = false;
	}
	world.camera.lookAt(playerModel.position);
}

function dist2dSq(obj1, obj2) {
	let diffX = obj2.x - obj1.x;
	let diffY = obj2.y - obj1.y;
	return ((diffX * diffX) + (diffY * diffY));
}