function updateGame(world) {
	const player = world.models.player;
	if (keyboard.right) {
		player.rotation.y -= 0.02;
	}
	if (keyboard.left) {
		player.rotation.y += 0.02;
	}
	if (keyboard.up) {
		player.position.z -= Math.cos(player.rotation.y);
		player.position.x -= Math.sin(player.rotation.y);
	}
	if (keyboard.down) {
		player.position.z += Math.cos(player.rotation.y);
		player.position.x += Math.sin(player.rotation.y);
	}
	if (keyboard.lockCamera) {
		camLock = !camLock;
		if (camLock) {
			world.models.player.add(world.camera);
			world.camera.position.set(0, 5, 10);
		} else {
			world.models.player.remove(world.camera);
			world.camera.position.set(0, 100, 0);
		}
		keyboard.lockCamera = false;
	}
	world.camera.lookAt(player.position);
}