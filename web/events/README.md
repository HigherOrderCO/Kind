events.moonad.org
=================

Allows posting small (up to 256-bit) messages, signed with Ethereum accounts, to
rooms identified by a 48-bit name. Clients can then watch rooms, which are
synchronized using WebSockets (and, in a future, WebRTC). This is used as a
sandboxed communication environment for
[Formality](http://github.com/moonad/formality) apps running on the
[Moonad](http://github.com/moonad/moonad) ecosystem.

Server
------

To start a server, just do:

```
git clone http://github.com/moonad/events
cd events
node server.js 7171
```

Client
------

The code below will connect to a server running on `localhost:7171`, with a test
Ethereum private key. It will then watch the room `0` and make an example post
to it. It will then display on the console all posts of this room, and update in
real-time whenever there is a new post.

```javascript
var client = require("./client.js");
var api = client({
  url: "ws://localhost:7171",
  key: "0x0000000000000000000000000000000000000000000000000000000000000001",
});

// When connected, watches room 0 and makes an example post.
api.on_init(() => {
  var room = "0x000000000000";
  var post = "0x1230000000000000000000000000000000000000000000000000000000000000000000000321";

  // Watches the room
  api.watch_room(room);

  // Posts a 256-bit message to it
  api.send_post(room, post);
});

// When there is a new posts, print all posts we have recorded.
api.on_post((post, Posts) => {
  console.clear();
  console.log(JSON.stringify(Posts, null, 2));
});
```
