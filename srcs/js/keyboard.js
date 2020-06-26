const defBindings = {
	up: "ArrowUp",
	down: "ArrowDown",
	left: "ArrowLeft",
	right: "ArrowRight"
};

let bindings;

// TO DO: get user bindings or use default
bindings = defBindings;

const keyboard = {
	up: false,
	down: false,
	left: false,
	right: false
};

document.onkeydown = e => {
	// console.log(e)
	switch (e.code) {
		case bindings.up:
			keyboard.up = true;
			break;
		case bindings.down:
			keyboard.down = true;
			break;
		case bindings.left:
			keyboard.left = true;
			break;
		case bindings.right:
			keyboard.right = true;
			break;
	}
}

document.onkeyup = e => {
	// console.log(e)
	switch (e.code) {
		case bindings.up:
			keyboard.up = false;
			break;
		case bindings.down:
			keyboard.down = false;
			break;
		case bindings.left:
			keyboard.left = false;
			break;
		case bindings.right:
			keyboard.right = false;
			break;
	}
}
