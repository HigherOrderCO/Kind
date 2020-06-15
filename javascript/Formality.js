module.exports = (deps) => ({
  comp: require("./FormalityComp.js"),
  lang: require("./FormalityLang.js"),
  core: require("./FormalityCore.js"),
  synt: require("./FormalitySynt.js"),
  comp: require("./FormalityComp.js"),
  tojs: require("./FormalityToJS.js"),
  optx: require("./FormalityOptx.js"),
  inet: require("./FormalityInet.js"),
  load: require("./FormalityLoad.js")(deps),
});
