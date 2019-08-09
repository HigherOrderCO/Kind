#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");
var BASE = "Base@12";

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
  console.log("use @ instead of <term> to print all terms");
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
      var code = fs.readFileSync("./" + file + ".fm", "utf8");
      var defs = (await fm.lang.parse(BASE && !args.d ? "import " + BASE + " open; " + code : code)).defs;
      var nams = names.length > 1 ? [names.slice(1).join(".")] : ["main"];
      if (nams.length === 1 && nams[0] === "@") {
        nams = Object.keys(defs).sort();
      }
      if (nams.length === 1 && !defs[nams[0]]) {
        throw "No definition for `" + nams[0] + "`.";
      }

      var opts = {
        boxcheck: !args.u,
        erased: !args.T,
        unbox: !args.B,
        weak: !!args.W,
        strict: !!args.O,
        logging: !args.m
      };

      for (var i = 0; i < nams.length; ++i) {
        var stats = {
          rewrites: 0,
          loops: 0,
          max_len: 0,
          input_net: args.p ? null : undefined,
          output_net: args.p ? null : undefined
        };

        var nam_size = 0;
        for (var def in defs) {
          if (def[0] !== "$" && def[0] !== "@") {
            nam_size = Math.max(nam_size, def.length);
          }
        }

        if (nams[i][0] !== "$" && nams[i][0] !== "@" && defs[nams[i]]) {
          if (nams.length > 1) {
            var init = nams[i];
            while (init.length < nam_size) {
              init += " ";
            }
            init += " : ";
          } else {
            var init = "";
          }
          try {
            var term = fm.lang.exec(nams[i], defs, mode, opts, stats);
            console.log(init + fm.lang.show(term));
          } catch (e) {
            if (nams.length > 1) {
              console.log("\x1b[31m" + init + "error\x1b[0m");
            } else {
              console.log(e.toString());
            }
          }
          if (args.p || (mode.slice(0,3) === "OPT" && !args.h)) {
            console.log(JSON.stringify(stats));
          }
        }

      }
    } catch (e) {
      console.log(e.toString());
    }
  })();
}
