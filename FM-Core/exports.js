var fm = module.exports = {
  core: require("./fm-core.js"),
  lang: require("./fm-lang.js"),
  net: require("formality-net"),
  to_net: require("./fm-to-net.js"),
  to_js: require("./fm-to-js.js"),
  norm,
  check,
  exec
};

function norm(term, defs, mode = "DEBUG", stats = {}) {
  switch (mode) {
    case "DEBUG":
      return fm.lang.norm(fm.lang.erase(term, defs), defs, false);
    case "INTERPRETED":
      return fm.lang.norm(fm.lang.erase(term, defs), defs, true);
    case "JAVASCRIPT":
      return fm.to_js.decompile(fm.to_js.compile(fm.lang.erase(term, defs), defs));
    case "OPTIMAL_STRICT":
    case "OPTIMAL_LAZY":
      var net = fm.to_net.compile(fm.lang.erase(term, defs), defs);
      if (stats && stats.input_net === null) {
        stats.input_net = JSON.parse(JSON.stringify(net));
      }
      if (mode === "OPTIMAL_LAZY") {
        var new_stats = net.reduce_lazy(stats || {});
      } else {
        var new_stats = net.reduce_strict(stats || {});
      }
      if (stats && stats.output_net !== undefined) {
        stats.output_net = JSON.parse(JSON.stringify(net));
      }
      return fm.to_net.decompile(net);
    case "TYPE":
      return fm.lang.norm(fm.lang.typecheck(term, null, defs), {}, false);
  }
}

function exec(name, defs, infs, mode = "OPTIMAL_LAZY", bipass = false, stats = {}) {
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  if (defs[name]) {
    var checked = check(defs[name], defs, bipass);
    var result = fm.norm(checked, defs, mode, stats);
    return result;
  } else {
    throw "Definition '" + name + "' not found.";
  }
}

function check(term, defs, bipass = false) {
  if (!bipass) {
    try {
      fm.lang.boxcheck(term, defs);
      return term;
    } catch (e) {
      console.log(e);
      process.exit();
    }
  } else {
    return term;
  }
}
