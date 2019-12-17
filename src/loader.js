// This module is responsible for loading and publishing files from the Forall repository
// For now this is using the deprecated moonad.org/api repository, but will be updated to the newer
// Forall API once the service is deployed and ready to be used.
//
// This also exports a few "loader decorators" to enable caching depending on the environment

import xhr from "xhr-request-promise";
import version from "./version.js";

// load_file receives the name of the file and returns the code asyncronously
//
// load_file(file: String) -> Promise<String>
const load_file = (file) => {
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

export {
  load_file_parents,
  load_file,
  save_file
}

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
