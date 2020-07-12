class PositionController {
	constructor (game) {
		this.game = game;
		this.players = {};
		this.yPos = 0.9;
	}
	addPlayer(position, pseudo) {
		const car = new Car(position.skin, this.game.engine, pseudo);

		car.model.position.set(
			position.x,
			this.yPos,
			position.z
		);
		car.model.rotation.y = position.ry;
		this.game.engine.scene.add(car.model);
		this.players[pseudo] = car;
	}
	updatePos(position, pseudo) {
		this.players[pseudo].model.position.x = position.x;
		// this.players[pseudo].model.position.y = this.yPos;
		this.players[pseudo].model.position.z = position.z;
		this.players[pseudo].model.rotation.y = position.ry;
	}
	managePlayers(positions) {
		for (let pseudo in positions) {
			if (this.players.hasOwnProperty(pseudo)) {
				this.updatePos(positions[pseudo], pseudo);
			} else if ( this.game.engine.skinExists(positions[pseudo].skin) ) {
				if (pseudo === this.game.pseudo) {
					continue ; // prevent the player car to be duplicated
				}
				this.addPlayer(positions[pseudo], pseudo);
			}
		}
	}
	deletePlayer(pseudo) {
		if (this.players.hasOwnProperty(pseudo)) {
			this.game.engine.scene.remove(this.players[pseudo].model);
			delete(this.players[pseudo]);
		}
	}
	setupEvents() {
		this.game.socket.on("updatePos", positions => {
			this.managePlayers(positions);
		});
		this.game.socket.on("deletePlayer", pseudo => {
			this.deletePlayer(pseudo);
		});
	}
	sendPosition() {
		const pos = {
			x: this.game.engine.player.model.position.x,
			y: this.game.engine.player.model.position.y,
			z: this.game.engine.player.model.position.z,
			ry: this.game.engine.player.model.rotation.y,
			skin: this.game.engine.player.skin
		};
		this.game.socket.emit("updatePos", pos);
	}
}