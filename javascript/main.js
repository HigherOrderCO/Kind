#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var name = argv.pop() || "main";
  var args = {};
  argv.join("").split("").forEach(c => args[c] = 1);
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
  console.log("-i uses interpreter instead of inets");
  console.log("-e uses interpreter and preserves EAL boxes");
  console.log("-d disables stratification (termination) checks");
  console.log("-s shows stats");
  console.log("");
  console.log("Note: fmC will automatically import any local file ending in `.fmc`.");
  process.exit();
}

var mode = args.e ? "EAL" : args.l ? "INT" : "NET";
var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

var {defs, infs} = fm.core.parse(code);

try {
  var stats = {rewrites: 0, loops: 0};
  var term = fm.exec(name, defs, mode, args.d, stats);
  console.log(fm.core.show(term));
  if (args.s) console.log(JSON.stringify(stats));
} catch (e) {
  console.log(e);
  console.log(e.toString());
  console.log(e)
}
