var fs = require("fs");
var exec = require("child_process").execSync;

// TODO: use a git submodule?

var mo_dir = __dirname+"/src";
var fm_dir = __dirname+"/../formality/src";

process.chdir(fm_dir);
var files = fs.readdirSync("Moonad").filter(x => x.slice(-3) === ".fm");

var apps = [];

console.log("Compiling apps:");
for (var file of files) {
  process.chdir(fm_dir);
  var name = "Moonad."+file.slice(0,-3);
  var code = String(exec("fmjs "+name+" --js --module | js-beautify"));
  process.chdir(mo_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  console.log("- " + name);
  apps.push(name);
}

process.chdir(mo_dir);

var index = "module.exports = {\n";
for (var app of apps) {
  index += "  '" + app + "': import('./"+app+".js'),\n";
}
index += "}\n";
fs.writeFileSync("apps/index.js", index);

