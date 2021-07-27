// Compiles apps from `Kind/base/App/*.kind to `src/apps/*.js`

var fs = require("fs");
var {exec, execSync} = require("child_process");

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

// TODO: remove from "src/apps" the ones that are no longer in "base/Apps"

process.chdir(code_dir);
var all_js_apps   = fs.readdirSync("apps").filter(x => x.startsWith("App."));
process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
var app = "";
var compiled_apps = [];

console.log("[1/2] Compiling apps:")
if (process.argv[2]) { // Only build 1 App
  app = all_kind_apps.filter(name => {
    const match = process.argv[2].toLowerCase().slice(4) // remove "App."
    return name.toLowerCase().endsWith(match) 
      || name.toLowerCase().endsWith(match+".kind");
  })[0];
  if (app) {
    compiled_apps = compile_app(app);
  } else {
    console.log("[error] App "+process.argv[2]+" not found.");
  }
} else { // Build all Apps
  console.log("Tip: to build only 1 app, use \x1b[2mnode build.js app_name\x1b[0m.")
  for (var file of all_kind_apps) {
    compiled_apps.push(compile_app(file));
  }
}

// Compile app from ".kind" to ".js"
// Save it in "src/apps/"
function compile_app(name) {
  process.chdir(kind_dir);
  var name = "App."+name.slice(0,-5);
  console.log("- " + name);
  try {
    var code = String(execSync("kind "+name+" --js --module | js-beautify", {maxBuffer: 1024 * 1024 * 1024}));
  } catch (e) {
    console.log("Couldn't compile " + file + ". Error:");
    console.log(e.toString());
  }
  // Write compiled App file
  process.chdir(code_dir);
  fs.writeFileSync("apps/"+name+".js", code);
  return name;
}

// Write "src/app/index.js" to export the Apps
process.chdir(code_dir);
var index = "module.exports = {\n";
const add_line = (app) => "  '" + app.slice(0, -3) + "': import('./"+app+"'),\n";
if (app !== "" && app !== undefined) { // Check if need to add App to the export list
  const app_export_format = "App."+app.slice(0,-5)+".js";
  if (all_js_apps.includes(app_export_format)) all_js_apps.concat(app_export_format);
}
// Order Apps alphabetically
all_js_apps.sort((a, b) => a.localeCompare(b)) 
for (var app of all_js_apps ) {
  index += add_line(app);
}
index += "}\n";
fs.writeFileSync("apps/index.js", index);

console.log("\n[2/2] Building index.js...");
exec("npm run build", function (err, stdout, stdin) {
  if (err) {
    console.log(err);
  } else {
    console.log("Done.");
  }
})
