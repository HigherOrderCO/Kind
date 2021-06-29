var client = require("./client.js");
var api = client({
  //url: "ws://uwu.tech:7171",
  url: "ws://localhost:7171",
  key: "0000000000000000000000000000000000000000000000000000000000000001",
});

// When connected, watches room 0 and makes an example post.
api.on_init(() => {
  var room = "1234000000004321";
  var post = "01020304";

  // Watches the room
  api.watch_room(room);

  // Posts a 256-bit message to it
  //api.send_post(room, post);

  function print_time() {
    //console.clear();
    console.log("local_time  : ", Date.now());
    console.log("server_time : ", api.get_time());
    console.log("delta_time  : ", Date.now() - api.get_time());
    console.log("");
  }
  print_time()
  setInterval(print_time, 1000);
});

// When there is a new posts, print all posts we have recorded.
api.on_post((post, Posts) => {
  //console.clear();
  console.log(JSON.stringify(post));
  //console.log(JSON.stringify(Posts, null, 2));
});

