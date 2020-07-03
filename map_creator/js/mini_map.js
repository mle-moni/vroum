const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/*
	get sub array of 20*20 tiles from pinPos
	we assume that the reference array is at least 20*20
*/
function getSubarray(arr) {
	const subarr = [];
	let x = pinPos.x - 10;
	let y = pinPos.y - 10;
	if (x < 0) {
		x = 0;
	}
	if (y < 0) {
		y = 0;
	}
	if (y + 20 > arr.length) {
		y = arr.length - 20;
	}
	if (x + 20 > arr[y].length) {
		x = arr[y].length - 20;
	}
	for (let i = 0; i < 20; i++) {
		subarr[i] = arr[i + y].slice(x, x + 20);
	}
	offset.x = x;
	offset.y = y;
	return (subarr);
}

setInterval(()=>{
	if (map.array.length === 0) {
		return ;
	}
	const colors = ["#7e6cd9", "#90a395", "#b0985a", "#9e2a2b"];
	let subArray = getSubarray(map.array);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// each square is "size" px
	const size = 20;
	for (let i = 0; i < subArray.length; i++) {
		for (let j = 0; j < subArray[i].length; j++) {
			ctx.fillStyle = colors[ subArray[i][j] ];
			ctx.fillRect(j * size, i * size, size, size);
		}
	}
	ctx.fillStyle = "black";
	for (let i = 0; i < 20; i++) {
		ctx.beginPath();
		ctx.moveTo(i * size, 0);
		ctx.lineTo(i * size, size * 20);
		ctx.stroke();
	}
	for (let i = 0; i < 20; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * size);
		ctx.lineTo(size * 20, i * size);
		ctx.stroke();
	}
}, 50);
