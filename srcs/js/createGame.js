keyboard.camera1 = true;
let camLock = false;
let cameraView = 1;

const oldPositions = [];

const toast = siiimpleToast;

// create controls settings dom
bindingSettingsInit();

// create a new scope
{
	function updateGame(game, dt) {
		const playerModel = game.player.model;
	
		// update the speed vector considering the inputs of the player
		if (keyboard.right) {
			game.player.physics.goRight(dt);
		}
		if (keyboard.left) {
			game.player.physics.goLeft(dt);
		}
		if (keyboard.up) {
			game.player.physics.accelerate(dt);
		}
		if (keyboard.down) {
			game.player.physics.reverseGear(dt);
		}
		// update player pos with the speed vector
		game.player.physics.updatePos(dt);
	
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
			playerModel.add(game.camera);
			game.camera.position.set(0, 50, 100);
		}
		if (cameraView !== 1 && camLock) { // unlock camera from player for others camera views
			camLock = false;
			playerModel.remove(game.camera);
			game.camera.position.y = 300;
			game.camera.position.x = game.player.model.position.x;
			game.camera.position.z = game.player.model.position.z;
		}
		if (cameraView === 2) {
			let posDiff = game.camera.position.clone().sub(game.player.model.position);
	
			game.camera.position.x -= posDiff.x / 40;
			game.camera.position.z -= posDiff.z / 40;
			game.camera.position.y = 200;
		} else if (cameraView === 3) {
			if (oldPositions.length > 20) {
				game.camera.position.x = oldPositions[0][0];
				game.camera.position.z = oldPositions[0][1];
				game.camera.position.y = 1000;
			}
		}
		if (oldPositions.length > 20) {
			oldPositions.shift();
		}
		oldPositions.push([
			game.player.model.position.x,
			game.player.model.position.z
		]);
		game.camera.lookAt(playerModel.position);
	
		if (keyboard.showHitbox) {
			game.player.toggleHitbox();
			keyboard.showHitbox = false;
		}
	}
	
	const socket = io.connect(location.origin);

	connectSocket(socket);
	
	const game = new Game(["/srcs/models/red_car.glb"], socket, toast, updateGame);
}