const world_scale = 0.1;

const vehicles = [
    {id: "red_car", name: "Red Car"},
    {id: "wolfgang", name: "Wolfgang"},
    {id: "future", name: "Furture"},
    //{id: "cute_car", name: "Cute Car"},
    //{id: "brown", name: "Brown"}
];

const defActions = {
	up: {key: "ArrowUp", display: "Game Forward"},
	down: {key: "ArrowDown", display: "Game Backward"},
	left: {key: "ArrowLeft", display: "Game Left"},
	right: {key: "ArrowRight", display: "Game Right"},
	w: {key: "KeyW", display: "Editor Forward"},
	a: {key: "KeyA", display: "Editor Left"},
	s: {key: "KeyS", display: "Editor Backward"},
	d: {key: "KeyD", display: "Editor Right"},
	r: {key: "KeyR", display: "R"},
	f: {key: "KeyF", display: "F"},
	shootRed: {key: "KeyZ", display: "Shoot Red"},
	shootBlue: {key: "KeyX", display: "Shoot Blue"}
};

const defToggles = {
	showHitbox: {key: "KeyH", display: "Toggle Hitboxes"},
	camera1: {key: "F1", display: "Camera 1"},
	camera2: {key: "F2", display: "Camera 2"},
	camera3: {key: "F3", display: "Camera 3"},
    camera4: {key: "F4", display: "Camera 4"},
	controls: {key: "KeyC", display: "Open Controls Menu"}
};