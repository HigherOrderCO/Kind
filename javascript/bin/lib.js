var fs = require("fs");
var fm = require("./../Formality.js"); 
var path = require("path");
function error(msg, exit_code) {
  console.log(msg);
  process.exit(exit_code || 0);
};

function clear_dir(dir, ext) {
  var files = fs.readdirSync(dir);
  for (var file of files) {
    if (file.slice(-ext.length) === ext) {
      fs.unlinkSync(path.join(dir, file));
    }
  };
};

function load(dir = ".", ext = ".fm", parse = fm.lang.parse, exit_code = 0) {
  var files = fs.readdirSync(dir).filter(file => file.slice(-ext.length) === ext);
  if (files.length === 0) {
    error("No local " + ext + " file found.", exit_code);
  } else {
    var result = {files: {}, defs: {}};
    for (var file of files) {
      var file_code = fs.readFileSync(path.join(dir, file), "utf8");
      try {
        var parsed = parse(file_code,0);
        var file_defs = parsed.defs;
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

function _fm_(main = "main", dir = ".", ext = ".fm", parse = fm.lang.parse, show = fm.lang.stringify, check = fm.synt.typesynth, norm = fm.synt.normalize) {
  if (!fs.existsSync(dir) && ext === ".fmc") dir = ".";

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
      console.log(show_name + ": \x1b[2m" + show(type) + "\x1b[0m");
      synt[name] = {term, type};
    } catch (err) {
      console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
      errors.push([name, err()]);
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
  if (errors.length === 0 && ext === ".fm") {
    if (!fs.existsSync(".fmc")) fs.mkdirSync(".fmc");
    if (!fs.existsSync(".fml")) fs.mkdirSync(".fml");
    clear_dir(".fmc", ".fmc");
    clear_dir(".fml", ".fml");
    for (var name in synt) {
      var code = "";
      code += name + ": ";
      code += fm.synt.stringify(synt[name].type) + "\n  ";
      code += fm.synt.stringify(synt[name].term) + "\n\n";
      fs.writeFileSync(".fmc/"+name+".fmc", code);
    };
    for (var name in synt) {
      var code = "";
      code += name + ": ";
      code += fm.lang.stringify(synt[name].type) + "\n  ";
      code += fm.lang.stringify(synt[name].term) + "\n\n";
      fs.writeFileSync(".fml/"+name+".fml", code);
    };
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
  _fm_(main, "./.fmc", ".fmc", fm.core.parse, fm.core.stringify, fm.core.typecheck, fm.core.normalize);
};

function _js_(main = "main", dir, ext, parse) {
  var {defs} = load("./.fmc", ".fmc", fm.core.parse);
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
  var {defs} = load("./.fmc", ".fmc", fm.core.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    eval(fm.tojs.compile(defs, main));
  };
};

function _x_(main = "main", dir, ext, parse) {
  var {defs} = load("./.fmc", ".fmc", fm.core.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    var result = fm.optx.normalize(defs[main].term, defs);
    console.log(fm.core.stringify(result.term));
    console.log(JSON.stringify(result.stats));
  };
};

module.exports = {load, _fm_, _fmc_, _io_, _js_, _hs_, _x_};
