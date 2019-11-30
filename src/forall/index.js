// This module is responsible for loading and publishing files from the Forall repository
// For now this is using the deprecated moonad.org/api repository, but will be updated to the newer
// Forall API once the service is deployed and ready to be used.
//
// This also exports a few "loader decorators" to enable caching depending on the environment

const utils = require("./utils")
const saver = require("./saver")
const loaders = require("./loaders")
const decorators = require("./loader_decorators")

module.exports = {
  parse_name: utils.parse_name,
  format_name: utils.format_name,
  checker: saver.checker,
  load_file_metadata: loaders.load_file_metadata,
  load_file_parents: loaders.load_file_parents,
  load_file: loaders.load_file,
  save_file: saver.save_file,
  with_file_system_cache: decorators.with_file_system_cache,
  with_local_files: decorators.with_local_files,
  with_local_storage_cache: decorators.with_local_storage_cache,
}