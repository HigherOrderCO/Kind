var lib = require("./lib.js");
var ethsig = require("nano-ethereum-signer");
var WebSocket = require("isomorphic-ws");

module.exports = function client({url = "ws://localhost:7171", key = "0000000000000000000000000000000000000000000000000000000000000001"} = {}) {
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
    var post_room = lib.check_hex(64, post_room);
    var post_data = lib.check_hex(null, post_data);
    var post_hash = ethsig.keccak("0x"+lib.hexs_to_bytes([post_room, post_data])).slice(2);
    var post_sign = ethsig.signMessage("0x"+post_hash, "0x"+priv_key).slice(2);

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
      var room_name = lib.check_hex(64, room_name);
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
      var room_name = lib.check_hex(64, room_name);
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
      lib.u64_to_hex(last_ask_numb),
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
    //console.log("receiving", msge);
    if (msge[0] === lib.SHOW) {
      var room = lib.bytes_to_hex(msge.slice(1, 9));
      var tick = lib.bytes_to_hex(msge.slice(9, 17));
      var addr = lib.bytes_to_hex(msge.slice(17, 37));
      var data = lib.bytes_to_hex(msge.slice(37, msge.length));
      //console.log("- room", room)
      //console.log("- addr", addr)
      //console.log("- data", data)
      Posts[room].push({tick, addr, data});
      if (on_post_callback) {
        on_post_callback({room, tick, addr, data}, Posts);
      }
    };
    if (msge[0] === lib.TIME) {
      var reported_server_time = lib.hex_to_u64(lib.bytes_to_hex(msge.slice(1, 9)));
      var reply_numb = lib.hex_to_u64(lib.bytes_to_hex(msge.slice(9, 17)));
      if (last_ask_time !== null && last_ask_numb === reply_numb) {
        ping = (Date.now() - last_ask_time) / 2;
        var local_time = Date.now();
        var estimated_server_time = reported_server_time + ping;
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

