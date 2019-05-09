// An ESCoC term is an ADT represented by a JSON
const Var = (index)            => ["Var", {index}];
const Lam = (name, body)       => ["Lam", {name, body}];
const App = (func, argm)       => ["App", {func, argm}];
const Put = (expr)             => ["Put", {expr}];
const Dup = (name, expr, body) => ["Dup", {name, expr, body}];
const Ref = (name)             => ["Ref", {name}];
const Num = (numb)             => ["Num", {numb}];
const Op1 = (func, num0, num1) => ["Op1", {func, num0, num1}];
const Op2 = (func, num0, num1) => ["Op2", {func, num0, num1}];

const BUF = new ArrayBuffer(8);
const U32 = new Uint32Array(BUF);
const F64 = new Float64Array(BUF);

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
      var text = term_to_text([ctor, args]);
      if (text) {
        return "\"" + text + "\"";
      } else {
        var name = canon ? gen_name(ctx.length) : args.name;
        var body = show(args.body, canon, ctx.concat([name]));
        return "[" + name + "] " + body;
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
      return "[" + name + " = " + expr + "] " + body;
    case "Num":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, canon, ctx);
      var num1 = show(args.num1, canon, ctx);
      return "{" + num0 + " " + func + " " + num1 + "}";
    case "Ref":
      return args.name;
  }
}

// Converts a string to a term
const parse = (code) => {
  function is_space(char) {
    return char === " " || char === "\t" || char === "\n";
  }

  function is_name_char(char) {
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.+-*/%&|^~<>".indexOf(char) !== -1;
  }

  function skip_spaces() {
    while (index < code.length && is_space(code[index])) {
      index += 1;
    }
    return index;
  }

  function match(string) {
    skip_spaces();
    var sliced = code.slice(index, index + string.length);
    if (sliced === string) {
      index += string.length;
      return true;
    }
    return false;
  }

  function error(text) {
    text += "This is the relevant code:\n\n<<<";
    text += code.slice(index - 64, index) + "<<<HERE>>>";
    text += code.slice(index, index + 64) + ">>>";
    throw text;
  }

  function parse_exact(string) {
    if (!match(string)) {
      error("Parse error, expected '" + string + "'.\n");
    }
  }

  function parse_name() {
    skip_spaces();
    var name = "";
    while (index < code.length && is_name_char(code[index])) {
      name = name + code[index];
      index += 1;
    }
    return name;
  }

  function parse_term(ctx) {
    // Comment
    if (match("-")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
      return parse_term(ctx);
    }

    // Application
    else if (match("(")) {
      var func = parse_term(ctx);
      while (index < code.length && !match(")")) {
        var argm = parse_term(ctx);
        var func = App(func, argm);
        skip_spaces();
      }
      return func;
    }

    // Lambda / Duplication
    else if (match("[")) {
      var name = parse_name();
      var expr = match("=") ? parse_term(ctx) : null;
      var skip = parse_exact("]");
      var body = parse_term(ctx.concat([name]));
      return expr ? Dup(name, expr, body) : Lam(name, body);
    }

    // Put
    else if (match("#")) {
      var expr = parse_term(ctx);
      return Put(expr);
    }

    // Let
    else if (match("let")) {
      var name = parse_name();
      var copy = parse_term(ctx);
      var body = parse_term(ctx.concat([name]));
      return subst(body, copy, 0);
    }

    // Operation
    else if (match("{")) {
      var num0 = parse_term(ctx);
      var func = parse_name();
      var num1 = parse_term(ctx);
      var skip = parse_exact("}");
      return Op2(func, num0, num1);
    }

    // String
    else if (match("\"")) {
      // Parses text
      var text = "";
      while (code[index] !== "\"") {
        text += code[index++];
      }
      index++;
      return text_to_term(text);
    }

    // Variable / Reference
    else {
      var name = parse_name();
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

  var index = 0;
  var defs = {};
  while (index < code.length) {
    skip_spaces();
    if (match("/")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
    } else {
      var init = index;
      var skip = parse_exact(".");
      var name = parse_name();
      var term = parse_term([]);
      defs[name] = term;
    }
    skip_spaces();
  }

  return defs;
}

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
    case "Ref":
      var name = term.name;
      return Ref(name);
  }
}

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
    case "Ref": return 0;
  }
}

// Checks if variable only occurs at a specific relative level
const is_at_level = ([ctor, term], at_level, depth = 0, level = 0) => {
  switch (ctor) {
    case "Var": return term.index !== depth || level === at_level;
    case "Lam": return is_at_level(term.body, at_level, depth + 1, level);
    case "App": return is_at_level(term.func, at_level, depth, level) && (term.eras || is_at_level(term.argm, at_level, depth, level));
    case "Put": return is_at_level(term.expr, at_level, depth, level + 1);
    case "Dup": return is_at_level(term.expr, at_level, depth, level) && is_at_level(term.body, at_level, depth + 1, level);
    case "Num": return true;
    case "Op1": return is_at_level(term.num0, at_level, depth, level) + is_at_level(term.num1, at_level, depth, level);
    case "Op2": return is_at_level(term.num0, at_level, depth, level) + is_at_level(term.num1, at_level, depth, level);
    case "Pri": return is_at_level(term.argm, at_level, depth, level);
    case "Ref": return true;
  }
}

// Checks if a term is stratified
const check_stratification = ([ctor, term], defs = {}, ctx = []) => {
  switch (ctor) {
    case "Lam": 
      if (uses(term.body) > 1) {
        throw "[ERROR]\nAffine variable `" + term.name + "` used more than once in:\n" + show([ctor, term], false, ctx);
      }
      if (!is_at_level(term.body, 0)) {
        throw "[ERROR]\nAffine variable `" + term.name + "` used inside a box in:\n" + show([ctor, term], false, ctx);
      }
      check_stratification(term.body, defs, ctx.concat([term.name]));
      break;
    case "App":
      check_stratification(term.func, defs, ctx);
      check_stratification(term.argm, defs, ctx);
      break;
    case "Put":
      check_stratification(term.expr, defs, ctx);
      break;
    case "Dup":
      if (!is_at_level(term.body, 1)) {
        throw "[ERROR]\nExponential variable `" + term.name + "` must always have exactly 1 enclosing box on the body of:\n" + show([ctor, term], false, ctx);
      }
      check_stratification(term.expr, defs, ctx);
      check_stratification(term.body, defs, ctx.concat([term.name]));
      break;
    case "Op1":
    case "Op2":
      check_stratification(term.num0, defs, ctx);
      check_stratification(term.num1, defs, ctx);
      break;
    case "Ref":
      if (!defs[term.name]) {
        throw "[ERROR]\nUndefined reference: " + term.name;
      } else {
        check_stratification(defs[term.name], defs, ctx);
        break;
      }
  }
}

// Reduces a term to normal form or head normal form
const norm = ([ctor, term], defs = {}, dup = false) => {
  const apply = (func, argm) => {
    var func = norm(func, defs, dup);
    // ([x]a b) ~> [b/x]a
    if (func[0] === "Lam") {
      return norm(subst(func[1].body, argm, 0), defs, dup);
    // ([x = a] b c) ~> [x = a] (b c)
    } else if (func[0] === "Dup") {
      return norm(Dup(func[1].name, func[1].expr, App(func[1].body, shift(argm, 1, 0))), defs, dup);
    // (|a b) ~> ⊥
    } else if (func[0] === "Put") {
      throw "[RUNTIME-ERROR]\nCan't apply a boxed value.";
    } else {
      return App(norm(func, defs, dup), norm(argm, defs, dup));
    }
  }
  const duplicate = (name, expr, body) => {
    var expr = norm(expr, defs, dup);
    // [x = |a] b ~> [a/x]b
    if (expr[0] === "Put") {
      return norm(subst(body, expr[1].expr, 0), defs, dup);
    // [x = [y = a] b] c ~> [y = a] [x = b] c
    } else if (expr[0] === "Dup") {
      return norm(Dup(expr[1].name, expr[1].expr, Dup(name, expr[1].body, shift(body, 1, 1))), defs, dup); 
    // [x = [y] b] c ~> ⊥
    } else if (expr[0] === "Lam") {
      throw "[RUNTIME-ERROR]\nCan't duplicate a lambda.";
    } else {
      return Dup(name, norm(expr, defs, dup), norm(body, defs, dup));
    }
  }
  const dereference = (name) => {
    if (defs[name]) {
      return norm(defs[name], defs, dup);
    } else {
      return Ref(name);
    }
  }
  const op1 = (func, num0, num1) => {
    var num0 = norm(num0, defs, dup);
    if (num0[0] === "Num") {
      switch (func) {
        case "+"  : return Num((num0[1].numb + num1[1].numb) >>> 0);
        case "-"  : return Num((num0[1].numb - num1[1].numb) >>> 0);
        case "*"  : return Num((num0[1].numb * num1[1].numb) >>> 0);
        case "/"  : return Num((num0[1].numb / num1[1].numb) >>> 0);
        case "%"  : return Num((num0[1].numb % num1[1].numb) >>> 0);
        case "**" : return Num((num0[1].numb ** num1[1].numb) >>> 0);
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
      return Op1(func, num0, norm(num1, defs, dup));
    }
  }
  const op2 = (func, num0, num1) => {
    var num1 = norm(num1, defs, dup);
    if (num1[0] === "Num") {
      return norm(Op1(func, num0, num1), defs, dup);
    } else {
      return Op2(func, norm(num0, defs, dup), num1);
    }
  }
  switch (ctor) {
    case "Var": return Var(term.index);
    case "Lam": return Lam(term.name, norm(term.body, defs, dup)); 
    case "App": return apply(term.func, term.argm);
    case "Put": return dup ? norm(term.expr, defs, dup) : Put(norm(term.expr, defs, dup));
    case "Dup": return dup ? norm(subst(term.body, term.expr, 0), defs, dup) : duplicate(term.name, term.expr, term.body);
    case "Num": return Num(term.numb);
    case "Op1": return op1(term.func, term.num0, term.num1);
    case "Op2": return op2(term.func, term.num0, term.num1);
    case "Ref": return dereference(term.name);
  }
}

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
    default: return false;
  }
}

const text_to_term = (text) => {
  // Converts UTF-8 to bytes
  var bytes = [].slice.call(new TextEncoder("utf-8").encode(text), 0);

  // Converts bytes to uints
  while (bytes.length % 8 !== 0) {
    bytes.push(0);
  }
  var nums = new Uint32Array(new Uint8Array(bytes).buffer);

  // Converts uints to C-List of nums
  var term = Var(0);
  for (var i = nums.length - 1; i >= 0; --i) {
    term = App(App(Var(1), Num(nums[i])), term);
  }
  term = App(App(Var(1), Num(0x74786574)), term);
  term = Lam("c", Dup("c", Var(0), Put(Lam("n", term))));
  return term;
}

const term_to_text = (term) => {
  try {
    try {
      term = term[1].body[1].body[1].expr[1].body;
    } catch(e) {
      term = term[1].body[1].body;
    }
    if (term[1].func[1].argm[1].numb === 0x74786574) {
      term = term[1].argm;
      var nums = [];
      while (term[0] !== "Var") {
        nums.push(term[1].func[1].argm[1].numb);
        term = term[1].argm;
      }
      return new TextDecoder("utf-8").decode(new Uint8Array(new Uint32Array(nums).buffer));
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

module.exports = {
  gen_name,
  Var,
  Lam,
  App,
  Ref,
  Num,
  Op1,
  Op2,
  show,
  parse,
  check_stratification,
  norm,
  equal
};
