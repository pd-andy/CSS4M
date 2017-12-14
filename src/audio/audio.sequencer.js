// needed to resolve absolute paths to modules
const { remote }  = require('electron');
const path        = require('path');
const appPath     = remote.app.getAppPath();

const Audio_Tree  = require(path.resolve(appPath, './src/audio/audio.tree.js'));

module.exports = (params, target) => {
  const sequence_notes  = params.sequence[0];
  const sequence_timing = ((timings) => {
    let calc_timing = [];

    if (timings.length !== 0) {
      for (let t of timings) {
        let time_in_samples;
        switch (t) {
          case 1:
            time_in_samples = Audio_Tree.meta.timing["1/1"]();
            break;
          case 3:
            time_in_samples = Audio_Tree.meta.timing["1/3"]();
          case 2:
            time_in_samples = Audio_Tree.meta.timing["1/2"]();
            break;
          case 4:
            time_in_samples = Audio_Tree.meta.timing["1/4"]();
            break;
          case 6:
            time_in_samples = Audio_Tree.meta.timing["1/6"]();
            break;
          case 8:
            time_in_samples = Audio_Tree.meta.timing["1/8"]();
            break;
          case 12:
            time_in_samples = Audio_Tree.meta.timing["1/12"]();
            break;
          case 16:
            time_in_samples = Audio_Tree.meta.timing["1/16"]();
            break;
          case 32:
            time_in_samples = Audio_Tree.meta.timing["1/32"]();
            break;
          default:
            time_in_samples = Audio_Tree.meta.timing["1/4"]();
            break;
        }
        calc_timing.push(time_in_samples);
      }
    } else {
      calc_timing.push(Audio_Tree.meta.timing["1/4"]());
    }

    return calc_timing
  })(params.sequence[1] || []);
  // if params.sequence[1] is undefined pass in an empty array

  return sequencer = Gibberish.Sequencer({
    target:   target, 
    key:      'note',
    values:   sequence_notes, 
    timings:  sequence_timing
  }).start();
}