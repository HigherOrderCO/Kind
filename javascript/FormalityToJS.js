const fmc = require("./FormalityCore.js");
const fml = require("./FormalityLang.js");
const cmp = require("./FormalityComp.js");

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
  Bits: {
    inst: "x=>x('')(p=>p+'0')(p=>p+'1')",
    elim: "x=>be=>b0=>b1=>(x.length?(x[x.length-1]==='0'?b0(x.slice(0,-1)):b1(x.slice(0,-1))):be)",
  },
  U16: {
    inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
    elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===16?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
  },
  U32: {
    inst: "x=>x(w=>(function R(x,k){return x(0)(p=>R(p,k*2))(p=>k+R(p,k*2))})(w,1))",
    elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===32?we:((x>>>i)&1?w1:w0)(R(i+1))})(0))",
  },
  U64: {
    inst: "x=>x(w=>(function R(x,k){return x(0n)(p=>R(p,k*2n))(p=>k+R(p,k*2n))})(w,1n))",
    elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===64n?we:((x>>i)&1n?w1:w0)(R(i+1n))})(0n))",
  },
  F64: {
    inst: "x=>x(w=>(function R(x,i){return x(0)(p=>R(p,i+1))(p=>F64_set(R(p,i+1),i))})(w,0))",
    elim: "x=>u=>u((function R(i){return we=>w0=>w1=>i===64?we:(F64_get(x,i)?w1:w0)(R(i+1))})(0))",
  },
  String: {
    inst: "x=>x('')(h=>t=>String.fromCharCode(h)+t)",
    elim: "x=>n=>c=>x===''?n:c(x.charCodeAt(0))(x.slice(1))",
  },
};

var prim_funcs = {
  "Bool.not"    : "a=>!a",
  "Bool.and"    : "a=>b=>a&&b",
  "Bool.if"     : "x=>ct=>cf=>x?ct:cf",
  "Bool.or"     : "a=>b=>a||b",
  "Debug.log"   : "a=>b=>(console.log(a),b())",
  "Nat.add"     : "a=>b=>a+b",
  "Nat.sub"     : "a=>b=>a-b<=0n?0n:a-b",
  "Nat.mul"     : "a=>b=>a*b",
  "Nat.div"     : "a=>b=>a/b",
  "Nat.div_mod" : "a=>b=>t=>t(a/b)(a%b)",
  "Nat.ltn"     : "a=>b=>a<b",
  "Nat.lte"     : "a=>b=>a<=b",
  "Nat.eql"     : "a=>b=>a===b",
  "Nat.gte"     : "a=>b=>a>=b",
  "Nat.gtn"     : "a=>b=>a>b",
  "U16.add"     : "a=>b=>a+b",
  "U16.sub"     : "a=>b=>Math.max(a-b,0)",
  "U16.mul"     : "a=>b=>a*b",
  "U16.div"     : "a=>b=>(a/b)>>>0",
  "U16.mod"     : "a=>b=>a%b",
  "U16.pow"     : "a=>b=>(a**b)&0xFFFF",
  "U16.ltn"     : "a=>b=>a<b",
  "U16.lte"     : "a=>b=>a<=b",
  "U16.eql"     : "a=>b=>a===b",
  "U16.gte"     : "a=>b=>a>=b",
  "U16.gtn"     : "a=>b=>a>b",
  "U16.shr"     : "a=>b=>a>>>b",
  "U16.shl"     : "a=>b=>a<<b",
  "U16.and"     : "a=>b=>a&b",
  "U16.or"      : "a=>b=>a|b",
  "U16.xor"     : "a=>b=>a^b",
  "U32.add"     : "a=>b=>a+b",
  "U32.sub"     : "a=>b=>Math.max(a-b,0)",
  "U32.mul"     : "a=>b=>a*b",
  "U32.div"     : "a=>b=>(a/b)>>>0",
  "U32.mod"     : "a=>b=>a%b",
  "U32.pow"     : "a=>b=>(a**b)>>>0",
  "U32.ltn"     : "a=>b=>a<b",
  "U32.lte"     : "a=>b=>a<=b",
  "U32.eql"     : "a=>b=>a===b",
  "U32.gte"     : "a=>b=>a>=b",
  "U32.gtn"     : "a=>b=>a>b",
  "U32.shr"     : "a=>b=>a>>>b",
  "U32.shl"     : "a=>b=>a<<b",
  "U32.and"     : "a=>b=>a&b",
  "U32.or"      : "a=>b=>a|b",
  "U32.xor"     : "a=>b=>a^b",
  "U64.add"     : "a=>b=>(a+b)&0xFFFFFFFFFFFFFFFFn",
  "U64.sub"     : "a=>b=>a-b<=0n?0n:a-b",
  "U64.mul"     : "a=>b=>(a*b)&0xFFFFFFFFFFFFFFFFn",
  "U64.div"     : "a=>b=>a/b",
  "U64.mod"     : "a=>b=>a%b",
  "U64.pow"     : "a=>b=>(a**b)&0xFFFFFFFFFFFFFFFFn",
  "U64.ltn"     : "a=>b=>(a<b)",
  "U64.lte"     : "a=>b=>(a<=b)",
  "U64.eql"     : "a=>b=>(a===b)",
  "U64.gte"     : "a=>b=>(a>=b)",
  "U64.gtn"     : "a=>b=>(a>b)",
  "U64.shr"     : "a=>b=>(a>>b)&0xFFFFFFFFFFFFFFFFn",
  "U64.shl"     : "a=>b=>(a<<b)&0xFFFFFFFFFFFFFFFFn",
  "U64.and"     : "a=>b=>a&b",
  "U64.or"      : "a=>b=>a|b",
  "U64.xor"     : "a=>b=>a^b",
  "F64.add"     : "a=>b=>a+b",
  "F64.sub"     : "a=>b=>a-b",
  "F64.mul"     : "a=>b=>a*b",
  "F64.div"     : "a=>b=>a/b",
  "F64.mod"     : "a=>b=>a%b",
  "F64.pow"     : "a=>b=>a**b",
  "F64.log"     : "a=>Math.log(a)",
  "F64.cos"     : "a=>Math.cos(a)",
  "F64.sin"     : "a=>Math.sin(a)",
  "F64.tan"     : "a=>Math.tan(a)",
  "F64.acos"    : "a=>Math.acos(a)",
  "F64.asin"    : "a=>Math.asin(a)",
  "F64.atan"    : "a=>Math.atan(a)",
  "String.eql"  : "a=>b=>a===b",
};

function js_code(term, name = null) {
  // Tail-call Optimization
  if (name && name.slice(-4) === ".tco") {
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
  } else {
    switch (term.ctor) {
      case "Var": return js_name(term.name);
      case "Ref": return js_name(term.name);
      case "Nul": return "null";
      case "Lam": return "("+js_name(term.name)+"=>"+js_code(term.body)+")";
      case "App": return js_code(term.func)+"("+js_code(term.argm)+")";
      case "Let": return "("+js_name(term.name)+"=>"+js_code(term.body)+")("+js_code(term.expr)+")";
      case "Eli": return "elim_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
      case "Ins": return "inst_"+term.prim.toLowerCase()+"("+js_code(term.expr)+")";
      case "Chr": return term.chrx.charCodeAt(0);
      case "Str": return "`"+term.strx+"`";
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
  code += "  var F64 = new Float64Array(1);\n";
  code += "  var U32 = new Uint32Array(F64.buffer);\n";
  code += "  var F64_get = (x,i)=>((F64[0]=x),(i<32?(U32[0]>>>i)&1:(U32[1]>>>(i-32)&1)));\n";
  code += "  var F64_set = (x,i)=>((F64[0]=x),(i<32?(U32[0]=U32[0]|(1<<i)):(U32[1]=U32[1]|(1<<(i-32)))),F64[0]);\n";
  for (var prim in used_prim_types) {
    code += "  var inst_"+prim.toLowerCase()+" = "+used_prim_types[prim].inst + ";\n";
    code += "  var elim_"+prim.toLowerCase()+" = "+used_prim_types[prim].elim + ";\n";
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
      expr = used_prim_funcs[name];
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
