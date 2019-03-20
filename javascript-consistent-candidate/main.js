#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var formality = require("./formality.js");

try {
  var args = [].slice.call(process.argv, 2);
  var expr = args[args.length - 1] || "main";

  var code = "";
  var files = fs.readdirSync(".");
  for (var i = 0; i < files.length; ++i) {
    if (files[i].slice(-3) === ".fm") {
      code += fs.readFileSync("./" + files[i], "utf8") + "\n";
    }
  }
} catch (e) {
  console.log(e);
  console.log("Formality: a nano proof language.");
  console.log("Usage: formality term_to_check");
  console.log("It will automatically import any local file ending in `.fm`.");
  process.exit();
}

var defs = formality.parse(code);
var term = formality.parse("main = (" + expr + ")").main.term;

console.log("Term:\n" + formality.show(term) + "\n");

try {
  console.log("Norm (head):\n" + formality.show(formality.norm(formality.norm(term, defs, false), {}, true)) + "\n");
} catch (e) {
  console.log("Norm (head):\n<none?>\n");
}

try {
  console.log("Norm (full):\n" + formality.show(formality.erase(formality.norm(term, defs, true))) + "\n");
} catch (e) {
  console.log("Norm (full):\n<infinite?>\n");
}

try {
  var type = formality.infer(term, defs);
  console.log("Type:\n" + formality.show(formality.norm(type, {}, true)) + "\n");
} catch (e) {
  console.log("Type:");
  console.log(e);
  console.log("");
}
