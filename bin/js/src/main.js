#!/usr/bin/env node

var kind = require("./kind.js");
var fs = require("fs");
var path = require("path");
var {fmc_to_js, fmc_to_hs} = require("formcore-js");
//var {fmc_to_js, fmc_to_hs} = require("./../../../../FormCoreJS");

function find_kind_dir() {
  var full_path = process.cwd();
  var local_dir = fs.readdirSync(".");
  var kind_indx = full_path.toLowerCase().indexOf("/kind/base");
  if (kind_indx !== -1) {
    process.chdir(full_path.slice(0, kind_indx + 10));
  } else if (local_dir.indexOf("kind") !== -1) {
    process.chdir(path.join(full_path, "kind"));
    find_kind_dir();
  } else if (local_dir.indexOf("Kind") !== -1) {
    process.chdir(path.join(full_path, "Kind"));
    find_kind_dir();
  } else if (local_dir.indexOf("base") !== -1) {
    process.chdir(path.join(full_path, "base"));
    find_kind_dir();
  } else {
    console.log("Couldn't find Kind's repository. Please, clone it with:");
    console.log("");
    console.log("  git clone https://github.com/uwu-tech/Kind");
    console.log("");
    console.log("And add your files to the Kind/base directory.");
    process.exit();
  }
};
find_kind_dir();

if (!process.argv[2] || process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log("# Kind "+require("./../package.json").version);
  console.log("");
  console.log("Usage:");
  console.log("");
  console.log("  kind <file>       # type-checks a file");
  console.log("  kind <main> --run # evaluates a term");
  console.log("  kind <main> --fmc # compiles a term to FormCore");
  console.log("  kind <main> --js  # compiles a term to JavaScript");
  console.log("  kind <main> --hs  # compiles a term to Haskell");
  console.log("");
  console.log("Examples:");
  console.log("");
  console.log("  # Check all types inside a file:");
  console.log("  kind example.kind");
  console.log("");
  console.log("  # Check all files inside a directory:");
  console.log("  kind _");
  console.log("");
  console.log("  # Compile to JS, with 'main' as the entry point:");
  console.log("  kind main --js");
  console.log("");
  process.exit();
}

function is_file(name){
  return name.slice(-5) === ".kind"
}

function display_error(name, error){
  if(is_file(name)){
    console.log("Cannot compile a file (<main>.kind). Choose a term and try again.");
  } else {
    console.log("Compilation error.");
    console.log(error);
  }
}

(async () => {
  var name = process.argv[2];

  // FormCore compilation
  if (process.argv[3] === "--fmc") {
    console.log(await kind.run(kind["Kind.to_core.io.one"](name)));

  // JavaScript compilation
  } else if (process.argv[3] === "--js") {
    var module = process.argv[4] === "--module";
    try {
        var fmcc = await kind.run(kind["Kind.to_core.io.one"](name));
      try {
        console.log(fmc_to_js.compile(fmcc, name, {module}));
      } catch (e) {
        throw "Couldn't find or compile term: '" + name + "'.";
      }
    } catch (e) {
      display_error(name, e);
    }

  // JavaScript execution
  } else if (process.argv[3] === "--run") {
    try {
      var fmcc = await kind.run(kind["Kind.to_core.io.one"](name));
      try {
        var asjs = fmc_to_js.compile(fmcc, name, {});
      } catch (e) {
        throw "Couldn't find or compile term: '" + name + "'.";
      }
      var js_path = ".kind.tmp.js";
      try { fs.unlinkSync(js_path); } catch (e) {};
      fs.writeFileSync(js_path, asjs);
      require(path.join(process.cwd(),js_path));
      fs.unlinkSync(js_path);
    } catch (e) {
      display_error(name, e);
    }

  // Lambda evaluation
  } else if (process.argv[3] === "--lam") {
    try {
      await kind.run(kind["Kind.compute.io.one"](name));
    } catch (e) {
      display_error(name, e);
    }

  // Haskell compilation
  } else if (process.argv[3] === "--hs") {
    var module = process.argv[4] === "--module" ? process.argv[5]||"Main" : null;
    try {
      var fmcc = await kind.run(kind["Kind.to_core.io.one"](name));
      console.log(fmc_to_hs.compile(fmcc, name, {module}));
    } catch (e) {
      display_error(name, e);
    }

  // Type-Checking
  } else {
    if (name === "_") {
      var files = fs.readdirSync(".").filter(x => x.slice(-5) === ".kind");
      for (var file of files) {
        console.log("\x1b[1mChecking ", file, "\x1b[0m\n");
        kind.run(kind["Kind.checker.io.file"](file));
        console.log("");
      }
    } else if (name.slice(-5) !== ".kind") {
      kind.run(kind["Kind.checker.io.one"](name));
    } else if (name) {
      kind.run(kind["Kind.checker.io.file"](name));
    }
  }
})();
