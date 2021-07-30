var fs = require("fs");
var { execSync } = require("child_process");

var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");
const args = process.argv[2];

if (args){
  let app = args.slice(5); // remove "base/"
  if (process.argv[2].trim() === "all") { // node type_check_Apps all
    exit_all(type_check_apps());
  } else { // node type_check_Apps App/[name]
    if (app) {
      is_folder(app) 
      ? exit(type_check_folder(get_app_folder(app))) 
      : exit(type_check_app(app));
    } else {
      console.log("Invalid parameter");
      exit(false);
    }
  }
} else {
  console.log("A parameter must be specified.");
  console.log("- node type_check_Apps App.[name]");
  console.log("- node type_check_Apps all");
}

function is_folder(path) {
  let folders = path.split("/");
  return folders.length > 2;
}

function get_app_folder(path) {
  return path.split("/")[1];
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
    console.log("Found error in folders: ", res["fail"]);
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
  let match = String(type_check).slice(-17, -1); // mensage in the end of the type check process
  return match.endsWith("All terms check.");
}

// Type check an App's folder in base/App
// all_apps: when false, uses JavaScript compilation target. If true, Scheme.
// ex: node type_check_Apps App/Playground/
function type_check_folder(name, all_apps = false) {
  console.log("Type check folder: ", name)
  if (fs.existsSync(kind_dir+"/App/"+name)) {
    try {
      console.log("Type checking folder App/"+name+"/* ...");
      var target = all_apps ? "kind-scm" : "kind";
      const type_check = execSync(target+' App/'+ name +"/", function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          return false;
        }
        console.log('type check STDOUT: '+stdout);
      });
      let match = String(type_check).slice(-17, -1); // mensage in the end of the type check process
      return match.endsWith("All terms check.");
    } catch (e) {
      console.log(e);
      return false;
    }
  } else {
    if (all_kind_apps.includes(name+".kind")) {
      return true; // it's an App without folder
    } else { 
      console.log("Couldn't find folder App/"+name);
      return false;
    }
  }
}

// Type check all apps
// IMPORTANT: it will not work if the compilation target isn't Scheme.
function type_check_apps() {
  const success = [];
  const fail = [];
  for (var file of all_kind_apps) {
    var app = file.slice(0, -5);
    type_check_app("App."+app) ? success.push(file) : fail.push(file);
    type_check_folder(app, true) ? success.push(app) : fail.push(app);
  }
  return {success, fail}
}
