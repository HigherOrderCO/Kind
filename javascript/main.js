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
var info = args.s;
var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

var {defs, infs} = fm.core.parse(code);

function check(term) {
  if (!args.d) {
    try {
      fm.core.check(term, defs);
      return term;
    } catch (e) {
      console.log(e.toString());
      process.exit();
    }
  }
}

function norm(term, mode, stats) {
  switch (mode) {
    case "EAL":
      return fm.core.norm(term, defs, false);
    case "INT":
      return fm.core.norm(term, defs, true);
    case "NET":
      var net = fm.comp.compile(term, defs);
      var new_stats = net.reduce();
      if (stats) stats.rewrites += new_stats.rewrites;
      return fm.comp.decompile(net);
  }
}

function exec(name, mode, stats) {
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  if (defs[name]) {
    return norm(check(defs[name]), mode, null);
  } else if (infs[name]) {
    var data = infs[name];
    var init = check(data.init);
    var step = check(data.step);
    var stop = check(data.stop);
    var done = check(data.done);
    var term = fm.core.norm(init, mode, stats);
    var cont = term => {
      var res = norm(fm.core.App(stop, term), mode, stats);
      if (res[0] === "Put") {
        res = res[1].expr;
      }
      return res[0] === "Num" && res[1].numb === 0;
    }
    while (cont(term)) {
      term = norm(fm.core.App(step, term), mode, stats);
      stats.loops += 1;
    }
    term = norm(fm.core.App(done, term), mode, stats);
    return term;
  } else {
    throw "Definition '" + name + "' not found.";
  }
}

try {
  var stats = {rewrites: 0, loops: 0};
  var term = exec(name, mode, stats);
  console.log(fm.core.show(term));
  if (stats) console.log(JSON.stringify(stats));
} catch (e) {
  console.log(e.toString());
  console.log(e)
}
