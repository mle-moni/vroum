class Engine {
	constructor (modelsPaths, game, settings={skin: "red_car", name: ""}) {
		this.settings = settings;
		this.game = game;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xdddddd);
		this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 10000);

		// we will use this to get the delta time
		this.clock = new THREE.Clock();

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(innerWidth, innerHeight);
		document.body.append(this.renderer.domElement);

		this.setLights();

		this.defaultPos = new THREE.Vector3();
		this.prototypes = [];
		this.mapLoader = new MapLoader(this);
		this.mapLoader.load(map2);
		this.collider = new Collider(this.mapLoader, this);
		this.player = null;
		this.actors = {
			player: this.player
		};
		this.skins = [];

		this.loadModels(modelsPaths);
	}
	setLights() {
		const ambientLight = new THREE.AmbientLight(0x404040, 5);
		this.scene.add(ambientLight);

		const light = new THREE.PointLight(0xc4c4c4, 8);
		light.position.set(0,4000,0);
		this.scene.add(light);
	}
	loadModels(modelsPaths) {
		/*
			loading 3d models and saving them in this.prototypes
			so we can easyly create cars with differents skins by cloning the prototypes
		*/
		const loader = new THREE.GLTFLoader();
		let modelsLoaded = 0;

		for (let i = 0; i < modelsPaths.length; i++) {
			loader.load(modelsPaths[i], gltf => {
				const model = gltf.scene;
				const skinName = this.getFileName(modelsPaths[i]);
				this.prototypes[skinName] = model;
				this.skins.push(skinName);
				modelsLoaded++;
				if (modelsLoaded === modelsLoaded) {
					this.startGame(this);
				}
			});
		}
	}
	getFileName(path) {
		// path exemple "/srcs/models/red_car.glb"
		const split = path.split("/");
		// ["", "srcs", "models", "red_car.glb"]
		const nameAndExtension = split[split.length - 1];
		// "red_car.glb"
		return (nameAndExtension.split(".glb")[0]);
	}

	skinExists(skin) {
		return (this.prototypes.hasOwnProperty(skin));
	}

	// this function is called AFTER loading ALL the 3D models
	startGame() {
		// creating our player with a red car skin
		this.player = new Car(this.settings.skin, this, this.settings.name);
		
		this.player.model.position.set(
			this.defaultPos.x,
			this.defaultPos.y,
			this.defaultPos.z
		);
		// adding camera to player so the camera follows him
		this.player.model.add(this.camera);
		this.camera.position.set(0, 50, 100);
		this.actors.player = this.player;
		this.scene.add(this.actors.player.model);
		
		this.animate();
	}
	animate() {
		let deltaTime = this.clock.getDelta() * 1000;
		this.game.update(this, deltaTime);
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(()=>{
			this.animate();
		});
	}
}