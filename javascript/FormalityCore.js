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
  return {ctor: "Nil"};
};

function Ext(head, tail) {
  return {ctor: "Ext", head, tail};
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

// Returns the first function that doesn't throw, or null
function first_valid(fns) {
  for (var i = 0; i < fns.length; ++i) {
    try {
      return fns[i]();
    } catch (e) {
      continue;
    }
  };
  return null;
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

// Drops spaces and parses an exact string
function parse_str(code, indx, str) {
  if (str.length === 0) {
    return [indx, str];
  } else if (indx < code.length && code[indx] === str[0]) {
    return parse_str(code, indx+1, str.slice(1));
  } else {
    throw "Expected `" + str + "`, found `" + code.slice(indx,indx+16) + "`.";
  };
};

// Parses one of two strings
function parse_opt(code, indx, ch0, ch1) {
  try {
    var [indx, str] = parse_str(code, indx, ch0);
    return [indx, false];
  } catch (e) {
    var [indx, str] = parse_str(code, indx, ch1);
    return [indx, true];
  }
};

// Parses one of two strings
function parse_may(code, indx, str) {
  try {
    var [indx, skip] = parse_str(code, indx, str);
    return [indx, true];
  } catch (e) {
    return [indx, false];
  }
};

// Parses a valid name, non-empty
function parse_nam(code, indx, size = 0) {
  if (indx < code.length && is_name(code[indx])) {
    var head = code[indx];
    var [indx, tail] = parse_nam(code, indx + 1, size + 1);
    return [indx, head + tail];
  } else if (size > 0) {
    return [indx, ""];
  } else {
    throw "Invalid name.";
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, indx, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "(");
  var [indx, term] = parse_term(code, indx, vars);
  var [indx, skip] = parse_str(code, next(code, indx), ")");
  return [indx, term];
};

// Parses a dependent function type, `(<name> : <term>) -> <term>`
function parse_all(code, indx, vars) {
  var from = indx;
  var [indx, self] = parse_nam(code, next(code, indx), 1);
  var [indx, eras] = parse_opt(code, indx, "(", "<");
  var [indx, name] = parse_nam(code, next(code, indx), 1);
  var [indx, skip] = parse_str(code, next(code, indx), ":");
  var [indx, bind] = parse_term(code, indx, Ext(self, vars));
  var [indx, skip] = parse_str(code, next(code, indx), eras ? ">" : ")")
  var [indx, skip] = parse_str(code, next(code, indx), "->");
  var [indx, body] = parse_term(code, indx, Ext(name, Ext(self, vars)));
  return [indx, All(eras, self, name, bind, body, {from,to:indx})];
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, vars) {
  var from = indx;
  var [indx, eras] = parse_opt(code, next(code, indx), "(", "<");
  var [indx, name] = parse_nam(code, next(code, indx), 1);
  var [indx, skip] = parse_str(code, next(code, indx), eras ? ">" : ")")
  var [indx, body] = parse_term(code, indx, Ext(name, vars));
  return [indx, Lam(eras, name, body, {from,to:indx})];
};

// Parses a local definition, `let x = val; body`
function parse_let(code, indx, vars) {
  var from = indx;
  var [indx, skip] = parse_str(code, next(code, indx), "let ");
  var [indx, name] = parse_nam(code, next(code, indx));
  var [indx, skip] = parse_str(code, next(code, indx), "=");
  var [indx, expr] = parse_term(code, indx, vars);
  var [indx, body] = parse_term(code, indx, Ext(name, vars));
  return [indx, Let(name, expr, body, {from,to:indx})];
};

// Parses the type of types, `Type`
function parse_typ(code, indx, vars) {
  var from = indx;
  var [indx, skip] = parse_str(code, next(code, indx), "Type");
  return [indx, Typ({from,to:indx})];
};

// Parses variables, `<name>`
function parse_var(code, indx, vars) {
  var from = indx;
  var [indx, name] = parse_nam(code, next(code, indx));
  var got = find(vars, (x,i) => x === name);
  if (got) {
    return [indx, Var(got.index, {from,to:indx})];
  } else if (!isNaN(Number(name))) {
    return [indx, Var(Number(name), {from,to:indx})];
  } else {
    return [indx, Ref(name, {from,to:indx})];
  };
};

// Parses a single-line application, `<term>(<term>)`
function parse_app(code, indx, from, func, vars) {
  var [indx, eras] = parse_opt(code, indx, "(", "<");
  var [indx, argm] = parse_term(code, indx, vars);
  var [indx, skip] = parse_str(code, next(code, indx), eras ? ">" : ")");
  return [indx, App(eras, func, argm, {from,to:indx})];
};

// Parses a multi-line application, `<term> | <term>;`
function parse_pip(code, indx, from, func, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "|");
  var [indx, argm] = parse_term(code, indx, vars);
  var [indx, skip] = parse_str(code, next(code, indx), ";");
  return [indx, App(false, func, argm, {from,to:indx})];
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, indx, from, bind, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "->");
  var [indx, body] = parse_term(code, indx, Ext("", Ext("", vars)));
  return [indx, All(false, "", "", shift(bind,1,0), body, {from,to:indx})];
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, from, expr, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "::");
  var [indx, type] = parse_term(code, indx, vars);
  return [indx, Ann(false, expr, type, {from,to:indx})];
};

// Parses a term
function parse_term(code, indx = 0, vars = Nil()) {
  var from = indx;

  // Parses the base term, trying each variant once
  var base_parse = first_valid([
    () => parse_all(code, indx, vars),
    () => parse_lam(code, indx, vars),
    () => parse_let(code, indx, vars),
    () => parse_par(code, indx, vars),
    () => parse_typ(code, indx, vars),
    () => parse_var(code, indx, vars),
  ]);

  // Parses postfix extensions, trying each variant repeatedly
  var post_parse = base_parse;
  while (true) {
    var [indx, term] = post_parse;
    post_parse = first_valid([
      () => parse_app(code, indx, from, term, vars),
      () => parse_pip(code, indx, from, term, vars),
      () => parse_arr(code, indx, from, term, vars),
      () => parse_ann(code, indx, from, term, vars),
    ]);
    if (!post_parse) {
      return base_parse;
    } else {
      base_parse = post_parse;
    }
  }

  return null;
};

// Parses a file
function parse_file(code, indx = 0) {
  var file = {};
  function parse_defs(code, indx) {
    try {
      var [indx, name] = parse_nam(code, next(code, indx));
      var [indx, skip] = parse_str(code, next(code, indx), ":");
      var [indx, type] = parse_term(code, next(code, indx), Nil());
      var [indx, loop] = parse_may(code, drop_spaces(code, indx), "//loop//");
      var [indx, prim] = parse_may(code, drop_spaces(code, indx), "//prim//");
      var [indx, term] = parse_term(code, next(code, indx), Nil());
      file[name] = {type, term, meta: {loop,prim}};
      parse_defs(code, indx);
    } catch (e) {}
  }
  parse_defs(code, indx);
  return file;
};

// Stringification
// ===============

function stringify_term(term, vars = Nil()) {
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
      return lpar+name+rpar+" => "+body;
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
};

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
function bind_free_vars(term, initial_depth) {
  function go(term, depth) {
    switch (term.ctor) {
    case "Var":
      if (term.indx < depth){
        return Var(term.indx, term.locs);
      } else {
        return Ref(initial_depth - 1 - (term.indx - depth));
      }
    case "Ref":
      return Ref(term.name, term.locs);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = go(term.bind, depth+1);
      var body = go(term.body, depth+2);
      var locs = term.locs;
      return All(eras, self, name, bind, body, locs);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = go(term.body, depth+1);
      var locs = term.locs;
      return Lam(eras, name, body, locs);
    case "App":
      var eras = term.eras;
      var func = go(term.func, depth);
      var argm = go(term.argm, depth);
      var locs = term.locs;
      return App(eras,func, argm, locs);
    case "Let":
      var name = term.name;
      var expr = go(term.expr, depth);
      var body = go(term.body, depth+1);
      var locs = term.locs;
      return Let(name, expr, body, locs);
    case "Ann":
      var expr = go(term.expr, depth);
      var type = go(term.type, depth);
      var done = term.done;
      var locs = term.locs;
      return Ann(done, expr, type, locs);
    default:
      return term;
    }
  }
  return go(term, 0);
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

function equal(a, b, file, dep = 0) {
  var map = {};
  var vis = [[bind_free_vars(a, dep), bind_free_vars(b, dep), dep]];
  var idx = 0;
  while (idx < vis.length) {
    let [a0, b0, depth] = vis[idx];
    let a1 = reduce(a0, file);
    let b1 = reduce(b0, file);
    let id = congruent_terms(map, a1, b1);
    equate(map, a0.hash, a1.hash);
    equate(map, b0.hash, b1.hash);
    equate(map, a1.hash, b1.hash);
    if (!id) {
      switch (a1.ctor + b1.ctor) {
        case "AllAll":
          if (a1.eras !== b1.eras) return false;
          if (a1.self !== b1.self) return false;
          var a_bind = subst(a1.bind, Ref("%" + (depth + 0)), 0);
          var b_bind = subst(b1.bind, Ref("%" + (depth + 0)), 0);
          var a_body = subst(a1.body, Ref("%" + (depth + 1)), 1);
          var a_body = subst(a_body, Ref("%" + (depth + 0)), 0);
          var b_body = subst(b1.body, Ref("%" + (depth + 1)), 1);
          var b_body = subst(b_body, Ref("%" + (depth + 0)), 0);
          vis.push([a_bind, b_bind, depth + 1]);
          vis.push([a_body, b_body, depth + 2]);
          break;
        case "LamLam":
          if (a1.eras !== b1.eras) return false;
          var a_body = subst(a1.body, Ref("%" + (depth + 0)), 0);
          var b_body = subst(b1.body, Ref("%" + (depth + 0)), 0);
          vis.push([a_body, b_body, depth + 1]);
          break;
        case "AppApp":
          if (a1.eras !== b1.eras) return false;
          vis.push([a1.func, b1.func, depth]);
          vis.push([a1.argm, b1.argm, depth]);
          break;
        case "LetLet":
          var a_body = subst(a1.body, Ref("%" + (depth + 0)), 0);
          var b_body = subst(b1.body, Ref("%" + (depth + 0)), 0);
          vis.push([a1.expr, b1.expr, depth]);
          vis.push([a_body, b_body, depth + 1]);
          break;
        case "AnnAnn":
          vis.push([a1.expr, b1.expr, depth]);
          break;
        default:
          return false;
      }
    };
    idx += 1;
  };
  return true;
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
  var to_line = 0;
  for (var i = 0; i < code.length; ++i) {
    if (code[i] === "\n") {
      var line_num_str = ("      "+(lines.length+1)).slice(-6);
      lines.push("\x1b[2m" + line_num_str + "| \x1b[0m");
    } else {
      var chr = code[i];
      if (from <= i && i < to) {
        var chr = "\x1b[4m\x1b[31m" + chr + "\x1b[0m";
      } else {
        var chr = "\x1b[2m" + chr + "\x1b[0m";
      }
      lines[lines.length - 1] += chr;
    };
    if (i === from) {
      from_line = lines.length;
    };
    if (i === to) {
      to_line = lines.length;
    };
  };
  from_line = Math.max(from_line - 4, 0);
  to_line = Math.min(to_line + 3, lines.length - 1);
  var err = "On line " + from_line + ":\n";
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
  //console.log("infer", stringify_term(term, nam));
  //console.log("-----");
  switch (term.ctor) {
    case "Var":
      var got = find(ctx, (x,i) => i === term.indx);
      if (got) {
        return shift(got.value, got.index + 1, 0);
      } else {
        throw Err(term.locs, ctx, nam, "Unbound varible.");
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
  //console.log("check", stringify_term(term, nam));
  //console.log("typed", stringify_term(type, nam));
  //console.log("-----");
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
      if (!equal(type, infr, file, ctx.length)) {
        var type_str = stringify_term(normalize(type, {}), nam);
        var infr_str = stringify_term(normalize(infr, {}), nam);
        throw Err(term.locs, ctx, nam,
          "Found type... \x1b[2m"+infr_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type_str+"\x1b[0m");
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
  parse_file,
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
