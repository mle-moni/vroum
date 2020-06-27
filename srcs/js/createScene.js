const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const rectGeometry = new THREE.BoxGeometry(100, 10, 10);

const greenMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const blueMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});

const cube = new THREE.Mesh(cubeGeometry, blueMaterial);
const rect = new THREE.Mesh(rectGeometry, greenMaterial);

cube.position.set(10, 0, -110);
rect.position.set(10, 0, -150);

scene.add(cube);
scene.add(rect);

ambientLight = new THREE.AmbientLight(0x404040,100);
scene.add(ambientLight);

hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const models = [];

const world = {
	prototypes: [],
	models: {
		player: null
	},
	camera,
	scene
};

let loader = new THREE.GLTFLoader();
loader.load("/srcs/models/red_car.glb", function(gltf){
  car = gltf.scene;
  let s = 10;
  car.scale.set(s, s, s);
  world.prototypes["red_car"] = car;
  startGame(world);
});

function startGame(world) {
	player = world.prototypes["red_car"].clone();
	player.position.set(0, 0, -100);
	player.add(camera);
	
	camera.position.set(0, 5, 10);
	world.models.player = player;
	scene.add(world.models.player);

	animate();
}

function animate() {
	updateGame(world);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}