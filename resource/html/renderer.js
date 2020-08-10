// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');
var image_count = 0;
var content_image = "";
var style_image = "";
const content_dragWrapper = document.getElementById("content_box");
const style_dragWrapper = document.getElementById("style_box");

content_dragWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
        const path = files[0].path;
        ipcRenderer.send('content_drag', path);
        content_image = path;
        image_count += 1;
        document.getElementById('content_image').src = path;
    }

    if (content_image != "" && style_image != "") {
        document.getElementById("loading").style.display = "block";
        setTimeout(function () {
            inference = ipcRenderer.sendSync('getInference');
            document.getElementById("generated_image").src = "data:image/png;base64," + inference;
            document.getElementById("loading").style.display = "none";
        }, 500);
    }
})

style_dragWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
        const path = files[0].path;
        ipcRenderer.send('style_drag', path);
        style_image = path;
        image_count += 1;
        document.getElementById('style_image').src = path;
    }

    if (content_image != "" && style_image != "") {
        document.getElementById("loading").style.display = "block";
        setTimeout(function () {
            inference = ipcRenderer.sendSync('getInference');
            document.getElementById("generated_image").src = "data:image/png;base64," + inference;
            document.getElementById("loading").style.display = "none";
        }, 500);
    }
})

content_dragWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
})

style_dragWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
})