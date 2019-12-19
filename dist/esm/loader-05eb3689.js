import xhr from 'xhr-request-promise';

// This module is responsible for loading and publishing files from the Forall repository
// load_file receives the name of the file and returns the code asyncronously
//
// load_file(file: String) -> Promise<String>
/**
 * Returns the code saved on FPM given by a full file name (file name with hash).
 * It fails if the file does not exist.
 * @param file The full file name to be loaded, with hash
 */
var load_file = function (file) {
    return post("load_file", { file: file });
};
/**
 * Saves a code to FPM using `file` as name. It may fail. The resulting
 * @param name The name of the file to be saved
 * @param code The content of the file, aka the code
 * @returns The full file name saved to FPM, which is basically the `file` with a hash concatenated.
 */
var save_file = function (file, code) {
    return post("save_file", { file: file, code: code });
};
/**
 * Returns a list of parents for a given file name. A parent is a file which depends on this file.
 * @param file The file name to fetch parents
 * @returns A list of parents for a given file name
 */
var load_file_parents = function (file) {
    return post("load_file_parents", { file: file });
};
// The current API is just a simple RPC, so this function helps a lot
var post = function (func, body) {
    return xhr("http://moonad.org/api/" + func, {
        method: "POST",
        json: true,
        body: body
    }).then(function (res) {
        if (res[0] === "ok") {
            return res[1];
        }
        else {
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

export { load_file as a, loader as b, load_file_parents as l, save_file as s };
