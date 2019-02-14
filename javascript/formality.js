// An ESCoC term is an ADT represented by a JSON
const Var = (index)                  => ["Var", {index},                  "#" + index];
const Typ = ()                       => ["Typ", {},                       "*"];
const All = (eras, name, bind, body) => ["All", {eras, name, bind, body}, "&" + bind[2] + body[2]];
const Lam = (eras, name, bind, body) => ["Lam", {eras, name, bind, body}, "^" + (bind?bind[2]:"") + body[2]];
const App = (eras, func, argm)       => ["App", {eras, func, argm},       "@" + func[2] + argm[2]];
const Ref = (name)                   => ["Ref", {name},                   "{" + name + "}"];

// A context is an array of (name, type, term) triples
const Ctx = () => null;

const extend = (ctx, bind) => {
  return {head: bind, tail: ctx};
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
  var bind = get_bind(ctx, i);
  if (bind) {
    return bind[0] + repeat("'", count(ctx, bind[0], i));
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
  var bind = get_bind(ctx, i);
  if (bind) {
    var term = ": " + (bind[1] ? show(norm(bind[1], {}, true), ctx) : "?");
    return show_context(ctx, i + 1) + bind[0] + "\n" + term + "\n" + term + "\n\n";
  } else {
    return "";
  }
}

// Converts a term to a string
const show = ([ctor, args], ctx = Ctx()) => {
  switch (ctor) {
    case "Var":
      return get_name(ctx, args.index) || "#" + args.index;
    case "Typ":
      return "Type";
    case "All":
      var eras = args.eras ? "-" : "";
      var name = args.name;
      var bind = show(args.bind, extend(ctx, [args.name, null]));
      var body = show(args.body, extend(ctx, [args.name, null]));
      return "{" + eras + name + " : " + bind + "} " + body;
    case "Lam":
      var eras = args.eras ? "-" : "";
      var name = args.name;
      var bind = args.bind && show(args.bind, extend(ctx, [name, null]));
      var body = show(args.body, extend(ctx, [name, null]));
      return bind ? "[" + eras + name + " : " + bind + "] " + body : "[" + eras + name + "] " + body;
    case "App":
      var text = ")";
      var term = [ctor, args];
      while (term[0] === "App") {
        text = (term[1].eras ? " -" : " ") + show(term[1].argm, ctx) + text;
        term = term[1].func;
      }
      return "(" + show(term, ctx) + text;
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
    if (match("//")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
      return parse_term(ctx);
    }

    // Application
    else if (match("(")) {
      var func = parse_term(ctx);
      while (index < code.length && !match(")")) {
        var eras = match("-");
        var argm = parse_term(ctx);
        var func = App(eras, func, argm);
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
      var eras = match("-");
      var name = parse_name();
      var skip = parse_exact(":");
      var bind = parse_term(extend(ctx, [name, Var(0)]));
      var skip = parse_exact("}");
      var body = parse_term(extend(ctx, [name, Var(0)]));
      return All(eras, name, bind, body);
    }

    // Lambda
    else if (match("[")) {
      var eras = match("-");
      var name = parse_name();
      var bind = match(":") ? parse_term(extend(ctx, [name, Var(0)])) : null;
      var skip = parse_exact("]");
      var body = parse_term(extend(ctx, [name, Var(0)]));
      return Lam(eras, name, bind, body);
    }

    // Let
    else if (match("let")) {
      var name = parse_name();
      var copy = parse_term(ctx);
      var body = parse_term(extend(ctx, [name, Var(0)]));
      return subst(body, copy, 0);
    }

    // Variable / Reference
    else {
      var name = parse_name();
      var skip = 0;
      while (match("'")) {
        skip += 1;
      }
      var var_index = index_of(ctx, name, skip);
      if (var_index === null) {
        return Ref(name, false);
      } else {
        return get_bind(ctx, var_index)[1];
      }
    }
  }

  var index = 0;
  var defs = {};
  while (index < code.length) {
    if (match("//")) {
      while (index < code.length && code[index] !== "\n") {
        index += 1;
      }
    } else {
      var name = parse_name();
      var type = match(":") ? parse_term(Ctx()) : null;
      var skip = parse_exact("=");
      var term = parse_term(Ctx());
      defs[name] = {term: term, type: type, done: false};
      skip_spaces();
    }
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
      var eras = term.eras;
      var name = term.name;
      var bind = shift(term.bind, inc, depth + 1);
      var body = shift(term.body, inc, depth + 1);
      return All(eras, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var bind = term.bind && shift(term.bind, inc, depth + 1);
      var body =              shift(term.body, inc, depth + 1);
      return Lam(eras, name, bind, body);
    case "App":
      var eras = term.eras;
      var func = shift(term.func, inc, depth);
      var argm = shift(term.argm, inc, depth);
      return App(eras, func, argm);
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
      var eras = term.eras;
      var name = term.name;
      var bind = subst(term.bind, val && shift(val, 1, 0), depth + 1);
      var body = subst(term.body, val && shift(val, 1, 0), depth + 1);
      return All(eras, name, bind, body);
    case "Lam":
      var eras = term.eras;
      var name = term.name;
      var bind = term.bind && subst(term.bind, val && shift(val, 1, 0), depth + 1);
      var body =              subst(term.body, val && shift(val, 1, 0), depth + 1);
      return Lam(eras, name, bind, body);
    case "App":
      var eras = term.eras;
      var func = subst(term.func, val, depth);
      var argm = subst(term.argm, val, depth);
      return App(eras, func, argm);
    case "Ref":
      var name = term.name;
      return Ref(name);
  }
}

// Removes computationally irrelevant expressions
const erase = ([ctor, args]) => {
  switch (ctor) {
    case "Var": return Var(args.index);
    case "Typ": return Typ();
    case "All": return All(args.eras, args.name, erase(args.bind), erase(args.body));
    case "Lam": return args.eras ? subst(erase(args.body), Typ(), 0) : Lam(args.eras, args.name, null, erase(args.body));
    case "App": return args.eras ? erase(args.func) : App(args.eras, erase(args.func), erase(args.argm));
    case "Ref": return Ref(args.name);
  }
}

// Checks if two terms are equal
const equals = (a, b, defs) => {
  const Eql = (a, b)    => ["Eql", {a, b}];
  const Bop = (v, x, y) => ["Bop", {v, x, y}];
  const Val = (v)       => ["Val", {v}];

  const step = (node) => {
    switch (node[0]) {
      // An equality test
      case "Eql":
        var {a, b} = node[1];

        // Gets whnfs with and without dereferencing
        var ax = norm(a, {}, false);
        var bx = norm(b, {}, false);
        var ay = norm(a, defs, false);
        var by = norm(b, defs, false);

        // Optional optimization: if hashes are equal, then a == b
        if (a[2] === b[2] || ax[2] === bx[2] || ay[2] === by[2]) {
          return Val(true);
        }

        // If non-deref whnfs are app and fields are equal, then a == b
        var x = null;
        if (ax[2] !== ay[2] || bx[2] !== by[2]) {
          if (ax[0] === "Ref" && bx[0] === "Ref" && ax[1].name === bx[1].name) {
            x = Val(true);
          } else if (ax[0] === "App" && bx[0] === "App") {
            var func = Eql(ax[1].func, bx[1].func);
            var argm = Eql(ax[1].argm, bx[1].argm);
            x = Bop(false, func, argm);
          }
        }

        // If whnfs are equal and fields are equal, then a == b
        var y = null;
        if (ay[0] === "Typ" && by[0] === "Typ") {
          y = Val(true);
        } else if (ay[0] === "All" && by[0] === "All") {
          y = Bop(false, Eql(ay[1].bind, by[1].bind), Eql(ay[1].body, by[1].body));
        } else if (ay[0] === "Lam" && by[0] === "Lam") {
          y = Eql(ay[1].body, by[1].body)
        } else if (ay[0] === "App" && by[0] === "App") {
          y = Bop(false, Eql(ay[1].func, by[1].func), Eql(ay[1].argm, by[1].argm));
        } else if (ay[0] === "Var" && by[0] === "Var") {
          y = Val(ay[1].index === by[1].index);
        } else {
          y = Val(false);
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
          return Bop(v, step(x), step(y));
        }

      // A result value (true / false)
      case "Val":
        return node;
    }
  }

  // Expands the search tree until it finds an answer
  var tree = Eql(a, b);
  while (tree[0] !== "Val") {
    var tree = step(tree);
  }
  return tree[1].v;
}

// Reduces a term to normal form or head normal form
const norm = ([ctor, term], defs, full) => {
  const cont = full ? norm : (x => x);
  const apply = (eras, func, argm) => {
    var func = norm(func, defs, false);
    if (func[0] === "Lam") {
      return norm(subst(func[1].body, argm, 0), defs, full);
    } else {
      return App(eras, cont(func, defs, false), cont(argm, defs, full));
    }
  }
  const dereference = (name) => {
    if (defs[name] && !defs[name].seen) {
      return norm(defs[name].term, defs, full);
    } else {
      return Ref(name);
    }
  }
  switch (ctor) {
    case "Var": return Var(term.index);
    case "Typ": return Typ();
    case "All": return All(term.eras, term.name, cont(term.bind, defs, false), cont(term.body, defs, full));
    case "Lam": return Lam(term.eras, term.name, term.bind && cont(term.bind, defs, false), cont(term.body, defs, full)); 
    case "App": return apply(term.eras, term.func, term.argm);
    case "Ref": return dereference(term.name);
  }
}

// Infers the type of a term
const infer = (term, defs, ctx = Ctx()) => {
  switch (term[0]) {
    case "Typ":
      return Typ();
    case "All":
      var ex_ctx = extend(ctx, [term[1].name, term[1].bind]);
      var bind_t = infer(term[1].bind, defs, ex_ctx);
      var body_t = infer(term[1].body, defs, ex_ctx);
      if (!equals(bind_t, Typ(), defs, ctx) || !equals(body_t, Typ(), defs, ctx)) {
        throw "[ERROR]\nForall not a type: `" + show(term, ctx) + "`. Context:\n\n" + show_context(ctx);
      }
      return Typ();
    case "Lam":
      if (term[1].bind === null) {
        throw "[ERROR]\nCan't infer non-annotated lambda. Context:\n\n" + show_context(ctx);
      } else {
        var ex_ctx = extend(ctx, [term[1].name, term[1].bind]);
        var body_t = infer(term[1].body, defs, ex_ctx);
        var term_t = All(term[1].eras, term[1].name, term[1].bind, body_t);
        infer(term_t, defs, ctx);
        return term_t;
      }
    case "App":
      var func_t = norm(infer(term[1].func, defs, ctx), defs, false);
      if (func_t[0] !== "All") {
        throw "[ERROR]\nNon-function application on `" + show(term, ctx) + "`. Context:\n\n" + show_context(ctx);
      }
      if (func_t[1].eras !== term[1].eras) {
        throw "[ERROR]\nErasure doesn't match on application `" + show(term, ctx) + "`. Context:\n\n" + show_context(ctx);
      }
      var bind_t = subst(func_t[1].bind, term[1].argm, 0);
      var argm_v = check(term[1].argm, bind_t, defs, ctx, () => "`" + show(term, ctx) + "`'s argument");
      return subst(func_t[1].body, argm_v, 0);
    case "Ref":
      if (defs[term[1].name]) {
        var def = defs[term[1].name];
        if (def.done) {
          return def.type;
        } else {
          def.done = true;
          if (def.type) {
            check(def.term, def.type, defs, ctx, () => "`" + term[1].name + "`'s annotated type");
          } else {
            def.type = infer(def.term, defs, ctx);
          }
          return def.type;
        }
      } else {
        throw "[ERROR]\nUndefined reference: `" + term[1].name + "`.";
      }
    case "Var":
      return get_term(ctx, term[1].index);
  }
}

// Checks if a term has given type
const check = (term, type, defs, ctx = Ctx(), expr) => {
  var type = norm(type, defs, false);
  if (type[0] === "All" && term[0] === "Lam" && !term[1].bind) {
    infer(type, defs, ctx);
    var ex_ctx = extend(ctx, [type[1].name, type[1].bind]);
    var body_v = check(term[1].body, type[1].body, defs, ex_ctx, () => "`" + show(term, ctx) + "`'s body");
    return Lam(type[1].eras, type[1].name, type[1].bind, body_v);
  } else {
    var term_t = infer(term, defs, ctx);
    try {
      var checks = equals(type, term_t, defs, ctx);
    } catch (e) {
      var checks = false;
      console.log("Couldn't decide if terms are equal.");
      console.log(e);
    }
    if (!checks) {
      throw show_mismatch(type, norm(term_t, defs, false), expr, ctx);
    }
    return term;
  }
}

// Formats a type-mismatch error message
const show_mismatch = (expect, actual, expr, ctx) => {
  var text = "";
  text += "[ERROR]\nType mismatch on " + expr() + ".\n";
  text += "- Expect = " + show(norm(expect, {}, true), ctx) + "\n";
  text += "- Actual = " + show(norm(actual, {}, true), ctx) + "\n"
  text += "\n[CONTEXT]\n" 
  text += show_context(ctx);
  return text;
}

class Pointer {
  // A Pointer consists of an addr / port pair
  constructor(addr, port) {
    this.addr = addr; // integer (index on this.nodes where the target port is)
    this.port = port; // integer (0, 1 or 2, representing the target port)
  }

  to_string() {
    return this.addr + 'abc'[this.port];
  }
  
  equal(other) {
    return other !== null && this.addr === other.addr && this.port === other.port;
  }
}

class Node {
  // A node consists of a label and an array with 3 ports 
  constructor(label, ports) {
    this.label = label; // integer (this node's label)
    this.ports = ports; // array with 3 pointers (this node's edges)
  }

  to_string() {
    return '[' + this.label + '|' + this.ports[0].to_string() + ' ' + this.ports[1].to_string() + ' ' + this.ports[2].to_string() + ']';
  }
}
 
class Net {
  // A net stores nodes (this.nodes), reclaimable memory addrs (this.freed) and active pairs (this.redex)
  constructor() {
    this.nodes = []; // nodes
    this.freed = []; // integers
    this.redex = []; // array of (integer, integer) tuples representing addrs
  }

  // Allocates a new node, return its addr
  alloc_node(label) {

    // If there is reclaimable memory, use it
    if (this.freed.length > 0) {
      var addr = this.freed.pop();
    } else { // Otherwise, extend the array of nodes
      this.nodes.push(null);
      var addr = this.nodes.length - 1;
    }

    // Fill the memory with an empty node without pointers
    this.nodes[addr] = new Node(label, [null, null, null]);
    return addr;
  }

  // Deallocates a node, allowing its space to be reclaimed
  free_node(addr) {
    this.nodes[addr] = null;
    this.freed.push(addr);
  }

  // Given a pointer to a port, returns a pointer to the opposing port
  enter_port(ptr) {
    if (this.nodes[ptr.addr] !== null) {
      return this.nodes[ptr.addr].ports[ptr.port];
    } else {
      return null;
    }
  }

  // Connects two ports
  link_ports(a_ptr, b_ptr) {
    // Stores each pointer on its opposing port
    this.nodes[a_ptr.addr].ports[a_ptr.port] = b_ptr;
    this.nodes[b_ptr.addr].ports[b_ptr.port] = a_ptr;

    // If both are main ports, add this to the list of active pairs
    if (a_ptr.port === 0 && b_ptr.port === 0) {
      this.redex.push([a_ptr.addr, b_ptr.addr]);
    } 
  }

  // Disconnects a port, causing both sides to point to themselves
  unlink_port(a_ptr) {
    var b_ptr = this.enter_port(a_ptr);
    if (this.enter_port(b_ptr).equal(a_ptr)) {
      this.nodes[a_ptr.addr].ports[a_ptr.port] = a_ptr;
      this.nodes[b_ptr.addr].ports[b_ptr.port] = b_ptr;
    }
  }

  // Rewrites an active pair
  rewrite([a_addr, b_addr]) {
    var a_node = this.nodes[a_addr];
    var b_node = this.nodes[b_addr];

    // If both nodes have the same label, connects their neighbors
    if (a_node.label === b_node.label) {
      var a_aux1_dest = this.enter_port(new Pointer(a_addr, 1));
      var b_aux1_dest = this.enter_port(new Pointer(b_addr, 1));
      this.link_ports(a_aux1_dest, b_aux1_dest);
      var a_aux2_dest = this.enter_port(new Pointer(a_addr, 2));
      var b_aux2_dest = this.enter_port(new Pointer(b_addr, 2));
      this.link_ports(a_aux2_dest, b_aux2_dest);

    // Otherwise, the nodes pass through each-other, duplicating themselves
    } else {
      var p_addr = this.alloc_node(b_node.label);
      var q_addr = this.alloc_node(b_node.label);
      var r_addr = this.alloc_node(a_node.label);
      var s_addr = this.alloc_node(a_node.label);
      this.link_ports(new Pointer(r_addr, 1), new Pointer(p_addr, 1));
      this.link_ports(new Pointer(s_addr, 1), new Pointer(p_addr, 2));
      this.link_ports(new Pointer(r_addr, 2), new Pointer(q_addr, 1));
      this.link_ports(new Pointer(s_addr, 2), new Pointer(q_addr, 2));
      this.link_ports(new Pointer(p_addr, 0), this.enter_port(new Pointer(a_addr, 1)));
      this.link_ports(new Pointer(q_addr, 0), this.enter_port(new Pointer(a_addr, 2)));
      this.link_ports(new Pointer(r_addr, 0), this.enter_port(new Pointer(b_addr, 1)));
      this.link_ports(new Pointer(s_addr, 0), this.enter_port(new Pointer(b_addr, 2)));
    }

    // Deallocates the space used by the active pair
    for (var i = 0; i < 3; i++) {
      this.unlink_port(new Pointer(a_addr, i));
      this.unlink_port(new Pointer(b_addr, i));
    }
    this.free_node(a_addr);
    if (a_addr !== b_addr) {
      this.free_node(b_addr);
    }
  }

  // Rewrites active pairs until none is left, reducing the graph to normal form
  // This could be performed in parallel. Unreachable data is freed automatically.
  reduce() {
    var rewrite_count = 0;
    while (this.redex.length > 0) {
      this.rewrite(this.redex.pop());
      rewrite_count += 1;
    }
    return rewrite_count;
  }

  // Rewrites active pairs lazily. Lazy reductions avoid wasting work and
  // allows recursive terms, but requires GC and enforces sequentiality.
  reduce_lazy() {
    var warp = [];
    var exit = [];
    var next = this.enter_port(new Pointer(0, 1));
    var prev = null;
    var back = null;
    var rwts = 0;
    while (next.addr > 0 || warp.length > 0) {
      next = next.addr === 0 ? this.enter_port(warp.pop()) : next;
      prev = this.enter_port(next);
      if (next.port === 0 && prev.port === 0) {
        back = this.enter_port(new Pointer(prev.addr, exit.pop()));
        this.rewrite([prev.addr, next.addr]);
        next = this.enter_port(back);
        ++rwts;
      } else if (next.port === 0) {
        warp.push(new Pointer(next.addr, 2));
        next = this.enter_port(new Pointer(next.addr, 1));
      } else {
        exit.push(next.port);
        next = this.enter_port(new Pointer(next.addr, 0));
      }
    }
    return rwts;
  }

  to_string() {
    var text = '';
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] !== null) {
        text += i + ': ' + this.nodes[i].to_string() + '\n';
      } else {
        text += i + ': ' + null + '\n';
      }
    }
    return text;
  }
}

const compile = (term, defs) => {
  const build_net = (term, net, ref_ptrs, var_ptrs, level) => {
    const get_var = (ptr) => {
      if (!net.enter_port(ptr) || net.enter_port(ptr).equal(ptr)) {
        return ptr;
      } else {
        var dups_ptr = net.enter_port(ptr);
        var dup_addr = net.alloc_node(level_of[ptr.to_string()] + 2);
        net.link_ports(new Pointer(dup_addr, 0), ptr);
        net.link_ports(new Pointer(dup_addr, 1), dups_ptr);
        return new Pointer(dup_addr, 2);
      }
    };
    switch (term[0]) {
      case "Lam":
        var lam_addr = net.alloc_node(1);
        net.link_ports(new Pointer(lam_addr, 1), new Pointer(lam_addr, 1));
        var_ptrs.push(new Pointer(lam_addr, 1));
        var body_ptr = build_net(term[1].body, net, ref_ptrs, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(new Pointer(lam_addr, 2), body_ptr);
        return new Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(1);
        var func_ptr = build_net(term[1].func, net, ref_ptrs, var_ptrs, level);
        net.link_ports(new Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term[1].argm, net, ref_ptrs, var_ptrs, level);
        net.link_ports(new Pointer(app_addr, 1), argm_ptr)
        return new Pointer(app_addr, 2);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
      case "Ref":
        var name = term[1].name;
        //return build_net(erase(defs[name].term), net, ref_ptrs, var_ptrs, level);
        if (!ref_ptrs[name]) {
          var dup_addr = net.alloc_node(Math.floor((1 + Math.random()) * Math.pow(2,16)));
          net.link_ports(new Pointer(dup_addr, 1), new Pointer(dup_addr, 1));
          net.link_ports(new Pointer(dup_addr, 2), new Pointer(dup_addr, 2));
          var ref_ptrs = Object.assign({[name]: new Pointer(dup_addr, 1)});
          var term_ptr = build_net(erase(defs[name].term), net, ref_ptrs, var_ptrs, level);
          net.link_ports(new Pointer(dup_addr, 0), term_ptr);
          return new Pointer(dup_addr, 2);
        } else {
          return get_var(ref_ptrs[name]);
        }
      default:
        return build_net(Lam(false, "", null, Var(0)), net, ref_ptrs, var_ptrs, level);
    }
  };
  var level_of = {};
  var net = new Net();
  var root_addr = net.alloc_node(0);
  var term_ptr = build_net(erase(term), net, {}, [], 0);
  net.link_ports(new Pointer(root_addr, 0), new Pointer(root_addr, 2));
  net.link_ports(new Pointer(root_addr, 1), term_ptr);
  return net;
}

const decompile = (net) => {
  const build_term = (net, ptr, var_ptrs, dup_exit) => {
    var label = net.nodes[ptr.addr].label;
    if (label === 1) {
      switch (ptr.port) {
        case 0:
          var_ptrs.push(new Pointer(ptr.addr, 1));
          var body = build_term(net, net.enter_port(new Pointer(ptr.addr, 2)), var_ptrs, dup_exit);
          var_ptrs.pop();
          return Lam(false, "x" + var_ptrs.length, null, body);
        case 1:
          for (var index = 0; index < var_ptrs.length; ++index) {
            if (var_ptrs[var_ptrs.length - index - 1].equal(ptr)) {
              return Var(index);
            }
          }
        case 2:
          var argm = build_term(net, net.enter_port(new Pointer(ptr.addr, 1)), var_ptrs, dup_exit);
          var func = build_term(net, net.enter_port(new Pointer(ptr.addr, 0)), var_ptrs, dup_exit);
          return App(false, func, argm);
      }
    } else {
      switch (ptr.port) {
        case 0:
          var exit = dup_exit.pop();
          var term = build_term(net, net.enter_port(new Pointer(ptr.addr, exit)), var_ptrs, dup_exit);
          dup_exit.push(exit);
          return term;
        default:
          dup_exit.push(ptr.port);
          var term = build_term(net, net.enter_port(new Pointer(ptr.addr, 0)), var_ptrs, dup_exit);
          dup_exit.pop();
          return term;
      }
    }
  };
  return build_term(net, net.enter_port(new Pointer(0, 1)), [], []);
}

module.exports = {
  Pointer,
  Node,
  Net,
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
  erase,
  compile,
  decompile
};
