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

// Evaluation
// ==========

function reduce(term, defs) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      if (defs[term.name]) {
        var got = defs[term.name].term;
        if (got.ctor === "Loc" && got.expr.ctor === "Ref" && got.expr.name === term.name) {
          // Avoids reducing black-holes (stack overflow) to improve some errors
          return got;
        } else {
          return reduce(got, defs);
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
      if (term.eras) {
        return reduce(term.body(Lam(false, "", x => x)), defs);
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


// Type-Checking
// =============

function Err(loc, ctx, msg) {
  return {
    loc: loc,
    ctx: ctx,
    msg: msg,
  };
};

function typeinfer(term, defs, show = null, ctx = Nil(), locs = null) {
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
      var func_typ = reduce(typeinfer(term.func, defs, show, ctx), defs);
      switch (func_typ.ctor) {
        case "All":
          var self_var = Ann(true, term.func, func_typ);
          var name_var = Ann(true, term.argm, func_typ.bind);
          typecheck(term.argm, func_typ.bind, defs, show, ctx);
          var term_typ = func_typ.body(self_var, name_var);
          if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
            throw Err(locs, ctx, "Mismatched erasure.");
          };
          return term_typ;
        default:
          throw Err(locs, ctx, "Non-function application.");
      };
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, show, ctx);
      var expr_var = Ann(true, term.expr, expr_typ);
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
      if (term.done) {
        return term.type;
      } else {
        return typecheck(term.expr, term.type, defs, show, ctx);
      }
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      return typeinfer(term.expr, defs, show, ctx, locs);
  }
  throw Err(locs, ctx, "Can't infer type.");
};

function typecheck(term, type, defs, show = null, ctx = Nil(), locs = null) {
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
        typecheck(term.body(name_var), body_typ, defs, show, body_ctx);
      } else {
        throw Err(locs, ctx, "Lambda has a non-function type.");
      }
      break;
    case "Let":
      var expr_typ = typeinfer(term.expr, defs, show, ctx);
      var expr_var = Ann(true, term.expr, expr_typ);
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
        var type0_str = show(normalize(type, {}), ctx);
        var infr0_str = show(normalize(infr, {}), ctx);
        throw Err(locs, ctx,
          "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type0_str+"\x1b[0m");
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
  reduce,
  normalize,
  Err,
  typeinfer,
  typecheck,
  equal,
};
