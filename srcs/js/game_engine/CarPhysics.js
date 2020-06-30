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
		this.translationSpeed.z -= (Math.cos(this.model.rotation.y) / 600) * dt;
		this.translationSpeed.x -= (Math.sin(this.model.rotation.y) / 600) * dt;
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
		this.translationSpeed.x -= this.reduce(this.translationSpeed.x, 700, "x") * dt;
		this.translationSpeed.y -= this.reduce(this.translationSpeed.y, 700, "y") * dt;
		this.translationSpeed.z -= this.reduce(this.translationSpeed.z, 700, "z") * dt;
	}
	updatePos(dt) {
		this.dragForces(dt);
		this.model.position.x += this.translationSpeed.x * dt;
		this.model.position.y += this.translationSpeed.y * dt;
		this.model.position.z += this.translationSpeed.z * dt;
		// console.log(this.translationSpeed);
	}
}