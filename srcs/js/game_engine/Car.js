/*
	creates a car object,
	you need to add car.moddel to the scene in order to see it
*/

const HITBOXES = {
	geometriesValues: {
		"red_car": {x: 20, y: 30, z: 42}
	},
	material: new THREE.MeshPhongMaterial({
		color: 0xff0000,
		opacity: 0.5,
		transparent: true,
	})
};

class Car {
	constructor(skin, world) {
		this.model = world.prototypes[skin].clone();
		this.hitbox = {
			model: new THREE.Mesh(this.getGeometry(skin), HITBOXES.material),
			geometryValues: HITBOXES.geometriesValues[skin],
			spheres: null
		};
		this.model.add(this.hitbox.model);
		this.hitbox.spheres = this.initSpheres();
		this.toggleHitbox();
		this.physics = new CarPhysics(this);
		this.collider = world.collider;
		this.vulnerabilityTimer = 0;
	}
	initSpheres() {
		const values = this.hitbox.geometryValues;
		const sphereGeometry = new THREE.SphereGeometry( 2, 30, 30 );
		const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
		const spheres = [];
		for (let i = 0; i < 6; i++) {
			spheres.push(new THREE.Mesh(sphereGeometry, sphereMaterial));
			this.hitbox.model.add(spheres[i]);
		}
		spheres[0].position.set(values.x / 2, 1, values.z / 2);
		spheres[1].position.set(values.x / 2, 1, -values.z / 2);
		spheres[2].position.set(-values.x / 2, 1, values.z / 2);
		spheres[3].position.set(-values.x / 2, 1, -values.z / 2);

		spheres[4].position.set(-values.x / 2, 1, 0);
		spheres[5].position.set(values.x / 2, 1, 0);
		// spheres are placed at the edges of the car, we will need more precision later

		return (spheres);
	}
	getGeometry(skin) {
		const values = HITBOXES.geometriesValues[skin];
		return (new THREE.BoxGeometry(values.x, values.y, values.z));
	}
	toggleHitbox() {
		this.hitbox.model.visible = !this.hitbox.model.visible;
	}
	isVulnerable() {
		if (this.vulnerabilityTimer < Date.now()) {
			return (true);
		}
		return (false);
	}
	setInvulnerable(timeInMs) {
		this.vulnerabilityTimer = Date.now() + timeInMs;
	}
}