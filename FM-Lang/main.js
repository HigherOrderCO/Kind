#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var fm = require(".");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help") throw "";
  var main = argv.filter(str => str[0] !== "-")[0] || "main/main";
  var args = {};
  argv.filter(str => str[0] === "-").map(str => str.slice(1)).join("").split("").forEach(c => args[c] = 1);
} catch (e) {
  if (e) console.log(e);
  console.log("Formality");
  console.log("");
  console.log("Usage: fm [options] [args]");
  console.log("");
  console.log("Evaluation modes (default: -d):");
  console.log("-d <file>/<term> debug (using HOAS interpreter)");
  console.log("  -T don't erase types");
  console.log("  -B don't erase boxes");
  console.log("  -W stop on weak head normal form");
  console.log("-o <file>/<term> optimal (using interaction nets, lazy)");
  console.log("-O <file>/<term> optimal (using interaction nets, strict)");
  console.log("-j <file>/<term> JavaScript (using native functions)");
  console.log("");
  console.log("Type-checking modes:");
  console.log("-t <file>/<term> performs a type check");
  console.log("");
  console.log("FM-Lab:");
  console.log("-s <file> saves a file to FM-Lab"); 
  console.log("");
  console.log("Note:");
  console.log("- <file> is the file name, without '.fm'.");
  console.log("- <term> is the term name.");
  console.log("");
  console.log("Options:");
  console.log("-f shows full names of references");
  console.log("-m disable logging");
  console.log("-h hides interaction net stats");
  console.log("-u disables stratification (termination) checks");
  console.log("-p prints net as JSON");
  console.log("-v displays the version");
  console.log("use @ instead of <term> to print all terms");
  process.exit();
}

async function upload(file, global_path = {}) {
  if (!global_path[file]) {
    var code = fs.readFileSync(file + ".fm", "utf8");

    try {
      var local_imports = (await fm.lang.parse(file, code)).local_imports;
    } catch (e) {
      console.log(e.toString());
      process.exit();
    }
    //console.log(file, local_imports);

    for (var imp_file in local_imports) {
      var g_path = await upload(imp_file, global_path);
      var [g_name, g_vers] = g_path.split("@");
      //console.log(file, "replace", "`import " + imp_file + " *`", "by", "`import " + g_name + "@" + g_vers + " as " + imp_file + "`");
      var code = code.replace(new RegExp("import " + imp_file + " *\n")  , "import " + g_name + "@" + g_vers + " as " + imp_file + "\n");
      var code = code.replace(new RegExp("import " + imp_file + " *open"), "import " + g_name + "@" + g_vers + " open");
      var code = code.replace(new RegExp("import " + imp_file + " *as")  , "import " + g_name + "@" + g_vers + " as");
    }

    global_path[file] = await fm.lang.save_file(file, code);
    console.log("Saved `" + file + "` as `" + global_path[file] + "`!");
  }
  return global_path[file];
}

if (args.v) {
  console.log(require("./package.json").version);
  process.exit();
} else if (args.S || args.s) {
  var file_name = main;
  if (file_name.slice(-3) === ".fm") {
    file_name = file_name.slice(0, -3);
  }
  upload(file_name).then(() => process.exit());

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

      var [file, name] = main.indexOf("/") === -1 ? [main, "main"] : main.split("/");
      try {
        var code = fs.readFileSync("./" + file + ".fm", "utf8");
      } catch(e) {
        console.log("Couldn't find local file `" + file + ".fm`.");
        process.exit();
      }
      var defs = (await fm.lang.parse(file, code)).defs;

      var nams = [file + "/" + name];
      if (name === "@") {
        nams = Object.keys(defs).sort();
      }

      var opts = {
        boxcheck: !args.u,
        erased: !args.T,
        unbox: !args.B,
        weak: !!args.W,
        strict: !!args.O,
        logging: !args.m
      };

      var nam_size = 0;
      for (var def in defs) {
        if (def[0] !== "$" && def[0] !== "@") {
          nam_size = Math.max(nam_size, def.length);
        }
      }

      for (var i = 0; i < nams.length; ++i) {
        var stats = {
          rewrites: 0,
          loops: 0,
          max_len: 0,
          input_net: args.p ? null : undefined,
          output_net: args.p ? null : undefined
        };

        if (nams[i][0] !== "$" && nams[i][0] !== "@") {
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
            if (defs[nams[i]]) {
              var term = fm.lang.exec(nams[i], defs, mode, opts, stats);
              console.log(init + fm.lang.show(term, [], {shorten_refs: !args.f}));
            } else {
              console.log(init + "Definition not found: " + nams[i]);
            }
          } catch (e) {
            if (nams.length > 1) {
              console.log("\x1b[31m" + init + "error\x1b[0m");
            } else {
              console.log(e);
              //console.log(e.toString());
            }
          }
          if (args.p || (mode.slice(0,3) === "OPT" && !args.h)) {
            console.log(JSON.stringify(stats));
          }
        }

      }
    } catch (e) {
      console.log(e);
      //console.log(e.toString());
    }
  })();
}
