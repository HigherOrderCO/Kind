// Saves files to forall

const lang = require("../fm-lang.js")
const {load_file} = require("./loaders")
const {urls, format_name, xhr} = require("./utils")

/**
 * @typedef FileReference
 * @type {object}
 * @property {string} name
 * @property {string} version
 */

/**
 * @typedef SaveFileOpts
 * @type {object}
 * @property {Function} checker - A function that checks for forall constraints with signature
 * string -> Promise<boolean>. Defaults to `checker()`
 */

/**
 * Saves a file to Forall and checks for collision. Raises an error if a collision occurs.
 * @param {string} name - The name of the file
 * @param {string} code - The code to be saved
 * @param {SaveFileOpts} opts - Options for saving the file
 * @returns {FileReference} The file reference to the saved file, if succeeded.
 */
async function save_file(name, code, opts = {}) {
  const check_fn = opts.checker || checker()

  if(!(await check_fn(code))) throw "Code does not pass forall code"

  let file_reference
  try {
    const {data} = await xhr(urls.create_file,{
      method: "POST",
      json: true,
      body: {name, code}
    })

    file_reference = data
  } catch({data}) {
    // TODO: Handle better the return of file save
    throw data
  }

  const saved_code = await poll_for(async () => await load_file(file_reference), 100, 50);
  if(saved_code != code) throw `Version collision while saving ${format_name(file_reference)}.`;
  return file_reference;
}

/**
 * Builds a file checker that complies to forall requirements.
 * @callback loader
 * @returns {Function} A function that returns a `Promise<boolean>`.
 */
function checker(loader = load_file) {
  const file = "local";
  const is_local_def = (name) => name.indexOf(file) === 0;
  const local_def_names = (defs) => Object.keys(defs).filter(is_local_def);
  const all_typechecks = (names, defs) => {
    const incorrect = names.filter((name) => !typechecks(name, defs))
    return incorrect.length === 0
  }

  const typechecks = (name, defs) => {
    try {
      lang.typecheck(defs[name], null, {no_logs: true, defs})
      return true;
    } catch(e) {
      return false;
    }
  }

  return async function check_requirements(code){
    try {
      const { defs } = await lang.parse(code, {file, loader})

      return all_typechecks(local_def_names(defs), defs);
    } catch(e) {
      return false
    }
  }
}

module.exports = {
  save_file,
  checker
}


async function poll_for(fn, interval, tries){
  try {
    return await fn()
  } catch(e) {
    if(tries && tries <= 0) throw e;
    await delay(interval);
    return poll_for(fn, interval, tries-1);
  }
}

const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))