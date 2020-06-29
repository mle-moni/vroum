class MapLoader {
	constructor (world) {
		this.world = world;
		this.tiles = [];
	}
	load(map) {
		const TILE_SCALE = 100;
		const tileGeometry = new THREE.BoxGeometry(TILE_SCALE, 1, TILE_SCALE);

		const roadMaterial = new THREE.MeshBasicMaterial({color: 0xb0985a});
		const dirtMaterial = new THREE.MeshBasicMaterial({color: 0x90a395});
		const startMaterial = new THREE.MeshBasicMaterial({color: 0x7e6cd9});

		// unload previous map
		for (let i = 0; i < this.tiles.length; i++) {
			for (let j = 0; i < this.tiles[i].length; j++) {
				scene.remove(this.tiles[i][j]);
			}
		}

		// empty tiles array
		this.tiles.length = 0;

		// load map
		for (let i = 0; i < map.length; i++) {
			this.tiles.push([]);
			for (let j = 0; j < map[i].length; j++) {
				let material;
				if (map[i][j] === 2) {
					material = roadMaterial;
				} else if (map[i][j] === 1) {
					material = dirtMaterial;
				}
				// 0 is where the player starts, so we need to update world.defaultPos
				if (map[i][j] === 0) {
					material = startMaterial;
					world.defaultPos.x = j * TILE_SCALE;
					world.defaultPos.y = 0;
					world.defaultPos.z = i * TILE_SCALE;
				}
				// create a mesh for each tiles
				this.tiles[i].push(new THREE.Mesh(tileGeometry, material));
				this.tiles[i][j].position.x = j * TILE_SCALE;
				this.tiles[i][j].position.z = i * TILE_SCALE;
				this.tiles[i][j].position.y = 0;
				// add each tiles to the scene
				world.scene.add(this.tiles[i][j]);
			}
		}
	}
}