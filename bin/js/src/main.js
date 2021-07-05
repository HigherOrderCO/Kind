#!/usr/bin/env -S node --stack-size=100000

var kind = require("./kind.js");
var fs = require("fs");
var fsp = require("fs").promises;
var path = require("path");
var exec = require("child_process").execSync;
var {fmc_to_js, fmc_to_hs} = require("formcore-js");
//var {fmc_to_js, fmc_to_hs} = require("./../../../../FormCoreJS");

// Locates the Kind/base dir and moves to it, or quits if it can't be found
var ADD_PATH = "";
function find_base_dir() {
  var full_path = process.cwd();
  var local_dir = fs.readdirSync(".");
  var kind_indx = full_path.toLowerCase().indexOf("/kind/base");
  if (kind_indx !== -1) {
    if (kind_indx + 10 !== full_path.length) {
      ADD_PATH = full_path.slice(kind_indx + 10).slice(1)+"/";
    }
    process.chdir(full_path.slice(0, kind_indx + 10));
  //} else if (local_dir.indexOf("kind") !== -1) {
    //process.chdir(path.join(full_path, "kind"));
    //find_base_dir();
  //} else if (local_dir.indexOf("Kind") !== -1) {
    //process.chdir(path.join(full_path, "Kind"));
    //find_base_dir();
  } else if (local_dir.indexOf("base") !== -1 && full_path.slice(-5).toLowerCase() === "/kind") {
    process.chdir(path.join(full_path, "base"));
    find_base_dir();
  //} else {
    //console.log("# Kind "+require("./../package.json").version);
    //console.log("Couldn't find Kind/base directory.\n");
    //console.log("Go to the directory to run Kind commands or clone the repository:");
    //console.log("  git clone https://github.com/uwu-tech/Kind");
    //console.log("New files must be added inside Kind/base directory.");
    //process.exit();
  }
};
find_base_dir();

// Finds all .kind files inside a directory, recursivelly
async function find_kind_files(dir) {
  try {
    var files = await fsp.readdir(dir);
    var found = [];
    for (let file of files) {
      var name = path.join(dir, file);
      var stat = await fsp.stat(name);
      if (stat.isDirectory()) {
        var child_found = await find_kind_files(name);
        for (let child_name of child_found) {
          found.push(child_name);
        }
      } else if (name.slice(-5) === ".kind") {
        found.push(name);
      }
    }
  } catch (e) {
    console.log("Not a directory: " + dir);
    process.exit();
  }
  return found;
}

// Converts a JS Array to a Kind list
function array_to_list(arr) {
  var list = {_: "List.nil"};
  for (var i = arr.length - 1; i >= 0; --i) {
    list = {_: "List.cons", head: arr[i], tail: list};
  }
  return list;
}

if (!process.argv[2] || process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log("# Kind "+require("./../package.json").version);
  console.log("");
  console.log("Usage:");
  console.log("");
  console.log("  kind Module/                  # type-checks a module");
  console.log("  kind Module/file.kind         # type-checks a file");
  console.log("  kind full_term_name --run     # runs a term using JavaScript");
  console.log("  kind full_term_name --run-scm # runs a term using Chez Scheme");
  console.log("  kind full_term_name --show    # prints a term");
  console.log("  kind full_term_name --norm    # prints a term's λ-normal form");
  console.log("  kind full_term_name --js      # compiles a term to JavaScript");
  console.log("  kind full_term_name --scm     # compiles a term to Chez Scheme");
  console.log("  kind full_term_name --fmc     # compiles a term to FormCore");
  console.log("");
  console.log("Examples:");
  console.log("");
  console.log("  # Run the 'Main' term (outputs 'Hello, world'):");
  console.log("  kind Main --run");
  console.log("");
  console.log("  # Type-check all files inside the 'Nat' module:");
  console.log("  kind Nat/");
  console.log("");
  console.log("  # Type-check the 'Nat/add.kind' file:");
  console.log("  kind Nat/add.kind");
  console.log("");
  console.log("  # Type-check the 'Nat.add' term:");
  console.log("  kind Nat.add");
  console.log("");
  console.log("  # Compile the 'Nat.add' term to JavaScript:");
  console.log("  kind Nat.add --js");
  console.log("");
  console.log("  # Print the λ-encoding of Nat:");
  console.log("  kind Nat --show");
  console.log("");
  console.log("  # Print the λ-normal form of 2 + 2:");
  console.log("  kind Example.two_plus_two --norm");
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
    console.log(await kind.run(kind["Kind.api.io.term_to_core"](name)));

  // JavaScript compilation
  } else if (process.argv[3] === "--js") {
    var module = process.argv[4] === "--module";
    try {
        var fmcc = await kind.run(kind["Kind.api.io.term_to_core"](name));
      try {
        console.log(fmc_to_js.compile(fmcc, name, {module}));
      } catch (e) {
        throw "Couldn't find or compile term: '" + name + "'.";
      }
    } catch (e) {
      display_error(name, e);
    }

  // JavaScript compilation
  } else if (process.argv[3] === "--scm") {
    var module = process.argv[4] === "--module";
    try {
      var scm = await kind.run(kind["Kind.api.io.term_to_scheme"](name));
      console.log(scm);
    } catch (e) {
      display_error(name, e);
    }

  // JavaScript execution
  } else if (process.argv[3] === "--run") {
    try {
      var fmcc = await kind.run(kind["Kind.api.io.term_to_core"](name));
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

  // Scheme execution
  } else if (process.argv[3] === "--run-scm") {
    try {
      var scm = await kind.run(kind["Kind.api.io.term_to_scheme"](name));
      var scm_path = ".kind.tmp.scm";
      try { fs.unlinkSync(scm_path); } catch (e) {};
      fs.writeFileSync(scm_path, scm);
      console.log(exec("scheme --script "+scm_path).toString().slice(0,-1));
      fs.unlinkSync(scm_path);
    } catch (e) {
      display_error(name, e);
    }

  // Lambda evaluation
  } else if (process.argv[3] === "--show") {
    try {
      await kind.run(kind["Kind.api.io.show_term"](name));
    } catch (e) {
      display_error(name, e);
    }

  // Lambda printing
  } else if (process.argv[3] === "--norm") {
    try {
      await kind.run(kind["Kind.api.io.show_term_normal"](name));
    } catch (e) {
      display_error(name, e);
    }

  // Haskell compilation
  //} else if (process.argv[3] === "--hs") {
    //var module = process.argv[4] === "--module" ? process.argv[5]||"Main" : null;
    //try {
      //var fmcc = await kind.run(kind["Kind.api.io.term_to_core"](name));
      //console.log(fmc_to_hs.compile(fmcc, name, {module}));
    //} catch (e) {
      //display_error(name, e);
    //}

  // Type-Checking
  } else {
    try {
      if (name[name.length - 1] === "/") {
        var files = await find_kind_files(path.join(process.cwd(), name));
        await kind.run(kind["Kind.api.io.check_files"](array_to_list(files)));
      } else if (name.slice(-5) !== ".kind") {
        await kind.run(kind["Kind.api.io.check_term"](name));
      } else if (name) {
        await kind.run(kind["Kind.api.io.check_file"](ADD_PATH + name));
      }
    } catch (e) {
      console.log("Sorry, KindJS couldn't handle your input. :( ");
      console.log("Try Haskell/Scheme releases!")
      console.log(e);
    }
  }
})();
