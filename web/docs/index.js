/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 596:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var lib = __webpack_require__(746);
var sig = __webpack_require__(780);
var WebSocket = __webpack_require__(551);

module.exports = function client({url = "ws://localhost:7171", key = "0x0000000000000000000000000000000000000000000000000000000000000001"} = {}) {
  var ws = new WebSocket(url);
  var Posts = {};
  var watching = {};

  // Waits ws to be ready and then sends buffer to server
  function ws_send(buffer) {
    if (ws.readyState === 1) {
      ws.send(buffer);
    } else {
      setTimeout(() => ws_send(buffer), 20);
    }
  }

  var on_init_callback = null;
  var on_post_callback = null;

  // Sets the on_init callback
  function on_init(callback) {
    on_init_callback = callback;
  }

  // Sets the on_post callback
  function on_post(callback) {
    on_post_callback = callback;
  }

  // Sends a signed post to a room on the server
  function send_post(post_room, post_data, priv_key = key) {
    var priv_key = lib.check_hex(256, priv_key);
    var post_room = lib.check_hex(48, post_room);
    var post_data = lib.check_hex(256, post_data);
    var post_hash = sig.keccak(lib.hexs_to_bytes([post_room, post_data]));
    var post_sign = sig.signMessage(post_hash, priv_key);

    var msge_buff = lib.hexs_to_bytes([
      lib.u8_to_hex(lib.POST),
      post_room,
      post_data,
      post_sign,
    ]);
    ws_send(msge_buff);
  };

  // Starts watching a room
  function watch_room(room_name) {
    if (!watching[room_name]) {
      watching[room_name] = true;
      var room_name = lib.check_hex(48, room_name);
      var msge_buff = lib.hexs_to_bytes([
        lib.u8_to_hex(lib.WATCH),
        room_name,
      ]);
      Posts[room_name] = [];
      ws_send(msge_buff); 
    }
  };

  // Stops watching a room
  function unwatch_room(room_name) {
    if (watching[room_name]) {
      watching[room_name] = false;
      var room_name = lib.check_hex(48, room_name);
      var msge_buff = lib.hexs_to_bytes([
        lib.u8_to_hex(lib.UNWATCH),
        room_name,
      ]);
      ws_send(msge_buff);
    }
  };

  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
    if (on_init_callback) {
      on_init_callback();
    }
  };

  ws.onmessage = (msge) => {
    var msge = new Uint8Array(msge.data);
    if (msge[0] === lib.SHOW) {
      var room = lib.bytes_to_hex(msge.slice(1, 7));
      var time = lib.bytes_to_hex(msge.slice(7, 13));
      var addr = lib.bytes_to_hex(msge.slice(13, 33));
      var data = lib.bytes_to_hex(msge.slice(33, 65));
      Posts[room].push({time, addr, data});
      if (on_post_callback) {
        on_post_callback({room, time, addr, data}, Posts);
      }
    };
  };

  return {
    on_init,
    on_post,
    send_post,
    watch_room,
    unwatch_room,
    lib,
  };
};



/***/ }),

/***/ 746:
/***/ ((module) => {

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


/***/ }),

/***/ 551:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

var ws = null

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof __webpack_require__.g !== 'undefined') {
  ws = __webpack_require__.g.WebSocket || __webpack_require__.g.MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
} else if (typeof self !== 'undefined') {
  ws = self.WebSocket || self.MozWebSocket
}

module.exports = ws


/***/ }),

/***/ 780:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ma=this;function oa(q){var w=0;return function(){return w<q.length?{done:!1,value:q[w++]}:{done:!0}}}var pa="function"==typeof Object.defineProperties?Object.defineProperty:function(q,w,h){q!=Array.prototype&&q!=Object.prototype&&(q[w]=h.value)};function qa(q){q=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof __webpack_require__.g&&__webpack_require__.g,q];for(var w=0;w<q.length;++w){var h=q[w];if(h&&h.Math==Math)return h}throw Error("Cannot find global object");}var ra=qa(this);
function sa(){sa=function(){};ra.Symbol||(ra.Symbol=ta)}function ua(q,w){this.P=q;pa(this,"description",{configurable:!0,writable:!0,value:w})}ua.prototype.toString=function(){return this.P};var ta=function(){function q(h){if(this instanceof q)throw new TypeError("Symbol is not a constructor");return new ua("jscomp_symbol_"+(h||"")+"_"+w++,h)}var w=0;return q}();
function Ea(q,w){if(w){var h=ra;q=q.split(".");for(var l=0;l<q.length-1;l++){var m=q[l];m in h||(h[m]={});h=h[m]}q=q[q.length-1];l=h[q];w=w(l);w!=l&&null!=w&&pa(h,q,{configurable:!0,writable:!0,value:w})}}Ea("Math.imul",function(q){return q?q:function(w,h){w=Number(w);h=Number(h);var l=w&65535,m=h&65535;return l*m+((w>>>16&65535)*m+l*(h>>>16&65535)<<16>>>0)|0}});
Ea("Array.prototype.fill",function(q){return q?q:function(w,h,l){var m=this.length||0;0>h&&(h=Math.max(0,m+h));if(null==l||l>m)l=m;l=Number(l);0>l&&(l=Math.max(0,m+l));for(h=Number(h||0);h<l;h++)this[h]=w;return this}});function Fa(q){var w=null;return function(){return w=w||q()}}
var Ga=Fa(function(){return function(q,w){w&&(q.fd=w,q.prototype=Object.create(w.prototype,{constructor:{value:q,enumerable:!1,writable:!0,configurable:!0}}))}}),Ha=Fa(function(){function q(a,b,g){var f=a.a,k=b.a,t=g.a,y=0,A=f[0]|0,C=A&8191,B=A>>>13,D=f[1]|0;A=D&8191;var K=D>>>13,E=f[2]|0;D=E&8191;var T=E>>>13,F=f[3]|0;E=F&8191;var X=F>>>13,G=f[4]|0;F=G&8191;var Y=G>>>13,H=f[5]|0;G=H&8191;var Z=H>>>13,I=f[6]|0;H=I&8191;var aa=I>>>13,J=f[7]|0;I=J&8191;var ba=J>>>13,U=f[8]|0;J=U&8191;U>>>=13;var V=
f[9]|0;f=V&8191;V>>>=13;var L=k[0]|0,ca=L&8191,da=L>>>13,M=k[1]|0;L=M&8191;var ea=M>>>13,N=k[2]|0;M=N&8191;var fa=N>>>13,O=k[3]|0;N=O&8191;var ha=O>>>13,P=k[4]|0;O=P&8191;var ia=P>>>13,Q=k[5]|0;P=Q&8191;var ja=Q>>>13,R=k[6]|0;Q=R&8191;var ka=R>>>13,S=k[7]|0;R=S&8191;var la=S>>>13,W=k[8]|0;S=W&8191;W>>>=13;var na=k[9]|0;k=na&8191;na>>>=13;g.b=a.b^b.b;g.length=19;var p=c(C,ca);a=c(C,da);a=a+c(B,ca)|0;b=c(B,da);var va=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(va>>>26)|0;va&=67108863;p=c(A,ca);a=c(A,
da);a=a+c(K,ca)|0;b=c(K,da);p=p+c(C,L)|0;a=a+c(C,ea)|0;a=a+c(B,L)|0;b=b+c(B,ea)|0;var wa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(wa>>>26)|0;wa&=67108863;p=c(D,ca);a=c(D,da);a=a+c(T,ca)|0;b=c(T,da);p=p+c(A,L)|0;a=a+c(A,ea)|0;a=a+c(K,L)|0;b=b+c(K,ea)|0;p=p+c(C,M)|0;a=a+c(C,fa)|0;a=a+c(B,M)|0;b=b+c(B,fa)|0;var xa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(xa>>>26)|0;xa&=67108863;p=c(E,ca);a=c(E,da);a=a+c(X,ca)|0;b=c(X,da);p=p+c(D,L)|0;a=a+c(D,ea)|0;a=a+c(T,L)|0;b=b+c(T,ea)|0;p=p+c(A,M)|0;a=a+c(A,
fa)|0;a=a+c(K,M)|0;b=b+c(K,fa)|0;p=p+c(C,N)|0;a=a+c(C,ha)|0;a=a+c(B,N)|0;b=b+c(B,ha)|0;var ya=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(ya>>>26)|0;ya&=67108863;p=c(F,ca);a=c(F,da);a=a+c(Y,ca)|0;b=c(Y,da);p=p+c(E,L)|0;a=a+c(E,ea)|0;a=a+c(X,L)|0;b=b+c(X,ea)|0;p=p+c(D,M)|0;a=a+c(D,fa)|0;a=a+c(T,M)|0;b=b+c(T,fa)|0;p=p+c(A,N)|0;a=a+c(A,ha)|0;a=a+c(K,N)|0;b=b+c(K,ha)|0;p=p+c(C,O)|0;a=a+c(C,ia)|0;a=a+c(B,O)|0;b=b+c(B,ia)|0;var za=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(za>>>26)|0;za&=67108863;p=c(G,
ca);a=c(G,da);a=a+c(Z,ca)|0;b=c(Z,da);p=p+c(F,L)|0;a=a+c(F,ea)|0;a=a+c(Y,L)|0;b=b+c(Y,ea)|0;p=p+c(E,M)|0;a=a+c(E,fa)|0;a=a+c(X,M)|0;b=b+c(X,fa)|0;p=p+c(D,N)|0;a=a+c(D,ha)|0;a=a+c(T,N)|0;b=b+c(T,ha)|0;p=p+c(A,O)|0;a=a+c(A,ia)|0;a=a+c(K,O)|0;b=b+c(K,ia)|0;p=p+c(C,P)|0;a=a+c(C,ja)|0;a=a+c(B,P)|0;b=b+c(B,ja)|0;var Aa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Aa>>>26)|0;Aa&=67108863;p=c(H,ca);a=c(H,da);a=a+c(aa,ca)|0;b=c(aa,da);p=p+c(G,L)|0;a=a+c(G,ea)|0;a=a+c(Z,L)|0;b=b+c(Z,ea)|0;p=p+c(F,M)|0;a=a+c(F,
fa)|0;a=a+c(Y,M)|0;b=b+c(Y,fa)|0;p=p+c(E,N)|0;a=a+c(E,ha)|0;a=a+c(X,N)|0;b=b+c(X,ha)|0;p=p+c(D,O)|0;a=a+c(D,ia)|0;a=a+c(T,O)|0;b=b+c(T,ia)|0;p=p+c(A,P)|0;a=a+c(A,ja)|0;a=a+c(K,P)|0;b=b+c(K,ja)|0;p=p+c(C,Q)|0;a=a+c(C,ka)|0;a=a+c(B,Q)|0;b=b+c(B,ka)|0;var Ba=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Ba>>>26)|0;Ba&=67108863;p=c(I,ca);a=c(I,da);a=a+c(ba,ca)|0;b=c(ba,da);p=p+c(H,L)|0;a=a+c(H,ea)|0;a=a+c(aa,L)|0;b=b+c(aa,ea)|0;p=p+c(G,M)|0;a=a+c(G,fa)|0;a=a+c(Z,M)|0;b=b+c(Z,fa)|0;p=p+c(F,N)|0;a=a+c(F,ha)|
0;a=a+c(Y,N)|0;b=b+c(Y,ha)|0;p=p+c(E,O)|0;a=a+c(E,ia)|0;a=a+c(X,O)|0;b=b+c(X,ia)|0;p=p+c(D,P)|0;a=a+c(D,ja)|0;a=a+c(T,P)|0;b=b+c(T,ja)|0;p=p+c(A,Q)|0;a=a+c(A,ka)|0;a=a+c(K,Q)|0;b=b+c(K,ka)|0;p=p+c(C,R)|0;a=a+c(C,la)|0;a=a+c(B,R)|0;b=b+c(B,la)|0;var Ca=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Ca>>>26)|0;Ca&=67108863;p=c(J,ca);a=c(J,da);a=a+c(U,ca)|0;b=c(U,da);p=p+c(I,L)|0;a=a+c(I,ea)|0;a=a+c(ba,L)|0;b=b+c(ba,ea)|0;p=p+c(H,M)|0;a=a+c(H,fa)|0;a=a+c(aa,M)|0;b=b+c(aa,fa)|0;p=p+c(G,N)|0;a=a+c(G,ha)|0;
a=a+c(Z,N)|0;b=b+c(Z,ha)|0;p=p+c(F,O)|0;a=a+c(F,ia)|0;a=a+c(Y,O)|0;b=b+c(Y,ia)|0;p=p+c(E,P)|0;a=a+c(E,ja)|0;a=a+c(X,P)|0;b=b+c(X,ja)|0;p=p+c(D,Q)|0;a=a+c(D,ka)|0;a=a+c(T,Q)|0;b=b+c(T,ka)|0;p=p+c(A,R)|0;a=a+c(A,la)|0;a=a+c(K,R)|0;b=b+c(K,la)|0;p=p+c(C,S)|0;a=a+c(C,W)|0;a=a+c(B,S)|0;b=b+c(B,W)|0;var Da=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Da>>>26)|0;Da&=67108863;p=c(f,ca);a=c(f,da);a=a+c(V,ca)|0;b=c(V,da);p=p+c(J,L)|0;a=a+c(J,ea)|0;a=a+c(U,L)|0;b=b+c(U,ea)|0;p=p+c(I,M)|0;a=a+c(I,fa)|0;a=a+c(ba,
M)|0;b=b+c(ba,fa)|0;p=p+c(H,N)|0;a=a+c(H,ha)|0;a=a+c(aa,N)|0;b=b+c(aa,ha)|0;p=p+c(G,O)|0;a=a+c(G,ia)|0;a=a+c(Z,O)|0;b=b+c(Z,ia)|0;p=p+c(F,P)|0;a=a+c(F,ja)|0;a=a+c(Y,P)|0;b=b+c(Y,ja)|0;p=p+c(E,Q)|0;a=a+c(E,ka)|0;a=a+c(X,Q)|0;b=b+c(X,ka)|0;p=p+c(D,R)|0;a=a+c(D,la)|0;a=a+c(T,R)|0;b=b+c(T,la)|0;p=p+c(A,S)|0;a=a+c(A,W)|0;a=a+c(K,S)|0;b=b+c(K,W)|0;p=p+c(C,k)|0;a=a+c(C,na)|0;a=a+c(B,k)|0;b=b+c(B,na)|0;C=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(C>>>26)|0;C&=67108863;p=c(f,L);a=c(f,ea);a=a+c(V,L)|0;b=c(V,
ea);p=p+c(J,M)|0;a=a+c(J,fa)|0;a=a+c(U,M)|0;b=b+c(U,fa)|0;p=p+c(I,N)|0;a=a+c(I,ha)|0;a=a+c(ba,N)|0;b=b+c(ba,ha)|0;p=p+c(H,O)|0;a=a+c(H,ia)|0;a=a+c(aa,O)|0;b=b+c(aa,ia)|0;p=p+c(G,P)|0;a=a+c(G,ja)|0;a=a+c(Z,P)|0;b=b+c(Z,ja)|0;p=p+c(F,Q)|0;a=a+c(F,ka)|0;a=a+c(Y,Q)|0;b=b+c(Y,ka)|0;p=p+c(E,R)|0;a=a+c(E,la)|0;a=a+c(X,R)|0;b=b+c(X,la)|0;p=p+c(D,S)|0;a=a+c(D,W)|0;a=a+c(T,S)|0;b=b+c(T,W)|0;p=p+c(A,k)|0;a=a+c(A,na)|0;a=a+c(K,k)|0;b=b+c(K,na)|0;A=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(A>>>26)|0;A&=67108863;
p=c(f,M);a=c(f,fa);a=a+c(V,M)|0;b=c(V,fa);p=p+c(J,N)|0;a=a+c(J,ha)|0;a=a+c(U,N)|0;b=b+c(U,ha)|0;p=p+c(I,O)|0;a=a+c(I,ia)|0;a=a+c(ba,O)|0;b=b+c(ba,ia)|0;p=p+c(H,P)|0;a=a+c(H,ja)|0;a=a+c(aa,P)|0;b=b+c(aa,ja)|0;p=p+c(G,Q)|0;a=a+c(G,ka)|0;a=a+c(Z,Q)|0;b=b+c(Z,ka)|0;p=p+c(F,R)|0;a=a+c(F,la)|0;a=a+c(Y,R)|0;b=b+c(Y,la)|0;p=p+c(E,S)|0;a=a+c(E,W)|0;a=a+c(X,S)|0;b=b+c(X,W)|0;p=p+c(D,k)|0;a=a+c(D,na)|0;a=a+c(T,k)|0;b=b+c(T,na)|0;D=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(D>>>26)|0;D&=67108863;p=c(f,N);a=c(f,
ha);a=a+c(V,N)|0;b=c(V,ha);p=p+c(J,O)|0;a=a+c(J,ia)|0;a=a+c(U,O)|0;b=b+c(U,ia)|0;p=p+c(I,P)|0;a=a+c(I,ja)|0;a=a+c(ba,P)|0;b=b+c(ba,ja)|0;p=p+c(H,Q)|0;a=a+c(H,ka)|0;a=a+c(aa,Q)|0;b=b+c(aa,ka)|0;p=p+c(G,R)|0;a=a+c(G,la)|0;a=a+c(Z,R)|0;b=b+c(Z,la)|0;p=p+c(F,S)|0;a=a+c(F,W)|0;a=a+c(Y,S)|0;b=b+c(Y,W)|0;p=p+c(E,k)|0;a=a+c(E,na)|0;a=a+c(X,k)|0;b=b+c(X,na)|0;E=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(E>>>26)|0;E&=67108863;p=c(f,O);a=c(f,ia);a=a+c(V,O)|0;b=c(V,ia);p=p+c(J,P)|0;a=a+c(J,ja)|0;a=a+c(U,P)|0;
b=b+c(U,ja)|0;p=p+c(I,Q)|0;a=a+c(I,ka)|0;a=a+c(ba,Q)|0;b=b+c(ba,ka)|0;p=p+c(H,R)|0;a=a+c(H,la)|0;a=a+c(aa,R)|0;b=b+c(aa,la)|0;p=p+c(G,S)|0;a=a+c(G,W)|0;a=a+c(Z,S)|0;b=b+c(Z,W)|0;p=p+c(F,k)|0;a=a+c(F,na)|0;a=a+c(Y,k)|0;b=b+c(Y,na)|0;F=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(F>>>26)|0;F&=67108863;p=c(f,P);a=c(f,ja);a=a+c(V,P)|0;b=c(V,ja);p=p+c(J,Q)|0;a=a+c(J,ka)|0;a=a+c(U,Q)|0;b=b+c(U,ka)|0;p=p+c(I,R)|0;a=a+c(I,la)|0;a=a+c(ba,R)|0;b=b+c(ba,la)|0;p=p+c(H,S)|0;a=a+c(H,W)|0;a=a+c(aa,S)|0;b=b+c(aa,W)|
0;p=p+c(G,k)|0;a=a+c(G,na)|0;a=a+c(Z,k)|0;b=b+c(Z,na)|0;G=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(G>>>26)|0;G&=67108863;p=c(f,Q);a=c(f,ka);a=a+c(V,Q)|0;b=c(V,ka);p=p+c(J,R)|0;a=a+c(J,la)|0;a=a+c(U,R)|0;b=b+c(U,la)|0;p=p+c(I,S)|0;a=a+c(I,W)|0;a=a+c(ba,S)|0;b=b+c(ba,W)|0;p=p+c(H,k)|0;a=a+c(H,na)|0;a=a+c(aa,k)|0;b=b+c(aa,na)|0;H=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(H>>>26)|0;H&=67108863;p=c(f,R);a=c(f,la);a=a+c(V,R)|0;b=c(V,la);p=p+c(J,S)|0;a=a+c(J,W)|0;a=a+c(U,S)|0;b=b+c(U,W)|0;p=p+c(I,k)|
0;a=a+c(I,na)|0;a=a+c(ba,k)|0;b=b+c(ba,na)|0;I=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(I>>>26)|0;I&=67108863;p=c(f,S);a=c(f,W);a=a+c(V,S)|0;b=c(V,W);p=p+c(J,k)|0;a=a+c(J,na)|0;a=a+c(U,k)|0;b=b+c(U,na)|0;J=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(J>>>26)|0;J&=67108863;p=c(f,k);a=c(f,na);a=a+c(V,k)|0;b=c(V,na);B=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(B>>>26)|0;t[0]=va;t[1]=wa;t[2]=xa;t[3]=ya;t[4]=za;t[5]=Aa;t[6]=Ba;t[7]=Ca;t[8]=Da;t[9]=C;t[10]=A;t[11]=D;t[12]=E;t[13]=F;t[14]=G;t[15]=H;t[16]=
I;t[17]=J;t[18]=B&67108863;0!==y&&(t[19]=y,g.length++);return g}function w(a,b){if(!a)throw Error(b||"Assertion failed");}function h(a,b,g){if(h.vc(a))return a;this.b=0;this.a=null;this.length=0;this.red=null;if(null!==a){if("le"===b||"be"===b)g=b,b=10;this.pa(a||0,b||10,g||"be")}}function l(a,b,g){var f=0;for(g=Math.min(a.length,g);b<g;b++){var k=a.charCodeAt(b)-48;f<<=4;f=49<=k&&54>=k?f|k-49+10:17<=k&&22>=k?f|k-17+10:f|k&15}return f}function m(a,b,g){g.b=b.b^a.b;var f=a.length+b.length|0;g.length=
f;f=f-1|0;var k=a.a[0]|0,t=b.a[0]|0;k*=t;var y=k/67108864|0;g.a[0]=k&67108863;for(var A=1;A<f;A++){var C=y>>>26,B=y&67108863;y=Math.min(A,b.length-1);for(var D=Math.max(0,A-a.length+1);D<=y;D++)k=a.a[A-D|0]|0,t=b.a[D]|0,k=k*t+B,C+=k/67108864|0,B=k&67108863;g.a[A]=B|0;y=C|0}0!==y?g.a[A]=y|0:g.length--;return g.L()}function x(a,b){this.name=a;this.p=new h(b,16);this.n=this.p.U();this.k=(new h(1)).ua(this.n).i(this.p);this.Ab=this.cc()}function d(){x.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}
function u(a){"string"===typeof a?(a=h.P(a),this.G=a.p,this.ja=a):(w(a.Cd(1),"modulus must be greater than 1"),this.G=a,this.ja=null)}var e={}; true?e=h:0;h.Gb=h;h.Eb=26;h.vc=function(a){return a instanceof h?!0:null!==a&&"object"===typeof a&&a.constructor.Eb===h.Eb&&Array.isArray(a.a)};h.prototype.pa=function(a,b,g){if("number"===typeof a)this.Yb(a,g);else if("object"===typeof a)this.Ia(a,g);else{"hex"===b&&(b=16);w(b===(b|0)&&2<=b&&36>=b);a=a.toString().replace(/\s+/g,"");
var f=0;"-"===a[0]&&f++;16===b?this.bc(a,f):this.td(a,b,f);"-"===a[0]&&(this.b=1);this.L();"le"===g&&this.Ia(this.H(),g)}};h.prototype.Yb=function(a,b){0>a&&(this.b=1,a=-a);67108864>a?(this.a=[a&67108863],this.length=1):4503599627370496>a?(this.a=[a&67108863,a/67108864&67108863],this.length=2):(w(9007199254740992>a),this.a=[a&67108863,a/67108864&67108863,1],this.length=3);"le"===b&&this.Ia(this.H(),b)};h.prototype.Ia=function(a,b){w("number"===typeof a.length);if(0>=a.length)this.a=[0],this.length=
1;else{this.length=Math.ceil(a.length/3);this.a=Array(this.length);for(var g=0;g<this.length;g++)this.a[g]=0;var f=0;if("be"===b)for(g=a.length-1,b=0;0<=g;g-=3){var k=a[g]|a[g-1]<<8|a[g-2]<<16;this.a[b]|=k<<f&67108863;this.a[b+1]=k>>>26-f&67108863;f+=24;26<=f&&(f-=26,b++)}else if("le"===b)for(b=g=0;g<a.length;g+=3)k=a[g]|a[g+1]<<8|a[g+2]<<16,this.a[b]|=k<<f&67108863,this.a[b+1]=k>>>26-f&67108863,f+=24,26<=f&&(f-=26,b++);this.L()}};h.prototype.bc=function(a,b){this.length=Math.ceil((a.length-b)/6);
this.a=Array(this.length);for(var g=0;g<this.length;g++)this.a[g]=0;var f,k=0;g=a.length-6;for(f=0;g>=b;g-=6){var t=l(a,g,g+6);this.a[f]|=t<<k&67108863;this.a[f+1]|=t>>>26-k&4194303;k+=24;26<=k&&(k-=26,f++)}g+6!==b&&(t=l(a,b,g+6),this.a[f]|=t<<k&67108863,this.a[f+1]|=t>>>26-k&4194303);this.L()};h.prototype.qc=function(a){a.a=Array(this.length);for(var b=0;b<this.length;b++)a.a[b]=this.a[b];a.length=this.length;a.b=this.b;a.red=this.red};h.prototype.clone=function(){var a=new h(null);this.qc(a);return a};
h.prototype.Rb=function(a){for(;this.length<a;)this.a[this.length++]=0};h.prototype.L=function(){for(;1<this.length&&0===this.a[this.length-1];)this.length--;return this.qa()};h.prototype.qa=function(){1===this.length&&0===this.a[0]&&(this.b=0);return this};var n=" 0 00 000 0000 00000 000000 0000000 00000000 000000000 0000000000 00000000000 000000000000 0000000000000 00000000000000 000000000000000 0000000000000000 00000000000000000 000000000000000000 0000000000000000000 00000000000000000000 000000000000000000000 0000000000000000000000 00000000000000000000000 000000000000000000000000 0000000000000000000000000".split(" "),
v=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],r=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1E7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64E6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243E5,28629151,33554432,39135393,45435424,52521875,60466176];h.prototype.toString=function(a,b){a=a||10;b=b|0||1;if(16===a||"hex"===a){var g="";for(var f=a=0,k=0;k<this.length;k++){var t=
this.a[k],y=((t<<a|f)&16777215).toString(16);f=t>>>24-a&16777215;g=0!==f||k!==this.length-1?n[6-y.length]+y+g:y+g;a+=2;26<=a&&(a-=26,k--)}for(0!==f&&(g=f.toString(16)+g);0!==g.length%b;)g="0"+g;0!==this.b&&(g="-"+g);return g}if(a===(a|0)&&2<=a&&36>=a){f=v[a];k=r[a];g="";t=this.clone();for(t.b=0;!t.w();)y=t.Da(k).toString(a),t=t.Dd(k),g=t.w()?y+g:n[f-y.length]+y+g;for(this.w()&&(g="0"+g);0!==g.length%b;)g="0"+g;0!==this.b&&(g="-"+g);return g}w(!1,"Base should be between 2 and 36")};h.prototype.H=function(a,
b){return this.hd(a,b)};h.prototype.hd=function(a,b){var g=Array,f=this.byteLength();b=b||Math.max(1,f);w(f<=b,"byte array longer than desired length");w(0<b,"Requested array length <= 0");this.L();var k="le"===a;g=new g(b);a=this.clone();if(k){for(k=0;!a.w();k++)f=a.T(255),a.j(8),g[k]=f;for(;k<b;k++)g[k]=0}else{for(k=0;k<b-f;k++)g[k]=0;for(k=0;!a.w();k++)f=a.T(255),a.j(8),g[b-k-1]=f}return g};h.prototype.fb=Math.clz32?function(a){return 32-Math.clz32(a)}:function(a){var b=0;4096<=a&&(b+=13,a>>>=
13);64<=a&&(b+=7,a>>>=7);8<=a&&(b+=4,a>>>=4);2<=a&&(b+=2,a>>>=2);return b+a};h.prototype.U=function(){return 26*(this.length-1)+this.fb(this.a[this.length-1])};h.prototype.byteLength=function(){return Math.ceil(this.U()/8)};h.prototype.l=function(){return this.clone().Pa()};h.prototype.Pa=function(){this.w()||(this.b^=1);return this};h.prototype.B=function(a){if(0!==this.b&&0===a.b)return this.b=0,this.i(a),this.b^=1,this.qa();if(0===this.b&&0!==a.b){a.b=0;var b=this.i(a);a.b=1;return b.qa()}if(this.length>
a.length)var g=this;else g=a,a=this;for(var f=b=0;f<a.length;f++)b=(g.a[f]|0)+(a.a[f]|0)+b,this.a[f]=b&67108863,b>>>=26;for(;0!==b&&f<g.length;f++)b=(g.a[f]|0)+b,this.a[f]=b&67108863,b>>>=26;this.length=g.length;if(0!==b)this.a[this.length]=b,this.length++;else if(g!==this)for(;f<g.length;f++)this.a[f]=g.a[f];return this};h.prototype.add=function(a){if(0!==a.b&&0===this.b){a.b=0;var b=this.sub(a);a.b^=1;return b}return 0===a.b&&0!==this.b?(this.b=0,b=a.sub(this),this.b=1,b):this.length>a.length?this.clone().B(a):
a.clone().B(this)};h.prototype.i=function(a){if(0!==a.b){a.b=0;var b=this.B(a);a.b=1;return b.qa()}if(0!==this.b)return this.b=0,this.B(a),this.b=1,this.qa();b=this.cmp(a);if(0===b)return this.b=0,this.length=1,this.a[0]=0,this;if(0<b)var g=this;else g=a,a=this;for(var f=0,k=0;k<a.length;k++)b=(g.a[k]|0)-(a.a[k]|0)+f,f=b>>26,this.a[k]=b&67108863;for(;0!==f&&k<g.length;k++)b=(g.a[k]|0)+f,f=b>>26,this.a[k]=b&67108863;if(0===f&&k<g.length&&g!==this)for(;k<g.length;k++)this.a[k]=g.a[k];this.length=Math.max(this.length,
k);g!==this&&(this.b=1);return this.L()};h.prototype.sub=function(a){return this.clone().i(a)};var c=Math.imul;Math.imul||(q=m);h.prototype.Oc=function(a,b){var g=this.length+a.length;if(10===this.length&&10===a.length)a=q(this,a,b);else if(63>g)a=m(this,a,b);else throw"removed";return a};h.prototype.o=function(a){var b=new h(null);b.a=Array(this.length+a.length);return this.Oc(a,b)};h.prototype.ua=function(a){w("number"===typeof a&&0<=a);var b=a%26;a=(a-b)/26;var g=67108863>>>26-b<<26-b,f;if(0!==
b){var k=0;for(f=0;f<this.length;f++){var t=this.a[f]&g;this.a[f]=(this.a[f]|0)-t<<b|k;k=t>>>26-b}k&&(this.a[f]=k,this.length++)}if(0!==a){for(f=this.length-1;0<=f;f--)this.a[f+a]=this.a[f];for(f=0;f<a;f++)this.a[f]=0;this.length+=a}return this.L()};h.prototype.j=function(a){w("number"===typeof a&&0<=a);var b=a%26,g=Math.min((a-b)/26,this.length),f=67108863^67108863>>>b<<b;var k=Math.max(0,-g);if(0!==g)if(this.length>g)for(this.length-=g,a=0;a<this.length;a++)this.a[a]=this.a[a+g];else this.a[0]=
0,this.length=1;g=0;for(a=this.length-1;0<=a&&(0!==g||a>=k);a--){var t=this.a[a]|0;this.a[a]=g<<26-b|t>>>b;g=t&f}0===this.length&&(this.a[0]=0,this.length=1);return this.L()};h.prototype.ld=function(a){return this.clone().ua(a)};h.prototype.ab=function(a){return this.clone().j(a)};h.prototype.Na=function(a){w("number"===typeof a);w(67108864>a);if(0>a)return this.Ca(-a);if(0!==this.b){if(1===this.length&&(this.a[0]|0)<a)return this.a[0]=a-(this.a[0]|0),this.b=0,this;this.b=0;this.Ca(a);this.b=1;return this}return this.Wb(a)};
h.prototype.Wb=function(a){this.a[0]+=a;for(a=0;a<this.length&&67108864<=this.a[a];a++)this.a[a]-=67108864,a===this.length-1?this.a[a+1]=1:this.a[a+1]++;this.length=Math.max(this.length,a+1);return this};h.prototype.Ca=function(a){w("number"===typeof a);w(67108864>a);if(0>a)return this.Na(-a);if(0!==this.b)return this.b=0,this.Na(a),this.b=1,this;this.a[0]-=a;if(1===this.length&&0>this.a[0])this.a[0]=-this.a[0],this.b=1;else for(a=0;a<this.length&&0>this.a[a];a++)this.a[a]+=67108864,--this.a[a+1];
return this.L()};h.prototype.Ja=function(a,b,g){var f;this.Rb(a.length+g);var k=0;for(f=0;f<a.length;f++){var t=(this.a[f+g]|0)+k;k=(a.a[f]|0)*b;t-=k&67108863;k=(t>>26)-(k/67108864|0);this.a[f+g]=t&67108863}for(;f<this.length-g;f++)t=(this.a[f+g]|0)+k,k=t>>26,this.a[f+g]=t&67108863;if(0===k)return this.L();w(-1===k);for(f=k=0;f<this.length;f++)t=-(this.a[f]|0)+k,k=t>>26,this.a[f]=t&67108863;this.b=1;return this.L()};h.prototype.ic=function(a,b){var g=this.clone(),f=a,k=f.a[f.length-1]|0;a=26-this.fb(k);
0!==a&&(f=f.ld(a),g.ua(a),k=f.a[f.length-1]|0);var t=g.length-f.length;if("mod"!==b){var y=new h(null);y.length=t+1;y.a=Array(y.length);for(var A=0;A<y.length;A++)y.a[A]=0}A=g.clone().Ja(f,1,t);0===A.b&&(g=A,y&&(y.a[t]=1));for(--t;0<=t;t--){A=67108864*(g.a[f.length+t]|0)+(g.a[f.length+t-1]|0);A=Math.min(A/k|0,67108863);for(g.Ja(f,A,t);0!==g.b;)A--,g.b=0,g.Ja(f,1,t),g.w()||(g.b^=1);y&&(y.a[t]=A)}y&&y.L();g.L();"div"!==b&&0!==a&&g.j(a);return{u:y||null,J:g}};h.prototype.ga=function(a,b,g){w(!a.w());
if(this.w())return{u:new h(0),J:new h(0)};var f;if(0!==this.b&&0===a.b){var k=this.l().ga(a,b);"mod"!==b&&(f=k.u.l());if("div"!==b){var t=k.J.l();g&&0!==t.b&&t.B(a)}return{u:f,J:t}}return 0===this.b&&0!==a.b?(k=this.ga(a.l(),b),"mod"!==b&&(f=k.u.l()),{u:f,J:k.J}):0!==(this.b&a.b)?(k=this.l().ga(a.l(),b),"div"!==b&&(t=k.J.l(),g&&0!==t.b&&t.i(a)),{u:k.u,J:t}):a.length>this.length||0>this.cmp(a)?{u:new h(0),J:this}:1===a.length?"div"===b?{u:this.sc(a.a[0]),J:null}:"mod"===b?{u:null,J:new h(this.Da(a.a[0]))}:
{u:this.sc(a.a[0]),J:new h(this.Da(a.a[0]))}:this.ic(a,b)};h.prototype.u=function(a){return this.ga(a,"div",!1).u};h.prototype.S=function(a){return this.ga(a,"mod",!0).J};h.prototype.mb=function(a){var b=this.ga(a);if(b.J.w())return b.u;var g=0!==b.u.b?b.J.i(a):b.J,f=a.ab(1);a=a.T(1);g=g.cmp(f);return 0>g||1===a&&0===g?b.u:0!==b.u.b?b.u.Ca(1):b.u.Na(1)};h.prototype.Da=function(a){w(67108863>=a);for(var b=67108864%a,g=0,f=this.length-1;0<=f;f--)g=(b*g+(this.a[f]|0))%a;return g};h.prototype.tc=function(a){w(0===
a.b);w(!a.w());var b=this,g=a.clone();b=0!==b.b?b.S(a):b.clone();a=new h(1);for(var f=new h(0),k=new h(0),t=new h(1),y=0;b.Ra()&&g.Ra();)b.j(1),g.j(1),++y;for(var A=g.clone(),C=b.clone();!b.w();){for(var B=0,D=1;0===(b.a[0]&D)&&26>B;++B,D<<=1);if(0<B)for(b.j(B);0<B--;){if(a.Y()||f.Y())a.B(A),f.i(C);a.j(1);f.j(1)}B=0;for(D=1;0===(g.a[0]&D)&&26>B;++B,D<<=1);if(0<B)for(g.j(B);0<B--;){if(k.Y()||t.Y())k.B(A),t.i(C);k.j(1);t.j(1)}0<=b.cmp(g)?(b.i(g),a.i(k),f.i(t)):(g.i(b),k.i(a),t.i(f))}return{I:k,M:t,
Bd:g.ua(y)}};h.prototype.Zb=function(a){w(0===a.b);w(!a.w());var b=this,g=a.clone();b=0!==b.b?b.S(a):b.clone();for(var f=new h(1),k=new h(0),t=g.clone();0<b.m(1)&&0<g.m(1);){for(var y=0,A=1;0===(b.a[0]&A)&&26>y;++y,A<<=1);if(0<y)for(b.j(y);0<y--;)f.Y()&&f.B(t),f.j(1);y=0;for(A=1;0===(g.a[0]&A)&&26>y;++y,A<<=1);if(0<y)for(g.j(y);0<y--;)k.Y()&&k.B(t),k.j(1);0<=b.cmp(g)?(b.i(g),f.i(k)):(g.i(b),k.i(f))}b=0===b.m(1)?f:k;0>b.m(0)&&b.B(a);return b};h.prototype.Ba=function(a){return this.tc(a).I.S(a)};h.prototype.Ra=
function(){return 0===(this.a[0]&1)};h.prototype.Y=function(){return 1===(this.a[0]&1)};h.prototype.T=function(a){return this.a[0]&a};h.prototype.w=function(){return 1===this.length&&0===this.a[0]};h.prototype.m=function(a){var b=0>a;if(0!==this.b&&!b)return-1;if(0===this.b&&b)return 1;this.L();1<this.length?a=1:(b&&(a=-a),w(67108863>=a,"Number is too big"),b=this.a[0]|0,a=b===a?0:b<a?-1:1);return 0!==this.b?-a|0:a};h.prototype.cmp=function(a){if(0!==this.b&&0===a.b)return-1;if(0===this.b&&0!==a.b)return 1;
a=this.Db(a);return 0!==this.b?-a|0:a};h.prototype.Db=function(a){if(this.length>a.length)return 1;if(this.length<a.length)return-1;for(var b=0,g=this.length-1;0<=g;g--){var f=this.a[g]|0,k=a.a[g]|0;if(f!==k){f<k?b=-1:f>k&&(b=1);break}}return b};h.red=function(a){return new u(a)};h.prototype.A=function(a){w(!this.red,"Already a number in reduction context");w(0===this.b,"red works only with positives");return a.pc(this).ea(a)};h.prototype.ta=function(){w(this.red,"fromRed works only with numbers in reduction context");
return this.red.oc(this)};h.prototype.ea=function(a){this.red=a;return this};h.prototype.$=function(a){w(this.red,"redAdd works only with red numbers");return this.red.add(this,a)};h.prototype.s=function(a){w(this.red,"redIAdd works only with red numbers");return this.red.B(this,a)};h.prototype.aa=function(a){w(this.red,"redSub works only with red numbers");return this.red.sub(this,a)};h.prototype.h=function(a){w(this.red,"redISub works only with red numbers");return this.red.i(this,a)};h.prototype.c=
function(a){w(this.red,"redMul works only with red numbers");this.red.fa(this,a);return this.red.o(this,a)};h.prototype.f=function(){w(this.red,"redSqr works only with red numbers");this.red.za(this);return this.red.yb(this)};h.prototype.Uc=function(){w(this.red,"redSqrt works only with red numbers");this.red.za(this);return this.red.sqrt(this)};h.prototype.Za=function(){w(this.red,"redInvm works only with red numbers");this.red.za(this);return this.red.Ba(this)};h.prototype.la=function(){w(this.red,
"redNeg works only with red numbers");this.red.za(this);return this.red.l(this)};var z={Fd:null,Kd:null,Jd:null,Ld:null};x.prototype.cc=function(){var a=new h(null);a.a=Array(Math.ceil(this.n/13));return a};x.prototype.Kc=function(a){do{this.split(a,this.Ab);a=this.Ic(a);a=a.B(this.Ab);var b=a.U()}while(b>this.n);b=b<this.n?-1:a.Db(this.p);0===b?(a.a[0]=0,a.length=1):0<b?a.i(this.p):a.L();return a};(function(a,b){function g(){}a.fd=b;g.prototype=b.prototype;a.prototype=new g;a.prototype.constructor=
a})(d,x);d.prototype.split=function(a,b){for(var g=Math.min(a.length,9),f=0;f<g;f++)b.a[f]=a.a[f];b.length=g;if(9>=a.length)a.a[0]=0,a.length=1;else{g=a.a[9];b.a[b.length++]=g&4194303;for(f=10;f<a.length;f++)b=a.a[f]|0,a.a[f-10]=(b&4194303)<<4|g>>>22,g=b;g>>>=22;a.a[f-10]=g;a.length=0===g&&10<a.length?a.length-10:a.length-9}};d.prototype.Ic=function(a){a.a[a.length]=0;a.a[a.length+1]=0;a.length+=2;for(var b=0,g=0;g<a.length;g++){var f=a.a[g]|0;b+=977*f;a.a[g]=b&67108863;b=64*f+(b/67108864|0)}0===
a.a[a.length-1]&&(a.length--,0===a.a[a.length-1]&&a.length--);return a};h.P=function(a){if(z[a])return z[a];var b=new d;return z[a]=b};u.prototype.za=function(a){w(0===a.b,"red works only with positives");w(a.red,"red works only with red numbers")};u.prototype.fa=function(a,b){w(0===(a.b|b.b),"red works only with positives");w(a.red&&a.red===b.red,"red works only with red numbers")};u.prototype.Oa=function(a){return this.ja?this.ja.Kc(a).ea(this):a.S(this.G).ea(this)};u.prototype.l=function(a){return a.w()?
a.clone():this.G.sub(a).ea(this)};u.prototype.add=function(a,b){this.fa(a,b);a=a.add(b);0<=a.cmp(this.G)&&a.i(this.G);return a.ea(this)};u.prototype.B=function(a,b){this.fa(a,b);a=a.B(b);0<=a.cmp(this.G)&&a.i(this.G);return a};u.prototype.sub=function(a,b){this.fa(a,b);a=a.sub(b);0>a.m(0)&&a.B(this.G);return a.ea(this)};u.prototype.i=function(a,b){this.fa(a,b);a=a.i(b);0>a.m(0)&&a.B(this.G);return a};u.prototype.o=function(a,b){this.fa(a,b);return this.Oa(a.o(b))};u.prototype.yb=function(a){return this.o(a,
a)};u.prototype.sqrt=function(a){if(a.w())return a.clone();var b=this.G.T(3);w(1===b%2);if(3===b)return b=this.G.add(new h(1)).j(2),this.pow(a,b);for(var g=this.G.bd(1),f=0;!g.w()&&0===g.T(1);)f++,g.j(1);w(!g.w());b=(new h(1)).A(this);var k=b.la(),t=this.G.bd(1).j(1),y=this.G.U();for(y=(new h(2*y*y)).A(this);0!==this.pow(y,t).cmp(k);)y.s(k);t=this.pow(y,g);k=this.pow(a,g.wd(1).j(1));a=this.pow(a,g);for(g=f;0!==a.cmp(b);){y=a;for(f=0;0!==y.cmp(b);f++)y=y.f();w(f<g);t=this.pow(t,(new h(1)).ua(g-f-1));
k=k.c(t);t=t.f();a=a.c(t);g=f}return k};u.prototype.Ba=function(a){a=a.Zb(this.G);return 0!==a.b?(a.b=0,this.Oa(a).la()):this.Oa(a)};u.prototype.pow=function(a,b){if(b.w())return(new h(1)).A(this);if(0===b.m(1))return a.clone();var g=Array(16);g[0]=(new h(1)).A(this);g[1]=a;for(var f=2;f<g.length;f++)g[f]=this.o(g[f-1],a);a=g[0];var k=0,t=0,y=b.U()%26;0===y&&(y=26);for(f=b.length-1;0<=f;f--){var A=b.a[f];for(--y;0<=y;y--){var C=A>>y&1;a!==g[0]&&(a=this.yb(a));if(0===C&&0===k)t=0;else if(k<<=1,k|=
C,t++,4===t||0===f&&0===y)a=this.o(a,g[k]),k=t=0}y=26}return a};u.prototype.pc=function(a){var b=a.S(this.G);return b===a?b.clone():b};u.prototype.oc=function(a){a=a.clone();a.red=null;return a};return e}),Ia=Fa(function(){function q(){}function w(l){return l.length>>>1}var h={};h.Ib=q;h.pd=50;q.P=!0;h.Gd=q.P?2147483647:1073741823;q.from=function(l,m){var x=null,d=w(l,m)|0;if((q.P?2147483647:1073741823)<d)throw new RangeError("Invalid typed array length");q.P?(x=new Uint8Array(d),x.__proto__=q.prototype):
(null===x&&(x=new q(d)),x.length=d);l=x.write(l,m);l!==d&&(x=x.slice(0,l));return x};q.P&&(q.prototype.__proto__=Uint8Array.prototype,q.__proto__=Uint8Array,sa(),sa(),sa(),"undefined"!==typeof Symbol&&Symbol.species&&q[Symbol.species]===q&&(sa(),Object.defineProperty(q,Symbol.species,{value:null,configurable:!0})));q.isBuffer=function(l){return!(null==l||!l.$b)};q.byteLength=w;q.prototype.$b=!0;q.prototype.write=function(l){var m=this.length;var x=Number(0)||0;var d=this.length-x;m?(m=Number(m),m>
d&&(m=d)):m=d;d=l.length;if(0!==d%2)throw new TypeError("Invalid hex string");m>d/2&&(m=d/2);for(d=0;d<m;++d){var u=parseInt(l.substr(2*d,2),16);if(isNaN(u))break;this[x+d]=u}return d};return h}),Ja=Fa(function(){function q(w,h){if(!w)throw Error(h||"Assertion failed");}q.P=function(){};return q}),La=Fa(function(){var q={};Ha();var w=Ja(),h=Ka();q.assert=w;q.H=h.H;q.Fb=h.Fb;q.Bb=h.Bb;q.encode=h.encode;q.Fc=function(l,m,x){x=Array(Math.max(l.U(),x)+1);x.fill(0);m=1<<m+1;l=l.clone();for(var d=0;d<x.length;d++){var u,
e=l.T(m-1);l.Y()?(e>(m>>1)-1?u=(m>>1)-e:u=e,l.Ca(u)):u=0;x[d]=u;l.j(1)}return x};q.Ec=function(l,m){var x=[[],[]];l=l.clone();m=m.clone();for(var d=0,u=0;0<l.m(-d)||0<m.m(-u);){var e=l.T(3)+d&3,n=m.T(3)+u&3;3===e&&(e=-1);3===n&&(n=-1);if(0===(e&1))var v=0;else{var r=l.T(7)+d&7;v=3!==r&&5!==r||2!==n?e:-e}x[0].push(v);0===(n&1)?e=0:(r=m.T(7)+u&7,e=3!==r&&5!==r||2!==e?n:-n);x[1].push(e);2*d===v+1&&(d=1-d);2*u===e+1&&(u=1-u);l.j(1);m.j(1)}return x};q.Nd=function(){};q.Ed=function(){};return q}),Ma=Fa(function(){var q=
{},w=Ja(),h=Ga();q.Jc=h;q.H=function(l,m){if(Array.isArray(l))return l.slice();if(!l)return[];var x=[];if("string"===typeof l)if(!m)for(var d=m=0;d<l.length;d++){var u=l.charCodeAt(d);128>u?x[m++]=u:(2048>u?x[m++]=u>>6|192:(x[m++]=u>>12|224,x[m++]=u>>6&63|128),x[m++]=u&63|128)}else{if("hex"===m)for(l=l.replace(/[^a-z0-9]+/ig,""),0!==l.length%2&&(l="0"+l),d=0;d<l.length;d+=2)x.push(parseInt(l[d]+l[d+1],16))}else for(d=0;d<l.length;d++)x[d]=l[d]|0;return x};q.Lc=function(l,m,x){m-=0;w(0===m%4);m=Array(m/
4);for(var d=0,u=0;d<m.length;d++,u+=4)m[d]=("big"===x?l[u]<<24|l[u+1]<<16|l[u+2]<<8|l[u+3]:l[u+3]<<24|l[u+2]<<16|l[u+1]<<8|l[u])>>>0;return m};q.ad=function(l){for(var m=Array(4*l.length),x=0,d=0;x<l.length;x++,d+=4){var u=l[x];m[d]=u>>>24;m[d+1]=u>>>16&255;m[d+2]=u>>>8&255;m[d+3]=u&255}return m};q.Vc=function(l,m){return l>>>m|l<<32-m};q.cd=function(l,m){return l+m>>>0};q.dd=function(l,m,x,d){return l+m+x+d>>>0};q.ed=function(l,m,x,d,u){return l+m+x+d+u>>>0};return q}),Na=Fa(function(){function q(h,
l){return l.length===2*h+2?l:q(h,"0x0"+l.slice(2))}var w={};return w={length:function(h){return(h.length-2)/2},flatten:function(h){return"0x"+h.reduce(function(l,m){return l+m.slice(2)},"")},slice:function(h,l,m){return"0x"+m.slice(2*h+2,2*l+2)},tb:q,xc:function(h){h=h.toString(16);return 0===h.length%2?"0x"+h:"0x0"+h},jd:function(h){return parseInt(h.slice(2),16)},pb:function(h){return"0x0"===h?"0x":0===h.length%2?h:"0x0"+h.slice(2)},Qd:function(h){return"0"===h[2]?"0x"+h.slice(3):h}}}),Oa=Fa(function(){function q(){this.pending=
null;this.Ya=0;this.X=this.constructor.X;this.va=this.constructor.va;this.Ma=this.constructor.Ma;this.ia=this.constructor.ia/8;this.nb="big";this.Ha=this.X/8;this.Lb=this.X/32}var w={},h=Ma(),l=Ja();w.Hb=q;q.prototype.update=function(m,x){m=h.H(m,x);this.pending?this.pending=this.pending.concat(m):this.pending=m;this.Ya+=m.length;if(this.pending.length>=this.Ha)for(m=this.pending,x=m.length%this.Ha,this.pending=m.slice(m.length-x,m.length),0===this.pending.length&&(this.pending=null),m=h.Lc(m,m.length-
x,this.nb),x=0;x<m.length;x+=this.Lb)this.ra(m,x);return this};q.prototype.digest=function(m){this.update(this.ac());l(null===this.pending);return this.Mb(m)};q.prototype.ac=function(){var m=this.Ya,x=this.Ha,d=x-(m+this.ia)%x;x=Array(d+this.ia);x[0]=128;for(var u=1;u<d;u++)x[u]=0;m<<=3;if("big"===this.nb){for(d=8;d<this.ia;d++)x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=m>>>24&255;x[u++]=m>>>16&255;x[u++]=m>>>8&255;x[u++]=m&255}else for(x[u++]=m&255,x[u++]=m>>>8&255,x[u++]=m>>>16&255,x[u++]=
m>>>24&255,x[u++]=0,x[u++]=0,x[u++]=0,x[u++]=0,d=8;d<this.ia;d++)x[u++]=0;return x};return w}),Pa=Fa(function(){function q(d){var u;for(u=0;48>u;u+=2){var e=d[0]^d[10]^d[20]^d[30]^d[40];var n=d[1]^d[11]^d[21]^d[31]^d[41];var v=d[2]^d[12]^d[22]^d[32]^d[42];var r=d[3]^d[13]^d[23]^d[33]^d[43];var c=d[4]^d[14]^d[24]^d[34]^d[44];var z=d[5]^d[15]^d[25]^d[35]^d[45];var a=d[6]^d[16]^d[26]^d[36]^d[46];var b=d[7]^d[17]^d[27]^d[37]^d[47];var g=d[8]^d[18]^d[28]^d[38]^d[48];var f=d[9]^d[19]^d[29]^d[39]^d[49];
var k=g^(v<<1|r>>>31);var t=f^(r<<1|v>>>31);d[0]^=k;d[1]^=t;d[10]^=k;d[11]^=t;d[20]^=k;d[21]^=t;d[30]^=k;d[31]^=t;d[40]^=k;d[41]^=t;k=e^(c<<1|z>>>31);t=n^(z<<1|c>>>31);d[2]^=k;d[3]^=t;d[12]^=k;d[13]^=t;d[22]^=k;d[23]^=t;d[32]^=k;d[33]^=t;d[42]^=k;d[43]^=t;k=v^(a<<1|b>>>31);t=r^(b<<1|a>>>31);d[4]^=k;d[5]^=t;d[14]^=k;d[15]^=t;d[24]^=k;d[25]^=t;d[34]^=k;d[35]^=t;d[44]^=k;d[45]^=t;k=c^(g<<1|f>>>31);t=z^(f<<1|g>>>31);d[6]^=k;d[7]^=t;d[16]^=k;d[17]^=t;d[26]^=k;d[27]^=t;d[36]^=k;d[37]^=t;d[46]^=k;d[47]^=
t;k=a^(e<<1|n>>>31);t=b^(n<<1|e>>>31);d[8]^=k;d[9]^=t;d[18]^=k;d[19]^=t;d[28]^=k;d[29]^=t;d[38]^=k;d[39]^=t;d[48]^=k;d[49]^=t;k=d[0];t=d[1];var y=d[11]<<4|d[10]>>>28;var A=d[10]<<4|d[11]>>>28;var C=d[20]<<3|d[21]>>>29;var B=d[21]<<3|d[20]>>>29;var D=d[31]<<9|d[30]>>>23;var K=d[30]<<9|d[31]>>>23;var E=d[40]<<18|d[41]>>>14;var T=d[41]<<18|d[40]>>>14;var F=d[2]<<1|d[3]>>>31;var X=d[3]<<1|d[2]>>>31;e=d[13]<<12|d[12]>>>20;n=d[12]<<12|d[13]>>>20;var G=d[22]<<10|d[23]>>>22;var Y=d[23]<<10|d[22]>>>22;var H=
d[33]<<13|d[32]>>>19;var Z=d[32]<<13|d[33]>>>19;var I=d[42]<<2|d[43]>>>30;var aa=d[43]<<2|d[42]>>>30;var J=d[5]<<30|d[4]>>>2;var ba=d[4]<<30|d[5]>>>2;var U=d[14]<<6|d[15]>>>26;var V=d[15]<<6|d[14]>>>26;v=d[25]<<11|d[24]>>>21;r=d[24]<<11|d[25]>>>21;var L=d[34]<<15|d[35]>>>17;var ca=d[35]<<15|d[34]>>>17;var da=d[45]<<29|d[44]>>>3;var M=d[44]<<29|d[45]>>>3;g=d[6]<<28|d[7]>>>4;f=d[7]<<28|d[6]>>>4;var ea=d[17]<<23|d[16]>>>9;var N=d[16]<<23|d[17]>>>9;var fa=d[26]<<25|d[27]>>>7;var O=d[27]<<25|d[26]>>>7;
c=d[36]<<21|d[37]>>>11;z=d[37]<<21|d[36]>>>11;var ha=d[47]<<24|d[46]>>>8;var P=d[46]<<24|d[47]>>>8;var ia=d[8]<<27|d[9]>>>5;var Q=d[9]<<27|d[8]>>>5;var ja=d[18]<<20|d[19]>>>12;var R=d[19]<<20|d[18]>>>12;var ka=d[29]<<7|d[28]>>>25;var S=d[28]<<7|d[29]>>>25;var la=d[38]<<8|d[39]>>>24;var W=d[39]<<8|d[38]>>>24;a=d[48]<<14|d[49]>>>18;b=d[49]<<14|d[48]>>>18;d[0]=k^~e&v;d[1]=t^~n&r;d[10]=g^~ja&C;d[11]=f^~R&B;d[20]=F^~U&fa;d[21]=X^~V&O;d[30]=ia^~y&G;d[31]=Q^~A&Y;d[40]=J^~ea&ka;d[41]=ba^~N&S;d[2]=e^~v&c;
d[3]=n^~r&z;d[12]=ja^~C&H;d[13]=R^~B&Z;d[22]=U^~fa&la;d[23]=V^~O&W;d[32]=y^~G&L;d[33]=A^~Y&ca;d[42]=ea^~ka&D;d[43]=N^~S&K;d[4]=v^~c&a;d[5]=r^~z&b;d[14]=C^~H&da;d[15]=B^~Z&M;d[24]=fa^~la&E;d[25]=O^~W&T;d[34]=G^~L&ha;d[35]=Y^~ca&P;d[44]=ka^~D&I;d[45]=S^~K&aa;d[6]=c^~a&k;d[7]=z^~b&t;d[16]=H^~da&g;d[17]=Z^~M&f;d[26]=la^~E&F;d[27]=W^~T&X;d[36]=L^~ha&ia;d[37]=ca^~P&Q;d[46]=D^~I&J;d[47]=K^~aa&ba;d[8]=a^~k&e;d[9]=b^~t&n;d[18]=da^~g&ja;d[19]=M^~f&R;d[28]=E^~F&U;d[29]=T^~X&V;d[38]=ha^~ia&y;d[39]=P^~Q&A;d[48]=
I^~J&ea;d[49]=aa^~ba&N;d[0]^=x[u];d[1]^=x[u+1]}}var w={},h="0123456789abcdef".split(""),l=[1,256,65536,16777216],m=[0,8,16,24],x=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648];return w={rb:function(d){return function(u,
e){var n,v;if("0x"!==u.slice(0,2)||(void 0===e?0:e))var r=u;else for(r=[],e=2,v=u.length;e<v;e+=2)r.push(parseInt(u.slice(e,e+2),16));v=[0,0,0,0,0,0,0,0,0,0];var c=!0;var z=n=0;u=1600-(d<<1)>>5;e=d>>5;v=v.concat(v,v,v,v);var a=void 0;for(var b=r,g=b.length,f=[],k=u<<2,t=0;t<g;){if(c)for(c=!1,f[0]=n,r=1;r<u+1;++r)f[r]=0;if("string"!==typeof b)for(r=z;t<g&&r<k;++t)f[r>>2]|=b[t]<<m[r++&3];else for(r=z;t<g&&r<k;++t)z=b.charCodeAt(t),128>z?f[r>>2]|=z<<m[r++&3]:(2048>z?f[r>>2]|=(192|z>>6)<<m[r++&3]:(55296>
z||57344<=z?f[r>>2]|=(224|z>>12)<<m[r++&3]:(z=65536+((z&1023)<<10|b.charCodeAt(++t)&1023),f[r>>2]|=(240|z>>18)<<m[r++&3],f[r>>2]|=(128|z>>12&63)<<m[r++&3]),f[r>>2]|=(128|z>>6&63)<<m[r++&3]),f[r>>2]|=(128|z&63)<<m[r++&3]);a=r;if(r>=k){z=r-k;n=f[u];for(r=0;r<u;++r)v[r]^=f[r];q(v);c=!0}else z=r}r=a;f[r>>2]|=l[r&3];if(a===k)for(f[0]=f[u],r=1;r<u+1;++r)f[r]=0;f[u-1]|=2147483648;for(r=0;r<u;++r)v[r]^=f[r];q(v);c="";for(n=0;n<e;){for(r=0;r<u&&n<e;++r,++n)z=v[r],c+=h[z>>4&15]+h[z&15]+h[z>>12&15]+h[z>>8&15]+
h[z>>20&15]+h[z>>16&15]+h[z>>28&15]+h[z>>24&15];0===n%u&&q(v)}return"0x"+c}}(256)}}),Sa=Fa(function(){var q={};q.md=La();q.yd=Qa();q.sa=Ra();return q}),Ta=Fa(function(){function q(u,e){this.type=u;this.p=new h(e.p,16);this.red=e.ja?h.red(e.ja):h.Hd(this.p);this.od=(new h(0)).A(this.red);this.Ea=(new h(1)).A(this.red);this.kd=(new h(2)).A(this.red);this.n=e.n&&new h(e.n,16);this.v=e.v&&this.Qc(e.v,e.Cc);this.dc=Array(4);this.ec=Array(4);this.fc=Array(4);this.hc=Array(4);this.Ga=this.n?this.n.U():0;
u=this.n&&this.p.u(this.n);!u||0<u.m(100)||this.n.A(this.red)}function w(u,e){this.curve=u;this.type=e;this.D=null}var h=Ha(),l=La(),m=l.Fc,x=l.Ec,d=l.assert;q.prototype.Sb=function(u,e){d(u.D);u=u.ib();var n=m(e,1,this.Ga),v=(1<<u.step+1)-(0===u.step%2?2:1);v/=3;for(var r=[],c=0;c<n.length;c+=u.step){for(var z=0,a=c+u.step-1;e>=c;e--)z=(z<<1)+n[a];r.push(z)}e=this.O(null,null,null);for(n=this.O(null,null,null);0<v;v--){for(c=0;c<r.length;c++)z=r[c],z===v?n=n.ca(u.C[c]):z===-v&&(n=n.ca(u.C[c].l()));
e=e.add(n)}return e.Cb()};q.prototype.lb=function(u,e,n,v){for(var r=this.dc,c=this.ec,z=this.fc,a=0,b=0;b<n;b++){var g=u[b],f=g.jb(1);r[b]=f.da;c[b]=f.C}for(b=n-1;1<=b;b-=2){var k=b-1,t=b;if(1!==r[k]||1!==r[t])z[k]=m(e[k],r[k],this.Ga),z[t]=m(e[t],r[t],this.Ga),a=Math.max(z[k].length,a),a=Math.max(z[t].length,a);else{var y=[u[k],null,null,u[t]];0===u[k].y.cmp(u[t].y)?(y[1]=u[k].add(u[t]),y[2]=u[k].xa().ca(u[t].l())):0===u[k].y.cmp(u[t].y.la())?(y[1]=u[k].xa().ca(u[t]),y[2]=u[k].add(u[t].l())):(y[1]=
u[k].xa().ca(u[t]),y[2]=u[k].xa().ca(u[t].l()));var A=[-3,-1,-5,-7,0,7,5,1,3],C=x(e[k],e[t]);a=Math.max(C[0].length,a);z[k]=Array(a);z[t]=Array(a);for(f=0;f<a;f++)z[k][f]=A[3*((C[0][f]|0)+1)+((C[1][f]|0)+1)],z[t][f]=0,c[k]=y}}u=this.O(null,null,null);e=this.hc;for(b=a;0<=b;b--){for(a=0;0<=b;){r=!0;for(f=0;f<n;f++)e[f]=z[f][b]|0,0!==e[f]&&(r=!1);if(!r)break;a++;b--}0<=b&&a++;u=u.rc(a);if(0>b)break;for(f=0;f<n;f++)a=e[f],0!==a&&(0<a?g=c[f][a-1>>1]:0>a&&(g=c[f][-a-1>>1].l()),u="affine"===g.type?u.ca(g):
u.add(g))}for(b=0;b<n;b++)c[b]=null;return v?u:u.Cb()};q.ya=w;w.prototype.cb=function(){return this.curve.cb(this)};w.prototype.Nb=function(u){var e=this.curve.p.byteLength(),n=this.qb().H("be",e);return u?[this.La().Ra()?2:3].concat(n):[4].concat(n,this.La().H("be",e))};w.prototype.encode=function(u,e){return l.encode(this.Nb(e),u)};w.prototype.Rc=function(u){if(!this.D){var e={F:null,K:null,beta:null};e.K=this.jb(8);e.F=this.ib(4,u);e.beta=this.hb();this.D=e}};w.prototype.Vb=function(u){if(!this.D)return!1;
var e=this.D.F;return e?e.C.length>=Math.ceil((u.U()+1)/e.step):!1};w.prototype.ib=function(u,e){if(this.D&&this.D.F)return this.D.F;for(var n=[this],v=this,r=0;r<e;r+=u){for(var c=0;c<u;c++)v=v.ba();n.push(v)}return{step:u,C:n}};w.prototype.jb=function(u){if(this.D&&this.D.K)return this.D.K;for(var e=[this],n=(1<<u)-1,v=1===n?null:this.ba(),r=1;r<n;r++)e[r]=e[r-1].add(v);return{da:u,C:e}};return q}),Qa=Fa(function(){function q(m){this.curve=new (Ua())(m);this.v=this.curve.v;this.n=this.curve.n;this.hash=
m.hash;l(this.v.cb(),"Invalid curve");l(this.v.o(this.n).R(),"Invalid curve, G*N != O")}var w={},h=Va(),l=La().assert;w.Jb=q;(function(m,x){Object.defineProperty(w,m,{configurable:!0,enumerable:!0,get:function(){var d=new q(x);Object.defineProperty(w,m,{configurable:!0,enumerable:!0,value:d});return d}})})("secp256k1",{type:"short",ja:"k256",p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",I:"0",M:"7",n:"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
g:"1",hash:h.$a,beta:"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",Va:"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",Aa:[{I:"3086d221a7d46bcde86c90e49284eb15",M:"-e4437ed6010e88286f547fa90abfe4c3"},{I:"114ca50f7a8e2f3f657c1108d9d44cfd8",M:"3086d221a7d46bcde86c90e49284eb15"}],Cc:!1,v:["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",{}]});return w}),Va=Fa(function(){var q={};
q.md=Ma();q.xd=Oa();q.Yc={$a:Wa()};q.Hc=Xa();q.$a=q.Yc.$a;return q}),Ka=Fa(function(){function q(l){return 1===l.length?"0"+l:l}function w(l){for(var m="",x=0;x<l.length;x++)m+=q(l[x].toString(16));return m}var h={H:function(l,m){if(Array.isArray(l))return l.slice();if(!l)return[];var x=[];if("string"!==typeof l){for(m=0;m<l.length;m++)x[m]=l[m]|0;return x}if("hex"===m)for(l=l.replace(/[^a-z0-9]+/ig,""),0!==l.length%2&&(l="0"+l),m=0;m<l.length;m+=2)x.push(parseInt(l[m]+l[m+1],16));else for(m=0;m<
l.length;m++){var d=l.charCodeAt(m),u=d>>8;d&=255;u?x.push(u,d):x.push(d)}return x}};h.Fb=q;h.Bb=w;h.encode=function(l,m){return"hex"===m?w(l):l};return h}),Ya=Fa(function(){var q={},w=Ma().Vc;q.Ad=function(){};q.nc=function(h,l,m){return h&l^~h&m};q.Mc=function(h,l,m){return h&l^h&m^l&m};q.Md=function(){};q.Wc=function(h){return w(h,2)^w(h,13)^w(h,22)};q.Xc=function(h){return w(h,6)^w(h,11)^w(h,25)};q.Ac=function(h){return w(h,7)^w(h,18)^h>>>3};q.Bc=function(h){return w(h,17)^w(h,19)^h>>>10};return q}),
Wa=Fa(function(){function q(){if(!(this instanceof q))return new q;a.call(this);this.g=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];this.k=b;this.Kb=Array(64)}var w=Ma(),h=Oa(),l=Ya(),m=Ja(),x=w.cd,d=w.dd,u=w.ed,e=l.nc,n=l.Mc,v=l.Wc,r=l.Xc,c=l.Ac,z=l.Bc,a=h.Hb,b=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];w.Jc(q,
a);q.X=512;q.va=256;q.Ma=192;q.ia=64;q.prototype.ra=function(g,f){for(var k=this.Kb,t=0;16>t;t++)k[t]=g[f+t];for(;t<k.length;t++)k[t]=d(z(k[t-2]),k[t-7],c(k[t-15]),k[t-16]);g=this.g[0];f=this.g[1];var y=this.g[2],A=this.g[3],C=this.g[4],B=this.g[5],D=this.g[6],K=this.g[7];m(this.k.length===k.length);for(t=0;t<k.length;t++){var E=u(K,r(C),e(C,B,D),this.k[t],k[t]),T=x(v(g),n(g,f,y));K=D;D=B;B=C;C=x(A,E);A=y;y=f;f=g;g=x(E,T)}this.g[0]=x(this.g[0],g);this.g[1]=x(this.g[1],f);this.g[2]=x(this.g[2],y);
this.g[3]=x(this.g[3],A);this.g[4]=x(this.g[4],C);this.g[5]=x(this.g[5],B);this.g[6]=x(this.g[6],D);this.g[7]=x(this.g[7],K)};q.prototype.Mb=function(g){return"hex"===g?w.Pd(this.g,"big"):w.ad(this.g)};return q}),Ua=Fa(function(){function q(e){d.call(this,"short",e);this.I=(new m(e.I,16)).A(this.red);this.M=(new m(e.M,16)).A(this.red);this.gd=this.kd.Za();this.eb=0===this.I.ta().m(0);this.zb=0===this.I.ta().sub(this.p).m(-3);this.ha=this.Ub(e);this.Pb=Array(4);this.Qb=Array(4)}function w(e,n,v,r){d.ya.call(this,
e,"affine");null===n&&null===v?(this.y=this.x=null,this.V=!0):(this.x=new m(n,16),this.y=new m(v,16),r&&(this.x.wc(this.curve.red),this.y.wc(this.curve.red)),this.x.red||(this.x=this.x.A(this.curve.red)),this.y.red||(this.y=this.y.A(this.curve.red)),this.V=!1)}function h(e,n,v,r){d.ya.call(this,e,"jacobian");null===n&&null===v&&null===r?(this.y=this.x=this.curve.Ea,this.z=new m(0)):(this.x=new m(n,16),this.y=new m(v,16),this.z=new m(r,16));this.x.red||(this.x=this.x.A(this.curve.red));this.y.red||
(this.y=this.y.A(this.curve.red));this.z.red||(this.z=this.z.A(this.curve.red));this.nd=this.z===this.curve.Ea}var l={};l=La();var m=Ha(),x=Ga(),d=Ta(),u=l.assert;x(q,d);l=q;q.prototype.Ub=function(e){if(this.eb&&this.v&&this.n&&1===this.p.Da(3)){if(e.beta)var n=(new m(e.beta,16)).A(this.red);else n=this.Tb(this.p),n=0>n[0].cmp(n[1])?n[0]:n[1],n=n.A(this.red);if(e.Va)var v=new m(e.Va,16);else v=this.Tb(this.n),0===this.v.o(v[0]).x.cmp(this.v.x.c(n))?v=v[0]:(v=v[1],u(0===this.v.o(v).x.cmp(this.v.x.c(n))));
var r;e.Aa?r=e.Aa.map(function(c){return{I:new m(c.I,16),M:new m(c.M,16)}}):r=this.rd(v);return{beta:n,Va:v,Aa:r}}};q.prototype.Ob=function(e){var n=this.ha.Aa,v=n[0],r=n[1],c=r.M.o(e).mb(this.n),z=v.M.l().o(e).mb(this.n);n=c.o(v.I);var a=z.o(r.I);v=c.o(v.M);r=z.o(r.M);e=e.sub(n).sub(a);n=v.add(r).l();return{Sa:e,Ta:n}};q.prototype.wb=function(e,n){e=new m(e,16);e.red||(e=e.A(this.red));var v=e.f().c(e).s(e.c(this.I)).s(this.M),r=v.Uc();if(0!==r.f().aa(v).cmp(this.od))throw Error("invalid point");
v=r.ta().Y();if(n&&!v||!n&&v)r=r.la();return this.W(e,r)};q.prototype.cb=function(e){if(e.V)return!0;var n=e.x;e=e.y;var v=this.I.c(n);n=n.f().c(n).s(v).s(this.M);return 0===e.f().h(n).m(0)};q.prototype.gb=function(e,n){for(var v=this.Pb,r=this.Qb,c=0;c<e.length;c++){var z=this.Ob(n[c]),a=e[c],b=a.hb();z.Sa.b&&(z.Sa.Pa(),a=a.l(!0));z.Ta.b&&(z.Ta.Pa(),b=b.l(!0));v[2*c]=a;v[2*c+1]=b;r[2*c]=z.Sa;r[2*c+1]=z.Ta}e=this.lb(v,r,2*c,void 0);for(n=0;n<2*c;n++)v[n]=null,r[n]=null;return e};x(w,d.ya);q.prototype.W=
function(e,n,v){return new w(this,e,n,v)};q.prototype.Qc=function(e,n){return w.P(this,e,n)};w.prototype.hb=function(){if(this.curve.ha){var e=this.D;if(e&&e.beta)return e.beta;var n=this.curve.W(this.x.c(this.curve.ha.beta),this.y);if(e){var v=this.curve,r=function(c){return v.W(c.x.c(v.ha.beta),c.y)};e.beta=n;n.D={beta:null,K:e.K&&{da:e.K.da,C:e.K.C.map(r)},F:e.F&&{step:e.F.step,C:e.F.C.map(r)}}}return n}};w.prototype.toJSON=function(){};w.P=function(e,n,v){function r(z){return e.W(z[0],z[1],v)}
"string"===typeof n&&(n=JSON.parse(n));var c=e.W(n[0],n[1],v);if(!n[2])return c;n=n[2];c.D={beta:null,F:n.F&&{step:n.F.step,C:[c].concat(n.F.C.map(r))},K:n.K&&{da:n.K.da,C:[c].concat(n.K.C.map(r))}};return c};w.prototype.R=function(){return this.V};w.prototype.add=function(e){if(this.V)return e;if(e.V)return this;if(this.ob(e))return this.ba();if(this.l().ob(e)||0===this.x.cmp(e.x))return this.curve.W(null,null);var n=this.y.aa(e.y);0!==n.m(0)&&(n=n.c(this.x.aa(e.x).Za()));e=n.f().h(this.x).h(e.x);
n=n.c(this.x.aa(e)).h(this.y);return this.curve.W(e,n)};w.prototype.qb=function(){return this.x.ta()};w.prototype.La=function(){return this.y.ta()};w.prototype.o=function(e){e=new m(e,16);return this.R()?this:this.Vb(e)?this.curve.Sb(this,e):this.curve.ha?this.curve.gb([this],[e]):this.curve.vd(this,e)};w.prototype.Nc=function(e,n,v){n=[this,n];e=[e,v];return this.curve.ha?this.curve.gb(n,e):this.curve.lb(n,e,2)};w.prototype.ob=function(e){return this===e||this.V===e.V&&(this.V||0===this.x.cmp(e.x)&&
0===this.y.cmp(e.y))};w.prototype.l=function(e){if(this.V)return this;var n=this.curve.W(this.x,this.y.la());if(e&&this.D){e=this.D;var v=function(r){return r.l()};n.D={K:e.K&&{da:e.K.da,C:e.K.C.map(v)},F:e.F&&{step:e.F.step,C:e.F.C.map(v)}}}return n};w.prototype.xa=function(){return this.V?this.curve.O(null,null,null):this.curve.O(this.x,this.y,this.curve.Ea)};x(h,d.ya);q.prototype.O=function(e,n,v){return new h(this,e,n,v)};h.prototype.Cb=function(){if(this.R())return this.curve.W(null,null);var e=
this.z.Za(),n=e.f(),v=this.x.c(n);e=this.y.c(n).c(e);return this.curve.W(v,e)};h.prototype.l=function(){return this.curve.O(this.x,this.y.la(),this.z)};h.prototype.add=function(e){if(this.R())return e;if(e.R())return this;var n=e.z.f(),v=this.z.f(),r=this.x.c(n),c=e.x.c(v);n=this.y.c(n.c(e.z));v=e.y.c(v.c(this.z));c=r.aa(c);v=n.aa(v);if(0===c.m(0))return 0!==v.m(0)?this.curve.O(null,null,null):this.ba();var z=c.f(),a=z.c(c);z=r.c(z);r=v.f().s(a).h(z).h(z);n=v.c(z.h(r)).h(n.c(a));e=this.z.c(e.z).c(c);
return this.curve.O(r,n,e)};h.prototype.ca=function(e){if(this.R())return e.xa();if(e.R())return this;var n=this.z.f(),v=this.x,r=e.x.c(n),c=this.y;e=e.y.c(n).c(this.z);r=v.aa(r);e=c.aa(e);if(0===r.m(0))return 0!==e.m(0)?this.curve.O(null,null,null):this.ba();var z=r.f();n=z.c(r);z=v.c(z);v=e.f().s(n).h(z).h(z);c=e.c(z.h(v)).h(c.c(n));r=this.z.c(r);return this.curve.O(v,c,r)};h.prototype.rc=function(e){if(0===e||this.R())return this;if(!e)return this.ba();if(this.curve.eb||this.curve.zb){for(var n=
this,v=0;v<e;v++)n=n.ba();return n}n=this.curve.I;var r=this.curve.gd,c=this.x;v=this.y;var z=this.z,a=z.f().f(),b=v.$(v);for(v=0;v<e;v++){var g=c.f(),f=b.f(),k=f.f();g=g.$(g).s(g).s(n.c(a));f=c.c(f);c=g.f().h(f.$(f));f=f.h(c);g=g.c(f);g=g.s(g).h(k);z=b.c(z);v+1<e&&(a=a.c(k));b=g}return this.curve.O(c,b.c(r),z)};h.prototype.ba=function(){return this.R()?this:this.curve.eb?this.jc():this.curve.zb?this.ud():this.qd()};h.prototype.jc=function(){if(this.nd){var e=this.x.f();var n=this.y.f();var v=n.f();
n=this.x.$(n).f().h(e).h(v);n=n.s(n);e=e.$(e).s(e);var r=e.f().h(n).h(n),c=v.s(v);c=c.s(c);c=c.s(c);v=r;n=e.c(n.h(r)).h(c);e=this.y.$(this.y)}else e=this.x.f(),n=this.y.f(),v=n.f(),n=this.x.$(n).f().h(e).h(v),n=n.s(n),e=e.$(e).s(e),r=e.f(),c=v.s(v),c=c.s(c),c=c.s(c),v=r.h(n).h(n),n=e.c(n.h(v)).h(c),e=this.y.c(this.z),e=e.s(e);return this.curve.O(v,n,e)};h.prototype.R=function(){return 0===this.z.m(0)};return l}),Xa=Fa(function(){function q(l,m,x){if(!(this instanceof q))return new q(l,m,x);this.Fa=
l;this.X=l.X/8;this.va=l.va/8;this.Xa=this.Qa=null;this.pa(w.H(m,x))}var w=Ma(),h=Ja();q.prototype.pa=function(l){l.length>this.X&&(l=(new this.Fa).update(l).digest());h(l.length<=this.X);for(var m=l.length;m<this.X;m++)l.push(0);for(m=0;m<l.length;m++)l[m]^=54;this.Qa=(new this.Fa).update(l);for(m=0;m<l.length;m++)l[m]^=106;this.Xa=(new this.Fa).update(l)};q.prototype.update=function(l,m){this.Qa.update(l,m);return this};q.prototype.digest=function(l){this.Xa.update(this.Qa.digest());return this.Xa.digest(l)};
return q}),Ra=Fa(function(){function q(e){if(!(this instanceof q))return new q(e);"string"===typeof e&&(x(m.hasOwnProperty(e),"Unknown curve "+e),e=m[e]);e instanceof m.Jb&&(e={curve:e});this.curve=e.curve.curve;this.n=this.curve.n;this.Pc=this.n.ab(1);this.v=this.curve.v;this.v=e.curve.v;this.v.Rc(e.curve.n.U()+1);this.hash=e.hash||e.curve.hash}var w=Ha(),h=Za(),l=La(),m=Qa(),x=l.assert,d=$a(),u=ab();q.prototype.Ua=function(e,n){return d.yc(this,e,n)};q.prototype.kb=function(e,n){var v=8*e.byteLength()-
this.n.U();0<v&&(e=e.ab(v));return!n&&0<=e.cmp(this.n)?e.sub(this.n):e};q.prototype.sign=function(e,n,v,r){"object"===typeof v&&(r=v,v=null);r||(r={});n=this.Ua(n,v);e=this.kb(new w(e,16));var c=this.n.byteLength();v=n.Z.H("be",c);c=e.H("be",c);c=new h({hash:this.hash,uc:v,nonce:c,ub:r.ub,vb:r.vb||"utf8"});for(var z=this.n.sub(new w(1)),a=0;;a++){var b=r.k?r.k(a):new w(c.Dc(this.n.byteLength()));b=this.kb(b,!0);if(!(0>=b.m(1)||0<=b.cmp(z))){var g=this.v.o(b);if(!g.R()){var f=g.qb();v=f.S(this.n);
if(0!==v.m(0)&&(b=b.Ba(this.n).o(v.o(n.Z).B(e)),b=b.S(this.n),0!==b.m(0)))return e=(g.La().Y()?1:0)|(0!==f.cmp(v)?2:0),r.mc&&0<b.cmp(this.Pc)&&(b=this.n.sub(b),e^=1),new u({r:v,ma:b,wa:e})}}}};q.prototype.Tc=function(e,n,v){x((3&v)===v,"The recovery param is more than two bits");n=new u(n,void 0);var r=this.n,c=new w(e);e=n.r;var z=n.ma,a=v&1;v>>=1;if(0<=e.cmp(this.curve.p.S(this.curve.n))&&v)throw Error("Unable to find sencond key candinate");e=v?this.curve.wb(e.add(this.curve.n),a):this.curve.wb(e,
a);n=n.r.Ba(r);c=r.sub(c).o(n).S(r);r=z.o(n).S(r);return this.v.Nc(c,e,r)};return q}),Za=Fa(function(){function q(m){if(!(this instanceof q))return new q(m);this.hash=m.hash;this.sb=this.hash.va;this.Wa=m.Wa||this.hash.Ma;this.N=this.na=this.xb=this.Ka=null;var x=h.H(m.uc,m.zd||"hex"),d=h.H(m.nonce,m.Id||"hex");m=h.H(m.ub,m.vb||"hex");l(x.length>=this.Wa/8,"Not enough entropy. Minimum is: "+this.Wa+" bits");this.pa(x,d,m)}var w=Va(),h=Ka(),l=Ja();q.prototype.pa=function(m,x,d){m=m.concat(x).concat(d);
this.na=Array(this.sb/8);this.N=Array(this.sb/8);for(x=0;x<this.N.length;x++)this.na[x]=0,this.N[x]=1;this.ra(m);this.Ka=1;this.xb=281474976710656};q.prototype.oa=function(){return new w.Hc(this.hash,this.na)};q.prototype.ra=function(m){var x=this.oa().update(this.N).update([0]);m&&(x=x.update(m));this.na=x.digest();this.N=this.oa().update(this.N).digest();m&&(this.na=this.oa().update(this.N).update([1]).update(m).digest(),this.N=this.oa().update(this.N).digest())};q.prototype.Dc=function(m){if(this.Ka>
this.xb)throw Error("Reseed is required");if("string"!==typeof u){var x=d;var d=u;var u=null}d&&(d=h.H(d,x||"hex"),this.ra(d));for(x=[];x.length<m;)this.N=this.oa().update(this.N).digest(),x=x.concat(this.N);m=x.slice(0,m);this.ra(d);this.Ka++;return h.encode(m,u)};return q}),$a=Fa(function(){function q(h,l){this.sa=h;this.ka=this.Z=null;l.Z&&this.Xb(l.Z,l.Sc);l.ka&&this.sd(l.ka,l.Od)}var w=Ha();La();q.yc=function(h,l,m){return l instanceof q?l:new q(h,{Z:l,Sc:m})};q.prototype.Gc=function(){var h=
!1,l="hex";"string"===typeof h&&(l=h,h=null);this.ka||(this.ka=this.sa.v.o(this.Z));return l?this.ka.encode(l,h):this.ka};q.prototype.Xb=function(h,l){this.Z=new w(h,l||16);this.Z=this.Z.S(this.sa.curve.n)};q.prototype.sign=function(h,l,m){return this.sa.sign(h,this,l,m)};return q}),ab=Fa(function(){function q(l){if(l instanceof q)return l;h(l.r&&l.ma,"Signature without r or s");this.r=new w(l.r,16);this.ma=new w(l.ma,16);void 0===l.wa?this.wa=null:this.wa=l.wa}var w=Ha(),h=La().assert;return q}),
bb=Fa(function(){var q={};(function(w){function h(e){for(var n=d(e.slice(2)),v="0x",r=0;40>r;r++)v+=7<parseInt(n[r+2],16)?e[r+2].toUpperCase():e[r+2];return v}var l=Na(),m=Ha(),x=new (Sa().sa)("secp256k1"),d=Pa().rb,u={zc:function(e){e="0x"+("0x"===e.slice(0,2)?new m(e.slice(2),16):new m(e,10)).toString("hex");return"0x0"===e?"0x":e}};q={kc:h,lc:function(e){e=w.from(e.slice(2),"hex");e="0x"+x.Ua(e).Gc().slice(2);e=d(e);return h("0x"+e.slice(-40))},Zc:function(e,n,v){v=void 0===v?27:v;e=x.Ua(w.from(n.slice(2),
"hex")).sign(w.from(e.slice(2),"hex"),{mc:!0});v=[u.zc(l.xc(v+e.wa)),l.tb(32,l.pb("0x"+e.r.toString(16))),l.tb(32,l.pb("0x"+e.ma.toString(16)))];n=(e="undefined"!=typeof Symbol&&Symbol.iterator&&v[Symbol.iterator])?e.call(v):{next:oa(v)};v=n.next().value;e=n.next().value;n=n.next().value;return l.flatten([e,n,v])},$c:function(e,n){n=[l.slice(64,l.length(n),n),l.slice(0,32,n),l.slice(32,64,n)];n={bb:l.jd(n[0]),r:n[1].slice(2),ma:n[2].slice(2)};e="0x"+x.Tc(w.from(e.slice(2),"hex"),n,2>n.bb?n.bb:1-n.bb%
2).encode("hex",!1).slice(2);e=d(e);return h("0x"+e.slice(-40))}}}).call(ma,Ia().Ib);return q})();module.exports.addressChecksum=bb.kc;module.exports.addressFromKey=bb.lc;module.exports.signMessage=bb.Zc;module.exports.signerAddress=bb.$c;module.exports.keccak=Pa().rb;


/***/ }),

/***/ 787:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "237db229f1e6a224797029452b2c75f0.png");

/***/ }),

/***/ 86:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": () => (/* binding */ h)
/* harmony export */ });
/* harmony import */ var inferno__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(285);


var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isString(o) {
    return typeof o === 'string';
}
function isUndefined(o) {
    return o === void 0;
}

var classIdSplit = /([.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;
function parseTag(tag, props) {
    if (!tag) {
        return 'div';
    }
    if (tag === inferno__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
        return tag;
    }
    var noId = props && isUndefined(props.id);
    var tagParts = tag.split(classIdSplit);
    var tagName = null;
    if (notClassId.test(tagParts[1])) {
        tagName = 'div';
    }
    var classes;
    for (var i = 0, len = tagParts.length; i < len; ++i) {
        var part = tagParts[i];
        if (!part) {
            continue;
        }
        var type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        }
        else if (type === '.') {
            if (classes === void 0) {
                classes = [];
            }
            classes.push(part.substring(1, part.length));
        }
        else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }
    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }
        props.className = classes.join(' ');
    }
    return tagName || 'div';
}
function isChildren(x) {
    return isStringOrNumber(x) || (x && isArray(x));
}
/**
 * Creates virtual node
 * @param {string|VNode|Function} _tag Name for virtual node
 * @param {object=} _props Additional properties for virtual node
 * @param {string|number|VNode|Array<string|number|VNode>|null=} _children Optional children for virtual node
 * @returns {VNode} returns new virtual node
 */
function h(_tag, _props, _children) {
    // If a child array or text node are passed as the second argument, shift them
    if (!_children && isChildren(_props)) {
        _children = _props;
        _props = {};
    }
    var isElement = isString(_tag);
    _props = _props || {};
    var tag = isElement ? parseTag(_tag, _props) : _tag;
    var newProps = {};
    var key = null;
    var ref = null;
    var children = null;
    var className = null;
    for (var prop in _props) {
        if (isElement && (prop === 'className' || prop === 'class')) {
            className = _props[prop];
        }
        else if (prop === 'key') {
            key = _props[prop];
        }
        else if (prop === 'ref') {
            ref = _props[prop];
        }
        else if (prop === 'hooks') {
            ref = _props[prop];
        }
        else if (prop === 'children') {
            children = _props[prop];
        }
        else if (!isElement && prop.substr(0, 11) === 'onComponent') {
            if (!ref) {
                ref = {};
            }
            ref[prop] = _props[prop];
        }
        else {
            newProps[prop] = _props[prop];
        }
    }
    if (isElement) {
        var flags = (0,inferno__WEBPACK_IMPORTED_MODULE_0__.getFlagsForElementVnode)(tag);
        if (flags & 8192 /* Fragment */) {
            return (0,inferno__WEBPACK_IMPORTED_MODULE_0__.createFragment)(_children || children, 0 /* UnknownChildren */, key);
        }
        if (newProps.contenteditable !== void 0) {
            flags |= 4096 /* ContentEditable */;
        }
        return (0,inferno__WEBPACK_IMPORTED_MODULE_0__.createVNode)(flags, tag, className, _children || children, 0 /* UnknownChildren */, newProps, key, ref);
    }
    if (children || _children) {
        newProps.children = children || _children;
    }
    return (0,inferno__WEBPACK_IMPORTED_MODULE_0__.createComponentVNode)(2 /* ComponentUnknown */, tag, newProps, key, ref);
}




/***/ }),

/***/ 285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Component": () => (/* reexport */ Component),
  "EMPTY_OBJ": () => (/* reexport */ EMPTY_OBJ),
  "Fragment": () => (/* reexport */ Fragment),
  "_CI": () => (/* reexport */ createClassComponentInstance),
  "_HI": () => (/* reexport */ normalizeRoot),
  "_M": () => (/* reexport */ mount),
  "_MCCC": () => (/* reexport */ mountClassComponentCallbacks),
  "_ME": () => (/* reexport */ mountElement),
  "_MFCC": () => (/* reexport */ mountFunctionalComponentCallbacks),
  "_MP": () => (/* reexport */ mountProps),
  "_MR": () => (/* reexport */ mountRef),
  "_RFC": () => (/* reexport */ renderFunctionalComponent),
  "__render": () => (/* reexport */ __render),
  "createComponentVNode": () => (/* reexport */ createComponentVNode),
  "createFragment": () => (/* reexport */ createFragment),
  "createPortal": () => (/* reexport */ createPortal),
  "createRef": () => (/* reexport */ createRef),
  "createRenderer": () => (/* reexport */ createRenderer),
  "createTextVNode": () => (/* reexport */ createTextVNode),
  "createVNode": () => (/* reexport */ createVNode),
  "directClone": () => (/* reexport */ directClone),
  "findDOMfromVNode": () => (/* reexport */ findDOMfromVNode),
  "forwardRef": () => (/* reexport */ forwardRef),
  "getFlagsForElementVnode": () => (/* reexport */ getFlagsForElementVnode),
  "linkEvent": () => (/* reexport */ linkEvent),
  "normalizeProps": () => (/* reexport */ normalizeProps),
  "options": () => (/* reexport */ options),
  "render": () => (/* reexport */ render),
  "rerender": () => (/* reexport */ rerender),
  "version": () => (/* reexport */ version)
});

;// CONCATENATED MODULE: ./node_modules/inferno/dist/index.esm.js
var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull(o) {
    return o === null;
}
function isUndefined(o) {
    return o === void 0;
}
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}

/**
 * Links given data to event as first parameter
 * @param {*} data data to be linked, it will be available in function as first parameter
 * @param {Function} event Function to be called when event occurs
 * @returns {{data: *, event: Function}}
 */
function linkEvent(data, event) {
    if (isFunction(event)) {
        return { data: data, event: event };
    }
    return null; // Return null when event is invalid, to avoid creating unnecessary event handlers
}
// object.event should always be function, otherwise its badly created object.
function isLinkEventObject(o) {
    return !isNull(o) && typeof o === 'object';
}

// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
var EMPTY_OBJ = {};
var Fragment = '$F';
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function appendChild(parentDOM, dom) {
    parentDOM.appendChild(dom);
}
function insertOrAppend(parentDOM, newNode, nextNode) {
    if (isNull(nextNode)) {
        appendChild(parentDOM, newNode);
    }
    else {
        parentDOM.insertBefore(newNode, nextNode);
    }
}
function documentCreateElement(tag, isSVG) {
    if (isSVG) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    return document.createElement(tag);
}
function replaceChild(parentDOM, newDom, lastDom) {
    parentDOM.replaceChild(newDom, lastDom);
}
function removeChild(parentDOM, childNode) {
    parentDOM.removeChild(childNode);
}
function callAll(arrayFn) {
    for (var i = 0; i < arrayFn.length; i++) {
        arrayFn[i]();
    }
}
function findChildVNode(vNode, startEdge, flags) {
    var children = vNode.children;
    if (flags & 4 /* ComponentClass */) {
        return children.$LI;
    }
    if (flags & 8192 /* Fragment */) {
        return vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[startEdge ? 0 : children.length - 1];
    }
    return children;
}
function findDOMfromVNode(vNode, startEdge) {
    var flags;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        vNode = findChildVNode(vNode, startEdge, flags);
    }
    return null;
}
function removeVNodeDOM(vNode, parentDOM) {
    do {
        var flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            removeChild(parentDOM, vNode.dom);
            return;
        }
        var children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        if (flags & 8 /* ComponentFunction */) {
            vNode = children;
        }
        if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                vNode = children;
            }
            else {
                for (var i = 0, len = children.length; i < len; ++i) {
                    removeVNodeDOM(children[i], parentDOM);
                }
                return;
            }
        }
    } while (vNode);
}
function moveVNodeDOM(vNode, parentDOM, nextNode) {
    do {
        var flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            insertOrAppend(parentDOM, vNode.dom, nextNode);
            return;
        }
        var children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        if (flags & 8 /* ComponentFunction */) {
            vNode = children;
        }
        if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                vNode = children;
            }
            else {
                for (var i = 0, len = children.length; i < len; ++i) {
                    moveVNodeDOM(children[i], parentDOM, nextNode);
                }
                return;
            }
        }
    } while (vNode);
}
function createDerivedState(instance, nextProps, state) {
    if (instance.constructor.getDerivedStateFromProps) {
        return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
    }
    return state;
}
var renderCheck = {
    v: false
};
var options = {
    componentComparator: null,
    createVNode: null,
    renderComplete: null
};
function setTextContent(dom, children) {
    dom.textContent = children;
}
// Calling this function assumes, nextValue is linkEvent
function isLastValueSameLinkEvent(lastValue, nextValue) {
    return (isLinkEventObject(lastValue) &&
        lastValue.event === nextValue.event &&
        lastValue.data === nextValue.data);
}
function mergeUnsetProperties(to, from) {
    for (var propName in from) {
        if (isUndefined(to[propName])) {
            to[propName] = from[propName];
        }
    }
    return to;
}
function safeCall1(method, arg1) {
    return !!isFunction(method) && (method(arg1), true);
}

var keyPrefix = '$';
function V(childFlags, children, className, flags, key, props, ref, type) {
    this.childFlags = childFlags;
    this.children = children;
    this.className = className;
    this.dom = null;
    this.flags = flags;
    this.key = key === void 0 ? null : key;
    this.props = props === void 0 ? null : props;
    this.ref = ref === void 0 ? null : ref;
    this.type = type;
}
function createVNode(flags, type, className, children, childFlags, props, key, ref) {
    var childFlag = childFlags === void 0 ? 1 /* HasInvalidChildren */ : childFlags;
    var vNode = new V(childFlag, children, className, flags, key, props, ref, type);
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    if (childFlag === 0 /* UnknownChildren */) {
        normalizeChildren(vNode, vNode.children);
    }
    return vNode;
}
function mergeDefaultHooks(flags, type, ref) {
    if (flags & 4 /* ComponentClass */) {
        return ref;
    }
    var defaultHooks = (flags & 32768 /* ForwardRef */ ? type.render : type).defaultHooks;
    if (isNullOrUndef(defaultHooks)) {
        return ref;
    }
    if (isNullOrUndef(ref)) {
        return defaultHooks;
    }
    return mergeUnsetProperties(ref, defaultHooks);
}
function mergeDefaultProps(flags, type, props) {
    // set default props
    var defaultProps = (flags & 32768 /* ForwardRef */ ? type.render : type).defaultProps;
    if (isNullOrUndef(defaultProps)) {
        return props;
    }
    if (isNullOrUndef(props)) {
        return combineFrom(defaultProps, null);
    }
    return mergeUnsetProperties(props, defaultProps);
}
function resolveComponentFlags(flags, type) {
    if (flags & 12 /* ComponentKnown */) {
        return flags;
    }
    if (type.prototype && type.prototype.render) {
        return 4 /* ComponentClass */;
    }
    if (type.render) {
        return 32776 /* ForwardRefComponent */;
    }
    return 8 /* ComponentFunction */;
}
function createComponentVNode(flags, type, props, key, ref) {
    flags = resolveComponentFlags(flags, type);
    var vNode = new V(1 /* HasInvalidChildren */, null, null, flags, key, mergeDefaultProps(flags, type, props), mergeDefaultHooks(flags, type, ref), type);
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    return vNode;
}
function createTextVNode(text, key) {
    return new V(1 /* HasInvalidChildren */, isNullOrUndef(text) || text === true || text === false ? '' : text, null, 16 /* Text */, key, null, null, null);
}
function createFragment(children, childFlags, key) {
    var fragment = createVNode(8192 /* Fragment */, 8192 /* Fragment */, null, children, childFlags, null, key, null);
    switch (fragment.childFlags) {
        case 1 /* HasInvalidChildren */:
            fragment.children = createVoidVNode();
            fragment.childFlags = 2 /* HasVNodeChildren */;
            break;
        case 16 /* HasTextChildren */:
            fragment.children = [createTextVNode(children)];
            fragment.childFlags = 4 /* HasNonKeyedChildren */;
            break;
    }
    return fragment;
}
function normalizeProps(vNode) {
    var props = vNode.props;
    if (props) {
        var flags = vNode.flags;
        if (flags & 481 /* Element */) {
            if (props.children !== void 0 && isNullOrUndef(vNode.children)) {
                normalizeChildren(vNode, props.children);
            }
            if (props.className !== void 0) {
                vNode.className = props.className || null;
                props.className = undefined;
            }
        }
        if (props.key !== void 0) {
            vNode.key = props.key;
            props.key = undefined;
        }
        if (props.ref !== void 0) {
            if (flags & 8 /* ComponentFunction */) {
                vNode.ref = combineFrom(vNode.ref, props.ref);
            }
            else {
                vNode.ref = props.ref;
            }
            props.ref = undefined;
        }
    }
    return vNode;
}
/*
 * Fragment is different than normal vNode,
 * because when it needs to be cloned we need to clone its children too
 * But not normalize, because otherwise those possibly get KEY and re-mount
 */
function cloneFragment(vNodeToClone) {
    var oldChildren = vNodeToClone.children;
    var childFlags = vNodeToClone.childFlags;
    return createFragment(childFlags === 2 /* HasVNodeChildren */ ? directClone(oldChildren) : oldChildren.map(directClone), childFlags, vNodeToClone.key);
}
function directClone(vNodeToClone) {
    var flags = vNodeToClone.flags & -16385 /* ClearInUse */;
    var props = vNodeToClone.props;
    if (flags & 14 /* Component */) {
        if (!isNull(props)) {
            var propsToClone = props;
            props = {};
            for (var key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
    }
    if ((flags & 8192 /* Fragment */) === 0) {
        return new V(vNodeToClone.childFlags, vNodeToClone.children, vNodeToClone.className, flags, vNodeToClone.key, props, vNodeToClone.ref, vNodeToClone.type);
    }
    return cloneFragment(vNodeToClone);
}
function createVoidVNode() {
    return createTextVNode('', null);
}
function createPortal(children, container) {
    var normalizedRoot = normalizeRoot(children);
    return createVNode(1024 /* Portal */, 1024 /* Portal */, null, normalizedRoot, 0 /* UnknownChildren */, null, normalizedRoot.key, container);
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        if (!isInvalid(n)) {
            var newKey = currentKey + keyPrefix + index;
            if (isArray(n)) {
                _normalizeVNodes(n, result, 0, newKey);
            }
            else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n, newKey);
                }
                else {
                    var oldKey = n.key;
                    var isPrefixedKey = isString(oldKey) && oldKey[0] === keyPrefix;
                    if (n.flags & 81920 /* InUseOrNormalized */ || isPrefixedKey) {
                        n = directClone(n);
                    }
                    n.flags |= 65536 /* Normalized */;
                    if (!isPrefixedKey) {
                        if (isNull(oldKey)) {
                            n.key = newKey;
                        }
                        else {
                            n.key = currentKey + oldKey;
                        }
                    }
                    else if (oldKey.substring(0, currentKey.length) !== currentKey) {
                        n.key = currentKey + oldKey;
                    }
                }
                result.push(n);
            }
        }
    }
}
function getFlagsForElementVnode(type) {
    switch (type) {
        case 'svg':
            return 32 /* SvgElement */;
        case 'input':
            return 64 /* InputElement */;
        case 'select':
            return 256 /* SelectElement */;
        case 'textarea':
            return 128 /* TextareaElement */;
        case Fragment:
            return 8192 /* Fragment */;
        default:
            return 1 /* HtmlElement */;
    }
}
function normalizeChildren(vNode, children) {
    var newChildren;
    var newChildFlags = 1 /* HasInvalidChildren */;
    // Don't change children to match strict equal (===) true in patching
    if (isInvalid(children)) {
        newChildren = children;
    }
    else if (isStringOrNumber(children)) {
        newChildFlags = 16 /* HasTextChildren */;
        newChildren = children;
    }
    else if (isArray(children)) {
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            var n = children[i];
            if (isInvalid(n) || isArray(n)) {
                newChildren = newChildren || children.slice(0, i);
                _normalizeVNodes(children, newChildren, i, '');
                break;
            }
            else if (isStringOrNumber(n)) {
                newChildren = newChildren || children.slice(0, i);
                newChildren.push(createTextVNode(n, keyPrefix + i));
            }
            else {
                var key = n.key;
                var needsCloning = (n.flags & 81920 /* InUseOrNormalized */) > 0;
                var isNullKey = isNull(key);
                var isPrefixed = isString(key) && key[0] === keyPrefix;
                if (needsCloning || isNullKey || isPrefixed) {
                    newChildren = newChildren || children.slice(0, i);
                    if (needsCloning || isPrefixed) {
                        n = directClone(n);
                    }
                    if (isNullKey || isPrefixed) {
                        n.key = keyPrefix + i;
                    }
                    newChildren.push(n);
                }
                else if (newChildren) {
                    newChildren.push(n);
                }
                n.flags |= 65536 /* Normalized */;
            }
        }
        newChildren = newChildren || children;
        if (newChildren.length === 0) {
            newChildFlags = 1 /* HasInvalidChildren */;
        }
        else {
            newChildFlags = 8 /* HasKeyedChildren */;
        }
    }
    else {
        newChildren = children;
        newChildren.flags |= 65536 /* Normalized */;
        if (children.flags & 81920 /* InUseOrNormalized */) {
            newChildren = directClone(children);
        }
        newChildFlags = 2 /* HasVNodeChildren */;
    }
    vNode.children = newChildren;
    vNode.childFlags = newChildFlags;
    return vNode;
}
function normalizeRoot(input) {
    if (isInvalid(input) || isStringOrNumber(input)) {
        return createTextVNode(input, null);
    }
    if (isArray(input)) {
        return createFragment(input, 0 /* UnknownChildren */, null);
    }
    return input.flags & 16384 /* InUse */ ? directClone(input) : input;
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var namespaces = {
    'xlink:actuate': xlinkNS,
    'xlink:arcrole': xlinkNS,
    'xlink:href': xlinkNS,
    'xlink:role': xlinkNS,
    'xlink:show': xlinkNS,
    'xlink:title': xlinkNS,
    'xlink:type': xlinkNS,
    'xml:base': xmlNS,
    'xml:lang': xmlNS,
    'xml:space': xmlNS
};

function getDelegatedEventObject(v) {
    return {
        onClick: v,
        onDblClick: v,
        onFocusIn: v,
        onFocusOut: v,
        onKeyDown: v,
        onKeyPress: v,
        onKeyUp: v,
        onMouseDown: v,
        onMouseMove: v,
        onMouseUp: v,
        onTouchEnd: v,
        onTouchMove: v,
        onTouchStart: v
    };
}
var attachedEventCounts = getDelegatedEventObject(0);
var attachedEvents = getDelegatedEventObject(null);
var syntheticEvents = getDelegatedEventObject(true);
function updateOrAddSyntheticEvent(name, dom) {
    var eventsObject = dom.$EV;
    if (!eventsObject) {
        eventsObject = dom.$EV = getDelegatedEventObject(null);
    }
    if (!eventsObject[name]) {
        if (++attachedEventCounts[name] === 1) {
            attachedEvents[name] = attachEventToDocument(name);
        }
    }
    return eventsObject;
}
function unmountSyntheticEvent(name, dom) {
    var eventsObject = dom.$EV;
    if (eventsObject && eventsObject[name]) {
        if (--attachedEventCounts[name] === 0) {
            document.removeEventListener(normalizeEventName(name), attachedEvents[name]);
            attachedEvents[name] = null;
        }
        eventsObject[name] = null;
    }
}
function handleSyntheticEvent(name, lastEvent, nextEvent, dom) {
    if (isFunction(nextEvent)) {
        updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
    }
    else if (isLinkEventObject(nextEvent)) {
        if (isLastValueSameLinkEvent(lastEvent, nextEvent)) {
            return;
        }
        updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
    }
    else {
        unmountSyntheticEvent(name, dom);
    }
}
// When browsers fully support event.composedPath we could loop it through instead of using parentNode property
function getTargetNode(event) {
    return isFunction(event.composedPath) ? event.composedPath()[0] : event.target;
}
function dispatchEvents(event, isClick, name, eventData) {
    var dom = getTargetNode(event);
    do {
        // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
        // because the event listener is on document.body
        // Don't process clicks on disabled elements
        if (isClick && dom.disabled) {
            return;
        }
        var eventsObject = dom.$EV;
        if (eventsObject) {
            var currentEvent = eventsObject[name];
            if (currentEvent) {
                // linkEvent object
                eventData.dom = dom;
                currentEvent.event ? currentEvent.event(currentEvent.data, event) : currentEvent(event);
                if (event.cancelBubble) {
                    return;
                }
            }
        }
        dom = dom.parentNode;
    } while (!isNull(dom));
}
function stopPropagation() {
    this.cancelBubble = true;
    if (!this.immediatePropagationStopped) {
        this.stopImmediatePropagation();
    }
}
function isDefaultPrevented() {
    return this.defaultPrevented;
}
function isPropagationStopped() {
    return this.cancelBubble;
}
function extendEventProperties(event) {
    // Event data needs to be object to save reference to currentTarget getter
    var eventData = {
        dom: document
    };
    event.isDefaultPrevented = isDefaultPrevented;
    event.isPropagationStopped = isPropagationStopped;
    event.stopPropagation = stopPropagation;
    Object.defineProperty(event, 'currentTarget', {
        configurable: true,
        get: function get() {
            return eventData.dom;
        }
    });
    return eventData;
}
function rootClickEvent(name) {
    return function (event) {
        if (event.button !== 0) {
            // Firefox incorrectly triggers click event for mid/right mouse buttons.
            // This bug has been active for 17 years.
            // https://bugzilla.mozilla.org/show_bug.cgi?id=184051
            event.stopPropagation();
            return;
        }
        dispatchEvents(event, true, name, extendEventProperties(event));
    };
}
function rootEvent(name) {
    return function (event) {
        dispatchEvents(event, false, name, extendEventProperties(event));
    };
}
function attachEventToDocument(name) {
    var attachedEvent = name === 'onClick' || name === 'onDblClick' ? rootClickEvent(name) : rootEvent(name);
    document.addEventListener(normalizeEventName(name), attachedEvent);
    return attachedEvent;
}

function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement('i');
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
}

function triggerEventListener(props, methodName, e) {
    if (props[methodName]) {
        var listener = props[methodName];
        if (listener.event) {
            listener.event(listener.data, e);
        }
        else {
            listener(e);
        }
    }
    else {
        var nativeListenerName = methodName.toLowerCase();
        if (props[nativeListenerName]) {
            props[nativeListenerName](e);
        }
    }
}
function createWrappedFunction(methodName, applyValue) {
    var fnMethod = function (e) {
        var vNode = this.$V;
        // If vNode is gone by the time event fires, no-op
        if (!vNode) {
            return;
        }
        var props = vNode.props || EMPTY_OBJ;
        var dom = vNode.dom;
        if (isString(methodName)) {
            triggerEventListener(props, methodName, e);
        }
        else {
            for (var i = 0; i < methodName.length; ++i) {
                triggerEventListener(props, methodName[i], e);
            }
        }
        if (isFunction(applyValue)) {
            var newVNode = this.$V;
            var newProps = newVNode.props || EMPTY_OBJ;
            applyValue(newProps, dom, false, newVNode);
        }
    };
    Object.defineProperty(fnMethod, 'wrapped', {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
    });
    return fnMethod;
}

function attachEvent(dom, eventName, handler) {
    var previousKey = "$" + eventName;
    var previousArgs = dom[previousKey];
    if (previousArgs) {
        if (previousArgs[1].wrapped) {
            return;
        }
        dom.removeEventListener(previousArgs[0], previousArgs[1]);
        dom[previousKey] = null;
    }
    if (isFunction(handler)) {
        dom.addEventListener(eventName, handler);
        dom[previousKey] = [eventName, handler];
    }
}

function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
var onTextInputChange = createWrappedFunction('onInput', applyValueInput);
var wrappedOnChange = createWrappedFunction(['onClick', 'onChange'], applyValueInput);
/* tslint:disable-next-line:no-empty */
function emptywrapper(event) {
    event.stopPropagation();
}
emptywrapper.wrapped = true;
function inputEvents(dom, nextPropsOrEmpty) {
    if (isCheckedType(nextPropsOrEmpty.type)) {
        attachEvent(dom, 'change', wrappedOnChange);
        attachEvent(dom, 'click', emptywrapper);
    }
    else {
        attachEvent(dom, 'input', onTextInputChange);
    }
}
function applyValueInput(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.setAttribute('type', type);
    }
    if (!isNullOrUndef(multiple) && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
    else {
        if (hasValue && dom.value !== value) {
            dom.defaultValue = value;
            dom.value = value;
        }
        else if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}

function updateChildOptions(vNode, value) {
    if (vNode.type === 'option') {
        updateChildOption(vNode, value);
    }
    else {
        var children = vNode.children;
        var flags = vNode.flags;
        if (flags & 4 /* ComponentClass */) {
            updateChildOptions(children.$LI, value);
        }
        else if (flags & 8 /* ComponentFunction */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags === 2 /* HasVNodeChildren */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags & 12 /* MultipleChildren */) {
            for (var i = 0, len = children.length; i < len; ++i) {
                updateChildOptions(children[i], value);
            }
        }
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    // we do this as multiple may have changed
    dom.value = props.value;
    if (props.value === value || (isArray(value) && value.indexOf(props.value) !== -1)) {
        dom.selected = true;
    }
    else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
var onSelectChange = createWrappedFunction('onChange', applyValueSelect);
function selectEvents(dom) {
    attachEvent(dom, 'change', onSelectChange);
}
function applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode) {
    var multiplePropInBoolean = Boolean(nextPropsOrEmpty.multiple);
    if (!isNullOrUndef(nextPropsOrEmpty.multiple) && multiplePropInBoolean !== dom.multiple) {
        dom.multiple = multiplePropInBoolean;
    }
    var index = nextPropsOrEmpty.selectedIndex;
    if (index === -1) {
        dom.selectedIndex = -1;
    }
    var childFlags = vNode.childFlags;
    if (childFlags !== 1 /* HasInvalidChildren */) {
        var value = nextPropsOrEmpty.value;
        if (isNumber(index) && index > -1 && dom.options[index]) {
            value = dom.options[index].value;
        }
        if (mounting && isNullOrUndef(value)) {
            value = nextPropsOrEmpty.defaultValue;
        }
        updateChildOptions(vNode, value);
    }
}

var onTextareaInputChange = createWrappedFunction('onInput', applyValueTextArea);
var wrappedOnChange$1 = createWrappedFunction('onChange');
function textAreaEvents(dom, nextPropsOrEmpty) {
    attachEvent(dom, 'input', onTextareaInputChange);
    if (nextPropsOrEmpty.onChange) {
        attachEvent(dom, 'change', wrappedOnChange$1);
    }
}
function applyValueTextArea(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;
    if (isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = nextPropsOrEmpty.defaultValue;
            if (!isNullOrUndef(defaultValue) && defaultValue !== domValue) {
                dom.defaultValue = defaultValue;
                dom.value = defaultValue;
            }
        }
    }
    else if (domValue !== value) {
        /* There is value so keep it controlled */
        dom.defaultValue = value;
        dom.value = value;
    }
}

function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 64 /* InputElement */) {
        applyValueInput(nextPropsOrEmpty, dom);
    }
    else if (flags & 256 /* SelectElement */) {
        applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode);
    }
    else if (flags & 128 /* TextareaElement */) {
        applyValueTextArea(nextPropsOrEmpty, dom, mounting);
    }
    if (isControlled) {
        dom.$V = vNode;
    }
}
function addFormElementEventHandlers(flags, dom, nextPropsOrEmpty) {
    if (flags & 64 /* InputElement */) {
        inputEvents(dom, nextPropsOrEmpty);
    }
    else if (flags & 256 /* SelectElement */) {
        selectEvents(dom);
    }
    else if (flags & 128 /* TextareaElement */) {
        textAreaEvents(dom, nextPropsOrEmpty);
    }
}
function isControlledFormElement(nextPropsOrEmpty) {
    return nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
}

function createRef() {
    return {
        current: null
    };
}
function forwardRef(render) {
    // @ts-ignore
    return {
        render: render
    };
}
function unmountRef(ref) {
    if (ref) {
        if (!safeCall1(ref, null) && ref.current) {
            ref.current = null;
        }
    }
}
function mountRef(ref, value, lifecycle) {
    if (ref && (isFunction(ref) || ref.current !== void 0)) {
        lifecycle.push(function () {
            if (!safeCall1(ref, value) && ref.current !== void 0) {
                ref.current = value;
            }
        });
    }
}

function remove(vNode, parentDOM) {
    unmount(vNode);
    removeVNodeDOM(vNode, parentDOM);
}
function unmount(vNode) {
    var flags = vNode.flags;
    var children = vNode.children;
    var ref;
    if (flags & 481 /* Element */) {
        ref = vNode.ref;
        var props = vNode.props;
        unmountRef(ref);
        var childFlags = vNode.childFlags;
        if (!isNull(props)) {
            var keys = Object.keys(props);
            for (var i = 0, len = keys.length; i < len; i++) {
                var key = keys[i];
                if (syntheticEvents[key]) {
                    unmountSyntheticEvent(key, vNode.dom);
                }
            }
        }
        if (childFlags & 12 /* MultipleChildren */) {
            unmountAllChildren(children);
        }
        else if (childFlags === 2 /* HasVNodeChildren */) {
            unmount(children);
        }
    }
    else if (children) {
        if (flags & 4 /* ComponentClass */) {
            if (isFunction(children.componentWillUnmount)) {
                children.componentWillUnmount();
            }
            unmountRef(vNode.ref);
            children.$UN = true;
            unmount(children.$LI);
        }
        else if (flags & 8 /* ComponentFunction */) {
            ref = vNode.ref;
            if (!isNullOrUndef(ref) && isFunction(ref.onComponentWillUnmount)) {
                ref.onComponentWillUnmount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
            }
            unmount(children);
        }
        else if (flags & 1024 /* Portal */) {
            remove(children, vNode.ref);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags & 12 /* MultipleChildren */) {
                unmountAllChildren(children);
            }
        }
    }
}
function unmountAllChildren(children) {
    for (var i = 0, len = children.length; i < len; ++i) {
        unmount(children[i]);
    }
}
function clearDOM(dom) {
    // Optimization for clearing dom
    dom.textContent = '';
}
function removeAllChildren(dom, vNode, children) {
    unmountAllChildren(children);
    if (vNode.flags & 8192 /* Fragment */) {
        removeVNodeDOM(vNode, dom);
    }
    else {
        clearDOM(dom);
    }
}

function wrapLinkEvent(nextValue) {
    // This variable makes sure there is no "this" context in callback
    var ev = nextValue.event;
    return function (e) {
        ev(nextValue.data, e);
    };
}
function patchEvent(name, lastValue, nextValue, dom) {
    if (isLinkEventObject(nextValue)) {
        if (isLastValueSameLinkEvent(lastValue, nextValue)) {
            return;
        }
        nextValue = wrapLinkEvent(nextValue);
    }
    attachEvent(dom, normalizeEventName(name), nextValue);
}
// We are assuming here that we come from patchProp routine
// -nextAttrValue cannot be null or undefined
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    if (isNullOrUndef(nextAttrValue)) {
        dom.removeAttribute('style');
        return;
    }
    var domStyle = dom.style;
    var style;
    var value;
    if (isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
        for (style in nextAttrValue) {
            // do not add a hasOwnProperty check here, it affects performance
            value = nextAttrValue[style];
            if (value !== lastAttrValue[style]) {
                domStyle.setProperty(style, value);
            }
        }
        for (style in lastAttrValue) {
            if (isNullOrUndef(nextAttrValue[style])) {
                domStyle.removeProperty(style);
            }
        }
    }
    else {
        for (style in nextAttrValue) {
            value = nextAttrValue[style];
            domStyle.setProperty(style, value);
        }
    }
}
function patchDangerInnerHTML(lastValue, nextValue, lastVNode, dom) {
    var lastHtml = (lastValue && lastValue.__html) || '';
    var nextHtml = (nextValue && nextValue.__html) || '';
    if (lastHtml !== nextHtml) {
        if (!isNullOrUndef(nextHtml) && !isSameInnerHTML(dom, nextHtml)) {
            if (!isNull(lastVNode)) {
                if (lastVNode.childFlags & 12 /* MultipleChildren */) {
                    unmountAllChildren(lastVNode.children);
                }
                else if (lastVNode.childFlags === 2 /* HasVNodeChildren */) {
                    unmount(lastVNode.children);
                }
                lastVNode.children = null;
                lastVNode.childFlags = 1 /* HasInvalidChildren */;
            }
            dom.innerHTML = nextHtml;
        }
    }
}
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode) {
    switch (prop) {
        case 'children':
        case 'childrenType':
        case 'className':
        case 'defaultValue':
        case 'key':
        case 'multiple':
        case 'ref':
        case 'selectedIndex':
            break;
        case 'autoFocus':
            dom.autofocus = !!nextValue;
            break;
        case 'allowfullscreen':
        case 'autoplay':
        case 'capture':
        case 'checked':
        case 'controls':
        case 'default':
        case 'disabled':
        case 'hidden':
        case 'indeterminate':
        case 'loop':
        case 'muted':
        case 'novalidate':
        case 'open':
        case 'readOnly':
        case 'required':
        case 'reversed':
        case 'scoped':
        case 'seamless':
        case 'selected':
            dom[prop] = !!nextValue;
            break;
        case 'defaultChecked':
        case 'value':
        case 'volume':
            if (hasControlledValue && prop === 'value') {
                break;
            }
            var value = isNullOrUndef(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
            break;
        case 'style':
            patchStyle(lastValue, nextValue, dom);
            break;
        case 'dangerouslySetInnerHTML':
            patchDangerInnerHTML(lastValue, nextValue, lastVNode, dom);
            break;
        default:
            if (syntheticEvents[prop]) {
                handleSyntheticEvent(prop, lastValue, nextValue, dom);
            }
            else if (prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110) {
                patchEvent(prop, lastValue, nextValue, dom);
            }
            else if (isNullOrUndef(nextValue)) {
                dom.removeAttribute(prop);
            }
            else if (isSVG && namespaces[prop]) {
                // We optimize for isSVG being false
                // If we end up in this path we can read property again
                dom.setAttributeNS(namespaces[prop], prop, nextValue);
            }
            else {
                dom.setAttribute(prop, nextValue);
            }
            break;
    }
}
function mountProps(vNode, flags, props, dom, isSVG) {
    var hasControlledValue = false;
    var isFormElement = (flags & 448 /* FormElement */) > 0;
    if (isFormElement) {
        hasControlledValue = isControlledFormElement(props);
        if (hasControlledValue) {
            addFormElementEventHandlers(flags, dom, props);
        }
    }
    for (var prop in props) {
        // do not add a hasOwnProperty check here, it affects performance
        patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue, null);
    }
    if (isFormElement) {
        processElement(flags, vNode, dom, props, true, hasControlledValue);
    }
}

function renderNewInput(instance, props, context) {
    var nextInput = normalizeRoot(instance.render(props, instance.state, context));
    var childContext = context;
    if (isFunction(instance.getChildContext)) {
        childContext = combineFrom(context, instance.getChildContext());
    }
    instance.$CX = childContext;
    return nextInput;
}
function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    var instance = new Component(props, context);
    var usesNewAPI = (instance.$N = Boolean(Component.getDerivedStateFromProps || instance.getSnapshotBeforeUpdate));
    instance.$SVG = isSVG;
    instance.$L = lifecycle;
    vNode.children = instance;
    instance.$BS = false;
    instance.context = context;
    if (instance.props === EMPTY_OBJ) {
        instance.props = props;
    }
    if (!usesNewAPI) {
        if (isFunction(instance.componentWillMount)) {
            instance.$BR = true;
            instance.componentWillMount();
            var pending = instance.$PS;
            if (!isNull(pending)) {
                var state = instance.state;
                if (isNull(state)) {
                    instance.state = pending;
                }
                else {
                    for (var key in pending) {
                        state[key] = pending[key];
                    }
                }
                instance.$PS = null;
            }
            instance.$BR = false;
        }
    }
    else {
        instance.state = createDerivedState(instance, props, instance.state);
    }
    instance.$LI = renderNewInput(instance, props, context);
    return instance;
}
function renderFunctionalComponent(vNode, context) {
    var props = vNode.props || EMPTY_OBJ;
    return vNode.flags & 32768 /* ForwardRef */ ? vNode.type.render(props, vNode.ref, context) : vNode.type(props, context);
}

function mount(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 481 /* Element */) {
        mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 4 /* ComponentClass */) {
        mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 8 /* ComponentFunction */) {
        mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
        mountFunctionalComponentCallbacks(vNode, lifecycle);
    }
    else if (flags & 512 /* Void */ || flags & 16 /* Text */) {
        mountText(vNode, parentDOM, nextNode);
    }
    else if (flags & 8192 /* Fragment */) {
        mountFragment(vNode, context, parentDOM, isSVG, nextNode, lifecycle);
    }
    else if (flags & 1024 /* Portal */) {
        mountPortal(vNode, context, parentDOM, nextNode, lifecycle);
    }
    else ;
}
function mountPortal(vNode, context, parentDOM, nextNode, lifecycle) {
    mount(vNode.children, vNode.ref, context, false, null, lifecycle);
    var placeHolderVNode = createVoidVNode();
    mountText(placeHolderVNode, parentDOM, nextNode);
    vNode.dom = placeHolderVNode.dom;
}
function mountFragment(vNode, context, parentDOM, isSVG, nextNode, lifecycle) {
    var children = vNode.children;
    var childFlags = vNode.childFlags;
    // When fragment is optimized for multiple children, check if there is no children and change flag to invalid
    // This is the only normalization always done, to keep optimization flags API same for fragments and regular elements
    if (childFlags & 12 /* MultipleChildren */ && children.length === 0) {
        childFlags = vNode.childFlags = 2 /* HasVNodeChildren */;
        children = vNode.children = createVoidVNode();
    }
    if (childFlags === 2 /* HasVNodeChildren */) {
        mount(children, parentDOM, nextNode, isSVG, nextNode, lifecycle);
    }
    else {
        mountArrayChildren(children, parentDOM, context, isSVG, nextNode, lifecycle);
    }
}
function mountText(vNode, parentDOM, nextNode) {
    var dom = (vNode.dom = document.createTextNode(vNode.children));
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
}
function mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var flags = vNode.flags;
    var props = vNode.props;
    var className = vNode.className;
    var childFlags = vNode.childFlags;
    var dom = (vNode.dom = documentCreateElement(vNode.type, (isSVG = isSVG || (flags & 32 /* SvgElement */) > 0)));
    var children = vNode.children;
    if (!isNullOrUndef(className) && className !== '') {
        if (isSVG) {
            dom.setAttribute('class', className);
        }
        else {
            dom.className = className;
        }
    }
    if (childFlags === 16 /* HasTextChildren */) {
        setTextContent(dom, children);
    }
    else if (childFlags !== 1 /* HasInvalidChildren */) {
        var childrenIsSVG = isSVG && vNode.type !== 'foreignObject';
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (children.flags & 16384 /* InUse */) {
                vNode.children = children = directClone(children);
            }
            mount(children, dom, context, childrenIsSVG, null, lifecycle);
        }
        else if (childFlags === 8 /* HasKeyedChildren */ || childFlags === 4 /* HasNonKeyedChildren */) {
            mountArrayChildren(children, dom, context, childrenIsSVG, null, lifecycle);
        }
    }
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
    if (!isNull(props)) {
        mountProps(vNode, flags, props, dom, isSVG);
    }
    mountRef(vNode.ref, dom, lifecycle);
}
function mountArrayChildren(children, dom, context, isSVG, nextNode, lifecycle) {
    for (var i = 0; i < children.length; ++i) {
        var child = children[i];
        if (child.flags & 16384 /* InUse */) {
            children[i] = child = directClone(child);
        }
        mount(child, dom, context, isSVG, nextNode, lifecycle);
    }
}
function mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = createClassComponentInstance(vNode, vNode.type, vNode.props || EMPTY_OBJ, context, isSVG, lifecycle);
    mount(instance.$LI, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
    mountClassComponentCallbacks(vNode.ref, instance, lifecycle);
}
function mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    mount((vNode.children = normalizeRoot(renderFunctionalComponent(vNode, context))), parentDOM, context, isSVG, nextNode, lifecycle);
}
function createClassMountCallback(instance) {
    return function () {
        instance.componentDidMount();
    };
}
function mountClassComponentCallbacks(ref, instance, lifecycle) {
    mountRef(ref, instance, lifecycle);
    if (isFunction(instance.componentDidMount)) {
        lifecycle.push(createClassMountCallback(instance));
    }
}
function createOnMountCallback(ref, vNode) {
    return function () {
        ref.onComponentDidMount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
    };
}
function mountFunctionalComponentCallbacks(vNode, lifecycle) {
    var ref = vNode.ref;
    if (!isNullOrUndef(ref)) {
        safeCall1(ref.onComponentWillMount, vNode.props || EMPTY_OBJ);
        if (isFunction(ref.onComponentDidMount)) {
            lifecycle.push(createOnMountCallback(ref, vNode));
        }
    }
}

function replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle) {
    unmount(lastVNode);
    if ((nextVNode.flags & lastVNode.flags & 2033 /* DOMRef */) !== 0) {
        mount(nextVNode, null, context, isSVG, null, lifecycle);
        // Single DOM operation, when we have dom references available
        replaceChild(parentDOM, nextVNode.dom, lastVNode.dom);
    }
    else {
        mount(nextVNode, parentDOM, context, isSVG, findDOMfromVNode(lastVNode, true), lifecycle);
        removeVNodeDOM(lastVNode, parentDOM);
    }
}
function patch(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var nextFlags = (nextVNode.flags |= 16384 /* InUse */);
    if (lastVNode.flags !== nextFlags || lastVNode.type !== nextVNode.type || lastVNode.key !== nextVNode.key || nextFlags & 2048 /* ReCreate */) {
        if (lastVNode.flags & 16384 /* InUse */) {
            replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle);
        }
        else {
            // Last vNode is not in use, it has crashed at application level. Just mount nextVNode and ignore last one
            mount(nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
        }
    }
    else if (nextFlags & 481 /* Element */) {
        patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle);
    }
    else if (nextFlags & 4 /* ComponentClass */) {
        patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 8 /* ComponentFunction */) {
        patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 16 /* Text */) {
        patchText(lastVNode, nextVNode);
    }
    else if (nextFlags & 512 /* Void */) {
        nextVNode.dom = lastVNode.dom;
    }
    else if (nextFlags & 8192 /* Fragment */) {
        patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle);
    }
    else {
        patchPortal(lastVNode, nextVNode, context, lifecycle);
    }
}
function patchSingleTextChild(lastChildren, nextChildren, parentDOM) {
    if (lastChildren !== nextChildren) {
        if (lastChildren !== '') {
            parentDOM.firstChild.nodeValue = nextChildren;
        }
        else {
            setTextContent(parentDOM, nextChildren);
        }
    }
}
function patchContentEditableChildren(dom, nextChildren) {
    if (dom.textContent !== nextChildren) {
        dom.textContent = nextChildren;
    }
}
function patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle) {
    var lastChildren = lastVNode.children;
    var nextChildren = nextVNode.children;
    var lastChildFlags = lastVNode.childFlags;
    var nextChildFlags = nextVNode.childFlags;
    var nextNode = null;
    // When fragment is optimized for multiple children, check if there is no children and change flag to invalid
    // This is the only normalization always done, to keep optimization flags API same for fragments and regular elements
    if (nextChildFlags & 12 /* MultipleChildren */ && nextChildren.length === 0) {
        nextChildFlags = nextVNode.childFlags = 2 /* HasVNodeChildren */;
        nextChildren = nextVNode.children = createVoidVNode();
    }
    var nextIsSingle = (nextChildFlags & 2 /* HasVNodeChildren */) !== 0;
    if (lastChildFlags & 12 /* MultipleChildren */) {
        var lastLen = lastChildren.length;
        // We need to know Fragment's edge node when
        if (
        // It uses keyed algorithm
        (lastChildFlags & 8 /* HasKeyedChildren */ && nextChildFlags & 8 /* HasKeyedChildren */) ||
            // It transforms from many to single
            nextIsSingle ||
            // It will append more nodes
            (!nextIsSingle && nextChildren.length > lastLen)) {
            // When fragment has multiple children there is always at least one vNode
            nextNode = findDOMfromVNode(lastChildren[lastLen - 1], false).nextSibling;
        }
    }
    patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, lastVNode, lifecycle);
}
function patchPortal(lastVNode, nextVNode, context, lifecycle) {
    var lastContainer = lastVNode.ref;
    var nextContainer = nextVNode.ref;
    var nextChildren = nextVNode.children;
    patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, lastContainer, context, false, null, lastVNode, lifecycle);
    nextVNode.dom = lastVNode.dom;
    if (lastContainer !== nextContainer && !isInvalid(nextChildren)) {
        var node = nextChildren.dom;
        removeChild(lastContainer, node);
        appendChild(nextContainer, node);
    }
}
function patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle) {
    var dom = (nextVNode.dom = lastVNode.dom);
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var isFormElement = false;
    var hasControlledValue = false;
    var nextPropsOrEmpty;
    isSVG = isSVG || (nextFlags & 32 /* SvgElement */) > 0;
    // inlined patchProps  -- starts --
    if (lastProps !== nextProps) {
        var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
        nextPropsOrEmpty = nextProps || EMPTY_OBJ;
        if (nextPropsOrEmpty !== EMPTY_OBJ) {
            isFormElement = (nextFlags & 448 /* FormElement */) > 0;
            if (isFormElement) {
                hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
            }
            for (var prop in nextPropsOrEmpty) {
                var lastValue = lastPropsOrEmpty[prop];
                var nextValue = nextPropsOrEmpty[prop];
                if (lastValue !== nextValue) {
                    patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
        if (lastPropsOrEmpty !== EMPTY_OBJ) {
            for (var prop$1 in lastPropsOrEmpty) {
                if (isNullOrUndef(nextPropsOrEmpty[prop$1]) && !isNullOrUndef(lastPropsOrEmpty[prop$1])) {
                    patchProp(prop$1, lastPropsOrEmpty[prop$1], null, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
    }
    var nextChildren = nextVNode.children;
    var nextClassName = nextVNode.className;
    // inlined patchProps  -- ends --
    if (lastVNode.className !== nextClassName) {
        if (isNullOrUndef(nextClassName)) {
            dom.removeAttribute('class');
        }
        else if (isSVG) {
            dom.setAttribute('class', nextClassName);
        }
        else {
            dom.className = nextClassName;
        }
    }
    if (nextFlags & 4096 /* ContentEditable */) {
        patchContentEditableChildren(dom, nextChildren);
    }
    else {
        patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, dom, context, isSVG && nextVNode.type !== 'foreignObject', null, lastVNode, lifecycle);
    }
    if (isFormElement) {
        processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, false, hasControlledValue);
    }
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, dom, lifecycle);
    }
}
function replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle) {
    unmount(lastChildren);
    mountArrayChildren(nextChildren, parentDOM, context, isSVG, findDOMfromVNode(lastChildren, true), lifecycle);
    removeVNodeDOM(lastChildren, parentDOM);
}
function patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, parentVNode, lifecycle) {
    switch (lastChildFlags) {
        case 2 /* HasVNodeChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    patch(lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    remove(lastChildren, parentDOM);
                    break;
                case 16 /* HasTextChildren */:
                    unmount(lastChildren);
                    setTextContent(parentDOM, nextChildren);
                    break;
                default:
                    replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle);
                    break;
            }
            break;
        case 1 /* HasInvalidChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    break;
                case 16 /* HasTextChildren */:
                    setTextContent(parentDOM, nextChildren);
                    break;
                default:
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
            }
            break;
        case 16 /* HasTextChildren */:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    patchSingleTextChild(lastChildren, nextChildren, parentDOM);
                    break;
                case 2 /* HasVNodeChildren */:
                    clearDOM(parentDOM);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    clearDOM(parentDOM);
                    break;
                default:
                    clearDOM(parentDOM);
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
            }
            break;
        default:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    unmountAllChildren(lastChildren);
                    setTextContent(parentDOM, nextChildren);
                    break;
                case 2 /* HasVNodeChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                    break;
                case 1 /* HasInvalidChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    break;
                default:
                    var lastLength = lastChildren.length | 0;
                    var nextLength = nextChildren.length | 0;
                    // Fast path's for both algorithms
                    if (lastLength === 0) {
                        if (nextLength > 0) {
                            mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
                        }
                    }
                    else if (nextLength === 0) {
                        removeAllChildren(parentDOM, parentVNode, lastChildren);
                    }
                    else if (nextChildFlags === 8 /* HasKeyedChildren */ && lastChildFlags === 8 /* HasKeyedChildren */) {
                        patchKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, parentVNode, lifecycle);
                    }
                    else {
                        patchNonKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, lifecycle);
                    }
                    break;
            }
            break;
    }
}
function createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle) {
    lifecycle.push(function () {
        instance.componentDidUpdate(lastProps, lastState, snapshot);
    });
}
function updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, force, nextNode, lifecycle) {
    var lastState = instance.state;
    var lastProps = instance.props;
    var usesNewAPI = Boolean(instance.$N);
    var hasSCU = isFunction(instance.shouldComponentUpdate);
    if (usesNewAPI) {
        nextState = createDerivedState(instance, nextProps, nextState !== lastState ? combineFrom(lastState, nextState) : nextState);
    }
    if (force || !hasSCU || (hasSCU && instance.shouldComponentUpdate(nextProps, nextState, context))) {
        if (!usesNewAPI && isFunction(instance.componentWillUpdate)) {
            instance.componentWillUpdate(nextProps, nextState, context);
        }
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
        var snapshot = null;
        var nextInput = renderNewInput(instance, nextProps, context);
        if (usesNewAPI && isFunction(instance.getSnapshotBeforeUpdate)) {
            snapshot = instance.getSnapshotBeforeUpdate(lastProps, lastState);
        }
        patch(instance.$LI, nextInput, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
        // Dont update Last input, until patch has been succesfully executed
        instance.$LI = nextInput;
        if (isFunction(instance.componentDidUpdate)) {
            createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle);
        }
    }
    else {
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
    }
}
function patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = (nextVNode.children = lastVNode.children);
    // If Component has crashed, ignore it to stay functional
    if (isNull(instance)) {
        return;
    }
    instance.$L = lifecycle;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    var nextState = instance.state;
    if (!instance.$N) {
        if (isFunction(instance.componentWillReceiveProps)) {
            instance.$BR = true;
            instance.componentWillReceiveProps(nextProps, context);
            // If instance component was removed during its own update do nothing.
            if (instance.$UN) {
                return;
            }
            instance.$BR = false;
        }
        if (!isNull(instance.$PS)) {
            nextState = combineFrom(nextState, instance.$PS);
            instance.$PS = null;
        }
    }
    updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, false, nextNode, lifecycle);
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, instance, lifecycle);
    }
}
function patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var shouldUpdate = true;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastProps = lastVNode.props;
    var nextHooksDefined = !isNullOrUndef(nextRef);
    var lastInput = lastVNode.children;
    if (nextHooksDefined && isFunction(nextRef.onComponentShouldUpdate)) {
        shouldUpdate = nextRef.onComponentShouldUpdate(lastProps, nextProps);
    }
    if (shouldUpdate !== false) {
        if (nextHooksDefined && isFunction(nextRef.onComponentWillUpdate)) {
            nextRef.onComponentWillUpdate(lastProps, nextProps);
        }
        var nextInput = normalizeRoot(renderFunctionalComponent(nextVNode, context));
        patch(lastInput, nextInput, parentDOM, context, isSVG, nextNode, lifecycle);
        nextVNode.children = nextInput;
        if (nextHooksDefined && isFunction(nextRef.onComponentDidUpdate)) {
            nextRef.onComponentDidUpdate(lastProps, nextProps);
        }
    }
    else {
        nextVNode.children = lastInput;
    }
}
function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = (nextVNode.dom = lastVNode.dom);
    if (nextText !== lastVNode.children) {
        dom.nodeValue = nextText;
    }
}
function patchNonKeyedChildren(lastChildren, nextChildren, dom, context, isSVG, lastChildrenLength, nextChildrenLength, nextNode, lifecycle) {
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;
    var nextChild;
    var lastChild;
    for (; i < commonLength; ++i) {
        nextChild = nextChildren[i];
        lastChild = lastChildren[i];
        if (nextChild.flags & 16384 /* InUse */) {
            nextChild = nextChildren[i] = directClone(nextChild);
        }
        patch(lastChild, nextChild, dom, context, isSVG, nextNode, lifecycle);
        lastChildren[i] = nextChild;
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; ++i) {
            nextChild = nextChildren[i];
            if (nextChild.flags & 16384 /* InUse */) {
                nextChild = nextChildren[i] = directClone(nextChild);
            }
            mount(nextChild, dom, context, isSVG, nextNode, lifecycle);
        }
    }
    else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; ++i) {
            remove(lastChildren[i], dom);
        }
    }
}
function patchKeyedChildren(a, b, dom, context, isSVG, aLength, bLength, outerEdge, parentVNode, lifecycle) {
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var j = 0;
    var aNode = a[j];
    var bNode = b[j];
    var nextPos;
    var nextNode;
    // Step 1
    // tslint:disable-next-line
    outer: {
        // Sync nodes with the same key at the beginning.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[j] = bNode = directClone(bNode);
            }
            patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
            a[j] = bNode;
            ++j;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[j];
            bNode = b[j];
        }
        aNode = a[aEnd];
        bNode = b[bEnd];
        // Sync nodes with the same key at the end.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[bEnd] = bNode = directClone(bNode);
            }
            patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
            a[aEnd] = bNode;
            aEnd--;
            bEnd--;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[aEnd];
            bNode = b[bEnd];
        }
    }
    if (j > aEnd) {
        if (j <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge;
            while (j <= bEnd) {
                bNode = b[j];
                if (bNode.flags & 16384 /* InUse */) {
                    b[j] = bNode = directClone(bNode);
                }
                ++j;
                mount(bNode, dom, context, isSVG, nextNode, lifecycle);
            }
        }
    }
    else if (j > bEnd) {
        while (j <= aEnd) {
            remove(a[j++], dom);
        }
    }
    else {
        patchKeyedChildrenComplex(a, b, context, aLength, bLength, aEnd, bEnd, j, dom, isSVG, outerEdge, parentVNode, lifecycle);
    }
}
function patchKeyedChildrenComplex(a, b, context, aLength, bLength, aEnd, bEnd, j, dom, isSVG, outerEdge, parentVNode, lifecycle) {
    var aNode;
    var bNode;
    var nextPos;
    var i = 0;
    var aStart = j;
    var bStart = j;
    var aLeft = aEnd - j + 1;
    var bLeft = bEnd - j + 1;
    var sources = new Int32Array(bLeft + 1);
    // Keep track if its possible to remove whole DOM using textContent = '';
    var canRemoveWholeContent = aLeft === aLength;
    var moved = false;
    var pos = 0;
    var patched = 0;
    // When sizes are small, just loop them through
    if (bLength < 4 || (aLeft | bLeft) < 32) {
        for (i = aStart; i <= aEnd; ++i) {
            aNode = a[i];
            if (patched < bLeft) {
                for (j = bStart; j <= bEnd; j++) {
                    bNode = b[j];
                    if (aNode.key === bNode.key) {
                        sources[j - bStart] = i + 1;
                        if (canRemoveWholeContent) {
                            canRemoveWholeContent = false;
                            while (aStart < i) {
                                remove(a[aStart++], dom);
                            }
                        }
                        if (pos > j) {
                            moved = true;
                        }
                        else {
                            pos = j;
                        }
                        if (bNode.flags & 16384 /* InUse */) {
                            b[j] = bNode = directClone(bNode);
                        }
                        patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
                        ++patched;
                        break;
                    }
                }
                if (!canRemoveWholeContent && j > bEnd) {
                    remove(aNode, dom);
                }
            }
            else if (!canRemoveWholeContent) {
                remove(aNode, dom);
            }
        }
    }
    else {
        var keyIndex = {};
        // Map keys by their index
        for (i = bStart; i <= bEnd; ++i) {
            keyIndex[b[i].key] = i;
        }
        // Try to patch same keys
        for (i = aStart; i <= aEnd; ++i) {
            aNode = a[i];
            if (patched < bLeft) {
                j = keyIndex[aNode.key];
                if (j !== void 0) {
                    if (canRemoveWholeContent) {
                        canRemoveWholeContent = false;
                        while (i > aStart) {
                            remove(a[aStart++], dom);
                        }
                    }
                    sources[j - bStart] = i + 1;
                    if (pos > j) {
                        moved = true;
                    }
                    else {
                        pos = j;
                    }
                    bNode = b[j];
                    if (bNode.flags & 16384 /* InUse */) {
                        b[j] = bNode = directClone(bNode);
                    }
                    patch(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle);
                    ++patched;
                }
                else if (!canRemoveWholeContent) {
                    remove(aNode, dom);
                }
            }
            else if (!canRemoveWholeContent) {
                remove(aNode, dom);
            }
        }
    }
    // fast-path: if nothing patched remove all old and add all new
    if (canRemoveWholeContent) {
        removeAllChildren(dom, parentVNode, a);
        mountArrayChildren(b, dom, context, isSVG, outerEdge, lifecycle);
    }
    else if (moved) {
        var seq = lis_algorithm(sources);
        j = seq.length - 1;
        for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === 0) {
                pos = i + bStart;
                bNode = b[pos];
                if (bNode.flags & 16384 /* InUse */) {
                    b[pos] = bNode = directClone(bNode);
                }
                nextPos = pos + 1;
                mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle);
            }
            else if (j < 0 || i !== seq[j]) {
                pos = i + bStart;
                bNode = b[pos];
                nextPos = pos + 1;
                moveVNodeDOM(bNode, dom, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge);
            }
            else {
                j--;
            }
        }
    }
    else if (patched !== bLeft) {
        // when patched count doesn't match b length we need to insert those new ones
        // loop backwards so we can use insertBefore
        for (i = bLeft - 1; i >= 0; i--) {
            if (sources[i] === 0) {
                pos = i + bStart;
                bNode = b[pos];
                if (bNode.flags & 16384 /* InUse */) {
                    b[pos] = bNode = directClone(bNode);
                }
                nextPos = pos + 1;
                mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle);
            }
        }
    }
}
var result;
var p;
var maxLen = 0;
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr) {
    var arrI = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var u = 0;
    var v = 0;
    var c = 0;
    var len = arr.length;
    if (len > maxLen) {
        maxLen = len;
        result = new Int32Array(len);
        p = new Int32Array(len);
    }
    for (; i < len; ++i) {
        arrI = arr[i];
        if (arrI !== 0) {
            j = result[k];
            if (arr[j] < arrI) {
                p[i] = j;
                result[++k] = i;
                continue;
            }
            u = 0;
            v = k;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = k + 1;
    var seq = new Int32Array(u);
    v = result[u - 1];
    while (u-- > 0) {
        seq[u] = v;
        v = p[v];
        result[u] = 0;
    }
    return seq;
}

var hasDocumentAvailable = typeof document !== 'undefined';
if (hasDocumentAvailable) {
    /*
     * Defining $EV and $V properties on Node.prototype
     * fixes v8 "wrong map" de-optimization
     */
    if (window.Node) {
        Node.prototype.$EV = null;
        Node.prototype.$V = null;
    }
}
function __render(input, parentDOM, callback, context) {
    var lifecycle = [];
    var rootInput = parentDOM.$V;
    renderCheck.v = true;
    if (isNullOrUndef(rootInput)) {
        if (!isNullOrUndef(input)) {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            mount(input, parentDOM, context, false, null, lifecycle);
            parentDOM.$V = input;
            rootInput = input;
        }
    }
    else {
        if (isNullOrUndef(input)) {
            remove(rootInput, parentDOM);
            parentDOM.$V = null;
        }
        else {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            patch(rootInput, input, parentDOM, context, false, null, lifecycle);
            rootInput = parentDOM.$V = input;
        }
    }
    callAll(lifecycle);
    renderCheck.v = false;
    if (isFunction(callback)) {
        callback();
    }
    if (isFunction(options.renderComplete)) {
        options.renderComplete(rootInput, parentDOM);
    }
}
function render(input, parentDOM, callback, context) {
    if ( callback === void 0 ) callback = null;
    if ( context === void 0 ) context = EMPTY_OBJ;

    __render(input, parentDOM, callback, context);
}
function createRenderer(parentDOM) {
    return function renderer(lastInput, nextInput, callback, context) {
        if (!parentDOM) {
            parentDOM = lastInput;
        }
        render(nextInput, parentDOM, callback, context);
    };
}

var QUEUE = [];
var nextTick = typeof Promise !== 'undefined'
    ? Promise.resolve().then.bind(Promise.resolve())
    : function (a) {
        window.setTimeout(a, 0);
    };
var microTaskPending = false;
function queueStateChanges(component, newState, callback, force) {
    var pending = component.$PS;
    if (isFunction(newState)) {
        newState = newState(pending ? combineFrom(component.state, pending) : component.state, component.props, component.context);
    }
    if (isNullOrUndef(pending)) {
        component.$PS = newState;
    }
    else {
        for (var stateKey in newState) {
            pending[stateKey] = newState[stateKey];
        }
    }
    if (!component.$BR) {
        if (!renderCheck.v) {
            if (QUEUE.length === 0) {
                applyState(component, force);
                if (isFunction(callback)) {
                    callback.call(component);
                }
                return;
            }
        }
        if (QUEUE.indexOf(component) === -1) {
            QUEUE.push(component);
        }
        if (force) {
            component.$F = true;
        }
        if (!microTaskPending) {
            microTaskPending = true;
            nextTick(rerender);
        }
        if (isFunction(callback)) {
            var QU = component.$QU;
            if (!QU) {
                QU = component.$QU = [];
            }
            QU.push(callback);
        }
    }
    else if (isFunction(callback)) {
        component.$L.push(callback.bind(component));
    }
}
function callSetStateCallbacks(component) {
    var queue = component.$QU;
    for (var i = 0; i < queue.length; ++i) {
        queue[i].call(component);
    }
    component.$QU = null;
}
function rerender() {
    var component;
    microTaskPending = false;
    while ((component = QUEUE.shift())) {
        if (!component.$UN) {
            var force = component.$F;
            component.$F = false;
            applyState(component, force);
            if (component.$QU) {
                callSetStateCallbacks(component);
            }
        }
    }
}
function applyState(component, force) {
    if (force || !component.$BR) {
        var pendingState = component.$PS;
        component.$PS = null;
        var lifecycle = [];
        renderCheck.v = true;
        updateClassComponent(component, combineFrom(component.state, pendingState), component.props, findDOMfromVNode(component.$LI, true).parentNode, component.context, component.$SVG, force, null, lifecycle);
        callAll(lifecycle);
        renderCheck.v = false;
    }
    else {
        component.state = component.$PS;
        component.$PS = null;
    }
}
var Component = function Component(props, context) {
    // Public
    this.state = null;
    // Internal properties
    this.$BR = false; // BLOCK RENDER
    this.$BS = true; // BLOCK STATE
    this.$PS = null; // PENDING STATE (PARTIAL or FULL)
    this.$LI = null; // LAST INPUT
    this.$UN = false; // UNMOUNTED
    this.$CX = null; // CHILDCONTEXT
    this.$QU = null; // QUEUE
    this.$N = false; // Uses new lifecycle API Flag
    this.$L = null; // Current lifecycle of this component
    this.$SVG = false; // Flag to keep track if component is inside SVG tree
    this.$F = false; // Force update flag
    this.props = props || EMPTY_OBJ;
    this.context = context || EMPTY_OBJ; // context should not be mutable
};
Component.prototype.forceUpdate = function forceUpdate (callback) {
    if (this.$UN) {
        return;
    }
    // Do not allow double render during force update
    queueStateChanges(this, {}, callback, true);
};
Component.prototype.setState = function setState (newState, callback) {
    if (this.$UN) {
        return;
    }
    if (!this.$BS) {
        queueStateChanges(this, newState, callback, false);
    }
};
Component.prototype.render = function render (_nextProps, _nextState, _nextContext) {
    return null;
};

var version = "7.4.8";



;// CONCATENATED MODULE: ./node_modules/inferno/index.esm.js


if (false) {}


/***/ }),

/***/ 216:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ma=this;function oa(q){var w=0;return function(){return w<q.length?{done:!1,value:q[w++]}:{done:!0}}}var pa="function"==typeof Object.defineProperties?Object.defineProperty:function(q,w,h){q!=Array.prototype&&q!=Object.prototype&&(q[w]=h.value)};function qa(q){q=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof __webpack_require__.g&&__webpack_require__.g,q];for(var w=0;w<q.length;++w){var h=q[w];if(h&&h.Math==Math)return h}throw Error("Cannot find global object");}var ra=qa(this);
function sa(){sa=function(){};ra.Symbol||(ra.Symbol=ta)}function ua(q,w){this.P=q;pa(this,"description",{configurable:!0,writable:!0,value:w})}ua.prototype.toString=function(){return this.P};var ta=function(){function q(h){if(this instanceof q)throw new TypeError("Symbol is not a constructor");return new ua("jscomp_symbol_"+(h||"")+"_"+w++,h)}var w=0;return q}();
function Ea(q,w){if(w){var h=ra;q=q.split(".");for(var l=0;l<q.length-1;l++){var m=q[l];m in h||(h[m]={});h=h[m]}q=q[q.length-1];l=h[q];w=w(l);w!=l&&null!=w&&pa(h,q,{configurable:!0,writable:!0,value:w})}}Ea("Math.imul",function(q){return q?q:function(w,h){w=Number(w);h=Number(h);var l=w&65535,m=h&65535;return l*m+((w>>>16&65535)*m+l*(h>>>16&65535)<<16>>>0)|0}});
Ea("Array.prototype.fill",function(q){return q?q:function(w,h,l){var m=this.length||0;0>h&&(h=Math.max(0,m+h));if(null==l||l>m)l=m;l=Number(l);0>l&&(l=Math.max(0,m+l));for(h=Number(h||0);h<l;h++)this[h]=w;return this}});function Fa(q){var w=null;return function(){return w=w||q()}}
var Ga=Fa(function(){return function(q,w){w&&(q.fd=w,q.prototype=Object.create(w.prototype,{constructor:{value:q,enumerable:!1,writable:!0,configurable:!0}}))}}),Ha=Fa(function(){function q(a,b,g){var f=a.a,k=b.a,t=g.a,y=0,A=f[0]|0,C=A&8191,B=A>>>13,D=f[1]|0;A=D&8191;var K=D>>>13,E=f[2]|0;D=E&8191;var T=E>>>13,F=f[3]|0;E=F&8191;var X=F>>>13,G=f[4]|0;F=G&8191;var Y=G>>>13,H=f[5]|0;G=H&8191;var Z=H>>>13,I=f[6]|0;H=I&8191;var aa=I>>>13,J=f[7]|0;I=J&8191;var ba=J>>>13,U=f[8]|0;J=U&8191;U>>>=13;var V=
f[9]|0;f=V&8191;V>>>=13;var L=k[0]|0,ca=L&8191,da=L>>>13,M=k[1]|0;L=M&8191;var ea=M>>>13,N=k[2]|0;M=N&8191;var fa=N>>>13,O=k[3]|0;N=O&8191;var ha=O>>>13,P=k[4]|0;O=P&8191;var ia=P>>>13,Q=k[5]|0;P=Q&8191;var ja=Q>>>13,R=k[6]|0;Q=R&8191;var ka=R>>>13,S=k[7]|0;R=S&8191;var la=S>>>13,W=k[8]|0;S=W&8191;W>>>=13;var na=k[9]|0;k=na&8191;na>>>=13;g.b=a.b^b.b;g.length=19;var p=c(C,ca);a=c(C,da);a=a+c(B,ca)|0;b=c(B,da);var va=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(va>>>26)|0;va&=67108863;p=c(A,ca);a=c(A,
da);a=a+c(K,ca)|0;b=c(K,da);p=p+c(C,L)|0;a=a+c(C,ea)|0;a=a+c(B,L)|0;b=b+c(B,ea)|0;var wa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(wa>>>26)|0;wa&=67108863;p=c(D,ca);a=c(D,da);a=a+c(T,ca)|0;b=c(T,da);p=p+c(A,L)|0;a=a+c(A,ea)|0;a=a+c(K,L)|0;b=b+c(K,ea)|0;p=p+c(C,M)|0;a=a+c(C,fa)|0;a=a+c(B,M)|0;b=b+c(B,fa)|0;var xa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(xa>>>26)|0;xa&=67108863;p=c(E,ca);a=c(E,da);a=a+c(X,ca)|0;b=c(X,da);p=p+c(D,L)|0;a=a+c(D,ea)|0;a=a+c(T,L)|0;b=b+c(T,ea)|0;p=p+c(A,M)|0;a=a+c(A,
fa)|0;a=a+c(K,M)|0;b=b+c(K,fa)|0;p=p+c(C,N)|0;a=a+c(C,ha)|0;a=a+c(B,N)|0;b=b+c(B,ha)|0;var ya=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(ya>>>26)|0;ya&=67108863;p=c(F,ca);a=c(F,da);a=a+c(Y,ca)|0;b=c(Y,da);p=p+c(E,L)|0;a=a+c(E,ea)|0;a=a+c(X,L)|0;b=b+c(X,ea)|0;p=p+c(D,M)|0;a=a+c(D,fa)|0;a=a+c(T,M)|0;b=b+c(T,fa)|0;p=p+c(A,N)|0;a=a+c(A,ha)|0;a=a+c(K,N)|0;b=b+c(K,ha)|0;p=p+c(C,O)|0;a=a+c(C,ia)|0;a=a+c(B,O)|0;b=b+c(B,ia)|0;var za=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(za>>>26)|0;za&=67108863;p=c(G,
ca);a=c(G,da);a=a+c(Z,ca)|0;b=c(Z,da);p=p+c(F,L)|0;a=a+c(F,ea)|0;a=a+c(Y,L)|0;b=b+c(Y,ea)|0;p=p+c(E,M)|0;a=a+c(E,fa)|0;a=a+c(X,M)|0;b=b+c(X,fa)|0;p=p+c(D,N)|0;a=a+c(D,ha)|0;a=a+c(T,N)|0;b=b+c(T,ha)|0;p=p+c(A,O)|0;a=a+c(A,ia)|0;a=a+c(K,O)|0;b=b+c(K,ia)|0;p=p+c(C,P)|0;a=a+c(C,ja)|0;a=a+c(B,P)|0;b=b+c(B,ja)|0;var Aa=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Aa>>>26)|0;Aa&=67108863;p=c(H,ca);a=c(H,da);a=a+c(aa,ca)|0;b=c(aa,da);p=p+c(G,L)|0;a=a+c(G,ea)|0;a=a+c(Z,L)|0;b=b+c(Z,ea)|0;p=p+c(F,M)|0;a=a+c(F,
fa)|0;a=a+c(Y,M)|0;b=b+c(Y,fa)|0;p=p+c(E,N)|0;a=a+c(E,ha)|0;a=a+c(X,N)|0;b=b+c(X,ha)|0;p=p+c(D,O)|0;a=a+c(D,ia)|0;a=a+c(T,O)|0;b=b+c(T,ia)|0;p=p+c(A,P)|0;a=a+c(A,ja)|0;a=a+c(K,P)|0;b=b+c(K,ja)|0;p=p+c(C,Q)|0;a=a+c(C,ka)|0;a=a+c(B,Q)|0;b=b+c(B,ka)|0;var Ba=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Ba>>>26)|0;Ba&=67108863;p=c(I,ca);a=c(I,da);a=a+c(ba,ca)|0;b=c(ba,da);p=p+c(H,L)|0;a=a+c(H,ea)|0;a=a+c(aa,L)|0;b=b+c(aa,ea)|0;p=p+c(G,M)|0;a=a+c(G,fa)|0;a=a+c(Z,M)|0;b=b+c(Z,fa)|0;p=p+c(F,N)|0;a=a+c(F,ha)|
0;a=a+c(Y,N)|0;b=b+c(Y,ha)|0;p=p+c(E,O)|0;a=a+c(E,ia)|0;a=a+c(X,O)|0;b=b+c(X,ia)|0;p=p+c(D,P)|0;a=a+c(D,ja)|0;a=a+c(T,P)|0;b=b+c(T,ja)|0;p=p+c(A,Q)|0;a=a+c(A,ka)|0;a=a+c(K,Q)|0;b=b+c(K,ka)|0;p=p+c(C,R)|0;a=a+c(C,la)|0;a=a+c(B,R)|0;b=b+c(B,la)|0;var Ca=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Ca>>>26)|0;Ca&=67108863;p=c(J,ca);a=c(J,da);a=a+c(U,ca)|0;b=c(U,da);p=p+c(I,L)|0;a=a+c(I,ea)|0;a=a+c(ba,L)|0;b=b+c(ba,ea)|0;p=p+c(H,M)|0;a=a+c(H,fa)|0;a=a+c(aa,M)|0;b=b+c(aa,fa)|0;p=p+c(G,N)|0;a=a+c(G,ha)|0;
a=a+c(Z,N)|0;b=b+c(Z,ha)|0;p=p+c(F,O)|0;a=a+c(F,ia)|0;a=a+c(Y,O)|0;b=b+c(Y,ia)|0;p=p+c(E,P)|0;a=a+c(E,ja)|0;a=a+c(X,P)|0;b=b+c(X,ja)|0;p=p+c(D,Q)|0;a=a+c(D,ka)|0;a=a+c(T,Q)|0;b=b+c(T,ka)|0;p=p+c(A,R)|0;a=a+c(A,la)|0;a=a+c(K,R)|0;b=b+c(K,la)|0;p=p+c(C,S)|0;a=a+c(C,W)|0;a=a+c(B,S)|0;b=b+c(B,W)|0;var Da=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(Da>>>26)|0;Da&=67108863;p=c(f,ca);a=c(f,da);a=a+c(V,ca)|0;b=c(V,da);p=p+c(J,L)|0;a=a+c(J,ea)|0;a=a+c(U,L)|0;b=b+c(U,ea)|0;p=p+c(I,M)|0;a=a+c(I,fa)|0;a=a+c(ba,
M)|0;b=b+c(ba,fa)|0;p=p+c(H,N)|0;a=a+c(H,ha)|0;a=a+c(aa,N)|0;b=b+c(aa,ha)|0;p=p+c(G,O)|0;a=a+c(G,ia)|0;a=a+c(Z,O)|0;b=b+c(Z,ia)|0;p=p+c(F,P)|0;a=a+c(F,ja)|0;a=a+c(Y,P)|0;b=b+c(Y,ja)|0;p=p+c(E,Q)|0;a=a+c(E,ka)|0;a=a+c(X,Q)|0;b=b+c(X,ka)|0;p=p+c(D,R)|0;a=a+c(D,la)|0;a=a+c(T,R)|0;b=b+c(T,la)|0;p=p+c(A,S)|0;a=a+c(A,W)|0;a=a+c(K,S)|0;b=b+c(K,W)|0;p=p+c(C,k)|0;a=a+c(C,na)|0;a=a+c(B,k)|0;b=b+c(B,na)|0;C=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(C>>>26)|0;C&=67108863;p=c(f,L);a=c(f,ea);a=a+c(V,L)|0;b=c(V,
ea);p=p+c(J,M)|0;a=a+c(J,fa)|0;a=a+c(U,M)|0;b=b+c(U,fa)|0;p=p+c(I,N)|0;a=a+c(I,ha)|0;a=a+c(ba,N)|0;b=b+c(ba,ha)|0;p=p+c(H,O)|0;a=a+c(H,ia)|0;a=a+c(aa,O)|0;b=b+c(aa,ia)|0;p=p+c(G,P)|0;a=a+c(G,ja)|0;a=a+c(Z,P)|0;b=b+c(Z,ja)|0;p=p+c(F,Q)|0;a=a+c(F,ka)|0;a=a+c(Y,Q)|0;b=b+c(Y,ka)|0;p=p+c(E,R)|0;a=a+c(E,la)|0;a=a+c(X,R)|0;b=b+c(X,la)|0;p=p+c(D,S)|0;a=a+c(D,W)|0;a=a+c(T,S)|0;b=b+c(T,W)|0;p=p+c(A,k)|0;a=a+c(A,na)|0;a=a+c(K,k)|0;b=b+c(K,na)|0;A=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(A>>>26)|0;A&=67108863;
p=c(f,M);a=c(f,fa);a=a+c(V,M)|0;b=c(V,fa);p=p+c(J,N)|0;a=a+c(J,ha)|0;a=a+c(U,N)|0;b=b+c(U,ha)|0;p=p+c(I,O)|0;a=a+c(I,ia)|0;a=a+c(ba,O)|0;b=b+c(ba,ia)|0;p=p+c(H,P)|0;a=a+c(H,ja)|0;a=a+c(aa,P)|0;b=b+c(aa,ja)|0;p=p+c(G,Q)|0;a=a+c(G,ka)|0;a=a+c(Z,Q)|0;b=b+c(Z,ka)|0;p=p+c(F,R)|0;a=a+c(F,la)|0;a=a+c(Y,R)|0;b=b+c(Y,la)|0;p=p+c(E,S)|0;a=a+c(E,W)|0;a=a+c(X,S)|0;b=b+c(X,W)|0;p=p+c(D,k)|0;a=a+c(D,na)|0;a=a+c(T,k)|0;b=b+c(T,na)|0;D=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(D>>>26)|0;D&=67108863;p=c(f,N);a=c(f,
ha);a=a+c(V,N)|0;b=c(V,ha);p=p+c(J,O)|0;a=a+c(J,ia)|0;a=a+c(U,O)|0;b=b+c(U,ia)|0;p=p+c(I,P)|0;a=a+c(I,ja)|0;a=a+c(ba,P)|0;b=b+c(ba,ja)|0;p=p+c(H,Q)|0;a=a+c(H,ka)|0;a=a+c(aa,Q)|0;b=b+c(aa,ka)|0;p=p+c(G,R)|0;a=a+c(G,la)|0;a=a+c(Z,R)|0;b=b+c(Z,la)|0;p=p+c(F,S)|0;a=a+c(F,W)|0;a=a+c(Y,S)|0;b=b+c(Y,W)|0;p=p+c(E,k)|0;a=a+c(E,na)|0;a=a+c(X,k)|0;b=b+c(X,na)|0;E=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(E>>>26)|0;E&=67108863;p=c(f,O);a=c(f,ia);a=a+c(V,O)|0;b=c(V,ia);p=p+c(J,P)|0;a=a+c(J,ja)|0;a=a+c(U,P)|0;
b=b+c(U,ja)|0;p=p+c(I,Q)|0;a=a+c(I,ka)|0;a=a+c(ba,Q)|0;b=b+c(ba,ka)|0;p=p+c(H,R)|0;a=a+c(H,la)|0;a=a+c(aa,R)|0;b=b+c(aa,la)|0;p=p+c(G,S)|0;a=a+c(G,W)|0;a=a+c(Z,S)|0;b=b+c(Z,W)|0;p=p+c(F,k)|0;a=a+c(F,na)|0;a=a+c(Y,k)|0;b=b+c(Y,na)|0;F=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(F>>>26)|0;F&=67108863;p=c(f,P);a=c(f,ja);a=a+c(V,P)|0;b=c(V,ja);p=p+c(J,Q)|0;a=a+c(J,ka)|0;a=a+c(U,Q)|0;b=b+c(U,ka)|0;p=p+c(I,R)|0;a=a+c(I,la)|0;a=a+c(ba,R)|0;b=b+c(ba,la)|0;p=p+c(H,S)|0;a=a+c(H,W)|0;a=a+c(aa,S)|0;b=b+c(aa,W)|
0;p=p+c(G,k)|0;a=a+c(G,na)|0;a=a+c(Z,k)|0;b=b+c(Z,na)|0;G=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(G>>>26)|0;G&=67108863;p=c(f,Q);a=c(f,ka);a=a+c(V,Q)|0;b=c(V,ka);p=p+c(J,R)|0;a=a+c(J,la)|0;a=a+c(U,R)|0;b=b+c(U,la)|0;p=p+c(I,S)|0;a=a+c(I,W)|0;a=a+c(ba,S)|0;b=b+c(ba,W)|0;p=p+c(H,k)|0;a=a+c(H,na)|0;a=a+c(aa,k)|0;b=b+c(aa,na)|0;H=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(H>>>26)|0;H&=67108863;p=c(f,R);a=c(f,la);a=a+c(V,R)|0;b=c(V,la);p=p+c(J,S)|0;a=a+c(J,W)|0;a=a+c(U,S)|0;b=b+c(U,W)|0;p=p+c(I,k)|
0;a=a+c(I,na)|0;a=a+c(ba,k)|0;b=b+c(ba,na)|0;I=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(I>>>26)|0;I&=67108863;p=c(f,S);a=c(f,W);a=a+c(V,S)|0;b=c(V,W);p=p+c(J,k)|0;a=a+c(J,na)|0;a=a+c(U,k)|0;b=b+c(U,na)|0;J=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(J>>>26)|0;J&=67108863;p=c(f,k);a=c(f,na);a=a+c(V,k)|0;b=c(V,na);B=(y+p|0)+((a&8191)<<13)|0;y=(b+(a>>>13)|0)+(B>>>26)|0;t[0]=va;t[1]=wa;t[2]=xa;t[3]=ya;t[4]=za;t[5]=Aa;t[6]=Ba;t[7]=Ca;t[8]=Da;t[9]=C;t[10]=A;t[11]=D;t[12]=E;t[13]=F;t[14]=G;t[15]=H;t[16]=
I;t[17]=J;t[18]=B&67108863;0!==y&&(t[19]=y,g.length++);return g}function w(a,b){if(!a)throw Error(b||"Assertion failed");}function h(a,b,g){if(h.vc(a))return a;this.b=0;this.a=null;this.length=0;this.red=null;if(null!==a){if("le"===b||"be"===b)g=b,b=10;this.pa(a||0,b||10,g||"be")}}function l(a,b,g){var f=0;for(g=Math.min(a.length,g);b<g;b++){var k=a.charCodeAt(b)-48;f<<=4;f=49<=k&&54>=k?f|k-49+10:17<=k&&22>=k?f|k-17+10:f|k&15}return f}function m(a,b,g){g.b=b.b^a.b;var f=a.length+b.length|0;g.length=
f;f=f-1|0;var k=a.a[0]|0,t=b.a[0]|0;k*=t;var y=k/67108864|0;g.a[0]=k&67108863;for(var A=1;A<f;A++){var C=y>>>26,B=y&67108863;y=Math.min(A,b.length-1);for(var D=Math.max(0,A-a.length+1);D<=y;D++)k=a.a[A-D|0]|0,t=b.a[D]|0,k=k*t+B,C+=k/67108864|0,B=k&67108863;g.a[A]=B|0;y=C|0}0!==y?g.a[A]=y|0:g.length--;return g.L()}function x(a,b){this.name=a;this.p=new h(b,16);this.n=this.p.U();this.k=(new h(1)).ua(this.n).i(this.p);this.Ab=this.cc()}function d(){x.call(this,"k256","ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")}
function u(a){"string"===typeof a?(a=h.P(a),this.G=a.p,this.ja=a):(w(a.Cd(1),"modulus must be greater than 1"),this.G=a,this.ja=null)}var e={}; true?e=h:0;h.Gb=h;h.Eb=26;h.vc=function(a){return a instanceof h?!0:null!==a&&"object"===typeof a&&a.constructor.Eb===h.Eb&&Array.isArray(a.a)};h.prototype.pa=function(a,b,g){if("number"===typeof a)this.Yb(a,g);else if("object"===typeof a)this.Ia(a,g);else{"hex"===b&&(b=16);w(b===(b|0)&&2<=b&&36>=b);a=a.toString().replace(/\s+/g,"");
var f=0;"-"===a[0]&&f++;16===b?this.bc(a,f):this.td(a,b,f);"-"===a[0]&&(this.b=1);this.L();"le"===g&&this.Ia(this.H(),g)}};h.prototype.Yb=function(a,b){0>a&&(this.b=1,a=-a);67108864>a?(this.a=[a&67108863],this.length=1):4503599627370496>a?(this.a=[a&67108863,a/67108864&67108863],this.length=2):(w(9007199254740992>a),this.a=[a&67108863,a/67108864&67108863,1],this.length=3);"le"===b&&this.Ia(this.H(),b)};h.prototype.Ia=function(a,b){w("number"===typeof a.length);if(0>=a.length)this.a=[0],this.length=
1;else{this.length=Math.ceil(a.length/3);this.a=Array(this.length);for(var g=0;g<this.length;g++)this.a[g]=0;var f=0;if("be"===b)for(g=a.length-1,b=0;0<=g;g-=3){var k=a[g]|a[g-1]<<8|a[g-2]<<16;this.a[b]|=k<<f&67108863;this.a[b+1]=k>>>26-f&67108863;f+=24;26<=f&&(f-=26,b++)}else if("le"===b)for(b=g=0;g<a.length;g+=3)k=a[g]|a[g+1]<<8|a[g+2]<<16,this.a[b]|=k<<f&67108863,this.a[b+1]=k>>>26-f&67108863,f+=24,26<=f&&(f-=26,b++);this.L()}};h.prototype.bc=function(a,b){this.length=Math.ceil((a.length-b)/6);
this.a=Array(this.length);for(var g=0;g<this.length;g++)this.a[g]=0;var f,k=0;g=a.length-6;for(f=0;g>=b;g-=6){var t=l(a,g,g+6);this.a[f]|=t<<k&67108863;this.a[f+1]|=t>>>26-k&4194303;k+=24;26<=k&&(k-=26,f++)}g+6!==b&&(t=l(a,b,g+6),this.a[f]|=t<<k&67108863,this.a[f+1]|=t>>>26-k&4194303);this.L()};h.prototype.qc=function(a){a.a=Array(this.length);for(var b=0;b<this.length;b++)a.a[b]=this.a[b];a.length=this.length;a.b=this.b;a.red=this.red};h.prototype.clone=function(){var a=new h(null);this.qc(a);return a};
h.prototype.Rb=function(a){for(;this.length<a;)this.a[this.length++]=0};h.prototype.L=function(){for(;1<this.length&&0===this.a[this.length-1];)this.length--;return this.qa()};h.prototype.qa=function(){1===this.length&&0===this.a[0]&&(this.b=0);return this};var n=" 0 00 000 0000 00000 000000 0000000 00000000 000000000 0000000000 00000000000 000000000000 0000000000000 00000000000000 000000000000000 0000000000000000 00000000000000000 000000000000000000 0000000000000000000 00000000000000000000 000000000000000000000 0000000000000000000000 00000000000000000000000 000000000000000000000000 0000000000000000000000000".split(" "),
v=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],r=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,1E7,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64E6,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,243E5,28629151,33554432,39135393,45435424,52521875,60466176];h.prototype.toString=function(a,b){a=a||10;b=b|0||1;if(16===a||"hex"===a){var g="";for(var f=a=0,k=0;k<this.length;k++){var t=
this.a[k],y=((t<<a|f)&16777215).toString(16);f=t>>>24-a&16777215;g=0!==f||k!==this.length-1?n[6-y.length]+y+g:y+g;a+=2;26<=a&&(a-=26,k--)}for(0!==f&&(g=f.toString(16)+g);0!==g.length%b;)g="0"+g;0!==this.b&&(g="-"+g);return g}if(a===(a|0)&&2<=a&&36>=a){f=v[a];k=r[a];g="";t=this.clone();for(t.b=0;!t.w();)y=t.Da(k).toString(a),t=t.Dd(k),g=t.w()?y+g:n[f-y.length]+y+g;for(this.w()&&(g="0"+g);0!==g.length%b;)g="0"+g;0!==this.b&&(g="-"+g);return g}w(!1,"Base should be between 2 and 36")};h.prototype.H=function(a,
b){return this.hd(a,b)};h.prototype.hd=function(a,b){var g=Array,f=this.byteLength();b=b||Math.max(1,f);w(f<=b,"byte array longer than desired length");w(0<b,"Requested array length <= 0");this.L();var k="le"===a;g=new g(b);a=this.clone();if(k){for(k=0;!a.w();k++)f=a.T(255),a.j(8),g[k]=f;for(;k<b;k++)g[k]=0}else{for(k=0;k<b-f;k++)g[k]=0;for(k=0;!a.w();k++)f=a.T(255),a.j(8),g[b-k-1]=f}return g};h.prototype.fb=Math.clz32?function(a){return 32-Math.clz32(a)}:function(a){var b=0;4096<=a&&(b+=13,a>>>=
13);64<=a&&(b+=7,a>>>=7);8<=a&&(b+=4,a>>>=4);2<=a&&(b+=2,a>>>=2);return b+a};h.prototype.U=function(){return 26*(this.length-1)+this.fb(this.a[this.length-1])};h.prototype.byteLength=function(){return Math.ceil(this.U()/8)};h.prototype.l=function(){return this.clone().Pa()};h.prototype.Pa=function(){this.w()||(this.b^=1);return this};h.prototype.B=function(a){if(0!==this.b&&0===a.b)return this.b=0,this.i(a),this.b^=1,this.qa();if(0===this.b&&0!==a.b){a.b=0;var b=this.i(a);a.b=1;return b.qa()}if(this.length>
a.length)var g=this;else g=a,a=this;for(var f=b=0;f<a.length;f++)b=(g.a[f]|0)+(a.a[f]|0)+b,this.a[f]=b&67108863,b>>>=26;for(;0!==b&&f<g.length;f++)b=(g.a[f]|0)+b,this.a[f]=b&67108863,b>>>=26;this.length=g.length;if(0!==b)this.a[this.length]=b,this.length++;else if(g!==this)for(;f<g.length;f++)this.a[f]=g.a[f];return this};h.prototype.add=function(a){if(0!==a.b&&0===this.b){a.b=0;var b=this.sub(a);a.b^=1;return b}return 0===a.b&&0!==this.b?(this.b=0,b=a.sub(this),this.b=1,b):this.length>a.length?this.clone().B(a):
a.clone().B(this)};h.prototype.i=function(a){if(0!==a.b){a.b=0;var b=this.B(a);a.b=1;return b.qa()}if(0!==this.b)return this.b=0,this.B(a),this.b=1,this.qa();b=this.cmp(a);if(0===b)return this.b=0,this.length=1,this.a[0]=0,this;if(0<b)var g=this;else g=a,a=this;for(var f=0,k=0;k<a.length;k++)b=(g.a[k]|0)-(a.a[k]|0)+f,f=b>>26,this.a[k]=b&67108863;for(;0!==f&&k<g.length;k++)b=(g.a[k]|0)+f,f=b>>26,this.a[k]=b&67108863;if(0===f&&k<g.length&&g!==this)for(;k<g.length;k++)this.a[k]=g.a[k];this.length=Math.max(this.length,
k);g!==this&&(this.b=1);return this.L()};h.prototype.sub=function(a){return this.clone().i(a)};var c=Math.imul;Math.imul||(q=m);h.prototype.Oc=function(a,b){var g=this.length+a.length;if(10===this.length&&10===a.length)a=q(this,a,b);else if(63>g)a=m(this,a,b);else throw"removed";return a};h.prototype.o=function(a){var b=new h(null);b.a=Array(this.length+a.length);return this.Oc(a,b)};h.prototype.ua=function(a){w("number"===typeof a&&0<=a);var b=a%26;a=(a-b)/26;var g=67108863>>>26-b<<26-b,f;if(0!==
b){var k=0;for(f=0;f<this.length;f++){var t=this.a[f]&g;this.a[f]=(this.a[f]|0)-t<<b|k;k=t>>>26-b}k&&(this.a[f]=k,this.length++)}if(0!==a){for(f=this.length-1;0<=f;f--)this.a[f+a]=this.a[f];for(f=0;f<a;f++)this.a[f]=0;this.length+=a}return this.L()};h.prototype.j=function(a){w("number"===typeof a&&0<=a);var b=a%26,g=Math.min((a-b)/26,this.length),f=67108863^67108863>>>b<<b;var k=Math.max(0,-g);if(0!==g)if(this.length>g)for(this.length-=g,a=0;a<this.length;a++)this.a[a]=this.a[a+g];else this.a[0]=
0,this.length=1;g=0;for(a=this.length-1;0<=a&&(0!==g||a>=k);a--){var t=this.a[a]|0;this.a[a]=g<<26-b|t>>>b;g=t&f}0===this.length&&(this.a[0]=0,this.length=1);return this.L()};h.prototype.ld=function(a){return this.clone().ua(a)};h.prototype.ab=function(a){return this.clone().j(a)};h.prototype.Na=function(a){w("number"===typeof a);w(67108864>a);if(0>a)return this.Ca(-a);if(0!==this.b){if(1===this.length&&(this.a[0]|0)<a)return this.a[0]=a-(this.a[0]|0),this.b=0,this;this.b=0;this.Ca(a);this.b=1;return this}return this.Wb(a)};
h.prototype.Wb=function(a){this.a[0]+=a;for(a=0;a<this.length&&67108864<=this.a[a];a++)this.a[a]-=67108864,a===this.length-1?this.a[a+1]=1:this.a[a+1]++;this.length=Math.max(this.length,a+1);return this};h.prototype.Ca=function(a){w("number"===typeof a);w(67108864>a);if(0>a)return this.Na(-a);if(0!==this.b)return this.b=0,this.Na(a),this.b=1,this;this.a[0]-=a;if(1===this.length&&0>this.a[0])this.a[0]=-this.a[0],this.b=1;else for(a=0;a<this.length&&0>this.a[a];a++)this.a[a]+=67108864,--this.a[a+1];
return this.L()};h.prototype.Ja=function(a,b,g){var f;this.Rb(a.length+g);var k=0;for(f=0;f<a.length;f++){var t=(this.a[f+g]|0)+k;k=(a.a[f]|0)*b;t-=k&67108863;k=(t>>26)-(k/67108864|0);this.a[f+g]=t&67108863}for(;f<this.length-g;f++)t=(this.a[f+g]|0)+k,k=t>>26,this.a[f+g]=t&67108863;if(0===k)return this.L();w(-1===k);for(f=k=0;f<this.length;f++)t=-(this.a[f]|0)+k,k=t>>26,this.a[f]=t&67108863;this.b=1;return this.L()};h.prototype.ic=function(a,b){var g=this.clone(),f=a,k=f.a[f.length-1]|0;a=26-this.fb(k);
0!==a&&(f=f.ld(a),g.ua(a),k=f.a[f.length-1]|0);var t=g.length-f.length;if("mod"!==b){var y=new h(null);y.length=t+1;y.a=Array(y.length);for(var A=0;A<y.length;A++)y.a[A]=0}A=g.clone().Ja(f,1,t);0===A.b&&(g=A,y&&(y.a[t]=1));for(--t;0<=t;t--){A=67108864*(g.a[f.length+t]|0)+(g.a[f.length+t-1]|0);A=Math.min(A/k|0,67108863);for(g.Ja(f,A,t);0!==g.b;)A--,g.b=0,g.Ja(f,1,t),g.w()||(g.b^=1);y&&(y.a[t]=A)}y&&y.L();g.L();"div"!==b&&0!==a&&g.j(a);return{u:y||null,J:g}};h.prototype.ga=function(a,b,g){w(!a.w());
if(this.w())return{u:new h(0),J:new h(0)};var f;if(0!==this.b&&0===a.b){var k=this.l().ga(a,b);"mod"!==b&&(f=k.u.l());if("div"!==b){var t=k.J.l();g&&0!==t.b&&t.B(a)}return{u:f,J:t}}return 0===this.b&&0!==a.b?(k=this.ga(a.l(),b),"mod"!==b&&(f=k.u.l()),{u:f,J:k.J}):0!==(this.b&a.b)?(k=this.l().ga(a.l(),b),"div"!==b&&(t=k.J.l(),g&&0!==t.b&&t.i(a)),{u:k.u,J:t}):a.length>this.length||0>this.cmp(a)?{u:new h(0),J:this}:1===a.length?"div"===b?{u:this.sc(a.a[0]),J:null}:"mod"===b?{u:null,J:new h(this.Da(a.a[0]))}:
{u:this.sc(a.a[0]),J:new h(this.Da(a.a[0]))}:this.ic(a,b)};h.prototype.u=function(a){return this.ga(a,"div",!1).u};h.prototype.S=function(a){return this.ga(a,"mod",!0).J};h.prototype.mb=function(a){var b=this.ga(a);if(b.J.w())return b.u;var g=0!==b.u.b?b.J.i(a):b.J,f=a.ab(1);a=a.T(1);g=g.cmp(f);return 0>g||1===a&&0===g?b.u:0!==b.u.b?b.u.Ca(1):b.u.Na(1)};h.prototype.Da=function(a){w(67108863>=a);for(var b=67108864%a,g=0,f=this.length-1;0<=f;f--)g=(b*g+(this.a[f]|0))%a;return g};h.prototype.tc=function(a){w(0===
a.b);w(!a.w());var b=this,g=a.clone();b=0!==b.b?b.S(a):b.clone();a=new h(1);for(var f=new h(0),k=new h(0),t=new h(1),y=0;b.Ra()&&g.Ra();)b.j(1),g.j(1),++y;for(var A=g.clone(),C=b.clone();!b.w();){for(var B=0,D=1;0===(b.a[0]&D)&&26>B;++B,D<<=1);if(0<B)for(b.j(B);0<B--;){if(a.Y()||f.Y())a.B(A),f.i(C);a.j(1);f.j(1)}B=0;for(D=1;0===(g.a[0]&D)&&26>B;++B,D<<=1);if(0<B)for(g.j(B);0<B--;){if(k.Y()||t.Y())k.B(A),t.i(C);k.j(1);t.j(1)}0<=b.cmp(g)?(b.i(g),a.i(k),f.i(t)):(g.i(b),k.i(a),t.i(f))}return{I:k,M:t,
Bd:g.ua(y)}};h.prototype.Zb=function(a){w(0===a.b);w(!a.w());var b=this,g=a.clone();b=0!==b.b?b.S(a):b.clone();for(var f=new h(1),k=new h(0),t=g.clone();0<b.m(1)&&0<g.m(1);){for(var y=0,A=1;0===(b.a[0]&A)&&26>y;++y,A<<=1);if(0<y)for(b.j(y);0<y--;)f.Y()&&f.B(t),f.j(1);y=0;for(A=1;0===(g.a[0]&A)&&26>y;++y,A<<=1);if(0<y)for(g.j(y);0<y--;)k.Y()&&k.B(t),k.j(1);0<=b.cmp(g)?(b.i(g),f.i(k)):(g.i(b),k.i(f))}b=0===b.m(1)?f:k;0>b.m(0)&&b.B(a);return b};h.prototype.Ba=function(a){return this.tc(a).I.S(a)};h.prototype.Ra=
function(){return 0===(this.a[0]&1)};h.prototype.Y=function(){return 1===(this.a[0]&1)};h.prototype.T=function(a){return this.a[0]&a};h.prototype.w=function(){return 1===this.length&&0===this.a[0]};h.prototype.m=function(a){var b=0>a;if(0!==this.b&&!b)return-1;if(0===this.b&&b)return 1;this.L();1<this.length?a=1:(b&&(a=-a),w(67108863>=a,"Number is too big"),b=this.a[0]|0,a=b===a?0:b<a?-1:1);return 0!==this.b?-a|0:a};h.prototype.cmp=function(a){if(0!==this.b&&0===a.b)return-1;if(0===this.b&&0!==a.b)return 1;
a=this.Db(a);return 0!==this.b?-a|0:a};h.prototype.Db=function(a){if(this.length>a.length)return 1;if(this.length<a.length)return-1;for(var b=0,g=this.length-1;0<=g;g--){var f=this.a[g]|0,k=a.a[g]|0;if(f!==k){f<k?b=-1:f>k&&(b=1);break}}return b};h.red=function(a){return new u(a)};h.prototype.A=function(a){w(!this.red,"Already a number in reduction context");w(0===this.b,"red works only with positives");return a.pc(this).ea(a)};h.prototype.ta=function(){w(this.red,"fromRed works only with numbers in reduction context");
return this.red.oc(this)};h.prototype.ea=function(a){this.red=a;return this};h.prototype.$=function(a){w(this.red,"redAdd works only with red numbers");return this.red.add(this,a)};h.prototype.s=function(a){w(this.red,"redIAdd works only with red numbers");return this.red.B(this,a)};h.prototype.aa=function(a){w(this.red,"redSub works only with red numbers");return this.red.sub(this,a)};h.prototype.h=function(a){w(this.red,"redISub works only with red numbers");return this.red.i(this,a)};h.prototype.c=
function(a){w(this.red,"redMul works only with red numbers");this.red.fa(this,a);return this.red.o(this,a)};h.prototype.f=function(){w(this.red,"redSqr works only with red numbers");this.red.za(this);return this.red.yb(this)};h.prototype.Uc=function(){w(this.red,"redSqrt works only with red numbers");this.red.za(this);return this.red.sqrt(this)};h.prototype.Za=function(){w(this.red,"redInvm works only with red numbers");this.red.za(this);return this.red.Ba(this)};h.prototype.la=function(){w(this.red,
"redNeg works only with red numbers");this.red.za(this);return this.red.l(this)};var z={Fd:null,Kd:null,Jd:null,Ld:null};x.prototype.cc=function(){var a=new h(null);a.a=Array(Math.ceil(this.n/13));return a};x.prototype.Kc=function(a){do{this.split(a,this.Ab);a=this.Ic(a);a=a.B(this.Ab);var b=a.U()}while(b>this.n);b=b<this.n?-1:a.Db(this.p);0===b?(a.a[0]=0,a.length=1):0<b?a.i(this.p):a.L();return a};(function(a,b){function g(){}a.fd=b;g.prototype=b.prototype;a.prototype=new g;a.prototype.constructor=
a})(d,x);d.prototype.split=function(a,b){for(var g=Math.min(a.length,9),f=0;f<g;f++)b.a[f]=a.a[f];b.length=g;if(9>=a.length)a.a[0]=0,a.length=1;else{g=a.a[9];b.a[b.length++]=g&4194303;for(f=10;f<a.length;f++)b=a.a[f]|0,a.a[f-10]=(b&4194303)<<4|g>>>22,g=b;g>>>=22;a.a[f-10]=g;a.length=0===g&&10<a.length?a.length-10:a.length-9}};d.prototype.Ic=function(a){a.a[a.length]=0;a.a[a.length+1]=0;a.length+=2;for(var b=0,g=0;g<a.length;g++){var f=a.a[g]|0;b+=977*f;a.a[g]=b&67108863;b=64*f+(b/67108864|0)}0===
a.a[a.length-1]&&(a.length--,0===a.a[a.length-1]&&a.length--);return a};h.P=function(a){if(z[a])return z[a];var b=new d;return z[a]=b};u.prototype.za=function(a){w(0===a.b,"red works only with positives");w(a.red,"red works only with red numbers")};u.prototype.fa=function(a,b){w(0===(a.b|b.b),"red works only with positives");w(a.red&&a.red===b.red,"red works only with red numbers")};u.prototype.Oa=function(a){return this.ja?this.ja.Kc(a).ea(this):a.S(this.G).ea(this)};u.prototype.l=function(a){return a.w()?
a.clone():this.G.sub(a).ea(this)};u.prototype.add=function(a,b){this.fa(a,b);a=a.add(b);0<=a.cmp(this.G)&&a.i(this.G);return a.ea(this)};u.prototype.B=function(a,b){this.fa(a,b);a=a.B(b);0<=a.cmp(this.G)&&a.i(this.G);return a};u.prototype.sub=function(a,b){this.fa(a,b);a=a.sub(b);0>a.m(0)&&a.B(this.G);return a.ea(this)};u.prototype.i=function(a,b){this.fa(a,b);a=a.i(b);0>a.m(0)&&a.B(this.G);return a};u.prototype.o=function(a,b){this.fa(a,b);return this.Oa(a.o(b))};u.prototype.yb=function(a){return this.o(a,
a)};u.prototype.sqrt=function(a){if(a.w())return a.clone();var b=this.G.T(3);w(1===b%2);if(3===b)return b=this.G.add(new h(1)).j(2),this.pow(a,b);for(var g=this.G.bd(1),f=0;!g.w()&&0===g.T(1);)f++,g.j(1);w(!g.w());b=(new h(1)).A(this);var k=b.la(),t=this.G.bd(1).j(1),y=this.G.U();for(y=(new h(2*y*y)).A(this);0!==this.pow(y,t).cmp(k);)y.s(k);t=this.pow(y,g);k=this.pow(a,g.wd(1).j(1));a=this.pow(a,g);for(g=f;0!==a.cmp(b);){y=a;for(f=0;0!==y.cmp(b);f++)y=y.f();w(f<g);t=this.pow(t,(new h(1)).ua(g-f-1));
k=k.c(t);t=t.f();a=a.c(t);g=f}return k};u.prototype.Ba=function(a){a=a.Zb(this.G);return 0!==a.b?(a.b=0,this.Oa(a).la()):this.Oa(a)};u.prototype.pow=function(a,b){if(b.w())return(new h(1)).A(this);if(0===b.m(1))return a.clone();var g=Array(16);g[0]=(new h(1)).A(this);g[1]=a;for(var f=2;f<g.length;f++)g[f]=this.o(g[f-1],a);a=g[0];var k=0,t=0,y=b.U()%26;0===y&&(y=26);for(f=b.length-1;0<=f;f--){var A=b.a[f];for(--y;0<=y;y--){var C=A>>y&1;a!==g[0]&&(a=this.yb(a));if(0===C&&0===k)t=0;else if(k<<=1,k|=
C,t++,4===t||0===f&&0===y)a=this.o(a,g[k]),k=t=0}y=26}return a};u.prototype.pc=function(a){var b=a.S(this.G);return b===a?b.clone():b};u.prototype.oc=function(a){a=a.clone();a.red=null;return a};return e}),Ia=Fa(function(){function q(){}function w(l){return l.length>>>1}var h={};h.Ib=q;h.pd=50;q.P=!0;h.Gd=q.P?2147483647:1073741823;q.from=function(l,m){var x=null,d=w(l,m)|0;if((q.P?2147483647:1073741823)<d)throw new RangeError("Invalid typed array length");q.P?(x=new Uint8Array(d),x.__proto__=q.prototype):
(null===x&&(x=new q(d)),x.length=d);l=x.write(l,m);l!==d&&(x=x.slice(0,l));return x};q.P&&(q.prototype.__proto__=Uint8Array.prototype,q.__proto__=Uint8Array,sa(),sa(),sa(),"undefined"!==typeof Symbol&&Symbol.species&&q[Symbol.species]===q&&(sa(),Object.defineProperty(q,Symbol.species,{value:null,configurable:!0})));q.isBuffer=function(l){return!(null==l||!l.$b)};q.byteLength=w;q.prototype.$b=!0;q.prototype.write=function(l){var m=this.length;var x=Number(0)||0;var d=this.length-x;m?(m=Number(m),m>
d&&(m=d)):m=d;d=l.length;if(0!==d%2)throw new TypeError("Invalid hex string");m>d/2&&(m=d/2);for(d=0;d<m;++d){var u=parseInt(l.substr(2*d,2),16);if(isNaN(u))break;this[x+d]=u}return d};return h}),Ja=Fa(function(){function q(w,h){if(!w)throw Error(h||"Assertion failed");}q.P=function(){};return q}),La=Fa(function(){var q={};Ha();var w=Ja(),h=Ka();q.assert=w;q.H=h.H;q.Fb=h.Fb;q.Bb=h.Bb;q.encode=h.encode;q.Fc=function(l,m,x){x=Array(Math.max(l.U(),x)+1);x.fill(0);m=1<<m+1;l=l.clone();for(var d=0;d<x.length;d++){var u,
e=l.T(m-1);l.Y()?(e>(m>>1)-1?u=(m>>1)-e:u=e,l.Ca(u)):u=0;x[d]=u;l.j(1)}return x};q.Ec=function(l,m){var x=[[],[]];l=l.clone();m=m.clone();for(var d=0,u=0;0<l.m(-d)||0<m.m(-u);){var e=l.T(3)+d&3,n=m.T(3)+u&3;3===e&&(e=-1);3===n&&(n=-1);if(0===(e&1))var v=0;else{var r=l.T(7)+d&7;v=3!==r&&5!==r||2!==n?e:-e}x[0].push(v);0===(n&1)?e=0:(r=m.T(7)+u&7,e=3!==r&&5!==r||2!==e?n:-n);x[1].push(e);2*d===v+1&&(d=1-d);2*u===e+1&&(u=1-u);l.j(1);m.j(1)}return x};q.Nd=function(){};q.Ed=function(){};return q}),Ma=Fa(function(){var q=
{},w=Ja(),h=Ga();q.Jc=h;q.H=function(l,m){if(Array.isArray(l))return l.slice();if(!l)return[];var x=[];if("string"===typeof l)if(!m)for(var d=m=0;d<l.length;d++){var u=l.charCodeAt(d);128>u?x[m++]=u:(2048>u?x[m++]=u>>6|192:(x[m++]=u>>12|224,x[m++]=u>>6&63|128),x[m++]=u&63|128)}else{if("hex"===m)for(l=l.replace(/[^a-z0-9]+/ig,""),0!==l.length%2&&(l="0"+l),d=0;d<l.length;d+=2)x.push(parseInt(l[d]+l[d+1],16))}else for(d=0;d<l.length;d++)x[d]=l[d]|0;return x};q.Lc=function(l,m,x){m-=0;w(0===m%4);m=Array(m/
4);for(var d=0,u=0;d<m.length;d++,u+=4)m[d]=("big"===x?l[u]<<24|l[u+1]<<16|l[u+2]<<8|l[u+3]:l[u+3]<<24|l[u+2]<<16|l[u+1]<<8|l[u])>>>0;return m};q.ad=function(l){for(var m=Array(4*l.length),x=0,d=0;x<l.length;x++,d+=4){var u=l[x];m[d]=u>>>24;m[d+1]=u>>>16&255;m[d+2]=u>>>8&255;m[d+3]=u&255}return m};q.Vc=function(l,m){return l>>>m|l<<32-m};q.cd=function(l,m){return l+m>>>0};q.dd=function(l,m,x,d){return l+m+x+d>>>0};q.ed=function(l,m,x,d,u){return l+m+x+d+u>>>0};return q}),Na=Fa(function(){function q(h,
l){return l.length===2*h+2?l:q(h,"0x0"+l.slice(2))}var w={};return w={length:function(h){return(h.length-2)/2},flatten:function(h){return"0x"+h.reduce(function(l,m){return l+m.slice(2)},"")},slice:function(h,l,m){return"0x"+m.slice(2*h+2,2*l+2)},tb:q,xc:function(h){h=h.toString(16);return 0===h.length%2?"0x"+h:"0x0"+h},jd:function(h){return parseInt(h.slice(2),16)},pb:function(h){return"0x0"===h?"0x":0===h.length%2?h:"0x0"+h.slice(2)},Qd:function(h){return"0"===h[2]?"0x"+h.slice(3):h}}}),Oa=Fa(function(){function q(){this.pending=
null;this.Ya=0;this.X=this.constructor.X;this.va=this.constructor.va;this.Ma=this.constructor.Ma;this.ia=this.constructor.ia/8;this.nb="big";this.Ha=this.X/8;this.Lb=this.X/32}var w={},h=Ma(),l=Ja();w.Hb=q;q.prototype.update=function(m,x){m=h.H(m,x);this.pending?this.pending=this.pending.concat(m):this.pending=m;this.Ya+=m.length;if(this.pending.length>=this.Ha)for(m=this.pending,x=m.length%this.Ha,this.pending=m.slice(m.length-x,m.length),0===this.pending.length&&(this.pending=null),m=h.Lc(m,m.length-
x,this.nb),x=0;x<m.length;x+=this.Lb)this.ra(m,x);return this};q.prototype.digest=function(m){this.update(this.ac());l(null===this.pending);return this.Mb(m)};q.prototype.ac=function(){var m=this.Ya,x=this.Ha,d=x-(m+this.ia)%x;x=Array(d+this.ia);x[0]=128;for(var u=1;u<d;u++)x[u]=0;m<<=3;if("big"===this.nb){for(d=8;d<this.ia;d++)x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=0;x[u++]=m>>>24&255;x[u++]=m>>>16&255;x[u++]=m>>>8&255;x[u++]=m&255}else for(x[u++]=m&255,x[u++]=m>>>8&255,x[u++]=m>>>16&255,x[u++]=
m>>>24&255,x[u++]=0,x[u++]=0,x[u++]=0,x[u++]=0,d=8;d<this.ia;d++)x[u++]=0;return x};return w}),Pa=Fa(function(){function q(d){var u;for(u=0;48>u;u+=2){var e=d[0]^d[10]^d[20]^d[30]^d[40];var n=d[1]^d[11]^d[21]^d[31]^d[41];var v=d[2]^d[12]^d[22]^d[32]^d[42];var r=d[3]^d[13]^d[23]^d[33]^d[43];var c=d[4]^d[14]^d[24]^d[34]^d[44];var z=d[5]^d[15]^d[25]^d[35]^d[45];var a=d[6]^d[16]^d[26]^d[36]^d[46];var b=d[7]^d[17]^d[27]^d[37]^d[47];var g=d[8]^d[18]^d[28]^d[38]^d[48];var f=d[9]^d[19]^d[29]^d[39]^d[49];
var k=g^(v<<1|r>>>31);var t=f^(r<<1|v>>>31);d[0]^=k;d[1]^=t;d[10]^=k;d[11]^=t;d[20]^=k;d[21]^=t;d[30]^=k;d[31]^=t;d[40]^=k;d[41]^=t;k=e^(c<<1|z>>>31);t=n^(z<<1|c>>>31);d[2]^=k;d[3]^=t;d[12]^=k;d[13]^=t;d[22]^=k;d[23]^=t;d[32]^=k;d[33]^=t;d[42]^=k;d[43]^=t;k=v^(a<<1|b>>>31);t=r^(b<<1|a>>>31);d[4]^=k;d[5]^=t;d[14]^=k;d[15]^=t;d[24]^=k;d[25]^=t;d[34]^=k;d[35]^=t;d[44]^=k;d[45]^=t;k=c^(g<<1|f>>>31);t=z^(f<<1|g>>>31);d[6]^=k;d[7]^=t;d[16]^=k;d[17]^=t;d[26]^=k;d[27]^=t;d[36]^=k;d[37]^=t;d[46]^=k;d[47]^=
t;k=a^(e<<1|n>>>31);t=b^(n<<1|e>>>31);d[8]^=k;d[9]^=t;d[18]^=k;d[19]^=t;d[28]^=k;d[29]^=t;d[38]^=k;d[39]^=t;d[48]^=k;d[49]^=t;k=d[0];t=d[1];var y=d[11]<<4|d[10]>>>28;var A=d[10]<<4|d[11]>>>28;var C=d[20]<<3|d[21]>>>29;var B=d[21]<<3|d[20]>>>29;var D=d[31]<<9|d[30]>>>23;var K=d[30]<<9|d[31]>>>23;var E=d[40]<<18|d[41]>>>14;var T=d[41]<<18|d[40]>>>14;var F=d[2]<<1|d[3]>>>31;var X=d[3]<<1|d[2]>>>31;e=d[13]<<12|d[12]>>>20;n=d[12]<<12|d[13]>>>20;var G=d[22]<<10|d[23]>>>22;var Y=d[23]<<10|d[22]>>>22;var H=
d[33]<<13|d[32]>>>19;var Z=d[32]<<13|d[33]>>>19;var I=d[42]<<2|d[43]>>>30;var aa=d[43]<<2|d[42]>>>30;var J=d[5]<<30|d[4]>>>2;var ba=d[4]<<30|d[5]>>>2;var U=d[14]<<6|d[15]>>>26;var V=d[15]<<6|d[14]>>>26;v=d[25]<<11|d[24]>>>21;r=d[24]<<11|d[25]>>>21;var L=d[34]<<15|d[35]>>>17;var ca=d[35]<<15|d[34]>>>17;var da=d[45]<<29|d[44]>>>3;var M=d[44]<<29|d[45]>>>3;g=d[6]<<28|d[7]>>>4;f=d[7]<<28|d[6]>>>4;var ea=d[17]<<23|d[16]>>>9;var N=d[16]<<23|d[17]>>>9;var fa=d[26]<<25|d[27]>>>7;var O=d[27]<<25|d[26]>>>7;
c=d[36]<<21|d[37]>>>11;z=d[37]<<21|d[36]>>>11;var ha=d[47]<<24|d[46]>>>8;var P=d[46]<<24|d[47]>>>8;var ia=d[8]<<27|d[9]>>>5;var Q=d[9]<<27|d[8]>>>5;var ja=d[18]<<20|d[19]>>>12;var R=d[19]<<20|d[18]>>>12;var ka=d[29]<<7|d[28]>>>25;var S=d[28]<<7|d[29]>>>25;var la=d[38]<<8|d[39]>>>24;var W=d[39]<<8|d[38]>>>24;a=d[48]<<14|d[49]>>>18;b=d[49]<<14|d[48]>>>18;d[0]=k^~e&v;d[1]=t^~n&r;d[10]=g^~ja&C;d[11]=f^~R&B;d[20]=F^~U&fa;d[21]=X^~V&O;d[30]=ia^~y&G;d[31]=Q^~A&Y;d[40]=J^~ea&ka;d[41]=ba^~N&S;d[2]=e^~v&c;
d[3]=n^~r&z;d[12]=ja^~C&H;d[13]=R^~B&Z;d[22]=U^~fa&la;d[23]=V^~O&W;d[32]=y^~G&L;d[33]=A^~Y&ca;d[42]=ea^~ka&D;d[43]=N^~S&K;d[4]=v^~c&a;d[5]=r^~z&b;d[14]=C^~H&da;d[15]=B^~Z&M;d[24]=fa^~la&E;d[25]=O^~W&T;d[34]=G^~L&ha;d[35]=Y^~ca&P;d[44]=ka^~D&I;d[45]=S^~K&aa;d[6]=c^~a&k;d[7]=z^~b&t;d[16]=H^~da&g;d[17]=Z^~M&f;d[26]=la^~E&F;d[27]=W^~T&X;d[36]=L^~ha&ia;d[37]=ca^~P&Q;d[46]=D^~I&J;d[47]=K^~aa&ba;d[8]=a^~k&e;d[9]=b^~t&n;d[18]=da^~g&ja;d[19]=M^~f&R;d[28]=E^~F&U;d[29]=T^~X&V;d[38]=ha^~ia&y;d[39]=P^~Q&A;d[48]=
I^~J&ea;d[49]=aa^~ba&N;d[0]^=x[u];d[1]^=x[u+1]}}var w={},h="0123456789abcdef".split(""),l=[1,256,65536,16777216],m=[0,8,16,24],x=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648];return w={rb:function(d){return function(u,
e){var n,v;if("0x"!==u.slice(0,2)||(void 0===e?0:e))var r=u;else for(r=[],e=2,v=u.length;e<v;e+=2)r.push(parseInt(u.slice(e,e+2),16));v=[0,0,0,0,0,0,0,0,0,0];var c=!0;var z=n=0;u=1600-(d<<1)>>5;e=d>>5;v=v.concat(v,v,v,v);var a=void 0;for(var b=r,g=b.length,f=[],k=u<<2,t=0;t<g;){if(c)for(c=!1,f[0]=n,r=1;r<u+1;++r)f[r]=0;if("string"!==typeof b)for(r=z;t<g&&r<k;++t)f[r>>2]|=b[t]<<m[r++&3];else for(r=z;t<g&&r<k;++t)z=b.charCodeAt(t),128>z?f[r>>2]|=z<<m[r++&3]:(2048>z?f[r>>2]|=(192|z>>6)<<m[r++&3]:(55296>
z||57344<=z?f[r>>2]|=(224|z>>12)<<m[r++&3]:(z=65536+((z&1023)<<10|b.charCodeAt(++t)&1023),f[r>>2]|=(240|z>>18)<<m[r++&3],f[r>>2]|=(128|z>>12&63)<<m[r++&3]),f[r>>2]|=(128|z>>6&63)<<m[r++&3]),f[r>>2]|=(128|z&63)<<m[r++&3]);a=r;if(r>=k){z=r-k;n=f[u];for(r=0;r<u;++r)v[r]^=f[r];q(v);c=!0}else z=r}r=a;f[r>>2]|=l[r&3];if(a===k)for(f[0]=f[u],r=1;r<u+1;++r)f[r]=0;f[u-1]|=2147483648;for(r=0;r<u;++r)v[r]^=f[r];q(v);c="";for(n=0;n<e;){for(r=0;r<u&&n<e;++r,++n)z=v[r],c+=h[z>>4&15]+h[z&15]+h[z>>12&15]+h[z>>8&15]+
h[z>>20&15]+h[z>>16&15]+h[z>>28&15]+h[z>>24&15];0===n%u&&q(v)}return"0x"+c}}(256)}}),Sa=Fa(function(){var q={};q.md=La();q.yd=Qa();q.sa=Ra();return q}),Ta=Fa(function(){function q(u,e){this.type=u;this.p=new h(e.p,16);this.red=e.ja?h.red(e.ja):h.Hd(this.p);this.od=(new h(0)).A(this.red);this.Ea=(new h(1)).A(this.red);this.kd=(new h(2)).A(this.red);this.n=e.n&&new h(e.n,16);this.v=e.v&&this.Qc(e.v,e.Cc);this.dc=Array(4);this.ec=Array(4);this.fc=Array(4);this.hc=Array(4);this.Ga=this.n?this.n.U():0;
u=this.n&&this.p.u(this.n);!u||0<u.m(100)||this.n.A(this.red)}function w(u,e){this.curve=u;this.type=e;this.D=null}var h=Ha(),l=La(),m=l.Fc,x=l.Ec,d=l.assert;q.prototype.Sb=function(u,e){d(u.D);u=u.ib();var n=m(e,1,this.Ga),v=(1<<u.step+1)-(0===u.step%2?2:1);v/=3;for(var r=[],c=0;c<n.length;c+=u.step){for(var z=0,a=c+u.step-1;e>=c;e--)z=(z<<1)+n[a];r.push(z)}e=this.O(null,null,null);for(n=this.O(null,null,null);0<v;v--){for(c=0;c<r.length;c++)z=r[c],z===v?n=n.ca(u.C[c]):z===-v&&(n=n.ca(u.C[c].l()));
e=e.add(n)}return e.Cb()};q.prototype.lb=function(u,e,n,v){for(var r=this.dc,c=this.ec,z=this.fc,a=0,b=0;b<n;b++){var g=u[b],f=g.jb(1);r[b]=f.da;c[b]=f.C}for(b=n-1;1<=b;b-=2){var k=b-1,t=b;if(1!==r[k]||1!==r[t])z[k]=m(e[k],r[k],this.Ga),z[t]=m(e[t],r[t],this.Ga),a=Math.max(z[k].length,a),a=Math.max(z[t].length,a);else{var y=[u[k],null,null,u[t]];0===u[k].y.cmp(u[t].y)?(y[1]=u[k].add(u[t]),y[2]=u[k].xa().ca(u[t].l())):0===u[k].y.cmp(u[t].y.la())?(y[1]=u[k].xa().ca(u[t]),y[2]=u[k].add(u[t].l())):(y[1]=
u[k].xa().ca(u[t]),y[2]=u[k].xa().ca(u[t].l()));var A=[-3,-1,-5,-7,0,7,5,1,3],C=x(e[k],e[t]);a=Math.max(C[0].length,a);z[k]=Array(a);z[t]=Array(a);for(f=0;f<a;f++)z[k][f]=A[3*((C[0][f]|0)+1)+((C[1][f]|0)+1)],z[t][f]=0,c[k]=y}}u=this.O(null,null,null);e=this.hc;for(b=a;0<=b;b--){for(a=0;0<=b;){r=!0;for(f=0;f<n;f++)e[f]=z[f][b]|0,0!==e[f]&&(r=!1);if(!r)break;a++;b--}0<=b&&a++;u=u.rc(a);if(0>b)break;for(f=0;f<n;f++)a=e[f],0!==a&&(0<a?g=c[f][a-1>>1]:0>a&&(g=c[f][-a-1>>1].l()),u="affine"===g.type?u.ca(g):
u.add(g))}for(b=0;b<n;b++)c[b]=null;return v?u:u.Cb()};q.ya=w;w.prototype.cb=function(){return this.curve.cb(this)};w.prototype.Nb=function(u){var e=this.curve.p.byteLength(),n=this.qb().H("be",e);return u?[this.La().Ra()?2:3].concat(n):[4].concat(n,this.La().H("be",e))};w.prototype.encode=function(u,e){return l.encode(this.Nb(e),u)};w.prototype.Rc=function(u){if(!this.D){var e={F:null,K:null,beta:null};e.K=this.jb(8);e.F=this.ib(4,u);e.beta=this.hb();this.D=e}};w.prototype.Vb=function(u){if(!this.D)return!1;
var e=this.D.F;return e?e.C.length>=Math.ceil((u.U()+1)/e.step):!1};w.prototype.ib=function(u,e){if(this.D&&this.D.F)return this.D.F;for(var n=[this],v=this,r=0;r<e;r+=u){for(var c=0;c<u;c++)v=v.ba();n.push(v)}return{step:u,C:n}};w.prototype.jb=function(u){if(this.D&&this.D.K)return this.D.K;for(var e=[this],n=(1<<u)-1,v=1===n?null:this.ba(),r=1;r<n;r++)e[r]=e[r-1].add(v);return{da:u,C:e}};return q}),Qa=Fa(function(){function q(m){this.curve=new (Ua())(m);this.v=this.curve.v;this.n=this.curve.n;this.hash=
m.hash;l(this.v.cb(),"Invalid curve");l(this.v.o(this.n).R(),"Invalid curve, G*N != O")}var w={},h=Va(),l=La().assert;w.Jb=q;(function(m,x){Object.defineProperty(w,m,{configurable:!0,enumerable:!0,get:function(){var d=new q(x);Object.defineProperty(w,m,{configurable:!0,enumerable:!0,value:d});return d}})})("secp256k1",{type:"short",ja:"k256",p:"ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",I:"0",M:"7",n:"ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
g:"1",hash:h.$a,beta:"7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",Va:"5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",Aa:[{I:"3086d221a7d46bcde86c90e49284eb15",M:"-e4437ed6010e88286f547fa90abfe4c3"},{I:"114ca50f7a8e2f3f657c1108d9d44cfd8",M:"3086d221a7d46bcde86c90e49284eb15"}],Cc:!1,v:["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",{}]});return w}),Va=Fa(function(){var q={};
q.md=Ma();q.xd=Oa();q.Yc={$a:Wa()};q.Hc=Xa();q.$a=q.Yc.$a;return q}),Ka=Fa(function(){function q(l){return 1===l.length?"0"+l:l}function w(l){for(var m="",x=0;x<l.length;x++)m+=q(l[x].toString(16));return m}var h={H:function(l,m){if(Array.isArray(l))return l.slice();if(!l)return[];var x=[];if("string"!==typeof l){for(m=0;m<l.length;m++)x[m]=l[m]|0;return x}if("hex"===m)for(l=l.replace(/[^a-z0-9]+/ig,""),0!==l.length%2&&(l="0"+l),m=0;m<l.length;m+=2)x.push(parseInt(l[m]+l[m+1],16));else for(m=0;m<
l.length;m++){var d=l.charCodeAt(m),u=d>>8;d&=255;u?x.push(u,d):x.push(d)}return x}};h.Fb=q;h.Bb=w;h.encode=function(l,m){return"hex"===m?w(l):l};return h}),Ya=Fa(function(){var q={},w=Ma().Vc;q.Ad=function(){};q.nc=function(h,l,m){return h&l^~h&m};q.Mc=function(h,l,m){return h&l^h&m^l&m};q.Md=function(){};q.Wc=function(h){return w(h,2)^w(h,13)^w(h,22)};q.Xc=function(h){return w(h,6)^w(h,11)^w(h,25)};q.Ac=function(h){return w(h,7)^w(h,18)^h>>>3};q.Bc=function(h){return w(h,17)^w(h,19)^h>>>10};return q}),
Wa=Fa(function(){function q(){if(!(this instanceof q))return new q;a.call(this);this.g=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];this.k=b;this.Kb=Array(64)}var w=Ma(),h=Oa(),l=Ya(),m=Ja(),x=w.cd,d=w.dd,u=w.ed,e=l.nc,n=l.Mc,v=l.Wc,r=l.Xc,c=l.Ac,z=l.Bc,a=h.Hb,b=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];w.Jc(q,
a);q.X=512;q.va=256;q.Ma=192;q.ia=64;q.prototype.ra=function(g,f){for(var k=this.Kb,t=0;16>t;t++)k[t]=g[f+t];for(;t<k.length;t++)k[t]=d(z(k[t-2]),k[t-7],c(k[t-15]),k[t-16]);g=this.g[0];f=this.g[1];var y=this.g[2],A=this.g[3],C=this.g[4],B=this.g[5],D=this.g[6],K=this.g[7];m(this.k.length===k.length);for(t=0;t<k.length;t++){var E=u(K,r(C),e(C,B,D),this.k[t],k[t]),T=x(v(g),n(g,f,y));K=D;D=B;B=C;C=x(A,E);A=y;y=f;f=g;g=x(E,T)}this.g[0]=x(this.g[0],g);this.g[1]=x(this.g[1],f);this.g[2]=x(this.g[2],y);
this.g[3]=x(this.g[3],A);this.g[4]=x(this.g[4],C);this.g[5]=x(this.g[5],B);this.g[6]=x(this.g[6],D);this.g[7]=x(this.g[7],K)};q.prototype.Mb=function(g){return"hex"===g?w.Pd(this.g,"big"):w.ad(this.g)};return q}),Ua=Fa(function(){function q(e){d.call(this,"short",e);this.I=(new m(e.I,16)).A(this.red);this.M=(new m(e.M,16)).A(this.red);this.gd=this.kd.Za();this.eb=0===this.I.ta().m(0);this.zb=0===this.I.ta().sub(this.p).m(-3);this.ha=this.Ub(e);this.Pb=Array(4);this.Qb=Array(4)}function w(e,n,v,r){d.ya.call(this,
e,"affine");null===n&&null===v?(this.y=this.x=null,this.V=!0):(this.x=new m(n,16),this.y=new m(v,16),r&&(this.x.wc(this.curve.red),this.y.wc(this.curve.red)),this.x.red||(this.x=this.x.A(this.curve.red)),this.y.red||(this.y=this.y.A(this.curve.red)),this.V=!1)}function h(e,n,v,r){d.ya.call(this,e,"jacobian");null===n&&null===v&&null===r?(this.y=this.x=this.curve.Ea,this.z=new m(0)):(this.x=new m(n,16),this.y=new m(v,16),this.z=new m(r,16));this.x.red||(this.x=this.x.A(this.curve.red));this.y.red||
(this.y=this.y.A(this.curve.red));this.z.red||(this.z=this.z.A(this.curve.red));this.nd=this.z===this.curve.Ea}var l={};l=La();var m=Ha(),x=Ga(),d=Ta(),u=l.assert;x(q,d);l=q;q.prototype.Ub=function(e){if(this.eb&&this.v&&this.n&&1===this.p.Da(3)){if(e.beta)var n=(new m(e.beta,16)).A(this.red);else n=this.Tb(this.p),n=0>n[0].cmp(n[1])?n[0]:n[1],n=n.A(this.red);if(e.Va)var v=new m(e.Va,16);else v=this.Tb(this.n),0===this.v.o(v[0]).x.cmp(this.v.x.c(n))?v=v[0]:(v=v[1],u(0===this.v.o(v).x.cmp(this.v.x.c(n))));
var r;e.Aa?r=e.Aa.map(function(c){return{I:new m(c.I,16),M:new m(c.M,16)}}):r=this.rd(v);return{beta:n,Va:v,Aa:r}}};q.prototype.Ob=function(e){var n=this.ha.Aa,v=n[0],r=n[1],c=r.M.o(e).mb(this.n),z=v.M.l().o(e).mb(this.n);n=c.o(v.I);var a=z.o(r.I);v=c.o(v.M);r=z.o(r.M);e=e.sub(n).sub(a);n=v.add(r).l();return{Sa:e,Ta:n}};q.prototype.wb=function(e,n){e=new m(e,16);e.red||(e=e.A(this.red));var v=e.f().c(e).s(e.c(this.I)).s(this.M),r=v.Uc();if(0!==r.f().aa(v).cmp(this.od))throw Error("invalid point");
v=r.ta().Y();if(n&&!v||!n&&v)r=r.la();return this.W(e,r)};q.prototype.cb=function(e){if(e.V)return!0;var n=e.x;e=e.y;var v=this.I.c(n);n=n.f().c(n).s(v).s(this.M);return 0===e.f().h(n).m(0)};q.prototype.gb=function(e,n){for(var v=this.Pb,r=this.Qb,c=0;c<e.length;c++){var z=this.Ob(n[c]),a=e[c],b=a.hb();z.Sa.b&&(z.Sa.Pa(),a=a.l(!0));z.Ta.b&&(z.Ta.Pa(),b=b.l(!0));v[2*c]=a;v[2*c+1]=b;r[2*c]=z.Sa;r[2*c+1]=z.Ta}e=this.lb(v,r,2*c,void 0);for(n=0;n<2*c;n++)v[n]=null,r[n]=null;return e};x(w,d.ya);q.prototype.W=
function(e,n,v){return new w(this,e,n,v)};q.prototype.Qc=function(e,n){return w.P(this,e,n)};w.prototype.hb=function(){if(this.curve.ha){var e=this.D;if(e&&e.beta)return e.beta;var n=this.curve.W(this.x.c(this.curve.ha.beta),this.y);if(e){var v=this.curve,r=function(c){return v.W(c.x.c(v.ha.beta),c.y)};e.beta=n;n.D={beta:null,K:e.K&&{da:e.K.da,C:e.K.C.map(r)},F:e.F&&{step:e.F.step,C:e.F.C.map(r)}}}return n}};w.prototype.toJSON=function(){};w.P=function(e,n,v){function r(z){return e.W(z[0],z[1],v)}
"string"===typeof n&&(n=JSON.parse(n));var c=e.W(n[0],n[1],v);if(!n[2])return c;n=n[2];c.D={beta:null,F:n.F&&{step:n.F.step,C:[c].concat(n.F.C.map(r))},K:n.K&&{da:n.K.da,C:[c].concat(n.K.C.map(r))}};return c};w.prototype.R=function(){return this.V};w.prototype.add=function(e){if(this.V)return e;if(e.V)return this;if(this.ob(e))return this.ba();if(this.l().ob(e)||0===this.x.cmp(e.x))return this.curve.W(null,null);var n=this.y.aa(e.y);0!==n.m(0)&&(n=n.c(this.x.aa(e.x).Za()));e=n.f().h(this.x).h(e.x);
n=n.c(this.x.aa(e)).h(this.y);return this.curve.W(e,n)};w.prototype.qb=function(){return this.x.ta()};w.prototype.La=function(){return this.y.ta()};w.prototype.o=function(e){e=new m(e,16);return this.R()?this:this.Vb(e)?this.curve.Sb(this,e):this.curve.ha?this.curve.gb([this],[e]):this.curve.vd(this,e)};w.prototype.Nc=function(e,n,v){n=[this,n];e=[e,v];return this.curve.ha?this.curve.gb(n,e):this.curve.lb(n,e,2)};w.prototype.ob=function(e){return this===e||this.V===e.V&&(this.V||0===this.x.cmp(e.x)&&
0===this.y.cmp(e.y))};w.prototype.l=function(e){if(this.V)return this;var n=this.curve.W(this.x,this.y.la());if(e&&this.D){e=this.D;var v=function(r){return r.l()};n.D={K:e.K&&{da:e.K.da,C:e.K.C.map(v)},F:e.F&&{step:e.F.step,C:e.F.C.map(v)}}}return n};w.prototype.xa=function(){return this.V?this.curve.O(null,null,null):this.curve.O(this.x,this.y,this.curve.Ea)};x(h,d.ya);q.prototype.O=function(e,n,v){return new h(this,e,n,v)};h.prototype.Cb=function(){if(this.R())return this.curve.W(null,null);var e=
this.z.Za(),n=e.f(),v=this.x.c(n);e=this.y.c(n).c(e);return this.curve.W(v,e)};h.prototype.l=function(){return this.curve.O(this.x,this.y.la(),this.z)};h.prototype.add=function(e){if(this.R())return e;if(e.R())return this;var n=e.z.f(),v=this.z.f(),r=this.x.c(n),c=e.x.c(v);n=this.y.c(n.c(e.z));v=e.y.c(v.c(this.z));c=r.aa(c);v=n.aa(v);if(0===c.m(0))return 0!==v.m(0)?this.curve.O(null,null,null):this.ba();var z=c.f(),a=z.c(c);z=r.c(z);r=v.f().s(a).h(z).h(z);n=v.c(z.h(r)).h(n.c(a));e=this.z.c(e.z).c(c);
return this.curve.O(r,n,e)};h.prototype.ca=function(e){if(this.R())return e.xa();if(e.R())return this;var n=this.z.f(),v=this.x,r=e.x.c(n),c=this.y;e=e.y.c(n).c(this.z);r=v.aa(r);e=c.aa(e);if(0===r.m(0))return 0!==e.m(0)?this.curve.O(null,null,null):this.ba();var z=r.f();n=z.c(r);z=v.c(z);v=e.f().s(n).h(z).h(z);c=e.c(z.h(v)).h(c.c(n));r=this.z.c(r);return this.curve.O(v,c,r)};h.prototype.rc=function(e){if(0===e||this.R())return this;if(!e)return this.ba();if(this.curve.eb||this.curve.zb){for(var n=
this,v=0;v<e;v++)n=n.ba();return n}n=this.curve.I;var r=this.curve.gd,c=this.x;v=this.y;var z=this.z,a=z.f().f(),b=v.$(v);for(v=0;v<e;v++){var g=c.f(),f=b.f(),k=f.f();g=g.$(g).s(g).s(n.c(a));f=c.c(f);c=g.f().h(f.$(f));f=f.h(c);g=g.c(f);g=g.s(g).h(k);z=b.c(z);v+1<e&&(a=a.c(k));b=g}return this.curve.O(c,b.c(r),z)};h.prototype.ba=function(){return this.R()?this:this.curve.eb?this.jc():this.curve.zb?this.ud():this.qd()};h.prototype.jc=function(){if(this.nd){var e=this.x.f();var n=this.y.f();var v=n.f();
n=this.x.$(n).f().h(e).h(v);n=n.s(n);e=e.$(e).s(e);var r=e.f().h(n).h(n),c=v.s(v);c=c.s(c);c=c.s(c);v=r;n=e.c(n.h(r)).h(c);e=this.y.$(this.y)}else e=this.x.f(),n=this.y.f(),v=n.f(),n=this.x.$(n).f().h(e).h(v),n=n.s(n),e=e.$(e).s(e),r=e.f(),c=v.s(v),c=c.s(c),c=c.s(c),v=r.h(n).h(n),n=e.c(n.h(v)).h(c),e=this.y.c(this.z),e=e.s(e);return this.curve.O(v,n,e)};h.prototype.R=function(){return 0===this.z.m(0)};return l}),Xa=Fa(function(){function q(l,m,x){if(!(this instanceof q))return new q(l,m,x);this.Fa=
l;this.X=l.X/8;this.va=l.va/8;this.Xa=this.Qa=null;this.pa(w.H(m,x))}var w=Ma(),h=Ja();q.prototype.pa=function(l){l.length>this.X&&(l=(new this.Fa).update(l).digest());h(l.length<=this.X);for(var m=l.length;m<this.X;m++)l.push(0);for(m=0;m<l.length;m++)l[m]^=54;this.Qa=(new this.Fa).update(l);for(m=0;m<l.length;m++)l[m]^=106;this.Xa=(new this.Fa).update(l)};q.prototype.update=function(l,m){this.Qa.update(l,m);return this};q.prototype.digest=function(l){this.Xa.update(this.Qa.digest());return this.Xa.digest(l)};
return q}),Ra=Fa(function(){function q(e){if(!(this instanceof q))return new q(e);"string"===typeof e&&(x(m.hasOwnProperty(e),"Unknown curve "+e),e=m[e]);e instanceof m.Jb&&(e={curve:e});this.curve=e.curve.curve;this.n=this.curve.n;this.Pc=this.n.ab(1);this.v=this.curve.v;this.v=e.curve.v;this.v.Rc(e.curve.n.U()+1);this.hash=e.hash||e.curve.hash}var w=Ha(),h=Za(),l=La(),m=Qa(),x=l.assert,d=$a(),u=ab();q.prototype.Ua=function(e,n){return d.yc(this,e,n)};q.prototype.kb=function(e,n){var v=8*e.byteLength()-
this.n.U();0<v&&(e=e.ab(v));return!n&&0<=e.cmp(this.n)?e.sub(this.n):e};q.prototype.sign=function(e,n,v,r){"object"===typeof v&&(r=v,v=null);r||(r={});n=this.Ua(n,v);e=this.kb(new w(e,16));var c=this.n.byteLength();v=n.Z.H("be",c);c=e.H("be",c);c=new h({hash:this.hash,uc:v,nonce:c,ub:r.ub,vb:r.vb||"utf8"});for(var z=this.n.sub(new w(1)),a=0;;a++){var b=r.k?r.k(a):new w(c.Dc(this.n.byteLength()));b=this.kb(b,!0);if(!(0>=b.m(1)||0<=b.cmp(z))){var g=this.v.o(b);if(!g.R()){var f=g.qb();v=f.S(this.n);
if(0!==v.m(0)&&(b=b.Ba(this.n).o(v.o(n.Z).B(e)),b=b.S(this.n),0!==b.m(0)))return e=(g.La().Y()?1:0)|(0!==f.cmp(v)?2:0),r.mc&&0<b.cmp(this.Pc)&&(b=this.n.sub(b),e^=1),new u({r:v,ma:b,wa:e})}}}};q.prototype.Tc=function(e,n,v){x((3&v)===v,"The recovery param is more than two bits");n=new u(n,void 0);var r=this.n,c=new w(e);e=n.r;var z=n.ma,a=v&1;v>>=1;if(0<=e.cmp(this.curve.p.S(this.curve.n))&&v)throw Error("Unable to find sencond key candinate");e=v?this.curve.wb(e.add(this.curve.n),a):this.curve.wb(e,
a);n=n.r.Ba(r);c=r.sub(c).o(n).S(r);r=z.o(n).S(r);return this.v.Nc(c,e,r)};return q}),Za=Fa(function(){function q(m){if(!(this instanceof q))return new q(m);this.hash=m.hash;this.sb=this.hash.va;this.Wa=m.Wa||this.hash.Ma;this.N=this.na=this.xb=this.Ka=null;var x=h.H(m.uc,m.zd||"hex"),d=h.H(m.nonce,m.Id||"hex");m=h.H(m.ub,m.vb||"hex");l(x.length>=this.Wa/8,"Not enough entropy. Minimum is: "+this.Wa+" bits");this.pa(x,d,m)}var w=Va(),h=Ka(),l=Ja();q.prototype.pa=function(m,x,d){m=m.concat(x).concat(d);
this.na=Array(this.sb/8);this.N=Array(this.sb/8);for(x=0;x<this.N.length;x++)this.na[x]=0,this.N[x]=1;this.ra(m);this.Ka=1;this.xb=281474976710656};q.prototype.oa=function(){return new w.Hc(this.hash,this.na)};q.prototype.ra=function(m){var x=this.oa().update(this.N).update([0]);m&&(x=x.update(m));this.na=x.digest();this.N=this.oa().update(this.N).digest();m&&(this.na=this.oa().update(this.N).update([1]).update(m).digest(),this.N=this.oa().update(this.N).digest())};q.prototype.Dc=function(m){if(this.Ka>
this.xb)throw Error("Reseed is required");if("string"!==typeof u){var x=d;var d=u;var u=null}d&&(d=h.H(d,x||"hex"),this.ra(d));for(x=[];x.length<m;)this.N=this.oa().update(this.N).digest(),x=x.concat(this.N);m=x.slice(0,m);this.ra(d);this.Ka++;return h.encode(m,u)};return q}),$a=Fa(function(){function q(h,l){this.sa=h;this.ka=this.Z=null;l.Z&&this.Xb(l.Z,l.Sc);l.ka&&this.sd(l.ka,l.Od)}var w=Ha();La();q.yc=function(h,l,m){return l instanceof q?l:new q(h,{Z:l,Sc:m})};q.prototype.Gc=function(){var h=
!1,l="hex";"string"===typeof h&&(l=h,h=null);this.ka||(this.ka=this.sa.v.o(this.Z));return l?this.ka.encode(l,h):this.ka};q.prototype.Xb=function(h,l){this.Z=new w(h,l||16);this.Z=this.Z.S(this.sa.curve.n)};q.prototype.sign=function(h,l,m){return this.sa.sign(h,this,l,m)};return q}),ab=Fa(function(){function q(l){if(l instanceof q)return l;h(l.r&&l.ma,"Signature without r or s");this.r=new w(l.r,16);this.ma=new w(l.ma,16);void 0===l.wa?this.wa=null:this.wa=l.wa}var w=Ha(),h=La().assert;return q}),
bb=Fa(function(){var q={};(function(w){function h(e){for(var n=d(e.slice(2)),v="0x",r=0;40>r;r++)v+=7<parseInt(n[r+2],16)?e[r+2].toUpperCase():e[r+2];return v}var l=Na(),m=Ha(),x=new (Sa().sa)("secp256k1"),d=Pa().rb,u={zc:function(e){e="0x"+("0x"===e.slice(0,2)?new m(e.slice(2),16):new m(e,10)).toString("hex");return"0x0"===e?"0x":e}};q={kc:h,lc:function(e){e=w.from(e.slice(2),"hex");e="0x"+x.Ua(e).Gc().slice(2);e=d(e);return h("0x"+e.slice(-40))},Zc:function(e,n,v){v=void 0===v?27:v;e=x.Ua(w.from(n.slice(2),
"hex")).sign(w.from(e.slice(2),"hex"),{mc:!0});v=[u.zc(l.xc(v+e.wa)),l.tb(32,l.pb("0x"+e.r.toString(16))),l.tb(32,l.pb("0x"+e.ma.toString(16)))];n=(e="undefined"!=typeof Symbol&&Symbol.iterator&&v[Symbol.iterator])?e.call(v):{next:oa(v)};v=n.next().value;e=n.next().value;n=n.next().value;return l.flatten([e,n,v])},$c:function(e,n){n=[l.slice(64,l.length(n),n),l.slice(0,32,n),l.slice(32,64,n)];n={bb:l.jd(n[0]),r:n[1].slice(2),ma:n[2].slice(2)};e="0x"+x.Tc(w.from(e.slice(2),"hex"),n,2>n.bb?n.bb:1-n.bb%
2).encode("hex",!1).slice(2);e=d(e);return h("0x"+e.slice(-40))}}}).call(ma,Ia().Ib);return q})();module.exports.addressChecksum=bb.kc;module.exports.addressFromKey=bb.lc;module.exports.signMessage=bb.Zc;module.exports.signerAddress=bb.$c;module.exports.keccak=Pa().rb;


/***/ }),

/***/ 101:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {Component, render} = __webpack_require__(285);
const h = __webpack_require__(86).h;
const apps = __webpack_require__(649);

module.exports = class AppList extends Component {
  render() {
    var list = Object.keys(apps).map(app => {
      return h("div", {}, [
        h("span", {}, "- "),
        h("a", {
          style: {
            "text-decoration": "underline",
            "cursor": "pointer",
          },
          onClick: () => {
            window.location = "/"+app;
          },
        }, app),
      ]);
    });
    return h("pre", {
      style: {
        "padding": "6px",
        "font-size": "16px",
        "font-family": "monospace",
      }
    }, [
      h("div", {}, [h("pre", {}, ["Select an application:"])]),
      list,
    ]);
  }
}


/***/ }),

/***/ 952:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Component, render } = __webpack_require__(285);
const h = __webpack_require__(86).h;
const apps = __webpack_require__(649);
const sign = __webpack_require__(216);
const utils = __webpack_require__(555);
const DEBUG_SHOW_FPS = false;

module.exports = class AppPlay extends Component {

  // Sets up internal variables
  constructor(props) {
    super(props);

    this.name = props.name; // name of this application
    this.app = null; // application module, compiled from Kind
    this.app_state = null; // the state of the application

    this.intervals = {}; // timed intervals
    this.listeners = {}; // event listeners
    this.mouse_pos = { _: "Pair.new", fst: 0, snd: 0 };
    this.rendered = null; // document rendered by app, coming from Kind
    this.container = null; // container that holds rendered app
    this.canvas = {}; // canvas that holds rendered pixel-art apps
  }

  // Initializes everything
  async componentDidMount() {
    await this.init_app();
    await this.init_input_events();
    await this.init_renderer();
  }

  // Clear up intervals and event listeners
  async componentWillUnmount() {
    for (var key in this.intervals) {
      clearInterval(this.intervals[key]);
    }
    for (var key in this.listeners) {
      document.body.removeEventListener(key, this.listeners[key]);
    };
  }

  // Loads the application from Moonad, which was pre-compiled to JavaScript
  async init_app() {
    if (!this.app && apps[this.name]) {
      //console.log("loading app...");
      this.app = (await apps[this.name])[this.name];
      this.app_state = this.app.init;
      //console.log("loaded: ", this.app);
    }
  }

  // Initializes the input event listeners
  async init_input_events() {
    //this.events = []; // this application's events

    // Init event
    this.register_event({
      _: "App.Event.init",
      time: BigInt(0),
      user: sign.addressFromKey(KEY).toLowerCase(),
      info: {
        _: "App.EnvInfo.new",
        screen_size: {
          _: "Pair.new",
          fst: window.innerWidth, // this.container ? this.container.offsetWidth : 0,
          snd: window.innerHeight // this.container ? this.container.offsetHeight : 0,
        },
        mouse_pos: this.mouse_pos,
      }
    });

   // Mouse movement event
    this.listeners.mousemove = (e) => {
      this.mouse_pos = {_ : "Pair.new", fst: e.offsetX, snd : e.offsetY}
    }

    document.body.addEventListener("mousemove", this.listeners.mousemove);

    // Mouse down event
    this.listeners.mousedown = (e) => {
      this.register_event({
        _: "App.Event.mouse_down",
        time: BigInt(Date.now()),
      });
    };
    document.body.addEventListener("mousedown", this.listeners.mousedown);

    this.listeners.mouseover = (e) => {
      this.register_event({
        _: "App.Event.mouse_over",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("mouseover", this.listeners.mouseover); 

    this.listeners.mouseover = (e) => {
      this.register_event({
        _: "App.Event.mouse_out",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("mouseout", this.listeners.mouseout);

    this.listeners.click = (e) => {
      this.register_event({
        _: "App.Event.mouse_click",
        time: BigInt(Date.now()),
        id: e.target.id
      });
    };
    document.body.addEventListener("click", this.listeners.click); 

    // Mouse up event
    this.listeners.mouseup = (e) => {
      this.register_event({
        _: "App.Event.mouse_up",
        time: BigInt(Date.now()),
      });
    };
    document.body.addEventListener("mouseup", this.listeners.mouseup);

    // Key down event
    this.listeners.keydown = (e) => {
      if (!e.repeat) {
        this.register_event({
          _: "App.Event.key_down",
          time: BigInt(Date.now()),
          code: e.keyCode,
        });
      }
    };
    document.body.addEventListener("keydown", this.listeners.keydown);

    // Key up event
    this.listeners.keyup = (e) => {
      this.register_event({
        _: "App.Event.key_up",
        time: BigInt(Date.now()),
        code: e.keyCode,
      });
    };
    document.body.addEventListener("keyup", this.listeners.keyup);

    // Resize event
    this.listeners.resize = (e) => {
      this.register_event({
        _: "App.Event.resize",
        time: BigInt(Date.now()),
        info: {
          _: "App.EnvInfo.new",
          screen_size: {
            _: "Pair.new",
            fst: e.target.innerWidth,
            snd: e.target.innerHeight,
          },
          mouse_pos: this.mouse_pos,
        }
      });
    };
    window.addEventListener("resize", this.listeners.resize);

    //Tick event
    this.intervals.tick = () => {
      let time = performance.now()
      let frame = 1000/16
      let self = (mileseconds) => {
        if (mileseconds-time > frame) {
          this.register_event({
            _: "App.Event.tick",
            time: BigInt(Date.now()),
            info: {
              _: "App.EnvInfo.new",
              screen_size: {
                _: "Pair.new",
                fst: this.container ? this.container.offsetWidth : 0,
                snd: this.container ? this.container.offsetHeight : 0,
              },
              mouse_pos: this.mouse_pos,
            }
          })
          time = performance.now()
        }
        window.requestAnimationFrame(self)
      }
      return window.requestAnimationFrame(self)
    }

    this.intervals.tick()
  }
  
  // Initializes the main render loop
  
  async init_renderer() {
    if (DEBUG_SHOW_FPS) {
      var last_time = Date.now();
      var fps_count = 0;
    }
    this.intervals.renderer = setInterval(() => {
      if (this.app) {
        if (DEBUG_SHOW_FPS) {
          if (Date.now() - last_time > 1000) {
            console.log("FPS: ", fps_count);
            fps_count = 0;
            last_time = Date.now();
          }
          fps_count++;
        }
        this.rendered = this.app.draw(this.app_state);
        this.forceUpdate();
      }
    }, 1000 / 32);
  }

  // Adds an event to the list of events
  register_event(ev) {
    if (this.app) {
      this.run_io(this.app.when(ev)(this.app_state));
    }
  }

  // Performs an IO computation
  run_io(io) {
    //console.log("Run IO", io);
    switch (io._) {
      case "IO.end":
        if (io.value.value !== null) {
          this.app_state = io.value.value;
          return Promise.resolve(io.value.value);
        }
        return Promise.resolve(null);
      case "IO.ask":
        //console.log("IO.ask", io.param);
        return new Promise((res, err) => {
          switch (io.query) {
            case "print":
              alert(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "put_string":
              alert(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "get_time":
              return this.run_io(io.then(String(Date.now()))).then(res).catch(err);
            case "get_line":
              var answer = prompt(io.param) || "";
              return this.run_io(io.then(answer)).then(res).catch(err);
            case "get_file":
              var data = localStorage.getItem(io.param) || "";
              return this.run_io(io.then(data)).then(res).catch(err);
            case "set_file":
              var path = '';
              for (var i = 0; i < io.param.length && io.param[i] !== '='; ++i) {
                path += param[i];
              };
              var data = io.param.slice(i + 1);
              localStorage.setItem(path, data);
              return this.run_io(io.then("")).then(res).catch(err);
            case "del_file":
              localStorage.removeItem(io.param);
              return this.run_io(io.then("")).then(res).catch(err);
            case "watch":
              if (utils.is_valid_hex(48, io.param)) {
                window.KindEvents.watch_room(io.param);
                window.KindEvents.on_post(({ room, time, addr, data }) => {
                  var time = BigInt(parseInt(time.slice(2), 16));
                  this.register_event({ _: "App.Event.post", time, room, addr : addr.toLowerCase(), data });
                });
              } else {
                console.log("Error: invalid input on App.Action.watch");
              }
              return this.run_io(io.then("")).then(res).catch(err);
            case "post":
              var [room, data] = io.param.split(";");
              if (utils.is_valid_hex(48, room) && utils.is_valid_hex(256, data)) {
                console.log("Posting: ", room, data);
                window.KindEvents.send_post(room, data);
              } else {
                console.log("Error: invalid input on App.Action.post");
              }
              return this.run_io(io.then("")).then(res).catch(err);
          }
        });
    }
  }

  // Renders a document
  render_dom(elem) {
    //console.log("render_dom", elem);
    switch (elem._) {
      // Renders a HTML element
      case "DOM.node":
        let props = utils.map_to_object(elem.props);
        let style = utils.map_to_object(elem.style);
        return h(elem.tag, {
          ...props,
          style: style
        }, utils.list_to_array(elem.children).map(x => this.render_dom(x)));
      // Renders a VoxBox using a canvas
      case "DOM.vbox":
        var id = elem.props ? elem.props.id || "" : "";
        var width = Number(elem.props.width) || 256;
        var height = Number(elem.props.height) || 256;
        var canvas = this.get_canvas(id, width, height);
        var length = elem.value.length;
        var capacity = elem.value.capacity;
        var buffer = elem.value.buffer;
        // Renders pixels to buffers
        for (var i = 0; i < length; ++i) {
          var pos = buffer[i * 2 + 0];
          var col = buffer[i * 2 + 1];
          var p_x = (pos >>> 0) & 0xFFF;
          var p_y = (pos >>> 12) & 0xFFF;
          var p_z = (pos >>> 24) & 0xFF;
          var idx = p_y * canvas.width + p_x;
          var dep = canvas.depth_u8[idx];
          if (p_x >= 0 && p_x < width && p_y >= 0 && p_y < height && p_z >= dep) {
            canvas.image_u32[idx] = col;
            canvas.depth_u8[idx] = p_z;
            canvas.clear.data[canvas.clear.length++] = idx;
          }
        }
        // Renders buffers to canvas
        canvas.image_data.data.set(canvas.image_u8);
        canvas.context.putImageData(canvas.image_data, 0, 0);
        // Erases pixels from buffers
        for (var i = 0; i < canvas.clear.length; ++i) {
          var idx = canvas.clear.data[i];
          canvas.image_u32[idx] = 0;
          canvas.depth_u8[idx] = 0;
        }
        canvas.clear.length = 0;
        // Mutably resets the length of the VoxBox
        elem.value.length = 0;
        return h("div", {
          ref: function (x) { if (x) { x.appendChild(canvas) } }
        });
      // Renders plain text
      case "DOM.text":
        return elem.value;
    }
  }

  // Component's render function
  render() {
    if (!this.app) {
      return "Loading app...";
    } else if (!this.rendered) {
      return "Rendering app...";
    } else {
      var element = this.render_dom(this.rendered);
      var container = h("div", {
        id: "container",
        style: {
          "width": "100%",
          "height": "100%",
        },
      }, element);
      return container;
    }
  }

  // Gets a pixel-art canvas
  get_canvas(id, width, height) {
    if (!this.canvas[id] || this.canvas[id].width !== width || this.canvas[id].height !== height) {
      console.log("creating canvas", id, width, height);
      this.canvas[id] = document.createElement("canvas");
      this.canvas[id].style["image-rendering"] = "pixelated";
      this.canvas[id].width = width;
      this.canvas[id].height = height;
      this.canvas[id].style.width = width + "px";
      this.canvas[id].style.height = height + "px";
      this.canvas[id].clear = { length: 0, data: new Uint32Array(width * height * 32) };
      this.canvas[id].style.border = "1px solid black";
      this.canvas[id].context = this.canvas[id].getContext("2d");
      this.canvas[id].image_data = this.canvas[id].context.getImageData(0, 0, this.canvas[id].width, this.canvas[id].height)
      this.canvas[id].image_buf = new ArrayBuffer(this.canvas[id].image_data.data.length);
      this.canvas[id].image_u8 = new Uint8ClampedArray(this.canvas[id].image_buf);
      this.canvas[id].image_u32 = new Uint32Array(this.canvas[id].image_buf);
      this.canvas[id].depth_buf = new ArrayBuffer(this.canvas[id].image_u32.length);
      this.canvas[id].depth_u8 = new Uint8Array(this.canvas[id].depth_buf);
    }
    return this.canvas[id];
  }

}



/***/ }),

/***/ 649:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'Web.Demo': __webpack_require__.e(/* import() */ 987).then(__webpack_require__.t.bind(__webpack_require__, 987, 23)),
  'Web.Kaelin': __webpack_require__.e(/* import() */ 927).then(__webpack_require__.t.bind(__webpack_require__, 927, 23)),
  'Web.Kind': __webpack_require__.e(/* import() */ 464).then(__webpack_require__.t.bind(__webpack_require__, 464, 23)),
  'Web.Online': __webpack_require__.e(/* import() */ 523).then(__webpack_require__.t.bind(__webpack_require__, 523, 23)),
  'Web.Senhas': __webpack_require__.e(/* import() */ 936).then(__webpack_require__.t.bind(__webpack_require__, 936, 23)),
  'Web.TicTacToe': __webpack_require__.e(/* import() */ 734).then(__webpack_require__.t.bind(__webpack_require__, 734, 23)),
}


/***/ }),

/***/ 555:
/***/ ((module) => {

function is_valid_hex(bits, hex) {
  return new RegExp("^0x[0-9A-Fa-f]{"+Math.floor(bits/4)+"}$").test(hex)
}

function list_to_array(list) {
  var arr = [];
  while (list._ === "List.cons") {
    arr.push(list.head);
    list = list.tail;
  }
  return arr;
}

function map_to_object(map, key = "", obj = {}) {
  switch (map._) {
    case "BitsMap.tie":
      switch (map.val._) {
        case "Maybe.none": break;
        case "Maybe.some": obj[bits_to_string(key)] = map.val.value; break;
      }
      map_to_object(map.lft, key + "0", obj);
      map_to_object(map.rgt, key + "1", obj);
      break;
    case "BitsMap.new":
      break;
  }
  return obj;
}

function bits_to_string(bits) {
  var str = "";
  for (var i = 0; i < bits.length; i += 16) {
    var binary = bits.slice(i, i + 16).split("").reverse().join("");
    str += String.fromCharCode(parseInt(binary, 2));
  }
  return str;
}


module.exports = {
  is_valid_hex,
  list_to_array,
  map_to_object,
  bits_to_string,
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(key => def[key] = () => value[key]);
/******/ 			}
/******/ 			def['default'] = () => value;
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "kind-web:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => {
/******/ 								installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 							});
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no deferred startup
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		// no deferred startup
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__(787)/* .default */ .Z;

const {Component, render} = __webpack_require__(285);
const h = __webpack_require__(86).h;

const EthSign = __webpack_require__(216);
const AppPlay = __webpack_require__(952);
const AppList = __webpack_require__(101);
const KindEventsClient = __webpack_require__(596);

function random_hex(bits_len) {
  var bytes = crypto.getRandomValues(new Uint8Array((bits_len/8)>>>0));
  var chars = Array.from(bytes).map(b => ("00" + b.toString(16)).slice(-2));
  return "0x" + chars.join("");
}

function get_from_storage(key, init) {
  var value = localStorage.getItem(key);
  if (!value) {
    value = init();
    localStorage.setItem(key, value);
  }
  return value;
}

window.KEY = get_from_storage("KEY", () => random_hex(256));
window.KindEvents = KindEventsClient({url: "ws://uwu.tech:7171", key: window.KEY});
console.log("KEY: ", window.KEY);
console.log("ADDRESS: ", EthSign.addressFromKey(window.KEY));

class Moonad extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    window.addEventListener('popstate', (event) => {
      this.forceUpdate();
    });
  }
  render() {
    var path = window.location.pathname.slice(1);
    if (path === "") {
      return h(AppList);
    } else {
      return h(AppPlay, {name: path});
    }
  }
};

window.onload = () => render(h(Moonad), document.getElementById("main"));

})();

/******/ })()
;
//# sourceMappingURL=index.js.map