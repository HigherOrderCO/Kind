var compiler = require("./compiler.js");
var nasic = require("./nasic.js");
var formality = require("./formality.js");

var lib = {};

for (var key in compiler) {
  lib[key] = compiler[key];
}

for (var key in nasic) {
  lib[key] = nasic[key];
}

for (var key in formality) {
  lib[key] = formality[key];
}

module.exports = lib;
