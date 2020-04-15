#!/usr/bin/env node

var fs = require("fs");
var fmc = require("./../FormalityCore.js");
var loader = require("./loader.js");

var {files,defs} = loader();

// Normalizes and type-checks all terms
console.log("\033[4m\x1b[1mType-checking:\x1b[0m");
var errors = [];
var max_len = 0;
for (var name in defs) {
  max_len = Math.max(name.length, max_len);
};
for (var name in defs) {
  var show_name = name;
  while (show_name.length < max_len) {
    show_name = show_name + " ";
  }
  try {
    console.log(show_name + " : " + fmc.stringify_term(fmc.typecheck(defs[name].term, defs[name].type, defs)));
  } catch (err) {
    console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
    errors.push([name, err]);
  }
};
console.log("");

if (errors.length > 0) {
  console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
  for (var i = 0; i < errors.length; ++i) {
    var err_msg = fmc.stringify_err(errors[i][1], files[errors[i][0]]);
    console.log("\n\x1b[1mInside \x1b[4m" + errors[i][0]
      + "\x1b[0m\x1b[1m:\x1b[0m\n" + err_msg); 
  };
} else {
  console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
};

var main = process.argv[2] || "main";
if (defs[main]) {
  console.log("");
  console.log("\033[4m\x1b[1mEvaluating `main`:\x1b[0m");
  try {
    console.log(fmc.stringify_term(fmc.normalize(defs[main].term, defs)));
  } catch (e) {
    console.log(e);
    console.log("Error.");
  }
};
