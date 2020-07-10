const VroumAndShoot = require("./VroumAndShoot");

module.exports = {
	VroumAndShoot,
	setupEvents
};

function setupEvents(socket, dbo) {
	socket.on("gameAction", (actionType, args) => {
		if (socket.hasOwnProperty("psd") && socket.hasOwnProperty("gameRoom")) {
			socket.gameRoom.gameEngine.action(actionType, args, {socket, dbo});
		}
	});
}