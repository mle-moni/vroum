function load(moveCamera = true) {
	let rawmap = prompt("copy paste map");
	
	map.array = JSON.parse(rawmap);
	mapLoader.load(map.array);
	if (moveCamera) {
		world.camera.position.set(
			world.defaultPos.x,
			100,
			world.defaultPos.z
		);
	}
}