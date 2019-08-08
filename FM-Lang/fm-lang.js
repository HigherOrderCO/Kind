const {
  Var,
  Typ,
  All,
  Lam,
  App,
  Box,
  Put,
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
  Cst,
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
const parse = async (code, tokenify, auto_unbox = true) => {
  function get_ref_origin_file(ref) {
    let at_sign_index = ref.indexOf("@");
    let dot_index = ref.indexOf(".");
    if (at_sign_index !== -1 && dot_index !== -1 && at_sign_index < dot_index) {
      return ref.slice(0, dot_index);
    } else {
      return null;
    }
  }

  async function resolve(term, used_prefix = null, open = false) {
    // Finds undefined references to files we don't have
    var must_load = {};
    replace_refs(term, name => {
      if (!defs[name]) {
        let file_name = get_ref_origin_file(name);
        if (file_name) {
          must_load[file_name] = true;
        }
      }
      return name;
    });

    // Creates requests to load those files
    let requests = [];
    for (let file_name in must_load) {
      requests.push(load_file(file_name).then(file_code => [file_name, file_code]));
    }

    // Creates a parse for those files
    let parses = [];
    var new_files = await Promise.all(requests);
    for (let i = 0; i < new_files.length; ++i) {
      let [file_name, file_code] = new_files[i];
      if (file_code) {
        parses.push(parse(file_code, tokenify, false).then(file_defs => [file_name, file_defs]));
      }
    }

    // Prefixes each file's parsed defs/adts and adds to local defs/adts
    var new_file_parseds = await Promise.all(parses);
    for (var i = 0; i < new_file_parseds.length; ++i) {
      let [file_name, file_parseds] = new_file_parseds[i];
      let {defs: file_defs, adts: file_adts} = file_parseds;
      let prefix = open ? "" : (used_prefix || file_name) + ".";
      let do_pfx = term => prefix_refs(prefix, term, file_defs);
      for (let term_name in file_defs) {
        defs[prefix + term_name] = do_pfx(file_defs[term_name]);
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

  var is_native_op = {".+":1,".-":1,".*":1,"./":1,".%":1,".*":1,".^":1,".**":1,".&":1,".|":1,".^":1,".!":1,".>>":1,".<<":1,".>":1,".<":1,".==":1};

  function is_space(char) {
    return char === " " || char === "\t" || char === "\n" || char === "\r" || char === ";";
  }

  function is_newline(char) {
    return char === "\n";
  }

  function is_name_char(char) {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@".indexOf(char) !== -1;
  }

  function is_operator_char(char) {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-@+*/%^&|!=".indexOf(char) !== -1;
  }

  function next() {
    if (tokens) tokens[tokens.length - 1][1] += code[idx];
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
    text += "\nI noticed the problem on line " + (row+1) + ", col " + col + ":\n";
    for (var ini = idx, il = 0; il < 7 && ini >=          0; --ini) if (code[ini] === "\n") ++il;
    for (var end = idx, el = 0; el < 6 && end < code.length; ++end) if (code[end] === "\n") ++el;
    part += "\x1b[31m" + code.slice(ini+1, idx) + "\x1b[4m" + code[idx] + "\x1b[0m\x1b[31m" + code.slice(idx + 1, end) + "\x1b[0m";
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
      var term = App(Ref("nil"), Wrd(), true);
      for (var i = nums.length - 1; i >= 0; --i) {
        var term = App(App(App(Ref("cons"), Wrd(), true), Num(nums[i]), false), term, false);
      }
      parsed = Ann(Ref("String"), term);
    }

    // List
    else if (match("*")) {
      var type = parse_term(ctx);
      var list = [];
      var skip = parse_exact("[");
      while (idx < code.length) {
        list.push(parse_term(ctx));
        if (match("]")) break; else parse_exact(",");
      }
      var term = App(Ref("nil"), type, true);
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(Ref("cons"), type, true), list[i], false), term, false);
      }
      parsed = term;
    }

    // Nat
    else if (match("0n")) {
      var name = parse_string();
      var numb = Number(name);
      var term = Ref("zero");
      for (var i = 0; i < numb; ++i) {
        term = App(Ref("succ"), term, false);
      }
      parsed = term;
    }

    // Rec
    else if (match("0r")) {
      var name = parse_string();
      var numb = Number(name);
      var bits = numb.toString(2);
      var bits = bits === "0" ? "" : bits;
      var term = Ref("halt");
      for (var i = 0; i < bits.length; ++i) {
        term = App(Ref("twice"), term, false);
        if (bits[i] === "1") {
          term = App(Ref("call"), term, false);
        }
      }
      parsed = term;
    }

    // If-Then-Else
    else if (match("if ")) {
      var cond = parse_term(ctx);
      var pair = parse_term(ctx);
      parsed = Ite(cond, pair);
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

    // Pair (If-Then-Else sugar)
    else if (match("then:")) {
      var val0 = parse_term(ctx);
      var skip = parse_exact("else:");
      var val1 = parse_term(ctx);
      parsed = Par(val0, val1, 0);
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

    // Cast
    else if (match("cast<")) {
      var prof = parse_term(ctx);
      var skip = parse_exact(",");
      var val0 = parse_term(ctx);
      var skip = parse_exact(">");
      var skip = parse_exact("(");
      var val1 = parse_term(ctx);
      var skip = parse_exact(")");
      parsed = Cst(prof, val0, val1);
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
      if (tokens) tokens.push(["???", ""]);
      var name = parse_string();
      var numb = Number(name);
      if (!isNaN(numb)) {
        parsed = Num(numb >>> 0);
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
          for (var mini in enlarge) {
            if (name.slice(0, mini.length) === mini) {
              var name = enlarge[mini] + name.slice(mini.length);
              break;
            }
          }
          parsed = Ref(name, false);
          if (tokens) tokens[tokens.length - 1][0] = "ref";
        } else {
          parsed = Var(ctx.length - i - 1);
          if (tokens) tokens[tokens.length - 1][0] = "var";
        }
      }
      if (tokens) tokens.push(["txt", ""]);
    }

    var erased = false;
    while (match_here("(") || (erased = match_here("<"))) {
      var term = parsed;
      while (idx < code.length) {
        var eras = erased || match("~");
        var argm = parse_term(ctx);
        var term = App(term, argm, eras);
        if (erased && match(">") || match(")")) break;
        else parse_exact(",");
      }
      parsed = term;
      erased = false;
    }

    var arrow = false;
    var equal = false;
    while (match_here(" ") && (match_here(".") || (equal = match_here("==")) || (arrow = match_here("->")))) {
      var func = "." + parse_string_here(x => !is_space(x));
      var argm = parse_term(ctx);
      if (arrow) {
        parsed = All("", parsed, shift(argm, 1, 0), false);
      } else if (equal) {
        parsed = Eql(parsed, argm);
      } else if (is_native_op[func]) {
        parsed = Op2(func, parsed, argm);
      } else {
        parsed = App(App(Ref(func), parsed, false), argm, false);
      }
      arrow = false;
      equal = false;
    }

    return parsed;
  }

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
      await resolve(Ref(file + ".main"), pref, open);

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
            ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length + p), false);
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

    // Definitions or end-of-file
    } else {
      if (tokens) tokens.push(["def", ""]);
      if (match(".")) {
        var name = "." + parse_string(is_operator_char);
      } else {
        var name = parse_string();
      }
      if (tokens) tokens.push(["txt", ""]);

      // Definition
      if (name.length > 0) {

        // Typed definition
        var boxed = match("!");
        var typed = boxed || match(":");
        if (boxed || typed) {
          var cased = [];
          var erase = [];
          var names = [];
          var halti = null;
          var types = [];
          if (match("{")) {
            var count = 0;
            while (idx < code.length) {
              cased.push(match("|"));
              erase.push(match("~"));
              if (match("&")) halti = count;
              names.push(parse_string());
              parse_exact(":");
              types.push(await resolve(parse_term(names.slice(0,-1))));
              if (match("}")) break; else parse_exact(",");
              ++count;
            }
            var skip = parse_exact("->");
          }
          var type = await resolve(parse_term(names));

          // Typed definition without patterns
          if (cased.filter(x => x).length === 0) {
            var term = await resolve(parse_term(names));

          // Typed definition with patterns
          } else {
            error("Dependent pattern-matching disabled until rework.");

            // Typed definition with patterns: finds matched datatypes
            // var cadts = [];
            // for (var i = 0; i < cased.length; ++i) {
            //   if (cased[i]) {
            //     // Right now, we can only build the compact case-analysis syntax
            //     // if all the types on the annotation are refs to ADTs in scope.
            //     // This could be improved if the parser kept track of ctx types.
            //     var adt_ref = types.map(function go(x) { return x[0] === "App" ? go(x[1].func) : x; });
            //     if (adt_ref[i][0] !== "Ref" || !adts[adt_ref[i][1].name]) {
            //       error("Couldn't find the ADT for the `" + names[i] + "` case of `" + name + "`.");
            //     }
            //     cadts[i] = adts[adt_ref[i][1].name];
            //   } else {
            //     cadts[i] = null;
            //   }
            // }

            // // Typed definition with patterns: parses case-tree
            // var case_tree = {};
            // await (async function parse_case_tree(ctx, a, branch) {
            //   if (a < cadts.length) {
            //     if (cadts[a] === null) {
            //       await parse_case_tree(ctx, a + 1, branch);
            //     } else {
            //       var {adt_name, adt_pram, adt_indx, adt_ctor} = cadts[a];
            //       for (var c = 0; c < adt_ctor.length; ++c) {
            //         var skip = parse_exact("|");
            //         var skip = parse_exact(adt_ctor[c][0]);
            //         var vars = adt_ctor[c][1].map((([name,type,eras]) => names[a] + "." + name));
            //         await parse_case_tree(ctx.concat(vars), a + 1, branch.concat([adt_ctor[c][0]]));
            //       }
            //     }
            //   } else {
            //     var skip = parse_exact("=");
            //     var term = await resolve(parse_term(ctx));
            //     case_tree[branch.join("_")] = term;
            //   }
            // })(names, 0, []);

            // Typed definition with patterns: derives matchinig term
            // var term = derive_dependent_match({names, types, cased, erase, cadts}, type, case_tree);
            // console.log("->", show(term, names));
          }

          // Typed definition: auto-fills foralls and lambdas
          for (var i = names.length - 1; i >= 0; --i) {
            var type = All(names[i], types[i], type, erase[i]);
            var term = Lam(names[i], null, term, erase[i]);
          }

          // Typed definition: syntax sugar for recursive functions
          var [is_recursive, is_unhalting, unrec_term] = unrecurse(term, name, 0);
          if (boxed && is_recursive) {
            var term = unrec_term;
            var TERM = term;
            var TYPE = type;
            if (halti !== null) {
              var halt = Var(names.length - halti - 1);
            } else if (match("&")) {
              var halt = await resolve(parse_term(names));
            } else {
              error("The bounded-recursive function '" + name + "' needs a halting case. Provide it using `&`.");
            }
            for (var i = names.length - 1; i >= 0; --i) {
              var halt = Lam(names[i], null, halt, erase[i]);
            }
            var term = shift(term, 1, 0);
            var term = subst(term, Var(0), 1);
            var term = Lam(name, null, term, false);
            var TERM = shift(TERM, 1, 0);
            var TERM = subst(TERM, Ref("-" + name), 1);
            var type = Box(type);
            var call = term;
            var term = App(App(App(Ref("rec"), type[1].expr, true), Put(Ref(name + ".call")), false), Put(Ref(name + ".halt")), false);
          } else if (!boxed && is_recursive && is_unhalting) {
            error("Non-terminating function '" + name + "'. Don't worry, if you annotate it as `\x1b[2m" + name + " :! (...)\x1b[0m`, I can make a bounded-recursive version of it for you!");
          } else if (boxed) {
            var type = Box(type);
            var term = Put(term);
          }

          // Typed definition: auto-fill unboxings
          //for (var i = 0; i < unbox.length; ++i) {
            //var term = Dup(unbox[unbox.length - i - 1], Ref(unbox[unbox.length - i - 1]), term);
            //if (boxed && is_recursive) {
              //var halt = Dup(unbox[unbox.length - i - 1], Ref(unbox[unbox.length - i - 1]), halt);
              //var call = Dup(unbox[unbox.length - i - 1], Ref(unbox[unbox.length - i - 1]), call);
              //var TERM = subst_many(unbox.map(name => "-" + name), TERM, 0);
            //}
          //}

          defs[name] = Ann(type, term, false);
          if (boxed && is_recursive) {
            defs[name + ".call"] = Ann(All("x", type[1].expr, type[1].expr, false), call);
            defs[name + ".halt"] = Ann(type[1].expr, halt);
            defs["-" + name] = Ann(TYPE, TERM, false);
          }
          if (boxed) {
            defs["$ISBOXED$" + name] = Num(1);
          }

        // Untyped definition
        } else {
          var term = await resolve(parse_term([]));
          defs[name] = term;
        }
      } else {
        break;
      }
    }

    next_char();
  }

  // When a reference to a boxed definiton is used inside a boxed definition,
  // automatically unbox it by appending `dup ref = ref; ...` to the term
  if (auto_unbox) {
    for (var name in defs) {
      if (defs["$ISBOXED$" + name]) {
        var unboxings = [];
        defs[name] = replace_refs(defs[name], (ref_name, depth) => {
          if (ref_name !== name && defs["$ISBOXED$" + ref_name]) {
            unboxings.push(ref_name);
            return Var(depth + unboxings.length - 1);
          }
        });
        for (var i = unboxings.length - 1; i >= 0; --i) {
          defs[name] = Dup("dup_" + unboxings[i], Ref(unboxings[i]), defs[name]);
        }
      }
    }
  }

  return {defs, tokens, adts};
}

const unrecurse = (term, term_name, add_depth) => {
  var is_recursive = false;
  var is_unhalting = false;
  const go = ([ctor, term], depth, eras) => {
    switch (ctor) {
      case "Var":
        return Var(term.index);
      case "Typ":
        return Typ();
      case "All":
        var name = term.name;
        var bind = go(term.bind, depth, true);
        var body = go(term.body, depth + 1, eras);
        var eras = term.eras;
        return All(name, bind, body, eras);
      case "Lam":
        var name = term.name;
        var bind = term.bind && go(term.bind, depth, true);
        var body = go(term.body, depth + 1, eras);
        var eras = term.eras;
        return Lam(name, bind, body, eras);
      case "App":
        var func = go(term.func, depth, eras);
        var argm = go(term.argm, depth, term.eras || eras);
        var eras = term.eras;
        return App(func, argm, term.eras);
      case "Box":
        var expr = go(term.expr, depth, true);
        return Box(expr);
      case "Put":
        var expr = go(term.expr, depth, eras);
        return Put(expr);
      case "Dup":
        var name = term.name;
        var expr = go(term.expr, depth, eras);
        var body = go(term.body, depth + 1, eras);
        return Dup(name, expr, body);
      case "Wrd":
        return Wrd();
      case "Num":
        var numb = term.numb;
        return Num(numb);
      case "Op1":
      case "Op2":
        var func = term.func;
        var num0 = go(term.num0, depth, eras);
        var num1 = go(term.num1, depth, eras);
        return Op2(func, num0, num1);
      case "Ite":
        var cond = go(term.cond, depth, eras);
        var pair = go(term.pair, depth, eras);
        return Ite(cond, pair);
      case "Cpy":
        var name = term.name;
        var numb = go(term.numb, depth, eras);
        var body = go(term.body, depth + 1, eras);
        return Cpy(name, numb, body);
      case "Sig":
        var name = term.name;
        var typ0 = go(term.typ0, depth, true);
        var typ1 = go(term.typ1, depth + 1, true);
        var eras = term.eras;
        return Sig(name, typ0, typ1, eras);
      case "Par":
        var val0 = go(term.val0, depth, term.eras === 1);
        var val1 = go(term.val1, depth, term.eras === 2);
        var eras = term.eras;
        return Par(val0, val1, eras);
      case "Fst":
        var pair = go(term.pair, depth, eras);
        var eras = term.eras;
        return Fst(pair, eras);
      case "Snd":
        var pair = go(term.pair, depth, eras);
        var eras = term.eras;
        return Snd(pair, eras);
      case "Prj":
        var nam0 = term.nam0;
        var nam1 = term.nam1;
        var pair = go(term.pair, depth, eras);
        var body = go(term.body, depth + 2, eras);
        var eras = term.eras;
        return Prj(nam0, nam1, pair, body, eras);
      case "Eql":
        var val0 = go(term.val0, depth, eras);
        var val1 = go(term.val1, depth, eras);
        return Eql(val0, val1);
      case "Rfl":
        var expr = go(term.expr, depth, true);
        return Rfl(expr);
      case "Sym":
        var prof = go(term.prof, depth, true);
        return Sym(prof);
      case "Rwt":
        var name = term.name;
        var type = go(term.type, depth + 1, true);
        var prof = go(term.prof, depth, true);
        var expr = go(term.expr, depth, eras);
        return Rwt(name, type, prof, expr);
      case "Cst":
        var prof = go(term.prof, depth, true);
        var val0 = go(term.val0, depth, true);
        var val1 = go(term.val1, depth, eras);
        return Cst(prof, val0, val1);
      case "Slf":
        var name = term.name;
        var type = go(term.type, depth + 1, true);
        return Slf(name, type);
      case "New":
        var type = term.type;
        var expr = go(term.expr, depth, eras);
        return New(type, expr);
      case "Use":
        var expr = go(term.expr, depth, eras);
        return Use(expr);
      case "Ann":
        var type = go(term.type, depth, true);
        var expr = go(term.expr, depth, eras);
        var done = term.done;
        return Ann(type, expr, done);
      case "Log":
        var msge = go(term.msge, depth, true);
        var expr = go(term.expr, depth, eras);
        return Log(msge, expr);
      case "Ref":
        if (term.name === term_name) {
          is_recursive = true;
          is_unhalting = is_unhalting || !eras;
          return Var(depth + add_depth);
        } else {
          return Ref(term.name, term.eras);
        }
    }
  };
  var term = go(term, 0, false);
  return [is_recursive, is_unhalting, term];
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
    case "Cst":
      var prof = replace_refs(term.prof, renamer, depth);
      var val0 = replace_refs(term.val0, renamer, depth);
      var val1 = replace_refs(term.val1, renamer, depth);
      return Cst(prof, val0, val1);
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

// TODO: rework
// const derive_dependent_match = ({names, types, cased, erase, cadts}, type, case_tree) => {
//   return (function arg(a, last_carry = 0, carry = [], branch = []) {
//     //console.log("building arg ", a);
// 
//     // For each argument to be projected
//     if (a < names.length) {
//       if (!cadts[a]) {
//         //console.log("not an adt");
//         return arg(a + 1, last_carry, carry, branch);
//       } else {
//         var {adt_name, adt_pram, adt_indx, adt_ctor} = cadts[a];
//         //console.log("it is the adt", adt_name);
// 
//         // Creates the inductive pattern-matching function of this argument
//         var term = Use(Var(-1 + names.length - a));
// 
//         // Applies the motive of this argument
//         var term = App(term, (function motive_idxs(i) {
//           if (i < adt_indx.length) {
//             return Lam(adt_indx[i][0], null, motive_idxs(i + 1), false);
//           } else {
//             return Lam("self", null, (function motive_others(v) {
//               var substs = [];
//               for (var V = 0; V < v; ++V) {
//                 var to_self = (v < a ? v : v - 1) + (v >= names.length ? carry.length : 0);
//                 substs.push(Var(to_self - (V < a ? V + 1 : V === a ? 0 : V)));
//               }
//               if (v < names.length) {
//                 if (v === a) {
//                   return motive_others(v + 1);
//                 } else {
//                   return All(names[v], subst_many(types[v], substs, 0), motive_others(v + 1), v < a && cased[v]);
//                 }
//               } else {
//                 return (function motive_carrys(k) {
//                   if (k < carry.length) {
//                     return All(carry[k][0], subst_many(carry[k][1], substs, 0), motive_carrys(k + 1), false);
//                   } else {
//                     return subst_many(type, substs, 0);
//                   }
//                 })(0);
//               }
//             })(0), false);
//           }
//         })(0), true);
// 
//         // Applies each case of this argument
//         for (var c = 0; c < adt_ctor.length; ++c) {
//           //console.log("building case", adt_ctor[c][0]);
//           term = App(term, (function cases(f, v, k) {
//             // Case fields
//             if (f < adt_ctor[c][1].length) {
//               //console.log("field", adt_ctor[c][1][f]);
//               return Lam(names[a] + "." + adt_ctor[c][1][f][0], null, cases(f + 1, v, k), adt_ctor[c][1][f][2]);
//             // Variables to hold the other values
//             } else if (v < names.length) {
//               // If this is the matched value, rebuild it
//               if (v === a) {
//                 var wit = Ref(adt_ctor[c][0]);
//                 for (var F = 0; F < f; ++F) {
//                   wit = App(wit, Var(-1 + v + f - F), adt_ctor[c][1][F][2]);
//                 }
//                 return subst(cases(f, v + 1, k), wit, 0);
//               // Otherwise, just create a lam for it
//               } else {
//                 return Lam(names[v], null, cases(f, v + 1, k), v < a && cased[v]);
//               }
//             // Variables to hold carried values
//             } else if (k < carry.length) {
//               return Lam(carry[k][0], null, cases(f, v, k + 1), false);
//             // Body of the case
//             } else {
//               var new_carry = adt_ctor[c][1].map(([name,type,eras]) => {
//                 return [names[a] + "." + name, subst(type, Ref(adt_name), 0)];
//               });
//               //console.log("extending carry", JSON.stringify(carry), JSON.stringify(new_carry));
//               var case_body = arg(a + 1, adt_ctor[c][1].length, carry.concat(new_carry), branch.concat([adt_ctor[c][0]]));
//               //console.log("ue", a + 1, names.length);
//               //if (a + 1 < names.length) {
//                 //for (var C = 0; C < adt_ctor[c][1].length; ++C) {
//                   //case_body = App(case_body, Var(-1 + (v - 1) + adt_ctor[c][1].length - C), false);
//                   //case_body = App(case_body, Var(-1 + carry.length + names.length + adt_ctor[c][1].length - C), false);
//                 //}
//               //}
//               return case_body;
//             }
//           })(0, 0, 0), false);
//         }
// 
//         // Applies other values
//         for (var v = 0; v < names.length; ++v) {
//           if (v !== a) {
//             term = App(term, Var(-1 + carry.length - last_carry + names.length - v), v < a && cased[v]);
//           }
//         }
// 
//         // Applies old carry values
//         for (var k = 0; k < carry.length - last_carry; ++k) {
//           term = App(term, Var(-1 + carry.length - last_carry - k), false);
//         }
// 
//         // Applies new carry values
//         for (var k = 0; k < last_carry; ++k) {
//           term = App(term, Var(-1 + carry.length + names.length - k), false);
//         }
// 
//         return term;
//       }
// 
//     // Done (i.e., this is the deepest spot, so, put the nth pattern-matching body here)
//     } else {
//       var substs = [];
// 
//       // Substitutes other values
//       for (var v = 0; v < names.length; ++v) {
//         if (v !== a) {
//           substs.push(Var(-1 + carry.length - last_carry + names.length - v));
//         }
//       }
// 
//       // Substitutes old carry values
//       for (var k = 0; k < carry.length - last_carry; ++k) {
//         substs.push(Var(-1 + carry.length - last_carry - k));
//       }
// 
//       // Substitutes new carry values
//       for (var k = 0; k < last_carry; ++k) {
//         substs.push(Var(-1 + carry.length + names.length - k));
//       }
//       var term = case_tree[branch.join("_")];
//       var term = subst_many(term, substs, 0);
//       return term;
//     }
//   })(0);
// }

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
    var dir_path, file_path;
    if (!loading[file]) {
      if (fs) {
        var dir_path = path.join(process.cwd(), "fm_modules");
        var file_path = path.join(dir_path, file + ".fm");
      }
      if (fs && fs.existsSync(file_path)) {
        loading[file] = new Promise((resolve, reject) => {
          fs.readFile(file_path, "utf8", (err, code) => {
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
            var writeCache = () => fs.writeFile(file_path, code, (err, ok) => {});
            if (!fs.existsSync(dir_path)) {
              fs.mkdirSync(dir_path, () => writeCache());
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
  Cst,
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
