const {Var, App, Lam, erase, gen_name, show} = require("./formality.js");
const {Net, Pointer, Node} = require("./nasic.js");

const compile = (term, defs = {}) => {
  const build_net = (term, net, var_ptrs, level) => {
    const get_var = (ptr) => {
      if (!net.enter_port(ptr) || net.enter_port(ptr).equal(ptr)) {
        return ptr;
      } else {
        const dups_ptr = net.enter_port(ptr);
        const dup_addr = net.alloc_node(Math.floor((1 + Math.random()) * Math.pow(2,16)));
        net.link_ports(new Pointer(dup_addr, 0), ptr);
        net.link_ports(new Pointer(dup_addr, 1), dups_ptr);
        return new Pointer(dup_addr, 2);
      }
    };
    switch (term[0]) {
      case "Dup":
        const expr_ptr = build_net(term[1].expr, net, var_ptrs, level);
        var_ptrs.push(expr_ptr);
        const body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Put":
        const expr_ptr = build_net(term[1].expr, net, var_ptrs, level + 1);
        return expr_ptr;
      case "Lam":
        const lam_addr = net.alloc_node(1);
        net.link_ports(new Pointer(lam_addr, 1), new Pointer(lam_addr, 1));
        var_ptrs.push(new Pointer(lam_addr, 1));
        const body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(new Pointer(lam_addr, 2), body_ptr);
        return new Pointer(lam_addr, 0);
      case "App":
        const app_addr = net.alloc_node(1);
        const func_ptr = build_net(term[1].func, net, var_ptrs, level);
        net.link_ports(new Pointer(app_addr, 0), func_ptr);
        const argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
        net.link_ports(new Pointer(app_addr, 1), argm_ptr)
        return new Pointer(app_addr, 2);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
      case "Ref":
        return build_net(erase(defs[term[1].name]), net, var_ptrs, level);
      default:
        return build_net(Lam("", null, Var(0)), net, var_ptrs, level);
    }
  };
  const net = new Net();
  const root_addr = net.alloc_node(0);
  const term_ptr = build_net(erase(term), net, [], 0);
  net.link_ports(new Pointer(root_addr, 0), new Pointer(root_addr, 2));
  net.link_ports(new Pointer(root_addr, 1), term_ptr);
  // Removes invalid redexes. They can be created by the
  // compiler when duplicating variables more than once.
  net.redex = net.redex.filter(([a_addr, b_addr]) => {
    const a_p0 = new Pointer(a_addr, 0);
    const b_p0 = new Pointer(b_addr, 0);
    const a_ok = net.enter_port(a_p0).equal(b_p0);
    const b_ok = net.enter_port(b_p0).equal(a_p0);
    return a_ok && b_ok;
  });
  return net;
};

const decompile = (net) => {
  const build_term = (net, ptr, var_ptrs, dup_exit) => {
    const label = net.nodes[ptr.addr].label;
    if (label === 1) {
      switch (ptr.port) {
        case 0:
          var_ptrs.push(new Pointer(ptr.addr, 1));
          const body = build_term(net, net.enter_port(new Pointer(ptr.addr, 2)), var_ptrs, dup_exit);
          var_ptrs.pop();
          return Lam(gen_name(var_ptrs.length), null, body);
        case 1:
          for (let index = 0; index < var_ptrs.length; ++index) {
            if (var_ptrs[var_ptrs.length - index - 1].equal(ptr)) {
              return Var(index);
            }
          }
        case 2:
          const argm = build_term(net, net.enter_port(new Pointer(ptr.addr, 1)), var_ptrs, dup_exit);
          const func = build_term(net, net.enter_port(new Pointer(ptr.addr, 0)), var_ptrs, dup_exit);
          return App(func, argm);
      }
    } else {
      switch (ptr.port) {
        case 0:
          const exit = dup_exit.pop();
          const term = build_term(net, net.enter_port(new Pointer(ptr.addr, exit)), var_ptrs, dup_exit);
          dup_exit.push(exit);
          return term;
        default:
          dup_exit.push(ptr.port);
          const term = build_term(net, net.enter_port(new Pointer(ptr.addr, 0)), var_ptrs, dup_exit);
          dup_exit.pop();
          return term;
      }
    }
  };
  return build_term(net, net.enter_port(new Pointer(0, 1)), [], []);
};

const norm_with_stats = (term, defs = {}, lazy = true) => {
  const net = compile(term, defs);
  const stats = lazy ? net.reduce_lazy() : net.reduce();
  const norm = decompile(net);
  return {norm, stats};
};

const norm = (term, defs, lazy) => {
  return norm_with_stats(term, defs, lazy).norm;
};

module.exports = {compile, decompile, norm_with_stats, norm};
