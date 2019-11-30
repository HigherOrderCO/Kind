// Shared utils for forall modules

const request = require('xhr-request')

/**
 * @typedef FileReference
 * @type {object}
 * @property {string} name
 * @property {string} version
 */

/**
 * Converts a name as in Formality (formatted as {name}#{version}) to a structured json
 * @param {string} name
 * @returns {FileReference|undefined} The parsed parts of a name
 */
function parse_name(name){
  const match = name.match(name_regexp)
  if(match) {
    return {name: match[1], version: match[2]}
  }
}

/**
 * Formats a name from a file reference
 * @param {FileReference} file_reference
 * @returns {string} The string formatted for Formality, such that if parsed with `parse_name` will
 * return the same structure.
 */
function format_name({name, version}){
  return `${name}#${version}`
}

// TODO: Change to files.forall.fm. For now Digital Ocean is behaving weirdly, so we are getting
// the file from Spaces Origin instead of getting it from the CDN
const cdn_url = "https://forall.nyc3.digitaloceanspaces.com"
const api_url = "https://forall.fm/api"

const urls = {
  create_file: `${api_url}/files/`,
  get_file: ({name, version}) => `${cdn_url}/${name}/${version}.fm`,
  get_file_metadata: ({name, version}) => `${api_url}/files/${name}/${version}`
}

const xhr = function (url, options) {
  return new Promise(function (resolve, reject) {
    request(url, options, function (err, data, response) {
      if (err) reject(err);
      else if(response.statusCode >= 400) reject({...response, data})
      else resolve({...response, data});
    });
  });
};

module.exports = {
  parse_name,
  format_name,
  urls,
  xhr
}

const name_regexp = (() => {
  const chars = "a-zA-Z0-9_\\-";
  const dotted = `[${chars}]+[${chars}\\.]*`;
  const hash = `[${chars}]+`;
  return new RegExp(`(${dotted})#(${hash})`);
})();