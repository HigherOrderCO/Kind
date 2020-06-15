const fmc = require("./FormalitySynt.js");
const fml = require("./FormalityLang.js");
const cmp = require("./FormalityComp.js");

var prim_types = {
  Unit: {
    inst: [[0, "1"]],
    elim: {ctag: x => 'unit', ctor: [[]]},
    cnam: ['unit'],
  },
  Bool: {
    inst: [[0, "true"], [0, "false"]],
    elim: {ctag: x => x+"?'true':'false'", ctor: [[], []]},
    cnam: ['true', 'false'],
  },
  Nat: {
    inst: [[0, "0n"], [1, p => "1n+"+p]],
    elim: {ctag: x => x+"===0n?'zero':'succ'", ctor: [[], [x => "("+x+"-1n)"]]},
    cnam: ['zero', 'succ'],
  },
  Bits: {
    inst: [[0, "''"], [1, p=>p+"+'0'"], [1, p=>p+"+'1'"]],
    elim: {
      ctag: x => x+".length===0?'be':"+x+"["+x+".length-1]==='0'?'b0':'b1'",
      ctor: [[], [x => x+".slice(0,-1)"], [x => x+".slice(0,-1)"]],
    },
    cnam: ['be', 'b0', 'b1'],
  },
  U16: {
    inst: [[1, x => "Lam_to_U16("+x+")"]],
    elim: {
      ctag: x => "'u16'",
      ctor: [[x => "U16_to_Lam("+x+")"]],
    },
    cnam: ['u16'],
  },
  U32: {
    inst: [[1, x => "Lam_to_U32("+x+")"]],
    elim: {
      ctag: x => "'u32'",
      ctor: [[x => "U32_to_Lam("+x+")"]],
    },
    cnam: ['u32'],
  },
  U64: {
    inst: [[1, x => "Lam_to_U64("+x+")"]],
    elim: {
      ctag: x => "'u64'",
      ctor: [[x => "U64_to_Lam("+x+")"]],
    },
    cnam: ['u64'],
  },
  F64: {
    inst: [[1, x => "Lam_to_F64("+x+")"]],
    elim: {
      ctag: x => "'f64'",
      ctor: [[x => "F64_to_Lam("+x+")"]],
    },
    cnam: ['f64'],
  },
  String: {
    inst: [[0,"''"], [2, h => t => "(String.fromCharCode("+h+")+"+t+")"]],
    elim: {
      ctag: x => x+".length===0?'nil':'cons'",
      ctor: [[], [x => x+".charCodeAt(0)", x => x+".slice(1)"]],
    },
    cnam: ['nil', 'cons'],
  },
};

function adt_type(adt) {
  var inst = [];
  var elim = {
    ctag: x => x+"._",
    ctor: [],
  };
  var cnam = [];
  for (let i = 0; i < adt.length; ++i) {
    inst.push([adt[i].flds.length, (function go(j, ctx) {
      if (j < adt[i].flds.length) {
        return x => go(j + 1, ctx.concat([x]));
      } else {
        var res = "({_:'"+adt[i].name+"'";
        for (var k = 0; k < j; ++k) {
          res += ",'"+adt[i].flds[k]+"':"+ctx[k];
        };
        res += "})";
        return res;
      };
    })(0, [])]);
    elim.ctor.push(adt[i].flds.map((n,j) => (x => x+"."+adt[i].flds[j])));
    cnam.push(adt[i].name);
  };
  return {inst, elim, cnam};
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
  "Nat.div_mod" : [2, a=>b=>`({_:'Pair.new','fst':${a}/${b},'snd':${a}%${b}})`], // TODO change to proper pair
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
  return "$"+(count++);
};

// Simple substitution, assumes `name` is globally unique.
function subst(term, name, val) {
  switch (term.ctor) {
    case "Var": return term.name === name ? val : term;
    case "Ref": return cmp.Ref(term.name);
    case "Lam": return cmp.Lam(term.name, term.name === name ? term.body : subst(term.body, name, val));
    case "App": return cmp.App(subst(term.func, name, val), subst(term.argm, name, val));
    case "Let": return cmp.Let(term.name, subst(term.expr, name, val), term.name === name ? term.body : subst(term.body, name, val));
    case "Eli": return cmp.Eli(term.prim, subst(term.expr, name, val));
    case "Ins": return cmp.Ins(term.prim, subst(term.expr, name, val));
    default: return term;
  }
};
  
// Inlines a list of arguments in lambdas, as much as possible. Example:
// apply_inline((x) (y) f, [a, b, c, d, e]) = f[x<-a,y<-b](c)(d)(e)
function apply_inline(term, args) {
  if (term.ctor === "Lam" && args.length > 0) {
    return apply_inline(subst(term.body, term.name, args[0]), args.slice(1));
  } else if (args.length > 0) {
    return apply_inline(cmp.App(term, args[0]), args.slice(1));
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
  if (func && (allow_empty || args.length > 0) && func.ctor === "Ref" && prim_funcs[func.name]) {
    var [arity, template] = prim_funcs[func.name];
    return build_from_template(arity, template, args);

  // Primitive type elimination
  } else if (func && (allow_empty || args.length > 0) && func.ctor === "Eli") {
    if (typeof func.prim === "string" && prim_types[func.prim]) {
      var type_info = prim_types[func.prim];
    } else if (typeof func.prim === "object") {
      var type_info = adt_type(func.prim);
    } else {
      return null;
    };
    var {ctag, ctor} = type_info.elim;
    var cnam = type_info.cnam;
    var res = "(()=>";
    for (var i = args.length; i < ctor.length; ++i) {
      res += ("c"+i)+"=>";
    };
    res += "{";
    res += "var self="+js_code(func.expr)+";";
    res += "switch("+ctag("self")+"){";
    for (var i = 0; i < ctor.length; ++i) {
      res += "case '"+cnam[i]+"':";
      var fargs = [];
      for (var j = 0; j < ctor[i].length; ++j) {
        var nam = fresh();
        res += "var "+nam+"="+ctor[i][j]("self")+";"
        fargs.push(cmp.Var(nam));
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
      if (func.ctor === "Var" || func.ctor === "Ref") {
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

function flatten_lets(term) {
  var res = "(()=>{";
  while (term.ctor === "Let") {
    res += "var "+js_name(term.name)+"="+js_code(term.expr)+";";
    term = term.body;
  };
  res += "return "+js_code(term)+"})()";
  return res;
};

// Checks if a function is recursive and tail-safe.
function recursion(term, name) {
  // Used by tail-call detection. If this application is the elimination of a
  // native type, then its arguments are all in tail position.
  function get_branches(term) {
    var done = false;
    var func = term;
    var args = [];
    while (func.ctor === "App") {
      args.push(func.argm);
      func = func.func;
    };
    args.reverse();
    if (func.ctor === "Eli") {
      //if (DEBUG) console.log("- Possibly branch safe.", name, func.prim);
      if (typeof func.prim === "string" && prim_types[func.prim]) {
        var type_info = prim_types[func.prim];
      } else if (typeof func.prim === "object") {
        var type_info = adt_type(func.prim);
      } else {
        return null;
      }
      if (args.length === type_info.inst.length) {
        //if (DEBUG) console.log("- Correct case count.");
        var branches = [];
        for (var i = 0; i < args.length; ++i) {
          var fields = type_info.inst[i][0];
          var branch = args[i];
          //if (DEBUG) console.log("...", i, fields, type_info.inst[i], cmp.stringify(branch));
          var arity = 0;
          while (arity < fields && branch.ctor === "Lam") {
            arity += 1;
            branch = branch.body;
          }
          if (arity === fields) {
            //if (DEBUG) console.log("- Correct field count on branch "+i+".");
            branches.push(branch);
          }
        }
        if (args.length === branches.length) {
          return {func, branches};
        }
      }
    }
    return null;
  };
  var args = [];
  while (term.ctor === "Lam") {
    args.push(term.name);
    term = term.body;
  };
  var is_recursive = false;
  var is_tail_safe = true;
  function check(term, tail) {
    //if (DEBUG) console.log("check", tail, cmp.stringify(term));
    switch (term.ctor) {
      case "Lam":
        check(term.body, tail);
        break;
      case "App":
        var got = tail && get_branches(term);
        if (got) {
          //if (DEBUG) console.log("- Has branches...");
          check(got.func, tail && got.branches.length === args.length);
          //if (DEBUG) console.log("~f "+cmp.stringify(got.func));
          for (var branch of got.branches) {
            //if (DEBUG) console.log("~b "+cmp.stringify(branch));
            check(branch, tail);
          };
        } else {
          check(term.func, tail);
          check(term.argm, false);
        };
        break;
      case "Let":
        check(term.expr, tail);
        check(term.body, tail);
        break;
      case "Eli":
        check(term.expr, tail);
        break;
      case "Ins":
        check(term.expr, tail);
        break;
      case "Ref":
        if (term.name === name) {
          is_recursive = true;
          is_tail_safe = is_tail_safe && tail;
          //if (DEBUG) console.log("- Recurses:", term.name, name, is_recursive, is_tail_safe)
        };
        break;
    };
  };
  check(term, true);
  if (is_recursive) {
    return {tail: is_tail_safe, args};
  }
  return null;
};

function js_code(term, name = null) {
  var rec = recursion(term, name);
  var app = application(term);
  var ins = instantiation(term);
  if (rec && rec.tail) {
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
    code += "var arg=["+vars.map(js_name).join(",")+"];";
    code += "while(true){";
    code += "let ["+vars.map(js_name).join(",")+"]=arg;";
    code += "var R="+js_code(term)+";";
    code += "if(R.ctr==='TCO')arg=R.arg;";
    code += "else return R;";
    code += "}}";
    return code;
  } else if (app) {
    return app;
  } else if (ins) {
    return ins;
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
        return flatten_lets(term);
      case "Eli":
        if (typeof term.prim === "string") {
          return "elim_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
        } else {
          return "null";
        }
      case "Ins":
        if (typeof term.prim === "string") {
          return "inst_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
        } else {
          return "null";
        }
      case "Nat":
        return term.natx+"n";
      case "Chr":
        return term.chrx.charCodeAt(0);
      case "Str":
        return "`"+term.strx+"`";
    };
  };
};

function js_name(str) {
  return str.replace(/\./g,"$");
};

function compile(main, defs, only_expression = false) {
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
  var isio = fmc.equal(defs[main].type, fmc.App(false, fmc.Ref("SimpleIO"), fmc.Ref("Unit")), defs);
  var code = "";
  if (!only_expression) {
    code += "module.exports = ";
  };
  code += "(function (){\n";
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
    code += "    switch (p._) {\n";
    code += "      case 'SimpleIO.end': return Promise.resolve(p.val);\n";
    code += "      case 'SimpleIO.ask': return new Promise((res,_) => rdl.question('', (line) => run(p.then(line)).then(res)));\n";
    code += "      case 'SimpleIO.say': return new Promise((res,_) => (console.log(p.text), run(p.then(1)).then(res)));\n";
    code += "    }\n";
    code += "  };\n";
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
      expr = application(cmp.Ref(name), true);
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
  if (!only_expression) {
    if (isio) {
      code += "\nmodule.exports['$main$']().then(() => process.exit());";
    } else {
      code += "\nconsole.log(module.exports['"+main+"']);";
    };
  };

  return code;
};

module.exports = {compile};
