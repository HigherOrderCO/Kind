#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var expr = argv.pop() || "main";
  var args = {};
  if (argv.length === 0) argv = ["-telsiS"];
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
  console.log("-t shows term");
  console.log("-e uses EAL interpreter");
  console.log("-l uses LAM interpreter");
  console.log("-s uses NASIC evaluator");
  console.log("-S shows NASIC stats");
  console.log("-i shows extra info");
  console.log("-d disables stratification (termination) checks");
  console.log("");
  console.log("Note: Everything is shown by default.");
  console.log("Note: fmC will automatically import any local file ending in `.fmc`.");
  process.exit();
}

var show_term = args.t;
var check_eal = !args.d;
var show_eal_interp = args.e;
var show_lam_interp = args.l;
var show_eal_sic = args.s;
var show_info = args.i;
var show_stats = args.S;

var defs = fm.core.parse(code);
var term = fm.core.parse("def main: (" + expr + ")").main;

var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

if (show_term) {
  if (show_info) console.log(BOLD("Term:"));
  console.log(fm.core.show(term));
  if (show_info) console.log("");
}

if (check_eal) {
  try {
    fm.core.check(term, defs);
  } catch (e) {
    console.log(e.toString());
    process.exit();
  }
}

if (show_eal_sic) {
  if (show_info) console.log(BOLD("Norm (λ-NASIC):"));
  try {
    var net = fm.comp.compile(term, defs);
    var stats = net.reduce();
    console.log(fm.core.show(fm.comp.decompile(net)));
    if (show_stats) {
      for (var key in stats) {
        console.log(key + " = " + stats[key]);
      }
    }
    if (show_info) console.log("");
  } catch (e) {
    console.log(e.toString());
    if (show_info) console.log("");
  }
}

if (show_lam_interp) {
  if (show_info) console.log(BOLD("Norm (λ-INTERP):"));
  try {
    console.log(fm.core.show(fm.core.norm(term, defs, true), true));
    if (show_info) console.log("");
  } catch (e) {
    console.log(e);
    if (show_info) console.log("");
  }
}

if (show_eal_interp) {
  if (show_info) console.log(BOLD("Norm (EAL-INTERP):"));
  try {
    console.log(fm.core.show(fm.core.norm(term, defs, false)));
    if (show_info) console.log("");
  } catch (e) {
    console.log(e.toString());
    if (show_info) console.log("");
  }
}
