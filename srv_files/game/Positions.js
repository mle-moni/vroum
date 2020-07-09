class Positions {
	constructor () {
		this.players = {};
	}
	updatePlayerPos(playerName, position) {
		if (objHasProperties(position, ["x", "y", "z", "ry", "skin"])) {
			this.players[playerName] = position;
		}
	}
	deletePlayerPos(playerName) {
		delete(this.players[playerName]);
	}
	getPositions() {
		return (this.players);
	}
}

function objHasProperties(obj, properties) {
	for (let i = 0; i < properties.length; i++) {
		if (!obj.hasOwnProperty(properties[i])) {
			return (false);
		}
	}
	return (true);
}

function setupEvents(socket, dbo) {
	socket.on("updatePos", position => {
		if ( !objHasProperties(socket, ["psd", "gameRoom"]) ) {
			return ;
		}
		socket.gameRoom.positions.updatePlayerPos(socket.psd, position);
		socket.emit("updatePos", socket.gameRoom.positions.getPositions());
	});

	socket.on("playerHitsWall", pos => {
		if ( !objHasProperties(socket, ["psd", "gameRoom"]) ) {
			return ;
		}
		pos.r = 52;
		pos.g = 128;
		pos.b = 235;
		socket.emit("playerHitsWall", pos);
		socket.to(socket.gameRoom.namespace).emit("playerHitsWall", pos);
	});
}

module.exports = {
	Positions,
	setupEvents
};