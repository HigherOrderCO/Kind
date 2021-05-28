var lib = require("./lib.js");
var sig = require("nano-ethereum-signer");
var WebSocket = require("isomorphic-ws");

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

  // Time sync variables
  var last_ask_time = null; // last time we pinged the server
  var last_ask_numb = 0; // id of the last ask request
  var best_ask_ping = Infinity; // best ping we got
  var delta_time = 0; // estimated time on best ping
  var ping = 0; // current ping

  // User-defined callbacks
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
    var post_room = lib.check_hex(56, post_room);
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
    var room_name = room_name.toLowerCase();
    if (!watching[room_name]) {
      watching[room_name] = true;
      var room_name = lib.check_hex(56, room_name);
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
    var room_name = room_name.toLowerCase();
    if (watching[room_name]) {
      watching[room_name] = false;
      var room_name = lib.check_hex(56, room_name);
      var msge_buff = lib.hexs_to_bytes([
        lib.u8_to_hex(lib.UNWATCH),
        room_name,
      ]);
      ws_send(msge_buff);
    }
  };

  // Returns the best estimative of the server's current time
  function get_time() {
    return Date.now() + delta_time;  
  };

  // Returns the best estimative of the server's current tick
  function get_tick() {
    return Math.floor((Date.now() + delta_time) / 62.5);
  };

  // Asks the server for its current time
  function ask_time() {
    last_ask_time = Date.now();
    last_ask_numb = ++last_ask_numb;
    ws_send(lib.hexs_to_bytes([
      lib.u8_to_hex(lib.TIME),
      lib.u48_to_hex(last_ask_numb),
    ]));
  };

  ws.binaryType = "arraybuffer";

  ws.onopen = function() {
    if (on_init_callback) {
      on_init_callback();
    }
    // Pings time now, after 0.5s, after 1s, and then every 2s
    setTimeout(ask_time, 0);
    setTimeout(ask_time, 500);
    setTimeout(ask_time, 1000);
    setInterval(ask_time, 2000);
  };

  ws.onmessage = (msge) => {
    var msge = new Uint8Array(msge.data);
    if (msge[0] === lib.SHOW) {
      var room = lib.bytes_to_hex(msge.slice(1, 8));
      var time = lib.bytes_to_hex(msge.slice(8, 13));
      var addr = lib.bytes_to_hex(msge.slice(13, 33));
      var data = lib.bytes_to_hex(msge.slice(33, 65));
      Posts[room].push({time, addr, data});
      if (on_post_callback) {
        on_post_callback({room, time, addr, data}, Posts);
      }
    };
    if (msge[0] === lib.TIME) {
      var reported_server_time = lib.bytes_to_hex(msge.slice(1, 7));
      var reply_numb = lib.hex_to_u48(lib.bytes_to_hex(msge.slice(7, 13)));
      if (last_ask_time !== null && last_ask_numb === reply_numb) {
        ping = (Date.now() - last_ask_time) / 2;
        var local_time = Date.now();
        var estimated_server_time = Number(reported_server_time) + ping;
        if (ping < best_ask_ping) {
          delta_time = estimated_server_time - local_time;
          best_ask_ping = ping;
        }
      }
    };
  };

  return {
    on_init,
    on_post,
    send_post,
    watch_room,
    unwatch_room,
    get_time,
    get_tick,
    lib,
  };
};

