// Builds code files from the spec

var fs = require("fs");
var spec = fs.readFileSync("./README.md", "utf8");

var code = {haskell: "", javascript: "", python: ""};
var lext = {haskell: "hs", javascript: "js", python: "py"};
var lang = null;

for (var i = 0; i < spec.length; ++i) {
  if (lang === null) {
    for (var lang_name in code) {
      if (spec.slice(i, i + lang_name.length+3) === "```"  +lang_name) {
        lang = lang_name;
        i += lang_name.length + 4;
      }
    };
  } else {
    if (spec.slice(i, i + 3) === "```") {
      code[lang] += "\n";
      lang = null;
   }
  }
  if (lang !== null) {
    code[lang] += spec[i];
  }
};

for (var lang_name in code) {
  fs.writeFileSync("formality_core." + lext[lang_name], code[lang_name]);
};
