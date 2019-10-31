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
// - Box: a boxed type, `!A`
// - Put: a boxed value, `#a`
// - Tak: unboxes a boxed value, `<>a`
// - Dup: copies a boxed value, `dup x = a; b`
// - Wrd: type of a native number
// - Num: value of a native number
// - Op1: partially applied binary numeric operation, `|n + k|`, with `k` fixed
// - Op2: binary numeric operation, `|x + y|`
// - Ite: if-then-else, `if n p`,  with a numeric conditional `n`, and two branches in a pair `p`
// - Cpy: copies a number, `cpy x = a; b`
// - Sig: type of a dependent pair, `[x : A, B(x)]`, or of a subset type, `[x : A ~ B(x)]`
// - Par: value of a dependent pair, `[a, b]`, or of a dependent intersection `[a ~ b]`
// - Fst: extracts 1st value of a dependent pair, `fst p`, or of a dependent intersection, `~fst p`
// - Snd: extracts 2nd value of a dependent pair, `snd p`, or of a dependent intersection, `~snd p`
// - Prj: projects a dependent pair, `get [x , y] = a; b`, or a dependent intersection, `get [x ~ y] = a; b`
// - Eql: erased untyped equality type, `a == b`
// - Rfl: reflexivity, i.e., a proof that a value is equal to itself, `$a`
// - Sym: symmetry of equality, `sym(~e)`
// - Cng: congruence of equality, `cong(~f, ~x)`
// - Rwt: rewrite equal terms in types, `term :: rewrite x in P(x) with e`
// - Cst: given two equal terms `a` and `b`, casts the type of `b` to the type of `a`, `cast(~e, ~a, b)`
// - Ann: an explicit type annotaion, `: A a`
// - Log: debug-prints a term during evaluation
// - Hol: a type-hole
// - Ref: a reference to a global def
const Var = (index)                        => ["Var", {index},                        MEMO && ("^" + index)];
const Typ = ()                             => ["Typ", {},                             MEMO && ("ty")];
const Tid = (expr)                         => ["Tid", {expr},                         MEMO && expr[2]];
const All = (name, bind, body, eras)       => ["All", {name, bind, body, eras},       MEMO && ("al" + (eras?"-":"") + bind[2] + body[2])];
const Lam = (name, bind, body, eras)       => ["Lam", {name, bind, body, eras},       MEMO && ("lm" + (eras?"-":"") + body[2])];
const App = (func, argm, eras)             => ["App", {func, argm, eras},             MEMO && ("ap" + (eras?"-":"") + func[2] + argm[2])];
const Box = (expr)                         => ["Box", {expr},                         MEMO && ("bx" + expr[2])];
const Put = (expr)                         => ["Put", {expr},                         MEMO && ("pt" + expr[2])];
const Tak = (expr)                         => ["Tak", {expr},                         MEMO && ("tk" + expr[2])];
const Dup = (name, expr, body)             => ["Dup", {name, expr, body},             MEMO && ("dp" + expr[2] + body[2])];
const Wrd = ()                             => ["Wrd", {},                             MEMO && ("wd")];
const Num = (numb)                         => ["Num", {numb},                         MEMO && ("[" + numb + "]")];
const Op1 = (func, num0, num1)             => ["Op1", {func, num0, num1},             MEMO && ("o1" + func +  num0[2] + num1[2])];
const Op2 = (func, num0, num1)             => ["Op2", {func, num0, num1},             MEMO && ("o2" + func + num0[2] + num1[2])];
const Ite = (cond, pair)                   => ["Ite", {cond, pair},                   MEMO && ("ie" + cond[2] + pair[2])];
const Cpy = (name, numb, body)             => ["Cpy", {name, numb, body},             MEMO && ("cy" + numb[2] + body[2])];
const Sig = (name, typ0, typ1, eras)       => ["Sig", {name, typ0, typ1, eras},       MEMO && ("sg" + eras + typ0[2] + typ1[2])];
const Par = (val0, val1, eras)             => ["Par", {val0, val1, eras},             MEMO && ("pr" + eras + val0[2] + val1[2])];
const Fst = (pair, eras)                   => ["Fst", {pair, eras},                   MEMO && ("ft" + eras + pair[2])];
const Snd = (pair, eras)                   => ["Snd", {pair, eras},                   MEMO && ("sd" + eras + pair[2])];
const Prj = (nam0, nam1, pair, body, eras) => ["Prj", {nam0, nam1, pair, body, eras}, MEMO && ("pj" + eras + pair[2] + body[2])];
const Eql = (val0, val1)                   => ["Eql", {val0, val1},                   MEMO && ("eq" + val0[2] + val1[2])];
const Rfl = (expr)                         => ["Rfl", {expr},                         MEMO && "*"];
const Sym = (prof)                         => ["Sym", {prof},                         MEMO && "*"];
const Cng = (func, prof)                   => ["Cng", {func, prof},                   MEMO && "*"];
const Eta = (expr)                         => ["Eta", {expr},                         MEMO && "*"];
const Rwt = (name, type, prof, expr)       => ["Rwt", {name, type, prof, expr},       MEMO && expr[2]];
const Cst = (prof, val0, val1)             => ["Cst", {prof, val0, val1},             MEMO && val1[2]];
const Slf = (name, type)                   => ["Slf", {name, type},                   MEMO && ("sf" + type[2])];
const New = (type, expr)                   => ["New", {type, expr},                   MEMO && expr[2]];
const Use = (expr)                         => ["Use", {expr},                         MEMO && expr[2]];
const Ann = (type, expr, done)             => ["Ann", {type, expr, done},             MEMO && expr[2]];
const Log = (msge, expr)                   => ["Log", {msge, expr},                   MEMO && expr[2]];
const Hol = (name)                         => ["Hol", {name},                         MEMO && "*"];
const Ref = (name, eras)                   => ["Ref", {name, eras},                   MEMO && ("{" + name + "}")];
var MEMO  = true;

// ::::::::::::::::::
// :: Substitution ::
// ::::::::::::::::::

// Shifts a term
const shift = ([ctor, term], inc, depth) => {
  switch (ctor) {
    case "Var":
      return Var(term.index < depth ? term.index : term.index + inc);
    case "Typ":
      return Typ();
    case "Tid":
      var expr = shift(term.expr, inc, depth);
      return Tid(expr);
    case "All":
      var name = term.name;
      var bind = shift(term.bind, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = term.bind && shift(term.bind, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      var eras = term.eras;
      return Lam(name, bind, body, eras);
    case "App":
      var func = shift(term.func, inc, depth);
      var argm = shift(term.argm, inc, depth);
      var eras = term.eras;
      return App(func, argm, term.eras);
    case "Box":
      var expr = shift(term.expr, inc, depth);
      return Box(expr);
    case "Put":
      var expr = shift(term.expr, inc, depth);
      return Put(expr);
    case "Tak":
      var expr = shift(term.expr, inc, depth);
      return Tak(expr);
    case "Dup":
      var name = term.name;
      var expr = shift(term.expr, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      return Dup(name, expr, body);
    case "Wrd":
      return Wrd();
    case "Num":
      var numb = term.numb;
      return Num(numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = shift(term.num0, inc, depth);
      var num1 = shift(term.num1, inc, depth);
      return Op2(func, num0, num1);
    case "Ite":
      var cond = shift(term.cond, inc, depth);
      var pair = shift(term.pair, inc, depth);
      return Ite(cond, pair);
    case "Cpy":
      var name = term.name;
      var numb = shift(term.numb, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      return Cpy(name, numb, body);
    case "Sig":
      var name = term.name;
      var typ0 = shift(term.typ0, inc, depth);
      var typ1 = shift(term.typ1, inc, depth + 1);
      var eras = term.eras;
      return Sig(name, typ0, typ1, eras);
    case "Par":
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      var eras = term.eras;
      return Par(val0, val1, eras);
    case "Fst":
      var pair = shift(term.pair, inc, depth);
      var eras = term.eras;
      return Fst(pair, eras);
    case "Snd":
      var pair = shift(term.pair, inc, depth);
      var eras = term.eras;
      return Snd(pair, eras);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = shift(term.pair, inc, depth);
      var body = shift(term.body, inc, depth + 2);
      var eras = term.eras;
      return Prj(nam0, nam1, pair, body, eras);
    case "Eql":
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      return Eql(val0, val1);
    case "Rfl":
      var expr = shift(term.expr, inc, depth);
      return Rfl(expr);
    case "Sym":
      var prof = shift(term.prof, inc, depth);
      return Sym(prof);
    case "Cng":
      var func = shift(term.func, inc, depth);
      var prof = shift(term.prof, inc, depth);
      return Cng(func, prof);
    case "Eta":
      var expr = shift(term.expr, inc, depth);
      return Eta(expr);
    case "Rwt":
      var name = term.name;
      var type = shift(term.type, inc, depth + 1);
      var prof = shift(term.prof, inc, depth);
      var expr = shift(term.expr, inc, depth);
      return Rwt(name, type, prof, expr);
    case "Cst":
      var prof = shift(term.prof, inc, depth);
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      return Cst(prof, val0, val1);
    case "Slf":
      var name = term.name;
      var type = shift(term.type, inc, depth + 1);
      return Slf(name, type);
    case "New":
      var type = shift(term.type, inc, depth);
      var expr = shift(term.expr, inc, depth);
      return New(type, expr);
    case "Use":
      var expr = shift(term.expr, inc, depth);
      return Use(expr);
    case "Ann":
      var type = shift(term.type, inc, depth);
      var expr = shift(term.expr, inc, depth);
      var done = term.done;
      return Ann(type, expr, done);
    case "Log":
      var msge = shift(term.msge, inc, depth);
      var expr = shift(term.expr, inc, depth);
      return Log(msge, expr);
    case "Hol":
      var name = term.name;
      return Hol(name);
    case "Ref":
      return Ref(term.name, term.eras);
  }
}

// Substitution
const subst = ([ctor, term], val, depth) => {
  switch (ctor) {
    case "Var":
      return depth === term.index ? val : Var(term.index - (term.index > depth ? 1 : 0));
    case "Typ":
      return Typ();
    case "Tid":
      var expr = subst(term.expr, val, depth);
      return Tid(expr);
    case "All":
      var name = term.name;
      var bind = subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = term.bind && subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return Lam(name, bind, body, eras);
    case "App":
      var func = subst(term.func, val, depth);
      var argm = subst(term.argm, val, depth);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Box":
      var expr = subst(term.expr, val, depth);
      return Box(expr);
    case "Put":
      var expr = subst(term.expr, val, depth);
      return Put(expr);
    case "Tak":
      var expr = subst(term.expr, val, depth);
      return Tak(expr);
    case "Dup":
      var name = term.name;
      var expr = subst(term.expr, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Dup(name, expr, body);
    case "Wrd":
      return Wrd();
    case "Num":
      var numb = term.numb;
      return Num(numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = subst(term.num0, val, depth);
      var num1 = subst(term.num1, val, depth);
      return Op2(func, num0, num1);
    case "Ite":
      var cond = subst(term.cond, val, depth);
      var pair = subst(term.pair, val, depth);
      return Ite(cond, pair);
    case "Cpy":
      var name = term.name;
      var numb = subst(term.numb, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Cpy(name, numb, body);
    case "Sig":
      var name = term.name;
      var typ0 = subst(term.typ0, val, depth);
      var typ1 = subst(term.typ1, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return Sig(name, typ0, typ1, eras);
    case "Par":
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      var eras = term.eras;
      return Par(val0, val1, eras);
    case "Fst":
      var pair = subst(term.pair, val, depth);
      var eras = term.eras;
      return Fst(pair, eras);
    case "Snd":
      var pair = subst(term.pair, val, depth);
      var eras = term.eras;
      return Snd(pair, eras);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = subst(term.pair, val, depth);
      var body = subst(term.body, val && shift(val, 2, 0), depth + 2);
      var eras = term.eras;
      return Prj(nam0, nam1, pair, body, eras);
    case "Eql":
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      return Eql(val0, val1);
    case "Rfl":
      var expr = subst(term.expr, val, depth);
      return Rfl(expr);
    case "Sym":
      var prof = subst(term.prof, val, depth);
      return Sym(prof);
    case "Cng":
      var func = subst(term.func, val, depth);
      var prof = subst(term.prof, val, depth);
      return Cng(func, prof);
    case "Eta":
      var new_term = subst(term.expr, val, depth);
      return Eta(new_term);
    case "Rwt":
      var name = term.name;
      var type = subst(term.type, val && shift(val, 1, 0), depth + 1);
      var prof = subst(term.prof, val, depth);
      var expr = subst(term.expr, val, depth);
      return Rwt(name, type, prof, expr);
    case "Cst":
      var prof = subst(term.prof, val, depth);
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      return Cst(prof, val0, val1);
    case "Slf":
      var name = term.name;
      var type = subst(term.type, val && shift(val, 1, 0), depth + 1);
      return Slf(name, type);
    case "New":
      var type = subst(term.type, val, depth);
      var expr = subst(term.expr, val, depth);
      return New(type, expr);
    case "Use":
      var expr = subst(term.expr, val, depth);
      return Use(expr);
    case "Ann":
      var type = subst(term.type, val, depth);
      var expr = subst(term.expr, val, depth);
      var done = term.done;
      return Ann(type, expr, done);
    case "Log":
      var msge = subst(term.msge, val, depth);
      var expr = subst(term.expr, val, depth);
      return Log(msge, expr);
    case "Hol":
      var name = term.name;
      return Hol(name);
    case "Ref":
      var name = term.name;
      return Ref(name, term.eras);
  }
}

const subst_many = (term, vals, depth) => {
  for (var i = 0; i < vals.length; ++i) {
    term = subst(term, shift(vals[i], vals.length - i - 1, 0), depth + vals.length - i - 1);
  }
  return term;
}

// ::::::::::::::::
// :: Evaluation ::
// ::::::::::::::::

// This is repeated on `fm-net.js` for keeping both files import-free.
let arrbuf = new ArrayBuffer(4);
var u32buf = new Uint32Array(arrbuf);
var f32buf = new Float32Array(arrbuf);
const put_float_on_word = num => {
  f32buf[0] = num;
  return u32buf[0];
};
const get_float_on_word = num => {
  u32buf[0] = num;
  return f32buf[0];
};


// Reduces a term to normal form or head normal form
// Opts: weak, unbox, logging, eta
const norm = show => {
  const norm = (term, defs = {}, opts) => {
    var opts = opts || {};
    const names_new = null;
    const names_ext = (name, rest) => opts.logging ? {name, rest} : rest;
    const names_arr = names => names ? [names.name].concat(names_arr(names.rest)) : [];
    //const lam_eta = term => {
      //if (opts.eta) {
        //const is_eta = (term[1].body[0] === "App"
          //&& term[1].body[1].argm[0] === "Var"
          //&& term[1].body[1].argm[1].index === 0
          //&& uses(term[1].body[1].func, 0) === 0);
        //return is_eta ? subst(term[1].body[1].func, Typ(), 0) : term;
      //} else {
        //return term;
      //}
    //};
    const apply = (func, argm, eras, names) => {
      var func = reduce(func, names);
      // ([x]a b) ~> [b/x]a
      if (func[0] === "Lam") {
        return reduce(func[1].body(argm), names);
      // ((dup x = a; b) c) ~> dup x = a; (b c)
      } else if (func[0] === "Dup") {
        return Dup(func[1].name, func[1].expr, x => weak_reduce(App(func[1].body(x), argm, eras), names_ext(func[1].name, names)));
      // (|a b) ~> ⊥
      } else if (func[0] === "Put") {
        throw "[NORMALIZATION-ERROR]\nCan't apply a boxed value.";
      } else {
        return App(func, weak_reduce(argm, names), eras);
      }
    };
    const take = (expr, names) => {
      var expr = reduce(expr, names);
      // <> #a ~> a
      if (expr[0] === "Put") {
        return reduce(expr[1].expr, names);
      // <> (dup x = a; b) ~> dup x = a; <> b
      } else if (expr[0] === "Dup"){
        return Dup(expr[1].name, expr[1].expr, x => weak_reduce(Tak(expr[1].body(x)), names_ext(expr[1].name, names)));
      } else {
        return Tak(expr);
      }
    };
    const duplicate = (name, expr, body, names) => {
      var expr = reduce(expr, names);
      // [x = |a] b ~> [a/x]b
      if (expr[0] === "Put") {
        return reduce(body(expr[1].expr), names);
      // dup x = (dup y = a; b); c ~> dup y = a; dup x = b; c
      } else if (expr[0] === "Dup") {
        return Dup(expr[1].name, expr[1].expr, x => weak_reduce(Dup(name, expr[1].body(x), x => body(x)), names_ext(name, expr[1].name)));
      // dup x = {y} b; c ~> ⊥
      } else if (expr[0] === "Lam") {
        throw "[NORMALIZATION-ERROR]\nCan't duplicate a lambda.";
      } else {
        if (opts.undup) {
          return reduce(body(Tak(expr)), names);
        } else {
          return Dup(name, expr, x => weak_reduce(body(x), names_ext(name, names)));
        }
      }
    };
    const dereference = (name, eras, names) => {
      if (defs[name]) {
        return reduce(unquote(eras ? erase(defs[name]) : defs[name], []), names_new);
      } else {
        return Ref(name, eras);
      }
    };
    const op1 = (func, num0, num1, names) => {
      var num0 = reduce(num0, names);
      if (num0[0] === "Num") {
        switch (func) {
          case "+"  : return Num((num0[1].numb + num1[1].numb) >>> 0);
          case "-"  : return Num((num0[1].numb - num1[1].numb) >>> 0);
          case "*"  : return Num((num0[1].numb * num1[1].numb) >>> 0);
          case "/"  : return Num((num0[1].numb / num1[1].numb) >>> 0);
          case "%"  : return Num((num0[1].numb % num1[1].numb) >>> 0);
          case "^"  : return Num((num0[1].numb ** num1[1].numb) >>> 0);
          case ".&" : return Num((num0[1].numb & num1[1].numb) >>> 0);
          case ".|" : return Num((num0[1].numb | num1[1].numb) >>> 0);
          case ".^" : return Num((num0[1].numb ^ num1[1].numb) >>> 0);
          case ".!" : return Num((~ num1[1].numb) >>> 0);
          case ".>>": return Num((num0[1].numb >>> num1[1].numb) >>> 0);
          case ".<<": return Num((num0[1].numb << num1[1].numb) >>> 0);
          case ".>" : return Num((num0[1].numb > num1[1].numb ? 1 : 0) >>> 0);
          case ".<" : return Num((num0[1].numb < num1[1].numb ? 1 : 0) >>> 0);
          case ".=" : return Num((num0[1].numb === num1[1].numb ? 1 : 0) >>> 0);
          case "+f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) + get_float_on_word(num1[1].numb)));
          case "-f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) - get_float_on_word(num1[1].numb)));
          case "*f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) * get_float_on_word(num1[1].numb)));
          case "/f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) / get_float_on_word(num1[1].numb)));
          case "%f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) % get_float_on_word(num1[1].numb)));
          case "^f" : return Num(put_float_on_word(get_float_on_word(num0[1].numb) ** get_float_on_word(num1[1].numb)));
          case ".f" : return Num(put_float_on_word(num1[1].numb));
          case ".u" : return Num(get_float_on_word(num1[1].numb) >>> 0);
          default   : throw "[NORMALIZATION-ERROR]\nUnknown primitive: " + func + ".";
        }
      } else {
        return Op1(func, num0, num1);
      }
    };
    const op2 = (func, num0, num1, names) => {
      var num1 = reduce(num1, names);
      if (num1[0] === "Num") {
        return reduce(Op1(func, num0, num1, null), names);
      } else {
        return Op2(func, weak_reduce(num0, names), num1);
      }
    };
    const if_then_else = (cond, pair, names) => {
      var cond = reduce(cond, names);
      if (cond[0] === "Num") {
        return cond[1].numb > 0 ? reduce(Fst(pair, false, null), names) : reduce(Snd(pair, false, null), names);
      } else {
        return Ite(cond, weak_reduce(pair, names));
      }
    };
    const copy = (name, numb, body, names) => {
      var numb = reduce(numb, names);
      if (numb[0] === "Num") {
        return reduce(body(numb), names);
      } else {
        return Cpy(name, numb, x => weak_reduce(body(x), names_ext(name, names)));
      }
    };
    const first = (pair, eras, names) => {
      var pair = reduce(pair, names);
      if (pair[0] === "Par") {
        return reduce(pair[1].val0, names);
      } else {
        return Fst(pair, eras);
      }
    };
    const second = (pair, eras, names) => {
      var pair = reduce(pair, names);
      if (pair[0] === "Par") {
        return reduce(pair[1].val1, names);
      } else {
        return Snd(pair, eras);
      }
    };
    const project = (nam0, nam1, pair, body, eras, names) => {
      var pair = reduce(pair, names);
      if (pair[0] === "Par") {
        return reduce(body(pair[1].val0, pair[1].val1), names);
      } else {
        return Prj(nam0, nam1, pair, (x,y) => weak_reduce(body(x,y), names_ext(nam0, names_ext(nam1, names))), eras);
      }
    };
    const log = (msge, expr, names) => {
      var msge = reduce(msge, names);
      var expr = reduce(expr, names);
      if (opts.logging) {
        var nams = names_arr(names).reverse();
      }
      if (show) {
        console.log(show(quote(msge, 0), names || []));
      }
      return expr;
    };
    const unquote = (term, vars, names) => {
      var [ctor, term] = term;
      switch (ctor) {
        case "Var": return vars[term.index] || Var(vars.length - term.index - 1);
        case "Typ": return Typ();
        case "Tid": return Tid(unquote(term.expr, vars));
        case "All": return All(term.name, unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
        case "Lam": return Lam(term.name, term.bind && unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
        case "App": return App(unquote(term.func, vars), unquote(term.argm, vars), term.eras);
        case "Box": return Box(unquote(term.expr, vars));
        case "Put": return Put(unquote(term.expr, vars));
        case "Tak": return Tak(unquote(term.expr, vars));
        case "Dup": return Dup(term.name, unquote(term.expr, vars), x => unquote(term.body, [x].concat(vars)));
        case "Wrd": return Wrd();
        case "Num": return Num(term.numb);
        case "Op1": return Op1(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
        case "Op2": return Op2(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
        case "Ite": return Ite(unquote(term.cond, vars), unquote(term.pair, vars));
        case "Cpy": return Cpy(term.name, unquote(term.numb, vars), x => unquote(term.body, [x].concat(vars)));
        case "Sig": return Sig(term.name, unquote(term.typ0, vars), x => unquote(term.typ1, [x].concat(vars)), term.eras);
        case "Par": return Par(unquote(term.val0, vars), unquote(term.val1, vars), term.eras);
        case "Fst": return Fst(unquote(term.pair, vars), term.eras);
        case "Snd": return Snd(unquote(term.pair, vars), term.eras);
        case "Prj": return Prj(term.nam0, term.nam1, unquote(term.pair, vars), (x,y) => unquote(term.body, [y,x].concat(vars)), term.eras);
        case "Eql": return Eql(unquote(term.val0, vars), unquote(term.val1, vars));
        case "Rfl": return Rfl(unquote(term.expr, vars));
        case "Sym": return Sym(unquote(term.prof, vars));
        case "Cng": return Cng(unquote(term.func, vars), unquote(term.prof, vars));
        case "Eta": return Eta(unquote(term.expr, vars));
        case "Rwt": return Rwt(term.name, x => unquote(term.type, [x].concat(vars)), unquote(term.prof, vars), unquote(term.expr, vars));
        case "Cst": return Cst(unquote(term.prof, vars), unquote(term.val1, vars), unquote(term.val1, vars));
        case "Slf": return Slf(term.name, x => unquote(term.type, [x].concat(vars)));
        case "New": return New(unquote(term.type, vars), unquote(term.expr, vars));
        case "Use": return Use(unquote(term.expr, vars));
        case "Ann": return Ann(unquote(term.type, vars), unquote(term.expr, vars), term.done);
        case "Log": return Log(unquote(term.msge, vars), unquote(term.expr, vars));
        case "Hol": return Hol(term.name);
        case "Ref": return Ref(term.name, term.eras);
      }
    };
    const reduce = (term, names = null) => {
      var [ctor, term] = term;
      switch (ctor) {
        case "Var": return Var(term.index);
        case "Typ": return Typ();
        case "Tid": return reduce(term.expr, names);
        case "All": return All(term.name, weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(term.name, names)), term.eras);
        case "Lam": return Lam(term.name, term.bind && weak_reduce(term.bind, names), x => weak_reduce(term.body(x), names_ext(term.name, names)), term.eras);
        case "App": return apply(term.func, term.argm, term.eras, names);
        case "Box": return Box(weak_reduce(term.expr, names));
        case "Put": return opts.unbox ? reduce(term.expr, names) : Put(weak_reduce(term.expr, names));
        case "Tak": return opts.unbox ? reduce(term.expr, names) : take(weak_reduce(term.expr, names), names);
        case "Dup": return opts.unbox ? reduce(term.body(term.expr), names) : duplicate(term.name, term.expr, term.body, names);
        case "Wrd": return Wrd();
        case "Num": return Num(term.numb);
        case "Op1": return op1(term.func, term.num0, term.num1, names);
        case "Op2": return op2(term.func, term.num0, term.num1, names);
        case "Ite": return if_then_else(term.cond, term.pair, names);
        case "Cpy": return copy(term.name, term.numb, term.body, names);
        case "Sig": return Sig(term.name, weak_reduce(term.typ0, names), x => weak_reduce(term.typ1(x), names_ext(term.name, names)), term.eras);
        case "Par": return Par(weak_reduce(term.val0, names), weak_reduce(term.val1, names), term.eras);
        case "Fst": return first(term.pair, term.eras, names);
        case "Snd": return second(term.pair, term.eras, names);
        case "Prj": return project(term.nam0, term.nam1, term.pair, term.body, term.eras, names);
        case "Eql": return Eql(weak_reduce(term.val0, names), weak_reduce(term.val1, names));
        case "Rfl": return Rfl(weak_reduce(term.expr, names));
        case "Sym": return reduce(term.prof, names);
        case "Cng": return reduce(term.prof, names);
        case "Eta": return Eta(weak_reduce(term.expr, names));
        case "Rwt": return reduce(term.expr, names);
        case "Cst": return reduce(term.val1, names);
        case "Slf": return Slf(term.name, x => weak_reduce(term.type(x), names_ext(term.name, names)));
        case "New": return reduce(term.expr, names);
        case "Use": return reduce(term.expr, names);
        case "Ann": return reduce(term.expr, names);
        case "Log": return log(term.msge, term.expr, names);
        case "Hol": return Hol(term.name);
        case "Ref": return dereference(term.name, term.eras, names);
      }
    };
    const weak_reduce = (term, names) => {
      return opts.weak ? term : reduce(term, names);
    };
    const quote = (term, depth) => {
      var [ctor, term] = term;
      switch (ctor) {
        case "Var": return Var(depth - 1 - term.index);
        case "Typ": return Typ();
        case "Tid": return Tid(quote(term.expr, depth));
        case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
        case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
        case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
        case "Box": return Box(quote(term.expr, depth));
        case "Put": return Put(quote(term.expr, depth));
        case "Tak": return Tak(quote(term.expr, depth));
        case "Dup": return Dup(term.name, quote(term.expr, depth), quote(term.body(Var(depth)), depth + 1));
        case "Wrd": return Wrd();
        case "Num": return Num(term.numb);
        case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
        case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
        case "Ite": return Ite(quote(term.cond, depth), quote(term.pair, depth));
        case "Cpy": return Cpy(term.name, quote(term.numb, depth), quote(term.body(Var(depth)), depth + 1));
        case "Sig": return Sig(term.name, quote(term.typ0, depth), quote(term.typ1(Var(depth)), depth + 1), term.eras);
        case "Par": return Par(quote(term.val0, depth), quote(term.val1, depth), term.eras);
        case "Fst": return Fst(quote(term.pair, depth), term.eras);
        case "Snd": return Snd(quote(term.pair, depth), term.eras);
        case "Prj": return Prj(term.nam0, term.nam1, quote(term.pair, depth), quote(term.body(Var(depth), Var(depth + 1)), depth + 2), term.eras);
        case "Eql": return Eql(quote(term.val0, depth), quote(term.val1, depth));
        case "Rfl": return Rfl(quote(term.expr, depth));
        case "Sym": return Sym(quote(term.prof, depth));
        case "Cng": return Cng(quote(term.func, depth), quote(term.prof, depth));
        case "Eta": return Eta(quote(term.expr, depth));
        case "Rwt": return Rwt(term.name, quote(term.type(Var(depth)), depth + 1), quote(term.prof, depth), quote(term.expr, depth));
        case "Cst": return Cst(quote(term.prof, depth), quote(term.val0, depth), quote(term.val1, depth));
        case "Slf": return Slf(term.name, quote(term.type(Var(depth)), depth + 1));
        case "New": return New(quote(term.type, depth), quote(term.expr, depth));
        case "Use": return Use(quote(term.expr, depth));
        case "Ann": return Ann(quote(term.type, depth), quote(term.expr, depth), term.done);
        case "Log": return Log(quote(term.msge, depth), quote(term.expr, depth));
        case "Hol": return Hol(term.name);
        case "Ref": return Ref(term.name, term.eras);
      }
    };
    MEMO = false;
    var unquoted = unquote(term, []);
    var reduced = reduce(unquoted);
    MEMO = true;
    var quoted = quote(reduced, 0);
    return quoted;
  };
  return norm;
}

const erase = (term) => {
  var [ctor, term] = term;
  switch (ctor) {
    case "Var":
      return Var(term.index);
    case "Typ":
      return Typ();
    case "Tid":
      return erase(term.expr);
    case "All":
      return All(term.name, erase(term.bind), erase(term.body), term.eras);
    case "Lam":
      if (term.eras) {
        return erase(subst(term.body, Put(Hol(term.name)), 0));
      } else {
        return Lam(term.name, null, erase(term.body), term.eras);
      }
    case "App":
      if (term.eras) {
        return erase(term.func);
      } else {
        return App(erase(term.func), erase(term.argm), term.eras);
      }
    case "Box":
      return Box(erase(term.expr));
    case "Put":
      return Put(erase(term.expr));
    case "Tak":
      return Tak(erase(term.expr));
    case "Dup":
      return Dup(term.name, erase(term.expr), erase(term.body));
    case "Wrd":
      return Wrd();
    case "Num":
      return Num(term.numb);
    case "Op1":
      return Op1(term.func, erase(term.num0), erase(term.num1));
    case "Op2":
      return Op2(term.func, erase(term.num0), erase(term.num1));
    case "Ite":
      return Ite(erase(term.cond), erase(term.pair));
    case "Cpy":
      return Cpy(term.name, erase(term.numb), erase(term.body));
    case "Sig":
      return Sig(term.name, erase(term.typ0), erase(term.typ1), term.eras);
    case "Par":
      if (term.eras === 1) {
        return erase(term.val1);
      } else if (term.eras === 2) {
        return erase(term.val0);
      } else {
        return Par(erase(term.val0), erase(term.val1), term.eras);
      }
    case "Fst":
      if (term.eras === 1) {
        return Put(Hol(""));
      } else if (term.eras === 2) {
        return erase(term.pair);
      } else {
        return Fst(erase(term.pair), term.eras);
      }
    case "Snd":
      if (term.eras === 1) {
        return erase(term.pair);
      } else if (term.eras === 2) {
        return Put(Hol(""));
      } else {
        return Snd(erase(term.pair), term.eras);
      }
    case "Prj":
      if (term.eras === 1) {
        return erase(subst_many(term.body, [Hol(""), erase(term.pair)], 0));
      } else if (term.eras === 2) {
        return erase(subst_many(term.body, [erase(term.pair), Hol("")], 0));
      } else {
        return Prj(term.nam0, term.nam1, erase(term.pair), erase(term.body), term.eras);
      }
    case "Eql":
      return Eql(erase(term.val0), erase(term.val1));
    case "Rfl":
      return Put(Hol(""));
    case "Sym":
      return Put(Hol(""));
    case "Cng":
      return Put(Hol(""));
    case "Eta":
      return Put(Hol(""));
    case "Rwt":
      return erase(term.expr);
    case "Cst":
      return erase(term.val1);
    case "Slf":
      return Slf(term.name, erase(term.type));
    case "New":
      return erase(term.expr);
    case "Use":
      return erase(term.expr);
    case "Ann":
      return erase(term.expr);
    case "Log":
      return Log(erase(term.msge), erase(term.expr));
    case "Hol":
      return Hol("");
    case "Ref":
      return Ref(term.name, true);
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

const equal = show => (a, b, defs) => {
  const Eqs = (a, b)    => ["Eqs", {a, b}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const And = (x,y)     => Bop(false, x, y);
  const Or  = (x,y)     => Bop(true, x, y);
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eqs":
        var {a, b} = node[1];

        // Gets whnfs with and without dereferencing
        // Note: can't use weak:true because it won't give opportunity to eta...
        var ax = norm(null)(a, {}, {weak: true, undup: true});
        var bx = norm(null)(b, {}, {weak: true, undup: true});
        var ay = norm(null)(a, defs, {weak: true, undup: true});
        var by = norm(null)(b, defs, {weak: true, undup: true});

        // Optimization: if hashes are equal, then a == b prematurely
        if (a[2] === b[2] || ax[2] === bx[2] || ay[2] === by[2]) {
          return Val(true);
        }

        // If non-deref whnfs are app and fields are equal, then a == b
        var x = null;
        if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
          x = Val(true);
        } else if (ax[0] === "App" && bx[0] === "App") {
          var func = Eqs(ax[1].func, bx[1].func);
          var argm = Eqs(ax[1].argm, bx[1].argm);
          x = Bop(false, func, argm);
        }

        // If whnfs are equal and fields are equal, then a == b
        var y = null;
        switch (ay[0] + "-" + by[0]) {
          case "Var-Var": y = Val(ay[1].index === by[1].index); break;
          case "Typ-Typ": y = Val(true); break;
          case "Tid-Tid": y = Eqs(ay[1].expr, by[1].expr); break;
          case "All-All": y = And(And(Eqs(ay[1].bind, by[1].bind), Eqs(ay[1].body, by[1].body)), Val(ay[1].eras === by[1].eras)); break;
          case "Lam-Lam": y = And(Eqs(ay[1].body, by[1].body), Val(ay[1].eras === by[1].eras)); break;
          case "App-App": y = And(And(Eqs(ay[1].func, by[1].func), Eqs(ay[1].argm, by[1].argm)), Val(ay[1].eras === by[1].eras)); break;
          case "Box-Box": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Put-Put": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Tak-Tak": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Dup-Dup": y = And(Eqs(ay[1].expr, by[1].expr), Eqs(ay[1].body, by[1].body)); break;
          case "Wrd-Wrd": y = Val(true); break;
          case "Num-Num": y = Val(ay[1].numb === by[1].numb); break;
          case "Op1-Op1": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0), Val(ay[1].num1[1].numb === ay[1].num1[1].numb))); break;
          case "Op2-Op2": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0), Eqs(ay[1].num1, by[1].num1))); break;
          case "Ite-Ite": y = And(Eqs(ay[1].cond, by[1].cond), Eqs(ay[1].pair, by[1].pair)); break;
          case "Cpy-Cpy": y = And(Eqs(ay[1].numb, by[1].numb), Eqs(ay[1].body, by[1].body)); break;
          case "Sig-Sig": y = And(Eqs(ay[1].typ0, by[1].typ0), Eqs(ay[1].typ1, by[1].typ1)); break;
          case "Par-Par": y = And(Eqs(ay[1].val0, by[1].val0), Eqs(ay[1].val1, by[1].val1)); break;
          case "Fst-Fst": y = And(Eqs(ay[1].pair, by[1].pair), Val(ay[1].eras === by[1].eras)); break;
          case "Snd-Snd": y = And(Eqs(ay[1].pair, by[1].pair), Val(ay[1].eras === by[1].eras)); break;
          case "Prj-Prj": y = And(Eqs(ay[1].pair, by[1].pair), Eqs(ay[1].body, by[1].body)); break;
          case "Eql-Eql": y = And(Eqs(ay[1].val0, by[1].val0), Eqs(ay[1].val1, by[1].val1)); break;
          case "Rfl-Rfl": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Sym-Sym": y = Eqs(ay[1].prof, by[1].prof); break;
          case "Cng-Cng": y = And(Eqs(ay[1].term, by[1].term), Eqs(ay[1].prof, by[1].prof)); break;
          case "Eta-Eta": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Rwt-Rwt": y = And(And(Eqs(ay[1].prof, by[1].prof), Eqs(ay[1].type, by[1].type)), Eqs(ay[1].expr, by[1].expr)); break;
          case "Cst-Cst": y = And(And(Eqs(ay[1].prof, by[1].prof), Eqs(ay[1].val0, by[1].val0)), Eqs(ay[1].val1, by[1].val1)); break;
          case "Slf-Slf": y = Eqs(ay[1].type, by[1].type); break;
          case "New-New": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Use-Use": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Log-Log": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Hol-Hol": y = Val(true); break;
          case "Ann-Ann": y = Eqs(ay[1].expr, by[1].expr); break;
          default:        y = Val(false); break;
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
  var tree = Eqs(erase(a), erase(b));
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
}


// ::::::::::::::::::::
// :: Stratification ::
// ::::::::::::::::::::

// How many times a variable was used in computational positions
const uses = ([ctor, term], depth = 0) => {
  switch (ctor) {
    case "Var": return term.index === depth ? 1 : 0;
    case "Typ": return 0;
    case "Tid": return 0;
    case "All": return 0;
    case "Lam": return uses(term.body, depth + 1);
    case "App": return uses(term.func, depth) + (term.eras ? 0 : uses(term.argm, depth));
    case "Box": return 0;
    case "Put": return uses(term.expr, depth);
    case "Tak": return uses(term.expr, depth);
    case "Dup": return uses(term.expr, depth) + uses(term.body, depth + 1);
    case "Wrd": return 0;
    case "Num": return 0;
    case "Op1": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Op2": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Ite": return uses(term.cond, depth) + uses(term.pair, depth);
    case "Cpy": return uses(term.numb, depth) + uses(term.body, depth + 1);
    case "Sig": return 0;
    case "Par": return (term.eras === 1 ? 0 : uses(term.val0, depth)) + (term.eras === 2 ? 0 : uses(term.val1, depth));
    case "Fst": return uses(term.pair, depth);
    case "Snd": return uses(term.pair, depth);
    case "Prj": return uses(term.pair, depth) + uses(term.body, depth + 2);
    case "Eql": return 0;
    case "Rfl": return 0;
    case "Sym": return 0;
    case "Eta": return 0;
    case "Cng": return 0;
    case "Rwt": return uses(term.expr, depth) && uses(term.prof, depth);
    case "Cst": return uses(term.val1, depth);
    case "Slf": return 0;
    case "New": return uses(term.expr, depth);
    case "Use": return uses(term.expr, depth);
    case "Ann": return uses(term.expr, depth);
    case "Log": return uses(term.expr, depth);
    case "Hol": return 0;
    case "Ref": return 0;
  }
}

// Checks if variable only occurs at a specific relative level
const is_at_level = ([ctor, term], at_level, depth = 0, level = 0) => {
  switch (ctor) {
    case "Var": return term.index !== depth || level === at_level;
    case "Typ": return true;
    case "Tid": return true;
    case "All": return true;
    case "Lam": return is_at_level(term.body, at_level, depth + 1, level);
    case "App": return is_at_level(term.func, at_level, depth, level) && (term.eras ? true : is_at_level(term.argm, at_level, depth, level));
    case "Box": return true;
    case "Put": return is_at_level(term.expr, at_level, depth, level + 1);
    case "Tak": return false;
    case "Dup": return is_at_level(term.expr, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Wrd": return true;
    case "Num": return true;
    case "Op1": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Op2": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Ite": return is_at_level(term.cond, at_level, depth, level) && is_at_level(term.pair, at_level, depth, level);
    case "Cpy": return is_at_level(term.numb, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Sig": return true;
    case "Par": return (term.eras === 1 || is_at_level(term.val0, at_level, depth, level)) && (term.eras === 2 || is_at_level(term.val1, at_level, depth, level));
    case "Fst": return is_at_level(term.pair, at_level, depth, level);
    case "Snd": return is_at_level(term.pair, at_level, depth, level);
    case "Prj": return is_at_level(term.pair, at_level, depth, level) && is_at_level(term.body, at_level, depth + 2, level);
    case "Ann": return is_at_level(term.expr, at_level, depth, level);
    case "Pri": return is_at_level(term.argm, at_level, depth, level);
    case "Eql": return true;
    case "Rfl": return true;
    case "Sym": return true;
    case "Cng": return true;
    case "Eta": return true;
    case "Rwt": return is_at_level(term.expr, at_level, depth, level) && is_at_level(term.prof, at_level, depth, level);
    case "Cst": return is_at_level(term.val1, at_level, depth, level);
    case "Slf": return true;
    case "New": return is_at_level(term.expr, at_level, depth, level);
    case "Use": return is_at_level(term.expr, at_level, depth, level);
    case "Log": return is_at_level(term.expr, at_level, depth, level);
    case "Hol": return true;
    case "Ref": return true;
  }
}

// Checks if a term is stratified
const boxcheck = show => (term, defs = {}) => {
  const check = ([ctor, term], eras = false, ctx = [], ctx_eras = [], seen = {}) => {
    switch (ctor) {
      case "Var":
        if (!eras && ctx_eras[ctx_eras.length - term.index - 1]) {
          throw "[ERROR]\nUse of erased variable `" + ctx[ctx.length - term.index - 1] + "` in non-erased position.";
        }
        break;
      case "All":
        break;
      case "Lam":
        if (!eras && uses(term.body) > 1) {
          throw "[ERROR]\nLambda variable `" + term.name + "` used more than once in:\n" + show([ctor, term], ctx);
        }
        if (!eras && !is_at_level(term.body, 0)) {
          throw "[ERROR]\nLambda variable `" + term.name + "` used inside a box in:\n" + show([ctor, term], ctx);
        }
        check(term.body, eras, ctx.concat([term.name]), ctx_eras.concat([term.eras]), seen);
        break;
      case "App":
        check(term.func, eras, ctx, ctx_eras, seen);
        if (term.eras !== 2) {
          check(term.argm, eras || !!term.eras, ctx, ctx_eras, seen);
        }
        break;
      case "Box":
        break;
      case "Put":
        check(term.expr, eras, ctx, ctx_eras, seen);
        break;
      case "Tak":
        if (!eras) {
          throw "[ERROR]\nAttempted to unbox term in a computational posititon:\n" + show([ctor, term], ctx);
        }
        break;
      case "Dup":
        if (!eras && !is_at_level(term.body, 1)) {
          throw "[ERROR]\nDuplication variable `" + term.name + "` must always have exactly 1 enclosing box on the body of:\n" + show([ctor, term], ctx);
        }
        check(term.expr, eras, ctx, ctx_eras, seen);
        check(term.body, eras, ctx.concat([term.name]), ctx_eras.concat([false]), seen);
        break;
      case "Op1":
      case "Op2":
        check(term.num0, eras, ctx, ctx_eras, seen);
        check(term.num1, eras, ctx, ctx_eras, seen);
        break;
      case "Ite":
        check(term.cond, eras, ctx, ctx_eras, seen);
        check(term.pair, eras, ctx, ctx_eras, seen);
        break;
      case "Cpy":
        if (!eras && !is_at_level(term.body, 0)) {
          throw "[ERROR]\nCopy variable `" + term.name + "` used inside a box in:\n" + show([ctor, term], ctx);
        }
        check(term.numb, eras, ctx, ctx_eras, seen);
        check(term.body, eras, ctx.concat([term.name]), ctx_eras.concat([false]), seen);
        break;
      case "Sig":
        break;
      case "Par":
        var eras0 = term.eras === 1;
        var eras1 = term.eras === 2;
        check(term.val0, eras || eras0, ctx, ctx_eras, seen);
        check(term.val1, eras || eras1, ctx, ctx_eras, seen);
        break;
      case "Fst":
        var eras0 = term.eras === 1;
        if (eras0) {
          throw "[ERROR]\nAttempted to extract erased first element.";
        }
        check(term.pair, eras, ctx, ctx_eras, seen);
        break;
      case "Snd":
        var eras1 = term.eras === 2;
        if (eras1) {
          throw "[ERROR]\nAttempted to extract erased second element.";
        }
        check(term.pair, eras, ctx, ctx_eras, seen);
        break;
      case "Prj":
        var eras0 = term.eras === 1;
        var eras1 = term.eras === 2;
        var uses0 = uses(term.body, 1);
        var uses1 = uses(term.body, 0);
        var isat0 = is_at_level(term.body, 0, 1);
        var isat1 = is_at_level(term.body, 0, 0);
        if (!eras && (uses0 > 1 || uses1 > 1)) {
          throw "[ERROR]\nProjection variable `" + (uses0 > 1 ? term.nam0 : term.nam1) + "` used more than once in:\n" + show([ctor, term], ctx);
        }
        if (!eras && (!isat0 || !isat1)) {
          throw "[ERROR]\nProjection variable `" + (!isat0 ? term.nam0 : term.nam1) + "` used inside a box in:\n" + show([ctor, term], ctx);
        }
        check(term.pair, eras, ctx, ctx_eras, seen);
        check(term.body, eras, ctx.concat([term.nam0, term.nam1]), ctx_eras.concat([eras0, eras1]), seen);
        break;
      case "Eql":
        break;
      case "Rfl":
        check(term.expr, true, ctx, ctx_eras, seen);
        break;
      case "Sym":
        check(term.prof, eras, ctx, ctx_eras, seen);
        break;
      case "Cng":
        check(term.func, true, ctx, ctx_eras, seen);
        check(term.prof, eras, ctx, ctx_eras, seen);
        break;
      case "Eta":
        break;
      case "Rwt":
        check(term.expr, eras, ctx, ctx_eras, seen);
        check(term.prof, eras, ctx, ctx_eras, seen);
        break;
      case "Cst":
        check(term.val1, eras, ctx, ctx_eras, seen);
        break;
      case "Ann":
        check(term.expr, eras, ctx, ctx_eras, seen);
        break;
      case "Slf":
        break;
      case "New":
        check(term.expr, eras, ctx, ctx_eras, seen);
        break;
      case "Use":
        check(term.expr, eras, ctx, ctx_eras, seen);
        break;
      case "Log":
        check(term.expr, eras, ctx, ctx_eras, seen);
        break;
      case "Hol":
        break;
      case "Ref":
        if (!defs[term.name]) {
          throw "[ERROR]\nUndefined reference: `" + term.name + "`.";
        } else if (!seen[term.name]) {
          check(defs[term.name], eras, ctx, ctx_eras, {...seen, [term.name]: true});
          break;
        } else if (!eras && seen[term.name]) {
          throw "[ERROR]\nRecursive occurrence of '" + term.name + "'.";
          break;
        }
    }
  };
  return check(term, false, [], []);
}

// :::::::::::::::::::
// :: Type Checking ::
// :::::::::::::::::::

const PADR = (len, chr, str) => {
  while (str.length < len) {
    str += chr;
  }
  return str;
};

const CODE = (str)  => {
  return "\x1b[2m" + str + "\x1b[0m";
};

const ctx_new = null;

const ctx_ext = (name, type, ctx) => {
  return {name, type, rest: ctx};
};

const ctx_get = (i, ctx) => {
  if (i < 0) return null;
  for (var k = 0; k < i; ++k) {
    if (!ctx.rest) return null;
    ctx = ctx.rest;
  }
  return [ctx.name, shift(ctx.type, i + 1, 0)];
};

const ctx_str = show => (ctx, defs) => {
  var txt = [];
  var idx = 0;
  var max_len = 0;
  for (var c = ctx; c !== null; c = c.rest) {
    max_len = Math.max(c.name.length, max_len);
  }
  for (var c = ctx; c !== null; c = c.rest) {
    var name = c.name;
    var type = c.type;
    txt.push("- " + PADR(max_len, " ", c.name) + " : " + show(norm(null)(type, {}, {weak: false, unbox: true}), ctx_names(c.rest)));
  }
  return txt.reverse().join("\n");
};

const ctx_names = (ctx) => {
  var names = [];
  while (ctx !== null) {
    names.push(ctx.name);
    ctx = ctx.rest;
  }
  return names.reverse();
};

const typecheck = show => (term, expect, defs, ctx = ctx_new, inside = null, debug = true) => {
  var type_memo = {};
  var ctx_str_  = ctx_str(show);
  var hide_hole = {};

  const typecheck = (term, expect, defs, ctx = ctx_new, inside = null) => {
    //console.log("....",show(term,ctx_names(ctx)));
    const TERM = (term) => {
      return CODE(show(term, ctx_names(ctx)));
    };

    const ERROR = (str)  => {
      throw "[ERROR]\n" + str
        + "\n- When checking " + TERM(term)
        + (inside ? "\n- On expression " + CODE(show(inside[0], ctx_names(inside[1]))) : "")
        //+ (inside ? "\n- On expression " + JSON.stringify(inside[0]) + " | " + JSON.stringify(ctx_names(inside[1])) : "")
        + (ctx !== null ? "\n- With the following context:\n" + ctx_str_(ctx, defs) : "");
    };

    const MATCH = (a, b, ctx) => {
      if (!equal(null)(a, b, defs)) {
        throw ERROR("Type mismatch."
          + "\n- Found type... " + TERM(norm(null)(a, {}, {weak: false, undup: true}))
          + "\n- Instead of... " + TERM(norm(null)(b, {}, {weak: false, undup: true})));
      }
    };

    var expect_nf = expect ? norm(null)(expect, defs, {undup: true, weak: true}) : null;
    var type;
    switch (term[0]) {
      case "Var":
        var name_type = ctx_get(term[1].index, ctx);
        if (name_type) {
          type = name_type[1];
        } else {
          ERROR("Unbound variable.");
        }
        break;
      case "Typ":
        type = Typ();
        break;
      case "Tid":
        var expr_t = typecheck(term[1].expr, null, defs, ctx, [term, ctx]);
        MATCH(expr_t, Typ(), ctx);
        type = Typ();
        break;
      case "All":
        if (expect_nf && expect_nf[0] !== "Typ") {
          ERROR("The annotated type of a forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) +") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect_nf));
        }
        var bind_t = typecheck(term[1].bind, null, defs, ctx, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, term[1].bind, ctx);
        var body_t = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        MATCH(bind_t, Typ(), ctx);
        MATCH(body_t, Typ(), ctx);
        type = Typ();
        break;
      case "Lam":
        var bind_v = expect_nf && expect_nf[0] === "All" ? expect_nf[1].bind : term[1].bind;
        if (bind_v === null && expect_nf === null) {
          ERROR("Can't infer non-annotated lambda.");
        }
        if (bind_v === null && expect_nf !== null) {
          ERROR("The annotated type of a lambda (" + TERM(Lam("x",null,Ref("f"),false)) + ") isn't forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) + ").\n- Annotated type is " + TERM(expect_nf));
        }
        var ex_ctx = ctx_ext(term[1].name, bind_v, ctx);
        var body_t = typecheck(term[1].body, expect_nf && expect_nf[0] === "All" ? expect_nf[1].body : null, defs, ex_ctx, [term, ctx]);
        var term_t = All(term[1].name, bind_v, body_t, term[1].eras);
        if (term_t[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        typecheck(term_t, Typ(), defs, ctx, [term, ctx]);
        type = term_t;
        break;
      case "App":
        var func_t = norm(null)(typecheck(term[1].func, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (func_t[0] !== "All") {
          ERROR("Attempted to apply a value that isn't a function.");
        }
        typecheck(term[1].argm, func_t[1].bind, defs, ctx, [term, ctx]);
        if (func_t[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = subst(func_t[1].body, Ann(func_t[1].bind, term[1].argm, false), 0);
        break;
      case "Box":
        if (expect_nf !== null && expect_nf[0] !== "Typ") {
          ERROR("The annotated type of a box (" + TERM(Box(Ref("A"))) + ") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect_nf));
        }
        var expr_t = norm(null)(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        MATCH(expr_t, Typ(), ctx);
        type = Typ();
        break;
      case "Put":
        if (expect_nf !== null && expect_nf[0] !== "Box") {
          ERROR("The annotated type of a put (" + TERM(Put(Ref("x"))) + ") isn't a box (" + TERM(Box(Ref("A"))) + ").\n- Annotated type is " + TERM(expect_nf));
        }
        var expr_t = expect_nf && expect_nf[0] === "Box" ? expect_nf[1].expr : null;
        var term_t = typecheck(term[1].expr, expr_t, defs, ctx, [term, ctx]);
        type = Box(term_t);
        break;
      case "Tak":
        var expr_t = norm(null)(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (expr_t[0] !== "Box") {
          ERROR("Unboxed duplication.");
        }
        type = expr_t[1].expr;
        break;
      case "Dup":
        var expr_t = norm(null)(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (expr_t[0] !== "Box") {
          ERROR("Unboxed duplication.");
        }
        var unboxd = Tak(term[1].expr);
        var term_t = typecheck(subst(term[1].body, Tak(term[1].expr), 0), expect_nf, defs, ctx, [term, ctx]);
        type = term_t;
        break;
      case "Wrd":
        type = Typ();
        break;
      case "Num":
        type = Wrd();
        break;
      case "Op1":
      case "Op2":
        if (expect_nf !== null && expect_nf[0] !== "Wrd") {
          ERROR("The annotated type of a numeric operation (" + TERM(Op2(term[1].func, Ref("x"), Ref("y"))) + ") isn't " + TERM(Wrd()) + ".\n- Annotated type is " + TERM(expect_nf));
        }
        typecheck(term[1].num0, Wrd(), defs, ctx, [term, ctx]);
        typecheck(term[1].num1, Wrd(), defs, ctx, [term, ctx]);
        type = Wrd();
        break;
      case "Ite":
        var cond_t = norm(null)(typecheck(term[1].cond, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (cond_t[0] !== "Wrd") {
          ERROR("Attempted to use if on a non-numeric value.");
        }
        var pair_t = expect_nf ? Sig("x", expect_nf, shift(expect_nf, 1, 0), 0) : null;
        var pair_t = norm(null)(typecheck(term[1].pair, pair_t, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (pair_t[0] !== "Sig") {
          ERROR("The body of an if must be a pair.");
        }
        var typ0_v = pair_t[1].typ0;
        var typ1_v = subst(pair_t[1].typ1, Typ(), 0);
        if (!equal(show)(typ0_v, typ1_v, defs)) {
          ERROR("Both branches of if must have the same type.");
        }
        type = expect_nf || typ0_v;
        break;
      case "Cpy":
        var numb_t = norm(null)(typecheck(term[1].numb, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (numb_t[0] !== "Wrd") {
          ERROR("Atempted to copy a non-numeric value.");
        }
        type = typecheck(subst(term[1].body, term[1].numb, 0), expect_nf, defs, ctx, [term, ctx]);
        break;
      case "Sig":
        if (expect_nf && expect_nf[0] !== "Typ") {
          ERROR("The annotated type of a sigma (" + TERM(Sig("x", Ref("A"), Ref("B"))) + ") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect_nf));
        }
        var typ0_t = typecheck(term[1].typ0, null, defs, ctx, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, term[1].typ0, ctx);
        var typ1_t = typecheck(term[1].typ1, null, defs, ex_ctx, [term, ctx]);
        MATCH(typ0_t, Typ(), ctx);
        MATCH(typ1_t, Typ(), ctx);
        type = Typ();
        break;
      case "Par":
        if (expect_nf && expect_nf[0] !== "Sig") {
          ERROR("Annotated type of a pair (" + TERM(Par(Ref("a"),Ref("b"))) + ") isn't " + TERM(Sig("x", Ref("A"), Ref("B"))) + ".\n- Annotated type is " + TERM(norm(null)(expect_nf, defs, {undup: true, weak: true})));
        }
        if (expect_nf && expect_nf[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var val0_t = typecheck(term[1].val0, expect_nf && expect_nf[1].typ0, defs, ctx, [term, ctx]);
        if (expect_nf) {
          var val1_t = typecheck(term[1].val1, subst(expect_nf[1].typ1, term[1].val0, 0), defs, ctx, [term, ctx]);
        } else {
          var val1_t = shift(typecheck(term[1].val1, null, defs, ctx, [term, ctx]), 1, 0);
        }
        type = expect_nf || Sig("x", val0_t, val1_t, term[1].eras);
        break;
      case "Fst":
        var pair_t = norm(null)(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the first element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = pair_t[1].typ0;
        break;
      case "Snd":
        var pair_t = norm(null)(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the second element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = subst(pair_t[1].typ1, Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Prj":
        var pair_t = norm(null)(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to project the elements of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var ex_ctx = ctx_ext(term[1].nam0, pair_t[1].typ0, ctx);
        var ex_ctx = ctx_ext(term[1].nam1, pair_t[1].typ1, ex_ctx);
        try {
          type = typecheck(term[1].body, shift(expect, 2, 0), defs, ex_ctx, [term, ctx]);
        } catch (e) {
          type = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        }
        type = subst(type, Snd(shift(term[1].pair, 1, 0), term[1].eras), 0);
        type = subst(type, Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Eql":
        //var val0_t = norm(null)(typecheck(term[1].val0, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        //var val1_t = norm(null)(typecheck(term[1].val1, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        //MATCH(val0_t, val1_t, ctx);
        type = Typ();
        break;
      case "Rfl":
        type = Eql(term[1].expr, term[1].expr);
        break;
      case "Sym":
        var prof_t = norm(null)(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use sym with an invalid equality proof.");
        }
        type = Eql(prof_t[1].val1, prof_t[1].val0);
        break;
      case "Eta":
        var expr_t = norm(null)(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (expr_t[0] === "Sig") {
          type = Eql(term[1].expr, Par(Fst(term[1].expr, expr_t[1].eras), Snd(term[1].expr, expr_t[1].eras), expr_t[1].eras));
        } else if (expr_t[0] === "All") {
          type = Eql(term[1].expr, Lam("x", null, App(shift(term[1].expr, 1, 0), Var(0), false), false));
        } else {
          ERROR("Invalid use of eta.");
        }
        break;
      case "Cng":
        var prof_t = norm(null)(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use cong with an invalid equality proof.");
        }
        type = Eql(App(term[1].func, prof_t[1].val0, false), App(term[1].func, prof_t[1].val1, false));
        break;
      case "Rwt":
        var prof_t = norm(null)(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use rewrite with an invalid equality proof.");
        }
        var expr_t0 = subst(term[1].type, prof_t[1].val0, 0);
        var expr_t1 = typecheck(term[1].expr, null, defs, ctx, [term, ctx]);
        MATCH(expr_t1, expr_t0, ctx);
        type = subst(term[1].type, prof_t[1].val1, 0);
        break;
      case "Cst":
        var prof_t = norm(null)(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use cast with an invalid equality proof.");
        }
        if (!equal(term[1].val0, prof_t[1].val0, defs)) {
          ERROR("Cast failed because " + TERM(term[1].val0) + " != " + TERM(prof_t[1].val0));
        }
        if (!equal(term[1].val0, prof_t[1].val0, defs)) {
          ERROR("Cast failed because " + TERM(term[1].val1) + " != " + TERM(prof_t[1].val1));
        }
        type = typecheck(term[1].val0, expect_nf, defs, ctx, [term, ctx]);
        break;
      case "Slf":
        var ex_ctx = ctx_ext(term[1].name, term, ctx);
        var type_t = typecheck(term[1].type, null, defs, ex_ctx, [term, ctx]);
        MATCH(type_t, Typ(), ctx);
        return Typ();
      case "New":
        var type = norm(null)(term[1].type, defs, {undup: true, weak: true});
        if (type[0] !== "Slf") {
          ERROR("Attempted to make an instance of a type that isn't self.");
        }
        typecheck(type, null, defs, ctx, [term, ctx]);
        typecheck(term[1].expr, subst(type[1].type, Ann(type, term, true), 0), defs, ctx, [term, ctx]);
        type = term[1].type;
        break;
      case "Use":
        var expr_t = norm(null)(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, {undup: true, weak: true});
        if (expr_t[0] !== "Slf") {
          ERROR("Attempted to use a value that isn't a self type.");
        }
        type = subst(expr_t[1].type, term[1].expr, 0);
        break;
      case "Ann":
        if (!term[1].done) {
          term[1].done = true;
          try {
            typecheck(term[1].expr, term[1].type, defs, ctx, [term, ctx]);
          } catch (e) {
            term[1].done = false;
            throw e;
          }
        }
        type = term[1].type;
        break;
      case "Log":
        if (debug) {
          var msgv = term[1].msge;
          try {
            var msgt = norm(null)(typecheck(msgv, null, defs, ctx, [term, ctx]), {}, {unbox: true, weak: false});
          } catch (e) {
            console.log(e);
            var msgt = Hol("");
          }
          console.log("[LOG]");
          console.log("Term: " + show(msgv, ctx_names(ctx)));
          console.log("Type: " + show(msgt, ctx_names(ctx)) + "\n");
        }
        type = typecheck(term[1].expr, expect, defs, ctx, inside);
        break;
      case "Hol":
        var msg = "";
        msg += "Hole found" + (term[1].name ? ": '" + term[1].name + "'" : "") + "\n";
        if (expect) {
          msg += "- With goal... " + TERM(norm(null)(expect, {}, {unbox: true, weak: false}), ctx_names(ctx)) + "\n";
          //if (inside) {
            //msg += "- Inside of... " + CODE(show(inside[0], ctx_names(inside[1]))) + "\n";
          //}
        }
        var cstr = ctx_str_(ctx, defs);
        msg += "- With context:\n" + (cstr.length > 0 ? cstr + "\n" : "");
        if (debug && !hide_hole[term[1].name]) {
          console.log(msg);
          hide_hole[term[1].name] = true;
        }
        if (expect) {
          type = expect;
        }
        break;
      case "Ref":
        if (!defs[term[1].name]) {
          ERROR("Undefined reference: `" + term[1].name + "`.");
        } else if (!type_memo[term[1].name]) {
          type_memo[term[1].name] = typecheck(defs[term[1].name], null, defs, ctx, [term, ctx]);
        }
        type = type_memo[term[1].name]
        break;
      default:
        throw "TODO: type checker for " + term[0] + ".";
    }
    if (expect) {
      MATCH(type, expect, ctx);
    }
    return type;
  };

  try {
    return typecheck(term, expect, defs, ctx, inside);
  } catch (e) {
    if (typeof e === "string") {
      throw e;
    } else {
      console.log(e);
      throw "Sorry, the type-checker couldn't handle your input.";
    }
  }
};

module.exports = {
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
  Cng,
  Eta,
  Rwt,
  Cst,
  Slf,
  New,
  Use,
  Ann,
  Log,
  Hol,
  Ref,
  put_float_on_word,
  get_float_on_word,
  shift,
  subst,
  subst_many,
  norm,
  erase,
  equal,
  uses,
  boxcheck,
  typecheck,
  ctx_new,
  ctx_ext,
  ctx_get,
  ctx_str,
  ctx_names,
};
