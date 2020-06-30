function newMap() {
	const width = parseInt(prompt("width"));
	const height = parseInt(prompt("height"));
	const title = prompt("title");

	map.title = title;
	map.array = [];
	for (let i = 0; i < height; i++) {
		map.array.push([]);
		for (let j = 0; j < width; j++) {
			map.array[i].push(1);
		}
	}
	map.tileScale = 100;
	mapLoader.load(map);
	world.camera.position.set(
		world.defaultPos.x,
		100,
		world.defaultPos.z
	);
}