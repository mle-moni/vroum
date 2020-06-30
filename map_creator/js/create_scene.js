const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 100000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement);

ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

light = new THREE.PointLight(0xc4c4c4, 8);
light.position.set(0,4000,0);
scene.add(light);

world = {
	prototypes: [],
	actors: {
		player: null
	},
	camera,
	scene,
	defaultPos: {x: 0, y: 0, z: 0}
};

mapLoader = new MapLoader(world);
mapLoader.load(map.array);

const sphereGeometry = new THREE.SphereGeometry( 50, 320, 320 );
pin = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({color: 0xf28482}));
pin.position.y = 50;
scene.add(pin);


startGame(world);
// this function has to be called AFTER loading ALL the 3D models
function startGame(world) {
	world.camera.position.set(
		world.defaultPos.x,
		100,
		world.defaultPos.z
	);
	animate();
}

function animate() {
	updateGame(world);
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

function updateGame(world) {
	// update the speed vector considering the inputs of the player
	if (keyboard.right) {
		world.camera.rotation.y -= 0.05;
	}
	if (keyboard.left) {
		world.camera.rotation.y += 0.05;
	}
	if (keyboard.up) {
		world.camera.position.z -= Math.cos(world.camera.rotation.y) * 50;
		world.camera.position.x -= Math.sin(world.camera.rotation.y) * 50;
	}
	if (keyboard.down) {
		world.camera.position.z += Math.cos(world.camera.rotation.y) * 50;
		world.camera.position.x += Math.sin(world.camera.rotation.y) * 50;
	}
	if (keyboard.r) {
		world.camera.position.y += 30;
	}
	if (keyboard.f) {
		world.camera.position.y -= 30;
	}
	if (keyboard.w) {
		if (map.array.length !== 0) {
			if (pinPos.x < map.array[0].length - 1) {
				pinPos.x++;
			}
		}
	}
	if (keyboard.s) {
		if (pinPos.x > 0) {
			pinPos.x--;
		}
	}
	if (keyboard.a) {
		if (pinPos.y > 0) {
			pinPos.y--;
		}
	}
	if (keyboard.d) {
		if (pinPos.y < map.array.length - 1) {
			pinPos.y++;
		}
	}
	pin.position.set(
		pinPos.x * map.tileScale,
		40,
		pinPos.y * map.tileScale
	);
	// world.camera.lookAt(lookAt);
}