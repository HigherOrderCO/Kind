import { h as erase, R as Ref, V as Var, a as App, L as Lam } from './core-4b5403b3.js';
import './stringify.js';

// Formality's runtime works by compiling normal Terms to a
// Runtime Terms (RtTerm), reducing, and decompiling back.
// A RtTerm is a map `{mem:[U32], ptr:U32}` containing the
// term data in a compressed form. It exists in a context of
// top-level defs, `rt_defs`, of type `Map(RefId, RtTerm)`. 

// RtTerm constructors
const VAR = 0;
const LAM = 1;
const APP = 2;
const REF = 3;

// Pointer: includes constructor type and address
const NIL     = 0xFFFFFFFF;
const New     = (ctor, addr) => (ctor + (addr << 4)) >>> 0;
const ctor_of = ptr => ptr & 0b1111;
const addr_of = ptr => ptr >>> 4;

// Compiles a Term to a RtTerm. Returns:
// - rf_defs : Map(RefId, RtTerm) -- a map from RefIds to RtTerms
// - rt_rfid : Map(String, RefId) -- a map from term names to RefIds
// - rt_term : RtTerm             -- the compiled term
function compile(defs, name) {
  var rt_defs = {};
  var rt_rfid = {};
  var rt_bind = {};
  var next_id = 0;
  function go(name, vpos, term, depth) {
    var pos = rt_defs[rt_rfid[name]].length;
    switch (term[0]) {
      case "Var":
        var got = rt_bind[rt_rfid[name]][depth - term[1].index - 1];
        if (got !== undefined) {
          rt_defs[rt_rfid[name]][got] = New(VAR, vpos);
          return NIL;
        } else {
          return New(VAR, term[1].index);
        }
      case "Lam":
        rt_bind[rt_rfid[name]][depth] = pos;
        rt_defs[rt_rfid[name]].push(NIL, NIL);
        rt_defs[rt_rfid[name]][pos+1] = go(name, pos+1, term[1].body, depth + 1);
        return New(LAM, pos);
      case "App":
        rt_defs[rt_rfid[name]].push(NIL, NIL);
        rt_defs[rt_rfid[name]][pos+0] = go(name, pos+0, term[1].func, depth);
        rt_defs[rt_rfid[name]][pos+1] = go(name, pos+1, term[1].argm, depth);
        return New(APP, pos);
      case "Ref":
        return New(REF, rt_rfid[term[1].name]);
    }
    return NIL;
  }  function reach(term) {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var":
        break;
      case "Lam":
        reach(term.body);
        break;
      case "App":
        reach(term.func);
        reach(term.argm);
        break;
      case "Val":
        break;
      case "Op1":
      case "Op2":
        reach(term.num0);
        reach(term.num1);
        break;
      case "Ite":
        reach(term.cond);
        reach(term.if_t);
        reach(term.if_f);
        break;
      case "Log":
        reach(term.expr);
        break;
      case "Ref":
        if (!reachable[term.name]) {
          reachable[term.name] = true;
          reach(erase(defs[term.name]));
        }
        break;
    }
  }  var reachable = {[name]:true};
  reach(erase(defs[name]));
  for (var def_name in reachable) {
    rt_rfid[def_name] = next_id++;
  }
  for (var def_name in reachable) {
    rt_defs[rt_rfid[def_name]] = [];
    rt_bind[rt_rfid[def_name]] = {};
    var root = go(def_name, 0, erase(defs[def_name]), 0);
    if (root) {
      rt_defs[rt_rfid[def_name]] = {
        mem: rt_defs[rt_rfid[def_name]],
        ptr: root
      };
    }
  }
  var rt_term = rt_defs[rt_rfid[name]];
  return {rt_defs, rt_rfid, rt_term};
}
// Recovers a Term from a RtTerm
function decompile(rt_term, dep = 0) {
  var {mem, ptr} = rt_term;
  if (ptr === NIL) {
    return Ref("*");
  } else {
    var ctor = ctor_of(ptr);
    var addr = addr_of(ptr);
    switch (ctor) {
      case LAM:
        var vari = mem[addr+0]; 
        if (vari !== NIL) {
          mem[addr_of(vari)] = New(VAR, dep);
        }
        var body = decompile({mem, ptr: mem[addr+1]}, dep+1);
        return Lam("v"+dep, null, body, false);
      case APP:
        var func = decompile({mem, ptr: mem[addr+0]}, dep);
        var argm = decompile({mem, ptr: mem[addr+1]}, dep);
        return App(func, argm, false);
      case REF:
        return Ref("R"+addr_of(ptr), false);
      case VAR:
        return Var(dep - addr - 1);
    }  }}
// Removes garbage from the memory
function collect(rt_term) {
  var {mem, ptr} = rt_term;
  var new_mem = [];
  function go(ptr, vpos) {
    var ctor = ctor_of(ptr);
    var addr = addr_of(ptr);
    var pos  = new_mem.length;
    switch (ctor) {
      case LAM:
        var vari = mem[addr+0];
        if (vari !== NIL) {
          mem[addr_of(mem[addr+0])] = New(VAR, pos);
        }
        new_mem.push(NIL, NIL);
        new_mem[pos+1] = go(mem[addr+1], pos+1);
        return New(LAM, pos);
      case APP:
        new_mem.push(NIL, NIL);
        new_mem[pos+0] = go(mem[addr+0], pos+0);
        new_mem[pos+1] = go(mem[addr+1], pos+1);
        return New(ctor, pos);
      case REF:
        new_mem.push(NIL, NIL);
        return ptr;
      case VAR:
        new_mem[addr] = New(VAR, vpos + 0);
        return NIL;
    }  }  return {mem:new_mem, ptr:go(ptr, 0)};
}
// Reduces a RtTerm to normal form. This implements a lazy
// evaluation strategy. It uses a global garbage collector,
// but that could be replaced by merely collecting terms
// that got substituted in a function that doesn't use its
// bound variable.
function reduce(rt_term, rt_defs) {

  var {mem, ptr: root} = rt_term;
  var stats = {beta: 0, copy: 0}; // reduction costs
  var back = []; // nodes we passed through

  back.push([rt_term.ptr, 0, 0]);

  var collect_length = mem.length * 8; // when to collect garbage

  // While there is a node to visit
  while (back.length > 0) {
    var [next,side,deph] = back[back.length - 1];

    // If needed, do garbage collection
    if (mem.length > collect_length) {
      var {mem, ptr: root} = collect({mem, ptr: root});
      var back = [[root, 0, 0]];
      var collect_length = mem.length * 8;
      continue;
    }

    // Pattern-matches the next node
    switch (ctor_of(next)) {
      
      // If it is a lambda, continue towards its body
      case LAM:
        var vari = mem[addr_of(next) + 0];
        if (vari !== NIL) {
          mem[addr_of(vari)] = New(VAR, deph);
        }
        back[back.length-1][1] = 1;
        back.push([mem[addr_of(next) + 1], 0, deph + 1]); 
        break;

      // If its an application, either do a beta-reduction,
      // or continue towards ids func
      case APP:
        var func = mem[addr_of(next) + 0];
        // Lam-App (beta) reduction
        if (ctor_of(func) === LAM) {
          stats.beta += 1;

          // Substitutes variable by argument
          var vari = mem[addr_of(func) + 0];
          if (vari !== NIL) {
            var argm = mem[addr_of(next) + 1];
            mem[addr_of(vari)] = argm;
          }

          // Connects parent to body
          var subs = mem[addr_of(func) + 1]; 

          back.pop();

          if (back.length > 0) {
            var back_to = back[back.length - 1];
            mem[addr_of(back_to[0]) + back_to[1]] = subs;
            back[back.length-1][1] = 0;
          } else {
            var root = subs;
            back.push([subs, 0, 0]);
          }

        // Continues on func
        } else {
          back.push([func,0,deph]);
        }
        break;

      // If it is a reference, copies its code to the
      // memory, correctly shifting variable pointers
      case REF:
        mem.push(NIL);
        var pos = mem.length; // memory position to copy
        var ref = rt_defs[addr_of(next)]; // term to copy
        var ref_mem = ref.mem;
        stats.copy += ref_mem.length;
        for (var i = 0; i < ref_mem.length; ++i) {
          var ref_term = ref_mem[i];
          var ref_ctor = ctor_of(ref_term);
          var ref_addr = addr_of(ref_term);
          if (ref_term !== NIL && ref_ctor !== REF) {
            mem.push(New(ref_ctor, ref_addr + pos));
          } else {
            mem.push(ref_mem[i]);
          }
        }

        back.pop();

        var subs = New(ctor_of(ref.ptr), addr_of(ref.ptr) + pos); 

        if (back.length > 0) {
          var back_to = back[back.length - 1];
          mem[addr_of(back_to[0]) + back_to[1]] = subs;
          back[back.length-1][1] = 0;
        } else {
          var root = subs;
          back.push([subs, 0, 0]);
        }
        break;

      // If it is a variable or number stop
      case VAR:
        back.pop();

        // If we've reached weak normal form, move up and
        // continue on the arguments of applications
        while (back.length > 0) {
          var [back_term, back_side, back_deph] = back[back.length - 1];
          if (ctor_of(back_term) === APP && back_side === 0) {
            back[back.length - 1][1] = 1;
            back.push([mem[addr_of(back_term) + 1], 0, back_deph]);
            break;
          } else {
            back.pop();
          }
        }

        break;

    }
  }
  return {rt_term: {mem, ptr: root}, stats};
}

var runtimeFast = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VAR: VAR,
  LAM: LAM,
  APP: APP,
  REF: REF,
  NIL: NIL,
  New: New,
  ctor_of: ctor_of,
  addr_of: addr_of,
  compile: compile,
  decompile: decompile,
  collect: collect,
  reduce: reduce
});

export { APP as A, LAM as L, NIL as N, REF as R, VAR as V, New as a, addr_of as b, ctor_of as c, compile as d, decompile as e, collect as f, runtimeFast as g, reduce as r };
