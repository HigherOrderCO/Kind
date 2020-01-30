// ~~ Compiles Formality Core to Formality Net ~~
// TODO: remove num-ops and pairs

import {Var, App, Lam, Val, Op1, Op2, Ite, Hol, erase, Term, ValT, Defs} from "./core";
import {
  Stats,
  init_stats,
  Port,
  PortType,
  NodeType,
  Pointer,
  addr_of,
  slot_of,
  Numeric,
  numb_of,
  type_of,
  ptrn_eq,
  ptrn_st,
  Net
} from "./fm-net";

const op_kind = {
   0 : "+"    , "+"    : 0  ,
   1 : "-"    , "-"    : 1  ,
   2 : "*"    , "*"    : 2  ,
   3 : "\\"   , "\\"   : 3  ,
   4 : "%"    , "%"    : 4  ,
   5 : "**"   , "**"   : 5  ,
   6 : "&&"   , "&&"   : 6  ,
   7 : "||"   , "||"   : 7  ,
   8 : "^"    , "^"    : 8  ,
   9 : "~"    , "~"    : 9  ,
  10 : ">>>"  , ">>>"  : 10 ,
  11 : "<<"   , "<<"   : 11 ,
  12 : ">"    , ">"    : 12 ,
  13 : "<"    , "<"    : 13 ,
  14 : "==="  , "==="  : 14 ,
  15 : "sin"  , "sin"  : 15 ,
  16 : "cos"  , "cos"  : 16 ,
  17 : "tan"  , "tan"  : 17 ,
  18 : "asin" , "asin" : 18 ,
  19 : "acos" , "acos" : 19 ,
  20 : "atan" , "atan" : 20 ,
};

const compile = (term: Term, defs: Defs = {}): Net => {
  var term = typeof term === "string" ? defs[term] : term;
  const ref_ptrs = {};
  const build_net = (term: Term, net: Net, var_ptrs, level): Port => {
    const get_var = (ptrn) => {
      if (type_of(ptrn) === PortType.NUM) {
        return ptrn;
      } else {
        if (ptrn_eq(net.enter_port(ptrn), ptrn)) {
          return ptrn;
        } else {
          var dups_ptrn = net.enter_port(ptrn);
          //var dup_addr = net.alloc_node(NodeType.NOD, level_of[ptrn_st(ptrn)] + 1);
          var dup_addr = net.alloc_node(NodeType.NOD, Math.floor(Math.random()*(2**24)) + 1);
          net.link_ports(Pointer(dup_addr, 0), ptrn);
          net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
          return Pointer(dup_addr, 2);
        }
      }
    };
    switch (term[0]) {
      case "Lam":
        var lam_addr = net.alloc_node(NodeType.NOD, 0);
        net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
        level_of[ptrn_st(Pointer(lam_addr, 1))] = level;
        var_ptrs.push(Pointer(lam_addr, 1));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(Pointer(lam_addr, 2), body_ptr);
        return Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(NodeType.NOD, 0);
        var func_ptr = build_net(term[1].func, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 1), argm_ptr)
        return Pointer(app_addr, 2);
      case "Val":
        return Numeric(term[1].numb);
      case "Op1":
        var op1_addr = net.alloc_node(NodeType.OP1, op_kind[term[1].func]);
        net.link_ports(Numeric((term[1].num1 as ValT)[1].numb), Pointer(op1_addr, 1));
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(num0_ptr, Pointer(op1_addr, 0));
        return Pointer(op1_addr, 2);
      case "Op2":
        var op2_addr = net.alloc_node(NodeType.OP2, op_kind[term[1].func]);
        var num0_ptr = build_net(term[1].num0, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 1), num0_ptr);
        var num1_ptr = build_net(term[1].num1, net, var_ptrs, level);
        net.link_ports(Pointer(op2_addr, 0), num1_ptr);
        return Pointer(op2_addr, 2);
      case "Ite":
        var ite_addr = net.alloc_node(NodeType.ITE, 0xFFFF);
        var cond_ptr = build_net(term[1].cond, net, var_ptrs, level);
        net.link_ports(Pointer(ite_addr, 0), cond_ptr);
        var if_t_ptr = build_net(term[1].if_t, net, var_ptrs, level);
        var if_f_ptr = build_net(term[1].if_f, net, var_ptrs, level);
        var par_addr = net.alloc_node(NodeType.NOD, 0xFFFF);
        net.link_ports(Pointer(par_addr, 1), if_t_ptr);
        net.link_ports(Pointer(par_addr, 2), if_f_ptr);
        var pair_ptr = Pointer(par_addr, 0);
        net.link_ports(Pointer(ite_addr, 1), pair_ptr);
        return Pointer(ite_addr, 2);
      case "Log":
        return build_net(term[1].expr, net, var_ptrs, level);
      case "Var":
        return get_var(var_ptrs[var_ptrs.length - term[1].index - 1]);
      case "Hol":
        throw "[ERROR]\nCan't compile a hole.";
      case "Ref":
        var ref_ptrn = ref_ptrs[term[1].name];
        // First time seeing this ref
        if (!ref_ptrn) {
          // Create a dup node for it and recurse
          var dup_addr = net.alloc_node(NodeType.NOD, 0xFFFD);
          var ref_ptrn = Pointer(dup_addr, 1);
          ref_ptrs[term[1].name] = ref_ptrn;
          var dref = erase(defs[term[1].name]);
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
            var dup_addr = net.alloc_node(NodeType.NOD, 0xFFFD);
            net.link_ports(Pointer(dup_addr, 0), ref_ptrn);
            net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
            return Pointer(dup_addr, 2);
          }
        }
      default:
        return build_net(Lam("", null, Var(0), false), net, var_ptrs, level);
    }
  };
  var level_of = {};
  var net = new Net();
  var root_addr = net.alloc_node(NodeType.NOD, 0);
  var term_ptr = build_net(term, net, [], 0);
  net.link_ports(Pointer(root_addr, 0), Pointer(root_addr, 2));
  net.link_ports(Pointer(root_addr, 1), term_ptr);
  // Removes invalid redexes. They can be created by the
  // compiler when duplicating variables more than once.
  net.redex = net.redex.filter((a_addr) => {
    var b_ptrn = net.enter_port(Pointer(a_addr, 0));
    if (type_of(b_ptrn) !== PortType.NUM) {
      var b_addr = addr_of(b_ptrn);
      var a_p0 = Pointer(a_addr, 0);
      var b_p0 = Pointer(b_addr, 0);
      var a_ok = ptrn_eq(net.enter_port(a_p0), b_p0);
      var b_ok = ptrn_eq(net.enter_port(b_p0), a_p0);
      return a_ok && b_ok;
    } else {
      return true;
    }
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

const decompile = (net: Net): Term => {
  const build_term = (net: Net, ptrn: Port, var_ptrs, dup_exit): Term => {
    if (type_of(ptrn) === PortType.NUM) {
      return Val(numb_of(ptrn));
    } else {
      var addr = addr_of(ptrn);
      var type = net.type_of(addr);
      var kind = net.kind_of(addr);
      if (type === NodeType.NOD) {
        if (kind === 0) {
          switch (slot_of(ptrn)) {
            case 0:
              var_ptrs.push(Pointer(addr, 1));
              var body = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
              var_ptrs.pop();
              return Lam("x" + var_ptrs.length, null, body, false);
            case 1:
              for (var index = 0; index < var_ptrs.length; ++index) {
                if (ptrn_eq(var_ptrs[var_ptrs.length - index - 1], ptrn)) {
                  return Var(index);
                }
              }
            case 2:
              var argm = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
              var func = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return App(func, argm, false);
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
      } else if (type === NodeType.OP1) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var num1: Term = Val(numb_of(net.enter_port(Pointer(addr, 1))));
        return Op1(op_kind[kind], num0, num1);
      } else if (type === NodeType.OP2) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
        var num1 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        return Op2(op_kind[kind], num0, num1);
      } else if (type === NodeType.ITE) {
        var cond = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var pair_port = net.enter_port(Pointer(addr, 1));
        var pair_addr = addr_of(pair_port);
        var if_t = build_term(net, net.enter_port(Pointer(pair_addr, 1)), var_ptrs, dup_exit);
        var if_f = build_term(net, net.enter_port(Pointer(pair_addr, 2)), var_ptrs, dup_exit);
        return Ite(cond, if_t, if_f);
      }
    }
  };
  return build_term(net, net.enter_port(Pointer(0, 1)), [], []);
};

// Normalizes a Formality term on optimal-mode
const normal = (name: string, defs: Defs = {}, lazy = true): {term: Term, stats: Stats} => {
  var net = compile(defs[name], defs);
  var stats = init_stats()
  if(lazy) {
    net.reduce_lazy(stats)
  } else {
    net.reduce_strict(stats);
  }
  var term = decompile(net);
  return {term, stats};
};

export {compile, decompile, normal};
