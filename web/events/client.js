var lib = require("./lib.js");
var sig = require("nano-ethereum-signer");
var WebSocket = require("isomorphic-ws");

module.exports = function client({url = "ws://localhost:7171", key = "0x0000000000000000000000000000000000000000000000000000000000000001"} = {}) {
  var ws = new WebSocket(url);
  var Posts = {};
  var watching = {};

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
    ws.send(msge_buff);
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
      ws.send(msge_buff); 
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
      ws.send(msge_buff);
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
