class Shot {
	constructor(mesh, infos) {
		this.model = mesh;
		this.speed = infos.speed;
		this.angle = infos.angle;
		this.shooter = infos.shooter;
		this.dieAt = Date.now() + 10000; // delete bullet after 10 seconds
		this.model.position.set(
			infos.position.x,
			infos.position.y,
			infos.position.z			
		);
		const pos1 = this.model.position.clone();
		const pos2 = this.model.position.clone();
		pos2.x -= Math.sin(this.angle) * 10;
		pos2.z -= Math.cos(this.angle) * 10;
		this.directionVector = pos2.sub(pos1).normalize();
	}
}

class RedShot extends Shot {
	constructor(position, angle, shooter) {
		const radius = 0.5;
		const geometry = new THREE.SphereGeometry( radius, 32, 32 );
		const material = new THREE.MeshBasicMaterial({color: 0x9e2a2b});
		const mesh = new THREE.Mesh(geometry, material);
		super(mesh, {
			speed: 0.25,
			angle,
			shooter,
			position
		});
		this.radius = radius;
		this.type = "red";
	}
}

class BlueShot extends Shot {
	constructor(position, angle, shooter) {
		const radius = 0.5;
		const geometry = new THREE.SphereGeometry( radius, 32, 32 );
		const material = new THREE.MeshBasicMaterial({color: 0x0000FF});
		const mesh = new THREE.Mesh(geometry, material);
		super(mesh, {
			speed: 0.25,
			angle,
			shooter,
			position
		});
		this.type = "blue";
		this.radius = radius;
	}
}