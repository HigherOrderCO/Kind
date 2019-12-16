var fm = module.exports = {
  core    : require("./core"),
  lang    : require("./lang"),
  fast    : require("./runtime-fast"),
  optimal : require("./runtime-optimal"),
  js      : require("./fm-to-js"),
  net     : require("./fm-net"),
  loader  : require("./loader"),
  version : require("./../package.json").version
};
