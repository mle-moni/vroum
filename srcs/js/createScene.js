const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);

let camLock = true;

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

ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

light = new THREE.PointLight(0xc4c4c4, 8);
light.position.set(0,400,0);
scene.add(light);

const world = {
	prototypes: [],
	actors: {
		player: null
	},
	camera,
	scene
};

let loader = new THREE.GLTFLoader();
loader.load("/srcs/models/red_car.glb", function(gltf){
  const car = gltf.scene;
  let s = 10;
  car.scale.set(s, s, s);
  world.prototypes["red_car"] = car;
  startGame(world);
});

function startGame(world) {
	player = new Car("red_car", world.prototypes);
	
	player.model.position.set(0, 0, -100);
	player.model.add(camera);
	
	camera.position.set(0, 5, 10);
	world.actors.player = player;
	scene.add(world.actors.player.model);

	animate();
}

function animate() {
	updateGame(world);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}