// ~~ Formality Core Language ~~

// ::::::::::
// :: Term ::
// ::::::::::

// An ESCoC term is an ADT represented by a JSON
const Var = (index)                  => ["Var", {index}];
const Lam = (name, body)             => ["Lam", {name, body}];
const App = (func, argm)             => ["App", {func, argm}];
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
        var argm = parse_term(ctx);
        var term = App(term, argm);
        next_char();
      }
      return term;
    }

    // Lambda
    else if (match("{")) {
      var names = [];
      while (idx < code.length && !match("}")) {
        names.push(parse_string());
      }
      var term = parse_term(ctx.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        term = Lam(names[i], term);
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
  var infs = {};
  while (idx < code.length) {
    next_char();
    if (match("inf ")) {
      var name = parse_string();
      var skip = parse_exact(":");
      var skip = parse_exact("init:");
      var init = parse_term([]);
      var skip = parse_exact("step:");
      var step = Lam("self", parse_term(["self"]));
      var skip = parse_exact("stop:");
      var stop = Lam("self", parse_term(["self"]));
      var skip = parse_exact("done:");
      var done = Lam("self", parse_term(["self"]));
      infs[name] = {init, step, stop, done};
    } else {
      var skip = parse_exact("def ");
      var name = parse_string();
      var skip = parse_exact(":");
      var term = parse_term([]);
      defs[name] = term;
    }
    next_char();
  }

  return {defs, infs};
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
const show = ([ctor, args], canon = false, ctx = []) => {
  switch (ctor) {
    case "Var":
      return ctx[ctx.length - args.index - 1] || "^" + args.index;
    case "Lam":
      var term = [ctor, args];
      var numb = null;
      var names = [];
      while (term[0] === "Lam") {
        numb = term_to_numb(term);
        if (numb !== null) {
          break;
        } else {
          names.push(canon ? gen_name(ctx.length) : term[1].name);
          term = term[1].body;
        }
      }
      var head = names.length > 0 ? "{" + names.join(" ") + "} " : "";
      if (numb !== null) {
        return head + "~" + Number(numb);
      } else {
        return head + show(term, canon, ctx.concat(names))
      }
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = " " + show(term[1].argm, canon, ctx) + text;
        term = term[1].func;
      }
      return "(" + show(term, canon, ctx) + text;
    case "Put":
      var expr = show(args.expr, canon, ctx);
      return "#" + expr;
    case "Dup":
      var name = args.name;
      var expr = show(args.expr, canon, ctx);
      var body = show(args.body, canon, ctx.concat([name]));
      return "(dup " + name + " = " + expr + " " + body + ")";
    case "Num":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, canon, ctx);
      var num1 = show(args.num1, canon, ctx);
      return "|" + num0 + " " + func + " " + num1 + "|";
    case "Ite":
      var cond = show(args.cond, canon, ctx);
      var pair = show(args.pair, canon, ctx);
      return "(if " + cond + " " + pair + ")";
    case "Cpy":
      var name = args.name;
      var numb = show(args.numb, canon, ctx);
      var body = show(args.body, canon, ctx.concat([name]));
      return "(cpy " + name + " = " + numb + " " + body + ")";
    case "Par":
      var text = term_to_text([ctor, args]);
      if (text !== null) {
        return "\"" + text + "\"";
      } else {
        var val0 = show(args.val0, canon, ctx);
        var val1 = show(args.val1, canon, ctx);
        return "[" + val0 + "," + val1 + "]";
      }
    case "Fst":
      var pair = show(args.pair, canon, ctx);
      return "(fst " + pair + ")";
    case "Snd":
      var pair = show(args.pair, canon, ctx);
      return "(snd " + pair + ")";
    case "Prj":
      var nam0 = args.nam0;
      var nam1 = args.nam1;
      var pair = show(args.pair, canon, ctx);
      var body = show(args.body, canon, ctx.concat([nam0, nam1]));
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
    case "Lam":
      var name = term.name;
      var body = shift(term.body, inc, depth + 1);
      return Lam(name, body);
    case "App":
      var func = shift(term.func, inc, depth);
      var argm = shift(term.argm, inc, depth);
      return App(func, argm);
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
    case "Lam":
      var name = term.name;
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Lam(name, body);
    case "App":
      var func = subst(term.func, val, depth);
      var argm = subst(term.argm, val, depth);
      return App(func, argm);
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
const norm = (term, defs = {}, to_lam = false) => {
  var [ctor, term] = term;
  const apply = (func, argm) => {
    var func = norm(func, defs, to_lam);
    // ([x]a b) ~> [b/x]a
    if (func[0] === "Lam") {
      return norm(subst(func[1].body, argm, 0), defs, to_lam);
    // ([x = a] b c) ~> [x = a] (b c)
    } else if (func[0] === "Dup") {
      return norm(Dup(func[1].name, func[1].expr, App(func[1].body, shift(argm, 1, 0))), defs, to_lam);
    // (|a b) ~> ⊥
    } else if (func[0] === "Put") {
      throw "[RUNTIME-ERROR]\nCan't apply a boxed value.";
    } else {
      return App(norm(func, defs, to_lam), norm(argm, defs, to_lam));
    }
  }
  const duplicate = (name, expr, body) => {
    var expr = norm(expr, defs, to_lam);
    // [x = |a] b ~> [a/x]b
    if (expr[0] === "Put") {
      return norm(subst(body, expr[1].expr, 0), defs, to_lam);
    // [x = [y = a] b] c ~> [y = a] [x = b] c
    } else if (expr[0] === "Dup") {
      return norm(Dup(expr[1].name, expr[1].expr, Dup(name, expr[1].body, shift(body, 1, 1))), defs, to_lam); 
    // [x = [y] b] c ~> ⊥
    } else if (expr[0] === "Lam") {
      throw "[RUNTIME-ERROR]\nCan't duplicate a lambda.";
    } else {
      return Dup(name, expr, norm(body, defs, to_lam));
    }
  }
  const dereference = (name) => {
    if (defs[name]) {
      return norm(defs[name], defs, to_lam);
    } else {
      return Ref(name);
    }
  }
  const op1 = (func, num0, num1) => {
    var num0 = norm(num0, defs, to_lam);
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
      return Op1(func, num0, norm(num1, defs, to_lam));
    }
  }
  const op2 = (func, num0, num1) => {
    var num1 = norm(num1, defs, to_lam);
    if (num1[0] === "Num") {
      return norm(Op1(func, num0, num1), defs, to_lam);
    } else {
      return Op2(func, norm(num0, defs, to_lam), num1);
    }
  }
  const if_then_else = (cond, pair) => {
    var cond = norm(cond, defs, to_lam);
    if (cond[0] === "Num") {
      return norm(cond[1].numb > 0 ? Fst(pair) : Snd(pair), defs, to_lam);
    } else {
      return Ite(cond, norm(pair, defs, to_lam));
    }
  }
  const copy = (name, numb, body) => {
    var numb = norm(numb, defs, to_lam);
    if (numb[0] === "Num") {
      return norm(subst(body, numb, 0), defs, to_lam);
    } else {
      return Cpy(name, numb, norm(body, defs, to_lam));
    }
  }
  const first = (pair) => {
    var pair = norm(pair, defs, to_lam);
    if (pair[0] === "Par") {
      return norm(pair[1].val0, defs, to_lam);
    } else {
      return Fst(pair);
    }
  }
  const second = (pair) => {
    var pair = norm(pair, defs, to_lam);
    if (pair[0] === "Par") {
      return norm(pair[1].val1, defs, to_lam);
    } else {
      return Snd(pair);
    }
  }
  const case_of = (nam0, nam1, pair, body) => {
    var pair = norm(pair, defs, to_lam);
    if (pair[0] === "Par") {
      return norm(subst(subst(body, shift(pair[1].val0, 1, 0), 1), pair[1].val1, 0), defs, to_lam);
    } else {
      return Prj(nam0, nam1, pair, norm(body, defs, to_lam));
    }
  }
  if (to_lam && ctor === "Put") {
    return norm(term.expr, defs, to_lam);
  } else if (to_lam && ctor === "Dup") {
    return norm(subst(term.body, term.expr, 0), defs, to_lam)
  } else if (to_lam && ctor === "Prj") {
    return norm(subst(subst(term.body, Fst(shift(term.pair, 1, 0)), 1), Snd(term.pair), 0), defs, to_lam);
  } else if (to_lam && ctor === "Cpy") {
    return norm(subst(term.body, term.numb, 0), defs, to_lam)
  } else {
    switch (ctor) {
      case "Var": return Var(term.index);
      case "Lam": return Lam(term.name, norm(term.body, defs, to_lam)); 
      case "App": return apply(term.func, term.argm);
      case "Put": return Put(norm(term.expr, defs, to_lam));
      case "Dup": return duplicate(term.name, term.expr, term.body);
      case "Num": return Num(term.numb);
      case "Op1": return op1(term.func, term.num0, term.num1);
      case "Op2": return op2(term.func, term.num0, term.num1);
      case "Ite": return if_then_else(term.cond, term.pair);
      case "Cpy": return copy(term.name, term.numb, term.body);
      case "Par": return Par(norm(term.val0, defs, to_lam), norm(term.val1, defs, to_lam));
      case "Fst": return first(term.pair);
      case "Snd": return second(term.pair);
      case "Prj": return case_of(term.nam0, term.nam1, term.pair, term.body);
      case "Ref": return dereference(term.name);
    }
  }
}

// ::::::::::::::
// :: Equality ::
// ::::::::::::::

// Checks if two terms are equal
const equal = ([a_ctor, a_term], [b_ctor, b_term]) => {
  switch (a_ctor + "-" + b_ctor) {
    case "var-var": return a_term.index === b_term.index;
    case "lam-lam": return equal(a_term.body, b_term.body);
    case "app-app": return equal(a_term.func, b_term.func) && equal(a_term.argm, b_term.argm);
    case "put-put": return equal(a_term.expr, b_term.expr);
    case "dup-dup": return equal(a_term.expr, b_term.expr) && equal(a_term.body, b_term.body);
    case "ref-ref": return a_term.name === b_term.name;
    case "num-num": return a_term.numb === b_term.numb;
    case "op1-op1": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && a_term.num1 === a_term.num1;
    case "op2-op2": return a_term.func === b_term.func && equal(a_term.num0, b_term.num0) && equal(a_term.num1, b_term.num1);
    case "ite-ite": return equal(a_term.cond, b_term.cond) && equal(a_term.pair, b_term.pair);
    case "cpy-cpy": return equal(a_term.numb, b_term.numb) && equal(a_term.body, b_term.body);
    case "par-par": return equal(a_term.val0, b_term.val0) && equal(a_term.val1, b_term.val1);
    case "fst-fst": return equal(a_term.pair, b_term.pair);
    case "snd-snd": return equal(a_term.pair, b_term.pair);
    case "cas-cas": return equal(a_term.pair, b_term.pair) && equal(a_term.body, b_term.body);
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
    term = App(App(Var(1), Num(nums[i])), term);
  }
  term = Par(Num(0x74786574), Lam("c", Dup("c", Var(0), Put(Lam("n", term)))));
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
    term = (numb >>> (log2 - i)) & 1 ? App(Var(i + 1), term) : term;
  }
  term = Put(Lam("x", term));
  for (var i = 0; i < log2; ++i) {
    term = Dup("s" + (log2 - i), Put(Lam("x", App(Var(1), App(Var(1), Var(0))))), term);
  }
  term = Lam("s", Dup("s0", Var(0), term));
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

module.exports = {
  Var, Ref, Lam, App, Put,
  Dup, Num, Op1, Op2, Ite,
  Cpy, Par, Fst, Snd, Prj,
  gen_name,
  parse,
  show,
  check,
  norm,
  equal
};
