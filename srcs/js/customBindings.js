let currentEditing = ""

document.body.onkeyup = e => {
    let type = actions[currentEditing] ? actions : toggles;

    if (e.code == toggles["controls"].key && currentEditing == "") {
        document.getElementById("controls-settings").style.display = (document.getElementById("controls-settings").style.display == "none") ? "block" : "none";
    }
    if (currentEditing === "") {
        return;
    }
    if (e.which == 27) {
        document.getElementById("setting-" + currentEditing).innerHTML = type[currentEditing].key;
        return (currentEditing = "");
    }
    for (control in actions) {
        if (actions[control].key == e.code && control != currentEditing)
            return;
    }
    for (control in toggles) {
        if (toggles[control].key == e.code && control != currentEditing)
            return;
    }
    type[currentEditing].key = e.code;
    document.getElementById("setting-" + currentEditing).innerHTML = e.code;
    currentEditing = "";
}

function bindingSettingsInit()
{
    let htmlControlsSettings = document.createElement("div");

    htmlControlsSettings.id = "controls-settings";
    for (id in actions) {
        htmlControlsSettings.appendChild(addControlSetting(id, actions[id]));
    }
    for (control in toggles) {
        htmlControlsSettings.appendChild(addControlSetting(control, toggles[control]));
    }
    htmlControlsSettings.style.display = "none";
    document.body.appendChild(htmlControlsSettings);
}

function addControlSetting(id, control)
{
    let container = document.createElement("div");
    let label = document.createElement("label");
    let button = document.createElement("button");

    label.innerText = control.display;
    label.className = "control-label";
    button.innerText = control.key;
    button.className = "control-button";
    button.id = "setting-" + id;
    button.onclick = e => {
        let type = actions[currentEditing] ? actions : toggles;

        if (currentEditing != "") {
            document.getElementById("setting-" + currentEditing).innerHTML = type[currentEditing].key;
        }
        currentEditing = id;
        document.getElementById("setting-" + currentEditing).innerHTML = "Editing...";
    }
    container.className = "control-box";
    container.appendChild(label);
    container.appendChild(button);
    return (container);
}
