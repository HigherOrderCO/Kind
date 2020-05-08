var fs = require("fs");
var fm = require("./../Formality.js");

function error(msg, exit_code) {
  console.log(msg);
  process.exit(exit_code || 0);
};

function load(dir = ".", ext = ".fm", parse_defs = fm.lang.parse, exit_code = 0) {
  var files = fs.readdirSync(dir).filter(file => file.slice(-ext.length) === ext);
  if (files.length === 0) {
    error("No local " + ext + " file found.", exit_code);
  } else {
    var result = {files: {}, defs: {}};
    for (var file of files) {
      var file_code = fs.readFileSync(file, "utf8");
      try {
        var file_defs = parse_defs(file_code, 0, file);
      } catch (err) {
        error("\n\x1b[1mInside '\x1b[4m"+file+"\x1b[0m'"
             + "\x1b[1m:\x1b[0m\n" + err
             , exit_code);
      }
      for (var name in file_defs) {
        if (result.defs[name]) {
          error("Redefinition of '" + name + "' in '" + file + "'.", exit_code);
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
  var exit_code = main === "--github" ? 1 : 0;
  var {defs, files} = load(dir, ext, parse, exit_code);

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
      var type_typ = fm.core.typecheck(defs[name].type, fm.core.Typ(), defs, fm.lang.stringify);
      var term_typ = fm.core.typecheck(defs[name].term, defs[name].type, defs, fm.lang.stringify);
      console.log(show_name + " : " + fm.lang.stringify(term_typ));
    } catch (err) {
      console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
      errors.push([name, err]);
    }
  };
  console.log("");

  if (errors.length === 0) {
    var fmc_code = "";
    for (var name in defs) {
      fmc_code += name + ": ";
      fmc_code += fm.core.stringify(defs[name].type) + "\n  ";
      fmc_code += fm.core.stringify(defs[name].term) + "\n\n";
    };
    fs.writeFileSync(".fmc.", fmc_code);
    var fm_code = "";
    for (var name in defs) {
      fm_code += name + ": ";
      fm_code += fm.lang.stringify(defs[name].type) + "\n  ";
      fm_code += fm.lang.stringify(defs[name].term) + "\n\n";
    };
    fs.writeFileSync(".fm.", fm_code);
  };

  if (errors.length > 0) {
    console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
    for (var i = errors.length - 1; i >= 0; --i) {
      var err_msg = fm.lang.stringify_err(errors[i][1], files[errors[i][0]]);
      console.log("\n\x1b[1mInside \x1b[4m" + errors[i][0]
        + "\x1b[0m\x1b[1m:\x1b[0m\n" + err_msg);
    };
    error("", exit_code);
  } else {
    console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
  };

  if (defs[main]) {
    console.log("");
    console.log("\033[4m\x1b[1mEvaluating main:\x1b[0m");
    try {
      console.log(fm.lang.stringify(fm.core.normalize(defs[main].term, defs)));
    } catch (e) {
      error("Error.", exit_code);
    }
  };
};

function js(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    console.log(fm.comp.js(defs, main));
  };
};

function hs(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    console.log(fm.comp.hs(defs, main));
  };
};

function run(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ext, parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    eval(fm.comp.js(defs, main));
  };
};

module.exports = {load, report, run, js, hs, run};
