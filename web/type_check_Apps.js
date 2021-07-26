var fs = require("fs");
var { execSync } = require("child_process");

var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");

// node type_check_Apps all
if (process.argv[2].trim() === "all") {
  let res = type_check_apps();
  exit(res["fail"]);
} else { // node type_check_Apps App.[name]
  let res = type_check_app(process.argv[2]);
  exit(res["fail"]);
}

// error: Array(String)
function exit(error) {
  if (error.length === 0) {
    console.log("\nAll terms checked.")
    process.exit();
  } else {
    console.error("\nType check fail.");
    console.log(error);
    process.exit(1);
  }
}

// Type check an App in base/App
// ex: node type_check_Apps App.Playground
function type_check_app(name) {
  console.log("Type checking "+name+"...")
  const match = name.slice(4)+".kind";
  if (all_kind_apps.includes(match)) {
    const type_check = execSync('kind '+ name, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        return false;
      }
      console.log('type check STDOUT: '+stdout);
      console.log('type check STDERR: '+stderr);
    });
    const res = String(type_check);
    // console.log(res);
    let match = res.slice(-17, -1); // mensage in the end of the type check process
    return match.endsWith("All terms check.");
  } else { 
    console.log("Can't find "+name+" inside base/App")
    return false;
  }
}

// console.log("Apps to check: ", all_kind_apps);
function type_check_apps() {
  const success = [];
  const fail = [];
  for (var file of all_kind_apps) {
    var format = "App."+file.slice(0, -5);
    type_check_app(format) ? success.push(file) : fail.push(file);
  }
  return {success, fail}
}