function importMap(moveCamera = true) {
	let rawmap = prompt("copy paste map");
	if (/\=/.test(rawmap)) {
		let tmpArr = rawmap.split("=");
		tmpArr.shift();
		rawmap = tmpArr.join("=");
	}
	if (rawmap.charAt(rawmap.length - 1) === ";") {
		rawmap = rawmap.slice(0, rawmap.length - 1);
	}
	map = JSON.parse(rawmap);
	mapLoader.load(map);
	if (moveCamera) {
		world.camera.position.set(
			world.defaultPos.x,
			100,
			world.defaultPos.z
		);
	}
}