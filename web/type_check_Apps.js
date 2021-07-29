var fs = require("fs");
var { execSync } = require("child_process");

var kind_dir = __dirname+"/../base";

process.chdir(kind_dir);
var all_kind_apps = fs.readdirSync("App").filter(x => x.slice(-5) === ".kind");

const args = process.argv[2];
// node type_check_Apps all
if (args){
  let res = false;
  if (process.argv[2].trim() === "all") {
    // aux = type_check_apps();
    // console.log("aux: ", aux);
    // res = aux.fail.lenght === 0;
  } else { // node type_check_Apps App.[name]
    res = type_check_app(args);
  }
  exit(res);
} else {
  console.log("A parameter must be specified.");
  console.log("- node type_check_Apps App.[name]");
  console.log("- node type_check_Apps all");
}

// error: Array(String)
function exit(success) {
  if (success) {
    console.log("\x1b[32msuccess\x1b[39m\n")
    process.exit();
  } else {
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
// function type_check_folder(name) {
//   console.log("Type checking folder App/"+name+" ...")
//     const type_check = execSync('kind-scm App/'+ name +"/", function (error, stdout, stderr) {
//       if (error) {
//         console.log(error.stack);
//         return false;
//       }
//       console.log('type check STDOUT: '+stdout);
//     });
//     const res = String(type_check);
//     // console.log(res);
//     let match = res.slice(-17, -1); // mensage in the end of the type check process
//     return match.endsWith("All terms check.");
// }

// // console.log("Apps to check: ", all_kind_apps);
// // Type check all apps
// function type_check_apps() {
//   const success = [];
//   const fail = [];
//   for (var file of all_kind_apps) {
//     var app = file.slice(0, -5);
//     // type_check_app("App."+format) ? success.push(file) : fail.push(file);
//     type_check_folder(app) ? success.push(app) : fail.push(app);
//   }
//   return {success, fail}
// }
