// needed to resolve absolute paths to modules
const { remote }  = require('electron');
const path        = require('path');
const appPath     = remote.app.getAppPath();

const Editor        = document.getElementById('editor');
const Macros        = require(path.resolve(appPath, './src/editor/editor.macros.json')); 
const Tokenizer     = require(path.resolve(appPath, './src/editor/editor.tokenizer.js')); 
const Parser        = require(path.resolve(appPath, './src/editor/editor.parser.js')); 
const { Event_Bus } = require(path.resolve(appPath, './src/main.js'));

// ----------------------------------------------------------------------------
Editor.evaluate = (e) => {
  // determine whether to evaluate the all the text or only a selected portion
  let partial = Editor.selectionStart !== Editor.selectionEnd;
  let text = partial ?
    Editor.value.substring(Editor.selectionStart, Editor.selectionEnd).replace(/\s+/g, ' ') :
    Editor.value.replace(/\s+/g, ' ')

  // convert raw text to token stream
  const tokens    = Tokenizer(text);
  // parse tokens into an object tree
  const obj_tree  = Parser(tokens);
  // 
  partial ? 
    Event_Bus.emit("Editor/update/partial", obj_tree) : 
    Event_Bus.emit("Editor/update", obj_tree);
}

Editor.insert_file_path = (path) => {
  let val   = Editor.value,
      start = Editor.selectionStart,
      end   = Editor.selectionEnd;

  // set textarea value to text before caret + tab + text after caret
  Editor.value = val.substring(0, start) + path + val.substring(end);

  // put caret at right position again
  Editor.selectionStart = Editor.selectionEnd = start + path.length;
}

Editor.insert_tab = (e) => {
  // prevent default beahaviour of tab key
  // (removing focus from the textarea element)
  e.preventDefault();
  // get caret position/selection
  let val   = Editor.value,
      start = Editor.selectionStart,
      end   = Editor.selectionEnd;

  // set textarea value to text before caret + tab + text after caret
  Editor.value = val.substring(0, start) + '  ' + val.substring(end);

  // put caret at right position again
  Editor.selectionStart = Editor.selectionEnd = start + 2;
}

Editor.sampler_macro = (e, expanded) => {
  e.preventDefault();
  // get caret position/selection
  let val     = Editor.value,
      start   = Editor.selectionStart,
      end     = Editor.selectionEnd;

  // grab either the expanded macro or a simplified one
  let sampler = expanded ? Macros.sampler.complete : Macros.sampler.slim;

  // set textarea value to text before caret + synth + text after caret
  Editor.value = val.substring(0, start) + sampler + val.substring(end);

  // put caret at right position to name element
  Editor.selectionStart = Editor.selectionEnd = start + 9;
}

Editor.synth_macro = (e, expanded) => {
  e.preventDefault();
  // get caret position/selection
  let val     = Editor.value,
      start   = Editor.selectionStart,
      end     = Editor.selectionEnd;

  // grab either the expanded macro or a simplified one
  let synth   = expanded ? Macros.synth.complete : Macros.synth.slim;

  // set textarea value to text before caret + synth + text after caret
  Editor.value = val.substring(0, start) + synth + val.substring(end);

  // put caret at right position to name element
  Editor.selectionStart = Editor.selectionEnd = start + 7;
}

Editor.meta_macro = () => {
  // get caret position/selection
  let val     = Editor.value,
      start   = Editor.selectionStart,
      end     = Editor.selectionEnd;

  let meta    = Macros.meta;

  // set textarea value to text before caret + meta + text after caret
  Editor.value = val.substring(0, start) + meta + val.substring(end);

  // put caret at right position to fill data
  Editor.selectionStart = Editor.selectionEnd = start + 14;
}

// automatically close typical character pairs such as [], {}, '', and ""
Editor.close_pair = (e) => {
  // prevent default beahaviour of tab key
  // (removing focus from the textarea element)
  e.preventDefault();
  // get caret position/selection
  let val     = Editor.value,
      start   = Editor.selectionStart,
      end     = Editor.selectionEnd;

  let pair    = e.key + ((key) => {
    switch (key) {
      case '[':
        return ']';
      case '{':
        return '}';
      case '\'':
        return '\'';
      case "\"":
        return "\"";
    }
  })(e.key);

  // set textarea value to text before caret + pair + text after caret
  Editor.value = val.substring(0, start) + pair + val.substring(end);

  // put caret inside the matched pair
  Editor.selectionStart = Editor.selectionEnd = start + 1;
}

Editor.addEventListener('keydown', (e) => {
  // poll for specific key presses
  switch (e.code) {
    case "Enter":
      if (e.ctrlKey)  Editor.evaluate(e);
      break;
    case "Tab":
      Editor.insert_tab(e);
      break;
    case "Digit0":
      if (e.ctrlKey)  Editor.meta_macro();
      break;
    case "Digit1":
      if (e.ctrlKey)  Editor.synth_macro(e, false);
      if (e.altKey)   Editor.synth_macro(e, true);
      break;
    case "Digit2":
      if (e.ctrlKey)  Editor.sampler_macro(e, false);
      if (e.altKey)   Editor.sampler_macro(e, true);
    case "Digit3":
    case "Digit4":
    case "Digit5":
    case "Digit6":
    case "Digit7":
    case "Digit8":
    case "Digit9":
      break;
    case "BracketLeft":
    case "Quote":
      Editor.close_pair(e);
      break;
  }
});

Event_Bus.on("Main/file_dropped", (path) => {
  Editor.insert_file_path(path);
})