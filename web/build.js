// Compiles apps from `Kind/base/App/*.kind to `src/apps/*.js`

var fs = require("fs");
var exec = require("child_process").execSync;

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var files = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
if (process.argv[2]) {
  files = files.filter(name => {
    return name.toLowerCase().indexOf(process.argv[2].toLowerCase()) !== -1
  });
}

var apps = [];

console.log("Compiling apps:");
for (var file of files) {
  process.chdir(kind_dir);
  var name = "App."+file.slice(0,-5);
  console.log("- " + name);
  
  var code = String(exec("kind "+name+" --js --module | uglifyjs -b"));
  
  // console.log(code);
  process.chdir(code_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  apps.push(name);
}

process.chdir(code_dir);

var index = "module.exports = {\n";
for (var app of apps) {
  index += "  '" + app + "': import('./"+app+".js'),\n";
}
index += "}\n";
fs.writeFileSync("apps/index.js", index);

console.log("Done, building index.js...");
console.log(exec("npm run build").toString());
