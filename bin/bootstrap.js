var {execSync} = require("child_process");
var fs = require("fs");
var path = require("path");
var {fmc_to_js, fmc_to_hs, fmc} = require("formcore-lang"); // FormCore, which has the JS compiler
//var {fmc_to_js, fmc} = require("./../../FormCoreJS"); // FormCore, which has the JS compiler

var fmjs_path = path.join(__dirname, "js/src/formality.js");
var fmhs_path = path.join(__dirname, "hs/src/FormalityInternal.hs");
process.chdir(path.join(__dirname, "../src"));

// Restores last formality.js from git in case we destroyed it 
execSync("git checkout "+fmjs_path);

// Creates formality.js
console.log("Generating formality.js");
execSync("fmjs Fm --js --module | js-beautify >> "+fmjs_path+".tmp");
execSync("mv "+fmjs_path+".tmp "+fmjs_path);

// Creates formality.hs
console.log("Generating formality.hs");
execSync("fmjs Fm --hs --module FormalityInternal >> "+fmhs_path+".tmp");
execSync("mv "+fmhs_path+".tmp "+fmhs_path);

// Using the old version (deprecated)
//console.log("Using old Formality to generate formality.js");
//execSync("rm "+file);
//execSync("fmjs Fm | js-beautify >> "+file);
//fs.writeFileSync(file,fs.readFileSync(file,"utf8").split("\n").slice(0,-1).join("\n")); // removes module.exports lines
