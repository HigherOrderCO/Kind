var fm = module.exports = {
  core: require("./fm-core.js"),
  lang: require("./fm-lang.js"),
  net: require("./fm-net.js"),
  to_net: require("./fm-to-net.js"),
  to_js: require("./fm-to-js.js"),
};

// All-in-one convenience export
fm.exec = function exec(name, defs, mode = "DEBUG", opts, stats = {}) {
  function norm(term, defs, mode = "DEBUG", opts, stats = {}) {
    var erase = opts.erased ? fm.lang.erase : (x => x);
    switch (mode) {
      case "DEBUG":
        var erased = erase(term);
        try {
          var normal = fm.lang.norm(erased, defs, {weak: opts.weak, unbox: opts.unbox, logging: opts.logging});
        } catch (e) {
          var normal = fm.lang.norm(erased, defs, {weak: true, unbox: opts.unbox, logging: opts.logging});
        }
        return normal;
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
        fm.lang.boxcheck(term, defs);
        return fm.lang.norm(erase(fm.lang.typecheck(term, null, defs)), {}, {weak: false, unbox: true});
      case "NONE":
        if (term[0] === "Ref") {
          return erase(defs[term[1].name]);
        } else {
          return erase(term);
        }
    }
  }
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  var term = defs[name] || fm.lang.Ref(name);
  var result = norm(term, defs, mode, opts, stats);
  return result;
}

