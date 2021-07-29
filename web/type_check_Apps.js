var fs = require("fs");
var { execSync } = require("child_process");

var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
// var github_apps = ["base/App/Account.kind", "base/App/Account/Screen/draw.kind"]

const args = process.argv[2];

if (args){
  if (process.argv[2].trim() === "all") { // node type_check_Apps all
    exit_all(type_check_apps());
  } else { // node type_check_Apps App/[name]
    is_folder(args) 
    ? exit(type_check_folder_js(get_app_folder(args))) 
    : exit(type_check_app(args));
  }
} else {
  console.log("A parameter must be specified.");
  console.log("- node type_check_Apps App.[name]");
  console.log("- node type_check_Apps all");
}

function is_folder(path) {
  let folders = path.split("/");
  return folders.length > 1;
}

function get_app_folder(path) {
  return path.split("/")[2].slice(0,-5);
}

function exit(success) {
  if (success) {
    console.log("\x1b[32msuccess\x1b[39m\n")
    process.exit();
  } else {
    console.error("\x1b[31mfail\x1b[39m\n");
    process.exit(1);
  }
}

// Exit from type checking all Apps' folder
// Show the ones with error
function exit_all(res) {
  if (res["fail"].lenght === 0) {
    console.log("\x1b[32msuccess\x1b[39m\n")
    process.exit();
  } else {
    console.log("Error in folders: ", res["fail"]);
    console.error("\x1b[31mfail\x1b[39m\n");
    process.exit(1);
  }
}


// Type check an App in base/App
// ex: node type_check_Apps App/Playground.kind
function type_check_app(name) {
  console.log("Type checking "+name+"...")
    const type_check = execSync('kind '+ name, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        return false;
      }
      console.log('type check STDOUT: '+stdout);
    });
    const res = String(type_check);
    // console.log(res);
    let match = res.slice(-17, -1); // mensage in the end of the type check process
    return match.endsWith("All terms check.");
}

// Type check an App's folder in base/App
// ex: node type_check_Apps App/Playground/
function type_check_folder_js(name) {
  if (fs.existsSync(kind_dir+"/App/"+name)) {
    try {
      console.log("Type checking folder App/"+name+"/* ...");
      const type_check = execSync('kind App/'+ name +"/", function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          return false;
        }
        console.log('type check STDOUT: '+stdout);
      });
      const res = String(type_check);
      // console.log(res);
      let match = res.slice(-17, -1); // mensage in the end of the type check process
      return match.endsWith("All terms check.");
    } catch (e) {
      console.log(e);
      return false;
    }
  } else {
    console.log("Couldn't find folder App/"+name);
    return false;
  }
}

// console.log("Apps to check: ", all_kind_apps);
// Type check all apps
function type_check_apps() {
  const success = [];
  const fail = [];
  for (var file of all_kind_apps) {
    var app = file.slice(0, -5);
    // type_check_app("App."+format) ? success.push(file) : fail.push(file);
    type_check_folder(app) ? success.push(app) : fail.push(app);
  }
  return {success, fail}
}
