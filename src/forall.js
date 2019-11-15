// This module is responsible for loading and publishing files from the Forall repository
// For now this is using the deprecated moonad.org/api repository, but will be updated to the newer
// Forall API once the service is deployed and ready to be used.
//
// This also exports a few "loader decorators" to enable caching depending on the environment

const xhr = require("xhr-request-promise");
const version = require("./../package.json").version;

// Load file related things only on node
const {fs, path, async_read_file, async_write_file} = (
  typeof window === "object"
  ? () => ({})
  : () => {
    const {promisify} = eval('require("util")');
    const path = eval('require("path")');
    const fs = eval('require("fs")');

    const async_read_file = promisify(fs.readFile)
    const async_write_file = promisify(fs.writeFile)

    return {fs, path, async_read_file, async_write_file}
  }
)()

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

// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a path to save the files
//
// with_file_system_cache(
//   loader: String -> Promise<String>,
//   cache_dir_path?: String
// ) -> Promise<String>
const with_file_system_cache = (loader, cache_dir_path) => async (file) => {
  const dir_path = cache_dir_path || get_default_fs_cache_path();
  setup_cache_dir(dir_path);
  const cached_file_path = path.join(dir_path, file + ".fm");
  if(fs.existsSync(cached_file_path)) {
    return await async_read_file(cached_file_path, "utf8");
  }

  const code = await loader(file)

  await async_write_file(cached_file_path, code, "utf8");

  return code;
}

// Transforms a file loader in order to add local files for development.
// It receives the file loader and optionally, a path where the files are
//
// with_local_files(
//   loader: String -> Promise<String>,
//   local_dir_path?: String
// ) -> Promise<String>
const with_local_files = (loader, local_dir_path) => async (file) => {
  const dir_path = local_dir_path || process.cwd();
  const local_file_path = path.join(dir_path, file + ".fm");
  const has_local_file = fs.existsSync(local_file_path);

  if(has_local_file) {
    return await async_read_file(local_file_path, "utf8");
  }

  return await loader(file);
}

// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a prefix for the local storage key
// defaulting to `FPM@${FM_VERSION}/`
//
// with_local_storage_cache(
//   loader: String -> Promise<String>,
//   prefix?: String
// ) -> Promise<String>
const with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
  const cached = window.localStorage.getItem(prefix + file)
  if(cached) {
    return cached;
  }

  const code = await loader(file)

  window.localStorage.setItem(prefix + file, code)

  return code;
}

module.exports = {
  load_file_parents,
  load_file,
  save_file,
  with_file_system_cache,
  with_local_files,
  with_local_storage_cache,
}

// Utils not exported

const get_default_fs_cache_path = () => path.join(process.cwd(), "fm_modules");

const setup_cache_dir = (cache_dir_path) => {
  var version_file_path = path.join(cache_dir_path, "version");
  var has_cache_dir = fs.existsSync(cache_dir_path);
  var has_version_file = has_cache_dir && fs.existsSync(version_file_path);
  var correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
  if (!has_cache_dir || !has_version_file || !correct_version) {
    if (has_cache_dir) {
      var files = fs.readdirSync(cache_dir_path);
      for (var i = 0; i < files.length; ++i) {
        fs.unlinkSync(path.join(cache_dir_path, files[i]));
      }
      fs.rmdirSync(cache_dir_path);
    }
    fs.mkdirSync(cache_dir_path);
    fs.writeFileSync(version_file_path, version);
  }
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
