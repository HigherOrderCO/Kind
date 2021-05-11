// Compiles apps from `Kind/base/Web/*.kind to `src/apps/*.js`

var fs = require("fs");
var exec = require("child_process").execSync;

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
// var files = fs.readdirSync("Web").filter(x => x.slice(-5) === ".kind");
var files = ["Playground.kind"]

var apps = [];

console.log("Compiling apps:");
for (var file of files) {
  process.chdir(kind_dir);
  var name = "Web."+file.slice(0,-5);
  
  var code = String(exec("kind "+name+" --js --module | js-beautify"));
  
  // console.log(code);
  process.chdir(code_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  console.log("- " + name);
  apps.push(name);
}

process.chdir(code_dir);

var index = "module.exports = {\n";
for (var app of apps) {
  index += "  '" + app + "': import('./"+app+".js'),\n";
}
index += "}\n";
fs.writeFileSync("apps/index.js", index);

console.log(exec("npm run build").toString());
