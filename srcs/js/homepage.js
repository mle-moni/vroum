window.onload = () => {
    const socket = io.connect(location.origin);
    connectSocket(socket);
    
    const home_view = new HomeView(vehicles);
    const models_dropdown = document.getElementById("input-skin");
    
    document.getElementById("logged-as").innerHTML = sessionStorage.getItem('psd');
    document.getElementById("join-session").onclick = e => {
        let gameid = document.getElementById("input-room-id").value;
        location.replace(`${location.origin}/game?${gameid}`);
    }
}

class HomeView {
	constructor (models) {
        this.firstRun = true;
		let settings = {
			skin: sessionStorage.getItem('skin')
		};
		if (!settings.skin) {
            settings.skin = "red_car";
		}
		this.engine = new Engine(models, this, settings);
    }
    update(engine, dt) {
        const playerModel = engine.player.model;

        if (this.firstRun) {
            engine.camera.rotation.set(-0.35, 0, 0);
            playerModel.remove(engine.camera);
            engine.skins.forEach(element =>{
                var holder = document.getElementById("input-skin");
                var dom_option = document.createElement("option");
                var currentSkin = sessionStorage.getItem("skin");
                dom_option.innerHTML = element;
                dom_option.value = element;
                if (element == currentSkin)
                    dom_option.selected = true;
                holder.appendChild(dom_option);
            });
            document.getElementById("input-skin").onchange = e => {
                var currentRot = engine.player.model.rotation;
                engine.scene.remove(engine.actors.player.model);
                engine.player.skin = e.target.value;
                engine.player.model = engine.prototypes[e.target.value].clone();
                engine.player.model.rotation.set(currentRot.x, currentRot.y, currentRot.z);
                engine.scene.add(engine.actors.player.model);
                sessionStorage.setItem("skin", e.target.value);
            }
            this.firstRun = false;
        }
        playerModel.rotation.set(playerModel.rotation.x, playerModel.rotation.y + 0.005, playerModel.rotation.z);
        this.cameras();
    }
	cameras() {
		const engine = this.engine;
        const playerModel = engine.player.model;
        const cameraPos = new THREE.Vector3( -20*world_scale, 20*world_scale, 40*world_scale );
        

        playerModel.position.set(20*100/2, 5, 20*100/2);
        cameraPos.add(playerModel.position);
		engine.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    }
}