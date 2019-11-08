'use strict';
const fs = require('fs');
const ops = require('./ops');

// Comparison
const EQ     = 0
const NE     = 1
const LT_S   = 2
const LT_U   = 3
const GT_S   = 4
const GT_U   = 5
const LE_S   = 6
const LE_U   = 7
const GE_S   = 8
const GE_U   = 9

// Bitwise
const CLZ    = 10
const CTZ    = 11
const POPCNT = 12

const SHL    = 13
const SHR    = 14
const SHR_S  = 15
const ROTL   = 16
const ROTR   = 17

const AND    = 18
const OR     = 19
const XOR    = 20

// Arithmetic
const ADD    = 21
const SUB    = 22
const MUL    = 23
const DIV_S  = 24
const DIV_U  = 25
const REM_S  = 26
const REM_U  = 27

// Floating point
const FABS    = 28
const FNEG    = 29
const FCEIL   = 30
const FFLOOR  = 31
const FTRUNC  = 32
const FNRST   = 33
const FSQRT   = 34
const FADD    = 35
const FSUB    = 36
const FMUL    = 37
const FDIV    = 38
const FMIN    = 39
const FMAX    = 40
const FCPYSGN = 41

const FEQ = 42
const FNE = 43
const FLT = 44
const FGT = 45
const FLE = 46
const FGE = 47

// Conversion
const EXT32_S = 48
const FTOS  = 49  // These two conversions can trap if the float
const FTOU  = 50  // doesn't correspond to an i64, like if it's NaN or Infinity
const STOF  = 51
const UTOF  = 52

// [ port0 : 64, port1 : 64, port2 : 64
// , label : 32, node type : 8
// , port0_type : 8, port1 type : 8, port2 type : 8].

function from_f64(f) {
  var x  = new Float64Array(1)
  x[0] = f
  var y = new Uint32Array(x.buffer)
  y[0] = y[0] >>> 0
  y[1] = y[1] >>> 0
  return y
  }

function to_f64(u) {
  var x  = new Uint32Array(2)
  x[0] = u[0] >>> 0
  x[1] = u[1] >>> 0
  var y = new Float64Array(x.buffer)
  return (y[0])
  }

function b32(n) {
  return (n >>> 0).toString(2).padStart(32, '0');
}

function showFloatBits(f) {
  var x  = new Float64Array(1)
  x[0] = f
  var y = new Uint32Array(x.buffer)
  return (b32(y[0]) + b32(y[1]))
  }

function from_s32(x) {
  if (x <= 0)
    return [x, ~0]
  else
    return [x, 0]
}

// apply : {fn : i32, x : [i32, i32], y : [i32, i32]} -> [i32, i32]
function apply(fn, x, y) {
  ops.store(x[0],x[1],y[0],y[1]);
  //console.log("store: " + mem);
  var res = [];
  switch (fn) {
    case EQ:      ops.eq();        break;
    case NE:      ops.ne();        break;
    case LT_S:    ops.lt_s();      break;
    case LT_U:    ops.lt_u();      break;
    case GT_S:    ops.gt_s();      break;
    case GT_U:    ops.gt_u();      break;
    case LE_S:    ops.le_s();      break;
    case LE_U:    ops.le_u();      break;
    case GE_S:    ops.ge_s();      break;
    case GE_U:    ops.ge_u();      break;
    case CLZ:     ops.clz();       break;
    case CTZ:     ops.ctz();       break;
    case POPCNT:  ops.popcnt();    break;
    case SHL:     ops.shl();       break;
    case SHR:     ops.shr();       break;
    case SHR_S:   ops.shr_s();     break;
    case ROTL:    ops.rotl();      break;
    case ROTR:    ops.rotr();      break;
    case AND:     ops.and();       break;
    case OR:      ops.or();        break;
    case XOR:     ops.xor();       break;
    case ADD:     ops.add();       break;
    case SUB:     ops.sub();       break;
    case MUL:     ops.mul();       break;
    case DIV_S:   ops.div_s();     break;
    case DIV_U:   ops.div_u();     break;
    case REM_S:   ops.rem_s();     break;
    case REM_U:   ops.rem_u();     break;
    case FABS:    ops.fabs();      break;
    case FNEG:    ops.fneg();      break;
    case FCEIL:   ops.fceil();     break;
    case FFLOOR:  ops.ffloor();    break;
    case FNRST:   ops.fnearest();  break;
    case FSQRT:   ops.fsqrt();     break;
    case FADD:    ops.fadd();      break;
    case FSUB:    ops.fsub();      break;
    case FMUL:    ops.fmul();      break;
    case FDIV:    ops.fdiv();      break;
    case FMIN:    ops.fmin();      break;
    case FMAX:    ops.fmax();      break;
    case FCPYSGN: ops.fcopysign(); break;
    case FEQ:     ops.feq();       break;
    case FNE:     ops.fne();       break;
    case FLT:     ops.flt();       break;
    case FGT:     ops.fgt();       break;
    case FLE:     ops.fle();       break;
    case FGE:     ops.fge();       break;
    case EXT32_S: ops.ext32_s();   break;
    case FTOS:    ops.ftos();      break;
    case FTOU:    ops.ftou();      break;
    case STOF:    ops.stof();      break;
    case UTOF:    ops.utof();      break;
    default: throw "[ERROR]\nInvalid OP1 function.";
  }
  res[0] = ops.load0();
  res[1] = ops.load1();
  //console.log("result: " + mem);
  ops.mem_clear();
  return (res);
  }

function check_tests() {
  function is(x,y) {
    return (x[0] >>> 0 == y[0] >>> 0) && (x[1] >>> 0 == y[1] >>> 0)
  };

  const tests =
  [ is(apply(EQ,[0,0],[0,0]), [1,0])
  , is(apply(EQ,[1,0],[1,0]), [1,0])
  , is(apply(EQ,[1,0],[0,1]), [0,0])
  , is(apply(NE,[0,0],[0,0]), [0,0])
  , is(apply(NE,[1,0],[1,0]), [0,0])
  , is(apply(NE,[1,0],[0,1]), [1,0])
  , is(apply(LT_S, from_s32(0), from_s32(1)), [1,0])
  , is(apply(LT_S, from_s32(-1), from_s32(1)), [1,0])
  , is(apply(LT_S, from_s32(-2), from_s32(-2)), [0,0])
  , is(apply(LT_S, from_s32(-2), from_s32(-1)), [1,0])
  , is(apply(LT_S, from_s32(-1), from_s32(-2)), [0,0])
  , is(apply(LT_S, from_s32(1), from_s32(0)), [0,0])
  , is(apply(LT_U, [1,0], [2,0]), [1,0])
  , is(apply(LT_U, [2,0], [0,0]), [0,0])
  , is(apply(GT_S, from_s32(0), from_s32(1)), [0,0])
  , is(apply(GT_S, from_s32(-1), from_s32(1)), [0,0])
  , is(apply(GT_S, from_s32(-2), from_s32(-1)), [0,0])
  , is(apply(GT_S, from_s32(-2), from_s32(-2)), [0,0])
  , is(apply(GT_S, from_s32(-1), from_s32(-2)), [1,0])
  , is(apply(GT_S, from_s32(1), from_s32(0)), [1,0])
  , is(apply(GT_U, [2,0], [1,0]), [1,0])
  , is(apply(GT_U, [0,0], [1,0]), [0,0])
  , is(apply(LE_S, from_s32(0), from_s32(1)), [1,0])
  , is(apply(LE_S, from_s32(-1), from_s32(1)), [1,0])
  , is(apply(LE_S, from_s32(-2), from_s32(-1)), [1,0])
  , is(apply(LE_S, from_s32(-2), from_s32(-2)), [1,0])
  , is(apply(LE_S, from_s32(-1), from_s32(-2)), [0,0])
  , is(apply(LE_S, from_s32(1), from_s32(0)), [0,0])
  , is(apply(LE_S, from_s32(1), from_s32(0)), [0,0])
  , is(apply(LE_U, [2,0], [1,0]), [0,0])
  , is(apply(LE_U, [0,0], [1,0]), [1,0])
  , is(apply(GE_S, from_s32(0), from_s32(1)), [0,0])
  , is(apply(GE_S, from_s32(-1), from_s32(1)), [0,0])
  , is(apply(GE_S, from_s32(-2), from_s32(-2)), [1,0])
  , is(apply(GE_S, from_s32(-2), from_s32(-1)), [0,0])
  , is(apply(GE_S, from_s32(-1), from_s32(-2)), [1,0])
  , is(apply(GE_S, from_s32(1), from_s32(0)), [1,0])
  , is(apply(GE_U, [2,0], [1,0]), [1,0])
  , is(apply(GE_U, [0,0], [1,0]), [0,0])
  , is(apply(CLZ, [0,0], [0,0]), [64,0])
  , is(apply(CLZ, [0,0], [4,0]), [61,0])
  , is(apply(CTZ, [0,0], [0,0]), [64,0])
  , is(apply(CTZ, [0,0], [4,0]), [2,0])
  , is(apply(POPCNT, [0,0], [5,0]), [2,0])
  , is(apply(SHL, [4,0], [1,0]), [8,0])
  , is(apply(SHR, [4,0], [1,0]), [2,0])
  , is(apply(SHR_S, [4,0], [1,0]), [2,0])
  , is(apply(SHR_S, from_s32(-256), [1,0]), [-128, -1])
  , is(apply(ROTL, [256,0], [1,0]), [512, 0])
  , is(apply(ROTR, [256,0], [1,0]), [128, 0])
  , is(apply(ROTR, [256,0], [1,0]), [128, 0])
  , is(apply(AND, [1,0], [1,0]), [1,0])
  , is(apply(OR, [1,0], [1,0]), [1,0])
  , is(apply(XOR, [1,0], [1,0]), [0,0])
  , is(apply(ADD, [1,1], [0xFFFFFFFF,1]), [0,3])
  , is(apply(SUB, [0,3], [0xFFFFFFFF,1]), [1,1])
  , is(apply(DIV_U, [0,1], [65536,0]), [65536,0])
  , is(apply(DIV_S, from_s32(-65536), from_s32(-256)), [256,0])
  , is(apply(REM_U, [25,1], [65536,0]), [25,0])
  , is(apply(REM_S, from_s32(-65537), from_s32(-256)), from_s32(-1))
  , is(apply(FABS, [0,0], from_f64(-100)), from_f64(100))
  , is(apply(FNEG, [0,0], from_f64(-1)), from_f64(1))
  , is(apply(FNEG, [0,0], from_f64(1)), from_f64(-1))
  , is(to_f64(from_f64(-1)), to_f64(from_f64(-1)))
  , is(apply(FCEIL, [0,0], from_f64(100.1)), from_f64(101))
  , is(apply(FFLOOR, [0,0], from_f64(100.9)), from_f64(100))
  , is(apply(FNRST, [0,0], from_f64(100.6)), from_f64(101))
  , is(apply(FSQRT, [0,0], from_f64(100)), from_f64(10))
  , is(apply(FADD, from_f64(100.1), from_f64(100.5)), from_f64(200.6))
  , is(apply(FSUB, from_f64(200.6), from_f64(100.1)), from_f64(100.5))
  , is(apply(FMUL, from_f64(200.6), from_f64(2)), from_f64(401.2))
  , is(apply(FDIV, from_f64(401.2), from_f64(2)), from_f64(200.6))
  , is(apply(FMIN, from_f64(100.1), from_f64(100.5)), from_f64(100.1))
  , is(apply(FMAX, from_f64(100.1), from_f64(100.5)), from_f64(100.5))
  , is(apply(FCPYSGN, from_f64(-100.1), from_f64(100.5)), from_f64(100.1))
  , is(apply(FEQ, from_f64(100.1), from_f64(100.1)), [1,0])
  , is(apply(FNE, from_f64(100.1), from_f64(100.0)), [1,0])
  , is(apply(FLT, from_f64(100.1), from_f64(100.0)), [0,0])
  , is(apply(FGT, from_f64(100.1), from_f64(100.0)), [1,0])
  , is(apply(FLE, from_f64(100.1), from_f64(100.1)), [1,0])
  , is(apply(FGE, from_f64(100.1), from_f64(100.1)), [1,0])
  , is(apply(EXT32_S, [0,0], [1,0] ), [1,0])
  , is(apply(EXT32_S, [0,0], [-1,0] ), [-1,-1])
  , is(apply(FTOS, [0,0], from_f64(-1)), [-1,-1])
  , is(apply(FTOU, [0,0], from_f64(1)), [1,0])
  , is(apply(STOF, [0,0], [-1,-1]), from_f64(-1))
  , is(apply(UTOF, [0,0], [1,0]), from_f64(1))
  ];

  let bad = tests.indexOf(false)
  if (tests.reduce((x,y) => x && y,true))
    console.log('\x1b[32m%s\x1b[0m', "TESTING: All tests pass");
  else
    console.error('\x1b[31m%s\x1b[0m',"TESTING: Test #" + bad + " failed")
}
check_tests();
