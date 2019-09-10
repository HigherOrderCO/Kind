// Parser for Formality-Lang. This is essentially a pack of syntax-sugars that
// are converted to FM-Core terms. This file is substantially less elegant than
// the others. Be warned!

const {
  Var,
  Typ,
  Tid,
  All,
  Lam,
  App,
  Box,
  Put,
  Tak,
  Dup,
  Wrd,
  Num,
  Op1,
  Op2,
  Ite,
  Cpy,
  Sig,
  Par,
  Fst,
  Snd,
  Prj,
  Eql,
  Rfl,
  Sym,
  Rwt,
  Slf,
  New,
  Use,
  Ann,
  Log,
  Hol,
  Ref,
  get_float_on_word,
  put_float_on_word,
  show,
  shift,
  subst,
  subst_many,
  norm,
  erase,
  equal,
  uses,
  boxcheck,
  typecheck,
  ctx_new,
  ctx_ext,
  ctx_get,
  ctx_str,
  ctx_names,
} = require("./fm-core.js");

// Usng eval prevents being catched by Webpack
const fs = typeof window === "object" ? null : eval('require("fs")');
const ls = typeof window === "object" ? window.localStorage : null;
const path = typeof window === "object" ? null : eval('require("path")');
const xhr = require("xhr-request-promise");
const version = require("./../package.json").version;

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = async (file, code, tokenify, root = true, loaded = {}) => {
  var init_parse = Date.now();

  async function do_import(import_file) {
    if (import_file.indexOf("@") === -1) {
      local_imports[import_file] = true;
    }
    if (!loaded[import_file]) {
      try {
        var file_code = await load_file(import_file);
        loaded[import_file] = await parse(import_file, file_code, tokenify, false, loaded);
      } catch (e) {
        error(e);
      }
    }
    var {defs: file_defs
      , unbx: file_unbx
      , adts: file_adts
      , open_imports: file_open_imports
      } = loaded[import_file];
    for (let term_path in file_defs) {
      defs[term_path] = file_defs[term_path];
    }
    for (let term_path in file_unbx) {
      unbx[term_path] = file_unbx[term_path];
    }
    for (let term_path in file_adts) {
      adts[term_path] = file_adts[term_path];
    }
    for (let open_import in file_open_imports) {
      open_imports[open_import] = true;
    }
    return true;
  }

  function find_name_in_imports(name) {
    var found = [];
    for (var open_import in open_imports) {
      if (defs[open_import + "/" + name]) {
        found.push(open_import + "/" + name);
      }
    }
    return found;
  }

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

  function define(path, term) {
    if (root) {
      var name = path.replace(new RegExp("^\\w*\/"), "");
      var found = find_name_in_imports(name);
      if (found.length > 0) {
        var err_str = "Attempted to re-define '" + name + "', which is already defined as:";
        for (var i = 0; i < found.length; ++i) {
          err_str += "\n- " + found[i];
        }
        error(err_str);
      }
    }
    defs[path] = term;
  }

  function ref(str) {
    return Ref(ref_path(str));
  }

  function base_ref(str) {
    var path = ref_path(str);
    if (defs[path]) {
      return Ref(path);
    } else {
      error("Attempted to use a syntax-sugar which requires `" + str + "` to be in scope, but it isn't.\n"
          + "To solve that, add `import Base@0 open` to the start of your file.\n"
          + "See http://docs.formality-lang.org/en/latest/language/Hello,-world!.html for more info.");
    }
  }

  function build_charset(chars) {
    var set = {};
    for (var i = 0; i < chars.length; ++i) {
      set[chars[i]] = 1;
    }
    return chr => set[chr] === 1;
  }

  var is_native_op = {"+":1,"-":1,"*":1,"/":1,"%":1,"^":1,".&":1,".|":1,".^":1,".!":1,".>>":1,".<<":1,".>":1,".<":1,".=":1,"+f":1,"-f":1,"*f":1,"/f":1,"%f":1,"^f":1,".f":1,".u":1};
  var op_inits     = "+-*/%^.=";
  var is_op_init   = build_charset("+-*/%^.=");
  var is_name_char = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@/");
  var is_op_char   = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@+*/%^!<>=&|");
  var is_spacy     = build_charset(" \t\n\r;");
  var is_space     = build_charset(" ");
  var is_newline   = build_charset("\n");

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

  function skip_spaces(is_space = is_spacy) {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  function next_char(is_space = is_spacy) {
    skip_spaces(is_space);
    while (code.slice(idx, idx + 2) === "//") {
      if (tokens) tokens.push(["cmm", ""]);
      while (code[idx] !== "\n" && idx < code.length) {
        next();
      }
      if (tokens) tokens.push(["txt", ""]);
      skip_spaces(is_space);
    }
  }

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

  function match(string, is_space = is_spacy) {
    next_char(is_space);
    return match_here(string);
  }

  function match_op_init(is_space = is_spacy) {
    for (var i = 0; i < op_inits.length; ++i) {
      var op_init = op_inits[i];
      if (match(op_init, is_space)) {
        return op_init;
      }
    };
    return null;
  };


  function is_sigma(string) {
    var i = idx;
    while (i < code.length && (code[i] === "~" || code[i] === " ") || is_name_char(code[i])) { ++i; }
    while (i < code.length && is_space(code[i])) { ++i; }
    return code[i] === ":";
  }

  function error(error_message) {
    var part = "";
    var text = "";
    text += "[PARSE-ERROR]\n";
    text += error_message;
    text += "\n\nI noticed the problem on line " + (row+1) + ", col " + col + ":\n";
    for (var ini = idx, il = 0; il < 7 && ini >=          0; --ini) if (code[ini] === "\n") ++il;
    for (var end = idx, el = 0; el < 6 && end < code.length; ++end) if (code[end] === "\n") ++el;
    part += "\x1b[31m" + code.slice(ini+1, idx) + "\x1b[4m" + (code[idx]||"") + "\x1b[0m\x1b[31m" + code.slice(idx + 1, end) + "\x1b[0m";
    text += part.split("\n").map((line,i) => {
      return (i === 7 ? "\x1b[31m" : "\x1b[2m") + ("    " + (row-il+i+1)).slice(-4) + "| " + line + "\x1b[0m";
    }).join("\n");
    text += "\nBut it could have happened a little earlier.";
    var excuses = [
      "My parse-robot brain isn't perfect, sorry.",
      "What? If you can't get this right, don't expect me to!",
      "I'm doing my best, ok?",
      "I hope you figure it out!",
      "I can't help any further. But I can pray for you!",
      "I with I could be more precise...",
      "Hey, at least I'm showing a location. I'm looking at you, type-checker...",
      "Why programming needs to be so hard?",
      "I hope this doesn't affect your deadlines!",
      "If this is hard, consider relaxing. You deserve it!",
      "It takes me some time to process things. Have patience with me!"
    ];
    text += "\n" + excuses[Math.floor(Math.random() * excuses.length)];
    throw text;
  }

  function build_ind(name) {
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
    return term;
  }

  function parse_exact(string) {
    if (!match(string)) {
      var text = "";
      var part = "";
      error("Expected '" + string + "', but found '" + (code[idx] || "(end of file)") + "' instead.");
    }
  }

  function parse_string_here(fn = is_name_char) {
    var name = "";
    while (idx < code.length && fn(code[idx])) {
      name = name + code[idx];
      next();
    }
    return name;
  }

  function parse_string(fn = is_name_char) {
    next_char();
    return parse_string_here(fn);
  }

  function parse_name() {
    if (is_op_init(code[idx])) {
      match(code[idx]);
      return code[idx - 1] + parse_string_here(is_op_char);
    } else {
      return parse_string();
    }
  }

  function parse_var(nams, ind_num = false) {
    var term = null;
    if (tokens) tokens.push(["???", ""]);
    var name = parse_name();
    var numb = Number(name);
    // Not a var but a number
    if (!isNaN(numb)) {
      // Inductive
      if (ind_num) {
        var term = build_ind(name);
      // Float
      } else if (name.indexOf(".") !== -1) {
        var term = Num(put_float_on_word(numb));
      // Uint
      } else {
        var term = Num(numb >>> 0);
      }
      if (tokens) tokens[tokens.length - 1][0] = "num";
    } else {
      var skip = 0;
      while (match_here("^")) {
        skip += 1;
      }
      for (var i = nams.length - 1; i >= 0; --i) {
        if (nams[i] === name) {
          if (skip === 0) break;
          else skip -= 1;
        }
      }
      if (i === -1) {
        if (is_native_op[name]) {
          term = Lam("x", Wrd(), Lam("y", Wrd(), Op2(name, Var(1), Var(0)), false), false);
          if (tokens) tokens[tokens.length - 1][0] = "nop";
        } else {
          for (var mini in enlarge) {
            if (name.slice(0, mini.length) === mini) {
              var name = enlarge[mini] + name.slice(mini.length);
              break;
            }
          }
          term = Ref(ref_path(name), false);
          if (tokens) {
            tokens[tokens.length - 1][0] = "ref";
            tokens[tokens.length - 1][2] = term[1].name;
          }
        }
      } else {
        term = Var(nams.length - i - 1);
        if (tokens) tokens[tokens.length - 1][0] = "var";
      }
    }
    if (tokens) tokens.push(["txt", ""]);
    return term;
  }

  function parse_term(nams) {
    var parsed;

    // First parsing phase (terms)

    // Parenthesis
    if (match("(")) {
      var term = parse_term(nams);
      var skip = parse_exact(")");
      parsed = term;
    }

    // Type
    else if (match("Type")) {
      parsed = Typ();
    }

    // Type
    else if (match("type(")) {
      var expr = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Tid(expr);
    }

    // Prints active definitions
    else if (match("?scope?")) {
      console.log("Scope:");
      for (var i = 0; i < nams.length; ++i) {
        console.log("- " + nams[i]);
      }
      parsed = parse_term(nams);
    }

    // Hole
    else if (match("?")) {
      var name = parse_string_here();
      parsed = Hol(name);
    }

    // Lambdas and Forall
    else if (match("{")) {
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
        if (match("}")) break; else parse_exact(",");
      }
      var isall = match("->");
      var islam = match("=>");
      if (!isall && !islam) {
        // TODO: error
      }
      var term = parse_term(nams.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        var ctr = isall ? All : Lam;
        term = ctr(names[i], types[i], term, erass[i]);
        if (isall && !types[i]) {
          error("Parse error: invalid forall.");
        }
      }
      parsed = term;
    }

    // Duplication
    else if (match("dup ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var expr = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      parsed = Dup(name, expr, body);
    }

    // Box
    else if (match("!")) {
      var expr = parse_term(nams);
      parsed = Box(expr);
    }

    // Put
    else if (match("#")) {
      var expr = parse_term(nams);
      parsed = Put(expr);
    }

    // Take
    else if (match("<")) {
      var expr = parse_term(nams);
      var skip = parse_exact(">");
      parsed = Tak(expr);
    }

    // Let
    else if (match("let ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var copy = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      parsed = subst(body, copy, 0);
    }

    // Wrd
    else if (match("Word")) {
      parsed = Wrd();
    }

    // String
    else if (match("\"")) {
      // Parses text
      var text = "";
      while (code[idx] !== "\"") {
        text += code[idx];
        next();
      }
      next();
      var bytes = [].slice.call(new TextEncoder("utf-8").encode(text), 0);
      while (bytes.length % 4 !== 0) {
        bytes.push(0);
      }
      var nums = new Uint32Array(new Uint8Array(bytes).buffer);
      var term = App(base_ref("nil"), Wrd(), true);
      for (var i = nums.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), Wrd(), true), Num(nums[i]), false), term, false);
      }
      parsed = Ann(base_ref("String"), term);
    }

    // Nat
    else if (match("0n")) {
      var name = parse_string();
      var numb = Number(name);
      var term = base_ref("zero");
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      parsed = term;
    }

    // Ind
    else if (match("*")) {
      var name = parse_string();
      parsed = build_ind(name);
    }

    // If-Then-Else
    else if (match("if ")) {
      var cond = parse_term(nams);
      var skip = match("then:") || parse_exact(":");
      var val0 = parse_term(nams);
      var skip = parse_exact("else:");
      var val1 = parse_term(nams);
      parsed = Ite(cond, Par(val0, val1, 0));
    }

    // Copy
    else if (match("cpy ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var numb = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      parsed = Cpy(name, numb, body);
    }

    // Sigma / Pair
    else if (match("[")) {
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
        parsed = parse_term(nams.concat(names));
        var skip = parse_exact("]");
        for (var i = names.length - 1; i >= 0; --i) {
          parsed = Sig(names[i], types[i], parsed, erass[i]);
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
        parsed = terms.pop();
        for (var i = terms.length - 1; i >= 0; --i) {
          parsed = Par(terms[i], parsed, erass[i]);
        }
      }
    }

    // First
    else if (match("fst(")) {
      var pair = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Fst(pair, 0);
    }

    // First (erased)
    else if (match("~fst(")) {
      var pair = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Fst(pair, 2);
    }

    // Second
    else if (match("snd(")) {
      var pair = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Snd(pair, 0);
    }

    // Second (erased)
    else if (match("~snd(")) {
      var pair = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Snd(pair, 1);
    }

    // Projection
    else if (match("get ")) {
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
      parsed = parse_term(nams.concat(names));
      for (var i = names.length - 2; i >= 0; --i) {
        var nam1 = names[i];
        var nam2 = i === names.length - 2 ? names[i + 1] : "aux";
        var expr = i === 0 ? pair : Var(0);
        var body = i === 0 ? parsed : shift(parsed, 1, 2);
        parsed = Prj(nam1, nam2, expr, body, erass[i]);
      }
    }

    // Reflexivity
    else if (match("refl(~")) {
      var expr = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Rfl(expr);
    }

    // Symmetry
    else if (match("sym(~")) {
      var prof = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Sym(prof);
    }

    // Logging
    else if (match("log(")) {
      var msge = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      parsed = Log(msge, expr);
    }

    // Slf
    else if (match("$")) {
      var name = parse_string();
      var type = parse_term(nams.concat([name]));
      parsed = Slf(name, type);
    }

    // New
    else if (match("new(~")) {
      var type = parse_term(nams);
      var skip = parse_exact(")");
      var expr = parse_term(nams);
      parsed = New(type, expr);
    }

    // Use
    else if (match("%")) {
      var expr = parse_term(nams);
      parsed = Use(expr);
    }

    // Case syntax sugar
    else if (match("case/")) {
      var adt_name = parse_string();
      var term = parse_term(nams);
      if (!adt_name || !adts[ref_path(adt_name)]) {
        error("Used case-syntax on undefined type `" + (adt_name || "?") + "`.");
      }
      var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[ref_path(adt_name)];

      var cses = [];
      for (var c = 0; c < adt_ctor.length; ++c) {
        var skip = parse_exact("|");
        var skip = parse_exact(adt_ctor[c][0]);
        var skip = parse_exact("=>");
        var ctors = adt_ctor[c][1];
        cses[c] = parse_term(nams.concat(adt_ctor[c][1].map(([name,type]) => name)));
        for (var i = 0; i < ctors.length; ++i) {
          cses[c] = Lam(ctors[ctors.length - i - 1][0], null, cses[c], ctors[ctors.length - i - 1][2]);
        }
      }

      var skip = parse_exact(":");
      var moti = parse_term(nams.concat(adt_indx.map(([name,type]) => name)).concat(["self"]));
      var moti = Lam("self", null, moti, false);
      for (var i = adt_indx.length - 1; i >= 0; --i) {
        var moti = Lam(adt_indx[i][0], null, moti, false);
      }

      var term = Use(term);
      var term = App(term, moti, true);
      for (var i = 0; i < cses.length; ++i) {
        var term = App(term, cses[i], false);
      }

      parsed = term;
    }

    // Unary operators
    else if (match(".!(")) {
      var argm = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Op2(".!", Num(0), argm);
    }
    else if (match(".f(")) {
      var argm = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Op2(".f", Num(0), argm);
    }
    else if (match(".u(")) {
      var argm = parse_term(nams);
      var skip = parse_exact(")");
      parsed = Op2(".u", Num(0), argm);
    }

    // Variable / Reference
    else {
      parsed = parse_var(nams, false);
    }

    // Second parsing phase ("glued" parses)
    if (match_here("*")) {
      var term = parse_var(nams, true);
      parsed = App(parsed, term, false);
    }

    // Third parsing phase (operators)
    var matched_op_init = null;
    var matched = true;
    while (matched) {
      // Applications
      if (matched = match("(", is_space)) {
        var term = parsed;
        while (idx < code.length) {
          var eras = match("~");
          var argm = parse_term(nams);
          var term = App(term, argm, eras);
          if (match(")")) break;
          parse_exact(",");
        }
        parsed = term;
      }

      // List
      else if (matched = match("$", is_space)) {
        var type = parsed;
        var list = [];
        var skip = parse_exact("[");
        while (idx < code.length && !match("]")) {
          list.push(parse_term(nams));
          if (match("]")) break; else parse_exact(",");
        }
        var term = App(base_ref("nil"), type, true);
        for (var i = list.length - 1; i >= 0; --i) {
          var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false);
        }
        parsed = term;
      }

      // Rewrite / Annotation
      else if (matched = match("::", is_space)) {
        // Rewrite
        if (match("rewrite ")) {
          var name = parse_string();
          var skip = parse_exact("in");
          var type = parse_term(nams.concat([name]));
          var skip = parse_exact("with");
          var prof = parse_term(nams);
          parsed = Rwt(name, type, prof, parsed);
        }

        // Annotation
        else {
          var type = parse_term(nams);
          parsed = Ann(type, parsed, false);
        }
      }

      // Operators
      else if (matched = !!(matched_op_init = match_op_init(is_space))) {
        if (tokens) tokens.pop();
        var func = matched_op_init + parse_string_here(x => !is_space(x));
        if (tokens) tokens.push(["txt", ""]);
        var argm = parse_term(nams);
        if (is_native_op[func]) {
          parsed = Op2(func, parsed, argm);
        } else if (func === "->") {
          parsed = All("", parsed, shift(argm, 1, 0), false);
        } else if (func === "==") {
          parsed = Eql(parsed, argm);
        } else {
          parsed = App(App(ref(func), parsed, false), argm, false);
        }
      }
    }

    return parsed;
  }

  var open_imports = {};
  var qual_imports = {};
  var local_imports = {};
  var file_version = {};
  var tokens = tokenify ? [["txt",""]] : null;
  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  var adts = {};
  var unbx = {};
  var enlarge = {};
  while (idx < code.length) {
    next_char();

    // Shorten
    if (match("alias")) {
      var full = parse_string();
      var skip = parse_exact("as");
      var mini = parse_string();
      enlarge[mini] = full;

    // Import
    } else if (match("import ")) {
      if (tokens) tokens.push(["imp", ""]);
      var impf = parse_string();
      if (tokens) tokens.push(["txt", ""]);
      var qual = match("as") ? parse_string() : null;
      var open = match("open");
      if (qual) qual_imports[qual] = impf;
      qual_imports[impf] = impf;
      open_imports[impf] = true;
      await do_import(impf);

    // Datatypes
    } else if (match("T ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_nams = [adt_name];
      var adt_typs = [null];

      // Datatype parameters
      if (match("{")) {
        while (idx < code.length) {
          var eras = false;
          var name = parse_string();
          var skip = parse_exact(":");
          var type = await parse_term(adt_pram.map((([name,type]) => name)));
          adt_pram.push([name, type, eras]);
          if (match("}")) break; else parse_exact(",");
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
          var skip = parse_exact(":");
          var type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
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
        if (match("{")) {
          while (idx < code.length) {
            var eras = match("~");
            var name = parse_string();
            var skip = parse_exact(":");
            var type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
            ctor_flds.push([name, type, eras]);
            if (match("}")) break; else parse_exact(",");
          }
        }
        // Constructor type (written)
        if (match(":")) {
          var ctor_type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
        // Constructor type (auto-filled)
        } else {
          var ctor_indx = [];
          if (match("(")) {
            while (idx < code.length) {
              ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
              if (match(")")) break; else parse_exact(",");
            }
          }
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

    // Prints active definitions
    } else if (match("?defs")) {
      var filt = match("/") ? parse_string(x => x !== "/") : "";
      var regx = new RegExp(filt, "i");
      console.log("Definitions:");
      for (var def in defs) {
        if (def[0] !== "$" && regx.test(def)) {
          console.log("- " + def);
        }
      }
      parsed = parse_term([]);

    // Definitions or end-of-file
    } else {
      // Parses box annotation
      var boxed = match("#");

      // Parses definition name
      if (tokens) tokens.push(["def", ""]);
      var name = parse_name();
      if (tokens) tokens[tokens.length - 1][2] = file+"/"+name;
      if (tokens) tokens.push(["txt", ""]);

      // If name is empty, stop
      if (name.length === 0) break;

      // Parses recursion depth name
      var recur     = match_here("*");
      var rec_depth = recur ? parse_string() : null;
      var rec_idx_n = recur ? [rec_depth] : [];
      var rec_names = recur ? [name] : [];

      var typed = match(":");

      // Typed definition
      if (typed) {

        // Parses level 0 argument names and types
        var lv0_erass = [];
        var lv0_names = [];
        var lv0_boxed = [];
        var lv0_dup_n = [];
        var lv0_dup_t = [];
        var lv0_dup_i = [];
        var lv0_types = [];
        if (boxed && match("{")) {
          var count = 0;
          while (idx < code.length) {
            var arg_eras = match("~");
            var arg_name = parse_string();
            var arg_skip = parse_exact(":");
            var arg_boxd = match("!");
            var arg_type = await parse_term(lv0_names);
            lv0_erass.push(arg_eras);
            lv0_names.push(arg_name);
            lv0_boxed.push(arg_boxd);
            if (arg_boxd) {
              lv0_dup_n.push(arg_name);
              lv0_dup_t.push(null);
              lv0_dup_i.push(count);
            }
            lv0_types.push(arg_type);
            if (match("}")) break; else parse_exact(",");
            ++count;
          }
          var skip = parse_exact("->");
        }

        // Parses extra level_0 duplications
        var lv0_imp_n = [];
        var lv0_imp_t = [];
        var lv0_imp_v = [];
        while (match("dup ")) {
          var dup_name = parse_string();
          var dup_skip = parse_exact("=");
          var dup_expr = parse_term(lv0_names.concat(lv0_imp_n));
          lv0_imp_n.push(dup_name);
          lv0_imp_t.push(null);
          lv0_imp_v.push(dup_expr);
        }

        // Checks if it is properly boxed
        if ((recur || boxed) && !match("!")) {
          error((recur ? "Recursive definition" : "Definition") + " `" + name + "` must be boxed. Annotate its type with a `!`.");
        }

        // Parses argument names and types
        var erass = [];
        var names = [];
        var projs = [];
        var keeps = [];
        var wordn = [];
        var wordt = [];
        var wordi = [];
        var types = [];
        var basex = null;
        if (match("{")) {
          var count = 0;
          while (idx < code.length) {
            var arg_proj = match("case ");
            var arg_eras = match("~");
            var arg_halt = match("halt");
            var arg_name = parse_string();
            var arg_skip = parse_exact(":");
            var arg_type = await parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_idx_n).concat(names));
            erass.push(arg_eras);
            names.push(arg_name);
            types.push(arg_type);
            basex = arg_halt ? count : basex;
            if (arg_proj) {
              projs.push(count);
            } else if (!arg_eras) {
              keeps.push(count);
            }
            if (arg_type[0] === "Wrd") {
              wordn.push(arg_name);
              wordt.push(Wrd());
              wordi.push(count);
            };
            if (match("}")) break; else parse_exact(",");
            ++count;
          }
          var skip = parse_exact("->");
        }
        var type = await parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_idx_n).concat(names));

        // Parses the definition body
        var body_nams = lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_idx_n).concat(rec_names).concat(names);

        // Case-tree syntax
        if (projs.length > 0) {

          // Finds the ADTs from annotated types
          var proj_adts = [];
          for (var i = 0; i < projs.length; ++i) {
            var proj_type = types[projs[i]];
            while (proj_type[0] === "App") {
              proj_type = erase(proj_type[1].func);
            }
            var adt_name = proj_type[0] === "Ref" ? ref_path(proj_type[1].name) : null;
            if (adts[adt_name]) {
              proj_adts[i] = adts[adt_name];
            } else {
              error("Couldn't find the datatype of the `" + names[projs[i]] + "` argument of the `" + name + "` function.\n"
                  + "This is a language limitation. Consider removing type alises, or using the case expression instead.");
            }
          }

          // Builds the objects for each proj
          var proj_names = [];
          var proj_terms = [];
          var proj_types = [];
          var proj_infos = [];
          for (var i = 0; i < projs.length; ++i) {
            proj_infos[i] = {
              name: names[projs[i]],
              orig: Var(-1 + names.length - projs[i]),
              term: Var(-1 + names.length - projs[i]),
              type: shift(types[projs[i]], names.length - projs[i], 0),
              adt: proj_adts[i]
            };
          }

          // Builds the objects for each keep
          var keep_infos = [];
          if (recur) {
            var moti_type = ref(name + ".moti");
            for (var i = 0; i < lv0_names.length; ++i) {
              var moti_type = App(moti_type, Var(-1 + names.length + rec_names.length + rec_idx_n.length + lv0_imp_n.length + lv0_dup_n.length + lv0_names.length - i), false);
            }
            var moti_type = App(moti_type, Var(-1 + names.length + rec_names.length + rec_idx_n.length), false);
            keep_infos.push({
              name: name,
              orig: Var(-1 + names.length + rec_names.length),
              term: Var(-1 + names.length + rec_names.length),
              type: moti_type
            });
          }
          for (var i = 0; i < keeps.length; ++i) {
            keep_infos[i] = {
              name: names[keeps[i]],
              orig: Var(-1 + names.length - keeps[i]),
              term: Var(-1 + names.length - keeps[i]),
              type: shift(types[keeps[i]], names.length - keeps[i], 0)
            };
          }

          // Builds the initial motive
          var moti = type;
          var moti = shift(moti, rec_idx_n.length, names.length); // Adds recur variable
          if (recur) { // Adjusts recur index to step(n)
            var moti = replace(names.length + rec_names.length + rec_idx_n.length - 1, App(ref("step"), Var(names.length + 1), false), moti);
          }

          // Builds the case-tree by matching projected terms
          var term = await (async function parse_case_tree(idx, projs, keeps, moti, branch, nams) {
            // We still have values to project
            if (idx < projs.length) {

              // Gets the projected dataype
              var {adt_name, adt_pram, adt_indx, adt_ctor} = projs[idx].adt;
              if (adt_indx.length > 0) {
                error("The case-tree syntax isn't compatible with the indexed datatype '" + adt_name + "' yet."
                    + "Use the @ syntax to write the '" + name + "' function instead.");
              }

              // Builds the application motive
              var term_moti = shift(moti, adt_indx.length + 1 + projs.length - (idx + 1) + keeps.length, 0);
              for (var i = keeps.length - 1; i >= 0; --i) {
                var term_moti = All(keeps[i].name, shift(keeps[i].type, 1 + projs.length - (idx + 1) + i, 0), term_moti, false);
              }
              for (var i = projs.length - 1; i > idx; --i) {
                var term_moti = replace(projs[i].orig[1].index + 1 + i - (idx + 1) + 1, Var(0), term_moti);
                var term_moti = All(projs[i].name, shift(projs[i].type, 1 + i - (idx + 1), 0), term_moti, false);
              }
              var term_moti = replace(projs[i].orig[1].index + 1, Var(0), term_moti);
              var term_moti = Lam("self", null, term_moti, false);

              // Builds the application term
              var term = Use(projs[idx].term);
              var term = App(term, term_moti, true);

              // Builds each applied case
              for (var ctor_n = 0; ctor_n < adt_ctor.length; ++ctor_n) {
                // Adjusts scope to enter case
                var fldn = adt_ctor[ctor_n][1].map((([name,type,eras]) => projs[idx].name + "." + name));
                var fldt = adt_ctor[ctor_n][1].map((([name,type,eras]) => type));
                var prjn = projs.slice(idx + 1).map(({name}) => name);
                var kepn = keeps.map(({name}) => name);
                var newn = [].concat(fldn).concat(prjn).concat(kepn);

                // Adjusts keeps to enter case
                var new_keeps = [];
                for (var i = 0; i < keeps.length; ++i) {
                  new_keeps.push({
                    name: keeps[i].name,
                    term: Var(-1 + keeps.length - i),
                    orig: shift(keeps[i].orig, newn.length, 0),
                    type: shift(keeps[i].type, newn.length, 0)
                  });
                }

                // Adjusts projs to enter case
                var new_projs = [];
                for (var i = 0; i < projs.length; ++i) {
                  new_projs.push({
                    name: projs[i].name,
                    term: i < idx
                      ? shift(projs[i].term, newn.length, 0)
                      : Var(-1 + kepn.length + prjn.length - (i - (idx + 1))),
                    orig: shift(projs[i].orig, newn.length, 0),
                    type: shift(projs[i].type, newn.length, 0),
                    adt: projs[i].adt
                  });
                }

                // Builds the substitution list for ADT parameters
                var adtt = projs[idx].type;
                var pram = [];
                while (adtt[0] === "App") {
                  pram.push(adtt[1].argm);
                  adtt = adtt[1].func;
                }
                if (pram.length !== adt_pram.length) {
                  error("Couldn't build parameter list for argument `" + projs[idx].name + "` of function `" + name + "`.\n"
                      + "This is a language limitation. Consider removing type alises, or using the case expression instead.");
                }
                var subs = [ref(adt_name)].concat(pram.reverse());

                // Add constructor fields to keeps
                for (var i = 0; i < fldn.length; ++i) {
                  var field_type = fldt[i];
                  var field_type = subst_many(field_type, subs, i);
                  var field_type = shift(field_type, newn.length, 0);
                  new_keeps.push({
                    name: fldn[i],
                    term: Var(-1 + newn.length - i),
                    orig: Var(-1 + newn.length - i),
                    type: field_type
                  });
                }

                // Adjusts motive to enter case
                var new_moti = shift(moti, newn.length, 0);

                // Builds the case body recursively
                var argm = await parse_case_tree(idx + 1, new_projs, new_keeps, new_moti, branch.concat([ctor_n]), nams.concat(newn));

                // Substitutes the open form of the projected value
                var self = ref(adt_ctor[ctor_n][0]);
                for (var i = 0; i < fldn.length; ++i) {
                  self = App(self, Var(-1 + kepn.length + prjn.length + fldn.length - i), false);
                }
                var argm = replace(projs[idx].orig[1].index + newn.length, self, argm);

                // Wraps keeps, projs and field lambdas
                for (var i = kepn.length - 1; i >= 0; --i) {
                  argm = Lam(kepn[i], null, argm, false);
                }
                for (var i = prjn.length - 1; i >= 0; --i) {
                  argm = Lam(prjn[i], null, argm, false);
                }
                for (var i = fldn.length - 1; i >= 0; --i) {
                  argm = Lam(fldn[i], null, argm, false);
                }
                var term = App(term, argm, false);
              }

              // Applies term to each proj and keep
              for (var i = idx + 1; i < projs.length; ++i) {
                var term = App(term, projs[i].term, false);
              }
              for (var i = 0; i < keeps.length; ++i) {
                var term = App(term, keeps[i].term, false);
              }

              return term;
            } else {
              // Parses the case line
              var skip = parse_exact("|");
              for (var i = 0; i < branch.length; ++i) {
                var skip = parse_exact(projs[i].adt.adt_ctor[branch[i]][0]);
              }
              var skip = parse_exact("=>");

              // Parses the case term
              var term = parse_term(nams);

              return term;
            }
          })(0, proj_infos, keep_infos, moti, [], body_nams);

        } else {
          var term = await parse_term(body_nams.concat(wordn));

          // Fills numeric copies
          for (var i = wordn.length - 1; i >= 0; --i) {
            var term = Cpy(wordn[i], Var(-1 + names.length + i - wordi[i]), term);
          }
        }

        // Parses the halting case
        if (recur && basex === null && !match("halt:")) {
          error("The bounded-recursive (inductive) definition '" + name + "' needs a halting (base) case. Provide it using `halt:`.");
        }
        if (recur && basex !== null) {
          var base = Var(-1 + names.length - basex);
        } else if (recur) {
          var base = await parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(names));
        } else {
          var base = null;
        }

        // Fills type wrapper
        if (type[0] === "Typ") {
          var term = Tid(term);
        }
        var type = Tid(type);

        // Fills foralls and lambdas of arguments
        for (var i = names.length - 1; i >= 0; --i) {
          var type = All(names[i], types[i], type, erass[i]);
          var term = Lam(names[i], null    , term, erass[i]);
          var base = base && Lam(names[i], null    , base, erass[i]);
        }

        // Aux function to add level 0 headers
        const lv0_headers = (is_type, term, eras = true) => {
          for (var i = lv0_imp_n.length - 1; i >= 0; --i) {
            var term = Dup(lv0_imp_n[i], lv0_imp_v[i], term);
          }
          for (var i = lv0_dup_n.length - 1; i >= 0; --i) {
            var term = Dup(lv0_dup_n[i], Var(-1 + lv0_names.length + i - lv0_dup_i[i]), term);
          }
          for (var i = lv0_names.length - 1; i >= 0; --i) {
            var term = (is_type ? All : Lam)(lv0_names[i], is_type ? (lv0_boxed[i] ? Box : (x=>x))(lv0_types[i]) : null, term, eras && lv0_erass[i]);
          }
          return term;
        }

        // Builds a non-recursive, non-boxed definition
        if (!recur && !boxed) {
          define(file+"/"+name, Ann(type, term, false));

        // Builds a non-recursive, boxed definition
        } else if (!recur && boxed) {
          var type = lv0_headers(1, Box(type), true);
          var term = lv0_headers(0, Put(term), true);
          define(file+"/"+name, Ann(type, term, false));
          unbx[file+"/"+name] = {depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length};

        // Builds a recursive, non-boxed definition
        } else if (!boxed && recur) {
          error("Bounded-recursive (inductive) definition `" + name + "` must be boxed. Add a '!' before its name.");

        // Builds a recursive, boxed definition
        } else if (boxed && recur) {
          // Builds the motive
          var moti_type = lv0_headers(1, All(rec_depth, base_ref("Ind"), Typ(), false), false);
          var moti_term = lv0_headers(0, Lam(rec_depth, null, type, false), false);

          // Builds the step case
          var step_typ0 = type;
          var step_typ1 = shift(subst(shift(type, 1, 1), App(base_ref("step"), Var(0), false), 0), 1, 0);
          var step_type = lv0_headers(1, Box(All(rec_depth, base_ref("Ind"), All(name, step_typ0, step_typ1, false), true)), true);
          var step_term = lv0_headers(0, Put(Lam(rec_depth, null, Lam(name, null, term, false), true)), true);

          // Builds the base case
          var base_type = lv0_headers(1, Box(subst(type, base_ref("base"), 0)), true);
          var base_term = lv0_headers(0, Put(base), true);

          // Builds the recursive function
          var ind_moti = ref(name+".moti");
          var ind_step = ref(name+".step");
          var ind_base = ref(name+".base");
          for (var i = 0, c = 0; i < lv0_names.length; ++i) {
            if (lv0_boxed[i]) {
              var vari = Put(Var(-1 + lv0_imp_n.length + lv0_dup_n.length - (c++)));
            } else {
              var vari = Var(-1 + lv0_imp_n.length + lv0_dup_n.length + lv0_names.length - i);
            }
            ind_moti = App(ind_moti, vari, false);
            ind_step = App(ind_step, vari, lv0_erass[i]);
            ind_base = App(ind_base, vari, lv0_erass[i]);
          }
          var type = All(rec_depth, base_ref("Ind"), lv0_headers(1, Box(subst(type, Var(lv0_names.length + lv0_dup_n.length + lv0_imp_n.length), 0)), true), false);
          var term = App(base_ref("ind"), Var(lv0_names.length + lv0_dup_n.length + lv0_imp_n.length), false);
          var term = App(term, ind_moti, true);
          var term = App(term, ind_step, false);
          var term = App(term, ind_base, false);
          var term = Lam(rec_depth, null, lv0_headers(0, term, true), false);

          define(file+"/"+name+".moti", Ann(moti_type, moti_term, false));
          define(file+"/"+name+".step", Ann(step_type, step_term, false));
          define(file+"/"+name+".base", Ann(base_type, base_term, false));
          define(file+"/"+name, Ann(type, term, false));
          unbx[file+"/"+name+".moti"] = {depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length};
          unbx[file+"/"+name+".step"] = {depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length};
          unbx[file+"/"+name+".base"] = {depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length};
          unbx[file+"/"+name]         = {depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length + 1};
        }

      // Untyped definition
      } else {
        var term = await parse_term([]);
        define(file+"/"+name, term);
      }
    }

    next_char();
  }

  // When a reference to a boxed definiton is used inside a boxed definition,
  // automatically unbox it by appending `dup ref = ref; ...` to the term
  if (root) {
    for (var path in unbx) {
      var info = unbx[path];
      var term = defs[path];
      var lens = {term, field: "expr"};
      for (var i = 0; i < info.depth; ++i) {
        var lens = {term: lens.term[1][lens.field], field: "body"};
      }
      var unbox = [];
      lens.term[1][lens.field] = rewrite(lens.term[1][lens.field], (term, scope, erased) => {
        if (term[0] === "Tak" && !erased) {
          for (var i = 0; i < scope.length; ++i) {
            term = subst(term, Num(0), 0);
          }
          unbox.push(["k" + unbox.length, term[1].expr]);
          return Ref("$TMP$" + (unbox.length - 1));
        }
      });
      for (var i = unbox.length - 1; i >= 0; --i) {
        lens.term[1][lens.field] = Dup(unbox[i][0], unbox[i][1], shift(lens.term[1][lens.field], 1, 0));
      }
      lens.term[1][lens.field] = rewrite(lens.term[1][lens.field], (term, scope) => {
        if (term[0] === "Ref" && term[1].name.slice(0,5) === "$TMP$") {
          return Var(-1 + scope.length - Number(term[1].name.slice(5)));
        }
      });
    }
  }

  return {defs, adts, unbx, tokens, local_imports, qual_imports, open_imports};
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

// Maps defs
const replace_refs = ([ctor, term], renamer, depth = 0) => {
  switch (ctor) {
    case "Var":
      return Var(term.index);
    case "Typ":
      return Typ();
    case "Tid":
      var expr = replace_refs(term.expr, renamer, depth);
      return Tid(expr);
    case "All":
      var name = term.name;
      var bind = replace_refs(term.bind, renamer, depth);
      var body = replace_refs(term.body, renamer, depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = term.bind && replace_refs(term.bind, renamer, depth);
      var body = replace_refs(term.body, renamer, depth + 1);
      var eras = term.eras;
      return Lam(name, bind, body, eras);
    case "App":
      var func = replace_refs(term.func, renamer, depth);
      var argm = replace_refs(term.argm, renamer, depth);
      var eras = term.eras;
      return App(func, argm, term.eras);
    case "Box":
      var expr = replace_refs(term.expr, renamer, depth);
      return Box(expr);
    case "Put":
      var expr = replace_refs(term.expr, renamer, depth);
      return Put(expr);
    case "Tak":
      var expr = replace_refs(term.expr, renamer, depth);
      return Tak(expr);
    case "Dup":
      var name = term.name;
      var expr = replace_refs(term.expr, renamer, depth);
      var body = replace_refs(term.body, renamer, depth + 1);
      return Dup(name, expr, body);
    case "Wrd":
      return Wrd();
    case "Num":
      var numb = term.numb;
      return Num(numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = replace_refs(term.num0, renamer, depth);
      var num1 = replace_refs(term.num1, renamer, depth);
      return Op2(func, num0, num1);
    case "Ite":
      var cond = replace_refs(term.cond, renamer, depth);
      var pair = replace_refs(term.pair, renamer, depth);
      return Ite(cond, pair);
    case "Cpy":
      var name = term.name;
      var numb = replace_refs(term.numb, renamer, depth);
      var body = replace_refs(term.body, renamer, depth + 1);
      return Cpy(name, numb, body);
    case "Sig":
      var name = term.name;
      var typ0 = replace_refs(term.typ0, renamer, depth);
      var typ1 = replace_refs(term.typ1, renamer, depth + 1);
      var eras = term.eras;
      return Sig(name, typ0, typ1, eras);
    case "Par":
      var val0 = replace_refs(term.val0, renamer, depth);
      var val1 = replace_refs(term.val1, renamer, depth);
      var eras = term.eras;
      return Par(val0, val1, eras);
    case "Fst":
      var pair = replace_refs(term.pair, renamer, depth);
      var eras = term.eras;
      return Fst(pair, eras);
    case "Snd":
      var pair = replace_refs(term.pair, renamer, depth);
      var eras = term.eras;
      return Snd(pair, eras);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = replace_refs(term.pair, renamer, depth);
      var body = replace_refs(term.body, renamer, depth + 2);
      var eras = term.eras;
      return Prj(nam0, nam1, pair, body, eras);
    case "Eql":
      var val0 = replace_refs(term.val0, renamer, depth);
      var val1 = replace_refs(term.val1, renamer, depth);
      return Eql(val0, val1);
    case "Rfl":
      var expr = replace_refs(term.expr, renamer, depth);
      return Rfl(expr);
    case "Sym":
      var prof = replace_refs(term.prof, renamer, depth);
      return Sym(prof);
    case "Rwt":
      var name = term.name;
      var type = replace_refs(term.type, renamer, depth + 1);
      var prof = replace_refs(term.prof, renamer, depth);
      var expr = replace_refs(term.expr, renamer, depth);
      return Rwt(name, type, prof, expr);
    case "Slf":
      var name = term.name;
      var type = replace_refs(term.type, renamer, depth + 1);
      return Slf(name, type);
    case "New":
      var type = replace_refs(term.type, renamer, depth);
      var expr = replace_refs(term.expr, renamer, depth);
      return New(type, expr);
    case "Use":
      var expr = replace_refs(term.expr, renamer, depth);
      return Use(expr);
    case "Ann":
      var type = replace_refs(term.type, renamer, depth);
      var expr = replace_refs(term.expr, renamer, depth);
      var done = term.done;
      return Ann(type, expr, done);
    case "Log":
      var msge = replace_refs(term.msge, renamer, depth);
      var expr = replace_refs(term.expr, renamer, depth);
      return Log(msge, expr);
    case "Hol":
      var name = term.name;
      return Hol(name);
    case "Ref":
      var new_name = renamer(term.name, depth);
      if (typeof new_name === "string") {
        return Ref(new_name, term.eras, term.file);
      } else if (typeof new_name === "object") {
        return new_name;
      } else {
        return Ref(term.name, term.eras, term.file);
      }
  }
}

const rewrite = ([ctor, term], rewriter, scope = [], erased = false, only_once = false) => {
  var rewritten = rewriter([ctor, term], scope, erased);
  if (rewritten) {
    return only_once ? rewritten : rewrite(rewritten, rewriter, scope, erased, only_once);
  } else {
    switch (ctor) {
      case "Var":
        return Var(term.index);
      case "Typ":
        return Typ();
      case "Tid":
        var expr = rewrite(term.expr, rewriter, scope, true, only_once);
        return Tid(expr);
      case "All":
        var name = term.name;
        var bind = rewrite(term.bind, rewriter, scope, true, only_once);
        var body = rewrite(term.body, rewriter, scope.concat([name]), true, only_once);
        var eras = term.eras;
        return All(name, bind, body, eras);
      case "Lam":
        var name = term.name;
        var bind = term.bind && rewrite(term.bind, rewriter, scope, true, only_once);
        var body = rewrite(term.body, rewriter, scope.concat([name]), erased, only_once);
        var eras = term.eras;
        return Lam(name, bind, body, eras);
      case "App":
        var func = rewrite(term.func, rewriter, scope, erased, only_once);
        var argm = rewrite(term.argm, rewriter, scope, term.eras || erased, only_once);
        var eras = term.eras;
        return App(func, argm, term.eras);
      case "Box":
        var expr = rewrite(term.expr, rewriter, scope, true, only_once);
        return Box(expr);
      case "Put":
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        return Put(expr);
      case "Tak":
        var expr = rewrite(term.expr, rewriter, scope, true, only_once);
        return Tak(expr);
      case "Dup":
        var name = term.name;
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        var body = rewrite(term.body, rewriter, scope.concat([name]), erased, only_once);
        return Dup(name, expr, body);
      case "Wrd":
        return Wrd();
      case "Num":
        var numb = term.numb;
        return Num(numb);
      case "Op1":
      case "Op2":
        var func = term.func;
        var num0 = rewrite(term.num0, rewriter, scope, erased, only_once);
        var num1 = rewrite(term.num1, rewriter, scope, erased, only_once);
        return Op2(func, num0, num1);
      case "Ite":
        var cond = rewrite(term.cond, rewriter, scope, erased, only_once);
        var pair = rewrite(term.pair, rewriter, scope, erased, only_once);
        return Ite(cond, pair);
      case "Cpy":
        var name = term.name;
        var numb = rewrite(term.numb, rewriter, scope, erased, only_once);
        var body = rewrite(term.body, rewriter, scope.concat([name]), erased, only_once);
        return Cpy(name, numb, body);
      case "Sig":
        var name = term.name;
        var typ0 = rewrite(term.typ0, rewriter, scope, true, only_once);
        var typ1 = rewrite(term.typ1, rewriter, scope.concat([name]), true, only_once);
        var eras = term.eras;
        return Sig(name, typ0, typ1, eras);
      case "Par":
        var val0 = rewrite(term.val0, rewriter, scope, term.eras === 1 || erased, only_once);
        var val1 = rewrite(term.val1, rewriter, scope, term.eras === 1 || erased, only_once);
        var eras = term.eras;
        return Par(val0, val1, eras);
      case "Fst":
        var pair = rewrite(term.pair, rewriter, scope, erased, only_once);
        var eras = term.eras;
        return Fst(pair, eras);
      case "Snd":
        var pair = rewrite(term.pair, rewriter, scope, erased, only_once);
        var eras = term.eras;
        return Snd(pair, eras);
      case "Prj":
        var nam0 = term.nam0;
        var nam1 = term.nam1;
        var pair = rewrite(term.pair, rewriter, scope, erased, only_once);
        var body = rewrite(term.body, rewriter, scope.concat([nam0, nam1]), erased, only_once);
        var eras = term.eras;
        return Prj(nam0, nam1, pair, body, eras);
      case "Eql":
        var val0 = rewrite(term.val0, rewriter, scope, true, only_once);
        var val1 = rewrite(term.val1, rewriter, scope, true, only_once);
        return Eql(val0, val1);
      case "Rfl":
        var expr = rewrite(term.expr, rewriter, scope, true, only_once);
        return Rfl(expr);
      case "Sym":
        var prof = rewrite(term.prof, rewriter, scope, true, only_once);
        return Sym(prof);
      case "Rwt":
        var name = term.name;
        var type = rewrite(term.type, rewriter, scope.concat([name]), true, only_once);
        var prof = rewrite(term.prof, rewriter, scope, true, only_once);
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        return Rwt(name, type, prof, expr);
      case "Slf":
        var name = term.name;
        var type = rewrite(term.type, rewriter, scope.concat([name]), true, only_once);
        return Slf(name, type);
      case "New":
        var type = rewrite(term.type, rewriter, scope, true, only_once);
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        return New(type, expr);
      case "Use":
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        return Use(expr);
      case "Ann":
        var type = rewrite(term.type, rewriter, scope, true, only_once);
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        var done = term.done;
        return Ann(type, expr, done);
      case "Log":
        var msge = rewrite(term.msge, rewriter, scope, true, only_once);
        var expr = rewrite(term.expr, rewriter, scope, erased, only_once);
        return Log(msge, expr);
      case "Hol":
        var name = term.name;
        return Hol(name);
      case "Ref":
        var name = term.name;
        var eras = term.eras;
        var file = term.file;
        return Ref(name, eras, eras || erased, file);
    }
  }
}

const replace = (idx, val, term) => {
  var term = shift(term, 1, idx);
  var term = subst(term, val, idx + 1);
  return term;
}

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
            var sel = App(sel, Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F), adt_ctor[c][1][F][2]);
          }
          return sel;
        }
      })(0), true)), false);
    }
  })(0, adt_indx.length, 0);
}

const post = (func, body) => {
  return xhr("http://moonad.org/api/" + func,
    { method: "POST"
    , json: true
    , body})
    .then(res => {
      if (res[0] === "ok") {
        return res[1];
      } else {
        throw res[1];
      }
    });
};

const save_file = (file, code) => post("save_file", {file, code});
const load_file_parents = (file) => post("load_file_parents", {file});
const load_file = (() => {
  var loading = {};
  var warned = false;
  return (file) => {
    if (!loading[file]) {

      if (fs) {
        var cache_dir_path = path.join(process.cwd(), "fm_modules");
        var cached_file_path = path.join(cache_dir_path, file + ".fm");
        var local_file_path = path.join(process.cwd(), file + ".fm");
        var version_file_path = path.join(cache_dir_path, "version");
        var has_cache_dir = fs.existsSync(cache_dir_path);
        var has_version_file = has_cache_dir && fs.existsSync(version_file_path);
        var correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
        if (!has_cache_dir || !has_version_file || !correct_version) {
          if (has_cache_dir) {
            var files = fs.readdirSync(cache_dir_path);
            for (var i = 0; i < files.length; ++i) {
              fs.unlinkSync(path.join(cache_dir_path, files[i]));
            }
            fs.rmdirSync(cache_dir_path);
          }
          fs.mkdirSync(cache_dir_path);
          fs.writeFileSync(version_file_path, version);
        }
      }

      var has_cached_fs = fs && fs.existsSync(cached_file_path);
      var has_local_fs = fs && fs.existsSync(local_file_path);
      if (has_cached_fs || has_local_fs) {
        loading[file] = new Promise((resolve, reject) => {
          fs.readFile(has_cached_fs ? cached_file_path : local_file_path, "utf8", (err, code) => {
            if (err) {
              reject(err);
            } else {
              resolve(code);
            }
          })
        });

      } else {
        var cached_ls = ls && ls.getItem("FPM@" + version + "/" + file);
        if (cached_ls) {
          loading[file] = Promise.resolve(cached_ls);
        } else {
          loading[file] = post("load_file", {file}).then(code => new Promise((resolve, reject) => {
            if (code) {
              if (fs && !fs.existsSync(cached_file_path)) {
                if (!warned) {
                  warned = true;
                  console.log("Downloading files to `fm_modules`. This may take a while...");
                }
                fs.writeFile(cached_file_path, code, (err, ok) => resolve(code));
              } else if (ls) {
                ls.setItem("FPM@" + version + "/" + file, code);
                resolve(code);
              } else {
                resolve(code);
              }
            }
          }));
        }
      }
    }
    return loading[file];
  };
})();

module.exports = {
  Var,
  Typ,
  All,
  Lam,
  App,
  Box,
  Put,
  Tak,
  Dup,
  Wrd,
  Num,
  Op1,
  Op2,
  Ite,
  Cpy,
  Sig,
  Par,
  Fst,
  Snd,
  Prj,
  Eql,
  Rfl,
  Sym,
  Rwt,
  Slf,
  New,
  Use,
  Ann,
  Log,
  Hol,
  Ref,
  shift,
  subst,
  subst_many,
  norm,
  erase,
  equal,
  boxcheck,
  typecheck,
  parse,
  gen_name,
  show,
  replace_refs,
  derive_adt_type,
  derive_adt_ctor,
  //derive_dependent_match,
  save_file,
  load_file,
  load_file_parents,
  version,
};
