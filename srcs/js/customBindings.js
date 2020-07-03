let currentEditing = ""

document.body.onkeyup = e => {
    let type = actions[currentEditing] ? actions : toggles;

    if (e.code == toggles["controls"] && currentEditing == "") {
        document.getElementById("controls-settings").style.display = (document.getElementById("controls-settings").style.display == "none") ? "block" : "none";
    }
    if (currentEditing === "") {
        return;
    }
    if (e.which == 27) {
        document.getElementById("setting-" + currentEditing).innerHTML = type[currentEditing];
        return (currentEditing = "");
    }
    for (key in actions) {
        if (actions[key] == e.code && key != currentEditing)
            return;
    }
    for (key in toggles) {
        if (toggles[key] == e.code && key != currentEditing)
            return;
    }
    type[currentEditing] = e.code;
    document.getElementById("setting-" + currentEditing).innerHTML = e.code;
    currentEditing = "";
    console.log(e.code);
}

function bindingSettingsInit()
{
    let htmlControlsSettings = document.createElement("div");

    htmlControlsSettings.id = "controls-settings";
    for (key in actions) {
        htmlControlsSettings.appendChild(addControlSetting(key, actions[key]));
    }
    for (key in toggles) {
        htmlControlsSettings.appendChild(addControlSetting(key, toggles[key]));
    }
    htmlControlsSettings.style.display = "none";
    document.body.appendChild(htmlControlsSettings);
}

function addControlSetting(key, value)
{
    let container = document.createElement("div");
    let label = document.createElement("label");
    let button = document.createElement("button");

    label.innerText = key;
    label.className = "control-label";
    button.innerText = value;
    button.className = "control-button";
    button.id = "setting-" + key;
    button.onclick = e => {
        let type = actions[currentEditing] ? actions : toggles;

        if (currentEditing != "") {
            document.getElementById("setting-" + currentEditing).innerHTML = type[currentEditing];
        }
        currentEditing = key;
        document.getElementById("setting-" + currentEditing).innerHTML = "Editing...";
    }
    container.className = "control-box";
    container.appendChild(label);
    container.appendChild(button);
    return (container);
}
