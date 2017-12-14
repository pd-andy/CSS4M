// needed to resolve absolute paths to require modules
let { remote }  = require('electron');
let path        = require('path');
let appPath     = remote.app.getAppPath();

const Events = require('events');
const Event_Emitter = new Events.EventEmitter();

// ----------------------------------------------------------------------------
module.exports.Event_Bus = Event_Emitter;

document.ondragover = document.ondrop = (e) => {
  e.preventDefault();
}

document.body.ondrop = (e) => {
  e.preventDefault();
  
  module.exports.Event_Bus.emit("Main/file_dropped", e.dataTransfer.files[0].path);
}

window.onload = () => {
  Gibberish.init();
  
  require(path.resolve(appPath, './src/editor/editor.js'));
  require(path.resolve(appPath, './src/audio/audio.core.js'));
}