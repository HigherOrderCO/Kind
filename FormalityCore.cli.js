#!/usr/bin/env node

var fs = require("fs");
var fmc = require("./FormalityCore.js");

var args = [].slice.call(process.argv, 2);
var file = args.pop();
var opts = args.reduce((arg,opts) => opts[arg] = 1, {});

if (!file) {
  console.log("Formality-Lang");
  console.log("");
  console.log("Commands:");
  console.log("$ fm <file> | type-checks definitions");
  process.exit();
}

var file = file.slice(-4) === ".fmc" ? file : file + ".fmc";
var code = fs.readFileSync(file, "utf8");
var errors = [];

// Normalizes and type-checks all terms

console.log("\033[4m\x1b[1mType-checking " + file + ":\x1b[0m");
var module = fmc.parse_mod(code, 0);
var max_len = 0;
for (var name in module) {
  max_len = Math.max(name.length, max_len);
};
for (var name in module) {
  var show_name = name;
  while (show_name.length < max_len) {
    show_name = show_name + " ";
  }
  try {
    console.log(show_name + " : " + fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
  } catch (e) {
    console.log(show_name + " : " + "\x1b[31merror\x1b[0m");
    errors.push([name, e.toString()]);
  }
};
console.log("");

if (errors.length > 0) {
  console.log("\033[4m\x1b[1mFound " + errors.length + " type error(s):\x1b[0m");
  for (var i = 0; i < errors.length; ++i) {
    console.log("\x1b[1m[" + errors[i][0] + "]\x1b[0m " + errors[i][1]); 
  };
} else {
  console.log("\033[4m\x1b[1mAll terms check.\x1b[0m");
};

console.log("");
console.log("\033[4m\x1b[1mEvaluating `main`:\x1b[0m");
try {
  console.log(fmc.stringify_trm(fmc.normalize(module.main.term, module)));
} catch (e) {
  console.log("Error.");
}
