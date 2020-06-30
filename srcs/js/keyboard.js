const defActions = {
	up: "ArrowUp",
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight"
};

const defToggles = {
	lockCamera: "KeyY"
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
	lockCamera: false
};

document.onkeydown = e => {
	// console.log(e.code)
	for (key in actions) {
		if (e.code === actions[key]) {
			keyboard[key] = true;
			break ;
		}
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
