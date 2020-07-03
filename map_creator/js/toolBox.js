const toolBox = document.getElementById("toolsPanel");
toolBox.hide = () => {
	toolBox.style.left = -500 + "px";
	toolBox.style.top = -500 + "px";
	toolBox.classList.add("transparent");
}
toolBox.show = (x, y) => {
	toolBox.style.left = x - (toolBox.offsetWidth / 2) + "px";
	toolBox.style.top = y + 25  + "px";
	toolBox.classList.remove("transparent");
}

{
	const colors = document.getElementById("colors").getElementsByClassName("color");
	for (let color of colors) {
		color.style.backgroundColor = color.getAttribute("color");
		color.onclick = e => {
			tampon = color.getAttribute("tileID");
			toolBox.hide();
		}
	}
	document.onmousedown = e => {
		if (e.buttons === 2) { // right click
			if (new Array(toolBox.classList).join("").match("transparent")) {
				toolBox.show(e.clientX, e.clientY);
			} else {
				toolBox.hide();
			}
		}
		e.preventDefault();
	}
	document.oncontextmenu = () => {
		return (false);
	}
}