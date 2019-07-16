// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An ESCoC term is an ADT represented by a JSON
const Var = (index)                  => ["Var", {index}];
const All = (name, bind, body, eras) => ["All", {name, bind, body, eras}];
const Lam = (name, bind, body, eras) => ["Lam", {name, bind, body, eras}];
const App = (func, argm, eras)       => ["App", {func, argm, eras}];
const Put = (expr)                   => ["Put", {expr}];
const Dup = (name, expr, body)       => ["Dup", {name, expr, body}];
const Num = (numb)                   => ["Num", {numb}];
const Op1 = (func, num0, num1)       => ["Op1", {func, num0, num1}];
const Op2 = (func, num0, num1)       => ["Op2", {func, num0, num1}];
const Ite = (cond, pair)             => ["Ite", {cond, pair}];
const Cpy = (name, numb, body)       => ["Cpy", {name, numb, body}];
const Par = (val0, val1)             => ["Par", {val0, val1}];
const Fst = (pair)                   => ["Fst", {pair}];
const Snd = (pair)                   => ["Snd", {pair}];
const Prj = (nam0, nam1, pair, body) => ["Prj", {nam0, nam1, pair, body}];
const Ref = (name)                   => ["Ref", {name}];

// :::::::::::::
// :: Parsing ::
// :::::::::::::

// Converts a string to a term
const parse = (code) => {
  function is_space(char) {
    return char === " " || char === "\t" || char === "\n" || char === "\r";
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
    // Application
    if (match("(")) {
      var term = parse_term(ctx);
      while (idx < code.length && !match(")")) {
        var eras = match("-");
        var argm = parse_term(ctx);
        var term = App(term, argm, eras);
        next_char();
      }
      return term;
    }

    // Lambdas and Forall
    else if (match("{")) {
      var erass = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        erass.push(match("-"));
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
        term = (isall ? All : Lam)(names[i], types[i], term, erass[i]);
      }
      return term;
    }

    // Duplication
    else if (match("dup ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var expr = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      return Dup(name, expr, body);
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
    else if (match("~")) {
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

    // Pair
    else if (match("[")) {
      var val0 = parse_term(ctx);
      var skip = parse_exact(",");
      var val1 = parse_term(ctx);
      var skip = parse_exact("]");
      return Par(val0, val1);
    }
    
    // Pair (If-Then-Else sugar)
    else if (match("then:")) {
      var val0 = parse_term(ctx);
      var skip = parse_exact("else:");
      var val1 = parse_term(ctx);
      return Par(val0, val1);
    }

    // First
    else if (match("fst ")) {
      var pair = parse_term(ctx);
      return Fst(pair);
    }

    // Second
    else if (match("snd ")) {
      var pair = parse_term(ctx);
      return Snd(pair);
    }

    // Projection
    else if (match("get ")) {
      var skip = parse_exact("[");
      var nam0 = parse_string();
      var skip = parse_exact(",");
      var nam1 = parse_string();
      var skip = parse_exact("]");
      var skip = parse_exact("=");
      var pair = parse_term(ctx);
      var body = parse_term(ctx.concat([nam0, nam1]));
      return Prj(nam0, nam1, pair, body);
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
    var skip = parse_exact(":");
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
    case "All":
      var term = [ctor, args];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        names.push(canon ? gen_name(nams.length) : term[1].name);
        types.push(show(term[1].bind, canon, nams.concat(names.slice(0,-1))));
        term = term[1].body;
      }
      var text = "{";
      for (var i = 0; i < names.length; ++i) {
        text += names[i] + " : " + types[i];
        text += i < names.length - 1 ? ", " : "";
      }
      text += "} -> ";
      text += show(term, canon, nams.concat(names));
      return text;
    case "Lam":
      var term = [ctor, args];
      var numb = null;
      var names = [];
      var types = [];
      while (term[0] === "Lam") {
        numb = term_to_numb(term);
        if (numb !== null) {
          break;
        } else {
          names.push(canon ? gen_name(nams.length) : term[1].name);
          types.push(term[1].bind ? show(term[1].bind, canon, nams.concat(names)) : null);
          term = term[1].body;
        }
      }
      var text = "{";
      for (var i = 0; i < names.length; ++i) {
        text += names[i] + (term[1].bind !== null ? " : " + types[i] : "");
        text += i < names.length - 1 ? ", " : "";
      }
      text += "} => ";
      if (numb !== null) {
        text += "~" + Number(numb);
      } else {
        text += show(term, canon, nams.concat(names));
      }
      return text;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = term[1].eras ? "-" : "";
        text = " " + show(term[1].argm, canon, nams) + text;
        term = term[1].func;
      }
      return "(" + show(term, canon, nams) + text + ")";
    case "Put":
      var expr = show(args.expr, canon, nams);
      return "#" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, canon, nams);
      var body = show(args.body, canon, nams.concat([name]));
      return "(dup " + name + " = " + expr + " " + body + ")";
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
      return "(cpy " + name + " = " + numb + " " + body + ")";
    case "Par":
      var text = term_to_text([ctor, args]);
      if (text !== null) {
        return "\"" + text + "\"";
      } else {
        var val0 = show(args.val0, canon, nams);
        var val1 = show(args.val1, canon, nams);
        return "[" + val0 + "," + val1 + "]";
      }
    case "Fst":
      var pair = show(args.pair, canon, nams);
      return "(fst " + pair + ")";
    case "Snd":
      var pair = show(args.pair, canon, nams);
      return "(snd " + pair + ")";
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, canon, nams);
      var body = show(args.body, canon, nams.concat([nam0, nam1]));
      return "(get [" + nam0 + "," + nam1 + "] = " + pair + " " + body + ")";
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
    case "Put":
      var expr = shift(term.expr, inc, depth);
      return Put(expr);
    case "Dup":
      var name = term.name;
      var expr = shift(term.expr, inc, depth);
      var body = shift(term.body, inc, depth + 1);
      return Dup(name, expr, body);
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
    case "Par":
      var val0 = shift(term.val0, inc, depth);
      var val1 = shift(term.val1, inc, depth);
      return Par(val0, val1);
    case "Fst":
      var pair = shift(term.pair, inc, depth);
      return Fst(pair);
    case "Snd":
      var pair = shift(term.pair, inc, depth);
      return Snd(pair);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = shift(term.pair, inc, depth);
      var body = shift(term.body, inc, depth + 2);
      return Prj(nam0, nam1, pair, body);
    case "Ref":
      return Ref(term.name);
  }
}

// Substitution
const subst = ([ctor, term], val, depth) => {
  switch (ctor) {
    case "Var":
      return depth === term.index ? val : Var(term.index - (term.index > depth ? 1 : 0));
    case "All":
      var name = term.name;
      var body = subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var bind = subst(term.bind, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = subst(term.func, val, depth);
      var argm = subst(term.argm, val, depth);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Put":
      var expr = subst(term.expr, val, depth);
      return Put(expr);
    case "Dup":
      var name = term.name;
      var expr = subst(term.expr, val, depth);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Dup(name, expr, body);
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
    case "Par":
      var val0 = subst(term.val0, val, depth);
      var val1 = subst(term.val1, val, depth);
      return Par(val0, val1);
    case "Fst":
      var pair = subst(term.pair, val, depth);
      return Fst(pair);
    case "Snd":
      var pair = subst(term.pair, val, depth);
      return Snd(pair);
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = subst(term.pair, val, depth);
      var body = subst(term.body, val && shift(val, 2, 0), depth + 2);
      return Prj(nam0, nam1, pair, body);
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
    case "All": return 0;
    case "Lam": return uses(term.body, depth + 1);
    case "App": return uses(term.func, depth) + uses(term.argm, depth);
    case "Put": return uses(term.expr, depth);
    case "Dup": return uses(term.expr, depth) + uses(term.body, depth + 1);
    case "Num": return 0;
    case "Op1": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Op2": return uses(term.num0, depth) + uses(term.num1, depth);
    case "Ite": return uses(term.cond, depth) + uses(term.pair, depth);
    case "Cpy": return uses(term.numb, depth) + uses(term.body, depth + 1);
    case "Par": return uses(term.val0, depth) + uses(term.val1, depth);
    case "Fst": return uses(term.pair, depth);
    case "Snd": return uses(term.pair, depth);
    case "Prj": return uses(term.pair, depth) + uses(term.body, depth + 2);
    case "Ref": return 0;
  }
}

// Checks if variable only occurs at a specific relative level
const is_at_level = ([ctor, term], at_level, depth = 0, level = 0) => {
  switch (ctor) {
    case "Var": return term.index !== depth || level === at_level;
    case "All": return true;
    case "Lam": return is_at_level(term.body, at_level, depth + 1, level);
    case "App": return is_at_level(term.func, at_level, depth, level) && is_at_level(term.argm, at_level, depth, level);
    case "Put": return is_at_level(term.expr, at_level, depth, level + 1);
    case "Dup": return is_at_level(term.expr, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Num": return true;
    case "Op1": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Op2": return is_at_level(term.num0, at_level, depth, level) && is_at_level(term.num1, at_level, depth, level);
    case "Ite": return is_at_level(term.cond, at_level, depth, level) && is_at_level(term.pair, at_level, depth, level);
    case "Cpy": return is_at_level(term.numb, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Par": return is_at_level(term.val0, at_level, depth, level) && is_at_level(term.val1, at_level, depth, level);
    case "Fst": return is_at_level(term.pair, at_level, depth, level);
    case "Snd": return is_at_level(term.pair, at_level, depth, level);
    case "Prj": return is_at_level(term.pair, at_level, depth, level) && is_at_level(term.body, at_level, depth + 2, level);
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
      return cond[1].numb > 0 ? first(pair) : second(pair);
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
  const first = (pair) => {
    if (pair[0] === "Par") {
      return pair[1].val0;
    } else {
      return Fst(pair);
    }
  }
  const second = (pair) => {
    if (pair[0] === "Par") {
      return pair[1].val1;
    } else {
      return Snd(pair);
    }
  }
  const project = (nam0, nam1, pair, body) => {
    if (pair[0] === "Par") {
      return body(pair[1].val0, pair[1].val1);
    } else {
      return Prj(nam0, nam1, pair, body);
    }
  }
  const unquote = (term, vars) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return vars[term.index] || Var(vars.length - term.index - 1);
      case "All": return All(term.name, unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "Lam": return Lam(term.name, term.bind && unquote(term.bind, vars), x => unquote(term.body, [x].concat(vars)), term.eras);
      case "App": return apply(unquote(term.func, vars), unquote(term.argm, vars), term.eras);
      case "Put": return Put(unquote(term.expr, vars));
      case "Dup": return duplicate(term.name, unquote(term.expr, vars), x => unquote(term.body, [x].concat(vars)));
      case "Num": return Num(term.numb);
      case "Op1": return op1(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Op2": return op2(term.func, unquote(term.num0, vars), unquote(term.num1, vars));
      case "Ite": return if_then_else(unquote(term.cond, vars), unquote(term.pair, vars));
      case "Cpy": return copy(term.name, unquote(term.numb, vars), x => unquote(term.body, [x].concat(vars)));
      case "Par": return Par(unquote(term.val0, vars), unquote(term.val1, vars));
      case "Fst": return first(unquote(term.pair, vars));
      case "Snd": return second(unquote(term.pair, vars));
      case "Prj": return project(term.nam0, term.nam1, unquote(term.pair, vars), (x,y) => unquote(term.body, [y,x].concat(vars)));
      case "Ref": return dereference(term.name);
    }
  };
  const quote = (term, depth) => {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var": return Var(depth - 1 - term.index);
      case "All": return All(term.name, quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "Lam": return Lam(term.name, term.bind && quote(term.bind, depth), quote(term.body(Var(depth)), depth + 1), term.eras);
      case "App": return App(quote(term.func, depth), quote(term.argm, depth), term.eras);
      case "Put": return Put(quote(term.expr, depth));
      case "Dup": return Dup(term.name, quote(term.expr, depth), quote(term.body(Var(depth)), depth + 1));
      case "Num": return Num(term.numb);
      case "Op1": return Op1(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Op2": return Op2(term.func, quote(term.num0, depth), quote(term.num1, depth));
      case "Ite": return Ite(quote(term.cond, depth), quote(term.pair, depth));
      case "Cpy": return Cpy(term.name, quote(term.numb, depth), quote(term.body(Var(depth)), depth + 1));
      case "Par": return Par(quote(term.val0, depth), quote(term.val1, depth));
      case "Fst": return Fst(quote(term.pair, depth));
      case "Snd": return Snd(quote(term.pair, depth));
      case "Prj": return Prj(term.nam0, term.nam1, quote(term.pair, depth), quote(term.body(Var(depth), Var(depth + 1)), depth + 2));
      case "Ref": return Ref(term.name);
    }
  };
  return quote(unquote(term, []), 0);
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// Checks if two terms are equal
const equal = ([a_ctor, a_term], [b_ctor, b_term]) => {
  switch (a_ctor + "-" + b_ctor) {
    case "Var-Var": return a_term.index === b_term.index;
    case "Lam-Lam": return equal(a_term.body, b_term.body);
    case "App-App": return equal(a_term.func, b_term.func) && equal(a_term.argm, b_term.argm);
    case "Put-Put": return equal(a_term.expr, b_term.expr);
    case "Dup-Dup": return equal(a_term.expr, b_term.expr) && equal(a_term.body, b_term.body);
    case "Ref-Ref": return a_term.name === b_term.name;
    case "Num-Num": return a_term.numb === b_term.numb;
    case "Op1-Op1": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && a_term.num1 === a_term.num1;
    case "Op2-Op2": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && equal(a_term.num1, b_term.num1);
    case "Ite-Ite": return equal(a_term.cond, b_term.cond) && equal(a_term.pair, b_term.pair);
    case "Cpy-Cpy": return equal(a_term.numb, b_term.numb) && equal(a_term.body, b_term.body);
    case "Par-Par": return equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1);
    case "Fst-Fst": return equal(a_term.pair, b_term.pair);
    case "Snd-Snd": return equal(a_term.pair, b_term.pair);
    case "Prj-Prj": return equal(a_term.pair, b_term.pair) && equal(a_term.body, b_term.body);
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
  term = Par(Num(0x74786574), Lam("c", null, Dup("c", Var(0), Put(Lam("n", null, term, false))), false));
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

const ctx_new = null;

const ctx_ext = (name, type, ctx) => {
  return {name, type, rest: ctx};
}

const ctx_get = (i, ctx) => {
  for (var k = 0; k < i; ++k) {
    ctx = ctx.rest;
  }
  return [ctx.name, shift(ctx.type, i + 1, 0)];
}

const ctx_str = (ctx) => {
  return "<TODO>";
}

const ctx_names = (ctx) => {
  var names = [];
  while (ctx !== null) {
    names.push(ctx.name);
    ctx = ctx.rest;
  }
  return names;
}

const infer = (term, defs, ctx = ctx_new) => {
  switch (term[0]) {
    case "Var":
      return ctx_get(term[1].index, ctx)[1];
    case "All":
      var bind_t = infer(term[1].bind, defs, ctx);
      var ex_ctx = ctx_ext(term[1].name, term[1].bind, ctx);
      var body_t = infer(term[1].body, defs, ex_ctx);
      if (!equal(bind_t, Num(0), defs, ctx) || !equal(body_t, Num(0), defs, ctx)) {
        throw "[ERROR]\nForall not a type: `" + show(term, false, ctx_names(ctx)) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      }
      return Num(0);
    case "Lam":
      if (term[1].bind === null) {
        throw "[ERROR]\nCan't infer non-annotated lambda `" + show(term, false, ctx_names(ctx)) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      } else {
        var ex_ctx = ctx_ext(term[1].name, term[1].bind, ctx);
        var body_t = infer(term[1].body, defs, ex_ctx);
        var term_t = All(term[1].name, term[1].bind, body_t, term[1].eras);
        infer(term_t, defs, ctx);
        return term_t;
      }
    case "App":
      var func_t = norm(infer(term[1].func, defs, ctx), defs);
      if (func_t[0] !== "All") {
        throw "[ERROR]\nNon-function application on `" + show(term, false, ctx_names(ctx)) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      }
      if (func_t[1].eras !== term[1].eras) {
        throw "[ERROR]\nErasure doesn't match on application `" + show(term, false, ctx_names(ctx)) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      }
      var argm_v = typecheck(term[1].argm, func_t[1].bind, defs, ctx);
      return subst(func_t[1].body, argm_v, 0);
    case "Num":
      return Num(0);
    //case "Box":
      //var expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
      //if (!equals(expr_t, Typ(), defs, ctx)) {
        //throw "[ERROR]\nBox not a type: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //return Typ();
    //case "Put":
      //if (term[1].type === null) {
        //throw "[ERROR]\nCan't infer non-annotated put `"+show(term,ctx)+"`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //} else {
        //var term_t = infer(term[1].expr, defs, ctx, strat, seen);
        //return Box(term_t);
      //}
    //case "Dup":
      //var expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
      //if (expr_t[0] !== "Box") {
        //throw "[ERROR]\nUnboxed duplication: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //if (strat && !is_at_level(term[1].body, 1)) {
        //throw "[ERROR]\nOccurrence of duplication varible isn't wrapped by exactly 1 box: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //var ex_ctx = extend(ctx, [term[1].name, shift(expr_t[1].expr, 1, 0)]);
      //var body_t = infer(term[1].body, defs, ex_ctx, strat, seen);
      //return subst(body_t, Dup(term[1].name, term[1].expr, Var(0)), 0);
    //case "Slf":
      //var ex_ctx = extend(ctx, [term[1].name, shift(term, 1, 0)]);
      //var type_t = infer(term[1].type, defs, ex_ctx, false, seen);
      //if (!equals(type_t, Typ(), defs, ctx)) {
        //throw "[ERROR]\nSelf not a type: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //return Typ();
    //case "New":
      //var type = norm(term[1].type, defs, true);
      //if (type[0] !== "Slf") { 
        //throw "[ERROR]\nNon-self instantiation: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //infer(type, defs, ctx, false, seen);
      //check(term[1].expr, subst(type[1].type, Ann(type, term, true), 0), defs, ctx, strat, seen);
      //return term[1].type;
    //case "Use":
      //var expr_t = norm(infer(term[1].expr, defs, ctx, false, seen), defs, true);
      //if (expr_t[0] !== "Slf") {
        //throw "[ERROR]\nNon-self projection: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + ctx_str(ctx);
      //}
      //return subst(expr_t[1].type, term[1].expr, 0);
    //case "Ann":
      //if (!term[1].done) {
        //term[1].done = true;
        //check(term[1].expr, term[1].type, defs, ctx, strat, seen);
      //}
      //return term[1].type;
    //case "Ref":
      //if (strat && seen[term[1].name]) {
        //throw "[ERROR]\nRecursive use of: `" + term[1].name + "`.";
      //}
      //if (!defs[term[1].name]) {
        //throw "[ERROR]\nUndefined reference: `" + term[1].name + "`.";
      //}
      //var def = defs[term[1].name];
      //return infer(def, defs, ctx, strat, Object.assign({[term[1].name]: true}, seen));
    //case "Var":
      //return get_term(ctx, term[1].index);
    default:
      throw "TODO: type checker for " + term[0] + ".";
  }
}

const typecheck = (term, type, defs, ctx = []) => {
  var type_n = norm(type, defs);
  if (type_n[0] === "All" && term[0] === "Lam") {
    if (type_n[1].eras !== term[1].eras) {
      throw "Erasure doesn't match on " + expr() + ".";
    }
    infer(type_n, defs, ctx);
    var ex_ctx = ext_ctx(term[1].name, type_n[1].bind, ctx);
    var body_v = typecheck(term[1].body, type_n[1].body, defs, ex_ctx);
    return Lam(type_n[1].name, type_n[1].bind, body_v, type_n[1].eras);
  //} else if (type_n[0] === "Box" && term[0] === "Put") {
    //var expr_v = check(term[1].expr, type_n[1].expr, defs, ctx, strat, seen, () => "`" + show(term, ctx) + "`.");
    //return Put(expr_v);
  //} else if (term[0] === "Dup") {
    //var expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
    //if (expr_t[0] !== "Box") {
      //throw "[ERROR]\nUnboxed duplication: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
    //}
    //if (strat && !is_at_level(term[1].body, 1)) {
      //throw "[ERROR]\nOccurrence of duplication varible isn't wrapped by exactly 1 box: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
    //}
    //var ex_ctx = extend(ctx, [term[1].name, shift(expr_t[1].expr, 1, 0)]);
    //var body_v = check(term[1].body, shift(type_n, 1, 0), defs, ex_ctx, strat, seen, () => "`" + show(term, ctx) + "`'s body");
    //return Dup(term[1].name, term[1].expr, body_v);
  } else {
    var term_t = infer(term, defs, ctx);
    var checks = equal(norm(type_n, defs), norm(term_t, defs));
    if (!checks) {
      throw "Type mismatch.\n- " + show(type_n, false, ctx_names(ctx)) + "\n- " + show(term_t, false, ctx_names(ctx));
      //var error = show_mismatch(type, term_t, expr, ctx, defs);
      //throw error;
    }
    return term;
  }
};

module.exports = {
  Var, Ref, Lam, All, App,
  Put, Dup, Num, Op1, Op2,
  Ite, Cpy, Par, Fst, Snd,
  Prj,
  gen_name,
  parse,
  infer,
  show,
  check,
  norm,
  equal
};
