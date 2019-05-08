const {Var, App, Lam, Num, Op1, Op2, gen_name} = require("./core.js");
const {Net, Pointer, addr_of, slot_of, NOD, NUM, OP1, OP2} = require("./nasic.js");

const op_kind = {
  0: "+", "+": 0, 
  1: "-", "-": 1, 
  2: "*", "*": 2, 
  3: "/", "/": 3, 
};

const compile = (term, defs = {}) => {
  const build_net = (term, net, var_ptrs, level) => {
    const get_var = (ptr) => {
      if (!net.enter_port(ptr) || net.enter_port(ptr) === ptr) {
        return ptr;
      } else {
        var dups_ptr = net.enter_port(ptr);
        var dup_addr = net.alloc_node(NOD, Math.floor((1 + Math.random()) * Math.pow(2,16)));
        net.link_ports(Pointer(dup_addr, 0), ptr);
        net.link_ports(Pointer(dup_addr, 1), dups_ptr);
        return Pointer(dup_addr, 2);
      }
    };
    switch (term[0]) {
      case "Dup":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level);
        var_ptrs.push(expr_ptr);
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Put":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level + 1);
        return expr_ptr;
      case "Lam":
        var lam_addr = net.alloc_node(NOD, 1);
        net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
        var_ptrs.push(Pointer(lam_addr, 1));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(Pointer(lam_addr, 2), body_ptr);
        return Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(NOD, 1);
        var func_ptr = build_net(term[1].func, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 1), argm_ptr)
        return Pointer(app_addr, 2);
      case "Num":
        var num_addr = net.alloc_node(NUM, 0);
        net.set_num(num_addr, term[1].numb);
        return Pointer(num_addr, 0);
      case "Op1":
        var op1_addr = net.alloc_node(OP1, op_kind[term[1].func]);
        var num_addr = net.alloc_node(NUM, 0);
        net.set_num(num_addr, term[1].num1);
        net.link_ports(Pointer(num_addr, 0), Pointer(op1_addr, 1));
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(num0_ptr, Pointer(op1_addr, 0));
        return Pointer(op1_addr, 2);
      case "Op2":
        var op2_addr = net.alloc_node(OP2, op_kind[term[1].func]);
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 1), num0_ptr);
        var num1_ptr = build_net(term[1].num1, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 0), num1_ptr);
        return Pointer(op2_addr, 2);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
      case "Ref":
        return build_net(defs[term[1].name], net, var_ptrs, level);
      default:
        return build_net(Lam("", null, Var(0)), net, var_ptrs, level);
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
  net.redex = net.redex.filter(([a_addr, b_addr]) => {
    var a_p0 = Pointer(a_addr, 0);
    var b_p0 = Pointer(b_addr, 0);
    var a_ok = net.enter_port(a_p0) === b_p0;
    var b_ok = net.enter_port(b_p0) === a_p0;
    return a_ok && b_ok;
  });
  return net;
};

const decompile = (net) => {
  const build_term = (net, ptr, var_ptrs, dup_exit) => {
    var addr = addr_of(ptr);
    var type = net.nodes[addr * 4 + 3] & 0x3;
    var kind = net.nodes[addr * 4 + 3] >>> 2;
    if (type === NOD) {
      if (kind === 1) {
        switch (slot_of(ptr)) {
          case 0:
            var_ptrs.push(Pointer(addr, 1));
            var body = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
            var_ptrs.pop();
            return Lam(gen_name(var_ptrs.length), body);
          case 1:
            for (var index = 0; index < var_ptrs.length; ++index) {
              if (var_ptrs[var_ptrs.length - index - 1] === ptr) {
                return Var(index);
              }
            }
          case 2:
            var argm = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
            var func = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
            return App(func, argm);
        }
      } else {
        switch (slot_of(ptr)) {
          case 0:
            var exit = dup_exit.pop();
            var term = build_term(net, net.enter_port(Pointer(addr, exit)), var_ptrs, dup_exit);
            dup_exit.push(exit);
            return term;
          default:
            dup_exit.push(slot_of(ptr));
            var term = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
            dup_exit.pop();
            return term;
        }
      }
    } else if (type === OP1) {
      var num0 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
      var num1 = Num(net.get_num(addr_of(net.enter_port(Pointer(addr, 1)))));
      return Op1(op_kind[kind], num0, num1);
    } else if (type === OP2) {
      var num0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
      var num1 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
      return Op2(op_kind[kind], num0, num1);
    } else if (type === NUM) {
      return Num(net.get_num(addr));
    }
  };
  return build_term(net, net.enter_port(Pointer(0, 1)), [], []);
};

const norm_with_stats = (term, defs = {}, lazy = true) => {
  var net = compile(term, defs);
  var stats = lazy ? net.reduce_lazy() : net.reduce();
  var norm = decompile(net);
  return {norm, stats};
};

const norm = (term, defs, lazy) => {
  return norm_with_stats(term, defs, lazy).norm;
};

module.exports = {compile, decompile, norm_with_stats, norm};
