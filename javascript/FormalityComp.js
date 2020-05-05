// This is a temporary file that exists because we need some way to run
// Formality-Core programs. It compiles terms to either JavaScript or Haskell.
// It isn't a very elegant code and will be replaced by compilers written in
// Formality itself eventually. Without this file, running Formality-Core on the
// short term would be too slow and bootstrapping would be hard.

var fmc = require("./FormalityCore.js");

var old = (function() {
  function Var(indx, locs = null) {
    var hash = hash_two(1, indx);
    return {ctor: "Var", hash, indx, locs};
  };

  function Ref(name, locs = null) {
    var hash = hash_two(2, hash_str(name));
    return {ctor: "Ref", hash, name, locs};
  };

  function Typ(locs = null) {
    var hash = hash_two(3, 0);
    return {ctor: "Typ", hash, locs};
  };

  function All(eras, self, name, bind, body, locs = null) {
    var hash = hash_two(4, hash_two(bind.hash, body.hash));
    return {ctor: "All", hash, eras, self, name, bind, body, locs};
  };

  function Lam(eras, name, body, locs = null) {
    var hash = hash_two(5, body.hash);
    return {ctor: "Lam", hash, eras, name, body, locs};
  };

  function App(eras, func, argm, locs = null) {
    var hash = hash_two(6, hash_two(func.hash, argm.hash));
    return {ctor: "App", hash, eras, func, argm, locs};
  };

  function Let(name, expr, body, locs = null) {
    var hash = hash_two(7, hash_two(expr.hash, body.hash));
    return {ctor: "Let", hash, name, expr, body};
  };

  function Ann(done, expr, type, locs = null) {
    var hash = hash_two(8, hash_two(expr.hash, type.hash));
    return {ctor: "Ann", hash, done, expr, type, locs};
  };

  // List
  // ====

  function Nil() {
    return {ctor: "Nil", length: 0};
  };

  function Ext(head, tail) {
    return {ctor: "Ext", head, tail, length: tail.length + 1};
  };

  // Parsing
  // =======

  // Finds a value in a list
  function find(list, cond, indx = 0) {
    switch (list.ctor) {
      case "Nil":
        return null;
      case "Ext":
        if (cond(list.head, indx)) {
          return {value: list.head, index: indx};
        } else {
          return find(list.tail, cond, indx + 1);
        }
    };
  };

  // Is this a space character?
  function is_space(chr) {
    return chr === " " || chr === "\t" || chr === "\n";
  };

  // Is this a name-valid character?
  function is_name(chr) {
    var val = chr.charCodeAt(0);
    return (val >= 46 && val < 47)   // .
        || (val >= 48 && val < 58)   // 0-9
        || (val >= 65 && val < 91)   // A-Z
        || (val >= 95 && val < 96)   // _
        || (val >= 97 && val < 123); // a-z
  };

  // Returns the first valid parser
  function first_valid(fns, err) {
    for (var i = 0; i < fns.length; ++i) {
      var parsed = fns[i]();
      if (parsed !== null) {
        return parsed;
      }
    };
    return null;
  };

  // Chains two parsers
  function chain(a, fn) {
    if (a) {
      return fn(a[0], a[1]);
    } else {
      return null;
    }
  };

  // Drop characters while a condition is met.
  function drop_while(cond, code, indx) {
    while (indx < code.length && cond(code[indx])) {
      indx++;
    };
    return indx;
  };

  // Drop spaces
  function drop_spaces(code, indx) {
    return drop_while(is_space, code, indx);
  };

  // Drops comment
  function drop_comment(code, indx) {
    var indx = drop_spaces(code, indx);
    var pref = code.slice(indx, indx + 2)
    if (pref === "//" || pref === "--") {
      while (indx < code.length && code[indx] !== "\n") {
        ++indx;
      }
      indx += 1;
    }
    if (pref === "/*") {
      while (indx < code.length && code.slice(indx, indx+2) !== "*/") {
        ++indx;
      }
      indx += 2;
    }
    if (code.slice(indx, indx + 2) === "{-") {
      while (indx < code.length && code.slice(indx, indx+2) !== "-}") {
        ++indx;
      }
      indx += 2;
    }
    return indx;
  };

  // Drops spaces and comments
  function next(code, indx) {
    while (true) {
      var new_indx = drop_comment(code, indx);
      if (new_indx === indx) {
        return indx;
      } else {
        indx = new_indx;
      }
    };
  };

  function parse_error(code, indx, expected, err) {
    if (err) {
      var expec = expected.replace(/\n/g, "<newline>");
      var found = (code[indx] || "<end-of-file>").replace(/\n/g, "<newline>");
      throw ( "Parse error: expected "+expec+", found '"+found+"'.\n"
            + highlight_code(code, indx, indx+1));
    } else {
      return null;
    }
  };

  // Drops spaces and parses an exact string
  function parse_txt(code, indx, str, err = false) {
    if (str.length === 0) {
      return [indx, str];
    } else if (indx < code.length && code[indx] === str[0]) {
      return parse_txt(code, indx+1, str.slice(1), err);
    } else {
      return parse_error(code, indx, "'"+str+"'", err);
    };
  };

  // Parses one of two strings
  function parse_one(code, indx, ch0, ch1, err) {
    var parsed_fst = parse_txt(code, indx, ch0, false);
    if (parsed_fst) {
      return [parsed_fst[0], false];
    } else {
      var parsed_snd = parse_txt(code, indx, ch1, err);
      if (parsed_snd) {
        return [parsed_snd[0], true];
      } else {
        return null;
      }
    }
  };

  // Parses an optional string
  function parse_opt(code, indx, str, err) {
    var parsed = parse_txt(code, indx, str, false);
    if (parsed) {
      return [parsed[0], true];
    } else {
      return [indx, false];
    }
  };

  // Parses a valid name, non-empty
  function parse_nam(code, indx, size = 0, err = false) {
    if (indx < code.length && is_name(code[indx])) {
      var head = code[indx];
      var parsed_nam = parse_nam(code, indx + 1, size + 1, err);
      if (parsed_nam) {
        return [parsed_nam[0], head + parsed_nam[1]];
      } else {
        return null;
      };
    } else if (size > 0) {
      return [indx, ""];
    } else {
      return parse_error(code, indx, "a name", err);
    }
  };

  // Parses a parenthesis, `(<term>)`
  function parse_par(code, indx, vars, err = false) {
    return (
      chain(parse_txt(code, next(code, indx), "(", false), (indx, skip) =>
      chain(parse_term(code, indx, vars, err),             (indx, term) =>
      chain(parse_txt(code, next(code, indx), ")", err),   (indx, skip) =>
      [indx, term]))));
  };

  // Parses a dependent function type, `(<name> : <term>) -> <term>`
  function parse_all(code, indx, vars, err = false) {
    var from = next(code, indx);
    return (
      chain(parse_nam(code, next(code, indx), 1, false), (indx, self) =>
      chain(parse_one(code, indx, "(", "<", false),                   (indx, eras) =>
      chain(parse_nam(code, next(code, indx), 1, false),              (indx, name) =>
      chain(parse_txt(code, next(code, indx), ":", false),            (indx, skip) =>
      chain(parse_term(code, indx, Ext(self, vars), err),             (indx, bind) =>
      chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
      chain(parse_txt(code, next(code, indx), "->", err),             (indx, skip) =>
      chain(parse_term(code, indx, Ext(name, Ext(self, vars)), err),  (indx, body) =>
      [indx, All(eras, self, name, bind, body, {from,to:indx})])))))))));
  };

  // Parses a dependent function value, `(<name>) => <term>`
  function parse_lam(code, indx, vars, err = false) {
    var from = next(code, indx);
    return (
      chain(parse_one(code, next(code, indx), "(", "<", false),         (indx, eras) =>
      chain(parse_nam(code, next(code, indx), 1, false),                (indx, name) =>
      chain(parse_txt(code, next(code, indx), eras ? ">" : ")", false), (indx, skip) =>
      chain(parse_term(code, indx, Ext(name, vars), err),               (indx, body) =>
      [indx, Lam(eras, name, body, {from,to:indx})])))));
  };

  // Parses a local definition, `let x = val; body`
  function parse_let(code, indx, vars, err = false) {
    var from = next(code, indx);
    return (
      chain(parse_txt(code, next(code, indx), "let ", false), (indx, skip) =>
      chain(parse_nam(code, next(code, indx), 0, err),        (indx, name) =>
      chain(parse_txt(code, next(code, indx), "=", err),      (indx, skip) =>
      chain(parse_term(code, indx, vars, err),                (indx, expr) =>
      chain(parse_opt(code, indx, ";", err),                  (indx, skip) =>
      chain(parse_term(code, indx, Ext(name, vars), err),     (indx, body) =>
      [indx, Let(name, expr, body, {from,to:indx})])))))));
  };

  // Parses the type of types, `Type`
  function parse_typ(code, indx, vars, err = false) {
    var from = next(code, indx);
    return (
      chain(parse_txt(code, next(code, indx), "Type", false), (indx, skip) =>
      [indx, Typ({from,to:indx})]));
  };

  // Parses variables, `<name>`
  function parse_var(code, indx, vars, err = false) {
    var from = next(code, indx);
    return chain(parse_nam(code, next(code, indx), 0, false), (indx, name) => {
      var got = find(vars, (x,i) => x === name);
      if (got) {
        return [indx, Var(got.index, {from,to:indx})];
      } else if (!isNaN(Number(name))) {
        return [indx, Var(Number(name), {from,to:indx})];
      } else if (name.length === 0) {
        return parse_error(code, indx, "a variable", err);
      } else {
        return [indx, Ref(name, {from,to:indx})];
      };
    });
  };

  // Parses a single-line application, `<term>(<term>)`
  function parse_app(code, indx, from, func, vars, err) {
    return (
      chain(parse_one(code, indx, "(", "<", false),                   (indx, eras) =>
      chain(parse_term(code, indx, vars, err),                        (indx, argm) =>
      chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
      [indx, App(eras, func, argm, {from,to:indx})]))));
  };

  // Parses a multi-line application, `<term> | <term>;`
  function parse_pip(code, indx, from, func, vars, err) {
    return (
      chain(parse_txt(code, next(code, indx), "|", false), (indx, skip) =>
      chain(parse_term(code, indx, vars, err), (indx, argm) =>
      chain(parse_txt(code, next(code, indx), ";", err), (indx, skip) =>
      [indx, App(false, func, argm, {from,to:indx})]))));
  };

  // Parses a non-dependent function type, `<term> -> <term>`
  function parse_arr(code, indx, from, bind, vars, err) {
    return (
      chain(parse_txt(code, next(code, indx), "->", false), (indx, skip) =>
      chain(parse_term(code, indx, Ext("", Ext("", vars)), err), (indx, body) =>
      [indx, All(false, "", "", shift(bind,1,0), body, {from,to:indx})])));
  };

  // Parses an annotation, `<term> :: <term>`
  function parse_ann(code, indx, from, expr, vars, err) {
    return (
      chain(parse_txt(code, next(code, indx), "::", false), (indx, skip) =>
      chain(parse_term(code, indx, vars, err), (indx, type) =>
      [indx, Ann(false, expr, type, {from,to:indx})])));
  };

  // Turns a character into a term
  function make_chr(chr) {
    var cod = chr.charCodeAt(0);
    var chr = Ref("Char.new");
    for (var i = 15; i >= 0; --i) {
      chr = App(false, chr, Ref((cod >>> i) & 1 ? "Bit.1" : "Bit.0"));
    };
    return chr;
  };

  // Parses a char literal, 'f'
  function parse_chr(code, indx, err) {
    var from = next(code, indx);
    return (
      chain(parse_txt(code, next(code, indx), "'"), (indx, skip) =>
      chain([indx+1, code[indx]],                   (indx, clit) =>
      chain(parse_txt(code, next(code, indx), "'"), (indx, skip) =>
      [indx, Ann(true, make_chr(clit), Ref("Char"), {from,to:indx})]
      ))));
  };

  // Parses a string literal, "foo"
  function parse_str(code, indx, err) {
    var from = next(code, indx);
    return (
      chain(parse_txt(code, next(code, indx), "\""), (indx, skip) =>
      chain((function go(indx, slit) {
        if (indx < code.length) {
          if (code[indx] !== "\"") {
            var chr = make_chr(code[indx]);
            var [indx, slit] = go(indx + 1, slit);
            return [indx, App(false, App(false, Ref("String.cons"), chr), slit)];
          } else {
            return [indx+1, Ref("String.nil")];
          }
        } else if (err) {
          parse_error(code, indx, "string literal", true);
        } else {
          return null;
        }
      })(indx), (indx, slit) =>
      [indx, Ann(true, slit, Ref("String"), {from,to:indx})])));
  };

  // Parses a term
  function parse_term(code, indx = 0, vars = Nil(), err) {
    var indx = next(code, indx);
    var from = indx;

    // Parses the base term, trying each variant once
    var base_parse = first_valid([
      () => parse_all(code, indx, vars, err),
      () => parse_lam(code, indx, vars, err),
      () => parse_let(code, indx, vars, err),
      () => parse_par(code, indx, vars, err),
      () => parse_typ(code, indx, vars, err),
      () => parse_chr(code, indx, err),
      () => parse_str(code, indx, err),
      () => parse_var(code, indx, vars, err),
    ], err);

    if (!base_parse && err) {
      parse_error(code, indx, "a term", err);
    } else {
      // Parses postfix extensions, trying each variant repeatedly
      var post_parse = base_parse;
      while (true) {
        var [indx, term] = post_parse;
        post_parse = first_valid([
          () => parse_app(code, indx, from, term, vars, err),
          () => parse_pip(code, indx, from, term, vars, err),
          () => parse_arr(code, indx, from, term, vars, err),
          () => parse_ann(code, indx, from, term, vars, err),
        ], err);
        if (!post_parse) {
          return base_parse;
        } else {
          base_parse = post_parse;
        }
      }
    }

    return null;
  };

  // Parses a file
  function parse_defs(code, indx = 0) {
    var defs = {};
    function parse_defs(code, indx) {
      var indx = next(code, indx);
      if (indx === code.length) {
        return;
      } else {
        chain(parse_nam(code, next(code, indx), 0, true), (indx, name) =>
        chain(parse_txt(code, next(code, indx), ":", true), (indx, skip) =>
        chain(parse_term(code, next(code, indx), Nil(), true), (indx, type) =>
        chain(parse_opt(code, drop_spaces(code, indx), "//loop//"), (indx, loop) =>
        chain(parse_opt(code, drop_spaces(code, indx), "//prim//"), (indx, prim) =>
        chain(parse_opt(code, drop_spaces(code, indx), "//data//"), (indx, data) =>
        chain(parse_term(code, next(code, indx), Nil(), true), (indx, term) =>
        chain(parse_txt(code, drop_while(c=>c===" ", code, indx), "\n", true), (indx, skip) => {
          defs[name] = {type, term, meta: {loop,prim,data}};
          parse_defs(code, indx);
        }))))))));
      };
    }
    parse_defs(code, indx);
    return defs;
  };

  // Stringification
  // ===============

  // Stringifies a character literal
  function stringify_chr(chr) {
    var val = 0;
    for (var i = 0; i < 16; ++i) {
      if (chr.ctor === "App" && chr.argm.ctor === "Ref") {
        if (chr.argm.name === "Bit.0") {
          val = val;
          chr = chr.func;
        } else if (chr.argm.name === "Bit.1") {
          val = val | (1 << i);
          chr = chr.func;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
    if (chr.ctor === "Ref" && chr.name === "Char.new") {
      return String.fromCharCode(val);
    } else {
      return null;
    };
  };

  // Stringifies a string literal
  function stringify_str(term) {
    if (term.ctor === "Ref" && term.name === "String.nil") {
      return "";
    } else if (term.ctor === "App"
      && term.func.ctor === "App"
      && term.func.func.ctor === "Ref"
      && term.func.func.name === "String.cons") {
      var chr = stringify_chr(term.func.argm);
      if (chr !== null) {
        return chr + stringify_str(term.argm);
      } else {
        return null;
      }
    }
  };

  // Stringifies a 'Debug.display' message
  function stringify_bug(term) {
    if (term.ctor === "Lam" && term.name === "Debug.display") {
      try {
        term = term.body.argm.body.body;
        var str = "";
        while (term.ctor !== "Var") {
          var val = 0;
          var chr = term.func.argm.body.argm;
          for (var i = 0; i < 16; ++i) {
            chr = chr.body.body.body;
            if (chr.func.indx === 0) {
              val = val | (1 << i);
            }
            chr = chr.argm;
          }
          term = term.argm.body.body;
          str += String.fromCharCode(val);
        }
        return str;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Stringifies a term
  function stringify_term(term, vars = Nil()) {
    var chr_lit = stringify_chr(term);
    var str_lit = stringify_str(term);
    var bug_lit = stringify_bug(term);
    if (chr_lit) {
      return "'"+chr_lit+"'";
    } else if (str_lit) {
      return "\""+str_lit+"\"";
    } else if (bug_lit) {
      return bug_lit;
    } else {
      switch (term.ctor) {
        case "Var":
          var got = find(vars, (x,i) => i === term.indx);
          if (got) {
            return got.value;
          } else {
            return "#" + term.indx;
          };
        case "Ref":
          return term.name;
        case "Typ":
          return "Type";
        case "All":
          var self = term.self;
          var lpar = term.name === "" ? "" : (term.eras ? "<" : "(");
          var name = term.name;
          var colo = term.name === "" ? "" : ": ";
          var bind = stringify_term(term.bind, Ext(self, vars));
          var rpar = term.name === "" ? "" : (term.eras ? ">" : ")");
          var body = stringify_term(term.body, Ext(name, Ext(self, vars)));
          return self+lpar+name+colo+bind+rpar+" -> "+body;
        case "Lam":
          var name = term.name;
          var lpar = term.eras ? "<" : "(";
          var body = stringify_term(term.body, Ext(name, vars));
          var rpar = term.eras ? ">" : ")";
          return lpar+name+rpar+" "+body;
        case "App":
          var func = stringify_term(term.func, vars);
          var lpar = term.eras ? "<" : "(";
          var argm = stringify_term(term.argm, vars);
          var rpar = term.eras ? ">" : ")";
          if (term.func.ctor === "Lam" || term.func.ctor === "All") {
            return "("+func+")"+lpar+argm+rpar;
          } else {
            return func+lpar+argm+rpar;
          }
        case "Let":
          var name = term.name;
          var expr = stringify_term(term.expr, vars);
          var body = stringify_term(term.body, Ext(name, vars));
          return "let "+name+" = "+expr+"; "+body;
        case "Ann":
          var expr = stringify_term(term.expr, vars);
          var type = stringify_term(term.type, vars);
          return expr+" :: "+type;
      }
    }
  };

  // Stringifies a context
  function stringify_ctx(ctx, nam) {
    var lines = [];
    function stringify_ctx(ctx, nam, len = 0) {
      switch (ctx.ctor) {
        case "Ext":
          var name = nam.head;
          var type = stringify_term(ctx.head, nam.tail);
          lines.push("- " + name + " : " + type);
          stringify_ctx(ctx.tail, nam.tail, len + 1);
          break;
        case "Nil":
          break;
      };
    };
    stringify_ctx(ctx, nam, 0);
    return lines.reverse().join("\n") + "\n";
  };

  // Stringifies all terms of a file
  function stringify_file(mod) {
    var text = "";
    for (var name in mod) {
      var type = stringify_term(mod[name].type, Nil());
      var term = stringify_term(mod[name].term, Nil());
      text += name + " : " + type + "\n  " + term + "\n\n";
    }
    return text;
  };

  // Substitution
  // ============

  function shift(term, inc, dep) {
    switch (term.ctor) {
      case "Var":
        if (term.indx < dep) {
          return Var(term.indx);
        } else {
          return Var(term.indx + inc);
        }
      case "Ref":
        return Ref(term.name);
      case "Typ":
        return Typ();
      case "All":
        var eras = term.eras;
        var self = term.self;
        var name = term.name;
        var bind = shift(term.bind, inc, dep + 1);
        var body = shift(term.body, inc, dep + 2);
        var locs = term.locs;
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        var eras = term.eras;
        var name = term.name;
        var body = shift(term.body, inc, dep + 1);
        var locs = term.locs;
        return Lam(eras, name, body, locs);
      case "App":
        var eras = term.eras;
        var func = shift(term.func, inc, dep);
        var argm = shift(term.argm, inc, dep);
        var locs = term.locs;
        return App(eras, func, argm, locs);
      case "Let":
        var name = term.name;
        var expr = shift(term.expr, inc, dep);
        var body = shift(term.body, inc, dep + 1);
        var locs = term.locs;
        return Let(name, expr, body, locs);
      case "Ann":
        var expr = shift(term.expr, inc, dep);
        var type = shift(term.type, inc, dep);
        var done = term.done;
        var locs = term.locs;
        return Ann(done, expr, type, locs);
    };
  };

  function subst(term, val, dep) {
    switch (term.ctor) {
      case "Var":
        var locs = term.locs;
        if (term.indx < dep) {
          return Var(term.indx, locs);
        } else if (term.indx === dep) {
          return val;
        } else {
          return Var(term.indx - 1, locs);
        }
      case "Ref":
        var locs = term.locs;
        return Ref(term.name, locs);
      case "Typ":
        return Typ();
      case "All":
        var locs = term.locs;
        var eras = term.eras;
        var self = term.self;
        var name = term.name;
        var bind = subst(term.bind, shift(val,1,0), dep + 1);
        var body = subst(term.body, shift(val,2,0), dep + 2);
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        var locs = term.locs;
        var eras = term.eras;
        var name = term.name;
        var body = subst(term.body, shift(val,1,0), dep + 1);
        return Lam(eras, name, body, locs);
      case "App":
        var locs = term.locs;
        var eras = term.eras;
        var func = subst(term.func, val, dep);
        var argm = subst(term.argm, val, dep);
        return App(eras, func, argm, locs);
      case "Let":
        var locs = term.locs;
        var name = term.name;
        var expr = subst(term.expr, val, dep);
        var body = subst(term.body, shift(val,1,0), dep + 1);
        return Let(name, expr, body, locs);
      case "Ann":
        var locs = term.locs;
        var expr = subst(term.expr, val, dep);
        var type = subst(term.type, val, dep);
        var done = term.done;
        return Ann(done, expr, type, locs);
    };
  };

  // Evaluation
  // ==========

  function to_high_order(term, vars = Nil(), depth = 0) {
    switch (term.ctor) {
      case "Var":
        var got = find(vars, (x,i) => i === term.indx);
        if (got) {
          return got.value;
        } else {
          return Var(depth - term.indx - 1, term.locs);
        }
      case "Ref":
        return Ref(term.name, term.locs);
      case "Typ":
        return Typ(term.locs);
      case "All":
        var locs = term.locs;
        var eras = term.eras;
        var self = term.self;
        var name = term.name;
        var bind = s => to_high_order(term.bind, Ext(s, vars), depth + 1);
        var body = (s,x) => to_high_order(term.body, Ext(x, Ext(s, vars)), depth + 2);
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        if (term.eras) {
          var body = subst(term.body, Ref("<erased>"), 0);
          return to_high_order(body, vars, depth);
        } else {
          var name = term.name;
          var body = x => to_high_order(term.body, Ext(x, vars), depth + 1);
          var locs = term.locs;
          return Lam(false, name, body, locs);
        };
      case "App":
        if (term.eras) {
          return to_high_order(term.func, vars, depth);
        } else {
          var func = to_high_order(term.func, vars, depth);
          var argm = to_high_order(term.argm, vars, depth);
          var locs = term.locs;
          return App(false, func, argm, locs);
        }
      case "Let":
        var name = term.name;
        var expr = to_high_order(term.expr, vars, depth);
        var body = x => to_high_order(term.body, Ext(x, vars), depth + 1);
        var locs = term.locs;
        return Let(name, expr, body, locs);
      case "Ann":
        return to_high_order(term.expr, vars, depth);
    }
  };

  function to_low_order(term, depth = 0) {
    switch (term.ctor) {
      case "Var":
        return Var(depth - term.indx - 1, term.locs);
      case "Ref":
        return Ref(term.name, term.locs);
      case "Typ":
        return Typ();
      case "All":
        var eras = term.eras;
        var self = term.self;
        var name = term.name;
        var bind = to_low_order(term.bind(Var(depth)), depth + 1);
        var body = to_low_order(term.body(Var(depth), Var(depth+1)), depth + 2);
        var locs = term.locs;
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        var name = term.name;
        var body = to_low_order(term.body(Var(depth)), depth + 1);
        var locs = term.locs;
        return Lam(false, name, body, locs);
      case "App":
        var func = to_low_order(term.func, depth);
        var argm = to_low_order(term.argm, depth);
        var locs = term.locs;
        return App(false, func, argm, locs);
      case "Let":
        var name = term.name;
        var expr = to_low_order(term.expr, depth);
        var body = to_low_order(term.body(Var(depth)), depth + 1);
        var locs = term.locs;
        return Let(name, expr, body, locs);
      case "Ann":
        throw "Unreachable.";
    }
  };

  function reduce_high_order(term, file) {
    switch (term.ctor) {
      case "Var":
        return Var(term.indx, term.locs);
      case "Ref":
        if (file[term.name]) {
          return reduce_high_order(to_high_order(file[term.name].term), file);
        } else {
          return Ref(term.name, term.locs);
        }
      case "Typ":
        return Typ();
      case "All":
        var eras = term.eras;
        var self = term.self;
        var name = term.name;
        var bind = term.bind;
        var body = term.body;
        var locs = term.locs;
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        var name = term.name;
        var body = term.body;
        var locs = term.locs;
        return Lam(false, name, body, locs);
      case "App":
        var func = reduce_high_order(term.func, file);
        switch (func.ctor) {
          case "Lam":
            return reduce_high_order(func.body(term.argm), file);
          default:
            return App(false, func, reduce_high_order(term.argm, file), term.locs);
        };
      case "Let":
        var name = term.name;
        var expr = term.expr;
        var body = term.body;
        var locs = term.locs;
        return reduce_high_order(body(expr), file);
      case "Ann":
        return reduce_high_order(term.expr, file);
    };
  };

  function normalize_high_order(term, file) {
    var norm = reduce_high_order(term, file);
    switch (norm.ctor) {
      case "Var":
        return Var(norm.indx, norm.locs);
      case "Ref":
        return Ref(norm.name, norm.locs);
      case "Typ":
        return Typ();
      case "All":
        var eras = norm.eras;
        var self = norm.self;
        var name = norm.name;
        var bind = s => normalize_high_order(norm.bind(s), file);
        var body = (s,x) => normalize_high_order(norm.body(s,x), file);
        var locs = norm.locs;
        return All(eras, self, name, bind, body, locs);
      case "Lam":
        var name = norm.name;
        var body = x => normalize_high_order(norm.body(x), file);
        var locs = norm.locs;
        return Lam(false, name, body, locs);
      case "App":
        var func = normalize_high_order(norm.func, file);
        var argm = normalize_high_order(norm.argm, file);
        var locs = norm.locs;
        return App(false, func, argm, locs);
      case "Let":
        var name = norm.name;
        var expr = normalize_high_order(norm.expr, file);
        var body = x => normalize_high_order(norm.body(x), file);
        var locs = norm.locs;
        return Let(name, expr, body, locs);
      case "Ann":
        return normalize_high_order(norm.expr, file);
    };
  };

  function reduce(term, file) {
    return to_low_order(reduce_high_order(to_high_order(term, Nil()), file), 0);
  };

  function normalize(term, file) {
    return to_low_order(normalize_high_order(to_high_order(term, Nil()), file), 0);
  };

  // Equality
  // ========

  // Creates a new disjoint set
  function new_disjoint_set() {
    const disjoint_set = {rank: 0};
    disjoint_set.parent = disjoint_set;
    return disjoint_set;
  };

  // Finds the disjoint set of an element
  function disjoint_set_find(node) {
    if (node.parent !== node) {
      node.parent = disjoint_set_find(node.parent);
    }
    return node.parent;
  };

  // Merges two disjoint sets
  function disjoint_set_union(node1, node2) {
    var root1 = disjoint_set_find(node1);
    var root2 = disjoint_set_find(node2);
    if (root1 !== root2) {
      if (root1.rank < root2.rank) {
        root1.parent = root2;
      } else {
        root2.parent = root1;
        if (root1.rank === root2.rank) {
          root1.rank += 1;
        }
      }
    }
  };

  // Checks if `x` and `y` are on the same equivalence class
  function is_equivalent(map, x, y) {
    if (map[x] && map[y]) {
      return disjoint_set_find(map[x]) === disjoint_set_find(map[y]);
    } else {
      return x === y;
    }
  };

  // Merges the equivalence classes of `x` and `y`
  function equate(map, x, y) {
    if (!map[x]) {
      map[x] = new_disjoint_set();
    }
    if (!map[y]) {
      map[y] = new_disjoint_set();
    };
    disjoint_set_union(map[x], map[y]);
  };

  // Replaces all free variables of a subterm with a reference
  // to the depth of the quantificator it is bound
  function bind_free_vars(term, ini_nam, ini_dep) {
    return (function go(term, dep) {
      switch (term.ctor) {
        case "Var":
          if (term.indx < dep){
            return Var(term.indx, term.locs);
          } else {
            var name = find(ini_nam, (x,i) => dep + i === term.indx);
            var name = name ? name.value : "?";
            return Ref(name+"#"+(ini_dep+dep-term.indx-1));
          }
        case "Ref":
          return Ref(term.name, term.locs);
        case "Typ":
          return Typ();
        case "All":
          var eras = term.eras;
          var self = term.self;
          var name = term.name;
          var bind = go(term.bind, dep+1);
          var body = go(term.body, dep+2);
          var locs = term.locs;
          return All(eras, self, name, bind, body, locs);
        case "Lam":
          var eras = term.eras;
          var name = term.name;
          var body = go(term.body, dep+1);
          var locs = term.locs;
          return Lam(eras, name, body, locs);
        case "App":
          var eras = term.eras;
          var func = go(term.func, dep);
          var argm = go(term.argm, dep);
          var locs = term.locs;
          return App(eras,func, argm, locs);
        case "Let":
          var name = term.name;
          var expr = go(term.expr, dep);
          var body = go(term.body, dep+1);
          var locs = term.locs;
          return Let(name, expr, body, locs);
        case "Ann":
          var expr = go(term.expr, dep);
          var type = go(term.type, dep);
          var done = term.done;
          var locs = term.locs;
          return Ann(done, expr, type, locs);
        default:
          return term;
      }
    })(term, 0);
  };

  // Recursively checks if two terms are congruent
  function congruent_terms(map, a, b) {
    if (is_equivalent(map, a.hash, b.hash)) {
      return true;
    } else {
      switch (a.ctor + b.ctor) {
        case "AllAll":
          return a.eras === b.eras
            && a.self === b.self
            && congruent_terms(map, a.bind, b.bind)
            && congruent_terms(map, a.body, b.body);
        case "LamLam":
          return a.eras === b.eras
            && congruent_terms(map, a.body, b.body);
          break;
        case "AppApp":
          return a.eras === b.eras
            && congruent_terms(map, a.func, b.func)
            && congruent_terms(map, a.argm, b.argm);
          break;
        case "LetLet":
          return congruent_terms(map, a.expr, b.expr)
            && congruent_terms(map, a.body, b.body);
          break;
        case "AnnAnn":
          return congruent_terms(map, a.expr, b.expr);
        default:
          return false;
      }
    }
  };

  function equal(a, b, file, nam = Nil(), dep = 0) {
    var map = {};
    var vis = [[bind_free_vars(a, nam, dep), bind_free_vars(b, nam, dep), dep]];
    var idx = 0;
    while (idx < vis.length) {
      let [a0, b0, dep] = vis[idx];
      let a1 = reduce(a0, file);
      let b1 = reduce(b0, file);
      let id = congruent_terms(map, a1, b1);
      equate(map, a0.hash, a1.hash);
      equate(map, b0.hash, b1.hash);
      equate(map, a1.hash, b1.hash);
      if (!id) {
        switch (a1.ctor + b1.ctor) {
          case "AllAll":
            if (a1.eras !== b1.eras) return [false,a1,b1];
            if (a1.self !== b1.self) return [false,a1,b1];
            var a_bind = subst(a1.bind, Ref(a1.self+"#"+(dep+0)), 0);
            var b_bind = subst(b1.bind, Ref(a1.self+"#"+(dep+0)), 0);
            var a_body = subst(a1.body, Ref(a1.name+"#"+(dep+1)), 1);
            var a_body = subst(a_body, Ref(a1.self+"#"+(dep+0)), 0);
            var b_body = subst(b1.body, Ref(a1.name+"#"+(dep+1)), 1);
            var b_body = subst(b_body, Ref(a1.self+"#"+(dep+0)), 0);
            vis.push([a_bind, b_bind, dep+1]);
            vis.push([a_body, b_body, dep+2]);
            break;
          case "LamLam":
            if (a1.eras !== b1.eras) return [false,a1,b1];
            var a_body = subst(a1.body, Ref(a1.name+"#"+(dep+0)), 0);
            var b_body = subst(b1.body, Ref(a1.name+"#"+(dep+0)), 0);
            vis.push([a_body, b_body, dep+1]);
            break;
          case "AppApp":
            if (a1.eras !== b1.eras) return [false,a1,b1];
            vis.push([a1.func, b1.func, dep]);
            vis.push([a1.argm, b1.argm, dep]);
            break;
          case "LetLet":
            var a_body = subst(a1.body, Ref("#" + (dep+0)), 0);
            var b_body = subst(b1.body, Ref("#" + (dep+0)), 0);
            vis.push([a1.expr, b1.expr, dep]);
            vis.push([a_body, b_body, dep+1]);
            break;
          case "AnnAnn":
            vis.push([a1.expr, b1.expr, dep]);
            break;
          default:
            return [false,a1,b1];
        }
      };
      idx += 1;
    };
    return [true,a,b];
  };

  // Errors
  // ======

  function Err(loc, ctx, nam, msg) {
    return {
      loc: loc,
      ctx: ctx,
      nam: nam,
      msg: msg,
    };
  };

  function highlight_code(code, from, to) {
    var lines = [""];
    var from_line = 0;
    var to_line = Infinity;
    var err_line = null;
    lines.push("\x1b[2m     1| \x1b[0m");
    for (var i = 0; i < code.length + 1; ++i) {
      if (code[i] === "\n") {
        var line_num_str = ("      "+(lines.length)).slice(-6);
        lines.push("\x1b[2m" + line_num_str + "| \x1b[0m");
      } else {
        var chr = code[i] || "<eof>";
        if (from <= i && i < to) {
          if (err_line === null) {
            err_line = lines.length - 1;
          }
          var chr = "\x1b[4m\x1b[31m" + chr + "\x1b[0m";
        } else {
          var chr = "\x1b[2m" + chr + "\x1b[0m";
        }
        lines[lines.length - 1] += chr;
      };
      if (i === from) {
        from_line = lines.length - 1;
      };
      if (i === to) {
        to_line = lines.length - 1;
      };
    };
    from_line = Math.max(from_line - 4, 0);
    to_line = Math.min(to_line + 3, lines.length - 1);
    err_line = err_line || (lines.length - 2);
    var err = "On line " + err_line + ":\n";
    var err = err + lines.slice(from_line, to_line).join("\n");
    return err;
  };

  function stringify_err(err, code) {
    var lines = code.split("\n");
    var index = 0;
    var str = "";
    str += err.msg+"\n";
    if (err.ctx.ctor !== "Nil") {
      str += "With context:\n";
      str += "\x1b[2m"+stringify_ctx(err.ctx, err.nam)+"\x1b[0m";
    };
    if (err.loc) {
      str += highlight_code(code, err.loc.from, err.loc.to);
    };
    return str;
  };

  // Type-Checking
  // =============

  function typeinfer(term, file, ctx = Nil(), nam = Nil()) {
    switch (term.ctor) {
      case "Var":
        var got = find(ctx, (x,i) => i === term.indx);
        if (got) {
          return shift(got.value, got.index + 1, 0);
        } else {
          throw Err(term.locs, ctx, nam, "Unbound variable.");
        }
      case "Ref":
        var got = file[term.name];
        if (got) {
          return got.type;
        } else {
          throw Err(term.locs, ctx, nam, "Undefined reference '" + term.name + "'.");
        }
      case "Typ":
        return Typ();
      case "App":
        var func_typ = reduce(typeinfer(term.func, file, ctx, nam), file);
        switch (func_typ.ctor) {
          case "All":
            var expe_typ = subst(func_typ.bind, term.func, 0);
            typecheck(term.argm, expe_typ, file, ctx, nam);
            var term_typ = func_typ.body;
            var term_typ = subst(term_typ, shift(term.func, 1, 0), 1);
            var term_typ = subst(term_typ, shift(term.argm, 0, 0), 0);
            if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
              throw Err(term.locs, ctx, nam, "Mismatched erasure.");
            };
            return term_typ;
          default:
            throw Err(term.locs, ctx, nam, "Non-function application.");
        };
      case "Let":
        var expr_typ = typeinfer(term.expr, file, ctx, nam);
        var body_nam = Ext(term.name, nam);
        var body_ctx = Ext(expr_typ, ctx);
        var body_typ = typeinfer(term.body, file, body_ctx, body_nam);
        return subst(body_typ, term.expr, 0);
      case "All":
        var self_typ = Ann(true, term, Typ());
        var bind_ctx = Ext(self_typ, ctx);
        var bind_nam = Ext(term.self, nam);
        var bind_typ = typecheck(term.bind, Typ(), file, bind_ctx, bind_nam);
        var body_ctx = Ext(term.bind, Ext(self_typ, ctx));
        var body_nam = Ext(term.name, Ext(term.self, nam));
        typecheck(term.body, Typ(), file, body_ctx, body_nam);
        return Typ();
      case "Ann":
        if (term.done) {
          return term.type;
        } else {
          return typecheck(term.expr, term.type, file, ctx, nam);
        }
    }
    throw Err(term.locs, ctx, nam, "Can't infer type.");
  };

  function typecheck(term, type, file, ctx = Nil(), nam = Nil(), code) {
    var typv = reduce(type, file);
    switch (term.ctor) {
      case "Lam":
        if (typv.ctor === "All") {
          var self_typ = Ann(true, typv, Typ());
          var bind_typ = subst(typv.bind, term, 0);
          var body_typ = subst(typv.body, shift(term, 1, 0), 1);
          var body_nam = Ext(term.name, nam);
          var body_ctx = Ext(bind_typ, ctx);
          if (term.eras !== typv.eras) {
            throw Err(term.locs, ctx, nam, "Type mismatch.");
          };
          typecheck(term.body, body_typ, file, body_ctx, body_nam);
        } else {
          throw Err(term.locs, ctx, nam, "Lambda has a non-function type.");
        }
        break;
      default:
        var infr = typeinfer(term, file, ctx, nam);
        var [eq, type1, infr1] = equal(type, infr, file, nam, ctx.length);
        if (!eq) {
          var type1_str = stringify_term(normalize(type1, {}), nam);
          var infr1_str = stringify_term(normalize(infr1, {}), nam);
          var type0_str = stringify_term(normalize(type, {}), nam);
          var infr0_str = stringify_term(normalize(infr, {}), nam);
          throw Err(term.locs, ctx, nam,
            "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
            "Instead of... \x1b[2m"+type0_str+"\x1b[0m\n" +
            "Reduced to... \x1b[2m"+infr1_str+"\x1b[0m\n" +
            "Instead of... \x1b[2m"+type1_str+"\x1b[0m");
        }
        break;
    };
    return type;
  };

  // Hashing
  // =======

  // This implements murmurhash 64-bit finalizer on JavaScript. Since JavaScript
  // doesn't have 64-bit uint, we must implemement it on top of 32-bit uints.

  function mul64(m, n) {
    const ms = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    const ns = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    const os = [0x0, 0x0, 0x0, 0x0];
    os[3] += ms[3] * ns[3];
    os[2] += os[3] >>> 16;
    os[3] &= 0xffff;
    os[2] += ms[2] * ns[3];
    os[1] += os[2] >>> 16;
    os[2] &= 0xffff;
    os[2] += ms[3] * ns[2];
    os[1] += os[2] >>> 16;
    os[2] &= 0xffff;
    os[1] += ms[1] * ns[3];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[1] += ms[2] * ns[2];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[1] += ms[3] * ns[1];
    os[0] += os[1] >>> 16;
    os[1] &= 0xffff;
    os[0] += (ms[0] * ns[3]) + (ms[1] * ns[2]) + (ms[2] * ns[1]) + (ms[3] * ns[0]);
    os[0] &= 0xffff;
    return [(os[0] << 16) | os[1], (os[2] << 16) | os[3]];
  }

  function xor64(a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1]];
  }

  function mix64(h) {
    h = xor64(h, [0x0, h[0] >>> 1]);
    h = mul64(h, [0xff51afd7, 0xed558ccd]);
    h = xor64(h, [0x0, h[0] >>> 1]);
    h = mul64(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = xor64(h, [0x0, h[0] >>> 1]);
    h = [h[0] >>> 0, h[1] >>> 0];
    return h;
  }

  function hash_two(a, b) {
    return mix64([a, b])[0];
  };

  function hash_str(a) {
    var hash = 0;
    for (var i = 0; i < a.length; ++i) {
      hash = hash_two(hash, a.charCodeAt(i));
    };
    return hash;
  };

  return {
    Var,
    Ref,
    Typ,
    All,
    Lam,
    App,
    Let,
    Ann,
    Ext,
    Nil,
    is_space,
    is_name,
    first_valid,
    drop_while,
    drop_spaces,
    drop_comment,
    next,
    parse_txt,
    parse_chr,
    parse_str,
    parse_nam,
    parse_par,
    parse_all,
    parse_lam,
    parse_typ,
    parse_var,
    parse_app,
    parse_pip,
    parse_ann,
    parse_term,
    parse_defs,
    stringify_chr,
    stringify_str,
    stringify_term,
    stringify_file,
    stringify_ctx,
    find,
    shift,
    subst,
    to_high_order,
    to_low_order,
    reduce_high_order,
    normalize_high_order,
    reduce,
    normalize,
    Err,
    stringify_err,
    typeinfer,
    typecheck,
    equal,
    mul64,
    xor64,
    mix64,
    hash_str,
    hash_two,
  };
})();

function to_old(term, dep = 0) {
  switch (term.ctor) {
    case "Var":
      return old.Var(dep - term.indx - 1);
    case "Ref":
      return old.Ref(term.name);
    case "Typ":
      return old.Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = to_old(term.bind, dep + 1);
      var body = to_old(term.body(fmc.Var(dep), fmc.Var(dep+1)), dep + 2);
      var locs = term.locs;
      return old.All(eras, self, name, bind, body, locs);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = to_old(term.body(fmc.Var(dep)), dep + 1);
      var locs = term.locs;
      return old.Lam(eras, name, body, locs);
    case "App":
      var eras = term.eras;
      var func = to_old(term.func, dep);
      var argm = to_old(term.argm, dep);
      var locs = term.locs;
      return old.App(eras, func, argm, locs);
    case "Let":
      var name = term.name;
      var expr = to_old(term.expr, dep);
      var body = to_old(term.body(fmc.Var(dep)), dep + 1);
      var locs = term.locs;
      return old.Let(name, expr, body, locs);
    case "Ann":
      var expr = to_old(term.expr, dep);
      var type = to_old(term.type, dep);
      var done = term.done;
      var locs = term.locs;
      return old.Ann(done, expr, type, locs);
    case "Loc":
      return to_old(term.expr, dep);
  };
};

// Dirty optimization to avoid calling `equal` sometimes. This offers a small
// speed-up because `equal` calls `bind_free_vars` and `reduce` before starting,
// which requires a `O(N)` pass on the term. This isn't slow, but it accumulates
// because the compiler must call `equal` many times to detect primitive vals.
// This wouldn't be necessary if `equal` accepted terms on the format it uses
// internally. Might be improved in a future.
function equal(a, b, file) {
  while (a.ctor === "Ref") a = file[a.name].term;
  while (b.ctor === "Ref") b = file[b.name].term;
  if (a.ctor === "All" && b.ctor === "Typ") return false;
  if (a.ctor === "Typ" && b.ctor === "All") return false;
  if (a.ctor === "All" && b.ctor === "All") {
    if ((a.self || b.self) && a.self !== b.self) return false;
    if ((a.self && b.self) && a.self === b.self) return true;
  };
  return old.equal(a, b, file)[0];
};

module.exports = {
  // JavaScript compiler
  js: function(new_format_file, main) {
    var file = {};
    for (var name in new_format_file) {
      file[name] = {};
      file[name].term = to_old(new_format_file[name].term);
      file[name].type = to_old(new_format_file[name].type);
      file[name].meta = new_format_file[name].meta;
    };
    
    function make_name(str) {
      return "$" + str.replace(/\./g,"$");
    };

    var prim_types = {
      Unit: {
        inst: "x=>x(1)",
        elim: "x=>v=>v",
      },
      Bool: {
        inst: "x=>x(true)(false)",
        elim: "x=>t=>f=>x?t:f",
      },
      Nat: {
        inst: "x=>x(0n)(p=>1n+p)",
        elim: "x=>z=>s=>x===0n?z:s(x-1n)",
      },
      Bits: {
        inst: "x=>x('')(p=>p+'0')(p=>p+'1')",
        elim: "x=>be=>b0=>b1=>(x.length?(x[x.length-1]==='0'?b0(x.slice(0,-1)):b1(x.slice(0,-1))):be)",
      },
      U16: {
        inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===16?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
      },
      U32: {
        inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===32?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
      },
      U64: {
        inst: "x=>x(w=>(function R(x,k){return x(0n)(p=>R(p,k*2n))(p=>k+R(p,k*2n))})(w,1n))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===64n?we:((x>>i)&1n?w1:w0)(R(i+1n))})(0n))",
      },
      F64: {
        inst: "x=>x(w=>(function R(x,i){return x(0)(p=>R(p,i+1))(p=>F64_set(R(p,i+1),i))})(w,0))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===64?we:(F64_get(x,i)?w1:w0)(R(i+1))})(0))",
      },
      String: {
        inst: "x=>x('')(h=>t=>String.fromCharCode(h)+t)",
        elim: "x=>n=>c=>x===''?n:c(x.charCodeAt(0))(x.slice(1))",
      },
    };

    var prim_funcs = {
      "Bool.not"    : "a=>!a",
      "Bool.and"    : "a=>b=>a&&b",
      "Bool.if"     : "x=>ct=>cf=>x?ct:cf",
      "Bool.or"     : "a=>b=>a||b",
      "Debug.log"   : "a=>b=>(console.log(a),b())",
      "Nat.add"     : "a=>b=>a+b",
      "Nat.sub"     : "a=>b=>a-b<=0n?0n:a-b",
      "Nat.mul"     : "a=>b=>a*b",
      "Nat.div"     : "a=>b=>a/b",
      "Nat.div_mod" : "a=>b=>t=>t(a/b)(a%b)",
      "Nat.ltn"     : "a=>b=>a<b",
      "Nat.lte"     : "a=>b=>a<=b",
      "Nat.eql"     : "a=>b=>a===b",
      "Nat.gte"     : "a=>b=>a>=b",
      "Nat.gtn"     : "a=>b=>a>b",
      "U16.add"     : "a=>b=>a+b",
      "U16.sub"     : "a=>b=>Math.max(a-b,0)",
      "U16.mul"     : "a=>b=>a*b",
      "U16.div"     : "a=>b=>(a/b)>>>0",
      "U16.mod"     : "a=>b=>a%b",
      "U16.pow"     : "a=>b=>(a**b)&0xFFFF",
      "U16.ltn"     : "a=>b=>a<b",
      "U16.lte"     : "a=>b=>a<=b",
      "U16.eql"     : "a=>b=>a===b",
      "U16.gte"     : "a=>b=>a>=b",
      "U16.gtn"     : "a=>b=>a>b",
      "U16.shr"     : "a=>b=>a>>>b",
      "U16.shl"     : "a=>b=>a<<b",
      "U16.and"     : "a=>b=>a&b",
      "U16.or"      : "a=>b=>a|b",
      "U16.xor"     : "a=>b=>a^b",
      "U32.add"     : "a=>b=>a+b",
      "U32.sub"     : "a=>b=>Math.max(a-b,0)",
      "U32.mul"     : "a=>b=>a*b",
      "U32.div"     : "a=>b=>(a/b)>>>0",
      "U32.mod"     : "a=>b=>a%b",
      "U32.pow"     : "a=>b=>(a**b)>>>0",
      "U32.ltn"     : "a=>b=>a<b",
      "U32.lte"     : "a=>b=>a<=b",
      "U32.eql"     : "a=>b=>a===b",
      "U32.gte"     : "a=>b=>a>=b",
      "U32.gtn"     : "a=>b=>a>b",
      "U32.shr"     : "a=>b=>a>>>b",
      "U32.shl"     : "a=>b=>a<<b",
      "U32.and"     : "a=>b=>a&b",
      "U32.or"      : "a=>b=>a|b",
      "U32.xor"     : "a=>b=>a^b",
      "U64.add"     : "a=>b=>(a+b)&0xFFFFFFFFFFFFFFFFn",
      "U64.sub"     : "a=>b=>a-b<=0n?0n:a-b",
      "U64.mul"     : "a=>b=>(a*b)&0xFFFFFFFFFFFFFFFFn",
      "U64.div"     : "a=>b=>a/b",
      "U64.mod"     : "a=>b=>a%b",
      "U64.pow"     : "a=>b=>(a**b)&0xFFFFFFFFFFFFFFFFn",
      "U64.ltn"     : "a=>b=>(a<b)",
      "U64.lte"     : "a=>b=>(a<=b)",
      "U64.eql"     : "a=>b=>(a===b)",
      "U64.gte"     : "a=>b=>(a>=b)",
      "U64.gtn"     : "a=>b=>(a>b)",
      "U64.shr"     : "a=>b=>(a>>b)&0xFFFFFFFFFFFFFFFFn",
      "U64.shl"     : "a=>b=>(a<<b)&0xFFFFFFFFFFFFFFFFn",
      "U64.and"     : "a=>b=>a&b",
      "U64.or"      : "a=>b=>a|b",
      "U64.xor"     : "a=>b=>a^b",
      "F64.add"     : "a=>b=>a+b",
      "F64.sub"     : "a=>b=>a-b",
      "F64.mul"     : "a=>b=>a*b",
      "F64.div"     : "a=>b=>a/b",
      "F64.mod"     : "a=>b=>a%b",
      "F64.pow"     : "a=>b=>a**b",
      "F64.log"     : "a=>Math.log(a)",
      "F64.cos"     : "a=>Math.cos(a)",
      "F64.sin"     : "a=>Math.sin(a)",
      "F64.tan"     : "a=>Math.tan(a)",
      "F64.acos"    : "a=>Math.acos(a)",
      "F64.asin"    : "a=>Math.asin(a)",
      "F64.atan"    : "a=>Math.atan(a)",
      "String.eql"  : "a=>b=>a===b",
    };

    function prim_of(type) {
      for (var prim in prim_types) {
        if (equal(type, old.Ref(prim), file)) {
          return prim;
        }
      };
      return null;
    };

    function sorted_def_names(file) {
      var seen = {};
      var refs = [];
      function go(term) {
        switch (term.ctor) {
          case "Ref":
            if (!seen[term.name]) {
              seen[term.name] = true;
              go(file[term.name].term);
              refs.push(term.name);
            }
            break;
          case "Lam":
            go(term.body);
            break;
          case "App":
            go(term.func);
            go(term.argm);
            break;
          case "Let":
            go(term.expr);
            go(term.body);
            break;
          case "Ann":
            go(term.expr);
            break;
        };
      };
      go(file[main].term);
      return refs;
    };

    function infer(term, file, ctx = Nil(), nam = Nil()) {
      //console.log("infer", stringify_term(term, nam));
      //console.log("-----");
      switch (term.ctor) {
        case "Var":
          var got_type = old.find(ctx, (x,i) => i === term.indx);
          var got_name = old.find(nam, (x,i) => i === term.indx);
          if (got_type) {
            return {
              code: make_name(got_name.value),
              type: old.shift(got_type.value, got_type.index + 1, 0),
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Unbound varible.");
          }
        case "Ref":
          var got_def = file[term.name];
          if (got_def) {
            return {
              code: make_name(term.name),
              type: got_def.type,
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Undefined reference '" + term.name + "'.");
          }
        case "Typ":
          return {
            code: "null",
            type: old.Typ(),
          };
        case "App":
          var func_cmp = infer(term.func, file, ctx, nam);
          var func_typ = old.reduce(func_cmp.type, file);
          switch (func_typ.ctor) {
            case "All":
              var expe_typ = old.subst(func_typ.bind, term.func, 0);
              var argm_cmp = check(term.argm, expe_typ, file, {}, ctx, nam);
              var term_typ = func_typ.body;
              var term_typ = old.subst(term_typ, old.shift(term.func, 1, 0), 1);
              var term_typ = old.subst(term_typ, old.shift(term.argm, 0, 0), 0);
              if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
                throw old.Err(term.locs, ctx, nam, "Mismatched erasure.");
              };
              var code = func_cmp.code;
              var func_typ_prim = prim_of(func_typ);
              if (func_typ_prim) {
                code = "elim_"+func_typ_prim.toLowerCase()+"("+code+")";
              };
              if (!term.eras) {
                code = code+"("+argm_cmp.code+")";
              }
              return {code, type: term_typ};
            default:
              throw old.Err(term.locs, ctx, nam, "Non-function application.");
          };
        case "Let":
          var expr_cmp = infer(term.expr, file, ctx, nam);
          var body_ctx = old.Ext(expr_cmp.type, ctx);
          var body_nam = old.Ext(term.name, nam);
          var body_cmp = infer(term.body, file, body_ctx, body_nam);
          return {
            code: "("+make_name(term.name)+"=>"+body_cmp.code+")("+expr_cmp.code+")",
            type: old.subst(body_cmp.type, term.expr, 0),
          };
        case "All":
          var self_typ = old.Ann(true, term, old.Typ());
          var bind_ctx = old.Ext(self_typ, ctx);
          var bind_nam = old.Ext(term.self, nam);
          var bind_cmp = check(term.bind, old.Typ(), file, {}, bind_ctx, bind_nam);
          var body_ctx = old.Ext(term.bind, old.Ext(self_typ, ctx));
          var body_nam = old.Ext(term.name, old.Ext(term.self, nam));
          var body_cmp = check(term.body, old.Typ(), file, {}, body_ctx, body_nam);
          return {
            code: "null",
            type: old.Typ(),
          };
        case "Ann":
          var chr_lit = old.stringify_chr(term.expr);
          var str_lit = old.stringify_str(term.expr);
          if (chr_lit) {
            var code = chr_lit.charCodeAt(0);
            var type = old.Ref("Char");
            return {code, type};
          } else if (str_lit) {
            var code = '`' + str_lit + '`';
            var type = old.Ref("String");
            return {code, type};
          } else {
            return check(term.expr, term.type, file, {}, ctx, nam);
          };
      }
      throw old.Err(term.locs, ctx, nam, "Can't infer type.");
    };

    function check(term, type, file, met = {}, ctx = old.Nil(), nam = old.Nil()) {

      if (equal(type, old.Typ(), file)) {
        var code = "(void 0)";
        var type = old.Typ();
        return {code, type};
      };

      var typv = old.reduce(type, file);
      var code = null;
      switch (term.ctor) {
        case "Lam":
          if (typv.ctor === "All") {
            var self_typ = old.Ann(true, typv, old.Typ());
            var bind_typ = old.subst(typv.bind, term, 0);
            var body_typ = old.subst(typv.body, old.shift(term, 1, 0), 1);
            var body_nam = old.Ext(term.name, nam);
            var body_ctx = old.Ext(bind_typ, ctx);
            if (term.eras !== typv.eras) {
              throw old.Err(term.locs, ctx, nam, "Type mismatch.");
            };
            var body_met = {...met, vars: met.vars && (term.eras ? met.vars : met.vars.concat(term.name))};
            var body_cmp = check(term.body, body_typ, file, body_met, body_ctx, body_nam);
            if (term.eras) {
              code = body_cmp.code;
            } else {
              code = "("+make_name(term.name)+"=>"+body_cmp.code+")";
            }
            var type_prim = prim_of(type);
            if (type_prim) {
              code = "inst_"+type_prim.toLowerCase()+"("+code+")";
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Lambda has a non-function type.");
          }
          break;
        default:
          var term_cmp = infer(term, file, ctx, nam);
          //if (!equal(type, term_cmp.type, file)) {
            //var type_str = old.stringify_term(old.normalize(type, {}), nam);
            //var tcmp_str = old.stringify_term(old.normalize(term_cmp.type, {}), nam);
            //throw old.Err(term.locs, ctx, nam,
              //"Found type... \x1b[2m"+tcmp_str+"\x1b[0m\n" +
              //"Instead of... \x1b[2m"+type_str+"\x1b[0m");
          //}
          var code = term_cmp.code;

          // Tail-call Optimization
          if (met && met.loop) {
            var opt_code = "";
            opt_code += "{";
            opt_code += "var "+make_name(met.name)+"=";
            opt_code += met.vars.map(v => make_name(v)+"=>").join("");
            opt_code += "({ctr:'TCO',arg:["+met.vars.map(make_name).join(",")+"]});";
            opt_code += "while(true){";
            opt_code += "var R="+code+";";
            //tco_code += "console.log(R);";
            opt_code += "if(R.ctr==='TCO')["+met.vars.map(make_name).join(",")+"]=R.arg;";
            opt_code += "else return R;";
            opt_code += "}}";
            code = opt_code;
          };
      };
      return {code, type};
    };

    for (var prim in prim_types) {
      if (!file[prim] || !file[prim].meta.prim) {
        delete prim_types[prim];
      }
    };

    for (var prim in prim_funcs) {
      if (!file[prim] || !file[prim].meta.prim) {
        delete prim_funcs[prim];
      }
    };

    var isio = equal(file[main].type, old.App(false, old.Ref("IO"), old.Ref("Unit")), file);
    var defs = sorted_def_names(file).concat(main);
    var code = "";
    code += "module.exports = (function (){\n";
    code += "  var F64 = new Float64Array(1);\n";
    code += "  var U32 = new Uint32Array(F64.buffer);\n";
    code += "  var F64_get = (x,i)=>((F64[0]=x),(i<32?(U32[0]>>>i)&1:(U32[1]>>>(i-32)&1)));\n";
    code += "  var F64_set = (x,i)=>((F64[0]=x),(i<32?(U32[0]=U32[0]|(1<<i)):(U32[1]=U32[1]|(1<<(i-32)))),F64[0]);\n";
    for (var prim in prim_types) {
      code += "  var inst_"+prim.toLowerCase()+" = "+prim_types[prim].inst + ";\n";
      code += "  var elim_"+prim.toLowerCase()+" = "+prim_types[prim].elim + ";\n";
    };
    if (isio) {
      code += "  var rdl = require('readline').createInterface({input:process.stdin,output:process.stdout});\n";
      code += "  var run = (p) => {\n";
      code += "    var case_end = (val) => Promise.resolve(val);\n";
      code += "    var case_log = (str) => (nxt) => new Promise((res,_) => (console.log(str), run(nxt(1)).then(res)));\n";
      code += "    var case_inp = (nxt) => new Promise((res,_) => rdl.question('', (line) => run(nxt(line)).then(res)));\n";
      code += "    return p(case_end)(case_log)(case_inp);\n";
      code += "  };\n";
    }
    var exps = [];
    compile_def: for (var name of defs) {
      var meta = {...file[name].meta, name, vars: []};
      var expr = null;
      // Compiles primitives operations
      for (var prim in prim_types) {
        if (prim === name) {
          continue compile_def;
        }
      };
      for (var prim in prim_funcs) {
        if (prim === name) {
          expr = prim_funcs[prim];
        };
      };
      if (!expr) {
        try {
          var comp = check(file[name].term, file[name].type, file, meta);
          if (equal(comp.type, old.Typ(), file)) {
            continue;
          } else {
            expr = comp.code;
          }
        } catch (e) {
          expr = "'ERROR'";
        };
      };
      code += "  var "+make_name(name)+" = "+expr+";\n";
      exps.push(name);
    };
    code += "  return {\n";
    if (isio) {
      code += "    '$main$': ()=>run("+make_name(main)+"),\n"
    };
    for (var name of exps) {
      code += "    '"+name+"': "+make_name(name)+",\n";
    };
    code += "  };\n";
    code += "})();";
    if (isio) {
      code += "\nmodule.exports['$main$']().then(() => process.exit());";
    } else {
      code += "\nconsole.log(module.exports['"+main+"']);";
    };
    return code;
  },

  // Haskell compiler
  hs: function(new_format_file, main) {
    var file = {};
    for (var name in new_format_file) {
      file[name] = {};
      file[name].term = to_old(new_format_file[name].term);
      file[name].type = to_old(new_format_file[name].type);
      file[name].meta = new_format_file[name].meta;
    };

    function make_name(str) {
      return "_" + str.replace(/\./g,"_");
    };

    var prim_types = {
      Unit: {
        inst: "(\\x->())",
        elim: "(\\x->(\\t->t))",
      },
      Bool: {
        inst: "(\\x->((x$True)$False))",
        elim: "(\\x->(\\t->(\\f->(if x then t else f))))",
      },
      Nat: {
        inst: "\\x->(((x$0)$(\\p->1+p)) :: Integer)",
        elim: "(\\x->(\\z->(\\s->(if x == 0 then z else s$(x-1)))))",
      },
      U32: {
        inst: "\\x->(x$(\\w->let r x k = (((x$0)$(\\p->r p (k*2)))$(\\p->k+(r p (k*2)))) in r w 1)) :: Word32",
        elim: "(\\x->(\\u->(u$(let r i = unsafeCoerce (\\we->(\\w0->(\\w1->(if i == 32 then we else ((case ((shiftR x i) .&. 1) :: Word32 of { 0 -> w0; 1 -> w1 })$(r (i + 1))))))) in (r 0)))))",
      },
      U16: {
        inst: "\\x->(x$(\\w->let r x k = (((x$0)$(\\p->r p (k*2)))$(\\p->k+(r p (k*2)))) in r w 1)) :: Word16",
        elim: "(\\x->(\\u->(u$(let r i = unsafeCoerce (\\we->(\\w0->(\\w1->(if i == 16 then we else ((case ((shiftR x i) .&. 1) :: Word16 of { 0 -> w0; 1 -> w1 })$(r (i + 1))))))) in (r 0)))))",
      },
      String: {
        inst: "(\\x->((x$[])$(\\h->(\\t->(toEnum (fromIntegral h) :: Char):t))) :: String)",
        elim: "(\\x->(\\n->(\\c->(case (x::String) of {[]->n;(h:t)->c (fromIntegral(fromEnum h)::Word16)t}))))",
      },
    };

    var prim_funcs = {
      "Nat.add"     : "(\\a->(\\b->((a+b)::Integer)))",
      "Nat.sub"     : "(\\a->(\\b->((max (a-b) 0)::Integer)))",
      "Nat.mul"     : "(\\a->(\\b->((a*b)::Integer)))",
      "Nat.div"     : "(\\a->(\\b->((a `div` b)::Integer)))",
      "Nat.mod"     : "(\\a->(\\b->((a `mod` b)::Integer)))",
      "Nat.div_mod" : "(\\a->(\\b->(\\t->((t$((a `div` b) :: Integer))$((a `mod` b) ::Integer)))))",
      "Nat.ltn"     : "(\\a->(\\b->((a<b)::Integer)))",
      "Nat.lte"     : "(\\a->(\\b->((a<=b)::Integer)))",
      "Nat.eql"     : "(\\a->(\\b->((a==b)::Integer)))",
      "Nat.gte"     : "(\\a->(\\b->((a>=b)::Integer)))",
      "Nat.gtn"     : "(\\a->(\\b->((a>b)::Integer)))",
      "U32.add"     : "(\\a->(\\b->(a+b)::Word32))",
      "U32.sub"     : "(\\a->(\\b->(a-b)::Word32))",
      "U32.mul"     : "(\\a->(\\b->(a*b)::Word32))",
      "U32.ltn"     : "(\\a->(\\b->(a<b)::Word32))",
      "U32.lte"     : "(\\a->(\\b->(a<=b)::Word32))",
      "U32.eql"     : "(\\a->(\\b->(a==b)::Word32))",
      "U32.gte"     : "(\\a->(\\b->(a>=b)::Word32))",
      "U32.gtn"     : "(\\a->(\\b->(a>b)::Word32))",
      "U16.add"     : "(\\a->(\\b->(a+b)::Word16))",
      "U16.sub"     : "(\\a->(\\b->(a-b)::Word16))",
      "U16.mul"     : "(\\a->(\\b->(a*b)::Word16))",
      "U16.ltn"     : "(\\a->(\\b->(a<b)::Word16))",
      "U16.lte"     : "(\\a->(\\b->(a<=b)::Word16))",
      "U16.eql"     : "(\\a->(\\b->(a==b)::Word16))",
      "U16.gte"     : "(\\a->(\\b->(a>=b)::Word16))",
      "U16.gtn"     : "(\\a->(\\b->(a>b)::Word16))",
      "Bool.not"    : "(\\a->((not a)::Bool))",
      "Bool.and"    : "(\\a->(\\b->((a&&b)::Bool)))",
      "Bool.or"     : "(\\a->(\\b->((a||b)::Bool)))",
      "String.eql"  : "(\\a->(\\b->((a==b)::String)))",
    };

    function prim_of(type) {
      for (var prim in prim_types) {
        if (equal(type, old.Ref(prim), file)) {
          return prim;
        }
      };
      return null;
    };

    function sorted_def_names(file) {
      var seen = {};
      var refs = [];
      function go(term) {
        switch (term.ctor) {
          case "Ref":
            if (!seen[term.name]) {
              seen[term.name] = true;
              go(file[term.name].term);
              refs.push(term.name);
            }
            break;
          case "Lam":
            go(term.body);
            break;
          case "App":
            go(term.func);
            go(term.argm);
            break;
          case "Let":
            go(term.expr);
            go(term.body);
            break;
          case "Ann":
            go(term.expr);
            break;
        };
      };
      go(file[main].term);
      return refs;
    };

    function infer(term, file, ctx = Nil(), nam = Nil()) {
      //console.log("infer", stringify_term(term, nam));
      //console.log("-----");
      switch (term.ctor) {
        case "Var":
          var got_type = old.find(ctx, (x,i) => i === term.indx);
          var got_name = old.find(nam, (x,i) => i === term.indx);
          if (got_type) {
            return {
              code: make_name(got_name.value),
              type: old.shift(got_type.value, got_type.index + 1, 0),
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Unbound varible.");
          }
        case "Ref":
          var got_def = file[term.name];
          if (got_def) {
            return {
              code: make_name(term.name),
              type: got_def.type,
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Undefined reference '" + term.name + "'.");
          }
        case "Typ":
          return {
            code: "null",
            type: old.Typ(),
          };
        case "App":
          var func_cmp = infer(term.func, file, ctx, nam);
          var func_typ = old.reduce(func_cmp.type, file);
          switch (func_typ.ctor) {
            case "All":
              var expe_typ = old.subst(func_typ.bind, term.func, 0);
              var argm_cmp = check(term.argm, expe_typ, file, {}, ctx, nam);
              var term_typ = func_typ.body;
              var term_typ = old.subst(term_typ, old.shift(term.func, 1, 0), 1);
              var term_typ = old.subst(term_typ, old.shift(term.argm, 0, 0), 0);
              if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
                throw old.Err(term.locs, ctx, nam, "Mismatched erasure.");
              };
              var code = func_cmp.code;
              var func_typ_prim = prim_of(func_typ);
              if (func_typ_prim) {
                code = "elim_"+func_typ_prim.toLowerCase()+"("+code+")";
              };
              if (!term.eras) {
                code = "("+code+"$"+argm_cmp.code+")";
              }
              return {code, type: term_typ};
            default:
              throw old.Err(term.locs, ctx, nam, "Non-function application.");
          };
        case "Let":
          var expr_cmp = infer(term.expr, file, ctx, nam);
          var body_ctx = old.Ext(expr_cmp.type, ctx);
          var body_nam = old.Ext(term.name, nam);
          var body_cmp = infer(term.body, file, body_ctx, body_nam);
          return {
            code: "(\\"+make_name(term.name)+"->"+body_cmp.code+")("+expr_cmp.code+")",
            type: old.subst(body_cmp.type, term.expr, 0),
          };
        case "All":
          var self_typ = old.Ann(true, term, old.Typ());
          var bind_ctx = old.Ext(self_typ, ctx);
          var bind_nam = old.Ext(term.self, nam);
          var bind_cmp = check(term.bind, old.Typ(), file, {}, bind_ctx, bind_nam);
          var body_ctx = old.Ext(term.bind, old.Ext(self_typ, ctx));
          var body_nam = old.Ext(term.name, old.Ext(term.self, nam));
          var body_cmp = check(term.body, old.Typ(), file, {}, body_ctx, body_nam);
          return {
            code: "()",
            type: old.Typ(),
          };
        case "Ann":
          var chr_lit = old.stringify_chr(term.expr);
          var str_lit = old.stringify_str(term.expr);
          if (chr_lit) {
            var code = ("("+chr_lit.charCodeAt(0)+"::Word16)");
            var type = old.Ref("Char");
            return {code, type};
          } else if (str_lit) {
            var code = '"'+str_lit+'"';
            var type = old.Ref("String");
            return {code, type};
          } else {
            return check(term.expr, term.type, file, {}, ctx, nam);
          };

          try {
            var code = '"' + old.stringify_lit(term.expr) + '"';
            var type = old.Ref("String");
            return {code, type};
          } catch (e) {
            return check(term.expr, term.type, file, {}, ctx, nam);
          };
      }
      throw old.Err(term.locs, ctx, nam, "Can't infer type.");
    };

    function check(term, type, file, met = {}, ctx = old.Nil(), nam = old.Nil()) {

      if (equal(type, old.Typ(), file)) {
        var code = "()";
        var type = old.Typ();
        return {code, type};
      };

      //console.log("check", stringify_term(term, nam));
      //console.log("typed", stringify_term(type, nam));
      //console.log("-----");
      var typv = old.reduce(type, file);
      var code = null;
      switch (term.ctor) {
        case "Lam":
          if (typv.ctor === "All") {
            var self_typ = old.Ann(true, typv, old.Typ());
            var bind_typ = old.subst(typv.bind, term, 0);
            var body_typ = old.subst(typv.body, old.shift(term, 1, 0), 1);
            var body_nam = old.Ext(term.name, nam);
            var body_ctx = old.Ext(bind_typ, ctx);
            if (term.eras !== typv.eras) {
              throw old.Err(term.locs, ctx, nam, "Type mismatch.");
            };
            var body_met = {...met, vars: met.vars && met.vars.concat(term.name)};
            var body_cmp = check(term.body, body_typ, file, body_met, body_ctx, body_nam);
            if (term.eras) {
              code = body_cmp.code;
            } else {
              code = "(\\"+make_name(term.name)+"->"+body_cmp.code+")";
            }
            var type_prim = prim_of(type);
            if (type_prim) {
              code = "(inst_"+type_prim.toLowerCase()+"$"+code+")";
            };
          } else {
            throw old.Err(term.locs, ctx, nam, "Lambda has a non-function type.");
          }
          break;
        default:
          var term_cmp = infer(term, file, ctx, nam);
          if (!equal(type, term_cmp.type, file)) {
            var type_str = old.stringify_term(old.normalize(type, {}), nam);
            var tcmp_str = old.stringify_term(old.normalize(term_cmp.type, {}), nam);
            throw old.Err(term.locs, ctx, nam,
              "Found type... \x1b[2m"+tcmp_str+"\x1b[0m\n" +
              "Instead of... \x1b[2m"+type_str+"\x1b[0m");
          }
          var code = term_cmp.code;

          // Tail-call Optimization
          //if (met && met.loop) {
            //var opt_code = "";
            //opt_code += "{";
            //opt_code += "var "+make_name(met.name)+"=";
            //opt_code += met.vars.map(v => make_name(v)+"=>").join("");
            //opt_code += "({ctr:'TCO',arg:["+met.vars.map(make_name).join(",")+"]});";
            //opt_code += "while(true){";
            //opt_code += "var R="+code+";";
            ////tco_code += "console.log(R);";
            //opt_code += "if(R.ctr==='TCO')["+met.vars.map(make_name).join(",")+"]=R.arg;";
            //opt_code += "else return R;";
            //opt_code += "}}";
            //code = opt_code;
          //};
      };

      return {code, type};
    };

    for (var prim in prim_types) {
      if (!file[prim] || !file[prim].meta.prim) {
        delete prim_types[prim];
      }
    };

    for (var prim in prim_funcs) {
      if (!file[prim] || !file[prim].meta.prim) {
        delete prim_funcs[prim];
      }
    };

    var defs = sorted_def_names(file).concat(main);
    var isio = equal(file[main].type, old.App(false, old.Ref("IO"), old.Ref("Unit")), file);

    var code = "";
    code += "import Prelude hiding (($))\n";
    code += "import Unsafe.Coerce\n";
    code += "import Data.Word\n";
    code += "import Data.Bits\n";
    code += "($) = (\\a->(\\b->(unsafeCoerce (a b))))\n";
    if (isio) {
      code += "run = (\\p->\n";
      code += "  let case_end = (\\val->val) in\n";
      code += "  let case_log = (\\str->(\\nxt->(putStrLn$str)>>=(\\u->run (nxt$())))) in\n";
      code += "  let case_inp = (\\nxt->(getLine>>=(\\l->run (nxt$l)))) in\n";
      code += "  (((p$case_end)$case_log)$case_inp))\n";
    };
    for (var prim in prim_types) {
      code += "inst_"+prim.toLowerCase()+" = "+prim_types[prim].inst + "\n";
      code += "elim_"+prim.toLowerCase()+" = "+prim_types[prim].elim + "\n";
    };
    var exps = [];
    compile_def: for (var name of defs) {
      var meta = {...file[name].meta, name, vars: []};
      var expr = null;
      // Compiles primitives operations
      for (var prim in prim_types) {
        if (prim === name) {
          continue compile_def;
        }
      };
      for (var prim in prim_funcs) {
        if (prim === name) {
          expr = prim_funcs[prim];
        };
      };
      if (!expr) {
        try {
          var comp = check(file[name].term, file[name].type, file, meta);
          if (equal(comp.type, old.Typ(), file)) {
            continue;
          } else {
            expr = comp.code;
          }
        } catch (e) {
          expr = "'ERROR'";
        };
      };
      code += make_name(name)+" = "+expr+"\n";
      exps.push(name);
    };
    if (isio) {
      code += "main :: IO()\n";
      code += "main = run "+make_name(name)+"\n";
    }
    return code;
  }
};
