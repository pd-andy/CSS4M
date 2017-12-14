// needed to resolve absolute paths to modules
const { remote }  = require('electron');
const path        = require('path');
const appPath     = remote.app.getAppPath();

const { Event_Bus }     = require(path.resolve(appPath, './src/main.js'));
module.exports = Audio  = {
  Tree    : require(path.resolve(appPath, './src/audio/audio.tree.js')),
  Updater : require(path.resolve(appPath, './src/audio/audio.updater.js')),
  Objects: {
    Sampler   : Gibberish.instruments.Sampler,
    Sequencer : require(path.resolve(appPath, './src/audio/audio.sequencer.js')),
    Synth     : Gibberish.instruments.Synth,
  }
}

// ----------------------------------------------------------------------------
const addNode = (params) => {
  switch (params.node) {
    case 'synth':
      Audio.Tree[params.name] = Audio.Objects.Synth(params).connect();
      if (params.sequence) 
       Audio.Tree[params.name + "/seq"] = Audio.Objects.Sequencer(params, Audio.Tree[params.name]);
      break;
    case 'sampler':
      Audio.Tree[params.name] = Audio.Objects.Sampler(params).connect();
      if (params.sequence) 
        Audio.Tree[params.name + "/seq"] = Audio.Objects.Sequencer(params, Audio.Tree[params.name]);
      break;
  }
}

const removeNode = (name) => {
  // stop sequencer object and delete
  if (Audio.Tree[name + "/seq"]) {
    Audio.Tree[name + "/seq"].stop();
    delete Audio.Tree[name + "/seq"]
  }

  // disconnect audio node and delete
  Audio.Tree[name].disconnect();
  delete Audio.Tree[name];
}

const updateNode = (params) => {
  // assign takes a target object and copies the parameters of any
  // proceeding objects into it. Essentially merges the objects together
  Object.assign(Audio.Tree[params.name], params);

  // If a sequence key exists in the updated parameters we need to update/create that
  // too. If not check if a sequencer already exists and delete it if that is the case
  if (params.sequence) {
    // stop the current sequencer before updating its parameters
    if (Audio.Tree[params.name + "/seq"]) {
      Audio.Tree[params.name + "/seq"].stop();
    }
    // create a new sequencer with the updated parameters
    Audio.Tree[params.name + "/seq"] = Audio.Objects.Sequencer(params, Audio.Tree[params.name]);
  } else {
    if (Audio.Tree[params.name + "/seq"]) {
      // stop sequencer object and delete
      Audio.Tree[params.name + "/seq"].stop();
      delete Audio.Tree[params.name + "/seq"];
    }
  }
}

Event_Bus.on("Audio/update/partial", (obj_tree) => {
  // cycle through new audio nodes
  for (new_node of obj_tree) {
    // check if new audio node already exists in current tree
    if (Audio.Tree[new_node.name]) {
      // check if new audio node is the same type as current audio node
      // e.g. 'synth'
      if (Audio.Tree[new_node.name].node === new_node.node) {
        updateNode(new_node);
      } else {
        // if the type is different, remove the current node and create a new one
        // with the updated type
        removeNode(new_node.name);
        addNode(new_node);
      }
    } else {
      // create a new audio node if it doesn't already exist in the tree
      addNode(new_node);
    }
  }
})

Event_Bus.on("Audio/update/complete", (obj_tree) => {
  // cycle through current audio nodes
  for (old_node_key in Audio.Tree) {
    // don't delete meta object even if it isn't defined
    // in user input
    if (old_node_key !== "meta") {
      // if the updated audio tree doesn't contain the current audio node
      // delete it
      if (!obj_tree[old_node_key]) {
        removeNode(old_node_key);
      }
    }
  }

  // cycle through new audio nodes
  for (new_node of obj_tree) {
    // check if new audio node already exists in current tree
    if (Audio.Tree[new_node.name]) {
      // check if new audio node is the same type as current audio node
      // e.g. 'synth'
      if (Audio.Tree[new_node.name].node === new_node.node) {
        updateNode(new_node);
      } else {
        // if the type is different, remove the current node and create a new one
        // with the updated type
        removeNode(new_node.name);
        addNode(new_node);
      }
    } else {
      // create a new audio node if it doesn't already exist in the tree
      console.log(new_node);
      addNode(new_node);
    }
  }
})