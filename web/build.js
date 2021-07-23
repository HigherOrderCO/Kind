// Compiles apps from `Kind/base/App/*.kind to `src/apps/*.js`

var fs = require("fs");
var {exec, execSync} = require("child_process");

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var files = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");

if (process.argv[2]) {
  files = files.filter(name => {
    return name.toLowerCase().indexOf(process.argv[2].toLowerCase()) !== -1
  });
} else {
  console.log("Tip: to build only 1 app, use \x1b[2mnode build.js app_name\x1b[0m.")
}

var apps = [];

console.log("Compiling apps:");
for (var file of files) {
  process.chdir(kind_dir);
  var name = "App."+file.slice(0,-5);
  console.log("- " + name);
  
  try {
    var code = String(execSync("kind "+name+" --js --module | js-beautify-temp-fix", {maxBuffer: 1024 * 1024 * 1024}));
  } catch (e) {
    console.log("Couldn't compile " + file + ". Error:");
    console.log(e.toString());
    continue;
  }
  
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

console.log("Building index.js...");
exec("npm run build", function (err, stdout, stdin) {
  if (err) {
    console.log(err);
  } else {
    console.log("Done.");
  }
})
