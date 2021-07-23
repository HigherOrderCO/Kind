var fs = require("fs");
var {exec, execSync} = require("child_process");

var code_dir = __dirname+"/src";
var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");

function type_check_app(file) {
  console.log("Type checking "+file+"...")
  if (all_kind_apps.includes(file)) {
    const name = "App."+file.slice(0,-5)
    var code = String(execSync("kind "+name, { maxBuffer: 1024 * 1024 * 1024}));
    const res = code.slice(-17, -1); // end of the type check
    return res.endsWith("All terms check.")
  } else { 
    console.log("Can't find "+file+" inside base/App")
    return false;
  }
}

console.log("Apps to check: ", all_kind_apps);
function type_check_apps() {
  const success = [];
  const fail = [];
  for (var file of all_kind_apps) {
    type_check_app(file) ? success.push(file) : fail.push(file);
  }
  return {success, fail}
}

let res = type_check_apps()
console.log(res);

// TODO: problem withn stackoverflow? 

