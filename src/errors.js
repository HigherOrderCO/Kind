function marked_code(loc) {
  var text = "";
  var idx = 0;
  var lines = loc.code.split("\n");
  var from_line = Math.max(loc.row - 4, 0);
  var to_line = Math.min(loc.row + 4, lines.length - 1);
  for (var line = 0; line < lines.length; ++line) {
    var write = line >= from_line && line <= to_line;
    if (write) text += "\x1b[2m" + ("    " + (line + 1)).slice(-4) + "| \x1b[0m";
    for (var i = 0; i < lines[line].length; ++i) {
      if (idx >= loc.idx && idx < loc.idx + loc.len) {
        if (write) text += "\x1b[31m\x1b[4m" + lines[line][i] + "\x1b[0m";
        idx += 1;
      } else {
        if (write) text += "\x1b[2m" + lines[line][i] + "\x1b[0m";
        idx += 1;
      }
    }
    if (write) text += "\n";
    idx += 1;
  }
  return text;
}

function random_excuse() {
  var excuses = [
    "My parse-robot brain isn't perfect, sorry.",
    "What? If you can't get this right, don't expect me to!",
    "I'm doing my best, ok?",
    "I hope you figure it out!",
    "I can't help any further. But I can pray for you!",
    "I with I could be more precise...",
    "Hey, at least I'm showing a location.",
    "Why programming needs to be so hard?",
    "I hope this doesn't affect your deadlines!",
    "If this is hard, consider relaxing. You deserve it!",
    "It takes me some time to process things. Have patience with me!"
  ];
  return excuses[Math.floor(Math.random() * excuses.length)];
}

module.exports = {marked_code, random_excuse};
