class Game {
	constructor (models, socket, toast) {
		this.pseudo = sessionStorage.getItem('psd');
		let settings = {
			skin: sessionStorage.getItem('skin'),
			pseudo: this.pseudo
		};
		if (!settings.skin) {
			settings.skin = "red_car";
		}
        this.socket = socket;
        this.toast = toast;
		this.positionController = new PositionController(this);
		this.engine = new Engine(models, this, settings);
		this.setupEvents();
		
		this.minimap = {
			playerPos: []
		};
		this.firstUpdate = true;
		this.playerWallHitTime = 0;
		this.speedBeforeCrash = {x: 0, y: 0, z: 0};
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
		// returns true if player hits a wall in this frame
		if (engine.player.physics.updatePos(dt)) {
			const timePositionIsShown = 2000;
			this.playerWallHitTime = Date.now();
			this.socket.emit("gameAction", "playerHitsWall", {
				x: this.engine.player.model.position.x / this.engine.mapLoader.map.tileScale,
				y: this.engine.player.model.position.z / this.engine.mapLoader.map.tileScale,
				time: this.playerWallHitTime + timePositionIsShown
			});
		}
		let bullet = engine.shotController.updatePos(dt);
		if (bullet) {
			if (bullet.type === "red" && bullet.shooter !== this.pseudo) {
				engine.player.physics.slow(0.5);
			} else {
				this.socket.emit("gameAction", "hit", {
					type: bullet.type,
					shooter: bullet.shooter
				});
			}
		}

		if (keyboard.shootRed && engine.shotController.clientCanShoot("red")) {
			engine.shotController.clientSetTimer("red");
			const position = new THREE.Vector3();
			engine.player.hitbox.spheres[6].getWorldPosition(position);
			position.y = 1.3;
			this.socket.emit("gameAction", "shot", {
				type: "red",
				position,
				angle: engine.player.model.rotation.y
			});
		}

		if (keyboard.shootBlue && engine.shotController.clientCanShoot("blue")) {
			engine.shotController.clientSetTimer("blue");
			const position = engine.player.model.position.clone();
			position.y = 1.3;
			this.socket.emit("gameAction", "shot", {
				type: "blue",
				position,
				angle: engine.player.model.rotation.y
			});
		}
	
		this.cameras();

		if (keyboard.showHitbox) {
			engine.player.toggleHitbox();
			keyboard.showHitbox = false;
		}
		this.positionController.sendPosition();
		if (this.firstUpdate) {
			this.firstUpdate = false;
			this.initMinimap();
			keyboard.camera2 = true;
		}
		this.updateMinimap();
		if (this.engine.player.stayInMap()) {
			this.toast.alert("Stay in the map!");
		}
	}
	cameras() {
		const engine = this.engine;
		const playerModel = engine.player.model;
		if (keyboard.camera1) {
			cameraView = 1;
			keyboard.camera1 = false;
		} else if (keyboard.camera2) {
			cameraView = 2;
			keyboard.camera2 = false;
		} else if (keyboard.camera3) {
			cameraView = 3;
			keyboard.camera3 = false;
		} else if (keyboard.camera4) {
			cameraView = 4;
			keyboard.camera4 = false;
		}
		if (cameraView === 1 && !camLock) { // lock camera to player movements
			camLock = true;
			playerModel.add(engine.camera);
			engine.camera.position.set(0, 20, -1.5);
			engine.camera.rotation.set(0, 0, 0);
		}
		if (cameraView !== 1 && camLock) { // unlock camera from player for others camera views
			camLock = false;
			playerModel.remove(engine.camera);
			engine.camera.position.y = 30.0;
			engine.camera.position.x = engine.player.model.position.x;
			engine.camera.position.z = engine.player.model.position.z;
		}
		if (cameraView === 2) {
			let tmpPos = engine.player.model.position.clone();
			engine.camera.position.y = 5.0;
			const timeDiff = Date.now() - this.playerWallHitTime;
			if (timeDiff < 400) {
				tmpPos.x -= this.speedBeforeCrash.x * 120;
				tmpPos.z -= this.speedBeforeCrash.z * 120;
				this.speedBeforeCrash.x *= 0.9;
				this.speedBeforeCrash.z *= 0.9;
			} else {
				let timeFactor = 1 - ((1000 - timeDiff) / 600);
				if (timeFactor > 1 || timeFactor < 0) {
					timeFactor = 1;
				}
				tmpPos.x -= (engine.player.physics.translationSpeed.x * 120) * timeFactor;
				tmpPos.z -= (engine.player.physics.translationSpeed.z * 120) * timeFactor;
				this.speedBeforeCrash.x = engine.player.physics.translationSpeed.x;
				this.speedBeforeCrash.z = engine.player.physics.translationSpeed.z;
			}
			tmpPos.x += Math.sin(engine.player.model.rotation.y) * 10.0;
			tmpPos.z += Math.cos(engine.player.model.rotation.y) * 10.0;
			engine.camera.position.x = tmpPos.x;
			engine.camera.position.z = tmpPos.z;
		} else if (cameraView === 3) {
			let posDiff = engine.camera.position.clone().sub(engine.player.model.position);
	
			engine.camera.position.x -= posDiff.x / 40;
			engine.camera.position.z -= posDiff.z / 40;
			engine.camera.position.y = 20;
		} else if (cameraView === 4) {
			if (oldPositions.length > 20) {
				engine.camera.position.x = oldPositions[0][0];
				engine.camera.position.z = oldPositions[0][1];
				engine.camera.position.y = 100;
			}
		}
		if (oldPositions.length > 20) {
			oldPositions.shift();
		}
		oldPositions.push([
			engine.player.model.position.x,
			engine.player.model.position.z
		]);
		if (cameraView !== 1) {
			engine.camera.lookAt(playerModel.position);
		}
	}
	initMinimap() { // the letters h and w stand for widths and heights
		const canvas = document.getElementById("minimap");
		canvas.width = innerHeight / 2.5;
		canvas.height = innerHeight / 2.5;
		canvas.style.right = "0px";
		canvas.style.bottom = "0px";
		const ctx = canvas.getContext("2d");
		const array = this.engine.mapLoader.map.array;
		const h = array.length;
		const w = array[0].length;
		const maxLength = (h > w) ? h : w;
		const squareW = canvas.width / maxLength;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < h; i++) {
			for (let j = 0; j < w; j++) {
				let colorNum = this.engine.mapLoader.colors[ array[i][j] ]; // colors[ tileNumber ]
				ctx.fillStyle = "#" + colorNum.toString(16);
				ctx.fillRect(j * squareW, i * squareW, squareW, squareW);
			}
		}
		this.minimap.canvas = document.getElementById("minimapPlayers");
		this.minimap.ctx = this.minimap.canvas.getContext("2d");
		this.minimap.canvas.width = canvas.width;
		this.minimap.canvas.height = canvas.height;
		this.minimap.canvas.style.right = "0px";
		this.minimap.canvas.style.bottom = "0px";
		this.minimap.squareW = squareW;
	}
	updateMinimap() {
		const ctx = this.minimap.ctx;
		const arr = this.minimap.playerPos; // contains the positions where players have hit walls
		ctx.clearRect(0, 0, this.minimap.canvas.width, this.minimap.canvas.height);
		const playerX = this.engine.player.model.position.x / this.engine.mapLoader.map.tileScale;
		const playerY = this.engine.player.model.position.z / this.engine.mapLoader.map.tileScale;
		ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.arc(playerX * this.minimap.squareW, playerY * this.minimap.squareW, 3, 0, 2 * Math.PI);
		ctx.fill();
		for (let i = 0; i < arr.length; i++) {
			const pos = arr[i];
			const time = pos.time - Date.now();
			let alpha = 1;
			if (time < 0) {
				arr.splice(i, 1);
				continue ;
			}
			if (time < 1000) {
				alpha = time / 1000;
			}
			const hitX = pos.x * this.minimap.squareW;
			const hitY = pos.y * this.minimap.squareW;
			ctx.fillStyle = `rgba(${pos.r}, ${pos.g}, ${pos.b}, ${alpha})`;
			ctx.beginPath();
			ctx.arc(hitX, hitY, 2 * this.minimap.squareW, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	action(actionType, args) {
		switch (actionType) {
			case "shot":
				this.engine.shotController.newShot(args);
				break;
			case "invu":
				this.engine.player.setInvulnerable(args);
				break;
			case "playerHitsWall":
				this.minimap.playerPos.push(args);
				break;
		}
	}
    setupEvents() {
		this.positionController.setupEvents();
		this.socket.on("debugLog", msg => {
			console.log(msg);
		});
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
        this.socket.on("logAndComeBack", ()=>{
            brb();
		});

		this.socket.on("gameAction", (actionType, args) => {
			this.action(actionType, args);
		});
	}
}