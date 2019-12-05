var core = require("./fm-core.js");

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
const F64 = 4;
const U64 = 5;
const ADD = 6; // TODO: add remaining num operations

// Pointer: includes constructor type and address
const NIL     = 0xFFFFFFFF;
const New     = (ctor, addr) => (ctor + (addr << 4)) >>> 0;
const ctor_of = ptr => ptr & 0b1111;
const addr_of = ptr => ptr >>> 4;

// Compiles a Term to a RtTerm. Returns:
// - rt_rfid : Map(String, RefId) -- a map from term names to RefIds
// - rf_defs : Map(RefId, RtTerm) -- a map from RefIds to RtTerms
function compile(defs) {
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
      case "Val":
        rt_defs[rt_rfid[name]].push(NIL, Math.floor(Math.abs(term[1].numb) % (2**32)));
        return New(U64, pos);
      case "Op1":
      case "Op2":
        rt_defs[rt_rfid[name]].push(NIL, NIL);
        rt_defs[rt_rfid[name]][pos+0] = go(name, pos+0, term[1].num0, depth);
        rt_defs[rt_rfid[name]][pos+1] = go(name, pos+1, term[1].num1, depth);
        return New(ADD, pos);
      case "Ref":
        return New(REF, rt_rfid[term[1].name]);
    }
    return NIL;
  };
  for (var name in defs) {
    rt_rfid[name] = next_id++;
  }
  for (var name in defs) {
    rt_defs[rt_rfid[name]] = [];
    rt_bind[rt_rfid[name]] = {};
    var root = go(name, 0, core.erase(defs[name]), 0);
    if (root) {
      rt_defs[rt_rfid[name]] = {
        mem: rt_defs[rt_rfid[name]],
        ptr: root
      };
    }
  }
  return {rt_defs, rt_rfid};
};

// Recovers a Term from a RtTerm
function decompile(rt_term, dep = 0) {
  var {mem, ptr} = rt_term;
  if (ptr === NIL) {
    return core.Ref("*");
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
        return core.Lam("v"+dep, null, body, false);
      case APP:
        var func = decompile({mem, ptr: mem[addr+0]}, dep);
        var argm = decompile({mem, ptr: mem[addr+1]}, dep);
        return core.App(func, argm, false);
      case REF:
        return core.Ref("R"+addr_of(ptr), false);
      case VAR:
        return core.Var(dep - addr - 1);
      case U64:
        return core.Val(mem[addr+1]);
      case ADD:
        var num0 = decompile({mem, ptr: mem[addr+0]}, dep);
        var num1 = decompile({mem, ptr: mem[addr+1]}, dep);
        return core.Op2(".+.", num0, num1);
    };
  };
};

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
      case ADD:
        new_mem.push(NIL, NIL);
        new_mem[pos+0] = go(mem[addr+0], pos+0);
        new_mem[pos+1] = go(mem[addr+1], pos+1);
        return New(ctor, pos);
      case REF:
        new_mem.push(NIL, NIL);
        return ptr;
      case VAR:
        new_mem[addr] = New(VAR, vpos + 0);
      case U64:
        new_mem.push(mem[addr+0], mem[addr+1]);
        return New(U64, pos);
    };
  };
  return {mem:new_mem, ptr:go(ptr, 0)};
};

// Reduces a RtTerm to normal form. This implements a lazy
// evaluation strategy. It uses a global garbage collector,
// but that could be replaced by merely collecting terms
// that got substituted in a function that doesn't use its
// bound variable.
function reduce(rt_term, rt_defs) {
  var {mem, ptr: root} = rt_term;
  var stats = {beta: 0, copy: 0}; // reduction costs
  var back = []; // nodes we passed through
  var next = root; // next node to visit
  var deph = 0; // number of surrounding lambdas
  var collect_length = mem.length * 8; // when to collect garbage

  // While there is a node to visit
  while (next !== NIL) {
    // If needed, do garbage collection
    if (mem.length > collect_length) {
      var {mem, ptr: root} = collect({mem, ptr: root});
      var back = [];
      var next = root;
      var collect_length = mem.length * 8;
      continue;
    }

    // Pattern-matches the next node
    var subs = NIL;
    var side = 0;
    switch (ctor_of(next)) {
      
      // If it is a lambda, continue towards its body
      case LAM:
        back.push([next,1,deph]);
        var vari = mem[addr_of(next) + 0];
        if (vari !== NIL) {
          mem[addr_of(vari)] = New(VAR, deph);
        }
        var deph = deph + 1;
        var next = mem[addr_of(next) + 1];
        break;

      // If its an application, either do a beta-reduction,
      // or continue towards ids func
      case APP:
        var func = mem[addr_of(next) + 0];
        // Lam-App (beta) reduction
        if (ctor_of(func) === LAM) {
          stats.beta += 1;
          // Substitutes variable by argument
          var argm = mem[addr_of(next) + 1];
          var vari = mem[addr_of(func) + 0];
          if (vari !== NIL) {
            mem[addr_of(vari)] = argm;
          }
          // Connects parent to body
          var subs = mem[addr_of(func) + 1];
        // Continues on func
        } else {
          back.push([next,0,deph]);
          var next = func;
        }
        break;

      // If it is a reference, copies its code to the
      // memory, correctly shifting variable pointers
      case REF:
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
        var subs = New(ctor_of(ref.ptr), addr_of(ref.ptr) + pos); 
        break;

      // If it is a variable or number stop
      case VAR:
      case U64:
        var next = NIL;
        break;

      // If it is a numeric operation, perform it
      case ADD:
        var num0 = mem[addr_of(next) + 0];
        var num1 = mem[addr_of(next) + 1];
        if (ctor_of(num0) === U64 && ctor_of(num1) === U64) {
          mem.push(0, mem[addr_of(num0)+1] + mem[addr_of(num1)+1]);
          var subs = New(U64, mem.length - 2);
        } else if (ctor_of(num0) === U64) {
          back.push([next,1,deph]);
          var next = num1;
        } else {
          back.push([next,0,deph]);
          var next = num0;
        }
        break;
    }

    // If we performed a reduction, connect the new value to
    // the parent, and go back to it
    if (subs !== NIL) {
      if (back.length > 0) {
        var back_to = back[back.length - 1];
        mem[addr_of(back_to[0]) + back_to[1]] = subs;
        var next = back.pop()[0];
        var deph = back_to[2];
      } else {
        var root = subs;
        var next = subs;
      }
    }

    // If we've reached weak normal form, move up and
    // continue on the arguments of applications
    if (next === NIL) {
      while (back.length > 0) {
        var [back_term, back_side, back_deph] = back.pop();
        if (ctor_of(back_term) === APP && back_side === 0) {
          back.push([back_term, 1]);
          var deph = back_deph;
          var next = mem[addr_of(back_term) + 1];
          break;
        }
      }
    }
  };

  return {rt_term: {mem, ptr: root}, stats};
};

module.exports = {
  compile,
  decompile,
  collect,
  reduce
};
