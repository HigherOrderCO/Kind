const WATCH = 0;
const UNWATCH = 1;
const POST = 2;
const SHOW = 3;

// type RoomID    = U48
// type PostID    = U48
// type Time      = U48
// type Address   = U160
// type PostData  = U304
// type Signature = U520
//
// type Method
//   = WATCH(rmid: U48)                                   -- value = 00
//   | UNWATCH(rmid: U48)                                 -- value = 01
//   | POST(rmid: U48, data: U304, sign: U520)            -- value = 10
//   | SHOW(rmid: U48, time: U48, addr: U160, data: U304) -- value = 11

function hex_to_bytes(hex) {
  var arr = [];
  for (var i = 0; i < (hex.length-2)/2; ++i) {
    arr.push((parseInt(hex[2+i*2+0],16)<<4)|parseInt(hex[2+i*2+1],16));
  };
  return new Uint8Array(arr);
};

const hex_char = "0123456789abcdef".split("");
function bytes_to_hex(buf) {
  var hex = "0x";
  for (var i = 0; i < buf.length; ++i) {
    hex += hex_char[buf[i]>>>4] + hex_char[buf[i]&0xF];
  };
  return hex;
};

function hex_join(arr) {
  var res = "0x";
  for (var i = 0; i < arr.length; ++i) {
    res += arr[i].slice(2);
  }
  return res;
};

function hexs_to_bytes(arr) {
  return hex_to_bytes(hex_join(arr));
};

function u8_to_hex(num) {
  return "0x" + ("00" + num.toString(16)).slice(-2);
};

function hex_to_u8(hex) {
  return parseInt(hex.slice(2), 16);
};

function hex_to_u48(hex) {
  return parseInt(hex.slice(-48), 16);
};

function u48_to_hex(num) {
  var hex = "0x";
  for (var i = 0; i < 12; ++i) {
    hex += hex_char[(num / (2**((12-i-1)*4))) & 0xF];
  };
  return hex;
};

function check_hex(bits, hex) {
  if (typeof hex !== "string" || !/^0x[a-fA-F0-9]*$/.test(hex)) {
    return null;
  };
  while ((hex.length - 2) * 4 < bits) {
    hex = "0x0" + hex.slice(2);
  };
  if ((hex.length - 2) * 4 > bits) {
    hex = hex.slice(0, Math.floor(bits / 4) + 2);
  }
  return hex;
};

var utf8_encoder = new TextEncoder("utf-8");
function string_to_bytes(str) {
  return utf8_encoder.encode(str);
};

var utf8_decoder = new TextDecoder("utf-8");
function bytes_to_string(buf) {
  return utf8_decoder.decode(buf);
};

function string_to_hex(str) {
  return bytes_to_hex(string_to_bytes(str));
};

function hex_to_string(hex) {
  return bytes_to_string(hex_to_bytes(hex));
};

module.exports = {
  WATCH,
  UNWATCH,
  POST,
  SHOW,
  hex_to_bytes,
  bytes_to_hex,
  hexs_to_bytes,
  hex_join,
  u8_to_hex,
  hex_to_u8,
  u48_to_hex,
  hex_to_u48,
  string_to_hex,
  hex_to_string,
  check_hex,
};
