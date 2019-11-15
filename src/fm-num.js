'use strict';
const ops = require('./ops');
const fmn = require('./fm-net-c')

// i64 Comparison
const EQ     = 0  // equality
const NE     = 1  // not-equal
const LT_S   = 2  // signed less-than
const LT_U   = 3  // unsigned less-than
const GT_S   = 4  // signed greater-than
const GT_U   = 5  // unsigned greater-than
const LE_S   = 6  // signed less-than-or-equal
const LE_U   = 7  // unsigned less-than-or-equal
const GE_S   = 8  // signed greater-than-or-equal
const GE_U   = 9  // unsigned greater-than-or-equal

// Bit counting
const CLZ    = 10 // count leading zeros, unary
const CTZ    = 11 // count trailing zeros, unary
const POPCNT = 12 // count number of 1 bits, unary

// Bit shifting
const SHL    = 13 // shift left
const SHR    = 14 // unsigned shift right
const SHR_S  = 15 // signed shift right
const ROTL   = 16 // rotate left
const ROTR   = 17 // rotate right

// Bitwise logic
const AND    = 18 // bitwise and
const OR     = 19 // bitwise or
const XOR    = 20 // bitwise xor

// i64 Arithmetic
const ADD    = 21 // addition
const SUB    = 22 // subtraction
const MUL    = 23 // multiplication
const DIV_S  = 24 // signed division
const DIV_U  = 25 // unsigned division
const REM_S  = 26 // signed remainder
const REM_U  = 27 // unsigned remainder

// Floating point
const FABS    = 28 // absolute value, unary
const FNEG    = 29 // negation, unary
const FCEIL   = 30 // round upward, unary
const FFLOOR  = 31 // round downward, unary
const FTRUNC  = 32 // truncate, unary
const FNRST   = 33 // round to nearest, unary
const FSQRT   = 34 // square-root, unary
const FADD    = 35 // addition
const FSUB    = 36 // subtraction
const FMUL    = 37 // multiplication
const FDIV    = 38 // division
const FMIN    = 39 // minimum
const FMAX    = 40 // maximum
const FCPYSGN = 41 // copy sign value of first arg and sign of second arg

// Floating point comparison, returns i64 0 or 1
const FEQ     = 42 // equality
const FNE     = 43 // not-equal
const FLT     = 44 // less-than
const FGT     = 45 // greater-than
const FLE     = 46 // less-than-or-equal
const FGE     = 47 // greater-than-or-equal

// Conversion
// FTOS and FTOU trap on f64s that don't map to i64s, e.g. NaN or Infinity
const EXT32_S = 48 // signed extension of 32 bit numbers to 64 bit
const FTOS    = 49 // f64 to signed i64
const FTOU    = 50 // f64 to unsigned i64
const STOF    = 51 // signed i64 to f64
const UTOF    = 52 // unsigned i64 to f64

// u32Pair from f64
function from_f64(f) {
  var x  = new Float64Array(1)
  x[0] = f
  var y = new Uint32Array(x.buffer)
  y[0] = y[0]
  y[1] = y[1]
  return y
  }

// u32Pair to f64
function to_f64(u) {
  var x  = new Uint32Array(2)
  x[0] = u[0]
  x[1] = u[1]
  var y = new Float64Array(x.buffer)
  return (y[0])
  }

// show 32 bits of a number
function b32(n) {
  return (n >>> 0).toString(2).padStart(32, '0');
}

// show 32 bits of an f64
function showFloatBits(f) {
  var x  = new Float64Array(1)
  x[0] = f
  var y = new Uint32Array(x.buffer)
  return (b32(y[0]) + b32(y[1]))
  }

// make u32 pair from a signed integer
function from_s32(x) {
  if (x <= 0)
    return [x >>> 0, ~0 >>> 0]
  else
    return [x >>> 0, 0 >>> 0]
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

function check_fmn() {
  function is(f,a,b,y) {
    let x0 = f(a[0],a[1],b[0],b[1])
    let x1 = global.tempRet0;
    global.tempRet0 = 0
//    console.log("x0: " + x0);
//    console.log("x1: " + x1);
    return (x0 >>> 0 == y[0] >>> 0) && (x1 >>> 0 == y[1]);
  };
  function isf(f,a,b,y) {
    return (f(a,b) == y)
  };

  function isc(f,a,b,y) {
    let x0 = f(a,b)
    let x1 = global.tempRet0;
    global.tempRet0 = 0
    return (x0 >>> 0 == y[0] >>> 0) && (x1 >>> 0 == y[1] >>> 0);
  }

  function isc2(f,a,b,y) {
    return (f(a[0],a[1],b[0],b[1]) == y)
  }

  const tests =
  [ is(fmn.__rotl,[5,6],[32,0],[6,5])
  , is(fmn.__eq,[0,0],[0,0], [1,0])
  , is(fmn.__eq,[1,0],[1,0], [1,0])
  , is(fmn.__eq,[1,0],[0,1], [0,0])
  , is(fmn.__ne,[0,0],[1,0], [1,0])
  , is(fmn.__ne,[0,0],[0,0], [0,0])
  , is(fmn.__ne,[1,0],[1,0], [0,0])
  , is(fmn.__ne,[1,0],[0,1], [1,0])
  , is(fmn.__lt_s, from_s32(0), from_s32(1), [1,0])
  , is(fmn.__lt_s, from_s32(-1), from_s32(1), [1,0])
  , is(fmn.__lt_s, from_s32(-2), from_s32(-2), [0,0])
  , is(fmn.__lt_s, from_s32(-2), from_s32(-1), [1,0])
  , is(fmn.__lt_s, from_s32(-1), from_s32(-2), [0,0])
  , is(fmn.__lt_s, from_s32(1), from_s32(0), [0,0])
  , is(fmn.__lt_u, [1,0], [2,0], [1,0])
  , is(fmn.__lt_u, [2,0], [0,0], [0,0])
  , is(fmn.__gt_s, from_s32(0), from_s32(1), [0,0])
  , is(fmn.__gt_s, from_s32(-1), from_s32(1), [0,0])
  , is(fmn.__gt_s, from_s32(-2), from_s32(-1), [0,0])
  , is(fmn.__gt_s, from_s32(-2), from_s32(-2), [0,0])
  , is(fmn.__gt_s, from_s32(-1), from_s32(-2), [1,0])
  , is(fmn.__gt_s, from_s32(1), from_s32(0), [1,0])
  , is(fmn.__gt_u, [2,0], [1,0], [1,0])
  , is(fmn.__gt_u, [0,0], [1,0], [0,0])
  , is(fmn.__le_s, from_s32(0), from_s32(1), [1,0])
  , is(fmn.__le_s, from_s32(-1), from_s32(1), [1,0])
  , is(fmn.__le_s, from_s32(-2), from_s32(-1), [1,0])
  , is(fmn.__le_s, from_s32(-2), from_s32(-2), [1,0])
  , is(fmn.__le_s, from_s32(-1), from_s32(-2), [0,0])
  , is(fmn.__le_s, from_s32(1), from_s32(0), [0,0])
  , is(fmn.__le_s, from_s32(1), from_s32(0), [0,0])
  , is(fmn.__le_u, [2,0], [1,0], [0,0])
  , is(fmn.__le_u, [0,0], [1,0], [1,0])
  , is(fmn.__ge_s, from_s32(0), from_s32(1), [0,0])
  , is(fmn.__ge_s, from_s32(-1), from_s32(1), [0,0])
  , is(fmn.__ge_s, from_s32(-2), from_s32(-2), [1,0])
  , is(fmn.__ge_s, from_s32(-2), from_s32(-1), [0,0])
  , is(fmn.__ge_s, from_s32(-1), from_s32(-2), [1,0])
  , is(fmn.__ge_s, from_s32(1), from_s32(0), [1,0])
  , is(fmn.__ge_u, [2,0], [1,0], [1,0])
  , is(fmn.__ge_u, [0,0], [1,0], [0,0])
  , is(fmn.__clz, [0,0], [0,0], [64,0])
  , is(fmn.__clz, [0,0], [4,0], [61,0])
  , is(fmn.__ctz, [0,0], [0,0], [64,0])
  , is(fmn.__ctz, [0,0], [0,1], [32,0])
  , is(fmn.__ctz, [0,0], [4,0], [2,0])
  , is(fmn.__popcnt, [0,0], [5,0], [2,0])
  , is(fmn.__shl, [4,0], [1,0], [8,0])
  , is(fmn.__shr, [4,0], [1,0], [2,0])
  , is(fmn.__shr_s, [4,0], [1,0], [2,0])
  , is(fmn.__shr_s, from_s32(-256), [1,0], [-128 >>> 0, -1 >>> 0])
  , is(fmn.__rotl, [256,0], [1,0], [512, 0])
  , is(fmn.__rotr, [256,0], [1,0], [128, 0])
  , is(fmn.__rotr, [256,0], [1,0], [128, 0])
  , is(fmn.__and, [1,0], [1,0], [1,0])
  , is(fmn.__or, [1,0], [1,0], [1,0])
  , is(fmn.__xor, [1,0], [1,0], [0,0])
  , is(fmn.__add, [1,1], [0xFFFFFFFF,1], [0,3])
  , is(fmn.__sub, [0,3], [0xFFFFFFFF,1], [1,1])
  , is(fmn.__div_u, [0,1], [65536,0], [65536,0])
  , is(fmn.__div_s, from_s32(-65536), from_s32(-256), [256,0])
  , is(fmn.__rem_u, [25,1], [65536,0], [25,0])
  , is(fmn.__rem_s, from_s32(-65537), from_s32(-256), from_s32(-1))
  , isf(fmn.__fabs, 0, -100, 100)
  , isf(fmn.__fneg, 0, -1, 1)
  , isf(fmn.__fneg, 0, 1, -1)
  , isf(fmn.__fceil, 0, 100.1, 101)
  , isf(fmn.__ffloor, 0, 100.9, 100)
  , isf(fmn.__fnrst, 0, 100.6, 101)
  , isf(fmn.__fsqrt, 0, 100, 10)
  , isf(fmn.__fadd, 100.1, 100.5, 200.6)
  , isf(fmn.__fsub, 200.6, 100.1, 100.5)
  , isf(fmn.__fmul, 200.6, 2, 401.2)
  , isf(fmn.__fdiv, 401.2, 2, 200.6)
  , isf(fmn.__fmin, 100.1, 100.5, 100.1)
  , isf(fmn.__fmax, 100.1, 100.5, 100.5)
  , isf(fmn.__fcpysgn, -100.1, 100.5, 100.1)
  , isf(fmn.__feq, 100.1, 100.1, 1)
  , isf(fmn.__fne, 100.1, 100.0, 1)
  , isf(fmn.__fne, NaN, NaN, 1)
  , isf(fmn.__fne, NaN, 1, 1)
  , isf(fmn.__fne, 1, 1, 0)
  , isf(fmn.__flt, 100.1, 100.0, 0)
  , isf(fmn.__fgt, 100.1, 100.0, 1)
  , isf(fmn.__fle, 100.1, 100.1, 1)
  , isf(fmn.__fge, 100.1, 100.1, 1)
  , isc(fmn.__ftos, 0, -1, [-1,-1])
  , isc(fmn.__ftou, 0, 1, [1,0])
  , isc2(fmn.__stof, [0,0], [-1,-1], -1)
  , isc2(fmn.__utof, [0,0], [1,0], 1)
  ];

  let bad = tests.indexOf(false)
  if (tests.reduce((x,y) => x && y,true))
    console.log('\x1b[32m%s\x1b[0m', "FM-NET-C TESTING: All tests pass");
  else
    console.error('\x1b[31m%s\x1b[0m',"FM-NET-C TESTING: Test #" + bad + " failed")
}

check_fmn();
