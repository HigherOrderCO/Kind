#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var expr = argv.pop() || "main";
  var args = {};
  var defa = "-itleTRx";
  if (argv.length === 0) argv = [defa];
  argv.join("").split("").forEach(c => args[c] = 1);
  var code = "";
  var files = fs.readdirSync(".");
  for (var i = 0; i < files.length; ++i) {
    if (files[i].slice(-3) === ".fm") {
      code += fs.readFileSync("./" + files[i], "utf8") + "\n";
    }
  }
} catch (e) {
  if (e) console.log(e);
  console.log("Formality: an efficient proof language.");
  console.log("");
  console.log("Usage: fm [options] expr");
  console.log("(loads local .fm files and runs/checks an expr)");
  console.log("");
  console.log("Options:");
  console.log("-i shows extra information");
  console.log("-T shows type");
  console.log("-R shows type with references untouched");
  console.log("-W shows type on weak normal form");
  console.log("-L shows type on LAM form instead of EAC");
  console.log("-E shows type erased");
  console.log("-t shows term");
  console.log("-r shows term with references untouched");
  console.log("-w shows term on weak normal form");
  console.log("-l shows term on LAM form instead of EAC");
  console.log("-e shows term erased");
  console.log("-x shows NASIC evaluation");
  console.log("(default: "+defa+")");
  process.exit();
}

var defs = fm.parse(code);
var term = fm.parse(". main (" + expr + ")").main;

var funcs = {
  T: ["Type:", () => console.log(fm.show(fm.norm((args.E ? fm.erase : (x => x))(fm.infer(term, defs)), args.R ? {} : defs, args.W, args.L)))],
  t: ["Norm (interpreted):", () => console.log(fm.show(fm.norm((args.e ? fm.erase : (x => x))(term), args.r ? {} : defs, args.w, args.l)))],
  x: ["Norm (using NASIC):", () => {
    var net = fm.compile(term, defs);
    var stats = net.reduce_lazy();
    console.log(fm.show(fm.norm((args.e ? fm.erase : (x => x))(fm.decompile(net)), args.r ? {} : defs, args.w, args.l)))
    console.log("(" + stats.rewrites + " rewrites)");
  }]
};

for (var key in funcs) {
  if (args[key]) {
    if (args.i) console.log("\x1b[4m" + funcs[key][0] + "\x1b[0m");
    try {
      funcs[key][1]();
      if (args.i) console.log("");
    } catch (e) {
      console.log(e);
      if (args.i) console.log("");
    }
  }
}
