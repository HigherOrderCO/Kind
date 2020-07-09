const {Var, App, Lam, Ref, Ext, Nil, find, canonicalize} = require("./FormalitySynt.js");
const {Net, Pointer, addr_of, slot_of, numb_of, ptrn_eq, ptrn_st, NOD} = require("./FormalityInet.js");
const erase = require("./FormalityEras.js").erase;

function compile(name, defs = {}) {
  var term = erase(canonicalize(defs[name].term, {}, true, false));
  const ref_ptrs = {};
  const build_net = (term, net, var_ptrs, level) => {
    const get_var = (ptrn) => {
      if (ptrn_eq(net.enter_port(ptrn), ptrn)) {
        return ptrn;
      } else {
        var dups_ptrn = net.enter_port(ptrn);
        var dup_addr = net.alloc_node(NOD, Math.floor(Math.random()*(2**24)) + 1);
        net.link_ports(Pointer(dup_addr, 0), ptrn);
        net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
        return Pointer(dup_addr, 2);
      }
    };
    switch (term.ctor) {
      case "Let":
        var expr_ptr = build_net(term.expr, net, var_ptrs, level);
        level_of[ptrn_st(expr_ptr)] = level;
        var_ptrs.push(expr_ptr);
        var body_ptr = build_net(term.body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Lam":
        var lam_addr = net.alloc_node(NOD, 0);
        net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
        level_of[ptrn_st(Pointer(lam_addr, 1))] = level;
        var_ptrs.push(Pointer(lam_addr, 1));
        var body_ptr = build_net(term.body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(Pointer(lam_addr, 2), body_ptr);
        return Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(NOD, 0);
        var func_ptr = build_net(term.func, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term.argm, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 1), argm_ptr)
        return Pointer(app_addr, 2);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term.indx - 1]);
      case "Ref":
        var ref_ptrn = ref_ptrs[term.name];
        // First time seeing this ref
        if (!ref_ptrn) {
          // Create a dup node for it and recurse
          var dup_addr = net.alloc_node(NOD, 0xFFFD);
          var ref_ptrn = Pointer(dup_addr, 1);
          ref_ptrs[term.name] = ref_ptrn;
          var dref = erase(canonicalize(defs[term.name].term, {}, true, false));
          var dref_ptr = build_net(dref, net, var_ptrs, level);
          net.link_ports(Pointer(dup_addr, 0), dref_ptr);
          return Pointer(dup_addr, 2);
        // Already created the dup node for this ref
        } else {
          // First use: just connect to the port 1 of the dup node
          if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
            return ref_ptrn;
          // Other uses: extend with another dup node and connect
          } else {
            var dups_ptrn = net.enter_port(ref_ptrn);
            var dup_addr = net.alloc_node(NOD, 0xFFFD);
            net.link_ports(Pointer(dup_addr, 0), ref_ptrn);
            net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
            return Pointer(dup_addr, 2);
          }
        }
      default:
        throw "Internal error.";
        //return build_net(Lam("", null, Var(0), false), net, var_ptrs, level);
    }
  };
  var level_of = {};
  var net = new Net();
  var root_addr = net.alloc_node(NOD, 0);
  var term_ptr = build_net(term, net, [], 0);
  net.link_ports(Pointer(root_addr, 0), Pointer(root_addr, 2));
  net.link_ports(Pointer(root_addr, 1), term_ptr);
  // Removes invalid redexes. They can be created by the
  // compiler when duplicating variables more than once.
  net.redex = net.redex.filter((a_addr) => {
    var b_ptrn = net.enter_port(Pointer(a_addr, 0));
    var b_addr = addr_of(b_ptrn);
    var a_p0 = Pointer(a_addr, 0);
    var b_p0 = Pointer(b_addr, 0);
    var a_ok = ptrn_eq(net.enter_port(a_p0), b_p0);
    var b_ok = ptrn_eq(net.enter_port(b_p0), a_p0);
    return a_ok && b_ok;
  });
  // Optimization: if a ref is only used once, remove the unecessary dup node
  for (var name in ref_ptrs) {
    var ref_ptrn = ref_ptrs[name];
    if (ptrn_eq(net.enter_port(ref_ptrn), ref_ptrn)) {
      var dup_addr = addr_of(ref_ptrn);
      var ref_ptrn = net.enter_port(Pointer(dup_addr, 0));
      var loc_ptrn = net.enter_port(Pointer(dup_addr, 2));
      net.link_ports(ref_ptrn, loc_ptrn);
      net.free_node(dup_addr);
    }
  }
  return net;
};

function decompile(net) {
  const build_term = (net, ptrn, var_ptrs, dup_exit) => {
    var addr = addr_of(ptrn);
    var kind = net.kind_of(addr);
    if (kind === 0) {
      switch (slot_of(ptrn)) {
        case 0:
          var_ptrs.push(Pointer(addr, 1));
          var body = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
          var_ptrs.pop();
          var vlen = var_ptrs.length;
          return ctx => {
            var t_name = "x" + vlen;
            var t_body = x => body(Ext([t_name,x], ctx));
            return Lam(false, t_name, t_body);
          };
        case 1:
          for (var index = 0; index < var_ptrs.length; ++index) {
            if (ptrn_eq(var_ptrs[var_ptrs.length - index - 1], ptrn)) {
              return ctx => find(ctx, (x,i) => i === index).value[1];
            }
          }
        case 2:
          var argm = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
          var func = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
          return ctx => App(false, func(ctx), argm(ctx));
      }
    } else {
      switch (slot_of(ptrn)) {
        case 0:
          var exit = dup_exit.pop();
          var term = build_term(net, net.enter_port(Pointer(addr, exit)), var_ptrs, dup_exit);
          dup_exit.push(exit);
          return term;
        default:
          dup_exit.push(slot_of(ptrn));
          var term = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
          dup_exit.pop();
          return term;
      }
    }
  };
  return build_term(net, net.enter_port(Pointer(0, 1)), [], [])(Nil());
};

function normalize(term, defs = {}, lazy = true) {
  var net = compile(term, defs);
  var stats = lazy ? net.reduce_lazy() : net.reduce();
  var term = decompile(net);
  return {term, stats};
};

module.exports = {erase, compile, decompile, normalize};
