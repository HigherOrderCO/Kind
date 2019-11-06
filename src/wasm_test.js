'use strict';
const fs = require('fs');
const ops_bytes = fs.readFileSync('./ops.wasm');

// [ port0 : 64, port1 : 64, port2 : 64
// , label : 32, node type : 8
// , port0_type : 8, port1 type : 8, port2 type : 8].

var op_node0 = { kind : 0
               , fn   : 0
               , x    : new Uint32Array([1,0])
               , y    : new Uint32Array([2,0])
               };

var op_node1 = { kind : 1
               , fn   : 0
               , x    : new Uint32Array([1,0])
               , y    : new Uint32Array([0xFFFFFFFF,2])
               };

var op_node2 = { kind : 2
               , fn   : 0
               , x    : new Uint32Array([1])
               , y    : new Uint32Array([4])
               };

function toUint32(f) {
  var x  = new Float64Array(1)
  x[0] = f
  console.log(f)
  return (new Uint32Array(x.buffer))
  }

function toFloat64(u) {
  var x  = new Uint32Array(2)
  x = u
  return (new Float64Array(x.buffer))
  }

var op_node3 = { kind : 3
               , fn   : 0
               , x    : toUint32(2 ** 40)
               , y    : toUint32(2 ** 40)
               };

(async () => {
  // Explicitly compile and then instantiate the wasm module.
  const ops_module = await WebAssembly.compile(ops_bytes);
  const ops_ = await WebAssembly.instantiate(ops_module);
  const ops = ops_.exports
  const mem = new Uint32Array(ops.memory.buffer, 0, 4)

  function apply(node) {

    function fn_i32(node) {
      console.log("prestore: " + mem);
      ops.i32_store(node.x[0], node.y[1])
      console.log("poststore: " + mem);
      switch (node.fn) {
        case 0: ops.i32_add(); break;
        default: throw "[ERROR]\nInvalid OP1 function.";
      }
      console.log("result: " + mem);
      const res = []
      res[0] = mem[0]
      res[1] = mem[1]
      return (new Uint32Array(res));
    }

    function fn_i64(node) {
      console.log("prestore: " + mem);
      ops.i64_store(node.x[0],node.x[1],node.y[0],node.y[1]);
      console.log("poststore: " + mem);
      switch (node.fn) {
        case 0: ops.i64_add(); break;
        default: throw "[ERROR]\nInvalid OP1 function.";
      }
      console.log("result: " + mem);
      const res = []
      res[0] = mem[0]
      res[1] = mem[1]
      console.log("return: " + res);
      return (new Uint32Array(res));
    }

    function fn_f32(node) {
      ops.f32_store(node.x[0],node.y[0]);
      switch (node.fn) {
        case 0: ops.f32_add(); break;
        default: throw "[ERROR]\nInvalid OP1 function.";
      }
      var res = ops.f32_load()
      return (new Float32Array([res]));
    }

    function fn_f64(node) {
      ops.f64_store(toFloat64(node.x), toFloat64(node.y))
      switch (node.fn) {
        case 0: ops.f64_add(); break;
        default: throw "[ERROR]\nInvalid OP1 function.";
      }
      var res = ops.f64_load()
      ops.mem_clear();
      console.log("return: " + res);
      return (res);
    }

    switch (node.kind) {
      case 0: var res = fn_i32(node); break;
      case 1: var res = fn_i64(node); break;
      case 2: var res = fn_f32(node); break;
      case 3: var res = fn_f64(node); break;
      default: throw "[ERROR]\nInvalid NUM type.";
    };
    ops.mem_clear();
    return res;
  }

  console.log("i32");
  console.log(apply(op_node0))
  console.log("i64");
  console.log(apply(op_node1))
  console.log("f32");
  console.log(apply(op_node2))
  console.log("f64");
  console.log(apply(op_node3))
  console.log(mem);

//  console.log(i32.sub(8, 5));
//  console.log(i32.mul(8, 5));
//  console.log(i32.div_u(8, 5));
//  console.log(i32.div_s(8, 5));
//  console.log(i32.rem_u(8, 5));
//  console.log(i32.rem_s(8, 5));
//  console.log(i32.and(1, 1));
//  console.log(i32.or(1, 0));
//  console.log(i32.xor(1, 0));
//  console.log(i32.shl(1, 5));
//  console.log(i32.shr_u(63, 3));
//  console.log(i32.rotl(5, 3));
//  console.log(i32.rotr(40, 3));
//  console.log(i32.clz(8));
//  console.log(i32.ctz(8));
//  console.log(i32.popcnt(8));
//  console.log(i32.eqz(8));
//  console.log(i32.eq(8,5));
//  console.log(i32.ne(8,5));
//  console.log(i32.lt_u(8,5));
//  console.log(i32.lt_s(8,5));
//  console.log(i32.gt_u(8,5));
//  console.log(i32.gt_s(8,5));
//  console.log(i32.le_u(8,5));
//  console.log(i32.le_s(8,5));
//  console.log(i32.ge_u(8,5));
//  console.log(i32.ge_s(8,5));

})();

