var array   = require("./array.fmc").default;
var bits    = require("./bits.fmc").default;
var bool    = require("./bool.fmc").default;
var hash    = require("./hash.fmc").default;
var kaelin  = require("./kaelin.fmc").default;
var list    = require("./list.fmc").default;
var main    = require("./main.fmc").default;
var maybe   = require("./maybe.fmc").default;
var nat     = require("./nat.fmc").default;
var num     = require("./num.fmc").default;
var pair    = require("./pair.fmc").default;
var string  = require("./string.fmc").default;
var term    = require("./term.fmc").default;
var tree    = require("./tree.fmc").default;
var tuple   = require("./tuple.fmc").default;
var vector2 = require("./vector2.fmc").default;

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

