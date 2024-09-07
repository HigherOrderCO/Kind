var {execSync} = require("child_process");
var fs = require("fs");
var path = require("path");
var {fmc_to_js, fmc_to_hs, fmc} = require("formcore-js"); // FormCore, which has the JS compiler
//var {fmc_to_js, fmc_to_hs} = require("./../../FormCoreJS");

var kind_path = path.join(__dirname, "js/src/kind.js");
process.chdir(path.join(__dirname, "../base"));

// Restores last kind.js from git in case we destroyed it 
execSync("git checkout "+kind_path);

// Creates kind.js
console.log("Generating kind.js");
execSync("scheme  --libdirs ../bin/scm/src ../bin/scm/src/main.scm Kind.api.export --js --module > "+kind_path+".tmp");
execSync("mv "+kind_path+".tmp "+kind_path);
