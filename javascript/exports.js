var fm = module.exports = {
  core: require("./fm-core.js"),
  net: require("formality-net"),
  to_net: require("./fm-to-net.js"),
  to_js: require("./fm-to-js.js"),
  norm, check, exec
};

function norm(term, defs, mode = "OPTIMAL_LAZY", stats = {}) {
  switch (mode) {
    case "BOXED":
      return fm.core.norm(term, defs, false);
    case "UNBOXED":
      return fm.core.norm(term, defs, true);
    case "NATIVE":
      return fm.to_js.decompile(fm.to_js.compile(term, defs));
    case "OPTIMAL_STRICT":
    case "OPTIMAL_LAZY":
      var net = fm.to_net.compile(term, defs);
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
  }
}

function exec(name, defs, infs, mode = "OPTIMAL_LAZY", bipass = false, stats = {}) {
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  if (defs[name]) {
    return fm.norm(check(defs[name], defs, bipass), defs, mode, stats);
  } else if (infs[name]) {
    var data = infs[name];
    var init = check(data.init, defs, bipass);
    var step = check(data.step, defs, bipass);
    var stop = check(data.stop, defs, bipass);
    var done = check(data.done, defs, bipass);
    var term = fm.core.norm(init, mode, stats);
    var cont = term => {
      var res = fm.norm(fm.core.App(stop, term), defs, mode, stats);
      if (res[0] === "Put") {
        res = res[1].expr;
      }
      return res[0] === "Num" && res[1].numb === 0;
    }
    while (cont(term)) {
      term = fm.norm(fm.core.App(step, term), defs, mode, stats);
      stats.loops += 1;
    }
    term = fm.norm(fm.core.App(done, term), defs, mode, stats);
    return term;
  } else {
    throw "Definition '" + name + "' not found.";
  }
}

function check(term, defs, bipass = false) {
  if (!bipass) {
    try {
      fm.core.check(term, defs);
      return term;
    } catch (e) {
      console.log(e.toString());
      process.exit();
    }
  } else {
    return term;
  }
}
