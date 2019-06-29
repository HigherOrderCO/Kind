#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var ea = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  var defa = "-inleNRx";
  if (argv[0] === "-v") { console.log(require("./package.json").version); process.exit(); }
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var expr = argv.pop() || "main";
  var args = {};
  if (argv.length === 0) argv = [defa];
  argv.join("").split("").forEach(c => args[c] = 1);
  var code = "";
  var files = fs.readdirSync(".");
  for (var i = 0; i < files.length; ++i) {
    if (files[i].slice(-5) === ".eatt") {
      code += fs.readFileSync("./" + files[i], "utf8") + "\n";
    }
  }
} catch (e) {
  console.log("Elementary Affine Type Theory (EA-TT)");
  console.log("");
  console.log("Usage: eatt [options] expr");
  console.log("(loads local .eatt files and runs/checks an expr)");
  console.log("");
  console.log("Options:");
  console.log("-v shows EA-TT version");
  console.log("-i shows extra information");
  console.log("-N shows type normalized");
  console.log("-R shows type with unexpanded references");
  console.log("-W shows type on weak normal form");
  console.log("-L shows type on LAM form instead of EA-CORE");
  console.log("-E shows type erased");
  console.log("-n shows term");
  console.log("-r shows term with unexpanded references");
  console.log("-w shows term on weak normal form");
  console.log("-l shows term on LAM form instead of EA-CORE");
  console.log("-e shows term erased");
  console.log("-x shows NASIC evaluation");
  console.log("(default: "+defa+")");
  process.exit();
}

var defs = ea.tt.parse(code);
var term = ea.tt.parse(". main (" + expr + ")").main;

var funcs = {
  N: ["Type:", () => console.log(ea.tt.show(ea.tt.norm((args.E ? ea.tt.erase : (x => x))(ea.tt.infer(term, defs)), args.R ? {} : defs, args.W, args.L)))],
  n: ["Norm (interpreted):", () => console.log(ea.tt.show(ea.tt.norm((args.e ? ea.tt.erase : (x => x))(term), args.r ? {} : defs, args.w, args.l)))],
  x: ["Norm (using NASIC):", () => {
    var core  = ea.tt.to_core.compile(term, defs);
    var net   = ea.core.to_net.compile(core, defs);
    var stats = net.reduce_lazy();
    var norm  = ea.tt.to_core.decompile(ea.core.to_net.decompile(net));
    var eras  = args.e ? ea.tt.erase : (x => x);
    console.log(ea.tt.show(ea.tt.norm(eras(norm), args.r ? {} : defs, args.w, args.l)))
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
