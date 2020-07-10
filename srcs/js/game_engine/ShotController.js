class ShotController {
	constructor(engine) {
		this.engine = engine;
		this.bullets = [];
		this.timers = {
			red: 0,
			blue: 0
		};
		this.minimumTime = {
			red: 200,
			blue: 500
		};
	}
	newShot(args) {
		if (!this.engine.objHasProperties(args, ["type", "position", "angle", "shooter"])) {
			return ;
		}
		let bullet; 
		if (args.type === "red") {
			bullet = new RedShot(args.position, args.angle, args.shooter);
		} else if (args.type === "blue") {
			bullet = new BlueShot(args.position, args.angle, args.shooter);
		}
		this.engine.scene.add(bullet.model);
		this.bullets.push(bullet);
	}
	deleteByIndex(index) {
		this.engine.scene.remove(this.bullets[index].model);
		this.bullets.splice(index, 1);
	}
	checkCollision(bullet) {
		if (this.engine.player.isVulnerable()) {
			return (this.engine.player.collider.bulletCollision(bullet));
		}
		return (false);
	}
	updatePos(dt) {
		const now = Date.now();
		let bulletThatHit = null;
		for (let i = 0; i < this.bullets.length; i++) {
			const speed = this.bullets[i].speed;
			const angle = this.bullets[i].angle;
			const model = this.bullets[i].model;
			const dieAt = this.bullets[i].dieAt;
			if (dieAt < now) {
				this.deleteByIndex(i);
				i--;
				continue ;
			}
			model.position.x -= Math.sin(angle) * speed * dt;
			model.position.z -= Math.cos(angle) * speed * dt;
			if (this.checkCollision(this.bullets[i])) {
				bulletThatHit = this.bullets[i];
			}
		}
		return (bulletThatHit);
	}
	clientCanShoot(type) {
		if (!this.timers.hasOwnProperty(type)) {
			return (false);
		}
		return (this.timers[type] < Date.now());
	}
	clientSetTimer(type) {
		if (!this.timers.hasOwnProperty(type)) {
			return ;
		}
		this.timers[type] = Date.now() + this.minimumTime[type];
	}
}