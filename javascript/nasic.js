const Pointer  = (addr, port) => (addr << 2) + (port & 3);
const addr_of = (ptr) => ptr >>> 2;
const slot_of = (ptr) => ptr & 3;

// Node types
const NOD = 0;
const NUM = 1;
const OP1 = 2;
const OP2 = 3;

class Net {
  // A net stores nodes (this.nodes), reclaimable memory addrs (this.freed) and active pairs (this.redex)
  constructor() {
    this.nodes = []; // nodes
    this.freed = []; // integers
    this.redex = []; // array of (integer, integer) tuples representing addrs
    this.BUF   = new ArrayBuffer(8);
    this.U32   = new Uint32Array(this.BUF);
    this.F64   = new Float64Array(this.BUF);
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
    this.nodes[addr * 4 + 3] = (kind << 2) + (type & 0x3);
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

  // Given a pointer to a port, returns a pointer to the opposing port
  enter_port(ptr) {
    return this.nodes[addr_of(ptr) * 4 + slot_of(ptr)];
  }

  // Connects two ports
  link_ports(a_ptr, b_ptr) {
    // Stores each pointer on its opposing port
    this.nodes[addr_of(a_ptr) * 4 + slot_of(a_ptr)] = b_ptr;
    this.nodes[addr_of(b_ptr) * 4 + slot_of(b_ptr)] = a_ptr;

    // If both are main ports, add this to the list of active pairs
    if (slot_of(a_ptr) === 0 && slot_of(b_ptr) === 0) {
      this.redex.push([addr_of(a_ptr), addr_of(b_ptr)]);
    } 
  }

  // Disconnects a port, causing both sides to point to themselves
  unlink_port(a_ptr) {
    var b_ptr = this.enter_port(a_ptr);
    if (this.enter_port(b_ptr) === a_ptr) {
      this.nodes[addr_of(a_ptr) * 4 + slot_of(a_ptr)] = a_ptr;
      this.nodes[addr_of(b_ptr) * 4 + slot_of(a_ptr)] = b_ptr;
    }
  }

  set_num(addr, val) {
    this.F64[0] = val;
    this.nodes[addr * 4 + 1] = this.U32[0];
    this.nodes[addr * 4 + 2] = this.U32[1];
  }

  get_num(addr) {
    this.U32[0] = this.nodes[addr * 4 + 1];
    this.U32[1] = this.nodes[addr * 4 + 2];
    return this.F64[0];
  }

  // Rewrites an active pair
  rewrite([a_addr, b_addr]) {
    var a_type = this.nodes[a_addr * 4 + 3] & 3;
    var b_type = this.nodes[b_addr * 4 + 3] & 3;
    var a_kind = this.nodes[a_addr * 4 + 3] >>> 2;
    var b_kind = this.nodes[b_addr * 4 + 3] >>> 2;

    // NumberAnnihilation
    if (a_type === NUM && b_type === NUM) {
      this.free_node(a_addr);
      if (a_addr !== b_addr) {
        this.free_node(b_addr);
      }

    // NodeAnnihilation, UnaryAnnihilation, BinaryAnnihilation
    } else if (a_type === NOD && b_type === NOD && a_kind === b_kind || a_type === OP1 && b_type === OP1 || a_type === OP2 && b_type === OP2) {
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

    // NumberDuplication
    } else if (a_type === NOD && b_type === NUM) {
      this.link_ports(Pointer(a_addr, 0), this.enter_port(Pointer(a_addr, 1)));
      this.link_ports(Pointer(b_addr, 0), this.enter_port(Pointer(a_addr, 2)));
      this.set_num(a_addr, this.get_num(b_addr));
      this.nodes[a_addr * 4 + 3] = NUM;

    // NodeDuplication, BinaryDuplication
    } else if (a_type === NOD && b_type === NOD && a_kind !== b_kind || a_type === NOD && b_type === OP2) {
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
    } else if (a_type === NOD && b_type === OP1) {
      var c_addr = this.alloc_node(OP1, b_kind);
      var n_addr = this.alloc_node(NUM, 0);
      this.set_num(n_addr, this.get_num(addr_of(this.enter_port(Pointer(b_addr, 1)))));
      this.link_ports(Pointer(c_addr, 1), Pointer(n_addr, 0));
      this.link_ports(Pointer(a_addr, 0), this.enter_port(Pointer(b_addr, 2)));
      this.link_ports(this.enter_port(Pointer(a_addr, 1)), Pointer(b_addr, 0));
      this.link_ports(this.enter_port(Pointer(a_addr, 2)), Pointer(c_addr, 0));
      this.link_ports(Pointer(a_addr, 1), Pointer(b_addr, 2));
      this.link_ports(Pointer(a_addr, 2), Pointer(c_addr, 2));

    // UnaryOperation
    } else if (a_type === OP1 && b_type === NUM) {
      var dst = this.enter_port(Pointer(a_addr, 2));
      var fst = this.get_num(b_addr);
      var snd = this.get_num(addr_of(this.enter_port(Pointer(a_addr, 1))));
      switch (a_kind) {
        case 0: this.set_num(b_addr, fst + snd); break;
        case 1: this.set_num(b_addr, fst - snd); break;
        case 2: this.set_num(b_addr, fst * snd); break;
        case 3: this.set_num(b_addr, fst / snd); break;
        default: throw "[ERROR]\nInvalid interaction.";
      }
      this.link_ports(dst, Pointer(b_addr, 0));
      this.unlink_port(Pointer(a_addr, 0));
      this.unlink_port(Pointer(a_addr, 2));
      this.free_node(addr_of(this.enter_port(Pointer(a_addr, 1))));
      this.free_node(a_addr);
    
    // BinaryOperation
    } else if (a_type === OP2 && b_type === NUM) {
      this.nodes[a_addr * 4 + 3] = (a_kind << 2) | OP1;
      var num0_ptr = this.enter_port(Pointer(a_addr, 1));
      var num1_ptr = this.enter_port(Pointer(a_addr, 0));
      this.link_ports(num0_ptr, Pointer(a_addr, 0));
      this.link_ports(num1_ptr, Pointer(a_addr, 1));

    // Permutations
    } else if (a_type === NUM && b_type === OP1) {
      return this.rewrite([b_addr, a_addr]);
    } else if (a_type === NUM && b_type === OP2) {
      return this.rewrite([b_addr, a_addr]);
    } else if (a_type === NUM && b_type === NOD) {
      return this.rewrite([b_addr, a_addr]);
    } else if (a_type === OP1 && b_type === NOD) {
      return this.rewrite([b_addr, a_addr]);
    } else if (a_type === OP2 && b_type === NOD) {
      return this.rewrite([b_addr, a_addr]);

    // InvalidInteraction
    } else {
      throw "[ERROR]\nInvalid interaction.";
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
    return {rewrites: rewrite_count};
  }

  // Rewrites active pairs lazily. Lazy reductions avoid wasting work and
  // allows recursive terms, but requires GC and enforces sequentiality.
  reduce_lazy() {
    var warp = [];
    var exit = [];
    var next = this.enter_port(Pointer(0, 1));
    var prev = null;
    var back = null;
    var rwts = 0;
    while (addr_of(next) > 0 || warp.length > 0) {
      next = addr_of(next) === 0 ? this.enter_port(warp.pop()) : next;
      prev = this.enter_port(next);
      if (slot_of(next) === 0 && slot_of(prev) === 0) {
        back = this.enter_port(Pointer(addr_of(prev), exit.pop()));
        this.rewrite([addr_of(prev), addr_of(next)]);
        next = this.enter_port(back);
        ++rwts;
      } else if (slot_of(next) === 0) {
        warp.push(Pointer(addr_of(next), 2));
        next = this.enter_port(Pointer(addr_of(next), 1));
      } else {
        exit.push(slot_of(next));
        next = this.enter_port(Pointer(addr_of(next), 0));
      }
    }
    return {rewrites: rwts};
  }

  to_string() {
    var text = '';
    for (var i = 0; i < this.nodes.length / 4; i++) {
      if (this.freed.indexOf(i) !== -1) {
        text += i + ": ~\n";
      } else {
        var type = this.nodes[i * 4 + 3] & 0x3;
        var kind = this.nodes[i * 4 + 3] >>> 2;
        switch (type) {
          case NOD:
          case OP1:
          case OP2:
            text += i + ': ';
            text += "[" + type + ":" + kind + "| ";
            text += addr_of(this.nodes[i * 4 + 0]) + "abc"[slot_of(this.nodes[i * 4 + 0])] + " ";
            text += addr_of(this.nodes[i * 4 + 1]) + "abc"[slot_of(this.nodes[i * 4 + 1])] + " ";
            text += addr_of(this.nodes[i * 4 + 2]) + "abc"[slot_of(this.nodes[i * 4 + 2])] + "]\n";
            break;
          case NUM:
            text += i + ': ';
            text += "[num| " + addr_of(this.nodes[i * 4 + 0]) + "abc"[slot_of(this.nodes[i * 4 + 0])] + " ";
            text += "#" + this.get_num(i).toString() + "]\n";
            break;
        }
      }
    }
    return text;
  }
}

module.exports = {Pointer, Net, addr_of, slot_of, NOD, NUM, OP1, OP2};
