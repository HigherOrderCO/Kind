var fmc = require("./FormalityCore.js");

module.exports = function fmc_to_js(file) {
  function make_name(str) {
    return "$" + str.replace(/\./g,"$");
  };

  var prim_types = {
    Bool: {
      inst: "x=>x(true)(false)",
      elim: "x=>t=>f=>x?t:f",
    },
    Nat: {
      inst: "x=>x(0n)(p=>1n+p)",
      elim: "x=>z=>s=>x===0n?z:s(x-1n)",
    },
    U32: {
      inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
      elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===16?we:((x>>i)&1?w1:w0)(R(i+1))})(0))",
    },
    String: {
      inst: "x=>x('')(h=>t=>String.fromCharCode(h)+t)",
      elim: "x=>n=>c=>x===''?n:c(x.charCodeAt(0))(x.slice(1))",
    },
  };

  var prim_funcs = {
    nat_add    : "a=>b=>a+b",
    nat_sub    : "a=>b=>a-b",
    nat_mul    : "a=>b=>a*b",
    nat_ltn    : "a=>b=>a<b",
    nat_lte    : "a=>b=>a<=b",
    nat_eql    : "a=>b=>a===b",
    nat_gte    : "a=>b=>a>=b",
    nat_gtn    : "a=>b=>a>b",
    bool_not   : "a=>!a",
    bool_and   : "a=>b=>a&&b",
    bool_or    : "a=>b=>a||b",
    string_eql : "a=>b=>a===b",
  };

  function prim_of(type) {
    for (var prim in prim_types) {
      if (fmc.equal(type, fmc.Ref(prim), file)) {
        return prim;
      }
    };
    return null;
  };

  function sorted_def_names(file) {
    var seen = {};
    var refs = [];
    function go(term) {
      switch (term.ctor) {
        case "Ref":
          if (!seen[term.name]) {
            seen[term.name] = true;
            go(file[term.name].term);
            refs.push(term.name);
          }
          break;
        case "Lam":
          go(term.body);
          break;
        case "App":
          go(term.func);
          go(term.argm);
          break;
        case "Let":
          go(term.expr);
          go(term.body);
          break;
        case "Ann":
          go(term.expr);
          break;
      };
    };
    go(file.main.term);
    return refs;
  };

  function infer(term, file, ctx = Nil(), nam = Nil()) {
    //console.log("infer", stringify_term(term, nam));
    //console.log("-----");
    switch (term.ctor) {
      case "Var":
        var got_type = fmc.find(ctx, (x,i) => i === term.indx);
        var got_name = fmc.find(nam, (x,i) => i === term.indx);
        if (got_type) {
          return {
            code: make_name(got_name.value),
            type: fmc.shift(got_type.value, got_type.index + 1, 0),
          };
        } else {
          throw fmc.Err(term.locs, ctx, nam, "Unbound varible.");
        }
      case "Ref":
        var got_def = file[term.name];
        if (got_def) {
          return {
            code: make_name(term.name),
            type: got_def.type,
          };
        } else {
          throw fmc.Err(term.locs, ctx, nam, "Undefined reference '" + term.name + "'.");
        }
      case "Typ":
        return {
          code: "null",
          type: fmc.Typ(),
        };
      case "App":
        var func_cmp = infer(term.func, file, ctx, nam);
        var func_typ = fmc.reduce(func_cmp.type, file);
        switch (func_typ.ctor) {
          case "All":
            var expe_typ = fmc.subst(func_typ.bind, term.func, 0);
            var argm_cmp = check(term.argm, expe_typ, file, {}, ctx, nam);
            var term_typ = func_typ.body;
            var term_typ = fmc.subst(term_typ, fmc.shift(term.func, 1, 0), 1);
            var term_typ = fmc.subst(term_typ, fmc.shift(term.argm, 0, 0), 0);
            if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
              throw fmc.Err(term.locs, ctx, nam, "Mismatched erasure.");
            };
            var code = func_cmp.code;
            var func_typ_prim = prim_of(func_typ);
            if (func_typ_prim) {
              code = "elim_"+func_typ_prim.toLowerCase()+"("+code+")";
            };
            if (!term.eras) {
              code = code+"("+argm_cmp.code+")";
            }
            return {code, type: term_typ};
          default:
            throw fmc.Err(term.locs, ctx, nam, "Non-function application.");
        };
      case "Let":
        var expr_cmp = infer(term.expr, file, ctx, nam);
        var body_ctx = fmc.Ext(expr_cmp.type, ctx);
        var body_nam = fmc.Ext(term.name, nam);
        var body_cmp = infer(term.body, file, body_ctx, body_nam);
        return {
          code: "("+make_name(term.name)+"=>"+body_cmp.code+")("+expr_cmp.code+")",
          type: fmc.subst(body_cmp.type, term.expr, 0),
        };
      case "All":
        var self_typ = fmc.Ann(true, term, fmc.Typ());
        var bind_ctx = fmc.Ext(self_typ, ctx);
        var bind_nam = fmc.Ext(term.self, nam);
        var bind_cmp = check(term.bind, fmc.Typ(), file, {}, bind_ctx, bind_nam);
        var body_ctx = fmc.Ext(term.bind, fmc.Ext(self_typ, ctx));
        var body_nam = fmc.Ext(term.name, fmc.Ext(term.self, nam));
        var body_cmp = check(term.body, fmc.Typ(), file, {}, body_ctx, body_nam);
        return {
          code: "null",
          type: fmc.Typ(),
        };
      case "Ann":
        if (term.done) {
          return {
            code: "null",
            type: term.type,
          };
        } else {
          return check(term.expr, term.type, file, {}, ctx, nam);
        }
    }
    throw fmc.Err(term.locs, ctx, nam, "Can't infer type.");
  };

  function check(term, type, file, met = {}, ctx = fmc.Nil(), nam = fmc.Nil()) {
    //console.log("check", stringify_term(term, nam));
    //console.log("typed", stringify_term(type, nam));
    //console.log("-----");
    var typv = fmc.reduce(type, file);
    var code = null;
    switch (term.ctor) {
      case "Lam":
        if (typv.ctor === "All") {
          var self_typ = fmc.Ann(true, typv, fmc.Typ());
          var bind_typ = fmc.subst(typv.bind, term, 0);
          var body_typ = fmc.subst(typv.body, fmc.shift(term, 1, 0), 1);
          var body_nam = fmc.Ext(term.name, nam);
          var body_ctx = fmc.Ext(bind_typ, ctx);
          if (term.eras !== typv.eras) {
            throw fmc.Err(term.locs, ctx, nam, "Type mismatch.");
          };
          var body_met = {...met, vars: met.vars && met.vars.concat(term.name)};
          var body_cmp = check(term.body, body_typ, file, body_met, body_ctx, body_nam);
          if (term.eras) {
            code = body_cmp.code;
          } else {
            code = "("+make_name(term.name)+"=>"+body_cmp.code+")";
          }
          var type_prim = prim_of(type);
          if (type_prim) {
            code = "inst_"+type_prim.toLowerCase()+"("+code+")";
          };
        } else {
          throw fmc.Err(term.locs, ctx, nam, "Lambda has a non-function type.");
        }
        break;
      default:
        var term_cmp = infer(term, file, ctx, nam);
        if (!fmc.equal(type, term_cmp.type, file)) {
          var type_str = fmc.stringify_term(fmc.normalize(type, {}), nam);
          var tcmp_str = fmc.stringify_term(fmc.normalize(term_cmp.type, {}), nam);
          throw fmc.Err(term.locs, ctx, nam,
            "Found type... \x1b[2m"+tcmp_str+"\x1b[0m\n" +
            "Instead of... \x1b[2m"+type_str+"\x1b[0m");
        }
        var code = term_cmp.code;

        // Tail-call Optimization
        if (met && met.loop) {
          var opt_code = "";
          opt_code += "{";
          opt_code += "var "+make_name(met.name)+"=";
          opt_code += met.vars.map(v => make_name(v)+"=>").join("");
          opt_code += "({ctr:'TCO',arg:["+met.vars.map(make_name).join(",")+"]});";
          opt_code += "while(true){";
          opt_code += "var R="+code+";";
          //tco_code += "console.log(R);";
          opt_code += "if(R.ctr==='TCO')["+met.vars.map(make_name).join(",")+"]=R.arg;";
          opt_code += "else return R;";
          opt_code += "}}";
          code = opt_code;
        };
    };
    if (fmc.equal(type, fmc.Typ(), file)) {
      var code = "(void 0)";
    };
    return {code, type};
  };

  for (var prim in prim_types) {
    if (!file[prim] || !file[prim].meta.prim) {
      delete prim_types[prim];
    }
  };

  for (var prim in prim_funcs) {
    if (!file[prim] || !file[prim].meta.prim) {
      delete prim_types[prim];
    }
  };

  var defs = sorted_def_names(file).concat("main");
  var code = "(function (){\n";
  for (var prim in prim_types) {
    code += "  var inst_"+prim.toLowerCase()+" = "+prim_types[prim].inst + ";\n";
    code += "  var elim_"+prim.toLowerCase()+" = "+prim_types[prim].elim + ";\n";
  };
  var exps = [];
  compile_def: for (var name of defs) {
    var meta = {...file[name].meta, name, vars: []};
    var expr = null;
    // Compiles primitives operations
    for (var prim in prim_types) {
      if (prim === name) {
        continue compile_def;
      }
    };
    for (var prim in prim_funcs) {
      if (prim === name) {
        expr = prim_funcs[prim];
      };
    };
    if (!expr) {
      try {
        var comp = check(file[name].term, file[name].type, file, meta);
        if (fmc.equal(comp.type, fmc.Typ(), file)) {
          continue;
        } else {
          expr = comp.code;
        }
      } catch (e) {
        expr = "'ERROR'";
      };
    };
    code += "  var $"+name+" = "+expr+";\n";
    exps.push(name);
  };
  code += "  return {\n";
  for (var name of exps) {
    code += "    '"+name+"': "+make_name(name)+",\n";
  };
  code += "  };\n";
  code += "})()";
  return code;
};
