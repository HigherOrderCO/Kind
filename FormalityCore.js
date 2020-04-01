// Term
// ====

// precedence for ctor arguments:
// hash, eras/done, self, name, bind/type/func, body/argm/expr, indx

function Var(indx) {
  var hash = hash_two(1, indx);
  return {ctor: "Var", hash, indx};
};

function Ref(name) {
  var hash = hash_two(2, hash_str(name));
  return {ctor: "Ref", hash, name};
};

function Typ() {
  var hash = hash_two(3, 0);
  return {ctor: "Typ", hash};
};

function All(eras, self, name, bind, body) {
  var hash = hash_two(4, hash_two(bind.hash, body.hash));
  return {ctor: "All", hash, eras, self, name, bind, body};
};

function Lam(eras, name, body) {
  var hash = hash_two(5, body.hash);
  return {ctor: "Lam", hash, eras, name, body};
};

function App(eras, func, argm) {
  var hash = hash_two(6, hash_two(func.hash, argm.hash));
  return {ctor: "App", hash, eras, func, argm};
};

function Let(name, expr, body) {
  var hash = hash_two(7, hash_two(expr.hash, body.hash));
  return {ctor: "Let", hash, name, expr, body};
};

function Ann(done, expr, type) {
  var hash = hash_two(8, hash_two(expr.hash, type.hash));
  return {ctor: "Ann", hash, done, expr, type};
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
  return (val >= 48 && val < 58)   // 0-9
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
  if (code.slice(indx, indx + 2) === "//") {
    while (indx < code.length && code[indx] !== "\n") {
      ++indx;
    }
    indx += 1;
  }
  if (code.slice(indx, indx + 2) === "/*") {
    while (indx < code.length && code.slice(indx, indx+2) !== "*/") {
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
function parse_one(code, indx, ch0, ch1) {
  try {
    var [indx, str] = parse_str(code, indx, ch0);
    return [indx, 0];
  } catch (e) {
    var [indx, str] = parse_str(code, indx, ch1);
    return [indx, 1];
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
  var [indx, term] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str(code, next(code, indx), ")");
  return [indx, term];
};

// Parses a dependent function type, `(<name> : <term>) -> <term>`
function parse_all(code, indx, vars) {
  var [indx, self] = parse_nam(code, next(code, indx), 1);
  var [indx, eras] = parse_one(code, indx, "(", "<");
  var [indx, name] = parse_nam(code, next(code, indx), 1);
  var [indx, skip] = parse_str(code, next(code, indx), ":");
  var [indx, bind] = parse_trm(code, indx, Ext(self, vars));
  let close_chr    = eras === 0 ? ")" : ">"
  var [indx, skip] = parse_str(code, next(code, indx), close_chr)
  var [indx, skip] = parse_str(code, next(code, indx), "->");
  var [indx, body] = parse_trm(code, indx, Ext(name, Ext(self, vars)));
  return [indx, All(eras === 1, self, name, bind, body)];
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, vars) {
  var [indx, eras] = parse_one(code, next(code, indx), "(", "<");
  var [indx, name] = parse_nam(code, next(code, indx), 1);
  let close_chr    = eras === 0 ? ")" : ">"
  var [indx, skip] = parse_str(code, next(code, indx), close_chr)
  var [indx, skip] = parse_str(code, next(code, indx), "=>");
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Lam(eras === 1, name, body)];
};

// Parses a local definition, `let x = val; body`
function parse_let(code, indx, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "let ");
  var [indx, name] = parse_nam(code, next(code, indx));
  var [indx, skip] = parse_str(code, next(code, indx), "=");
  var [indx, expr] = parse_trm(code, indx, vars);
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Let(name, expr, body)];
};

// Parses the type of types, `Type`
function parse_typ(code, indx, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "Type");
  return [indx, Typ()];
};

// Parses variables, `<name>`
function parse_var(code, indx, vars) {
  var [indx, name] = parse_nam(code, next(code, indx));
  var got = find(vars, (x,i) => x === name);
  if (got) {
    return [indx, Var(got.index)];
  } else if (!isNaN(Number(name))) {
    return [indx, Var(Number(name))];
  } else {
    return [indx, Ref(name)];
  };
};

// Parses an application, `<term>(<term>)`
function parse_app(code, indx, func, vars) {
  var [indx, eras] = parse_one(code, indx, "(", "<");
  var [indx, argm] = parse_trm(code, indx, vars);
  let close_chr    = eras === 0 ? ")" : ">"
  var [indx, skip] = parse_str(code, next(code, indx), close_chr);
  return [indx, App(eras === 1, func, argm)];
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, indx, bind, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "->");
  var [indx, body] = parse_trm(code, indx, Ext("", Ext("", vars)));
  return [indx, All(false, "", "", shift(bind,1,0), body)];
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, expr, vars) {
  var [indx, skip] = parse_str(code, next(code, indx), "::");
  var [indx, type] = parse_trm(code, indx, vars);
  return [indx, Ann(false, expr, type)];
};

// Parses a term
function parse_trm(code, indx = 0, vars = Nil()) {
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
      () => parse_app(code, indx, term, vars),
      () => parse_arr(code, indx, term, vars),
      () => parse_ann(code, indx, term, vars),
    ]);
    if (!post_parse) {
      return base_parse;
    } else {
      base_parse = post_parse;
    }
  }

  return null;
};

// Parses a module
function parse_mod(code, indx) {
  var module = {};
  function parse_defs(code, indx) {
    try {
      var [indx, name] = parse_nam(code, next(code, indx));
      var [indx, skip] = parse_str(code, next(code, indx), ":");
      var [indx, type] = parse_trm(code, next(code, indx), Nil());
      var [indx, term] = parse_trm(code, next(code, indx), Nil());
      module[name] = {type, term};
      parse_defs(code, indx);
    } catch (e) {}
  }
  parse_defs(code, indx);
  return module;
};

// Stringification
// ===============

function stringify_trm(term, vars = Nil()) {
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
      var bind = stringify_trm(term.bind, Ext(self, vars));
      var rpar = term.name === "" ? "" : (term.eras ? ">" : ")");
      var body = stringify_trm(term.body, Ext(name, Ext(self, vars)));
      return self+lpar+name+colo+bind+rpar+" -> "+body;
    case "Lam":
      var name = term.name;
      var lpar = term.eras ? "<" : "(";
      var body = stringify_trm(term.body, Ext(name, vars));
      var rpar = term.eras ? ">" : ")";
      return lpar+name+rpar+" => "+body;
    case "App":
      var func = stringify_trm(term.func, vars);
      var lpar = term.eras ? "<" : "(";
      var argm = stringify_trm(term.argm, vars);
      var rpar = term.eras ? ">" : ")";
      if (term.func.ctor === "Lam" || term.func.ctor === "All") {
        return "("+func+")"+lpar+argm+rpar;
      } else {
        return func+lpar+argm+rpar;
      }
    case "Let":
      var name = term.name;
      var expr = stringify_trm(term.expr, vars);
      var body = stringify_trm(term.body, Ext(name, vars));
      return "let "+name+" = "+expr+"; "+body;
    case "Ann":
      var expr = stringify_trm(term.expr, vars);
      var type = stringify_trm(term.type, vars);
      return expr+" :: "+type;
  }
};

function stringify_ctx(ctx, nam) {
  function stringify_ctx(ctx, nam, len = 0) {
    switch (ctx.ctor) {
      case "Ext":
        var name = nam.head;
        var type = stringify_trm(ctx.head, nam.tail);
        var rest = stringify_ctx(ctx.tail, nam.tail, len + 1);
        return "- " + name + " : " + type + "\n" + rest;
      case "Nil":
        return "";
    };
  };
  return stringify_ctx(ctx, nam, 0).slice(0,-1).split("\n").reverse().join("\n");
};

function stringify_mod(mod) {
  var text = "";
  for (var name in mod) {
    var type = stringify_trm(mod[name].type, Nil());
    var term = stringify_trm(mod[name].term, Nil());
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
      return All(eras, self, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = shift(term.body, inc, dep + 1);
      return Lam(eras, name, body);
    case "App":
      var eras = term.eras;
      var func = shift(term.func, inc, dep);
      var argm = shift(term.argm, inc, dep);
      return App(eras, func, argm);
    case "Let":
      var name = term.name;
      var expr = shift(term.expr, inc, dep);
      var body = shift(term.body, inc, dep + 1);
      return Let(name, expr, body);
    case "Ann":
      var expr = shift(term.expr, inc, dep);
      var type = shift(term.type, inc, dep);
      var done = term.done;
      return Ann(done, expr, type);
  };
};

function subst(term, val, dep) {
  switch (term.ctor) {
    case "Var":
      if (term.indx < dep) {
        return Var(term.indx);
      } else if (term.indx === dep) {
        return val;
      } else {
        return Var(term.indx - 1);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = subst(term.bind, shift(val,1,0), dep + 1);
      var body = subst(term.body, shift(val,2,0), dep + 2);
      return All(eras, self, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = subst(term.body, shift(val,1,0), dep + 1);
      return Lam(eras, name, body);
    case "App":
      var eras = term.eras;
      var func = subst(term.func, val, dep);
      var argm = subst(term.argm, val, dep);
      return App(eras, func, argm);
    case "Let":
      var name = term.name;
      var expr = subst(term.expr, val, dep);
      var body = subst(term.body, shift(val,1,0), dep + 1);
      return Let(name, expr, body);
    case "Ann":
      var expr = subst(term.expr, val, dep);
      var type = subst(term.type, val, dep);
      var done = term.done;
      return Ann(done, expr, type);
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
        return Var(depth - term.indx - 1);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = s => to_high_order(term.bind, Ext(s, vars), depth + 1);
      var body = (s,x) => to_high_order(term.body, Ext(x, Ext(s, vars)), depth + 2);
      return All(eras, self, name, bind, body);
    case "Lam":
      if (term.eras) {
        var body = subst(term.body, Ref("<erased>"), 0);
        return to_high_order(body, vars, depth);
      } else {
        var name = term.name;
        var body = x => to_high_order(term.body, Ext(x, vars), depth + 1);
        return Lam(false, name, body);
      };
    case "App":
      if (term.eras) {
        return to_high_order(term.func, vars, depth);
      } else {
        var func = to_high_order(term.func, vars, depth);
        var argm = to_high_order(term.argm, vars, depth);
        return App(false, func, argm);
      }
    case "Let":
      var name = term.name;
      var expr = to_high_order(term.expr, vars, depth);
      var body = x => to_high_order(term.body, Ext(x, vars), depth + 1);
      return Let(name, expr, body);
    case "Ann":
      return to_high_order(term.expr, vars, depth);
  }
};

function to_low_order(term, depth = 0) {
  switch (term.ctor) {
    case "Var":
      return Var(depth - term.indx - 1);
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = to_low_order(term.bind(Var(depth)), depth + 1);
      var body = to_low_order(term.body(Var(depth), Var(depth+1)), depth + 2);
      return All(eras, self, name, bind, body);
    case "Lam":
      var name = term.name;
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      return Lam(false, name, body);
    case "App":
      var func = to_low_order(term.func, depth);
      var argm = to_low_order(term.argm, depth);
      return App(false, func, argm);
    case "Let":
      var name = term.name;
      var expr = to_low_order(term.expr, depth);
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      return Let(name, expr, body);
    case "Ann":
      throw "Unreachable.";
  }
};

function reduce_high_order(term, module) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      if (module[term.name]) {
        return reduce_high_order(to_high_order(module[term.name].term), module);
      } else {
        return Ref(term.name);
      }
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = term.bind;
      var body = term.body;
      return All(eras, self, name, bind, body);
    case "Lam":
      var name = term.name;
      var body = term.body;
      return Lam(false, name, body);
    case "App":
      var func = reduce_high_order(term.func, module);
      switch (func.ctor) {
        case "Lam":
          return reduce_high_order(func.body(term.argm), module);
        default:
          return App(false, func, reduce_high_order(term.argm, module));
      };
    case "Let":
      var name = term.name;
      var expr = term.expr;
      var body = term.body;
      return reduce_high_order(body(expr), module);
    case "Ann":
      return reduce_high_order(term.expr, module);
  };
};

function normalize_high_order(term, module) {
  var norm = reduce_high_order(term, module);
  switch (norm.ctor) {
    case "Var":
      return Var(norm.indx);
    case "Ref":
      return Ref(norm.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = norm.eras;
      var self = norm.self;
      var name = norm.name;
      var bind = s => normalize_high_order(norm.bind(s), module);
      var body = (s,x) => normalize_high_order(norm.body(s,x), module);
      return All(eras, self, name, bind, body);
    case "Lam":
      var name = norm.name;
      var body = x => normalize_high_order(norm.body(x), module);
      return Lam(false, name, body);
    case "App":
      var func = normalize_high_order(norm.func, module);
      var argm = normalize_high_order(norm.argm, module);
      return App(false, func, argm);
    case "Let":
      var name = norm.name;
      var expr = normalize_high_order(norm.expr, module);
      var body = x => normalize_high_order(norm.body(x), module);
      return Let(name, expr, body);
    case "Ann":
      return normalize_high_order(norm.expr, module);
  };
};

function reduce(term, module) {
  return to_low_order(reduce_high_order(to_high_order(term, Nil()), module), 0);
};

function normalize(term, module) {
  return to_low_order(normalize_high_order(to_high_order(term, Nil()), module), 0);
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
      if (term.index < depth){
        return Var(term.index);
      } else {
        return Ref(initial_depth - 1 - (term.index - depth));
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = go(term.bind, depth);
      var body = go(term.body, depth+1);
      return All(eras, self, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = go(term.body, depth+1);
      return Lam(eras, name, body);
    case "App":
      var eras = term.eras;
      var func = go(term.func, depth);
      var argm = go(term.argm, depth);
      return App(eras,func, argm);
    case "Let":
      var name = term.name;
      var expr = go(term.expr, depth);
      var body = go(term.body, depth+1);
      return Let(name, expr, body);
    case "Ann":
      var expr = go(term.expr, depth);
      var type = go(term.type, depth);
      var done = term.done;
      return Ann(done, expr, type);
    default:    return term;
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
        var bind_id = congruent_terms(map, a.bind, b.bind);
        var body_id = congruent_terms(map, a.body, b.body);
        var ret = bind_id && body_id;
        break;
      case "LamLam":
        var body_id = congruent_terms(map, a.body, b.body);
        var ret = body_id;
        break;
      case "AppApp":
        var func_id = congruent_terms(map, a.func, b.func);
        var argm_id = congruent_terms(map, a.argm, b.argm);
        var ret = func_id && argm_id;
        break;
      case "LetLet":
        var expr_id = congruent_terms(map, a.expr, b.expr);
        var body_id = congruent_terms(map, a.body, b.body);
        var ret = expr_id && body_id;
        break;
      case "AnnAnn":
        var expr_id = congruent_terms(map, a.expr, b.expr);
        var ret = expr_id;
        break;
      default:
        var ret = false;
        break;
    }
    return ret;
  }
};

function equal(a, b, module, dep = 0) {
  var map = {};
  var vis = [[a, b, dep]];
  var idx = 0;
  while (idx < vis.length) {
    let [a0, b0, depth] = vis[idx];
    let a1 = reduce(a0, module);
    let b1 = reduce(b0, module);
    let id = congruent_terms(map, a1, b1);
    equate(map, a0.hash, a1.hash);
    equate(map, b0.hash, b1.hash);
    equate(map, a1.hash, b1.hash);
    if (!id) {
      switch (a1.ctor + b1.ctor) {
        case "AllAll":
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
          var a_body = subst(a1.body, Ref("%" + (depth + 0)), 0);
          var b_body = subst(b1.body, Ref("%" + (depth + 0)), 0);
          vis.push([a_body, b_body, depth + 1]);
          break;
        case "AppApp":
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

// Type-Checking
// =============

function typeinfer(term, module, ctx = Nil(), nam = Nil()) {
  //console.log("infer", stringify_trm(term, nam));
  //console.log("-----");
  switch (term.ctor) {
    case "Var":
      var got = find(ctx, (x,i) => i === term.indx);
      if (got) {
        return shift(got.value, got.index + 1, 0);
      } else {
        throw "Unbound varible.";
      }
    case "Ref":
      var got = module[term.name];
      if (got) {
        return got.type;
      } else {
        throw "Undefined reference '" + term.name + "'.";
      }
    case "Typ":
      return Typ();
    case "App":
      var func_typ = reduce(typeinfer(term.func, module, ctx, nam), module);
      switch (func_typ.ctor) {
        case "All":
          var expe_typ = subst(func_typ.bind, term.func, 0);
          typecheck(term.argm, expe_typ, module, ctx, nam);
          var term_typ = func_typ.body;
          var term_typ = subst(term_typ, shift(term.func, 1, 0), 1);
          var term_typ = subst(term_typ, shift(term.argm, 0, 0), 0);
          var term_typ = reduce(term_typ, module);
          if (term.eras !== func_typ.eras) {
            throw "Mismatched erasure: " + stringify_trm(term, nam);
          };
          return term_typ;
        default:
          throw "Non-function application: " + stringify_trm(term, nam);
      };
    case "Let":
      var term_val = subst(term.body, term.expr, 0);
      var term_typ = typeinfer(term_val, module, ctx, nam);
      return term_typ;
    case "All":
      var self_typ = Ann(true, term, Typ());
      var bind_ctx = Ext(self_typ, ctx);
      var bind_nam = Ext(term.self, nam);
      var bind_typ = typecheck(term.bind, Typ(), module, bind_ctx, bind_nam);
      var body_ctx = Ext(term.bind, Ext(self_typ, ctx));
      var body_nam = Ext(term.name, Ext(term.self, nam));
      typecheck(term.body, Typ(), module, body_ctx, body_nam);
      return Typ();
  }
};

function typecheck(term, type, module, ctx = Nil(), nam = Nil()) {
  //console.log("check", stringify_trm(term, nam));
  //console.log("typed", stringify_trm(type, nam));
  //console.log("-----");
  var typv = reduce(type, module);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        if (term.eras !== typv.eras) {
          throw "Mismatched erasure: " + stringify_trm(term, nam);
        };
        var self_typ = Ann(true, typv, Typ());
        var bind_typ = subst(typv.bind, term, 0);
        var body_typ = subst(typv.body, shift(term, 1, 0), 1);
        var body_nam = Ext(term.name, nam);
        var body_ctx = Ext(bind_typ, ctx);
        typecheck(term.body, body_typ, module, body_ctx, body_nam);
      } else {
        throw "Lambda has a non-function type: " + stringify_trm(term, nam);
      }
      break;
    case "Ann":
      if (term.done) {
        infr = term.type;
      } else {
        infr = typecheck(term.expr, term.type, module, ctx, nam);
      }
      break;
    default:
      var infr = typeinfer(term, module, ctx, nam);
      if (!equal(type, infr, module)) {
        var type_str = stringify_trm(reduce(type, {}), nam);
        var infr_str = stringify_trm(reduce(infr, {}), nam);
        var term_str = stringify_trm(reduce(term, {}), nam);
        var err = "\n";
        var err = err + "Found type... \x1b[2m"+infr_str+"\x1b[0m\n";
        var err = err + "Instead of... \x1b[2m"+type_str+"\x1b[0m\n";
        var err = err + "When checking \x1b[2m"+term_str+"\x1b[0m\n";
        var err = err + stringify_ctx(ctx, nam);
        throw err;
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
  parse_ann,
  parse_trm,
  parse_mod,
  stringify_trm,
  stringify_mod,
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
  typeinfer,
  typecheck,
  equal,
  mul64,
  xor64,
  mix64,
  hash_str,
  hash_two,
};
