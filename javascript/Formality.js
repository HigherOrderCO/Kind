module.exports = (deps) => ({
  comp: require("./FormalityComp.js"),
  lang: require("./FormalityLang.js"),
  core: require("./FormalityCore.js"),
  synt: require("./FormalitySynt.js"),
  comp: require("./FormalityComp.js"),
  tojs: require("./FormalityToJS.js"),
  optx: require("./FormalityOptx.js"),
  toev: require("./FormalityToEV.js"),
  inet: require("./FormalityInet.js"),
  fast: require("./FormalityFast.js"),
  load: require("./FormalityLoad.js")(deps),
});
