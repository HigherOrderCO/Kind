// This is a temporary file that exists because we need some way to run
// Formality-Core programs. It compiles terms to either JavaScript or Haskell.
// It isn't a very elegant code and will be replaced by compilers written in
// Formality itself eventually. Without this file, running Formality-Core on the
// short term would be too slow and bootstrapping would be hard.

var fmc = require("./FormalityCore.js");

module.exports = {
  
  // JavaScript compiler
  js: function(file, main) {
    function make_name(str) {
      return "$" + str.replace(/\./g,"$");
    };

    var prim_types = {
      Unit: {
        inst: "x=>x(1)",
        elim: "x=>v=>v",
      },
      Bool: {
        inst: "x=>x(true)(false)",
        elim: "x=>t=>f=>x?t:f",
      },
      Nat: {
        inst: "x=>x(0n)(p=>1n+p)",
        elim: "x=>z=>s=>x===0n?z:s(x-1n)",
      },
      U16: {
        inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===16?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
      },
      U32: {
        inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
        elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===32?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
      },
      String: {
        inst: "x=>x('')(h=>t=>String.fromCharCode(h)+t)",
        elim: "x=>n=>c=>x===''?n:c(x.charCodeAt(0))(x.slice(1))",
      },
    };

    var prim_funcs = {
      "Nat.add"     : "a=>b=>a+b",
      "Nat.sub"     : "a=>b=>(a-b>=0n?a-b : 0n)",
      "Nat.mul"     : "a=>b=>a*b",
      "Nat.div"     : "a=>b=>a/b",
      "Nat.div_mod" : "a=>b=>t=>t(a/b)(a%b)",
      "Nat.ltn"     : "a=>b=>a<b",
      "Nat.lte"     : "a=>b=>a<=b",
      "Nat.eql"     : "a=>b=>a===b",
      "Nat.gte"     : "a=>b=>a>=b",
      "Nat.gtn"     : "a=>b=>a>b",
      "U32.add"     : "a=>b=>a+b",
      "U32.sub"     : "a=>b=>a-b",
      "U32.mul"     : "a=>b=>a*b",
      "U32.ltn"     : "a=>b=>a<b",
      "U32.lte"     : "a=>b=>a<=b",
      "U32.eql"     : "a=>b=>a===b",
      "U32.gte"     : "a=>b=>a>b",
      "U32.gtn"     : "a=>b=>a>=b",
      "U16.add"     : "a=>b=>a+b",
      "U16.sub"     : "a=>b=>a-b",
      "U16.mul"     : "a=>b=>a*b",
      "U16.ltn"     : "a=>b=>a<b",
      "U16.lte"     : "a=>b=>a<=b",
      "U16.eql"     : "a=>b=>a===b",
      "U16.gte"     : "a=>b=>a>b",
      "U16.gtn"     : "a=>b=>a>=b",
      "Bool.not"    : "a=>!a",
      "Bool.and"    : "a=>b=>a&&b",
      "Bool.or"     : "a=>b=>a||b",
      "String.eql"  : "a=>b=>a===b",
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
      go(file[main].term);
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
            var body_met = {...met, vars: met.vars && (term.eras ? met.vars : met.vars.concat(term.name))};
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
        delete prim_funcs[prim];
      }
    };

    var isio = fmc.equal(file[main].type, fmc.App(false, fmc.Ref("IO"), fmc.Ref("Unit")), file);
    var defs = sorted_def_names(file).concat(main);
    var code = "";
    code += "module.exports = (function (){\n";
    for (var prim in prim_types) {
      code += "  var inst_"+prim.toLowerCase()+" = "+prim_types[prim].inst + ";\n";
      code += "  var elim_"+prim.toLowerCase()+" = "+prim_types[prim].elim + ";\n";
    };
    if (isio) {
      code += "  var rdl = require('readline').createInterface({input:process.stdin,output:process.stdout});\n";
      code += "  var run = (p) => {\n";
      code += "    var case_end = (val) => Promise.resolve(val);\n";
      code += "    var case_log = (str) => (nxt) => new Promise((res,_) => (console.log(str), run(nxt(1)).then(res)));\n";
      code += "    var case_inp = (nxt) => new Promise((res,_) => rdl.question('', (line) => run(nxt(line)).then(res)));\n";
      code += "    return p(case_end)(case_log)(case_inp);\n";
      code += "  };\n";
    }
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
      code += "  var "+make_name(name)+" = "+expr+";\n";
      exps.push(name);
    };
    code += "  return {\n";
    if (isio) {
      code += "    '$main$': ()=>run("+make_name(main)+"),\n"
    };
    for (var name of exps) {
      code += "    '"+name+"': "+make_name(name)+",\n";
    };
    code += "  };\n";
    code += "})();";
    if (isio) {
      code += "\nmodule.exports['$main$']().then(() => process.exit());";
    };
    return code;
  },

  // Haskell compiler
  hs: function(file, main) {
    function make_name(str) {
      return "_" + str.replace(/\./g,"_");
    };

    var prim_types = {
      Unit: {
        inst: "(\\x->())",
        elim: "(\\x->(\\t->t))",
      },
      Bool: {
        inst: "(\\x->((x$True)$False))",
        elim: "(\\x->(\\t->(\\f->(if x then t else f))))",
      },
      Nat: {
        inst: "\\x->(((x$0)$(\\p->1+p)) :: Integer)",
        elim: "(\\x->(\\z->(\\s->(if x == 0 then z else s$(x-1)))))",
      },
      U32: {
        inst: "\\x->(x$(\\w->let r x k = (((x$0)$(\\p->r p (k*2)))$(\\p->k+(r p (k*2)))) in r w 1)) :: Word32",
        elim: "(\\x->(\\u->(u$(let r i = unsafeCoerce (\\we->(\\w0->(\\w1->(if i == 32 then we else ((case ((shiftR x i) .&. 1) :: Word32 of { 0 -> w0; 1 -> w1 })$(r (i + 1))))))) in (r 0)))))",
      },
      U16: {
        inst: "\\x->(x$(\\w->let r x k = (((x$0)$(\\p->r p (k*2)))$(\\p->k+(r p (k*2)))) in r w 1)) :: Word16",
        elim: "(\\x->(\\u->(u$(let r i = unsafeCoerce (\\we->(\\w0->(\\w1->(if i == 16 then we else ((case ((shiftR x i) .&. 1) :: Word16 of { 0 -> w0; 1 -> w1 })$(r (i + 1))))))) in (r 0)))))",
      },
      String: {
        inst: "(\\x->((x$[])$(\\h->(\\t->(fromEnum (h :: Word16)):t))) :: String)",
        elim: "(\\x->(\\n->(\\c->(case x of { [] -> n; (h : t) -> c ((toEnum h) :: Char) t}))))",
      },
    };

    var prim_funcs = {
      "Nat.add"     : "(\\a->(\\b->((a+b)::Integer)))",
      "Nat.sub"     : "(\\a->(\\b->((max (a-b) 0)::Integer)))",
      "Nat.mul"     : "(\\a->(\\b->((a*b)::Integer)))",
      "Nat.div"     : "(\\a->(\\b->((a `div` b)::Integer)))",
      "Nat.mod"     : "(\\a->(\\b->((a `mod` b)::Integer)))",
      "Nat.div_mod" : "(\\a->(\\b->(\\t->((t$((a `div` b) :: Integer))$((a `mod` b) ::Integer)))))",
      "Nat.ltn"     : "(\\a->(\\b->((a<b)::Integer)))",
      "Nat.lte"     : "(\\a->(\\b->((a<=b)::Integer)))",
      "Nat.eql"     : "(\\a->(\\b->((a==b)::Integer)))",
      "Nat.gte"     : "(\\a->(\\b->((a>=b)::Integer)))",
      "Nat.gtn"     : "(\\a->(\\b->((a>b)::Integer)))",
      "U32.add"     : "(\\a->(\\b->(a+b)::Word32))",
      "U32.sub"     : "(\\a->(\\b->(a-b)::Word32))",
      "U32.mul"     : "(\\a->(\\b->(a*b)::Word32))",
      "U32.ltn"     : "(\\a->(\\b->(a<b)::Word32))",
      "U32.lte"     : "(\\a->(\\b->(a<=b)::Word32))",
      "U32.eql"     : "(\\a->(\\b->(a==b)::Word32))",
      "U32.gte"     : "(\\a->(\\b->(a>b)::Word32))",
      "U32.gtn"     : "(\\a->(\\b->(a>=b)::Word32))",
      "U16.add"     : "(\\a->(\\b->(a+b)::Word16))",
      "U16.sub"     : "(\\a->(\\b->(a-b)::Word16))",
      "U16.mul"     : "(\\a->(\\b->(a*b)::Word16))",
      "U16.ltn"     : "(\\a->(\\b->(a<b)::Word16))",
      "U16.lte"     : "(\\a->(\\b->(a<=b)::Word16))",
      "U16.eql"     : "(\\a->(\\b->(a==b)::Word16))",
      "U16.gte"     : "(\\a->(\\b->(a>b)::Word16))",
      "U16.gtn"     : "(\\a->(\\b->(a>=b)::Word16))",
      "Bool.not"    : "(\\a->((not a)::Bool))",
      "Bool.and"    : "(\\a->(\\b->((a&&b)::Bool)))",
      "Bool.or"     : "(\\a->(\\b->((a||b)::Bool)))",
      "String.eql"  : "(\\a->(\\b->((a==b)::String)))",
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
      go(file[main].term);
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
                code = "("+code+"$"+argm_cmp.code+")";
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
            code: "(\\"+make_name(term.name)+"->"+body_cmp.code+")("+expr_cmp.code+")",
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
            code: "()",
            type: fmc.Typ(),
          };
        case "Ann":
          if (term.done) {
            return {
              code: "()",
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
              code = "(\\"+make_name(term.name)+"->"+body_cmp.code+")";
            }
            var type_prim = prim_of(type);
            if (type_prim) {
              code = "(inst_"+type_prim.toLowerCase()+"$"+code+")";
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
          //if (met && met.loop) {
            //var opt_code = "";
            //opt_code += "{";
            //opt_code += "var "+make_name(met.name)+"=";
            //opt_code += met.vars.map(v => make_name(v)+"=>").join("");
            //opt_code += "({ctr:'TCO',arg:["+met.vars.map(make_name).join(",")+"]});";
            //opt_code += "while(true){";
            //opt_code += "var R="+code+";";
            ////tco_code += "console.log(R);";
            //opt_code += "if(R.ctr==='TCO')["+met.vars.map(make_name).join(",")+"]=R.arg;";
            //opt_code += "else return R;";
            //opt_code += "}}";
            //code = opt_code;
          //};
      };
      if (fmc.equal(type, fmc.Typ(), file)) {
        var code = "()";
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
        delete prim_funcs[prim];
      }
    };

    var defs = sorted_def_names(file).concat(main);
    var isio = fmc.equal(file[main].type, fmc.App(false, fmc.Ref("IO"), fmc.Ref("Unit")), file);

    var code = "";
    code += "import Prelude hiding (($))\n";
    code += "import Unsafe.Coerce\n";
    code += "import Data.Word\n";
    code += "import Data.Bits\n";
    code += "($) = (\\a->(\\b->(unsafeCoerce (a b))))\n";
    if (isio) {
      code += "run = (\\p->\n";
      code += "  let case_end = (\\val->val) in\n";
      code += "  let case_log = (\\str->(\\nxt->(putStrLn$str)>>=(\\u->run (nxt$())))) in\n";
      code += "  let case_inp = (\\nxt->(getLine>>=(\\l->run (nxt$l)))) in\n";
      code += "  (((p$case_end)$case_log)$case_inp))\n";
    };
    for (var prim in prim_types) {
      code += "inst_"+prim.toLowerCase()+" = "+prim_types[prim].inst + "\n";
      code += "elim_"+prim.toLowerCase()+" = "+prim_types[prim].elim + "\n";
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
      code += make_name(name)+" = "+expr+"\n";
      exps.push(name);
    };
    if (isio) {
      code += "main :: IO()\n";
      code += "main = run "+make_name(name)+"\n";
    }
    return code;
  }
};
