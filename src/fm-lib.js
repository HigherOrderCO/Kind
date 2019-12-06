var fm = module.exports = {
  core    : require("./fm-core"),
  lang    : require("./fm-lang"),
  runtime : require("./fm-runtime"),
  js      : require("./fm-js"),
  loader  : require("./fm-loader"),
  version : require("./../package.json").version
};
