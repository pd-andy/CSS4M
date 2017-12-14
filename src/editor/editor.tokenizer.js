// needed to resolve absolute paths to modules
const { remote }  = require('electron');
const path        = require('path');
const appPath     = remote.app.getAppPath();

const Moo         = require('moo');

// ----------------------------------------------------------------------------
module.exports = (input_stream) => {
  const KEWYORDS  = [
    'meta',
    'synth',
    'drum',
    'sampler',
  ];

  const lexer = Moo.compile({
    "OBJECT": 
      KEWYORDS,
    // match rules are regular expressions
    // optional value field can transform data before returning it
    "KEY":
      // match one or more letters proceeded by any amount of white space proceeded by a ':'
      // strip the whitespace and remove the proceeding ':'
      { match: /[a-zA-Z]+\s*:+?/, value: x => x.replace(/\s+/, "").slice(0, -1) },
    "IDENTIFIER":
      // match one '>' proceeded by one or more letters proceeded by any number of letters or numbers
      // remove the preceeding '>'
      { match: /#\s*[a-z]+[a-z0-9_]*/, value: x => x.replace(/\s+/, "").slice(1) },
    "STRING": [
      // match any number of characters contained inside either " or '
      // remove the surrounding " or '
      { match: /\"[^]*?\"/, value: x => x.slice(1, -1) },
      { match: /\'[^]*?\'/, value: x => x.slice(1, -1) }
    ],
    "FUNCTION": 
      // match any number of characters contained inside '{%' and '%}' 
      { match: /\{%.*?\%}/, value: x => x.slice(2, -2) },
    "NUMBER":
      // match one or more digits, optionally followed by a '.' and any number of digits
      { match: /\-?\d+\.?\d*/, },
    "{":
      { match: "{", value: () => "" },
    "}":
      { match: "}", value: () => "" },
    "[":
      { match: "[", value: () => "" },
    "]":
      { match: "]", value: () => "" },
    ":":
      { match: ":", value: () => "" },
    ";":
      { match: ";", value: () => "" },
    'COMMENT': [
      { match: /\/\*[^]*?\*\//, value: x => x.slice(2, -2) }
    ],
    "WHITESPACE": 
      " ",
    "ERROR":
      Moo.error
  });

  lexer.reset(input_stream);   

  const tokens = [];
  for (let token of lexer) {
    // ignore whitespace tokens
    if (token.type !== "WHITESPACE") {
      tokens.push({
        type  : token.type,
        value : token.value
      });
    }
  }
  // Add EOF token
  tokens.push({
    type  : "EOF",
    value : null
  });

  console.log(JSON.stringify(tokens));

  return tokens;
}
