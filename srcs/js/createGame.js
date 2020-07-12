let camLock = false;
let cameraView = 1;

const oldPositions = [];

// simple notification messages library
const toast = siiimpleToast;

// create controls settings dom
bindingSettingsInit();

// create a new scope
{
	const socket = io.connect(location.origin);

	connectSocket(socket);
	
	const game = new Game(["red_car", "future", "wolfgang"], socket, toast);
}