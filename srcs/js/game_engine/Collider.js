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
				let tile = this.mapLoader.tiles[refPos.y + i][refPos.x + j];
				if (tile.tileID == 3) {
					tilesArray.push(tile);
				}
			}
		}
		return (tilesArray);
	}	
	mapCollision(player) {
		const meshArray = this.getCloseTilesInArray(player);
		let target = new THREE.Vector3();

		if (meshArray.length === 0) {
			return (null);
		}
		for (let i = 0; i < player.hitbox.spheres.length; i++) {
			player.hitbox.spheres[i].getWorldPosition(target);
			let position = player.model.position.clone();
			position.y = 2;
			let directionVector = target.sub( position );
			let raycast = new THREE.Raycaster( position, directionVector.clone().normalize(), 0, directionVector.length());
			let collisionResults = raycast.intersectObjects( meshArray );
			if (collisionResults.length > 0) {
				return ({obj: collisionResults[0].object, face: collisionResults[0].faceIndex});
			}
		}
		return (null);
	}
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}