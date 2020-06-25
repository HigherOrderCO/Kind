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

// Syntax
// ======

function stringify(term, depth = 0) {
  switch (term.ctor) {
    case "Var":
      return term.indx.split("#")[0];
    case "Ref":
      return term.name;
    case "Typ":
      return "*";
    case "All":
      var bind = term.eras ? "∀" : "Π";
      var self = term.self || ("x"+(depth+0));
      var name = term.name || ("x"+(depth+1));
      var type = stringify(term.bind, depth);
      var body = stringify(term.body(Var(self+"#"), Var(name+"#")), depth+2);
      return bind + self + "(" + name + ":" + type + ") " + body;
    case "Lam":
      var bind = term.eras ? "Λ" : "λ";
      var name = term.name || ("x"+(depth+0));
      var body = stringify(term.body(Var(name+"#")), depth);
      return bind + name + " " + body;
    case "App":
      var open = term.eras ? "<" : "(";
      var func = stringify(term.func, depth);
      var argm = stringify(term.argm, depth);
      var clos = term.eras ? ">" : ")";
      return open + func + " " + argm + clos;
    case "Let":
      var name = term.name || ("x"+(depth+0));
      var expr = stringify(term.expr, depth);
      var body = stringify(term.body(Var(name+"#")), depth+1);
      return "$" + name + "=" + expr + ";" + body;
    case "Ann":
      var type = stringify(term.type, depth);
      var expr = stringify(term.expr, depth);
      return ":" + type + " " + expr;
    case "Loc":
      return stringify(term.expr, depth);
  };
};

function parse(code, indx, mode = "defs") {
  function is_name(chr) {
    var val = chr.charCodeAt(0);
    return (val >= 46 && val < 47)   // .
        || (val >= 48 && val < 58)   // 0-9
        || (val >= 65 && val < 91)   // A-Z
        || (val >= 95 && val < 96)   // _
        || (val >= 97 && val < 123); // a-z
  };
  function parse_name() {
    if (indx < code.length && is_name(code[indx])) {
      return code[indx++] + parse_name();
    } else {
      return "";
    }
  };
  function parse_nuls() {
    while (code[indx] === " " || code[indx] === "\n") {
      ++indx;
    };
  };
  function parse_char(chr) {
    if (indx >= code.length) {
      throw "Unexpected eof.";
    } else if (code[indx] !== chr) {
      throw 'Expected "'+chr+'", found '+JSON.stringify(code[indx])+' at '+indx+'.';
    }
    ++indx;
  };
  function parse_term() {
    parse_nuls();
    var chr = code[indx++];
    switch (chr) {
      case "*":
        return ctx => Typ();
      case "∀":
      case "Π":
        var eras = chr === "∀";
        var self = parse_name();
        var skip = parse_char("(");
        var name = parse_name();
        var skip = parse_char(":");
        var bind = parse_term();
        var skip = parse_char(")");
        var body = parse_term();
        return ctx => All(eras, self, name, bind(ctx), (s,x) => body(Ext([name,x],Ext([self,s],ctx))));
      case "λ":
      case "Λ":
        var eras = chr === "Λ";
        var name = parse_name();
        var body = parse_term();
        return ctx => Lam(eras, name, (x) => body(Ext([name,x],ctx)));
      case "(":
      case "<":
        var eras = chr === "<";
        var func = parse_term();
        var argm = parse_term();
        var skip = parse_char(eras ? ">" : ")");
        return ctx => App(eras, func(ctx), argm(ctx));
      case "$":
        var name = parse_name();
        var skip = parse_char("=");
        var expr = parse_term();
        var skip = parse_char(";");
        var body = parse_term();
        return ctx => Let(name, expr(ctx), x => body(Ext([name,x],ctx)));
      case ":":
        var type = parse_term();
        var expr = parse_term();
        return ctx => Ann(false, expr(ctx), type(ctx));
      default:
        if (is_name(chr)) {
          var name = chr + parse_name();
          return ctx => {
            var got = find(ctx, (x) => x[0] === name);
            return got ? got.value[1] : Ref(name);
          };
        } else {
          throw "Unexpected symbol: '" + chr + "'.";
        }
    };
  };
  function parse_defs() {
    parse_nuls();
    var name = parse_name();
    if (name.length > 0) {
      var skip = parse_char(":");
      var type = parse_term()(Nil());
      var term = parse_term()(Nil());
      defs[name] = {type, term};
      parse_defs();
    }
  };
  var indx = 0;
  if (mode === "defs") {
    var defs = {};
    parse_defs();
    return {defs};
  } else {
    return parse_term()(Nil());
  }
};

// Evaluation
// ==========

function reduce(term, defs, erased = false) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      if (defs[term.name]) {
        var got = defs[term.name].term;
        if (got.ctor === "Loc" && got.expr.ctor === "Ref" && got.expr.name === term.name) {
          return got;
        } else {
          return reduce(got, defs, erased);
        };
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
      if (erased && term.eras) {
        return reduce(term.body(Lam(false, "", x => x)), defs, erased);
      } else {
        var eras = term.eras;
        var name = term.name;
        var body = term.body;
        return Lam(eras, name, body);
      }
    case "App":
      if (erased && term.eras) {
        return reduce(term.func, defs, erased);
      } else {
        var eras = term.eras;
        var func = reduce(term.func, defs, erased);
        switch (func.ctor) {
          case "Lam":
            return reduce(func.body(term.argm), defs, erased);
          default:
            return App(eras, func, term.argm);
        };
      };
    case "Let":
      var name = term.name;
      var expr = term.expr;
      var body = term.body;
      return reduce(body(expr), defs, erased);
    case "Ann":
      return reduce(term.expr, defs, erased);
    case "Loc":
      return reduce(term.expr, defs, erased);
  };
}

function normalize(term, defs, erased = false, seen = {}) {
  var norm = reduce(term, defs, erased);
  var term_hash = hash(term);
  var norm_hash = hash(norm);
  if (seen[term_hash] || seen[norm_hash]) {
    return term;
  } else {
    var seen = {...seen, [term_hash]: true, [norm_hash]: true};
    var norm = reduce(term, defs, erased);
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
        var bind = normalize(norm.bind, defs, erased, seen);
        var body = (s,x) => normalize(norm.body(s,x), defs, erased, seen);
        return All(eras, self, name, bind, body);
      case "Lam":
        var eras = norm.eras;
        var name = norm.name;
        var body = x => normalize(norm.body(x), defs, erased, seen);
        return Lam(eras, name, body);
      case "App":
        var eras = norm.eras;
        var func = normalize(norm.func, defs, erased, seen);
        var argm = normalize(norm.argm, defs, erased, seen);
        return App(eras, func, argm);
      case "Let":
        return normalize(norm.body(norm.expr), defs, erased, seen);
      case "Ann":
        return normalize(norm.expr, defs, erased, seen);
      case "Loc":
        return normalize(norm.expr, defs, erased, seen);
    };
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
      } else {
        return "#"+indx;
      }
    case "Ref":
      return "$" + term.name;
    case "Typ":
      return "Type";
    case "All":
      var bind = hash(term.bind, dep);
      var body = hash(term.body(Var("#"+(-dep-1)), Var("#"+(-dep-2))), dep+2);
      return "Π" + term.self + bind + body;
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
function equal(a, b, defs, dep = 0, seen = {}) {
  let a1 = reduce(a, defs, true);
  let b1 = reduce(b, defs, true);
  var ah = hash(a1);
  var bh = hash(b1);
  var id = ah + "==" + bh;
  if (ah === bh || seen[id]) {
    return true;
  } else {
    seen[id] = true;
    switch (a1.ctor + b1.ctor) {
      case "AllAll":
        var a1_body = a1.body(Var("#"+(dep)), Var("#"+(dep+1)));
        var b1_body = b1.body(Var("#"+(dep)), Var("#"+(dep+1)));
        return a1.eras === b1.eras
            && a1.self === b1.self
            && equal(a1.bind, b1.bind, defs, dep+0, seen)
            && equal(a1_body, b1_body, defs, dep+2, seen);
      case "LamLam":
        var a1_body = a1.body(Var("#"+(dep)));
        var b1_body = b1.body(Var("#"+(dep)));
        return a1.eras === b1.eras
            && equal(a1_body, b1_body, defs, dep+1, seen);
      case "AppApp":
        return a1.eras === b1.eras
            && equal(a1.func, b1.func, defs, dep, seen)
            && equal(a1.argm, b1.argm, defs, dep, seen);
      case "LetLet":
        var a1_body = a1.body(Var("#"+(dep)));
        var b1_body = b1.body(Var("#"+(dep)));
        return equal(a1.expr, b1.expr, defs, dep+0, seen)
            && equal(a1_body, b1_body, defs, dep+1, seen);
      case "AnnAnn":
        return equal(a1.expr, b1.expr, defs, dep, seen);
      case "LocLoc":
        return equal(a1.expr, b1.expr, defs, dep, seen);
      default:
        return false;
    }
  };
}


// Type-Checking
// =============

function Err(loc, ctx, msg) {
  return {
    loc: loc,
    ctx: ctx,
    msg: msg,
  };
};

function typeinfer(term, defs, show = stringify, ctx = Nil(), locs = null) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      var got = defs[term.name];
      if (got) {
        return got.type;
      } else {
        throw () => Err(locs, ctx, "Undefined reference '" + term.name + "'.");
      }
    case "Typ":
      return Typ();
    case "App":
      var func_typ = reduce(typeinfer(term.func, defs, show, ctx), defs);
      switch (func_typ.ctor) {
        case "All":
          var self_var = Ann(true, term.func, func_typ);
          var name_var = Ann(true, term.argm, func_typ.bind);
          typecheck(term.argm, func_typ.bind, defs, show, ctx);
          var term_typ = func_typ.body(self_var, name_var);
          if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
            throw () => Err(locs, ctx, "Mismatched erasure.");
          };
          return term_typ;
        default:
          throw () => Err(locs, ctx, "Non-function application.");
      };
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, show, ctx);
      var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      var body_typ = typeinfer(term.body(expr_var), defs, show, body_ctx);
      return body_typ;
    case "All":
      var self_var = Ann(true, Var(term.self+"#"+ctx.size), term);
      var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), term.bind);
      var body_ctx = Ext({name:term.self,type:self_var.type}, ctx);
      var body_ctx = Ext({name:term.name,type:name_var.type}, body_ctx);
      typecheck(term.bind, Typ(), defs, show, ctx);
      typecheck(term.body(self_var,name_var), Typ(), defs, show, body_ctx);
      return Typ();
    case "Ann":
      if (!term.done) {
        typecheck(term.expr, term.type, defs, show, ctx);
      }
      return term.type;
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      return typeinfer(term.expr, defs, show, ctx, locs);
  }
  throw () => Err(locs, ctx, "Can't infer type.");
};

function typecheck(term, type, defs, show = stringify, ctx = Nil(), locs = null) {
  var typv = reduce(type, defs);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = Ann(true, term, type);
        var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), typv.bind);
        var body_typ = typv.body(self_var, name_var);
        if (term.eras !== typv.eras) {
          throw () => Err(locs, ctx, "Type mismatch.");
        };
        var body_ctx = Ext({name:term.name,type:name_var.type}, ctx);
        typecheck(term.body(name_var), body_typ, defs, show, body_ctx);
      } else {
        throw () => Err(locs, ctx, "Lambda has a non-function type.");
      }
      break;
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, show, ctx);
      var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      typecheck(term.body(expr_var), type, defs, show, body_ctx);
      break;
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      typecheck(term.expr, type, defs, show, ctx, locs);
      break;
    default:
      var infr = typeinfer(term, defs, show, ctx);
      var eq = equal(type, infr, defs, ctx.size);
      if (!eq) {
        var type0_str = show(normalize(type, {}, true), ctx);
        var infr0_str = show(normalize(infr, {}, true), ctx);
        throw () => Err(locs, ctx,
          "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type0_str+"\x1b[0m");
      }
      break;
  };
  return {term,type};
};

function typesynth(name, defs, show = stringify) {
  var term = defs[name].term;
  var type = defs[name].type;
  defs[name].core = {term, type};
  return typecheck(term, type, defs, show);
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
  find,
  stringify,
  parse,
  reduce,
  normalize,
  Err,
  typeinfer,
  typecheck,
  typesynth,
  equal,
};
