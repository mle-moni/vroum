class CarPhysics {
	constructor (car) {
		this.car = car;
		this.model = car.model;
		this.translationSpeed = {x: 0, y: 0, z: 0};
	}
	goLeft() {
		this.model.rotation.y += 0.02;
	}
	goRight() {
		this.model.rotation.y -= 0.02;
	}
	accelerate() {
		this.translationSpeed.z -= Math.cos(this.model.rotation.y) / 10;
		this.translationSpeed.x -= Math.sin(this.model.rotation.y) / 10;
	}
	reverseGear() {
		this.translationSpeed.z += Math.cos(this.model.rotation.y) / 10;
		this.translationSpeed.x += Math.sin(this.model.rotation.y) / 10;
	}
	reduce(speed, reduce, name) {
		if (speed > -0.01 && speed < 0.01) {
			this.translationSpeed[name] = 0;
			if (name === "z") console.log(`z = ${this.translationSpeed[name]}`)
			return (0);
		}
		return (this.translationSpeed[name] / reduce);
	}
	dragForces() {
		this.translationSpeed.x -= this.reduce(this.translationSpeed.x, 50, "x");
		this.translationSpeed.y -= this.reduce(this.translationSpeed.y, 50, "y");
		this.translationSpeed.z -= this.reduce(this.translationSpeed.z, 50, "z");
	}
	updatePos() {
		this.dragForces();
		this.model.position.x += this.translationSpeed.x;
		this.model.position.y += this.translationSpeed.y;
		this.model.position.z += this.translationSpeed.z;
		console.log(this.translationSpeed);
	}
}