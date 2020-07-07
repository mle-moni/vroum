class Engine {
	constructor (models, game, settings={skin: "red_car", name: ""}) {
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

		this.loadModels(models);
	}
	setLights() {
		const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xb0985a, 0.65 );
		hemiLight.position.set( 0, 500, 0 );
		this.scene.add( hemiLight );

		const dirLight = new THREE.DirectionalLight( 0xeb9a94, 0.5 );
		dirLight.position.set( -1, 0.75, 1 );
		dirLight.position.multiplyScalar( 50);
		dirLight.name = "dirlight";
		this.scene.add( dirLight );
	}
	loadModels(models) {
		/*
			loading 3d models and saving them in this.prototypes
			so we can easyly create cars with differents skins by cloning the prototypes
		*/
		const loader = new THREE.GLTFLoader();
		let modelsLoaded = 0;

		for (let i = 0; i < models.length; i++) {
			loader.load("/srcs/models/" + models[i] + ".glb", gltf => {
				const model = gltf.scene;
				const skinName = models[i];
				this.prototypes[skinName] = model;
				this.skins.push(skinName);
				modelsLoaded++;
				if (modelsLoaded === models.length) {
					this.startGame(this);
				}
			});
		}
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