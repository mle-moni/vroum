class Collider {
	constructor (mapLoader, engine) {
		this.mapLoader = mapLoader;
		this.engine = engine;
	}
	getCloseTilesInArray(obj3D) {
		const tilesArray = [];
		let refPos =  {
			x: parseInt(obj3D.position.x / this.mapLoader.map.tileScale) - 1,
			y: parseInt(obj3D.position.z / this.mapLoader.map.tileScale) - 1
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
		const meshArray = this.getCloseTilesInArray(player.model);
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
	bulletCollision(bullet) {
		// const meshArray = [this.engine.player.model];
		const meshArray = [this.engine.player.hitbox.model];
		const position = bullet.model.position.clone();
		position.y = 4;
		const raycast = new THREE.Raycaster(
			position,
			bullet.directionVector,
			0,
			70
		);
		const collisionResults = raycast.intersectObjects( meshArray );
		if (collisionResults.length > 0) {
			return (true);
		}
		return (false);
	}
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}