#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <math.h>

#define u32 uint32_t 
#define u64 uint64_t 

const u32 PTR = 0;
const u32 NUM = 1;

const u32 NOD = 0;
const u32 OP1 = 1;
const u32 OP2 = 2;
const u32 ITE = 3;

u64 Pointer(u32 addr, u32 port) {
  return (u64)((addr << 2) + (port & 3));
}

u32 addr_of(u64 ptrn) {
  return (u32)(ptrn >> 2);
}

u32 slot_of(u64 ptrn) {
  return (u32)(ptrn & 3);
}

u64 Numeric(u32 numb) {
  return (u64)numb | (u64)0x100000000;
}

u32 numb_of(u64 ptrn) {
  return (u32)ptrn;
}

u32 type_of(u64 ptrn) {
  return ptrn > (u64)0x100000000 ? NUM : PTR;
}

typedef struct Node {
  u32 port[3];
  u32 info;
} Node;

typedef struct Net {
  u32 *nodes;
  u32 nodes_len;
  u32 *redex;
  u32 redex_len;
  u32 *freed;
  u32 freed_len;
} Net;

typedef struct Stats {
  u32 rewrites;
  u32 passes;
} Stats;

u32 alloc_node(Net *net, u32 type, u32 kind) {
  u32 addr;
  if (net->freed_len > 0) {
    addr = net->freed[--net->freed_len];
  } else {
    addr = net->nodes_len / 4;
    net->nodes_len += 4;
  }
  net->nodes[addr * 4 + 0] = addr * 4 + 0;
  net->nodes[addr * 4 + 1] = addr * 4 + 1;
  net->nodes[addr * 4 + 2] = addr * 4 + 2;
  net->nodes[addr * 4 + 3] = (kind << 5) + ((type & 0x3) << 3);
  return addr;
}

void free_node(Net *net, u32 addr) {
  net->nodes[addr * 4 + 0] = addr * 4 + 0;
  net->nodes[addr * 4 + 1] = addr * 4 + 1;
  net->nodes[addr * 4 + 2] = addr * 4 + 2;
  net->nodes[addr * 4 + 3] = 0;
  net->freed[net->freed_len++] = addr;
}

u32 is_free(Net *net, u32 addr) {
  return net->nodes[addr * 4 + 0] == addr * 4 + 0
      && net->nodes[addr * 4 + 1] == addr * 4 + 1
      && net->nodes[addr * 4 + 2] == addr * 4 + 2
      && net->nodes[addr * 4 + 3] == 0;
}

u32 is_numeric(Net *net, u32 addr, u32 slot) {
  return (net->nodes[addr * 4 + 3] >> slot) & 1;
}

void set_port(Net *net, u32 addr, u32 slot, u32 ptrn) {
  if (type_of(ptrn) == NUM) {
      net->nodes[addr * 4 + slot] = numb_of(ptrn);
      net->nodes[addr * 4 + 3]    = net->nodes[addr * 4 + 3] | (1 << slot);
    } else {
      net->nodes[addr * 4 + slot] = ptrn;
      net->nodes[addr * 4 + 3]    = net->nodes[addr * 4 + 3] & ~(1 << slot);
  }
}

u64 get_port(Net* net, u32 addr, u32 slot) {
  return (u64)net->nodes[addr * 4 + slot] + (is_numeric(net, addr, slot) ? (u64)0x100000000 : (u64)0);
}

void set_type(Net* net, u32 addr, u32 type) {
  net->nodes[addr * 4 + 3] = (net->nodes[addr * 4 + 3] & ~0b11000) | (type << 3);
}

u32 get_type(Net* net, u32 addr) {
  return (net->nodes[addr * 4 + 3] >> 3) & 0x3;
}

u32 get_kind(Net* net, u32 addr) {
  return net->nodes[addr * 4 + 3] >> 5;
}

// Given a pointer to a port, returns a pointer to the opposing port
u64 enter_port(Net* net, u64 ptrn) {
  if (type_of(ptrn) == NUM) { 
    printf("[ERROR]\nCan't enter a numeric pointer.");
    return 0;
  } else {
    return get_port(net, addr_of(ptrn), slot_of(ptrn));
  }
}

u32 is_redex(Net *net, u32 addr) {
  u64 a_ptrn = Pointer(addr, 0);
  u64 b_ptrn = enter_port(net, a_ptrn);
  return type_of(b_ptrn) == NUM || slot_of(b_ptrn) == 0;
}

// Connects two ports
void link_ports(Net *net, u64 a_ptrn, u64 b_ptrn) {
  u32 a_numb = type_of(a_ptrn) == NUM;
  u32 b_numb = type_of(b_ptrn) == NUM;

  // Point ports to each-other
  if (!a_numb) set_port(net, addr_of(a_ptrn), slot_of(a_ptrn), b_ptrn);
  if (!b_numb) set_port(net, addr_of(b_ptrn), slot_of(b_ptrn), a_ptrn);

  // If both are main ports, add this to the list of active pairs
  if (!(a_numb && b_numb) && (a_numb || slot_of(a_ptrn) == 0) && (b_numb || slot_of(b_ptrn) == 0)) {
    net->redex[net->redex_len++] = a_numb ? addr_of(b_ptrn) : addr_of(a_ptrn);
  }
}

// Disconnects a port, causing both sides to point to themselves
void unlink_port(Net* net, u64 a_ptrn) {
  if (type_of(a_ptrn) == PTR) {
    u64 b_ptrn = enter_port(net, a_ptrn);
    if (type_of(b_ptrn) == PTR && enter_port(net, b_ptrn) == a_ptrn) {
      set_port(net, addr_of(a_ptrn), slot_of(a_ptrn), a_ptrn);
      set_port(net, addr_of(b_ptrn), slot_of(b_ptrn), b_ptrn);
    }
  }
}

// Rewrites an active pair
void rewrite(Net* net, u32 a_addr) {
  u64 b_ptrn = get_port(net, a_addr, 0);

  if (type_of(b_ptrn) == NUM) {
    u32 a_type = get_type(net, a_addr);
    u32 a_kind = get_kind(net, a_addr);

    // UnaryOperation
    if (a_type == OP1) {
      u64 dst = enter_port(net, Pointer(a_addr, 2));
      u32 fst = numb_of(b_ptrn);
      u32 snd = numb_of(enter_port(net, Pointer(a_addr, 1)));
      u32 res;
      switch (a_kind) {
        case  0: res = Numeric(fst + snd); break;
        case  1: res = Numeric(fst - snd); break;
        case  2: res = Numeric(fst * snd); break;
        case  3: res = Numeric(fst / snd); break;
        case  4: res = Numeric(fst % snd); break;
        case  5: res = Numeric((u32)(pow((float)fst, (float)snd))); break;
        case  6: res = Numeric((u32)(pow((float)fst, ((float)snd / pow(2.0,32.0))))); break;
        case  7: res = Numeric(fst & snd); break;
        case  8: res = Numeric(fst | snd); break;
        case  9: res = Numeric(fst ^ snd); break;
        case 10: res = Numeric(~snd); break;
        case 11: res = Numeric(fst >> snd); break;
        case 12: res = Numeric(fst << snd); break;
        case 13: res = Numeric(fst > snd ? 1 : 0); break;
        case 14: res = Numeric(fst < snd ? 1 : 0); break;
        case 15: res = Numeric(fst == snd ? 1 : 0); break;
        default: res = 0; printf("[ERROR]\nInvalid interaction."); break;
      }
      link_ports(net, dst, res);
      unlink_port(net, Pointer(a_addr, 0));
      unlink_port(net, Pointer(a_addr, 2));
      free_node(net, a_addr);
    
    // BinaryOperation
    } else if (a_type == OP2) {
      set_type(net, a_addr, OP1);
      link_ports(net, Pointer(a_addr, 0), enter_port(net, Pointer(a_addr, 1)));
      unlink_port(net, Pointer(a_addr, 1));
      link_ports(net, Pointer(a_addr, 1), b_ptrn);
  
    // NumberDuplication
    } else if (a_type == NOD) {
      link_ports(net, b_ptrn, enter_port(net, Pointer(a_addr, 1)));
      link_ports(net, b_ptrn, enter_port(net, Pointer(a_addr, 2)));
      free_node(net, a_addr);

    // IfThenElse
    } else if (a_type == ITE) {
      u64 pair_ptr = enter_port(net, Pointer(a_addr, 1));
      u64 dest_ptr = enter_port(net, Pointer(a_addr, 2));
      u32 cond_val = numb_of(b_ptrn) == 0;
      set_type(net, a_addr, NOD);
      link_ports(net, Pointer(a_addr, 0), pair_ptr);
      link_ports(net, Pointer(a_addr, cond_val ? 1 : 2), Pointer(a_addr, cond_val ? 1 : 2));
      link_ports(net, Pointer(a_addr, cond_val ? 2 : 1), dest_ptr);

    } else {
      printf("[ERROR]\nInvalid interaction.");
    }

  } else {
    u32 b_addr = addr_of(b_ptrn);
    u32 a_type = get_type(net, a_addr);
    u32 b_type = get_type(net, b_addr);
    u32 a_kind = get_kind(net, a_addr);
    u32 b_kind = get_kind(net, b_addr);

    // NodeAnnihilation, UnaryAnnihilation, BinaryAnnihilation
    if ( (a_type == NOD && b_type == NOD && a_kind == b_kind)
      || (a_type == OP1 && b_type == OP1)
      || (a_type == OP2 && b_type == OP2)
      || (a_type == ITE && b_type == ITE)) {
      u32 a_aux1_dest = enter_port(net, Pointer(a_addr, 1));
      u32 b_aux1_dest = enter_port(net, Pointer(b_addr, 1));
      link_ports(net, a_aux1_dest, b_aux1_dest);
      u32 a_aux2_dest = enter_port(net, Pointer(a_addr, 2));
      u32 b_aux2_dest = enter_port(net, Pointer(b_addr, 2));
      link_ports(net, a_aux2_dest, b_aux2_dest);
      for (u32 i = 0; i < 3; i++) {
        unlink_port(net, Pointer(a_addr, i));
        unlink_port(net, Pointer(b_addr, i));
      }
      free_node(net, a_addr);
      if (a_addr != b_addr) {
        free_node(net, b_addr);
      }

    // NodeDuplication, BinaryDuplication
    } else if
      (  (a_type == NOD && b_type == NOD && a_kind != b_kind)
      || (a_type == NOD && b_type == OP2)
      || (a_type == NOD && b_type == ITE)) {
      u32 p_addr = alloc_node(net, b_type, b_kind);
      u32 q_addr = alloc_node(net, b_type, b_kind);
      u32 r_addr = alloc_node(net, a_type, a_kind);
      u32 s_addr = alloc_node(net, a_type, a_kind);
      link_ports(net, Pointer(r_addr, 1), Pointer(p_addr, 1));
      link_ports(net, Pointer(s_addr, 1), Pointer(p_addr, 2));
      link_ports(net, Pointer(r_addr, 2), Pointer(q_addr, 1));
      link_ports(net, Pointer(s_addr, 2), Pointer(q_addr, 2));
      link_ports(net, Pointer(p_addr, 0), enter_port(net, Pointer(a_addr, 1)));
      link_ports(net, Pointer(q_addr, 0), enter_port(net, Pointer(a_addr, 2)));
      link_ports(net, Pointer(r_addr, 0), enter_port(net, Pointer(b_addr, 1)));
      link_ports(net, Pointer(s_addr, 0), enter_port(net, Pointer(b_addr, 2)));
      for (u32 i = 0; i < 3; i++) {
        unlink_port(net, Pointer(a_addr, i));
        unlink_port(net, Pointer(b_addr, i));
      }
      free_node(net, a_addr);
      if (a_addr != b_addr) {
        free_node(net, b_addr);
      }

    // UnaryDuplication
    } else if
      (  (a_type == NOD && b_type == OP1)
      || (a_type == ITE && b_type == OP1)) {
      u32 c_addr = alloc_node(net, OP1, b_kind);
      link_ports(net, Pointer(c_addr, 1), enter_port(net, Pointer(b_addr, 1)));
      link_ports(net, Pointer(a_addr, 0), enter_port(net, Pointer(b_addr, 2)));
      link_ports(net, enter_port(net, Pointer(a_addr, 1)), Pointer(b_addr, 0));
      link_ports(net, enter_port(net, Pointer(a_addr, 2)), Pointer(c_addr, 0));
      link_ports(net, Pointer(a_addr, 1), Pointer(b_addr, 2));
      link_ports(net, Pointer(a_addr, 2), Pointer(c_addr, 2));
    
    // Permutations
    } else if (a_type == OP1 && b_type == NOD) {
      return rewrite(net, b_addr);
    } else if (a_type == OP2 && b_type == NOD) {
      return rewrite(net, b_addr);
    } else if (a_type == ITE && b_type == NOD) {
      return rewrite(net, b_addr);

    // InvalidInteraction
    } else {
      printf("[ERROR]\nInvalid interaction.");
    }
  }
}

// Rewrites active pairs until none is left, reducing the graph to normal form
// This could be performed in parallel. Unreachable data is freed automatically.
Stats reduce(Net *net) {
  Stats stats;
  stats.rewrites = 0;
  stats.passes = 0;
  while (net->redex_len > 0) {
    for (u32 i = 0, l = net->redex_len; i < l; ++i) {
      rewrite(net, net->redex[--net->redex_len]);
      ++stats.rewrites;
    }
    ++stats.passes;
  }
  return stats;
}

void find_redexes(Net *net) {
  net->redex_len = 0;
  for (u32 i = 0; i < net->nodes_len / 4; ++i) {
    u32 b_ptrn = enter_port(net, Pointer(i, 0));
    if (addr_of(b_ptrn) > i && is_redex(net, i)) {
      net->redex[net->redex_len++] = i;
    }
  }
}

void print_pointer(u64 ptrn) {
  if (type_of(ptrn) == NUM) {
    printf("#%u", numb_of(ptrn));
  } else {
    printf("%u", addr_of(ptrn));
    switch (slot_of(ptrn)) {
      case 0: printf("a"); break;
      case 1: printf("b"); break;
      case 2: printf("c"); break;
    }
  }
}

void print_net(Net* net) {
  for (u32 i = 0; i < net->nodes_len / 4; i++) {
    if (is_free(net, i)) {
      printf("%u: ~\n", i);
    } else {
      u32 type = get_type(net, i);
      u32 kind = get_kind(net, i);
      printf("%u: ", i);
      printf("[%u:%u| ", type, kind);
      print_pointer(get_port(net, i, 0));
      printf(" ");
      print_pointer(get_port(net, i, 1));
      printf(" ");
      print_pointer(get_port(net, i, 2));
      printf("]");
      printf("...");
      printf("%d ", is_numeric(net, i, 0));
      printf("%d ", is_numeric(net, i, 1));
      printf("%d ", is_numeric(net, i, 2));
      printf("\n");
    }
  }
}

static u32 nodes[] = {
  2,402,0,0,8,372,400,0,4,24,364,0,40,21,18,0,25,22,14,0,26,13,17,0,9,16,20,32,56,37,34,0,41,38,30,0,42,29,33,0,12,32,36,32,72,53,50,0,57,54,46,0,58,45,49,0,28,48,52,32,88,69,66,0,73,70,62,0,74,61,65,0,44,64,68,32,104,85,82,0,89,86,78,0,90,77,81,0,60,80,84,32,120,101,98,0,105,102,94,0,106,93,97,0,76,96,100,32,136,117,114,0,121,118,110,0,122,109,113,0,92,112,116,32,152,133,130,0,137,134,126,0,138,125,129,0,108,128,132,32,168,149,146,0,153,150,142,0,154,141,145,0,124,144,148,32,184,165,162,0,169,166,158,0,170,157,161,0,140,160,164,32,200,181,178,0,185,182,174,0,186,173,177,0,156,176,180,32,216,197,194,0,201,198,190,0,202,189,193,0,172,192,196,32,232,213,210,0,217,214,206,0,218,205,209,0,188,208,212,32,248,229,226,0,233,230,222,0,234,221,225,0,204,224,228,32,264,245,242,0,249,246,238,0,250,237,241,0,220,240,244,32,280,261,258,0,265,262,254,0,266,253,257,0,236,256,260,32,296,277,274,0,281,278,270,0,282,269,273,0,252,272,276,32,312,293,290,0,297,294,286,0,298,285,289,0,268,288,292,32,328,309,306,0,313,310,302,0,314,301,305,0,284,304,308,32,344,325,322,0,329,326,318,0,330,317,321,0,300,320,324,32,360,341,338,0,345,342,334,0,346,333,337,0,316,336,340,32,368,357,354,0,361,358,350,0,362,349,353,0,332,352,356,32,10,369,370,0,348,365,366,0,5,380,378,0,382,392,374,0,373,384,376,0,381,385,388,0,386,390,389,0,377,398,396,0,394,397,393,0,6,404,1,0,401,410,408,0,406,409,405,0
};

int main () {
  Net net;
  net.nodes     = malloc(sizeof(u32) * 200000000);
  net.redex     = malloc(sizeof(u32) * 10000000);
  net.freed     = malloc(sizeof(u32) * 20000000);

  net.nodes_len = 0;
  net.redex_len = 0;
  net.freed_len = 0;

  for (u32 i = 0; i < sizeof(nodes) / sizeof(u32); ++i) {
    net.nodes[i] = nodes[i];
    net.nodes_len += 1;
  }

  find_redexes(&net);

  Stats stats = reduce(&net);
  printf("rewrites: %d\n", stats.rewrites);
  printf("passes: %d\n", stats.passes);
}
