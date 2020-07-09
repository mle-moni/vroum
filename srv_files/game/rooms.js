const POS = require("./Positions");
const rooms = {};

module.exports = {
	setupEvents,
	rooms
};

class Room {
	constructor (socket, namespace="") {
		this.namespace = namespace;
		this.creator = socket;
		this.users = [];
		this.users.push(socket);
		this.positions = new POS.Positions();
		rooms[this.namespace] = this;
		socket.join(this.namespace);
		socket.emit("success!", `Room successfully created`);
	}
	join(socket) {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].psd == socket.psd) {
				socket.emit("error!", "That's weird, it semms that you already are in this game");
				return ;
			}
		}
		socket.join(this.namespace);
		socket.gameRoom = this;
		this.users.push(socket);
		socket.emit("success!", `Successfully joined ${this.creator.psd}'s room`);
		socket.to(this.namespace).emit("success!", `${socket.psd} joined the game!`);
	}
	kick(socket) {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].psd === socket.psd) {
				this.users.splice(i, 1);
				this.positions.deletePlayerPos(socket.psd);
				socket.to(this.namespace).emit("msg!", `${socket.psd} left the game`);
				socket.to(this.namespace).emit("deletePlayer", socket.psd);
				break ;
			}
		}
		if (this.users.length === 0) {
			delete(rooms[this.namespace]);
		}
	}
}

function setupEvents(socket, dbo) {
	POS.setupEvents(socket, dbo);
	socket.on("joinRoom", roomId => {
		if (!socket.hasOwnProperty("psd")) {
			return ;
		}
		if (socket.hasOwnProperty("gameRoom")) {
			socket.emit("error!", "You already are in a game room!");
			return ;
		}
		if (rooms.hasOwnProperty(roomId)) {
			rooms[roomId].join(socket);
		} else {
			socket.gameRoom = new Room(socket, roomId);
		}
	});

	socket.on("getRooms", () => {
		const objToSend = [];
		for (key in rooms) {
			objToSend.push({
				namespace: key,
				creator: rooms[key].creator.psd,
				users: rooms[key].users.map(userSocket=>userSocket.psd)
			});
		}
		socket.emit("getRooms", objToSend);
	});

}