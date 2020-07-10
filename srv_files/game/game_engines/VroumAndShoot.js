const GameEngine = require("./GameEngine");

class VroumAndShoot extends GameEngine {
	constructor (room) {
		super(room, "VroumAndShoot");
		this.room.creator.role = "shoot";
	}
	setRole(socket, context) {
		if (context === "newPlayer") {
			socket.role = "run";
		}
	}
	changeShooter(socket) {
		for (let i = 0; i < this.room.users.length; i++) {
			if (this.room.users[i].psd === socket.psd) {
				const index = (i + 1) % this.room.users.length;
				this.room.users[index].role = "shoot";
				return (this.room.users[index]);
			}
		}
		return (null);
	}
	shooterInfos(socket) {
		const timeInvu = 10;
		socket.emit("msg!", `You are the new shooter!`);
		socket.to(socket.gameRoom.namespace)
		.emit("gameAction", "invu", timeInvu * 1000);
		socket.to(socket.gameRoom.namespace)
		.emit("msg!", `${socket.psd} is the new shooter! Time to run!`);
		socket.to(socket.gameRoom.namespace)
		.emit("msg!", `You have ${timeInvu} seconds of invulnerability!`);
	}
	action(type, args, context) {
		switch (type) {
			case "shot":
				if (!this.objHasProperties(args, ["type", "angle", "position"])) {
					return ;
				}
				if (context.socket.role === "shoot") {
					const objToSend = {
						type: args.type,
						angle: args.angle,
						position: args.position,
						shooter: context.socket.psd
					};
					context.socket.emit("gameAction", "shot", objToSend);
					context.socket.to(context.socket.gameRoom.namespace)
					.emit("gameAction", "shot", objToSend);
				}
				break;
			case "hit":
				if (!this.objHasProperties(args, ["type", "shooter"])) {
					return ;
				}
				if (context.socket.role === "run") {
					let shooterSocket = this.room.findSocketByPsd(args.shooter);
					if (!shooterSocket || shooterSocket.role !== "shoot") {
						return ;
					}
					if (args.type === "blue") {
						shooterSocket.role = "run";
						context.socket.role = "shoot";
						this.shooterInfos(context.socket);
					}
				}
				break;
			case "playerHitsWall":
				if (!this.objHasProperties(args, ["x", "y", "time"])) {
					return ;
				}
				const color = {r: 52, g: 128, b: 235};
				if (context.socket.role === "shoot") {
					color.r = 255;
					color.g = 10;
					color.b = 10;
				}
				args.r = color.r;
				args.g = color.g;
				args.b = color.b;
				context.socket.emit("gameAction", "playerHitsWall", args);
				context.socket.to(context.socket.gameRoom.namespace)
				.emit("gameAction", "playerHitsWall", args);
				break;
			case "playerLeft":
				if (context.socket.role === "shoot") {
					const nextShooter = this.changeShooter(context.socket);
					if (nextShooter) {
						this.shooterInfos(nextShooter);
					}
				}
				break;
		}
	}
}

module.exports = VroumAndShoot;