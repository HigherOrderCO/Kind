// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An FM-Lang term is an ADT represented as a JSON.
// - Var: a variable
// - Typ: the type of types, `Type`
// - All: the dependent function type, `{x : A} -> B`, optionally erased
// - Lam: a lambda, `{x} => B`, optionally erased/annotated
// - App: an application `f(a)`, optionally erased
// - Num: type of a native number
// - Val: value of a native number
// - Op1: partially applied binary numeric operation, `|n + k|`, with `k` fixed
// - Op2: binary numeric operation, `|x + y|`
// - Ite: if-then-else, `if n p`,  with a numeric conditional `n`, and two branches in a pair `p`
// - Cpy: copies a number, `cpy x = a; b`
// - Sig: type of a dependent pair, `[x : A, B(x)]`, or of a subset type, `[x : A ~ B(x)]`
// - Ann: an explicit type annotaion, `: A a`
// - Log: debug-prints a term during evaluation
// - Hol: a type-hole
// - Ref: a reference to a global def
const Var = (index, loc)                  => ["Var", {index},                  MEMO && ("^" + index)                             , loc];
const Typ = (loc)                         => ["Typ", {},                       MEMO && ("ty")                                    , loc];
const Tid = (expr, loc)                   => ["Tid", {expr},                   MEMO && expr[2]                                   , loc];
const Utt = (expr, loc)                   => ["Utt", {expr},                   MEMO && ("ut" + expr[2])                          , loc];
const Utv = (expr, loc)                   => ["Utv", {expr},                   MEMO && ("uv" + expr[2])                          , loc];
const Ute = (expr, loc)                   => ["Ute", {expr},                   MEMO && ("ue" + expr[2])                          , loc];
const All = (name, bind, body, eras, loc) => ["All", {name, bind, body, eras}, MEMO && ("al" + (eras?"~":"") + bind[2] + body[2]), loc];
const Lam = (name, bind, body, eras, loc) => ["Lam", {name, bind, body, eras}, MEMO && ("lm" + (eras?"~":"") + body[2])          , loc];
const App = (func, argm, eras, loc)       => ["App", {func, argm, eras},       MEMO && ("ap" + (eras?"~":"") + func[2] + argm[2]), loc];
const Num = (loc)                         => ["Num", {},                       MEMO && ("wd")                                    , loc];
const Val = (numb, loc)                   => ["Val", {numb},                   MEMO && ("[" + numb + "]")                        , loc];
const Op1 = (func, num0, num1, loc)       => ["Op1", {func, num0, num1},       MEMO && ("o1" + func + num0[2] + num1[2])         , loc];
const Op2 = (func, num0, num1, loc)       => ["Op2", {func, num0, num1},       MEMO && ("o2" + func + num0[2] + num1[2])         , loc];
const Ite = (cond, pair, loc)             => ["Ite", {cond, pair},             MEMO && ("ie" + cond[2] + pair[2])                , loc];
const Cpy = (name, numb, body, loc)       => ["Cpy", {name, numb, body},       MEMO && ("cy" + numb[2] + body[2])                , loc];
const Slf = (name, type, loc)             => ["Slf", {name, type},             MEMO && ("sf" + type[2])                          , loc];
const New = (type, expr, loc)             => ["New", {type, expr},             MEMO && expr[2]                                   , loc];
const Use = (expr, loc)                   => ["Use", {expr},                   MEMO && expr[2]                                   , loc];
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
      case "Tid": return Tid(f(t.expr, i, d), l);
      case "Utt": return Utt(f(t.expr, i, d), l);
      case "Utv": return Utv(f(t.expr, i, d), l);
      case "Ute": return Ute(f(t.expr, i, d), l);
      case "All": return All(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, i, d), f(t.body, i, d+1), t.eras, l);
      case "App": return App(f(t.func, i, d), f(t.argm, i, d), t.eras, l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Op2": return Op2(t.func, f(t.num0, i, d), f(t.num1, i, d), l);
      case "Ite": return Ite(f(t.cond, i, d), f(t.pair, i, d), l);
      case "Cpy": return Cpy(t.name, f(t.numb, i, d), f(t.body, i, d+1), l);
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
      case "Tid": return Tid(f(t.expr, v, d), l);
      case "Utt": return Utt(f(t.expr, v, d), l);
      case "Utv": return Utv(f(t.expr, v, d), l);
      case "Ute": return Ute(f(t.expr, v, d), l);
      case "All": return All(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "Lam": return Lam(t.name, f(t.bind, v, d), f(t.body, s(v,1,0), d+1), t.eras, l);
      case "App": return App(f(t.func, v, d), f(t.argm, v, d), t.eras, l);
      case "Num": return Num(l);
      case "Val": return Val(t.numb, l);
      case "Op1": return Op1(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Op2": return Op2(t.func, f(t.num0, v, d), f(t.num1, v, d), l);
      case "Ite": return Ite(f(t.cond, v, d), f(t.pair, v, d), l);
      case "Cpy": return Cpy(t.name, f(t.numb, v, d), f(t.body, s(v,1,0), d+1), l);
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

// Reduces a term to normal form or head normal form
// Opts: weak, unbox, logging, eta
const reduce = (term, opts = {}) => {
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
  const dereference = (name, eras, names) => {
    if (!opts.no_ref && (opts.defs||{})[name]) {
      var value = (opts.defs||{})[name];
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
  const if_then_else = (cond, pair, names) => {
    var cond = reduce(cond, names);
    if (!opts.no_ite && cond[0] === "Val") {
      return cond[1].numb > 0 ? reduce(Fst(pair, false, null), names) : reduce(Snd(pair, false, null), names);
    } else {
      return Ite(cond, weak_reduce(pair, names));
    }
  };
  const copy = (name, numb, body, names) => {
    var numb = reduce(numb, names);
    if (!opts.no_cpy && numb[0] === "Val") {
      return reduce(body(numb), names);
    } else {
      return Cpy(name, numb, x => weak_reduce(body(x), names_ext(x, name, names)));
    }
  };
  const first = (pair, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_fst && pair[0] === "Par") {
      return reduce(pair[1].val0, names);
    } else {
      return Fst(pair, eras);
    }
  };
  const second = (pair, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_snd && pair[0] === "Par") {
      return reduce(pair[1].val1, names);
    } else {
      return Snd(pair, eras);
    }
  };
  const project = (nam0, nam1, pair, body, eras, names) => {
    var pair = reduce(pair, names);
    if (!opts.no_prj && pair[0] === "Par") {
      return reduce(body(pair[1].val0, pair[1].val1), names);
    } else {
      return Prj(nam0, nam1, pair, (x,y) => weak_reduce(body(x,y), names_ext(y, nam0, names_ext(x, nam1, names))), eras);
    }
  };
  const restrict = (expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_utv && expr[0] === "Utv") {
      return reduce(expr[1].expr, names);
    } else {
      return Ute(expr);
    }
  };
  const unrestrict = (expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_ute && expr[0] === "Ute") {
      return reduce(expr[1].expr, names);
    } else {
      return Ute(expr);
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
  const tid = (expr, names) => {
    var expr = reduce(expr, names);
    if (!opts.no_tid) {
      return expr;
    } else {
      return Tid(expr);
    }
  };
  const log = (msge, expr, names) => {
    var msge = reduce(msge, names);
    var expr = reduce(expr, names);
    if (opts.logging) {
      var nams = names_arr(names).reverse();
    }
    if (opts.show) {
      console.log(opts.show(quote(msge, 0), names || null));
    }
    return expr;
  };
  const unquote = (term, names = null) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return names_var(term.index, names);
      case "Typ": return Typ();
      case "Tid": return Tid(unquote(term.expr, names));
      case "Utt": return Utt(unquote(term.expr, names));
      case "Utv": return Utv(unquote(term.expr, names));
      case "Ute": return Ute(unquote(term.expr, names));
      case "All": return All(term.name, unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, names), x => unquote(term.body, names_ext(x, null, names)), term.eras);
      case "App": return App(unquote(term.func, names), unquote(term.argm, names), term.eras);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Op2": return Op2(term.func, unquote(term.num0, names), unquote(term.num1, names));
      case "Ite": return Ite(unquote(term.cond, names), unquote(term.pair, names));
      case "Cpy": return Cpy(term.name, unquote(term.numb, names), x => unquote(term.body, names_ext(x, null, names)));
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
      case "Tid": return tid(term.expr, names);
      case "Utt": return Utt(reduce(term.expr, names));
      case "Utv": return restrict(term.expr, names);
      case "Ute": return unrestrict(term.expr, names);
      case "All": return All(term.name, weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "Lam": return Lam(term.name, term.bind && weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(x, term.name, names)), term.eras);
      case "App": return apply(term.func, term.argm, term.eras, names);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return op1(term.func, term.num0, term.num1, names);
      case "Op2": return op2(term.func, term.num0, term.num1, names);
      case "Ite": return if_then_else(term.cond, term.pair, names);
      case "Cpy": return opts.unbox ? reduce(term.body(term.numb), names) : copy(term.name, term.numb, term.body, names);
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
      case "Tid": return Tid(quote(term.expr, depth));
      case "Utt": return Utt(quote(term.expr, depth));
      case "Utv": return Utv(quote(term.expr, depth));
      case "Ute": return Ute(quote(term.expr, depth));
      case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
      case "Num": return Num();
      case "Val": return Val(term.numb);
      case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Ite": return Ite(quote(term.cond, depth), quote(term.pair, depth));
      case "Cpy": return Cpy(term.name, quote(term.numb, depth), quote(term.body(Var(depth)), depth + 1));
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
    case "Tid": return f(t.expr);
    case "Utt": return Utt(f(t.expr));
    case "Utv": return f(t.expr);
    case "Ute": return f(t.expr);
    case "All": return All(t.name, f(t.bind), f(t.body), t.eras);
    case "Lam": return t.eras ? f(subst(t.body, e, 0)) : Lam(t.name, null, f(t.body), t.eras);
    case "App": return t.eras ? f(t.func)              : App(f(t.func), f(t.argm), t.eras);
    case "Num": return Num();
    case "Val": return Val(t.numb);
    case "Op1": return Op1(t.func, f(t.num0), f(t.num1));
    case "Op2": return Op2(t.func, f(t.num0), f(t.num1));
    case "Ite": return Ite(f(t.cond), f(t.pair));
    case "Cpy": return Cpy(t.name, f(t.numb), f(t.body));
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

// equal : Term -> Term -> Opts -> Bool
const equal = (a, b, d, opts) => {

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
        const reduce_opts = {
          weak: true,
          undup: true,
          holes: opts.holes,
          depth: d
        };
        var ax = reduce(a, reduce_opts);
        var bx = reduce(b, reduce_opts);
        var ay = reduce(a, {...reduce_opts, defs: opts.defs});
        var by = reduce(b, {...reduce_opts, defs: opts.defs});

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
            } else if (hole_v !== null && !equal(hole_v, expr_s, hole_d, opts)) {
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
          case "Tid-Tid": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Utt-Utt": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Utv-Utv": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "Ute-Ute": y = Eqs(ay[1].expr, by[1].expr, d); break;
          case "All-All": y = And(And(Eqs(ay[1].bind, by[1].bind, d), Eqs(ay[1].body, by[1].body, d+1)), Val(ay[1].eras === by[1].eras)); break;
          case "Lam-Lam": y = And(Eqs(ay[1].body, by[1].body, d+1), Val(ay[1].eras === by[1].eras)); break;
          case "App-App": y = And(And(Eqs(ay[1].func, by[1].func, d), Eqs(ay[1].argm, by[1].argm, d)), Val(ay[1].eras === by[1].eras)); break;
          case "Num-Num": y = Val(true); break;
          case "Val-Val": y = Val(ay[1].numb === by[1].numb); break;
          case "Op1-Op1": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Val(ay[1].num1[1].numb === ay[1].num1[1].numb))); break;
          case "Op2-Op2": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0, d), Eqs(ay[1].num1, by[1].num1, d))); break;
          case "Ite-Ite": y = And(Eqs(ay[1].cond, by[1].cond, d), Eqs(ay[1].pair, by[1].pair, d)); break;
          case "Cpy-Cpy": y = And(Eqs(ay[1].numb, by[1].numb, d), Eqs(ay[1].body, by[1].body, d+1)); break;
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
  var tree = Eqs(erase(a), erase(b), d);
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
}

// ::::::::::::::
// :: Contexts ::
// ::::::::::::::

const ctx_new = {length: 0};

const ctx_ext = (name, term, type, eras, many, lvel, ctx) => {
  return {name, term, type, eras, many, lvel, uses: 0, length: ctx.length + 1, rest: ctx};
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
    many: ctx.many,
    uses: ctx.uses,
    lvel: ctx.lvel,
  };
  if (use) {
    ctx.uses += 1;
  }
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

const ctx_cpy = ctx => {
  if (ctx.length === 0) {
    return ctx_new;
  } else {
    return {
      name: ctx.name,
      term: ctx.term,
      type: ctx.type,
      eras: ctx.eras,
      many: ctx.many,
      uses: ctx.uses,
      lvel: ctx.lvel,
      length: ctx.length,
      rest: ctx_cpy(ctx.rest)
    }
  }
};

const ctx_subst = (ctx, term) => {
  var vals = [];
  for (var c = ctx, i = 0; c.length > 0; c = c.rest, ++i) {
    vals.push(c.term ? shift(c.term, i + 1, 0) : Var(i));
  }
  var term = shift(term, vals.length, vals.length);
  var term = subst_many(term, vals.reverse(), 0)
  return term;
};

// :::::::::::::::::::
// :: Type Checking ::
// :::::::::::::::::::

const {marked_code, random_excuse} = require("./fm-error.js");

// Type-checks a term and returns both its type and its
// program (an erased copy of the term with holes filled and
// adjustments made). Does NOT check termination, so a
// well-typed term may be bottom. Use haltcheck for that.
// This function mutates the `opts.defs` object, filling
// holes with their resolved values.
// typecheck : Term -> Term -> Opts -> [Term, Term]
const typecheck = (name, expect, opts = {}) => {
  var holes = {};
  var types = {};
  var anns  = [];

  const weak_normal = (term, depth) => {
    return reduce(term, {holes, undup: true, weak: true, depth, defs: opts.defs});
  };

  const display_normal = (term, depth) => {
    return reduce(term, {holes, undup: true, weak: false, depth});
  };

  const subst_holes = (term, depth) => {
    return reduce(term, {defs: opts.defs, defs: {}, holes, depth, weak: false,
      no_app:1, no_ref:1, no_op1:1, no_op2:1,
      no_ite:1, no_cpy:1, no_utv:1, no_ute:1,
      no_use:1, no_ann:1, no_tid:1});
  };

  const show = (term, names = []) => {
    const highlight = (str)  => {
      return "\x1b[2m" + str + "\x1b[0m";
    };
    if (opts.show) {
      return highlight(opts.show(display_normal(term, names.length), names));
    } else {
      return "?";
    }
  };

  const register_hole = (ctx, term, expect) => {
    if (!holes[term[1].name]) {
      holes[term[1].name] = {
        error: {ctx, name: term[1].name, expect},
        //local: term[3],
        local: null,
        depth: ctx.length,
        value: undefined,
      };
    }
  };

  // Checks and returns the type of a term
  const typecheck = (term, expect, ctx = ctx_new, affine = true, lvel = 0) => {
    const do_error = (str)  => {
      var err_msg = "";
      err_msg += "[ERROR]\n" + str;
      err_msg += "\n- When checking " + show(term, ctx_names(ctx))
      if (ctx.length > 0) {
        err_msg += "\n- With context:\n" + ctx_str(ctx, show);
      }
      if (term[3]) {
        err_msg += "\n- On line " + (term[3].row+1) + ", col " + (term[3].col) + ", file \x1b[4m" + term[3].file + ".fm\x1b[0m:";
        err_msg += "\n" + marked_code(term[3]);
      }
      throw err_msg;
    };

    const do_match = (a, b) => {
      if (!equal(a, b, ctx.length, {show: opts.show, defs: opts.defs, holes})) {
        do_error("Type mismatch."
          + "\n- Found type... " + show(a, ctx_names(ctx))
          + "\n- Instead of... " + show(b, ctx_names(ctx)));
      }
    };

    if (expect) {
      var expect_nf = weak_normal(expect, ctx.length);
      if (expect[0] === "Typ" || expect[0] === "Utt") {
        affine = false;
      }
    } else {
      var expect_nf = null;
    }

    var ctx_arg = ctx_cpy(ctx);

    var type;
    switch (term[0]) {
      case "Var":
        var got = ctx_get(term[1].index, ctx, affine);
        if (got) {
          if (affine) {
            if (got.eras) {
              do_error("Use of erased variable `" + got.name + "` in proof-relevant position.");
            }
            if (got.uses > 0 && !got.many && !(expect_nf !== null && expect_nf[0] === "Num")) {
              do_error("Use of affine variable `" + got.name + "` more than once in proof-relevant position.");
            }
            if (got.lvel !== lvel) {
              do_error("Use of variable `" + got.name + "` would change its level in proof-relevant position.");
            }
          }
          type = got.type;
        } else {
          do_error("Unbound variable.");
        }
        break;
      case "Typ":
        type = Typ();
        break;
      case "Tid":
        var expr_t = typecheck(term[1].expr, Typ(), ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Utt":
        if (expect_nf !== null && expect_nf[0] !== "Typ") {
          do_error("The inferred type of an unrestricted type (example: "
            + show(Utt(Ref("A")), ctx_names(ctx)) + ") isn't "
            + show(Typ(), ctx_names(ctx))
            + ".\n- Inferred type is " + show(expect_nf, ctx_names(ctx)));
        }
        var expr_t = typecheck(term[1].expr, Typ(), ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Utv":
        if (expect_nf !== null && expect_nf[0] !== "Utt") {
          do_error("The inferred type of an unrestricted term (example: "
            + show(Utv(Ref("x")), ctx_names(ctx))
            + ") isn't an unrestricted type (example: "
            + show(Utt(Ref("A")), ctx_names(ctx))
            + ").\n- Inferred type is "
            + show(expect_nf, ctx_names(ctx)));
        }
        var expr_t = expect_nf && expect_nf[0] === "Utt" ? expect_nf[1].expr : null;
        var expr_t = typecheck(term[1].expr, expr_t, ctx, false, lvel, [term, ctx]);
        type = Utt(expr_t);
        break;
      case "Ute":
        if (affine) {
          do_error("Attempted to unrestrict a term (ex: "
            + show(Ute(Ref("+x")), ctx_names(ctx))
            + ") in a proof-relevant position.");
        }
        var expr_t = typecheck(term[1].expr, null, ctx, false, lvel, [term, ctx]);
        var expr_t = weak_normal(expr_t, ctx.length);
        if (expr_t[0] !== "Utt") {
          do_error("Expected an unrestricted type (example: "
            + show(Utt(Ref("A")), ctx_names(ctx))
            + ").\n- Found type... "
            + show(expr_t, ctx_names(ctx)));
        }
        type = expr_t[1].expr;
        break;
      case "All":
        if (expect_nf && expect_nf[0] !== "Typ") {
          do_error("The inferred type of a forall (example: "
            + show(All("x", Ref("A"), Ref("B"), false), ctx_names(ctx))
            + ") isn't "
            + show(Typ(), ctx_names(ctx))
            + ".\n- Inferred type is "
            + show(expect_nf, ctx_names(ctx)));
        }
        var bind_t = typecheck(term[1].bind, Typ(), ctx, false, lvel, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, null, term[1].bind, term[1].eras, false, lvel, ctx);
        var body_t = typecheck(term[1].body, Typ(), ex_ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "Lam":
        var bind_v = expect_nf && expect_nf[0] === "All" ? expect_nf[1].bind : term[1].bind;
        if (bind_v === null && expect_nf === null) {
          do_error("Can't infer non-annotated lambda.");
        }
        if (bind_v === null && expect_nf !== null) {
          do_error("The inferred type of a lambda (example: "
            + show(Lam("x",null,Ref("f"),false), ctx_names(ctx))
            + ") isn't forall (example: "
            + show(All("x", Ref("A"), Ref("B"), false), ctx_names(ctx))
            + ").\n- Inferred type is "
            + show(expect_nf, ctx_names(ctx)));
        }
        var bind_t = typecheck(bind_v, Typ(), ctx, false, lvel, ctx);
        var ex_ctx = ctx_ext(term[1].name, null, bind_v, term[1].eras, false, lvel, ctx);
        var body_t = typecheck(term[1].body, expect_nf && expect_nf[0] === "All" ? expect_nf[1].body : null, ex_ctx, affine, lvel, [term, ctx]);
        var body_T = typecheck(body_t, Typ(), ex_ctx, false, lvel, ctx);
        type = All(term[1].name, bind_v, body_t, term[1].eras);
        break;
      case "App":
        var func_t = typecheck(term[1].func, null, ctx, affine, lvel, [term, ctx]);
        var func_t = weak_normal(func_t, ctx.length);
        if (func_t[0] === "Utt" && !affine) {
          func_t = func_t[1].expr;
        }
        if (func_t[0] !== "All") {
          do_error("Attempted to apply a value that isn't a function.");
        }
        var argm_t = typecheck(term[1].argm, func_t[1].bind, ctx, affine, lvel, [term, ctx]);
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
        if (expect_nf !== null && expect_nf[0] !== "Num") {
          do_error("The inferred type of a numeric operation (example: "
            + show(Op2(term[1].func, Ref("x"), Ref("y")), ctx_names(ctx))
            + ") isn't "
            + show(Num(), ctx_names(ctx))
            + ".\n- Inferred type is "
            + show(expect_nf, ctx_names(ctx)));
        }
        var num0_t = typecheck(term[1].num0, Num(), ctx, affine, lvel, [term, ctx]);
        var num1_t = typecheck(term[1].num1, Num(), ctx, affine, lvel, [term, ctx]);
        type = Num();
        break;
      case "Ite":
        var cond_t = typecheck(term[1].cond, null, ctx, affine, lvel, [term, ctx]);
        var cond_t = weak_normal(cond_t, ctx.length);
        if (cond_t[0] !== "Num") {
          do_error("Attempted to use if on a non-numeric value.");
        }
        var pair_t = expect_nf ? Sig("x", expect_nf, shift(expect_nf, 1, 0), 0) : null;
        var pair_t = typecheck(term[1].pair, pair_t, ctx, affine, lvel, [term, ctx]);
        var pair_t = weak_normal(pair_t, ctx.length);
        if (pair_t[0] !== "Sig") {
          do_error("The body of an if must be a pair.");
        }
        var typ0_v = pair_t[1].typ0;
        var typ1_v = subst(pair_t[1].typ1, Typ(), 0);
        if (!equal(typ0_v, typ1_v, ctx.length, {defs: opts.defs, holes})) {
          do_error("Both branches of if must have the same type.");
        }
        type = expect_nf || typ0_v;
        break;
      case "Slf":
        var ex_ctx = ctx_ext(term[1].name, null, term, false, false, lvel, ctx);
        var type_t = typecheck(term[1].type, Typ(), ex_ctx, false, lvel, [term, ctx]);
        type = Typ();
        break;
      case "New":
        var ttyp = weak_normal(term[1].type, ctx.length);
        if (ttyp[0] !== "Slf") {
          do_error("Attempted to make an instance of a type that isn't self.");
        }
        var ttyp_t = typecheck(ttyp, null, ctx, false, lvel, [term, ctx]);
        var expr_t = typecheck(term[1].expr, subst(ttyp[1].type, Ann(ttyp, term, true), 0), ctx, affine, lvel, [term, ctx]);
        type = term[1].type;
        break;
      case "Use":
        var expr_t = typecheck(term[1].expr, null, ctx, affine, lvel, [term, ctx]);
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
            var type_t = typecheck(term[1].type, Typ(), ctx, affine, lvel, [term, ctx]);
            var expr_t = typecheck(term[1].expr, term[1].type, ctx, affine, lvel, [term, ctx]);
            //if (term[1].expr[0] === "Ref" && is_recursive((opts.defs||{})[term[1].expr[1].name], term[1].expr[1].name)) {
              //do_error("Recursive occurrence of '" + term[1].expr[1].name + "'.");
            //}
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
          var msge_t = typecheck(msge_v, null, ctx, false, lvel, [term, ctx]);
          var msge_t = display_normal(erase(msge_t), ctx.length);
        } catch (e) {
          console.log(e);
          var msge_t = Hol("");
        }
        if (!opts.no_logs) {
          console.log("[LOG]");
          console.log("Term: " + opts.show(msge_v, ctx_names(ctx)));
          console.log("Type: " + opts.show(msge_t, ctx_names(ctx)) + "\n");
        }
        var expr_t = typecheck(term[1].expr, expect, ctx, affine, lvel);
        type = expr_t;
        break;
      case "Hol":
        register_hole(ctx, term, expect);
        type = expect || Hol(term[1].name + "_type");
        break;
      case "Ref":
        if (!(opts.defs||{})[term[1].name]) {
          do_error("Undefined reference: `" + term[1].name + "`.");
        } else if (!types[term[1].name]) {
          var dref_t = typecheck((opts.defs||{})[term[1].name], null, ctx_new, affine, lvel, [term, ctx]);
          if (!types[term[1].name]) {
            var dref_t = subst_holes(dref_t, 0);
            opts.defs[term[1].name] = subst_holes(opts.defs[term[1].name], 0);
            types[term[1].name] = dref_t;
          }
        }
        type = types[term[1].name];
        break;
      default:
        throw "TODO: type checker for " + term[0] + ".";
    }
    if (expect) {
      var type_nf = weak_normal(type, ctx.length);
      try {
        do_match(type, expect);
      } catch (e) {
        // Fill an Utv
        if (expect_nf[0] === "Utt" && type_nf[0] !== "Utt") {
          return typecheck(Utv(term), expect_nf, ctx_arg, affine, lvel)
        }
        // Fill an Ute
        if (expect_nf[0] !== "Utt" && type_nf[0] === "Utt") {
          return typecheck(Ute(term), expect_nf, ctx_arg, affine, lvel)
        }
        throw e;
      }
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
          msg += "- With goal... " + show(info.expect, ctx_names(info.ctx)) + "\n";
        }
        if (holes[hole_name].value) {
          msg += "- Solved as... " + show(holes[hole_name].value, ctx_names(info.ctx)) + "\n";
        } else {
          msg += "- Couldn't find a solution.\n";
        }
        var cstr = ctx_str(info.ctx, show);
        msg += "- With context:\n" + (cstr.length > 0 ? cstr + "\n" : "");
        if (!opts.no_logs) {
          console.log(msg);
        }

      }
    }

    // If so, normalize it to an user-friendly form and return
    type = display_normal(type, 0);

    // Cleans side-effects
    //for (var i = 0; i < anns.length; ++i) {
      //anns[i][1].done = false;
    //}

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

// Checks if a well-typed term terminates. Since well-typed terms must be
// elementary affine, the only way they can fail to halt is through recursion.
// This conservative check excludes any kind of recursion. Further work may be
// done to identify and allow well-founded recursion.
const haltcheck = (term, defs, seen = {}) => {
  switch (term[0]) {
    case "Utv": return haltcheck(term[1].expr, defs, seen);
    case "Ute": return haltcheck(term[1].expr, defs, seen);
    case "Lam": return haltcheck(term[1].body, defs, seen);
    case "App": return haltcheck(term[1].func, defs, seen) && (term[1].eras ? true : haltcheck(term[1].argm, defs, seen));
    case "Put": return haltcheck(term[1].expr, defs, seen);
    case "Dup": return haltcheck(term[1].expr, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Op1": return haltcheck(term[1].num0, defs, seen) && haltcheck(term[1].num1, defs, seen);
    case "Op2": return haltcheck(term[1].num0, defs, seen) && haltcheck(term[1].num1, defs, seen);
    case "Ite": return haltcheck(term[1].cond, defs, seen) && haltcheck(term[1].pair, defs, seen);
    case "Cpy": return haltcheck(term[1].numb, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Par": return (term[1].eras === 1 ? true : haltcheck(term[1].val0, defs, seen)) && (term[1].eras === 2 ? true : haltcheck(term[1].val1, defs, seen));
    case "Fst": return haltcheck(term[1].pair, defs, seen);
    case "Snd": return haltcheck(term[1].pair, defs, seen);
    case "Prj": return haltcheck(term[1].pair, defs, seen) && haltcheck(term[1].body, defs, seen);
    case "Ann": return haltcheck(term[1].expr, defs, seen);
    case "New": return haltcheck(term[1].expr, defs, seen);
    case "Use": return haltcheck(term[1].expr, defs, seen);
    case "Log": return haltcheck(term[1].expr, defs, seen);
    case "Ref":
      if (seen[term[1].name]) {
        return false;
      } else {
        return haltcheck(defs[term[1].name], defs, {...seen, [term[1].name]: true});
      }
    default: return true;
  }
};

module.exports = {
  Var, Typ, Tid, Utt, Utv, Ute,
  All, Lam, App, Num, Val, Op1,
  Op2, Ite, Cpy, Slf, New, Use,
  Ann, Log, Hol, Ref,
  equal,
  erase,
  reduce,
  shift,
  subst,
  subst_many,
  typecheck,
  haltcheck,
};
