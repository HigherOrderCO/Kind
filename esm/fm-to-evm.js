import './errors.js';
import stringify from './stringify.js';
import './core-e930ae7b.js';
import 'xhr-request-promise';
import './version.js';
import './loader-705f5616.js';
import parse from './parse.js';
import { d as compile, e as decompile, a as New, N as NIL, R as REF, c as ctor_of, b as addr_of } from './runtime-fast-45710fb0.js';
import './fm-net-b5947aee.js';
import './runtime-optimal-7d371ce5.js';
import './fm-to-js-01192387.js';
import BN from 'bn.js';
import VM from 'ethereumjs-vm';

var vm = new VM();

(async() => {

const STOP         = 0x00;
const ADD          = 0x01;
const MUL          = 0x02;
const EQ           = 0x14;
const ISZERO       = 0x15;
const AND          = 0x16;
const POP          = 0x50;
const MLOAD        = 0x51;
const MSTORE       = 0x52;
const JUMP         = 0x56;
const JUMPI        = 0x57;
const MSIZE        = 0x59;
const JUMPDEST     = 0x5B;
const PUSH1        = 0x60;
const PUSH2        = 0x61;
const PUSH3        = 0x62;
const PUSH4        = 0x63;
const DUP1         = 0x80;
const DUP2         = 0x81;
const DUP3         = 0x82;
const DUP4         = 0x83;
const DUP5         = 0x84;
const SWAP1        = 0x90;
const SWAP2        = 0x91;
const SWAP3        = 0x92;
const SHL          = 0x1B;
const SHR          = 0x1C;

var flat = (arr) => {
  var res = [];
  function go(arr) {
    for (var i = 0; i < arr.length; ++i) {
      if (typeof arr[i] === "object") {
        go(arr[i]);
      } else {
        res.push(arr[i]);
      }
    }
  }  go(arr);
  return res;
};

var build = (code) => {
  var code = flat(code);
  var at = {};
  for (var i = 0; i < code.length; ++i) {
    if (typeof code[i] === "string" && code[i].slice(0,2) === "AT") {
      at[code[i].slice(3)] = i;
      console.log("dest of", code[i].slice(3), i);
    }
  }
  for (var i = 0; i < code.length; ++i) {
    if (typeof code[i] === "string" && code[i].slice(0,2) === "T0") {
      code[i] = (at[code[i].slice(3)] >>> 8) & 0xFF;
    }
    if (typeof code[i] === "string" && code[i].slice(0,2) === "T1") {
      code[i] = at[code[i].slice(3)] & 0xFF;
    }
    if (typeof code[i] === "string" && code[i].slice(0,2) === "AT") {
      code[i] = JUMPDEST;
    }
    if (typeof code[i] === "string" && code[i].slice(0,2) === "PC") {
      code[i] = i;
    }
  }
  var code = code.map(x => ("00" + x.toString(16)).slice(-2));
  return Buffer.from(code.join(''), 'hex');
};

var BLOCK = (len, arr) => {
  var arr = flat(arr);
  while (arr.length < len) {
    arr.push(0);
  }
  return arr;
};

var PCOF = (label) => {
  return [PUSH2, "T0@"+label, "T1@"+label];
};

var GOTO = (label) => {
  return [PCOF(label), JUMP];
};

var DEST = (label) => {
  return ["AT@"+label];
};

var NUM = (num) => {
  var arr = [];
  if (num < 2 ** 8) {
    arr.push(PUSH1);
    arr.push(num & 0xFF);
  } else if (num < 2 ** 16) {
    arr.push(PUSH2); // PUSH2
    arr.push((num >>> 8) & 0xFF);
    arr.push((num >>> 0) & 0xFF);
  } else if (num < 2 ** 24) {
    arr.push(PUSH3); // PUSH3
    arr.push((num >>> 16) & 0xFF);
    arr.push((num >>> 8) & 0xFF);
    arr.push((num >>> 0) & 0xFF);
  } else {
    arr.push(PUSH4); // PUSH4
    arr.push((num >>> 24) & 0xFF);
    arr.push((num >>> 16) & 0xFF);
    arr.push((num >>> 8) & 0xFF);
    arr.push((num >>> 0) & 0xFF);
  }
  return arr;
};

var LOAD_NUMS = (nums) => {
  var arr = [];
  for (var i = 0; i < nums.length; ++i) {
    var n = nums[i];
    arr.push(NUM(n));
    arr.push(SET(NUM(i)));
  }
  return flat(arr);
};

var NAME = () => {
  return "x" + Math.floor(Math.random()*(2**48));
};

var GET = (idx) => {
  return flat([idx, PUSH1, 5, SHL, MLOAD]);
};

var SET = (idx) => {
  return flat([idx, PUSH1, 5, SHL, MSTORE]);
};

var IF = (cond, case_t, case_f) => {
  var nam0 = NAME();
  var nam1 = NAME();
  return [
    cond, PCOF(nam0), JUMPI,
      case_f,
    PCOF(nam1), JUMP,
    DEST(nam0),
      case_t,
    DEST(nam1)
  ];
};

var WHILE = (cond, body) => {
  var cont = NAME();
  var stop = NAME();
  return [
    DEST(cont),
    cond, ISZERO, PCOF(stop), JUMPI,
    body,
    PCOF(cont), JUMP,
    DEST(stop)
  ];
};

var SWITCH = (value, cases) => {
  var block_size = 0;
  var block_code = [];
  var break_name = NAME();
  var block_name = [];
  for (var i = 0; i < cases.length; ++i) {
    var name = NAME();
    var code = [];
    code.push(DEST(name));
    code.push(cases[i]);
    if (i < cases.length - 1) {
      code.push(GOTO(break_name));
    }
    code = flat(code);
    var size = code.length + 2;
    block_name.push(name);
    block_code.push(code);
    block_size = Math.max(block_size, code.length);
  }
  console.log("BLOCK SIZE", block_size);
  var code = [value, NUM(block_size), MUL, PCOF(block_name[0]), ADD, JUMP];
  for (var i = 0; i < block_code.length; ++i) {
    code.push(BLOCK(block_size, block_code[i]));
  }
  code.push(DEST(break_name));
  //console.log("block_size", block_size);
  //console.log("...", code);
  return code;
};

var ADDR_OF = [PUSH1, 0x4, SHR];
var CTOR_OF = [PUSH1, 0x0F, AND];
var NIL$1     = [PUSH4, 0xFF, 0xFF, 0xFF, 0xFF];

const {defs} = await parse(`
T Bool
| true
| false

T List<A>
| nil
| cons(head : A, tail : List(A))

not(b: Bool) : Bool
  case b
  | true  => false
  | false => true

negate(xs : List(Bool)) : List(Bool)
  case xs
  | nil  => nil(_)
  | cons => cons(_ not(xs.head), negate(xs.tail))

main negate([true, true, false, false, true, true, false, false])
`, {});

const {rt_defs, rt_rfid} = compile(defs);

var term = rt_defs[rt_rfid["main/main"]];

var code = [
  LOAD_NUMS(term.mem),

  NUM(0xFFFFFFFF), // stack end

  // back.push(root); back.push(0); back.push(0);
  NUM(term.ptr),
  //NUM(fm.fast.New(fm.fast.REF, Object.keys(rt_defs).length - 1)), // next
  NUM(0), // side
  NUM(0), // deph

  // while (back.length > 0)
  WHILE([DUP1, NUM(0xFFFFFFFF), EQ, ISZERO], [

    // switch (ctor_of(next))
    SWITCH([DUP3, CTOR_OF], [
      // case VAR
      [
        //[NUM(99990000),POP],

        // back.pop(); back.pop(); back.pop();
        POP, POP, POP,

        // while (back.length > 0)
        WHILE([DUP1, NUM(0xFFFFFFFF), EQ, ISZERO], [
          // if (ctor_of(back[2]) === APP && back[1] === 0) {
          IF([DUP3, CTOR_OF, PUSH1, 2, EQ, DUP3, ISZERO, AND], [
            //[NUM(99990001),POP],
            // back[1] = 1;
            PUSH1, 1, SWAP2, POP,

            // back.push(mem[addr_of(back_term) + 1]);
            // back.push(0);
            // back.push(back_deph);
            GET([DUP3, ADDR_OF, PUSH1, 1, ADD]),
            PUSH1, 0,
            DUP3,

            // break;
            GOTO("VAR_CASE_END"),
          ], [
            // back.pop();
            // back.pop();
            // back.pop();
            POP, POP, POP,
          ])
        ]),
        DEST("VAR_CASE_END"),
      ],

      // case LAM
      [
        //[NUM(99990002),POP],

        // var vari = mem[addr_of(next)]
        GET([DUP3, ADDR_OF]),

        // if (vari !== NIL)
        IF([DUP1, NIL$1, EQ], [POP], [
          // mem[addr_of(vari)] = New(VAR, deph);
          ADDR_OF, DUP2, NUM(4), SHL, SET([SWAP1]),
        ]),

        SWAP1, POP, PUSH1, 1, SWAP1, // back[1] = 1
        GET([DUP3, ADDR_OF, PUSH1, 1, ADD]), // back.push(mem[addr_of(next) + 1])
        PUSH1, 0, // back.push(0)
        DUP3, PUSH1, 1, ADD, // back.push(deph + 1)
      ],

      // case APP
      [
        //[NUM(99990003),POP],

        // var func = mem[addr_of(next)]
        GET([DUP3, ADDR_OF]),

        // if (ctor_of(func) === LAM)
        //[NUM(99990004),POP],

        IF([DUP1, CTOR_OF, PUSH1, 1, EQ], [
          //[NUM(99990005),POP],

          // var vari = mem[addr_of(func) + 0];
          GET([DUP1, ADDR_OF]),

          // if (vari !== NIL)
          IF([DUP1, NIL$1, EQ, ISZERO], [
            //[NUM(99990006),POP],
            // var argm = mem[addr_of(next) + 1];
            GET([DUP5, ADDR_OF, PUSH1, 1, ADD]),
            // mem[addr_of(vari)] = argm
            SET([SWAP1, ADDR_OF]),
          ], [
            //[NUM(99990007),POP],
            POP
          ]),
          //[NUM(99990008),POP],

          // var subs = mem[addr_of(func) + 1];
          GET([ADDR_OF, PUSH1, 1, ADD]),

          // back.pop(); back.pop(); back.pop();
          SWAP3, POP, POP, POP,

          // if (back.length > 0)
          IF([DUP2, NUM(0xFFFFFFFF), EQ, ISZERO], [
            // mem[addr_of(back[2]) + back_to[1]] = subs;
            SET([DUP4, ADDR_OF, DUP4, ADD]),
            // back[1] = 0;
            SWAP1, POP, PUSH1, 0, SWAP1,
          ], [
            // var root = subs;
            DUP1, PUSH1, 0, MSTORE,
            // back.push(subs); back.push(0); back.push(0);
            PUSH1, 0,
            PUSH1, 0,
          ]),
        ], [
          // back.push(func); back.push(0); back.push(deph);
          PUSH1, 0,
          DUP3,
        ]),
      ],

      // case REF
      [
        //[NUM(99990009),POP],

        // mem.push(0);
        NIL$1, MSIZE, MSTORE,

        // var add_val = mem.length;
        MSIZE, PUSH1, 1, SHR,

        // switch(addr_of(next))
        SWITCH([DUP4, ADDR_OF], Object.keys(rt_defs).map(key => {
          var ref = rt_defs[key];
          return flat([
            ref.mem.map(ref_term => {
              var ref_ctor = ctor_of(ref_term);
              var ref_addr = addr_of(ref_term);
              var ref_numb = NUM(New(ref_ctor, ref_addr));
              if (ref_term !== NIL && ref_ctor !== REF) {
                var ref_numb = [DUP1, ref_numb, ADD];
              } else {
                var ref_numb = [ref_numb];
              }
              return [ref_numb, MSIZE, MSTORE];
            }),
            NUM(ref.ptr),
          ]);
        })),

        // var subs = New(ctor_of(ref.ptr), addr_of(ref.ptr) + pos);
        ADD,

        // back.pop(); back.pop(); back.pop();
        SWAP3, POP, POP, POP,

        // if (back.length > 0)
        IF([DUP2, NUM(0xFFFFFFFF), EQ, ISZERO], [
          // mem[addr_of(back[2]) + back_to[1]] = subs;
          SET([DUP4, ADDR_OF, DUP4, ADD]),
          // back[1] = 0;
          SWAP1, POP, PUSH1, 0, SWAP1,
        ], [
          // var root = subs;
          DUP1, PUSH1, 0, MSTORE,
          // back.push(subs); back.push(0); back.push(0);
          PUSH1, 0,
          PUSH1, 0,
        ]),
      ],
    ]),

  ]),
  
  STOP,
];

var code = build(code);

vm.runCode({
  gasLimit: new BN(0xffffffff),
  code,
}).then(results => {
  var mem = get_mem(results.runState.memory._store);
  console.log('Returned : ' + results.returnValue.toString('hex'));
  console.log('gasUsed  : ' + results.gasUsed.toString());
  console.log("lastMem  : " + JSON.stringify(mem));
  console.log("term     : " + stringify(decompile({mem,ptr:mem[0]})));
}).catch(err => console.log('Error    : ' + err));

vm.on('step', function(data) {
  var mem = get_mem(data.memory);
  //console.log(pad(4,"0",String(data.pc))
    //+ " " + pad(8," ",data.opcode.name)
    //+ " | " + data.stack
    //+ " --- " + fm.stringify(fm.fast.decompile({mem,ptr:mem[0]})));
});

function get_mem(mem) {
  var arr = [];
  for (var i = 0; i < mem.length / 32; ++i) {
    var num
      = (mem[i * 32 + 28] << 24)
      + (mem[i * 32 + 29] << 16)
      + (mem[i * 32 + 30] << 8)
      + (mem[i * 32 + 31]);
    arr.push(num);
  }
  return arr;
}
})();
