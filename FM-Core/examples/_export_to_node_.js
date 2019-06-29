var fs      = require("fs");
var array   = fs.readFileSync(__dirname + "/array.fmc", "utf8");
var bits    = fs.readFileSync(__dirname + "/bits.fmc", "utf8");
var bool    = fs.readFileSync(__dirname + "/bool.fmc", "utf8");
var hash    = fs.readFileSync(__dirname + "/hash.fmc", "utf8");
var kaelin  = fs.readFileSync(__dirname + "/kaelin.fmc", "utf8");
var list    = fs.readFileSync(__dirname + "/list.fmc", "utf8");
var main    = fs.readFileSync(__dirname + "/main.fmc", "utf8");
var maybe   = fs.readFileSync(__dirname + "/maybe.fmc", "utf8");
var nat     = fs.readFileSync(__dirname + "/nat.fmc", "utf8");
var num     = fs.readFileSync(__dirname + "/num.fmc", "utf8");
var pair    = fs.readFileSync(__dirname + "/pair.fmc", "utf8");
var string  = fs.readFileSync(__dirname + "/string.fmc", "utf8");
var term    = fs.readFileSync(__dirname + "/term.fmc", "utf8");
var tree    = fs.readFileSync(__dirname + "/tree.fmc", "utf8");
var tuple   = fs.readFileSync(__dirname + "/tuple.fmc", "utf8");
var vector2 = fs.readFileSync(__dirname + "/vector2.fmc", "utf8");

module.exports = [
  array,
  bits,
  bool,
  hash,
  kaelin,
  list,
  main,
  maybe,
  nat,
  num,
  pair,
  string,
  term,
  tree,
  tuple,
  vector2,
].join("\n");

