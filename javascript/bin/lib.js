var DEBUG = false;
var fs = require("fs");
var fm = require("./../index.js");
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

function load(main = null, dir = ".", ext = ".fm", parse = fm.lang.parse, exit_code = 0) {
  // When main is "file.fm", loads one file
  if (main.slice(-ext.length) === ext) {
    files = [main];
  // When main is a name, loads mother file
  } else if (typeof main === "string" && main !== "") {
    var words = main.split(".");
    while (words.length > 0 && !fs.existsSync(words.join(".")+".fm")) {
      words = words.slice(0,-1);
    }
    files = [words.join(".")+".fm"];
    // If we didn't find the right file, load everything
    if (!fs.existsSync(files[0])) {
      files = fs.readdirSync(dir).filter(file => file.slice(-ext.length) === ext && file !== ext);
    }
  }

  if (files.length === 0) {
    error("No local " + ext + " file found.", exit_code);
  } else {
    var defs = {};
    for (var file of files) {
      var file_code = fs.readFileSync(path.join(dir, file), "utf8");
      try {
        var parsed = parse(file_code,0);
        var file_defs = parsed.defs;
      } catch (err) {
        if (DEBUG) console.log(err);
        error("\n\x1b[1mInside '\x1b[4m"+file+"\x1b[0m'"
             + "\x1b[1m:\x1b[0m\n" + err
             , exit_code);
      }
      for (var name in file_defs) {
        if (defs[name]) {
          error("Redefinition of '" + name + "' in '" + file + "'.", exit_code);
        } else {
          defs[name] = file_defs[name];
          defs[name].file = file;
          defs[name].code = file_code;
        }
      }
    }
  }
  return defs;
};

async function _run_(
  main   = null,
  dir    = ".",
  ext    = ".fm",
  parse  = fm.lang.parse,
  show   = fm.lang.stringify,
  fsynth = fm.load.load_synth,
  norm   = fm.synt.normalize,
  silent = false
) {
  var exit_code = main === "--github" ? 1 : 0;
  var defs = load(main, dir, ext, parse, exit_code);

  // Normalizes and type-checks all terms
  if (!silent) console.log("\033[4m\x1b[1mType-checking:\x1b[0m");
  var errors = [];
  fm.synt.clear_hole_logs();
  for (var name in defs) {
    var file = defs[name].file;
    if (main.slice(-ext.length) === ext && file !== main) {
      continue;
    }
    try {
      var {term, type} = await fsynth({
        name,
        defs,
        show,
        on_dependency: name => {
          console.log("... downloading http://moonad.org/c/"+name);
        },
      });
      var prefix = file.slice(0,-ext.length);
      if (prefix !== "global" && name.slice(0,prefix.length) !== prefix) {
        throw () => "Name '"+name+"' doesn't start with '"+prefix+"' inside '"+file+"'.\n"
      }
      if (!silent) {
        console.log(name + ": \x1b[2m" + show(type) + "\x1b[0m");
      }
    } catch (err) {
      if (DEBUG) {
        console.log(err);
      }
      if (!silent) {
        console.log(name + ": " + "\x1b[31merror\x1b[0m");
      }
      if (typeof err === "function") {
        errors.push([name, err()]);
      } else {
        errors.push([name, "Internal error."]);
      };
    }
  };
  if (!silent) console.log("");

  // If there are errors, prints them
  if (errors.length > 0) {
    var omitted = 0;
    if (!silent) console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m\n");
    for (var i = errors.length - 1; i >= 0; --i) {
      var err_msg = fm.lang.stringify_err(errors[i][1], defs[errors[i][0]].code);
      if (err_msg.indexOf("Inside ref") === -1) {
        if (!silent) console.log("\x1b[1mInside \x1b[4m"+errors[i][0]+"\x1b[0m\x1b[1m:\x1b[0m");
        if (!silent) console.log(err_msg);
      } else {
        omitted++;
      }
    };
    if (omitted > 0) {
      if (!silent) console.log("\033[4m\x1b[1m"+omitted+" indirect errors omitted.\x1b[0m");
    }
  } else {
    if (!silent) console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
  };

  // If there are hole errors, prints them
  var hole_logs_len = Object.keys(fm.synt.HOLE_LOGS).length;
  if (!silent && hole_logs_len > 0) {
    console.log("\033[4m\x1b[1mFound " + hole_logs_len + " hole(s):\x1b[0m");
    for (var hole in fm.synt.HOLE_LOGS) {
      console.log("");
      console.log(fm.synt.HOLE_LOGS[hole]);
    };
  };

  // If user asked to evaluate main, do it
  if (!silent && main && defs[main] && defs[main].core) {
    console.log("");
    console.log("\033[4m\x1b[1mReducing '"+main+"':\x1b[0m");
    try {
      console.log(show(fm.synt.normalize(defs[main].core.term, defs, {}, true)));
    } catch (e) {
      if (DEBUG) console.log(e);
      error("Error.", exit_code);
    }
  };

  // If there are errors or unresolved equations, exits with an error
  if (!silent && errors.length > 0) {
    error("", exit_code);
  }

  // Returns core defs
  if (errors.length === 0) {
    var core_defs = {};
    for (var def in defs) {
      core_defs[def] = defs[def].core;
    };
    return core_defs;
  } else {
    return defs;
  }
};

async function _fm_(main = "main") {
  return await _run_(main);
}

async function _fmc_(main = "main") {
  // Since we're storing fm-synt nat/string literals on .fmc files, in order to
  // get proper core terms, we parse .fmc using fm.synt and then convert to core
  function parse(code) {
    var {defs} = fm.synt.parse(code);
    for (var def in defs) {
      defs[def].term = fm.core.parse(fm.synt.stringify(fm.synt.canonicalize(defs[def].term, {}, true)), 0, "term");
      defs[def].type = fm.core.parse(fm.synt.stringify(fm.synt.canonicalize(defs[def].type, {}, true)), 0, "term");
    };
    return {defs};
  };
  await _run_(main, ".", ".fmc", parse, fm.core.stringify, fm.synt.typesynth, fm.synt.normalize);
};

async function _fms_(main = "main") {
  await _run_(main, ".", ".fmc", fm.synt.parse, fm.synt.stringify, fm.synt.typesynth, fm.synt.normalize);
};

async function _fm2js_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  //var {defs} = load("./.fmc", ".fmc", fm.synt.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    try {
      console.log(fm.tojs.compile(main, defs));
    } catch (e) {
      console.log("Can't compile ill-typed program.");
    }
  };
};

async function _io_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  //var {defs} = load("./.fmc", ".fmc", fm.synt.parse);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    try {
      eval(fm.tojs.compile(main, defs));
    } catch (e) {
      console.log("Can't run ill-typed program.");
    }
  };
};

async function _opt_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    var result = fm.optx.normalize(main, defs);
    console.log(fm.synt.stringify(result.term));
    console.log(JSON.stringify(result.stats));
  };
};

async function _fast_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    var result = fm.fast.normalize(main, defs);
    console.log(fm.synt.stringify(result.term));
    console.log(JSON.stringify(result.stats));
  };
};

async function _fm2evm_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  if (!defs[main]) {
    console.log("Term '" + main + "' not found.");
  } else {
    var result = fm.toev.compile(main, defs);
    console.log(result);
  };
};

// TODO: untested
async function _evm2fm_(bytes) {
  var buffer = Buffer.from(bytes, "hex");
  console.log(fm.lang.stringify(fm.toev.decompile(buffer)));
};

async function _fm2fmc_(main = "main", dir, ext, parse, show, synth, norm) {
  var defs = await _run_(main, dir, ext, parse, show, synth, norm, true);
  for (var name in defs) {
    var code = "";
    code += code !== "" ? "\n\n" : "";
    code += name + ": ";
    code += fm.synt.stringify(defs[name].type) + "\n  ";
    code += fm.synt.stringify(defs[name].term) + "";
    fs.writeFileSync(".fmc/"+name+".fmc", code);
    console.log("Saved .fmc/"+name+".fmc");
  };
};

module.exports = {load, _run_, _fm_, _fmc_, _fms_, _io_, _fm2js_, _opt_, _fast_, _fm2evm_, _evm2fm_, _fm2fmc_};
