#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");
var BASE = "Base@6";

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var name = argv.filter(str => str[0] !== "-")[0] || "main";
  var args = {};
  argv.filter(str => str[0] === "-").map(str => str.slice(1)).join("").split("").forEach(c => args[c] = 1);
} catch (e) {
  if (e) console.log(e);
  console.log("Formality-Core");
  console.log("");
  console.log("Usage: fm [options] [args]");
  console.log("");
  console.log("Evaluation modes (default: -d):");
  console.log("-d <file>.<term> debug (using HOAS interpreter)");
  console.log("  -T don't erase types");
  console.log("  -B don't erase boxes");
  console.log("  -W stop on weak head normal form");
  console.log("-o <file>.<term> optimal (using interaction nets, lazy)");
  console.log("-O <file>.<term> optimal (using interaction nets, strict)");
  console.log("-j <file>.<term> JavaScript (using native functions)");
  console.log("");
  console.log("Type-checking modes:");
  console.log("-t <file>.<term> performs a type check");
  console.log("");
  console.log("FM-Lab:");
  console.log("-s <file> saves a file to FM-Lab"); 
  console.log("");
  console.log("Note:");
  console.log("- <file> is the file name, without '.fm'.");
  console.log("- <term> is the term name.");
  console.log("");
  console.log("Options:");
  console.log("-m disable logging");
  console.log("-z don't load base");
  console.log("-h hides interaction net stats");
  console.log("-u disables stratification (termination) checks");
  console.log("-p prints net as JSON");
  console.log("-v displays the version");
  process.exit();
}

if (args.v) {
  console.log(require("./package.json").version);
  process.exit();
} else if (args.S || args.s) {
  if (name.slice(-3) === ".fm") {
    name = name.slice(0, -3);
  }
  var file_code = fs.readFileSync(name + ".fm", "utf8");
  fm.lang.save_file(name, file_code)
    .then(file => {
      console.log("Saved file as `" + file + "`!")
      process.exit();
    })
    .catch(e => {
      console.log(e);
      process.exit();
    });

} else {

  (async () => {
    try {
      var mode
        = args.d ? "DEBUG"
        : args.o ? "OPTIMAL"
        : args.O ? "OPTIMAL"
        : args.j ? "JAVASCRIPT"
        : args.t ? "TYPE"
        : "DEBUG";
      var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

      var names = name.split(".");
      var file = names[0];
      var defn = names.length > 1 ? names.slice(1).join(".") : "main";
      var code = fs.readFileSync("./" + file + ".fm", "utf8");
      var defs = (await fm.lang.parse(!args.d ? "import " + BASE + " open; " + code : code)).defs;

      var stats = {
        rewrites: 0,
        loops: 0,
        max_len: 0,
        input_net: args.p ? null : undefined,
        output_net: args.p ? null : undefined
      };
      var opts = {
        boxcheck: !args.d,
        erased: !args.T,
        force_dup: !args.B,
        weak: !!args.W,
        strict: !!args.O,
        log: !args.m
      };
      var term = fm.lang.exec(defn, defs, mode, opts, stats);
      console.log(fm.lang.show(term));
      if (args.p || (mode.slice(0,3) === "OPT" && !args.h)) {
        console.log(JSON.stringify(stats));
      }
    } catch (e) {
      console.log(e.toString());
    }
  })();
}
