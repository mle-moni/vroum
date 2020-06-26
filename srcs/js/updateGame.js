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
	world.camera.lookAt(player.position);
}