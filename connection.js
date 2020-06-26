const socket = io.connect(location.origin);

function brb() {
	sessionStorage.setItem("goTo", location.pathname);
	location.replace("/login");
}

if (localStorage.getItem('psd')) {
	sessionStorage.setItem('psd', localStorage.getItem('psd'))
}
if (localStorage.getItem('passwd')) {
	sessionStorage.setItem('passwd', localStorage.getItem('passwd'))
}
const connectObj = {
	psd: sessionStorage.getItem('psd'),
	passwd: sessionStorage.getItem('passwd')
};
if (connectObj.psd !== null && connectObj.passwd !== null) {
	socket.emit("connectemoistp", connectObj, "hard");
} else {
	brb();
}
