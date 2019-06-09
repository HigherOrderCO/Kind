// ~~ Formality Interaction Net System ~~

const Pointer = (addr, port) => (addr << 2) + (port & 3);
const addr_of = (ptr) => ptr >>> 2;
const slot_of = (ptr) => ptr & 3;
const Numeric = (numb) => numb + 0x100000000;
const numb_of = (numb) => numb - 0x100000000;
const type_of = (ptrn) => ptrn >= 0x100000000 ? NUM : PTR;

// PtrNum types
const PTR = 0;
const NUM = 1;

// Node types
const NOD = 0;
const OP1 = 1;
const OP2 = 2;
const ITE = 3;
const FOR = 4;

class Net {
  // A net stores nodes (this.nodes), reclaimable memory addrs (this.freed) and active pairs (this.redex)
  constructor() {
    this.nodes = []; // nodes
    this.freed = []; // integers
    this.redex = []; // array of (integer, integer) tuples representing addrs
  }

  // Allocates a new node, return its addr
  alloc_node(type, kind) {

    // If there is reclaimable memory, use it
    if (this.freed.length > 0) {
      var addr = this.freed.pop();

    // Otherwise, extend the array of nodes
    } else {
      var addr = this.nodes.length / 4;
    }

    // Fill the memory with an empty node without pointers
    this.nodes[addr * 4 + 0] = addr * 4 + 0;
    this.nodes[addr * 4 + 1] = addr * 4 + 1;
    this.nodes[addr * 4 + 2] = addr * 4 + 2;
    this.nodes[addr * 4 + 3] = (kind << 6) + ((type & 0x7) << 3);
    return addr;
  }

  // Deallocates a node, allowing its space to be reclaimed
  free_node(addr) {
    this.nodes[addr * 4 + 0] = addr * 4 + 0;
    this.nodes[addr * 4 + 1] = addr * 4 + 1;
    this.nodes[addr * 4 + 2] = addr * 4 + 2;
    this.nodes[addr * 4 + 3] = 0;
    this.freed.push(addr);
  }

  is_free(addr) {
    return this.nodes[addr * 4 + 0] === addr * 4 + 0
        && this.nodes[addr * 4 + 1] === addr * 4 + 1
        && this.nodes[addr * 4 + 2] === addr * 4 + 2
        && this.nodes[addr * 4 + 3] === 0;
  }

  // Returns if given slot holds a number
  is_numeric(addr, slot) {
    return (this.nodes[addr * 4 + 3] >>> slot) & 1; 
  }

  set_port(addr, slot, ptrn) {
    if (type_of(ptrn) === NUM) {
      this.nodes[addr * 4 + slot] = numb_of(ptrn);
      this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] | (1 << slot);
    } else {
      this.nodes[addr * 4 + slot] = ptrn;
      this.nodes[addr * 4 + 3] = this.nodes[addr * 4 + 3] & ~(1 << slot);
    }
  }

  get_port(addr, slot) {
    return this.nodes[addr * 4 + slot] + (this.is_numeric(addr, slot) ? 0x100000000 : 0);
  }

  type_of(addr) {
    return (this.nodes[addr * 4 + 3] >>> 3) & 0x7;
  }

  set_type(addr, type) {
    this.nodes[addr * 4 + 3] = (this.nodes[addr * 4 + 3] & ~0b111000) | (type << 3);
  }

  kind_of(addr) {
    return this.nodes[addr * 4 + 3] >>> 6;
  }

  // Given a pointer to a port, returns a pointer to the opposing port
  enter_port(ptrn) {
    if (type_of(ptrn) === NUM) { 
      throw "Can't enter a numeric pointer.";
    } else {
      return this.get_port(addr_of(ptrn), slot_of(ptrn));
    }
  }

  // Connects two ports
  link_ports(a_ptrn, b_ptrn) {
    var a_numb = type_of(a_ptrn) === NUM;
    var b_numb = type_of(b_ptrn) === NUM;

    // Point ports to each-other
    if (!a_numb) this.set_port(addr_of(a_ptrn), slot_of(a_ptrn), b_ptrn);
    if (!b_numb) this.set_port(addr_of(b_ptrn), slot_of(b_ptrn), a_ptrn);

    // If both are main ports, add this to the list of active pairs
    if (!(a_numb && b_numb) && (a_numb || slot_of(a_ptrn) === 0) && (b_numb || slot_of(b_ptrn) === 0)) {
      this.redex.push(a_numb ? addr_of(b_ptrn) : addr_of(a_ptrn));
    }
  }

  // Disconnects a port, causing both sides to point to themselves
  unlink_port(a_ptrn) {
    if (type_of(a_ptrn) === PTR) {
      var b_ptrn = this.enter_port(a_ptrn);
      if (type_of(b_ptrn) === PTR && this.enter_port(b_ptrn) === a_ptrn) {
        this.set_port(addr_of(a_ptrn), slot_of(a_ptrn), a_ptrn);
        this.set_port(addr_of(b_ptrn), slot_of(b_ptrn), b_ptrn);
      }
    }
  }

  // Rewrites an active pair
  rewrite(a_addr) {
    var a_ptrn = Pointer(a_addr, 0);
    var b_ptrn = this.get_port(a_addr, 0);
    if (type_of(b_ptrn) === NUM) {
      var a_type = this.type_of(a_addr);
      var a_kind = this.kind_of(a_addr);

      // UnaryOperation
      if (a_type === OP1) {
        var dst = this.enter_port(Pointer(a_addr, 2));
        var fst = numb_of(b_ptrn);
        var snd = numb_of(this.enter_port(Pointer(a_addr, 1)));
        switch (a_kind) {
          case  0: var res = Numeric((fst + snd) >>> 0); break;
          case  1: var res = Numeric((fst - snd) >>> 0); break;
          case  2: var res = Numeric((fst * snd) >>> 0); break;
          case  3: var res = Numeric((fst / snd) >>> 0); break;
          case  4: var res = Numeric((fst % snd) >>> 0); break;
          case  5: var res = Numeric((fst ** snd) >>> 0); break;
          case  6: var res = Numeric((fst & snd) >>> 0); break;
          case  7: var res = Numeric((fst | snd) >>> 0); break;
          case  8: var res = Numeric((fst ^ snd) >>> 0); break;
          case  9: var res = Numeric((~snd) >>> 0); break;
          case 10: var res = Numeric((fst >>> snd) >>> 0); break;
          case 11: var res = Numeric((fst << snd) >>> 0); break;
          case 12: var res = Numeric((fst > snd ? 1 : 0) >>> 0); break;
          case 13: var res = Numeric((fst < snd ? 1 : 0) >>> 0); break;
          case 14: var res = Numeric((fst == snd ? 1 : 0) >>> 0); break;
          default: throw "[ERROR]\nInvalid interaction.";
        }
        this.link_ports(dst, res);
        this.unlink_port(Pointer(a_addr, 0));
        this.unlink_port(Pointer(a_addr, 2));
        this.free_node(a_addr);
      
      // BinaryOperation
      } else if (a_type === OP2) {
        this.set_type(a_addr, OP1);
        var num0_ptr = this.enter_port(Pointer(a_addr, 1));
        var num1_ptr = this.enter_port(Pointer(a_addr, 0));
        this.link_ports(num0_ptr, Pointer(a_addr, 0));
        this.link_ports(num1_ptr, Pointer(a_addr, 1));
    
      // NumberDuplication
      } else if (a_type === NOD) {
        this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 1)));
        this.link_ports(b_ptrn, this.enter_port(Pointer(a_addr, 2)));
        this.free_node(a_addr);

      // IfThenElse
      } else if (a_type === ITE) {
        var pair_ptr = this.enter_port(Pointer(a_addr, 1));
        var dest_ptr = this.enter_port(Pointer(a_addr, 2));
        var cond_val = numb_of(b_ptrn) === 0;
        this.set_type(a_addr, NOD);
        this.link_ports(Pointer(a_addr, 0), pair_ptr);
        this.link_ports(Pointer(a_addr, cond_val ? 1 : 2), Pointer(a_addr, cond_val ? 1 : 2));
        this.link_ports(Pointer(a_addr, cond_val ? 2 : 1), dest_ptr);

      // ForLoop
      } else if (a_type === FOR) {
        var pair_ptr = this.enter_port(Pointer(a_addr, 1))
        var p_addr   = addr_of(pair_ptr);
        var func_ptr = this.enter_port(Pointer(p_addr, 1));
        var argm_ptr = this.enter_port(Pointer(p_addr, 2));
        if (numb_of(b_ptrn) === 0) {
          this.link_ports(this.enter_port(Pointer(a_addr, 2)), argm_ptr);
          for (var i = 0; i < 3; i++) {
            this.unlink_port(Pointer(a_addr, i));
            this.unlink_port(Pointer(p_addr, i));
          }
          this.free_node(a_addr);
          this.free_node(p_addr);
        } else {
          var dup_addr = this.alloc_node(NOD, a_kind);
          var app_addr = this.alloc_node(NOD, 0);
          this.link_ports(Pointer(dup_addr, 0), func_ptr);
          this.link_ports(Pointer(app_addr, 1), argm_ptr);
          this.link_ports(Pointer(dup_addr, 1), Pointer(app_addr, 0));
          this.link_ports(Pointer(dup_addr, 2), Pointer(addr_of(pair_ptr), 1));
          this.link_ports(Pointer(app_addr, 2), Pointer(addr_of(pair_ptr), 2));
          this.link_ports(Pointer(a_addr, 0), Numeric(numb_of(b_ptrn) - 1));
        }

      } else {
        throw "[ERROR]\nInvalid interaction.";
      }

    } else {
      var b_addr = addr_of(b_ptrn);
      var a_type = this.type_of(a_addr);
      var b_type = this.type_of(b_addr);
      var a_kind = this.kind_of(a_addr);
      var b_kind = this.kind_of(b_addr);

      // NodeAnnihilation, UnaryAnnihilation, BinaryAnnihilation
      if ( a_type === NOD && b_type === NOD && a_kind === b_kind
        || a_type === OP1 && b_type === OP1
        || a_type === OP2 && b_type === OP2
        || a_type === ITE && b_type === ITE) {
        var a_aux1_dest = this.enter_port(Pointer(a_addr, 1));
        var b_aux1_dest = this.enter_port(Pointer(b_addr, 1));
        this.link_ports(a_aux1_dest, b_aux1_dest);
        var a_aux2_dest = this.enter_port(Pointer(a_addr, 2));
        var b_aux2_dest = this.enter_port(Pointer(b_addr, 2));
        this.link_ports(a_aux2_dest, b_aux2_dest);
        for (var i = 0; i < 3; i++) {
          this.unlink_port(Pointer(a_addr, i));
          this.unlink_port(Pointer(b_addr, i));
        }
        this.free_node(a_addr);
        if (a_addr !== b_addr) {
          this.free_node(b_addr);
        }

      // NodeDuplication, BinaryDuplication
      } else if
        (  a_type === NOD && b_type === NOD && a_kind !== b_kind
        || a_type === NOD && b_type === OP2
        || a_type === NOD && b_type === ITE) {
        var p_addr = this.alloc_node(b_type, b_kind);
        var q_addr = this.alloc_node(b_type, b_kind);
        var r_addr = this.alloc_node(a_type, a_kind);
        var s_addr = this.alloc_node(a_type, a_kind);
        this.link_ports(Pointer(r_addr, 1), Pointer(p_addr, 1));
        this.link_ports(Pointer(s_addr, 1), Pointer(p_addr, 2));
        this.link_ports(Pointer(r_addr, 2), Pointer(q_addr, 1));
        this.link_ports(Pointer(s_addr, 2), Pointer(q_addr, 2));
        this.link_ports(Pointer(p_addr, 0), this.enter_port(Pointer(a_addr, 1)));
        this.link_ports(Pointer(q_addr, 0), this.enter_port(Pointer(a_addr, 2)));
        this.link_ports(Pointer(r_addr, 0), this.enter_port(Pointer(b_addr, 1)));
        this.link_ports(Pointer(s_addr, 0), this.enter_port(Pointer(b_addr, 2)));
        for (var i = 0; i < 3; i++) {
          this.unlink_port(Pointer(a_addr, i));
          this.unlink_port(Pointer(b_addr, i));
        }
        this.free_node(a_addr);
        if (a_addr !== b_addr) {
          this.free_node(b_addr);
        }

      // UnaryDuplication
      } else if
        (  a_type === NOD && b_type === OP1
        || a_type === ITE && b_type === OP1) {
        var c_addr = this.alloc_node(OP1, b_kind);
        this.link_ports(Pointer(c_addr, 1), this.enter_port(Pointer(b_addr, 1)));
        this.link_ports(Pointer(a_addr, 0), this.enter_port(Pointer(b_addr, 2)));
        this.link_ports(this.enter_port(Pointer(a_addr, 1)), Pointer(b_addr, 0));
        this.link_ports(this.enter_port(Pointer(a_addr, 2)), Pointer(c_addr, 0));
        this.link_ports(Pointer(a_addr, 1), Pointer(b_addr, 2));
        this.link_ports(Pointer(a_addr, 2), Pointer(c_addr, 2));
      
      // Permutations
      } else if (a_type === OP1 && b_type === NOD) {
        return this.rewrite(b_addr);
      } else if (a_type === OP2 && b_type === NOD) {
        return this.rewrite(b_addr);
      } else if (a_type === ITE && b_type === NOD) {
        return this.rewrite(b_addr);

      // InvalidInteraction
      } else {
        throw "[ERROR]\nInvalid interaction.";
      }
    }
  }

  // Rewrites active pairs until none is left, reducing the graph to normal form.
  // This could be performed in parallel and doesn't need GC.
  reduce_strict(stats) {
    var rewrites = 0;
    var loops = 0;
    var max_len = 0;
    while (this.redex.length > 0) {
      for (var i = 0, l = this.redex.length; i < l; ++i) {
        this.rewrite(this.redex.pop());
        stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
        ++stats.rewrites;
      }
      ++stats.loops;
    }
  }

  // Rewrites active pairs until none is left, reducing the graph to normal form.
  // This avoids unecessary computations, but is sequential and would need GC.
  reduce_lazy(stats) {
    var warp = [];
    var back = [];
    var prev = Pointer(0, 1);
    var next = this.enter_port(prev);
    var rwts = 0;
    while (true) {
      ++stats.loops;
      if (type_of(next) === PTR && (addr_of(next) === 0 || this.is_free(addr_of(next)))) {
        if (warp.length === 0) {
          break;
        } else {
          prev = warp.pop();
          next = this.enter_port(prev);
        }
      } else {
        if (slot_of(prev) === 0 && (type_of(next) === NUM || slot_of(next) === 0)) {
          this.rewrite(addr_of(prev));
          stats.rewrites += 1;
          stats.max_len = Math.max(stats.max_len, this.nodes.length / 4);
          if (type_of(prev) === PTR && this.type_of(addr_of(prev)) === FOR && numb_of(next) > 0) {
            prev = Pointer(addr_of(prev), 1);
            next = this.enter_port(prev);
          } else {
            do { prev = back.pop(); } while (type_of(prev) !== PTR);
            next = this.enter_port(prev);
          }
          ++rwts;
        } else if (type_of(next) === NUM) {
          [prev,next] = [next,prev];
        } else if (slot_of(next) === 0) {
          if (this.type_of(addr_of(next)) !== OP1) {
            warp.push(Pointer(addr_of(next), 1));
          }
          prev = Pointer(addr_of(next), 2);
          next = this.enter_port(prev);
        } else {
          back.push(prev);
          prev = Pointer(addr_of(next), 0);
          next = this.enter_port(prev);
        }
      }
    }
  }

  // Returns a string that is preserved on reduction, good for debugging
  denote(ptrn = this.enter_port(Pointer(0, 1)), exit = []) {
    function path_to_string(path) {
      var str = "<";
      while (path) {
        str += path.head === 1 ? "a" : "b";
        path = path.tail; 
      }
      str += ">";
      return str;
    }
    while (true) {
      if (type_of(ptrn) === PTR) {
        var ai = addr_of(ptrn);
        var as = slot_of(ptrn)
        var ak = this.kind_of(ai);
        switch (this.type_of(ai)) {
          case NOD:
            if (slot_of(ptrn) === 0) {
              if (exit[ak]) {
                var new_exit = exit.slice(0);
                new_exit[ak] = new_exit[ak].tail;
                ptrn = this.enter_port(Pointer(ai, Number(exit[ak].head)));
                exit = new_exit;
                continue; // tail-call: denote(ptrn, exit)
              } else {
                var lft = this.denote(this.enter_port(Pointer(ai, 1)), exit);
                var rgt = this.denote(this.enter_port(Pointer(ai, 2)), exit);
                return "(" + ak + " " + lft + " " + rgt + ")";
              }
            } else {
              if (ai === 0) {
                while (exit[exit.length - 1] === null) exit.pop();
                return exit.map(path_to_string).join(":");
              } else {
                var new_exit = exit.slice(0);
                new_exit[ak] = {head: as, tail: new_exit[ak] || null};
                ptrn = this.enter_port(Pointer(ai, 0));
                exit = new_exit;
                continue; // tail-call: denote(ptrn, exit)
              }
            }
            break;
          default:
            return "<TODO>";
        }
      } else {
        return "#" + numb_of(ptrn);
      }
    }
  }

  to_string() {
    const pointer = (ptrn) => {
      if (type_of(ptrn) === NUM) {
        return "#" + numb_of(ptrn);
      } else {
        return addr_of(ptrn) + "abc"[slot_of(ptrn)];
      }
    };
    var text = '';
    for (var i = 0; i < this.nodes.length / 4; i++) {
      if (this.is_free(i)) {
        text += i + ": ~\n";
      } else {
        var type = this.type_of(i);
        var kind = this.kind_of(i);
        text += i + ': ';
        text += "[" + type + ":" + kind + "| ";
        text += pointer(this.get_port(i, 0)) + " ";
        text += pointer(this.get_port(i, 1)) + " ";
        text += pointer(this.get_port(i, 2)) + "]";
        text += "..." + this.is_numeric(i,0) + " " + this.is_numeric(i,1) + " " + this.is_numeric(i,2);
        text += "\n";
      }
    }
    return text;
  }
}

module.exports = {Pointer, addr_of, slot_of, Numeric, numb_of, type_of, Net, NUM, PTR, NOD, OP1, OP2, ITE, FOR};
