var fs = require("fs");
var fmc = require("./../FormalityCore.js");

function loader() {
  var dir = fs.readdirSync(".").filter(file => file.slice(-4) === ".fmc");
  if (dir.length === 0) {
    console.log("No local .fmc file found.");
    process.exit();
  } else {
    var result = {files: {}, defs: {}};
    for (var file of dir) {
      var file_code = fs.readFileSync(file, "utf8");
      var file_defs = fmc.parse_defs(file_code);
      for (var name in file_defs) {
        if (result.defs[name]) {
          console.log("Redefinition of '" + name + "' in '" + file + "'.");
          process.exit();
        } else {
          result.defs[name] = file_defs[name];
          result.files[name] = file_code;
        }
      }
    }
  }
  return result;
};

module.exports = loader;
