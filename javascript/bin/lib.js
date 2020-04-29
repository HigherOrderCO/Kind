var fs = require("fs");
var fmc = require("./../FormalityCore.js");
var cmp = require("./../Compiler.js");

function load(dir = ".", ext = ".fmc", parse_defs = fmc.parse_defs, must_throw_error) {
  var files = fs.readdirSync(dir).filter(file => file.slice(-ext.length) === ext);
  if (files.length === 0) {
    console.log("No local " + ext + " file found.");
    if (must_throw_error){
      process.exit(1);
    } else {
      process.exit();
    } 
  } else {
    var result = {files: {}, defs: {}};
    for (var file of files) {
      var file_code = fs.readFileSync(file, "utf8");
      try {
        var file_defs = parse_defs(file_code, 0, file);
      } catch (err) {
        console.log("\n\x1b[1mInside '\x1b[4m"+file+"\x1b[0m'"
                  + "\x1b[1m:\x1b[0m\n" + err);
        //console.log(err);
        if (must_throw_error){
          process.exit(1);
        } else {
          process.exit();
        }
      }
      for (var name in file_defs) {
        if (result.defs[name]) {
          console.log("Redefinition of '" + name + "' in '" + file + "'.");
          if (must_throw_error){
            process.exit(1);
          } else {
            process.exit();
          }
        } else {
          result.defs[name] = file_defs[name];
          result.files[name] = file_code;
        }
      }
    }
  }
  return result;
};

function report(main = "main", dir, ext, parse) {
  const must_throw_error = process.argv[2] === "--github";

  var {defs, files} = load(dir, ext, parse, must_throw_error);

  // Normalizes and type-checks all terms
  console.log("\033[4m\x1b[1mType-checking:\x1b[0m");
  var errors = [];
  var max_len = 0;
  for (var name in defs) {
    max_len = Math.max(name.length, max_len);
  };
  for (var name in defs) {
    var show_name = name;
    while (show_name.length < max_len) {
      show_name = show_name + " ";
    }
    try {
      console.log(show_name + " : " + fmc.stringify(fmc.typecheck(defs[name].term, defs[name].type, defs)));
    } catch (err) {
      console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
      errors.push([name, err]);
    }
  };
  console.log("");

  if (errors.length > 0) {
    console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
    for (var i = errors.length - 1; i >= 0; --i) {
      var err_msg = fmc.stringify_err(errors[i][1], files[errors[i][0]]);
      console.log("\n\x1b[1mInside \x1b[4m" + errors[i][0]
        + "\x1b[0m\x1b[1m:\x1b[0m\n" + err_msg);
      if (must_throw_error){
        process.exit(1);
      }
    };
  } else {
    console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
  };

  if (defs[main]) {
    console.log("");
    console.log("\033[4m\x1b[1mEvaluating `main`:\x1b[0m");
    try {
      console.log(fmc.stringify(fmc.normalize(defs[main].term, defs)));
    } catch (e) {
      console.log("Error.");
      if (must_throw_error){
        process.exit(1);
      }
    }
  };
};

function js(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
    if (must_throw_error){
      process.exit(1);
    }
  } else {
    console.log(cmp.js(defs, main));
  };
};

function hs(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
    if (must_throw_error){
      process.exit(1);
    }
  } else {
    console.log(cmp.hs(defs, main));
  };
};

function run(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
    if (must_throw_error){
      process.exit(1);
    }
  } else {
    eval(cmp.js(defs, main));
  };
};

module.exports = {load, report, run, js, hs, run};
