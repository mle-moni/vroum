// stringify "map" and copy it into the clipboard  

function exportMap() {
	let str = `const ${map.title} = ` + JSON.stringify(map) + ";";
	copyToClipboard(str);
}

const copyToClipboard = str => {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
};