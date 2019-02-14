#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var formality = require("./formality.js");

try {
  var args = [].slice.call(process.argv, 2);
  var file = args[args.length - 1] || "./main.formality";
  var code = fs.readFileSync("./" + (file.indexOf(".") === -1 ? file + ".formality" : file), "utf8");
} catch (e) {
  console.log("Formality: a nano proof language.");
  console.log("Usage: formality file_name[.formality]");
  process.exit();
}

var defs = formality.parse(code);
var term = defs.main.term;

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

try {
  var net = formality.compile(term, defs);
  var rwt = net.reduce_lazy();
  var tnf = formality.decompile(net);
  console.log("Norm (" + rwt + " graph rewrites):");
  console.log(formality.show(tnf));
} catch (e) {
  console.log(e);
}
