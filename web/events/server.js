var port = Number(process.argv[2] || "7171");
var ws = require('ws');
var fs = require("fs-extra");
var path = require("path");
var lib = require("./lib.js");
var sig = require("nano-ethereum-signer");

// Globals
// =======

var RoomPosts = {}; // Map RoomID [Uint8Array] -- past messages to sync w/ room
var Watchlist = {}; // Map RoomID [WsPeer] -- ws peers watching given room
var Connected = 0;

// Startup
// =======

// Creates the data directory
if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

// Loads existing posts
var files = fs.readdirSync("data");
for (var file of files) {
  if (file.slice(-5) === ".room") {
    var room_name = file.slice(0, -5);
    var file_data = fs.readFileSync(path.join("data",file));
    var room_posts = [];
    for (var i = 0; i < file_data.length; i += 64) {
      var head = Buffer.from([lib.SHOW]);
      var body = file_data.slice(i, i + 64);
      room_posts.push(new Uint8Array(Buffer.concat([head, body])));
    }
    console.log("Loaded "+room_posts.length+" posts from room "+room_name+".");
    RoomPosts[room_name] = room_posts;
  }
}

// Methods
// =======

// Adds a user to a room's watchlist
function watch_room(room_name, ws) {
  // Creates watcher list
  if (!Watchlist[room_name]) {
    Watchlist[room_name] = [];
  }

  // Gets watcher list
  var watchlist = Watchlist[room_name];

  // Makes sure user isn't watching already
  for (var i = 0; i < watchlist.length; ++i) {
    if (watchlist[i] === ws) {
      return;
    };
  }

  // Sends old messages
  if (RoomPosts[room_name]) {
    for (var i = 0; i < RoomPosts[room_name].length; ++i) {
      ws.send(RoomPosts[room_name][i]);
    }
  }

  // Adds user to watcher list
  watchlist.push(ws);
};

// Removes a user from a room's watchlist
function unwatch_room(room_name, ws) {
  // Gets watcher list
  var watchlist = Watchlist[room_name] || [];

  // Removes user from watcher list
  for (var i = 0; i < watchlist.length; ++i) {
    if (watchlist[i] === ws) {
      for (var j = i; j < watchlist.length - 1; ++j) {
        watchlist[j] = watchlist[j + 1];
      };
      return;
    }
  };
};

// Saves a post (room id, user address, data)
function save_post(post_room, post_user, post_data) {
  var post_room = lib.check_hex(48, post_room);
  var post_time = lib.u48_to_hex(Date.now());
  var post_user = lib.check_hex(160, post_user);
  var post_data = lib.check_hex(256, post_data);
  var post_buff = lib.hexs_to_bytes([
    lib.u8_to_hex(lib.SHOW),
    post_room,
    post_time,
    post_user,
    post_data,
  ]);
  var post_file = path.join("data", post_room+".room");

  var log_msg = "";

  log_msg += "Saving post!\n";
  log_msg += "- post_room: " + post_room + "\n";
  log_msg += "- post_user: " + post_user + "\n";
  log_msg += "- post_data: " + post_data + "\n";
  log_msg += "- post_file: " + post_room+".room" + "\n";

  // Creates reconnection array for this room
  if (!RoomPosts[post_room]) {
    RoomPosts[post_room] = [];
  }

  // Adds post to reconnection array
  RoomPosts[post_room].push(post_buff);

  // Broadcasts
  if (Watchlist[post_room]) {
    log_msg += "- broadcasting to " + Watchlist[post_room].length + " watcher(s).\n";
    for (var ws of Watchlist[post_room]) {
      ws.send(post_buff);
    }
  }

  // Create file for this room
  if (!fs.existsSync(post_file)) {
    fs.closeSync(fs.openSync(post_file, "w"));
  }

  // Adds post to file
  fs.appendFileSync(post_file, Buffer.from(post_buff.slice(1)));

  // Log messages
  console.log(log_msg);
};

// TCP API
// =======

const wss = new ws.Server({port});

wss.binaryType = "arraybuffer";
 
wss.on("connection", function connection(ws) {
  console.log("["+(++Connected)+" connected]");
  ws.on("message", function incoming(data) {
    var msge = new Uint8Array(data);
    switch (msge[0]) {
      // User wants to watch a room
      case lib.WATCH:
        var room = lib.bytes_to_hex(msge.slice(1, 7));
        watch_room(room, ws);
        break;

      // User wants to unwatch a room
      case lib.UNWATCH:
        var room = lib.bytes_to_hex(msge.slice(1, 7));
        unwatch_room(room, ws);
        break;

      // User wants to post a message
      case lib.POST:
        //console.log("got post msge...", msge);
        var post_room = lib.bytes_to_hex(msge.slice(1, 7));
        var post_data = lib.bytes_to_hex(msge.slice(7, 39));
        var post_sign = lib.bytes_to_hex(msge.slice(39, 104));
        var post_hash = sig.keccak(lib.hexs_to_bytes([post_room, post_data]));
        var post_user = sig.signerAddress(post_hash, post_sign);
        save_post(post_room, post_user, post_data);
    };
  });

  ws.on("close", function() {
    for (var room_name in Watchlist) {
      Watchlist[room_name] = Watchlist[room_name].filter(watcher => watcher !== ws);
    };
    console.log("["+(--Connected)+" connected]");
  });
});

console.log("Started server on ws://localhost:"+port+".");
