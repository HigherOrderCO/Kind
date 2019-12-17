import { e as Val, a as App, V as Var, L as Lam, O as Op1, f as Op2, I as Ite, h as erase } from './core-4b5403b3.js';
import { P as Pointer, c as Net, f as NOD, t as type_of, d as NUM, a as addr_of, p as ptrn_eq, n as numb_of, s as slot_of, O as OP1, g as OP2, I as ITE, b as ptrn_st, N as Numeric } from './fm-net-b5947aee.js';

// ~~ Compiles Formality Core to Formality Net ~~

// TODO: Remove Fst, Snd and Par from this code, for now, I'm just making it compile
const Fst = () => {};
const Snd = () => {};
const Par = () => {};

const op_kind = {
   0 : ".+."   , ".+."   : 0 ,
   1 : ".-."   , ".-."   : 1 ,
   2 : ".*."   , ".*."   : 2 ,
   3 : "./."   , "./."   : 3 ,
   4 : ".%."   , ".%."   : 4 ,
   5 : ".**."  , ".**."  : 5 ,
   6 : ".&."   , ".&."   : 6 ,
   7 : ".|."   , ".|."   : 7 ,
   8 : ".^."   , ".^."   : 8 ,
   9 : ".~."   , ".~."   : 9 ,
  10 : ".>>>." , ".>>>." : 10 ,
  11 : ".<<."  , ".<<."  : 11 ,
  12 : ".>."   , ".>."   : 12 ,
  13 : ".<."   , ".<."   : 13 ,
  14 : ".==."  , ".==."  : 14 ,
};

const compile = (term, defs = {}) => {
  var term = typeof term === "string" ? defs[term] : term;
  const ref_ptrs = {};
  const build_net = (term, net, var_ptrs, level) => {
    const get_var = (ptrn) => {
      if (type_of(ptrn) === NUM) {
        return ptrn;
      } else {
        if (ptrn_eq(net.enter_port(ptrn), ptrn)) {
          return ptrn;
        } else {
          var dups_ptrn = net.enter_port(ptrn);
          //var dup_addr = net.alloc_node(NOD, level_of[ptrn_st(ptrn)] + 1);
          var dup_addr = net.alloc_node(NOD, Math.floor(Math.random()*(2**24)) + 1);
          net.link_ports(Pointer(dup_addr, 0), ptrn);
          net.link_ports(Pointer(dup_addr, 1), dups_ptrn);
          return Pointer(dup_addr, 2);
        }
      }
    };
    switch (term[0]) {
      case "Dup":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level);
        level_of[ptrn_st(expr_ptr)] = level;
        var_ptrs.push(expr_ptr);
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        return body_ptr;
      case "Put":
        var expr_ptr = build_net(term[1].expr, net, var_ptrs, level + 1);
        return expr_ptr;
      case "Lam":
        var lam_addr = net.alloc_node(NOD, 0);
        net.link_ports(Pointer(lam_addr, 1), Pointer(lam_addr, 1));
        level_of[ptrn_st(Pointer(lam_addr, 1))] = level;
        var_ptrs.push(Pointer(lam_addr, 1));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        net.link_ports(Pointer(lam_addr, 2), body_ptr);
        return Pointer(lam_addr, 0);
      case "App":
        var app_addr = net.alloc_node(NOD, 0);
        var func_ptr = build_net(term[1].func, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 0), func_ptr);
        var argm_ptr = build_net(term[1].argm, net, var_ptrs, level);
        net.link_ports(Pointer(app_addr, 1), argm_ptr);
        return Pointer(app_addr, 2);
      case "Val":
        return Numeric(term[1].numb);
      case "Op1":
        var op1_addr = net.alloc_node(OP1, op_kind[term[1].func]);
        net.link_ports(Numeric(term[1].num1[1].numb), Pointer(op1_addr, 1));
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
      case "Par":
        var par_addr = net.alloc_node(NOD, 0xFFFF);
        var val0_ptr = build_net(term[1].val0, net, var_ptrs, level);
        net.link_ports(Pointer(par_addr, 1), val0_ptr);
        var val1_ptr = build_net(term[1].val1, net, var_ptrs, level);
        net.link_ports(Pointer(par_addr, 2), val1_ptr);
        return Pointer(par_addr, 0);
      case "Fst":
        var fst_addr = net.alloc_node(NOD, 0xFFFF);
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        net.link_ports(Pointer(fst_addr, 0), pair_ptr);
        net.link_ports(Pointer(fst_addr, 2), Pointer(fst_addr, 2));
        return Pointer(fst_addr, 1);
      case "Snd":
        var snd_addr = net.alloc_node(NOD, 0xFFFF);
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        net.link_ports(Pointer(snd_addr, 0), pair_ptr);
        net.link_ports(Pointer(snd_addr, 1), Pointer(snd_addr, 1));
        return Pointer(snd_addr, 2);
      case "Prj":
        var prj_addr = net.alloc_node(NOD, 0xFFFF);
        level_of[ptrn_st(Pointer(prj_addr, 1))] = level;
        level_of[ptrn_st(Pointer(prj_addr, 2))] = level;
        var pair_ptr = build_net(term[1].pair, net, var_ptrs, level);
        var_ptrs.push(Pointer(prj_addr, 1));
        var_ptrs.push(Pointer(prj_addr, 2));
        var body_ptr = build_net(term[1].body, net, var_ptrs, level);
        var_ptrs.pop();
        var_ptrs.pop();
        net.link_ports(Pointer(prj_addr, 0), pair_ptr);
        return body_ptr;
      case "Ite":
        var ite_addr = net.alloc_node(ITE, 0xFFFF);
        var cond_ptr = build_net(term[1].cond, net, var_ptrs, level);
        net.link_ports(Pointer(ite_addr, 0), cond_ptr);
        var if_t_ptr = build_net(term[1].if_t, net, var_ptrs, level);
        var if_f_ptr = build_net(term[1].if_f, net, var_ptrs, level);
        var par_addr = net.alloc_node(NOD, 0xFFFF);
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
      case "Utv":
        throw "[ERROR]\nCan't compile an unrestricted term.";
      case "Ref":
        var ref_ptrn = ref_ptrs[term[1].name];
        // First time seeing this ref
        if (!ref_ptrn) {
          // Create a dup node for it and recurse
          var dup_addr = net.alloc_node(NOD, 0xFFFD);
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
            var dup_addr = net.alloc_node(NOD, 0xFFFD);
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
  var root_addr = net.alloc_node(NOD, 0);
  var term_ptr = build_net(term, net, [], 0);
  net.link_ports(Pointer(root_addr, 0), Pointer(root_addr, 2));
  net.link_ports(Pointer(root_addr, 1), term_ptr);
  // Removes invalid redexes. They can be created by the
  // compiler when duplicating variables more than once.
  net.redex = net.redex.filter((a_addr) => {
    var b_ptrn = net.enter_port(Pointer(a_addr, 0));
    if (type_of(b_ptrn) !== NUM) {
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

const decompile = (net) => {
  const build_term = (net, ptrn, var_ptrs, dup_exit) => {
    if (type_of(ptrn) === NUM) {
      return Val(numb_of(ptrn));
    } else {
      var addr = addr_of(ptrn);
      var type = net.type_of(addr);
      var kind = net.kind_of(addr);
      if (type === NOD) {
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
        } else if (kind === 0xFFFF) {
          switch (slot_of(ptrn)) {
            case 0:
              var val0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
              var val1 = build_term(net, net.enter_port(Pointer(addr, 2)), var_ptrs, dup_exit);
              return Par();
            case 1:
              var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return Fst();
            case 2:
              var pair = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
              return Snd();
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
      } else if (type === OP1) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var num1 = Val(numb_of(net.enter_port(Pointer(addr, 1))));
        return Op1(op_kind[kind], num0, num1);
      } else if (type === OP2) {
        var num0 = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
        var num1 = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        return Op2(op_kind[kind], num0, num1);
      } else if (type === ITE) {
        var cond = build_term(net, net.enter_port(Pointer(addr, 0)), var_ptrs, dup_exit);
        var pair = build_term(net, net.enter_port(Pointer(addr, 1)), var_ptrs, dup_exit);
        return Ite(cond, pair);
      }
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

var runtimeOptimal = /*#__PURE__*/Object.freeze({
  __proto__: null,
  compile: compile,
  decompile: decompile,
  norm_with_stats: norm_with_stats,
  norm: norm
});

export { norm as a, compile as c, decompile as d, norm_with_stats as n, runtimeOptimal as r };
