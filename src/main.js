#!/usr/bin/env node --max-old-space-size=8192

var fs = require("fs");
var path = require("path");
var fm = require("./..");

try {
  var argv = [].slice.call(process.argv, 2);
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") throw "";
  var main = argv.filter(str => str[0] !== "-")[0] || "main/main";
  var args = {};
  argv.filter(str => str[0] === "-")
      .map(str => str.slice(1))
      .join("")
      .split("")
      .forEach(c => args[c] = 1);
} catch (e) {
  if (e) console.log(e);
  console.log("Formality-Lang v" + fm.version);
  console.log("");
  console.log("Commands:");
  console.log("$ fm -d <file>/<term> | evaluates (debug-mode)");
  console.log("$ fm -o <file>/<term> | evaluates (optimal-mode)");
  console.log("$ fm -f <file>/<term> | evaluates (fast-mode)");
  //console.log("$ fm -c <file>/<term> | evaluates (fast-mode, C WASM)");
  //console.log("$ fm -e <file>/<term> | evaluates (fast-mode, EVM)");
  console.log("$ fm -t <file>/<term> | type-checks");
  console.log("$ fm -t <file>/@      | type-checks (all)");
  console.log("$ fm -j <file>/<term> | compiles to JS");
  console.log("$ fm -s <file>        | saves to FPM");
  console.log("$ fm -l <file>        | loads from FPM");
  console.log("$ fm -i <file>        | shows cited_by");
  console.log("$ fm -v <file>        | shows version");
  console.log("");
  console.log("Options:");
  console.log("-x don't erase types");
  console.log("-w stop on weak head normal form");
  console.log("-m disable logging");
  process.exit();
}

async function run_CLI() {

  //Print version
  if (args.v) {
    console.log(fm.version);
    process.exit();

  // Download file from FPM
  } else if (args.l) {
    var file_data = await fm.loader.load_file(main);
    console.log(fs.writeFileSync(main + ".fm", file_data));
    console.log("Downloaded file as `" + main + ".fm`!");

  // Save file to FPM
  } else if (args.S || args.s) {
    var file_name = main;
    if (file_name.slice(-3) === ".fm") {
      file_name = file_name.slice(0, -3);
    }
    upload(file_name).then(() => process.exit());

  // Show file cited_by
  } else if (args.i) {
    try {
      var cited_by = await fm.loader.load_file_parents(main);
      console.log(cited_by.map(file => "- " + file).join("\n"));
    } catch (e) {
      console.log("Couldn't load global file '" + main + "'.");
    }

  // Compile to JavaScript
  } else if (args.j) {
    var {name, defs} = await load_code();
    var term = defs[name];
    var term = fm.core.erase(term);
    var code = fm.js.compile(term, defs);
    console.log(code);
  
  // Evaluates on debug mode
  } else if (args.d) {
    var {name, defs} = await load_code();
    var term = defs[name];
    var term = !args.x ? fm.core.erase(term) : term;
    var opts = {defs, weak: args.w, logs: !!args.m};
    var term = fm.core.reduce(term, defs,opts);
    console.log(fm.lang.show(term));

  // Evaluates on fast mode
  } else if (args.f) {
    var {name, defs} = await load_code();
    var {rt_defs, rt_rfid} = fm.fast.compile(defs);
    var rt_term = rt_defs[rt_rfid[name]];
    //const ctor_of = ptr => ptr & 0b1111;
    //const addr_of = ptr => ptr >>> 4;
    var {rt_term,stats} = fm.fast.reduce(rt_term, rt_defs);
    var term = fm.fast.decompile(rt_term);
    console.log(fm.lang.show(term));
    console.log(JSON.stringify(stats));

  // Evaluates on fast mode (WASM)
  //} else if (args.c) {
    //var {name, defs} = await load_code();
    //var {rt_defs, rt_rfid} = fm.fast.compile(defs);
    //var {rt_term, stats} = fm.wasm.reduce(Object.values(rt_defs), rt_rfid[name]);
    //var term = fm.fast.decompile(rt_term);
    //console.log(fm.lang.show(term));
    //console.log(JSON.stringify(stats));

  // Evaluates on fast mode (EVM)
  //} else if (args.e) {
    //var {name, defs} = await load_code();
    //var {rt_defs, rt_rfid} = fm.fast.compile(defs);
    //var {rt_term, stats} = fm.evm.reduce(Object.values(rt_defs), rt_rfid[name]);
    //var term = fm.fast.decompile(rt_term);
    //console.log(fm.lang.show(term));
    //console.log(JSON.stringify(stats));

  // Evaluates on optimal mode
  } else if (args.o) {
    var {name, defs} = await load_code();
    var net = fm.optimal.compile(fm.core.Ref(name), defs);
    var stats = {loops:0, rewrites:0, max_len:0};
    net.reduce_lazy(stats);
    var term = fm.optimal.decompile(net);
    console.log(fm.lang.show(term));
    console.log(JSON.stringify(stats));

  // Type-checks
  } else if (args.t) {
    var {name, defs} = await load_code();
    var all = name === "@";
    var names = all ? Object.keys(defs).sort() : [name];
    names.forEach((name) => {
      try {
        var right = (x) => "\x1b[32m" + x + " ✔\x1b[0m";
        var maybe = (x) => "\x1b[33m" + x + " ?\x1b[0m";
        var wrong = (x) => "\x1b[31m" + x + " ✗\x1b[0m";
        var opts = {logs: !args.m};
        var head = all ? "- " + name + " : " : "";
        var type = fm.core.typecheck(name, null, defs, opts);
        var affi = fm.core.is_affine(fm.core.Ref(name), defs);
        //var elem = fm.core.is_elementary(fm.core.Ref(name), defs);
        var halt = fm.core.is_terminating(fm.core.Ref(name), defs);
        var str = "\x1b[32m" + head + fm.lang.show(type) + " ✔\x1b[0m";
        str += " | " + (affi ? right : wrong)("affine") + " | ";
        str += (affi ? right : maybe)("elementary") + " | ";
        str += (halt ? right : maybe)("terminating");
        console.log(str);
      } catch (e) {
        if (!all) {
          console.log(e);
          process.exit(1);
        } else {
          console.log("\x1b[31m" + head + "error\x1b[0m");
        }
      }
    });
  } else {
    console.log("Command not found. Type `fm` for help.");
  }
};

// Create loader with local files for development and with fm_modules filesystem cache
let warned_about_dowloading = false;
const with_download_warning = (loader) => async (file) => {
  if (!warned_about_dowloading) {
    console.log("Downloading files to `fm_modules`. This may take a while...");
    warned_about_dowloading = true;
  };
  return await loader(file);
}

const loader = [
  with_download_warning,
  fm.loader.with_file_system_cache,
  fm.loader.with_local_files
].reduce((loader, mod) => mod(loader), fm.loader.load_file)

async function local_imports_or_exit(file, code) {
  try {
    const {open_imports} = await fm.lang.parse(code, {file, tokenify: false, loader});
    return Object.keys(open_imports).filter((name) => name.indexOf("#") === -1)
  } catch (e) {
    console.log(e.toString());
    process.exit(1);
  }
};

// TODO: this doesn't properly replace local refs. Improve.
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

    global_path[file] = await fm.loader.save_file(file, code);
    console.log("Saved `" + file + "` as `" + global_path[file] + "`!");
  }
  return global_path[file];
};

// Loads a file, parses it, returns term name and defs
async function load_code() {
  var [file, name] = main.indexOf("/") === -1 ? [main, "main"] : main.split("/");

  try {
    var code = fs.readFileSync("./" + file + ".fm", "utf8");
  } catch(e) {
    console.log("Couldn't find local file `" + file + ".fm`.");
    process.exit(1);
  }

  try {
    var defs = (await fm.lang.parse(code, {file, tokenify: false, loader})).defs;
    if (name !== "@" && !defs[file+"/"+name]) {
      throw "Definition not found: `" + file + "/" + name + "`.";
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  var name = name === "@" ? "@" : file + "/" + name;

  return {name, defs};
};

// Runs CLI
run_CLI();
