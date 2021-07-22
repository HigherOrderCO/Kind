// Compiles apps from `Kind/base/App/*.kind to `src/apps/*.js`

var fs = require("fs");
var {exec, execSync} = require("child_process");

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

process.chdir(code_dir);
var all_js_apps   = fs.readdirSync("apps").filter(x => x.startsWith("App."));
process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
// var app = ["TicTacToe.kind"];
var app = "";
var compiled_apps = [];

// Only build 1 App
if (process.argv[2]) {
  app = all_kind_apps.filter(name => {
    return name.toLowerCase().indexOf(process.argv[2].toLowerCase()) !== -1
  });
  compiled_apps = compile_app(app);
} else { // Build all Apps
  console.log("Tip: to build only 1 app, use \x1b[2mnode build.js app_name\x1b[0m.")
  for (var file of all_kind_apps) {
    compiled_apps.push(compile_app(file));
  }
}

function compile_app(name) {
  process.chdir(kind_dir);
  var name = "App."+name.slice(0,-5);
  console.log("- " + name);
  
  try {
    var code = String(execSync("kind "+name+" --js --module | js-beautify-temp-fix", {maxBuffer: 1024 * 1024 * 1024}));
  } catch (e) {
    console.log("Couldn't compile " + file + ". Error:");
    console.log(e.toString());
  }

  // Write compiled App
  process.chdir(code_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  return name;
}

// Export Apps in index.js
process.chdir(code_dir);
var index = "module.exports = {\n";
const build_all = app === "";
for (var app of build_all ? all_js_apps : all_js_apps.concat(app)) {
  index += "  '" + app + "': import('./"+app+"'),\n";
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