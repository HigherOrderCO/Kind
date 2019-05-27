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
  console.log("Evaluation modes (default: -b):");
  console.log("-b boxed (using interpreter)");
  console.log("-u unboxed (using interpreter)");
  console.log("-l optimal, lazy (using interaction nets)");
  console.log("-s optimal, strict (using interaction nets)");
  console.log("-n native (using JavaScript closures)");
  console.log("");
  console.log("Options:");
  console.log("-h hides interaction net stats");
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

var mode
  = args.b ? "BOXED"
  : args.u ? "UNBOXED"
  : args.l ? "OPTIMAL_LAZY"
  : args.s ? "OPTIMAL_STRICT"
  : args.n ? "NATIVE"
  : "BOXED";
var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

var {defs, infs} = fm.core.parse(code);

try {
  var stats = {
    rewrites: 0,
    loops: 0,
    max_len: 0,
    input_net: args.p ? null : undefined,
    output_net: args.p ? null : undefined
  };
  var term = fm.exec(name, defs, infs, mode, args.d, stats);
  console.log(fm.core.show(term));
  if (args.p || (mode.slice(0,3) === "OPT" && !args.h)) {
    console.log(JSON.stringify(stats));
  }
} catch (e) {
  console.log(e);
  console.log(e.toString());
  console.log(e)
}
