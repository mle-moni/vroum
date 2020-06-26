const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const rectGeometry = new THREE.BoxGeometry(100, 10, 10);

const redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
const greenMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const blueMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});

const player = new THREE.Mesh(cubeGeometry, redMaterial);
const cube = new THREE.Mesh(cubeGeometry, blueMaterial);
const rect = new THREE.Mesh(rectGeometry, greenMaterial);

cube.position.set(10, 0, -110);
rect.position.set(10, 0, -150);

player.position.z = -100;
player.add(camera);
camera.position.set( 0, 50, 100 );


scene.add(player);
scene.add(cube);
scene.add(rect);

const world = {
	models: {
		player
	},
	camera
};

const animate = () => {
	updateGame(world);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

animate();