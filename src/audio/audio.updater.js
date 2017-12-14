// needed to resolve absolute paths to modules
const { remote }  = require('electron');
const path        = require('path');
const appPath     = remote.app.getAppPath();

const { Event_Bus } = require(path.resolve(appPath, './src/main.js'));
const Audio_Tree    = require(path.resolve(appPath, './src/audio/audio.tree.js'));

// ----------------------------------------------------------------------------
const Audio_Updater = {
  "update_tree" : {},
  "new_update"  : false,
  "update_type" : "",
  "update"      : () => {
    if (Audio_Updater.new_update) {
      Event_Bus.emit("Audio/update/" + Audio_Updater.update_type, Audio_Updater.update_tree);
      Audio_Updater.new_update = false;
    }
  }
}

Event_Bus.on("Editor/update/partial", (obj_tree) => {
  Audio_Updater.new_update = false;
  if (Audio_Updater.update_tree !== obj_tree) {
    Audio_Updater.update_tree   = obj_tree;
    Audio_Updater.new_update    = true;
    Audio_Updater.update_type   = "partial";
  }
})

Event_Bus.on("Editor/update", (obj_tree) => {
  Audio_Updater.new_update = false;
  if (Audio_Updater.update_tree !== obj_tree) {
    Audio_Updater.update_tree   = obj_tree;
    Audio_Updater.new_update    = true;
    Audio_Updater.update_type   = "complete";
  }
})

Gibberish.Sequencer({
  target  : Audio_Updater,
  key     : "update",
  values  : [],
  timings : [Audio_Tree.meta.timing["1/4"]()],
}).start()

module.exports = Audio_Updater;