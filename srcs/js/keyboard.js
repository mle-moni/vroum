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
	controls: false,
	shootRed: false,
	shootBlue: false
};

document.onkeydown = e => {
	// console.log(e.code)
	for (control in actions) {
		if (e.code === actions[control].key) {
			keyboard[control] = true;
			break ;
		}
	}
	if (/F[1-3]$/.test(e.code)) {
		return (false); // prevent default action for F1 f2 f3
	}
}

document.onkeyup = e => {
	// console.log(e.code)
	for (id in actions) {
		if (e.code === actions[id].key) {
			keyboard[id] = false;
			break ;
		}
	}
	for (id in toggles) {
		if (e.code === toggles[id].key) {
			keyboard[id] = !keyboard[id];
			break ;
		}
	}
}
