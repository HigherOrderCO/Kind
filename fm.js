var fmc = require("./FormalityCore.js");
var fs = require('fs');


fs.readFile('Formality.fmc', `utf8`,(err,data) => {
  if (err) { console.log(err); } else
  {
    var module = fmc.parse_mod(data, 0);
    // Normalizes and type-checks all terms
    for (var name in module) {
      console.log("name:", name);
      console.log("term:", fmc.stringify_trm(module[name].term));
      try {
        console.log("norm:", fmc.stringify_trm(fmc.normalize(module[name].term, module)));
      } catch (e) {
        console.log("norm:", fmc.stringify_trm(fmc.reduce(module[name].term, module)));
      }
      try {
        console.log("type:", fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
      } catch (e) {
        console.log("type:", e);
      }
      console.log("");
    };
  }});



