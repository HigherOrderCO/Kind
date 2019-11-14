// WARNING: here shall be dragons!
// This is the parser for Formality-Lang. This is NOT fm-core, which is meant
// to be small, elegant and portable. Instead, it is our user-facing language,
// which is meant to be big and fully-featured, including several syntax-sugars
// meant to make programming easier. As such, this file is complex and involves
// hard transformations of terms, Bruijn-index shifts, crazy parsing flows.
// You've been warned (:

const {
  Var, Typ, Tid, Utt, Utv, Ute, All, Lam,
  App, Box, Put, Tak, Dup, Num, Val, Op1,
  Op2, Ite, Cpy, Sig, Par, Fst, Snd, Prj,
  Slf, New, Use, Ann, Log, Hol, Ref,
  reduce: core_reduce,
  typecheck: core_typecheck,
  haltcheck,
  ctx_ext,
  ctx_get,
  ctx_names,
  ctx_new,
  ctx_str,
  equal,
  erase,
  shift,
  subst,
  subst_many,
} = require("./fm-core.js");

const version = require("./../package.json").version;
const to_net = require("./fm-to-net.js");
const to_js = require("./fm-to-js.js");
const net = require("./fm-net.js");
const {load_file} = require("./forall.js");
const {marked_code, random_excuse} = require("./fm-error.js");

// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

// Converts a term to a string
const show = ([ctor, args], nams = [], opts = {}) => {
  const print_output = (term) => {
    try {
      if (term[1].val0[1].numb === 0x53484f57) {
        term = term[1].val1;
        var nums = [];
        while (term[1].body[1].body[0] !== "Var") {
          term = term[1].body[1].body;
          nums.push(term[1].func[1].argm[1].numb);
          term = term[1].argm;
        }
        var str = "";
        for (var i = 0; i < nums.length; ++i) {
          str += String.fromCharCode(nums[i]);
        }
        return str;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  switch (ctor) {
    case "Var":
      var name = nams[nams.length - args.index - 1];
      if (!name) {
        return "^" + args.index;
      } else {
        var suff = "";
        for (var i = 0; i < args.index; ++i) {
          if (nams[nams.length - i - 1] === name) {
            var suff = suff + "^";
          }
        }
        return name + suff;
      }
    case "Typ":
      return "Type";
    case "Tid":
      var expr = show(args.expr, nams, opts);
      return "&" + expr;
    case "Utt":
      var expr = show(args.expr, nams, opts);
      return "-" + expr;
    case "Utv":
      var expr = show(args.expr, nams, opts);
      return "%" + expr;
    case "Ute":
      var expr = show(args.expr, nams, opts);
      return "+" + expr;
    case "All":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].bind, nams.concat(names.slice(0,-1)), opts));
        term = term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + (names[i].length > 0 ? " : " : ":") + types[i];
        text += i < names.length - 1 ? ", " : "";
      }
      text += ") -> ";
      text += show(term, nams.concat(names), opts);
      return text;
    case "Lam":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "Lam") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(term[1].bind && term[1].bind[0] !== "Hol" ? show(term[1].bind, nams.concat(names.slice(0,-1)), opts) : null);
        term = term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + (types[i] !== null ? " : " + types[i] : "");
        text += i < names.length - 1 ? ", " : "";
      }
      text += ") => ";
      text += show(term, nams.concat(names), opts);
      return text;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = (term[1].func[0] === "App" ? ", " : "")
             + (term[1].eras ? "~" : "")
             + show(term[1].argm, nams, opts)
             + text;
        term = term[1].func;
      }
      if (term[0] === "Ref" || term[0] === "Var" || term[0] === "Tak") {
        var func = show(term, nams, opts);
      } else {
        var func = "(" + show(term,nams, opts) + ")";
      }
      return func + "(" + text;
    case "Box":
      var expr = show(args.expr, nams, opts);
      return "!" + expr;
    case "Put":
      var expr = show(args.expr, nams, opts);
      return "#" + expr;
    case "Tak":
      var expr = show(args.expr, nams, opts);
      return "$" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, nams, opts);
      if (args.body[0] === "Var" && args.body[1].index === 0) {
        return "$" + expr;
      } else {
        var body = show(args.body, nams.concat([name]), opts);
        return "dup " + name + " = " + expr + "; " + body;
      }
    case "Num":
      return "Number";
    case "Val":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, nams, opts);
      var num1 = show(args.num1, nams, opts);
      return num0 + " " + func + " " + num1;
    case "Ite":
      var cond = show(args.cond, nams, opts);
      var pair = show(args.pair, nams, opts);
      return "if " + cond + " " + pair;
    case "Cpy":
      var name = args.name;
      var numb = show(args.numb, nams, opts);
      var body = show(args.body, nams.concat([name]), opts);
      return "cpy " + name + " = " + numb + "; " + body;
    case "Sig":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "Sig") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].typ0, nams.concat(names.slice(0,-1)), opts));
        term = term[1].typ1;
      }
      var text = "[";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] === 1 ? "~" : "";
        text += names[i] + " : " + types[i];
        text += erase[i] === 2 ? " ~ " : ", ";
      }
      text += show(term, nams.concat(names), opts);
      text += "]";
      return text;
    case "Par":
      var output;
      var term  = [ctor, args];
      var erase = [];
      var terms = [];
      while (term[0] === "Par") {
        if (output = print_output(term)) {
          break;
        } else {
          erase.push(term[1].eras);
          terms.push(show(term[1].val0, nams, opts));
          term = term[1].val1;
        }
      }
      if (terms.length > 0) {
        var text = "[";
      } else {
        var text = "";
      }
      for (var i = 0; i < terms.length; ++i) {
        text += erase[i] === 1 ? "~" : "";
        text += terms[i];
        text += erase[i] === 2 ? " ~ " : ", ";
      }
      if (output) {
        text += output;
      } else {
        text += show(term, nams, opts);
      }
      if (terms.length > 0) {
        text += "]";
      }
      return text;
    case "Fst":
      var pair = show(args.pair, nams, opts);
      switch (args.eras) {
        case 0: return "fst(" + pair + ")";
        case 1: return "~fst(" + pair + ")";
        case 2: return "fst~(" + pair + ")";
        case 3: return "~fst~(" + pair + ")";
      }
    case "Snd":
      var pair = show(args.pair, nams, opts);
      switch (args.eras) {
        case 0: return "snd(" + pair + ")";
        case 1: return "~snd(" + pair + ")";
        case 2: return "snd~(" + pair + ")";
        case 3: return "~snd~(" + pair + ")";
      }
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, nams, opts);
      var body = show(args.body, nams.concat([nam0, nam1]), opts);
      var era1 = args.eras === 1 ? "~" : "";
      var era2 = args.eras === 2 ? "~" : "";
      return "get [" + era1 + nam0 + "," + era2 + nam1 + "] = " + pair + "; " + body;
    case "Slf":
      var name = args.name;
      var type = show(args.type, nams.concat([name]), opts);
      return "${" + name + "} " + type;
    case "New":
      var type = show(args.type, nams, opts);
      var expr = show(args.expr, nams, opts);
      return "new(~" + type + ") " + expr;
    case "Use":
      var expr = show(args.expr, nams, opts);
      return "use(" + expr + ")";
    case "Ann":
      var expr = show(args.expr, nams, opts);
      return expr;
    case "Log":
      var expr = show(args.expr, nams, opts);
      return expr;
    case "Hol":
      return "?" + args.name;
    case "Ref":
      return !opts.full_refs ? args.name.replace(new RegExp(".*/", "g"), "") : args.name;
  }
};

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = async (file, code, tokenify, loader = load_file, root = true, loaded = {}) => {
  // Imports a local/global file, merging its definitions
  async function do_import(import_file) {
    if (import_file.indexOf("@") === -1) {
      local_imports[import_file] = true;
    }
    if (!loaded[import_file]) {
      try {
        var file_code = await loader(import_file);
        loaded[import_file] = await parse(import_file, file_code, tokenify, loader, false, loaded);
      } catch (e) {
        throw e;
      }
    }
    var {defs: file_defs
      , adts: file_adts
      , open_imports: file_open_imports
      } = loaded[import_file];
    for (let term_path in file_defs) {
      defs[term_path] = file_defs[term_path];
    }
    for (let term_path in file_adts) {
      adts[term_path] = file_adts[term_path];
    }
    for (let open_import in file_open_imports) {
      open_imports[open_import] = true;
    }
    return true;
  }

  // Finds all imports with a given name
  function find_name_in_imports(name) {
    var found = [];
    for (var open_import in open_imports) {
      if (defs[open_import + "/" + name]) {
        found.push(open_import + "/" + name);
      }
    }
    return found;
  }

  // Returns current location
  function loc(len = 1) {
    return {idx: idx - len, col, row, len, file, code};
  }

  // Attempts to resolve a name into a full path
  function ref_path(str) {
    var result = (function () {
      if (str.indexOf("/") === -1) {
        var [str_file, str_name] = [null, str];
      } else {
        var [str_file, str_name] = str.split("/");
      }
      // If the reference includes the file...
      if (str_file) {
        // If it points to a qualified import, expand it
        if (qual_imports[str_file]) {
          return qual_imports[str_file] + "/" + str_name;
        // Otherwise, return an undefined reference, as written
        } else {
          return str_file + "/" + str_name;
        }
      // Otherwise, if the reference is missing the file...
      } else {
        // If there is a local definition with that name, point to it
        if (defs[file + "/" + str_name]) {
          return file + "/" + str_name;
        }
        // Otherwise, if there are many defs with that name, it is ambiguous
        var found = find_name_in_imports(str_name);
        if (found.length > 1) {
          var err_str = "Ambiguous reference: '" + str + "' could refer to:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
          err_str += "\nType its full name to prevent this error.";
          error(err_str);
        }
        // Otherwise, if there is exactly 1 open def with that name, point to it
        if (found.length === 1) {
          return found[0];
        }
      }
      // Otherwise, return an undefined reference to hte same file
      return file + "/" + str_name;
    })();
    return result;
  }

  // Makes a ref given a name
  function ref(str) {
    return Ref(ref_path(str), false, loc(str.length));
  }

  // Attempts to make a `ref` to a known base-lib term
  function base_ref(str) {
    var path = ref_path(str);
    if (defs[path]) {
      return Ref(path, false, loc(str.length));
    } else {
      error("Attempted to use a syntax-sugar which requires `" + str + "` to be in scope, but it isn't.\n"
          + "To solve that, add `import Base@0` to the start of your file.\n"
          + "See http://docs.formality-lang.org/en/latest/language/Hello,-world!.html for more info.");
    }
  }

  // Defines a top-level term
  function define(path, term) {
    if (root) {
      var name = path.replace(new RegExp("^[\\w.]*\/"), "");
      var found = find_name_in_imports(name);
      if (found.length > 0 || defs[ref_path(name)]) {
        var err_str = "Attempted to re-define '" + name + "', which is already defined";
        if (found.length > 0) {
          err_str += " as:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
        } else {
          err_str += " on this file.";
        }
        error(err_str);
      }
    }
    defs[path] = term;
  }

  // Creates a new hole name
  function new_hole_name() {
    return "h" + (hole_count++);
  }

  // Builds a lookup table
  function build_charset(chars) {
    var set = {};
    for (var i = 0; i < chars.length; ++i) {
      set[chars[i]] = 1;
    }
    return chr => set[chr] === 1;
  }

  // Some handy lookup tables
  const is_native_op =
    { ".+."   : 1
    , ".-."   : 1
    , ".*."   : 1
    , "./."   : 1
    , ".%."   : 1
    , ".**."  : 1
    , ".&."   : 1
    , ".|."   : 1
    , ".^."   : 1
    , ".~."   : 1
    , ".>>>." : 1
    , ".<<."  : 1
    , ".>."   : 1
    , ".<."   : 1
    , ".==."  : 1
  };

  const op_inits     = [".", "=", "->"];
  const is_op_init   = str => { for (var k of op_inits) if (str === k || str[0] === k) return str; return null; };
  const is_num_char  = build_charset("0123456789");
  const is_name_char = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@/");
  const is_op_char   = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@+*/%^!<>=&|");
  const is_spacy     = build_charset(" \t\n\r;");
  const is_space     = build_charset(" ");
  const is_newline   = build_charset("\n");

  // Advances the cursor 1 step forward
  function next() {
    if (tokens) {
      tokens[tokens.length - 1][1] += code[idx];
    }
    if (is_newline(code[idx])) {
      row += 1;
      col = 0;
    } else {
      col += 1;
    }
    idx += 1;
  }

  // Advances the cursor until it finds a parseable char, skipping spaces and comments
  function next_char(is_space = is_spacy) {
    skip_spaces(is_space);
    var head = code.slice(idx, idx + 2);
    // Skips comments
    while (head === "//" || head === "/*") {
      // Single-line comments
      if (head === "//") {
        if (tokens) tokens.push(["cmm", ""]);
        while (code[idx] !== "\n" && idx < code.length) {
          next();
        }
        next();
      // Multi-line comments (docs)
      } else {
        if (tokens) tokens.push(["doc", ""]);
        while (code.slice(idx, idx + 2) !== "*/" && idx < code.length) {
          next();
        }
        next();
        next();
      }
      if (tokens) tokens.push(["txt", ""]);
      skip_spaces(is_space);
      var head = code.slice(idx, idx + 2);
    }
  }

  // Skips space chars
  function skip_spaces(is_space = is_spacy) {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  // Attempts to match a specific string
  function match_here(string) {
    if (code.slice(idx, idx + 2) === "//") {
      return false;
    } else {
      var sliced = code.slice(idx, idx + string.length);
      if (sliced === string) {
        if (tokens) tokens.push(["sym", ""]);
        for (var i = 0; i < string.length; ++i) {
          next();
        }
        if (tokens) tokens.push(["txt", ""]);
        return true;
      }
      return false;
    }
  }

  // Skips spaces, calls `match_here`
  function match(string, is_space = is_spacy) {
    next_char(is_space);
    return match_here(string);
  }

  // Attempts to match a character that is a valid operator initiator
  function match_op_init(is_space = is_spacy) {
    for (var i = 0; i < op_inits.length; ++i) {
      var op_init = op_inits[i];
      if (match(op_init, is_space)) {
        return op_init;
      }
    };
    return null;
  };

  // Throws a parse error at this location
  function error(error_message) {
    var part = "";
    var text = "";
    text += "[PARSE-ERROR]\n";
    text += error_message;
    text += "\n\nI noticed the problem on line " + (row+1) + ", col " + col + ", file \x1b[4m" + file + ".fm\x1b[0m:\n\n";
    text += marked_code(loc());
    text += "\nBut it could have happened a little earlier.\n";
    text += random_excuse();
    throw text;
  }

  // Constructs an Ind
  function build_ind(name) {
    if (!defs[name+"i"]) {
      var numb = name === "" ? Math.pow(2,48) - 1 : Number(name);
      var bits = numb.toString(2);
      var bits = bits === "0" ? "" : bits;
      var term = base_ref("base");
      for (var i = 0; i < bits.length; ++i) {
        term = App(base_ref("twice"), term, false);
        if (bits[i] === "1") {
          term = App(base_ref("step"), term, false);
        }
      }
      define(name+"i", term);
    }
    return Ref(name+"i", false, loc(name.length + 1));
  }

  // Constructs a nat
  function build_nat(name) {
    if (!defs[name+"n"]) {
      var term = base_ref("zero");
      var numb = Number(name);
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      define(name+"n", term);
    }
    return Ref(name+"n", false, loc(name.length + 1));
  }

  // Constructs a nat
  function build_nat(name) {
    if (!defs["n"+name]) {
      var term = base_ref("zero");
      var numb = Number(name);
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      define("n"+name, term);
    }
    return Ref("n"+name, false, loc(name.length + 1));
  }

  // Parses an exact string, errors if it isn't there
  function parse_exact(string) {
    if (!match(string)) {
      var text = "";
      var part = "";
      error("Expected '" + string + "', but found '" + (code[idx] || "(end of file)") + "' instead.");
    }
  }

  // Parses characters until `fn` is false
  function parse_string_here(fn = is_name_char) {
    var name = "";
    while (idx < code.length && fn(code[idx])) {
      name = name + code[idx];
      next();
    }
    return name;
  }

  // Skips spaces and calls parse_string_here
  function parse_string(fn = is_name_char) {
    next_char();
    return parse_string_here(fn);
  }

  // Parses an alphanumeric name
  function parse_name() {
    var op_init = null;
    if (op_init = is_op_init(code[idx] + (code[idx+1] || " "))) {
      match(op_init);
      return op_init + parse_string_here(is_op_char);
    } else {
      return parse_string();
    }
  }

  // Parses a term that demands a name
  function parse_named_term(nams) {
    // Parses matched term
    var term = parse_term(nams);

    // If no name given, attempts to infer it from term
    if (match("as")) {
      var name = parse_string();
    } else if (term[0] === "Var" && term[1].__name) {
      var name = term[1].__name;
    } else {
      var name = "self";
      //error("The term \x1b[2m" + show(term, nams) + "\x1b[0m requires an explicit name.\n"
          //+ "Provide it with the 'as' keyword. Example: \x1b[2m" + show(term, nams) + " as x\x1b[0m");
    }

    return [name, term]
  }

  // Parses a number, variable, inline operator or reference
  function parse_atom(nams) {
    var term = null;
    if (tokens) tokens.push(["???", ""]);
    var name = parse_name();
    var last = name[name.length - 1];
    if (is_num_char(name[0])) {
      var numb = Number(is_num_char(last) ? name : name.slice(0, -1));
    } else {
      var numb = NaN;
    }
    if (name.length === 0) {
      next();
      error("Unexpected symbol.");
    }
    // Not a var but a number
    if (!isNaN(numb)) {
      if (last === "i") {
        var term = build_ind(name.slice(0,-1));
      } else if (last === "n") {
        var term = build_nat(name.slice(0,-1));
      } else {
        var term = Val(numb, loc(name.length));
      }
      if (tokens) tokens[tokens.length - 1][0] = "num";
    } else {
      // Parses bruijn index
      var skip = 0;
      while (match_here("^")) {
        skip += 1;
      }
      // Finds variable in context
      for (var i = nams.length - 1; i >= 0; --i) {
        if (nams[i] === name) {
          if (skip === 0) break;
          else skip -= 1;
        }
      }
      // Variable
      if (i !== -1) {
        term = Var(nams.length - i - 1, loc(name.length));
        term[1].__name = name;
        if (tokens) tokens[tokens.length - 1][0] = "var";
      // Inline binary operator 
      } else if (is_native_op[name]) {
          term = Lam("x", Num(), Lam("y", Num(), Op2(name, Var(1), Var(0)), false), false);
          if (tokens) tokens[tokens.length - 1][0] = "nop";
      // Reference
      } else {
        term = Ref(ref_path(name), false, loc(name.length));
        if (tokens) {
          tokens[tokens.length - 1][0] = "ref";
          tokens[tokens.length - 1][2] = term[1].name;
        }
      }
    }
    if (tokens) tokens.push(["txt", ""]);
    return term;
  }

  // Parses a grouping parens, `(...)`
  function parse_parens(nams) {
    if (match("(")) {
      var term = parse_term(nams);
      var skip = parse_exact(")");
      return term;
    }
  }

  // Parses the type of types, `Type`
  function parse_typ(nams) {
    if (match("Type")) {
      return Typ(loc(4));
    }
  }

  // Parses a type-level identity, `~A`
  function parse_tid(nams) {
    var init = idx;
    if (match("&")) {
      var expr = parse_term(nams);
      return Tid(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted type, `-A`
  function parse_utt(nams) {
    var init = idx;
    if (match("-")) {
      var expr = parse_term(nams);
      return Utt(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted term, `%t`
  function parse_utv(nams) {
    var init = idx;
    if (match("%")) {
      var expr = parse_term(nams);
      return Utv(expr, loc(idx - init));
    }
  }

  // Parses an unrestricted elim, `+t`
  function parse_ute(nams) {
    var init = idx;
    if (match("+")) {
      var expr = parse_term(nams);
      return Ute(expr, loc(idx - init));
    }
  }

  // Parses the `?scope?` utility
  function parse_scope(nams) {
    if (match("?scope?")) {
      console.log("Scope:");
      for (var i = 0; i < nams.length; ++i) {
        console.log("- " + nams[i]);
      }
      return parse_term(nams);
    }
  }

  // Parses a hole, `?name`
  function parse_hol(nams) {
    var init = idx;
    if (match("?")) {
      var name = parse_string_here();
      if (name === "") {
        name = new_hole_name();
      }
      if (used_hole_name[name]) {
        error("Reused hole name: " + name);
      } else {
        used_hole_name[name] = true;
      }
      return Hol(name, loc(idx - init));
    }
  }

  // Parses a lambda `{x : A} t` or a forall `{x : A} -> B`
  function parse_lam_or_all(nams) {
    function is_lam_or_all() {
      // TODO: this is ugly, improve
      var i = idx;
      if (i < code.length && code[i] === "(")          { ++i; } // skips `(`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "~")                             { ++i; } // skips `~`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ":")                             { ++i; } // skips `:`
      if (code[i] === " ") return true;                         // found ` `
      if (code[i] === ",") return true;                         // found `,`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ")")                             { ++i; } // skips `)`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "=")                             { ++i; } // skips `=`
      if (code[i] === ">") return true;                         // finds `>`
      return false;
    }
    var init = idx;
    if (is_lam_or_all() && match("(")) {
      var erass = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        var eras = match("~");
        var name = parse_string();
        var type = match(":") ? parse_term(nams.concat(names)) : null;
        erass.push(eras);
        names.push(name);
        types.push(type);
        if (match(")")) break;
        else parse_exact(",");
      }
      var isall = match("->");
      if (!isall) {
        var skip = parse_exact("=>");
      }
      var parsed = parse_term(nams.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        if (isall) {
          parsed = All(names[i], types[i] || Typ(), parsed, erass[i], loc(idx - init));
        } else {
          parsed = Lam(names[i], types[i] || null, parsed, erass[i], loc(idx - init));
        }
      }
      return parsed;
    }
  }

  // Parses a duplication, `dup x = t; u`
  function parse_dup(nams) {
    var init = idx;
    if (match("dup ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var expr = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return Dup(name, expr, body, loc(idx - init));
    }
  }

  // Parses a boxed type, `!A`
  function parse_box(nams) {
    var init = idx;
    if (match("!")) {
      var expr = parse_term(nams);
      return Box(expr, loc(idx - init));
    }
  }

  // Parses a boxed term, `#t`
  function parse_put(nams) {
    var init = idx;
    if (match("#")) {
      var expr = parse_term(nams);
      return Put(expr, loc(idx - init));
    }
  }

  // Parses an unboxing, `^t`
  function parse_tak(nams) {
    var init = idx;
    if (match("$")) {
      var expr = parse_term(nams);
      return Tak(expr, loc(idx - init));
    }
  }

  // Parses a let, `let x = t; u`
  function parse_let(nams) {
    if (match("let ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var copy = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return subst(body, copy, 0);
    }
  }

  // Parses the type of numbers, `Number`
  function parse_wrd(nams) {
    if (match("Number")) {
      return Num(loc(4));
    }
  }

  // Parses a string literal, `"foo"`
  function parse_str(nams) {
    var init = idx;
    if (match("\"")) {
      // Parses text
      var text = "";
      while (idx < code.length && code[idx] !== "\"") {
        text += code[idx];
        next();
      }
      next();
      var nums = [];
      for (var i = 0; i < text.length; ++i) {
        nums.push(text.charCodeAt(i));
      }
      var term = App(base_ref("nil"), Num(), true);
      for (var i = nums.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), Num(), true), Val(nums[i]), false), term, false);
      }
      return Ann(base_ref("String"), term, false, loc(idx - init));
    }
  }

  // Parses a char literal, `'x'`
  function parse_chr(nams) {
    var init = idx;
    if (match("'")) {
      var name = parse_name();
      var skip = parse_exact("'");
      return Val(name.charCodeAt(0));
    }
  }

  // Parses an if-then-else, `if: t else: u`
  function parse_ite(nams) {
    var init = idx;
    if (match("if ")) {
      var cond = parse_term(nams);
      var skip = match("then:") || parse_exact(":");
      var val0 = parse_term(nams);
      var skip = parse_exact("else:");
      var val1 = parse_term(nams);
      return Ite(cond, Par(val0, val1, 0), loc(idx - init));
    }
  }

  // Parses a Number copy, `cpy x = t; u`
  function parse_cpy(nams) {
    var init = idx;
    if (match("cpy ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var numb = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      return Cpy(name, numb, body, loc(idx - init));
    }
  }

  // Parses a sigma, `[x : A, P(x)]`, or a pair, `[t, u]`
  function parse_sig_or_par(nams) {
    function is_sigma() {
      // TODO: this is ugly, improve
      var i = idx;
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === "~")                             { ++i; } // skips `~`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      return code[i] === ":";                                   // finds `:`
    }
    var init = idx;
    if (match("[")) {
      if (match("]")) {
        error("Empty pair.");
      }
      // Sigma
      if (is_sigma()) {
        var erass = [];
        var names = [];
        var types = [];
        while (idx < code.length && is_sigma()) {
          var era1 = match("~");
          var name = parse_string();
          var skip = parse_exact(":");
          var type = parse_term(nams.concat(names));
          var era2 = match("~");
          erass.push(era1 ? 1 : era2 ? 2 : 0);
          names.push(name);
          types.push(type);
          if (!era2) parse_exact(",");
        }
        var parsed = parse_term(nams.concat(names));
        var skip = parse_exact("]");
        for (var i = names.length - 1; i >= 0; --i) {
          var parsed = Sig(names[i], types[i], parsed, erass[i], loc(idx - init));
        }
      // Pair
      } else {
        var erass = [];
        var terms = [];
        while (idx < code.length) {
          var era1 = match("~");
          var term = parse_term(nams);
          var era2 = match("~");
          erass.push(era1 ? 1 : era2 ? 2 : 0);
          terms.push(term);
          if (match("]")) break;
          if (!era2) parse_exact(",");
        }
        var parsed = terms.pop();
        for (var i = terms.length - 1; i >= 0; --i) {
          var parsed = Par(terms[i], parsed, erass[i], loc(idx - init));
        }
      }
      return parsed;
    }
  }

  // Parses a fst accessor, `fst(t)`
  function parse_fst(nams) {
    var init = idx;
    if (match("fst(")) {
      var eras = 0;
    } else if (match("~fst(")) {
      var eras = 1;
    } else if (match("fst~(")) {
      var eras = 2;
    } else if (match("~fst~(")) {
      var eras = 3;
    } else {
      return;
    }
    var pair = parse_term(nams);
    var skip = parse_exact(")");
    return Fst(pair, eras, loc(idx - init));
  }

  // Parses a snd accessor, `snd(t)`
  function parse_snd(nams) {
    var init = idx;
    if (match("snd(")) {
      var eras = 0;
    } else if (match("~snd(")) {
      var eras = 1;
    } else if (match("snd~(")) {
      var eras = 2;
    } else if (match("~snd~(")) {
      var eras = 3;
    } else {
      return;
    }
    var pair = parse_term(nams);
    var skip = parse_exact(")");
    return Snd(pair, eras, loc(idx - init));
  }

  // Parses a projection, `get [x, y] = t`
  function parse_get(nams) {
    var init = idx;
    if (match("get ")) {
      var skip = parse_exact("[");
      var erass = [];
      var names = [];
      while (idx < code.length) {
        var era1 = match("~");
        var name = parse_string();
        var era2 = match("~");
        erass.push(era1 ? 1 : era2 ? 2 : 0);
        names.push(name);
        if (match("]")) break;
        if (!era2) parse_exact(",");
      }
      var skip = parse_exact("=");
      var pair = parse_term(nams);
      var parsed = parse_term(nams.concat(names));
      for (var i = names.length - 2; i >= 0; --i) {
        var nam1 = names[i];
        var nam2 = i === names.length - 2 ? names[i + 1] : "aux";
        var expr = i === 0 ? pair : Var(0);
        var body = i === 0 ? parsed : shift(parsed, 1, 2);
        var parsed = Prj(nam1, nam2, expr, body, erass[i], loc(idx - init));
      }
      return parsed;
    }
  }

  // Parses log, `log(t)`
  function parse_log(nams) {
    var init = idx;
    if (match("log(")) {
      var msge = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      return Log(msge, expr, loc(idx - init));
    }
  }

  // Parses a self type, `$x P(x)`
  function parse_slf(nams) {
    var init = idx;
    if (match("${")) {
      var name = parse_string();
      var skip = parse_exact("}");
      var type = parse_term(nams.concat([name]));
      return Slf(name, type, loc(idx - init));
    }
  }

  // Parses a self intro, `new(A) t`
  function parse_new(nams) {
    var init = idx;
    if (match("new(~")) {
      var type = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      return New(type, expr, loc(idx - init));
    }
  }

  // Parses a self elim, `%t`
  function parse_use(nams) {
    var init = idx;
    if (match("use(")) {
      var expr = parse_term(nams);
      var skip = parse_exact(")");
      return Use(expr, loc(idx - init));
    }
  }

  // Parses a case expression, `case/T | A => <term> | B => <term> : <term>`
  function parse_case(nams) {
    if (match("case ")) {
      // Attempts to parse this case expression with each ADTs in scope
      for (var adt_name in adts) {
        var parse_state = save_parse_state();

        try {
          // Parses matched name, if available
          var [term_name, term] = parse_named_term(nams);

          // Finds ADT
          if (!adt_name || !adts[ref_path(adt_name)]) {
            error("Used case-syntax on undefined type `" + (adt_name || "?") + "`.");
          }
          var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[ref_path(adt_name)];

          // Parses 'move' expressions
          var moves = [];
          while (match("+")) {
            var move_init = idx;
            var [move_name, move_term] = parse_named_term(nams);
            var move_skip = parse_exact(":");
            var move_type = parse_term(nams
              .concat(adt_indx.map(([name,type]) => term_name + "." + name))
              .concat([term_name])
              .concat(moves.map(([name,term,type]) => name)));
            moves.push([move_name, move_term, move_type, loc(idx - init)]);
          }

          // Parses matched cases
          var case_term = [];
          var case_loc  = [];
          for (var c = 0; c < adt_ctor.length; ++c) {
            var init = idx;
            try {
              var skip = parse_exact("|");
              var skip = parse_exact(adt_ctor[c][0]);
              var skip = parse_exact("=>");
            } catch (e) {
              throw "WRONG_ADT";
            }
            var ctors = adt_ctor[c][1];
            case_term[c] = parse_term(nams
              .concat(adt_ctor[c][1].map(([name,type]) => term_name + "." + name))
              .concat(moves.map(([name,term,type]) => name)));
            for (var i = moves.length - 1; i >= 0; --i) {
              case_term[c] = Lam(moves[i][0], null, case_term[c], false);
            }
            for (var i = 0; i < ctors.length; ++i) {
              case_term[c] = Lam(term_name + "." + ctors[ctors.length - i - 1][0], null, case_term[c], ctors[ctors.length - i - 1][2]);
            }
            case_loc[c] = loc(idx - init);
          }

          // Parses matched motive
          var moti_init = idx;
          try {
            var moti_skip = parse_exact(":");
          } catch (e) {
            throw "WRONG_ADT";
          }
          var moti_term = parse_term(nams
            .concat(adt_indx.map(([name,type]) => term_name + "." + name))
            .concat([term_name])
            .concat(moves.map(([name,term,type]) => name)));
          var moti_loc = loc(idx - moti_init);
          for (var i = moves.length - 1; i >= 0; --i) {
            var moti_term = All(moves[i][0], moves[i][2], moti_term, false, moves[i][3]);
          }
          var moti_term = Tid(moti_term, moti_loc);
          var moti_term = Lam(term_name, null, moti_term, false, moti_loc);
          for (var i = adt_indx.length - 1; i >= 0; --i) {
            var moti_term = Lam(term_name + "." + adt_indx[i][0], null, moti_term, false, moti_loc);
          }

          // Builds the matched term using self-elim ("Use")
          var targ = term;
          var term = Use(term);
          var term = App(term, moti_term, true, moti_loc);
          for (var i = 0; i < case_term.length; ++i) {
            var term = App(term, case_term[i], false, case_loc[i]);
          }
          for (var i = 0; i < moves.length; ++i) {
            var term = App(term, moves[i][1], false, moves[i][3]);
          }

          return term;
        } catch (e) {
          if (e !== "WRONG_ADT") {
            throw e;
          } else {
            load_parse_state(parse_state);
          }
        }
      }
      // If no ADT matches this pattern-match, raise error
      error("Couldn't find the ADT for this pattern-match.\n"
          + "Make sure the cases have the correct name and order.");
    }
  }

  // Parses a Number bitwise-not, `.!.(t)`
  function parse_op2_not(nams) {
    var init = idx;
    if (match(".!.(")) {
      var argm = parse_term(nams);
      var skip = parse_exact(")");
      return Op2(".!.", Val(0), argm, loc(idx - init));
    }
  }

  // Parses an application, `f(x, y, z...)`
  function parse_app(parsed, init, nams) {
    if (match("(", is_space)) {
      var term = parsed;
      while (idx < code.length) {
        if (match("_")) {
          var term = App(term, Hol(new_hole_name()), true, loc(idx - init));
          if (match(")")) break;
        } else {
          var eras = match("~");
          var argm = parse_term(nams);
          var term = App(term, argm, eras, loc(idx - init));
          if (match(")")) break;
          parse_exact(",");
        }
      }
      return term;
    }
  }

  // Parses a list literal, `A$[t, u, v, ...]`
  function parse_list_literal(nams) {
    var init = idx;
    if (match("<", is_space)) {
      var type = parse_term(nams);
      var skip = parse_exact(">");
      var list = [];
      var skip = parse_exact("[");
      while (idx < code.length && !match("]")) {
        list.push(parse_term(nams));
        if (match("]")) break; else parse_exact(",");
      }
      var term = App(base_ref("nil"), type, true, loc(idx - init));
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
      }
      return term;
    }
  }

  // Parses an annotation `t :: T`
  function parse_ann(parsed, init, nams) {
    if (match("::", is_space)) {
      //if (match("Type")) {
        //return Tid(parsed);
      //} else {
        var type = parse_term(nams);
        return Ann(type, parsed, false, loc(idx - init));
      //}
    }
  }

  // Parses operators, including:
  // - Numeric operators: `t .+. u`, `t .*. u`, etc.
  // - Arrow notation: `A -> B`
  // - User-defined operators: `t .foo. u`
  function parse_ops(parsed, init, nams) {
    var matched_op_init = null;
    if (matched_op_init = match_op_init(is_space)) {
      if (tokens) tokens.pop();
      var func = matched_op_init + parse_string_here(x => !is_space(x));
      if (tokens) tokens.push(["txt", ""]);
      var argm = parse_term(nams);
      if (is_native_op[func]) {
        return Op2(func, parsed, argm, loc(idx - init));
      } else if (func === "->") {
        return All("", parsed, shift(argm, 1, 0), false, loc(idx - init));
      } else {
        return App(App(ref(func), parsed, false), argm, false, loc(idx - init));
      }
    }
  }

  // Parses a free variable
  function parse_var(nams) {
    var init = idx;
    if (match("^")) {
      var idx = Number(parse_name());
      return Var(idx, loc(idx - init));
    }
  }

  // Parses a term
  function parse_term(nams) {
    var parsed;

    skip_spaces();
    var init = idx;

    // Parses base term
    if (parsed = parse_lam_or_all(nams));
    else if (parsed = parse_parens(nams));
    else if (parsed = parse_typ(nams));
    else if (parsed = parse_tid(nams));
    else if (parsed = parse_slf(nams));
    else if (parsed = parse_new(nams));
    else if (parsed = parse_use(nams));
    else if (parsed = parse_scope(nams));
    else if (parsed = parse_hol(nams));
    else if (parsed = parse_dup(nams));
    else if (parsed = parse_box(nams));
    else if (parsed = parse_put(nams));
    else if (parsed = parse_tak(nams));
    else if (parsed = parse_let(nams));
    else if (parsed = parse_wrd(nams));
    else if (parsed = parse_str(nams));
    else if (parsed = parse_chr(nams));
    else if (parsed = parse_ite(nams));
    else if (parsed = parse_cpy(nams));
    else if (parsed = parse_sig_or_par(nams));
    else if (parsed = parse_fst(nams));
    else if (parsed = parse_snd(nams));
    else if (parsed = parse_get(nams));
    else if (parsed = parse_utt(nams));
    else if (parsed = parse_utv(nams));
    else if (parsed = parse_ute(nams));
    else if (parsed = parse_log(nams));
    else if (parsed = parse_case(nams));
    else if (parsed = parse_op2_not(nams));
    else if (parsed = parse_var(nams));
    else if (parsed = parse_list_literal(nams));
    else     parsed = parse_atom(nams);

    // Parses spaced operators
    var new_parsed = true;
    while (new_parsed) {
      if      (new_parsed = parse_app(parsed, init, nams));
      else if (new_parsed = parse_ann(parsed, init, nams));
      else if (new_parsed = parse_ops(parsed, init, nams));
      if (new_parsed) {
        parsed = new_parsed;
      }
    }

    return parsed;
  }

  // Parses a top-level import
  async function do_parse_import() {
    if (match("import ")) {
      if (tokens) tokens.push(["imp", ""]);
      var impf = parse_string();
      if (tokens) tokens.push(["txt", ""]);
      var qual = match("as") ? parse_string() : null;
      var open = match("open");
      if (open) {
        error("The `open` keyword is obsolete. Remove it.");
      }
      if (qual) qual_imports[qual] = impf;
      qual_imports[impf] = impf;
      open_imports[impf] = true;
      await do_import(impf);
      return true;
    }
  }

  // Parses a top-level datatype:
  // T name {param0 : A, ...} (index0 : B, ...)
  // | ctor0 {field0 : C, ...} (index0, ...)
  // | ctor1 {field0 : C, ...} (index0, ...)
  async function do_parse_datatype() {
    if (match("T ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_nams = [adt_name];
      var adt_typs = [null];

      // Datatype parameters
      if (match("<")) {
        while (idx < code.length) {
          var eras = false;
          var name = parse_string();
          if (match(":")) {
            var type = await parse_term(adt_pram.map((([name,type]) => name)));
          } else {
            var type = Typ();
          }
          adt_pram.push([name, type, eras]);
          if (match(">")) break;
          else parse_exact(",");
        }
      }

      // Datatype indices
      var adt_nams = adt_nams.concat(adt_pram.map(([name,type]) => name));
      var adt_typs = adt_typs.concat(adt_pram.map(([name,type]) => type));
      if (match("(")) {
        while (idx < code.length) {
          //var eras = match("~");
          var eras = false;
          var name = parse_string();
          if (match(":")) {
            var type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
          } else {
            var type = Hol(new_hole_name());
          }
          adt_indx.push([name, type, eras]);
          if (match(")")) break; else parse_exact(",");
        }
      }

      // Datatype constructors
      while (match("|")) {
        // Constructor name
        var ctor_name = parse_string();
        // Constructor fields
        var ctor_flds = [];
        if (match("(")) {
          while (idx < code.length) {
            var eras = match("~");
            var name = parse_string();
            if (match(":")) {
              var type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
            } else {
              var type = Hol(new_hole_name());
            }
            ctor_flds.push([name, type, eras]);
            if (match(")")) break; else parse_exact(",");
          }
        }
        // Constructor type (written)
        if (match(":")) {
          var ctor_type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
        // Constructor type (auto-filled)
        } else {
          var ctor_indx = [];
          //if (match("(")) {
            //while (idx < code.length) {
              //ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
              //if (match(")")) break; else parse_exact(",");
            //}
          //}
          var ctor_type = Var(-1 + ctor_flds.length + adt_pram.length + 1);
          for (var p = 0; p < adt_pram.length; ++p) {
            ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length - p), false);
          }
          for (var i = 0; i < ctor_indx.length; ++i) {
            ctor_type = App(ctor_type, ctor_indx[i], false);
          }
        }
        adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
      }
      var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
      define(file+"/"+adt_name, derive_adt_type(file, adt));
      for (var c = 0; c < adt_ctor.length; ++c) {
        define(file+"/"+adt_ctor[c][0], derive_adt_ctor(file, adt, c));
      }
      adts[file+"/"+adt_name] = adt;

      return true;
    }
  }

  // Parses a top-level `?defs` util
  async function do_parse_defs_util() {
    if (match("?defs")) {
      var filt = match("/") ? parse_string(x => x !== "/") : "";
      var regx = new RegExp(filt, "i");
      console.log("Definitions:");
      for (var def in defs) {
        if (def[0] !== "$" && regx.test(def)) {
          console.log("- " + def);
        }
      }
      return true;
    }
  }

  // Parses a top-level definition:
  //
  //    name(arg0 : A, arg1 : B, ...) : RetType
  //      <body>
  //
  async function do_parse_def() {
    // Parses box annotation
    var boxed = match("#");

    // Parses definition name
    if (tokens) tokens.push(["def", ""]);
    var name = parse_name();

    if (name.length === 0) {
      error("Expected a definition.");
    }
    if (tokens) tokens[tokens.length - 1][2] = file+"/"+name;
    if (tokens) tokens.push(["txt", ""]);

    // If name is empty, stop
    if (name.length === 0) return false;

    // Parses argument names and types
    var erass = [];
    var names = [];
    var types = [];
    if (match_here("(")) {
      while (idx < code.length) {
        var arg_eras = match("~");
        var arg_name = parse_string();
        var arg_type = match(":") ? await parse_term(names) : Typ();
        erass.push(arg_eras);
        names.push(arg_name);
        types.push(arg_type);
        if (match(")")) break;
        else parse_exact(",");
      }
    }

    // Parses return type, if any
    var type = match(":") ? await parse_term(names) : null;
    var term = await parse_term(names);

    // Fills foralls and lambdas of arguments
    for (var i = names.length - 1; i >= 0; --i) {
      var type = type && All(names[i], types[i], type, erass[i]);
      var term = Lam(names[i], type ? null : types[i], term, erass[i]);
    }

    // Defines the top-level term
    define(file+"/"+name, type ? Ann(type, term, false) : term);

    return true;
  }

  function save_parse_state() {
    return {idx, row, col, tokens_length: tokens.length};
  }

  function load_parse_state(state) {
    idx = state.idx;
    row = state.row;
    col = state.col;
    while (tokens.length > state.tokens_length) {
      tokens.pop();
    }
  }

  // Parses all definitions
  var open_imports = {};
  var qual_imports = {};
  var local_imports = {};
  var file_version = {};
  var used_hole_name = {};
  var hole_count = 0;
  var tokens = tokenify ? [["txt",""]] : null;
  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  var adts = {};
  while (idx < code.length) {
    next_char();
    if (await do_parse_import());
    else if (await do_parse_datatype());
    else if (await do_parse_defs_util());
    else if (!(await do_parse_def())) break;
    next_char();
  }

  return {
    defs,
    adts,
    tokens,
    local_imports,
    qual_imports,
    open_imports
  };
}

// :::::::::::
// :: Utils ::
// :::::::::::

// Generates a name
const gen_name = (n) => {
  var str = "";
  ++n;
  while (n > 0) {
    --n;
    str += String.fromCharCode(97 + n % 26);
    n = Math.floor(n / 26);
  }
  return str;
};

// :::::::::::::::::::
// :: Syntax Sugars ::
// :::::::::::::::::::

// Syntax sugars for datatypes. They transform a statement like:
//
//   data ADT <p0 : Param0, p1 : Param1...> {i0 : Index0, i1 : Index1}
//   | ctr0 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ctr1 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ...
//
// on its corresponding self-encoded datatype:
//
//   def ADT
//   = {p0 : Param0, p1 : Param1, ..., i0 : Index0, i1 : Index1, ...} =>
//     : Type
//     $ self
//     {~P   : {i0 : Index0, i1 : Index1, ..., wit : (ADT i0 i1...)} -> Type} ->
//     {ctr0 : {ctr0_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr0 Param0 Param1... ctr0_fld0 ctr0_fld1 ...))} ->
//     {ctr1 : {ctr1_fld0 : Ctr1_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr1 Param0 Param1... ctr1_fld1 ctr0_fld1 ...))} ->
//     ... ->
//     (P i0 i1... self)
//
//   def ADT.ctr0
//   = {~p0 : Param0, ~p1 : Param1, ..., ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} =>
//     : Ctr0Type
//     @ Ctr0Type
//       {~P, ctr0, ctr1, ...} =>
//       (ctr0 ctr0_fld0 ctr0_fld1 ...)
//
//   (...)
const derive_adt_type = (file, {adt_pram, adt_indx, adt_ctor, adt_name}) => {
  return (function adt_arg(p, i) {
    // ... {p0 : Param0, p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
    // ... {i0 : Index0, i1 : Index...} ...
    } else if (i < adt_indx.length) {
      var substs = [Ref(file+"/"+adt_name)];
      for (var P = 0; P < p; ++P) {
        substs.push(Var(-1 + i + p - P));
      }
      return Lam(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), adt_arg(p, i + 1), adt_indx[i][2]);
    } else {
      return (
        // ... : Type ...
        Ann(Typ(),
        // ... $ self ...
        Slf("self",
        // ... P : ...
        All("P",
          (function motive(i) {
            // ... {i0 : Index0, i1 : Index1...} ...
            if (i < adt_indx.length) {
              var substs = [Ref(file+"/"+adt_name)];
              for (var P = 0; P < p; ++P) {
                substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
              }
              return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
            // ... {wit : (ADT i0 i1...)} -> Type ...
            } else {
              var wit_t = Ref(file+"/"+adt_name);
              for (var P = 0; P < adt_pram.length; ++P) {
                wit_t = App(wit_t, Var(-1 + i + 1 + i + adt_pram.length - P), adt_pram[P][2]);
              }
              for (var I = 0; I < i; ++I) {
                wit_t = App(wit_t, Var(-1 + i - I), adt_indx[I][2]);
              }
              return All("wit", wit_t, Typ(), false);
            }
          })(0),
        (function ctor(i) {
          if (i < adt_ctor.length) {
            // ... ctrX : ...
            return All(adt_ctor[i][0], (function field(j) {
              var subst_prams = [];
              for (var P = 0; P < adt_pram.length; ++P) {
                subst_prams.push(Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P));
              }
              // ... {ctrX_fldX : CtrX_FldX, ctrX_fld1 : CtrX_Fld1, ...} -> ...
              if (j < adt_ctor[i][1].length) {
                var sub = [Ref(file+"/"+adt_name)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][1][j][1], sub, j);
                return All(adt_ctor[i][1][j][0], typ, field(j + 1), adt_ctor[i][1][j][2]);
              // ... (CtrXType[ADT <- P] (ADT.ctrX ParamX Param1... ctrX_fldX ctrX_fld1 ...)) -> ...
              } else {
                var typ = adt_ctor[i][2];
                var sub = [Var(-1 + j + i + 1)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][2], sub, j);
                var rem = typ;
                for (var I = 0; I < adt_indx.length; ++I) {
                  rem = rem[1].func;
                }
                rem[0] = "Var";
                rem[1] = {index: -1 + i + j + 1};
                var wit = Ref(file+"/"+adt_ctor[i][0]);
                for (var P = 0; P < adt_pram.length; ++P) {
                  var wit = App(wit, Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P), true);
                }
                for (var F = 0; F < adt_ctor[i][1].length; ++F) {
                  var wit = App(wit, Var(-1 + j - F), adt_ctor[i][1][F][2]);
                }
                return App(typ, wit, false);
              }
            })(0),
            ctor(i + 1),
            false);
          } else {
            // ... (P i0 i1... self)
            var ret = Var(adt_ctor.length + 1 - 1);
            for (var i = 0; i < adt_indx.length; ++i) {
              var ret = App(ret, Var(adt_ctor.length + 1 + 1 + adt_indx.length - i - 1), adt_indx[i][2]);
            }
            var ret = App(ret, Var(adt_ctor.length + 1 + 1 - 1), false);
            return ret;
          }
        })(0),
        true))));
    }
  })(0, 0);
}

const derive_adt_ctor = (file, {adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
  return (function arg(p, i, f) {
    var substs = [Ref(file+"/"+adt_name)];
    for (var P = 0; P < p; ++P) {
      substs.push(Var(-1 + f + p - P));
    }
    // {~p0 : Param0, ~p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], arg(p + 1, i, f), true);
    // ... {ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} ...
    } else if (f < adt_ctor[c][1].length) {
      return Lam(adt_ctor[c][1][f][0], subst_many(adt_ctor[c][1][f][1], substs, f), arg(p, i, f + 1), adt_ctor[c][1][f][2]);
    } else {
      var type = subst_many(adt_ctor[c][2], substs, f);
      // ... : CtrXType {~P} ...
      return Ann(type, New(type, Lam("P", null, (function opt(k) {
        // ... {ctr0, ctr1...} ...
        if (k < adt_ctor.length) {
          return Lam(adt_ctor[k][0], null, opt(k + 1), false);
        // (ctrX ctrX_fld0 ctrX_fld1 ...)
        } else {
          var sel = Var(-1 + adt_ctor.length - c);
          for (var F = 0; F < adt_ctor[c][1].length; ++F) {
            var fld = Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F);
            // Unrestricted field
            if (adt_ctor[c][1][F][1][0] === "Utt") {
              var fld = Utv(Ute(fld));
            }
            var sel = App(sel, fld, adt_ctor[c][1][F][2]);
          }
          return sel;
        }
      })(0), true)), false);
    }
  })(0, adt_indx.length, 0);
}

const reduce = (term, opts) => {
  return core_reduce(term, {...opts, show});
};

const typecheck = (term, expect, opts) => {
  return core_typecheck(term, expect, {...opts, show});
};

// Evaluates a term to normal form in different modes
// run : String -> (String | Term) -> Opts -> Term
const run = (mode, term, opts = {}) => {
  var eras = opts.erased ? erase : (x => x);
  var defs = opts.defs || {};
  if (typeof term === "string") {
    term = defs[term] || Ref(term);
  }

  switch (mode) {

    case "REDUCE_DEBUG":
      term = eras(term);
      try {
        opts.unbox = true;
        opts.undup = true;
        term = reduce(term, opts);
      } catch (e) {
        term = reduce(term, {...opts, weak: true});
      }
      break;

    case "REDUCE_DEBUG":
    case "REDUCE_NATIVE":
      term = eras(term);
      term = to_js.decompile(to_js.compile(term, defs));
      break;

    case "REDUCE_OPTIMAL":
      term = eras(term);
      var net = to_net.compile(term, defs);
      if (opts.stats && opts.stats.input_net === null) {
        opts.stats.input_net = JSON.parse(JSON.stringify(net));
      }
      if (opts.strict) {
        var new_stats = net.reduce_strict(opts.stats || {});
      } else {
        var new_stats = net.reduce_lazy(opts.stats || {});
      }
      if (opts.stats && opts.stats.output_net !== undefined) {
        opts.stats.output_net = JSON.parse(JSON.stringify(net));
      }
      term = to_net.decompile(net);
      break;

    case "TYPECHECK":
      term = typecheck(term, null, opts);
      break;
  }

  return term;
};

module.exports = {
  Var, Typ, Tid, Utt, Utv, Ute, All, Lam,
  App, Box, Put, Tak, Dup, Num, Val, Op1,
  Op2, Ite, Cpy, Sig, Par, Fst, Snd, Prj,
  Slf, New, Use, Ann, Log, Hol, Ref,
  derive_adt_ctor,
  derive_adt_type,
  equal,
  erase,
  gen_name,
  parse,
  reduce,
  run,
  shift,
  show,
  subst,
  subst_many,
  typecheck,
  haltcheck,
  version,
};
