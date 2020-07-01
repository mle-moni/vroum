class MapLoader {
	constructor (world) {
		this.world = world;
		this.tiles = [];
		this.materials = [
			new THREE.MeshBasicMaterial({color: 0x7e6cd9}),
			new THREE.MeshBasicMaterial({color: 0x90a395}),
			new THREE.MeshBasicMaterial({color: 0xb0985a}),
			new THREE.MeshBasicMaterial({color: 0x9e2a2b})
		];
		this.tileGeometry = null;
		this.cubeGeometry = null;
		this.map = null;
	}
	load(map) {
		this.map = map;

		this.tileGeometry = new THREE.BoxGeometry(this.map.tileScale, 1, this.map.tileScale);
		this.cubeGeometry = new THREE.BoxGeometry(this.map.tileScale, this.map.tileScale, this.map.tileScale);

		// unload previous map
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; j < this.tiles[i].length; j++) {
				scene.remove(this.tiles[i][j]);
			}
		}

		// empty tiles array
		this.tiles.length = 0;

		// load map
		for (let i = 0; i < map.array.length; i++) {
			this.tiles.push([]);
			for (let j = 0; j < map.array[i].length; j++) {
				// 0 is where the player starts, so we need to update world.defaultPos
				if (map.array[i][j] == 0) {
					this.world.defaultPos.x = j * this.map.tileScale;
					this.world.defaultPos.y = 0;
					this.world.defaultPos.z = i * this.map.tileScale;
				}
				// create a mesh for each tiles
				let geometry = map.array[i][j] == 3 ? this.cubeGeometry : this.tileGeometry;
				this.tiles[i].push(new THREE.Mesh(geometry, this.materials[ map.array[i][j] ]));
				this.tiles[i][j].position.x = j * this.map.tileScale;
				this.tiles[i][j].position.z = i * this.map.tileScale;
				this.tiles[i][j].tileID = map.array[i][j];
				this.tiles[i][j].position.y = this.tiles[i][j].geometry.vertices[0].y;
				// add each tiles to the scene
				this.world.scene.add(this.tiles[i][j]);
			}
		}
	}
	replaceTile(x, y, tileID) {
		this.world.scene.remove(this.tiles[y][x]);
		this.tiles[y][x] = null;
		let geometry = this.tileGeometry;
		if (tileID == 3) {
			geometry = this.cubeGeometry;
		}
		this.tiles[y][x] = new THREE.Mesh(geometry, this.materials[tileID]);
		this.tiles[y][x].tileID = tileID;
		this.tiles[y][x].position.x = x * this.map.tileScale;
		this.tiles[y][x].position.z = y * this.map.tileScale;
		this.tiles[y][x].position.y = this.tiles[y][x].geometry.vertices[0].y;
		this.world.scene.add(this.tiles[y][x]);
	}
}