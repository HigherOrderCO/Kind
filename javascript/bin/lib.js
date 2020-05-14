var fs = require("fs");
var fm = require("./../Formality.js"); 
function error(msg, exit_code) {
  console.log(msg);
  process.exit(exit_code || 0);
};

function load(dir = ".", ext = ".fm", parse = fm.lang.parse, exit_code = 0) {
  var files = fs.readdirSync(dir).filter(file => file.slice(-ext.length) === ext);
  if (files.length === 0) {
    error("No local " + ext + " file found.", exit_code);
  } else {
    var result = {files: {}, defs: {}};
    for (var file of files) {
      var file_code = fs.readFileSync(file, "utf8");
      try {
        var file_defs = parse(file_code, 0, file);
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

function _fm_(main = "main", dir, ext, parse = fm.lang.parse, show = fm.lang.stringify, check = fm.synt.typesynth, norm = fm.synt.normalize) {
  var exit_code = main === "--github" ? 1 : 0;
  var {defs, files} = load(dir, ext, parse, exit_code);
  var synt = {};
  //var hols = {};

  // Normalizes and type-checks all terms
  console.log("\033[4m\x1b[1mType-checking:\x1b[0m");
  var errors = [];
  //var max_len = 0;
  //for (var name in defs) {
    //max_len = Math.max(name.length, max_len);
  //};
  for (var name in defs) {
    var show_name = name;
    //while (show_name.length < max_len) {
      //show_name = show_name + " ";
    //}
    try {
      var {term,type} = check(defs[name].term, defs[name].type, defs, show);
      console.log(show_name + ": \x1b[2m" + show(defs[name].type) + "\x1b[0m");
      synt[name] = {term, type};
    } catch (err) {
      if (typeof err === "function") err = err();
      console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
      errors.push([name, err]);
    }
  };
  console.log("");

  // If there are errors, prints them
  if (errors.length > 0) {
    console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
    for (var i = errors.length - 1; i >= 0; --i) {
      var err_msg = fm.lang.stringify_err(errors[i][1], files[errors[i][0]]);
      console.log("\n\x1b[1mInside \x1b[4m"+errors[i][0]+"\x1b[0m\x1b[1m:\x1b[0m");
      console.log(err_msg);
    };
  } else {
    console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
  };

  // If there is no error nor unresolved equation, write `.fmc` file
  if (errors.length === 0) {
    var fmc_code = "";
    for (var name in synt) {
      fmc_code += name + ": ";
      fmc_code += fm.synt.stringify(synt[name].type) + "\n  ";
      fmc_code += fm.synt.stringify(synt[name].term) + "\n\n";
    };
    fs.writeFileSync(".fmc", fmc_code);
    var fm_code = "";
    for (var name in synt) {
      fm_code += name + ": ";
      fm_code += fm.lang.stringify(synt[name].type) + "\n  ";
      fm_code += fm.lang.stringify(synt[name].term) + "\n\n";
    };
    fs.writeFileSync(".fml", fm_code);
  };

  // If user asked to evaluate main, do it
  if (synt[main]) {
    console.log("");
    console.log("\033[4m\x1b[1mEvaluating main:\x1b[0m");
    try {
      console.log(show(fm.synt.normalize(synt[main].term, synt, {}, true)));
    } catch (e) {
      error("Error.", exit_code);
    }
  };

  // If there are errors or unresolved equations, exits with an error
  if (errors.length > 0) {
    error("", exit_code);
  }
};

function _fmc_(main = "main", dir) {
  _fm_(main, dir, ".fmc", fm.core.parse, fm.core.stringify, fm.core.typecheck, fm.core.normalize);
};

function _js_(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ".fmc", fm.core.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    console.log(fm.tojs.compile(defs, main));
  };
};

function _hs_(main = "main", dir, ext, parse) {
  console.log("Temporarily disabled.");
  process.exit();
  //var {defs} = load(dir, ".fmc", fm.core.parse);
  //if (!defs[main]) {
    //console.log("Term '" + main + "' not found.");
  //} else {
    //console.log(fm.comp.hs(defs, main));
  //};
};

function _io_(main = "main", dir, ext, parse) {
  var {defs} = load(dir, ".fmc", fm.core.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    eval(fm.tojs.compile(defs, main));
  };
};

module.exports = {load, _fm_, _fmc_, _io_, _js_, _hs_};
