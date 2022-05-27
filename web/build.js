// Compiles apps from `Kind/base/App/*.kind to `src/apps/*.js`

var fs = require("fs");
var {exec, execSync} = require("child_process");
require('dotenv/config');

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

// TODO: remove from "src/apps" the ones that are no longer in "base/Apps"

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
var all_js_apps = [];
// console.log(all_kind_apps)

// Apps that will be displayed when accessing http://old.kindelia.org
var server_apps = [
  'AirShooter.kind',
  'Browser.kind',   
  'Hello.kind',
  'Kind.kind',
  'KL.kind',
  'Ludo.kind',
  'Playground.kind',
  'Pong.kind',
  'RLP.kind',
  'Seta.kind',
  'TicTacToe.kind'
]

var app = "";
var compiled_apps = [];

console.log("[1/2] Compiling apps:")
const build_server = process.env.PRODUCTION;

if (process.argv[2]) { // Only build 1 App
  app = all_kind_apps.filter(name => {
    const match = process.argv[2].toLowerCase()
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
  const apps = build_server ? server_apps : all_kind_apps;
  for (var file of apps) {
    compiled_apps.push(compile_app(file));
  }
}

// Compile app from ".kind" to ".js"
// Save it in "src/apps/"
function compile_app(name) {
  all_js_apps.push("App."+name.replace(".kind",".js"));
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
  // create apps folder if doesn't exist
  if (!fs.existsSync("apps")) {
    fs.mkdirSync("apps")
  }
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

const formatted_server_app = (app) => app.slice(4).slice(0, -3) + ".kind";

// Define which Apps will be on index.js file
const apps_in_index =
build_server 
? all_js_apps.filter((app) => server_apps.includes(formatted_server_app(app)))
: all_js_apps;

// Order Apps alphabetically
apps_in_index.sort((a, b) => a.localeCompare(b)) 

for (var app of apps_in_index ) {
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
