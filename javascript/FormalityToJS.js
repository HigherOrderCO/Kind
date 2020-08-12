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
      ctag: x => x+".length===0?'nil':"+x+"["+x+".length-1]==='0'?'0':'1'",
      ctor: [[], [x => x+".slice(0,-1)"], [x => x+".slice(0,-1)"]],
    },
    cnam: ['nil', '0', '1'],
  },
  U8: {
    inst: [[1, x => "word_to_u8("+x+")"]],
    elim: {
      ctag: x => "'u8'",
      ctor: [[x => "u8_to_word("+x+")"]],
    },
    cnam: ['u8'],
  },
  U16: {
    inst: [[1, x => "word_to_u16("+x+")"]],
    elim: {
      ctag: x => "'u16'",
      ctor: [[x => "u16_to_word("+x+")"]],
    },
    cnam: ['u16'],
  },
  U32: {
    inst: [[1, x => "word_to_u32("+x+")"]],
    elim: {
      ctag: x => "'u32'",
      ctor: [[x => "u32_to_word("+x+")"]],
    },
    cnam: ['u32'],
  },
  U64: {
    inst: [[1, x => "word_to_u64("+x+")"]],
    elim: {
      ctag: x => "'u64'",
      ctor: [[x => "u64_to_word("+x+")"]],
    },
    cnam: ['u64'],
  },
  U256: {
    inst: [[1, x => "word_to_u256("+x+")"]],
    elim: {
      ctag: x => "'u256'",
      ctor: [[x => "u256_to_word("+x+")"]],
    },
    cnam: ['u256'],
  },
  F64: {
    inst: [[1, x => "word_to_f64("+x+")"]],
    elim: {
      ctag: x => "'f64'",
      ctor: [[x => "f64_to_word("+x+")"]],
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
  Buffer32: {
    inst: [[2, d => a => "u32array_to_buffer32("+a+")"]],
    elim: {
      ctag: x => "'b32'",
      ctor: [[x => "buffer32_to_depth("+x+")", x => "buffer32_to_u32array("+x+")"]],
    },
    cnam: ['b32'],
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
  "Bool.not"         : [1, a=>`!${a}`],
  "Bool.and"         : [2, a=>b=>`${a}&&${b}`],
  "Bool.if"          : [3, a=>b=>c=>`${a}?${b}:${c}`],
  "Bool.or"          : [2, a=>b=>`${a}||${b}`],
  "Debug.log"        : [2, a=>b=>`(console.log(${a}),${b}())`],
  "Nat.add"          : [2, a=>b=>`${a}+${b}`],
  "Nat.sub"          : [2, a=>b=>`${a}-${b}<=0n?0n:${a}-${b}`],
  "Nat.mul"          : [2, a=>b=>`${a}*${b}`],
  "Nat.div"          : [2, a=>b=>`${a}/${b}`],
  "Nat.div_mod"      : [2, a=>b=>`({_:'Pair.new','fst':${a}/${b},'snd':${a}%${b}})`], // TODO change to proper pair
  "Nat.pow"          : [2, a=>b=>`${a}**${b}`],
  "Nat.ltn"          : [2, a=>b=>`${a}<${b}`],
  "Nat.lte"          : [2, a=>b=>`${a}<=${b}`],
  "Nat.eql"          : [2, a=>b=>`${a}===${b}`],
  "Nat.gte"          : [2, a=>b=>`${a}>=${b}`],
  "Nat.gtn"          : [2, a=>b=>`${a}>${b}`],
  "Nat.to_u8"        : [1, a=>`Number(${a})`],
  "Nat.to_u16"       : [1, a=>`Number(${a})`],
  "Nat.to_u32"       : [1, a=>`Number(${a})`],
  "Nat.to_u64"       : [1, a=>`${a}`],
  "Nat.to_u256"      : [1, a=>`${a}`],
  "Nat.to_f64"       : [3, a=>b=>c=>`f64_make(${a},${b},${c})`],
  "U8.add"           : [2, a=>b=>`(${a}+${b})&0xFF`],
  "U8.sub"           : [2, a=>b=>`Math.max(${a}-${b},0)`],
  "U8.mul"           : [2, a=>b=>`(${a}*${b})&0xFF`],
  "U8.div"           : [2, a=>b=>`(${a}/${b})>>>0`],
  "U8.mod"           : [2, a=>b=>`${a}%${b}`],
  "U8.pow"           : [2, a=>b=>`(${a}**${b})&0xFF`],
  "U8.ltn"           : [2, a=>b=>`${a}<${b}`],
  "U8.lte"           : [2, a=>b=>`${a}<=${b}`],
  "U8.eql"           : [2, a=>b=>`${a}===${b}`],
  "U8.gte"           : [2, a=>b=>`${a}>=${b}`],
  "U8.gtn"           : [2, a=>b=>`${a}>${b}`],
  "U8.shr"           : [2, a=>b=>`${a}>>>${b}`],
  "U8.shl"           : [2, a=>b=>`(${a}<<${b})*0xFF`],
  "U8.and"           : [2, a=>b=>`${a}&${b}`],
  "U8.or"            : [2, a=>b=>`${a}|${b}`],
  "U8.xor"           : [2, a=>b=>`${a}^${b}`],
  "U16.add"          : [2, a=>b=>`(${a}+${b})&0xFFFF`],
  "U16.sub"          : [2, a=>b=>`Math.max(${a}-${b},0)`],
  "U16.mul"          : [2, a=>b=>`(${a}*${b})&0xFFFF`],
  "U16.div"          : [2, a=>b=>`(${a}/${b})>>>0`],
  "U16.mod"          : [2, a=>b=>`${a}%${b}`],
  "U16.pow"          : [2, a=>b=>`(${a}**${b})&0xFFFF`],
  "U16.ltn"          : [2, a=>b=>`${a}<${b}`],
  "U16.lte"          : [2, a=>b=>`${a}<=${b}`],
  "U16.eql"          : [2, a=>b=>`${a}===${b}`],
  "U16.gte"          : [2, a=>b=>`${a}>=${b}`],
  "U16.gtn"          : [2, a=>b=>`${a}>${b}`],
  "U16.shr"          : [2, a=>b=>`${a}>>>${b}`],
  "U16.shl"          : [2, a=>b=>`(${a}<<${b})&0xFFFF`],
  "U16.and"          : [2, a=>b=>`${a}&${b}`],
  "U16.or"           : [2, a=>b=>`${a}|${b}`],
  "U16.xor"          : [2, a=>b=>`${a}^${b}`],
  "U32.add"          : [2, a=>b=>`(${a}+${b})>>>0`],
  "U32.sub"          : [2, a=>b=>`Math.max(${a}-${b},0)`],
  "U32.mul"          : [2, a=>b=>`(${a}*${b})>>>0`],
  "U32.div"          : [2, a=>b=>`(${a}/${b})>>>0`],
  "U32.mod"          : [2, a=>b=>`${a}%${b}`],
  "U32.pow"          : [2, a=>b=>`(${a}**${b})>>>0`],
  "U32.ltn"          : [2, a=>b=>`${a}<${b}`],
  "U32.lte"          : [2, a=>b=>`${a}<=${b}`],
  "U32.eql"          : [2, a=>b=>`${a}===${b}`],
  "U32.gte"          : [2, a=>b=>`${a}>=${b}`],
  "U32.gtn"          : [2, a=>b=>`${a}>${b}`],
  "U32.shr"          : [2, a=>b=>`${a}>>>${b}`],
  "U32.shl"          : [2, a=>b=>`${a}<<${b}`],
  "U32.and"          : [2, a=>b=>`${a}&${b}`],
  "U32.or"           : [2, a=>b=>`${a}|${b}`],
  "U32.xor"          : [2, a=>b=>`${a}^${b}`],
  "U32.slice"        : [3, a=>b=>c=>`${c}.slice(${a},${b})`],
  "U32.read_base"    : [2, a=>b=>`parseInt(${b},${a})`],
  "U32.length"       : [1, a=>`${a}.length`],
  "U32.for"          : [4, a=>b=>c=>d=>`u32_for(${a},${b},${c},${d})`],
  "U32.to_f64"       : [1, a=>`${a}`],
  "U64.add"          : [2, a=>b=>`(${a}+${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.sub"          : [2, a=>b=>`${a}-${b}<=0n?0n:${a}-${b}`],
  "U64.mul"          : [2, a=>b=>`(${a}*${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.div"          : [2, a=>b=>`${a}/${b}`],
  "U64.mod"          : [2, a=>b=>`${a}%${b}`],
  "U64.pow"          : [2, a=>b=>`(${a}**${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.ltn"          : [2, a=>b=>`(${a}<${b})`],
  "U64.lte"          : [2, a=>b=>`(${a}<=${b})`],
  "U64.eql"          : [2, a=>b=>`(${a}===${b})`],
  "U64.gte"          : [2, a=>b=>`(${a}>=${b})`],
  "U64.gtn"          : [2, a=>b=>`(${a}>${b})`],
  "U64.shr"          : [2, a=>b=>`(${a}>>${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.shl"          : [2, a=>b=>`(${a}<<${b})&0xFFFFFFFFFFFFFFFFn`],
  "U64.and"          : [2, a=>b=>`${a}&${b}`],
  "U64.or"           : [2, a=>b=>`${a}|${b}`],
  "U64.xor"          : [2, a=>b=>`${a}^${b}`],
  "U256.add"         : [2, a=>b=>`(${a}+${b})&0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn`],
  "U256.sub"         : [2, a=>b=>`${a}-${b}<=0n?0n:${a}-${b}`],
  "U256.mul"         : [2, a=>b=>`(${a}*${b})&0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn`],
  "U256.div"         : [2, a=>b=>`${a}/${b}`],
  "U256.mod"         : [2, a=>b=>`${a}%${b}`],
  "F64.add"          : [2, a=>b=>`${a}+${b}`],
  "F64.sub"          : [2, a=>b=>`${a}-${b}`],
  "F64.mul"          : [2, a=>b=>`${a}*${b}`],
  "F64.div"          : [2, a=>b=>`${a}/${b}`],
  "F64.mod"          : [2, a=>b=>`${a}%${b}`],
  "F64.pow"          : [2, a=>b=>`${a}**${b}`],
  "F64.log"          : [1, a=>`Math.log(${a})`],
  "F64.cos"          : [1, a=>`Math.cos(${a})`],
  "F64.sin"          : [1, a=>`Math.sin(${a})`],
  "F64.tan"          : [1, a=>`Math.tan(${a})`],
  "F64.acos"         : [1, a=>`Math.acos(${a})`],
  "F64.asin"         : [1, a=>`Math.asin(${a})`],
  "F64.atan"         : [1, a=>`Math.atan(${a})`],
  "F64.to_u32"       : [1, a=>`(${a}>>>0)`],
  "Buffer32.set"     : [3, a=>b=>c=>`(${c}[${a}]=${b},${c})`],
  "Buffer32.get"     : [2, a=>b=>`(${b}[${a}])`],
  "Buffer32.alloc"   : [1, a=>`new Uint32Array(2 ** Number(${a}))`],
  "Image3D.set_col"  : [3, a=>b=>c=>`(${c}.buffer[${a}*2+1]=${b},${c})`],
  "Image3D.set_pos"  : [3, a=>b=>c=>`(${c}.buffer[${a}*2]=${b},${c})`],
  "Image3D.set"      : [4, a=>b=>c=>d=>`(${d}.buffer[${a}*2]=${b},${d}.buffer[${a}*2+1]=${c},${d})`],
  "Image3D.push"     : [3, a=>b=>c=>`(${c}.buffer[${c}.length*2]=${a},${c}.buffer[${c}.length*2+1]=${b},${c}.length++,${c})`],
  "Image3D.get_pos"  : [2, a=>b=>`(${b}.buffer[${a}*2])`],
  "Image3D.get_col"  : [2, a=>b=>`(${b}.buffer[${a}*2+1])`],
  "String.eql"       : [2, a=>b=>`${a}===${b}`],
  "String.concat"    : [2, a=>b=>`${a}+${b}`],
  "Equal.cast"       : [1, a=>a],
  "Pos32.new"        : [3, a=>b=>c=>`(0|${a}|(${b}<<12)|(${c}<<24))`],
  "Pos32.get_x"      : [1, a=>`(${a}&0xFFF)`],
  "Pos32.get_y"      : [1, a=>`((${a}>>>12)&0xFFF)`],
  "Pos32.get_z"      : [1, a=>`(${a}>>>24)`],
  "Col32.get_a"      : [1, a=>`((${a}>>>24)&0xFF)`],
  "Col32.get_b"      : [1, a=>`((${a}>>>16)&0xFF)`],
  "Col32.get_g"      : [1, a=>`((${a}>>>8)&0xFF)`],
  "Col32.get_r"      : [1, a=>`(${a}&0xFF)`],
  "Col32.new"        : [4, a=>b=>c=>d=>`(0|${a}|(${b}<<8)|(${c}<<16)|(${d}<<24))`],
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
    if (func.name === "Nat.to_u8" && args.length === 1 && args[0].ctor === "Nat") {
      return String(Number(args[0].natx));
    } else if (func.name === "Nat.to_u16" && args.length === 1 && args[0].ctor === "Nat") {
      return String(Number(args[0].natx));
    } else if (func.name === "Nat.to_u32" && args.length === 1 && args[0].ctor === "Nat") {
      return String(Number(args[0].natx));
    } else if (func.name === "Nat.to_u64" && args.length === 1 && args[0].ctor === "Nat") {
      return String(args[0].natx)+"n";
    } else if (func.name === "Nat.to_u256" && args.length === 1 && args[0].ctor === "Nat") {
      return String(args[0].natx)+"n";
    } else if ( func.name === "Nat.to_f64"
            && args.length === 3
            && args[0].ctor === "Ref"
            && ( args[0].name === "Bool.true"
              || args[0].name === "Bool.false")
            && args[1].ctor === "Nat"
            && args[2].ctor === "Nat") {
      var str = String(Number(args[1].natx));
      var mag = Number(args[2].natx);
      while (str.length < mag + 1) {
        str = "0" + str;
      }
      var str = str.slice(0, -mag) + "." + str.slice(-mag);
      return (args[0].name === "Bool.false" ? "-" : "") + str;
    } else if (func.name === "U32.for"
            && args.length === 4
            && args[3].ctor === "Lam"
            && args[3].body.ctor === "Lam") {
      var idx = js_name(args[3].name);
      var stt = js_name(args[3].body.name);
      var fro = "fro"+Math.floor(Math.random()*(2**32));
      var til = "til"+Math.floor(Math.random()*(2**32));
      var str = "";
      str += "(()=>{";
      str += "let "+stt+"="+js_code(args[0])+";";
      str += "let "+fro+"="+js_code(args[1])+";";
      str += "let "+til+"="+js_code(args[2])+";";
      str += "for (let "+idx+"="+fro+";"+idx+"<"+til+";++"+idx+") {";
      str += stt+"="+js_code(args[3].body.body);
      str += "};";
      str += "return "+stt+";";
      str += "})()";
      return str;
    } else {
      var [arity, template] = prim_funcs[func.name];
      return build_from_template(arity, template, args);
    }

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
        check(term.body, false);
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
        check(term.expr, false);
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
        return term.chrx.codePointAt(0);
      case "Str":
        return '"'+fmc.print_str(term.strx)+'"';
    };
  };
};

function js_name(str) {
  switch (str) {
    case "true": return "$true";
    case "false": return "$false";
    default: return str.replace(/\./g,"$");
  }
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
  var isio = fmc.equal(defs[main].type, fmc.App(false, fmc.Ref("IO"), fmc.Ref("Unit")), defs);
  var code = "";
  if (!only_expression) {
    code += "module.exports = ";
  };
  code += "(function (){\n";

  if (used_prim_types["U8"]) {
    code += [
      "  function word_to_u8(w) {",
      "    var u = 0;",
      "    for (var i = 0; i < 8; ++i) {",
      "      u = u | (w._ === 'Word.1' ? 1 << i : 0);",
      "      w = w.pred;",
      "    };",
      "    return u;",
      "  };",
      "  function u8_to_word(u) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0; i < 8; ++i) {",
      "      w = {_: (u >>> (8-i-1)) & 1 ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      ].join("\n");
    code += "\n";
  }

  if (used_prim_types["U16"]) {
    code += [
      "  function word_to_u16(w) {",
      "    var u = 0;",
      "    for (var i = 0; i < 16; ++i) {",
      "      u = u | (w._ === 'Word.1' ? 1 << i : 0);",
      "      w = w.pred;",
      "    };",
      "    return u;",
      "  };",
      "  function u16_to_word(u) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0; i < 16; ++i) {",
      "      w = {_: (u >>> (16-i-1)) & 1 ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      ].join("\n");
    code += "\n";
  }

  if (used_prim_types["U32"]) {
    code += [
      "  function word_to_u32(w) {",
      "    var u = 0;",
      "    for (var i = 0; i < 32; ++i) {",
      "      u = u | (w._ === 'Word.1' ? 1 << i : 0);",
      "      w = w.pred;",
      "    };",
      "    return u;",
      "  };",
      "  function u32_to_word(u) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0; i < 32; ++i) {",
      "      w = {_: (u >>> (32-i-1)) & 1 ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      "  function u32_for(state, from, til, func) {",
      "    for (var i = from; i < til; ++i) {",
      "      state = func(i)(state);",
      "    }",
      "    return state;",
      "  };"
      ].join("\n");
    code += "\n";
  };

  if (used_prim_types["U64"]) {
    code += [
      "  function word_to_u64(w) {",
      "    var u = 0n;",
      "    for (var i = 0n; i < 64n; i += 1n) {",
      "      u = u | (w._ === 'Word.1' ? 1n << i : 0n);",
      "      w = w.pred;",
      "    };",
      "    return u;",
      "  };",
      "  function u64_to_word(u) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0n; i < 64n; i += 1n) {",
      "      w = {_: (u >> (64n-i-1n)) & 1n ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      ].join("\n");
    code += "\n";
  };

  if (used_prim_types["U256"]) {
    code += [
      "  function word_to_u256(w) {",
      "    var u = 0n;",
      "    for (var i = 0n; i < 256n; i += 1n) {",
      "      u = u | (w._ === 'Word.1' ? 1n << i : 0n);",
      "      w = w.pred;",
      "    };",
      "    return u;",
      "  };",
      "  function u256_to_word(u) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0n; i < 256n; i += 1n) {",
      "      w = {_: (u >> (256n-i-1n)) & 1n ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      ].join("\n");
    code += "\n";
  };

  if (used_prim_types["F64"]) {
    code += [
      "  var f64 = new Float64Array(1);",
      "  var u32 = new Uint32Array(f64.buffer);",
      "  function f64_get_bit(x, i) {",
      "    f64[0] = x;",
      "    if (i < 32) {",
      "      return (u32[0] >>> i) & 1;",
      "    } else {",
      "      return (u32[1] >>> (i - 32)) & 1;",
      "    }",
      "  };",
      "  function f64_set_bit(x, i) {",
      "    f64[0] = x;",
      "    if (i < 32) {",
      "      u32[0] = u32[0] | (1 << i);",
      "    } else {",
      "      u32[1] = u32[1] | (1 << (i - 32));",
      "    }",
      "    return f64[0];",
      "  };",
      "  function word_to_f64(w) {",
      "    var x = 0;",
      "    for (var i = 0; i < 64; ++i) {",
      "      x = w._ === 'Word.1' ? f64_set_bit(x,i) : x;",
      "      w = w.pred;",
      "    };",
      "    return x;",
      "  };",
      "  function f64_to_word(x) {",
      "    var w = {_: 'Word.nil'};",
      "    for (var i = 0; i < 64; ++i) {",
      "      w = {_: f64_get_bit(x,64-i-1) ? 'Word.1' : 'Word.0', pred: w};",
      "    };",
      "    return w;",
      "  };",
      "  function f64_make(s, a, b) {",
      "    return (s ? 1 : -1) * Number(a) / 10 ** Number(b);",
      "  };",
      ].join("\n");
    code += "\n";
  };

  if (used_prim_types["Buffer32"]) {
    code += [
      "  function u32array_to_buffer32(a) {",
      "    function go(a, buffer) {",
      "      switch (a._) {",
      "        case 'Array.tip': buffer.push(a.value); break;",
      "        case 'Array.tie': go(a.lft, buffer); go(a.rgt, buffer); break;",
      "      }",
      "      return buffer;",
      "    };",
      "    return new Uint32Array(go(a, []));",
      "  };",
      "  function buffer32_to_u32array(b) {",
      "    function go(b) {",
      "      if (b.length === 1) {",
      "        return {_: 'Array.tip', value: b[0]};",
      "      } else {",
      "        var lft = go(b.slice(0,b.length/2));",
      "        var rgt = go(b.slice(b.length/2));",
      "        return {_: 'Array.tie', lft, rgt};",
      "      };",
      "    };",
      "    return go(b);",
      "  };",
      "  function buffer32_to_depth(b) {",
      "    return BigInt(Math.log(b.length) / Math.log(2));",
      "  };",
      ].join("\n");
    code += "\n";
  };

  for (var prim in used_prim_types) {
    code += "  var inst_"+prim.toLowerCase()+" = "+instantiator(used_prim_types[prim].inst)+";\n";
    code += "  var elim_"+prim.toLowerCase()+" = "+js_code(cmp.Lam("x", application(cmp.Eli(prim, cmp.Var("x")), true)))+";\n";
  };

  if (isio) {
    code += "  var rdl = require('readline').createInterface({input:process.stdin,output:process.stdout,terminal:false});\n";
    code += "  var run = (p) => {\n";
    code += "    switch (p._) {\n";
    code += "      case 'IO.end': return Promise.resolve(p.value);\n";
    code += "      case 'IO.ask': return new Promise((res, _) => {\n";
    code += "        switch (p.query) {\n";
    code += "          case 'print': console.log(p.param); run(p.then(1)).then(res); break;\n";
    code += "          case 'get_line': rdl.question('', (line) => run(p.then(line)).then(res)); break;\n";
    code += "         }\n";
    code += "      });\n";
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
        //console.log(e);
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
      code += "\nvar MAIN=module.exports['"+main+"']; try { console.log(JSON.stringify(MAIN,null,2) || '<unprintable>') } catch (e) { console.log(MAIN); };";
    };
  };

  return code;
};

module.exports = {compile};
