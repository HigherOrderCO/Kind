'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var xhr = _interopDefault(require('xhr-request-promise'));
require('./version.js');

// This module is responsible for loading and publishing files from the Forall repository

// load_file receives the name of the file and returns the code asyncronously
//
// load_file(file: String) -> Promise<String>
const load_file = (file) => {
  console.log("Loading file", file);
  return post("load_file", {file});
};

// save_file receives the file name without the version, the code, and returns, asynchronously
// the saved global file name (with the version after the @).
//
// save_file(file: String, code: String) -> Promise<String>
const save_file = (file, code) => post("save_file", {file, code});

// Receives a file name and returns a list of parents for that file
//
// load_file_parents(file: String) -> Promise<String[]>
const load_file_parents = (file) => post("load_file_parents", {file});

// The current API is just a simple RPC, so this function helps a lot
const post = (func, body) => {
  return xhr("http://moonad.org/api/" + func,
    { method: "POST"
    , json: true
    , body})
    .then(res => {
      if (res[0] === "ok") {
        return res[1];
      } else {
        throw res[1];
      }
    });
};

var loader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load_file_parents: load_file_parents,
  load_file: load_file,
  save_file: save_file
});

exports.load_file = load_file;
exports.load_file_parents = load_file_parents;
exports.loader = loader;
exports.save_file = save_file;
