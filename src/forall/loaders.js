// All side-effect free functions that interact with forall.

const {parse_name, urls, xhr} = require("./utils");

/**
 * @typedef FileReference
 * @type {object}
 * @property {string} name
 * @property {string} version
 */

/**
 * @typedef FileMetadata
 * @type {object}
 * @property {FileReference} reference
 * @property {FileReference[]} deep_imports
 * @property {FileReference[]} imported_by
 */

/** Loads the content of a file asynchornously
 * @param {string|FileReference} file
 * @returns {Promise<string>}
 */
async function load_file(file) {
  const file_reference = typeof file === "string" ? parse_name(file) : file;
  if(!file_reference) throw "Invalid file name";
  try {
    return (await xhr(urls.get_file(file_reference))).data;
  } catch (response) {
    if(response.statusCode === 404) throw "File not found on Forall";
    throw response.data || "Undefined error while getting file from forall";
  }
}

/** Receives a file name or reference and returns a list of parents for that file
 * @param {string|FileReference} file
 * @returns {Promise<FileReference[]>}
 */
async function load_file_parents(file) {
  return (await load_file_metadata(file)).imported_by
}

/** Receives a file name or reference and returns all metadata
 * @param {string|FileReference} file
 * @returns {Promise<FileMetadata>}
 */
async function load_file_metadata(file) {
  const file_reference = typeof file === "string" ? parse_name(file) : file;
  if(!file_reference) throw "Invalid file name";
  try {
    return (await xhr(urls.get_file_metadata(file_reference), {json: true})).data
  } catch (response) {
    if(response.statusCode === 404) throw "File not found on Forall";
    throw response.data || "Undefined error while getting file from forall";
  }
}

module.exports = {
  load_file,
  load_file_metadata,
  load_file_parents
}