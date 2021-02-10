// Compiles apps from `Formality/src/Web/*.fm to `src/apps/*.js`

var fs = require("fs");
var exec = require("child_process").execSync;

var wb_dir = __dirname+"/src";
var fm_dir = __dirname+"/../src";

process.chdir(fm_dir);
var files = fs.readdirSync("Web").filter(x => x.slice(-3) === ".fm");

var apps = [];

console.log("Compiling apps:");
for (var file of files) {
  process.chdir(fm_dir);
  var name = "Web."+file.slice(0,-3);
  var code = String(exec("fmjs "+name+" --js --module | js-beautify"));
  process.chdir(wb_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  console.log("- " + name);
  apps.push(name);
}

process.chdir(wb_dir);

var index = "module.exports = {\n";
for (var app of apps) {
  index += "  '" + app + "': import('./"+app+".js'),\n";
}
index += "}\n";
fs.writeFileSync("apps/index.js", index);

