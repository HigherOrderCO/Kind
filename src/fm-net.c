#include <assert.h>
#include <math.h>
#include <stdint.h>
#include <limits.h>

#include "fm-net.h"
#include "emscripten.h"

enum {
  PTR,
  NUM,
  ERA,
};

enum {
  NOD,
  OP1,
  OP2,
  ITE,
};

enum {
  EQ,     // equality
  NE,     // not-equal
  LT_S,   // signed less-than
  LT_U,   // unsigned less-than
  GT_S,   // signed greater-than
  GT_U,   // unsigned greater-than
  LE_S,   // signed less-than-or-equal
  LE_U,   // unsigned less-than-or-equal
  GE_S,   // signed greater-than-or-equal
  GE_U,   // unsigned greater-than-or-equal
  CLZ,     // count leading zeros, unary
  CTZ,     // count trailing zeros, unary
  POPCNT,  // count number of 1 bits, unary
  SHL,     // shift left
  SHR,     // unsigned shift right
  SHR_S,   // signed shift right
  ROTL,    // rotate left
  ROTR,    // rotate right
  AND,     // bitwise and
  OR,      // bitwise or
  XOR,     // bitwise xor
  ADD,     // addition
  SUB,     // subtraction
  MUL,     // multiplication
  DIV_S,   // signed division
  DIV_U,   // unsigned division
  REM_S,   // signed remainder
  REM_U,   // unsigned remainder
  FABS,    // absolute value, unary
  FNEG,    // negation, unary
  FCEIL,   // round upward, unary
  FFLOOR,  // round downward, unary
  FTRUNC,  // truncate, unary
  FNRST,   // round to nearest, unary
  FSQRT,   // square-root, unary
  FADD,    // addition
  FSUB,    // subtraction
  FMUL,    // multiplication
  FDIV,    // division
  FMIN,    // minimum
  FMAX,    // maximum
  FCPYSGN, // copy sign value of first arg and sign of second arg
  FEQ,     // equality
  FNE,     // not-equal
  FLT,     // less-than
  FGT,     // greater-than
  FLE,     // less-than-or-equal
  FGE,     // greater-than-or-equal
  EXT32_S, // signed extension of 32 bit numbers to 64 bit
  FTOS,    // f64 to signed i64
  FTOU,    // f64 to unsigned i64
  STOF,    // signed i64 to f64
  UTOF     // unsigned i64 to f64
};

EMSCRIPTEN_KEEPALIVE
uint64_t _eq(uint64_t a, uint64_t b) { return a == b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _ne(uint64_t a, uint64_t b) { return a != b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _lt_s(int64_t a, int64_t b) { return a < b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _gt_s(int64_t a, int64_t b) { return a > b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _le_s(int64_t a, int64_t b) { return a <= b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _ge_s(int64_t a, int64_t b) { return a >= b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _lt_u(uint64_t a, uint64_t b) { return a < b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _gt_u(uint64_t a, uint64_t b) { return a > b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _le_u(uint64_t a, uint64_t b) { return a <= b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _ge_u(uint64_t a, uint64_t b) { return a >= b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _clz(uint64_t a, uint64_t b) { return __builtin_clzll(b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _ctz(uint64_t a, uint64_t b) { return __builtin_ctzll(b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _popcnt(uint64_t a,uint64_t b) { return __builtin_popcountll(b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _shl(uint64_t a, uint64_t b) { return a << b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _shr(uint64_t a, uint64_t b) { return a >> b; }
EMSCRIPTEN_KEEPALIVE
int64_t _shr_s(int64_t a, uint64_t b) { return a >> b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _rotl(uint64_t a, uint64_t b) {
  const uint64_t mask = CHAR_BIT*sizeof(b) - 1;
  b &= mask;
  return (a << b) | (a >> ((-b) & mask));
}
EMSCRIPTEN_KEEPALIVE
uint64_t _rotr(uint64_t a, uint64_t b) {
  const uint64_t mask = CHAR_BIT*sizeof(b) - 1;
  b &= mask;
  return (a >> b) | (a << ((-b) & 63));
}
EMSCRIPTEN_KEEPALIVE
uint64_t _and(uint64_t a, uint64_t b) { return a & b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _or(uint64_t a, uint64_t b) { return a | b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _xor(uint64_t a, uint64_t b) { return a ^ b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _add(uint64_t a, uint64_t b) { return a + b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _sub(uint64_t a, uint64_t b) { return a - b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _mul(uint64_t a, uint64_t b) { return a * b; }
EMSCRIPTEN_KEEPALIVE
int64_t _div_s(int64_t a, int64_t b) { return a / b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _div_u(uint64_t a, uint64_t b) { return a / b; }
EMSCRIPTEN_KEEPALIVE
int64_t _rem_s(int64_t a, int64_t b) { return a % b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _rem_u(uint64_t a, uint64_t b) { return a % b; }
EMSCRIPTEN_KEEPALIVE
double _fabs(double a, double b) { return fabs(b); }
EMSCRIPTEN_KEEPALIVE
double _fneg(double a, double b) { return -1 * b; }
EMSCRIPTEN_KEEPALIVE
double _fceil(double a, double b) { return ceil(b); }
EMSCRIPTEN_KEEPALIVE
double _ffloor(double a, double b) { return floor(b); }
EMSCRIPTEN_KEEPALIVE
double _ftrunc(double a, double b) { return trunc(b); }
EMSCRIPTEN_KEEPALIVE
double _fnrst(double a, double b) { return round(b); }
EMSCRIPTEN_KEEPALIVE
double _fsqrt(double a, double b) { return sqrt(b); }
EMSCRIPTEN_KEEPALIVE
double _fadd(double a, double b) { return a + b; }
EMSCRIPTEN_KEEPALIVE
double _fsub(double a, double b) { return a - b; }
EMSCRIPTEN_KEEPALIVE
double _fmul(double a, double b) { return a * b; }
EMSCRIPTEN_KEEPALIVE
double _fdiv(double a, double b) { return a / b; }
EMSCRIPTEN_KEEPALIVE
double _fmin(double a, double b) { return fmin(a,b); }
EMSCRIPTEN_KEEPALIVE
double _fmax(double a, double b) { return fmax(a,b); }
EMSCRIPTEN_KEEPALIVE
double _fcpysgn(double a, double b) { return copysign(a,b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _feq(double a, double b) { return a == b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _fne(double a, double b) {
  return isunordered(a,b) ? 1 : islessgreater(a,b);
}
EMSCRIPTEN_KEEPALIVE
uint64_t _flt(double a, double b) { return isless(a,b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _fgt(double a, double b) { return isgreater(a,b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _fle(double a, double b) { return islessequal(a,b); }
EMSCRIPTEN_KEEPALIVE
uint64_t _fge(double a, double b) { return isgreaterequal(a,b); }
EMSCRIPTEN_KEEPALIVE
int64_t _ftos(double a, double b) { return (int64_t) b; }
EMSCRIPTEN_KEEPALIVE
uint64_t _ftou(double a, double b) { return (uint64_t) b; }
EMSCRIPTEN_KEEPALIVE
double _stof(int64_t a, int64_t b) { return (double) b; }
EMSCRIPTEN_KEEPALIVE
double _utof(uint64_t a, uint64_t b) { return (double) b; }

//static uint64_t powi(uint64_t fst, uint64_t snd) {
//  uint64_t res;
//
//  for (res = 1; snd; snd >>= 1, fst *= fst) {
//    if (snd & 1)
//      res *= fst;
//  }
//  return res;
//}

static uint64_t alloc_node(Net *net) {
  uint64_t addr;
  if (net->freed) {
    addr = net->freed - 1;
    net->freed = net->nodes[addr];
  } else {
    addr = net->nodes_len;
    net->nodes_len += 4;
  }
  return addr;
}

static void free_node(Net *net, uint64_t addr) {
  net->nodes[addr] = net->freed;
  net->freed = addr + 1;
}

static void queue(Net *net, uint64_t addr) {
  net->redex[net->redex_len++] = addr;
  assert(addr % 4 == 0);
}

static void rewrite(Net *net, uint64_t a_addr) {
  uint64_t *nodes = net->nodes;
  union {
    uint64_t u;
    int64_t  s;
    double f;
  } res, fst, snd;
  uint64_t b_addr, c_addr, d_addr;
  uint64_t *a, *b, *c, *d;
  int a_info, a_kind, b_info, b_kind;

  a = &nodes[a_addr];
  a_info = a[3];
  a_kind = a_info >> 6 & 3;

  switch (a_info & 3) {
  case NUM:
    fst.u = a[0];
    switch (a_kind) {
    case OP1:
      snd.u = a[1];
    switch (a[3] >> 8) {
      case EQ:      res.u = _eq(fst.u,snd.u); break;
      case NE:      res.u = _ne(fst.u,snd.u); break;
      case LT_S:    res.s = _lt_s(fst.s,snd.s); break;
      case LT_U:    res.u = _lt_u(fst.u,snd.u); break;
      case GT_S:    res.s = _gt_s(fst.s,snd.s); break;
      case GT_U:    res.u = _gt_u(fst.u,snd.u); break;
      case LE_S:    res.u = _le_s(fst.s,snd.s); break;
      case LE_U:    res.u = _le_u(fst.u,snd.u); break;
      case GE_S:    res.u = _ge_s(fst.u,snd.u); break;
      case GE_U:    res.u = _ge_u(fst.u,snd.u); break;
      case CLZ:     res.u = _clz(fst.u,snd.u); break;
      case CTZ:     res.u = _ctz(fst.u,snd.u); break;
      case POPCNT:  res.u = _popcnt(fst.u,snd.u); break;
      case SHL:     res.u = _shl(fst.u,snd.u); break;
      case SHR:     res.u = _shr(fst.u,snd.u); break;
      case SHR_S:   res.s = _shr_s(fst.s,snd.u); break;
      case ROTL:    res.u = _rotl(fst.u,snd.u); break;
      case ROTR:    res.u = _rotr(fst.u,snd.u); break;
      case AND:     res.u = _and(fst.u,snd.u); break;
      case  OR:     res.u = _or(fst.u,snd.u); break;
      case XOR:     res.u = _xor(fst.u,snd.u); break;
      case ADD:     res.u = _add(fst.u,snd.u); break;
      case SUB:     res.u = _sub(fst.u,snd.u); break;
      case MUL:     res.u = _mul(fst.u,snd.u); break;
      case DIV_S:   res.s = _div_s(fst.s,snd.s); break;
      case DIV_U:   res.u = _div_u(fst.u,snd.u); break;
      case REM_S:   res.s = _rem_s(fst.s,snd.s); break;
      case REM_U:   res.u = _rem_u(fst.u,snd.u); break;
      case FABS:    res.f = _fabs(fst.f,snd.f); break;
      case FNEG:    res.f = _fneg(fst.f,snd.f); break;
      case FCEIL:   res.f = _fceil(fst.f,snd.f); break;
      case FFLOOR:  res.f = _ffloor(fst.f,snd.f); break;
      case FTRUNC:  res.f = _ftrunc(fst.f,snd.f); break;
      case FNRST:   res.f = _fnrst(fst.f,snd.f); break;
      case FSQRT:   res.f = _fsqrt(fst.f,snd.f); break;
      case FADD:    res.f = _fadd(fst.f,snd.f); break;
      case FSUB:    res.f = _fsub(fst.f,snd.f); break;
      case FMUL:    res.f = _fmul(fst.f,snd.f); break;
      case FDIV:    res.f = _fdiv(fst.f,snd.f); break;
      case FMIN:    res.f = _fmin(fst.f, snd.f); break;
      case FMAX:    res.f = _fmax(fst.f, snd.f); break;
      case FCPYSGN: res.f = _fcpysgn(fst.f, snd.f); break;
      case FEQ:     res.u = _fne(fst.f,snd.f); break;
      case FNE:     res.u = _fne(fst.f,snd.f); break;
      case FLT:     res.u = _flt(fst.f,snd.f); break;
      case FGT:     res.u = _fgt(fst.f,snd.f); break;
      case FLE:     res.u = _fle(fst.f,snd.f); break;
      case FGE:     res.u = _fge(fst.f,snd.f); break;
      //case EXT32_S:
      case FTOS:   res.s = _ftos(fst.f,snd.f); break;
      case FTOU:   res.u = _ftou(fst.f,snd.f); break;
      case STOF:   res.f = _stof(fst.s,snd.s); break;
      case UTOF:   res.f = _utof(fst.u,snd.u); break;
      /* unreachable */
      default: res.u = 0; break;
      }
      if ((a[3] >> 4 & 3) == PTR) {
        nodes[a[2]] = res.u;
        nodes[a[2] | 3] |= NUM << (a[2] & 3) * 2;
        if ((a[2] & 3) == 0)
          queue(net, a[2]);
      }
      free_node(net, a_addr);
      break;
    case OP2:
      a[0] = a[1];
      a[1] = fst.u;
      a[3] = OP1 << 6 | NUM << 2 | (a[3] >> 2 & 3) |
             (a[3] & ~(3 << 6 | 3 << 0 | 3 << 2));
      if ((a[3] & 3) == PTR)
        nodes[a[0]] = a_addr;
      if ((a[3] & 3) != PTR || (a[0] & 3) == 0)
        queue(net, a_addr);
      break;
    case NOD:
      if ((a[3] >> 2 & 3) == PTR) {
        nodes[a[1]] = fst.u;
        nodes[a[1] | 3] |= NUM << (a[1] & 3) * 2;
        if ((a[1] & 3) == 0)
          queue(net, a[1]);
      }
      if ((a[3] >> 4 & 3) == PTR) {
        nodes[a[2]] = fst.u;
        nodes[a[2] | 3] |= NUM << (a[2] & 3) * 2;
        if ((a[2] & 3) == 0)
          queue(net, a[2]);
      }
      free_node(net, a_addr);
      break;
    case ITE:
      assert((a[3] >> 2 & 3) == PTR);
      a[0] = a[1];
      a[3] = NOD << 6 | (a[3] >> 2 & 3) | (a[3] & ~0xff);
      nodes[a[0]] &= ~3;
      if (fst.u) {
        a[1] = a[2];
        a[3] |= (a_info >> 2 & 3 << 2) | ERA << 4;
        nodes[a[1]] ^= 3;
      } else {
        a[3] |= (a_info & 3 << 4) | ERA << 2;
      }
      if ((a[0] & 3) == 0)
        queue(net, a_addr);
      break;
    }
    break;
  case PTR:
    b_addr = a[0];
    assert(a_addr != b_addr);
    b = &nodes[b_addr];
    b_info = b[3];
    b_kind = b_info >> 6 & 3;
    if (a_kind == b_kind && (a_kind != NOD || a[3] >> 8 == b[3] >> 8)) {
      /* annihilation */
      if ((a[3] >> 2 & 3) == PTR) {
        nodes[a[1]] = b[1];
        nodes[a[1] | 3] |= (b[3] >> 2 & 3) << (a[1] & 3) * 2;
        if ((a[1] & 3) == 0 && ((b[3] >> 2 & 3) != PTR || (b[1] & 3) == 0))
          queue(net, a[1]);
      }
      if ((b[3] >> 2 & 3) == PTR) {
        nodes[b[1]] = a[1];
        nodes[b[1] | 3] |= (a[3] >> 2 & 3) << (b[1] & 3) * 2;
        if ((b[1] & 3) == 0 && (a[3] >> 2 & 3) != PTR)
          queue(net, b[1]);
      }
      if ((a[3] >> 4 & 3) == PTR) {
        nodes[a[2]] = b[2];
        nodes[a[2] | 3] |= (b[3] >> 4 & 3) << (a[2] & 3) * 2;
        if ((a[2] & 3) == 0 && ((b[3] >> 4 & 3) != PTR || (b[2] & 3) == 0))
          queue(net, a[2]);
      }
      if ((b[3] >> 4 & 3) == PTR) {
        nodes[b[2]] = a[2];
        nodes[b[2] | 3] |= (a[3] >> 4 & 3) << (b[2] & 3) * 2;
        if ((b[2] & 3) == 0 && (a[3] >> 4 & 3) != PTR)
          queue(net, b[2]);
      }
      free_node(net, a_addr);
      free_node(net, b_addr);
    } else if (a_kind == NOD && b_kind != OP1) {
      /* nodes/binary duplication */
      c_addr = alloc_node(net);
      d_addr = alloc_node(net);
      c = &nodes[c_addr];
      d = &nodes[d_addr];
      a[0] = b[1];
      a[3] = (a_info & ~0x3f) | (b_info >> 2 & 3);
      if ((a[3] & 3) == PTR)
        nodes[a[0]] = a_addr;
      if ((a[3] & 3) != PTR || (a[0] & 3) == 0)
        queue(net, a_addr);
      b[0] = a[2];
      b[3] = (b_info & ~0x3f) | (a_info >> 4 & 3);
      if ((b[3] & 3) == PTR)
        nodes[b[0]] = b_addr;
      if ((b[3] & 3) != PTR || (b[0] & 3) == 0)
        queue(net, b_addr);
      c[0] = b[2];
      c[3] = (a_info & ~0x3f) | (b_info >> 4 & 3);
      if ((c[3] & 3) == PTR)
        nodes[c[0]] = c_addr;
      if ((c[3] & 3) != PTR || (c[0] & 3) == 0)
        queue(net, c_addr);
      d[0] = a[1];
      d[3] = (b_info & ~0x3f) | (a_info >> 2 & 3);
      if ((d[3] & 3) == PTR)
        nodes[d[0]] = d_addr;
      if ((d[3] & 3) != PTR || (d[0] & 3) == 0)
        queue(net, d_addr);
      a[1] = d_addr | 1;
      b[1] = a_addr | 2;
      c[1] = d_addr | 2;
      d[1] = a_addr | 1;
      a[2] = b_addr | 1;
      b[2] = c_addr | 2;
      c[2] = b_addr | 2;
      d[2] = c_addr | 1;
    } else if (a_kind != OP2 && b_kind == OP1) {
      /* unary duplication */
      c_addr = alloc_node(net);
      c = &nodes[c_addr];
      a[0] = b[2];
      a[3] = (a_info & ~0x3f) | (b_info >> 4 & 3);
      if ((a[3] & 3) == PTR)
        nodes[a[0]] = a_addr;
      if ((a[3] & 3) != PTR || (a[0] & 3) == 0)
        queue(net, a_addr);
      b[0] = a[1];
      b[3] = (b_info & ~0x33) | (a_info >> 2 & 3);
      if ((b[3] & 3) == PTR)
        nodes[b[0]] = b_addr;
      if ((b[3] & 3) != PTR || (b[0] & 3) == 0)
        queue(net, b_addr);
      c[0] = a[2];
      c[3] = (b_info & ~0x33) | (a_info >> 4 & 3);
      if ((c[3] & 3) == PTR)
        nodes[c[0]] = c_addr;
      if ((c[3] & 3) != PTR || (c[0] & 3) == 0)
        queue(net, c_addr);
      a[1] = b_addr | 2;
      /* b[1] already set */
      c[1] = b[1];
      a[2] = c_addr | 2;
      b[2] = a_addr | 1;
      c[2] = a_addr | 2;
    } else if (b_kind == NOD) {
      /* permutations */
      rewrite(net, b_addr);
    }
    break;
  case ERA:
    if ((a[3] >> 2 & 3) == PTR) {
      nodes[a[1] | 3] |= ERA << (a[1] & 3) * 2;
      if ((a[1] & 3) == 0)
        queue(net, a[1]);
    }
    if ((a[3] >> 4 & 3) == PTR) {
      nodes[a[2] | 3] |= ERA << (a[2] & 3) * 2;
      if ((a[2] & 3) == 0)
        queue(net, a[2]);
    }
    free_node(net, a_addr);
    break;
  }
}

// Rewrites active pairs until none is left, reducing the graph to normal form
// This could be performed in parallel. Unreachable data is freed automatically.
Stats net_reduce_strict(Net *net) {
  Stats stats;
  stats.rewrites = 0;
  stats.loops = 0;
  while (net->redex_len > 0) {
    for (size_t i = 0, l = net->redex_len; i < l; ++i) {
      rewrite(net, net->redex[--net->redex_len]);
      ++stats.rewrites;
    }
    ++stats.loops;
  }
  return stats;
}

void net_find_redexes(Net *net) {
  size_t i;

  for (i = 0; i < net->nodes_len; i += 4) {
    if (net->nodes[i | 3] & 1 ||
        ((net->nodes[i] & 3) == 0 && net->nodes[i] >= i))
      queue(net, i);
  }
}
