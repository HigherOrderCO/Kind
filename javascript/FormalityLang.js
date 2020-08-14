var {
  Var, Ref, Typ, All,
  Lam, App, Let, Ann,
  Loc, Ext, Nil, Wat,
  Hol, Cse, Nat, Chr,
  Str,
  unloc,
  reduce,
  normalize,
  Err,
  typeinfer,
  typecheck,
  typesynth,
  equal,
  find,
  fold,
  new_name,
  stringify: synt_stringify,
} = require("./FormalitySynt.js");

// Parsing
// =======

function Tag(ctor, text) {
  return {ctor, text};
};

function get_var(ctx, name, not_found) {
  var got = find(ctx, (bnd, i) => bnd[0] === name);
  if (!got) {
    if (not_found) {
      return not_found();
    } else {
      throw "Unbound: " + name + ".";
    }
  } else {
    return got.value[1];
  }
};

// Is this a space character?
// Unicode whitespace characters from https://en.wikipedia.org/wiki/Whitespace_character
function is_space(chr) {
  var whitespace = " \t\n\r\v\f\u0085\u00A0\u1680\u2000\u2001\u2002\u2003"  +
                   "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029" +
                   "\u2028\u2029\u202F\u205F\u3000\u180E\u200B\u200C\u200D" +
                   "\u2060\uFEFF"
  return (whitespace.indexOf(chr) !== -1)
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
function choose(fns, err) {
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
  return a ? fn(a[0], a[1]) : null;
};

// Drop characters while a condition is met.
function drop_while(cond, code, [indx,tags]) {
  var drops = "";
  while (indx < code.length && cond(code[indx])) {
    if (tags) {
      drops += code[indx];
    }
    indx++;
  };
  if (tags && drops.length > 0) {
    tags = tags&&Ext(Tag("nul",drops),tags);
  }
  return [indx, tags];
};

// Drop spaces
function drop_spaces(code, [indx,tags]) {
  return drop_while(is_space, code, [indx,tags]);
};

// Drops spaces and comments
function next(code, [indx,tags]) {
  while (true) {
    var [indx,tags] = drop_spaces(code, [indx,tags]);
    if (code[indx] === "/") {
      var [indx,tags] = drop_while(c => c !== "\n", code, [indx,tags]);
    } else if (code[indx] === "#") {
      var [indx,tags] = drop_while(c => c !== "#", code, [indx+1, tags&&Ext(Tag("nul","#"),tags)]);
      indx += 1;
      tags = tags&&Ext(Tag("nul","#"),tags);
    } else {
      break;
    }
  };
  return [indx, tags];
};

function hole(name, xs) {
  return Hol(name, fold(xs, Nil(), (h,t) => Ext(h[1],t)));
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
function parse_txt(code, [indx,tags], str, err = false) {
  var txt = "";
  while (str.length > 0 && indx < code.length) {
    if (str[0] === code[indx]) {
      txt += code[indx++];
      str = str.slice(1);
    } else {
      break;
    }
  }
  if (str.length === 0) {
    return [[indx,tags&&Ext(Tag("txt",txt),tags)], txt];
  } else {
    return parse_error(code, indx, "'"+str+"'", err);
  }
};

// Parses one of two strings
function parse_one(code, [indx,tags], ch0, ch1, err) {
  return choose([
    () => chain(parse_txt(code, [indx,tags], ch0, false), ([indx,tags],_) => [[indx,tags], false]),
    () => chain(parse_txt(code, [indx,tags], ch1, err  ), ([indx,tags],_) => [[indx,tags], true]),
  ]);
};

function parse_mny(parser) {
  return function(code, [indx,tags], err = false) {
    var parses = [];
    var parsed = parser(code, [indx,tags], false);
    while (parsed) {
      var [[indx,tags], parse] = parsed;
      parses.push(parse);
      var parsed = parser(code, next(code, [indx,tags]), false);
    };
    return [[indx,tags], parses];
  };
};

// Parses an optional value
function parse_may(parser) {
  return function(code, [indx,tags], err) {
    var parsed = parser(code, [indx,tags], err);
    if (parsed) {
      return parsed;
    } else {
      return [[indx,tags], null];
    }
  }
};

// Parses an optional string
function parse_opt(code, [indx,tags], str, err) {
  return choose([
    () => chain(parse_txt(code, [indx,tags], str, false), ([indx,tags],_) => [[indx,tags], true]),
    () => [[indx,tags], false],
  ]);
};

// Parses comma separated arguments `(x,y,z)` or `<x,y,z>`
function parse_arg(parser) {
  return (code, [indx,tags], err) => {
    var parse_next = (code, [indx,tags], err) =>
      chain(parse_txt(code,next(code,[indx,tags]),",",err), ([indx,tags], skip) =>
      chain(parser(code,[indx,tags],err), ([indx,tags], res) => 
      [[indx,tags], res]));
    return (
      chain(parse_one(code, [indx,tags], "(", "<", false), ([indx,tags], eras) =>
      chain(parser(code, [indx,tags], false), ([indx,tags], init) =>
      chain(parse_mny(parse_next)(code, [indx,tags], err), ([indx,tags], parses) =>
      chain(parse_txt(code, next(code,[indx,tags]), eras ? ">" : ")", err), ([indx,tags], skip) =>
      [[indx,tags], [eras, [init].concat(parses)]])))));
  };
};

// parse binder `x: A`
function parse_bnd(code, [indx,tags], err) {
  return choose([
    () => (
      chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], name) =>
      chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], type) => 
      [[indx,tags], [name, type]]
      )))),
    () => (
      chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], name) =>
      chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
      [[indx,tags], [name, null]]
      ))),
    ]);
};

// Parses a valid name, non-empty
function parse_nam(code, [indx,tags], allow_empty = false, err = false, tag = "nam") {
  var nam = "";
  while (indx < code.length) {
    if (is_name(code[indx])) {
      nam += code[indx++];
    } else {
      break;
    }
  }
  tags = tags&&Ext(Tag(tag,nam),tags);
  if (nam.length > 0 || allow_empty) {
    return [[indx,tags], nam];
  } else {
    parse_error(code, indx, "a name", err);
  }
};

// Parses a parenthesis, `(<term>)`
function parse_grp(code, [indx,tags], err = false) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "(", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], term) =>
    chain(parse_txt(code, next(code, [indx,tags]), ")", err), ([indx,tags], skip) =>
    [[indx,tags], term]))));
};

// Parses a dependent function type, `(<name> : <term>) -> <term>`
function parse_all(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], self) =>
    chain(parse_arg(parse_bnd)(code, [indx,tags], false), ([indx,tags], [eras,binds]) =>
    chain(parse_txt(code, next(code, [indx,tags]), "->", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      var fold = (ctx,i) => {
        let slf = i == 0 ? self : "";
        let nam = binds[i][0];
        let bnd = binds[i][1](ctx);
        return ((i < binds.length - 1)
          ? All(eras,slf,nam,bnd,(s,x) => fold(Ext([nam,x],Ext([slf,s],ctx)),i+1))
          : All(eras,slf,nam,bnd,(s,x) => body(Ext([nam,x],Ext([slf,s],ctx)))));
      };
      return Loc(from, indx, fold(xs,0))
    }])))))
};

// Parses a lambda, `(<name>) <term>`
function parse_lam(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  //var pnam = (c,i,e) => parse_nam(c,next(c,i),true,e)
  function parse_bnd(code, [indx,tags], err) {
    return (
      chain(parse_txt(code, next(code,[indx,tags]), ":", err), ([indx,tags],skip) =>
      chain(parse_trm(code, next(code,[indx,tags]), err), ([indx,tags],bind) =>
      [[indx,tags],bind])));
  };
  function parse_fxs(code, [indx,tags], err) {
    return (
      chain(parse_nam(code, next(code,[indx,tags]), true, err), ([indx,tags],name) =>
      chain(parse_may(parse_bnd)(code, next(code, [indx,tags]), err), ([indx,tags], bind) =>
      [[indx,tags],[name,bind]])));
  };
  return (
    chain(parse_arg(parse_fxs)(code, next(code, [indx,tags]), false), ([indx,tags], [eras, args]) =>
    chain(parse_trm(code, next(code,[indx,tags]), err), ([indx,tags], body) =>
    [[indx,tags], (xs) => {
       function make(ctx,i) {
        var lam_eras = eras;
        var lam_name = args[i][0];
        var lam_bind = args[i][1];
        if (i < args.length - 1) {
          var lam_body = (x) => make(Ext([lam_name,x],ctx),i+1);
        } else {
          var lam_body = (x) => body(Ext([lam_name,x],ctx));
        }
        if (lam_bind) {
          return Lam(lam_eras, lam_name, (x) => lam_body(Ann(false, x, lam_bind(ctx))));
        } else {
          return Lam(lam_eras, lam_name, lam_body);
        }
      };
      return Loc(from, indx, make(xs, 0));
    }])));
};

// Parses a named lambda, `<name>(<term>) => <term>`
function parse_fun(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  var pnam = (c,i,e) => parse_nam(c,next(c,i),true,e)
  return (
    chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], self) =>
    chain(parse_arg(pnam)(code, next(code, [indx,tags]), false), ([indx,tags], [eras, binds]) =>
    chain(parse_txt(code, next(code, [indx,tags]), "=>", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code,[indx,tags]), err), ([indx,tags], body) =>
    [[indx,tags], (xs) => {
       var fold = (ctx,i) =>
         (i < binds.length - 1)
         ? Lam(eras, binds[i], (x) => fold(Ext([binds[i],x],ctx),i+1))
         : Lam(eras, binds[i], (x) => body(Ext([binds[i],x],ctx)))
      return Loc(from, indx, fold(xs,0))
    }])))));
};

// Parses a pair, `{<term>, <term>}`
function parse_par(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "{", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), false), ([indx,tags], val0) =>
    chain(parse_txt(code, next(code, [indx,tags]), ",", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], val1) =>
    chain(parse_txt(code, next(code, [indx,tags]), "}", false), ([indx,tags], skip) => {
      let nam0 = new_name();
      let nam1 = new_name();
      return [[indx,tags], (xs) => {
        var term = Ref("Pair.new");
        var term = App(true, term, hole(nam0, xs))
        var term = App(true, term, hole(nam1, xs))
        var term = App(false, term, val0(xs));
        var term = App(false, term, val1(xs));
        return Loc(from, indx, term);
      }]
    }))))));
}

// Parses an arrow comment, `<name> => <term>`
function parse_acm(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], self) =>
    chain(parse_txt(code, next(code, [indx,tags]), "=>", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code,[indx,tags]), err), ([indx,tags], term) =>
    [[indx,tags], (xs) => Loc(from, indx, term(xs))]))));
};

// Parses a local definition, `let x = val; body`
function parse_let(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_one(code, next(code, [indx,tags]), "def ", "let ", false), ([indx,tags], dups) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    chain(parse_opt(code, next(code, [indx,tags]), "=", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], expr) =>
    chain(parse_opt(code, [indx,tags], ";", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      if (dups) {
        var tbody = (x) => body(Ext([name,x],xs));
        return Loc(from, indx, Let(name, expr(xs), tbody));
      } else {
        return body(Ext([name,expr(xs)],xs));
      };
    }])))))));
};

// Parses a monadic application of 4 args, `use a b c = x; y` ~> `x((a) (b) (c) (d) y)`
function parse_us4(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "use "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam2) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam3) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, nam0, (x) =>
        Lam(false, nam1, (y) =>
        Lam(false, nam2, (z) =>
        Lam(false, nam3, (w) =>
        body(Ext([nam3,w], Ext([nam2,z], Ext([nam1,y], Ext([nam0,x], xs)))))))))));
    }])))))))));
};

// Parses a monadic application of 3 args, `use a b c = x; y` ~> `x((a) (b) (c) y)`
function parse_us3(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "use "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam2) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, nam0, (x) =>
        Lam(false, nam1, (y) =>
        Lam(false, nam2, (z) =>
        body(Ext([nam2,z], Ext([nam1,y], Ext([nam0,x], xs)))))))));
    }]))))))));
};

// Parses a monadic application of 2 args, `use a b = x; y` ~> `x((a) (b) y)`
function parse_us2(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "use "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, nam0, (x) =>
        Lam(false, nam1, (y) =>
        body(Ext([nam1,y], Ext([nam0,x], xs)))))));
    }])))))));
};

// Parses a monadic application of 1 arg, `use a = x; y` ~> `x((a) y)`
function parse_us1(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "use "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, name, (x) =>
        body(Ext([name,x],xs)))));
    }]))))));
};

// Parses a monadic application of 0 args, `use x; y` ~> `x(y)`
function parse_us0(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "use "), ([indx,tags], skip) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], argm) =>
    [[indx,tags], xs => {
      return Loc(from, indx, App(false, func(xs), argm(xs)));
    }])))));
};

// Parses a for loop, `for i = 0 .. 10 with val: f(i, val)`
// ~> `let val = Nat.for<>(val, 0, 10, (i, val) f(i,val)); val`
function parse_for(type, callfunc) {
  return function parse_for(code, [indx,tags], err = false) {
    function parse_typ(code, [indx,tags], err) {
      if (type) {
        return (
          chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
          chain(parse_txt(code, next(code, [indx,tags]), type, err), ([indx,tags], skip) =>
          [[indx,tags], null])));
      } else {
        return [[indx,tags], null];
      }
    };
    var from = next(code, [indx,tags])[0];
    return (
      chain(parse_txt(code, next(code, [indx,tags]), "for ", false), ([indx,tags], skip) =>
      chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], fidx) =>
      chain(parse_typ(code, next(code, [indx,tags]), false), ([indx,tags], skip) => 
      chain(parse_txt(code, next(code, [indx,tags]), "=", false), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], lim0) =>
      chain(parse_txt(code, next(code, [indx,tags]), "..", err), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], lim1) =>
      chain(parse_txt(code, next(code, [indx,tags]), "with", err), ([indx,tags], skip) =>
      chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
      chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], loop) => {
        let nam0 = new_name();
        return [[indx,tags], xs => {
          var term = Ref(callfunc);
          var term = App(true, term, hole(nam0, xs));
          var term = App(false, term, get_var(xs, name));
          var term = App(false, term, lim0(xs));
          var term = App(false, term, lim1(xs));
          var lamb = Lam(false, fidx, i =>
                    Lam(false, name, x =>
                    loop(Ext([fidx,i], Ext([name,x], xs)))));
          var term = App(false, term, lamb);
          var term = Let(name, term, x => get_var(Ext([name,x], xs), name));
          return Loc(from, indx, term);
        }];
      }))))))))))));
  };
};

// Parses a for-in loop, `for x in list with state: f(x, state)`
// ~> `let state = List.for<,>(state, (x, state) f(x, state), list); state`
function parse_fin(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "for ", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], elem) =>
    chain(parse_txt(code, next(code, [indx,tags]), "in", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], list) =>
    chain(parse_txt(code, next(code, [indx,tags]), "with", err), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], loop) => {
      let nam0 = new_name();
      let nam1 = new_name();
      return [[indx,tags], xs => {
        var term = Ref("List.for");
        var term = App(true, term, hole(nam0, xs));
        var term = App(false, term, list(xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(false, term, get_var(xs, name));
        var lamb =
          Lam(false, elem, i =>
          Lam(false, name, x =>
          loop(Ext([elem,i], Ext([name,x], xs)))));
        var term = App(false, term, lamb);
        var term = Let(name, term, x => get_var(Ext([name,x], xs), name));
        return Loc(from, indx, term);
      }];
    })))))))));
};

// Parses a let for loop, `let val = for i = 0 .. 10: f(i, val)`
// ~> `let val = Nat.for<>(val, 0, 10, (i, val) f(i,val))`
function parse_lfr(type, callfunc) {
  return function parse_lfr(code, [indx,tags], err = false) {
    function parse_typ(code, [indx,tags], err) {
      if (type) {
        return (
          chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
          chain(parse_txt(code, next(code, [indx,tags]), type, err), ([indx,tags], skip) =>
          [[indx,tags], null])));
      } else {
        return [[indx,tags], null];
      }
    };
    var from = next(code, [indx,tags])[0];
    return (
      chain(parse_txt(code, next(code, [indx,tags]), "let ", false), ([indx,tags], skip) =>
      chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], name) =>
      chain(parse_txt(code, next(code, [indx,tags]), "=", false), ([indx,tags], skip) =>
      chain(parse_txt(code, next(code, [indx,tags]), "for ", false), ([indx,tags], skip) =>
      chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], fidx) =>
      chain(parse_typ(code, next(code, [indx,tags]), false), ([indx,tags], skip) => 
      chain(parse_txt(code, next(code, [indx,tags]), "=", false), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], lim0) =>
      chain(parse_txt(code, next(code, [indx,tags]), "..", err), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], lim1) =>
      chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], loop) =>
      chain(parse_opt(code, [indx,tags], ";", err), ([indx,tags], skip) => 
      chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
        let nam0 = new_name();
        return [[indx,tags], xs => {
          var term = Ref(callfunc);
          var term = App(true, term, hole(nam0, xs));
          var term = App(false, term, get_var(xs, name));
          var term = App(false, term, lim0(xs));
          var term = App(false, term, lim1(xs));
          var lamb = Lam(false, fidx, i =>
                    Lam(false, name, x =>
                    loop(Ext([fidx,i], Ext([name,x], xs)))));
          var term = App(false, term, lamb);
          var term = Let(name, term, x => body(Ext([name,x], xs)));
          return Loc(from, indx, term);
        }];
      })))))))))))))));
  };
};

// Parses a let for-in loop, `let state = for x in list: f(x, state)`
// ~> `let state = List.for<,>(state, (x, state) f(x, state), list)`
function parse_lfn(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "let ", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), "=", false), ([indx,tags], skip) =>
    chain(parse_txt(code, next(code, [indx,tags]), "for ", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], elem) =>
    chain(parse_txt(code, next(code, [indx,tags]), "in", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], list) =>
    chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], loop) =>
    chain(parse_opt(code, [indx,tags], ";", err), ([indx,tags], skip) => 
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
      let nam0 = new_name();
      let nam1 = new_name();
      return [[indx,tags], xs => {
        var term = Ref("List.for");
        var term = App(true, term, hole(nam0, xs));
        var term = App(false, term, list(xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(false, term, get_var(xs, name));
        var lamb =
          Lam(false, elem, i =>
          Lam(false, name, x =>
          loop(Ext([elem,i], Ext([name,x], xs)))));
        var term = App(false, term, lamb);
        var term = Let(name, term, x => body(Ext([name,x], xs)));
        return Loc(from, indx, term);
      }];
    }))))))))))));
};

// Parses a projection, `get a = x; y` ~> `x<() _>((a) y)`
function parse_gt1(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "get "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
      var nam0 = new_name();
      return [[indx,tags], xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(nam0, xs)),
          Lam(false, name, (x) =>
          body(Ext([name,x],xs)))));
      }]
    }))))));
};

// Parses a projection of 2 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt2(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "get "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
      var hol0 = new_name();
      return [[indx,tags], xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(hol0, xs)),
          Lam(false, nam0, (x) =>
          Lam(false, nam1, (y) =>
          body(Ext([nam1,y], Ext([nam0,x], xs)))))));
      }];
    })))))));
};

// Parses a projection of 3 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt3(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "get "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam2) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
      var hol0 = new_name();
      return [[indx,tags], xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(hol0, xs)),
          Lam(false, nam0, (x) =>
          Lam(false, nam1, (y) =>
          Lam(false, nam2, (z) =>
          body(Ext([nam2,z], Ext([nam1,y], Ext([nam0,x], xs)))))))));
      }];
    }))))))));
};

// Parses a projection of 4 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt4(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "get "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam0) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam1) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam2) =>
    chain(parse_nam(code, next(code, [indx,tags]), false), ([indx,tags], nam3) =>
    chain(parse_txt(code, next(code, [indx,tags]), "="), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], func) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) => {
      var hol0 = new_name();
      return [[indx,tags], xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(hol0, xs)),
          Lam(false, nam0, (x) =>
          Lam(false, nam1, (y) =>
          Lam(false, nam2, (z) =>
          Lam(false, nam3, (w) =>
          body(Ext([nam3,w], Ext([nam2,z], Ext([nam1,y], Ext([nam0,x], xs)))))))))));
      }];
    })))))))));
};

// TODO: generic parser for N uses/gets instead of hard-coding N

// Parses the type of types, `Type`
function parse_typ(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "Type", false), ([indx,tags], skip) =>
    [[indx,tags], xs => Loc(from, indx, Typ())]));
};

// Parses an assumption, `?a`
function parse_wat(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, [indx,tags], "?", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    [[indx,tags], xs => Wat(name)])));
};

// Parses a hole that Formality will try to auto-complete, `_`
function parse_hol(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, [indx,tags], "_", false), ([indx,tags], skip) => {
      var nam0 = new_name();
      return [[indx,tags], xs => hole(nam0, xs)];
    }));
};

// Parses an case expression, `case x as t : m;` ~> `x<(t) m>`
function parse_cse(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  function parse_opn(code, [indx, tags], err) {
    return (
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], term) =>
      [[indx,tags], [term]]));
  };
  function parse_bar(code, [indx, tags], err) {
    return (
      chain(parse_txt(code, next(code, [indx,tags]), "|", false), ([indx,tags], skip) =>
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], term) =>
      chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
      [[indx,tags], term]))));
  };
  function parse_mot(code, [indx, tags], err) {
    return (
      chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], moti) => 
      chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
      [[indx,tags], moti]))));
  };
  function parse_wth(code, [indx, tags], err) {
    return (
      chain(parse_txt(code, next(code, [indx,tags]), "with ", false), ([indx,tags], skip) =>
      chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
      chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], type) => 
      chain(parse_txt(code, next(code, [indx,tags]), "=", err), ([indx,tags], skip) =>
      chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], term) => 
      chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
      [[indx,tags], [name,type,term]]))))))));
  };
  function parse_val(code, [indx, tags], err) {
    return choose([
      () => (
        chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], name) =>
        chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
        [[indx,tags], [name, parsed_var(from, [indx,tags], name)]]))),
      () => (
        chain(parse_trm(code, next(code, [indx,tags]), false), ([indx,tags], func) =>
        chain(parse_txt(code, next(code, [indx,tags]), "as ", false), ([indx,tags], skip) =>
        chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], name) =>
        chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
        [[indx,tags], [name, func]]))))),
      () => (
        chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], func) =>
        chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) =>
        [[indx,tags], ["self", func]]))),
    ]);
  };
  return (
    chain(parse_one(code, next(code, [indx,tags]), "case ", "open ", false), ([indx,tags], open) =>
    chain(parse_val(code, next(code, [indx,tags]), err), ([indx,tags], cval) =>
    chain(parse_mny(parse_wth)(code, [indx,tags], err), ([indx,tags], wths) =>
    chain((open ? parse_opn : parse_mny(parse_bar))(code, [indx,tags], err), ([indx,tags], bars) =>
    chain(parse_may(parse_mot)(code, [indx,tags], err), ([indx,tags], moti) => {
      var uniq_name = new_name();
      var hole_name = new_name();
      return [[indx,tags], xs => {
        var [name, func] = cval;
        var func_term = func(xs);
        if (!moti) {
          moti = xs => hole(hole_name, xs);
        }
        var func_moti = xs => (function go(i, xs) {
          if (i === wths.length) {
            return moti(xs);
          } else {
            var [wnam, wtyp, wter] = wths[i];
            return All(false, "", wnam, wtyp(xs), (s,x) => go(i+1, Ext([wnam,x],Ext(["",s],xs))));
          };
        })(0, xs);
        var func_bars = bars.map(bar => xs => (function go(i, xs) {
          if (i === wths.length) {
            return bar(xs);
          } else {
            var [wnam, wtyp, wter] = wths[i];
            return Lam(false, wnam, (x) => go(i+1, Ext([wnam,x],xs)));
          };
        })(0, xs));
        var term = Cse(name+"#"+uniq_name, func_term, [xs, [func_moti].concat(func_bars)]);
        for (var [wnam, wtyp, wter] of wths) {
          term = App(false, term, wter(xs));
        };
        return term;
      }];
    }))))));
};

function parse_ite(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "if ", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], cond) =>
    chain(parse_opt(code, next(code, [indx,tags]), "then", err), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], ctru) =>
    chain(parse_opt(code, next(code, [indx,tags]), "else", err), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], cfal) => {
      var nam0 = new_name();
      return [[indx,tags], xs => {
        var term = cond(xs);
        var term = App(true, term, Lam(false, "", x => hole(nam0, Ext(["",x],xs))));
        var term = App(false, term, ctru(xs));
        var term = App(false, term, cfal(xs));
        return term;
      }];
    })))))));
};

// Parses the do-notation
function parse_don(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  function parse_stt(mnam) {
    return function parse_stt(code, [indx,tags], err) {
      return choose([
        () => // var x = expr; body
          chain(parse_txt(code, next(code, [indx,tags]), "var ", false), ([indx,tags], skip) =>
          chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
          chain(parse_txt(code, next(code, [indx,tags]), "=", err), ([indx,tags], skip) =>
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], expr) =>
          chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
          chain(parse_stt(code, next(code, [indx,tags]), err), ([indx,tags], body) => {
            var nam0 = new_name();
            var nam1 = new_name();
            return [[indx,tags], xs => {
              var term = App(false, App(true, Ref("Monad.bind"), Ref(mnam)), Ref(mnam+".monad"));
              var term = App(true, term, hole(nam0, xs));
              var term = App(true, term, hole(nam1, xs));
              var term = App(false, term, expr(xs));
              var term = App(false, term, Lam(false, name, (x) => body(Ext([name,x],xs))));
              return term;
            }];
          })))))),
        () => // return expr;
          chain(parse_txt(code, next(code, [indx,tags]), "return ", false), ([indx,tags], skip) =>
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], expr) =>
          chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) => {
            var nam0 = new_name();
            return [[indx,tags], xs => {
              var term = App(false, App(true, Ref("Monad.pure"), Ref(mnam)), Ref(mnam+".monad"));
              var term = App(true, term, hole(nam0, xs));
              var term = App(false, term, expr(xs));
              return term;
            }];
          }))),
        () => // expr; body
          chain(parse_trm(code, next(code, [indx,tags]), false), ([indx,tags], expr) =>
          chain(parse_txt(code, next(code, [indx,tags]), ";", false), ([indx,tags], skip) =>
          chain(parse_stt(code, next(code, [indx,tags]), false), ([indx,tags], body) => {
            var nam0 = new_name();
            var nam1 = new_name();
            return [[indx,tags], xs => {
              var term = App(false, App(true, Ref("Monad.bind"), Ref(mnam)), Ref(mnam+".monad"));
              var term = App(true, term, hole(nam0, xs));
              var term = App(true, term, hole(nam1, xs));
              var term = App(false, term, expr(xs));
              var term = App(false, term, Lam(false, "", (x) => body(Ext(["",x],xs))));
              return term;
            }];
          }))),
        () => // expr;
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], expr) =>
          chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) => {
            return [[indx,tags], xs => {
              return expr(xs);
            }];
          })),
      ]);
    };
  };
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "do "), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], mnam) =>
    chain(parse_txt(code, next(code, [indx,tags]), "{", err), ([indx,tags], skip) =>
    chain(parse_stt(mnam)(code, next(code, [indx,tags]), err), ([indx,tags], term) =>
    chain(parse_txt(code, next(code, [indx,tags]), "}", err), ([indx,tags], skip) =>
    [[indx,tags], xs => Loc(from, indx, term(xs))]))))));
};

function parsed_var(from, [indx,tags], name, sign = true) {
  return xs => {
    if (tags && tags.head) tags.head.ctor = "var";
    return Loc(from, indx, get_var(xs, name, () => {
      if (/^[0-9]*$/.test(name)) {
        if (tags && tags.head) tags.head.ctor = "nat";
        return Nat(BigInt(name));
      } else if (/^[0-9]*[bsulijfde]$/.test(name)) {
        var conv = null;
        switch (name[name.length - 1]) {
          case "b": conv = "Nat.to_u8"; break;
          case "s": conv = "Nat.to_u16"; break;
          case "u": conv = "Nat.to_u32"; break;
          case "l": conv = "Nat.to_u64"; break;
          case "e": conv = "Nat.to_u256"; break;
        }
        return App(false, Ref(conv), Nat(BigInt(name.slice(0,-1))));
      } else if (/^[0-9]*\.[0-9]*$/.test(name)) {
        var [a,b] = name.split(".");
        var term = Ref("Nat.to_f64");
        var term = App(false, term, Ref(sign ? "Bool.true" : "Bool.false"));
        var term = App(false, term, Nat(BigInt(a + b)));
        var term = App(false, term, Nat(BigInt(b.length)));
        return term;
      } else {
        if (tags && tags.head) tags.head.ctor = "ref";
        return Ref(name);
      };
    }));
  };
};

// Parses variables, `<name>`
function parse_var(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_opt(code, next(code, [indx,tags]), "-", false), ([indx,tags], negs) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], name) => {
      if (name.length === 0) {
        return parse_error(code, indx, "a variable", err);
      } else {
        var tag_to_mutate = tags && tags.head;
        return [[indx,tags], parsed_var(from, [indx,tags], name, !negs)]
      };
    })));
};

// Parses a single-line hole application, `<term>()`
function parse_ia1(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "()"), ([indx,tags], eras) => {
      var nam0 = new_name();
      return [[indx,tags], xs => Loc(from, indx, App(false, func(xs), hole(nam0, xs)))]
    }));
};

// Parses 1 implicit arguments, `f<>`
function parse_ie1(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses 2 implicit arguments, `f<,>`
function parse_ie2(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<,>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      var nam1 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        var term = App(true, term, hole(nam1, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses 3 implicit arguments, `f<,,>`
function parse_ie3(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<,,>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      var nam1 = new_name();
      var nam2 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(true, term, hole(nam2, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses 4 implicit arguments, `f<,,,>`
function parse_ie4(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<,,,>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      var nam1 = new_name();
      var nam2 = new_name();
      var nam3 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(true, term, hole(nam2, xs));
        var term = App(true, term, hole(nam3, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses 5 implicit arguments, `f<,,,,>`
function parse_ie5(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<,,,,>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      var nam1 = new_name();
      var nam2 = new_name();
      var nam3 = new_name();
      var nam4 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(true, term, hole(nam2, xs));
        var term = App(true, term, hole(nam3, xs));
        var term = App(true, term, hole(nam4, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses 6 implicit arguments, `f<,,,,,>`
function parse_ie6(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<,,,,,>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      var nam1 = new_name();
      var nam2 = new_name();
      var nam3 = new_name();
      var nam4 = new_name();
      var nam5 = new_name();
      return [[indx,tags], xs => {
        var term = func(xs);
        var term = App(true, term, hole(nam0, xs));
        var term = App(true, term, hole(nam1, xs));
        var term = App(true, term, hole(nam2, xs));
        var term = App(true, term, hole(nam3, xs));
        var term = App(true, term, hole(nam4, xs));
        var term = App(true, term, hole(nam5, xs));
        return Loc(from, indx, term);
      }];
    }));
};

// Parses a application `f(x,y,z) ~> f(x)(y)(z)`
function parse_app(code, [indx,tags], from, func, err) {
  return (
    chain(parse_arg(parse_trm)(code,[indx,tags],err), ([indx,tags], [eras,args]) =>
      [[indx,tags], (xs) => {
        var x = func(xs);
        for (var i = 0; i < args.length; i++) {
          x = App(eras,x,args[i](xs));
        };
        return Loc(from,indx,x);
    }]));
};

// Parses a multi-line application, `<term> | <term>;`
function parse_pip(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "|", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], argm) =>
    chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
    [[indx,tags], xs => Loc(from, indx, App(false, func(xs), argm(xs)))]))));
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, [indx,tags], from, bind, err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "->", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      var tbind = bind(xs);
      var tbody = (s,x) => body(Ext(["",x],Ext(["",s],xs)));
      return Loc(from, indx, All(false, "", "", tbind, tbody));
    }])));
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, [indx,tags], from, expr, err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "::", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], type) =>
    [[indx,tags], xs => Loc(from, indx, Ann(false, expr(xs), type(xs)))])));
};

// Parses an equality, `<term> == <term>`
function parse_yeq(code, [indx,tags], from, expr, err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "==", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], eqto) => {
      var nam0 = new_name();
      return [[indx,tags], xs => {
        var term = Ref("Equal");
        var term = App(false, term, hole(nam0, xs))
        var term = App(false, term, expr(xs));
        var term = App(false, term, eqto(xs));
        return Loc(from, indx, term);
      }];
    })));
};

// Parses a non equality, `<term> != <term>`
function parse_neq(code, [indx,tags], from, expr, err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "!=", false), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], eqto) => {
      var nam0 = new_name();
      return [[indx,tags], xs => {
        var term = Ref("Equal");
        var term = App(false, term, hole(nam0, xs))
        var term = App(false, term, expr(xs));
        var term = App(false, term, eqto(xs));
        var term = App(false, Ref("Not"), term);
        return Loc(from, indx, term);
      }];
    })));
};

// Parses a char literal, 'f'
function parse_chr(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  function esc(code,[indx,tags],err) {
    return (
    chain(parse_txt(code, [indx,tags], "\\"), ([indx,tags], skip) =>
    chain(parse_esc(code, [indx,tags], err,false), ([indx,tags], e) =>
    [[indx,tags],e])))
  }
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "'"), ([indx,tags], skip) =>
    chain(choose([() => esc(code,[indx,tags],err), () => [[indx+1,tags],code[indx]]]), ([indx,tags], chrx) =>
    chain(parse_txt(code, next(code, [indx,tags]), "'"), ([indx,tags], skip) =>
    [[indx,tags&&Ext(Tag("chr",code[indx]),tags)], xs => Loc(from, indx, Chr(chrx))]
    ))));
};

// Parses a string literal, "foo"
function parse_str(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "\""), ([indx,tags], skip) =>
    chain((function go([indx,tags], slit) {
      var strx = "";
      while (true) {
        if (indx >= code.length) {
          parse_error(code, indx, "unterminated string literal", true);
        } else if (code[indx] == '\\') {
          var esc = parse_esc(code,[indx+1,tags],err,true)
          if (esc) {
            var [[esc_indx,_],esc_char] = esc;
            strx += esc_char;
            indx = esc_indx;
          } else {
            parse_error(code, indx, "valid string escape sequence", true);
          }
        } else if (code[indx] == '"') {
          break;
        } else {
          strx += code[indx++];
        }
      }
      //console.log(strx);
      return [[indx+1,tags&&Ext(Tag("txt",'"'),Ext(Tag("str",strx),tags))], Str(strx)];
    })([indx,tags]), ([indx,tags], slit) =>
    [[indx,tags], xs => Loc(from, indx, slit)])));
};

// Parses a string escape sequence, `\n`, `\DEL`, `\xABCDE
function parse_esc(code,[indx,tags],err,is_string) {
  var escs =
    [["b","\b"],    ["f","\f"],    ["n","\n"],    ["r","\r"],    ["t","\t"],
     ["v","\v"],    ["\\","\\"],   ["\"","\""],   ["0","\0"],["'","'"],
     ["NUL","\x00"],["SOH","\x01"],["STX","\x02"],["ETX","\x03"],["EOT","\x04"],
     ["ENQ","\x05"],["ACK","\x06"],["BEL","\x07"],["BS", "\x08"],["HT", "\x09"],
     ["LF", "\x0A"],["VT", "\x0B"],["FF", "\x0C"],["CR", "\x0D"],["SO", "\x0E"],
     ["SI", "\x0F"],["DLE","\x10"],["DC1","\x11"],["DC2","\x12"],["DC3","\x13"],
     ["DC4","\x14"],["NAK","\x15"],["SYN","\x16"],["ETB","\x17"],["CAN","\x18"],
     ["EM", "\x19"],["SUB","\x1A"],["ESC","\x1B"],["FS", "\x1C"],["GS", "\x1D"],
     ["RS", "\x1E"],["US", "\x1F"],["SP", "\x20"],["DEL","\x7F"]]
  if (is_string) {
    escs.push(["&",""])
  }
  function hex(code,[indx,tags],err) {
    return (
      chain(parse_txt(code,[indx,tags],"x",false),([indx,tags],skip) =>
      chain(parse_hex(code,[indx,tags],false),    ([indx,tags],pnt)  =>
      (pnt <= 0x10FFFFn) ? [[indx,tags], String.fromCodePoint(Number(pnt))] : null
    )))
  };
  function unc(code,[indx,tags],err) {
    return (
      chain(parse_txt(code,[indx,tags],"u{",false),([indx,tags],skip) =>
      chain(parse_hex(code,[indx,tags],false),    ([indx,tags],pnt)  =>
      chain(parse_txt(code,[indx,tags],"}",false),([indx,tags],skip) =>
      (pnt <= 0x10FFFFn) ? [[indx,tags], String.fromCodePoint(Number(pnt))] : null
    ))))
  };
  return (choose([
      () => choose(escs.map(([a,b]) => () =>
            chain(parse_txt(code,[indx,tags],a,false), ([indx,tags],_) => 
            [[indx,tags],b]))),
      () => hex(code,[indx,tags],err),
      () => unc(code,[indx,tags],err)
    ]));
};

// parse binary literal
function parse_bin(code,[indx,tags],err) {
  var from = next(code, [indx,tags])[0];
  var digs = [['0',0n],['1',1n]]
  function dig(code,[indx,tags],err) {
    return (choose(digs.map(([a,b]) => () =>
      chain(parse_txt(code,[indx,tags],a,err), ([indx,tags],_) =>
      [[indx,tags],b]))))
  };
  return (
    chain(dig(code,[indx,tags],err), ([indx,tags],d) =>
    chain(parse_mny(dig)(code,[indx,tags],err), ([indx,tags],ds) => { 
      ds.unshift(d);
      var [_,num] = ds.reduceRight(([p,a],v) => [p+1n,a + v * 2n**p],[0n,0n]);
      return [[indx,tags], num];
    })))
}

// Parses a decimal number
function parse_dec(code,[indx,tags],err) { 
  var from = next(code, [indx,tags])[0];
  var digs = [['0',0n],['1',1n],['2',2n],['3',3n],['4',4n],
              ['5',5n],['6',6n],['7',7n],['8',8n],['9',9n]]
  function dig(code,[indx,tags],err) {
    return (choose(digs.map(([a,b]) => () =>
      chain(parse_txt(code,[indx,tags],a,err), ([indx,tags],_) =>
      [[indx,tags],b]))))
  };
  return (
    chain(dig(code,[indx,tags],err), ([indx,tags],d) =>
    chain(parse_mny(dig)(code,[indx,tags],err), ([indx,tags],ds) => { 
      ds.unshift(d);
      var [_,num] = ds.reduceRight(([p,a],v) => [p+1n,a + v * 10n**p],[0n,0n]);
      return [[indx,tags], num];
    })))
};

function parse_hex(code,[indx,tags],err) {
  var from = next(code, [indx,tags])[0];
  var digs = [['0',0n],['1',1n],['2',2n],['3',3n],['4',4n],
              ['5',5n],['6',6n],['7',7n],['8',8n],['9',9n],
              ['a',10n],['b',11n],['c',12n],['d',13n],['e',14n],['f',15n],
              ['A',10n],['B',11n],['C',12n],['D',13n],['E',14n],['F',15n]
              ]
  function dig(code,[indx,tags],err) {
    return (choose(digs.map(([a,b]) => () =>
      chain(parse_txt(code,[indx,tags],a,err), ([indx,tags],_) =>
      [[indx,tags],b]))))
  };
  return (
    chain(dig(code,[indx,tags],err), ([indx,tags],d) =>
    chain(parse_mny(dig)(code,[indx,tags],err), ([indx,tags],ds) => { 
      ds.unshift(d);
      var [_,num] = ds.reduceRight(([p,a],v) => [p+1n,a + v * 16n**p],[0n,0n]);
      return [[indx,tags], num];
    })))
};

// Parses a list literal, `[a, b, c]` as a `List(A)`
function parse_lst(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  function parse_els(code, [indx,tags], nam0) {
    return chain(parse_opt(code, next(code, [indx,tags]), "]", false), ([indx,tags], done) => {
      if (done) {
        return [[indx,tags], xs => App(true, Ref("List.nil"), hole(nam0, xs))];
      } else {
        return (
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], elem) =>
          chain(parse_opt(code, next(code, [indx,tags]), ",", false), ([indx,tags], skip) =>
          chain(parse_els(code, next(code, [indx,tags]), nam0), ([indx,tags], tail) =>
          [[indx,tags], xs => {
            var term = Ref("List.cons");
            var term = App(true, term, hole(nam0, xs));
            var term = App(false, term, elem(xs));
            var term = App(false, term, tail(xs));
            return term;
          }]))));
      }
    });
  };
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "[", false), ([indx,tags], skip) => {
      var nam0 = new_name();
      return chain(parse_els(code, next(code, [indx,tags]), nam0), ([indx,tags], list) =>
      [[indx,tags], xs => Loc(from, indx, list(xs))])
    }));
};

// Parses a map literal, `{a: 1, b: 2, c: 3}` as a `List(Pair(A, B))`
function parse_map(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  function parse_els(code, [indx,tags], nam0, nam1) {
    return chain(parse_opt(code, next(code, [indx,tags]), "}", false), ([indx,tags], done) => {
      if (done) {
        return [[indx,tags], xs => {
          var Pair = Ref("Pair");
          var Pair = App(false, Pair, hole(nam0, xs));
          var Pair = App(false, Pair, hole(nam1, xs));
          return App(true, Ref("List.nil"), Pair);
        }];
      } else {
        return (
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], val0) =>
          chain(parse_opt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], val1) =>
          chain(parse_opt(code, next(code, [indx,tags]), ",", false), ([indx,tags], skip) =>
          chain(parse_els(code, next(code, [indx,tags]), nam0), ([indx,tags], tail) =>
          [[indx,tags], xs => {
            var pair = Ref("Pair.new");
            var pair = App(true, pair, hole(nam0, xs));
            var pair = App(true, pair, hole(nam1, xs));
            var pair = App(false, pair, val0(xs));
            var pair = App(false, pair, val1(xs));
            var Pair = Ref("Pair");
            var Pair = App(false, Pair, hole(nam0, xs));
            var Pair = App(false, Pair, hole(nam1, xs));
            var term = Ref("List.cons");
            var term = App(true, term, Pair);
            var term = App(false, term, pair);
            var term = App(false, term, tail(xs));
            return term;
          }]))))));
      }
    });
  };
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "{", false), ([indx,tags], skip) => {
      var nam0 = new_name();
      var nam1 = new_name();
      return chain(parse_els(code, next(code, [indx,tags]), nam0, nam1), ([indx,tags], list) =>
      [[indx,tags], xs => Loc(from, indx, list(xs))])
    }));
};

// Parses a term
function parse_trm(code, [indx = 0, tags = []], err) {
  var [indx,tags] = next(code, [indx,tags]);
  var from = indx;

  // Parses the base term, trying each variant once
  var base_parse = choose([
    () => parse_all(code, [indx,tags], err),
    () => parse_lam(code, [indx,tags], err),
    () => parse_fun(code, [indx,tags], err),
    () => parse_par(code, [indx,tags], err),
    () => parse_acm(code, [indx,tags], err),
    () => parse_for(null,"Nat.for")(code, [indx,tags], err),
    () => parse_for("U8","U8.for")(code, [indx,tags], err),
    () => parse_for("U16","U16.for")(code, [indx,tags], err),
    () => parse_for("U32","U32.for")(code, [indx,tags], err),
    () => parse_for("U64","U64.for")(code, [indx,tags], err),
    () => parse_for("F64","F64.for")(code, [indx,tags], err),
    () => parse_fin(code, [indx,tags], err),
    () => parse_lfr(null,"Nat.for")(code, [indx,tags], err),
    () => parse_lfr("U8","U8.for")(code, [indx,tags], err),
    () => parse_lfr("U16","U16.for")(code, [indx,tags], err),
    () => parse_lfr("U32","U32.for")(code, [indx,tags], err),
    () => parse_lfr("U64","U64.for")(code, [indx,tags], err),
    () => parse_lfr("F64","F64.for")(code, [indx,tags], err),
    () => parse_lfn(code, [indx,tags], err),
    () => parse_let(code, [indx,tags], err),
    () => parse_us0(code, [indx,tags], err),
    () => parse_us1(code, [indx,tags], err),
    () => parse_us2(code, [indx,tags], err),
    () => parse_us3(code, [indx,tags], err),
    () => parse_us4(code, [indx,tags], err),
    () => parse_gt1(code, [indx,tags], err),
    () => parse_gt2(code, [indx,tags], err),
    () => parse_gt3(code, [indx,tags], err),
    () => parse_gt4(code, [indx,tags], err),
    () => parse_grp(code, [indx,tags], err),
    () => parse_typ(code, [indx,tags], err),
    () => parse_chr(code, [indx,tags], err),
    () => parse_str(code, [indx,tags], err),
    () => parse_lst(code, [indx,tags], err),
    () => parse_map(code, [indx,tags], err),
    () => parse_wat(code, [indx,tags], err),
    () => parse_hol(code, [indx,tags], err),
    () => parse_cse(code, [indx,tags], err),
    () => parse_ite(code, [indx,tags], err),
    () => parse_don(code, [indx,tags], err),
    () => parse_var(code, [indx,tags], err),
  ], err);

  if (!base_parse && err) {
    parse_error(code, indx, "a term", err);
  } else if (!base_parse) {
    return null;
  } else {
    // Parses postfix extensions, trying each variant repeatedly
    var post_parse = base_parse;
    while (true) {
      var [[indx,tags], term] = post_parse;
      post_parse = choose([
        () => parse_ia1(code, [indx,tags], from, term, err),
        () => parse_ie1(code, [indx,tags], from, term, err),
        () => parse_ie2(code, [indx,tags], from, term, err),
        () => parse_ie3(code, [indx,tags], from, term, err),
        () => parse_ie4(code, [indx,tags], from, term, err),
        () => parse_ie5(code, [indx,tags], from, term, err),
        () => parse_ie6(code, [indx,tags], from, term, err),
        () => parse_app(code, [indx,tags], from, term, err),
        () => parse_pip(code, [indx,tags], from, term, err),
        () => parse_arr(code, [indx,tags], from, term, err),
        () => parse_ann(code, [indx,tags], from, term, err),
        () => parse_yeq(code, [indx,tags], from, term, err),
        () => parse_neq(code, [indx,tags], from, term, err),
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

// Parses a sequence of `<x: term, y: term...> (a: term, b: term...) ...`.
// Returns a list of erasure/bind/term: `[{eras:bool, name:text, term:term}]`.
function parse_bds(code, [indx,tags], err) {
  var parser = parse_mny(parse_arg(parse_bnd));
  return chain(parser(code, next(code, [indx,tags]), err), ([indx,tags], bnds) => {
    // [(bool,[(string,term)])] -> [(bool,string,term)]
    var flat_bnds = [];
    for (var i = 0; i < bnds.length; ++i) {
      for (var j = 0; j < bnds[i][1].length; ++j) {
        flat_bnds.push({
          eras: bnds[i][0],
          name: bnds[i][1][j][0],
          term: bnds[i][1][j][1]
        });
      }
    }
    return [[indx,tags], flat_bnds];
  });
};

// Parses a sequence of `<term, term...> (term, term...) ...`.
// Returns a list of erasure/term: `[(bool, term)]`.
function parse_ars(code, [indx,tags], err) {
  var parser = parse_mny(parse_arg(parse_trm));
  return chain(parser(code, next(code, [indx,tags]), err), ([indx,tags], args) => {
    // [(bool,[term])] -> [(bool, term)]
    var flat_args = [];
    for (var i = 0; i < args.length; ++i) {
      for (var j = 0; j < args[i][1].length; ++j) {
        flat_args.push({
          eras: args[i][0], 
          term: args[i][1][j]
        });
      }
    }
    return [[indx,tags], flat_args];
  });
};

function parse_ctr(code, [indx,tags], err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "|", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    chain(parse_bds(code, next(code, [indx,tags]), err), ([indx,tags], fils) =>
    chain(parse_opt(code, next(code, [indx,tags]), "~", err), ([indx,tags], skip) =>
    chain(parse_ars(code, next(code, [indx,tags]), err), ([indx,tags], inds) =>
    chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
    [[indx,tags], {name, fils, inds}]
    )))))));
};

function parse_adt(code, [indx,tags], err) {
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "T ", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    chain(parse_bds(code, next(code, [indx,tags]), err), ([indx,tags], pars) =>
    chain(parse_opt(code, next(code, [indx,tags]), "~", err), ([indx,tags], hasi) => 
    chain(parse_bds(code, next(code, [indx,tags]), err), ([indx,tags], inds) =>
    chain(parse_mny(parse_ctr)(code, next(code, [indx,tags]), err), ([indx,tags], ctrs) => {
    return [[indx,tags], {name, pars, inds, ctrs}];
    })))))));
};

// Parses a defs
function parse(code, indx = 0, tags_list = Nil()) {
  //var LOG = x => console.log(require("util").inspect(x, {showHidden: false, depth: null}));
  var defs = {};
  function define(name, type, term){
    if (defs[name]){
      throw "Parse error: redefinition of "+name+".";
    } else {
      defs[name] = {
        type: type,
        term: term,
      }
    }
  }
  function parse_defs(code, [indx,tags]) {
    var [indx,tags] = next(code, [indx,tags]);
    if (indx === code.length) {
      return [indx,tags];
    } else {
      // Parses datatype definitions
      var parsed_adt = parse_adt(code, [indx,tags], true);
      if (parsed_adt) {
        var [[indx,tags], adt] = parsed_adt;
        define(adt.name, adt_type_type(adt), adt_type_term(adt));
        for (var c = 0; c < adt.ctrs.length; ++c) {
          define(adt.ctrs[c].name, adt_ctor_type(adt, c), adt_ctor_term(adt, c));
        }
        return parse_defs(code, [indx,tags]);
      // Parses function definitions
      } else {
        return (
          chain(parse_nam(code, next(code, [indx,tags]), false, true, "def"), ([indx,tags], name) =>
          chain(parse_bds(code, next(code, [indx,tags]), false), ([indx,tags], bnds) =>
          chain(parse_txt(code, next(code, [indx,tags]), ":", true), ([indx,tags], skip) =>
          chain(parse_trm(code, next(code, [indx,tags]), true), ([indx,tags], type) =>
          chain(parse_trm(code, next(code, [indx,tags]), true), ([indx,tags], term) => {
            define(name, def_type(bnds, type), def_term(bnds, term));
            return parse_defs(code, [indx,tags]);
          }))))));
      };
    };
  };
  var [indx,tags_list] = parse_defs(code, [indx,tags_list]);
  var tags = [];
  if (tags_list) {
    for (var def in defs) {
      // This is an innofensive hack to improve tags. Since the parser doesn't
      // track bound names and, instead, returns a `Ctx -> Term` which then add
      // the names, we don't have the information of what names are variables and
      // what names are references. To distinguish without complicating the
      // parser, I just mutate the tag of a name inside `parse_var`, but, for the
      // mutation to happen, we must make one recursive pass before returning the
      // term, so we just call `synt_stringify` here. This mutates to tag of
      // variables and references from `["nam",name]` to `["var",name]` or
      // `["ref",name]`, allowing hyperlinking on moonad.org. Since tags aren't
      // essential, this can be just ignored in pure implementations.
      synt_stringify(defs[def].term);
      synt_stringify(defs[def].type);
    }
    while (tags_list.ctor === "Ext") {
      tags.push(tags_list.head);
      tags_list = tags_list.tail;
    }
    tags.reverse();
  }
  return {defs, indx, tags};
};

function parse_and_synth(code) {
  var {defs, indx, tags} = parse(code);
  var core_defs = {};
  for (var def in defs) {
    core_defs[def] = typesynth(def, defs);
  }
  return {defs: core_defs, indx, tags};
}

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
    if (val == 92) {
        return "\\\\"
    } else if (val == 34) {
        return "\\\""
    } else {
      return String.fromCharCode(val);
    }
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

// Stringifies a nat literal
function stringify_nat(term) {
  if (term.ctor === "Ref" && term.name === "Nat.zero") {
    return "0";
  } else if (term.ctor === "App"
    && term.func.ctor === "Ref"
    && term.func.name === "Nat.succ") {
    var pred = stringify_nat(term.argm);
    if (pred) {
      return String(1 + Number(pred));
    }
  } else {
    return null;
  }
};

function match(pattern, term, ret = {}) {
  if (typeof pattern === "string" && pattern[0] === "$") {
    ret[pattern.slice(1)] = term;
    return ret;
  } else if (typeof pattern === "object" && typeof term === "object") {
    for (var key in pattern) {
      if (!match(pattern[key], term[key], ret)) {
        return null;
      }
    }
    return ret;
  } else if (typeof pattern === "string" && typeof term === "string") {
    return pattern === term ? ret : null;
  } else if (typeof pattern === "boolean" && typeof term === "boolean") {
    return pattern === term ? ret : null;
  } else if (typeof pattern === "number" && typeof term === "number") {
    return pattern === term ? ret : null;
  } else {
    return null;
  }
};

function matching(term, patterns) {
  for (var [pattern, then] of patterns) {
    var got = match(pattern, term);
    if (got) {
      return then(got);
    };
  };
  return null;
};

// List.cons<T>(a)(List.cons<T>(b)(List.nil<T>))
function stringify_lst(term, type = null, vals = Nil()) {
  var cons = App(false, App(false, App(true, Ref("List.cons"), "$type"), "$head"), "$tail");
  var nil  = App(true, Ref("List.nil"), "$type");
  return matching(term, [
    [cons, ({type, head, tail}) => {
      return stringify_lst(tail, type, Ext(head, vals));
    }],
    [nil, ({type}) => {
      var strs = [];
      fold(vals, null, (h,t) => strs.push(stringify_trm(h)));
      return "["+strs.join(",")+"]";
    }]
  ]);
};

// Stringifies a term
function stringify_trm(term) {
  var lit;
  if (lit = stringify_chr(term)) {
    return "'"+lit+"'";
  } else if (lit = stringify_str(term)) {
    return "\""+lit+"\"";
  } else if (lit = stringify_lst(term)) {
    return lit;
  } else {
    switch (term.ctor) {
      case "Var":
        return term.indx.split("#")[0];
      case "Ref":
        return term.name;
      case "Typ":
        return "Type";
      case "All":
        var self = term.self;
        var lpar = term.name === "" ? "" : (term.eras ? "<" : "(");
        var name = term.name;
        var colo = term.name === "" ? "" : ": ";
        var bind = stringify_trm(term.bind);
        var rpar = term.name === "" ? "" : (term.eras ? ">" : ")");
        var body = stringify_trm(term.body(Var(self+"#"), Var(name+"#")));
        if (term.bind.ctor === "All" && name === "") {
          return self+lpar+name+colo+"("+bind+")"+rpar+" -> "+body;
        } else {
          return self+lpar+name+colo+bind+rpar+" -> "+body;
        }
      case "Lam":
        var name = term.name;
        var lpar = term.eras ? "<" : "(";
        var body = stringify_trm(term.body(Var(name+"#")));
        var rpar = term.eras ? ">" : ")";
        return lpar+name+rpar+" "+body;
      case "App":
        var args = [];
        while (term.ctor === "App") {
          args.push([term.argm, term.eras]);
          term = term.func;
        }
        args.reverse();
        var text = "";
        for (var [argm, eras] of args) {
          var last = text[text.length - 1];
          if (eras && last === ">" || !eras && last === ")") {
            text = text.slice(0,-1) + ",";
          } else {
            text += eras ? "<" : "(";
          }
          text += stringify_trm(argm);
          text += eras ? ">" : ")";
        }
        var func = stringify_trm(term);
        return (func[0] === "(" ? "("+func+")" : func) + text;
      case "Let":
        var name = term.name;
        var expr = stringify_trm(term.expr);
        var body = stringify_trm(term.body(Var(name+"#")));
        return "let "+name+" = "+expr+"; "+body;
      case "Ann":
        if (term.done) {
          return stringify_trm(term.expr);
        } else {
          var expr = stringify_trm(term.expr);
          var type = stringify_trm(term.type);
          if (expr[0] === "(") {
            return "("+expr+") :: "+type;
          } else {
            return expr+" :: "+type;
          }
        }
      case "Loc":
        var expr = stringify_trm(term.expr);
        return expr;
      case "Hol":
        return "_"+term.name; // +"{"+fold(term.vals,"",(h,t)=>stringify(h)+";"+t)+"}";
      case "Cse":
        return "<parsing_case>";
      case "Wat":
        return "?"+term.name;
      case "Nat":
        return ""+term.natx;
      case "Chr":
        return "'"+term.chrx+"'";
      case "Str":
        return '"'+term.strx+'"';
    }
  }
};

// Stringifies a term
function stringify(term) {
  return stringify_trm(unloc(term));
};

// Stringifies a context
function stringify_ctx(ctx, text = "") {
  switch (ctx.ctor) {
    case "Ext":
      var name = ctx.head.name;
      var type = stringify(ctx.head.type, ctx.tail);
      if (name.length > 0) {
        var text = "- " + name + " : " + type + "\n" + text;
      }
      return stringify_ctx(ctx.tail, text);
    case "Nil":
      return text;
  };
};

// Stringifies all terms of a defs
function stringify_defs(defs) {
  var text = "";
  for (var name in defs) {
    var type = stringify(defs[name].type, Nil());
    var term = stringify(defs[name].term, Nil());
    text += name + " : " + type + "\n  " + term + "\n\n";
  }
  return text;
};

// Errors
// ======

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
  from_line = Math.max(from_line - 4, 1);
  to_line = Math.min(to_line + 3, lines.length - 1);
  err_line = err_line || (lines.length - 2);
  var err = "On line " + err_line + ":\n";
  var err = err + lines.slice(from_line, to_line).join("\n") + "\n";
  return err;
};

function stringify_err(err, code) {
  if (code) {
    code = code[code.length-1] !== "\n" ? code+"\n" : code;
  }
  var index = 0;
  if (!err.ctx) {
    if (typeof err === "string" || __dirname.indexOf("vic/dev") !== -1) {
      return err;
    } else {
      return "Internal error.";
    }
  } else {
    var str = "";
    str += err.msg+"\n";
    if (err.ctx.ctor !== "Nil") {
      str += "With context:\n";
      str += stringify_ctx(err.ctx)
        .replace(/\n*$/g,"")
        .split("\n")
        .map(line => "\x1b[2m"+line+"\x1b[0m")
        .join("\n");
      str += "\n";
    };
    if (err.loc && code) {
      str += highlight_code(code, err.loc.from, err.loc.upto);
    };
  };
  return str;
};

// Generics
// ========

// Datatype and constructor derivers. The example goes from:
//   T Vector <A: Type>                       ~ (len: Nat)
//   | nil                                    ~ (Nat.zero);
//   | ext<len: Nat>(x: A, xs: Vector(A,len)) ~ (Nat.succ(len));
// To:
//   Vector (A: Type, len: Nat) : Type 
//     (A, len)
//     self(P: Nat -> Vector(A, len) -> Type) ->
//     (nil: P(Nat.zero)(Vector.nil<A>)) ->
//     (ext: <len: Nat> -> (x: A, xs: Vector(A,len)) -> P(Nat.succ(len))(Vector.ext<A>(len)(x)(xs))) ->
//     P(len)(self)

function adt_type_type({name, pars, inds, ctrs}) {
  return (function args(p, i, ctx) {
    //console.log("args", p, i, pars.length);
    // {args(0)} = <A> {args(1)}
    // {args(1)} = (len) {args(2)}
    // {args(2)} = self(P : {motive(0)}) -> {ctors(0)}
    if (p < pars.length) {
      return All(false, "", pars[p].name, pars[p].term(ctx), (s,x) => args(p + 1, i, Ext([pars[p].name,x], ctx)));
    } else if (i < inds.length) {
      return All(false, "", inds[i].name, inds[i].term(ctx), (s,x) => args(p, i + 1, Ext([inds[i].name,x], ctx)));
    } else {
      return Typ();
    }
  })(0, 0, Nil());
}

function adt_type_term({name, pars, inds, ctrs}) {
  return (function args(p, i, ctx) {
    //console.log("args", p, i, pars.length);
    // {args(0)} = <A> {args(1)}
    // {args(1)} = (len) {args(2)}
    // {args(2)} = self(P : {motive(0)}) -> {ctors(0)}
    if (p < pars.length) {
      return Lam(false, pars[p].name, x => args(p + 1, i, Ext([pars[p].name,x], ctx)));
    } else if (i < inds.length) {
      return Lam(false, inds[i].name, x => args(p, i + 1, Ext([inds[i].name,x], ctx)));
    } else {
      return All(true, "self_"+name, "P",
        // {motive(0)} = (len: Nat) -> {motive(1)}
        // {motive(1)} = Vector(A, len) -> Type
        (function motive(i, ctx) {
          //console.log("motive", i);
          if (i < inds.length) {
            return All(false, "", inds[i].name,
              inds[i].term(ctx),
              (s,x) => motive(i + 1, Ext([inds[i].name,x], Ext(["",s], ctx))));
          } else {
            var slf = Ref(name);
            for (var P = 0; P < pars.length; ++P) {
              slf = App(false, slf, get_var(ctx, pars[P].name));
            }
            for (var I = 0; I < inds.length; ++I) {
              slf = App(false, slf, get_var(ctx, inds[I].name));
            }
            return All(false, "", "self", slf, (s,x) => Typ());
          }
        })(0, ctx),
        // {ctors(0)} = (nil: {fields(0,0)}) -> {ctors(1)}
        // {ctors(1)} = (ext: {fields(1,0)}) -> {ctors(2)}
        // {ctors(2)} = P(len)(self)
        (s,x) => (function ctors(i, ctx) {
          //console.log("ctors", i);
          if (i < ctrs.length) {
            // {fields(0,0)} = P(Nat.zero)(Vector.nil<A>)
            // {fields(1,0)} = <len: Nat> ->
            // {fields(1,1)} = (x: A) ->
            // {fields(1,2)} = (xs: Vector(A, len)) ->
            // {fields(1,3)} = P(Nat.succ(len))(Vector.ext<A>(len)(x)(xs))
            return All(false, "", ctrs[i].name, (function fields(j, ctx) {
              //console.log("fields", i, j);
              if (j < ctrs[i].fils.length) {
                var t_eras = ctrs[i].fils[j].eras;
                var t_name = ctrs[i].fils[j].name;
                var t_bind = ctrs[i].fils[j].term(ctx);
                var t_body = (s,x) => fields(j + 1, Ext([t_name,x], Ext(["",s], ctx)));
                return All(t_eras, "", t_name, t_bind, t_body);
              } else {
                var ret = get_var(ctx, "P");
                for (var I = 0; I < inds.length; ++I) {
                  if (I < ctrs[i].inds.length) {
                    ret = App(ctrs[i].inds[I].eras, ret, ctrs[i].inds[I].term(ctx));
                  } else {
                    throw "Insufficient indices for constructor '" + ctrs[i].name + "'.";
                  }
                }
                var slf = Ref(ctrs[i].name);
                for (var P = 0; P < pars.length; ++P) {
                  slf = App(true, slf, get_var(ctx, pars[P].name));
                }
                //for (var I = 0; I < inds.length; ++I) {
                  //slf = App(false, slf, get_var(ctx, inds[I].name));
                //}
                for (var F = 0; F < ctrs[i].fils.length; ++F) {
                  slf = App(ctrs[i].fils[F].eras, slf, get_var(ctx, ctrs[i].fils[F].name));
                }
                ret = App(false, ret, slf);
                return ret;
              }
            })(0, ctx),
            (s,x) => ctors(i + 1, Ext([ctrs[i].name, s], Ext(["", x], ctx))));
          } else {
            var ret = get_var(ctx, "P");
            for (var I = 0; I < inds.length; ++I) {
              ret = App(false, ret, get_var(ctx, inds[I].name));
            }
            ret = App(false, ret, get_var(ctx, "self_"+name));
            return ret;
          }
        })(0, Ext(["P",x], Ext(["self_"+name,s], ctx))));
    }
  })(0, 0, Nil());
};

function adt_ctor_type({name, pars, inds, ctrs}, c) {
  return (function arg(p, i, f, ctx) {
    if (p < pars.length) {
      var t_eras = true;
      var t_self = "";
      var t_name = pars[p].name;
      var t_bind = pars[p].term(ctx);
      var t_body = (s,x) => arg(p + 1, i, f, Ext([t_name,x],Ext(["",s],ctx)));
      return All(t_eras, t_self, t_name, t_bind, t_body);
    } else if (f < ctrs[c].fils.length) {
      var t_eras = ctrs[c].fils[f].eras;
      var t_self = "";
      var t_name = ctrs[c].fils[f].name;
      var t_bind = ctrs[c].fils[f].term(ctx);
      var t_body = (s,x) => arg(p, i, f + 1, Ext([t_name,x],Ext(["",s],ctx)));
      return All(t_eras, t_self, t_name, t_bind, t_body);
    } else {
      var type = Ref(name);
      for (var P = 0; P < pars.length; ++P) {
        type = App(false, type, get_var(ctx, pars[P].name));
      }
      for (var I = 0; I < inds.length; ++I) {
        type = App(false, type, ctrs[c].inds[I].term(ctx));
      }
      return type;
    }
  })(0, inds.length, 0, Nil())
};

function adt_ctor_term({name, pars, inds, ctrs}, c) {
  return (function arg(p, i, f, ctx) {
    if (p < pars.length) {
      var t_eras = true;
      var t_name = pars[p].name;
      var t_body = x => arg(p + 1, i, f, Ext([t_name,x],ctx));
      return Lam(t_eras, t_name, t_body);
    } else if (f < ctrs[c].fils.length) {
      var t_eras = ctrs[c].fils[f].eras;
      var t_name = ctrs[c].fils[f].name;
      var t_body = x => arg(p, i, f + 1, Ext([t_name,x], ctx));
      return Lam(t_eras, t_name, t_body);
    } else {
      return Lam(true, "P", x => (function opt(k, ctx) {
        if (k < ctrs.length) {
          var t_eras = false;
          var t_name = ctrs[k].name;
          var t_body = x => opt(k + 1, Ext([t_name,x], ctx));
          return Lam(t_eras, t_name, t_body);
        } else {
          var ret = get_var(ctx, ctrs[c].name);
          for (var F = 0; F < ctrs[c].fils.length; ++F) {
            var t_eras = ctrs[c].fils[F].eras;
            var t_func = ret;
            var t_argm = get_var(ctx, ctrs[c].fils[F].name);
            ret = App(t_eras, t_func, t_argm);
          }
          return ret;
        }
      })(0, Ext(["P",x],ctx)));
    }
  })(0, inds.length, 0, Nil());
};

function def_type(bnds, type) {
  return (function go(i, ctx) {
    if (i < bnds.length) {
      let t_eras = bnds[i].eras;
      let t_self = "";
      let t_name = bnds[i].name;
      let t_type = bnds[i].term(ctx);
      let t_body = (s,x) => go(i+1, Ext([t_name,x],Ext(["",s],ctx)));
      return All(t_eras, t_self, t_name, t_type, t_body);
    } else {
      return type(ctx);
    };
  })(0, Nil());
};

function def_term(bnds, term) {
  return (function go(i, ctx) {
    if (i < bnds.length) {
      let t_eras = bnds[i].eras;
      let t_name = bnds[i].name;
      let t_body = x => go(i+1, Ext([t_name,x],ctx));
      return Lam(t_eras, t_name, t_body);
    } else {
      return term(ctx);
    };
  })(0, Nil());
};

module.exports = {
  is_space,
  is_name,
  choose,
  chain,
  drop_while,
  drop_spaces,
  next,
  parse_arg,
  parse_error,
  parse_txt,
  parse_one,
  parse_opt,
  parse_nam,
  parse_grp,
  parse_all,
  parse_lam,
  parse_let,
  parse_us2,
  parse_us1,
  parse_us0,
  parse_typ,
  parse_var,
  parse_app,
  parse_pip,
  parse_arr,
  parse_ann,
  parse_chr,
  parse_str,
  parse_esc,
  parse_bin,
  parse_dec,
  parse_hex,
  parse_trm,
  parse,
  unloc,
  stringify_chr,
  stringify_str,
  stringify_nat,
  stringify,
  stringify_ctx,
  stringify_defs,
  highlight_code,
  stringify_err,
  parse_and_synth,
};
