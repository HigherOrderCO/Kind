// This is the same as FormalityCore.js, but with holes and unification

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
const Wat = (name)                     => ({ctor:"Wat",name});
const Hol = (name,vals)                => ({ctor:"Hol",name,vals});
const Cse = (name,func,info)           => ({ctor:"Cse",name,func,info});
const Nat = (natx)                     => ({ctor:"Nat",natx});
const Chr = (chrx)                     => ({ctor:"Chr",chrx});
const Str = (strx)                     => ({ctor:"Str",strx});

// List
// ====

const Nil = ()          => ({ctor:"Nil",size:0});
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

// Gets the nth element of a list
function at(list, n) {
  switch (list.ctor) {
    case "Nil": return null;
    case "Ext": return n === 0 ? list.head : at(list.tail, n - 1);
  };
};

// Folds a list
function fold(list, nil, cons) {
  switch (list.ctor) {
    case "Nil": return nil;
    case "Ext": return cons(list.head, fold(list.tail, nil, cons));
  }
};

function deref(name, defs) {
  if (defs[name]) {
    return {def: defs[name], name};
  }
  return null;
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
      var self = term.self;
      var name = term.name;
      var type = stringify(term.bind, depth);
      var body = stringify(term.body(Var(self+"#"), Var(name+"#")), depth + 2);
      return bind + self + "(" + name + ":" + type + ") " + body;
    case "Lam":
      var bind = term.eras ? "Λ" : "λ";
      var name = term.name;
      var body = stringify(term.body(Var(name+"#")), depth + 1);
      return bind + name + " " + body;
    case "App":
      var open = term.eras ? "<" : "(";
      var func = stringify(term.func, depth);
      var argm = stringify(term.argm, depth);
      var clos = term.eras ? ">" : ")";
      return open + func + " " + argm + clos;
    case "Let":
      var name = term.name;
      var expr = stringify(term.expr, depth);
      var body = stringify(term.body(Var(name+"#")), depth + 1);
      return "$" + name + "=" + expr + ";" + body;
    case "Ann":
      var type = stringify(term.type, depth);
      var expr = stringify(term.expr, depth);
      return ":" + type + " " + expr;
    case "Loc":
      return stringify(term.expr, depth);
    case "Wat":
      return "?"+term.name;
    case "Hol":
      return "_"+term.name;
    case "Cse":
      return "<parsing_case>";
    case "Nat":
      return ""+term.natx;
    case "Chr":
      return "'"+print_str(term.chrx)+"'"; 
    case "Str":
      return '"'+print_str(term.strx)+'"';
  };
};

function print_str(str) {
  var out = ""
  for (var i = 0; i < str.length; i++) {
    if (str[i] == '\\' || str[i] == '"' | str[i] == "'") {
      out += '\\' + str[i];
    } else if (str[i] >= ' ' && str[i] <= `~`) {
      out += str[i];
    } else {
      out += "\\u{" + str.codePointAt(i).toString(16) + "}";
    }
  }
  return out;
}

function parse(code, indx, mode = "defs") {
  function is_name(chr) {
    var val = chr.charCodeAt(0);
    return (val >= 46 && val <= 47)  // ./
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
    while (" \n\r\t\v\f".indexOf(code[indx]) !== -1) {
      ++indx;
    };
  };
  function parse_tokn() {
    if (indx >= code.length) {
      throw "Unexpected eof";
    } else if (code[indx] == '\\') {
      var esc = code[++indx];
      switch (esc) {
        case 'u':
          indx++;
          var skip = parse_char('{');
          var point = ""
          while (code[indx] !== '}') {
            if ("0123456789abcdefABCDEF".indexOf(code[indx]) !== -1) {
              point += code[indx++];
            } else {
              throw 'Expected hexadecimal Unicode codepoint", found '+
                JSON.stringify(code[indx])+' at '+indx+': `'+code.slice(indx)+"`.";
            }
          }
          indx++;
          return String.fromCodePoint(parseInt(point,16));
        case '\\':
        case '"':
        case "'":
          indx++;
          return esc;
        default:
         throw "Unexpected escape char: '\\" + code[indx+1] + "'.";
      }
    } else {
      return code[indx++];
    }
  }
  function parse_char(chr) {
    if (indx >= code.length) {
      throw "Unexpected eof.";
    } else if (code[indx] !== chr) {
      throw 'Expected "'+chr+'", found '+JSON.stringify(code[indx])+' at '
        +indx+': `'+code.slice(indx)+"`.";
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
      case "@":
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
      case "?":
        var name = parse_name();
        return ctx => Wat(name);
      case "_":
        var name = parse_name();
        return ctx => Hol(name, fold(ctx, Nil(), (h,t) => Ext(h[1],t)));
      case "'":
        var chrx = parse_tokn();
        var skip = parse_char("'");
        return ctx => Chr(chrx);
      case '"':
        var strx = "";
        //console.log(strx);
        while (code[indx] !== '"') {
          strx += parse_tokn();
        }
        var skip = parse_char('"');
        return ctx => Str(strx);
      default:
        if (is_name(chr)) {
          var name = chr + parse_name();
          return ctx => {
            var got = find(ctx, (x) => x[0] === name);
            if (got) {
              return got.value[1];
            } else if (/^[0-9]*$/.test(name)) {
              return Nat(BigInt(name));
            } else {
              return Ref(name);
            }
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
  };
};

// Derivers
// ========

function build_cse(term, type) {
  var tnam = term.name.split("#")[0];
  var func = term.func;
  var info = term.info;
  var size = 0;
  var [ctx, args] = info;
  while (type.ctor === "All") {
    var case_name = type.name.replace(/^.*\./g, "");
    let csev = args[case_name] || args["_"];
    if (csev) {
      var bind = type.bind;
      var argm = (function go(bind, ctx) {
        if (bind.ctor === "All") {
          var eras = bind.eras;
          var name = bind.name ? tnam+"."+bind.name : tnam;
          var body = x => go(bind.body(bind, bind.bind), Ext([name, x], ctx));
          return Lam(eras, name, body);
        } else {
          return csev(ctx);
        };
      })(type.bind, ctx, 0);
    } else {
      throw "Missing '"+case_name+"' case.";
    }
    func = App(type.eras, func, argm);
    type = type.body(type, type.bind);
    ++size;
  };
  if (Object.keys(args).length > size) {
    throw "Too many cases.";
  }
  return func;
};

function build_nat(term) {
  if (term.natx === 0n) {
    //return Lam(true,"P",()=>Lam(false,"zero",z=>Lam(false,"succ",s=>z)));
    return Ref("Nat.zero");
  } else {
    return App(false, Ref("Nat.succ"), Nat(term.natx - 1n));
  };
};

function build_chr(term) {
  var done = Ref("Char.new");
  var ccod = term.chrx.charCodeAt(0);
  for (var i = 0; i < 16; ++i) {
    done = App(false, done, Ref(((ccod>>>(16-i-1))&1) ? "Bit.1" : "Bit.0"));
  };
  return done;
};

function build_str(term) {
  if (term.strx.length === 0) {
    return Ref("String.nil");
  } else {
    var chr = build_chr(Chr(term.strx[0]));
    return App(false, App(false, Ref("String.cons"), chr), Str(term.strx.slice(1)));
  }
};

// Evaluation
// ==========

function unloc(term) {
  switch (term.ctor) {
    case "Var": return term;
    case "Ref": return term;
    case "Typ": return term;
    case "All": return All(term.eras, term.self, term.name, unloc(term.bind), (s, x) => unloc(term.body(s, x)));
    case "Lam": return Lam(term.eras, term.name, x => unloc(term.body(x)));
    case "App": return App(term.eras, unloc(term.func), unloc(term.argm));
    case "Let": return Let(term.name, unloc(term.expr), x => unloc(term.body(x)));
    case "Ann": return Ann(term.done, unloc(term.expr), unloc(term.type));
    case "Loc": return unloc(term.expr);
    case "Wat": return term;
    case "Hol": return term;
    case "Cse": return term;
    case "Nat": return term;
    case "Chr": return term;
    case "Str": return term;
  };
};

function reduce(term, defs = {}, hols = {}, erased = false) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      var got = deref(term.name, defs);
      if (got) {
        // If reference wasn't synthetized, synthetize it
        if (got.def.core === undefined) {
          var got = typesynth(term.name, defs).term;
        // If reference is being synthetized, return its version with holes
        } else if (got.def.core === null) {
          var got = got.def.term;
        // If reference was synthetized, return its filled core version
        } else {
          var got = got.def.core.term;
        }
        // Avoids reducing axioms
        if (got.ctor === "Loc" && got.expr.ctor === "Ref" && got.expr.name === term.name) {
          return got;
        } else {
          return reduce(got, defs, hols, erased);
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
        return reduce(term.body(Lam(false, "", x => x)), defs, hols, erased);
      } else {
        var eras = term.eras;
        var name = term.name;
        var body = term.body;
        return Lam(eras, name, body);
      }
    case "App":
      if (erased && term.eras) {
        return reduce(term.func, defs, hols, erased);
      } else {
        var eras = term.eras;
        var func = reduce(term.func, defs, hols, erased);
        switch (func.ctor) {
          case "Lam":
            return reduce(func.body(term.argm), defs, hols, erased);
          default:
            return App(eras, func, term.argm);
        };
      };
    case "Let":
      var name = term.name;
      var expr = term.expr;
      var body = term.body;
      return reduce(body(expr), defs, hols, erased);
    case "Ann":
      return reduce(term.expr, defs, hols, erased);
    case "Loc":
      return reduce(term.expr, defs, hols, erased);
    case "Wat":
      return Wat(term.name);
    case "Hol":
      if (hols[term.name]) {
        return reduce(hols[term.name](term.vals), defs, hols, erased);
      } else {
        return Hol(term.name, term.vals);
      }
    case "Cse":
      if (hols[term.name]) {
        var typ = hols[term.name];
        return reduce(build_cse(term, hols[term.name]), defs, hols, erased);
      } else {
        //console.log("couldn't find", term.name, stringify(term.func));
        return term;
      };
    case "Nat":
      return reduce(build_nat(term), defs, hols, erased);
    case "Chr":
      return reduce(build_chr(term), defs, hols, erased);
    case "Str":
      return reduce(build_str(term), defs, hols, erased);
  };
};

function normalize(term, defs, hols = {}, erased = false, seen = {}) {
  var norm = reduce(term, defs, hols, erased);
  var term_hash = hash(term);
  var norm_hash = hash(norm);
  if (seen[term_hash] || seen[norm_hash]) {
    return term;
  } else {
    var seen = {...seen, [term_hash]: true, [norm_hash]: true};
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
        var bind = normalize(norm.bind, defs, hols, erased, seen);
        var body = (s,x) => normalize(norm.body(s,x), defs, hols, erased, seen);
        return All(eras, self, name, bind, body);
      case "Lam":
        var eras = norm.eras;
        var name = norm.name;
        var body = x => normalize(norm.body(x), defs, hols, erased, seen);
        return Lam(eras, name, body);
      case "App":
        var eras = norm.eras;
        var func = normalize(norm.func, defs, hols, erased, seen);
        var argm = normalize(norm.argm, defs, hols, erased, seen);
        return App(eras, func, argm);
      case "Let":
        return normalize(norm.body(norm.expr), defs, hols, erased, seen);
      case "Ann":
        return normalize(norm.expr, defs, hols, erased, seen);
      case "Loc":
        return normalize(norm.expr, defs, hols, erased, seen);
      case "Wat":
        return Wat(norm.name);
      case "Hol":
        return Hol(norm.name, norm.vals);
      case "Cse":
        return Cse(term.name, term.func, term.info);
      case "Nat":
        return Nat(term.natx);
      case "Chr":
        return Chr(term.chrx);
      case "Str":
        return Str(term.strx);
    };
  }
};

// Prepares a term to be stored on .fmc source
// - Fills holes
// - Applies static function calls (necessary for inference)
// - Removes done Anns
// - Removes Nat/Str if we're compiling to core
function canonicalize(term, hols = {}, to_core = false, inline_lams = true) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var eras = term.eras;
      var self = term.self;
      var name = term.name;
      var bind = canonicalize(term.bind, hols, to_core, inline_lams);
      var body = (s,x) => canonicalize(term.body(s,x), hols, to_core, inline_lams);
      return All(eras, self, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var body = x => canonicalize(term.body(x), hols, to_core, inline_lams);
      return Lam(eras, name, body);
    case "App":
      var eras = term.eras;
      var func = canonicalize(term.func, hols, to_core, inline_lams);
      var argm = canonicalize(term.argm, hols, to_core, inline_lams);
      if (inline_lams && func.ctor === "Lam") {
        return canonicalize(func.body(term.argm), hols, to_core, inline_lams);
      } else {
        return App(eras, func, argm);
      };
    case "Let":
      var name = term.name;
      var expr = canonicalize(term.expr, hols, to_core, inline_lams);
      var body = x => canonicalize(term.body(x), hols, to_core, inline_lams);
      return Let(name, expr, body);
    case "Ann":
      if (term.done === true) {
        return canonicalize(term.expr, hols, to_core, inline_lams);
      } else {
        var expr = canonicalize(term.expr, hols, to_core, inline_lams);
        var type = canonicalize(term.type, hols, to_core, inline_lams);
        return Ann(false, expr, type);
      }
    case "Loc":
      return canonicalize(term.expr, hols, to_core, inline_lams);
    case "Wat":
      throw Err(null, null, "Incomplete program.");
    case "Hol":
      if (hols[term.name]) {
        return canonicalize(hols[term.name](term.vals), hols, to_core, inline_lams);
      } else {
        throw Err(null, null, "Unfilled hole: " + term.name + ".");
      }
    case "Cse":
      if (hols[term.name]) {
        return canonicalize(build_cse(term, hols[term.name]), hols, to_core, inline_lams);
      } else {
        throw Err(null, null, "Incomplete case.");
      }
    case "Nat":
      if (to_core) {
        var done = Ref("Nat.zero");
        for (var i = 0n; i < term.natx; i += 1n) {
          done = App(false, Ref("Nat.succ"), done);
        }
        return done;
      } else {
        return term;
      };
  case "Chr":
    if (to_core) {
      var done = Ref("Char.new");
      var ccod = term.chrx.charCodeAt(0);
      for (var i = 0; i < 16; ++i) {
        done = App(false, done, Ref(((ccod>>>(16-i-1))&1) ? "Bit.1" : "Bit.0"));
      };
      return done;
    } else {
      return term;
    };
  case "Str":
    if (to_core) {
      var done = Ref("String.nil");
      for (var i = 0; i < term.strx.length; ++i) {
        var chr = canonicalize(Chr(term.strx[term.strx.length-i-1]), hols, to_core, inline_lams);
        done = App(false, App(false, Ref("String.cons"), chr), done);
      }
      return done;
    } else {
      return term;
    }
  };
};

// Equality
// ========

// Computes the hash of a term. JS strings are hashed, so we just return one.
function hash(term, dep = 0, ini = 0) {
  switch (term.ctor) {
    case "Var":
      var lvl = Number(term.indx.split("#")[1]);
      if (lvl >= ini) {
        return "^" + (dep - lvl - 1);
      } else {
        return "#" + lvl;
      }
    case "Ref":
      return "$" + term.name;
    case "Typ":
      return "Type";
    case "All":
      var bind = hash(term.bind, dep, ini);
      var body = hash(term.body(Var("#"+dep), Var("#"+(dep+1))), dep+2, ini);
      return "Π" + term.self + bind + body;
    case "Lam":
      var body = hash(term.body(Var("#"+dep)), dep+1, ini);
      return "λ" + body;
    case "App":
      var func = hash(term.func, dep, ini);
      var argm = hash(term.argm, dep, ini);
      return "@" + func + argm;
    case "Let":
      var expr = hash(term.expr, dep, ini);
      var body = hash(term.body(Var("#"+dep)), dep+1, ini);
      return "$" + expr + body;
    case "Ann":
      var expr = hash(term.expr, dep, ini);
      return expr;
    case "Loc":
      var expr = hash(term.expr, dep, ini);
      return expr;
    case "Wat":
      return "?" + term.name;
    case "Hol":
      return "_" + term.name;
    case "Cse":
      return "-"+Math.random();
    case "Nat":
      return "{"+term.natx+"}";
    case "Chr":
      return "'"+term.chrx+"'";
    case "Str":
      return '"'+term.strx+'"';
  }
};

// Are two terms equal?
function equal(a, b, defs, hols, dep = 0, rec = {}) {
  let a1 = reduce(a, defs, hols, true);
  let b1 = reduce(b, defs, hols, true);
  var ah = hash(a1, dep, dep);
  var bh = hash(b1, dep, dep);
  var id = ah + "==" + bh;
  if (ah === bh || rec[id]) {
    return true;
  } else {
    rec[id] = true;
    switch (a1.ctor + b1.ctor) {
      case "AllAll":
        var a1_body = a1.body(Var(a1.self+"#"+(dep)), Var(a1.name+"#"+(dep+1)));
        var b1_body = b1.body(Var(a1.self+"#"+(dep)), Var(a1.name+"#"+(dep+1)));
        return a1.eras === b1.eras
            && a1.self === b1.self
            && equal(a1.bind, b1.bind, defs, hols, dep+0, rec)
            && equal(a1_body, b1_body, defs, hols, dep+2, rec);
      case "LamLam":
        var a1_body = a1.body(Var(a1.name+"#"+(dep)));
        var b1_body = b1.body(Var(a1.name+"#"+(dep)));
        return a1.eras === b1.eras
            && equal(a1_body, b1_body, defs, hols, dep+1, rec);
      case "AppApp":
        return a1.eras === b1.eras
            && equal(a1.func, b1.func, defs, hols, dep, rec)
            && equal(a1.argm, b1.argm, defs, hols, dep, rec);
      case "LetLet":
        var a1_body = a1.body(Var(a1.name+"#"+(dep)));
        var b1_body = b1.body(Var(a1.name+"#"+(dep)));
        return equal(a1.expr, b1.expr, defs, hols, dep+0, rec)
            && equal(a1_body, b1_body, defs, hols, dep+1, rec);
      case "AnnAnn":
        return equal(a1.expr, b1.expr, defs, hols, dep, rec);
      case "LocLoc":
        return equal(a1.expr, b1.expr, defs, hols, dep, rec);
      default:
        if (a1.ctor === "Hol") {
          throw [a1.name, b];
        } else if (b1.ctor === "Hol") {
          throw [b1.name, a]
        } else {
          return false;
        }
    }
  };
};

// Type-Checking
// =============

function Err(loc, ctx, msg) {
  return {
    loc: loc || null,
    ctx: ctx || Nil(),
    msg: msg,
  };
};

function typeinfer(term, defs, show = stringify, hols = {}, ctx = Nil(), locs = null) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      var got = deref(term.name, defs);
      if (got) {
        if (got.def.core === undefined) {
          try {
            var typ = typesynth(term.name, defs, show).type;
          } catch (e) {
            throw Err(locs, ctx, e.msg + "\nInside ref... \x1b[2m"+term.name+"\x1b[0m");
          }
        } else if (got.def.core === null) {
          var typ = got.def.type;
        } else {
          var typ = got.def.core.type;
        }
        return [hols, typ];
      } else {
        throw Err(locs, ctx, "Undefined reference '" + term.name + "'.");
      }
    case "Typ":
      return [hols, Typ()];
    case "All":
      var self_var = Ann(true, Var(term.self+"#"+ctx.size), term);
      var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), term.bind);
      var body_ctx = Ext({name:term.self,type:self_var.type}, ctx);
      var body_ctx = Ext({name:term.name,type:name_var.type}, body_ctx);
      var [hols,_] = typecheck(term.bind, Typ(), defs, show, hols, ctx, locs);
      var [hols,_] = typecheck(term.body(self_var,name_var), Typ(), defs, show, hols, body_ctx, locs);
      return [hols, Typ()];
    case "App":
      var [hols,func_typ] = typeinfer(term.func, defs, show, hols, ctx, locs);
      var func_typ = reduce(func_typ, defs, hols, false);
      switch (func_typ.ctor) {
        case "All":
          var self_var = Ann(true, term.func, func_typ);
          var name_var = Ann(true, term.argm, func_typ.bind);
          var [hols,_] = typecheck(term.argm, func_typ.bind, defs, show, hols, ctx, locs);
          var term_typ = func_typ.body(self_var, name_var);
          if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
            throw Err(locs, ctx, "Mismatched erasure.");
          }
          return [hols, term_typ];
        case "Hol":
          var nam0 = new_name();
          var nam1 = new_name();
          var hols = {...hols, [func_typ.name]: (vals) => {
            var all_bind = Hol(nam0, vals);
            var all_body = (s,x) => Hol(nam1, Ext(x, Ext(s, vals)));
            var all_term = All(term.eras, "", "x", all_bind, all_body);
            return all_term;
          }};
          return typeinfer(term, defs, show, hols, ctx, locs);
        default:
          throw Err(locs, ctx, "Non-function application.");
      };
    case "Let":
      var [hols, expr_typ] = typeinfer(term.expr, defs, show, hols, ctx, locs);
      var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      var [hols, body_typ] = typeinfer(term.body(expr_var), defs, show, hols, body_ctx, locs);
      return [hols, body_typ];
    case "Ann":
      if (!term.done) {
        var [hols,_] = typecheck(term.expr, term.type, defs, show, hols, ctx, locs);
        return [hols, term.type];
      } else {
        return [hols, term.type];
      }
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      return typeinfer(term.expr, defs, show, hols, ctx, locs);
    case "Hol":
      var nam0 = new_name();
      var hols = {...hols, [term.name]: (vals) => Ann(false, Hol(term.name, vals), Hol(nam0, vals))};
      return [hols, Hol(nam0, term.vals)];
    case "Cse":
      var [hols, func_typ] = typeinfer(term.func, defs, show, hols, ctx, locs);
      var func_typ = reduce(func_typ, defs, hols, false);
      var hols = {...hols, [term.name]: func_typ};
      try {
        var term_val = build_cse(term, func_typ);
      } catch (err) {
        throw Err(locs, ctx, err);
      }
      return typeinfer(term_val, defs, show, hols, ctx, locs);
    case "Nat":
      var [hols, _] = typeinfer(Ref("Nat"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Nat.zero"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Nat.succ"), defs, show, hols, ctx, locs);
      return [hols, Ref("Nat")];
    case "Chr":
      var [hols, _] = typeinfer(Ref("Char"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Char.new"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit.0"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit.1"), defs, show, hols, ctx, locs);
      return [hols, Ref("Char")];
    case "Str":
      var [hols, _] = typeinfer(Ref("Char"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Char.new"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit.0"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("Bit.1"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("String"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("String.nil"), defs, show, hols, ctx, locs);
      var [hols, _] = typeinfer(Ref("String.cons"), defs, show, hols, ctx, locs);
      return [hols, Ref("String")];
  };
  throw Err(locs, ctx, "Can't infer type.");
};

function typecheck(term, type, defs, show = stringify, hols = {}, ctx = Nil(), locs = null) {
  var typv = reduce(type, defs, hols, false);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = term;
        var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), typv.bind);
        var body_typ = typv.body(self_var, name_var);
        if (term.eras !== typv.eras) {
          throw Err(locs, ctx, "Type mismatch.");
        };
        var body_ctx = Ext({name:term.name,type:name_var.type}, ctx);
        var [hols, _] = typecheck(term.body(name_var), body_typ, defs, show, hols, body_ctx, locs);
        return [hols, type];
      } else if (typv.ctor === "Hol") {
        var nam0 = new_name();
        var nam1 = new_name();
        var hols = {...hols, [typv.name]: (vals) => {
          var all_bind = Hol(nam0, vals);
          var all_body = (s,x) => Hol(nam1, Ext(x, Ext(s, vals)));
          var all_term = All(term.eras, "", "x", all_bind, all_body);
          return all_term;
        }};
        return typecheck(term, type, defs, show, hols, ctx, locs);
      } else {
        throw Err(locs, ctx, "Lambda has a non-function type.");
      }
    case "Let":
      var [hols, expr_typ] = typeinfer(term.expr, defs, show, hols, ctx, locs);
      var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
      var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
      var [hols, _] = typecheck(term.body(expr_var), type, defs, show, hols, body_ctx, locs);
      return [hols, type];
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      var [hols, _] = typecheck(term.expr, type, defs, show, hols, ctx, locs);
      return [hols, type];
    case "Hol":
      return [hols, type];
    case "Wat":
      var ctx = fold(ctx, Nil(), ({name,type}, ctx) => {
        var type = normalize(type, {}, hols, true);
        return Ext({name,type}, ctx);
      });
      var err = Err(locs, ctx,
        "\x1b[1mHole \x1b[4m"+term.name+"\x1b[0m\x1b[1m:\x1b[0m\n" +
        "With type: "+show(normalize(type,{},hols,true),ctx));
      var msg = require("./FormalityLang.js").stringify_err(err, null).replace(/\n*$/g,"");
      HOLE_LOGS[term.name] = msg;
      return [hols, type];
    default:
      var [hols, infr] = typeinfer(term, defs, show, hols, ctx, locs);
      try {
        var eq = equal(type, infr, defs, hols, ctx.size);
      } catch (e) {
        var hols = {...hols, [e[0]]: x => e[1]};
        return typecheck(term, type, defs, show, hols, ctx, locs);
      }
      if (!eq) {
        var type0_str = show(normalize(type, {}, hols, true), ctx);
        var infr0_str = show(normalize(infr, {}, hols, true), ctx);
        var err_ctx = fold(ctx, Nil(), ({name,type}, ctx) => {
          var type = normalize(type, {}, hols, true);
          return Ext({name,type}, ctx);
        });
        throw Err(locs, err_ctx,
          "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
          "Instead of... \x1b[2m"+type0_str+"\x1b[0m");
      } else {
        return [hols, type];
      }
  };
};

function typesynth(name, defs, show = stringify) {
  var {name} = deref(name, defs);
  if (!defs[name].core) {
    defs[name].core = null;
    var term = defs[name].term;
    var type = defs[name].type;
    try {
      var [hols, _] = typecheck(type, Typ(), defs, show, {}, Nil(), null);
      var [hols, type] = typecheck(term, type, defs, show, hols, Nil(), null);
      for (var hol in hols) {
        if (hols[hol] === null) {
          throw Err(null, Nil(), "Unsolved hole: '" + hol + "'.");
        }
      }
    } catch (e) {
      delete defs[name].core;
      throw e;
    }
    var core_term = parse(stringify(canonicalize(term, hols)), 0, "term");
    var core_type = parse(stringify(canonicalize(type, hols)), 0, "term");
    defs[name].core = {term: core_term, type: core_type};
  }
  return defs[name].core;
};

// Names
// =====

function nth_name(n) {
  var str = "";
  ++n;
  while (n > 0) {
    --n;
    str += String.fromCharCode(97 + n % 26);
    n = Math.floor(n / 26);
  }
  return str;
};

var name_count = 0;
function new_name() {
  return nth_name(name_count++).toUpperCase();
};

var HOLE_LOGS = {};

function clear_hole_logs() {
  for (var key in HOLE_LOGS) {
    delete HOLE_LOGS[key];
  }
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
  Wat,
  Hol,
  Cse,
  Nat,
  Chr,
  Str,
  Ext,
  Nil,
  find,
  fold,
  stringify,
  parse,
  build_cse,
  build_nat,
  unloc,
  reduce,
  normalize,
  canonicalize,
  hash,
  equal,
  Err,
  new_name,
  typeinfer,
  typecheck,
  typesynth,
  HOLE_LOGS,
  clear_hole_logs,
  print_str,
};
