const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);

let camLock = true;

// we will use this to get the delta time
const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement);

ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

light = new THREE.PointLight(0xc4c4c4, 8);
light.position.set(0,4000,0);
scene.add(light);

const world = {
	prototypes: [],
	actors: {
		player: null
	},
	camera,
	scene,
	clock,
	defaultPos: {x: 0, y: 0, z: 0},
	collider: null
};

const mapLoader = new MapLoader(world);
mapLoader.load(map1);

world.collider = new Collider(mapLoader, world);

/*
	loading 3d models and saving them in word.prototypes
	so we can easyly create cars with differents skins by cloning the prototypes
*/
let loader = new THREE.GLTFLoader();
loader.load("/srcs/models/red_car.glb", function(gltf){
	const car = gltf.scene;
	world.prototypes["red_car"] = car;
	startGame(world);
});

// this function has to be called AFTER loading ALL the 3D models
function startGame(world) {
	// creating our player with a red car skin
	const player = new Car("red_car", world);
	
	player.model.position.set(
		world.defaultPos.x,
		world.defaultPos.y,
		world.defaultPos.z
	);
	// adding camera to player so the camera follows him
	player.model.add(camera);
	camera.position.set(0, 50, 100);
	world.actors.player = player;
	scene.add(world.actors.player.model);

	animate();
}

function animate() {
	let deltaTime = clock.getDelta() * 1000;
	updateGame(world, deltaTime);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}