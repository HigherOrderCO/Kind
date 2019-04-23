const compiler = require("./compiler.js");
const nasic = require("./nasic.js");
const formality = require("./formality.js");

const lib = {};

for (const key in compiler) {
  lib[key] = compiler[key];
}

for (const key in nasic) {
  lib[key] = nasic[key];
}

for (const key in formality) {
  lib[key] = formality[key];
}

module.exports = lib;
