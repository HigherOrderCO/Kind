(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.formality = {}));
}(this, (function (exports) { 'use strict';

  function marked_code(loc) {
    var text = "";
    var idx = 0;
    var lines = loc.code.split("\n");
    var from_line = Math.max(loc.row - 4, 0);
    var to_line = Math.min(loc.row + 4, lines.length - 1);
    for (var line = 0; line < lines.length; ++line) {
      var write = line >= from_line && line <= to_line;
      if (write) text += "\x1b[2m" + ("    " + (line + 1)).slice(-4) + "| \x1b[0m";
      for (var i = 0; i < lines[line].length; ++i) {
        if (idx >= loc.idx && idx < loc.idx + loc.len) {
          if (write) text += "\x1b[31m\x1b[4m" + lines[line][i] + "\x1b[0m";
          idx += 1;
        } else {
          if (write) text += "\x1b[2m" + lines[line][i] + "\x1b[0m";
          idx += 1;
        }
      }
      if (write) text += "\n";
      idx += 1;
    }
    return text;
  }

  function random_excuse() {
    var excuses = [
      "My parse-robot brain isn't perfect, sorry.",
      "What? If you can't get this right, don't expect me to!",
      "I'm doing my best, ok?",
      "I hope you figure it out!",
      "I can't help any further. But I can pray for you!",
      "I with I could be more precise...",
      "Hey, at least I'm showing a location.",
      "Why programming needs to be so hard?",
      "I hope this doesn't affect your deadlines!",
      "If this is hard, consider relaxing. You deserve it!",
      "It takes me some time to process things. Have patience with me!"
    ];
    return excuses[Math.floor(Math.random() * excuses.length)];
  }

  // :::::::::::::::::::::
  // :: Stringification ::
  // :::::::::::::::::::::

  // Converts a term to a string
  const show = ([ctor, args], nams = [], opts = {}) => {
    const format = (term) => {
      //function read_bits(term) {
        //var bits = [];
        ////λbe.λb0.λb1.(b0 ...)
        //var term = term[1].body[1].body[1].body;
        //while (term[0] !== "Var") {
          //bits.push(term[1].func[1].index === 1 ? 0 : 1);
          //term = term[1].argm[1].body[1].body[1].body;
        //}
        //return parseInt(bits.join(""), 2);
      //}
      function read_nums(term) {
        var nums = [];
        while (term[1].body[1].body[0] !== "Var") {
          term = term[1].body[1].body;
          nums.push(term[1].func[1].argm[1].numb);
          term = term[1].argm;
        }
        return nums;
      }
      try {
        var nums = read_nums(term);
      } catch (e) {
        return null;
      }
      var str = "";
      for (var i = 0; i < nums.length; ++i) {
        str += String.fromCharCode(nums[i]);
        if (/[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(str[str.length-1])) {
          return null; // non-printable; TODO: use a tag instead
        }
      }
      if (str.length > 0) {
        return '"' + str + '"';
      } else {
        return null;
      }
    };

    switch (ctor) {
      case "Var":
        var name = nams[nams.length - args.index - 1];
        if (!name) {
          return "^" + args.index;
        } else {
          var suff = "";
          for (var i = 0; i < args.index; ++i) {
            if (nams[nams.length - i - 1] === name) {
              var suff = suff + "^";
            }
          }
          return name + suff;
        }
      case "Typ":
        return "Type";
      case "All":
        var term = [ctor, args];
        var erase = [];
        var names = [];
        var types = [];
        while (term[0] === "All") {
          erase.push(term[1].eras);
          names.push(term[1].name);
          types.push(show(term[1].bind, nams.concat(names.slice(0,-1)), opts));
          term = term[1].body;
        }
        var text = "(";
        for (var i = 0; i < names.length; ++i) {
          var not_last = i < names.length - 1;
          text += names[i] + (names[i].length > 0 ? " : " : ":") + types[i];
          text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
        }
        text += ") -> ";
        text += show(term, nams.concat(names), opts);
        return text;
      case "Lam":
        var term = [ctor, args];
        var formatted = format(term);
        if (formatted) {
          return formatted;
        } else {
          var erase = [];
          var names = [];
          var types = [];
          while (term[0] === "Lam") {
            erase.push(term[1].eras);
            names.push(term[1].name);
            types.push(term[1].bind
              ? show(term[1].bind, nams.concat(names.slice(0,-1)), opts)
              : null);
            term = term[1].body;
          }
          var text = "(";
          for (var i = 0; i < names.length; ++i) {
            var not_last = i < names.length - 1;
            text += names[i] + (types[i] !== null ? " : " + types[i] : "");
            text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
          }
          text += ") => ";
          text += show(term, nams.concat(names), opts);
          return text;
        }
      case "App":
        var text = ")";
        var term = [ctor, args];
        var last = true;
        while (term[0] === "App") {
          text = show(term[1].argm, nams, opts)
               + (term[1].eras ? (!last ? "; " : ";") : !last ? ", " : "")
               + text;
          term = term[1].func;
          last = false;
        }
        if (term[0] === "Ref" || term[0] === "Var" || term[0] === "Tak") {
          var func = show(term, nams, opts);
        } else {
          var func = "(" + show(term,nams, opts) + ")";
        }
        return func + "(" + text;
      case "Num":
        return "Number";
      case "Val":
        return args.numb.toString();
      case "Op1":
      case "Op2":
        var func = args.func;
        var num0 = show(args.num0, nams, opts);
        var num1 = show(args.num1, nams, opts);
        return num0 + " " + func + " " + num1;
      case "Ite":
        var cond = show(args.cond, nams, opts);
        var if_t = show(args.if_t, nams, opts);
        var if_f = show(args.if_f, nams, opts);
        return "if " + cond + " then " + if_t + " else " + if_f;
      case "Slf":
        var name = args.name;
        var type = show(args.type, nams.concat([name]), opts);
        return "${" + name + "} " + type;
      case "New":
        var type = show(args.type, nams, opts);
        var expr = show(args.expr, nams, opts);
        return "new(" + type + ") " + expr;
      case "Use":
        var expr = show(args.expr, nams, opts);
        return "use(" + expr + ")";
      case "Ann":
        var type = show(args.type, nams, opts);
        var expr = show(args.expr, nams, opts);
        return expr + " :: " + type;
      case "Log":
        var expr = show(args.expr, nams, opts);
        return expr;
      case "Hol":
        return "?" + args.name;
      case "Ref":
        return !opts.full_refs ? args.name.replace(new RegExp(".*/", "g"), "") : args.name;
    }
  };

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
  };

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
  };

  // subst_many : Term -> [Term] -> Nat -> Term
  const subst_many = (term, vals, depth) => {
    for (var i = 0; i < vals.length; ++i) {
      term = subst(term, shift(vals[i], vals.length - i - 1, 0), depth + vals.length - i - 1);
    }
    return term;
  };

  // ::::::::::::::::
  // :: Evaluation ::
  // ::::::::::::::::

  const names_new = null;

  const names_ext = (bind, name, rest) => {
    return {bind, name, rest};
  };

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
        case "Ref": return dereference(term.name, term.eras);
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
  };

  // ::::::::::::::
  // :: Equality ::
  // ::::::::::::::

  // equal : Term -> Term -> Number -> Defs -> Opts -> Bool
  const equal = (a, b, depth, defs={}, opts={}) => {

    const Eqs = (a, b, d) => ["Eqs", {a, b, d}];
    const Bop = (v, x, y) => ["Bop", {v, x, y}];
    const And = (x,y)     => Bop(false, x, y);
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
    };

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

  const ctx_str = (ctx, print) => {
    const pad_right = (len, chr, str) => {
      while (str.length < len) {
        str += chr;
      }
      return str;
    };
    var txt = [];
    var max_len = 0;
    for (var c = ctx; c.length > 0; c = c.rest) {
      max_len = Math.max(c.name.length, max_len);
    }
    for (var c = ctx; c.length > 0; c = c.rest) {
      var name = c.name;
      var type = c.type;
      var tstr = print(type, ctx_names(c.rest));
      txt.push("\x1b[2m- " + pad_right(max_len, " ", c.name) + " : " + tstr + "\x1b[0m");
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

  // Checks if a term is well-typed. Does NOT check
  // termination and affinity. Those will be separate.
  // typecheck : String -> Maybe(Term) -> Defs -> Opts -> Term
  const typecheck = (name, expect, defs = {}, opts = {}) => {
    var holes = {};
    var types = {};

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
        err_msg += "\n- When checking " + print(term, ctx_names(ctx));
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
  }
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

  var core = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Var: Var,
    Typ: Typ,
    All: All,
    Lam: Lam,
    App: App,
    Slf: Slf,
    New: New,
    Use: Use,
    Ann: Ann,
    Log: Log,
    Hol: Hol,
    Ref: Ref,
    Num: Num,
    Val: Val,
    Op1: Op1,
    Op2: Op2,
    Ite: Ite,
    equal: equal,
    erase: erase,
    reduce: reduce,
    shift: shift,
    subst: subst,
    subst_many: subst_many,
    typecheck: typecheck,
    uses: uses,
    is_affine: is_affine,
    is_elementary: is_elementary,
    is_terminating: is_terminating
  });

  var strictUriEncode = function (str) {
  	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
  		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  	});
  };

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var token = '%[a-f0-9]{2}';
  var singleMatcher = new RegExp(token, 'gi');
  var multiMatcher = new RegExp('(' + token + ')+', 'gi');

  function decodeComponents(components, split) {
  	try {
  		// Try to decode the entire string first
  		return decodeURIComponent(components.join(''));
  	} catch (err) {
  		// Do nothing
  	}

  	if (components.length === 1) {
  		return components;
  	}

  	split = split || 1;

  	// Split the array in 2 parts
  	var left = components.slice(0, split);
  	var right = components.slice(split);

  	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }

  function decode(input) {
  	try {
  		return decodeURIComponent(input);
  	} catch (err) {
  		var tokens = input.match(singleMatcher);

  		for (var i = 1; i < tokens.length; i++) {
  			input = decodeComponents(tokens, i).join('');

  			tokens = input.match(singleMatcher);
  		}

  		return input;
  	}
  }

  function customDecodeURIComponent(input) {
  	// Keep track of all the replacements and prefill the map with the `BOM`
  	var replaceMap = {
  		'%FE%FF': '\uFFFD\uFFFD',
  		'%FF%FE': '\uFFFD\uFFFD'
  	};

  	var match = multiMatcher.exec(input);
  	while (match) {
  		try {
  			// Decode as big chunks as possible
  			replaceMap[match[0]] = decodeURIComponent(match[0]);
  		} catch (err) {
  			var result = decode(match[0]);

  			if (result !== match[0]) {
  				replaceMap[match[0]] = result;
  			}
  		}

  		match = multiMatcher.exec(input);
  	}

  	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
  	replaceMap['%C2'] = '\uFFFD';

  	var entries = Object.keys(replaceMap);

  	for (var i = 0; i < entries.length; i++) {
  		// Replace all decoded components
  		var key = entries[i];
  		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  	}

  	return input;
  }

  var decodeUriComponent = function (encodedURI) {
  	if (typeof encodedURI !== 'string') {
  		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
  	}

  	try {
  		encodedURI = encodedURI.replace(/\+/g, ' ');

  		// Try the built in decoder first
  		return decodeURIComponent(encodedURI);
  	} catch (err) {
  		// Fallback to a more advanced decoder
  		return customDecodeURIComponent(encodedURI);
  	}
  };

  function encoderForArrayFormat(opts) {
  	switch (opts.arrayFormat) {
  		case 'index':
  			return function (key, value, index) {
  				return value === null ? [
  					encode(key, opts),
  					'[',
  					index,
  					']'
  				].join('') : [
  					encode(key, opts),
  					'[',
  					encode(index, opts),
  					']=',
  					encode(value, opts)
  				].join('');
  			};

  		case 'bracket':
  			return function (key, value) {
  				return value === null ? encode(key, opts) : [
  					encode(key, opts),
  					'[]=',
  					encode(value, opts)
  				].join('');
  			};

  		default:
  			return function (key, value) {
  				return value === null ? encode(key, opts) : [
  					encode(key, opts),
  					'=',
  					encode(value, opts)
  				].join('');
  			};
  	}
  }

  function parserForArrayFormat(opts) {
  	var result;

  	switch (opts.arrayFormat) {
  		case 'index':
  			return function (key, value, accumulator) {
  				result = /\[(\d*)\]$/.exec(key);

  				key = key.replace(/\[\d*\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}

  				accumulator[key][result[1]] = value;
  			};

  		case 'bracket':
  			return function (key, value, accumulator) {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				} else if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};

  		default:
  			return function (key, value, accumulator) {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }

  function encode(value, opts) {
  	if (opts.encode) {
  		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
  	}

  	return value;
  }

  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	} else if (typeof input === 'object') {
  		return keysSorter(Object.keys(input)).sort(function (a, b) {
  			return Number(a) - Number(b);
  		}).map(function (key) {
  			return input[key];
  		});
  	}

  	return input;
  }

  function extract(str) {
  	var queryStart = str.indexOf('?');
  	if (queryStart === -1) {
  		return '';
  	}
  	return str.slice(queryStart + 1);
  }

  function parse(str, opts) {
  	opts = objectAssign({arrayFormat: 'none'}, opts);

  	var formatter = parserForArrayFormat(opts);

  	// Create an object with no prototype
  	// https://github.com/sindresorhus/query-string/issues/47
  	var ret = Object.create(null);

  	if (typeof str !== 'string') {
  		return ret;
  	}

  	str = str.trim().replace(/^[?#&]/, '');

  	if (!str) {
  		return ret;
  	}

  	str.split('&').forEach(function (param) {
  		var parts = param.replace(/\+/g, ' ').split('=');
  		// Firefox (pre 40) decodes `%3D` to `=`
  		// https://github.com/sindresorhus/query-string/pull/37
  		var key = parts.shift();
  		var val = parts.length > 0 ? parts.join('=') : undefined;

  		// missing `=` should be `null`:
  		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  		val = val === undefined ? null : decodeUriComponent(val);

  		formatter(decodeUriComponent(key), val, ret);
  	});

  	return Object.keys(ret).sort().reduce(function (result, key) {
  		var val = ret[key];
  		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
  			// Sort object keys, not values
  			result[key] = keysSorter(val);
  		} else {
  			result[key] = val;
  		}

  		return result;
  	}, Object.create(null));
  }

  var extract_1 = extract;
  var parse_1 = parse;

  var stringify = function (obj, opts) {
  	var defaults = {
  		encode: true,
  		strict: true,
  		arrayFormat: 'none'
  	};

  	opts = objectAssign(defaults, opts);

  	if (opts.sort === false) {
  		opts.sort = function () {};
  	}

  	var formatter = encoderForArrayFormat(opts);

  	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
  		var val = obj[key];

  		if (val === undefined) {
  			return '';
  		}

  		if (val === null) {
  			return encode(key, opts);
  		}

  		if (Array.isArray(val)) {
  			var result = [];

  			val.slice().forEach(function (val2) {
  				if (val2 === undefined) {
  					return;
  				}

  				result.push(formatter(key, val2, result.length));
  			});

  			return result.join('&');
  		}

  		return encode(key, opts) + '=' + encode(val, opts);
  	}).filter(function (x) {
  		return x.length > 0;
  	}).join('&') : '';
  };

  var parseUrl = function (str, opts) {
  	return {
  		url: str.split('?')[0] || '',
  		query: parse(extract(str), opts)
  	};
  };

  var queryString = {
  	extract: extract_1,
  	parse: parse_1,
  	stringify: stringify,
  	parseUrl: parseUrl
  };

  var urlSetQuery_1 = urlSetQuery;
  function urlSetQuery (url, query) {
    if (query) {
      // remove optional leading symbols
      query = query.trim().replace(/^(\?|#|&)/, '');

      // don't append empty query
      query = query ? ('?' + query) : query;

      var parts = url.split(/[\?\#]/);
      var start = parts[0];
      if (query && /\:\/\/[^\/]*$/.test(start)) {
        // e.g. http://foo.com -> http://foo.com/
        start = start + '/';
      }
      var match = url.match(/(\#.*)$/);
      url = start + query;
      if (match) { // add hash back in
        url = url + match[0];
      }
    }
    return url
  }

  var ensureHeader_1 = ensureHeader;
  function ensureHeader (headers, key, value) {
    var lower = key.toLowerCase();
    if (!headers[key] && !headers[lower]) {
      headers[key] = value;
    }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var win;

  if (typeof window !== "undefined") {
      win = window;
  } else if (typeof commonjsGlobal !== "undefined") {
      win = commonjsGlobal;
  } else if (typeof self !== "undefined"){
      win = self;
  } else {
      win = {};
  }

  var window_1 = win;

  var isFunction_1 = isFunction;

  var toString = Object.prototype.toString;

  function isFunction (fn) {
    var string = toString.call(fn);
    return string === '[object Function]' ||
      (typeof fn === 'function' && string !== '[object RegExp]') ||
      (typeof window !== 'undefined' &&
       // IE8 and below
       (fn === window.setTimeout ||
        fn === window.alert ||
        fn === window.confirm ||
        fn === window.prompt))
  }

  var trim = function(string) {
    return string.replace(/^\s+|\s+$/g, '');
  }
    , isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };

  var parseHeaders = function (headers) {
    if (!headers)
      return {}

    var result = {};

    var headersArr = trim(headers).split('\n');

    for (var i = 0; i < headersArr.length; i++) {
      var row = headersArr[i];
      var index = row.indexOf(':')
      , key = trim(row.slice(0, index)).toLowerCase()
      , value = trim(row.slice(index + 1));

      if (typeof(result[key]) === 'undefined') {
        result[key] = value;
      } else if (isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [ result[key], value ];
      }
    }

    return result
  };

  var immutable = extend;

  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  function extend() {
      var target = {};

      for (var i = 0; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
              if (hasOwnProperty$1.call(source, key)) {
                  target[key] = source[key];
              }
          }
      }

      return target
  }

  var xhr = createXHR;
  // Allow use of default import syntax in TypeScript
  var default_1 = createXHR;
  createXHR.XMLHttpRequest = window_1.XMLHttpRequest || noop;
  createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window_1.XDomainRequest;

  forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
      createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
          options = initParams(uri, options, callback);
          options.method = method.toUpperCase();
          return _createXHR(options)
      };
  });

  function forEachArray(array, iterator) {
      for (var i = 0; i < array.length; i++) {
          iterator(array[i]);
      }
  }

  function isEmpty(obj){
      for(var i in obj){
          if(obj.hasOwnProperty(i)) return false
      }
      return true
  }

  function initParams(uri, options, callback) {
      var params = uri;

      if (isFunction_1(options)) {
          callback = options;
          if (typeof uri === "string") {
              params = {uri:uri};
          }
      } else {
          params = immutable(options, {uri: uri});
      }

      params.callback = callback;
      return params
  }

  function createXHR(uri, options, callback) {
      options = initParams(uri, options, callback);
      return _createXHR(options)
  }

  function _createXHR(options) {
      if(typeof options.callback === "undefined"){
          throw new Error("callback argument missing")
      }

      var called = false;
      var callback = function cbOnce(err, response, body){
          if(!called){
              called = true;
              options.callback(err, response, body);
          }
      };

      function readystatechange() {
          if (xhr.readyState === 4) {
              setTimeout(loadFunc, 0);
          }
      }

      function getBody() {
          // Chrome with requestType=blob throws errors arround when even testing access to responseText
          var body = undefined;

          if (xhr.response) {
              body = xhr.response;
          } else {
              body = xhr.responseText || getXml(xhr);
          }

          if (isJson) {
              try {
                  body = JSON.parse(body);
              } catch (e) {}
          }

          return body
      }

      function errorFunc(evt) {
          clearTimeout(timeoutTimer);
          if(!(evt instanceof Error)){
              evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") );
          }
          evt.statusCode = 0;
          return callback(evt, failureResponse)
      }

      // will load the data & process the response in a special response object
      function loadFunc() {
          if (aborted) return
          var status;
          clearTimeout(timeoutTimer);
          if(options.useXDR && xhr.status===undefined) {
              //IE8 CORS GET successful response doesn't have a status field, but body is fine
              status = 200;
          } else {
              status = (xhr.status === 1223 ? 204 : xhr.status);
          }
          var response = failureResponse;
          var err = null;

          if (status !== 0){
              response = {
                  body: getBody(),
                  statusCode: status,
                  method: method,
                  headers: {},
                  url: uri,
                  rawRequest: xhr
              };
              if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                  response.headers = parseHeaders(xhr.getAllResponseHeaders());
              }
          } else {
              err = new Error("Internal XMLHttpRequest Error");
          }
          return callback(err, response, response.body)
      }

      var xhr = options.xhr || null;

      if (!xhr) {
          if (options.cors || options.useXDR) {
              xhr = new createXHR.XDomainRequest();
          }else{
              xhr = new createXHR.XMLHttpRequest();
          }
      }

      var key;
      var aborted;
      var uri = xhr.url = options.uri || options.url;
      var method = xhr.method = options.method || "GET";
      var body = options.body || options.data;
      var headers = xhr.headers = options.headers || {};
      var sync = !!options.sync;
      var isJson = false;
      var timeoutTimer;
      var failureResponse = {
          body: undefined,
          headers: {},
          statusCode: 0,
          method: method,
          url: uri,
          rawRequest: xhr
      };

      if ("json" in options && options.json !== false) {
          isJson = true;
          headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json"); //Don't override existing accept header declared by user
          if (method !== "GET" && method !== "HEAD") {
              headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json"); //Don't override existing accept header declared by user
              body = JSON.stringify(options.json === true ? body : options.json);
          }
      }

      xhr.onreadystatechange = readystatechange;
      xhr.onload = loadFunc;
      xhr.onerror = errorFunc;
      // IE9 must have onprogress be set to a unique function.
      xhr.onprogress = function () {
          // IE must die
      };
      xhr.onabort = function(){
          aborted = true;
      };
      xhr.ontimeout = errorFunc;
      xhr.open(method, uri, !sync, options.username, options.password);
      //has to be after open
      if(!sync) {
          xhr.withCredentials = !!options.withCredentials;
      }
      // Cannot set timeout with sync request
      // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
      // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
      if (!sync && options.timeout > 0 ) {
          timeoutTimer = setTimeout(function(){
              if (aborted) return
              aborted = true;//IE9 may still call readystatechange
              xhr.abort("timeout");
              var e = new Error("XMLHttpRequest timeout");
              e.code = "ETIMEDOUT";
              errorFunc(e);
          }, options.timeout );
      }

      if (xhr.setRequestHeader) {
          for(key in headers){
              if(headers.hasOwnProperty(key)){
                  xhr.setRequestHeader(key, headers[key]);
              }
          }
      } else if (options.headers && !isEmpty(options.headers)) {
          throw new Error("Headers cannot be set on an XDomainRequest object")
      }

      if ("responseType" in options) {
          xhr.responseType = options.responseType;
      }

      if ("beforeSend" in options &&
          typeof options.beforeSend === "function"
      ) {
          options.beforeSend(xhr);
      }

      // Microsoft Edge browser sends "undefined" when send is called with undefined value.
      // XMLHttpRequest spec says to pass null as body to indicate no body
      // See https://github.com/naugtur/xhr/issues/100.
      xhr.send(body || null);

      return xhr


  }

  function getXml(xhr) {
      // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
      // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
      try {
          if (xhr.responseType === "document") {
              return xhr.responseXML
          }
          var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror";
          if (xhr.responseType === "" && !firefoxBugTakenEffect) {
              return xhr.responseXML
          }
      } catch (e) {}

      return null
  }

  function noop() {}
  xhr.default = default_1;

  var normalizeResponse = getResponse;
  function getResponse (opt, resp) {
    if (!resp) return null
    return {
      statusCode: resp.statusCode,
      headers: resp.headers,
      method: opt.method,
      url: opt.url,
      // the XHR object in browser, http response in Node
      rawRequest: resp.rawRequest ? resp.rawRequest : resp
    }
  }

  var noop$1 = function () {};

  var requestBrowser = xhrRequest;
  function xhrRequest (opt, cb) {
    delete opt.uri;

    // for better JSON.parse error handling than xhr module
    var useJson = false;
    if (opt.responseType === 'json') {
      opt.responseType = 'text';
      useJson = true;
    }

    var req = xhr(opt, function xhrRequestResult (err, resp, body) {
      if (useJson && !err) {
        try {
          var text = resp.rawRequest.responseText;
          body = JSON.parse(text);
        } catch (e) {
          err = e;
        }
      }

      resp = normalizeResponse(opt, resp);
      if (err) cb(err, null, resp);
      else cb(err, body, resp);
      cb = noop$1;
    });

    // Patch abort() so that it also calls the callback, but with an error
    var onabort = req.onabort;
    req.onabort = function () {
      var ret = onabort.apply(req, Array.prototype.slice.call(arguments));
      cb(new Error('XHR Aborted'));
      cb = noop$1;
      return ret
    };

    return req
  }

  // this is replaced in the browser


  var mimeTypeJson = 'application/json';
  var noop$2 = function () {};

  var xhrRequest_1 = xhrRequest$1;
  function xhrRequest$1 (url, opt, cb) {
    if (!url || typeof url !== 'string') {
      throw new TypeError('must specify a URL')
    }
    if (typeof opt === 'function') {
      cb = opt;
      opt = {};
    }
    if (cb && typeof cb !== 'function') {
      throw new TypeError('expected cb to be undefined or a function')
    }

    cb = cb || noop$2;
    opt = opt || {};

    var defaultResponse = opt.json ? 'json' : 'text';
    opt = objectAssign({ responseType: defaultResponse }, opt);

    var headers = opt.headers || {};
    var method = (opt.method || 'GET').toUpperCase();
    var query = opt.query;
    if (query) {
      if (typeof query !== 'string') {
        query = queryString.stringify(query);
      }
      url = urlSetQuery_1(url, query);
    }

    // allow json response
    if (opt.responseType === 'json') {
      ensureHeader_1(headers, 'Accept', mimeTypeJson);
    }

    // if body content is json
    if (opt.json && method !== 'GET' && method !== 'HEAD') {
      ensureHeader_1(headers, 'Content-Type', mimeTypeJson);
      opt.body = JSON.stringify(opt.body);
    }

    opt.method = method;
    opt.url = url;
    opt.headers = headers;
    delete opt.query;
    delete opt.json;

    return requestBrowser(opt, cb)
  }

  var xhrRequestPromise = function (url, options) {
    return new Promise(function (resolve, reject) {
      xhrRequest_1(url, options, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };

  // This should be replaced by rollup
  const version = "0.1.218";

  // This module is responsible for loading and publishing files from the Forall repository

  // load_file receives the name of the file and returns the code asyncronously
  //
  // load_file(file: String) -> Promise<String>
  const load_file = (file) => {
    console.log("Loading file", file);
    return post("load_file", {file});
  };

  // save_file receives the file name without the version, the code, and returns, asynchronously
  // the saved global file name (with the version after the @).
  //
  // save_file(file: String, code: String) -> Promise<String>
  const save_file = (file, code) => post("save_file", {file, code});

  // Receives a file name and returns a list of parents for that file
  //
  // load_file_parents(file: String) -> Promise<String[]>
  const load_file_parents = (file) => post("load_file_parents", {file});

  // :::::::::::::::::::::::::::::
  // :: Env-specific decorators ::
  // :::::::::::::::::::::::::::::
  // Transforms a file loader in order to add local file system cache.
  // It receives the file loader and optionally, a path to save the files
  //
  // with_file_system_cache(
  //   loader: String -> Promise<String>,
  //   cache_dir_path?: String
  // ) -> Promise<String>
  let with_file_system_cache;

  // Transforms a file loader in order to add local files for development.
  // It receives the file loader and optionally, a path where the files are
  //
  // with_local_files(
  //   loader: String -> Promise<String>,
  //   local_dir_path?: String
  // ) -> Promise<String>
  let with_local_files;

  // Transforms a file loader in order to add local file system cache.
  // It receives the file loader and optionally, a prefix for the local storage key
  // defaulting to `FPM@${FM_VERSION}/`
  //
  // with_local_storage_cache(
  //   loader: String -> Promise<String>,
  //   prefix?: String
  // ) -> Promise<String>
  let with_local_storage_cache;

  if(typeof window === "object") {
    with_local_files = with_file_system_cache = () => {
      throw "Only available when running in NodeJS"
    };

    with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
      const cached = window.localStorage.getItem(prefix + file);
      if(cached) {
        return cached;
      }
    
      const code = await loader(file);
    
      window.localStorage.setItem(prefix + file, code);
    
      return code;
    };
  }
  else {
    with_local_storage_cache = () => {
      throw "Only available when running in Browser"
    };

    const fs_promise = import('fs');
    const path_promise = import('path');
    const util_promise = import('util');

    const imports = (async () => {
      const fs = await fs_promise;
      const path = await path_promise;
      const {promisify} = await util_promise;

      const async_read_file = promisify(fs.readFile);
      const async_write_file = promisify(fs.writeFile);

      return {fs, path, async_read_file, async_write_file};
    })();

    with_file_system_cache = (loader, cache_dir_path) => async (file) => {
      const {fs, path, async_read_file, async_write_file} = await imports;

      const dir_path = cache_dir_path || path.join(process.cwd(), "fm_modules");

      // Setup Cache dir
      const version_file_path = path.join(dir_path, "version");
      const has_cache_dir = fs.existsSync(dir_path);
      const has_version_file = has_cache_dir && fs.existsSync(version_file_path);
      const correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
      if (!has_cache_dir || !has_version_file || !correct_version) {
        if (has_cache_dir) {
          const files = fs.readdirSync(dir_path);
          for (var i = 0; i < files.length; ++i) {
            fs.unlinkSync(path.join(dir_path, files[i]));
          }
          fs.rmdirSync(dir_path);
        }
        fs.mkdirSync(dir_path);
        fs.writeFileSync(version_file_path, version);
      }

      const cached_file_path = path.join(dir_path, file + ".fm");
      if(fs.existsSync(cached_file_path)) {
        return await async_read_file(cached_file_path, "utf8");
      }
      
      const code = await loader(file);

      await async_write_file(cached_file_path, code, "utf8");

      return code;
    };

    with_local_files = (loader, local_dir_path) => async (file) => {
      const {fs, path, async_read_file} = await imports;
      const dir_path = local_dir_path || process.cwd();
      const local_file_path = path.join(dir_path, file + ".fm");
      const has_local_file = fs.existsSync(local_file_path);

      if(has_local_file) {
        return await async_read_file(local_file_path, "utf8");
      }

      return await loader(file);
    };

  }

  // The current API is just a simple RPC, so this function helps a lot
  const post = (func, body) => {
    return xhrRequestPromise("http://moonad.org/api/" + func,
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

  var loader = /*#__PURE__*/Object.freeze({
    __proto__: null,
    load_file_parents: load_file_parents,
    load_file: load_file,
    save_file: save_file,
    get with_file_system_cache () { return with_file_system_cache; },
    get with_local_files () { return with_local_files; },
    get with_local_storage_cache () { return with_local_storage_cache; }
  });

  // WARNING: here shall be dragons!

  // :::::::::::::
  // :: Parsing ::
  // :::::::::::::

  // Converts a string to a term
  const parse$1 = async (code, opts, root = true, loaded = {}) => {
    const file = opts.file || "main";
    const loader = opts.loader || load_file;
    const tokenify = opts.tokenify;

    // Imports a local/global file, merging its definitions
    async function do_import(import_file) {
      if (import_file.indexOf("#") === -1) {
        local_imports[import_file] = true;
      }
      if (!loaded[import_file]) {
        try {
          var file_code = await loader(import_file);
          loaded[import_file] = await parse$1(file_code, {file: import_file, tokenify, loader}, false, loaded);
        } catch (e) {
          throw e;
        }
      }
      var {defs: file_defs
        , adts: file_adts
        , open_imports: file_open_imports
        } = loaded[import_file];
      for (let term_path in file_defs) {
        defs[term_path] = file_defs[term_path];
      }
      for (let term_path in file_adts) {
        adts[term_path] = file_adts[term_path];
      }
      for (let open_import in file_open_imports) {
        open_imports[open_import] = true;
      }
      return true;
    }

    // Finds all imports with a given name
    function find_name_in_imports(name) {
      var found = [];
      for (var open_import in open_imports) {
        if (defs[open_import + "/" + name]) {
          found.push(open_import + "/" + name);
        }
      }
      return found;
    }

    // Returns current location
    function loc(len = 1) {
      return {idx: idx - len, col, row, len, file, code};
    }

    // Attempts to resolve a name into a full path
    function ref_path(str) {
      var result = (function () {
        if (str.indexOf("/") === -1) {
          var [str_file, str_name] = [null, str];
        } else {
          var [str_file, str_name] = str.split("/");
        }
        // If the reference includes the file...
        if (str_file) {
          // If it points to a qualified import, expand it
          if (qual_imports[str_file]) {
            return qual_imports[str_file] + "/" + str_name;
          // Otherwise, return an undefined reference, as written
          } else {
            return str_file + "/" + str_name;
          }
        // Otherwise, if the reference is missing the file...
        } else {
          // If there is a local definition with that name, point to it
          if (defs[file + "/" + str_name]) {
            return file + "/" + str_name;
          }
          // Otherwise, if there are many defs with that name, it is ambiguous
          var found = find_name_in_imports(str_name);
          if (found.length > 1) {
            var err_str = "Ambiguous reference: '" + str + "' could refer to:";
            for (var i = 0; i < found.length; ++i) {
              err_str += "\n- " + found[i];
            }
            err_str += "\nType its full name to prevent this error.";
            error(err_str);
          }
          // Otherwise, if there is exactly 1 open def with that name, point to it
          if (found.length === 1) {
            return found[0];
          }
        }
        // Otherwise, return an undefined reference to hte same file
        return file + "/" + str_name;
      })();
      return result;
    }

    // Makes a ref given a name
    function ref(str) {
      return Ref(ref_path(str), false, loc(str.length));
    }

    // Attempts to make a `ref` to a known base-lib term
    function base_ref(str) {
      var path = ref_path(str);
      if (defs[path]) {
        return Ref(path, false, loc(str.length));
      } else {
        error("Attempted to use a syntax-sugar which requires `" + str + "` to be in scope, but it isn't.\n"
            + "To solve that, add `import Base#` at the start of your file. This imports the official base libs.\n"
            + "See https://github.com/moonad/Formality/blob/master/DOCUMENTATION.md for more info.");
      }
    }

    // Defines a top-level term
    function define(path, term) {
      if (root) {
        var name = path.replace(new RegExp("^[\\w.]*\/"), "");
        var found = find_name_in_imports(name);
        if (found.length > 0 || defs[ref_path(name)]) {
          var err_str = "Attempted to re-define '" + name + "', which is already defined";
          if (found.length > 0) {
            err_str += " as:";
            for (var i = 0; i < found.length; ++i) {
              err_str += "\n- " + found[i];
            }
          } else {
            err_str += " on this file.";
          }
          error(err_str);
        }
      }
      defs[path] = term;
    }

    // Creates a new hole name
    function new_hole_name() {
      return "_" + file + "/line" + row + "_" + (hole_count++);
    }

    // Builds a lookup table
    function build_charset(chars) {
      var set = {};
      for (var i = 0; i < chars.length; ++i) {
        set[chars[i]] = 1;
      }
      return chr => set[chr] === 1;
    }

    // Some handy lookup tables
    const is_native_op =
      { ".+."   : 1
      , ".-."   : 1
      , ".*."   : 1
      , "./."   : 1
      , ".%."   : 1
      , ".**."  : 1
      , ".&."   : 1
      , ".|."   : 1
      , ".^."   : 1
      , ".~."   : 1
      , ".>>>." : 1
      , ".<<."  : 1
      , ".>."   : 1
      , ".<."   : 1
      , ".==."  : 1
    };

    const is_num_char  = build_charset("0123456789");
    const is_hex_char  = build_charset("0123456789abcdefABCDEF");
    const is_name_char = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.#-@/");
    const is_op_char   = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.#-@+*/%^!<>=&|");
    const is_spacy     = build_charset(" \t\n\r");
    const is_space     = build_charset(" ");
    const is_newline   = build_charset("\n");

    // Advances the cursor 1 step forward
    function next() {
      if (tokens) {
        tokens[tokens.length - 1][1] += code[idx] || "";
      }
      if (is_newline(code[idx])) {
        row += 1;
        col = 0;
      } else {
        col += 1;
      }
      idx += 1;
    }

    // Advances the cursor until it finds a parseable char, skipping spaces and comments
    function next_char(is_space = is_spacy) {
      skip_spaces(is_space);
      var head = code.slice(idx, idx + 2);
      // Skips comments
      while (head === "//" || head === "--" || head === "/*" || head === "{-") {
        // Single-line comments
        if (head === "//" || head === "--") {
          if (tokens) tokens.push(["cmm", ""]);
          while (code[idx] !== "\n" && idx < code.length) {
            next();
          }
          next();
        // Multi-line comments (docs)
        } else {
          if (tokens) tokens.push(["doc", ""]);
          while (code.slice(idx, idx + 2) !== "*/" && code.slice(idx, idx + 2) !== "-}" && idx < code.length) {
            next();
          }
          next();
          next();
        }
        if (tokens) tokens.push(["txt", ""]);
        skip_spaces(is_space);
        var head = code.slice(idx, idx + 2);
      }
    }

    // Skips space chars
    function skip_spaces(is_space = is_spacy) {
      while (idx < code.length && is_space(code[idx])) {
        next();
      }
    }

    // Attempts to match a specific string
    function match_here(string) {
      if (code.slice(idx, idx + 2) === "//" || code.slice(idx, idx + 2) === "--") {
        return false;
      } else {
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
    }

    // Seeks next non-whitespace, non-comment
    function seek(is_space = is_spacy) {
      var i = idx;
      while (i < code.length) {
        // Skips spaces
        if (is_space(code[i])) {
          ++i;
        // Skips comments
        } else if (code.slice(i, i + 2) === "//" || code.slice(i, i + 2) === "--") {
          while (i < code.length && code[i] !== "\n") {
            ++i;
          }      // Done
        } else {
          break;
        }
      }
      return i;
    }

    // Checks if next non-whitespace, non-comment matches
    function next_is(string, is_space = is_spacy) {
      var i = seek(is_space);
      return code.slice(i, i + string.length) === string;
    }

    // If next non-space char is string, consume it
    // Otherwise, don't affect the state
    function match(string, is_space = is_spacy) {
      if (next_is(string, is_space)) {
        next_char(is_space);
        match_here(string);
        return true;
      } else {
        return false;
      }
    }

    // Throws a parse error at this location
    function error(error_message) {
      var text = "";
      text += "[PARSE-ERROR]\n";
      text += error_message;
      text += "\n\nI noticed the problem on line " + (row+1) + ", col " + col + ", file \x1b[4m" + file + ".fm\x1b[0m:\n\n";
      text += marked_code(loc());
      text += "\nBut it could have happened a little earlier.\n";
      text += random_excuse();
      throw text;
    }

    // Constructs an INat adder. Example:
    //   15s(n : INat) : INat
    //     new(~INat) (~P, iz, s1) =>
    //     dup iz = iz
    //     dup s1 = s1
    //     dup s2 = # (~n : -INat, i : P(n)) => s1(~1s(n), s1(~n, i))
    //     dup s4 = # (~n : -INat, i : P(n)) => s2(~2s(n), s2(~n, i))
    //     dup s8 = # (~n : -INat, i : P(n)) => s4(~4s(n), s4(~n, i))
    //     dup nn = use(n)(~(x) => P(x), #iz, #s1)
    //     # s8(~4s(2s(1s(n))), s4(~2s(1s(n)), s2(~1s(n), s1(~n, nn))))
    // This exists for the sake of being able to create INats without using
    // `mul2` and `succ`, thus without requiring runtime reductions, but this
    // seems to be too heavy for the type-checker. A reduce-before-compiling
    // primitive would be a better way to achieve this, I believe.
    function build_inat_adder(name) {
      if (!defs[name+"z"]) {
        var numb = name === "" ? Math.pow(2,48) - 1 : Number(name);
        var bits = numb.toString(2);

        if (numb === 0) {
          return Lam("n", base_ref("INat"), Var(0), false);
        }

        var term = Var(0);

        var sucs = bits.length;
        for (var i = 0; i < sucs; ++i) {
          if (bits[sucs - i - 1] === "1") {
            var indx = Var(1 + sucs + 1 + 3);
            for (var j = 0; j < i; ++j) {
              if (bits[sucs - j - 1] === "1") {
                var indx = App(build_inat_adder(String(2**j)), indx, false);
              }
            }
            var term = App(App(Var(-1 + 1 + sucs - i), indx, true), term, false);
          }
        }

        var term = Put(term);
        var moti = Lam("x", null, App(Var(-1 + 1 + sucs + 1 + 3), Var(0), false), false);
        var term = Dup("nn", App(App(App(Use(Var(-1 + sucs + 1 + 3 + 1)), moti, true), Put(Var(-1 + sucs + 1)), false), Put(Var(-1 + sucs)), false), term);

        for (var i = 0; i < sucs; ++i) {
          if (i === sucs - 1) {
            var term = Dup("s1", Var(1), term);
          } else {
            var expr = App(App(Var(2), Var(1), true), Var(0), false);
            var expr = App(App(Var(2), App(build_inat_adder(String(2**(sucs-i-1-1))), Var(1), false), true), expr, false);
            var expr = Lam("N", App(Var(-1 + 1 + (sucs - i - 1) + 1 + 3), Var(0), false), expr, false);
            var expr = Lam("n", base_ref("INat"), expr, true);
            var expr = Put(expr);
            var term = Dup("z" + (2 ** (sucs - i - 1)), expr, term);
          }
        }

        var term = Dup("iz", Var(1), term);
        var term = Lam("s1", null, term, false);
        var term = Lam("iz", null, term, false);
        var term = Lam("P", null, term, true);
        var term = New(base_ref("INat"), term);
        var term = Lam("n", base_ref("INat"), term, false);

        define(name+"z", Ann(All("n", base_ref("INat"), base_ref("INat"), false), term));
      }
      return Ref(name+"z", false, loc(name.length + 1));
    }

    // Constructs an INat
    function build_inat(name) {
      if (!defs[name+"N"]) {
        var numb = name === "" ? Math.pow(2,48) - 1 : Number(name);
        var bits = numb.toString(2);
        var bits = bits === "0" ? "" : bits;
        var term = base_ref("izero");
        for (var i = 0; i < bits.length; ++i) {
          term = App(base_ref("imul2"), term, false);
          if (bits[i] === "1") {
            term = App(base_ref("isucc"), term, false);
          }
        }
        define(name+"N", term);
      }
      return Ref(name+"N", false, loc(name.length + 1));
    }

    // Constructs a Bits
    function build_bits(name) {
      if (!defs[name+"b"]) {
        var term = base_ref("be");
        for (var i = 0; i < name.length; ++i) {
          var term = App(base_ref(name[name.length - i - 1] === "0" ? "b0" : "b1"), term, false);
        }
        define(name+"b", term);
      }
      return Ref(name+"b", false, loc(name.length + 1));
    }

    // Constructs an IBits
    function build_ibits(name) {
      if (!defs[name+"B"]) {
        var term = base_ref("ibe");
        for (var i = 0; i < name.length; ++i) {
          var term = App(base_ref(name[name.length - i - 1] === "0" ? "ib0" : "ib1"), term, false);
        }
        define(name+"B", term);
      }
      return Ref(name+"B", false, loc(name.length + 1));
    }

    // Constructs a string
    function build_str(text, init) {
      var nums = [];
      for (var i = 0; i < text.length; ++i) {
        nums.push(text.charCodeAt(i));
      }
      var term = App(base_ref("nil"), Num(), true);
      for (var i = nums.length - 1; i >= 0; --i) {
        //var bits = build_bits(nums[i].toString(2));
        var bits = Val(nums[i]);
        var term = App(App(App(base_ref("cons"), Num(), true), bits, false), term, false);
      }
      return Ann(base_ref("String"), term, false, loc(idx - init));
    }

    // Constructs a nat
    function build_nat(name) {
      if (!defs["n"+name]) {
        var term = base_ref("zero");
        var numb = Number(name);
        for (var i = 0; i < numb; ++i) {
          term = App(base_ref("succ"), term, false);
        }
        define("n"+name, term);
      }
      return Ref("n"+name, false, loc(name.length + 1));
    }

    // Parses an exact string, errors if it isn't there
    function parse_exact(string) {
      if (!match(string)) {
        error("Expected '" + string + "', but found '" + (code[idx] || "(end of file)") + "' instead.");
      }
    }

    // Parses characters until `fn` is false
    function parse_string_here(fn = is_name_char) {
      var name = "";
      while (idx < code.length && fn(code[idx])) {
        name = name + code[idx];
        next();
      }
      return name;
    }

    // Skips spaces and calls parse_string_here
    function parse_string(fn = is_name_char) {
      next_char();
      return parse_string_here(fn);
    }

    // Parses an alphanumeric name
    function parse_name() {
      if (match(".")) {
        return "." + parse_string_here(is_op_char);
      } else {
        return parse_string();
      }
    }

    // Parses a term that demands a name
    function parse_named_term(nams) {
      // Parses matched term
      var term = parse_term(nams);

      // If no name given, attempts to infer it from term
      if (match("as ")) {
        var name = parse_string();
      } else if (term[0] === "Var" && term[1].__name) {
        var name = term[1].__name;
      } else if (term[0] === "Ref") {
        var name = term[1].name.slice(term[1].name.indexOf("/")+1);
      } else {
        error("The term \x1b[2m" + show(term, nams) + "\x1b[0m requires an explicit name.\n"
            + "Provide it with the 'as' keyword. Example: \x1b[2m" + show(term, nams) + " as x\x1b[0m");
      }

      return [name, term]
    }

    // Parses a number, variable, inline operator or reference
    function parse_ref(nams) {
      var term = null;
      if (tokens) tokens.push(["???", ""]);
      var name = parse_name();
      if (name.length === 0) {
        next();
        error("Unexpected symbol.");
      }
      var last = name[name.length - 1];
      var is_hex = name.slice(0, 2) === "0x";
      var is_bin = name.slice(0, 2) === "0b";
      var is_num = !isNaN(Number(name)) && !/[a-zA-Z]/.test(last);
      var is_lit = name.length > 1 && !isNaN(Number(name.slice(0,-1))) && /[a-zA-Z]/.test(last);
      if (is_hex || is_bin || is_num) {
        var term = Val(Number(name), loc(name.length));
      } else if (is_lit && last === "N") {
        var term = build_inat(name.slice(0,-1));
      } else if (is_lit && last === "n") {
        var term = build_nat(name.slice(0,-1));
      } else if (is_lit && last === "z") {
        var term = build_inat_adder(name.slice(0,-1));
      } else if (is_lit && last === "B") {
        var term = build_ibits(name.slice(0,-1));
      } else if (is_lit && last === "b") {
        var term = build_bits(name.slice(0,-1));
      } else {
        // Parses bruijn index
        var skip = 0;
        while (match_here("^")) {
          skip += 1;
        }
        // Finds variable in context
        for (var i = nams.length - 1; i >= 0; --i) {
          if (nams[i] === name) {
            if (skip === 0) break;
            else skip -= 1;
          }
        }
        // Variable
        if (i !== -1) {
          term = Var(nams.length - i - 1, loc(name.length));
          term[1].__name = name;
          if (tokens) tokens[tokens.length - 1][0] = "var";
        // Inline binary operator
        } else if (is_native_op[name]) {
          term = Lam("x", Num(), Lam("y", Num(), Op2(name, Var(1), Var(0)), false), false);
          if (tokens) tokens[tokens.length - 1][0] = "nop";
        // Reference
        } else {
          term = Ref(ref_path(name), false, loc(name.length));
          if (tokens) {
            tokens[tokens.length - 1][0] = "ref";
            tokens[tokens.length - 1][2] = term[1].name;
          }
        }
      }
      if (tokens) tokens.push(["txt", ""]);
      return term;
    }

    // Parses a grouping par, `(...)`
    function parse_grp(nams) {
      if (match("(")) {
        var term = parse_term(nams);
        var skip = parse_exact(")");
        return term;
      }
    }

    // Parses the type of types, `Type`
    function parse_typ(nams) {
      if (match("Type")) {
        return Typ(loc(4));
      }
    }

    // Parses a hole, `?name`
    function parse_hol(nams) {
      var init = idx;
      if (match("?")) {
        var name = parse_string_here();
        if (name === "") {
          name = new_hole_name();
        }
        if (used_hole_name[name]) {
          error("Reused hole name: " + name);
        } else {
          used_hole_name[name] = true;
        }
        return Hol(name, loc(idx - init));
      }
    }

    // Parses a lambda `{x : A} t` or a forall `{x : A} -> B`
    function parse_lam(nams) {
      function is_lam_or_all() {
        // TODO: this is ugly, improve
        var i = idx;
        if (i < code.length && code[i] === "(")          { ++i; } // skips `(`
        while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
        //if (code[i] === "~")                             { ++i; } // skips `~`
        while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
        while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
        while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
        if (code[i] === ":")                             { ++i; } // skips `:`
        if (code[i] === " ") return true;                         // found ` `
        if (code[i] === ";") return true;                         // found `,`
        if (code[i] === ",") return true;                         // found `,`
        while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
        if (code[i] === ")")                             { ++i; } // skips `)`
        while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
        if (code[i] === "=")                             { ++i; } // skips `=`
        if (code[i] === ">") return true;                         // finds `>`
        return false;
      }
      var init = idx;
      if (is_lam_or_all() && match("(")) {
        var erass = [];
        var names = [];
        var types = [];
        while (idx < code.length) {
          var name = parse_string();
          var type = match(":") ? parse_term(nams.concat(names)) : null;
          var eras = match(";");
          var skip = match(",");
          erass.push(eras);
          names.push(name);
          types.push(type);
          if (match(")")) break;
        }
        var isall = match("->");
        if (!isall) {
          var skip = parse_exact("=>");
        }
        var parsed = parse_term(nams.concat(names));
        for (var i = names.length - 1; i >= 0; --i) {
          if (isall) {
            parsed = All(names[i], types[i] || Hol(new_hole_name()), parsed, erass[i], loc(idx - init));
          } else {
            parsed = Lam(names[i], types[i] || null, parsed, erass[i], loc(idx - init));
          }
        }
        return parsed;
      }
    }

    // Parses the type of numbers, `Number`
    function parse_num(nams) {
      if (match("Number")) {
        return Num(loc(4));
      }
    }

    // Parses a let, `let x = t; u`
    function parse_let(nams) {
      if (match("let ")) {
        var name = parse_string();
        var skip = parse_exact("=");
        var copy = parse_term(nams);
        var skip = match(";");
        var body = parse_term(nams.concat([name]));
        return subst(body, copy, 0);
      }
    }

    // Parses a string literal, `"foo"`
    function parse_str(nams) {
      if (match("\"")) {
        // Parses text
        var text = "";
        while (idx < code.length && code[idx] !== "\"") {
          text += code[idx];
          next();
        }
        next();
        return build_str(text);
      }
    }

    // Parses a char literal, `'x'`
    function parse_chr(nams) {
      if (match("'")) {
        var name = code[idx];
        next();
        var skip = parse_exact("'");
        return Val(name.charCodeAt(0));
      }
    }

    // Parses an if-then-else, `if then t else u`
    function parse_ite(nams) {
      var init = idx;
      if (match("if ")) {
        var cond = parse_term(nams);
        var skip = parse_exact("then");
        var val0 = parse_term(nams);
        var skip = parse_exact("else");
        var val1 = parse_term(nams);
        return Ite(cond, val0, val1, loc(idx - init));
      }
    }

    // Parses a pair type `#{A,B}` or value `#[a,b]`
    function parse_par(nams) {
      // Pair
      if (match("#{")) {
        var types = [];
        while (idx < code.length) {
          var type = parse_term(nams);
          types.push(type);
          if (match("}")) break;
          parse_exact(",");
        }
        var parsed = types.pop();
        for (var i = types.length - 1; i >= 0; --i) {
          var parsed = App(App(base_ref("Pair"), types[i], false), parsed, false);
        }
        return parsed;
      }
      // pair
      if (match("#[")) {
        var terms = [];
        while (idx < code.length) {
          var term = parse_term(nams);
          terms.push(term);
          if (match("]")) break;
          parse_exact(",");
        }
        var parsed = terms.pop();
        for (var i = terms.length - 1; i >= 0; --i) {
          var apps = App(base_ref("pair"), Hol(new_hole_name()), true);
          var apps = App(apps, Hol(new_hole_name()), true);
          var parsed = App(App(apps, terms[i], false), parsed, false);
        }
        return parsed;
      }
    }

    // Parses a pair projection, `get [x, y] = t`
    function parse_get(nams) {
      if (match("get ")) {
        var skip = parse_exact("#[");
        var names = [];
        while (idx < code.length) {
          var name = parse_string();
          names.push(name);
          if (match("]")) break;
          parse_exact(",");
        }
        var skip = parse_exact("=");
        var pair = parse_term(nams);
        var skip = match(";");
        var parsed = parse_term(nams.concat(names));
        for (var i = names.length - 2; i >= 0; --i) {
          var nam1 = names[i];
          var nam2 = i === names.length - 2 ? names[i + 1] : "aux";
          var expr = i === 0 ? pair : Var(0);
          var body = i === 0 ? parsed : shift(parsed, 1, 2);
          var parsed = App(App(Use(expr),
            Lam("", null, Hol(new_hole_name()), false), true),
            Lam(nam1, null, Lam(nam2, null, body, false), false), false);
        }
        return parsed;
      }
    }

    // Parses log, `log(t)`
    function parse_log(nams) {
      var init = idx;
      if (match("log(")) {
        var msge = parse_term(nams);
        var skip = parse_exact(")");
        var expr = parse_term(nams);
        return Log(msge, expr, loc(idx - init));
      }
    }

    // Parses a self type, `$x P(x)`
    function parse_slf(nams) {
      var init = idx;
      if (match("${")) {
        var name = parse_string();
        var skip = parse_exact("}");
        var type = parse_term(nams.concat([name]));
        return Slf(name, type, loc(idx - init));
      }
    }

    // Parses a self intro, `new(A) t`
    function parse_new(nams) {
      var init = idx;
      if (match("new(")) {
        var type = parse_term(nams);
        var skip = parse_exact(")");
        var expr = parse_term(nams);
        return New(type, expr, loc(idx - init));
      }
    }

    // Parses a self elim, `%t`
    function parse_use(nams) {
      var init = idx;
      if (match("use(")) {
        var expr = parse_term(nams);
        var skip = parse_exact(")");
        return Use(expr, loc(idx - init));
      }
    }

    // Parses a case expression, `case/T | A => <term> | B => <term> : <term>`
    function parse_cse(nams) {
      if (match("case ")) {
        // Attempts to parse this case expression with each ADTs in scope
        for (var adt_name in adts) {
          var parse_state = save_parse_state();

          try {
            // Parses matched name, if available
            var [term_name, term] = parse_named_term(nams);

            // Finds ADT
            if (!adt_name || !adts[ref_path(adt_name)]) {
              error("Used case-syntax on undefined type `" + (adt_name || "?") + "`.");
            }
            var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[ref_path(adt_name)];

            // Parses 'move' expressions
            var moves = [];
            while (match("+")) {
              var move_init = idx;
              var [move_name, move_term] = parse_named_term(nams);
              var move_skip = parse_exact(":");
              var move_type = parse_term(nams
                .concat(adt_indx.map(([name,type]) => term_name + "." + name))
                .concat([term_name])
                .concat(moves.map(([name,term,type]) => name)));
              moves.push([move_name, move_term, move_type, loc(idx - init)]);
            }

            // Parses matched cases
            var case_term = [];
            var case_loc  = [];
            for (var c = 0; c < adt_ctor.length; ++c) {
              var init = idx;
              try {
                var skip = parse_exact("|");
                var skip = parse_exact(adt_ctor[c][0]);
                var skip = parse_exact("=>");
              } catch (e) {
                throw "WRONG_ADT";
              }
              var ctors = adt_ctor[c][1];
              case_term[c] = parse_term(nams
                .concat(adt_ctor[c][1].map(([name,type]) => term_name + "." + name))
                .concat(moves.map(([name,term,type]) => name)));
              for (var i = moves.length - 1; i >= 0; --i) {
                case_term[c] = Lam(moves[i][0], null, case_term[c], false);
              }
              for (var i = 0; i < ctors.length; ++i) {
                case_term[c] = Lam(term_name + "." + ctors[ctors.length - i - 1][0], null, case_term[c], ctors[ctors.length - i - 1][2]);
              }
              case_loc[c] = loc(idx - init);
            }

            // Parses matched motive
            var moti_init = idx;
            if (match(":")) {
              var moti_term = parse_term(nams
                .concat(adt_indx.map(([name,type]) => term_name + "." + name))
                .concat([term_name])
                .concat(moves.map(([name,term,type]) => name)));
            } else if (match(";") || adt_ctor.length > 0) {
              var moti_term = Hol(new_hole_name());
            } else {
              throw "WRONG_ADT";
            }
            var moti_loc = loc(idx - moti_init);
            for (var i = moves.length - 1; i >= 0; --i) {
              var moti_term = All(moves[i][0], moves[i][2], moti_term, false, moves[i][3]);
            }
            var moti_term = moti_term;
            var moti_term = Lam(term_name, null, moti_term, false, moti_loc);
            for (var i = adt_indx.length - 1; i >= 0; --i) {
              var moti_term = Lam(term_name + "." + adt_indx[i][0], null, moti_term, false, moti_loc);
            }

            // Builds the matched term using self-elim ("Use")
            var targ = term;
            var term = Use(term);
            var term = App(term, moti_term, true, moti_loc);
            for (var i = 0; i < case_term.length; ++i) {
              var term = App(term, case_term[i], false, case_loc[i]);
            }
            for (var i = 0; i < moves.length; ++i) {
              var term = App(term, moves[i][1], false, moves[i][3]);
            }

            return term;
          } catch (e) {
            if (e !== "WRONG_ADT") {
              throw e;
            } else {
              load_parse_state(parse_state);
            }
          }
        }
        // If no ADT matches this pattern-match, raise error
        error("Couldn't find the ADT for this pattern-match.\n"
            + "Make sure the cases have the correct name and order.");
      }
    }

    // Parses an application, `f(x, y, z...)`
    function parse_app(parsed, init, nams) {
      var unr = match("<", is_space);
      var app = !unr && match("(", is_space);
      if (unr || app) {
        var term = parsed;
        while (idx < code.length) {
          if (match("_")) {
            var term = App(term, Hol(new_hole_name()), true, loc(idx - init));
            if (unr ? match("<") : match(")")) break;
          } else {
            var argm = parse_term(nams);
            var eras = match(";");
            var term = App(term, argm, eras, loc(idx - init));
            var skip = match(",");
            if (unr ? match(">") : match(")")) break;
          }
        }
        return term;
      }
    }

    // Parses a list literal, `[t, u, v, ...]`
    function parse_lst(nams) {
      var init = idx;
      if (match("[", is_space)) {
        var list = [];
        while (idx < code.length && !match("]")) {
          list.push(parse_term(nams));
          if (match("]")) break; else parse_exact(",");
        }
        var type = Hol(new_hole_name());
        var term = App(base_ref("nil"), type, true, loc(idx - init));
        for (var i = list.length - 1; i >= 0; --i) {
          var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
        }
        return term;
      }
      if (match("{", is_space)) {
        var list = [];
        while (idx < code.length && !match("}")) {
          var mkey = parse_term(nams);
          var skip = parse_exact(":");
          var mval = parse_term(nams);
          list.push(App(App(App(App(base_ref("pair"), Hol(new_hole_name()), true), Hol(new_hole_name()), true), mkey, false), mval, false));
          if (match("}")) break; else parse_exact(",");
        }
        var type = Hol(new_hole_name());
        var term = App(base_ref("nil"), type, true, loc(idx - init));
        for (var i = list.length - 1; i >= 0; --i) {
          var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
        }
        return term;
      }
    }

    // Parses the do notation
    function parse_blk(nams) {
      if (match("do{", is_space) || match("do {", is_space)) {
        var type = Hol(new_hole_name());
        function parse_do_statement(nams) {
          if (match("var")) {
            var name = parse_name();
            if (match(":")) {
              var vtyp = parse_term(nams);
            } else {
              var vtyp = Hol(new_hole_name());
            }
            var skip = parse_exact("=");
            var call = parse_term(nams);
            var skip = match(";");
            var body = parse_do_statement(nams.concat([name]));
            return App(App(App(App(base_ref("bind"), vtyp, true), type, true), call, false), Lam(name, null, body, false), false);
          } else if (match("throw;")) {
            var skip = parse_exact("}");
            return App(base_ref("throw"), Hol(new_hole_name()), true);
          } else if (match("return ")) {
            var term = parse_term(nams);
            var skip = match(";");
            var skip = parse_exact("}");
            return App(App(base_ref("return"), Hol(new_hole_name()), true), term, false);
          } else {
            var term = parse_term(nams);
            var skip = match(";");
            if (match("}")) {
              return term;
            } else {
              var body = parse_do_statement(nams.concat([name]));
              var vtyp = Hol(new_hole_name());
              return App(App(App(App(base_ref("bind"), vtyp, true), type, true), term, false), Lam(name, null, body, false), false);
            }
          }
        }      var result = parse_do_statement(nams);
        return result;
      }
    }

    // Parses an annotation `t :: T` and a rewrite `t :: rewrite P(.) with e`
    function parse_ann(parsed, init, nams) {
      if (match("::", is_space)) {
        if (match("rewrite", is_space)) {
          var type = parse_term(nams.concat(["."]));
          var skip = parse_exact("with");
          var prof = parse_term(nams);
          var term = base_ref("rewrite");
          var term = App(term, Hol(new_hole_name()), true);
          var term = App(term, Hol(new_hole_name()), true);
          var term = App(term, Hol(new_hole_name()), true);
          var term = App(term, prof, false);
          var term = App(term, Lam("_", null, type, false), true);
          var term = App(term, parsed, false);
          return term;
        } else {
          var type = parse_term(nams);
          return Ann(type, parsed, false, loc(idx - init));
        }
      }
    }

    // Parses an equality, `a == b`
    function parse_eql(parsed, init, nams) {
      if (match("==", is_space)) {
        var rgt = parse_term(nams);
        return App(App(App(base_ref("Equal"), Hol(new_hole_name()), false), parsed, false), rgt, false);
      }
    }

    // Parses an non-equality, `a != b`
    function parse_dif(parsed, init, nams) {
      if (match("!=", is_space)) {
        var rgt = parse_term(nams);
        return App(base_ref("Not"), App(App(App(base_ref("Equal"), Hol(new_hole_name()), false), parsed, false), rgt, false), false);
      }
    }

    // Parses an arrow, `A -> B`
    function parse_arr(parsed, init, nams) {
      if (match("->", is_space)) {
        var rett = parse_term(nams.concat("_"));
        return All("_", parsed, rett, false, loc(idx - init));
      }
    }

    // Parses operators, including:
    // - Numeric operators: `t .+. u`, `t .*. u`, etc.
    // - Arrow notation: `A -> B`
    // - User-defined operators: `t .foo. u`
    function parse_ops(parsed, init, nams) {
      if (match(".", is_space)) {
        if (tokens) tokens.pop();
        var func = "." + parse_string_here(x => !is_space(x));
        if (tokens) tokens.push(["txt", ""]);
        var argm = parse_term(nams);
        if (is_native_op[func]) {
          return Op2(func, parsed, argm, loc(idx - init));
        } else {
          return App(App(ref(func), parsed, false), argm, false, loc(idx - init));
        }
      }
    }

    // Parses a free variable
    function parse_var(nams) {
      var init = idx;
      if (match("^")) {
        var idx = Number(parse_name());
        return Var(idx, loc(idx - init));
      }
    }

    // Parses a term
    function parse_term(nams) {
      var parsed;

      skip_spaces();
      var init = idx;

      // Parses base term
      if      (parsed = parse_lam(nams));
      else if (parsed = parse_grp(nams));
      else if (parsed = parse_typ());
      else if (parsed = parse_slf(nams));
      else if (parsed = parse_new(nams));
      else if (parsed = parse_use(nams));
      else if (parsed = parse_hol());
      else if (parsed = parse_let(nams));
      else if (parsed = parse_num());
      else if (parsed = parse_str());
      else if (parsed = parse_chr());
      else if (parsed = parse_ite(nams));
      else if (parsed = parse_par(nams));
      else if (parsed = parse_get(nams));
      else if (parsed = parse_log(nams));
      else if (parsed = parse_cse(nams));
      else if (parsed = parse_var());
      else if (parsed = parse_lst(nams));
      else if (parsed = parse_blk(nams));
      else    (parsed = parse_ref(nams));

      // Parses spaced operators
      var new_parsed = true;
      while (new_parsed) {
        if      (new_parsed = parse_app(parsed, init, nams));
        else if (new_parsed = parse_ann(parsed, init, nams));
        else if (new_parsed = parse_arr(parsed, init, nams));
        else if (new_parsed = parse_eql(parsed, init, nams));
        else if (new_parsed = parse_dif(parsed, init, nams));
        else if (new_parsed = parse_ops(parsed, init, nams));
        if (new_parsed) parsed = new_parsed;
      }

      return parsed;
    }

    // Parses a top-level import
    async function do_parse_import() {
      if (match("import ")) {
        if (tokens) tokens.push(["imp", ""]);
        var impf = parse_string();
        if (tokens) tokens.push(["txt", ""]);
        var qual = match("as ") ? parse_string() : null;
        var open = match("open");
        if (open) {
          error("The `open` keyword is obsolete. Remove it.");
        }
        if (qual) qual_imports[qual] = impf;
        qual_imports[impf] = impf;
        open_imports[impf] = true;
        await do_import(impf);
        return true;
      }
    }

    // Parses a top-level datatype:
    // T name {param0 : A, ...} (index0 : B, ...)
    // | ctor0 {field0 : C, ...} (index0, ...)
    // | ctor1 {field0 : C, ...} (index0, ...)
    async function do_parse_datatype() {
      if (match("T ")) {
        var adt_pram = [];
        var adt_indx = [];
        var adt_ctor = [];
        var adt_name = parse_string();
        var adt_nams = [adt_name];
        var adt_typs = [null];

        // Datatype parameters
        if (match("<")) {
          while (idx < code.length) {
            var eras = false;
            var name = parse_string();
            if (match(":")) {
              var type = await parse_term(adt_pram.map((([name,type]) => name)));
            } else {
              var type = Typ();
            }
            adt_pram.push([name, type, eras]);
            if (match(">")) break;
            else parse_exact(",");
          }
        }

        // Datatype indices
        var adt_nams = adt_nams.concat(adt_pram.map(([name,type]) => name));
        var adt_typs = adt_typs.concat(adt_pram.map(([name,type]) => type));
        if (match("(")) {
          while (idx < code.length) {
            //var eras = match("~");
            var eras = false;
            var name = parse_string();
            if (match(":")) {
              var type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
            } else {
              var type = Typ();
            }
            adt_indx.push([name, type, eras]);
            if (match(")")) break; else parse_exact(",");
          }
        }

        // Datatype constructors
        while (match("|")) {
          // Constructor name
          var ctor_name = parse_string();
          // Constructor fields
          var ctor_flds = [];
          if (match("(")) {
            while (idx < code.length) {
              var name = parse_string();
              if (match(":")) {
                var type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
              } else {
                var type = Hol(new_hole_name());
              }
              var eras = match(";");
              var skip = match(",");
              ctor_flds.push([name, type, eras]);
              if (match(")")) break;
            }
          }
          // Constructor type (written)
          if (match(":")) {
            var ctor_type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
          // Constructor type (auto-filled)
          } else {
            var ctor_indx = [];
            //if (match("(")) {
              //while (idx < code.length) {
                //ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
                //if (match(")")) break; else parse_exact(",");
              //}
            //}
            var ctor_type = Var(-1 + ctor_flds.length + adt_pram.length + 1);
            for (var p = 0; p < adt_pram.length; ++p) {
              ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length - p), false);
            }
            for (var i = 0; i < ctor_indx.length; ++i) {
              ctor_type = App(ctor_type, ctor_indx[i], false);
            }
          }
          adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
        }
        var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
        define(file+"/"+adt_name, derive_adt_type(file, adt));
        for (var c = 0; c < adt_ctor.length; ++c) {
          define(file+"/"+adt_ctor[c][0], derive_adt_ctor(file, adt, c));
        }
        adts[file+"/"+adt_name] = adt;

        return true;
      }
    }

    // Parses a top-level `?defs` util
    async function do_parse_defs_util() {
      if (match("?defs")) {
        var filt = match("/") ? parse_string(x => x !== "/") : "";
        var regx = new RegExp(filt, "i");
        console.log("Definitions:");
        for (var def in defs) {
          if (def[0] !== "$" && regx.test(def)) {
            console.log("- " + def);
          }
        }
        return true;
      }
    }

    // Parses a top-level definition:
    //
    //    name(arg0 : A, arg1 : B, ...) : RetType
    //      <body>
    //
    async function do_parse_def() {
      // Parses definition name
      if (tokens) tokens.push(["def", ""]);
      var name = parse_name();

      if (name.length === 0) {
        error("Expected a definition.");
      }
      if (tokens) tokens[tokens.length - 1][2] = file+"/"+name;
      if (tokens) tokens.push(["txt", ""]);

      // If name is empty, stop
      if (name.length === 0) return false;

      // Parses argument names and types
      var erass = [];
      var names = [];
      var types = [];
      if (match_here("(")) {
        while (idx < code.length) {
          var arg_name = parse_string();
          var arg_type = match(":") ? await parse_term(names) : Hol(new_hole_name());
          var arg_eras = match(";");
          var arg_skip = match(",");
          erass.push(arg_eras);
          names.push(arg_name);
          types.push(arg_type);
          if (match(")")) break;
        }
      }

      // Parses return type, if any
      var type = match(":") ? await parse_term(names) : null;
      var skip = match(";");
      var term = await parse_term(names);

      // Fills foralls and lambdas of arguments
      for (var i = names.length - 1; i >= 0; --i) {
        var type = type && All(names[i], types[i], type, erass[i]);
        var term = Lam(names[i], type ? null : types[i], term, erass[i]);
      }

      // Defines the top-level term
      define(file+"/"+name, type ? Ann(type, term, false) : term);

      return true;
    }

    function save_parse_state() {
      return {idx, row, col, tokens_length: tokens && tokens.length};
    }

    function load_parse_state(state) {
      idx = state.idx;
      row = state.row;
      col = state.col;
      while (state.tokens_length && tokens.length > state.tokens_length) {
        tokens.pop();
      }
    }

    // Parses all definitions
    var open_imports = {};
    var qual_imports = {};
    var local_imports = {};
    var used_hole_name = {};
    var hole_count = 0;
    var tokens = tokenify ? [["txt",""]] : null;
    var idx = 0;
    var row = 0;
    var col = 0;
    var defs = {};
    var adts = {};
    while (idx < code.length) {
      next_char();
      if (await do_parse_import());
      else if (await do_parse_datatype());
      else if (await do_parse_defs_util());
      else if (!(await do_parse_def())) break;
      next_char();
    }

    return {
      defs,
      adts,
      tokens,
      local_imports,
      qual_imports,
      open_imports
    };
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
  const derive_adt_type = (file, {adt_pram, adt_indx, adt_ctor, adt_name}) => {
    return (function adt_arg(p, i) {
      // ... {p0 : Param0, p1 : Param1...} ...
      if (p < adt_pram.length) {
        return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
      // ... {i0 : Index0, i1 : Index...} ...
      } else if (i < adt_indx.length) {
        var substs = [Ref(file+"/"+adt_name)];
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
                var substs = [Ref(file+"/"+adt_name)];
                for (var P = 0; P < p; ++P) {
                  substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
                }
                return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
              // ... {wit : (ADT i0 i1...)} -> Type ...
              } else {
                var wit_t = Ref(file+"/"+adt_name);
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
                  var sub = [Ref(file+"/"+adt_name)].concat(subst_prams);
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
                  var wit = Ref(file+"/"+adt_ctor[i][0]);
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
  };

  const derive_adt_ctor = (file, {adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
    return (function arg(p, i, f) {
      var substs = [Ref(file+"/"+adt_name)];
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
              var fld = Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F);
              var sel = App(sel, fld, adt_ctor[c][1][F][2]);
            }
            return sel;
          }
        })(0), true)), false);
      }
    })(0, adt_indx.length, 0);
  };

  // Formality's runtime works by compiling normal Terms to a
  // Runtime Terms (RtTerm), reducing, and decompiling back.
  // A RtTerm is a map `{mem:[U32], ptr:U32}` containing the
  // term data in a compressed form. It exists in a context of
  // top-level defs, `rt_defs`, of type `Map(RefId, RtTerm)`. 

  // RtTerm constructors
  const VAR = 0;
  const LAM = 1;
  const APP = 2;
  const REF = 3;

  // Pointer: includes constructor type and address
  const NIL     = 0xFFFFFFFF;
  const New$1     = (ctor, addr) => (ctor + (addr << 4)) >>> 0;
  const ctor_of = ptr => ptr & 0b1111;
  const addr_of = ptr => ptr >>> 4;

  // Compiles a Term to a RtTerm. Returns:
  // - rt_rfid : Map(String, RefId) -- a map from term names to RefIds
  // - rf_defs : Map(RefId, RtTerm) -- a map from RefIds to RtTerms
  function compile(defs) {
    var rt_defs = {};
    var rt_rfid = {};
    var rt_bind = {};
    var next_id = 0;
    function go(name, vpos, term, depth) {
      var pos = rt_defs[rt_rfid[name]].length;
      switch (term[0]) {
        case "Var":
          var got = rt_bind[rt_rfid[name]][depth - term[1].index - 1];
          if (got !== undefined) {
            rt_defs[rt_rfid[name]][got] = New$1(VAR, vpos);
            return NIL;
          } else {
            return New$1(VAR, term[1].index);
          }
        case "Lam":
          rt_bind[rt_rfid[name]][depth] = pos;
          rt_defs[rt_rfid[name]].push(NIL, NIL);
          rt_defs[rt_rfid[name]][pos+1] = go(name, pos+1, term[1].body, depth + 1);
          return New$1(LAM, pos);
        case "App":
          rt_defs[rt_rfid[name]].push(NIL, NIL);
          rt_defs[rt_rfid[name]][pos+0] = go(name, pos+0, term[1].func, depth);
          rt_defs[rt_rfid[name]][pos+1] = go(name, pos+1, term[1].argm, depth);
          return New$1(APP, pos);
        case "Ref":
          return New$1(REF, rt_rfid[term[1].name]);
      }
      return NIL;
    }  for (var name in defs) {
      rt_rfid[name] = next_id++;
    }
    for (var name in defs) {
      rt_defs[rt_rfid[name]] = [];
      rt_bind[rt_rfid[name]] = {};
      var root = go(name, 0, erase(defs[name]), 0);
      if (root) {
        rt_defs[rt_rfid[name]] = {
          mem: rt_defs[rt_rfid[name]],
          ptr: root
        };
      }
    }
    return {rt_defs, rt_rfid};
  }
  // Recovers a Term from a RtTerm
  function decompile(rt_term, dep = 0) {
    var {mem, ptr} = rt_term;
    if (ptr === NIL) {
      return Ref("*");
    } else {
      var ctor = ctor_of(ptr);
      var addr = addr_of(ptr);
      switch (ctor) {
        case LAM:
          var vari = mem[addr+0]; 
          if (vari !== NIL) {
            mem[addr_of(vari)] = New$1(VAR, dep);
          }
          var body = decompile({mem, ptr: mem[addr+1]}, dep+1);
          return Lam("v"+dep, null, body, false);
        case APP:
          var func = decompile({mem, ptr: mem[addr+0]}, dep);
          var argm = decompile({mem, ptr: mem[addr+1]}, dep);
          return App(func, argm, false);
        case REF:
          return Ref("R"+addr_of(ptr), false);
        case VAR:
          return Var(dep - addr - 1);
      }  }}
  // Removes garbage from the memory
  function collect(rt_term) {
    var {mem, ptr} = rt_term;
    var new_mem = [];
    function go(ptr, vpos) {
      var ctor = ctor_of(ptr);
      var addr = addr_of(ptr);
      var pos  = new_mem.length;
      switch (ctor) {
        case LAM:
          var vari = mem[addr+0];
          if (vari !== NIL) {
            mem[addr_of(mem[addr+0])] = New$1(VAR, pos);
          }
          new_mem.push(NIL, NIL);
          new_mem[pos+1] = go(mem[addr+1], pos+1);
          return New$1(LAM, pos);
        case APP:
          new_mem.push(NIL, NIL);
          new_mem[pos+0] = go(mem[addr+0], pos+0);
          new_mem[pos+1] = go(mem[addr+1], pos+1);
          return New$1(ctor, pos);
        case REF:
          new_mem.push(NIL, NIL);
          return ptr;
        case VAR:
          new_mem[addr] = New$1(VAR, vpos + 0);
          return NIL;
      }  }  return {mem:new_mem, ptr:go(ptr, 0)};
  }
  // Reduces a RtTerm to normal form. This implements a lazy
  // evaluation strategy. It uses a global garbage collector,
  // but that could be replaced by merely collecting terms
  // that got substituted in a function that doesn't use its
  // bound variable.
  function reduce$1(rt_term, rt_defs) {

    var {mem, ptr: root} = rt_term;
    var stats = {beta: 0, copy: 0}; // reduction costs
    var back = []; // nodes we passed through

    back.push([rt_term.ptr, 0, 0]);

    var collect_length = mem.length * 8; // when to collect garbage

    // While there is a node to visit
    while (back.length > 0) {
      var [next,side,deph] = back[back.length - 1];

      // If needed, do garbage collection
      if (mem.length > collect_length) {
        var {mem, ptr: root} = collect({mem, ptr: root});
        var back = [[root, 0, 0]];
        var collect_length = mem.length * 8;
        continue;
      }

      // Pattern-matches the next node
      switch (ctor_of(next)) {
        
        // If it is a lambda, continue towards its body
        case LAM:
          var vari = mem[addr_of(next) + 0];
          if (vari !== NIL) {
            mem[addr_of(vari)] = New$1(VAR, deph);
          }
          back[back.length-1][1] = 1;
          back.push([mem[addr_of(next) + 1], 0, deph + 1]); 
          break;

        // If its an application, either do a beta-reduction,
        // or continue towards ids func
        case APP:
          var func = mem[addr_of(next) + 0];
          // Lam-App (beta) reduction
          if (ctor_of(func) === LAM) {
            stats.beta += 1;

            // Substitutes variable by argument
            var vari = mem[addr_of(func) + 0];
            if (vari !== NIL) {
              var argm = mem[addr_of(next) + 1];
              mem[addr_of(vari)] = argm;
            }

            // Connects parent to body
            var subs = mem[addr_of(func) + 1]; 

            back.pop();

            if (back.length > 0) {
              var back_to = back[back.length - 1];
              mem[addr_of(back_to[0]) + back_to[1]] = subs;
              back[back.length-1][1] = 0;
            } else {
              var root = subs;
              back.push([subs, 0, 0]);
            }

          // Continues on func
          } else {
            back.push([func,0,deph]);
          }
          break;

        // If it is a reference, copies its code to the
        // memory, correctly shifting variable pointers
        case REF:
          mem.push(NIL);
          var pos = mem.length; // memory position to copy
          var ref = rt_defs[addr_of(next)]; // term to copy
          var ref_mem = ref.mem;
          stats.copy += ref_mem.length;
          for (var i = 0; i < ref_mem.length; ++i) {
            var ref_term = ref_mem[i];
            var ref_ctor = ctor_of(ref_term);
            var ref_addr = addr_of(ref_term);
            if (ref_term !== NIL && ref_ctor !== REF) {
              mem.push(New$1(ref_ctor, ref_addr + pos));
            } else {
              mem.push(ref_mem[i]);
            }
          }

          back.pop();

          var subs = New$1(ctor_of(ref.ptr), addr_of(ref.ptr) + pos); 

          if (back.length > 0) {
            var back_to = back[back.length - 1];
            mem[addr_of(back_to[0]) + back_to[1]] = subs;
            back[back.length-1][1] = 0;
          } else {
            var root = subs;
            back.push([subs, 0, 0]);
          }
          break;

        // If it is a variable or number stop
        case VAR:
          back.pop();

          // If we've reached weak normal form, move up and
          // continue on the arguments of applications
          while (back.length > 0) {
            var [back_term, back_side, back_deph] = back[back.length - 1];
            if (ctor_of(back_term) === APP && back_side === 0) {
              back[back.length - 1][1] = 1;
              back.push([mem[addr_of(back_term) + 1], 0, back_deph]);
              break;
            } else {
              back.pop();
            }
          }

          break;

      }
    }
    return {rt_term: {mem, ptr: root}, stats};
  }

  var runtimeFast = /*#__PURE__*/Object.freeze({
    __proto__: null,
    VAR: VAR,
    LAM: LAM,
    APP: APP,
    REF: REF,
    NIL: NIL,
    New: New$1,
    ctor_of: ctor_of,
    addr_of: addr_of,
    compile: compile,
    decompile: decompile,
    collect: collect,
    reduce: reduce$1
  });

  // ~~ Formality Interaction Net System ~~
  // TODO: remove num-ops and pairs

  // PtrNum types
  const PTR = 0;
  const NUM = 1;

  // Node types
  const NOD = 0;
  const OP1 = 1;
  const OP2 = 2;
  const ITE = 3;

  // Base types
  const Pointer = (addr, port) => ({typ: PTR, val: (addr << 2) + (port & 3)});
  const addr_of$1 = (ptrn) => ptrn.val >>> 2;
  const slot_of = (ptrn) => ptrn.val & 3;
  const Numeric = (numb) => ({typ: NUM, val: numb});
  const numb_of = (ptrn) => ptrn.val;
  const type_of = (ptrn) => ptrn.typ;
  const ptrn_eq = (a, b) => a.typ === b.typ && a.val === b.val;
  const ptrn_st = a => a.typ + ":" + a.val;

  class Net {
    // A net stores nodes (this.nodes), reclaimable memory addrs (this.freed) and active pairs (this.redex)
    constructor() {
      this.nodes = []; // nodes
      this.freed = []; // integers
      this.redex = []; // array of (integer, integer) tuples representing addrs
      this.find_redex = true;
    }

    // Allocates a new node, return its addr
    alloc_node(type, kind) {

      // If there is reclaimable memory, use it
      if (this.freed.length > 0) {
        var addr = this.freed.pop();

      // Otherwise, extend the array of nodes
      } else {
        var addr = this.nodes.length / 4;
      }

      // Fill the memory with an empty node without pointers
      this.nodes[addr * 4 + 0] = addr * 4 + 0;
      this.nodes[addr * 4 + 1] = addr * 4 + 1;
      this.nodes[addr * 4 + 2] = addr * 4 + 2;
      this.nodes[addr * 4 + 3] = (kind << 6) + ((type & 0x7) << 3);
      return addr;
    }

    // Deallocates a node, allowing its space to be reclaimed
    free_node(addr) {
      this.nodes[addr * 4 + 0] = addr * 4 + 0;
      this.nodes[addr * 4 + 1] = addr * 4 + 1;
      this.nodes[addr * 4 + 2] = addr * 4 + 2;
      this.nodes[addr * 4 + 3] = 0;
      this.freed.push(addr);
    }

    is_free(addr) {
      return this.nodes[addr * 4 + 0] === addr * 4 + 0
          && this.nodes[addr * 4 + 1] === addr * 4 + 1
          && this.nodes[addr * 4 + 2] === addr * 4 + 2
          && this.nodes[addr * 4 + 3] === 0;
    }

    // Returns if given slot holds a number
    is_numeric(addr, slot) {
      return (this.nodes[addr * 4 + 3] >>> slot) & 1; 
    }

    set_port(addr, slot, ptrn) {
      if (type_of(ptrn) === NUM) {
        this.nodes[addr * 4 + slot] = numb_of(ptrn);
        this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] | (1 << slot);
      } else {
        this.nodes[addr * 4 + slot] = (addr_of$1(ptrn) << 2) + (slot_of(ptrn) & 3);
        this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] & ~(1 << slot);
      }
    }

    get_port(addr, slot) {
      var val = this.nodes[addr * 4 + slot];
      return !this.is_numeric(addr, slot) ? Pointer(val >>> 2, val & 3) : Numeric(val);
    }

    type_of(addr) {
      return (this.nodes[addr * 4 + 3] >>> 3) & 0x7;
    }

    set_type(addr, type) {
      this.nodes[addr * 4 + 3] = (this.nodes[addr * 4 + 3] & ~0b111000) | (type << 3);
    }

    kind_of(addr) {
      return this.nodes[addr * 4 + 3] >>> 6;
    }

    // Given a pointer to a port, returns a pointer to the opposing port
    enter_port(ptrn) {
      if (type_of(ptrn) === NUM) { 
        throw "Can't enter a numeric pointer.";
      } else {
        return this.get_port(addr_of$1(ptrn), slot_of(ptrn));
      }
    }

    // Connects two ports
    link_ports(a_ptrn, b_ptrn) {
      var a_numb = type_of(a_ptrn) === NUM;
      var b_numb = type_of(b_ptrn) === NUM;

      // Point ports to each-other
      if (!a_numb) this.set_port(addr_of$1(a_ptrn), slot_of(a_ptrn), b_ptrn);
      if (!b_numb) this.set_port(addr_of$1(b_ptrn), slot_of(b_ptrn), a_ptrn);

      // If both are main ports, add this to the list of active pairs
      if (this.find_redex && !(a_numb && b_numb) && (a_numb || slot_of(a_ptrn) === 0) && (b_numb || slot_of(b_ptrn) === 0)) {
        this.redex.push(a_numb ? addr_of$1(b_ptrn) : addr_of$1(a_ptrn));
      }
    }

    // Disconnects a port, causing both sides to point to themselves
    unlink_port(a_ptrn) {
      if (type_of(a_ptrn) === PTR) {
        var b_ptrn = this.enter_port(a_ptrn);
        if (type_of(b_ptrn) === PTR && ptrn_eq(this.enter_port(b_ptrn), a_ptrn)) {
          this.set_port(addr_of$1(a_ptrn), slot_of(a_ptrn), a_ptrn);
          this.set_port(addr_of$1(b_ptrn), slot_of(b_ptrn), b_ptrn);
        }
      }
    }

    // Rewrites an active pair
    rewrite(a_addr) {
      var b_ptrn = this.get_port(a_addr, 0);
      if (type_of(b_ptrn) === NUM) {
        var a_type = this.type_of(a_addr);
        var a_kind = this.kind_of(a_addr);

        // UnaryOperation
        if (a_type === OP1) {
          var dst = this.enter_port(Pointer(a_addr, 2));
          var fst = numb_of(b_ptrn);
          var snd = numb_of(this.enter_port(Pointer(a_addr, 1)));
          switch (a_kind) {
            case  0: var res = Numeric(fst + snd); break;
            case  1: var res = Numeric(fst - snd); break;
            case  2: var res = Numeric(fst * snd); break;
            case  3: var res = Numeric(fst / snd); break;
            case  4: var res = Numeric(fst % snd); break;
            case  5: var res = Numeric(fst ** snd); break;
            case  6: var res = Numeric(fst & snd); break;
            case  7: var res = Numeric(fst | snd); break;
            case  8: var res = Numeric(fst ^ snd); break;
            case  9: var res = Numeric(~snd); break;
            case 10: var res = Numeric(fst >>> snd); break;
            case 11: var res = Numeric(fst << snd); break;
            case 12: var res = Numeric(fst > snd ? 1 : 0); break;
            case 13: var res = Numeric(fst < snd ? 1 : 0); break;
            case 14: var res = Numeric(fst === snd ? 1 : 0); break;
            default: throw "[ERROR]\nInvalid interaction.";
          }
          this.link_ports(dst, res);
          this.unlink_port(Pointer(a_addr, 0));
          this.unlink_port(Pointer(a_addr, 2));
          this.free_node(a_addr);
        
        // BinaryOperation
        } else if (a_type === OP2) {
          this.set_type(a_addr, OP1);
          this.link_ports(Pointer(a_addr, 0), this.enter_port(Pointer(a_addr, 1)));
          this.unlink_port(Pointer(a_addr, 1));
          this.link_ports(Pointer(a_addr, 1), b_ptrn);
      
        // NumberDuplication
        } else if (a_type === NOD) {
          this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 1)));
          this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 2)));
          this.free_node(a_addr);

        // IfThenElse
        } else if (a_type === ITE) {
          var cond_val = numb_of(b_ptrn) === 0;
          var pair_ptr = this.enter_port(Pointer(a_addr, 1));
          this.set_type(a_addr, NOD);
          this.link_ports(Pointer(a_addr, 0), pair_ptr);
          this.unlink_port(Pointer(a_addr, 1));
          var dest_ptr = this.enter_port(Pointer(a_addr, 2));
          this.link_ports(Pointer(a_addr, cond_val ? 2 : 1), dest_ptr);
          if (!cond_val) this.unlink_port(Pointer(a_addr, 2));
          this.link_ports(Pointer(a_addr, cond_val ? 1 : 2), Pointer(a_addr, cond_val ? 1 : 2));

        } else {
          throw "[ERROR]\nInvalid interaction.";
        }

      } else {
        var b_addr = addr_of$1(b_ptrn);
        var a_type = this.type_of(a_addr);
        var b_type = this.type_of(b_addr);
        var a_kind = this.kind_of(a_addr);
        var b_kind = this.kind_of(b_addr);

        // NodeAnnihilation, UnaryAnnihilation, BinaryAnnihilation
        if ( a_type === NOD && b_type === NOD && a_kind === b_kind
          || a_type === OP1 && b_type === OP1
          || a_type === OP2 && b_type === OP2
          || a_type === ITE && b_type === ITE) {
          var a_aux1_dest = this.enter_port(Pointer(a_addr, 1));
          var b_aux1_dest = this.enter_port(Pointer(b_addr, 1));
          this.link_ports(a_aux1_dest, b_aux1_dest);
          var a_aux2_dest = this.enter_port(Pointer(a_addr, 2));
          var b_aux2_dest = this.enter_port(Pointer(b_addr, 2));
          this.link_ports(a_aux2_dest, b_aux2_dest);
          for (var i = 0; i < 3; i++) {
            this.unlink_port(Pointer(a_addr, i));
            this.unlink_port(Pointer(b_addr, i));
          }
          this.free_node(a_addr);
          if (a_addr !== b_addr) {
            this.free_node(b_addr);
          }

        // NodeDuplication, BinaryDuplication
        } else if
          (  a_type === NOD && b_type === NOD && a_kind !== b_kind
          || a_type === NOD && b_type === OP2
          || a_type === NOD && b_type === ITE) {
          var p_addr = this.alloc_node(b_type, b_kind);
          var q_addr = this.alloc_node(b_type, b_kind);
          var r_addr = this.alloc_node(a_type, a_kind);
          var s_addr = this.alloc_node(a_type, a_kind);
          this.link_ports(Pointer(r_addr, 1), Pointer(p_addr, 1));
          this.link_ports(Pointer(s_addr, 1), Pointer(p_addr, 2));
          this.link_ports(Pointer(r_addr, 2), Pointer(q_addr, 1));
          this.link_ports(Pointer(s_addr, 2), Pointer(q_addr, 2));
          this.link_ports(Pointer(p_addr, 0), this.enter_port(Pointer(a_addr, 1)));
          this.link_ports(Pointer(q_addr, 0), this.enter_port(Pointer(a_addr, 2)));
          this.link_ports(Pointer(r_addr, 0), this.enter_port(Pointer(b_addr, 1)));
          this.link_ports(Pointer(s_addr, 0), this.enter_port(Pointer(b_addr, 2)));
          for (var i = 0; i < 3; i++) {
            this.unlink_port(Pointer(a_addr, i));
            this.unlink_port(Pointer(b_addr, i));
          }
          this.free_node(a_addr);
          if (a_addr !== b_addr) {
            this.free_node(b_addr);
          }

        // UnaryDuplication
        } else if
          (  a_type === NOD && b_type === OP1
          || a_type === ITE && b_type === OP1) {
          var p_addr = this.alloc_node(b_type, b_kind);
          var q_addr = this.alloc_node(b_type, b_kind);
          var s_addr = this.alloc_node(a_type, a_kind);
          this.link_ports(Pointer(p_addr, 1), this.enter_port(Pointer(b_addr, 1)));
          this.link_ports(Pointer(q_addr, 1), this.enter_port(Pointer(b_addr, 1)));
          this.link_ports(Pointer(s_addr, 1), Pointer(p_addr, 2));
          this.link_ports(Pointer(s_addr, 2), Pointer(q_addr, 2));
          this.link_ports(Pointer(p_addr, 0), this.enter_port(Pointer(a_addr, 1)));
          this.link_ports(Pointer(q_addr, 0), this.enter_port(Pointer(a_addr, 2)));
          this.link_ports(Pointer(s_addr, 0), this.enter_port(Pointer(b_addr, 2)));
          for (var i = 0; i < 3; i++) {
            this.unlink_port(Pointer(a_addr, i));
            this.unlink_port(Pointer(b_addr, i));
          }
          this.free_node(a_addr);
          if (a_addr !== b_addr) {
            this.free_node(b_addr);
          }
        
        // Permutations
        } else if (a_type === OP1 && b_type === NOD) {
          return this.rewrite(b_addr);
        } else if (a_type === OP2 && b_type === NOD) {
          return this.rewrite(b_addr);
        } else if (a_type === ITE && b_type === NOD) {
          return this.rewrite(b_addr);

        // InvalidInteraction
        } else {
          throw "[ERROR]\nInvalid interaction.";
        }
      }
    }

    // Rewrites active pairs until none is left, reducing the graph to normal form.
    // This could be performed in parallel and doesn't need GC.
    reduce_strict(stats) {
      while (this.redex.length > 0) {
        for (var i = 0, l = this.redex.length; i < l; ++i) {
          this.rewrite(this.redex.pop());
          stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
          ++stats.rewrites;
        }
        ++stats.loops;
      }
    }

    // Rewrites active pairs until none is left, reducing the graph to normal form.
    // This avoids unecessary computations, but is sequential and would need GC.
    reduce_lazy(stats) {
      this.find_redex = false;
      var warp = [];
      var back = [];
      var prev = Pointer(0, 1);
      var next = this.enter_port(prev);
      while (true) {
        ++stats.loops;
        if (type_of(next) === PTR && (addr_of$1(next) === 0 || this.is_free(addr_of$1(next)))) {
          if (warp.length === 0) {
            break;
          } else {
            prev = warp.pop();
            next = this.enter_port(prev);
          }
        } else {
          if (slot_of(prev) === 0 && (type_of(next) === NUM || slot_of(next) === 0)) {
            try {
              this.rewrite(addr_of$1(prev));
            } catch (e) {
              return;
            }
            stats.rewrites += 1;
            stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
            do { prev = back.pop(); } while (type_of(prev) !== PTR);
            next = this.enter_port(prev);
          } else if (type_of(next) === NUM) {
            [prev,next] = [next,prev];
          } else if (slot_of(next) === 0) {
            if (this.type_of(addr_of$1(next)) !== OP1) {
              warp.push(Pointer(addr_of$1(next), 1));
            }
            prev = Pointer(addr_of$1(next), 2);
            next = this.enter_port(prev);
          } else {
            back.push(prev);
            prev = Pointer(addr_of$1(next), 0);
            next = this.enter_port(prev);
          }
        }
      }
      this.find_redex = true;
    }

    // Returns a string that is preserved on reduction, good for debugging
    denote(ptrn = this.enter_port(Pointer(0, 1)), exit = []) {
      function path_to_string(path) {
        var str = "<";
        while (path) {
          str += path.head === 1 ? "a" : "b";
          path = path.tail; 
        }
        str += ">";
        return str;
      }
      while (true) {
        if (type_of(ptrn) === PTR) {
          var ai = addr_of$1(ptrn);
          var as = slot_of(ptrn);
          var ak = this.kind_of(ai);
          switch (this.type_of(ai)) {
            case NOD:
              if (slot_of(ptrn) === 0) {
                if (exit[ak]) {
                  var new_exit = exit.slice(0);
                  new_exit[ak] = new_exit[ak].tail;
                  ptrn = this.enter_port(Pointer(ai, Number(exit[ak].head)));
                  exit = new_exit;
                  continue; // tail-call: denote(ptrn, exit)
                } else {
                  var lft = this.denote(this.enter_port(Pointer(ai, 1)), exit);
                  var rgt = this.denote(this.enter_port(Pointer(ai, 2)), exit);
                  return "(" + ak + " " + lft + " " + rgt + ")";
                }
              } else {
                if (ai === 0) {
                  while (exit[exit.length - 1] === null) exit.pop();
                  return exit.map(path_to_string).join(":");
                } else {
                  var new_exit = exit.slice(0);
                  new_exit[ak] = {head: as, tail: new_exit[ak] || null};
                  ptrn = this.enter_port(Pointer(ai, 0));
                  exit = new_exit;
                  continue; // tail-call: denote(ptrn, exit)
                }
              }
            default:
              return "<TODO>";
          }
        } else {
          return "#" + numb_of(ptrn);
        }
      }
    }

    to_string() {
      const pointer = (ptrn) => {
        if (type_of(ptrn) === NUM) {
          return "#" + numb_of(ptrn);
        } else {
          return addr_of$1(ptrn) + "abc"[slot_of(ptrn)];
        }
      };
      var text = '';
      for (var i = 0; i < this.nodes.length / 4; i++) {
        if (this.is_free(i)) {
          text += i + ": ~\n";
        } else {
          var type = this.type_of(i);
          var kind = this.kind_of(i);
          text += i + ': ';
          text += "[" + type + ":" + kind + "| ";
          text += pointer(this.get_port(i, 0)) + " ";
          text += pointer(this.get_port(i, 1)) + " ";
          text += pointer(this.get_port(i, 2)) + "]";
          text += " ... " + this.is_numeric(i,0) + " " + this.is_numeric(i,1) + " " + this.is_numeric(i,2);
          text += "\n";
        }
      }
      return text;
    }
  }

  var fmNet = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Pointer: Pointer,
    addr_of: addr_of$1,
    slot_of: slot_of,
    Numeric: Numeric,
    numb_of: numb_of,
    type_of: type_of,
    ptrn_eq: ptrn_eq,
    ptrn_st: ptrn_st,
    Net: Net,
    NUM: NUM,
    PTR: PTR,
    NOD: NOD,
    OP1: OP1,
    OP2: OP2,
    ITE: ITE
  });

  // ~~ Compiles Formality Core to Formality Net ~~

  // TODO: Remove Fst, Snd and Par from this code, for now, I'm just making it compile
  const Fst = () => {};
  const Snd = () => {};
  const Par = () => {};

  const op_kind = {
     0 : ".+."   , ".+."   : 0 ,
     1 : ".-."   , ".-."   : 1 ,
     2 : ".*."   , ".*."   : 2 ,
     3 : "./."   , "./."   : 3 ,
     4 : ".%."   , ".%."   : 4 ,
     5 : ".**."  , ".**."  : 5 ,
     6 : ".&."   , ".&."   : 6 ,
     7 : ".|."   , ".|."   : 7 ,
     8 : ".^."   , ".^."   : 8 ,
     9 : ".~."   , ".~."   : 9 ,
    10 : ".>>>." , ".>>>." : 10 ,
    11 : ".<<."  , ".<<."  : 11 ,
    12 : ".>."   , ".>."   : 12 ,
    13 : ".<."   , ".<."   : 13 ,
    14 : ".==."  , ".==."  : 14 ,
  };

  const compile$1 = (term, defs = {}) => {
    var term = typeof term === "string" ? defs[term] : term;
    const ref_ptrs = {};
    const build_net = (term, net, var_ptrs, level) => {
      const get_var = (ptrn) => {
        if (type_of(ptrn) === NUM) {
          return ptrn;
        } else {
          if (ptrn_eq(net.enter_port(ptrn), ptrn)) {
            return ptrn;
          } else {
            var dups_ptrn = net.enter_port(ptrn);
            //var dup_addr = net.alloc_node(NOD, level_of[ptrn_st(ptrn)] + 1);
            var dup_addr = net.alloc_node(NOD, Math.floor(Math.random()*(2**24)) + 1);
            net.link_ports(Pointer(dup_addr, 0), ptrn);
            net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
            return Pointer(dup_addr, 2);
          }
        }
      };
      switch (term[0]) {
        case "Dup":
          var expr_ptr = build_net(term[1].expr, net, var_ptrs, level);
          level_of[ptrn_st(expr_ptr)] = level;
          var_ptrs.push(expr_ptr);
          var body_ptr = build_net(term[1].body, net, var_ptrs, level);
          var_ptrs.pop();
          return body_ptr;
        case "Put":
          var expr_ptr = build_net(term[1].expr, net, var_ptrs, level + 1);
          return expr_ptr;
        case "Lam":
          var lam_addr = net.alloc_node(NOD, 0);
          net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
          level_of[ptrn_st(Pointer(lam_addr, 1))] = level;
          var_ptrs.push(Pointer(lam_addr, 1));
          var body_ptr = build_net(term[1].body, net, var_ptrs, level);
          var_ptrs.pop();
          net.link_ports(Pointer(lam_addr, 2), body_ptr);
          return Pointer(lam_addr, 0);
        case "App":
          var app_addr = net.alloc_node(NOD, 0);
          var func_ptr = build_net(term[1].func, net, var_ptrs, level);
          net.link_ports(Pointer(app_addr, 0), func_ptr);
          var argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
          net.link_ports(Pointer(app_addr, 1), argm_ptr);
          return Pointer(app_addr, 2);
        case "Val":
          return Numeric(term[1].numb);
        case "Op1":
          var op1_addr = net.alloc_node(OP1, op_kind[term[1].func]);
          net.link_ports(Numeric(term[1].num1[1].numb), Pointer(op1_addr, 1));
          var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
          net.link_ports(num0_ptr, Pointer(op1_addr, 0));
          return Pointer(op1_addr, 2);
        case "Op2":
          var op2_addr = net.alloc_node(OP2, op_kind[term[1].func]);
          var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
          net.link_ports(Pointer(op2_addr, 1), num0_ptr);
          var num1_ptr = build_net(term[1].num1, net, var_ptrs, level);
          net.link_ports(Pointer(op2_addr, 0), num1_ptr);
          return Pointer(op2_addr, 2);
        case "Par":
          var par_addr = net.alloc_node(NOD, 0xFFFF);
          var val0_ptr = build_net(term[1].val0, net, var_ptrs, level);
          net.link_ports(Pointer(par_addr, 1), val0_ptr);
          var val1_ptr = build_net(term[1].val1, net, var_ptrs, level);
          net.link_ports(Pointer(par_addr, 2), val1_ptr);
          return Pointer(par_addr, 0);
        case "Fst":
          var fst_addr = net.alloc_node(NOD, 0xFFFF);
          var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
          net.link_ports(Pointer(fst_addr, 0), pair_ptr);
          net.link_ports(Pointer(fst_addr, 2), Pointer(fst_addr, 2));
          return Pointer(fst_addr, 1);
        case "Snd":
          var snd_addr = net.alloc_node(NOD, 0xFFFF);
          var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
          net.link_ports(Pointer(snd_addr, 0), pair_ptr);
          net.link_ports(Pointer(snd_addr, 1), Pointer(snd_addr, 1));
          return Pointer(snd_addr, 2);
        case "Prj":
          var prj_addr = net.alloc_node(NOD, 0xFFFF);
          level_of[ptrn_st(Pointer(prj_addr, 1))] = level;
          level_of[ptrn_st(Pointer(prj_addr, 2))] = level;
          var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
          var_ptrs.push(Pointer(prj_addr, 1));
          var_ptrs.push(Pointer(prj_addr, 2));
          var body_ptr = build_net(term[1].body, net, var_ptrs, level);
          var_ptrs.pop();
          var_ptrs.pop();
          net.link_ports(Pointer(prj_addr, 0), pair_ptr);
          return body_ptr;
        case "Ite":
          var ite_addr = net.alloc_node(ITE, 0xFFFF);
          var cond_ptr = build_net(term[1].cond, net, var_ptrs, level);
          net.link_ports(Pointer(ite_addr, 0), cond_ptr);
          var if_t_ptr = build_net(term[1].if_t, net, var_ptrs, level);
          var if_f_ptr = build_net(term[1].if_f, net, var_ptrs, level);
          var par_addr = net.alloc_node(NOD, 0xFFFF);
          net.link_ports(Pointer(par_addr, 1), if_t_ptr);
          net.link_ports(Pointer(par_addr, 2), if_f_ptr);
          var pair_ptr = Pointer(par_addr, 0);
          net.link_ports(Pointer(ite_addr, 1), pair_ptr);
          return Pointer(ite_addr, 2);
        case "Log":
          return build_net(term[1].expr, net, var_ptrs, level);
        case "Var":
          return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
        case "Hol":
          throw "[ERROR]\nCan't compile a hole.";
        case "Utv":
          throw "[ERROR]\nCan't compile an unrestricted term.";
        case "Ref":
          var ref_ptrn = ref_ptrs[term[1].name];
          // First time seeing this ref
          if (!ref_ptrn) {
            // Create a dup node for it and recurse
            var dup_addr = net.alloc_node(NOD, 0xFFFD);
            var ref_ptrn = Pointer(dup_addr, 1);
            ref_ptrs[term[1].name] = ref_ptrn;
            var dref = erase(defs[term[1].name]);
            var dref_ptr = build_net(dref, net, var_ptrs, level);
            net.link_ports(Pointer(dup_addr, 0), dref_ptr);
            return Pointer(dup_addr, 2);
          // Already created the dup node for this ref
          } else {
            // First use: just connect to the port 1 of the dup node
            if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
              return ref_ptrn;
            // Other uses: extend with another dup node and connect
            } else {
              var dups_ptrn = net.enter_port(ref_ptrn);
              var dup_addr = net.alloc_node(NOD, 0xFFFD);
              net.link_ports(Pointer(dup_addr, 0), ref_ptrn);
              net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
              return Pointer(dup_addr, 2);
            }
          }
        default:
          return build_net(Lam("", null, Var(0), false), net, var_ptrs, level);
      }
    };
    var level_of = {};
    var net = new Net();
    var root_addr = net.alloc_node(NOD, 0);
    var term_ptr = build_net(term, net, [], 0);
    net.link_ports(Pointer(root_addr, 0), Pointer(root_addr, 2));
    net.link_ports(Pointer(root_addr, 1), term_ptr);
    // Removes invalid redexes. They can be created by the
    // compiler when duplicating variables more than once.
    net.redex = net.redex.filter((a_addr) => {
      var b_ptrn = net.enter_port(Pointer(a_addr, 0));
      if (type_of(b_ptrn) !== NUM) {
        var b_addr = addr_of$1(b_ptrn);
        var a_p0 = Pointer(a_addr, 0);
        var b_p0 = Pointer(b_addr, 0);
        var a_ok = ptrn_eq(net.enter_port(a_p0), b_p0);
        var b_ok = ptrn_eq(net.enter_port(b_p0), a_p0);
        return a_ok && b_ok;
      } else {
        return true;
      }
    });
    // Optimization: if a ref is only used once, remove the unecessary dup node
    for (var name in ref_ptrs) {
      var ref_ptrn = ref_ptrs[name];
      if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
        var dup_addr = addr_of$1(ref_ptrn);
        var ref_ptrn = net.enter_port(Pointer(dup_addr, 0));
        var loc_ptrn = net.enter_port(Pointer(dup_addr, 2));
        net.link_ports(ref_ptrn, loc_ptrn);
        net.free_node(dup_addr);
      }
    }
    return net;
  };

  const decompile$1 = (net) => {
    const build_term = (net, ptrn, var_ptrs, dup_exit) => {
      if (type_of(ptrn) === NUM) {
        return Val(numb_of(ptrn));
      } else {
        var addr = addr_of$1(ptrn);
        var type = net.type_of(addr);
        var kind = net.kind_of(addr);
        if (type === NOD) {
          if (kind === 0) {
            switch (slot_of(ptrn)) {
              case 0:
                var_ptrs.push(Pointer(addr, 1));
                var body = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
                var_ptrs.pop();
                return Lam("x" + var_ptrs.length, null, body, false);
              case 1:
                for (var index = 0; index < var_ptrs.length; ++index) {
                  if (ptrn_eq(var_ptrs[var_ptrs.length - index - 1], ptrn)) {
                    return Var(index);
                  }
                }
              case 2:
                var argm = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
                var func = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
                return App(func, argm, false);
            }
          } else if (kind === 0xFFFF) {
            switch (slot_of(ptrn)) {
              case 0:
                var val0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
                var val1 = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
                return Par();
              case 1:
                var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
                return Fst();
              case 2:
                var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
                return Snd();
            }
          } else {
            switch (slot_of(ptrn)) {
              case 0:
                var exit = dup_exit.pop();
                var term = build_term(net, net.enter_port(Pointer(addr, exit)), var_ptrs, dup_exit);
                dup_exit.push(exit);
                return term;
              default:
                dup_exit.push(slot_of(ptrn));
                var term = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
                dup_exit.pop();
                return term;
            }
          }
        } else if (type === OP1) {
          var num0 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
          var num1 = Val(numb_of(net.enter_port(Pointer(addr, 1))));
          return Op1(op_kind[kind], num0, num1);
        } else if (type === OP2) {
          var num0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
          var num1 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
          return Op2(op_kind[kind], num0, num1);
        } else if (type === ITE) {
          var cond = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
          var pair = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
          return Ite(cond, pair);
        }
      }
    };
    return build_term(net, net.enter_port(Pointer(0, 1)), [], []);
  };

  const norm_with_stats = (term, defs = {}, lazy = true) => {
    var net = compile$1(term, defs);
    var stats = lazy ? net.reduce_lazy() : net.reduce();
    var norm = decompile$1(net);
    return {norm, stats};
  };

  const norm = (term, defs, lazy) => {
    return norm_with_stats(term, defs, lazy).norm;
  };

  var runtimeOptimal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    compile: compile$1,
    decompile: decompile$1,
    norm_with_stats: norm_with_stats,
    norm: norm
  });

  // Converts a Formality-Core Term to a native JavaScript function
  const compile$2 = (term, defs = {}, depth = 0) => {
    var seen = {};
    var code = "";
    var result = (function go(term, depth) {
      var [ctor, term] = term;
      switch (ctor) {
        case "Var":
          return "_" + (depth - term.index - 1);
        case "Lam":
          var body = go(term.body, depth + 1);
          return "(_"+depth+"=>"+body+")";
        case "App":
          var func = go(term.func, depth);
          var argm = go(term.argm, depth);
          return func+"("+argm+")";
      case "Val":
        return term.numb;
      case "Op1":
      case "Op2":
        var func = term.func;
        var num0 = compile$2(term.num0, opts, vars);
        var num1 = compile$2(term.num1, opts, vars);
        switch (func) {
          case ".+."   : return num0 + num1;
          case ".-."   : return num0 - num1;
          case ".*."   : return num0 * num1;
          case "./."   : return num0 / num1;
          case ".%."   : return num0 % num1;
          case ".**."  : return num0 ** num1;
          case ".&."   : return num0 & num1;
          case ".|."   : return num0 | num1;
          case ".^."   : return num0 ^ num1;
          case ".~."   : return ~ num1;
          case ".>>>." : return num0 >>> num1;
          case ".<<."  : return num0 << num1;
          case ".>."   : return num0 > num1;
          case ".<."   : return num0 < num1;
          case ".==."  : return num0 === num1 ? 1 : 0;
          default: throw "TODO: implement operator "
        }
      case "Ite":
        var cond = compile$2(term.cond, opts, vars);
        var if_t = compile$2(term.if_t, opts, vars);
        var if_f = compile$2(term.if_f, opts, vars);
        return cond ? if_t : if_f;
        case "Log":
          return go(term.expr, depth);
        case "Ref":
          var name = term.name.replace(/\./g,"_").replace(/\//g,"$").replace(/#/g,"$");
          if (!seen[term.name]) {
            seen[term.name] = true;
            var dref = go(erase(defs[term.name]), depth);
            code += "  var _"+name+" = "+dref+";\n";
          }
          return "_"+name;
      }
    })(term, 0);
    return "(function(){\n"+code+"  return "+result+";\n})()";
  };

  var fmToJs = /*#__PURE__*/Object.freeze({
    __proto__: null,
    compile: compile$2
  });

  exports.core = core;
  exports.fast = runtimeFast;
  exports.js = fmToJs;
  exports.loader = loader;
  exports.net = fmNet;
  exports.optimal = runtimeOptimal;
  exports.parse = parse$1;
  exports.stringify = show;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
