// Term
// ====

function Var(indx) {
  var hash = hash_two(1, indx);
  return {ctor: "Var", indx, hash};
};

function Ref(name) {
  var hash = hash_two(2, hash_str(name));
  return {ctor: "Ref", name, hash};
};

function Typ() {
  var hash = hash_two(3, 0);
  return {ctor: "Typ", hash};
};

function All(name, bind, body, eras) {
  var hash = hash_two(4, hash_two(bind.hash, body.hash));
  return {ctor: "All", name, bind, body, eras, hash};
};

function Lam(name, body, eras) {
  var hash = hash_two(5, body.hash);
  return {ctor: "Lam", name, body, eras, hash};
};

function App(func, argm, eras) {
  var hash = hash_two(6, hash_two(func.hash, argm.hash));
  return {ctor: "App", func, argm, eras, hash};
};

function Slf(name, type) {
  var hash = hash_two(7, type.hash);
  return {ctor: "Slf", name, type, hash};
};

function Ins(type, expr) {
  var hash = hash_two(8, hash_two(type.hash, expr.hash));
  return {ctor: "Ins", type, expr, hash};
};

function Eli(expr) {
  var hash = hash_two(9, expr.hash);
  return {ctor: "Eli", expr, hash};
};

function Ann(expr, type, done) {
  var hash = hash_two(10, hash_two(expr.hash, type.hash));
  return {ctor: "Ann", expr, type, hash, done};
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
function space(code, indx) {
  return drop_while(is_space, code, indx);
};

// Drops spaces and parses an exact string
function parse_str(str, code, indx) {
  if (str.length === 0) {
    return [indx, str];
  } else if (indx < code.length && code[indx] === str[0]) {
    return parse_str(str.slice(1), code, indx+1);
  } else {
    throw new Error("Expected `" + str + "`, found `" + code.slice(indx,indx+16) + "`.");
  };
};

// Parses an optional character
function parse_opt(chr, code, indx) {
  if (code[indx] === chr) {
    return [indx + 1, true];
  } else {
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
    throw new Error();
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, term] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, term];
};

// Parses a dependent function type, `(<name> : <term>) => <term>`
function parse_all(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str(":", code, space(code, indx));
  var [indx, bind] = parse_trm(code, indx, vars);
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("->", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, All(name, bind, body, eras)];
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("=>", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Lam(name, body, eras)];
};

// Parses the type of types, `Type`
function parse_typ(code, indx, vars) {
  var [indx, skip] = parse_str("Type", code, space(code, indx));
  return [indx, Typ()];
};

// Parses variables, `<name>`
function parse_var(code, indx, vars) {
  var [indx, name] = parse_nam(code, space(code, indx));
  var got = find(vars, (x,i) => x === name);
  if (got) {
    return [indx, Var(got.index)];
  } else {
    return [indx, Ref(name)];
  };
};

// Parses a self type, `#{<name>} <term>`
function parse_slf(code, indx, vars) {
  var [indx, skip] = parse_str("${", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Slf(name, type)];
};

// Parses a self instantiation, `#inst{<term>}`
function parse_ins(code, indx, vars) {
  var [indx, skip] = parse_str("$inst{", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, expr] = parse_trm(code, indx, vars);
  return [indx, Ins(type, expr)];
};

// Parses a self elimination, `#elim{<term>}`
function parse_eli(code, indx, vars) {
  var [indx, skip] = parse_str("$elim{", code, space(code, indx));
  var [indx, expr] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  return [indx, Eli(expr)];
};

// Parses an application, `<term>(<term>)`
function parse_app(code, indx, func, vars) {
  var [indx, skip] = parse_str("(", code, indx);
  var [indx, argm] = parse_trm(code, indx, vars);
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, App(func, argm, eras)];
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, expr, vars) {
  var [indx, skip] = parse_str("::", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, vars);
  return [indx, Ann(expr, type, false)];
};

// Parses a term
function parse_trm(code, indx = 0, vars = Nil()) {
  // Parses the base term, trying each variant once
  var base_parse = first_valid([
    () => parse_all(code, indx, vars),
    () => parse_lam(code, indx, vars),
    () => parse_par(code, indx, vars),
    () => parse_typ(code, indx, vars),
    () => parse_slf(code, indx, vars),
    () => parse_ins(code, indx, vars),
    () => parse_eli(code, indx, vars),
    () => parse_var(code, indx, vars),
  ]);

  // Parses postfix extensions, trying each variant repeatedly
  var post_parse = base_parse;
  while (true) {
    var [indx, term] = post_parse;
    post_parse = first_valid([
      () => parse_app(code, indx, term, vars),
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
      var [indx, name] = parse_nam(code, space(code, indx));
      var [indx, skip] = parse_str(":", code, space(code, indx));
      var [indx, type] = parse_trm(code, space(code, indx), Nil());
      var [indx, term] = parse_trm(code, space(code, indx), Nil());
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
      var name = term.name;
      var bind = stringify_trm(term.bind, vars);
      var body = stringify_trm(term.body, Ext(name, vars));
      var eras = term.eras ? ";" : "";
      return "("+name+" : "+bind+eras+") -> "+body;
    case "Lam":
      var name = term.name;
      var body = stringify_trm(term.body, Ext(name, vars));
      var eras = term.eras ? ";" : "";
      return "("+name+eras+") => "+body;
    case "App":
      var func = stringify_trm(term.func, vars);
      var argm = stringify_trm(term.argm, vars);
      var eras = term.eras ? ";" : "";
      return "("+func+")("+argm+eras+")";
    case "Slf":
      var name = term.name;
      var type = stringify_trm(term.type, Ext(name, vars));
      return "${"+name+"} "+type;
    case "Ins":
      var type = stringify_trm(term.type, vars);
      var expr = stringify_trm(term.expr, vars);
      return "$inst{"+type+"} "+expr;
    case "Eli":
      var expr = stringify_trm(term.expr, vars);
      return "$elim{"+expr+"}";
    case "Ann":
      var expr = stringify_trm(term.expr, vars);
      var type = stringify_trm(term.type, vars);
      return expr+" :: "+type;
  }
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
      var name = term.name;
      var bind = shift(term.bind, inc, dep);
      var body = shift(term.body, inc, dep + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = shift(term.body, inc, dep + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = shift(term.func, inc, dep);
      var argm = subst(term.argm, inc, dep);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = shift(term.type, inc, dep + 1);
      return Slf(name, type);
    case "Ins":
      var name = term.name;
      var type = shift(term.type, inc, dep);
      var expr = shift(term.expr, inc, dep);
      return Ins(name, type, expr);
    case "Ann":
      var expr = shift(term.expr, inc, dep);
      var type = shift(term.type, inc, dep);
      var done = term.done;
      return Ann(expr, type, done);
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
      var name = term.name;
      var bind = subst(term.bind, val, dep);
      var body = subst(term.body, shift(val,1,0), dep + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = subst(term.body, shift(val,1,0), dep + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = subst(term.func, val, dep);
      var argm = subst(term.argm, val, dep);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = subst(term.type, shift(val,1,0), dep + 1);
      return Slf(name, type);
    case "Ins":
      var name = term.name;
      var type = subst(term.type, val, dep);
      var expr = subst(term.expr, val, dep);
      return Ins(name, type, term);
    case "Ann":
      var expr = subst(term.expr, val, dep);
      var type = subst(term.type, val, dep);
      var done = term.done;
      return Ann(expr, type, done);
  };
};

// Evaluation
// ==========

function to_high_order(term, vars = Nil()) {
  switch (term.ctor) {
    case "Var":
      var got = find(vars, (x,i) => i === term.indx);
      if (got) {
        return got.value;
      } else {
        return Var(term.indx);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = to_high_order(term.bind, vars);
      var body = x => to_high_order(term.body, Ext(x, vars));
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = x => to_high_order(term.body, Ext(x, vars));
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = to_high_order(term.func, vars);
      var argm = to_high_order(term.argm, vars);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = x => to_high_order(term.type, Ext(x, vars));
      return Slf(name, type)
    case "Ins":
      var type = to_high_order(term.type, vars);
      var expr = to_high_order(term.expr, vars);
      return Ins(type, expr);
    case "Eli":
      var expr = to_high_order(term.expr, vars);
      return Eli(expr);
    case "Ann":
      var expr = to_high_order(term.expr, vars);
      var type = to_high_order(term.type, vars);
      return Ann(expr, type);
  }
};

function to_low_order(term, depth = 0) {
  switch (term.ctor) {
    case "Var":
      if (term.indx < depth) {
        return Var(depth - term.indx - 1);
      } else {
        return Var(term.indx);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = "x" + depth;
      var bind = to_low_order(term.bind, depth);
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = "x" + depth;
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = to_low_order(term.func, depth);
      var argm = to_low_order(term.argm, depth);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = "x" + depth;
      var type = to_low_order(term.type(Var(depth)), depth + 1);
      return Slf(name, type);
    case "Ins":
      var type = to_low_order(term.type, depth);
      var expr = to_low_order(term.expr, depth);
      return Ins(type, expr);
    case "Eli":
      var expr = to_low_order(term.expr, depth);
      return Eli(expr);
    case "Ann":
      var expr = to_low_order(term.expr, depth);
      var type = to_low_order(term.type, depth);
      return Ann(expr, type);
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
      var name = term.name;
      var bind = term.bind;
      var body = term.body;
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = term.body;
      var eras = term.eras;
      return eras ? body(Ref("<erased>")) : Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func, module);
      if (term.eras) {
        return func;
      } else {
        switch (func.ctor) {
          case "Lam":
            return reduce_high_order(func.body(term.argm), module);
          default:
            return App(func, reduce_high_order(term.argm, module));
        };
      };
    case "Slf":
      var name = term.name;
      var type = term.type;
      return Slf(name, type);
    case "Ins":
      return reduce_high_order(term.expr, module);
    case "Eli":
      return reduce_high_order(term.expr, module);
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
      var name = norm.name;
      var bind = normalize_high_order(norm.bind, module);
      var body = x => normalize_high_order(norm.body(x), module);
      var eras = norm.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = norm.name;
      var body = x => {
        return normalize_high_order(norm.body(x), module);
      };
      var eras = norm.eras;
      return Lam(name, body, eras);
    case "App":
      var func = normalize_high_order(norm.func, module);
      var argm = normalize_high_order(norm.argm, module);
      return App(func, argm);
    case "Slf":
      var name = norm.name;
      var type = x => normalize_high_order(norm.type(x), module);
      return Slf(name, type);
    case "Ins":
      return normalize_high_order(norm.expr, module);
    case "Eli":
      return normalize_high_order(norm.expr, module);
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

// Checks if `x` and `y` are on the same equality set
function is_equivalent(map, x, y) {
  if (map[x] && map[y]) {
    return disjoint_set_find(map[x]) === disjoint_set_find(map[y]);
  } else {
    return x === y;
  }
};

// Merges the equality sets of `x` and `y`
function equate(map, x, y) {
  if (!map[x]) {
    map[x] = new_disjoint_set();
  }
  if (!map[y]) {
    map[y] = new_disjoint_set();
  };
  disjoint_set_union(map[x], map[y]);
};

// FIXME Is this used?
//function bind_free_vars(term, initial_depth) {
  //function go(term, depth) {
    //switch (term.ctor) {
      //case "Var": {
        //if (term.index < depth){
          //return term;
        //}
        //var f_index = term.index - depth;
        //return Bnd(initial_depth - 1 - f_index);
      //}
      //case "Ref": return Ref(term.name);
      //case "Typ": return Typ();
      //case "All": return All(term.name, go(term.bind, depth), go(term.body, depth+1), term.eras);
      //case "Lam": return Lam(term.name, go(term.bind, depth), go(term.body, depth+1), term.eras);
      //case "App": return App(go(term.func, depth), go(term.argm, depth), term.eras);
      //case "Slf": return Slf(term.name, go(term.type, depth+1));
      //case "Ins": return Ins(term.type, go(term.expr, depth));
      //case "Eli": return Eli(go(term.expr, depth));
      //case "Ann": return Ann(go(term.expr, depth), go(term.type, depth), term.done);
      //default:    return term;
    //}
  //}
  //return go(term, 0);
//};

// Checks if two terms are identical (without reductions).
function is_identical(map, term1, term2) {
  if (is_equivalent(map, term1.hash, term2.hash)) {
    return true;
  } else {
    // FIXME Won't this branch always return false?
    switch (term1.ctor + term2.ctor) {
      case "AllAll":
        var bind_id = is_identical(map, term1.bind, term2.bind);
        var body_id = is_identical(map, term1.body, term2.body);
        var ret = bind_id && body_id;
        break;
      case "LamLam":
        var body_id = is_identical(map, term1.body, term2.body);
        var ret = body_id;
        break;
      case "AppApp":
        var func_id = is_identical(map, term1.func, term2.func);
        var argm_id = is_identical(map, term1.argm, term2.argm);
        var ret = func_id && argm_id;
        break;
      case "SlfSlf":
        var type_id = is_identical(map, term1.type, term2.type);
        var ret = type_id;
        break;
      case "InsIns":
        var expr_id = is_identical(map, term1.expr, term2.expr);
        var ret = expr_id;
        break;
      case "EliEli":
        var expr_id = is_identical(map, term1.expr, term2.expr);
        var ret = expr_id;
        break;
      case "AnnAnn":
        var expr_id = is_identical(map, term1.expr, term2.expr);
        var ret = expr_id;
        break;
      default:
        var ret = false;
        break;
    }
    return ret;
  }
};

function same_node(term1, term2, path) {
  switch (term1.ctor + term2.ctor) {
    case "AllAll":
      var bind_same = [
        term1.bind,
        term2.bind,
        path
      ];
      var body_same = [
        subst(term1.body, Ref("$"+path), 0),
        subst(term2.body, Ref("$"+path), 0),
        path+1
      ];
      return [bind_same, body_same];
    case "LamLam":
      var body_same = [
        subst(term1.body, Ref("$"+path), 0),
        subst(term2.body, Ref("$"+path), 0),
        path+1
      ];
      return [body_same]
    case "AppApp":
      var func_same = [
        term1.func,
        term2.func,
        path
      ];
      var argm_same = [
        term1.argm,
        term2.argm,
        path
      ];
      return [func_same, argm_same];
    case "SlfSlf":
      var type_same = [
        subst(term1.type, Ref("$"+path), 0),
        subst(term2.type, Ref("$"+path), 0),
        path + 1
      ];
      return [type_same]
    case "InsIns":
      var expr_same = [
        term1.expr,
        term2.expr,
        path
      ];
      return [expr_same];
    case "EliEli":
      var expr_same = [
        term1.expr,
        term2.expr,
        path
      ];
      return [expr_same];
    case "AnnAnn":
      var expr_same = [
        term1.expr,
        term2.expr,
        path
      ];
      return [expr_same];
    default:
      return null;
  }
};

function equal(a, b, module, dep = 0) {
  var map = {};
  var vis = [[a, b, dep]];
  var idx = 0;
  while (idx < vis.length) {
    let [a0, b0, path] = vis[idx];
    let a1 = reduce(a0, module);
    let b1 = reduce(b0, module);
    let eq = is_identical(map, a1, b1);
    equate(map, a0.hash, a1.hash);
    equate(map, b0.hash, b1.hash);
    equate(map, a1.hash, b1.hash);
    if (!eq) {
      let result = same_node(a1, b1, path);
      if (!result) {
        return false;
      } else {
        for (var i = 0; i < result.length; ++i) {
          vis.push(result[i]);
        };
      }
    }
    idx += 1;
  };
  return true;
};

// Type-Checking
// =============

function typecheck(term, type = null, module, ctx = Nil()) {
  var typv = type ? reduce(type, module) : null;
  switch (term.ctor) {
    case "Var":
      var got = find(ctx, (x,i) => i === term.indx);
      if (got) {
        infr = shift(got.value, got.index + 1, 0);
      } else {
        throw new Error();
      }
      break;
    case "Ref":
      var got = module[term.name];
      if (got) {
        infr = got.type;
      } else {
        throw "Undefined reference: '" + term.name + "'.";
      };
      break;
    case "Typ":
      infr = Typ();
      break;
    case "All":
      var bind_typ = typecheck(term.bind, Typ(), module, ctx);
      var body_ctx = Ext(term.bind, ctx);
      var body_typ = typecheck(term.body, Typ(), module, body_ctx);
      infr = Typ();
      break;
    case "Lam":
      if (typv && typv.ctor === "All") {
        var body_ctx = Ext(typv.bind, ctx);
        var body_typ = typecheck(term.body, typv.body, module, body_ctx);
        infr = All(term.name, typv.bind, body_typ, term.eras);
      } else {
        throw "Lambda has a non-function type.";
      }
      break;
    case "App":
      var func_typ = reduce(typecheck(term.func, null, module, ctx));
      switch (func_typ.ctor) {
        case "All":
          var argm_typ = typecheck(term.argm, func_typ.bind, module, ctx);
          var term_typ = reduce(subst(func_typ.body, term.argm, 0), module);
          infr = term_typ;
          break;
        default:
          throw "Non-function application.";
      };
      break;
    case "Slf":
      var type_ctx = Ext(term, ctx);
      var type_typ = typecheck(term.type, typ, module, ctx);
      infr = Typ();
      break;
    case "Ins":
      var term_typ = reduce(term.type);
      switch (term_typ.ctor) {
        case "Slf":
          var self_typ = subst(term_typ.type, Ann(term.type, term, true), 0);
          var expr_typ = typecheck(term.expr, self_typ, module, ctx);
          infr = term.type;
          break;
        default:
          throw "Non-self instantiation.";
      };
      break;
    case "Eli":
      var expr_typ = reduce(typecheck(term.expr, null, module, ctx));
      switch (expr_typ.ctor) {
        case "Slf":
          infr = subst(expr_typ.type, term.expr, 0);
          break;
        default:
          throw "Non-self elimination.";
      };
      break;
    case "Ann":
      if (term.done) {
        infr = term.type;
      } else {
        infr = typecheck(term.expr, term.type, module, ctx);
      }
      break;
  };
  return type || infr;
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
  Typ,
  All,
  Lam,
  App,
  Slf,
  Ins,
  Eli,
  Ann,
  Ext,
  Nil,
  is_space,
  is_name,
  first_valid,
  drop_while,
  space,
  parse_str,
  parse_opt,
  parse_nam,
  parse_par,
  parse_all,
  parse_lam,
  parse_typ,
  parse_var,
  parse_slf,
  parse_ins,
  parse_eli,
  parse_app,
  parse_ann,
  parse_trm,
  parse_mod,
  stringify_trm,
  stringify_mod,
  find,
  shift,
  subst,
  to_high_order,
  to_low_order,
  reduce_high_order,
  normalize_high_order,
  reduce,
  normalize,
  typecheck,
  equal,
};
