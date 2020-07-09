const defActions = {
	up: "ArrowUp",
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight",
	w: "KeyW",
	a: "KeyA",
	s: "KeyS",
	d: "KeyD",
	r: "KeyR",
	f: "KeyF"
};

const defToggles = {
	showHitbox: "KeyH",
	camera1: "F1",
	camera2: "F2",
	camera3: "F3",
	camera4: "F4",
	controls: "KeyC"
};

let actions, toggles;

// TO DO: get user bindings or use default
actions = defActions;
toggles = defToggles;

const keyboard = {
	up: false,
	down: false,
	left: false,
	right: false,
	w: false,
	a: false,
	s: false,
	d: false,
	r: false,
	f: false,
	showHitbox: false,
	camera1: false,
	camera2: false,
	camera3: false,
	camera4: false,
	controls: false
};

document.onkeydown = e => {
	// console.log(e.code)
	for (key in actions) {
		if (e.code === actions[key]) {
			keyboard[key] = true;
			break ;
		}
	}
	if (/F[1-3]$/.test(e.code)) {
		return (false); // prevent default action for F1 f2 f3
	}
}

document.onkeyup = e => {
	// console.log(e.code)
	for (key in actions) {
		if (e.code === actions[key]) {
			keyboard[key] = false;
			break ;
		}
	}
	for (key in toggles) {
		if (e.code === toggles[key]) {
			keyboard[key] = !keyboard[key];
			break ;
		}
	}
}
