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
  Ref,
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
} = require("./fm-core.js");

// Usng eval prevents being catched by Webpack
const fs = typeof window === "object" ? null : eval('require("fs")');
const path = typeof window === "object" ? null : eval('require("path")');
const xhr = require("xhr-request-promise");

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = async (code, tokenify, root = true) => {
  function get_ref_origin_file(ref) {
    let slash_index = ref.indexOf("/");
    if (slash_index !== -1) {
      var name = ref.slice(0, slash_index);
      if (name.indexOf("@") === -1 && file_version[name]) {
        return {name: name + file_version[name], prefix: name};
      } else {
        return {name: name, prefix: name};
      }
    } else {
      return null;
    }
  }

  async function resolve(term, used_prefix = null, open = false) {
    // Finds undefined references to files we don't have
    var must_load = {};
    replace_refs(term, name => {
      if (!defs[name]) {
        let origin_file = get_ref_origin_file(name);
        if (origin_file) {
          var {name: file_name, prefix} = origin_file;
          must_load[file_name + "-~-" + prefix] = true;
          if (file_name.indexOf("@") === -1) {
            local_imports[file_name] = true;
          }
        }
      }
      return name;
    });

    // Creates requests to load those files
    let requests = [];
    for (let file_name_prefix in must_load) {
      let [file_name, file_prefix] = file_name_prefix.split("-~-");
      requests.push(load_file(file_name).then(file_code => [file_name, file_code, file_prefix]));
    }

    // Creates a parse for those files
    let parses = [];
    var new_files = await Promise.all(requests);
    for (let i = 0; i < new_files.length; ++i) {
      let [file_name, file_code, file_prefix] = new_files[i];
      if (file_code) {
        parses.push(parse(file_code, tokenify, false).then(file_parseds => [file_name, file_parseds, file_prefix]));
      }
    }

    // Prefixes each file's parsed defs/adts and adds to local defs/adts
    var new_file_parseds = await Promise.all(parses);
    for (var i = 0; i < new_file_parseds.length; ++i) {
      let [file_name, file_parseds, file_prefix] = new_file_parseds[i];
      let {defs: file_defs, adts: file_adts, unbox_info: file_unbox_info} = file_parseds;
      let prefix = open ? "" : (used_prefix || file_prefix) + "/";
      let do_pfx = term => prefix_refs(prefix, term, file_defs);
      for (let term_name in file_defs) {
        defs[prefix + term_name] = do_pfx(file_defs[term_name]);
      }
      for (let term_name in file_unbox_info) {
        unbox_info[prefix + term_name] = file_unbox_info[term_name];
      }
      for (let adt_name in file_adts) {
        let adt_pram = file_adts[adt_name].adt_pram.map(([name, type, eras]) => [name, do_pfx(type), eras]);
        let adt_indx = file_adts[adt_name].adt_indx.map(([name, type, eras]) => [name, do_pfx(type), eras]);
        var adt_ctor = file_adts[adt_name].adt_ctor.map(([name, flds, type]) => [name, flds.map(([name, type, eras]) => [name, do_pfx(type), eras]), do_pfx(type)]);
        adts[prefix + adt_name] = {adt_pram, adt_indx, adt_ctor};
      }
    };

    return term;
  }

  function build_charset(chars) {
    var set = {};
    for (var i = 0; i < chars.length; ++i) {
      set[chars[i]] = 1;
    }
    return chr => set[chr] === 1;
  }

  var is_native_op = {"+":1,"-":1,"*":1,"/":1,"%":1,"^":1,"**":1,".&":1,".|":1,".^":1,".!":1,".>>":1,".<<":1,">":1,"<":1,"===":1};
  var op_inits     = "+-*/%^.=<>";
  var is_op_init   = build_charset("+-*/%^.=<>");
  var is_name_char = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@/");
  var is_op_char   = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@+*/%^!<>=&|");
  var is_space     = build_charset(" \t\n\r;");
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

  function skip_spaces() {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  function next_char() {
    skip_spaces();
    while (code.slice(idx, idx + 2) === "//") {
      if (tokens) tokens.push(["cmm", ""]);
      while (code[idx] !== "\n" && idx < code.length) {
        next();
      }
      if (tokens) tokens.push(["txt", ""]);
      skip_spaces();
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

  function match(string) {
    next_char();
    return match_here(string);
  }

  function is_sigma(string) {
    var i = idx;
    while (i < code.length && code[i] === "~" || is_name_char(code[i])) { ++i; }
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
      "Like you, I'm doing my best, ok?",
      "I hope you figure it out!",
      "I can't help any further. But I can pray for you!",
      "I could be more precise, but unlike you, I'm not good enough.",
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
    var term = Ref("base");
    for (var i = 0; i < bits.length; ++i) {
      term = App(Ref("twice"), term, false);
      if (bits[i] === "1") {
        term = App(Ref("step"), term, false);
      }
    }
    return term;
  }

  function base_ref(name) {
    if (defs[name]) {
      return Ref(name);
    } else {
      error("Attempted to use a syntax-sugar which requires `" + name + "` to be in scope, but it isn't.\n"
          + "To solve that, import the official Base libraries or an equivalent replacement.\n"
          + "See http://docs.formality-lang.org/en/latest/language/Hello,-world!.html for more info.");
    }
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

  function parse_var(ctx, ind_num = false) {
    var term = null;
    if (tokens) tokens.push(["???", ""]);
    var name = parse_name();
    var numb = Number(name);
    if (!isNaN(numb)) {
      term = ind_num ? build_ind(name) : Num(numb >>> 0);
      if (tokens) tokens[tokens.length - 1][0] = "num";
    } else {
      var skip = 0;
      while (match_here("^")) {
        skip += 1;
      }
      for (var i = ctx.length - 1; i >= 0; --i) {
        if (ctx[i] === name) {
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
          term = Ref(name, false);
          if (tokens) tokens[tokens.length - 1][0] = "ref";
        }
      } else {
        term = Var(ctx.length - i - 1);
        if (tokens) tokens[tokens.length - 1][0] = "var";
      }
    }
    if (tokens) tokens.push(["txt", ""]);
    return term;
  }

  function parse_term(ctx) {
    var parsed;

    // Parenthesis
    if (match("(")) {
      var term = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = term;
    }

    // Type
    else if (match("Type")) {
      parsed = Typ();
    }

    // Type
    else if (match("type(")) {
      var expr = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Tid(expr);
    }

    // Prints active definitions
    else if (match("?scope?")) {
      console.log("Scope:");
      for (var i = 0; i < ctx.length; ++i) {
        console.log("- " + ctx[i]);
      }
      parsed = parse_term(ctx);
    }

    // Hole
    else if (match("?")) {
      parsed = Num(0); // TODO: a proper HOLE constructor
    }

    // Lambdas and Forall
    else if (match("{")) {
      var erase = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        erase.push(match("~"));
        names.push(parse_string());
        types.push(match(":") ? parse_term(ctx.concat(names.slice(0,-1))) : null);
        if (match("}")) break; else parse_exact(",");
      }
      var isall = match("->");
      var islam = match("=>");
      if (!isall && !islam) {
        // TODO: error
      }
      var term = parse_term(ctx.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        var ctr = isall ? All : Lam;
        term = ctr(names[i], types[i], term, erase[i]);
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
      var expr = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      parsed = Dup(name, expr, body);
    }

    // Box
    else if (match("!")) {
      var expr = parse_term(ctx);
      parsed = Box(expr);
    }

    // Put
    else if (match("#")) {
      var expr = parse_term(ctx);
      parsed = Put(expr);
    }

    // Take
    else if (match("-#(")) {
      var expr = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Tak(expr);
    }

    // Let
    else if (match("let ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var copy = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
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
      var cond = parse_term(ctx);
      var skip = parse_exact(":");
      var val0 = parse_term(ctx);
      var skip = parse_exact("else:");
      var val1 = parse_term(ctx);
      parsed = Ite(cond, Par(val0, val1, 0));
    }

    // Copy
    else if (match("cpy ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var numb = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      parsed = Cpy(name, numb, body);
    }

    // Sigma / Pair
    else if (match("[")) {
      // Sigma
      if (is_sigma()) {
        var era1 = match("~");
        var name = parse_string();
        var skip = parse_exact(":");
        var typ0 = parse_term(ctx);
        var skip = parse_exact(",");
        var era2 = match("~");
        var typ1 = parse_term(ctx.concat([name]));
        var skip = parse_exact("]");
        parsed = Sig(name, typ0, typ1, era1 ? 1 : era2 ? 2 : 0);
      // Pair
      } else {
        var era1 = match("~");
        var val0 = parse_term(ctx);
        var skip = parse_exact(",");
        var era2 = match("~");
        var val1 = parse_term(ctx);
        var skip = parse_exact("]");
        parsed = Par(val0, val1, era1 ? 1 : era2 ? 2 : 0);
      }
    }

    // First
    else if (match("fst(")) {
      var pair = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Fst(pair, 0);
    }

    // First (erased)
    else if (match("~fst(")) {
      var pair = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Fst(pair, 2);
    }

    // Second
    else if (match("snd(")) {
      var pair = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Snd(pair, 0);
    }

    // Second (erased)
    else if (match("~snd(")) {
      var pair = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Snd(pair, 1);
    }

    // Projection
    else if (match("get ")) {
      var skip = parse_exact("[");
      var era1 = match("~");
      var nam0 = parse_string();
      var skip = parse_exact(",");
      var era2 = match("~");
      var nam1 = parse_string();
      var skip = parse_exact("]");
      var skip = parse_exact("=");
      var pair = parse_term(ctx);
      var body = parse_term(ctx.concat([nam0, nam1]));
      parsed = Prj(nam0, nam1, pair, body, era1 ? 1 : era2 ? 2 : 0);
    }

    // Reflexivity
    else if (match("refl<")) {
      var expr = parse_term(ctx);
      var skip = parse_exact(">");
      parsed = Rfl(expr);
    }

    // Symmetry
    else if (match("sym<")) {
      var prof = parse_term(ctx);
      var skip = parse_exact(">");
      parsed = Sym(prof);
    }

    // Rewrite
    else if (match("rewrite<")) {
      var prof = parse_term(ctx);
      var skip = parse_exact(">");
      var skip = parse_exact("{");
      var name = parse_string();
      var skip = parse_exact("in");
      var type = parse_term(ctx.concat([name]));
      var skip = parse_exact("}");
      var skip = parse_exact("(");
      var expr = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Rwt(name, type, prof, expr);
    }

    // Annotation
    else if (match(":")) {
      var type = parse_term(ctx);
      var expr = parse_term(ctx);
      parsed = Ann(type, expr, false);
    }

    // Logging
    else if (match("log(")) {
      var msge = parse_term(ctx);
      var skip = parse_exact(")");
      var expr = parse_term(ctx);
      parsed = Log(msge, expr);
    }

    // Slf
    else if (match("$")) {
      var name = parse_string();
      var type = parse_term(ctx.concat([name]));
      parsed = Slf(name, type);
    }

    // New
    else if (match("new<")) {
      var type = parse_term(ctx);
      var skip = parse_exact(">");
      var expr = parse_term(ctx);
      parsed = New(type, expr);
    }

    // Use
    else if (match("%")) {
      var expr = parse_term(ctx);
      parsed = Use(expr);
    }

    // Case syntax sugar
    else if (match("case<")) {
      var adt_name = parse_string();
      var skip = parse_exact(">");
      if (!adts[adt_name]) {
        error("Used case-syntax on undefined type `" + adt_name + "`.");
      }
      var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[adt_name];
      var term = parse_term(ctx);
      var cses = [];
      for (var c = 0; c < adt_ctor.length; ++c) {
        var skip = parse_exact("|");
        var skip = parse_exact(adt_ctor[c][0]);
        var skip = parse_exact("=>");
        var ctors = adt_ctor[c][1];
        cses[c] = parse_term(ctx.concat(adt_ctor[c][1].map(([name,type]) => name)));
        for (var i = 0; i < ctors.length; ++i) {
          cses[c] = Lam(ctors[ctors.length - i - 1][0], null, cses[c], ctors[ctors.length - i - 1][2]);
        }
      }
      var skip = parse_exact(":");
      var moti = parse_term(ctx.concat(adt_indx.map(([name,type]) => name)).concat(["self"]));
      for (var i = 0; i < adt_indx.length; ++i) {
        var moti = Lam(adt_indx[i][0], null, moti, false);
      }
      var moti = Lam("self", null, moti, false);
      var term = Use(term);
      var term = App(term, moti, true);
      for (var i = 0; i < cses.length; ++i) {
        var term = App(term, cses[i], false);
      }
      return term;
    }

    // Variable / Reference
    else {
      parsed = parse_var(ctx, false);
    }

    // Apply to Ind
    if (match_here("*")) {
      var term = parse_var(ctx, true);
      parsed = App(parsed, term, false);
    }

    // Applications
    var applier = null;
    while ((applier = code[idx]), applier === "(" || applier === "<") {
      var skip = match_here(applier);
      var term = parsed;
      while (idx < code.length) {
        var eras = applier === "<" || match("~");
        var argm = parse_term(ctx);
        var term = App(term, argm, eras);
        if (applier === "<" && match(">")) break;
        if (applier === "(" && match(")")) break;
        parse_exact(",");
      }
      parsed = term;
    }

    // List
    while (match_here("$")) {
      var type = parsed;
      var list = [];
      var skip = parse_exact("[");
      while (idx < code.length && !match("]")) {
        list.push(parse_term(ctx));
        if (match("]")) break; else parse_exact(",");
      }
      var term = App(base_ref("nil"), type, true);
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false);
      }
      parsed = term;
    }

    // Operators
    while (match_here(" ")) {
      var matched = false;
      for (var i = 0; i < op_inits.length; ++i) {
        var op_init = op_inits[i];
        if (match_here(op_init)) {
          matched = true;
          var func = op_init + parse_string_here(x => !is_space(x));
          var argm = parse_term(ctx);
          if (is_native_op[func]) {
            parsed = Op2(func, parsed, argm);
          } else if (func === "->") {
            parsed = All("", parsed, shift(argm, 1, 0), false);
          } else if (func === "==") {
            parsed = Eql(parsed, argm);
          } else {
            parsed = App(App(Ref(func), parsed, false), argm, false);
          }
        }
        if (matched) break;
      }
    }

    return parsed;
  }

  var local_imports = {};
  var file_version = {};
  var unbox_info = {};
  var tokens = tokenify ? [["txt",""]] : null;
  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  var adts = {};
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
    } else if (match("import")) {
      var file = parse_string();
      var pref = match("as") ? parse_string() : null;
      var open = match("open");
      await resolve(Ref(file + "/main"), pref, open);

    // File version
    } else if (match("version")) {
      var file = parse_string();
      var vers = parse_string();
      file_version[file] = "@" + vers;

    // Datatypes
    } else if (match("T ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_ctx = [adt_name];

      // Datatype parameters
      if (match("<")) {
        while (idx < code.length) {
          var eras = false;
          var name = parse_string();
          var skip = parse_exact(":");
          var type = await resolve(parse_term(adt_pram.map((([name,type]) => name))));
          adt_pram.push([name, type, eras]);
          if (match(">")) break; else parse_exact(",");
        }
      }

      // Datatype indices
      var adt_ctx = adt_ctx.concat(adt_pram.map(([name,type]) => name));
      if (match("{")) {
        while (idx < code.length) {
          //var eras = match("~");
          var eras = false;
          var name = parse_string();
          var skip = parse_exact(":");
          var type = await resolve(parse_term(adt_ctx.concat(adt_indx.map((([name,type]) => name)))));
          adt_indx.push([name, type, eras]);
          if (match("}")) break; else parse_exact(",");
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
            var type = await resolve(parse_term(adt_ctx.concat(ctor_flds.map(([name,type]) => name))));
            ctor_flds.push([name, type, eras]);
            if (match("}")) break; else parse_exact(",");
          }
        }
        // Constructor type (written)
        if (match(":")) {
          var ctor_type = await resolve(parse_term(adt_ctx.concat(ctor_flds.map(([name,type]) => name))));
        // Constructor type (auto-filled)
        } else {
          var ctor_indx = [];
          while (match("&")) {
            ctor_indx.push(await resolve(parse_term(adt_ctx.concat(ctor_flds.map(([name,type]) => name)))));
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
      defs[adt_name] = derive_adt_type(adt);
      for (var c = 0; c < adt_ctor.length; ++c) {
        defs[adt_ctor[c][0]] = derive_adt_ctor(adt, c);
      }
      adts[adt_name] = adt;

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
      var boxed = match("!");

      // Parses definition name
      if (tokens) tokens.push(["def", ""]);
      var name = parse_name();
      if (tokens) tokens.push(["txt", ""]);

      // If name is empty, stop
      if (name.length === 0) break;

      // Parses recursion depth name
      var recur = match_here("*");
      var rec_depth = recur ? parse_string() : null;
      var rec_names = recur ? [rec_depth] : [];

      var typed = match(":");

      // Typed definition
      if (typed) {

        // Parses level 0 argument names and types
        var lv0_erase = [];
        var lv0_names = [];
        var lv0_boxed = [];
        var lv0_dup_n = [];
        var lv0_dup_i = [];
        var lv0_types = [];
        if (boxed && match("{")) {
          var count = 0;
          while (idx < code.length) {
            var arg_eras = match("~");
            var arg_name = parse_string();
            var arg_skip = parse_exact(":");
            var arg_boxd = match("!");
            var arg_type = await resolve(parse_term(lv0_names));
            lv0_erase.push(arg_eras);
            lv0_names.push(arg_name);
            lv0_boxed.push(arg_boxd);
            if (arg_boxd) {
              lv0_dup_n.push(arg_name);
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
        var lv0_imp_v = [];
        while (match("dup ")) {
          var dup_name = parse_string();
          var dup_skip = parse_exact("=");
          var dup_expr = parse_term(lv0_names.concat(lv0_imp_n));
          lv0_imp_n.push(dup_name);
          lv0_imp_v.push(dup_expr);
        }

        // Checks if it is properly boxed
        if ((recur || boxed) && !match("!")) {
          error((recur ? "Recursive definition" : "Definition") + " `" + name + "` must be boxed. Annotate its type with a `!`.");
        }

        // Parses argument names and types
        var erase = [];
        var names = [];
        var wordn = [];
        var wordi = [];
        var types = [];
        var basex = null;
        if (match("{")) {
          var count = 0;
          while (idx < code.length) {
            var arg_eras = match("~");
            var arg_halt = match("*");
            var arg_name = parse_string();
            var arg_skip = parse_exact(":");
            var arg_type = await resolve(parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_names).concat(names)));
            erase.push(arg_eras);
            names.push(arg_name);
            types.push(arg_type);
            basex = arg_halt ? count : basex;
            if (arg_type[0] === "Wrd") {
              wordn.push(arg_name);
              wordi.push(count);
            };
            if (match("}")) break; else parse_exact(",");
            ++count;
          }
          var skip = parse_exact("->");
        }
        var type = await resolve(parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_names).concat(names)));

        // Parses the definition body
        var term = await resolve(parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(rec_names).concat(recur ? [name] : []).concat(names).concat(wordn)));

        // Parses the halting case
        if (recur && basex === null && !match("*")) {
          error("The bounded-recursive (inductive) definition '" + name + "' needs a halting (base) case. Provide it using `*`.");
        }
        if (recur && basex !== null) {
          var base = Var(-1 + names.length - basex);
        } else if (recur) {
          var base = await resolve(parse_term(lv0_names.concat(lv0_dup_n).concat(lv0_imp_n).concat(names)));
        } else {
          var base = null;
        }

        // Fills numeric copies
        for (var i = wordn.length - 1; i >= 0; --i) {
          var term = Cpy(wordn[i], Var(-1 + names.length + i - wordi[i]), term);
        }

        // Fills type wrapper
        //if (type[0] === "Typ") {
          //var term = Tid(term);
        //}

        // Fills foralls and lambdas of arguments
        for (var i = names.length - 1; i >= 0; --i) {
          var type = All(names[i], types[i], type, erase[i]);
          var term = Lam(names[i], null    , term, erase[i]);
          var base = base && Lam(names[i], null    , base, erase[i]);
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
            var term = (is_type ? All : Lam)(lv0_names[i], is_type ? (lv0_boxed[i] ? Box : (x=>x))(lv0_types[i]) : null, term, eras && lv0_erase[i]);
          }
          return term;
        }

        // Builds a non-recursive, non-boxed definition
        if (!recur && !boxed) {
          defs[name] = Ann(type, term, false);

        // Builds a non-recursive, boxed definition
        } else if (!recur && boxed) {
          var type = lv0_headers(1, Box(type), true);
          var term = lv0_headers(0, Put(term), true);
          defs[name] = Ann(type, term, false);
          unbox_info[name] = {arity: lv0_names.length, depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length, boxed: true};

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
          var ind_moti = Ref(name+".moti");
          var ind_step = Ref(name+".step");
          var ind_base = Ref(name+".base");
          for (var i = 0, c = 0; i < lv0_names.length; ++i) {
            if (lv0_boxed[i]) {
              var vari = Put(Var(-1 + lv0_imp_n.length + lv0_dup_n.length - (c++)));
            } else {
              var vari = Var(-1 + lv0_imp_n.length + lv0_dup_n.length + lv0_names.length - i);
            }
            ind_moti = App(ind_moti, vari, false);
            ind_step = App(ind_step, vari, lv0_erase[i]);
            ind_base = App(ind_base, vari, lv0_erase[i]);
          }
          var type = All(rec_depth, base_ref("Ind"), lv0_headers(1, Box(subst(type, Var(lv0_names.length + lv0_dup_n.length + lv0_imp_n.length), 0)), true), false);
          var term = App(base_ref("ind"), Var(lv0_names.length + lv0_dup_n.length + lv0_imp_n.length), false);
          var term = App(term, ind_moti, true);
          var term = App(term, Put(ind_step), false);
          var term = App(term, Put(ind_base), false);
          var term = Lam(rec_depth, null, lv0_headers(0, term, true), false);

          defs[name+".moti"]       = Ann(moti_type, moti_term, false);
          defs[name+".step"]       = Ann(step_type, step_term, false);
          defs[name+".base"]       = Ann(base_type, base_term, false);
          defs[name]               = Ann(type, term, false);
          unbox_info[name+".moti"] = {arity: lv0_names.length, depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length, boxed: false};
          unbox_info[name+".step"] = {arity: lv0_names.length, depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length, boxed: true};
          unbox_info[name+".base"] = {arity: lv0_names.length, depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length, boxed: true};
          unbox_info[name]         = {arity: lv0_names.length + 1, depth: lv0_names.length + lv0_dup_n.length + lv0_imp_n.length + 1, boxed: true};
          //console.log("built", name+".moti : " + show(moti_type));
          //console.log("built", name+".moti = " + show(moti_term));
          //console.log("built", name+".step : " + show(step_type));
          //console.log("built", name+".step = " + show(step_term));
          //console.log("built", name+".base : " + show(base_type));
          //console.log("built", name+".base = " + show(base_term));
          //console.log("built", name+"      : " + show(type));
          //console.log("built", name+"      = " + show(term));
        }

      // Untyped definition
      } else {
        var term = await resolve(parse_term([]));
        defs[name] = term;
      }
    }

    next_char();
  }

  // When a reference to a boxed definiton is used inside a boxed definition,
  // automatically unbox it by appending `dup ref = ref; ...` to the term
  if (root) {
    for (var name in unbox_info) {
      var info = unbox_info[name];
      var term = defs[name];
      ["expr", "type"].forEach(field => {
        var lens = {term, field};
        for (var i = 0; i < info.depth; ++i) {
          var lens = {term: lens.term[1][lens.field], field: "body"};
        }

        var unbox = [];
        lens.term[1][lens.field] = rewrite(lens.term[1][lens.field], (term, scope) => {
          var args = [];
          var func = term;
          while (func[0] === "App") {
            args.push(func[0].argm);
            func = func[1].func;
          }
          if (func[0] === "Ref" && unbox_info[func[1].name] && unbox_info[func[1].name].boxed) {
            var func_info = unbox_info[func[1].name];
            if (func[1].name !== name && func_info.arity === args.length) {
              var unboxable = true;
              for (var i = 0; i < scope.length; ++i) {
                if (uses(term, scope.length - i - 1) > 0) {
                  var unboxable = false;
                  //error("Couldn't auto-unbox reference to '" + func[1].name + "' inside '" + name + "'.\n"
                    //+ "It uses the level_1 variable '" + scope[i] + "' inside a level_0 argument.");
                }
              }
              if (unboxable) {
                for (var i = 0; i < scope.length; ++i) {
                  term = subst(term, Num(0), 0);
                }
                unbox.push([func[1].name, term, args]);
                return Ref("$TMP$" + (unbox.length - 1));
              }
            }
          };
        });
        for (var i = unbox.length - 1; i >= 0; --i) {
          lens.term[1][lens.field] = Dup(unbox[i][0], unbox[i][1], shift(lens.term[1][lens.field], 1, 0));
        }
        lens.term[1][lens.field] = rewrite(lens.term[1][lens.field], (term, scope) => {
          if (term[0] === "Ref" && term[1].name.slice(0,5) === "$TMP$") {
            return Var(-1 + scope.length - Number(term[1].name.slice(5)));
          }
        });
      });
    }
  }

  return {defs, tokens, adts, local_imports, unbox_info};
}

// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

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
    case "Ref":
      var new_name = renamer(term.name, depth);
      if (typeof new_name === "string") {
        return Ref(new_name, term.eras);
      } else if (typeof new_name === "object") {
        return new_name;
      } else {
        return Ref(term.name, term.eras);
      }
  }
}

const prefix_refs = (prefix, term, defs) => {
  return replace_refs(term, ref_name => {
    return (defs[ref_name] ? prefix : "") + ref_name;
  });
};

const rewrite = ([ctor, term], rewriter, scope = []) => {
  var rewritten = rewriter([ctor, term], scope);
  if (rewritten) {
    return rewrite(rewritten, rewriter, scope);
  } else {
    switch (ctor) {
      case "Var":
        return Var(term.index);
      case "Typ":
        return Typ();
      case "Tid":
        var expr = require(term.expr, rewriter, scope);
        return Tid(expr);
      case "All":
        var name = term.name;
        var bind = rewrite(term.bind, rewriter, scope);
        var body = rewrite(term.body, rewriter, scope.concat([name]));
        var eras = term.eras;
        return All(name, bind, body, eras);
      case "Lam":
        var name = term.name;
        var bind = term.bind && rewrite(term.bind, rewriter, scope);
        var body = rewrite(term.body, rewriter, scope.concat([name]));
        var eras = term.eras;
        return Lam(name, bind, body, eras);
      case "App":
        var func = rewrite(term.func, rewriter, scope);
        var argm = rewrite(term.argm, rewriter, scope);
        var eras = term.eras;
        return App(func, argm, term.eras);
      case "Box":
        var expr = rewrite(term.expr, rewriter, scope);
        return Box(expr);
      case "Put":
        var expr = rewrite(term.expr, rewriter, scope);
        return Put(expr);
      case "Tak":
        var expr = rewrite(term.expr, rewriter, scope);
        return Tak(expr);
      case "Dup":
        var name = term.name;
        var expr = rewrite(term.expr, rewriter, scope);
        var body = rewrite(term.body, rewriter, scope.concat([name]));
        return Dup(name, expr, body);
      case "Wrd":
        return Wrd();
      case "Num":
        var numb = term.numb;
        return Num(numb);
      case "Op1":
      case "Op2":
        var func = term.func;
        var num0 = rewrite(term.num0, rewriter, scope);
        var num1 = rewrite(term.num1, rewriter, scope);
        return Op2(func, num0, num1);
      case "Ite":
        var cond = rewrite(term.cond, rewriter, scope);
        var pair = rewrite(term.pair, rewriter, scope);
        return Ite(cond, pair);
      case "Cpy":
        var name = term.name;
        var numb = rewrite(term.numb, rewriter, scope);
        var body = rewrite(term.body, rewriter, scope.concat([name]));
        return Cpy(name, numb, body);
      case "Sig":
        var name = term.name;
        var typ0 = rewrite(term.typ0, rewriter, scope);
        var typ1 = rewrite(term.typ1, rewriter, scope.concat([name]));
        var eras = term.eras;
        return Sig(name, typ0, typ1, eras);
      case "Par":
        var val0 = rewrite(term.val0, rewriter, scope);
        var val1 = rewrite(term.val1, rewriter, scope);
        var eras = term.eras;
        return Par(val0, val1, eras);
      case "Fst":
        var pair = rewrite(term.pair, rewriter, scope);
        var eras = term.eras;
        return Fst(pair, eras);
      case "Snd":
        var pair = rewrite(term.pair, rewriter, scope);
        var eras = term.eras;
        return Snd(pair, eras);
      case "Prj":
        var nam0 = term.nam0;
        var nam1 = term.nam1;
        var pair = rewrite(term.pair, rewriter, scope);
        var body = rewrite(term.body, rewriter, scope.concat([nam0, nam1]));
        var eras = term.eras;
        return Prj(nam0, nam1, pair, body, eras);
      case "Eql":
        var val0 = rewrite(term.val0, rewriter, scope);
        var val1 = rewrite(term.val1, rewriter, scope);
        return Eql(val0, val1);
      case "Rfl":
        var expr = rewrite(term.expr, rewriter, scope);
        return Rfl(expr);
      case "Sym":
        var prof = rewrite(term.prof, rewriter, scope);
        return Sym(prof);
      case "Rwt":
        var name = term.name;
        var type = rewrite(term.type, rewriter, scope.concat([name]));
        var prof = rewrite(term.prof, rewriter, scope);
        var expr = rewrite(term.expr, rewriter, scope);
        return Rwt(name, type, prof, expr);
      case "Slf":
        var name = term.name;
        var type = rewrite(term.type, rewriter, scope.concat([name]));
        return Slf(name, type);
      case "New":
        var type = rewrite(term.type, rewriter, scope);
        var expr = rewrite(term.expr, rewriter, scope);
        return New(type, expr);
      case "Use":
        var expr = rewrite(term.expr, rewriter, scope);
        return Use(expr);
      case "Ann":
        var type = rewrite(term.type, rewriter, scope);
        var expr = rewrite(term.expr, rewriter, scope);
        var done = term.done;
        return Ann(type, expr, done);
      case "Log":
        var msge = rewrite(term.msge, rewriter, scope);
        var expr = rewrite(term.expr, rewriter, scope);
        return Log(msge, expr);
      case "Ref":
        var name = term.name;
        var eras = term.eras;
        return Ref(name, eras);
    }
  }
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
const derive_adt_type = ({adt_pram, adt_indx, adt_ctor, adt_name}) => {
  return (function adt_arg(p, i) {
    // ... {p0 : Param0, p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
    // ... {i0 : Index0, i1 : Index...} ...
    } else if (i < adt_indx.length) {
      var substs = [Ref(adt_name)];
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
              var substs = [Ref(adt_name)];
              for (var P = 0; P < p; ++P) {
                substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
              }
              return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
            // ... {wit : (ADT i0 i1...)} -> Type ...
            } else {
              var wit_t = Ref(adt_name);
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
                var sub = [Ref(adt_name)].concat(subst_prams);
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
                var wit = Ref(adt_ctor[i][0]);
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

const derive_adt_ctor = ({adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
  return (function arg(p, i, f) {
    var substs = [Ref(adt_name)];
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
const find_term = (term) => post("find_term", {term});
const load_file = (() => {
  var loading = {};
  return (file) => {
    if (!loading[file]) {
      if (fs) {
        var cache_dir_path = path.join(process.cwd(), "fm_modules");
        var cached_file_path = path.join(cache_dir_path, file + ".fm");
        var local_file_path = path.join(process.cwd(), file + ".fm");
      }
      var has_cached = fs && fs.existsSync(cached_file_path);
      var has_local = fs && fs.existsSync(local_file_path);
      if (has_cached || has_local) {
        loading[file] = new Promise((resolve, reject) => {
          fs.readFile(has_cached ? cached_file_path : local_file_path, "utf8", (err, code) => {
            if (err) {
              reject(err);
            } else {
              resolve(code);
            }
          })
        });
      } else {
        loading[file] = post("load_file", {file}).then(code => {
          if (fs && code) {
            var writeCache = () => fs.writeFile(cached_file_path, code, (err, ok) => {});
            if (!fs.existsSync(cache_dir_path)) {
              fs.mkdirSync(cache_dir_path, () => writeCache());
            }
            writeCache();
          }
          return code;
        });
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
  prefix_refs,
  derive_adt_type,
  derive_adt_ctor,
  //derive_dependent_match,
  save_file,
  load_file,
  find_term,
};
