#!/usr/bin/env node

var fs = require("fs");
var fmc = require("./FormalityCore.js");
var fmcjs = require("./Compiler.js");

var args = [].slice.call(process.argv, 2);
var file = args.pop();
var opts = args.reduce((arg,opts) => opts[arg] = 1, {});

if (!file) {
  console.log("Formality-Core: program evaluator");
  console.log("");
  console.log("Usage:");
  console.log("$ fmcio <file> | runs 'main' with JavaScript");
  process.exit();
}

var file = file.slice(-4) === ".fmc" ? file : file + ".fmc";
var code = fs.readFileSync(file, "utf8");
var errors = [];

var js_code = fmcjs(fmc.parse_file(code));
console.log(eval(js_code).main);
