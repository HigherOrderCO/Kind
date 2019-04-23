const Var = (index)                  => ["Var", {index},                  "[" + index + "]"];
const Typ = ()                       => ["Typ", {},                       "#typ"];
const All = (name, bind, body, eras) => ["All", {name, bind, body, eras}, "#all" + bind[2] + body[2]];
const Lam = (name, bind, body, eras) => ["Lam", {name, bind, body, eras}, "#lam" + (bind?bind[2]:"") + body[2]];
const App = (func, argm, eras)       => ["App", {func, argm, eras},       "#app" + func[2] + argm[2]];
const Ref = (name, eras)             => ["Ref", {name, eras},             "{" + name + "}"];
const Box = (expr)                   => ["Box", {expr},                   "#box" + expr[2]];
const Put = (expr)                   => ["Put", {expr},                   "#put" + expr[2]];
const Dup = (name, expr, body)       => ["Dup", {name, expr, body},       "#dup" + expr[2] + body[2]];
const Slf = (name, type)             => ["Slf", {name, type},             "#slf" + type[2]];
const New = (type, expr)             => ["New", {type, expr},             "#new" + type[2] + expr[2]];
const Use = (expr)                   => ["Use", {expr},                   "#use" + expr[2]];
const Ann = (type, expr, done)       => ["Ann", {type, expr, done},       "#ann" + expr[2] + type[2]];

// Generates a name
const gen_name = (n) => {
  let str = "";
  ++n;
  while (n > 0) {
    --n;
    str += String.fromCharCode(97 + n % 26);
    n = Math.floor(n / 26);
  }
  return str;
};


const Ctx = () => null;

const extend = (ctx, bind) => {
  return {head: bind, tail: ctx};
}

const len = (ctx) => {
  return ctx ? 1 + ctx.tail : 0;
}

const get_bind = (ctx, i, j = 0) => {
  if (!ctx) {
    return null;
  } else if (j < i) {
    return get_bind(ctx.tail, i, j + 1);
  } else {
    return [ctx.head[0], ctx.head[1] ? shift(ctx.head[1], i, 0) : null];
  }
}

const get_name = (ctx, i) => {
  const count = (ctx, name, i) => {
    return i === 0 ? 0 : (ctx.head[0] === name ? 1 : 0) + count(ctx.tail, name, i - 1);
  }
  const repeat = (str, i) => {
    return i === 0 ? "" : str + repeat(str, i - 1);
  }
  const bind = get_bind(ctx, i);
  if (bind) {
    return (bind[0] || "x") + repeat("'", count(ctx, bind[0], i));
  } else {
    return "#" + i;
  }
}

const get_term = (ctx, i) => {
  return get_bind(ctx, i) ? get_bind(ctx, i)[1] : null;
}

const index_of = (ctx, name, skip, i = 0) => {
  if (!ctx) {
    return null;
  } else if (ctx.head[0] === name && skip > 0) {
    return index_of(ctx.tail, name, skip - 1, i + 1);
  } else if (ctx.head[0] !== name) {
    return index_of(ctx.tail, name, skip, i + 1);
  } else {
    return i;
  }
}

// Pretty prints a context
const show_context = (ctx, i = 0) => {
  const bind = get_bind(ctx, i);
  if (bind) {
    const term = " : " + (bind[1] ? show(norm(bind[1], {}), ctx) : "?");
    return show_context(ctx, i + 1) + bind[0] + term + "\n";
  } else {
    return "";
  }
}

// Converts a term to a string
const show = ([ctor, args], ctx = Ctx()) => {
  switch (ctor) {
    case "Var":
      const name = get_name(ctx, args.index);
      return name !== null ? name : "#" + args.index;
    case "Typ":
      return "Type";
    case "All":
      const eras = args.eras ? "-" : "";
      const name = args.name || "x";
      const bind = show(args.bind, ctx);
      const body = show(args.body, extend(ctx, [args.name, null]));
      return "{" + eras + name + " : " + bind + "} " + body;
    case "Lam":
      const eras = args.eras ? "-" : "";
      const name = args.name || "x";
      const bind = args.bind && show(args.bind, ctx);
      const body = show(args.body, extend(ctx, [name, null]));
      return bind ? "[" + eras + name + " : " + bind + "] " + body : "[" + eras + name + "] " + body;
    case "App":
      let text = ")";
      let term = [ctor, args];
      while (term[0] === "App") {
        text = (term[1].eras ? " -" : " ") + show(term[1].argm, ctx) + text;
        term = term[1].func;
      }
      return "(" + show(term, ctx) + text;
    case "Box":
      const expr = show(args.expr, ctx);
      return "!" + expr;
    case "Put":
      const expr = show(args.expr, ctx);
      return "#" + expr;
    case "Dup":
      const name = args.name;
      const expr = show(args.expr, ctx);
      const body = show(args.body, extend(ctx, [args.name, null]));
      return "[" + name + " = " + expr + "] " + body;
    case "Slf":
      const name = args.name;
      const type = show(args.type, extend(ctx, [args.name, null]));
      return "$" + name + " " + type;
    case "New":
      const type = show(args.type, ctx);
      const expr = show(args.expr, ctx);
      return "@" + type + " " + expr;
    case "Use":
      const expr = show(args.expr, ctx);
      return "~" + expr; 
    case "Ann":
      //var type = show(args.type, ctx);
      //var expr = show(args.expr, ctx);
      //return ":" + type + " = " + expr;
      //var type = show(args.type, ctx);
      const expr = show(args.expr, ctx);
      return expr;
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
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.~".indexOf(char) !== -1;
  }

  function skip_spaces() {
    while (index < code.length && is_space(code[index])) {
      index += 1;
    }
    return index;
  }

  function match(string) {
    skip_spaces();
    const sliced = code.slice(index, index + string.length);
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
    let name = "";
    while (index < code.length && is_name_char(code[index])) {
      name = name + code[index];
      index += 1;
    }
    return name;
  }

  function parse_term(ctx) {
    // Comment
    if (match("//")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
      return parse_term(ctx);
    }

    // Application
    else if (match("(")) {
      let func = parse_term(ctx);
      while (index < code.length && !match(")")) {
        const eras = match("-");
        const argm = parse_term(ctx);
        func = App(func, argm, eras);
        skip_spaces();
      }
      return func;
    }

    // Type
    else if (match("Type")) {
      return Typ();
    }

    // Forall
    else if (match("{")) {
      const eras = match("-");
      const name = parse_name();
      const skip = parse_exact(":");
      const bind = parse_term(ctx);
      const skip = parse_exact("}");
      const body = parse_term(extend(ctx, [name, Var(0)]));
      return All(name, bind, body, eras);
    }

    // Lambda
    else if (match("[")) {
      const eras = match("-");
      const name = parse_name();
      const bind = match(":") ? parse_term(ctx) : null;
      const expr = match("=") ? parse_term(ctx) : null;
      const skip = parse_exact("]");
      const body = parse_term(extend(ctx, [name, Var(0)]));
      return expr ? Dup(name, expr, body) : Lam(name, bind, body, eras);
    }

    // Box
    else if (match("!")) {
      const expr = parse_term(ctx);
      return Box(expr);
    }

    // Put
    else if (match("#")) {
      const expr = parse_term(ctx);
      return Put(expr);
    }

    // Let
    else if (match("let")) {
      const name = parse_name();
      const copy = parse_term(ctx);
      const body = parse_term(extend(ctx, [name, Var(0)]));
      return subst(body, copy, 0);
    }

    // Slf
    else if (match("$")) {
      const name = parse_name();
      const type = parse_term(extend(ctx, [name, Var(0)]));
      return Slf(name, type);
    }

    // New
    else if (match("@")) {
      const type = parse_term(ctx);
      const expr = parse_term(ctx);
      return New(type, expr);
    }

    // Use
    else if (match("~")) {
      const expr = parse_term(ctx);
      return Use(expr);
    }

    // Ann
    else if (match(":")) {
      const type = parse_term(ctx);
      const skip = parse_exact("=");
      const expr = parse_term(ctx);
      return Ann(type, expr, false);
    }

    // Variable / Reference
    else {
      const name = parse_name();
      let skip = 0;
      while (match("'")) {
        skip += 1;
      }
      const var_index = index_of(ctx, name, skip);
      if (var_index === null) {
        return Ref(name, false);
      } else {
        return get_bind(ctx, var_index)[1];
      }
    }
  }

  let index = 0;
  const defs = {};
  while (index < code.length) {
    skip_spaces();
    if (match("//")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
    } else {
      const skip = parse_exact(".");
      const name = parse_name();
      const term = parse_term(Ctx());
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
    case "Typ":
      return Typ();
    case "All":
      const eras = term.eras;
      const name = term.name;
      const bind = shift(term.bind, inc, depth);
      const body = shift(term.body, inc, depth + 1);
      return All(name, bind, body, eras);
    case "Lam":
      const eras = term.eras;
      const name = term.name;
      const bind = term.bind && shift(term.bind, inc, depth);
      const body = shift(term.body, inc, depth + 1);
      return Lam(name, bind, body, eras);
    case "App":
      const eras = term.eras;
      const func = shift(term.func, inc, depth);
      const argm = shift(term.argm, inc, depth);
      return App(func, argm, eras);
    case "Box":
      const expr = shift(term.expr, inc, depth);
      return Box(expr);
    case "Put":
      const expr = shift(term.expr, inc, depth);
      return Put(expr);
    case "Dup":
      const name = term.name;
      const expr = shift(term.expr, inc, depth);
      const body = shift(term.body, inc, depth + 1);
      return Dup(name, expr, body);
    case "Slf":
      const name = term.name;
      const type = shift(term.type, inc, depth + 1);
      return Slf(name, type);
    case "New":
      const type = shift(term.type, inc, depth);
      const expr = shift(term.expr, inc, depth);
      return New(type, expr);
    case "Use":
      const expr = shift(term.expr, inc, depth);
      return Use(expr);
    case "Ann":
      const type = shift(term.type, inc, depth);
      const expr = shift(term.expr, inc, depth);
      const done = term.done;
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
      const eras = term.eras;
      const name = term.name;
      const bind = subst(term.bind, val, depth);
      const body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return All(name, bind, body, eras);
    case "Lam":
      const eras = term.eras;
      const name = term.name;
      const bind = term.bind && subst(term.bind, val, depth);
      const body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Lam(name, bind, body, eras);
    case "App":
      const eras = term.eras;
      const func = subst(term.func, val, depth);
      const argm = subst(term.argm, val, depth);
      return App(func, argm, eras);
    case "Box":
      const expr = subst(term.expr, val, depth);
      return Box(expr);
    case "Put":
      const expr = subst(term.expr, val, depth);
      return Put(expr);
    case "Dup": 
      const name = term.name;
      const expr = subst(term.expr, val, depth);
      const body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Dup(name, expr, body);
    case "Slf":
      const name = term.name;
      const type = subst(term.type, val && shift(val, 1, 0), depth + 1);
      return Slf(name, type);
    case "New":
      const type = subst(term.type, val, depth);
      const expr = subst(term.expr, val, depth);
      return New(type, expr);
    case "Use":
      const expr = subst(term.expr, val, depth);
      return Use(expr);
    case "Ann":
      const type = subst(term.type, val, depth);
      const expr = subst(term.expr, val, depth);
      const done = term.done;
      return Ann(type, expr, done);
    case "Ref":
      const eras = term.eras;
      const name = term.name;
      return Ref(name, eras);
  }
}


// How many times a variable was used in computational positions
const uses = ([ctor, term], depth = 0) => {
  switch (ctor) {
    case "Var": return term.index === depth ? 1 : 0;
    case "Typ": return 0;
    case "All": return 0;
    case "Lam": return uses(term.body, depth + 1);
    case "App": return uses(term.func, depth) + (!term.eras ? uses(term.argm, depth) : 0);
    case "Box": return uses(term.expr, depth);
    case "Put": return uses(term.expr, depth);
    case "Dup": return uses(term.expr, depth) + uses(term.body, depth + 1);
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
    case "App": return is_at_level(term.func, at_level, depth, level) && (term.eras || is_at_level(term.argm, at_level, depth, level));
    case "Box": return is_at_level(term.expr, at_level, depth, level);
    case "Put": return is_at_level(term.expr, at_level, depth, level + 1);
    case "Dup": return is_at_level(term.expr, at_level, depth, level) + is_at_level(term.body, at_level, depth + 1, level);
    case "Slf": return true;
    case "New": return is_at_level(term.expr, at_level, depth, level);
    case "Use": return is_at_level(term.expr, at_level, depth, level);
    case "Ann": return is_at_level(term.expr, at_level, depth, level);
    case "Ref": return true;
  }
}
          
// Removes computationally irrelevant expressions
const erase = ([ctor, args]) => {
  switch (ctor) {
    case "Var": return Var(args.index);
    case "Typ": return Typ();
    case "All": return All(args.name, erase(args.bind), erase(args.body), args.eras);
    case "Lam": return args.eras ? subst(erase(args.body), Typ(), 0) : Lam(args.name, null, erase(args.body), args.eras);
    case "App": return args.eras ? erase(args.func) : App(erase(args.func), erase(args.argm), args.eras);
    case "Box": return Box(erase(args.expr));
    case "Put": return Put(erase(args.expr));
    case "Dup": return Dup(args.name, erase(args.expr), erase(args.body));
    case "Ref": return Ref(args.name, true);
    case "Slf": return Slf(args.name, erase(args.type));
    case "New": return erase(args.expr);
    case "Use": return erase(args.expr);
    case "Ann": return erase(args.expr);
  }
}

// Checks if two terms are equal
const equals = (a, b, defs) => {
  const Eqs = (a, b)    => ["Eqs", {a, b}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eqs":
        const {a, b} = node[1];

        // Gets whnfs with and without dereferencing
        const ax = norm(a, {}, true);
        const bx = norm(b, {}, true);
        const ay = norm(a, defs, true);
        const by = norm(b, defs, true);

        // Optional optimization: if hashes are equal, then a == b
        if (a[2] === b[2] || ax[2] === bx[2] || ay[2] === by[2]) {
          return Val(true);
        }

        // If non-deref whnfs are app and fields are equal, then a == b
        let x = null;
        if (ax[2] !== ay[2] || bx[2] !== by[2]) {
          if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
            x = Val(true);
          } else if (ax[0] === "App" && bx[0] === "App") {
            const func = Eqs(ax[1].func, bx[1].func);
            const argm = Eqs(ax[1].argm, bx[1].argm);
            x = Bop(false, func, argm);
          }
        }

        // If whnfs are equal and fields are equal, then a == b
        let y = null;
        if (ay[0] === "Typ" && by[0] === "Typ") {
          y = Val(true);
        } else if (ay[0] === "All" && by[0] === "All") {
          y = Bop(false, Eqs(ay[1].bind, by[1].bind), Eqs(ay[1].body, by[1].body));
        } else if (ay[0] === "Lam" && by[0] === "Lam") {
          y = Eqs(ay[1].body, by[1].body)
        } else if (ay[0] === "App" && by[0] === "App") {
          y = Bop(false, Eqs(ay[1].func, by[1].func), Eqs(ay[1].argm, by[1].argm));
        } else if (ay[0] === "Var" && by[0] === "Var") {
          y = Val(ay[1].index === by[1].index);
        } else if (ay[0] === "Box" && by[0] === "Box") {
          y = Eqs(ay[1].expr, by[1].expr);
        } else if (ay[0] === "Put" && by[0] === "Put") {
          y = Eqs(ay[1].expr, by[1].expr);
        } else if (ay[0] === "Dup" && by[0] === "Dup") {
          y = Bop(false, Eqs(ay[1].expr, by[1].expr), Eqs(ay[1].body, by[1].body));
        } else if (ay[0] === "Slf" && by[0] === "Slf") {
          y = Eqs(ay[1].type, by[1].type);
        } else if (ay[0] === "Eqs" && by[0] === "Eqs") {
          y = Bop(false, Eqs(ay[1].val0, by[1].val0), Eqs(ay[1].val1, by[1].val1));
        } else {
          y = Val(false);
        }

        return x ? Bop(true, x, y) : y;

      // A binary operation (or / and)
      case "Bop":
        const {v, x, y} = node[1];
        if (x[0] === "Val") {
          return x[1].v === v ? Val(v) : y;
        } else if (y[0] === "Val") {
          return y[1].v === v ? Val(v) : x;
        } else {
          return Bop(v, step(x), step(y));
        }

      // A result value (true / false)
      case "Val":
        return node;
    }
  }

  // Expands the search tree until it finds an answer
  let tree = Eqs(erase(a), erase(b));
  while (tree[0] !== "Val") {
    tree = step(tree);
  }
  return tree[1].v;
}

// Reduces a term to normal form or head normal form
const norm = (foo, defs = {}, weak = false, dup = false) => {
  const [ctor, term] = foo;
  const cont = !weak ? norm : (x => x);
  const apply = (eras, func, argm) => {
    const func = norm(func, defs, true, dup);
    // ([x]a b) ~> [b/x]a
    if (func[0] === "Lam") {
      return norm(subst(func[1].body, argm, 0), defs, weak, dup);
    // ([x = a] b c) ~> [x = a] (b c)
    } else if (func[0] === "Dup") {
      return cont(Dup(func[1].name, func[1].expr, App(func[1].body, shift(argm, 1, 0), eras)), defs, weak, dup);
    } else {
      return App(cont(func, defs, weak, dup), cont(argm, defs, eras || weak, dup), eras);
    }
  }
  const duplicate = (name, expr, body) => {
    const expr = norm(expr, defs, true, dup);
    // [x = |a] b ~> [a/x]b
    if (expr[0] === "Put") {
      return norm(subst(body, expr[1].expr, 0), defs, weak, dup);
    // [x = [y = a] b] c ~> [y = a] [x = b] c
    } else if (expr[0] === "Dup") {
      return cont(Dup(expr[1].name, expr[1].expr, Dup(name, expr[1].body, shift(body, 1, 1))), dup);
    } else {
      return Dup(name, cont(expr, defs, weak, dup), cont(body, defs, weak, dup));
    }
  }
  const dereference = (eras, name) => {
    if (defs[name]) {
      const nf = norm(defs[name], defs, weak, dup);
      return eras ? erase(nf) : nf;
    } else {
      return Ref(name, eras);
    }
  }
  switch (ctor) {
    case "Var": return Var(term.index);
    case "Typ": return Typ();
    case "All": return All(term.name, cont(term.bind, defs, true, dup), cont(term.body, defs, weak, dup), term.eras);
    case "Lam": return Lam(term.name, term.bind && cont(term.bind, defs, true, dup), cont(term.body, defs, weak, dup), term.eras); 
    case "App": return apply(term.eras, term.func, term.argm);
    case "Box": return Box(cont(term.expr, defs, weak, dup));
    case "Put": return dup ? norm(term.expr, defs, weak, dup) : Put(cont(term.expr, defs, weak, dup));
    case "Dup": return dup ? norm(subst(term.body, term.expr, 0), defs, weak, dup) : duplicate(term.name, term.expr, term.body);
    case "Slf": return Slf(term.name, cont(term.type, defs, weak, dup));
    case "New": return norm(term.expr, defs, weak, dup);
    case "Use": return norm(term.expr, defs, weak, dup);
    case "Ann": return norm(term.expr, defs, weak, dup);
    case "Ref": return dereference(term.eras, term.name);
  }
}

// Infers the type of a term
const infer = (term, defs, ctx = Ctx(), strat = true, seen = {}) => {
  switch (term[0]) {
    case "Typ":
      return Typ();
    case "All":
      const bind_t = infer(term[1].bind, defs, ctx, false, seen);
      const ex_ctx = extend(ctx, [term[1].name, shift(term[1].bind, 1, 0)]);
      const body_t = infer(term[1].body, defs, ex_ctx, false, seen);
      if (!equals(bind_t, Typ(), defs, ctx) || !equals(body_t, Typ(), defs, ctx)) {
        throw "[ERROR]\nForall not a type: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      return Typ();
    case "Lam":
      if (term[1].bind === null) {
        throw "[ERROR]\nCan't infer non-annotated lambda `"+show(term,ctx)+"`.\n\n[CONTEXT]\n" + show_context(ctx);
      } else if (strat && uses(term[1].body) > 1) {
        throw "Non-linear function: " + show(term, ctx);
      } else if (strat && !is_at_level(term[1].body, 0)) {
        throw "Lambda-bound variable occurs inside boxes: " + show(term, ctx);
      } else {
        const ex_ctx = extend(ctx, [term[1].name, shift(term[1].bind, 1, 0)]);
        const body_t = infer(term[1].body, defs, ex_ctx, strat, seen);
        const term_t = All(term[1].name, term[1].bind, body_t, term[1].eras);
        infer(term_t, defs, ctx, false, seen);
        return term_t;
      }
    case "App":
      const func_t = norm(infer(term[1].func, defs, ctx, strat, seen), defs, true);
      if (func_t[0] !== "All") {
        throw "[ERROR]\nNon-function application on `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      if (func_t[1].eras !== term[1].eras) {
        throw "[ERROR]\nErasure doesn't match on application `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      const argm_v = check(term[1].argm, func_t[1].bind, defs, ctx, strat && !func_t[1].eras, seen, () => "`" + show(term, ctx) + "`'s argument");
      return subst(func_t[1].body, argm_v, 0);
    case "Box":
      const expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
      if (!equals(expr_t, Typ(), defs, ctx)) {
        throw "[ERROR]\nBox not a type: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      return Typ();
    case "Put":
      if (term[1].type === null) {
        throw "[ERROR]\nCan't infer non-annotated put `"+show(term,ctx)+"`.\n\n[CONTEXT]\n" + show_context(ctx);
      } else {
        const term_t = infer(term[1].expr, defs, ctx, strat, seen);
        return Box(term_t);
      }
    case "Dup":
      const expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
      if (expr_t[0] !== "Box") {
        throw "[ERROR]\nUnboxed duplication: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      if (strat && !is_at_level(term[1].body, 1)) {
        throw "[ERROR]\nOccurrence of duplication varible isn't wrapped by exactly 1 box: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      const ex_ctx = extend(ctx, [term[1].name, shift(expr_t[1].expr, 1, 0)]);
      const body_t = infer(term[1].body, defs, ex_ctx, strat, seen);
      return subst(body_t, Dup(term[1].name, term[1].expr, Var(0)), 0);
    case "Slf":
      const ex_ctx = extend(ctx, [term[1].name, shift(term, 1, 0)]);
      const type_t = infer(term[1].type, defs, ex_ctx, false, seen);
      if (!equals(type_t, Typ(), defs, ctx)) {
        throw "[ERROR]\nSelf not a type: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      return Typ();
    case "New":
      const type = norm(term[1].type, defs, true);
      if (type[0] !== "Slf") { 
        throw "[ERROR]\nNon-self instantiation: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      infer(type, defs, ctx, false, seen);
      check(term[1].expr, subst(type[1].type, Ann(type, term, true), 0), defs, ctx, strat, seen);
      return term[1].type;
    case "Use":
      const expr_t = norm(infer(term[1].expr, defs, ctx, false, seen), defs, true);
      if (expr_t[0] !== "Slf") {
        throw "[ERROR]\nNon-self projection: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
      }
      return subst(expr_t[1].type, term[1].expr, 0);
    case "Ann":
      if (!term[1].done) {
        term[1].done = true;
        check(term[1].expr, term[1].type, defs, ctx, strat, seen);
      }
      return term[1].type;
    case "Ref":
      if (strat && seen[term[1].name]) {
        throw "[ERROR]\nRecursive use of: `" + term[1].name + "`.";
      }
      if (!defs[term[1].name]) {
        throw "[ERROR]\nUndefined reference: `" + term[1].name + "`.";
      }
      const def = defs[term[1].name];
      return infer(def, defs, ctx, strat, Object.assign({[term[1].name]: true}, seen));
    case "Var":
      return get_term(ctx, term[1].index);
  }
}

// Checks if a term has given type
const check = (term, type, defs, ctx = Ctx(), strat = true, seen = {}, expr = null) => {
  const expr   = expr || (() => "`" + show(term, ctx) + "`");
  const type_n = norm(type, defs, true);
  if (type_n[0] === "All" && term[0] === "Lam") {
    if (type_n[1].eras !== term[1].eras) {
      throw "Erasure doesn't match on " + expr() + ".";
    }
    if (strat && uses(term[1].body) > 1) {
      throw "Non-linear function: " + show(term, ctx);
    }
    if (strat && !is_at_level(term[1].body, 0)) {
      throw "Lambda-bound variable occurs inside boxes: " + show(term, ctx);
    }
    infer(type_n, defs, ctx, false, seen);
    const ex_ctx = extend(ctx, [term[1].name, shift(type_n[1].bind, 1, 0)]);
    const body_v = check(term[1].body, type_n[1].body, defs, ex_ctx, strat, seen, () => "`" + show(term, ctx) + "`'s body");
    return Lam(type_n[1].name, type_n[1].bind, body_v, type_n[1].eras);
  } else if (type_n[0] === "Box" && term[0] === "Put") {
    const expr_v = check(term[1].expr, type_n[1].expr, defs, ctx, strat, seen, () => "`" + show(term, ctx) + "`.");
    return Put(expr_v);
  } else if (term[0] === "Dup") {
    const expr_t = norm(infer(term[1].expr, defs, ctx, strat, seen), defs, true);
    if (expr_t[0] !== "Box") {
      throw "[ERROR]\nUnboxed duplication: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
    }
    if (strat && !is_at_level(term[1].body, 1)) {
      throw "[ERROR]\nOccurrence of duplication varible isn't wrapped by exactly 1 box: `" + show(term, ctx) + "`.\n\n[CONTEXT]\n" + show_context(ctx);
    }
    const ex_ctx = extend(ctx, [term[1].name, shift(expr_t[1].expr, 1, 0)]);
    const body_v = check(term[1].body, shift(type_n, 1, 0), defs, ex_ctx, strat, seen, () => "`" + show(term, ctx) + "`'s body");
    return Dup(term[1].name, term[1].expr, body_v);
  } else {
    const term_t = infer(term, defs, ctx, strat, seen);
    let checks;
    let unsure;
    try {
      checks = equals(type_n, term_t, defs, ctx);
      unsure = false;
    } catch (e) {
      checks = false;
      unsure = true;
    }
    if (!checks) {
      let error = unsure ? "Couldn't decide if terms are equal." : "";
      error = error + show_mismatch(type, term_t, expr, ctx, defs);
      throw error;
    }
    return term;
  }
}

// Formats a type-mismatch error message
const show_mismatch = (expect, actual, expr, ctx, defs) => {
  let text = "";
  text += "[ERROR]\nType mismatch on " + expr() + ".\n";
  text += "- Expected:\n";
  text += "-- type: " + show(expect, ctx) + "\n";
  text += "-- nf-0: " + show(norm(expect, {}, true), ctx) + "\n";
  text += "-- nf-1: " + show(norm(expect, {}, false), ctx) + "\n";
  text += "-- nf-2: " + show(norm(erase(expect), defs, true), ctx) + "\n";
  text += "-- nf-3: " + show(norm(erase(expect), defs, false), ctx) + "\n";
  text += "- Actual:\n";
  text += "-- type: " + show(actual, ctx) + "\n";
  text += "-- nf-0: " + show(norm(actual, {}, true), ctx) + "\n";
  text += "-- nf-1: " + show(norm(actual, {}, false), ctx) + "\n";
  text += "-- nf-2: " + show(norm(erase(actual), defs, true), ctx) + "\n";
  text += "-- nf-3: " + show(norm(erase(actual), defs, false), ctx) + "\n";
  text += "\n[CONTEXT]\n" 
  text += show_context(ctx);
  return text;
}

module.exports = {
  gen_name,
  Ctx,
  extend,
  get_bind,
  get_name,
  get_term,
  index_of,
  show_context,
  show_mismatch,
  Var,
  Typ,
  All,
  Lam,
  App,
  Ref,
  show,
  parse,
  norm,
  infer,
  check,
  equals,
  erase
};
