var fm = module.exports = {
  core: require("./fm-core.js"),
  lang: require("./fm-lang.js"),
  net: require("formality-net"),
  to_net: require("./fm-to-net.js"),
  to_js: require("./fm-to-js.js"),
};

// TODO: move to FM-Lang
fm.lang.norm = function norm(term, defs, mode = "DEBUG", opts, stats = {}) {
  var erase = opts.erased ? fm.lang.erase : (x => x);
  var force_dup = opts.boxed ? false : true;
  switch (mode) {
    case "DEBUG":
      return fm.core.norm((opts.erased ? fm.lang.erase : (x=>x))(term, defs), defs, force_dup);
    case "JAVASCRIPT":
      return fm.to_js.decompile(fm.to_js.compile(fm.lang.erase(term, defs), defs));
    case "OPTIMAL":
      var net = fm.to_net.compile(fm.lang.erase(term, defs), defs);
      if (stats && stats.input_net === null) {
        stats.input_net = JSON.parse(JSON.stringify(net));
      }
      if (opts.strict) {
        var new_stats = net.reduce_strict(stats || {});
      } else {
        var new_stats = net.reduce_lazy(stats || {});
      }
      if (stats && stats.output_net !== undefined) {
        stats.output_net = JSON.parse(JSON.stringify(net));
      }
      return fm.to_net.decompile(net);
    case "TYPE":
      return fm.core.norm(fm.lang.typecheck(term, null, defs), {}, false);
  }
}

// TODO: move to FM-Lang
fm.lang.exec = function exec(name, defs, mode = "OPTIMAL_LAZY", opts, stats = {}) {
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  var term = defs[name] || fm.lang.Ref(name);
  if (opts.boxcheck) {
    fm.lang.boxcheck(term, defs);
  }
  var result = fm.lang.norm(term, defs, mode, opts, stats);
  return result;
}
