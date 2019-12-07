var fm = module.exports = {
  core    : require("./fm-core"),
  lang    : require("./fm-lang"),
  runtime : require("./fm-runtime"),
  js      : require("./fm-js"),
  net     : require("./fm-net"),
  to_net  : require("./fm-to-net"),
  loader  : require("./fm-loader"),
  version : require("./../package.json").version
};
