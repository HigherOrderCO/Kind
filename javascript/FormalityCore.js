// Term
// ====

const Var = (indx)                     => ({ctor:"Var",indx});
const Ref = (name)                     => ({ctor:"Ref",name});
const Typ = ()                         => ({ctor:"Typ"});
const All = (eras,self,name,bind,body) => ({ctor:"All",eras,self,name,bind,body});
const Lam = (eras,name,body)           => ({ctor:"Lam",eras,name,body});
const App = (eras,func,argm)           => ({ctor:"App",eras,func,argm});
const Let = (name,expr,body)           => ({ctor:"Let",name,expr,body});
const Ann = (done,expr,type)           => ({ctor:"Ann",done,expr,type});
const Loc = (from,upto,expr)           => ({ctor:"Loc",from,upto,expr});

// List
// ====

const Nil = ()          => ({ctor:"Nil",size: 0});
const Ext = (head,tail) => ({ctor:"Ext",head,tail,size:tail.size+1});

// Finds first value satisfying `cond` in a list
function find(list, cond, indx = 0) {
  switch (list.ctor) {
    case "Nil":
      return null;
    case "Ext":
      if (cond(list.head, indx)) {
        return {value:list.head, index:indx};
      } else {
        return find(list.tail, cond, indx + 1);
      };
  };
};

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
    chain(parse(code, indx, err),                        (indx, term) =>
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
    chain(parse(code, indx, err),                                   (indx, bind) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
    chain(parse_txt(code, next(code, indx), "->", err),             (indx, skip) =>
    chain(parse(code, indx, err),                                   (indx, body) =>
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
    chain(parse(code, indx, err),                                     (indx, body) =>
    [indx, xs => {
      var tbody = (x) => body(Ext([name,x],xs));
      return Loc(from, indx, Lam(eras, name, tbody));
    }])))));
};

// Parses a local definition, `let x = val; body`
function parse_let(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "let ", false), (indx, skip) =>
    chain(parse_nam(code, next(code, indx), 0, err),        (indx, name) =>
    chain(parse_txt(code, next(code, indx), "=", err),      (indx, skip) =>
    chain(parse(code, indx, err),                           (indx, expr) =>
    chain(parse_opt(code, indx, ";", err),                  (indx, skip) =>
    chain(parse(code, indx, err),    (indx, body) =>
    [indx, xs => {
      var tbody = (x) => body(Ext([name,x],xs));
      return Loc(from, indx, Let(name, expr(xs), tbody));
    }])))))));
};

// Parses the type of types, `Type`
function parse_typ(code, indx, err = false) {
  var from = next(code, indx);
  return (
    chain(parse_txt(code, next(code, indx), "Type", false), (indx, skip) =>
    [indx, xs => Loc(from, indx, Typ())]));
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
    chain(parse(code, indx, err),                                   (indx, argm) =>
    chain(parse_txt(code, next(code, indx), eras ? ">" : ")", err), (indx, skip) =>
    [indx, xs => Loc(from, indx, App(eras, func(xs), argm(xs)))]))));
};

// Parses a multi-line application, `<term> | <term>;`
function parse_pip(code, indx, from, func, err) {
  return (
    chain(parse_txt(code, next(code, indx), "|", false), (indx, skip) =>
    chain(parse(code, indx, err),                        (indx, argm) =>
    chain(parse_txt(code, next(code, indx), ";", err),   (indx, skip) =>
    [indx, xs => Loc(from, indx, App(false, func(xs), argm(xs)))]))));
};

// Parses a non-dependent function type, `<term> -> <term>`
function parse_arr(code, indx, from, bind, err) {
  return (
    chain(parse_txt(code, next(code, indx), "->", false), (indx, skip) =>
    chain(parse(code, indx, err),                         (indx, body) =>
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
    chain(parse(code, indx, err), (indx, type) =>
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

// Parses a term
function parse(code, indx = 0, err) {
  var indx = next(code, indx);
  var from = indx;

  // Parses the base term, trying each variant once
  var base_parse = choose([
    () => parse_all(code, indx, err),
    () => parse_lam(code, indx, err),
    () => parse_let(code, indx, err),
    () => parse_par(code, indx, err),
    () => parse_typ(code, indx, err),
    () => parse_chr(code, indx, err),
    () => parse_str(code, indx, err),
    () => parse_var(code, indx, err),
  ], err);

  if (!base_parse && err) {
    parse_error(code, indx, "a term", err);
  } else {
    // Parses postfix extensions, trying each variant repeatedly
    var post_parse = base_parse;
    while (true) {
      var [indx, term] = post_parse;
      post_parse = choose([
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

// Parses a defs
function parse_defs(code, indx = 0) {
  var defs = {};
  function parse_defs(code, indx) {
    var indx = next(code, indx);
    if (indx === code.length) {
      return;
    } else {
      chain(parse_nam(code, next(code, indx), 0, true),           (indx, name) =>
      chain(parse_txt(code, next(code, indx), ":", true),         (indx, skip) =>
      chain(parse(code, next(code, indx), true),                  (indx, type) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//loop//"), (indx, loop) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//prim//"), (indx, prim) =>
      chain(parse_opt(code, drop_spaces(code, indx), "//data//"), (indx, data) =>
      chain(parse(code, next(code, indx), true),                  (indx, term) => {
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

// Stringifies a term
function stringify(term) {
  var chr_lit = stringify_chr(term);
  var str_lit = stringify_str(term);
  if (chr_lit) {
    return "'"+chr_lit+"'";
  } else if (str_lit) {
    return "\""+str_lit+"\"";
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
        var bind = stringify(term.bind);
        var rpar = term.name === "" ? "" : (term.eras ? ">" : ")");
        var body = stringify(term.body(Var(self+"#"), Var(name+"#")));
        return self+lpar+name+colo+bind+rpar+" -> "+body;
      case "Lam":
        var name = term.name;
        var lpar = term.eras ? "<" : "(";
        var body = stringify(term.body(Var(name+"#")));
        var rpar = term.eras ? ">" : ")";
        return lpar+name+rpar+" "+body;
      case "App":
        var func = stringify(term.func);
        var lpar = term.eras ? "<" : "(";
        var argm = stringify(term.argm);
        var rpar = term.eras ? ">" : ")";
        if (term.func.ctor === "Lam" || term.func.ctor === "All") {
          return "("+func+")"+lpar+argm+rpar;
        } else {
          return func+lpar+argm+rpar;
        }
      case "Let":
        var name = term.name;
        var expr = stringify(term.expr);
        var body = stringify(term.body(Var(name+"#")));
        return "let "+name+" = "+expr+"; "+body;
      case "Ann":
        if (term.done) {
          return stringify(term.expr);
        } else {
          var expr = stringify(term.expr);
          var type = stringify(term.type);
          return expr+" :: "+type;
        }
      case "Loc":
        var expr = stringify(term.expr);
        return expr;
    }
  }
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

// Evaluation
// ==========

function reduce(term, defs) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      if (defs[term.name]) {
        return reduce(defs[term.name].term, defs);
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
      if (term.eras) {
        return reduce(term.body(Ref("<erased>")), defs);
      } else {
        var eras = term.eras;
        var name = term.name;
        var body = term.body;
        return Lam(eras, name, body);
      }
    case "App":
      if (term.eras) {
        return reduce(term.func, defs);
      } else {
        var eras = term.eras;
        var func = reduce(term.func, defs);
        switch (func.ctor) {
          case "Lam":
            return reduce(func.body(term.argm), defs);
          default:
            return App(eras, func, term.argm);
        };
      };
    case "Let":
      var name = term.name;
      var expr = term.expr;
      var body = term.body;
      return reduce(body(expr), defs);
    case "Ann":
      return reduce(term.expr, defs);
    case "Loc":
      return reduce(term.expr, defs);
  };
};

function normalize(term, defs) {
  var norm = reduce(term, defs);
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
      var bind = normalize(norm.bind, defs);
      var body = (s,x) => normalize(norm.body(s,x), defs);
      return All(eras, self, name, bind, body);
    case "Lam":
      var eras = norm.eras;
      var name = norm.name;
      var body = x => normalize(norm.body(x), defs);
      return Lam(eras, name, body);
    case "App":
      var eras = norm.eras;
      var func = normalize(norm.func, defs);
      var argm = normalize(norm.argm, defs);
      return App(eras, func, argm);
    case "Let":
      return normalize(term.body(term.expr));;
    case "Ann":
      return normalize(norm.expr, defs);
    case "Loc":
      return normalize(norm.expr, defs);
  };
};

// Equality
// ========

// Computes the hash of a term. JS strings are hashed, so we just return one.
function hash(term, dep = 0) {
  switch (term.ctor) {
    case "Var":
      var indx = Number(term.indx.split("#")[1]);
      if (indx < 0) {
        return "^"+(dep+indx);
      }
      else{
        return "#"+indx;
      }
    case "Ref":
      return "$" + term.name;
    case "Typ":
      return "Type";
    case "All":
      var bind = hash(term.bind, dep);
      var body = hash(term.body(Var("#"+(-dep-1)), Var("#"+(-dep-2))), dep+2);
      return "∀" + bind + body;
    case "Lam":
      var body = hash(term.body(Var("#"+(-dep-1))), dep+1);
      return "λ" + body;
    case "App":
      var func = hash(term.func, dep);
      var argm = hash(term.argm, dep);
      return "@" + func + argm;
    case "Let":
      var expr = hash(term.expr, dep);
      var body = hash(term.body(Var("#"+(-dep-1))), dep+1);
      return "$" + expr + body;
    case "Ann":
      var expr = hash(term.expr, dep);
      return expr;
    case "Loc":
      var expr = hash(term.expr, dep);
      return expr;
  }
};

// Are two terms equal?
function equal(a, b, defs, dep = 0, eql = {}) {
  let a1 = reduce(a, defs);
  let b1 = reduce(b, defs);
  var ah = hash(a1);
  var bh = hash(b1);
  var id = ah + "==" + bh;
  if (ah === bh || eql[id]) {
    return true;
  } else {
    eql[id] = true;
    switch (a1.ctor + b1.ctor) {
      case "AllAll":
        var a1_body = a1.body(Var("#"+(dep)), Var("#"+(dep+1)));
        var b1_body = b1.body(Var("#"+(dep)), Var("#"+(dep+1)));
        return a1.eras === b1.eras
            && a1.self === b1.self
            && equal(a1.bind, b1.bind, defs, dep+0, eql)
            && equal(a1_body, b1_body, defs, dep+2, eql);
      case "LamLam":
        if (a1.eras !== b1.eras) return [false,a1,b1];
        var a1_body = a1.body(Var("#"+(dep)));
        var b1_body = b1.body(Var("#"+(dep)));
        return a1.eras === b1.eras
            && equal(a1_body, b1_body, defs, dep+1, eql);
      case "AppApp":
        return a1.eras === b1.eras
            && equal(a1.func, b1.func, defs, dep, eql)
            && equal(a1.argm, b1.argm, defs, dep, eql);
      case "LetLet":
        var a1_body = a1.body(Var("#"+(dep)));
        var b1_body = b1.body(Var("#"+(dep)));
        vis.push([a1.expr, b1.expr, dep]);
        vis.push([a1_body, b1_body, dep+1]);
        return equal(a1.expr, b1.expr, defs, dep+0, eql)
            && equal(a1_body, b1_body, defs, dep+1, eql);
      case "AnnAnn":
        return equal(a1.expr, b1.expr, defs, dep, eql);
      case "LocLoc":
        return equal(a1.expr, b1.expr, defs, dep, eql);
      default:
        return false;
    }
  };
}

// Errors
// ======

function Err(loc, ctx, msg) {
  return {
    loc: loc,
    ctx: ctx,
    msg: msg,
  };
};

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
  var str = "";
  str += err.msg+"\n";
  if (err.ctx.ctor !== "Nil") {
    str += "With context:\n";
    str += "\x1b[2m"+stringify_ctx(err.ctx)+"\x1b[0m";
  };
  if (err.loc && code) {
    str += highlight_code(code, err.loc.from, err.loc.upto);
  };
  return str;
};

// Type-Checking
// =============

function typeinfer(term, defs, ctx = Nil(), locs = null) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      var got = defs[term.name];
      if (got) {
        return got.type;
      } else {
        throw Err(locs, ctx, "Undefined reference '" + term.name + "'.");
      }
    case "Typ":
      return Typ();
    case "App":
      var func_typ = reduce(typeinfer(term.func, defs, ctx), defs);
      switch (func_typ.ctor) {
        case "All":
          var self_var = Ann(true, term.func, func_typ);
          var name_var = Ann(true, term.argm, func_typ.bind);
          typecheck(term.argm, func_typ.bind, defs, ctx);
          var term_typ = func_typ.body(self_var, name_var);
          if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
            throw Err(locs, ctx, "Mismatched erasure.");
          };
          return term_typ;
        default:
          throw Err(locs, ctx, "Non-function application.");
      };
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, ctx);
      var expr_var = Ann(true, Var(term.name+"#"+ctx.size), expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      var body_typ = typeinfer(term.body(expr_var), defs, body_ctx);
      return body_typ;
    case "All":
      var self_var = Ann(true, Var(term.self+"#"+ctx.size), term);
      var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), term.bind);
      var body_ctx = Ext({name:term.self,type:self_var.type}, ctx);
      var body_ctx = Ext({name:term.name,type:name_var.type}, body_ctx);
      typecheck(term.bind, Typ(), defs, ctx);
      typecheck(term.body(self_var,name_var), Typ(), defs, body_ctx);
      return Typ();
    case "Ann":
      if (term.done) {
        return term.type;
      } else {
        return typecheck(term.expr, term.type, defs, ctx);
      }
    case "Loc":
      return typeinfer(term.expr, defs, ctx, {from: term.from, upto: term.upto});
  }
  throw Err(locs, ctx, "Can't infer type.");
};

function typecheck(term, type, defs, ctx = Nil(), locs = null) {
  //console.log("-- typecheck ", ctx.size);
  //console.log(stringify(to_low(term), ctx));
  //console.log(stringify(to_low(type), ctx));
  var typv = reduce(type, defs);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = Ann(true, term, type);
        var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), typv.bind);
        var body_typ = typv.body(self_var, name_var);
        if (term.eras !== typv.eras) {
          throw Err(locs, ctx, "Type mismatch.");
        };
        var body_ctx = Ext({name:term.name,type:name_var.type}, ctx);
        typecheck(term.body(name_var), body_typ, defs, body_ctx);
      } else {
        throw Err(locs, ctx, "Lambda has a non-function type.");
      }
      break;
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, ctx);
      var expr_var = Ann(true, term.expr, expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      typecheck(term.body(expr_var), type, defs, body_ctx);
      break;
    case "Loc":
      typecheck(term.expr, type, defs, ctx, {from: term.from, upto: term.upto});
      break;
    default:
      var infr = typeinfer(term, defs, ctx);
      var eq = equal(type, infr, defs, ctx.size);
      if (!eq) {
        var type0_str = stringify(normalize(type, {}), ctx);
        var infr0_str = stringify(normalize(infr, {}), ctx);
        throw Err(locs, ctx,
          "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type0_str+"\x1b[0m\n");
      }
      break;
  };
  return type;
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
  Loc,
  Ext,
  Nil,
  is_space,
  is_name,
  choose,
  chain,
  drop_while,
  drop_spaces,
  next,
  parse_txt,
  parse_chr,
  parse_str,
  parse_nam,
  parse_par,
  parse_all,
  parse_lam,
  parse_typ,
  parse_var,
  parse_app,
  parse_pip,
  parse_ann,
  parse,
  parse_defs,
  stringify_chr,
  stringify_str,
  stringify,
  stringify_defs,
  stringify_ctx,
  find,
  reduce,
  normalize,
  Err,
  stringify_err,
  typeinfer,
  typecheck,
  equal,
};
