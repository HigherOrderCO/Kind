#!/usr/bin/env node

var main = process.argv[2];
if (!main) {
  console.log("Usage: fmcjs <term_name>");
  process.exit();
};

var fs = require("fs");
var fmc = require("./../FormalityCore.js");
var fmcjs = require("./../Compiler.js");
var loader = require("./loader.js");
var {defs} = loader();

if (!defs[main]) {
  console.log("Term '" + main + "' not found.");
} else {
  var js_code = fmcjs(defs, main);
  console.log(eval(js_code)[main]);
};
