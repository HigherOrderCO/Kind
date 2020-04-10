var fs    = require("fs");
var fmc   = require("./javascript");
var fmcjs = require("./javascript/Compiler.js");
var code  = fs.readFileSync("./Formality.fmc", "utf8");
var file  = fmc.parse_file(code);
var js    = fmcjs(file);
var lib   = eval(fmcjs(file));
var code  = `
  main: Any
    ((f) (x) f(f(x)))((f) (x) f(f(x)))
`;
var [code, file] = lib.parse_file(code)(null)(x=>x)(a=>b=>([a,b]));
var term = lib.get_term(file)("main")(null)(x => x);
var term = lib.normalize(term)(lib.empty);
console.log(lib.stringify_term(term));
