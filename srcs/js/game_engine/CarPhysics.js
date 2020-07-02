// to do: use the delta time so the game is not frame based
class CarPhysics {
	constructor (car) {
		this.car = car;
		this.model = car.model;
		this.translationSpeed = {x: 0, y: 0, z: 0};
		this.speed = 0;
	}
	goLeft(dt) {
		if (Math.abs(this.speed) > 0.05)
		this.model.rotation.y += 0.04;
	}
	goRight(dt) {
		if (Math.abs(this.speed) > 0.05)
		this.model.rotation.y -= 0.04;
	}
	accelerate(dt) {
		// increase k to reduce car speed (1000)
		const k = 2000;
		this.speed += dt / k;
		this.translationSpeed.z -= (Math.cos(this.model.rotation.y) / 1300) * dt;
		this.translationSpeed.x -= (Math.sin(this.model.rotation.y) / 1300) * dt;
	}
	reverseGear(dt) {
		this.speed -= dt / 2000;
		this.translationSpeed.z += (Math.cos(this.model.rotation.y) / 2000) * dt;
		this.translationSpeed.x += (Math.sin(this.model.rotation.y) / 2000) * dt;
	}
	reduce(speed, reduce, name) {
		if (speed < 0.01 && speed > 0.01) {
			return (speed);
		}
		return (this.translationSpeed[name] / reduce);
	}
	dragForces(dt) {
		// reduce k = more ground grip (700)
		this.speed *= 0.99;
		const k = 650;
		this.translationSpeed.x -= this.reduce(this.translationSpeed.x, k, "x") * dt;
		this.translationSpeed.y -= this.reduce(this.translationSpeed.y, k, "y") * dt;
		this.translationSpeed.z -= this.reduce(this.translationSpeed.z, k, "z") * dt;
	}
	checkCollisions() {
		let objCollided = this.car.collider.mapCollision(this.car);
		if (!objCollided) {
			return ;
		}
		if (objCollided.hasOwnProperty("tileID") && objCollided.tileID == 3 && this.car.isVulnerable()) {
			this.car.setInvulnerable(200);
			this.translationSpeed.x *= -0.7;
			this.translationSpeed.z *= -0.7;
			this.speed *= -0.7;
		}
	}
	updatePos(dt) {
		this.dragForces(dt);
		this.checkCollisions();
		this.model.position.x += this.translationSpeed.x * dt;
		this.model.position.y += this.translationSpeed.y * dt;
		this.model.position.z += this.translationSpeed.z * dt;
		this.model.position.x -= Math.sin(this.model.rotation.y) * this.speed * dt;
		this.model.position.z -= Math.cos(this.model.rotation.y) * this.speed * dt;
	}
}