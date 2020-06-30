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
		this.translationSpeed.z -= Math.cos(this.model.rotation.y) / 4;
		this.translationSpeed.x -= Math.sin(this.model.rotation.y) / 4;
	}
	reverseGear(dt) {
		this.translationSpeed.z += Math.cos(this.model.rotation.y) / 15;
		this.translationSpeed.x += Math.sin(this.model.rotation.y) / 15;
	}
	reduce(speed, reduce, name) {
		if (speed > -0.01 && speed < 0.01) {
			this.translationSpeed[name] = 0;
			return (0);
		}
		return (this.translationSpeed[name] / reduce);
	}
	dragForces(dt) {
		this.translationSpeed.x -= this.reduce(this.translationSpeed.x, 60, "x");
		this.translationSpeed.y -= this.reduce(this.translationSpeed.y, 60, "y");
		this.translationSpeed.z -= this.reduce(this.translationSpeed.z, 60, "z");
	}
	updatePos(dt) {
		this.dragForces(dt);
		this.model.position.x += this.translationSpeed.x;
		this.model.position.y += this.translationSpeed.y;
		this.model.position.z += this.translationSpeed.z;
		// console.log(this.translationSpeed);
	}
}