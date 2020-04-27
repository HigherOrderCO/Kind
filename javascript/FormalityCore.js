// Term
// ====

// precedence for ctor arguments:
// hash, eras/done, self, name, bind/type/func, body/argm/expr, indx

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
  if (bind.hash && body.hash) var hash = hash_two(4, hash_two(bind.hash, body.hash));
  return {ctor: "All", hash, eras, self, name, bind, body, locs};
};

function Lam(eras, name, body, locs = null) {
  if (body.hash) var hash = hash_two(5, body.hash);
  return {ctor: "Lam", hash, eras, name, body, locs};
};

function App(eras, func, argm, locs = null) {
  if (func.hash && argm.hash) var hash = hash_two(6, hash_two(func.hash, argm.hash));
  return {ctor: "App", hash, eras, func, argm, locs};
};

function Let(name, expr, body, locs = null) {
  if (expr.hash && body.hash) var hash = hash_two(7, hash_two(expr.hash, body.hash));
  return {ctor: "Let", hash, name, expr, body};
};

function Ann(done, expr, type, locs = null) {
  if (expr.hash && type.hash) var hash = hash_two(8, hash_two(expr.hash, type.hash));
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

// Pushes a value to the end of the list
function push(val, list) {
  switch (list.ctor) {
    case "Nil": return Ext(val, Nil());
    case "Ext": return Ext(list.head, push(val, list.tail));
  }
};

// Finds last value satisfying `cond` in a list
function find(list, cond, indx = 0, got = null) {
  switch (list.ctor) {
    case "Nil":
      return got;
    case "Ext":
      var got = cond(list.head, indx) ? {value:list.head, index:indx} : got;
      return find(list.tail, cond, indx + 1, got);
  };
};

// Parsing
// =======

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
    chain(parse_nam(code, next(code, indx), 1, false),               (indx, self) =>
    chain(parse_one(code, indx, "(", "<", false),                    (indx, eras) =>
    chain(parse_nam(code, next(code, indx), 1, false),               (indx, name) =>
    chain(parse_txt(code, next(code, indx), ":", false),             (indx, skip) =>
    chain(parse_term(code, indx, push(self, vars), err),             (indx, bind) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err),  (indx, skip) =>
    chain(parse_txt(code, next(code, indx), "->", err),              (indx, skip) =>
    chain(parse_term(code, indx, push(name, push(self, vars)), err), (indx, body) =>
    [indx, All(eras, self, name, bind, body, {from,to:indx})])))))))));
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, vars, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_one(code, next(code, indx), "(", "<", false),         (indx, eras) =>
    chain(parse_nam(code, next(code, indx), 1, false),                (indx, name) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", false), (indx, skip) =>
    chain(parse_term(code, indx, push(name, vars), err),              (indx, body) =>
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
    chain(parse_term(code, indx, push(name, vars), err),    (indx, body) =>
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
    chain(parse_term(code, indx, vars, err),             (indx, argm) =>
    chain(parse_txt(code, next(code, indx), ";", err),   (indx, skip) =>
    [indx, App(false, func, argm, {from,to:indx})]))));
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, indx, from, bind, vars, err) {
  return (
    chain(parse_txt(code, next(code, indx), "->", false),        (indx, skip) =>
    chain(parse_term(code, indx, push("", push("", vars)), err), (indx, body) =>
    [indx, All(false, "", "", bind, body, {from,to:indx})])));
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

// Parses a defs
function parse_defs(code, indx = 0) {
  var defs = {};
  function parse_defs(code, indx) {
    var indx = next(code, indx);
    if (indx === code.length) {
      return;
    } else {
      chain(parse_nam(code, next(code, indx), 0, true),                      (indx, name) =>
      chain(parse_txt(code, next(code, indx), ":", true),                    (indx, skip) =>
      chain(parse_term(code, next(code, indx), Nil(), true),                 (indx, type) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//loop//"),            (indx, loop) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//prim//"),            (indx, prim) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//data//"),            (indx, data) =>
      chain(parse_term(code, next(code, indx), Nil(), true),                 (indx, term) =>
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
          return got.value.name + "#" + term.indx;
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
        var bind = stringify_term(term.bind, push({name:self}, vars));
        var rpar = term.name === "" ? "" : (term.eras ? ">" : ")");
        var body = stringify_term(term.body, push({name:name}, push({name:self}, vars)));
        return self+lpar+name+colo+bind+rpar+" -> "+body;
      case "Lam":
        var name = term.name;
        var lpar = term.eras ? "<" : "(";
        var body = stringify_term(term.body, push({name:name}, vars));
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
        var body = stringify_term(term.body, push({name:name}, vars));
        return "let "+name+" = "+expr+"; "+body;
      case "Ann":
        var expr = stringify_term(term.expr, vars);
        var type = stringify_term(term.type, vars);
        return expr+" :: "+type;
    }
  }
};

//A : B : a : b : []

// Stringifies a context
function stringify_ctx(ctx, up_ctx = Nil()) {
  switch (ctx.ctor) {
    case "Ext":
      var name = ctx.head.name;
      //console.log(name, ctx);
      var type = stringify_term(to_low(ctx.head.type, up_ctx.length), up_ctx);
      var tail = stringify_ctx(ctx.tail, push({name}, up_ctx));
      return "- " + name + " : " + type + "\n" + tail;
    case "Nil":
      return "";
  };
};

// Stringifies all terms of a defs
function stringify_defs(mod) {
  var text = "";
  for (var name in mod) {
    var type = stringify_term(mod[name].type, Nil());
    var term = stringify_term(mod[name].term, Nil());
    text += name + " : " + type + "\n  " + term + "\n\n";
  }
  return text;
};

// Evaluation
// ==========

function to_high(term, vars = Nil()) {
  switch (term.ctor) {
    case "Var":
      var got = find(vars, (x,i) => i === term.indx);
      if (got) {
        return got.value;
      } else {
        return Var(term.indx, term.locs);
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
      var bind = s => to_high(term.bind, push(s, vars));
      var body = (s,x) => to_high(term.body, push(x, push(s, vars)));
      return All(eras, self, name, bind, body, locs);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = x => to_high(term.body, push(x, vars));
      var locs = term.locs;
      return Lam(eras, name, body, locs);
    case "App":
      var eras = term.eras;
      var func = to_high(term.func, vars);
      var argm = to_high(term.argm, vars);
      var locs = term.locs;
      return App(eras, func, argm, locs);
    case "Let":
      var name = term.name;
      var expr = to_high(term.expr, vars);
      var body = x => to_high(term.body, push(x, vars));
      var locs = term.locs;
      return Let(name, expr, body, locs);
    case "Ann":
      if (term.done) {
        return to_high(term.expr, vars);
      } else {
        var done = term.done;
        var expr = to_high(term.expr, vars);
        var type = to_high(term.type, vars);
        return Ann(done, expr, type);
      }
  }
};

function to_low(term, depth = 0) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx, term.locs);
    case "Ref":
      return Ref(term.name, term.locs);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = to_low(term.bind(Var(depth)), depth + 1);
      var body = to_low(term.body(Var(depth), Var(depth+1)), depth + 2);
      var locs = term.locs;
      return All(eras, self, name, bind, body, locs);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = to_low(term.body(Var(depth)), depth + 1);
      var locs = term.locs;
      return Lam(eras, name, body, locs);
    case "App":
      var eras = term.eras;
      var func = to_low(term.func, depth);
      var argm = to_low(term.argm, depth);
      var locs = term.locs;
      return App(eras, func, argm, locs);
    case "Let":
      var name = term.name;
      var expr = to_low(term.expr, depth);
      var body = to_low(term.body(Var(depth)), depth + 1);
      var locs = term.locs;
      return Let(name, expr, body, locs);
    case "Ann":
      if (term.done) {
        return to_low(term.expr, depth);
      } else {
        var done = term.done;
        var expr = to_low(term.expr, depth);
        var type = to_low(term.type, depth);
        return Ann(done, expr, type);
      }
  }
};

function reduce_high(term, defs) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx, term.locs);
    case "Ref":
      if (defs[term.name]) {
        return reduce_high(to_high(defs[term.name].term), defs);
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
      var eras = term.eras;
      var name = term.name;
      var body = term.body;
      var locs = term.locs;
      return Lam(eras, name, body, locs);
    case "App":
      var eras = term.eras;
      var func = reduce_high(term.func, defs);
      switch (func.ctor) {
        case "Lam":
          return reduce_high(func.body(term.argm), defs);
        default:
          return App(eras, func, reduce_high(term.argm, defs), term.locs);
      };
    case "Let":
      var name = term.name;
      var expr = term.expr;
      var body = term.body;
      var locs = term.locs;
      return reduce_high(body(expr), defs);
    case "Ann":
      return reduce_high(term.expr, defs);
  };
};

function normalize_high(term, defs) {
  var norm = reduce_high(term, defs);
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
      var bind = s => normalize_high(norm.bind(s), defs);
      var body = (s,x) => normalize_high(norm.body(s,x), defs);
      var locs = norm.locs;
      return All(eras, self, name, bind, body, locs);
    case "Lam":
      var eras = norm.eras;
      var name = norm.name;
      var body = x => normalize_high(norm.body(x), defs);
      var locs = norm.locs;
      return Lam(eras, name, body, locs);
    case "App":
      var eras = norm.eras;
      var func = normalize_high(norm.func, defs);
      var argm = normalize_high(norm.argm, defs);
      var locs = norm.locs;
      return App(eras, func, argm, locs);
    case "Let":
      var name = norm.name;
      var expr = normalize_high(norm.expr, defs);
      var body = x => normalize_high(norm.body(x), defs);
      var locs = norm.locs;
      return Let(name, expr, body, locs);
    case "Ann":
      return normalize_high(norm.expr, defs);
  };
};

function reduce(term, defs) {
  return to_low(reduce_high(to_high(term), defs));
};

function normalize(term, defs) {
  return to_low(normalize_high(to_high(term), defs));
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

// Recursively checks if two terms are congruent
function congruent_terms(map, a, b, dep = 0) {
  if (is_equivalent(map, a.hash, b.hash)) {
    return true;
  } else {
    switch (a.ctor + b.ctor) {
      case "VarVar":
        var e_indx = a.indx === b.indx;
        return e_indx;
      case "RefRef":
        var e_name = a.name === b.name;
        return e_name;
      case "TypTyp":
        return true;
      case "AllAll":
        var a_bind = a.bind(Var(dep));
        var b_bind = b.bind(Var(dep));
        var a_body = a.body(Var(dep), Var(dep+1));
        var b_body = b.body(Var(dep), Var(dep+1));
        var e_eras = a.eras === b.eras;
        var e_self = a.self === b.self;
        var e_bind = congruent_terms(map, a_bind, b_bind, dep+1);
        var e_body = congruent_terms(map, a_body, b_body, dep+2);
        return e_eras && e_self && e_bind && e_body;
      case "LamLam":
        var a_body = a.body(Var(dep));
        var b_body = b.body(Var(dep));
        var e_eras = a.eras === b.eras;
        var e_body = congruent_terms(map, a_body, b_body, dep+1);
        return e_eras && e_body;
      case "AppApp":
        var e_eras = a.eras === b.eras;
        var e_func = congruent_terms(map, a.func, b.func, dep);
        var e_argm = congruent_terms(map, a.argm, b.argm, dep);
        return e_eras && e_func && e_argm;
      case "LetLet":
        var a_body = a.body(Var(dep));
        var b_body = b.body(Var(dep));
        var e_expr = congruent_terms(map, a.expr, b.expr, dep);
        var e_body = congruent_terms(map, a_body, b_body, dep+1);
        return e_expr && e_body;
      case "AnnAnn":
        var e_expr = congruent_terms(map, a.expr, b.expr, dep);
        return e_expr;
      default:
        return false;
    }
  }
};

function equal(a, b, defs, dep = 0) {
  var map = {};
  var vis = [[a, b, dep]];
  var idx = 0;
  var eq  = {};
  while (idx < vis.length) {
    let [a0, b0, dep] = vis[idx];
    let a1 = reduce_high(a0, defs);
    let b1 = reduce_high(b0, defs);

    //var hs = to_low(b1, dep).hash + "-" + to_low(a1, dep).hash;
    //let id = eq[hs] || congruent_terms(map, a1, b1);
    //eq[hs] = true;

    let id = congruent_terms(map, a1, b1);
    equate(map, a0.hash, a1.hash);
    equate(map, b0.hash, b1.hash);
    equate(map, a1.hash, b1.hash);
    
    if (!id) {
      switch (a1.ctor + b1.ctor) {
        case "AllAll":
          if (a1.eras !== b1.eras) return [false,a1,b1];
          if (a1.self !== b1.self) return [false,a1,b1];
          var a1_bind = a1.bind(Var(dep));
          var b1_bind = b1.bind(Var(dep));
          var a1_body = a1.body(Var(dep), Var(dep+1));
          var b1_body = b1.body(Var(dep), Var(dep+1));
          vis.push([a1_bind, b1_bind, dep+1]);
          vis.push([a1_body, b1_body, dep+2]);
          break;
        case "LamLam":
          if (a1.eras !== b1.eras) return [false,a1,b1];
          var a1_body = a1.body(Var(dep));
          var b1_body = b1.body(Var(dep));
          vis.push([a1_body, b1_body, dep+1]);
          break;
        case "AppApp":
          if (a1.eras !== b1.eras) return [false,a1,b1];
          vis.push([a1.func, b1.func, dep]);
          vis.push([a1.argm, b1.argm, dep]);
          break;
        case "LetLet":
          var a1_body = a1.body(Var(dep));
          var b1_body = b1.body(Var(dep));
          vis.push([a1.expr, b1.expr, dep]);
          vis.push([a1_body, b1_body, dep+1]);
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

function Err(loc, ctx, msg) {
  return {
    loc: loc,
    ctx: ctx,
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
  var index = 0;
  var str = "";
  str += err.msg+"\n";
  //console.log(err);
  if (err.ctx.ctor !== "Nil") {
    str += "With context:\n";
    str += "\x1b[2m"+stringify_ctx(err.ctx)+"\x1b[0m";
  };
  if (err.loc && code) {
    str += highlight_code(code, err.loc.from, err.loc.to);
  };
  return str;
};

// Type-Checking
// =============

function typeinfer_high(term, defs, ctx = Nil()) {
  //console.log("typeinfer", term.ctor);
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      var got = defs[term.name];
      if (got) {
        return to_high(got.type);
      } else {
        throw Err(term.locs, ctx, "Undefined reference '" + term.name + "'.");
      }
    case "Typ":
      return Typ();
    case "App":
      var func_typ = reduce_high(typeinfer_high(term.func, defs, ctx), defs);
      switch (func_typ.ctor) {
        case "All":
          var self_var = Ann(true, term.func, func_typ);
          var name_var = Ann(true, term.argm, func_typ.bind(self_var));
          typecheck_high(term.argm, func_typ.bind(self_var), defs, ctx);
          var term_typ = func_typ.body(self_var, name_var);
          if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
            throw Err(term.locs, ctx, "Mismatched erasure.");
          };
          return term_typ;
        default:
          throw Err(term.locs, ctx, "Non-function application.");
      };
    case "Let":
      //console.log("....", term);
      var expr_typ = typeinfer_high(term.expr, defs, ctx);
      var expr_var = Ann(true, Var(ctx.length), expr_typ);
      //var expr_val = Ann(true, term.expr, expr_typ);
      var body_ctx = push({name:term.name,type:expr_var.type}, ctx);
      var body_typ = typeinfer_high(term.body(expr_var), defs, body_ctx);
      return body_typ;
    case "All":
      var self_var = Ann(true, Var(ctx.length), term);
      var name_var = Ann(true, Var(ctx.length+1), term.bind(self_var));
      var bind_ctx = push({name:term.self,type:self_var.type}, ctx);
      var body_ctx = push({name:term.self,type:self_var.type}, ctx);
      var body_ctx = push({name:term.name,type:name_var.type}, body_ctx);
      typecheck_high(term.bind(self_var), Typ(), defs, bind_ctx);
      typecheck_high(term.body(self_var,name_var), Typ(), defs, body_ctx);
      return Typ();
    case "Ann":
      if (term.done) {
        return term.type;
      } else {
        return typecheck_high(term.expr, term.type, defs, ctx);
      }
  }

  console.log(new Error());
  process.exit();


  throw Err(term.locs, ctx, "Can't infer type.");
};

function typecheck_high(term, type, defs, ctx = Nil()) {
  //console.log("-- typecheck ", ctx.length);
  //console.log(stringify_term(to_low(term), ctx));
  //console.log(stringify_term(to_low(type), ctx));
  var typv = reduce_high(type, defs);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = Ann(true, term, type);
        var bind_typ = typv.bind(self_var);
        var name_var = Ann(true, Var(ctx.length), bind_typ);
        var body_typ = typv.body(self_var, name_var);
        if (term.eras !== typv.eras) {
          throw Err(term.locs, ctx, "Type mismatch.");
        };
        var body_ctx = push({name:term.name,type:name_var.type}, ctx);
        typecheck_high(term.body(name_var), body_typ, defs, body_ctx);
      } else {
        throw Err(term.locs, ctx, "Lambda has a non-function type.");
      }
      break;
    default:
      var infr = typeinfer_high(term, defs, ctx);
      //console.log("eq?");
      //console.log(">",stringify_term(to_low(type)));
      //console.log(">",stringify_term(to_low(infr)));
      var [eq, type1, infr1] = equal(type, infr, defs, ctx.length);
      if (!eq) {
        var type0_str = stringify_term(to_low(normalize_high(type, {}), ctx.length), ctx);
        var infr0_str = stringify_term(to_low(normalize_high(infr, {}), ctx.length), ctx);
        var type1_str = stringify_term(to_low(normalize_high(type1, {}), ctx.length), ctx);
        var infr1_str = stringify_term(to_low(normalize_high(infr1, {}), ctx.length), ctx);
        throw Err(term.locs, ctx,
          "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type0_str+"\x1b[0m\n" +
          "Reduced to... \x1b[2m"+infr1_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type1_str+"\x1b[0m");
      }
      break;
  };
  return type;
};

function typecheck(term, type, defs) {
  return to_low(typecheck_high(to_high(term), to_high(type), defs));
};

function typeinfer(term, defs) {
  return to_low(typeinfer_high(to_high(term), defs));
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

module.exports = {
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
  stringify_defs,
  stringify_ctx,
  find,
  to_high,
  to_low,
  reduce_high,
  normalize_high,
  reduce,
  normalize,
  Err,
  stringify_err,
  typeinfer_high,
  typecheck_high,
  typeinfer,
  typecheck,
  equal,
  mul64,
  xor64,
  mix64,
  hash_str,
  hash_two,
};
