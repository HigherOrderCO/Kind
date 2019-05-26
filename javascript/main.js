#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var name = argv.filter(str => str[0] !== "-")[0] || "main";
  var args = {};
  argv.filter(str => str[0] === "-").map(str => str.slice(1)).join("").split("").forEach(c => args[c] = 1);
  var code = "";
  var files = fs.readdirSync(".");
  for (var i = 0; i < files.length; ++i) {
    if (files[i].slice(-4) === ".fmc") {
      code += fs.readFileSync("./" + files[i], "utf8") + "\n";
    }
  }
} catch (e) {
  if (e) console.log(e);
  console.log("Formality-Core");
  console.log("");
  console.log("Usage: fmc [options] term_name");
  console.log("");
  console.log("Options:");
  console.log("-e uses interpreter (default)");
  console.log("-i uses interpreter, erasing boxes");
  console.log("-n uses interaction nets, erasing boxes (fast)");
  console.log("-s same as -n, but showing stats");
  console.log("-d disables stratification (termination) checks");
  console.log("-p prints net as JSON");
  console.log("-v displays the version");
  console.log("");
  console.log("Note: fmc will automatically import any local file ending in `.fmc`.");
  process.exit();
}

if (args.v) {
  console.log(require("./package.json").version);
  process.exit();
}

if (args.s) {
  args.n = 1;
}
var mode = args.e ? "EAL" : args.i ? "INT" : args.n ? "NET" : "EAL";
var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

var {defs, infs} = fm.core.parse(code);

try {
  var stats = {
    rewrites: 0,
    passes: 0,
    maxlen: 0,
    input_net: args.p ? null : undefined,
    output_net: args.p ? null : undefined
  };
  var term = fm.exec(name, defs, infs, mode, args.d, stats);
  console.log(fm.core.show(term));
  if (args.p || args.s) {
    console.log(JSON.stringify(stats));
  }
} catch (e) {
  console.log(e);
  console.log(e.toString());
  console.log(e)
}
