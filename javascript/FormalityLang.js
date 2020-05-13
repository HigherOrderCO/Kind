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
} = require("./FormalitySynt.js");

// Parsing
// =======

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

// Drops spaces and comments
function next(code, indx) {
  while (true) {
    indx = drop_spaces(code, indx);
    if (code[indx] === "/") {
      indx = drop_while(c => c !== "\n", code, indx);
    } else if (code[indx] === "#") {
      indx = drop_while(c => c !== "#", code, indx + 1) + 1;
    } else {
      break;
    }
  };
  return indx;
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
function parse_txt(code, indx, str, err = false) {
  if (str.length === 0) {
    return [indx, str];
  } else if (indx < code.length && code[indx] === str[0]) {
    return parse_txt(code, indx+1, str.slice(1), err);
  } else {
    return parse_error(code, indx, "'"+str+"'", err);
  };
};

// Parses one of two strings
function parse_one(code, indx, ch0, ch1, err) {
  return choose([
    () => chain(parse_txt(code, indx, ch0, false), (indx,_) => [indx, false]),
    () => chain(parse_txt(code, indx, ch1, err  ), (indx,_) => [indx, true]),
  ]);
};

function parse_mny(code, indx, parser, err = false) {
  var parses = [];
  var parsed = parser(code, indx, err);
  while (parsed) {
    var [indx, parse] = parsed;
    parses.push(parse);
    var parsed = parser(code, indx, err);
  };
  return [indx, parses];
};

// Parses an optional value
function parse_may(code, indx, parser, err) {
  var parsed = parser(code, indx, err);
  if (parsed) {
    return parsed;
  } else {
    return [indx, null];
  }
};

// Parses an optional string
function parse_opt(code, indx, str, err) {
  return choose([
    () => chain(parse_txt(code, indx, str, false), (indx,_) => [indx, true]),
    () => [indx, false],
  ]);
};

// Parses a valid name, non-empty
function parse_nam(code, indx, size = 0, err = false) {
  if (indx < code.length && is_name(code[indx])) {
    var parsed_nam = parse_nam(code, indx + 1, size + 1, err);
    return parsed_nam ? [parsed_nam[0], code[indx] + parsed_nam[1]] : null;
  } else if (size > 0) {
    return [indx, ""];
  } else {
    return parse_error(code, indx, "a name", err);
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, indx, err = false) {
  return (
    chain(parse_txt(code, next(code, indx), "(", false), (indx, skip) =>
    chain(parse_trm(code, indx, err),                    (indx, term) =>
    chain(parse_txt(code, next(code, indx), ")", err),   (indx, skip) =>
    [indx, term]))));
};

// Parses a dependent function type, `(<name> : <term>) -> <term>`
function parse_all(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_nam(code, next(code, indx), 1, false),              (indx, self) =>
    chain(parse_one(code, indx, "(", "<", false),                   (indx, eras) =>
    chain(parse_nam(code, next(code, indx), 1, false),              (indx, name) =>
    chain(parse_txt(code, next(code, indx), ":", false),            (indx, skip) =>
    chain(parse_trm(code, indx, err),                               (indx, bind) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
    chain(parse_txt(code, next(code, indx), "->", err),             (indx, skip) =>
    chain(parse_trm(code, indx, err),                               (indx, body) =>
    [indx, xs => {
      var tbind = bind(xs);
      var tbody = (s,x) => body(Ext([name,x],Ext([self,s],xs)));
      return Loc(from, indx, All(eras, self, name, tbind, tbody));
    }])))))))));
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_one(code, next(code, indx), "(", "<", false),         (indx, eras) =>
    chain(parse_nam(code, next(code, indx), 1, false),                (indx, name) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", false), (indx, skip) =>
    chain(parse_trm(code, indx, err),                                 (indx, body) =>
    [indx, xs => {
      var tbody = (x) => body(Ext([name,x],xs));
      return Loc(from, indx, Lam(eras, name, tbody));
    }])))));
};

// Parses a local definition, `let x = val; body`
function parse_let(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_one(code, next(code, indx), "let ", "dup ", false), (indx, dups) =>
    chain(parse_nam(code, next(code, indx), 0, err),                (indx, name) =>
    chain(parse_txt(code, next(code, indx), "=", err),              (indx, skip) =>
    chain(parse_trm(code, indx, err),                               (indx, expr) =>
    chain(parse_opt(code, indx, ";", err),                          (indx, skip) =>
    chain(parse_trm(code, indx, err),(indx, body) =>
    [indx, xs => {
      var tbody = (x) => body(Ext([name,x],xs));
      return Loc(from, indx, Let(dups, name, expr(xs), tbody));
    }])))))));
};

// Parses a monadic application of 2 args, `use a b = x; y` ~> `x((a) (b) y)`
function parse_us2(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "use "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam0) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam1) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) =>
    [indx, xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, nam0, (x) =>
        Lam(false, nam1, (y) =>
        body(Ext([nam1,y], Ext([nam0,x], xs)))))));
    }])))))));
};

// Parses a monadic application of 1 arg, `use a = x; y` ~> `x((a) y)`
function parse_us1(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "use "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, name) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) =>
    [indx, xs => {
      return Loc(from, indx,
        App(false, func(xs),
        Lam(false, name, (x) =>
        body(Ext([name,x],xs)))));
    }]))))));
};

// Parses a monadic application of 0 args, `use x; y` ~> `x(y)`
function parse_us0(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "use "), (indx, skip) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, argm) =>
    [indx, xs => {
      return Loc(from, indx, App(false, func(xs), argm(xs)));
    }])))));
};

// Parses a projection, `get a = x; y` ~> `x<() _>((a) y)`
function parse_gt1(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "get "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, name) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) => {
      var nam0 = new_name();
      return [indx, xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(nam0, xs)),
          Lam(false, name, (x) =>
          body(Ext([name,x],xs)))));
      }]
    }))))));
};

// Parses a projection of 2 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt2(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "get "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam0) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam1) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) => {
      var hol0 = new_name();
      return [indx, xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(hol0, xs)),
          Lam(false, nam0, (x) =>
          Lam(false, nam1, (y) =>
          body(Ext([nam1,y], Ext([nam0,x], xs)))))));
      }];
    })))))));
};

// Parses a projection of 3 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt3(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "get "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam0) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam1) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam2) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) => {
      var hol0 = new_name();
      return [indx, xs => {
        return Loc(from, indx,
          App(false, App(true, func(xs), hole(hol0, xs)),
          Lam(false, nam0, (x) =>
          Lam(false, nam1, (y) =>
          Lam(false, nam2, (z) =>
          body(Ext([nam2,z], Ext([nam1,y], Ext([nam0,x], xs)))))))));
      }];
    }))))))));
};

// Parses a projection of 3 elements, `get = x; y` ~> `x<() _>(y)`
function parse_gt4(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "get "), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam0) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam1) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam2) =>
    chain(parse_nam(code, next(code, indx), 0),      (indx, nam3) =>
    chain(parse_txt(code, next(code, indx), "="),    (indx, skip) =>
    chain(parse_trm(code, indx, err),                (indx, func) =>
    chain(parse_trm(code, indx, err),                (indx, body) => {
      var hol0 = new_name();
      return [indx, xs => {
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
function parse_typ(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "Type", false), (indx, skip) =>
    [indx, xs => Loc(from, indx, Typ())]));
};

// Parses holes, `?a`
function parse_hol(code, indx, err) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, indx, "?", false),         (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0, err), (indx, name) =>
    [indx, xs => hole(name, xs)])));
};

// Parses an unnamed hole, `_`
function parse_und(code, indx, err) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, indx, "_", false), (indx, skip) => {
      var nam0 = new_name();
      return [indx, xs => hole(nam0, xs)];
    }));
};

// Parses an case expression, `case x as t : m;` ~> `x<(t) m>`
function parse_cse(code, indx, err) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "case ", false), (indx, skip) =>
    chain(parse_trm(code, next(code, indx), err),            (indx, func) =>
    chain(parse_opt(code, next(code, indx), "as ", err),     (indx, namd) =>
    chain(parse_nam(code, next(code, indx), 1, err),         (indx, name) =>
    chain(parse_txt(code, next(code, indx), ":", err),       (indx, skip) => {
      var parsed_moti = parse_trm(code, indx, false);
      if (parsed_moti) {
        var [indx, moti] = parsed_moti;
        var [indx, skip] = parse_txt(code, next(code, indx), ";", err);
      } else {
        var moti = null;
      }
      var nam0 = new_name();
      return [indx, xs => {
        var fn = func(xs);
        if (name === "" && (fn.ctor === "Var" || fn.ctor === "Ref") && fn.name) {
          name = fn.name;
        }
        if (moti) {
          var tbody = (x) => moti(Ext([name,x],xs));
        } else {
          var tbody = (x) => hole(nam0, Ext([name,x],xs));
        }
        return Loc(from, indx, App(true, func(xs), Lam(false, name, tbody)));
      }];
    }))))));
};

// Parses variables, `<name>`
function parse_var(code, indx, err = false) {
  var from = next(code, indx);
  return chain(parse_nam(code, next(code, indx), 0, false), (indx, name) => {
    return [indx, xs => {
      if (name.length === 0) {
        return parse_error(code, indx, "a variable", err);
      } else {
        var got = find(xs, (x,i) => x[0] === name);
        return Loc(from, indx, got ? got.value[1] : Ref(name));
      }
    }];
  });
};

// Parses a single-line application, `<term>(<term>)`
function parse_app(code, indx, from, func, err) {
  return (
    chain(parse_one(code, indx, "(", "<", false),                   (indx, eras) =>
    chain(parse_trm(code, indx, err),                               (indx, argm) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
    [indx, xs => Loc(from, indx, App(eras, func(xs), argm(xs)))]))));
};

// Parses a single-line hole application, `<term>()`
function parse_ah0(code, indx, from, func, err) {
  return (
    chain(parse_txt(code, indx, "()"), (indx, eras) => {
      var nam0 = new_name();
      return [indx, xs => Loc(from, indx, App(false, func(xs), hole(nam0, xs)))]
    }));
};

// Parses a single-line hole application (erased), `<term>()`
function parse_ah1(code, indx, from, func, err) {
  return (
    chain(parse_txt(code, indx, "<>"), (indx, eras) => {
      var nam0 = new_name();
      return [indx, xs => Loc(from, indx, App(true, func(xs), hole(nam0, xs)))]
    }));
};

// Parses a multi-line application, `<term> | <term>;`
function parse_pip(code, indx, from, func, err) {
  return (
    chain(parse_txt(code, next(code, indx), "|", false), (indx, skip) =>
    chain(parse_trm(code, indx, err),                    (indx, argm) =>
    chain(parse_txt(code, next(code, indx), ";", err),   (indx, skip) =>
    [indx, xs => Loc(from, indx, App(false, func(xs), argm(xs)))]))));
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, indx, from, bind, err) {
  return (
    chain(parse_txt(code, next(code, indx), "->", false), (indx, skip) =>
    chain(parse_trm(code, indx, err),                     (indx, body) =>
    [indx, xs => {
      var tbind = bind(xs);
      var tbody = (s,x) => body(Ext(["",x],Ext(["",s],xs)));
      return Loc(from, indx, All(false, "", "", tbind, tbody));
    }])));
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, from, expr, err) {
  return (
    chain(parse_txt(code, next(code, indx), "::", false), (indx, skip) =>
    chain(parse_trm(code, indx, err),                     (indx, type) =>
    [indx, xs => Loc(from, indx, Ann(false, expr(xs), type(xs)))])));
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
function parse_chr(code, indx, err) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "'"), (indx, skip) =>
    chain([indx+1, code[indx]],                   (indx, clit) =>
    chain(parse_txt(code, next(code, indx), "'"), (indx, skip) =>
    [indx, xs => Loc(from, indx, Ann(true, make_chr(clit), Ref("Char")))]
    ))));
};

// Parses a string literal, "foo"
function parse_str(code, indx, err) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "\""), (indx, skip) =>
    chain((function go(indx, slit) {
      if (indx < code.length) {
        if (code[indx] !== "\"") {
          var chr = make_chr(code[indx]);
          var [indx, slit] = go(indx + 1, slit);
          return [indx, App(false, App(false, Ref("String.cons"), chr), slit)];
        } else {
          return [indx+1, Ref("String.nil")];
        }
      } else if (err) {
        parse_error(code, indx, "string literal", true);
      } else {
        return null;
      }
    })(indx), (indx, slit) =>
    [indx, xs => Loc(from, indx, Ann(true, slit, Ref("String")))])));
};

// Parses a list literal, `[a, b, c]`
function parse_lst(code, indx, err) {
  var from = next(code, indx);
  function parse_els(code, indx, type) {
    return chain(parse_opt(code, next(code, indx), "]", false), (indx, done) => {
      if (done) {
        return [indx, xs => App(true, Ref("List.nil"), type(xs))];
      } else {
        return (
          chain(parse_trm(code, next(code, indx), err),        (indx, elem) =>
          chain(parse_opt(code, next(code, indx), ",", false), (indx, skip) =>
          chain(parse_els(code, next(code, indx), type),       (indx, tail) =>
          [indx, xs => App(false, App(false, App(true, Ref("List.cons"), type(xs)), elem(xs)), tail(xs))]))));
      }
    });
  };
  return (
    chain(parse_txt(code, next(code, indx), "[", false), (indx, skip) =>
    chain(parse_trm(code, next(code, indx), err),        (indx, type) =>
    chain(parse_txt(code, next(code, indx), ";", err),   (indx, skip) =>
    chain(parse_els(code, next(code, indx), type),       (indx, list) =>
    [indx, xs => Loc(from, indx, list(xs))])))));
};

//function parse_adr() {
  //var adt_pram = [];
  //var adt_indx = [];
  //var adt_ctor = [];
  //var adt_name = parse_string();
  //var adt_nams = [adt_name];
  //var adt_typs = [null];
  //return (
    //chain(parse_txt(code, next(code, indx), "T ", false), (indx, skip) => {
      //// Datatype parameters
      //if (match("<")) {
        //while (idx < code.length) {
          //let eras = false;
          //let name = parse_string();
          //let type: Term;
          //if (match(":")) {
            //type = await parse_term(adt_pram.map((([name,type]) => name)));
          //} else {
            //type = Typ();
          //}
          //adt_pram.push([name, type, eras]);
          //if (match(">")) break;
          //else parse_exact(",");
        //}
      //}

      //// Datatype indices
      //var adt_nams = adt_nams.concat(adt_pram.map(([name,type]) => name));
      //var adt_typs = adt_typs.concat(adt_pram.map(([name,type]) => type));
      //if (match("(")) {
        //while (idx < code.length) {
          ////var eras = match("~");
          //let eras = false;
          //let name = parse_string();
          //let type: Term
          //if (match(":")) {
            //type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
          //} else {
            //type = Typ();
          //}
          //adt_indx.push([name, type, eras]);
          //if (match(")")) break; else parse_exact(",");
        //}
      //}

      //// Datatype constructors
      //while (match("|")) {
        //// Constructor name
        //var ctor_name = parse_string();
        //// Constructor fields
        //var ctor_flds = [];
        //var ctor_type: Term;
        //if (match("(")) {
          //while (idx < code.length) {
            //let name = parse_string();
            //let type: Term;
            //let eras: boolean
            //if (match(":")) {
              //type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
            //} else {
              //type = Hol(new_hole_name());
            //}
            //eras = match(";");
            //match(",");
            //ctor_flds.push([name, type, eras]);
            //if (match(")")) break;
          //}
        //}
        //// Constructor type (written)
        //if (match(":")) {
          //ctor_type = parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
        //// Constructor type (auto-filled)
        //} else {
          //var ctor_indx = [];
          ////if (match("(")) {
            ////while (idx < code.length) {
              ////ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
              ////if (match(")")) break; else parse_exact(",");
            ////}
          ////}
          //ctor_type = Var(-1 + ctor_flds.length + adt_pram.length + 1);
          //for (var p = 0; p < adt_pram.length; ++p) {
            //ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length - p), false);
          //}
          //for (var i = 0; i < ctor_indx.length; ++i) {
            //ctor_type = App(ctor_type, ctor_indx[i], false);
          //}
        //}
        //adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
      //}
      //var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
      //define(file+"/"+adt_name, derive_adt_type(file, adt));
      //for (var c = 0; c < adt_ctor.length; ++c) {
        //define(file+"/"+adt_ctor[c][0], derive_adt_ctor(file, adt, c));
      //}
      //adts[file+"/"+adt_name] = adt;

      //return true;
    //}

// Parses a term
function parse_trm(code, indx = 0, err) {
  var indx = next(code, indx);
  var from = indx;

  // Parses the base term, trying each variant once
  var base_parse = choose([
    () => parse_all(code, indx, err),
    () => parse_lam(code, indx, err),
    () => parse_let(code, indx, err),
    () => parse_us2(code, indx, err),
    () => parse_us1(code, indx, err),
    () => parse_us0(code, indx, err),
    () => parse_gt1(code, indx, err),
    () => parse_gt2(code, indx, err),
    () => parse_gt3(code, indx, err),
    () => parse_gt4(code, indx, err),
    () => parse_par(code, indx, err),
    () => parse_typ(code, indx, err),
    () => parse_chr(code, indx, err),
    () => parse_str(code, indx, err),
    () => parse_lst(code, indx, err),
    () => parse_hol(code, indx, err),
    () => parse_und(code, indx, err),
    () => parse_cse(code, indx, err),
    () => parse_var(code, indx, err),
  ], err);

  if (!base_parse && err) {
    parse_error(code, indx, "a term", err);
  } else if (!base_parse) {
    return null;
  } else {
    // Parses postfix extensions, trying each variant repeatedly
    var post_parse = base_parse;
    while (true) {
      var [indx, term] = post_parse;
      post_parse = choose([
        () => parse_ah0(code, indx, from, term, err),
        () => parse_ah1(code, indx, from, term, err),
        () => parse_app(code, indx, from, term, err),
        () => parse_pip(code, indx, from, term, err),
        () => parse_arr(code, indx, from, term, err),
        () => parse_ann(code, indx, from, term, err),
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

//function parse_bnd(code, indx, err) {
  //return (
    //chain(parse_nam(code, next(code, indx), 1, false),   (indx, name) =>
    //chain(parse_txt(code, next(code, indx), ":", false), (indx, skip) =>
    //chain(parse_trm(code, next(code, indx), err),        (indx, type) => 
    //chain(parse_opt(code, next(code, indx), ",", err),   (indx, skip) => {
    //return [indx, [name, type]];
    //})))));
//};

//function parse_arg(code, indx, err) {
  //return (
    //chain(parse_txt(code, next(code, indx), "(", false),     (indx, skip) =>
    //chain(parse_mny(code, next(code, indx), parse_bnd, err), (indx, bnds) =>
    //chain(parse_txt(code, next(code, indx), ")", err),       (indx, skip) => {
    //return [indx, null];
    //}))));
//};

// Parses a defs
function parse(code, indx = 0) {
  var defs = {};
  function parse_defs(code, indx) {
    var indx = next(code, indx);
    if (indx === code.length) {
      return;
    } else {
      chain(parse_nam(code, next(code, indx), 0, true),           (indx, name) =>
      //chain(parse_may(code, next(code, indx), parse_arg, true),   (indx, args) =>
      chain(parse_txt(code, next(code, indx), ":", true),         (indx, skip) =>
      chain(parse_trm(code, next(code, indx), true),              (indx, type) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//loop//"), (indx, loop) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//prim//"), (indx, prim) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//data//"), (indx, data) =>
      chain(parse_trm(code, next(code, indx), true),              (indx, term) => {
        //if (args) {
          //console.log("...", name, args);
          //process.exit();
        //}
        defs[name] = {type: type(Nil()), term: term(Nil()), meta: {loop,prim,data}};
        parse_defs(code, indx);
      })))))));
    };
  }
  parse_defs(code, indx);
  return defs;
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
        return self+lpar+name+colo+bind+rpar+" -> "+body;
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
        var dups = term.dups ? "dup " : "let ";
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
      var text = "- " + name + " : " + type + "\n" + text;
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

module.exports = {
  is_space,
  is_name,
  choose,
  chain,
  drop_while,
  drop_spaces,
  next,
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
