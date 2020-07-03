const size = 20;
let I_can_draw = false;

canvas.onmousedown = (e)=>{
	const array = map.array;
	e.preventDefault();
	I_can_draw = true;
	const req = {x: parseInt(e.layerX/size), y: parseInt(e.layerY/size)};
	if (e.button === 0) { // left click
		array[req.y + offset.y][req.x + offset.x] = tampon;
	}
	mapLoader.replaceTile(req.x + offset.x, req.y + offset.y, tampon);
}
canvas.onmousemove = (e)=>{
	if (I_can_draw) {
		const req = {x: parseInt(e.layerX/size), y: parseInt(e.layerY/size)};
		map.array[req.y + offset.y][req.x + offset.x] = tampon;
		mapLoader.replaceTile(req.x + offset.x, req.y + offset.y, tampon);
	}
}
document.body.onmouseup = ()=>{
	I_can_draw = false;
}
