var fm = module.exports = {
  core      : require("./core"),
  stringify : require("./stringify"),
  parse     : require("./parse"),
  fast      : require("./runtime-fast"),
  optimal   : require("./runtime-optimal"),
  js        : require("./fm-to-js"),
  net       : require("./fm-net"),
  loader    : require("./loader"),
  version   : require("./../package.json").version
};
