// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An FM-Lang term is an ADT represented as a JSON.
// - Var: a variable
// - Typ: the type of types, `Type`
// - All: the dependent function type, `{x : A} -> B`, optionally erased
// - Lam: a lambda, `{x} => B`, optionally erased/annotated
// - App: an application `(f a)`, optionally erased
// - Box: a boxed type, `!A`
// - Put: a boxed value, `#a`
// - Dup: copies a boxed value, `dup x = a; b`
// - U32: type of a native number
// - Num: value of a native number
// - Op1: partially applied binary numeric operation, `|n + k|`, with `k` fixed
// - Op2: binary numeric operation, `|x + y|`
// - Ite: if-then-else, `if n p`,  with a numeric conditional `n`, and two branches in a pair `p`
// - Cpy: copies a number, `cpy x = a; b`
// - Sig: type of a dependent pair, `[x : A, (B x)]`, or of a dependent intersection, `[x : A ~ (B x)]`
// - Par: value of a dependent pair, `[a, b]`, or of a dependent intersection `[a ~ b]`
// - Fst: extracts 1st value of a dependent pair, `fst p`, or of a dependent intersection, `~fst p`
// - Snd: extracts 2nd value of a dependent pair, `snd p`, or of a dependent intersection, `~snd p`
// - Prj: projects a dependent pair, `get [x , y] = a; b`, or a dependent intersection, `get [x ~ y] = a; b`
// - Eql: erased untyped equality type, `<a = b>`
// - Rfl: reflexivity, i.e., a proof that a value is equal to itself, `$a`
// - Sym: symmetry of equality, `sym e`
// - Rwt: rewrite equal terms in types, `rwt e <x @ (P x)> a`
// - Cst: casts a value to the type of another value equal to it, `cst e a b`
// - Ann: an explicit type annotaion, `: A a`
// - Ref: a reference to a global def
const Var = (index)                        => ["Var", {index}];
const Typ = ()                             => ["Typ", {}];
const All = (name, bind, body, eras)       => ["All", {name, bind, body, eras}];
const Lam = (name, bind, body, eras)       => ["Lam", {name, bind, body, eras}];
const App = (func, argm, eras)             => ["App", {func, argm, eras}];
const Box = (expr)                         => ["Box", {expr}];
const Put = (expr)                         => ["Put", {expr}];
const Dup = (name, expr, body)             => ["Dup", {name, expr, body}];
const U32 = ()                             => ["U32", {}];
const Num = (numb)                         => ["Num", {numb}];
const Op1 = (func, num0, num1)             => ["Op1", {func, num0, num1}];
const Op2 = (func, num0, num1)             => ["Op2", {func, num0, num1}];
const Ite = (cond, pair)                   => ["Ite", {cond, pair}];
const Cpy = (name, numb, body)             => ["Cpy", {name, numb, body}];
const Sig = (name, typ0, typ1, eras)       => ["Sig", {name, typ0, typ1, eras}];
const Par = (val0, val1, eras)             => ["Par", {val0, val1, eras}];
const Fst = (pair, eras)                   => ["Fst", {pair, eras}];
const Snd = (pair, eras)                   => ["Snd", {pair, eras}];
const Prj = (nam0, nam1, pair, body, eras) => ["Prj", {nam0, nam1, pair, body, eras}];
const Eql = (val0, val1)                   => ["Eql", {val0, val1}];
const Rfl = (expr)                         => ["Rfl", {expr}];
const Sym = (prof)                         => ["Sym", {prof}];
const Rwt = (prof, name, type, expr)       => ["Rwt", {prof, name, type, expr}];
const Cst = (prof, val0, val1)             => ["Cst", {prof, val0, val1}];
const Slf = (name, type)                   => ["Slf", {name, type}];
const New = (type, expr)                   => ["New", {type, expr}];
const Use = (expr)                         => ["Use", {expr}];
const Ann = (type, expr, done)             => ["Ann", {type, expr, done}];
const Ref = (name, eras)                   => ["Ref", {name, eras}];

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = (code) => {
  function is_space(char) {
    return char === " " || char === "\t" || char === "\n" || char === "\r" || char === ";";
  }

  function is_newline(char) {
    return char === "\n";
  }

  function is_name_char(char) {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-".indexOf(char) !== -1;
  }

  function next() {
    if (is_newline(code[idx])) {
      row += 1;
      col = 0;
    } else {
      col += 1;
    }
    idx += 1;
  }

  function skip_spaces() {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  function next_char() {
    skip_spaces();
    while (code.slice(idx, idx + 2) === "//") {
      while (code[idx] !== "\n" && idx < code.length) {
        next();
      }
      skip_spaces();
    }
  }

  function match(string) {
    next_char();
    var sliced = code.slice(idx, idx + string.length);
    if (sliced === string) {
      for (var i = 0; i < string.length; ++i) {
        next();
      }
      return true;
    }
    return false;
  }

  function is_sigma(string) {
    var i = idx;
    while (i < code.length && is_name_char(code[i])) { ++i; }
    while (i < code.length && is_space(code[i])) { ++i; }
    return code[i] === ":";
  }

  function parse_exact(string) {
    if (!match(string)) {
      var text = "";
      var part = "";
      text += "Parse error: expected '" + string + "' ";
      text += "on line " + (row+1) + ", col " + col + ", but found '" + code[idx] + "' instead. Relevant code:\n";
      for (var ini = idx, il = 0; il < 6 && ini >=          0; --ini) if (code[ini] === "\n") ++il;
      for (var end = idx, el = 0; el < 6 && end < code.length; ++end) if (code[end] === "\n") ++el;
      part += code.slice(ini+1, idx) + "<HERE>" + code.slice(idx, end);
      text += part.split("\n").map((line,i) => ("    " + (row-il+i+1)).slice(-4) + "| " + line).join("\n");
      throw text;
    }
  }

  function parse_string(fn = is_name_char) {
    next_char();
    var name = "";
    while (idx < code.length && fn(code[idx])) {
      name = name + code[idx];
      next();
    }
    return name;
  }

  function parse_term(ctx) {
    // Type
    if (match("Type")) {
      return Typ();
    }

    // Application
    else if (match("(")) {
      var term = parse_term(ctx);
      while (idx < code.length && !match(")")) {
        var eras = match("~");
        var argm = parse_term(ctx);
        var term = App(term, argm, eras);
        next_char();
      }
      return term;
    }

    // Lambdas and Forall
    else if (match("{")) {
      var erase = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        erase.push(match("~"));
        names.push(parse_string());
        types.push(match(":") ? parse_term(ctx.concat(names.slice(0,-1))) : null);
        if (match("}")) {
          break;
        } else {
          parse_exact(",");
        }
      }
      var isall = match("->");
      var islam = match("=>");
      if (!isall && !islam) {
        // TODO: error
      }
      var term = parse_term(ctx.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        var ctr = isall ? All : Lam;
        term = ctr(names[i], types[i], term, erase[i]);
        if (isall && !types[i]) {
          throw "Parse error: invalid forall on line " + (row+1) + ", col " + col + ".";
        }
      }
      return term;
    }

    // Duplication
    else if (match("dup ")) {
      var name = parse_string();
      var expr = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      return Dup(name, expr, body);
    }

    // Box
    else if (match("!")) {
      var expr = parse_term(ctx);
      return Box(expr);
    }

    // Put
    else if (match("#")) {
      var expr = parse_term(ctx);
      return Put(expr);
    }

    // Let
    else if (match("let ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var copy = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      return subst(body, copy, 0);
    }

    // U32
    else if (match("U32")) {
      return U32();
    }

    // Operation
    else if (match("|")) {
      var num0 = parse_term(ctx);
      var func = parse_string(c => !is_space(c));
      var num1 = parse_term(ctx);
      var skip = parse_exact("|");
      return Op2(func, num0, num1);
    }

    // String
    else if (match("\"")) {
      // Parses text
      var text = "";
      while (code[idx] !== "\"") {
        text += code[idx];
        next();
      }
      next();
      return text_to_term(text);
    }

    // Nat
    //else if (match("^")) {
      //var name = parse_string();
      //var numb = Number(name);
      //return numb_to_term(numb);
    //}

    // PBT
    //else if (match("&")) {
      //var name = parse_string();
      //var numb = Number(name);
      //return numb_to_tree_term(numb);
    //}

    // If-Then-Else
    else if (match("if ")) {
      var cond = parse_term(ctx);
      var pair = parse_term(ctx);
      return Ite(cond, pair);
    }

    // Copy
    else if (match("cpy ")) {
      var name = parse_string();
      let skip = parse_exact("=");
      var numb = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      return Cpy(name, numb, body);
    }

    // Sigma / Pair
    else if (match("[")) {
      // Sigma
      if (is_sigma()) {
        var name = parse_string();
        var skip = parse_exact(":");
        var typ0 = parse_term(ctx);
        var eras = match("~");
        var skip = eras ? null : parse_exact(",");
        var typ1 = parse_term(ctx.concat([name]));
        var skip = parse_exact("]");
        return Sig(name, typ0, typ1, eras);
      // Pair
      } else {
        var val0 = parse_term(ctx);
        var eras = match("~");
        var skip = eras ? null : parse_exact(",");
        var val1 = parse_term(ctx);
        var skip = parse_exact("]");
        return Par(val0, val1, eras);
      }
    }

    // Pair (If-Then-Else sugar)
    else if (match("then:")) {
      var val0 = parse_term(ctx);
      var skip = parse_exact("else:");
      var val1 = parse_term(ctx);
      return Par(val0, val1, false);
    }

    // First
    else if (match("fst ")) {
      var pair = parse_term(ctx);
      return Fst(pair, false);
    }

    // First (erased)
    else if (match("~fst ")) {
      var pair = parse_term(ctx);
      return Fst(pair, true);
    }

    // Second
    else if (match("snd ")) {
      var pair = parse_term(ctx);
      return Snd(pair, false);
    }

    // Second (erased)
    else if (match("~snd ")) {
      var pair = parse_term(ctx);
      return Snd(pair, true);
    }

    // Projection
    else if (match("get ")) {
      var skip = parse_exact("[");
      var nam0 = parse_string();
      var skip = parse_exact(",");
      var eras = match("~");
      var nam1 = parse_string();
      var skip = parse_exact("]");
      var pair = parse_term(ctx);
      var body = parse_term(ctx.concat([nam0, nam1]));
      return Prj(nam0, nam1, pair, body, eras);
    }

    // Equality
    else if (match("<")) {
      var val0 = parse_term(ctx);
      var skip = parse_exact("==");
      var val1 = parse_term(ctx);
      var skip = parse_exact(">");
      return Eql(val0, val1);
    }

    // Reflexivity
    else if (match("rfl")) {
      var expr = parse_term(ctx);
      return Rfl(expr);
    }

    // Symmetry
    else if (match("sym")) {
      var prof = parse_term(ctx);
      return Sym(prof);
    }

    // Rewrite
    else if (match("rwt")) {
      var prof = parse_term(ctx);
      var skip = parse_exact("<");
      var name = parse_string();
      var skip = parse_exact("@");
      var type = parse_term(ctx.concat([name]));
      var skip = parse_exact(">");
      var expr = parse_term(ctx);
      return Rwt(prof, name, type, expr);
    }

    // Cast
    else if (match("cst")) {
      var prof = parse_term(ctx);
      var val0 = parse_term(ctx);
      var val1 = parse_term(ctx);
      return Cst(prof, val0, val1);
    }

    // Projection
    else if (match(":")) {
      var type = parse_term(ctx);
      var expr = parse_term(ctx);
      return Ann(type, expr, false);
    }

    // Identiy
    else if (match("=")) {
      var expr = parse_term(ctx);
      return expr;
    }

    // Slf
    else if (match("$")) {
      var name = parse_string();
      var type = parse_term(ctx.concat([name]));
      return Slf(name, type);
    }

    // New
    else if (match("@")) {
      var type = parse_term(ctx);
      var expr = parse_term(ctx);
      return New(type, expr);
    }

    // Use
    else if (match("%")) {
      var expr = parse_term(ctx);
      return Use(expr);
    }

    // Variable / Reference
    else {
      var name = parse_string();
      var numb = Number(name);
      if (!isNaN(numb)) {
        return Num(numb >>> 0);
      }
      var skip = 0;
      while (match("'")) {
        skip += 1;
      }
      for (var i = ctx.length - 1; i >= 0; --i) {
        if (ctx[i] === name) {
          if (skip === 0) break;
          else skip -= 1;
        }
      }
      if (i === -1) {
        return Ref(name, false);
      } else {
        return Var(ctx.length - i - 1);
      }
    }
  }

  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  while (idx < code.length) {
    next_char();

    if (match("def ")) {
      var name = parse_string();
      var term = parse_term([]);
      defs[name] = term;
    } else if (match("data ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_ctx = [adt_name];
      if (match("<")) {
        while (idx < code.length) {
          var eras = false;
          var name = parse_string(); 
          var skip = parse_exact(":");
          var type = parse_term(adt_pram.map((([name,type]) => name)));
          adt_pram.push([name, type, eras]);
          if (match(">")) break; else parse_exact(",");
        }
      }
      var adt_ctx = adt_ctx.concat(adt_pram.map(([name,type]) => name));
      if (match("{")) {
        while (idx < code.length) {
          //var eras = match("~");
          var eras = false;
          var name = parse_string(); 
          var skip = parse_exact(":");
          var type = parse_term(adt_ctx.concat(adt_indx.map((([name,type]) => name))));
          adt_indx.push([name, type, eras]);
          if (match("}")) break; else parse_exact(",");
        }
      }
      while (match("|")) {
        var ctor_name = parse_string();
        var ctor_flds = [];
        if (match("{")) {
          while (idx < code.length) {
            var eras = match("~");
            var name = parse_string();
            var skip = parse_exact(":");
            var type = parse_term(adt_ctx.concat(ctor_flds.map(([name,type]) => name)));
            ctor_flds.push([name, type, eras]);
            if (match("}")) break; else parse_exact(",");
          }
        }
        var ctor_skip = parse_exact(":");
        var ctor_type = parse_term(adt_ctx.concat(ctor_flds.map(([name,type]) => name)));
        adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
      }
      var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
      defs[adt_name] = derive_adt_type(adt);
      for (var c = 0; c < adt_ctor.length; ++c) {
        defs[adt_name + "." + adt_ctor[c][0]] = derive_adt_ctor(adt, c);
      }
    }
    next_char();
  }

  return defs;
}

// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

// Generates a name
const gen_name = (n) => {
  var str = "";
  ++n;
  while (n > 0) {
    --n;
    str += String.fromCharCode(97 + n % 26);
    n = Math.floor(n / 26);
  }
  return str;
};

// Converts a term to a string
const show = ([ctor, args], nams = []) => {
  switch (ctor) {
    case "Var":
      var name = nams[nams.length - args.index - 1];
      if (!name) {
        return "^" + args.index;
      } else {
        var suff = "";
        for (var i = 0; i < args.index - 1; ++i) {
          if (nams[nams.length - i - 1] === name) {
            var suff = suff + "'";
          }
        }
        return name + suff;
      }
    case "Typ":
      return "Type";
    case "All":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].bind, nams.concat(names.slice(0,-1))));
        term = term[1].body;
      }
      var text = "{";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + " : " + types[i];
        text += i < names.length - 1 ? ", " : "";
      }
      text += "} -> ";
      text += show(term, nams.concat(names));
      return text;
    case "Lam":
      var term = [ctor, args];
      var numb = null;
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "Lam") {
        numb = term_to_numb(term);
        if (numb !== null) {
          break;
        } else {
          erase.push(term[1].eras);
          names.push(term[1].name);
          types.push(term[1].bind ? show(term[1].bind, nams.concat(names.slice(0,-1))) : null);
          term = term[1].body;
        }
      }
      var text = "{";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + (types[i] !== null ? " : " + types[i] : "");
        text += i < names.length - 1 ? ", " : "";
      }
      text += "} => ";
      if (numb !== null) {
        text += "%" + Number(numb);
      } else {
        text += show(term, nams.concat(names));
      }
      return text;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = " " + (term[1].eras ? "~" : "") + show(term[1].argm, nams) + text;
        term = term[1].func;
      }
      return "(" + show(term, nams) + text;
    case "Box":
      var expr = show(args.expr, nams);
      return "!" + expr;
    case "Put":
      var expr = show(args.expr, nams);
      return "#" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, nams);
      var body = show(args.body, nams.concat([name]));
      return "dup " + name + " = " + expr + "; " + body;
    case "U32":
      return "U32";
    case "Num":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, nams);
      var num1 = show(args.num1, nams);
      return "|" + num0 + " " + func + " " + num1 + "|";
    case "Ite":
      var cond = show(args.cond, nams);
      var pair = show(args.pair, nams);
      return "(if " + cond + " " + pair + ")";
    case "Cpy":
      var name = args.name;
      var numb = show(args.numb, nams);
      var body = show(args.body, nams.concat([name]));
      return "cpy " + name + " = " + numb + "; " + body;
    case "Sig":
      var name = args.name;
      var typ0 = show(args.typ0, nams);
      var typ1 = show(args.typ1, nams.concat([name]));
      var comm = args.eras ? " ~ " : ",";
      return "[" + name + " : " + typ0 + comm + typ1 + "]";
    case "Par":
      var text = term_to_text([ctor, args]);
      if (text !== null) {
        return "\"" + text + "\"";
      } else {
        var val0 = show(args.val0, nams);
        var val1 = show(args.val1, nams);
        var eras = args.eras ? "~" : "";
        return "[" + val0 + ", " + eras + val1 + "]";
      }
    case "Fst":
      var pair = show(args.pair, nams);
      var eras = args.eras ? "~" : "";
      return "(" + eras + "fst " + pair + ")";
    case "Snd":
      var pair = show(args.pair, nams);
      var eras = args.eras ? "~" : "";
      return "(" + eras + "snd " + pair + ")";
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, nams);
      var body = show(args.body, nams.concat([nam0, nam1]));
      var eras = args.eras ? "~" : "";
      return "get [" + nam0 + "," + eras + nam1 + "] = " + pair + "; " + body + "";
    case "Eql":
      var val0 = show(args.val0, nams);
      var val1 = show(args.val1, nams);
      return "<" + val0 + " == " + val1 + ">";
    case "Rfl":
      var expr = show(args.expr, nams);
      return "(rfl " + expr + ")";
    case "Sym":
      var prof = show(args.prof, nams);
      return "(sym " + prof + ")";
    case "Rwt":
      var prof = show(args.prof, nams);
      var name = args.name;
      var type = show(args.type, nams.concat([name]));
      var expr = show(args.expr, nams);
      return "(rwt " + prof + " <" + name + " @ " + type + "> " + expr + ")";
    case "Cst":
      var prof = show(args.prof, nams);
      var val0 = show(args.val0, nams);
      var val1 = show(args.val1, nams);
      return "(cst " + prof + " " + val0 + " " + val1 + ")";
    case "Slf":
      var name = args.name;
      var type = show(args.type, nams.concat([name]));
      return "$" + name + " " + type;
    case "New":
      var type = show(args.type, nams);
      var expr = show(args.expr, nams);
      return "@" + type + " " + expr;
    case "Use":
      var expr = show(args.expr, nams);
      return "%" + expr;
    case "Ann":
      var expr = show(args.expr, nams);
      return expr;
    case "Ref":
      return args.name;
  }
};

// ::::::::::::::::::
// :: Substitution ::
// ::::::::::::::::::

// Shifts a term
const shift = ([ctor, term], inc, depth) => {
  switch (ctor) {
    case "Var":
      return Var(term.index < depth ? term.index : term.index + inc);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = shift(term.bind, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = term.bind && shift(term.bind, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      var eras = term.eras;
      return Lam(name, bind, body, eras);
    case "App":
      var func = shift(term.func, inc, depth);
      var argm = shift(term.argm, inc, depth);
      var eras = term.eras;
      return App(func, argm, term.eras);
    case "Box":
      var expr = shift(term.expr, inc, depth);
      return Box(expr);
    case "Put":
      var expr = shift(term.expr, inc, depth);
      return Put(expr);
    case "Dup":
      var name = term.name;
      var expr = shift(term.expr, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      return Dup(name, expr, body);
    case "U32":
      return U32();
    case "Num":
      var numb = term.numb;
      return Num(numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = shift(term.num0, inc, depth);
      var num1 = shift(term.num1, inc, depth);
      return Op2(func, num0, num1);
    case "Ite":
      var cond = shift(term.cond, inc, depth);
      var pair = shift(term.pair, inc, depth);
      return Ite(cond, pair);
    case "Cpy":
      var name = term.name;
      var numb = shift(term.numb, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      return Cpy(name, numb, body);
    case "Sig":
      var name = term.name;
      var typ0 = shift(term.typ0, inc, depth);
      var typ1 = shift(term.typ1, inc, depth + 1);
      var eras = term.eras;
      return Sig(name, typ0, typ1, eras);
    case "Par":
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      var eras = term.eras;
      return Par(val0, val1, eras);
    case "Fst":
      var pair = shift(term.pair, inc, depth);
      var eras = term.eras;
      return Fst(pair, eras);
    case "Snd":
      var pair = shift(term.pair, inc, depth);
      var eras = term.eras;
      return Snd(pair, eras);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = shift(term.pair, inc, depth);
      var body = shift(term.body, inc, depth + 2);
      var eras = term.eras;
      return Prj(nam0, nam1, pair, body, eras);
    case "Eql":
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      return Eql(val0, val1);
    case "Rfl":
      var expr = shift(term.expr, inc, depth);
      return Rfl(expr);
    case "Sym":
      var prof = shift(term.prof, inc, depth);
      return Sym(prof);
    case "Rwt":
      var prof = shift(term.prof, inc, depth);
      var name = term.name;
      var type = shift(term.type, inc, depth + 1);
      var expr = shift(term.expr, inc, depth);
      return Rwt(prof, name, type, expr);
    case "Cst":
      var prof = shift(term.prof, inc, depth);
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      return Cst(prof, val0, val1);
    case "Slf":
      var name = term.name;
      var type = shift(term.type, inc, depth + 1);
      return Slf(name, type);
    case "New":
      var type = shift(term.type, inc, depth);
      var expr = shift(term.expr, inc, depth);
      return New(type, expr);
    case "Use":
      var expr = shift(term.expr, inc, depth);
      return Use(expr);
    case "Ann":
      var type = shift(term.type, inc, depth);
      var expr = shift(term.expr, inc, depth);
      var done = term.done;
      return Ann(type, expr, done);
    case "Ref":
      return Ref(term.name, term.eras);
  }
}

// Substitution
const subst = ([ctor, term], val, depth) => {
  switch (ctor) {
    case "Var":
      return depth === term.index ? val : Var(term.index - (term.index > depth ? 1 : 0));
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = term.bind && subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return Lam(name, bind, body, eras);
    case "App":
      var func = subst(term.func, val, depth);
      var argm = subst(term.argm, val, depth);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Box":
      var expr = subst(term.expr, val, depth);
      return Box(expr);
    case "Put":
      var expr = subst(term.expr, val, depth);
      return Put(expr);
    case "Dup":
      var name = term.name;
      var expr = subst(term.expr, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Dup(name, expr, body);
    case "U32":
      return U32();
    case "Num":
      var numb = term.numb;
      return Num(numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = subst(term.num0, val, depth);
      var num1 = subst(term.num1, val, depth);
      return Op2(func, num0, num1);
    case "Ite":
      var cond = subst(term.cond, val, depth);
      var pair = subst(term.pair, val, depth);
      return Ite(cond, pair);
    case "Cpy":
      var name = term.name;
      var numb = subst(term.numb, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Cpy(name, numb, body);
    case "Sig":
      var name = term.name;
      var typ0 = subst(term.typ0, val, depth);
      var typ1 = subst(term.typ1, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return Sig(name, typ0, typ1, eras);
    case "Par":
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      var eras = term.eras;
      return Par(val0, val1, eras);
    case "Fst":
      var pair = subst(term.pair, val, depth);
      var eras = term.eras;
      return Fst(pair, eras);
    case "Snd":
      var pair = subst(term.pair, val, depth);
      var eras = term.eras;
      return Snd(pair, eras);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = subst(term.pair, val, depth);
      var body = subst(term.body, val && shift(val, 2, 0), depth + 2);
      var eras = term.eras;
      return Prj(nam0, nam1, pair, body, eras);
    case "Eql":
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      return Eql(val0, val1);
    case "Rfl":
      var expr = subst(term.expr, val, depth);
      return Rfl(expr);
    case "Sym":
      var prof = subst(term.prof, val, depth);
      return Sym(prof);
    case "Rwt":
      var prof = subst(term.prof, val, depth);
      var name = term.name;
      var type = subst(term.type, val && shift(val, 1, 0), depth + 1);
      var expr = subst(term.expr, val, depth);
      return Rwt(prof, name, type, expr);
    case "Cst":
      var prof = subst(term.prof, val, depth);
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      return Cst(prof, val0, val1);
    case "Slf":
      var name = term.name;
      var type = subst(term.type, val && shift(val, 1, 0), depth + 1);
      return Slf(name, type);
    case "New":
      var type = subst(term.type, val, depth);
      var expr = subst(term.expr, val, depth);
      return New(type, expr);
    case "Use":
      var expr = subst(term.expr, val, depth);
      return Use(expr);
    case "Ann":
      var type = subst(term.type, val, depth);
      var expr = subst(term.expr, val, depth);
      var done = term.done;
      return Ann(type, expr, done);
    case "Ref":
      var name = term.name;
      return Ref(name, term.eras);
  }
}

const subst_many = (term, vals, depth) => {
  for (var i = 0; i < vals.length; ++i) {
    term = subst(term, shift(vals[i], vals.length - i - 1, 0), depth + vals.length - i - 1);
  }
  return term;
}

// ::::::::::::::::::::
// :: Stratification ::
// ::::::::::::::::::::

// How many times a variable was used in computational positions
const uses = ([ctor, term], depth = 0) => {
  switch (ctor) {
    case "Var": return term.index === depth ? 1 : 0;
    case "Typ": return 0;
    case "All": return 0;
    case "Lam": return uses(term.body, depth + 1);
    case "App": return uses(term.func, depth) + (term.eras ? 0 : uses(term.argm, depth));
    case "Box": return 0;
    case "Put": return uses(term.expr, depth);
    case "Dup": return uses(term.expr, depth) + uses(term.body, depth + 1);
    case "U32": return 0;
    case "Num": return 0;
    case "Op1": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Op2": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Ite": return uses(term.cond, depth) + uses(term.pair, depth);
    case "Cpy": return uses(term.numb, depth) + uses(term.body, depth + 1);
    case "Sig": return 0;
    case "Par": return uses(term.val0, depth) + (term.eras ? 0 : uses(term.val1, depth));
    case "Fst": return uses(term.pair, depth);
    case "Snd": return uses(term.pair, depth);
    case "Prj": return uses(term.pair, depth) + uses(term.body, depth + 2);
    case "Eql": return 0;
    case "Rfl": return uses(term.expr, depth);
    case "Sym": return 0;
    case "Rwt": return 0;
    case "Cst": return 0;
    case "Slf": return 0;
    case "New": return uses(term.expr, depth);
    case "Use": return uses(term.expr, depth);
    case "Ann": return uses(term.expr, depth);
    case "Ref": return 0;
  }
}

// Checks if variable only occurs at a specific relative level
const is_at_level = ([ctor, term], at_level, depth = 0, level = 0) => {
  switch (ctor) {
    case "Var": return term.index !== depth || level === at_level;
    case "Typ": return true;
    case "All": return true;
    case "Lam": return is_at_level(term.body, at_level, depth + 1, level);
    case "App": return is_at_level(term.func, at_level, depth, level) && (term.eras ? true : is_at_level(term.argm, at_level, depth, level));
    case "Box": return true;
    case "Put": return is_at_level(term.expr, at_level, depth, level + 1);
    case "Dup": return is_at_level(term.expr, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "U32": return true;
    case "Num": return true;
    case "Op1": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Op2": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Ite": return is_at_level(term.cond, at_level, depth, level) && is_at_level(term.pair, at_level, depth, level);
    case "Cpy": return is_at_level(term.numb, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Sig": return true;
    case "Par": return is_at_level(term.val0, at_level, depth, level) && is_at_level(term.val1, at_level, depth, level);
    case "Fst": return is_at_level(term.pair, at_level, depth, level);
    case "Snd": return is_at_level(term.pair, at_level, depth, level);
    case "Prj": return is_at_level(term.pair, at_level, depth, level) && is_at_level(term.body, at_level, depth + 2, level);
    case "Ann": return is_at_level(term.expr, at_level, depth, level);
    case "Pri": return is_at_level(term.argm, at_level, depth, level);
    case "Eql": return true;
    case "Rfl": return is_at_level(term.expr, at_level, depth, level);
    case "Sym": return true;
    case "Rwt": return true;
    case "Cst": return true;
    case "Slf": return true;
    case "New": return is_at_level(term.expr, at_level, depth, level);
    case "Use": return is_at_level(term.expr, at_level, depth, level);
    case "Ref": return true;
  }
}

// Checks if a term is stratified
const check = ([ctor, term], defs = {}, ctx = []) => {
  switch (ctor) {
    case "All":
      break;
    case "Lam":
      if (uses(term.body) > 1) {
        throw "[ERROR]\nLambda variable `" + term.name + "` used more than once in:\n" + show([ctor, term], ctx);
      }
      if (!is_at_level(term.body, 0)) {
        throw "[ERROR]\nLambda variable `" + term.name + "` used inside a box in:\n" + show([ctor, term], ctx);
      }
      check(term.body, defs, ctx.concat([term.name]));
      break;
    case "App":
      check(term.func, defs, ctx);
      if (!term.eras) {
        check(term.argm, defs, ctx);
      }
      break;
    case "Box":
      break;
    case "Put":
      check(term.expr, defs, ctx);
      break;
    case "Dup":
      if (!is_at_level(term.body, 1)) {
        throw "[ERROR]\nDuplication variable `" + term.name + "` must always have exactly 1 enclosing box on the body of:\n" + show([ctor, term], ctx);
      }
      check(term.expr, defs, ctx);
      check(term.body, defs, ctx.concat([term.name]));
      break;
    case "Op1":
    case "Op2":
      check(term.num0, defs, ctx);
      check(term.num1, defs, ctx);
      break;
    case "Ite":
      check(term.cond, defs, ctx);
      check(term.pair, defs, ctx);
      break;
    case "Cpy":
      check(term.numb, defs, ctx);
      check(term.body, defs, ctx.concat([term.name]));
      break;
    case "Sig":
      break;
    case "Par":
      check(term.val0, defs, ctx);
      if (!term.eras) {
        check(term.val1, defs, ctx);
      }
      break;
    case "Fst":
      check(term.pair, defs, ctx);
      break;
    case "Snd":
      check(term.pair, defs, ctx);
      break;
    case "Prj":
      var uses0 = uses(term.body, 1);
      var uses1 = uses(term.body, 0);
      var isat0 = is_at_level(term.body, 0, 1);
      var isat1 = is_at_level(term.body, 0, 0);
      if (uses0 > 1 || uses1 > 1) {
        throw "[ERROR]\nProjection variable `" + (uses0 > 1 ? term.nam0 : term.nam1) + "` used more than once in:\n" + show([ctor, term], ctx);
      }
      if (!isat0 || !isat1) {
        throw "[ERROR]\nProjection variable `" + (!isat0 ? term.nam0 : term.nam1) + "` used inside a box in:\n" + show([ctor, term], ctx);
      }
      check(term.pair, defs, ctx);
      check(term.body, defs, ctx.concat([term.nam0, term.nam1]));
      break;
    case "Eql":
      break;
    case "Rfl":
      check(term.expr, defs, ctx);
      break;
    case "Sym":
      break;
    case "Rwt":
      break;
    case "Cst":
      break;
    case "Ann":
      check(term.expr, defs, ctx);
      break;
    case "Slf":
      break;
    case "New":
      check(term.expr, defs, ctx);
      break;
    case "Use":
      check(term.expr, defs, ctx);
      break;
    case "Ref":
      if (!defs[term.name]) {
        throw "[ERROR]\nUndefined reference: " + term.name;
      } else {
        check(defs[term.name], defs, ctx);
        break;
      }
  }
}

// ::::::::::::::::
// :: Evaluation ::
// ::::::::::::::::

// Reduces a term to normal form or head normal form
const norm = (term, defs = {}, weak = false) => {
  const apply = (func, argm, eras) => {
    var func = reduce(func);
    // ([x]a b) ~> [b/x]a
    if (func[0] === "Lam") {
      return reduce(func[1].body(argm));
    // ((dup x = a; b) c) ~> dup x = a; (b c)
    } else if (func[0] === "Dup") {
      return Dup(func[1].name, func[1].expr, x => weak_reduce(App(func[1].body(x), argm, eras)));
    // (|a b) ~> ⊥
    } else if (func[0] === "Put") {
      throw "[RUNTIME-ERROR]\nCan't apply a boxed value.";
    } else {
      return App(func, weak_reduce(argm), eras);
    }
  }
  const duplicate = (name, expr, body) => {
    var expr = reduce(expr);
    // [x = |a] b ~> [a/x]b
    if (expr[0] === "Put") {
      return reduce(body(expr[1].expr));
    // dup x = (dup y = a; b); c ~> dup y = a; dup x = b; c
    } else if (expr[0] === "Dup") {
      return Dup(expr[1].name, expr[1].expr, x => weak_reduce(Dup(name, expr[1].body(x), x => body(x))));
    // dup x = {y} b; c ~> ⊥
    } else if (expr[0] === "Lam") {
      throw "[RUNTIME-ERROR]\nCan't duplicate a lambda.";
    } else {
      return Dup(name, expr, x => weak_reduce(body(x)));
    }
  }
  const dereference = (name, eras) => {
    if (defs[name]) {
      return reduce(unquote(eras ? erase(defs[name], defs) : defs[name], []));
    } else {
      return Ref(name, eras);
    }
  }
  const op1 = (func, num0, num1) => {
    var num0 = reduce(num0);
    if (num0[0] === "Num") {
      switch (func) {
        case "+"  : return Num((num0[1].numb + num1[1].numb) >>> 0);
        case "-"  : return Num((num0[1].numb - num1[1].numb) >>> 0);
        case "*"  : return Num((num0[1].numb * num1[1].numb) >>> 0);
        case "/"  : return Num((num0[1].numb / num1[1].numb) >>> 0);
        case "%"  : return Num((num0[1].numb % num1[1].numb) >>> 0);
        case "**" : return Num((num0[1].numb ** num1[1].numb) >>> 0);
        case "^^" : return Num((num0[1].numb ** (num1[1].numb / (2 ** 32))) >>> 0);
        case "&"  : return Num((num0[1].numb & num1[1].numb) >>> 0);
        case "|"  : return Num((num0[1].numb | num1[1].numb) >>> 0);
        case "^"  : return Num((num0[1].numb ^ num1[1].numb) >>> 0);
        case "~"  : return Num((~ num1[1].numb) >>> 0);
        case ">>" : return Num((num0[1].numb >>> num1[1].numb) >>> 0);
        case "<<" : return Num((num0[1].numb << num1[1].numb) >>> 0);
        case ">"  : return Num((num0[1].numb > num1[1].numb ? 1 : 0) >>> 0);
        case "<"  : return Num((num0[1].numb < num1[1].numb ? 1 : 0) >>> 0);
        case "==" : return Num((num0[1].numb === num1[1].numb ? 1 : 0) >>> 0);
        default   : throw "[RUNTIME-ERROR]\nUnknown primitive: " + func + ".";
      }
    } else {
      return Op1(func, num0, num1);
    }
  }
  const op2 = (func, num0, num1) => {
    var num1 = reduce(num1);
    if (num1[0] === "Num") {
      return reduce(Op1(func, num0, num1, null));
    } else {
      return Op2(func, weak_reduce(num0), num1);
    }
  }
  const if_then_else = (cond, pair) => {
    var cond = reduce(cond);
    if (cond[0] === "num") {
      return cond[1].numb > 0 ? reduce(Fst(pair, false, null)) : reduce(Snd(pair, false, null));
    } else {
      return Ite(cond, weak_reduce(pair));
    }
  }
  const copy = (name, numb, body) => {
    var numb = reduce(numb);
    if (numb[0] === "Num") {
      return reduce(body(numb));
    } else {
      return Cpy(name, numb, weak_reduce(body));
    }
  }
  const first = (pair, eras) => {
    var pair = reduce(pair);
    if (pair[0] === "Par") {
      return pair[1].val0;
    } else {
      return Fst(pair, eras);
    }
  }
  const second = (pair, eras) => {
    var pair = reduce(pair);
    if (pair[0] === "Par") {
      return pair[1].val1;
    } else {
      return Snd(pair, eras);
    }
  }
  const project = (nam0, nam1, pair, body, eras) => {
    var pair = reduce(pair);
    if (pair[0] === "Par") {
      return reduce(body(pair[1].val0, pair[1].val1));
    } else {
      return Prj(nam0, nam1, pair, (x,y) => weak_reduce(body(x,y)), eras);
    }
  }
  const unquote = (term, vars) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return vars[term.index] || Var(vars.length - term.index - 1);
      case "Typ": return Typ();
      case "All": return All(term.name, unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "App": return App(unquote(term.func, vars), unquote(term.argm, vars), term.eras);
      case "Box": return Box(unquote(term.expr, vars));
      case "Put": return Put(unquote(term.expr, vars));
      case "Dup": return Dup(term.name, unquote(term.expr, vars), x => unquote(term.body, [x].concat(vars)));
      case "U32": return U32();
      case "Num": return Num(term.numb);
      case "Op1": return Op1(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Op2": return Op2(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Ite": return Ite(unquote(term.cond, vars), unquote(term.pair, vars));
      case "Cpy": return Cpy(term.name, unquote(term.numb, vars), x => unquote(term.body, [x].concat(vars)));
      case "Sig": return Sig(term.name, unquote(term.typ0, vars), x => unquote(term.typ1, [x].concat(vars)), term.eras);
      case "Par": return Par(unquote(term.val0, vars), unquote(term.val1, vars), term.eras);
      case "Fst": return Fst(unquote(term.pair, vars), term.eras);
      case "Snd": return Snd(unquote(term.pair, vars), term.eras);
      case "Prj": return Prj(term.nam0, term.nam1, unquote(term.pair, vars), (x,y) => unquote(term.body, [y,x].concat(vars)), term.eras);
      case "Eql": return Eql(unquote(term.val0, vars), unquote(term.val1, vars));
      case "Rfl": return Rfl(unquote(term.expr, vars));
      case "Sym": return Sym(unquote(term.prof, vars));
      case "Rwt": return Rwt(unquote(term.prof, vars), term.name, unquote(term.type, vars), unquote(term.expr, vars));
      case "Cst": return Cst(unquote(term.prof, vars), unquote(term.val1, vars), unquote(term.val1, vars));
      case "Slf": return Slf(term.name, x => unquote(term.type, [x].concat(vars)));
      case "New": return New(unquote(term.type, vars), unquote(term.expr, vars));
      case "Use": return Use(unquote(term.expr, vars));
      case "Ann": return Ann(unquote(term.type, vars), unquote(term.expr, vars), term.done);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  const reduce = (term) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(term.index);
      case "Typ": return Typ();
      case "All": return All(term.name, term.bind, term.body, term.eras);
      case "Lam": return Lam(term.name, term.bind, x => weak_reduce(term.body(x)), term.eras);
      case "App": return apply(term.func, term.argm, term.eras);
      case "Box": return Box(term.expr);
      case "Put": return Put(weak_reduce(term.expr));
      case "Dup": return duplicate(term.name, term.expr, term.body);
      case "U32": return U32();
      case "Num": return Num(term.numb);
      case "Op1": return op1(term.func, term.num0, term.num1);
      case "Op2": return op2(term.func, term.num0, term.num1);
      case "Ite": return if_then_else(term.cond, term.pair);
      case "Cpy": return copy(term.name, term.numb, term.body);
      case "Sig": return Sig(term.name, term.typ0, term.typ1, term.eras);
      case "Par": return Par(weak_reduce(term.val0), weak_reduce(term.val1), term.eras);
      case "Fst": return first(term.pair, term.eras);
      case "Snd": return second(term.pair, term.eras);
      case "Prj": return project(term.nam0, term.nam1, term.pair, term.body, term.eras);
      case "Eql": return Eql(term.val0, term.val1);
      case "Rfl": return Rfl(weak_reduce(term.expr));
      case "Sym": return reduce(term.prof);
      case "Rwt": return reduce(term.expr);
      case "Cst": return reduce(term.val1);
      case "Slf": return Slf(term.name, x => weak_reduce(term.type(x)));
      case "New": return reduce(term.expr);
      case "Use": return reduce(term.expr);
      case "Ann": return reduce(term.expr);
      case "Ref": return dereference(term.name, term.eras);
    }
  };
  const weak_reduce = (term) => {
    return weak ? term : reduce(term);
  };
  const quote = (term, depth) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(depth - 1 - term.index);
      case "Typ": return Typ();
      case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
      case "Box": return Box(quote(term.expr, depth));
      case "Put": return Put(quote(term.expr, depth));
      case "Dup": return Dup(term.name, quote(term.expr, depth), quote(term.body(Var(depth)), depth + 1));
      case "U32": return U32();
      case "Num": return Num(term.numb);
      case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Ite": return Ite(quote(term.cond, depth), quote(term.pair, depth));
      case "Cpy": return Cpy(term.name, quote(term.numb, depth), quote(term.body(Var(depth)), depth + 1));
      case "Sig": return Sig(term.name, quote(term.typ0, depth), quote(term.typ1(Var(depth)), depth + 1), term.eras);
      case "Par": return Par(quote(term.val0, depth), quote(term.val1, depth), term.eras);
      case "Fst": return Fst(quote(term.pair, depth), term.eras);
      case "Snd": return Snd(quote(term.pair, depth), term.eras);
      case "Prj": return Prj(term.nam0, term.nam1, quote(term.pair, depth), quote(term.body(Var(depth), Var(depth + 1)), depth + 2), term.eras);
      case "Eql": return Eql(quote(term.val0, depth), quote(term.val1, depth));
      case "Rfl": return Rfl(quote(term.expr, depth));
      case "Sym": return Sym(quote(term.prof, depth));
      case "Rwt": return Rwt(quote(term.prof, depth), term.name, quote(term.type, depth + 1), quote(term.expr, depth));
      case "Cst": return Cst(quote(term.prof, depth), quote(term.val0, depth), quote(term.val1, depth));
      case "Slf": return Slf(term.name, quote(term.type(Var(depth)), depth + 1));
      case "New": return New(quote(term.type, depth), quote(term.expr, depth));
      case "Use": return Use(quote(term.expr, depth));
      case "Ann": return Ann(quote(term.type, depth), quote(term.expr, depth), term.done);
      case "Ref": return Ref(term.name, term.eras);
    }
  };
  var unquoted = unquote(term, []);
  var reduced = reduce(unquoted);
  var quoted = quote(reduced, 0);
  return quoted;
}

const erase = (term) => {
  var [ctor, term] = term;
  switch (ctor) {
    case "Var": return Var(term.index);
    case "Typ": return Typ();
    case "All": return All(term.name, erase(term.bind), erase(term.body), term.eras);
    case "Lam": return term.eras ? erase(subst(term.body, Num(0), 0)) : Lam(term.name, null, erase(term.body), term.eras);
    case "App": return term.eras ? erase(term.func) : App(erase(term.func), erase(term.argm), term.eras);
    case "Box": return Box(erase(term.expr));
    case "Put": return erase(term.expr);
    case "Dup": return erase(subst(term.body, term.expr, 0));
    case "U32": return U32();
    case "Num": return Num(term.numb);
    case "Op1": return Op1(term.func, erase(term.num0), erase(term.num1));
    case "Op2": return Op2(term.func, erase(term.num0), erase(term.num1));
    case "Ite": return Ite(erase(term.cond), erase(term.pair));
    case "Cpy": return Cpy(term.name, erase(term.numb), erase(term.body));
    case "Sig": return Sig(term.name, erase(term.typ0), erase(term.typ1), term.eras);
    case "Par": return term.eras ? erase(term.val0) : Par(erase(term.val0), erase(term.val1), term.eras);
    case "Fst": return term.eras ? erase(term.pair) : Fst(erase(term.pair), term.eras);
    case "Snd": return term.eras ? erase(term.pair) : Snd(erase(term.pair), term.eras);
    case "Prj": return term.eras ? subst(subst(term.body, Num(0), 0), erase(term.pair), 0) : Prj(term.nam0, term.nam1, erase(term.pair), erase(term.body), term.eras);
    case "Eql": return Eql(erase(term.val0), erase(term.val1));
    case "Rfl": return erase(term.expr);
    case "Sym": return erase(term.prof);
    case "Rwt": return erase(term.expr);
    case "Cst": return erase(term.val1);
    case "Slf": return Slf(term.name, erase(term.type));
    case "New": return erase(term.expr);
    case "Use": return erase(term.expr);
    case "Ann": return erase(term.expr);
    case "Ref": return Ref(term.name, true);
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// Checks if two terms are equal
//const equal = ([a_ctor, a_term], [b_ctor, b_term]) => {
  //switch (a_ctor + "-" + b_ctor) {
    //case "Var-Var": return a_term.index === b_term.index;
    //case "Typ-Typ": return true;
    //case "All-All": return equal(a_term.bind, b_term.bind) && equal(a_term.body, b_term.body);
    //case "Lam-Lam": return equal(a_term.body, b_term.body);
    //case "App-App": return equal(a_term.func, b_term.func) && equal(a_term.argm, b_term.argm) && a_term.eras === b_term.eras;
    //case "Box-Box": return equal(a_term.expr, b_term.expr);
    //case "Put-Put": return equal(a_term.expr, b_term.expr);
    //case "Dup-Dup": return equal(a_term.expr, b_term.expr) && equal(a_term.body, b_term.body);
    //case "Ref-Ref": return a_term.name === b_term.name;
    //case "U32-U32": return true;
    //case "Num-Num": return a_term.numb === b_term.numb;
    //case "Op1-Op1": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && a_term.num1 === a_term.num1;
    //case "Op2-Op2": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && equal(a_term.num1, b_term.num1);
    //case "Ite-Ite": return equal(a_term.cond, b_term.cond) && equal(a_term.pair, b_term.pair);
    //case "Cpy-Cpy": return equal(a_term.numb, b_term.numb) && equal(a_term.body, b_term.body);
    //case "Sig-Sig": return equal(a_term.typ0, b_term.typ0) && equal(a_term.typ1, b_term.typ1) && a_term.eras === b_term.eras;
    //case "Par-Par": return equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1) && a_term.eras === b_term.eras;
    //case "Fst-Fst": return equal(a_term.pair, b_term.pair) && a_term.eras === b_term.eras;
    //case "Snd-Snd": return equal(a_term.pair, b_term.pair) && a_term.eras === b_term.eras;
    //case "Prj-Prj": return equal(a_term.pair, b_term.pair) && equal(a_term.body, b_term.body) && a_term.eras === b_term.eras;
    //case "Eql-Eql": return equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1);
    //case "Rfl-Rfl": return equal(a_term.expr, b_term.expr);
    //case "Sym-Sym": return equal(a_term.prof, b_term.prof);
    //case "Rwt-Rwt": return equal(a_term.prof, b_term.prof) && equal(a_term.type, b_term.type) && equal(a_term.expr, b_term.expr);
    //case "Cst-Cst": return equal(a_term.prof, b_term.prof) && equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1);
    //case "Ann-Ann": return equal(a_term.expr, b_term.expr);
    //default: return false;
  //}
//}

const equal = (a, b, defs) => {
  const Eqs = (a, b)    => ["Eqs", {a, b}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const And = (x,y)     => Bop(false, x, y);
  const Or  = (x,y)     => Bop(true, x, y);
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eqs":
        var {a, b} = node[1];

        // Gets whnfs with and without dereferencing
        var ax = norm(a, {}, true);
        var bx = norm(b, {}, true);
        var ay = norm(a, defs, true);
        var by = norm(b, defs, true);

        // If non-deref whnfs are app and fields are equal, then a == b
        var x = null;
        if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
          x = Val(true);
        } else if (ax[0] === "App" && bx[0] === "App") {
          var func = Eqs(ax[1].func, bx[1].func);
          var argm = Eqs(ax[1].argm, bx[1].argm);
          x = Bop(false, func, argm);
        }

        // If whnfs are equal and fields are equal, then a == b
        var y = null;
        switch (ay[0] + "-" + by[0]) {
          case "Var-Var": y = Val(ay[1].index === by[1].index); break;
          case "Typ-Typ": y = Val(true); break;
          case "All-All": y = Bop(false, Eqs(ay[1].bind, by[1].bind), Eqs(ay[1].body, by[1].body)); break;
          case "Lam-Lam": y = Eqs(ay[1].body, by[1].body); break;
          case "App-App": y = And(Eqs(ay[1].func, by[1].func), Eqs(ay[1].argm, by[1].argm)); break;
          case "Box-Box": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Put-Put": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Dup-Dup": y = And(Eqs(ay[1].expr, by[1].expr), Eqs(ay[1].body, by[1].body)); break;
          case "U32-U32": y = Val(true); break;
          case "Num-Num": y = Val(ay[1].numb === by[1].numb); break;
          case "Op1-Op1": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0), Val(ay[1].num1[1].numb === ay[1].num1[1].numb))); break;
          case "Op2-Op2": y = And(Val(ay[1].func === by[1].func), And(Eqs(ay[1].num0, by[1].num0), Eqs(ay[1].num1, by[1].num1))); break;
          case "Ite-Ite": y = And(Eqs(ay[1].cond, by[1].cond), Eqs(ay[1].pair, by[1].pair)); break;
          case "Cpy-Cpy": y = And(Eqs(ay[1].numb, by[1].numb), Eqs(ay[1].body, by[1].body)); break;
          case "Sig-Sig": y = And(Eqs(ay[1].typ0, by[1].typ0), Eqs(ay[1].typ1, by[1].typ1)); break;
          case "Par-Par": y = And(Eqs(ay[1].val0, by[1].val0), Eqs(ay[1].val1, by[1].val1)); break;
          case "Fst-Fst": y = And(Eqs(ay[1].pair, by[1].pair), Val(ay[1].eras === by[1].eras)); break;
          case "Snd-Snd": y = And(Eqs(ay[1].pair, by[1].pair), ay[1].eras === by[1].eras); break;
          case "Prj-Prj": y = And(Eqs(ay[1].pair, by[1].pair), Eqs(ay[1].body, by[1].body)); break;
          case "Eql-Eql": y = And(Eqs(ay[1].val0, by[1].val0), Eqs(ay[1].val1, by[1].val1)); break;
          case "Rfl-Rfl": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Sym-Sym": y = Eqs(ay[1].prof, by[1].prof); break;
          case "Rwt-Rwt": y = And(And(Eqs(ay[1].prof, by[1].prof), Eqs(ay[1].type, by[1].type)), Eqs(ay[1].expr, by[1].expr)); break;
          case "Cst-Cst": y = And(And(Eqs(ay[1].prof, by[1].prof), Eqs(ay[1].val0, by[1].val0)), Eqs(ay[1].val1, by[1].val1)); break;
          case "Slf-Slf": y = Eqs(ay[1].type, by[1].type); break;
          case "New-New": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Use-Use": y = Eqs(ay[1].expr, by[1].expr); break;
          case "Ann-Ann": y = Eqs(ay[1].expr, by[1].expr); break;
          default:        y = Val(false); break;
        }

        return x ? Bop(true, x, y) : y;

      // A binary operation (or / and)
      case "Bop":
        var {v, x, y} = node[1];
        if (x[0] === "Val") {
          return x[1].v === v ? Val(v) : y;
        } else if (y[0] === "Val") {
          return y[1].v === v ? Val(v) : x;
        } else {
          var X = step(x);
          var Y = step(y);
          return Bop(v, X, Y);
        }

      // A result value (true / false)
      case "Val":
        return node;
    }
  }

  // Expands the search tree until it finds an answer
  var tree = Eqs(erase(a), erase(b));
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
}

// :::::::::::::::::::
// :: Type Checking ::
// :::::::::::::::::::

const typecheck = (() => {

  const PADR = (len, chr, str) => {
    while (str.length < len) {
      str += chr;
    }
    return str;
  };

  const CODE = (str)  => {
    return "\x1b[2m" + str + "\x1b[0m";
  };

  const DENON = (a, defs) => {
    return norm(erase(a), defs, false);
  };

  const ctx_new = null;

  const ctx_ext = (name, type, ctx) => {
    return {name, type, rest: ctx};
  };

  const ctx_get = (i, ctx) => {
    for (var k = 0; k < i; ++k) {
      ctx = ctx.rest;
    }
    return [ctx.name, shift(ctx.type, i + 1, 0)];
  };

  const ctx_str = (ctx, defs) => {
    var txt = [];
    var idx = 0;
    var max_len = 0;
    for (var c = ctx; c !== null; c = c.rest) {
      max_len = Math.max(c.name.length, max_len);
    }
    for (var c = ctx; c !== null; c = c.rest) {
      var name = c.name;
      var type = c.type;
      txt.push("- " + PADR(max_len, " ", c.name) + " : " + show(norm(type, {}, true), ctx_names(c.rest)));
    }
    return txt.reverse().join("\n");
  };

  const ctx_names = (ctx) => {
    var names = [];
    while (ctx !== null) {
      names.push(ctx.name);
      ctx = ctx.rest;
    }
    return names.reverse();
  };

  const typecheck = (term, expect, defs, ctx = ctx_new, inside = null) => {
    const TERM = (term) => {
      return CODE(show(term, ctx_names(ctx)));
    };

    const ERROR = (str)  => {
      throw "[ERROR]\n" + str
        + "\n- When checking " + TERM(term)
        + (inside ? "\n- On expression " + CODE(show(inside[0], ctx_names(inside[1]))) : "")
        //+ (inside ? "\n- On expression " + JSON.stringify(inside[0]) + " | " + JSON.stringify(ctx_names(inside[1])) : "")
        + (ctx !== null ? "\n- With the following context:\n" + ctx_str(ctx, defs) : "");
    };

    const MATCH = (a, b) => {
      if (!equal(a, b, defs)) {
        throw ERROR("Type mismatch."
          + "\n- Found type... " + TERM(a)
          + "\n- Instead of... " + TERM(b));
      }
    };

    var old_expect = expect;
    var expect = expect ? norm(expect, defs, true) : null;
    var type;
    switch (term[0]) {
      case "Var":
        type = ctx_get(term[1].index, ctx)[1];
        break;
      case "All":
        if (expect && expect[0] !== "Typ") {
          ERROR("The annotated type of a forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) +") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect));
        }
        var bind_t = typecheck(term[1].bind, null, defs, ctx, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, term[1].bind, ctx);
        var body_t = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        MATCH(bind_t, Typ());
        MATCH(body_t, Typ());
        type = Typ();
        break;
      case "Typ":
        type = Typ();
        break;
      case "Lam":
        var bind_v = expect && expect[0] === "All" ? expect[1].bind : term[1].bind;
        if (bind_v === null && expect === null) {
          ERROR("Can't infer non-annotated lambda.");
        }
        if (bind_v === null && expect !== null) {
          ERROR("The annotated type of a lambda (" + TERM(Lam("x",null,Ref("f"),false)) + ") isn't forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) + ").\n- Annotated type is " + TERM(expect));
        }
        var ex_ctx = ctx_ext(term[1].name, bind_v, ctx);
        var body_t = typecheck(term[1].body, expect && expect[0] === "All" ? expect[1].body : null, defs, ex_ctx, [term, ctx]);
        var term_t = All(term[1].name, bind_v, body_t, term[1].eras);
        if (term_t[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        typecheck(term_t, Typ(), defs, ctx, [term, ctx]);
        type = term_t;
        break;
      case "App":
        var func_t = norm(typecheck(term[1].func, null, defs, ctx, [term, ctx]), defs, true);
        if (func_t[0] !== "All") {
          ERROR("Attempted to apply a value that isn't a function.");
        }
        typecheck(term[1].argm, func_t[1].bind, defs, ctx, [term, ctx]);
        if (func_t[1].eras !== term[1].eras) {
          ERROR("Erasure doesn't match.");
        }
        type = subst(func_t[1].body, Ann(func_t[1].bind, term[1].argm, false), 0);
        break;
      case "Box":
        if (expect !== null && expect[0] !== "Typ") {
          ERROR("The annotated type of a box (" + TERM(Box(Ref("A"))) + ") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect));
        }
        var expr_t = norm(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, true);
        MATCH(expr_t, Typ());
        type = Typ();
        break;
      case "Put":
        if (expect !== null && expect[0] !== "Box") {
          ERROR("The annotated type of a put (" + TERM(Put(Ref("x"))) + ") isn't a box (" + TERM(Box(Ref("A"))) + ").\n- Annotated type is " + TERM(expect));
        }
        var expr_t = expect && expect[0] === "Box" ? expect[1].expr : null;
        var term_t = typecheck(term[1].expr, expr_t, defs, ctx, [term, ctx]);
        type = Box(term_t);
        break;
      case "Dup":
        var expr_t = norm(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, true);
        if (expr_t[0] !== "Box") {
          ERROR("Unboxed duplication.");
        }
        var ex_ctx = ctx_ext(term[1].name, expr_t[1].expr, ctx);
        var body_t = typecheck(term[1].body, expect && shift(expect, 1, 0), defs, ex_ctx, [term, ctx]);
        type = subst(body_t, Dup(term[1].name, term[1].expr, Var(0)), 0);
        break;
      case "U32":
        type = Typ();
        break;
      case "Num":
        type = U32();
        break;
      case "Op1":
      case "Op2":
        if (expect !== null && expect[0] !== "U32") {
          ERROR("The annotated type of a numeric operation (" + TERM(Op2(term[1].func, Ref("x"), Ref("y"))) + ") isn't " + TERM(U32()) + ".\n- Annotated type is " + TERM(expect));
        }
        typecheck(term[1].num0, U32(), defs, ctx, [term, ctx]);
        typecheck(term[1].num1, U32(), defs, ctx, [term, ctx]);
        type = U32();
        break;
      case "Ite":
        var cond_t = norm(typecheck(term[1].cond, null, defs, ctx, [term, ctx]), defs, true);
        if (cond_t[0] !== "U32") {
          ERROR("Attempted to use if on a non-numeric value.");
        }
        var pair_t = expect ? Sig("x", expect, shift(expect, 1, 0), false) : null;
        var pair_t = norm(typecheck(term[1].pair, pair_t, defs, ctx, [term, ctx]), defs, true);
        if (pair_t[0] !== "Sig") {
          ERROR("The body of an if must be a pair.");
        }
        var typ0_v = pair_t[1].typ0;
        var typ1_v = subst(pair_t[1].typ1, Typ(), 0);
        if (!equal(typ0_v, typ1_v, defs)) {
          ERROR("Both branches of if must have the same type.");
        }
        type = expect || typ0_v;
        break;
      case "Cpy":
        var numb_t = norm(typecheck(term[1].numb, null, defs, ctx, [term, ctx]), defs, true);
        if (numb_t[0] !== "U32") {
          ERROR("Attempted to use cpy on a non-numeric value.");
        }
        var ex_ctx = ctx_ext(term[1].name, U32(), ctx);
        type = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        break;
      case "Sig":
        if (expect && expect[0] !== "Typ") {
          ERROR("The annotated type of a sigma (" + TERM(Sig("x", Ref("A"), Ref("B"))) + ") isn't " + TERM(Typ()) + ".\n- Annotated type is " + TERM(expect));
        }
        var typ0_t = typecheck(term[1].typ0, null, defs, ctx, [term, ctx]);
        var ex_ctx = ctx_ext(term[1].name, term[1].typ0, ctx);
        var typ1_t = typecheck(term[1].typ1, null, defs, ex_ctx, [term, ctx]);
        MATCH(typ0_t, Typ());
        MATCH(typ1_t, Typ());
        type = Typ();
        break;
      case "Par":
        if (expect && expect[0] !== "Sig") {
          ERROR("Annotated type of a pair (" + TERM(Pair(Ref("a"),Ref("b"))) + ") isn't " + TERM(Sig("x", Ref("A"), Ref("B"))) + ".\n- Annotated type is " + TERM(expect));
        }
        if (expect && expect[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var val0_t = typecheck(term[1].val0, expect && expect[1].typ0, defs, ctx, [term, ctx]);
        var val1_t = typecheck(term[1].val1, expect && subst(expect[1].typ1, term[1].val0, 0), defs, ctx, [term, ctx]);
        if (term[1].eras && !equal(term[1].val0, term[1].val1, defs)) {
          ERROR("Dependent interesction values must have same erasure."
            + "\n- Erasure 0 is " + TERM(DENON(term[1].val0, defs))
            + "\n- Erasure 1 is " + TERM(DENON(term[1].val1, defs)));
        }
        type = expect || Sig("x", val0_t, val1_t, term[1].eras);
        break;
      case "Fst":
        var pair_t = norm(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, true);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the first element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = pair_t[1].typ0;
        break;
      case "Snd":
        var pair_t = norm(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, true);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the second element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = subst(pair_t[1].typ1, Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Prj":
        var pair_t = norm(typecheck(term[1].pair, null, defs, ctx, [term, ctx]), defs, true);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to project the elements of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var ex_ctx = ctx_ext(term[1].nam0, pair_t[1].typ0, ctx);
        var ex_ctx = ctx_ext(term[1].nam1, pair_t[1].typ1, ex_ctx);
        type = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        type = subst(type, Snd(shift(term[1].pair, 1, 0), term[1].eras), 0);
        type = subst(type, Fst(term[1].pair, term[1].eras), 0);
        break;
      case "Eql":
        type = Typ();
        break;
      case "Rfl":
        type = Eql(term[1].expr, term[1].expr);
        break;
      case "Sym":
        var prof_t = norm(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, true);
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use sym with an invalid equality proof.");
        }
        type = Eql(prof_t[1].val1, prof_t[1].val0);
        break;
      case "Rwt":
        var prof_t = norm(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, true);
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use rwt with an invalid equality proof.");
        }
        var expr_t0 = subst(term[1].type, prof_t[1].val0, 0);
        var expr_t1 = typecheck(term[1].expr, null, defs, ctx, [term, ctx]);
        MATCH(expr_t1, expr_t0);
        type = subst(term[1].type, prof_t[1].val1, 0);
        break;
      case "Cst":
        var prof_t = norm(typecheck(term[1].prof, null, defs, ctx, [term, ctx]), defs, true);
        if (prof_t[0] !== "Eql") {
          ERROR("Attempted to use rwt with an invalid equality proof.");
        }
        if (!equal(term[1].val0, prof_t[1].val0, defs)) {
          ERROR("Cast failed because " + TERM(term[1].val0) + " != " + TERM(prof_t[1].val0));
        }
        if (!equal(term[1].val0, prof_t[1].val0, defs)) {
          ERROR("Cast failed because " + TERM(term[1].val1) + " != " + TERM(prof_t[1].val1));
        }
        type = typecheck(term[1].val0, expect, defs, ctx, [term, ctx]);
        break;
      case "Slf":
        var ex_ctx = ctx_ext(term[1].name, term, ctx);
        var type_t = typecheck(term[1].type, null, defs, ex_ctx, [term, ctx]);
        MATCH(type_t, Typ());
        return Typ();
      case "New":
        var type = norm(term[1].type, defs, true);
        if (type[0] !== "Slf") {
          ERROR("Attempted to make an instance of a type that isn't self.");
        }
        typecheck(type, null, defs, ctx, [term, ctx]);
        typecheck(term[1].expr, subst(type[1].type, Ann(type, term, true), 0), defs, ctx, [term, ctx]);
        type = term[1].type;
        break;
      case "Use":
        var expr_t = norm(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs, true);
        if (expr_t[0] !== "Slf") {
          ERROR("Attempted to use a value that isn't a self type.");
        }
        type = subst(expr_t[1].type, term[1].expr, 0);
        break;
      case "Ann":
        if (!term[1].done) {
          term[1].done = true;
          typecheck(term[1].expr, term[1].type, defs, ctx, [term, ctx]);
        }
        type = term[1].type;
        break;
      case "Ref":
        if (!defs[term[1].name]) {
          ERROR("Undefined reference.");
        } else {
          type = typecheck(defs[term[1].name], null, defs, ctx, [term, ctx]);
        }
        break;
      default:
        throw "TODO: type checker for " + term[0] + ".";
    }
    if (expect) {
      MATCH(type, expect);
    }
    return type;
  };

  return typecheck;
})();


// :::::::::::::::::::
// :: Syntax Sugars ::
// :::::::::::::::::::

// Converts an utf-8 string to a λ-encoded term
const text_to_term = (text) => {
  // Converts UTF-8 to bytes
  var bytes = [].slice.call(new TextEncoder("utf-8").encode(text), 0);

  // Converts bytes to uints
  while (bytes.length % 4 !== 0) {
    bytes.push(0);
  }
  var nums = new Uint32Array(new Uint8Array(bytes).buffer);

  // Converts uints to C-List of nums
  var term = Var(0);
  for (var i = nums.length - 1; i >= 0; --i) {
    term = App(App(Var(1), Num(nums[i]), false), term, false);
  }
  term = Par(Num(0x74786574), Lam("c", null, Dup("c", Var(0), Put(Lam("n", null, term, false))), false), false);
  return term;
}

// Converts a λ-encoded term to a string, if possible
const term_to_text = (term) => {
  try {
    if (term[1].val0[1].numb === 0x74786574) {
      try {
        term = term[1].val1[1].body[1].body[1].expr[1].body;
      } catch(e) {
        term = term[1].val1[1].body[1].body;
      }
      var nums = [];
      while (term[0] !== "Var") {
        if (term[1].func[1].func[1].index !== 1) {
          return null;
        }
        nums.push(term[1].func[1].argm[1].numb);
        term = term[1].argm;
      }
      if (term[1].index !== 0) {
        return null;
      }
      return new TextDecoder("utf-8").decode(new Uint8Array(new Uint32Array(nums).buffer));
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

// Converts a number to a λ-encoded nat for repeated application (bounded for-loop)
const numb_to_term = (numb) => {
  var term = Var(0);
  var log2 = Math.floor(Math.log(numb) / Math.log(2));
  for (var i = 0; i < log2 + 1; ++i) {
    term = (numb >>> (log2 - i)) & 1 ? App(Var(i + 1), term, false) : term;
  }
  term = Put(Lam("x", null, term, false));
  for (var i = 0; i < log2; ++i) {
    term = Dup("s" + (log2 - i), Put(Lam("x", null, App(Var(1), App(Var(1), Var(0), false), false), false)), term);
  }
  term = Lam("s", null, Dup("s0", Var(0), term), false);
  return term;
}

// Converts a number to a λ-encoded nat for repeated application (bounded for-loop)
const numb_to_tree_term = (numb) => {
  var term = Put(Var(0));
  for (var i = 0; i < numb; ++i) {
    term = Dup("b" + (numb - i - 1), Put(App(App(Var(numb - i), Var(0), false), Var(0), false)), term);
  }
  term = Dup("n", Var(1), term);
  term = Dup("b", Var(1), term);
  term = Lam("n", null, term, false);
  term = Lam("b", null, term, false);
  return term;
}

// Converts a λ-encoded nat to a number, if possible
const term_to_numb = (term) => {
  return null;
  try {
    try {
      term = term[1].body[1].body[1].expr[1].body;
    } catch(e) {
      term = term[1].body[1].body;
    }
    var count = 0;
    while (term[0] !== "Var") {
      if (term[1].func[1].index !== 1) {
        return null;
      }
      count++;
      term = term[1].argm;
    }
    if (term[1].index !== 0) {
      return null;
    }
    return count;
  } catch (e) {
    return null;
  }
}

// Syntax sugaar for datatypes. They transform a statement like:
// 
//   data ADT <p0 : Param0, p1 : Param1...> {i0 : Index0, i1 : Index1}
//   | ctr0 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type 
//   | ctr1 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type 
//   | ...
//
// on its corresponding self-encoded datatype:
//
//   def ADT
//   : {p0 : Param0, p1 : Param1, ..., i0 : Index0, i1 : Index1, ...} -> Type 
//   = {p0 : Param0, p1 : Param1, ..., i0 : Index0, i1 : Index1, ...} =>
//     $self
//     {~P   : {i0 : Index0, i1 : Index1, ..., wit : (ADT Index0 Index1...)} -> Type} ->
//     {ctr0 : {ctr0_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr0 Param0 Param1... ctr0_fld0 ctr0_fld1 ...))} ->
//     {ctr1 : {ctr1_fld0 : Ctr1_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr1 Param0 Param1... ctr1_fld1 ctr0_fld1 ...))} ->
//     ... ->
//     (P i0 i1... self)
//  
//   def ADT.ctr0
//   = {~p0 : Param0, ~p1 : Param1, ..., ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} =>
//     : Ctr0Type
//     @ Ctr0Type
//       {~P, ctr0, ctr1, ...} => 
//       (ctr0 ctr0_fld0 ctr0_fld1 ...)
//
//   (...)
//   
// TODO: clean-up, test, debug, comment, document, etc.

const derive_adt_type = ({adt_pram, adt_indx, adt_ctor, adt_name}) => {
  return (function adt_arg(p, i) {
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
    } else if (i < adt_indx.length) {
      var substs = [Ref(adt_name)];
      for (var P = 0; P < p; ++P) {
        substs.push(Var(-1 + i + p - P));
      }
      return Lam(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), adt_arg(p, i + 1), adt_indx[i][2]);
    } else {
      return (
        Ann(Typ(),
        Slf("self",
        All("P",
          (function motive(i) {
            if (i < adt_indx.length) {
              var substs = [Ref(adt_name)];
              for (var P = 0; P < p; ++P) {
                substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
              }
              return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
            } else {
              var wit_t = Ref(adt_name);
              for (var P = 0; P < adt_pram.length; ++P) {
                wit_t = App(wit_t, Var(-1 + i + 1 + i + adt_pram.length - P), adt_pram[P][2]); 
              }
              for (var I = 0; I < i; ++I) {
                wit_t = App(wit_t, Var(-1 + i - I), adt_indx[I][2]);
              }
              return All("x", wit_t, Typ(), false);
            }
          })(0),
        (function ctor(i) {
          if (i < adt_ctor.length) {
            return All(adt_ctor[i][0], (function field(j) {
              var subst_prams = [];
              for (var P = 0; P < adt_pram.length; ++P) {
                subst_prams.push(Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P));
              }
              if (j < adt_ctor[i][1].length) {
                var sub = [Ref(adt_name)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][1][j][1], sub, j);
                return All(adt_ctor[i][1][j][0], typ, field(j + 1), adt_ctor[i][1][j][2]);
              } else {
                var typ = adt_ctor[i][2];
                var sub = [Var(-1 + j + i + 1)].concat(subst_prams);
                var typ = subst_many(adt_ctor[i][2], sub, j);
                var rem = typ;
                for (var I = 0; I < adt_indx.length; ++I) {
                  rem = rem[1].func;
                }
                rem[0] = "Var";
                rem[1] = {index: -1 + i + j + 1};
                var wit = Ref(adt_name + "." + adt_ctor[i][0]);
                for (var P = 0; P < adt_pram.length; ++P) {
                  var wit = App(wit, Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P), true);
                }
                for (var F = 0; F < adt_ctor[i][1].length; ++F) {
                  var wit = App(wit, Var(-1 + j - F), adt_ctor[i][1][F][2]);
                }
                return App(typ, wit, false);
              }
            })(0),
            ctor(i + 1),
            false);
          } else {
            var ret = Var(adt_ctor.length + 1 - 1);
            for (var i = 0; i < adt_indx.length; ++i) {
              var ret = App(ret, Var(adt_ctor.length + 1 + 1 + adt_indx.length - i - 1), adt_indx[i][2]); 
            }
            var ret = App(ret, Var(adt_ctor.length + 1 + 1 - 1), false);
            return ret;
          }
        })(0),
        true))));
    }
  })(0, 0);
}

const derive_adt_ctor = ({adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
  return (function arg(p, i, f) {
    var substs = [Ref(adt_name)];
    for (var P = 0; P < p; ++P) {
      substs.push(Var(-1 + f + p - P));
    }
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], arg(p + 1, i, f), true);
    } else if (f < adt_ctor[c][1].length) {
      return Lam(adt_ctor[c][1][f][0], subst_many(adt_ctor[c][1][f][1], substs, f), arg(p, i, f + 1), adt_ctor[c][1][f][2]);
    } else {
      var type = subst_many(adt_ctor[c][2], substs, f);
      return Ann(type, New(type, Lam("P", null, (function opt(k) {
        if (k < adt_ctor.length) {
          return Lam(adt_ctor[k][0], null, opt(k + 1), false);
        } else {
          var sel = Var(-1 + adt_ctor.length - c);
          for (var F = 0; F < adt_ctor[c][1].length; ++F) {
            var sel = App(sel, Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F), adt_ctor[c][1][F][2]);
          }
          return sel;
        }
      })(0), true)), false);
    }
  })(0, adt_indx.length, 0);
}

module.exports = {
  Var,
  Lam,
  All,
  App,
  Put,
  Dup,
  U32,
  Num,
  Op1,
  Op2,
  Ite,
  Cpy,
  Sig,
  Par,
  Fst,
  Snd,
  Ann,
  Prj,
  Ref,
  gen_name,
  parse,
  typecheck,
  show,
  check,
  norm,
  erase,
  equal
};
