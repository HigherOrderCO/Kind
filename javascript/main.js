#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var informality = require("./informality.js");

try {
  var args = [].slice.call(process.argv, 2);
  var expr = args[args.length - 1] || "main";

  var code = "";
  var files = fs.readdirSync(".");
  for (var i = 0; i < files.length; ++i) {
    if (files[i].slice(-4) === ".ifm") {
      code += fs.readFileSync("./" + files[i], "utf8") + "\n";
    }
  }
} catch (e) {
  console.log(e);
  console.log("Informality: an efficient, terminating language.");
  console.log("Usage: informality term_name");
  console.log("It will automatically import any local file ending in `.ifm`.");
  process.exit();
}

console.log(code);
var defs = informality.parse(code);
var term = informality.parse("main = (" + expr + ")").main;

console.log("Term:\n" + informality.show(term) + "\n");
console.log("Stratified:\n" + informality.stratified(term, defs) + "\n");

try {
  console.log("Norm (full):\n" + informality.show(informality.norm(term, defs)) + "\n");
  console.log(JSON.stringify(informality.norm(term, defs)));
} catch (e) {
  console.log("Norm (full):\n<infinite?>\n");
  console.log(e);
}
