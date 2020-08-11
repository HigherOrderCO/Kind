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
  var indx = 0;
  var [ctx, args] = info;
  while (type.ctor === "All") {
    let csev = args[indx];
    if (csev) {
      var bind = type.bind;
      var argm = (function go(bind, ctx) {
        if (bind.ctor === "All") {
          var eras = bind.eras;
          var name = tnam+"."+bind.name;
          var body = x => go(bind.body(bind, bind.bind), Ext([name, x], ctx));
          return Lam(eras, name, body);
        } else {
          return csev(ctx);
        };
      })(type.bind, ctx);
    } else {
      throw "Misformatted case. TODO: improve this error."
    }
    func = App(type.eras, func, argm);
    type = type.body(type, type.bind);
    indx = indx + 1;
  };
  return func;
};

function build_nat(term) {
  if (term.natx === 0n) {
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
      if (defs[term.name]) {
        // If reference wasn't synthetized, synthetize it
        if (defs[term.name].core === undefined) {
          var got = typesynth(term.name, defs).term;
        // If reference is being synthetized, return its version with holes
        } else if (defs[term.name].core === null) {
          var got = defs[term.name].term;
        // If reference was synthetized, return its filled core version
        } else {
          var got = defs[term.name].core.term;
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
      throw () => Err(null, null, "Incomplete program.");
    case "Hol":
      if (hols[term.name]) {
        return canonicalize(hols[term.name](term.vals), hols, to_core, inline_lams);
      } else {
        throw () => Err(null, null, "Unfilled hole: " + term.name + ".");
      }
    case "Cse":
      if (hols[term.name]) {
        return canonicalize(build_cse(term, hols[term.name]), hols, to_core, inline_lams);
      } else {
        throw () => Err(null, null, "Incomplete case.");
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

//var COUNT = 0;
// Are two terms equal?
function equal(a, b, defs, hols, dep = 0, rec = {}) {
  //console.log("eq", stringify(a), stringify(b));
  let a1 = reduce(a, defs, hols, true);
  let b1 = reduce(b, defs, hols, true);
  var ah = hash(a1);
  var bh = hash(b1);
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

// Diagonalization
// ===============

function wide(next, then) {
  return {ctor: "call", deep: false, next, then};
};

function deep(next, then) {
  return {ctor: "call", deep: true, next, then};
};

function fail(msge) {
  return {ctor: "fail", msge};
};

function done(retr) {
  return {ctor: "done", retr};
};

function exec(fn) {
  var wides = [[fn(), {ctor:"Nil"}]];
  var deeps = [];
  var index = 0;
  var error = null;
  while (index < wides.length || deeps.length > 0) {
    if (deeps.length > 0) {
      var got = deeps.pop();
    } else {
      var got = wides[index];
      wides[index++] = null;
    };
    if (got) {
      var [func, cont] = got;
      switch (func.ctor) {
        case "done":
          switch (cont.ctor) {
            case "Nil":
              return func.retr;
            case "Ext":
              deeps.push([cont.head(func.retr), cont.tail]);
              break;
          }
          break;
        case "fail":
          error = func.msge;
          break;
        case "call":
          if (func.deep) {
            for (let i = func.next.length - 1; i >= 0; --i) {
              var next = func.next[i][0](...func.next[i][1]);
              deeps.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
            }
          } else {
            for (let i = 0; i < func.next.length; ++i) {
              var next = func.next[i][0](...func.next[i][1]);
              wides.push([next, {ctor:"Ext",head:func.then,tail:cont}]);
            }
          };
      };
    };
  };
  throw error || "Search failed.";
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
      return "{" + done([hols, Var(term.indx)]) + "}";
    case "Ref":
      var got = defs[term.name];
      if (got) {
        if (got.core === undefined) {
          try {
            var typ = typesynth(term.name, defs, show).type;
          } catch (e) {
            return fail(() => Err(locs, ctx, e().msg + "\nInside ref... \x1b[2m"+term.name+"\x1b[0m"));
          }
        } else if (defs[term.name].core === null) {
          var typ = defs[term.name].type;
        } else {
          var typ = defs[term.name].core.type;
        }
        return done([hols, typ]);
      } else {
        return fail(() => Err(locs, ctx, "Undefined reference '" + term.name + "'."));
      }
    case "Typ":
      return done([hols, Typ()]);
    case "All":
      var self_var = Ann(true, Var(term.self+"#"+ctx.size), term);
      var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), term.bind);
      var body_ctx = Ext({name:term.self,type:self_var.type}, ctx);
      var body_ctx = Ext({name:term.name,type:name_var.type}, body_ctx);
      return (
        deep([[typecheck, [term.bind, Typ(), defs, show, hols, ctx, locs]]], ([hols,_]) =>
        deep([[typecheck, [term.body(self_var,name_var), Typ(), defs, show, hols, body_ctx, locs]]], ([hols,_]) =>
        done([hols, Typ()]))));
    case "App":
      return deep([[typeinfer, [term.func, defs, show, hols, ctx, locs]]], ([hols, func_typ]) => {
        var func_typ = reduce(func_typ, defs, hols, false);
        switch (func_typ.ctor) {
          case "All":
            var self_var = Ann(true, term.func, func_typ);
            var name_var = Ann(true, term.argm, func_typ.bind);
            return deep([[typecheck, [term.argm, func_typ.bind, defs, show, hols, ctx, locs]]], ([hols, _]) => {
              var term_typ = func_typ.body(self_var, name_var);
              if (func_typ.ctor === "All" && term.eras !== func_typ.eras) {
                return fail(() => Err(locs, ctx, "Mismatched erasure."));
              };
              return done([hols, term_typ]);
            });
          case "Hol":
            var nam0 = new_name();
            var nam1 = new_name();
            var hols = {...hols, [func_typ.name]: (vals) => {
              var all_bind = Hol(nam0, vals);
              var all_body = (s,x) => Hol(nam1, Ext(x, Ext(s, vals)));
              var all_term = All(term.eras, "", "x", all_bind, all_body);
              return all_term;
            }};
            return deep([[typeinfer, [term, defs, show, hols, ctx, locs]]], done);
          default:
            return fail(() => Err(locs, ctx, "Non-function application."));
        };
      });
    case "Let":
      return deep([[typeinfer, [term.expr, defs, show, hols, ctx, locs]]], ([hols, expr_typ]) => {
        var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
        var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
        return deep([[typeinfer, [term.body(expr_var), defs, show, hols, body_ctx, locs]]], ([hols, body_typ]) => {
          return done([hols, body_typ]);
        })
      });
    case "Ann":
      if (!term.done) {
        return deep([[typecheck, [term.expr, term.type, defs, show, hols, ctx, locs]]], ([hols, _]) => {
          return done([hols, term.type]);
        });
      } else {
        return done([hols, term.type]);
      }
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      return deep([[typeinfer, [term.expr, defs, show, hols, ctx, locs]]], done);
    case "Hol":
      var nam0 = new_name();
      var hols = {...hols, [term.name]: (vals) => Ann(false, Hol(term.name, vals), Hol(nam0, vals))};
      return done([hols, Hol(nam0, term.vals)]);
    case "Cse":
      return deep([[typeinfer, [term.func, defs, show, hols, ctx, locs]]], ([hols, func_typ]) => {
        var func_typ = reduce(func_typ, defs, hols, false);
        var hols = {...hols, [term.name]: func_typ};
        var term_val = build_cse(term, func_typ);
        return deep([[typeinfer, [term_val, defs, show, hols, ctx, locs]]], done);
      });
    case "Nat":
      return (
        deep([[typeinfer, [Ref("Nat"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Nat.zero"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Nat.succ"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        done([hols, Ref("Nat")])))));
    case "Chr":
      return (
        deep([[typeinfer, [Ref("Char"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Char.new"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit.0"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit.1"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        done([hols, Ref("Char")])))))));
    case "Str":
      return (
        deep([[typeinfer, [Ref("Char"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Char.new"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit.0"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("Bit.1"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("String"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("String.nil"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        deep([[typeinfer, [Ref("String.cons"), defs, show, hols, ctx, locs]]], ([hols, _]) =>
        done([hols, Ref("String")]))))))))));
  };
  return fail(() => Err(locs, ctx, "Can't infer type."));
};

function typecheck(term, type, defs, show = stringify, hols = {}, ctx = Nil(), locs = null) {
  var typv = reduce(type, defs, hols, false);
  switch (term.ctor) {
    case "Lam":
      if (typv.ctor === "All") {
        var self_var = Ann(true, term, type);
        var name_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), typv.bind);
        var body_typ = typv.body(self_var, name_var);
        if (term.eras !== typv.eras) {
          return fail(() => Err(locs, ctx, "Type mismatch."));
        };
        var body_ctx = Ext({name:term.name,type:name_var.type}, ctx);
        return (
          deep([[typecheck, [term.body(name_var), body_typ, defs, show, hols, body_ctx, locs]]], ([hols, _]) =>
          done([hols, type])));
      } else if (typv.ctor === "Hol") {
        var nam0 = new_name();
        var nam1 = new_name();
        var hols = {...hols, [typv.name]: (vals) => {
          var all_bind = Hol(nam0, vals);
          var all_body = (s,x) => Hol(nam1, Ext(x, Ext(s, vals)));
          var all_term = All(term.eras, "", "x", all_bind, all_body);
          return all_term;
        }};
        return deep([[typecheck, [term, type, defs, show, hols, ctx, locs]]], done);
      } else {
        return fail(() => Err(locs, ctx, "Lambda has a non-function type."));
      }
    case "Let":
      return deep([[typeinfer, [term.expr, defs, show, hols, ctx, locs]]], ([hols, expr_typ]) => {
        var expr_var = Ann(true, Var(term.name+"#"+(ctx.size+1)), expr_typ);
        var body_ctx = Ext({name:term.name,type:expr_var.type}, ctx);
        return deep([[typecheck, [term.body(expr_var), type, defs, show, hols, body_ctx, locs]]], ([hols, _]) => {
          return done([hols, type]);
        });
      });
    case "Loc":
      var locs = {from: term.from, upto: term.upto};
      return deep([[typecheck, [term.expr, type, defs, show, hols, ctx, locs]]], ([hols, _]) => {
        return done([hols, type]);
      });
    case "Hol":
      // Registers this hole as unfilled
      if (!hols[term.name]) {
        hols[term.name] = null;
      };

      // If we try to type-check a hole and it is of type `(x : A) -> B`, we
      // first try keeping it as it is. If that doesn't work, then we specialize
      // it as `(x) ?` and try again.
      if (typv.ctor === "All") {
        var path0 = [() => done([hols,type]), []]
        var nam1 = new_name();
        var path1_hols = {...hols, [term.name]: (vals) => {
          return Lam(typv.eras, typv.name||("x"+ctx.size), x => Hol(nam1, Ext(x, vals)));
        }};
        var path1 = [typecheck, [path1_hols[term.name](term.vals), type, defs, show, path1_hols, ctx, locs]];
        return deep([path0, path1], ([hols, _]) => done([hols,type]));

      // If the hole is avariable or an application, then it could possibly be
      // generated by the variables in the scope of the hole. For example, if a
      // hole `?x : A` has the following variables in scope:
      // - f : A -> A
      // - g : A -> A -> A
      // - h : A -> B
      // - i : A -> A -> B
      // - x : A
      // - y : A
      // Then `x`, `y`, `f(x)`, `f(f(x))`, `g(x)(y)`, and other combinations
      // could be used to fill the hole. As such, we specialize the hole to 4
      // alternatives: `{(f _), (g _ _), x, y}`, and start a wide search to see
      // if any of those work. We don't include `h(_)` since the type returned
      // by `h` is `B`, so it wouldn't be right. TODO: usage information to
      // shrink search space on linear variables?
      } else if (typv.ctor === "App" || typv.ctor === "Var") {
        var new_hols = [];
        //console.log("----------------", show(typv));
        fold(term.vals, i => null, (val, cont) => i => {
          // Get the return type of the context variable
          var cmp0 = reduce(val.type, defs, hols, false);
          var cmp1 = typv;
          while (cmp0.ctor === "All") { cmp0 = reduce(cmp0.body(Ref("^"), Ref("^")), {}); }
          while (cmp0.ctor === "App") { cmp0 = reduce(cmp0.func, {}); }
          while (cmp1.ctor === "App") { cmp1 = reduce(cmp1.func, {}); }
          //console.log("cmp0", show(cmp0));
          //console.log("cmp1", show(cmp1));
          // Checks if it is compatible with the hole's type
          try {
            var is_compatible = equal(cmp0, cmp1, defs, {});
          } catch (e) {
            var is_compatible = true;
          }
          //console.log("- ", show(val.expr), ":", show(val.type), "|", is_compatible);
          //is_compatible = true;
          // If so, specialize the hole as this var applied to other holes
          if (is_compatible) {
            var nam0 = new_name();
            new_hols.push({...hols, [term.name]: (vals) => {
              var hole = at(vals, i);
              var type = reduce(val.type, defs, hols, false);
              var arit = 0; 
              while (type.ctor === "All") {
                hole = App(type.eras, hole, Hol(nam0 + (arit++), vals));
                type = reduce(type.body(Ref("^"),Ref("^")), defs, hols, false);
              };
              return hole;
            }});
          };
          cont(i + 1);
        })(0);
        var wides = new_hols.map((hols,i) => {
          return [typecheck, [hols[term.name](term.vals), type, defs, show, hols, ctx, locs]];
        });
        return wide(wides, ([hols,_]) => done([hols, type]));

      // Otherwise, we don't have any useful information, so we just keep it
      } else {
        return done([hols, type]);
      };
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
      return done([hols, type]);
    default:
      return deep([[typeinfer, [term, defs, show, hols, ctx, locs]]], ([hols, infr]) => {
        try {
          var eq = equal(type, infr, defs, hols, ctx.size);
          if (!eq) {
            return fail(() => {
              var type0_str = show(normalize(type, {}, hols, true), ctx);
              var infr0_str = show(normalize(infr, {}, hols, true), ctx);
              var err_ctx = fold(ctx, Nil(), ({name,type}, ctx) => {
                var type = normalize(type, {}, hols, true);
                return Ext({name,type}, ctx);
              });
              return Err(locs, err_ctx,
                "Found type... \x1b[2m"+infr0_str+"\x1b[0m\n" +
                "Instead of... \x1b[2m"+type0_str+"\x1b[0m")
            });
          } else {
            return done([hols, type]);
          }
        // Equal filled a hole, so we try again
        } catch (e) {
          var hols = {...hols, [e[0]]: x => e[1]};
          return deep([[typecheck, [term, type, defs, show, hols, ctx, locs]]], done);
        };
      });
  };
};

function typesynth(name, defs, show = stringify) {
  if (!defs[name].core) {
    defs[name].core = null;
    var term = defs[name].term;
    var type = defs[name].type;
    try {
      var [hols,_] = exec(() =>
        deep([[typecheck, [type, Typ(), defs, show, {}, Nil(), null]]], ([hols,_]) =>
        deep([[typecheck, [term, type, defs, show, hols, Nil(), null]]], ([hols,type]) => {
          for (var hol in hols) {
            if (hols[hol] === null) {
              return fail(() => Err(null, Nil(), "Unsolved hole: '" + hol + "'."));
            }
          }
          return done([hols,type])
        })));
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
