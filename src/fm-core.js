// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An FM-Lang term is an ADT represented as a JSON.
const Var = (index, loc)                  => ["Var", {index},                  MEMO && ("^" + index)                             , loc];
const Typ = (loc)                         => ["Typ", {},                       MEMO && ("ty")                                    , loc];
const All = (name, bind, body, eras, loc) => ["All", {name, bind, body, eras}, MEMO && ("al" + (eras?"~":"") + bind[2] + body[2]), loc];
const Lam = (name, bind, body, eras, loc) => ["Lam", {name, bind, body, eras}, MEMO && ("lm" + (eras?"~":"") + body[2])          , loc];
const App = (func, argm, eras, loc)       => ["App", {func, argm, eras},       MEMO && ("ap" + (eras?"~":"") + func[2] + argm[2]), loc];
const Slf = (name, type, loc)             => ["Slf", {name, type},             MEMO && ("sf" + type[2])                          , loc];
const New = (type, expr, loc)             => ["New", {type, expr},             MEMO && expr[2]                                   , loc];
const Use = (expr, loc)                   => ["Use", {expr},                   MEMO && expr[2]                                   , loc];
const Num = (loc)                         => ["Num", {},                       MEMO && ("wd")                                    , loc];
const Val = (numb, loc)                   => ["Val", {numb},                   MEMO && ("[" + numb + "]")                        , loc];
const Op1 = (func, num0, num1, loc)       => ["Op1", {func, num0, num1},       MEMO && ("o1" + func + num0[2] + num1[2])         , loc];
const Op2 = (func, num0, num1, loc)       => ["Op2", {func, num0, num1},       MEMO && ("o2" + func + num0[2] + num1[2])         , loc];
const Ite = (cond, if_t, if_f, loc)       => ["Ite", {cond, if_t, if_f},       MEMO && ("ie" + cond[2] + if_t[2] + if_f[2])      , loc];
const Ann = (type, expr, done, loc)       => ["Ann", {type, expr, done},       MEMO && expr[2]                                   , loc];
const Log = (msge, expr, loc)             => ["Log", {msge, expr},             MEMO && expr[2]                                   , loc];
const Hol = (name, loc)                   => ["Hol", {name},                   MEMO && ("{?" + name + "?}")                      , loc];
const Ref = (name, eras, loc)             => ["Ref", {name, eras},             MEMO && ("{" + name + "}")                        , loc];
var MEMO  = true;

// ::::::::::::::::::
// :: Substitution ::
// ::::::::::::::::::

// Shifts a term
// shift : Maybe(Term) -> Nat -> Nat -> Maybe(Term)
const shift = (term, inc, depth) => {
  if  (!term) {
    return null;
  } else {
    const [f, [c, t, h, l], i, d] = [shift, term, inc, depth];
    switch (c) {
      case "Var": return Var(t.index < d ? t.index : t.index + i, l);
      case "Typ": return Typ(l);
      case "All": return All(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "App": return App(f(t.func, i, d), f(t.argm, i, d), t.eras, l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Op2": return Op2(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Ite": return Ite(f(t.cond, i, d), f(t.if_t, i, d), f(t.if_f, i, d), l);
      case "Slf": return Slf(t.name, f(t.type, i, d+1), l);
      case "New": return New(f(t.type, i, d), f(t.expr, i, d), l);
      case "Use": return Use(f(t.expr, i, d), l);
      case "Ann": return Ann(f(t.type, i, d), f(t.expr, i, d), t.done, l);
      case "Log": return Log(f(t.msge, i, d), f(t.expr, i, d), l);
      case "Hol": return Hol(t.name, l);
      case "Ref": return Ref(t.name, t.eras, l);
    }
  }
}

// shift : Maybe(Term) -> Term -> Nat -> Maybe(Term)
const subst = (term, val, depth) => {
  if  (!term) {
    return null;
  } else {
    const [s, f, [c, t, h, l], v, d] = [shift, subst, term, val, depth];
    switch (c) {
      case "Var": return d === t.index ? v : Var(t.index - (t.index > d ? 1 : 0), l);
      case "Typ": return Typ(l);
      case "All": return All(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "App": return App(f(t.func, v, d), f(t.argm, v, d), t.eras, l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Op2": return Op2(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Ite": return Ite(f(t.cond, v, d), f(t.if_t, v, d), f(t.if_f, v, d), l);
      case "Slf": return Slf(t.name, f(t.type, s(v,1,0), d+1), l);
      case "New": return New(f(t.type, v, d), f(t.expr, v, d), l);
      case "Use": return Use(f(t.expr, v, d), l);
      case "Ann": return Ann(f(t.type, v, d), f(t.expr, v, d), t.done, l);
      case "Log": return Log(f(t.msge, v, d), f(t.expr, v, d), l);
      case "Hol": return Hol(t.name, l);
      case "Ref": return Ref(t.name, t.eras, l);
    }
  }
}

// subst_many : Term -> [Term] -> Nat -> Term
const subst_many = (term, vals, depth) => {
  for (var i = 0; i < vals.length; ++i) {
    term = subst(term, shift(vals[i], vals.length - i - 1, 0), depth + vals.length - i - 1);
  }
  return term;
}

// ::::::::::::::::
// :: Evaluation ::
// ::::::::::::::::

const names_new = null;

const names_ext = (bind, name, rest) => {
  return {bind, name, rest};
}

const names_get = (i, names) => {
  for (var k = 0; k < i; ++k) {
    names = names ? names.rest : null;
  }
  return names ? {bind: names.bind, name: names.name} : null;
};

const names_len = (names) => {
  for (var i = 0; names; ++i) {
    names = names.rest;
  }
  return i;
};

const names_arr = names => {
  return names ? [names.name].concat(names_arr(names.rest)) : [];
};

const names_var = (i, names) => {
  const got = names_get(i, names);
  return got ? got.bind : Var(names_len(names) - i - 1);
};

// Reduces a term to normal form or head normal form
const reduce = (term, defs, opts = {}) => {
  const apply = (func, argm, eras, names) => {
    var func = reduce(func, names);
    if (!opts.no_app && func[0] === "Lam") {
      return reduce(func[1].body(argm), names);
    } else if (!opts.no_app && func[0] === "Dup") {
      return Dup(func[1].name, func[1].expr, x => weak_reduce(App(func[1].body(x), argm, eras), names_ext(x, func[1].name, names)));
    } else {
      return App(func, weak_reduce(argm, names), eras);
    }
  };
  const op1 = (func, num0, num1, names) => {
    var num0 = reduce(num0, names);
    if (!opts.no_op1 && num0[0] === "Val") {
      switch (func) {
        case ".+."   : return Val(num0[1].numb + num1[1].numb);
        case ".-."   : return Val(num0[1].numb - num1[1].numb);
        case ".*."   : return Val(num0[1].numb * num1[1].numb);
        case "./."   : return Val(num0[1].numb / num1[1].numb);
        case ".%."   : return Val(num0[1].numb % num1[1].numb);
        case ".**."  : return Val(num0[1].numb ** num1[1].numb);
        case ".&."   : return Val((num0[1].numb & num1[1].numb) >>> 0);
        case ".|."   : return Val((num0[1].numb | num1[1].numb) >>> 0);
        case ".^."   : return Val((num0[1].numb ^ num1[1].numb) >>> 0);
        case ".~."   : return Val(~ num1[1].numb);
        case ".>>>." : return Val((num0[1].numb >>> num1[1].numb));
        case ".<<."  : return Val((num0[1].numb << num1[1].numb));
        case ".>."   : return Val(num0[1].numb > num1[1].numb ? 1 : 0);
        case ".<."   : return Val(num0[1].numb < num1[1].numb ? 1 : 0);
        case ".==."  : return Val(num0[1].numb === num1[1].numb ? 1 : 0);
        default      : throw "[NORMALIZATION-ERROR]\nUnknown primitive: " + func + ".";
      }
    } else {
      return Op1(func, num0, num1);
    }
  };
  const op2 = (func, num0, num1, names) => {
    var num1 = reduce(num1, names);
    if (!opts.no_op2 && num1[0] === "Val") {
      return reduce(Op1(func, num0, num1, null), names);
    } else {
      return Op2(func, weak_reduce(num0, names), num1);
    }
  };
  const if_then_else = (cond, if_t, if_f, names) => {
    var cond = reduce(cond, names);
    if (!opts.no_ite && cond[0] === "Val") {
      return cond[1].numb > 0 ? reduce(if_t, names) : reduce(if_f, names);
    } else {
      return Ite(cond, weak_reduce(if_t, names), weak_reduce(if_f, names));
    }
  };
  const dereference = (name, eras, names) => {
    if (!opts.no_ref && defs[name]) {
      var value = defs[name];
      var value = eras ? erase(value) : value;
      return reduce(unquote(value), names_new);
    } else {
      return Ref(name, eras);
    }
  };
  const unhole = (name, names) => {
    if (!opts.no_hol && opts.holes && opts.holes[name] && opts.holes[name].value) {
      var depth = (opts.depth || 0) + names_len(names);
      var value = opts.holes[name].value;
      var value = shift(value, depth - opts.holes[name].depth, 0);
      return reduce(unquote(value, names), names);
    } else {
      return Hol(name);
    }
  };
  const use = (expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_use && expr[0] === "New") {
      return reduce(expr[1].expr, names);
    } else {
      return Use(expr);
    }
  };
  const ann = (type, expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_ann) {
      return expr;
    } else {
      return Ann(weak_reduce(type, names), expr);
    }
  };
  const log = (msge, expr, names) => {
    var msge = reduce(msge, names);
    var expr = reduce(expr, names);
    if (opts.logs) {
      var nams = names_arr(names).reverse();
      var show = require("./fm-lang").show;
      console.log(show(quote(msge, 0), names || null));
    }
    return expr;
  };
  const unquote = (term, names = null) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return names_var(term.index, names);
      case "Typ": return Typ();
      case "All": return All(term.name, unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "App": return App(unquote(term.func, names), unquote(term.argm, names), term.eras);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Op2": return Op2(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Ite": return Ite(unquote(term.cond, names), unquote(term.if_t, names), unquote(term.if_f, names));
      case "Slf": return Slf(term.name, x => unquote(term.type, names_ext(x, null, names)));
      case "New": return New(unquote(term.type, names), unquote(term.expr, names));
      case "Use": return Use(unquote(term.expr, names));
      case "Ann": return Ann(unquote(term.type, names), unquote(term.expr, names), term.done);
      case "Log": return Log(unquote(term.msge, names), unquote(term.expr, names));
      case "Hol": return Hol(term.name);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  const reduce = (term, names = null) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(term.index);
      case "Typ": return Typ();
      case "All": return All(term.name, weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "App": return apply(term.func, term.argm, term.eras, names);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return op1(term.func, term.num0, term.num1, names);
      case "Op2": return op2(term.func, term.num0, term.num1, names);
      case "Ite": return if_then_else(term.cond, term.if_t, term.if_f, names);
      case "Slf": return Slf(term.name, x => weak_reduce(term.type(x), names_ext(x, term.name, names)));
      case "New": return New(weak_reduce(term.type, names), weak_reduce(term.expr, names));
      case "Use": return use(term.expr, names);
      case "Ann": return ann(term.type, term.expr, names);
      case "Log": return log(term.msge, term.expr, names);
      case "Hol": return unhole(term.name, names);
      case "Ref": return dereference(term.name, term.eras, names);
    }
  };
  const quote = (term, depth) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(depth - 1 - term.index);
      case "Typ": return Typ();
      case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Ite": return Ite(quote(term.cond, depth), quote(term.if_t, depth), quote(term.if_f, depth));
      case "Slf": return Slf(term.name, quote(term.type(Var(depth)), depth + 1));
      case "New": return New(quote(term.type, depth), quote(term.expr, depth));
      case "Use": return Use(quote(term.expr, depth));
      case "Ann": return Ann(quote(term.type, depth), quote(term.expr, depth), term.done);
      case "Log": return Log(quote(term.msge, depth), quote(term.expr, depth));
      case "Hol": return Hol(term.name);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  const weak_reduce = (term, names) => {
    return opts.weak ? term : reduce(term, names);
  };
  var term = typeof term === "string" ? Ref(term, false) : term;
  MEMO = false;
  var unquoted = unquote(term);
  var reduced = reduce(unquoted);
  MEMO = true;
  var quoted = quote(reduced, 0);
  return quoted;
};

// erase : Term -> Term
const erase = (term) => {
  const [f,[c,t],e] = [erase, term, Hol("<erased>")];
  switch (c) {
    case "Var": return Var(t.index);
    case "Typ": return Typ();
    case "All": return All(t.name, f(t.bind), f(t.body), t.eras);
    case "Lam": return t.eras ? f(subst(t.body, e, 0)) : Lam(t.name, null, f(t.body), t.eras);
    case "App": return t.eras ? f(t.func)              : App(f(t.func), f(t.argm), t.eras);
    case "Num": return Num();
    case "Val": return Val(t.numb);
    case "Op1": return Op1(t.func, f(t.num0), f(t.num1));
    case "Op2": return Op2(t.func, f(t.num0), f(t.num1));
    case "Ite": return Ite(f(t.cond), f(t.if_t), f(t.if_f));
    case "Slf": return Slf(t.name, f(t.type));
    case "New": return f(t.expr);
    case "Use": return f(t.expr);
    case "Ann": return f(t.expr);
    case "Log": return Log(f(t.msge), f(t.expr));
    case "Hol": return Hol(t.name);
    case "Ref": return Ref(t.name, true);
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// equal : Term -> Term -> Number -> Defs -> Opts -> Bool
const equal = (a, b, depth, defs={}, opts={}) => {

  const Eqs = (a, b, d) => ["Eqs", {a, b, d}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const And = (x,y)     => Bop(false, x, y);
  const Or  = (x,y)     => Bop(true, x, y);
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eqs":
        var {a, b, d} = node[1];

        // Gets whnfs with and without dereferencing
        var op = {weak:1, holes:opts.holes, depth:d};
        var ax = reduce(a, {}, op);
        var bx = reduce(b, {}, op);
        var ay = reduce(a, defs, op);
        var by = reduce(b, defs, op);

        // Optimization: if hashes are equal, then a == b prematurely
        if (a[2] === b[2] || ax[2] === bx[2] || ay[2] === by[2]) {
          return Val(true);
        }

        // If non-deref whnfs are app and fields are equal, then a == b
        var x = null;
        if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
          x = Val(true);
        } else if (ax[0] === "Hol" || bx[0] === "Hol") {
          var hole = ax[0] === "Hol" ? ax : bx[0] === "Hol" ? bx : null;
          var expr = ax[0] === "Hol" ? bx : bx[0] === "Hol" ? ax : null;
          if (hole && opts.holes[hole[1].name]) {
            var expr_s = shift(expr, opts.holes[hole[1].name].depth - d, 0);
            var hole_v = opts.holes[hole[1].name].value;
            var hole_d = opts.holes[hole[1].name].depth;
            if (hole_v === undefined) {
              opts.holes[hole[1].name].value = expr_s;
            } else if (hole_v !== null && !equal(hole_v, expr_s, hole_d, defs, opts)) {
              opts.holes[hole[1].name].value = null;
            }
            x = Val(true);
          }
        } else if (ax[0] === "App" && bx[0] === "App") {
          var func = Eqs(ax[1].func, bx[1].func, d);
          var argm = Eqs(ax[1].argm, bx[1].argm, d);
          x = And(func, argm);
        }

        // If whnfs are equal and fields are equal, then a == b
        var y = null;
        switch (ay[0] + "-" + by[0]) {
          case "Var-Var": y = Val(ay[1].index === by[1].index); break;
          case "Typ-Typ": y = Val(true); break;
          case "All-All": y = And(And(Eqs(ay[1].bind, by[1].bind, d), Eqs(ay[1].body, by[1].body, d+1)), Val(ay[1].eras === by[1].eras)); break;
          case "Lam-Lam": y = And(Eqs(ay[1].body, by[1].body, d+1), Val(ay[1].eras === by[1].eras)); break;
          case "App-App": y = And(And(Eqs(ay[1].func, by[1].func, d), Eqs(ay[1].argm, by[1].argm, d)), Val(ay[1].eras === by[1].eras)); break;
          case "Num-Num": y = Val(true); break;
          case "Val-Val": y = Val(ay[1].numb === by[1].numb); break;
          case "Op1-Op1": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Val(ay[1].num1[1].numb === ay[1].num1[1].numb))); break;
          case "Op2-Op2": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Eqs(ay[1].num1, by[1].num1, d))); break;
          case "Ite-Ite": y = And(Eqs(ay[1].cond, by[1].cond, d), Eqs(ay[1].if_t, by[1].if_t, d), Eqs(ay[1].if_f, by[1].if_f, d)); break;
          case "Slf-Slf": y = Eqs(ay[1].type, by[1].type, d+1); break;
          case "New-New": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Use-Use": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Log-Log": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Ann-Ann": y = Eqs(ay[1].expr, by[1].expr, d); break;
          default:        y = Val(false);
        }

        return x ? Bop(true, x, y) : y;

      // A binary operation (or / and)
      case "Bop":
        var {v, x, y} = node[1];
        if (x[0] === "Val") {
          return x[1].v === v ? Val(v) : y;
        } else if (y[0] === "Val") {
          return y[1].v === v ? Val(v) : x;
        } else {
          var X = step(x);
          var Y = step(y);
          return Bop(v, X, Y);
        }

      // A result value (true / false)
      case "Val":
        return node;
    }
  }

  // Expands the search tree until it finds an answer
  var tree = Eqs(erase(a), erase(b), depth);
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
};

// ::::::::::::::
// :: Contexts ::
// ::::::::::::::

const ctx_new = {length: 0};

const ctx_ext = (name, term, type, eras, ctx) => {
  return {name, term, type, eras, length: ctx.length + 1, rest: ctx};
};

const ctx_get = (i, ctx, use) => {
  if (i < 0) {
    return null;
  }
  for (var k = 0; k < i; ++k) {
    if (ctx.rest.length === 0) {
      return null;
    } else {
      ctx = ctx.rest;
    }
  }
  var got = {
    name: ctx.name,
    term: ctx.term ? shift(ctx.term, i + 1, 0) : Var(i),
    type: shift(ctx.type, i + 1, 0),
    eras: ctx.eras,
  };
  return got;
};

const ctx_str = (ctx, show) => {
  const pad_right = (len, chr, str) => {
    while (str.length < len) {
      str += chr;
    }
    return str;
  };
  var txt = [];
  var idx = 0;
  var max_len = 0;
  for (var c = ctx; c.length > 0; c = c.rest) {
    max_len = Math.max(c.name.length, max_len);
  }
  var depth = 0;
  for (var c = ctx; c.length > 0; c = c.rest) {
    var name = c.name;
    var type = c.type;
    var tstr = show(type, ctx_names(c.rest));
    txt.push("\x1b[2m- " + pad_right(max_len, " ", c.name) + " : " + tstr + "\x1b[0m");
    depth += 1;
  }
  return txt.reverse().join("\n");
};

const ctx_names = (ctx) => {
  var names = [];
  while (ctx.length > 0) {
    names.push(ctx.name);
    ctx = ctx.rest;
  }
  return names.reverse();
};

// :::::::::::::::::::
// :: Type Checking ::
// :::::::::::::::::::

const {marked_code, random_excuse} = require("./fm-error.js");

// Checks if a term is well-typed. Does NOT check
// termination and affinity. Those will be separate.
// typecheck : String -> Maybe(Term) -> Defs -> Opts -> Term
const typecheck = (name, expect, defs = {}, opts = {}) => {
  var holes = {};
  var types = {};
  var anns  = [];

  const weak_normal = (term, depth) => {
    return reduce(term, defs, {holes, weak:true, depth});
  };

  const display_normal = (term, depth) => {
    return reduce(term, {}, {holes, weak:false});
  };

  const subst_holes = (term, depth) => {
    return reduce(term, {}, {holes, depth, weak: false,
      no_app:1, no_ref:1, no_op1:1,
      no_op2:1, no_use:1, no_ann:1});
  };

  const print = (term, names = []) => {
    var show = require("./fm-lang").show;
    var term = display_normal(term, names.length);
    var text = show(term, names);
    var text = "\x1b[2m" + text + "\x1b[0m";
    return text;
  };

  const register_hole = (ctx, term, expect) => {
    if (!holes[term[1].name]) {
      holes[term[1].name] = {
        error: {ctx, name: term[1].name, expect},
        local: null,
        depth: ctx.length,
        value: undefined,
      };
    }
  };

  // Checks and returns the type of a term
  const typecheck = (term, expect, ctx = ctx_new, erased = false) => {
    const do_error = (str)  => {
      var err_msg = "";
      err_msg += "[ERROR]\n" + str;
      err_msg += "\n- When checking " + print(term, ctx_names(ctx))
      if (ctx.length > 0) {
        err_msg += "\n- With context:\n" + ctx_str(ctx, print);
      }
      if (term[3]) {
        err_msg += "\n- On line " + (term[3].row+1) + ", col " + (term[3].col) + ", file \x1b[4m" + term[3].file + ".fm\x1b[0m:";
        err_msg += "\n" + marked_code(term[3]);
      }
      throw err_msg;
    };

    const do_match = (a, b) => {
      if (!equal(a, b, ctx.length, defs, {holes})) {
        do_error("Type mismatch."
          + "\n- Found type... " + print(a, ctx_names(ctx))
          + "\n- Instead of... " + print(b, ctx_names(ctx)));
      }
    };

    if (expect) {
      var expect_nf = weak_normal(expect, ctx.length);
    } else {
      var expect_nf = null;
    }

    var type;
    switch (term[0]) {
      case "Var":
        var got = ctx_get(term[1].index, ctx);
        if (got) {
          if (got.eras && !erased) {
            do_error("Use of erased variable `" + got.name + "` in non-erased position.");
          }
          type = got.type;
        } else {
          do_error("Unbound variable.");
        }
        break;
      case "Typ":
        type = Typ();
        break;
      case "All":
        if (expect_nf && expect_nf[0] !== "Typ") {
          do_error("The inferred type of a forall (example: "
            + print(All("x", Ref("A"), Ref("B"), false), ctx_names(ctx))
            + ") isn't "
            + print(Typ(), ctx_names(ctx))
            + ".\n- Inferred type is "
            + print(expect_nf, ctx_names(ctx)));
        }
        var bind_t = typecheck(term[1].bind, Typ(), ctx, true);
        var ex_ctx = ctx_ext(term[1].name, null, term[1].bind, term[1].eras, ctx);
        var body_t = typecheck(term[1].body, Typ(), ex_ctx, true);
        type = Typ();
        break;
      case "Lam":
        var bind_v = expect_nf && expect_nf[0] === "All" ? expect_nf[1].bind : term[1].bind;
        if (bind_v === null && expect_nf === null) {
          do_error("Can't infer non-annotated lambda.");
        }
        if (bind_v === null && expect_nf !== null) {
          do_error("The inferred type of a lambda (example: "
            + print(Lam("x",null,Ref("f"),false), ctx_names(ctx))
            + ") isn't forall (example: "
            + print(All("x", Ref("A"), Ref("B"), false), ctx_names(ctx))
            + ").\n- Inferred type is "
            + print(expect_nf, ctx_names(ctx)));
        }
        var bind_t = typecheck(bind_v, Typ(), ctx, true);
        var ex_ctx = ctx_ext(term[1].name, null, bind_v, term[1].eras, ctx);
        var body_t = typecheck(term[1].body, expect_nf && expect_nf[0] === "All" ? expect_nf[1].body : null, ex_ctx, erased);
        var body_T = typecheck(body_t, Typ(), ex_ctx, true);
        type = All(term[1].name, bind_v, body_t, term[1].eras);
        break;
      case "App":
        var func_t = typecheck(term[1].func, null, ctx, erased);
        var func_t = weak_normal(func_t, ctx.length);
        if (func_t[0] !== "All") {
          do_error("Attempted to apply a value that isn't a function.");
        }
        var argm_t = typecheck(term[1].argm, func_t[1].bind, ctx, term[1].eras || erased);
        if (func_t[1].eras !== term[1].eras) {
          do_error("Mismatched erasure.");
        }
        type = subst(func_t[1].body, Ann(func_t[1].bind, term[1].argm, false), 0);
        break;
      case "Num":
        type = Typ();
        break;
      case "Val":
        type = Num();
        break;
      case "Op1":
      case "Op2":
        //if (expect_nf !== null && expect_nf[0] !== "Num") {
          //do_error("The inferred type of a numeric operation (example: "
            //+ print(Op2(term[1].func, Ref("x"), Ref("y")), ctx_names(ctx))
            //+ ") isn't "
            //+ print(Num(), ctx_names(ctx))
            //+ ".\n- Inferred type is "
            //+ print(expect_nf, ctx_names(ctx)));
        //}
        var num0_t = typecheck(term[1].num0, Num(), ctx, erased);
        var num1_t = typecheck(term[1].num1, Num(), ctx, erased);
        type = Num();
        break;
      case "Ite":
        var cond_t = typecheck(term[1].cond, null, ctx, erased);
        var cond_t = weak_normal(cond_t, ctx.length);
        if (cond_t[0] !== "Num") {
          do_error("Attempted to use if on a non-numeric value.");
        }
        var if_t_t = typecheck(term[1].if_t, expect_nf, ctx, erased);
        var if_t_f = typecheck(term[1].if_f, if_t_t, ctx, erased);
        type = expect_nf || if_t_t;
        break;
      case "Slf":
        var ex_ctx = ctx_ext(term[1].name, null, term, false, ctx);
        var type_t = typecheck(term[1].type, Typ(), ex_ctx, true);
        type = Typ();
        break;
      case "New":
        var ttyp = weak_normal(term[1].type, ctx.length);
        if (ttyp[0] !== "Slf") {
          do_error("Attempted to make an instance of a type that isn't self.");
        }
        var ttyp_t = typecheck(ttyp, null, ctx, true);
        var expr_t = typecheck(term[1].expr, subst(ttyp[1].type, Ann(ttyp, term, true), 0), ctx, erased);
        type = term[1].type;
        break;
      case "Use":
        var expr_t = typecheck(term[1].expr, null, ctx, erased);
        var expr_t = weak_normal(expr_t, ctx.length);
        if (expr_t[0] !== "Slf") {
          do_error("Attempted to use a value that isn't a self type.");
        }
        type = subst(expr_t[1].type, term[1].expr, 0);
        break;
      case "Ann":
        if (!term[1].done) {
          term[1].done = true;
          anns.push(term);
          try {
            var type_t = typecheck(term[1].type, Typ(), ctx, true);
            var expr_t = typecheck(term[1].expr, term[1].type, ctx,erased);
            type = term[1].type;
          } catch (e) {
            term[1].done = false;
            throw e;
          }
        } else {
          type = term[1].type;
        }
        break;
      case "Log":
        var msge_v = term[1].msge;
        try {
          var msge_t = typecheck(msge_v, null, ctx, true);
          var msge_t = display_normal(erase(msge_t), ctx.length);
        } catch (e) {
          console.log(e);
          var msge_t = Hol("");
        }
        if (opts.logs) {
          console.log("[LOG]");
          console.log("Term: " + print(msge_v, ctx_names(ctx)));
          console.log("Type: " + print(msge_t, ctx_names(ctx)) + "\n");
        }
        var expr_t = typecheck(term[1].expr, expect, ctx, erased);
        type = expr_t;
        break;
      case "Hol":
        register_hole(ctx, term, expect);
        type = expect || Hol(term[1].name + "_type");
        break;
      case "Ref":
        if (!defs[term[1].name]) {
          do_error("Undefined reference: `" + term[1].name + "`.");
        } else if (!types[term[1].name]) {
          var dref_t = typecheck(defs[term[1].name], null, ctx_new, erased);
          if (!types[term[1].name]) {
            var dref_t = subst_holes(dref_t, 0);
            // Substitutes holes on the original def
            defs[term[1].name] = subst_holes(defs[term[1].name], 0);
            if (defs[term[1].name][0] === "Ann") {
              defs[term[1].name][1].done = true;
            } else {
              defs[term[1].name] = Ann(dref_t, defs[term[1].name], true);
            }
            types[term[1].name] = dref_t;
          }
        }
        type = types[term[1].name];
        break;
      default:
        throw "TODO: type checker for " + term[0] + ".";
    }
    if (expect) {
      do_match(type, expect);
    }
    return type;
  };

  try {
    // Type-checks the term
    var type = typecheck(Ref(name, false), expect);

    // Afterwards, prints hole msgs
    for (var hole_name in holes) {
      if (!holes[hole_name].value || hole_name[0] !== "_") {
        var info = holes[hole_name].error;
        var msg = "";
        msg += "Found hole" + (info.name ? ": '" + info.name + "'" : "") + ".\n";
        if (info.expect) {
          msg += "- With goal... " + print(info.expect, ctx_names(info.ctx)) + "\n";
        }
        if (holes[hole_name].value) {
          msg += "- Solved as... " + print(holes[hole_name].value, ctx_names(info.ctx)) + "\n";
        } else {
          msg += "- Couldn't find a solution.\n";
        }
        var cstr = ctx_str(info.ctx, print);
        msg += "- With context:\n" + (cstr.length > 0 ? cstr + "\n" : "");
        console.log(msg);
      }
    }

    // If so, normalize it to an user-friendly form and return
    type = display_normal(type, 0);

    return type;

  // In case there is an error, adjust and throw
  } catch (e) {
    if (typeof e === "string") {
      throw e;
    } else {
      console.log(e);
      throw "Sorry, the type-checker couldn't handle your input.";
    }
  }
};

// :::::::::::::::::::::::
// :: Affinity Checking ::
// :::::::::::::::::::::::

const uses = (term, depth) => {
  switch (term[0]) {
    case "Var": return term[1].index === depth ? 1 : 0;
    case "Lam":
      var body = uses(term[1].body, depth + 1);
      return body;
    case "App":
      var func = uses(term[1].func, depth);
      var argm = term[1].eras ? 0 : uses(term[1].argm, depth);
      return func + argm;
    case "Op1":
      var num0 = uses(term[1].num0, depth);
      var num1 = uses(term[1].num1, depth);
      return num0 + num1;
    case "Op2":
      var num0 = uses(term[1].num0, depth);
      var num1 = uses(term[1].num1, depth);
      return num0 + num1;
    case "Ite":
      var cond = uses(term[1].cond, depth);
      var if_t = uses(term[1].if_t, depth);
      var if_f = uses(term[1].if_f, depth);
      return cond + if_t + if_f;
    case "New":
      var expr = uses(term[1].expr, depth);
      return expr;
    case "Use":
      var expr = uses(term[1].expr, depth);
      return expr;
    case "Ann":
      var expr = uses(term[1].expr, depth);
      return expr;
    case "Log":
      var expr = uses(term[1].expr, depth);
      return expr;
    default:
      return 0;
  }
};

const is_affine = (term, defs, seen = {}) => {
  switch (term[0]) {
    case "Lam":
      var self = uses(term[1].body, 0) <= 1;
      var body = is_affine(term[1].body, defs, seen);
      return self && body;
    case "App":
      var func = is_affine(term[1].func, defs, seen);
      var argm = term[1].eras ? true : is_affine(term[1].argm, defs, seen);
      return func && argm;
    case "Op1":
      var num0 = is_affine(term[1].num0, defs, seen);
      var num1 = is_affine(term[1].num1, defs, seen);
      return num0 && num1;
    case "Op2":
      var num0 = is_affine(term[1].num0, defs, seen);
      var num1 = is_affine(term[1].num1, defs, seen);
      return num0 && num1;
    case "Ite":
      var cond = is_affine(term[1].cond, defs, seen);
      var if_t = is_affine(term[1].if_t, defs, seen);
      var if_f = is_affine(term[1].if_t, defs, seen);
      return cond && if_t && if_f;
    case "New":
      var expr = is_affine(term[1].expr, defs, seen);
      return expr;
    case "Use":
      var expr = is_affine(term[1].expr, defs, seen);
      return expr;
    case "Ann":
      var expr = is_affine(term[1].expr, defs, seen);
      return expr;
    case "Log":
      var expr = is_affine(term[1].expr, defs, seen);
      return expr;
    case "Ref":
      if (seen[term[1].name]) {
        return true;
      } else {
        var seen = {...seen, [term[1].name]: true};
        return is_affine(defs[term[1].name], defs, seen);
      }
    default:
      return true;
  }
};

// ::::::::::::::::::::::::
// :: Elementarity Check ::
// ::::::::::::::::::::::::

// TODO: this should check if a term is typeable in EAL and,
// thus, compatible with bookkeeping free optimal
// reductions. Previously, we used box annotations, allowing
// the programmer to evidence the complexity class, but the
// system was considered too inconvenient. Since the problem
// of infering boxes has been proven to be solveable
// quickly, I've removed box annotations in favor of a box
// inferencer, but it must be done. 

function is_elementary(term) {
  return false;
};

// ::::::::::::::::::::::::::
// :: Termination Checking ::
// ::::::::::::::::::::::::::

// TODO: right now, this only verifies if recursion is used.
// Checking for structural recursion would allow more
// programs to pass the termination check.

const is_terminating = (term, defs, seen = {}) => {
  switch (term[0]) {
    case "Lam":
      var body = is_terminating(term[1].body, defs, seen);
      return body;
    case "App":
      var func = is_terminating(term[1].func, defs, seen);
      var argm = term[1].eras || is_terminating(term[1].argm, defs, seen);
      return func && argm;
    case "Op1":
      var num0 = is_terminating(term[1].num0, defs, seen);
      var num1 = is_terminating(term[1].num1, defs, seen);
      return num0 && num1;
    case "Op2":
      var num0 = is_terminating(term[1].num0, defs, seen);
      var num1 = is_terminating(term[1].num1, defs, seen);
      return num0 && num1;
    case "Ite":
      var cond = is_terminating(term[1].cond, defs, seen);
      var if_t = is_terminating(term[1].if_t, defs, seen);
      var if_f = is_terminating(term[1].if_f, defs, seen);
      return cond && if_t && if_f;
    case "Ann":
      var expr = is_terminating(term[1].expr, defs, seen);
      return expr;
    case "New":
      var expr = is_terminating(term[1].expr, defs, seen);
      return expr;
    case "Use":
      var expr = is_terminating(term[1].expr, defs, seen);
      return expr;
    case "Log":
      var expr = is_terminating(term[1].expr, defs, seen);
      return expr;
    case "Ref":
      if (seen[term[1].name]) {
        return false;
      } else {
        var seen = {...seen, [term[1].name]: true};
        return is_terminating(defs[term[1].name], defs, seen);
      }
    default:
      return true;
  }
};

module.exports = {
  Var, Typ, All, Lam,
  App, Slf, New, Use,
  Ann, Log, Hol, Ref,
  Num, Val, Op1, Op2, Ite,
  equal,
  erase,
  reduce,
  shift,
  subst,
  subst_many,
  typecheck,
  uses,
  is_affine,
  is_elementary,
  is_terminating,
};
