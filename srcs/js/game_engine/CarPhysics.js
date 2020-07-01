// to do: use the delta time so the game is not frame based
class CarPhysics {
	constructor (car) {
		this.car = car;
		this.model = car.model;
		this.translationSpeed = {x: 0, y: 0, z: 0};
	}
	goLeft(dt) {
		this.model.rotation.y += 0.02;
	}
	goRight(dt) {
		this.model.rotation.y -= 0.02;
	}
	accelerate(dt) {
		// increase k to reduce car speed (1000)
		const k = 1000;
		this.translationSpeed.z -= (Math.cos(this.model.rotation.y) / k) * dt;
		this.translationSpeed.x -= (Math.sin(this.model.rotation.y) / k) * dt;
	}
	reverseGear(dt) {
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
			this.car.setInvulnerable(50);
			this.translationSpeed.x *= -0.7;
			this.translationSpeed.z *= -0.7;
		}
	}
	updatePos(dt) {
		this.dragForces(dt);
		this.checkCollisions();
		this.model.position.x += this.translationSpeed.x * dt;
		this.model.position.y += this.translationSpeed.y * dt;
		this.model.position.z += this.translationSpeed.z * dt;
		// console.log(this.translationSpeed);
	}
}