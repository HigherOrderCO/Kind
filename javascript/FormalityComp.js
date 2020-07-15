var fmc = require("./FormalitySynt.js");
var fml = require("./FormalityLang.js");

const Var = (name)           => ({ctor:"Var",name});
const Ref = (name)           => ({ctor:"Ref",name});
const Nul = ()               => ({ctor:"Nul"});
const Lam = (name,body)      => ({ctor:"Lam",name,body});
const App = (func,argm)      => ({ctor:"App",func,argm});
const Let = (name,expr,body) => ({ctor:"Let",name,expr,body});
const Eli = (prim,expr)      => ({ctor:"Eli",prim,expr});
const Ins = (prim,expr)      => ({ctor:"Ins",prim,expr});
const Chr = (chrx)           => ({ctor:"Chr",chrx});
const Str = (strx)           => ({ctor:"Str",strx});
const Nat = (natx)           => ({ctor:"Nat",natx});

var is_prim = {
  Unit     : 1,
  Bool     : 1,
  Nat      : 1,
  Bits     : 1,
  U8       : 1,
  U16      : 1,
  U32      : 1,
  U64      : 1,
  U256     : 1,
  F64      : 1,
  String   : 1,
  Buffer32 : 1,
};

function stringify(term) {
  switch (term.ctor) {
    case "Var": return term.name;
    case "Ref": return term.name;
    case "Nul": return "null";
    case "Lam": return "λ"+term.name+"."+stringify(term.body);
    case "App": return "("+stringify(term.func)+" "+stringify(term.argm)+")";
    case "Let": return "$"+term.name+"="+stringify(term.expr)+";"+stringify(term.body);
    case "Eli": return "-"+stringify(term.expr);
    case "Ins": return "+"+stringify(term.expr);
    case "Chr": return "'"+term.chrx+"'";
    case "Str": return '"'+term.strx+'"';
    case "Nat": return term.natx;
    default: return "?";
  };
};

function as_adt(term, defs) {
  var term = fmc.reduce(term, defs);
  if (term.ctor === "All" && term.self.slice(0,5) === "self_") {
    var term = term.body(fmc.Var("self"), fmc.Var("P"));
    var ctrs = [];
    while (term.ctor === "All") {
      var ctr = (function go(term, flds) {
        if (term.ctor === "All") {
          var flds = term.eras ? flds : flds.concat(term.name);
          return go(term.body(fmc.Var(""), fmc.Var(term.name)), flds);
        } else if (term.ctor === "App") {
          var func = term.func;
          while (func.ctor === "App") {
            func = func.func;
          }
          if (func.ctor === "Var" && func.indx === "P") {
            var argm = term.argm;
            while (argm.ctor === "App") {
              argm = argm.func;
            };
            if (argm.ctor === "Ref") {
              return {name: argm.name, flds: flds};
            }
          }
        }
        return null;
      })(term.bind, []);
      if (ctr) {
        ctrs.push(ctr);
        term = term.body(fmc.Var(term.self), fmc.Var(term.name));
      } else {
        return null;
      }
    }
    return ctrs;
  }
  return null;
};

function dependency_sort(defs, main) {
  var seen = {};
  var refs = [];
  function go(term) {
    switch (term.ctor) {
      case "Ref":
        if (!seen[term.name]) {
          seen[term.name] = true;
          go(defs[term.name].term);
          refs.push(term.name);
        }
        break;
      case "Lam":
        go(term.body(fmc.Var(term.name)));
        break;
      case "App":
        go(term.func);
        go(term.argm);
        break;
      case "Let":
        go(term.expr);
        go(term.body(fmc.Var(term.name)));
        break;
      case "Ann":
        go(term.expr);
        break;
      case "Loc":
        go(term.expr);
        break;
      case "Nat":
        break;
      case "Chr":
        break;
      case "Str":
        break;
      default:
        break;
    };
  };
  go(defs[main].term);
  return refs;
};

function prim_of(type, defs) {
  for (var prim in is_prim) {
    if (fmc.equal(type, fmc.Ref(prim), defs)) {
      return prim;
    }
  };
  return null;
};

// Note:
// The name of bound variables get a '$depth$' appended to it. This helps making
// them unique, but also solves some issues where JavaScript shadowing behavior
// differs from Formality. For example:
// `foo = x => y => { var x = x * x; return x; }`
// Here, calling `foo(2)(2)` would return `NaN`, not `4`, because the outer
// value of `x` isn't accessible inside the function's body due to the
// declaration of `x` using a `var` statement.

function infer(term, defs, ctx = fmc.Nil()) {
  switch (term.ctor) {
    case "Var":
      return {
        comp: Var(term.indx.replace("#","$")),
        type: fmc.Var(term.indx),
      };
    case "Ref":
      var got_def = defs[term.name];
      return {
        comp: Ref(term.name),
        type: got_def.type,
      };
    case "Typ":
      return {
        comp: Nul(),
        type: fmc.Typ(),
      };
    case "App":
      var func_cmp = infer(term.func, defs, ctx);
      var func_typ = fmc.reduce(func_cmp.type, defs);
      switch (func_typ.ctor) {
        case "All":
          var self_var = fmc.Ann(true, term.func, func_typ);
          var name_var = fmc.Ann(true, term.argm, func_typ.bind);
          var argm_cmp = check(term.argm, func_typ.bind, defs, ctx);
          var term_typ = func_typ.body(self_var, name_var);
          var comp = func_cmp.comp;
          var func_typ_adt = as_adt(func_typ, defs);
          var func_typ_prim = prim_of(func_typ, defs);
          if (func_typ_prim) {
            comp = Eli(func_typ_prim, comp);
          } else if (func_typ_adt) {
            comp = Eli(func_typ_adt, comp);
          };
          if (!term.eras) {
            comp = App(comp, argm_cmp.comp);
          }
          return {comp, type: term_typ};
        default:
          throw "Non-function application.";
      };
    case "Let":
      var expr_cmp = infer(term.expr, defs, ctx);
      var expr_var = fmc.Ann(true, fmc.Var(term.name+"#"+(ctx.size+1)), expr_cmp.type);
      var body_ctx = fmc.Ext({name:term.name,type:expr_var.type}, ctx);
      var body_cmp = infer(term.body(expr_var), defs, body_ctx);
      return {
        comp: Let(term.name+"$"+(ctx.size+1), expr_cmp.comp, body_cmp.comp),
        type: body_cmp.type,
      };
    case "All":
      return {
        comp: Nul(),
        type: fmc.Typ(),
      };
    case "Ann":
      return check(term.expr, term.type, defs, ctx);
    case "Loc":
      return infer(term.expr, defs, ctx);
    case "Nat":
      return {
        comp: Nat(term.natx),
        type: fmc.Ref("Nat"),
      };
    case "Chr":
      return {
        comp: Chr(term.chrx),
        type: fmc.Ref("Char"),
      };
    case "Str":
      return {
        comp: Str(term.strx),
        type: fmc.Ref("String"),
      };
  }
};

function check(term, type, defs, ctx = fmc.Nil()) {
  var typv = fmc.reduce(type, defs);

  if (typv.ctor === "Typ") {
    var comp = Nul();
    var type = fmc.Typ();
    return {comp, type};
  };

  var comp = null;
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = fmc.Ann(true, term, type);
        var name_var = fmc.Ann(true, fmc.Var(term.name+"#"+(ctx.size+1)), typv.bind);
        var body_typ = typv.body(self_var, name_var);
        var body_ctx = fmc.Ext({name:term.name,type:name_var.type}, ctx);
        var body_cmp = check(term.body(name_var), body_typ, defs, body_ctx);
        if (term.eras) {
          comp = body_cmp.comp;
        } else {
          comp = Lam(term.name+"$"+(ctx.size+1), body_cmp.comp);
        }
        var type_adt = as_adt(type, defs);
        var type_prim = prim_of(type, defs);
        if (type_prim) {
          comp = Ins(type_prim, comp);
        } else if (type_adt) {
          comp = Ins(type_adt, comp);
        }
      } else {
        throw "Lambda has non-function type.";
      }
      return {comp, type};
    case "Let":
      var expr_cmp = infer(term.expr, defs, ctx);
      var expr_var = fmc.Ann(true, fmc.Var(term.name+"#"+(ctx.size+1)), expr_cmp.type);
      var body_ctx = fmc.Ext({name:term.name,type:expr_var.type}, ctx);
      var body_cmp = check(term.body(expr_var), type, defs, body_ctx);
      return {
        comp: Let(term.name+"$"+(ctx.size+1), expr_cmp.comp, body_cmp.comp),
        type: body_cmp.type,
      };
    case "Loc":
      return check(term.expr, type, defs);
    default:
      var term_cmp = infer(term, defs, ctx);
      var comp = term_cmp.comp;
      return {comp, type};
  };
};

function core_to_comp(defs, main) {
  var comp_nams = dependency_sort(defs, main).concat([main]);
  var comp_defs = {};
  for (var name of comp_nams) {
    //TODO: caution, using fml.unloc on fmc term; consider adding fmc.unloc
    comp_defs[name] = check(fml.unloc(defs[name].term), fml.unloc(defs[name].type), defs).comp;
  };
  return {
    defs: comp_defs,
    nams: comp_nams,
  };
};

module.exports = {
  Var, Ref, Nul, Lam,
  App, Let, Eli, Ins,
  Chr, Str, Nat,
  stringify,
  is_prim,
  dependency_sort,
  check,
  infer,
  core_to_comp,
};
