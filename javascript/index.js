var compiler = require("./compiler.js");
var eanet = require("./ea-net.js");
var eatt = require("./ea-tt.js");

var lib = {};

for (var key in compiler) {
  lib[key] = compiler[key];
}

for (var key in eanet) {
  lib[key] = eanet[key];
}

for (var key in eatt) {
  lib[key] = eatt[key];
}

module.exports = lib;
