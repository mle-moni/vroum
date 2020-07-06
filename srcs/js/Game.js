class Game {
	constructor (modelsPaths, socket, toast) {
        this.socket = socket;
        this.toast = toast;
        this.setupEvents();
        this.engine = new Engine(modelsPaths, this.update);
    }
    update(engine, dt) {
		const playerModel = engine.player.model;
	
		// update the speed vector considering the inputs of the player
		if (keyboard.right) {
			engine.player.physics.goRight(dt);
		}
		if (keyboard.left) {
			engine.player.physics.goLeft(dt);
		}
		if (keyboard.up) {
			engine.player.physics.accelerate(dt);
		}
		if (keyboard.down) {
			engine.player.physics.reverseGear(dt);
		}
		// update player pos with the speed vector
		engine.player.physics.updatePos(dt);
	
		if (keyboard.camera1) {
			cameraView = 1;
			keyboard.camera1 = false;
		} else if (keyboard.camera2) {
			cameraView = 2;
			keyboard.camera2 = false;
		} else if (keyboard.camera3) {
			cameraView = 3;
			keyboard.camera3 = false;
		}
		if (cameraView === 1 && !camLock) { // lock camera to player movements
			camLock = true;
			playerModel.add(engine.camera);
			engine.camera.position.set(0, 50, 100);
		}
		if (cameraView !== 1 && camLock) { // unlock camera from player for others camera views
			camLock = false;
			playerModel.remove(engine.camera);
			engine.camera.position.y = 300;
			engine.camera.position.x = engine.player.model.position.x;
			engine.camera.position.z = engine.player.model.position.z;
		}
		if (cameraView === 2) {
			let posDiff = engine.camera.position.clone().sub(engine.player.model.position);
	
			engine.camera.position.x -= posDiff.x / 40;
			engine.camera.position.z -= posDiff.z / 40;
			engine.camera.position.y = 200;
		} else if (cameraView === 3) {
			if (oldPositions.length > 20) {
				engine.camera.position.x = oldPositions[0][0];
				engine.camera.position.z = oldPositions[0][1];
				engine.camera.position.y = 1000;
			}
		}
		if (oldPositions.length > 20) {
			oldPositions.shift();
		}
		oldPositions.push([
			engine.player.model.position.x,
			engine.player.model.position.z
		]);
		engine.camera.lookAt(playerModel.position);
	
		if (keyboard.showHitbox) {
			engine.player.toggleHitbox();
			keyboard.showHitbox = false;
		}
    }
    setupEvents() {
		this.socket.on("error!", msg => {
			this.toast.alert(msg);
		});
		this.socket.on("success!", msg => {
			this.toast.success(msg);
		});
		this.socket.on("msg!", msg => {
			this.toast.message(msg);
		});

		this.socket.on("succes_co", ()=>{
			this.toast.success("Connected");
			if (location.search !== "") {
				const room = location.search.slice(1);
				this.socket.emit("joinRoom", room);
			} else {
				this.socket.emit("joinRoom", "global");
			}
		});
	}
}