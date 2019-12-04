#!/usr/bin/env node --max-old-space-size=8192

var fs = require("fs");
var path = require("path");
var fm = require("./..");

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
  console.log("  -X don't erase types");
  console.log("  -B don't erase boxes");
  console.log("  -W stop on weak head normal form");
  console.log("  -0 don't normalize anything");
  console.log("-o <file>/<term> optimal (using interaction nets, lazy)");
  console.log("-O <file>/<term> optimal (using interaction nets, strict)");
  console.log("-j <file>/<term> JavaScript (using native functions)");
  console.log("");
  console.log("Type-checking modes:");
  console.log("-t <file>/<term> performs a type check");
  console.log("");
  console.log("Compilation modes:");
  console.log("-J <file>/<term> compiles to JavaScript code");
  console.log("");
  console.log("FPM:");
  console.log("-s <file> saves a file to FPM");
  console.log("-l <file> downloads a file from FPM");
  console.log("-i <file> shows list of FPM files that import <file>");
  console.log("");
  console.log("Options:");
  console.log("-f shows full names of references");
  console.log("-m disable logging");
  console.log("-h hides interaction net stats");
  console.log("-p prints net as JSON");
  console.log("-v displays the version");
  console.log("");
  console.log("Notes:");
  console.log("- <file> is the file name, without '.fm'.");
  console.log("- <term> is the term name.");
  console.log("- use @ instead of <term> to print all terms");
  process.exit();
}
// Create loader with local files for development and with fm_modules filesystem cache
let warned_about_dowloading = false

const with_download_warning = (loader) => async (file) => {
  if(!warned_about_dowloading) {
    console.log("Downloading files to `fm_modules`. This may take a while...");
    warned_about_dowloading = true;
  }

  return await loader(file)
}

const loader = [
  with_download_warning,
  fm.forall.with_file_system_cache,
  fm.forall.with_local_files
].reduce((loader, mod) => mod(loader), fm.forall.load_file)

async function local_imports_or_exit(file, code) {
  try {
    const {open_imports} = await fm.lang.parse(code, {file, tokenify: false, loader});
    return Object.keys(open_imports).filter((name) => name.indexOf("#") === -1)
  } catch (e) {
    console.log(e.toString());
    process.exit();
  }
}

async function upload(file, global_path = {}) {
  if (!global_path[file]) {
    var code = fs.readFileSync(file + ".fm", "utf8");

    const local_imports = await local_imports_or_exit(file, code);

    for (var imp_file of local_imports) {
      var g_path = await upload(imp_file, global_path);
      var [g_name, g_vers] = g_path.split("#");
      var code = code.replace(new RegExp("import " + imp_file + " *\n")  , "import " + g_name + "#" + g_vers + "\n");
      var code = code.replace(new RegExp("import " + imp_file + " *open"), "import " + g_name + "#" + g_vers + " open");
      var code = code.replace(new RegExp("import " + imp_file + " *as")  , "import " + g_name + "#" + g_vers + " as");
    }

    global_path[file] = await fm.forall.save_file(file, code);
    console.log("Saved `" + file + "` as `" + global_path[file] + "`!");
  }
  return global_path[file];
}

(async () => {
  if (args.v) {
    console.log(fm.lang.version);
    process.exit();

  } else if (args.i) {
    try {
      console.log((await fm.forall.load_file_parents(main)).map(file => "- " + file).join("\n"));
    } catch (e) {
      console.log("Couldn't load global file '" + main + "'.");
    }

  } else if (args.l) {
    console.log(fs.writeFileSync(main + ".fm", await fm.forall.load_file(main)));
    console.log("Downloaded file as `" + main + ".fm`!");

  } else if (args.S || args.s) {
    var file_name = main;
    if (file_name.slice(-3) === ".fm") {
      file_name = file_name.slice(0, -3);
    }
    upload(file_name).then(() => process.exit());

  } else {
    try {
      var BOLD = str => "\x1b[4m" + str + "\x1b[0m";

      var [file, name] = main.indexOf("/") === -1 ? [main, "main"] : main.split("/");
      try {
        var code = fs.readFileSync("./" + file + ".fm", "utf8");
      } catch(e) {
        console.log("Couldn't find local file `" + file + ".fm`.");
        process.exit();
      }
      var defs = (await fm.lang.parse(code, {file, tokenify: false, loader})).defs;

      if (args.J) {
        console.log(fm.to_js.compile_to_code(fm.lang.erase(defs[file+"/"+name]), {defs}));
        return;

      } else {
        var command
          = args.d ? "REDUCE_DEBUG"
          : args.o ? "REDUCE_OPTIMAL"
          : args.O ? "REDUCE_OPTIMAL"
          : args.j ? "REDUCE_NATIVE"
          : args.t ? "TYPECHECK"
          : args[0] ? "GET"
          : "REDUCE_DEBUG";

        var nams = [file + "/" + name];
        if (name === "@") {
          nams = Object.keys(defs).sort();
        }

        var opts = {
          erased: !args.X,
          unbox: !args.B,
          weak: !!args.W,
          strict: !!args.O,
          logging: !args.m,
          defs: defs
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
          opts.stats = stats;

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
                var term = fm.lang.run(command, nams[i], opts);
                var text = init + fm.lang.show(term, [], {full_refs: !!args.f});
                if (command === "TYPECHECK") {
                  if (fm.lang.haltcheck(defs[nams[i]], defs)) {
                    console.log("\x1b[32m" + text + " ✔\x1b[0m"); // Green
                  } else {
                    console.log("\x1b[33m" + text + " ⚠\x1b[0m"); // Green
                  }
                } else {
                  console.log(text);
                }
              } else {
                console.log(init + "Definition not found: " + nams[i]);
              }
            } catch (e) {
              if (nams.length > 1) {
                console.log("\x1b[31m" + init + "error\x1b[0m");
                console.log(e);
              } else {
                console.log(e);
                //console.log(e.toString());
              }
            }
            if (args.p || (command === "REDUCE_OPTIMAL" && !args.h)) {
              console.log(JSON.stringify(stats));
            }
          }

        }
      }
    } catch (e) {
      console.log(e);
      //console.log(e.toString());
    }
  }
})()
