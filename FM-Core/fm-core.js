// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An ESCoC term is an ADT represented by a JSON
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
const Ann = (type, expr)                   => ["Ann", {type, expr}];
const Ref = (name)                         => ["Ref", {name}];

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
    else if (match("%")) {
      var name = parse_string();
      var numb = Number(name);
      return numb_to_term(numb);
    }

    // PBT
    else if (match("&")) {
      var name = parse_string();
      var numb = Number(name);
      return numb_to_tree_term(numb);
    }

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
        var skip = parse_exact(",");
        var eras = match("~");
        var typ1 = parse_term(ctx.concat([name]));
        var skip = parse_exact("]");
        return Sig(name, typ0, typ1, eras);
      // Pair
      } else {
        var val0 = parse_term(ctx);
        var skip = parse_exact(",");
        var eras = match("~");
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

    // Projection
    else if (match(": ")) {
      var type = parse_term(ctx);
      var expr = parse_term(ctx);
      return Ann(type, expr);
    }

    // Identiy
    else if (match("=")) {
      var expr = parse_term(ctx);
      return expr;
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
        return Ref(name);
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
    var skip = parse_exact("def ");
    var name = parse_string();
    var term = parse_term([]);
    defs[name] = term;
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
const show = ([ctor, args], canon = false, nams = []) => {
  switch (ctor) {
    case "Var":
      return nams[nams.length - args.index - 1] || "^" + args.index;
    case "Typ":
      return "Type";
    case "All":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        erase.push(term[1].eras);
        names.push(canon ? gen_name(nams.length) : term[1].name);
        types.push(show(term[1].bind, canon, nams.concat(names.slice(0,-1))));
        term = term[1].body;
      }
      var text = "{";
      for (var i = 0; i < names.length; ++i) {
        text += erase[i] ? "~" : "";
        text += names[i] + " : " + types[i];
        text += i < names.length - 1 ? ", " : "";
      }
      text += "} -> ";
      text += show(term, canon, nams.concat(names));
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
          names.push(canon ? gen_name(nams.length) : term[1].name);
          types.push(term[1].bind ? show(term[1].bind, canon, nams.concat(names)) : null);
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
        text += show(term, canon, nams.concat(names));
      }
      return text;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = " " + (term[1].eras ? "~" : "") + show(term[1].argm, canon, nams) + text;
        term = term[1].func;
      }
      return "(" + show(term, canon, nams) + text;
    case "Box":
      var expr = show(args.expr, canon, nams);
      return "!" + expr;
    case "Put":
      var expr = show(args.expr, canon, nams);
      return "#" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, canon, nams);
      var body = show(args.body, canon, nams.concat([name]));
      return "dup " + name + " = " + expr + "; " + body;
    case "U32":
      return "U32";
    case "Num":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, canon, nams);
      var num1 = show(args.num1, canon, nams);
      return "|" + num0 + " " + func + " " + num1 + "|";
    case "Ite":
      var cond = show(args.cond, canon, nams);
      var pair = show(args.pair, canon, nams);
      return "(if " + cond + " " + pair + ")";
    case "Cpy":
      var name = args.name;
      var numb = show(args.numb, canon, nams);
      var body = show(args.body, canon, nams.concat([name]));
      return "cpy " + name + " = " + numb + "; " + body;
    case "Sig":
      var name = args.name;
      var typ0 = show(args.typ0, canon, nams);
      var typ1 = show(args.typ1, canon, nams.concat([name]));
      var eras = args.eras ? "~" : "";
      return "[" + name + " : " + typ0 + ", " + eras + typ1 + "]";
    case "Par":
      var text = term_to_text([ctor, args]);
      if (text !== null) {
        return "\"" + text + "\"";
      } else {
        var val0 = show(args.val0, canon, nams);
        var val1 = show(args.val1, canon, nams);
        var eras = args.eras ? "~" : "";
        return "[" + val0 + "," + eras + val1 + "]";
      }
    case "Fst":
      var pair = show(args.pair, canon, nams);
      var eras = args.eras ? "~" : "";
      return "(" + eras + "fst " + pair + ")";
    case "Snd":
      var pair = show(args.pair, canon, nams);
      var eras = args.eras ? "~" : "";
      return "(" + eras + "snd " + pair + ")";
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, canon, nams);
      var body = show(args.body, canon, nams.concat([nam0, nam1]));
      var eras = args.eras ? "~" : "";
      return "get [" + nam0 + "," + eras + nam1 + "] = " + pair + "; " + body + "";
    case "Ann":
      var type = show(args.type, canon, nams);
      var expr = show(args.expr, canon, nams);
      return ": " + type + " " + expr;
    case "Ref":
      return args.name;
  }
}

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
    case "Ann":
      var type = shift(term.type, inc, depth);
      var expr = shift(term.expr, inc, depth);
      return Ann(type, expr);
    case "Ref":
      return Ref(term.name);
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
      var bind = subst(term.bind, val, depth);
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
    case "Ann":
      var type = subst(term.type, inc, depth);
      var expr = subst(term.expr, inc, depth);
      return Ann(type, expr);
    case "Ref":
      var name = term.name;
      return Ref(name);
  }
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
    case "App": return uses(term.func, depth) + uses(term.argm, depth);
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
    case "Par": return uses(term.val0, depth) + uses(term.val1, depth);
    case "Fst": return uses(term.pair, depth);
    case "Snd": return uses(term.pair, depth);
    case "Prj": return uses(term.pair, depth) + uses(term.body, depth + 2);
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
    case "App": return is_at_level(term.func, at_level, depth, level) && is_at_level(term.argm, at_level, depth, level);
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
        throw "[ERROR]\nLambda variable `" + term.name + "` used more than once in:\n" + show([ctor, term], false, ctx);
      }
      if (!is_at_level(term.body, 0)) {
        throw "[ERROR]\nLambda variable `" + term.name + "` used inside a box in:\n" + show([ctor, term], false, ctx);
      }
      check(term.body, defs, ctx.concat([term.name]));
      break;
    case "App":
      check(term.func, defs, ctx);
      check(term.argm, defs, ctx);
      break;
    case "Box":
      break;
    case "Put":
      check(term.expr, defs, ctx);
      break;
    case "Dup":
      if (!is_at_level(term.body, 1)) {
        throw "[ERROR]\nDuplication variable `" + term.name + "` must always have exactly 1 enclosing box on the body of:\n" + show([ctor, term], false, ctx);
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
      check(term.val1, defs, ctx);
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
        throw "[ERROR]\nProjection variable `" + (uses0 > 1 ? term.nam0 : term.nam1) + "` used more than once in:\n" + show([ctor, term], false, ctx);
      }
      if (!isat0 || !isat1) {
        throw "[ERROR]\nProjection variable `" + (!isat0 ? term.nam0 : term.nam1) + "` used inside a box in:\n" + show([ctor, term], false, ctx);
      }
      check(term.pair, defs, ctx);
      check(term.body, defs, ctx.concat([term.nam0, term.nam1]));
      break;
    case "Ann":
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
const norm = (term, defs = {}) => {
  const apply = (func, argm, eras) => {
    // ([x]a b) ~> [b/x]a
    if (func[0] === "Lam") {
      return func[1].body(argm);
    // ((dup x = a; b) c) ~> dup x = a; (b c)
    } else if (func[0] === "Dup") {
      return Dup(func[1].name, func[1].expr, x => App(func[1].body(x), argm, eras));
    // (|a b) ~> ⊥
    } else if (func[0] === "Put") {
      throw "[RUNTIME-ERROR]\nCan't apply a boxed value.";
    } else {
      return App(func, argm, eras);
    }
  }
  const duplicate = (name, expr, body) => {
    // [x = |a] b ~> [a/x]b
    if (expr[0] === "Put") {
      return body(expr[1].expr);
    // dup x = (dup y = a; b); c ~> dup y = a; dup x = b; c
    } else if (expr[0] === "Dup") {
      return Dup(expr[1].name, expr[1].expr, x => Dup(name, expr[1].body(x), x => body(x)));
    // dup x = {y} b; c ~> ⊥
    } else if (expr[0] === "Lam") {
      throw "[RUNTIME-ERROR]\nCan't duplicate a lambda.";
    } else {
      return Dup(name, expr, body);
    }
  }
  const dereference = (name) => {
    if (defs[name]) {
      return unquote(defs[name], []);
    } else {
      return Ref(name);
    }
  }
  const op1 = (func, num0, num1) => {
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
    if (num1[0] === "Num") {
      return op1(func, num0, num1);
    } else {
      return Op2(func, num0, num1);
    }
  }
  const if_then_else = (cond, pair) => {
    if (cond[0] === "Num") {
      return cond[1].numb > 0 ? first(pair, false) : second(pair, false);
    } else {
      return Ite(cond, pair);
    }
  }
  const copy = (name, numb, body) => {
    if (numb[0] === "Num") {
      return body(numb);
    } else {
      return Cpy(name, numb, body);
    }
  }
  const first = (pair, eras) => {
    if (pair[0] === "Par") {
      return pair[1].val0;
    } else {
      return Fst(pair, eras);
    }
  }
  const second = (pair, eras) => {
    if (pair[0] === "Par") {
      return pair[1].val1;
    } else {
      return Snd(pair, eras);
    }
  }
  const project = (nam0, nam1, pair, body, eras) => {
    if (pair[0] === "Par") {
      return body(pair[1].val0, pair[1].val1);
    } else {
      return Prj(nam0, nam1, pair, body, eras);
    }
  }
  const unquote = (term, vars) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return vars[term.index] || Var(vars.length - term.index - 1);
      case "Typ": return Typ();
      case "All": return All(term.name, unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "App": return apply(unquote(term.func, vars), unquote(term.argm, vars), term.eras);
      case "Box": return Box(unquote(term.expr, vars));
      case "Put": return Put(unquote(term.expr, vars));
      case "Dup": return duplicate(term.name, unquote(term.expr, vars), x => unquote(term.body, [x].concat(vars)));
      case "U32": return U32();
      case "Num": return Num(term.numb);
      case "Op1": return op1(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Op2": return op2(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Ite": return if_then_else(unquote(term.cond, vars), unquote(term.pair, vars));
      case "Cpy": return copy(term.name, unquote(term.numb, vars), x => unquote(term.body, [x].concat(vars)));
      case "Sig": return Sig(term.name, unquote(term.typ0, vars), unquote(term.typ1, vars), term.eras);
      case "Par": return Par(unquote(term.val0, vars), unquote(term.val1, vars), term.eras);
      case "Fst": return first(unquote(term.pair, vars), term.eras);
      case "Snd": return second(unquote(term.pair, vars), term.eras);
      case "Prj": return project(term.nam0, term.nam1, unquote(term.pair, vars), (x,y) => unquote(term.body, [y,x].concat(vars)), term.eras);
      case "Ann": return unquote(term.expr, vars);
      case "Ref": return dereference(term.name);
    }
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
      case "Sig": return Sig(term.name, quote(term.typ0, depth), quote(term.typ1, depth), term.eras);
      case "Par": return Par(quote(term.val0, depth), quote(term.val1, depth), term.eras);
      case "Fst": return Fst(quote(term.pair, depth), term.eras);
      case "Snd": return Snd(quote(term.pair, depth), term.eras);
      case "Prj": return Prj(term.nam0, term.nam1, quote(term.pair, depth), quote(term.body(Var(depth), Var(depth + 1)), depth + 2), term.eras);
      case "Ann": return Ann(quote(term.type, depth), quote(term.expr, depth));
      case "Ref": return Ref(term.name);
    }
  };
  return quote(unquote(term, []), 0);
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
    case "Put": return Put(erase(term.expr));
    case "Dup": return Dup(term.name, erase(term.expr), erase(term.body));
    case "U32": return U32();
    case "Num": return Num(term.numb);
    case "Op1": return Op1(term.func, erase(term.num0), erase(term.num1));
    case "Op2": return Op2(term.func, erase(term.num0), erase(term.num1));
    case "Ite": return Ite(erase(term.cond), erase(term.pair));
    case "Cpy": return Cpy(term.name, erase(term.numb), erase(term.body));
    case "Sig": return Sig(term.name, erase(term.typ0), erase(term.typ1), term.eras);
    case "Par": return term.eras ? erase(term.val0) : Par(erase(term.val0), erase(term.val1), term.eras);
    case "Fst": return term.eras ? erase(term.pair) : Fst(erase(term.pair), term.eras);
    case "Snd": return term.eras ? Num(0) : Snd(erase(term.pair), term.eras);
    case "Prj": return term.eras ? subst(subst(term.body, Num(0), 0), erase(term.pair), 0) : Prj(term.nam0, term.nam1, erase(term.pair), erase(term.body), term.eras);
    case "Ann": return Ann(erase(term.type), erase(term.expr));
    case "Ref": return Ref(term.name);
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// Checks if two terms are equal
const equal = ([a_ctor, a_term], [b_ctor, b_term]) => {
  switch (a_ctor + "-" + b_ctor) {
    case "Var-Var": return a_term.index === b_term.index;
    case "Typ-Typ": return true;
    case "All-All": return equal(a_term.bind, b_term.bind) && equal(a_term.body, b_term.body);
    case "Lam-Lam": return equal(a_term.body, b_term.body);
    case "App-App": return equal(a_term.func, b_term.func) && equal(a_term.argm, b_term.argm) && a_term.eras === b_term.eras;
    case "Box-Box": return equal(a_term.expr, b_term.expr);
    case "Put-Put": return equal(a_term.expr, b_term.expr);
    case "Dup-Dup": return equal(a_term.expr, b_term.expr) && equal(a_term.body, b_term.body);
    case "Ref-Ref": return a_term.name === b_term.name;
    case "U32-U32": return true;
    case "Num-Num": return a_term.numb === b_term.numb;
    case "Op1-Op1": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && a_term.num1 === a_term.num1;
    case "Op2-Op2": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && equal(a_term.num1, b_term.num1);
    case "Ite-Ite": return equal(a_term.cond, b_term.cond) && equal(a_term.pair, b_term.pair);
    case "Cpy-Cpy": return equal(a_term.numb, b_term.numb) && equal(a_term.body, b_term.body);
    case "Sig-Sig": return equal(a_term.typ0, b_term.typ0) && equal(a_term.typ1, b_term.typ1) && a_term.eras === b_term.eras;
    case "Par-Par": return equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1) && a_term.eras === b_term.eras;
    case "Fst-Fst": return equal(a_term.pair, b_term.pair) && a_term.eras === b_term.eras;
    case "Snd-Snd": return equal(a_term.pair, b_term.pair) && a_term.eras === b_term.eras;
    case "Prj-Prj": return equal(a_term.pair, b_term.pair) && equal(a_term.body, b_term.body) && a_term.eras === b_term.eras;
    case "Ann-Ann": return equal(a_term.expr, b_term.expr);
    default: return false;
  }
}

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

  const ctx_str = (ctx) => {
    var txt = [];
    var idx = 0;
    var max_len = 0;
    for (var c = ctx; c !== null; c = c.rest) {
      max_len = Math.max(c.name.length, max_len);
    }
    for (var c = ctx; c !== null; c = c.rest) {
      var name = c.name;
      var type = c.type;
      txt.push("- " + PADR(max_len, " ", c.name) + " : " + CODE(show(type, false, ctx_names(c.rest))));
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
      return CODE(show(term, false, ctx_names(ctx)));
    };

    const ERROR = (str)  => {
      throw "[ERROR]\n" + str
        + "\n- When checking " + TERM(term)
        + (inside ? "\n- On expression " + CODE(show(inside[0], false, ctx_names(inside[1]))) : "")
        + (ctx !== null ? "\n- With the following context:\n" + ctx_str(ctx) : "");
    };

    const MATCH = (a, b) => {
      if (!equal(erase(norm(a, defs)), erase(norm(b, defs)))) {
        throw ERROR("Type mismatch."
          + "\n- Found type... " + TERM(norm(a, defs))
          + "\n- Instead of... " + TERM(norm(b, defs)));
      }
    };

    var expect = expect ? norm(expect, defs) : null;
    var type;
    switch (term[0]) {
      case "Var":
        type = ctx_get(term[1].index, ctx)[1];
        break;
      case "All":
        if (expect && expect[0] !== "Typ") {
          ERROR("The annotated type of a forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) +") isn't " + TERM(Typ()) + ".");
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
          ERROR("The annotated type of a lambda (" + TERM(Lam("x",null,Ref("f"),false)) + ") isn't forall (" + TERM(All("x", Ref("A"), Ref("B"), false)) + ").");
        }
        var ex_ctx = ctx_ext(term[1].name, bind_v, ctx);
        var body_t = typecheck(term[1].body, expect && expect[0] === "All" ? expect[1].body : null, defs, ex_ctx, [term, ctx]);
        var term_t = All(term[1].name, bind_v, body_t, term[1].eras);
        typecheck(term_t, Typ(), defs, ctx, [term, ctx]);
        type = term_t;
        break;
      case "App":
        var func_t = norm(typecheck(term[1].func, null, defs, ctx, [term, ctx]), defs);
        if (func_t[0] !== "All") {
          ERROR("Attempted to apply a value that isn't a function.");
        }
        typecheck(term[1].argm, func_t[1].bind, defs, ctx, [term, ctx]);
        if (func_t[1].eras !== term[1].eras) {
          ERROR("Erasure doesn't match.");
        }
        type = subst(func_t[1].body, Ann(func_t[1].bind, term[1].argm), 0);
        break;
      case "Box":
        if (expect !== null && expect[0] !== "Typ") {
          ERROR("The annotated type of a box (" + TERM(Box(Ref("A"))) + ") isn't " + TERM(Typ()) + ".");
        }
        var expr_t = norm(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs);
        MATCH(expr_t, Typ());
        type = Typ();
        break;
      case "Put":
        if (expect !== null && expect[0] !== "Box") {
          ERROR("The annotated type of a put (" + TERM(Put(Ref("x"))) + ") isn't a box (" + TERM(Box(Ref("A"))) + ").");
        }
        var expr_t = expect && expect[0] === "Box" ? expect[1].expr : null;
        var term_t = typecheck(term[1].expr, expr_t, defs, ctx, [term, ctx]);
        type = Box(term_t);
        break;
      case "Dup":
        var expr_t = norm(typecheck(term[1].expr, null, defs, ctx, [term, ctx]), defs);
        if (expr_t[0] !== "Box") {
          ERROR("Unboxed duplication.");
        }
        var ex_ctx = ctx_ext(term[1].name, expr_t[1].expr, ctx);
        var body_t = typecheck(term[1].body, shift(expect, 1, 0), defs, ex_ctx, [term, ctx]);
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
        if (expect !== null && expect[0] !== "Box") {
          ERROR("The annotated type of a numeric operation (" + TERM(Op2(term[1].func, Ref("x"), Ref("y"))) + ") isn't " + TERM(U32()) + ".");
        }
        typecheck(term[1].num0, U32(), defs, ctx, [term, ctx]);
        typecheck(term[1].num1, U32(), defs, ctx, [term, ctx]);
        type = U32();
        break;
      case "Ite":
        var cond_t = typecheck(term[1].cond, null, defs, ctx, [term, ctx]);
        if (cond_t[0] !== "U32") {
          ERROR("Attempted to use if on a non-numeric value.");
        }
        var pair_t = expect ? Sig("x", expect, shift(expect, 1, 0), false) : null;
        var pair_t = typecheck(term[1].pair, pair_t, defs, ctx, [term, ctx]);
        if (pair_t[0] !== "Sig") {
          ERROR("The body of an if must be a pair.");
        }
        var typ0_v = pair_t[1].typ0;
        var typ1_v = subst(pair_t[1].typ1, Typ(), 0);
        if (!equal(erase(norm(typ0_v, defs)), erase(norm(typ1_v, defs)))) {
          ERROR("Both branches of if must have the same type.");
        }
        type = expect || typ0_v;
        break;
      case "Cpy":
        var numb_t = typecheck(term[1].numb, null, defs, ctx, [term, ctx]);
        if (numb_t[0] !== "U32") {
          ERROR("Attempted to use cpy on a non-numeric value.");
        }
        var ex_ctx = ctx_ext(term[1].name, U32(), ctx);
        type = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        break;
      case "Sig":
        if (expect && expect[0] !== "Typ") {
          ERROR("The annotated type of a sigma (" + TERM(Sig("x", Ref("A"), Ref("B"))) + ") isn't " + TERM(Typ()) + ".");
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
          ERROR("Annotated type of a pair (" + TERM(Pair(Ref("a"),Ref("b"))) + ") isn't " + TERM(Sig("x", Ref("A"), Ref("B"))) + ".");
        }
        if (expect && expect[1].eras !== term[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var val0_t = typecheck(term[1].val0, expect && expect[1].typ0, defs, ctx, [term, ctx]);
        var val1_t = typecheck(term[1].val1, expect && subst(expect[1].typ1, term[1].val0, 0), defs, ctx, [term, ctx]);
        type = expect || Sig("x", val0_t, val1_t, term[1].eras);
        break;
      case "Fst":
        var pair_t = typecheck(term[1].pair, null, defs, ctx, [term, ctx]);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the first element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = pair_t[1].typ0;
        break;
      case "Snd":
        var pair_t = typecheck(term[1].pair, null, defs, ctx, [term, ctx]);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to extract the second element of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        type = subst(pair_t[1].typ1, Fst(term[1].pair), 0);
        break;
      case "Prj":
        var pair_t = typecheck(term[1].pair, null, defs, ctx, [term, ctx]);
        if (pair_t[0] !== "Sig") {
          ERROR("Attempted to project the elements of a term that isn't a pair.");
        }
        if (term[1].eras !== pair_t[1].eras) {
          ERROR("Mismatched erasure.");
        }
        var ex_ctx = ctx_ext(term[1].nam0, pair_t[1].typ0, ctx);
        var ex_ctx = ctx_ext(term[1].nam1, pair_t[1].typ1, ex_ctx);
        type = typecheck(term[1].body, null, defs, ex_ctx, [term, ctx]);
        type = subst(type, Snd(shift(term[1].pair, 1, 0)), 0);
        type = subst(type, Fst(term[1].pair), 0);
        break;
      case "Ann":
        typecheck(term[1].expr, term[1].type, defs, ctx, [term, ctx]);
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
    return norm(type, defs);
  };

  return typecheck;
})();

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
