class Collider {
	constructor (mapLoader, world) {
		this.mapLoader = mapLoader;
		this.world = world;
	}
	getCloseTilesInArray(player) {
		const tilesArray = [];
		let refPos =  {
			x: parseInt(player.model.position.x / this.mapLoader.map.tileScale) - 1,
			y: parseInt(player.model.position.z / this.mapLoader.map.tileScale) - 1
		};
		// create an array containing the 9 tiles around refPos
		for (let i = 0; i < 3; i++) {
			if (refPos.y + i < 0 || refPos.y + i > this.mapLoader.map.array.length - 1) {
				continue ;
			}
			for (let j = 0; j < 3; j++) {
				if (refPos.x + j < 0 || refPos.x + j > this.mapLoader.map.array[0].length - 1) {
					continue ;
				}
				tilesArray.push(this.mapLoader.tiles[refPos.y + i][refPos.x + j]);
			}
		}
		return (tilesArray);
	}	
	mapCollision(player) {
		const meshArray = this.getCloseTilesInArray(player);
		let target = new THREE.Vector3();

		for (let i = 0; i < player.hitbox.spheres.length; i++) {
			player.hitbox.spheres[i].getWorldPosition(target);
			let position = player.model.position.clone();
			position.y = 2;
			let directionVector = target.sub( position );
			let raycast = new THREE.Raycaster( position, directionVector.clone().normalize() );
			let collisionResults = raycast.intersectObjects( meshArray );
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
				return (collisionResults[0].object);
			}
		}
		return (null);
	}
}