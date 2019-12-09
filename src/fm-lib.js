var fm = module.exports = {
  core    : require("./fm-core"),
  lang    : require("./fm-lang"),
  fast    : require("./fm-runtime-fast"),
  optimal : require("./fm-runtime-optimal"),
  js      : require("./fm-js"),
  net     : require("./fm-net"),
  loader  : require("./fm-loader"),
  version : require("./../package.json").version
};
