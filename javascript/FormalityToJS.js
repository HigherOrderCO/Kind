const fmc = require("./FormalityCore.js");
const fml = require("./FormalityLang.js");
const cmp = require("./FormalityComp.js");

var prim_types = {
  Unit: {
    inst: [[0, "1"]],
    elim: {ctag: x => x, ctor: [[]]},
  },
  Bool: {
    inst: [[0, "true"], [0, "false"]],
    elim: {ctag: x => x+"?0:1", ctor: [[], []]},
  },
  Nat: {
    inst: [[0, "0n"], [1, p => "1n+"+p]],
    elim: {ctag: x => x+"===0n?0:1", ctor: [[], [x => "("+x+"-1n)"]]},
  },
  Bits: {
    inst: [[0, "''"], [1, p=>p+"+'0'"], [1, p=>p+"+'1'"]],
    elim: {
      ctag: x => x+".length===0?0:"+x+"["+x+".length-1]==='0'?1:2",
      ctor: [[], [x => x+".slice(0,-1)"], [x => x+".slice(0,-1)"]],
    },
  },
  U16: {
    inst: [[1, x => "Lam_to_U16("+x+")"]],
    elim: {
      ctag: x => "0",
      ctor: [[x => "U16_to_Lam("+x+")"]],
    }
  },
  U32: {
    inst: [[1, x => "Lam_to_U32("+x+")"]],
    elim: {
      ctag: x => "0",
      ctor: [[x => "U32_to_Lam("+x+")"]],
    }
  },
  U64: {
    inst: [[1, x => "Lam_to_U64("+x+")"]],
    elim: {
      ctag: x => "0",
      ctor: [[x => "U64_to_Lam("+x+")"]],
    }
  },
  F64: {
    inst: [[1, x => "Lam_to_F64("+x+")"]],
    elim: {
      ctag: x => "0",
      ctor: [[x => "F64_to_Lam("+x+")"]],
    },
  },
  String: {
    inst: [[0,"''"], [2, h => t => "(String.fromCharCode("+h+")+"+t+")"]],
    elim: {
      ctag: x => x+".length===0?0:1",
      ctor: [[], [x => x+".charCodeAt(0)", x => x+".slice(1)"]],
    },
  },
};

function adt_type(adt) {
  var inst = [];
  var elim = {
    ctag: x => x+".c",
    ctor: [],
  };
  for (let i = 0; i < adt.length; ++i) {
    inst.push([adt[i].flds.length, (function go(j, ctx) {
      if (j < adt[i].flds.length) {
        return x => go(j + 1, ctx.concat([x]));
      } else {
        var res = "({c:"+i;
        for (var k = 0; k < j; ++k) {
          res += ",x"+k+":"+ctx[k];
        };
        res += "})";
        return res;
      };
    })(0, [])]);
    elim.ctor.push(adt[i].flds.map((n,j) => (x => x+".x"+j)));
  };
  return {inst, elim};
};

var prim_funcs = {
  "Bool.not"    : [1, a=>`!${a}`],
  "Bool.and"    : [2, a=>b=>`${a}&&${b}`],
  "Bool.if"     : [3, a=>b=>c=>`${a}?${b}:${c}`],
  "Bool.or"     : [2, a=>b=>`${a}||${b}`],
  "Debug.log"   : [2, a=>b=>`(console.log(${a}),${b}())`],
  "Nat.add"     : [2, a=>b=>`${a}+${b}`],
  "Nat.sub"     : [2, a=>b=>`${a}-${b}<=0n?0n:${a}-${b}`],
  "Nat.mul"     : [2, a=>b=>`${a}*${b}`],
  "Nat.div"     : [2, a=>b=>`${a}/${b}`],
  "Nat.div_mod" : [2, a=>b=>`({c:0,x0:${a}/${b},x1:${a}%${b}})`], // TODO change to proper pair
  "Nat.pow"     : [2, a=>b=>`${a}**${b}`],
  "Nat.ltn"     : [2, a=>b=>`${a}<${b}`],
  "Nat.lte"     : [2, a=>b=>`${a}<=${b}`],
  "Nat.eql"     : [2, a=>b=>`${a}===${b}`],
  "Nat.gte"     : [2, a=>b=>`${a}>=${b}`],
  "Nat.gtn"     : [2, a=>b=>`${a}>${b}`],
  "U16.add"     : [2, a=>b=>`${a}+${b}`],
  "U16.sub"     : [2, a=>b=>`Math.max(${a}-${b},0)`],
  "U16.mul"     : [2, a=>b=>`${a}*${b}`],
  "U16.div"     : [2, a=>b=>`(${a}/${b})>>>0`],
  "U16.mod"     : [2, a=>b=>`${a}%${b}`],
  "U16.pow"     : [2, a=>b=>`(${a}**${b})&0xFFFF`],
  "U16.ltn"     : [2, a=>b=>`${a}<${b}`],
  "U16.lte"     : [2, a=>b=>`${a}<=${b}`],
  "U16.eql"     : [2, a=>b=>`${a}===${b}`],
  "U16.gte"     : [2, a=>b=>`${a}>=${b}`],
  "U16.gtn"     : [2, a=>b=>`${a}>${b}`],
  "U16.shr"     : [2, a=>b=>`${a}>>>${b}`],
  "U16.shl"     : [2, a=>b=>`${a}<<${b}`],
  "U16.and"     : [2, a=>b=>`${a}&${b}`],
  "U16.or"      : [2, a=>b=>`${a}|${b}`],
  "U16.xor"     : [2, a=>b=>`${a}^${b}`],
  "U32.add"     : [2, a=>b=>`${a}+${b}`],
  "U32.sub"     : [2, a=>b=>`Math.max(${a}-${b},0)`],
  "U32.mul"     : [2, a=>b=>`${a}*${b}`],
  "U32.div"     : [2, a=>b=>`(${a}/${b})>>>0`],
  "U32.mod"     : [2, a=>b=>`${a}%${b}`],
  "U32.pow"     : [2, a=>b=>`(${a}**${b})>>>0`],
  "U32.ltn"     : [2, a=>b=>`${a}<${b}`],
  "U32.lte"     : [2, a=>b=>`${a}<=${b}`],
  "U32.eql"     : [2, a=>b=>`${a}===${b}`],
  "U32.gte"     : [2, a=>b=>`${a}>=${b}`],
  "U32.gtn"     : [2, a=>b=>`${a}>${b}`],
  "U32.shr"     : [2, a=>b=>`${a}>>>${b}`],
  "U32.shl"     : [2, a=>b=>`${a}<<${b}`],
  "U32.and"     : [2, a=>b=>`${a}&${b}`],
  "U32.or"      : [2, a=>b=>`${a}|${b}`],
  "U32.xor"     : [2, a=>b=>`${a}^${b}`],
  "U64.add"     : [2, a=>b=>`(${a}+${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.sub"     : [2, a=>b=>`${a}-${b}<=0n?0n:a-b`],
  "U64.mul"     : [2, a=>b=>`(${a}*${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.div"     : [2, a=>b=>`${a}/${b}`],
  "U64.mod"     : [2, a=>b=>`${a}%${b}`],
  "U64.pow"     : [2, a=>b=>`(${a}**${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.ltn"     : [2, a=>b=>`(${a}<${b})`],
  "U64.lte"     : [2, a=>b=>`(${a}<=${b})`],
  "U64.eql"     : [2, a=>b=>`(${a}===${b})`],
  "U64.gte"     : [2, a=>b=>`(${a}>=${b})`],
  "U64.gtn"     : [2, a=>b=>`(${a}>${b})`],
  "U64.shr"     : [2, a=>b=>`(${a}>>${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.shl"     : [2, a=>b=>`(${a}<<${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.and"     : [2, a=>b=>`${a}&${b}`],
  "U64.or"      : [2, a=>b=>`${a}|${b}`],
  "U64.xor"     : [2, a=>b=>`${a}^${b}`],
  "F64.add"     : [2, a=>b=>`${a}+${b}`],
  "F64.sub"     : [2, a=>b=>`${a}-${b}`],
  "F64.mul"     : [2, a=>b=>`${a}*${b}`],
  "F64.div"     : [2, a=>b=>`${a}/${b}`],
  "F64.mod"     : [2, a=>b=>`${a}%${b}`],
  "F64.pow"     : [2, a=>b=>`${a}**${b}`],
  "F64.log"     : [1, a=>`Math.log(${a})`],
  "F64.cos"     : [1, a=>`Math.cos(${a})`],
  "F64.sin"     : [1, a=>`Math.sin(${a})`],
  "F64.tan"     : [1, a=>`Math.tan(${a})`],
  "F64.acos"    : [1, a=>`Math.acos(${a})`],
  "F64.asin"    : [1, a=>`Math.asin(${a})`],
  "F64.atan"    : [1, a=>`Math.atan(${a})`],
  "String.eql"  : [2, a=>b=>`${a}===${b}`],
};

var count = 0;
function fresh() {
  return ""+(count++);
};

// Simple substitution, assumes `name` is globally unique.
function subst(term, name, val) {
  switch (term.ctor) {
    case "Var": return term.name === name ? val : term;
    case "Lam": return cmp.Lam(term.name, term.name === name ? term.body : subst(term.body, name, val));
    case "App": return cmp.App(subst(term.func, name, val), subst(term.argm, name, val));
    case "Let": return cmp.Let(term.name, subst(term.expr, name, val), term.name === name ? term.body : subst(term.body, name, val));
    case "Eli": return cmp.Eli(term.prim, subst(term.expr, name, val));
    case "Ins": return cmp.Ins(term.prim, subst(term.expr, name, val));
    default: return term;
  }
};
  
// From `(a => b => ... body)(x, y, ...) => body[x <- a][y <- b]...
function apply_inline(term, args) {
  if (term.ctor === "Lam" && args.length > 0) {
    return apply_inline(subst(term.body, term.name, args[0]), args.slice(1));
  } else if (args.length > 0) {
    return apply_inline(cmp.App(term, args[args.length - 1]), args.slice(0, -1));
  } else {
    return term;
  }
};

// Builds a lambda by filling a template with args.
function build_from_template(arity, template, args) {
  var res = "";
  for (var i = args.length; i < arity; ++i) {
    res += ("a"+i)+"=>";
  };
  var bod = template;
  for (var i = 0; i < Math.min(args.length, arity); ++i) {
    bod = bod(js_code(args[i]));
  };
  for (var i = args.length; i < arity; ++i) {
    bod = bod("a"+i);
  };
  bod = "("+bod+")";
  for (var i = arity; i < args.length; ++i) {
    bod = bod+"("+js_code(args[i])+")";
  };
  return res + bod;
};

function application(func, allow_empty = false) {
  var args = [];
  while (func && func.ctor === "App") {
    args.push(func.argm);
    func = func.func;
  };
  args.reverse();

  // Primitive function application
  if (func && (allow_empty || args.length > 0) && func.ctor === "Var" && prim_funcs[func.name]) {
    var [arity, template] = prim_funcs[func.name];
    return build_from_template(arity, template, args);

  // Primitive type elimination
  } else if (func && (allow_empty || args.length > 0) && func.ctor === "Eli") {
    //console.log("ah", func.prim);
    //console.log("....", prim_types[func.prim].elim);
    
    if (typeof func.prim === "string" && prim_types[func.prim]) {
      var {ctag, ctor} = prim_types[func.prim].elim;
    } else if (typeof func.prim === "object") {
      var {ctag, ctor} = adt_type(func.prim).elim;
    } else {
      return null;
    };
    var res = "(()=>";
    for (var i = args.length; i < ctor.length; ++i) {
      res += ("c"+i)+"=>";
    };
    res += "{";
    //for (var i = 0; i < args.length; ++i) {
      //res += "var c"+i+"="+js_code(args[i])+";";
    //};
    res += "var self="+js_code(func.expr)+";";
    res += "switch("+ctag("self")+"){";
    for (var i = 0; i < ctor.length; ++i) {
      res += "case "+i+":";
      //var ret = args[i] || cmp.Var("c"+i);
      var fargs = [];
      for (var j = 0; j < ctor[i].length; ++j) {
        var nam = fresh();
        res += "var $"+nam+"="+ctor[i][j]("self")+";"
        fargs.push(cmp.Var(nam));
        //ret = cmp.App(ret, cmp.Var("f"+j));
      };
      var ret = apply_inline(args[i] || cmp.Var("c"+i), fargs);
      res += "return "+js_code(ret)+";";
    };
    res += "}})()";
    for (var i = ctor.length; i < args.length; ++i) {
      res += "("+js_code(args[i])+")";
    };
    return res;
  }
  //Nat: {
    //inst: [2, [0, "0n"], [1, p => "1n+"+p]],
    ////elim: [2, x => z => s => x+"===0n?"+z+":"+s+"("+x+"-1n)"],
    //elim: {
      //cond: x => x + "=== 0n",
      //ctor: [
        //[],
        //[x => "("+x+"-1n)"],
      //]
    //},
  //},

  return null;
};

function instantiation(term) {
  if (term.ctor === "Ins") {
    if (typeof term.prim === "string" && prim_types[term.prim]) {
      var templates = prim_types[term.prim].inst;
    } else if (typeof term.prim === "object") {
      var templates = adt_type(term.prim).inst;
    } else {
      return null;
    }
    term = term.expr;
    var vars = [];
    while (term.ctor === "Lam") {
      vars.push(term.name);
      term = term.body;
    }
    if (templates.length === vars.length) {
      var func = term;
      var args = [];
      while (func.ctor === "App") { 
        args.push(func.argm);
        func = func.func;
      };
      args.reverse();
      if (func.ctor === "Var") {
        for (var i = 0; i < vars.length; ++i) {
          if (func.name === vars[i]) {
            var [ctor_arity, ctor_template] = templates[i];
            if (ctor_arity === args.length) {
              var res = ctor_template;
              for (var arg of args) {
                res = res(js_code(arg));
              };
              return res;
            };
          }
        };
      };
    };
  };
  return null;
};

function instantiator(inst) {
  var ctors = inst;
  var res = "x=>x";
  for (var i = 0; i < ctors.length; ++i) {
    res += "(";
    var [ctor_arity, ctor_template] = ctors[i];
    for (var j = 0; j < ctor_arity; ++j) {
      res += "x"+j+"=>";
    };
    var bod = ctor_template;
    for (var j = 0; j < ctor_arity; ++j) {
      bod = bod("x"+j);
    };
    res += bod+")";
  };
  return res;
};

//console.log(app(fmc.App(false, , prim_funcs["Bool.and"]));

var NAME = null;
function js_code(term, name = null) {
  if (name) NAME = name;
  var app = application(term);
  var ins = instantiation(term);
  // Application optimization
  if (app) {
    return app;
  // Instantiation optimization
  } else if (ins) {
    return ins;
  // Tail-call optimization
  } else if (name && name.slice(-4) === ".tco") {
    var vars = [];
    var code = "";
    while (term.ctor === "Lam") {
      vars.push(term.name);
      code = code + js_name(term.name)+"=>";
      term = term.body;
    }
    code += "{";
    code += "var "+js_name(name)+"=";
    code += vars.map(v => js_name(v)+"=>").join("");
    code += "({ctr:'TCO',arg:["+vars.map(js_name).join(",")+"]});";
    code += "while(true){";
    code += "var R="+js_code(term)+";";
    code += "if(R.ctr==='TCO')["+vars.map(js_name).join(",")+"]=R.arg;";
    code += "else return R;";
    code += "}}";
    return code;
  } else if (typeof term === "string") {
    return term;
  } else {
    switch (term.ctor) {
      case "Var":
        return js_name(term.name);
      case "Ref":
        return js_name(term.name);
      case "Nul":
        return "null";
      case "Lam":
        return "("+js_name(term.name)+"=>"+js_code(term.body)+")";
      case "App":
        return js_code(term.func)+"("+js_code(term.argm)+")";
      case "Let":
        return "("+js_name(term.name)+"=>"+js_code(term.body)+")("+js_code(term.expr)+")";
      case "Eli":
        if (typeof term.prim === "string") {
          return "elim_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
        } else {
          console.log(term.prim);
          return "<adt_eli>"+js_code(term.expr);
        }
      case "Ins":
        if (typeof term.prim === "string") {
          return "inst_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
        } else {
          return "<adt_ins>"+js_code(term.expr);
        }
      case "Chr":
        return term.chrx.charCodeAt(0);
      case "Str":
        return "`"+term.strx+"`";
    };
  };
};

function js_name(str) {
  return "$" + str.replace(/\./g,"$");
};

function compile(defs, main) {
  //console.log("compiling ", main);
  var {defs: cmps, nams} = cmp.core_to_comp(defs, main);

  var used_prim_types = {}; 
  for (var prim in prim_types) {
    if (defs[prim]) used_prim_types[prim] = prim_types[prim];
  };
  var used_prim_funcs = {};
  for (var prim in prim_funcs) {
    if (defs[prim]) used_prim_funcs[prim] = prim_funcs[prim];
  };

  // Builds header and initial dependencies
  var isio = fmc.equal(defs[main].type, fmc.App(false, fmc.Ref("IO"), fmc.Ref("Unit")), defs);
  var code = "";
  code += "module.exports = (function (){\n";
  if (used_prim_types["U16"]) {
    code += "  var Lam_to_U16 = x=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(x,1);\n";
    code += "  var U16_to_Lam = x=>((function R(i){return we=>w0=>w1=>i===16?we:((x>>>i)&1?w1:w0)(R(i+1))})(0));\n";
  };
  if (used_prim_types["U32"]) {
    code += "  var Lam_to_U32 = x=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(x,1);\n";
    code += "  var U32_to_Lam = x=>((function R(i){return we=>w0=>w1=>i===32?we:((x>>>i)&1?w1:w0)(R(i+1))})(0));\n";
  };
  if (used_prim_types["U64"]) {
    code += "  var Lam_to_U32 = x=>(function R(x,k){return x(0n)(p=>R(p,k*2n))(p=>k+R(p,k*2n))})(x,1n);\n";
    code += "  var U32_to_Lam = x=>((function R(i){return we=>w0=>w1=>i===64n?we:((x>>i)&1n?w1:w0)(R(i+1n))})(0n));\n";
  };
  if (used_prim_types["F64"]) {
    code += "  var F64 = new Float64Array(1);\n";
    code += "  var U32 = new Uint32Array(F64.buffer);\n";
    code += "  var F64_get = (x,i)=>((F64[0]=x),(i<32?(U32[0]>>>i)&1:(U32[1]>>>(i-32)&1)));\n";
    code += "  var F64_set = (x,i)=>((F64[0]=x),(i<32?(U32[0]=U32[0]|(1<<i)):(U32[1]=U32[1]|(1<<(i-32)))),F64[0]);\n";
    code += "  var Lam_to_F64 = x=>(function R(x,i){return x(0)(p=>R(p,i+1))(p=>F64_set(R(p,i+1),i))})(x,0);";
    code += "  var F64_to_Lam = x=>((function R(i){return we=>w0=>w1=>i===64?we:(F64_get(x,i)?w1:w0)(R(i+1))})(0));";
  };
  for (var prim in used_prim_types) {
    code += "  var inst_"+prim.toLowerCase()+" = "+instantiator(used_prim_types[prim].inst)+";\n";
    code += "  var elim_"+prim.toLowerCase()+" = "+js_code(cmp.Lam("x", application(cmp.Eli(prim, cmp.Var("x")), true)))+";\n";
  };
  if (isio) {
    code += "  var rdl = require('readline').createInterface({input:process.stdin,output:process.stdout});\n";
    code += "  var run = (p) => {\n";
    code += "    switch (p.c) {\n";
    code += "      case 0: return Promise.resolve(p.x0);\n";
    code += "      case 1: return new Promise((res,_) => (console.log(p.x0), run(p.x1(1)).then(res)));\n";
    code += "      case 2: return new Promise((res,_) => rdl.question('', (line) => run(p.x0(line)).then(res)));\n";
    code += "    }\n";
    code += "  };\n";
    //code += "    var case_end = (val) => Promise.resolve(val);\n";
    //code += "    var case_log = (str) => (nxt) => new Promise((res,_) => (console.log(str), run(nxt(1)).then(res)));\n";
    //code += "    var case_inp = (nxt) => new Promise((res,_) => rdl.question('', (line) => run(nxt(line)).then(res)));\n";
    //code += "    return p(case_end)(case_log)(case_inp);\n";
    //code += "  };\n";
  }

  // Builds each top-level definition
  var exps = [];
  compile_def: for (var name of nams) {
    // Don't compile primitive types
    if (used_prim_types[name]) {
      continue;
    };

    // Generate JS expression
    var expr = null;
    if (used_prim_funcs[name]) {
      expr = application(cmp.Var(name), true);
    } else {
      try {
        var comp = cmps[name];
        var type = defs[name].type;
        if (fmc.equal(type, fmc.Typ(), defs)) {
          continue;
        } else {
          expr = js_code(comp, name);
        }
      } catch (e) {
        console.log(e);
        expr = "'ERROR'";
      };
    };

    // Adds to code and register export
    code += "  var "+js_name(name)+" = "+expr+";\n";
    exps.push(name);
  };

  // Builds export list
  code += "  return {\n";
  if (isio) {
    code += "    '$main$': ()=>run("+js_name(main)+"),\n"
  };
  for (var name of exps) {
    code += "    '"+name+"': "+js_name(name)+",\n";
  };
  code += "  };\n";
  code += "})();";

  // Builds last line to call exported main
  if (isio) {
    code += "\nmodule.exports['$main$']().then(() => process.exit());";
  } else {
    code += "\nconsole.log(module.exports['"+main+"']);";
  };

  return code;
};

module.exports = {compile};


//function adt_inst(adt) {
  //var res = "(x=>x";
  //for (var {ctor,flds} of adt) {
    //res += "(";
    //for (var fld of flds) {
      //res += fld + "=>";
    //};
    //res += "({ctor:'"+ctor;
    //for (var fld of flds) {
      //res += ","+fld;
    //};
    //res += "}))";
  //};
  //res += ")";
  //return res;
//};

//function adt_elim(adt) {
  //var res = "(x=>{switch(x.ctor){";
  //for (var {ctor,flds} of adt) {
    //res += "case '"+ctor+"':"+
  //};
  //res += "})";
  //return res;
//};

//var $FooBar$bar = ($x=>($y=><adt_ins>($foo=>($bar=>$bar($x)($y)))));
//$x=>$y=>(t=>t(x=>y=>({ctor:"foo",x,y}))(x=>y=>({ctor:"bar",x,y})))
//x=>{switch(x.ctor){

function adt_elim(adt) {
};
