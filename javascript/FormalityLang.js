var {
  Var, Ref, Typ, All,
  Lam, App, Let, Ann,
  Loc, Ext, Nil, Hol,
  reduce,
  normalize,
  Err,
  typeinfer,
  typecheck,
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
function parse_may(code, [indx,tags], parser, err) {
  var parsed = parser(code, [indx,tags], err);
  if (parsed) {
    return parsed;
  } else {
    return [[indx,tags], null];
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
function parse_app_list(parser) {
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
  return (
  chain(parse_nam(code, next(code, [indx,tags]), true, false), ([indx,tags], name) =>
  chain(parse_txt(code, next(code, [indx,tags]), ":", false), ([indx,tags], skip) =>
  chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], type) => 
  [[indx,tags], [name, type]]
  ))));
};

// Parses a valid name, non-empty
function parse_nam(code, [indx,tags], allow_empty = false, err = false) {
  var nam = "";
  while (indx < code.length) {
    if (is_name(code[indx])) {
      nam += code[indx++];
    } else {
      break;
    }
  }
  tags = tags&&Ext(Tag("nam",nam),tags);
  if (nam.length > 0 || allow_empty) {
    return [[indx,tags], nam];
  } else {
    parse_error(code, indx, "a name", err);
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, [indx,tags], err = false) {
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
    chain(parse_app_list(parse_bnd)(code, [indx,tags], err), ([indx,tags], [eras,binds]) =>
    chain(parse_txt(code, next(code, [indx,tags]), "->", err), ([indx,tags], skip) =>
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

function parse_lam(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  var p_nam = (c,i,e) => parse_nam(c,next(c,i),true,e)
  return (
    chain(parse_app_list(p_nam)(code, next(code, [indx,tags]), false), ([indx,tags], [eras, binds]) =>
    chain(parse_trm(code, next(code,[indx,tags]), err), ([indx,tags], body) =>
    [[indx,tags], (xs) => {
       var fold = (ctx,i) =>
         (i < binds.length - 1)
         ? Lam(eras, binds[i], (x) => fold(Ext([binds[i],x],ctx),i+1))
         : Lam(eras, binds[i], (x) => body(Ext([binds[i],x],ctx)))
      return Loc(from, [indx,tags], fold(xs,0))
    }])));
};

// Parses a local definition, `let x = val; body`
function parse_let(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_one(code, next(code, [indx,tags]), "def ", "let ", false), ([indx,tags], dups) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), "=", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], expr) =>
    chain(parse_opt(code, [indx,tags], ";", err), ([indx,tags], skip) =>
    chain(parse_trm(code, [indx,tags], err), ([indx,tags], body) =>
    [[indx,tags], xs => {
      var tbody = (x) => body(Ext([name,x],xs));
      return Loc(from, indx, Let(dups, name, expr(xs), tbody));
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

// Parses holes, `?a`
function parse_hol(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  return (
    chain(parse_txt(code, [indx,tags], "?", false), ([indx,tags], skip) =>
    chain(parse_nam(code, next(code, [indx,tags]), false, err), ([indx,tags], name) =>
    [[indx,tags], xs => hole(name, xs)])));
};

// Parses an unnamed hole, `_`
function parse_und(code, [indx,tags], err) {
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
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "case ", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], func) =>
    chain(parse_opt(code, next(code, [indx,tags]), "as ", err), ([indx,tags], namd) =>
    chain(parse_nam(code, next(code, [indx,tags]), true, err), ([indx,tags], name) =>
    chain(parse_txt(code, next(code, [indx,tags]), ":", err), ([indx,tags], skip) => {
      var parsed_moti = parse_trm(code, [indx,tags], false);
      if (parsed_moti) {
        var [[indx,tags], moti] = parsed_moti;
        var [[indx,tags], skip] = parse_txt(code, next(code, [indx,tags]), ";", err);
      } else {
        var nam0 = new_name();
        var moti = (xs) => {
          return hole(nam0, xs);
        };
      }
      return [[indx,tags], xs => {
        return Loc(from, indx, App(true, func(xs), moti(xs)));
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

function parse_don(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  function parse_stt(bind, done) {
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
              var term = bind(xs);
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
              var term = done(xs);
              var term = App(true, term, hole(nam0, xs));
              var term = App(false, term, expr(xs));
              return term;
            }];
          }))),
        () => // expr; body
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], expr) =>
          chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
          chain(parse_stt(code, next(code, [indx,tags]), err), ([indx,tags], body) => {
            var nam0 = new_name();
            var nam1 = new_name();
            return [[indx,tags], xs => {
              var term = bind(xs);
              var term = App(true, term, hole(nam0, xs));
              var term = App(true, term, hole(nam1, xs));
              var term = App(false, term, expr(xs));
              var term = App(false, term, Lam(false, "", (x) => body(Ext(["",x],xs))));
              return term;
            }];
          }))),
      ]);
    };
  };
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "do "), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], bind) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], done) =>
    chain(parse_txt(code, next(code, [indx,tags]), "{", err), ([indx,tags], skip) =>
    chain(parse_stt(bind,done)(code, next(code, [indx,tags]), err), ([indx,tags], term) =>
    chain(parse_txt(code, next(code, [indx,tags]), "}", err), ([indx,tags], skip) =>
    [[indx,tags], xs => Loc(from, [indx,tags], term(xs))])))))));
};

// Parses variables, `<name>`
function parse_var(code, [indx,tags], err = false) {
  var from = next(code, [indx,tags])[0];
  return chain(parse_nam(code, next(code, [indx,tags]), false, false), ([indx,tags], name) => {
    var tag_to_mutate = tags && tags.head; // see comment on parse()
    return [[indx,tags], xs => {
      if (name.length === 0) {
        return parse_error(code, indx, "a variable", err);
      } else {
        if (tags) tag_to_mutate.ctor = "var"; // see comment on parse()
        return Loc(from, indx, get_var(xs, name, () => {
          if (tags) tag_to_mutate.ctor = "ref"; // see comment on parse()
          return Ref(name);
        }));
      }
    }];
  });
};

// Parses a single-line hole application, `<term>()`
function parse_ah0(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "()"), ([indx,tags], eras) => {
      var nam0 = new_name();
      return [[indx,tags], xs => Loc(from, indx, App(false, func(xs), hole(nam0, xs)))]
    }));
};

// Parses a single-line hole application (erased), `<term>()`
function parse_ah1(code, [indx,tags], from, func, err) {
  return (
    chain(parse_txt(code, [indx,tags], "<>"), ([indx,tags], eras) => {
      var nam0 = new_name();
      return [[indx,tags], xs => Loc(from, indx, App(true, func(xs), hole(nam0, xs)))]
    }));
};

// Parses a application `f(x,y,z) ~> f(x)(y)(z)`
function parse_app(code, [indx,tags], from, func, err) {
  return (
    chain(parse_app_list(parse_trm)(code,[indx,tags],err), ([indx,tags], [eras,args]) =>
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
function parse_chr(code, [indx,tags], err) {
  var from = next(code, [indx,tags]);
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "'"), ([indx,tags], skip) =>
    chain([[indx+1,tags&&Ext(Tag("chr",code[indx]),tags)], code[indx]], ([indx,tags], clit) =>
    chain(parse_txt(code, next(code, [indx,tags]), "'"), ([indx,tags], skip) =>
    [[indx,tags], xs => Loc(from, indx, Ann(true, make_chr(clit), Ref("Char")))]
    ))));
};

// Parses a string literal, "foo"
function parse_str(code, [indx,tags], err) {
  var from = next(code, [indx,tags]);
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "\""), ([indx,tags], skip) =>
    chain((function go([indx,tags], slit) {
      if (indx < code.length) {
        if (code[indx] !== "\"") {
          var chr = make_chr(code[indx]);
          var [[indx,tags], slit] = go([indx+1,tags&&Ext(Tag("str",code[indx]),tags)], slit);
          return [[indx,tags], App(false, App(false, Ref("String.cons"), chr), slit)];
        } else {
          return [[indx+1,code[indx]], Ref("String.nil")];
        }
      } else if (err) {
        parse_error(code, indx, "string literal", true);
      } else {
        return null;
      }
    })([indx,tags]), ([indx,tags], slit) =>
    [[indx,tags], xs => Loc(from, indx, Ann(true, slit, Ref("String")))])));
};

// Parses a list literal, `[a, b, c]`
function parse_lst(code, [indx,tags], err) {
  var from = next(code, [indx,tags])[0];
  function parse_els(code, [indx,tags], type) {
    return chain(parse_opt(code, next(code, [indx,tags]), "]", false), ([indx,tags], done) => {
      if (done) {
        return [[indx,tags], xs => App(true, Ref("List.nil"), type(xs))];
      } else {
        return (
          chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], elem) =>
          chain(parse_opt(code, next(code, [indx,tags]), ",", false), ([indx,tags], skip) =>
          chain(parse_els(code, next(code, [indx,tags]), type), ([indx,tags], tail) =>
          [[indx,tags], xs => App(false, App(false, App(true, Ref("List.cons"), type(xs)), elem(xs)), tail(xs))]))));
      }
    });
  };
  return (
    chain(parse_txt(code, next(code, [indx,tags]), "[", false), ([indx,tags], skip) =>
    chain(parse_trm(code, next(code, [indx,tags]), err), ([indx,tags], type) =>
    chain(parse_txt(code, next(code, [indx,tags]), ";", err), ([indx,tags], skip) =>
    chain(parse_els(code, next(code, [indx,tags]), type), ([indx,tags], list) =>
    [[indx,tags], xs => Loc(from, indx, list(xs))])))));
};

// Parses a term
function parse_trm(code, [indx = 0, tags = []], err) {
  var [indx,tags] = next(code, [indx,tags]);
  var from = indx;

  // Parses the base term, trying each variant once
  var base_parse = choose([
    () => parse_all(code, [indx,tags], err),
    () => parse_lam(code, [indx,tags], err),
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
    () => parse_par(code, [indx,tags], err),
    () => parse_typ(code, [indx,tags], err),
    () => parse_chr(code, [indx,tags], err),
    () => parse_str(code, [indx,tags], err),
    () => parse_lst(code, [indx,tags], err),
    () => parse_hol(code, [indx,tags], err),
    () => parse_und(code, [indx,tags], err),
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
        () => parse_ah0(code, [indx,tags], from, term, err),
        () => parse_ah1(code, [indx,tags], from, term, err),
        () => parse_app(code, [indx,tags], from, term, err),
        () => parse_pip(code, [indx,tags], from, term, err),
        () => parse_arr(code, [indx,tags], from, term, err),
        () => parse_ann(code, [indx,tags], from, term, err),
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
  var parser = parse_mny(parse_app_list(parse_bnd));
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
  var parser = parse_mny(parse_app_list(parse_trm));
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
function parse(code, indx = 0, tags = Nil()) {
  //var LOG = x => console.log(require("util").inspect(x, {showHidden: false, depth: null}));
  var defs = {};
  function parse_defs(code, [indx,tags]) {
    var [indx,tags] = next(code, [indx,tags]);
    if (indx === code.length) {
      return [indx,tags];
    } else {
      // Parses datatype definitions
      var parsed_adt = parse_adt(code, [indx,tags], true);
      if (parsed_adt) {
        var [[indx,tags], adt] = parsed_adt;
        defs[adt.name] = {
          type: adt_type_type(adt),
          term: adt_type_term(adt),
        };
        for (var c = 0; c < adt.ctrs.length; ++c) {
          //console.log(stringify(adt_ctor_type(adt, c)));
          //console.log(stringify(adt_ctor_term(adt, c)));
          defs[adt.name+"."+adt.ctrs[c].name] = {
            type: adt_ctor_type(adt, c),
            term: adt_ctor_term(adt, c),
          };
        }
        return parse_defs(code, [indx,tags]);
      // Parses function definitions
      } else {
        return (
          chain(parse_nam(code, next(code, [indx,tags]), false, true), ([indx,tags], name) =>
          chain(parse_bds(code, next(code, [indx,tags]), false), ([indx,tags], bnds) =>
          chain(parse_txt(code, next(code, [indx,tags]), ":", true), ([indx,tags], skip) =>
          chain(parse_trm(code, next(code, [indx,tags]), true), ([indx,tags], type) =>
          chain(parse_trm(code, next(code, [indx,tags]), true), ([indx,tags], term) => {
            defs[name] = {
              type: def_type(bnds, type),
              term: def_term(bnds, term),
            };
            return parse_defs(code, [indx,tags]);
          }))))));
      };
    };
  };
  var [indx,tags] = parse_defs(code, [indx,tags]);
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
  return {defs, indx, tags};
};

// Stringification
// ===============

function unloc(term) {
  switch (term.ctor) {
    case "Var": return term;
    case "Ref": return term;
    case "Typ": return term;
    case "All": return All(term.eras, term.self, term.name, unloc(term.bind), (s, x) => unloc(term.body(s, x)));
    case "Lam": return Lam(term.eras, term.name, x => unloc(term.body(x)));
    case "App": return App(term.eras, unloc(term.func), unloc(term.argm));
    case "Let": return Let(term.dups, term.name, unloc(term.expr), x => unloc(term.body(x)));
    case "Ann": return Ann(term.done, unloc(term.expr), unloc(term.type));
    case "Loc": return unloc(term.expr);
    case "Hol": return term;
  };
};

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
      return "["
        + stringify_trm(type) + ";"
        + (vals.ctor === "Nil" ? "" : " ")
        + fold(vals, b=>"", (h,t) => b => (b ? "" : ", ")
        + stringify_trm(h)+t(0))(1)
        + "]";
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
        var func = stringify_trm(term.func);
        var lpar = term.eras ? "<" : "(";
        var argm = stringify_trm(term.argm);
        var rpar = term.eras ? ">" : ")";
        if (func[0] === "(") {
          return "("+func+")"+lpar+argm+rpar;
        } else {
          return func+lpar+argm+rpar;
        }
      case "Let":
        var dups = term.dups ? "let " : "def ";
        var name = term.name;
        var expr = stringify_trm(term.expr);
        var body = stringify_trm(term.body(Var(name+"#")));
        return dups+name+" = "+expr+"; "+body;
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
        return "?"+term.name; // +"{"+fold(term.vals,"",(h,t)=>stringify(h)+";"+t)+"}";
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
      return ;
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
  var err = err + lines.slice(from_line, to_line).join("\n");
  return err;
};

function stringify_err(err, code) {
  var code = code[code.length-1] !== "\n" ? code+"\n" : code;
  var index = 0;
  if (!err.ctx) {
    if (__dirname.indexOf("vic/dev") !== -1) {
      return err;
    } else {
      return "Undecidable.";
    }
  } else {
    var str = "";
    str += err.msg+"\n";
    if (err.ctx.ctor !== "Nil") {
      str += "With context:\n";
      str += "\x1b[2m"+stringify_ctx(err.ctx)+"\x1b[0m";
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
      return All(true, "self", "P",
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
                var slf = Ref(name+"."+ctrs[i].name);
                for (var P = 0; P < pars.length; ++P) {
                  slf = App(true, slf, get_var(ctx, pars[P].name));
                }
                for (var I = 0; P < inds.length; ++I) {
                  slf = App(false, slf, get_var(ctx, inds[I].name));
                }
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
            ret = App(false, ret, get_var(ctx, "self"));
            return ret;
          }
        })(0, Ext(["P",x], Ext(["self",s], ctx))));
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
  parse_app_list,
  parse_error,
  parse_txt,
  parse_one,
  parse_opt,
  parse_nam,
  parse_par,
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
  make_chr,
  parse_chr,
  parse_str,
  parse_trm,
  parse,
  unloc,
  stringify_chr,
  stringify_str,
  stringify,
  stringify_ctx,
  stringify_defs,
  highlight_code,
  stringify_err,
};
