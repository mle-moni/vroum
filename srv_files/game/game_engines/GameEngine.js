// abstract class
class GameEngine {
	constructor (room, type) {
		this.room = room;
		this.type = type;
	}
	// context is {socket: socket, dbo: dbo}
	action(type, args, context) {
		console.log("default action method")
	}
	setRole(socket, context) {
		socket.role = "default";
	}
	objHasProperties(obj, properties) {
		for (let i = 0; i < properties.length; i++) {
			if (!obj.hasOwnProperty(properties[i])) {
				return (false);
			}
		}
		return (true);
	}
}

module.exports = GameEngine;