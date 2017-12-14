module.exports = (token_stream) => {
  const next = () => {
    // remove the first item from the token stream and return it
    return token_stream.shift();
  }

  const peak = () => {
    // show the first item in the stream without removing it
    return token_stream[0];
  }

  const match_type = (token, type) => {
    // check token type
    return token.type === type;
  }

  const EOF = (token) => {
    return match_type(token, "EOF");
  }
 
  // number tokens are represented as a string
  // parse them as a float number
  const parse_number = (number_token) => {
    return parseFloat(number_token);
  }

  // function tokens are represented as a string
  // Function can be used to construct a function similar
  // to eval()
  const parse_function = (function_token) => {
    return Function(function_token);
  }

  // convert stream of discreet values into a single array
  const parse_array = (token) => {
    let array = []
    // ensure this while loop doesnt run forever by checking token
    // type for EOF as well as array closure
    while (!match_type(token, "]" || !EOF(token))) {
      token = next();

      let value;
      switch (token.type) {
        case "[":
          value = parse_array(token);
          array.push(value);
          break;
        case "NUMBER":
          value = parse_number(token.value);
          array.push(value);
          break;
        case "STRING":
          value = token.value;
          array.push(value);
          break;
        case "FUNCTION":
          value = parse_function(token.value);
          array.push(value);
          break;
        default:
          break;
      }

    }

    return array;
  }

  const parse_object = (token) => {
    let obj = {
      node: token.value
    };

    // if a name is provided, store it
    if (match_type(peak(), "IDENTIFIER")) {
      token = next();
      obj.name = token.value;
    } else {
      obj.name = token.value;
    }

    // valid objects must open with '{' and close with '}'
    if (match_type(peak(), "{")) {
      // ensure this while loop doesnt run forever by checking token
      // type for EOF as well as object closure
      while (!match_type(token, "}" || !EOF(token))) {
        token = next();

        // ignore non-key tokens
        if (match_type(token, "KEY")) {
          let key = token.value;
          let value = "";
          token = next();

          switch (token.type) {
            case "[":
              value = parse_array(token);
              break;
            case "NUMBER":
              value = parse_number(token.value);
              break;
            case "STRING":
              value = token.value;
              break;
            case "FUNCTION":
              value = parse_function(token.value);
              break;
            default:
              break;
          }

          obj[key] = value;
        }
      }
    }

    return obj;
  }

  let token     = next();
  let obj_tree  = [];
  while (!EOF(token)) {
    if (match_type(token, "OBJECT")) {
      const obj = parse_object(token);

      obj_tree.push(obj);
    }

    token = next();
  }

  console.log(JSON.stringify(obj_tree));

  return obj_tree;
}