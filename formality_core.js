const uf = require('@manubb/union-find');

// Term
// ====

function Var(indx) {
  return {ctor: "Var", indx};
};

function Ref(name) {
  return {ctor: "Ref", name};
};

function Typ() {
  return {ctor: "Typ"};
};

function All(name, bind, body, eras) {
  return {ctor: "All", name, bind, body, eras};
};

function Lam(name, body, eras) {
  return {ctor: "Lam", name, body, eras};
};

function App(func, argm, eras) {
  return {ctor: "App", func, argm, eras};
};

function Slf(name, type) {
  return {ctor: "Slf", name, type};
};

function Ins(type, expr) {
  return {ctor: "Ins", type, expr};
};

function Eli(expr) {
  return {ctor: "Eli", expr};
};

function Ann(expr, type, done) {
  return {ctor: "Ann", expr, type, done};
};

function Bound(indx) {
    return {ctor: "Bound", indx };
};
// List
// ====

function Ext(head, tail) {
  return {ctor: "Ext", head, tail};
};

function Nil() {
  return {ctor: "Nil"};
};

// Module
// ======

function Def(name, type, term) {
  return {ctor: "Def", name, type, term};
};

// Parsing
// =======

// Finds a value in a list
function find(list, cond, indx = 0) {
  switch (list.ctor) {
    case "Ext":
      if (cond(list.head, indx)) {
        return {value: list.head, index: indx};
      } else {
        return find(list.tail, cond, indx + 1);
      }
    case "Nil":
      return null;
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
  var [indx, skip] = parse_str("#{", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Slf(name, type)];
};

// Parses a self instantiation, `#inst{<term>}`
function parse_ins(code, indx, vars) {
  var [indx, skip] = parse_str("#inst{", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, expr] = parse_trm(code, indx, vars);
  return [indx, Ins(type, expr)];
};

// Parses a self elimination, `#elim{<term>}`
function parse_eli(code, indx, vars) {
  var [indx, skip] = parse_str("#elim{", code, space(code, indx));
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
function parse_trm(code, indx, vars = Nil()) {
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
  try {
    var [indx, name] = parse_nam(code, space(code, indx));
    var [indx, skip] = parse_str(":", code, space(code, indx));
    var [indx, type] = parse_trm(code, space(code, indx), Nil());
    var [indx, term] = parse_trm(code, space(code, indx), Nil());
    return Ext(Def(name, type, term), parse_mod(code, indx));
  } catch (e) {
    return Nil();
  }
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
      return "#{"+name+"} "+type;
    case "Ins":
      var type = stringify_trm(term.type, vars);
      var expr = stringify_trm(term.expr, vars);
      return "#inst{"+type+"} "+expr;
    case "Eli":
      var expr = stringify_trm(term.expr, vars);
      return "#elim{"+expr+"}";
    case "Ann":
      var expr = stringify_trm(term.expr, vars);
      var type = stringify_trm(term.type, vars);
      return expr+" :: "+type;
  }
};

function stringify_mod(mod) {
  switch (mod.ctor) {
    case "Ext":
      var name = mod.head.name;
      var type = stringify_trm(mod.head.type, Nil());
      var term = stringify_trm(mod.head.term, Nil());
      var defs = stringify_mod(mod.tail);
      return name + " : " + type + "\n  " + term + "\n\n" + defs;
    case "Nil":
      return "";
  }
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
    case "Bound":
      return Bound(term.indx);
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
    case "Bound":
      return Bound(term.indx);
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
    case "Bound":
      return Bound(term.indx);
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
    case "Bound":
      return Bound(term.indx);
  }
};

function reduce_high_order(term) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
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
      return Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func);
      switch (func.ctor) {
        case "Lam":
          return reduce_high_order(func.body(term.argm));
        default:
          return App(func, reduce_high_order(term.argm));
      };
    case "Slf":
      var name = term.name;
      var type = term.type;
      return Slf(name, type);
    case "Ins":
      return reduce_high_order(term.expr);
    case "Eli":
      return reduce_high_order(term.expr);
    case "Ann":
      return reduce_high_order(term.expr);
    case "Bound":
      return Bound(term.indx);
  };
};

function reduce_high_order(term) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
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
      return Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func);
      switch (func.ctor) {
        case "Lam":
          return reduce_high_order(func.body(term.argm));
        default:
          return App(func, reduce_high_order(term.argm));
      };
    case "Slf":
      var name = term.name;
      var type = term.type;
      return Slf(name, type);
    case "Ins":
      return reduce_high_order(term.expr);
    case "Eli":
      return reduce_high_order(term.expr);
    case "Ann":
      return reduce_high_order(term.expr);
    case "Bound":
      return Bound(term.indx);
  };
};

function normalize_high_order(term) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = normalize_high_order(term.bind);
      var body = x => normalize_high_order(term.body(x));
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = x => normalize_high_order(term.body(x));
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func);
      switch (func.ctor) {
        case "Lam":
          return normalize_high_order(func.body(term.argm));
        default:
          return App(func, normalize_high_order(term.argm));
      };
    case "Slf":
      var name = term.name;
      var type = normalize_high_order(term.type);
      return Slf(name, type);
    case "Ins":
      return normalize_high_order(term.expr);
    case "Eli":
      return normalize_high_order(term.expr);
    case "Ann":
      return normalize_high_order(term.expr);
    case "Bound":
      return Bound(term.indx);
  };
};

function reduce(term) {
  return to_low_order(reduce_high_order(to_high_order(term, Nil())), 0);
};

function normalize(term) {
  return to_low_order(normalize_high_order(to_high_order(term, Nil())), 0);
};

// Equality of terms
const equivalent = (map, x, y) => {
    if (map[x] && map[y]) return uf.find(map[x]) === uf.find(map[y]);
    return x === y;
}

const equate = (map, x, y) => {
    if (!map[x]) map[x] = uf.makeSet();
    if (!map[y]) map[y] = uf.makeSet();
    uf.union(map[x], map[y]);
}

const equate_terms = (map, term1, term2) => {
    equate(map, JSON.stringify(term1), JSON.stringify(term2));
}

const bind_free_vars = (term, initial_depth) => {
    const go = (term, depth) => {
        switch (term.ctor) {
        case "Var": {
            if (term.index < depth){
                return term;
            }
            var f_index = term.index - depth;
            return Bound(initial_depth - 1 - f_index);
        }
        case "Ref": return Ref(term.name);
        case "Typ": return Typ();
        case "All": return All(term.name, go(term.bind, depth), go(term.body, depth+1), term.eras);
        case "Lam": return Lam(term.name, go(term.bind, depth), go(term.body, depth+1), term.eras);
        case "App": return App(go(term.func, depth), go(term.argm, depth), term.eras);
        case "Slf": return Slf(term.name, go(term.type, depth+1));
        case "Ins": return Ins(term.type, go(term.expr, depth));
        case "Eli": return Eli(go(term.expr, depth));
        case "Ann": return Ann(go(term.expr, depth), go(term.type, depth), term.done);
        default:    return term;
        }
    }
    return go(term, 0);
}

const equivalent_terms = (map, term1, term2) => {
    if(equivalent(map, JSON.stringify(term1), JSON.stringify(term2))) return true;
    switch (term1.ctor + term2.ctor) {
    case "AllAll": return equivalent_terms(map, term1.bind, term2.bind) && equivalent_terms(map, term1.body, term2.body)
    case "LamLam": return equivalent_terms(map, term1.body, term2.body)
    case "AppApp": return equivalent_terms(map, term1.func, term2.func) && equivalent_terms(map, term1.argm, term2.argm)
    case "SlfSlf": return equivalent_terms(map, term1.type, term2.type)
    case "InsIns": return equivalent_terms(map, term1.expr, term2.expr)
    case "EliEli": return equivalent_terms(map, term1.expr, term2.expr)
    case "AnnAnn": return equivalent_terms(map, term1.expr, term2.expr)
    default:       return false;
    }
}

const same_node = (term1, term2, path) => {
    switch (term1.ctor + term2.ctor) {
    case "AllAll": return [[term1.bind, term2.bind, path], [subst(term1.body, Bound(path), 0), subst(term2.body, Bound(path), 0), path+1]]
    case "LamLam": return [[subst(term1.body, Bound(path), 0), subst(term2.body, Bound(path), 0), path+1]]
    case "AppApp": return [[term1.func, term2.func, path], [term1.argm, term2.argm, path]]
    case "SlfSlf": return [[subst(term1.type, Bound(path), 0), subst(term2.type, Bound(path), 0), path+1]]
    case "InsIns": return [[term1.expr, term2.expr, path]]
    case "EliEli": return [[term1.expr, term2.expr, path]]
    case "AnnAnn": return [[term1.expr, term2.expr, path]]
    default:       return [];
    }
}

const equal = (a, b, dep = 0) => {
    var map = {};
    const go = (list) => {
        if (list.length === 0) {
            return true;
        }
        let [a0, b0, path] = list[0];
        let a1 = reduce(a0);
        let b1 = reduce(b0);
        let eq = equivalent_terms(map, a1, b1);
        equate_terms(map, a0, a1);
        equate_terms(map, b0, b1);
        equate_terms(map, a1, b1);
        if (eq) return go(list.slice(1));
        else {
            let result = same_node(a1, b1, path);
            if (result.length == 0) { return false; }
            return go (list.slice(1).concat(result));
        }
    }
    return go([[a, b, dep]]);
}
exports.equal = equal;


// Type-Checking
// =============

function typecheck(term, type = null, ctx = Nil()) {
  var type = type ? reduce(type) : null;
  switch (term.ctor) {
    case "Var":
      var got = find(ctx, (x,i) => i === term.indx);
      if (got) {
        return shift(got.value, got.index + 1, 0);
      } else {
        throw new Error();
      }
    case "Typ":
      return Typ();
    case "All":
      var bind_typ = typecheck(term.bind, Typ(), ctx);
      var body_ctx = Ext(term.bind, ctx);
      var body_typ = typecheck(term.body, Typ(), body_ctx);
      return Typ();
    case "Lam":
      switch (type.ctor) {
        case "All":
          var body_ctx = Ext(type.bind, ctx);
          var body_typ = typecheck(term.body, type.body, body_ctx);
          return All(term.name, type.bind, body_typ, term.eras);
        default:
          throw "Lambda has a non-function type.";
      }
    case "App":
      var func_typ = reduce(typecheck(term.func, null, defs, ctx));
      switch (func_typ.ctor) {
        case "All":
          var argm_typ = typecheck(term.argm, func_typ.bind, ctx);
          var term_typ = reduce(subst(func_typ, term.argm));
          return term_typ;
        default:
          throw "Non-function application.";
      };
    case "Slf":
      var type_ctx = Ext(term, ctx);
      var type_typ = typecheck(term.type, typ, ctx);
      return Typ();
    case "Ins":
      var term_typ = reduce(term.type);
      switch (term_typ.ctor) {
        case "Slf":
          var self_typ = subst(term_typ.type, Ann(term.type, term, true), 0);
          var expr_typ = typecheck(term.expr, self_typ, ctx);
          return term.type;
        default:
          throw "Non-self instantiation.";
      };
    case "Eli":
      var expr_typ = reduce(typecheck(term.expr, null, ctx));
      switch (expr_typ.ctor) {
        case "Slf":
          return subst(expr_typ.type, term.expr, 0);
        default:
          throw "Non-self elimination.";
      };
    case "Ann":
      if (term.done) {
        return term.type;
      } else {
        return typecheck(term.expr, term.type, ctx);
      }
  };
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
  Def,
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
};
