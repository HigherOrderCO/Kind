var debug = true;
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
        if (debug) console.log(err);
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

function _fm_(main = "main", dir = ".", ext = ".fm", parse = fm.lang.parse, show = fm.lang.stringify, synth = fm.synt.typesynth, norm = fm.synt.normalize, silent = false) {
  if (!fs.existsSync(dir) && ext === ".fmc") dir = ".";

  var exit_code = main === "--github" ? 1 : 0;
  var {defs, files} = load(dir, ext, parse, exit_code);
  //var hols = {};

  // Normalizes and type-checks all terms
  if (!silent) console.log("\033[4m\x1b[1mType-checking:\x1b[0m");
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
      var {term,type} = synth(name, defs, show);
      if (!silent) console.log(show_name + ": \x1b[2m" + show(type) + "\x1b[0m");
    } catch (err) {
      if (debug) console.log(err);
      if (!silent) console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
      errors.push([name, err()]);
    }
  };
  if (!silent) console.log("");

  // If there are errors, prints them
  if (errors.length > 0) {
    if (!silent) console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
    for (var i = errors.length - 1; i >= 0; --i) {
      var err_msg = fm.lang.stringify_err(errors[i][1], files[errors[i][0]]);
      if (!silent) console.log("\n\x1b[1mInside \x1b[4m"+errors[i][0]+"\x1b[0m\x1b[1m:\x1b[0m");
      if (!silent) console.log(err_msg);
    };
  } else {
    if (!silent) console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
  };

  // If there is no error nor unresolved equation, write `.fmc` file
  // Right now, though, we're storing nat and string literals on .fmc files, even
  // though that isn't valid core, for the sake of keeping sizes sane. That means
  // that, to get actual core files, we need to parse with synt, then stringify
  // with synt.stringify, setting to_core=true.
  if (errors.length === 0 && ext === ".fm") {
    if (!fs.existsSync(".fmc")) fs.mkdirSync(".fmc");
    if (!fs.existsSync(".fml")) fs.mkdirSync(".fml");
    clear_dir(".fmc", ".fmc");
    clear_dir(".fml", ".fml");
    for (var name in defs) {
      var code = "";
      code += name + ": ";
      code += fm.synt.stringify(defs[name].core.type) + "\n  ";
      code += fm.synt.stringify(defs[name].core.term) + "\n\n";
      fs.writeFileSync(".fmc/"+name+".fmc", code);
    };
    for (var name in defs) {
      var code = "";
      code += name + ": ";
      code += fm.lang.stringify(defs[name].core.type) + "\n  ";
      code += fm.lang.stringify(defs[name].core.term) + "\n\n";
      fs.writeFileSync(".fml/"+name+".fml", code);
    };
  };

  // If user asked to evaluate main, do it
  if (!silent && defs[main]) {
    console.log("");
    console.log("\033[4m\x1b[1mEvaluating main:\x1b[0m");
    try {
      console.log(show(fm.synt.normalize(defs[main].core.term, defs, {}, true)));
    } catch (e) {
      if (debug) console.log(e);
      error("Error.", exit_code);
    }
  };

  // If there are errors or unresolved equations, exits with an error
  if (errors.length > 0) {
    error("", exit_code);
  }
};

function _fmc_(main = "main", dir) {
  _fm_(main, "./.fmc", ".fmc", fm.synt.parse, fm.synt.stringify, fm.core.typesynth, fm.core.normalize);
};

function _js_(main = "main", dir, ext, parse, show, synth, norm) {
  _fm_(main, dir, ext, parse, show, synth, norm, true);
  var {defs} = load("./.fmc", ".fmc", fm.synt.parse);
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
  var {defs} = load("./.fmc", ".fmc", fm.synt.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    eval(fm.tojs.compile(defs, main));
  };
};

function _x_(main = "main", dir, ext, parse) {
  var {defs} = load("./.fmc", ".fmc", fm.synt.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    var result = fm.optx.normalize(defs[main].term, defs);
    console.log(fm.synt.stringify(result.term));
    console.log(JSON.stringify(result.stats));
  };
};

module.exports = {load, _fm_, _fmc_, _io_, _js_, _hs_, _x_};
