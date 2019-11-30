// Decorators of the loader function for caching and other functionality

const version = require("../../package.json").version;

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

/**
 * Transforms a file loader in order to add local file system cache.
 * @param {Function} loader - A file loader, a function of signature string -> Promise<string>
 * @param {string|undefined} cache_dir_path - Overrides the path where files are saved, defaulting
 * to "fm_modules".
 * @returns {Function} - The decorated file loader, with signature string -> Promise<string>
 */
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

/**
 * Transforms a file loader in order to add local files for development.
 * @param {Function} loader - A file loader, a function of signature string -> Promise<string>
 * @param {string|undefined} local_dir_path - Overrides the path where local files are loaded from,
 * defaults to current directory (".")
 * @returns {Function} - The decorated file loader, with signature string -> Promise<string>
 */
const with_local_files = (loader, local_dir_path) => async (file) => {
  const dir_path = local_dir_path || process.cwd();
  const local_file_path = path.join(dir_path, file + ".fm");
  const has_local_file = fs.existsSync(local_file_path);

  if(has_local_file) {
    return await async_read_file(local_file_path, "utf8");
  }

  return await loader(file);
}

/**
 * Transforms a file loader in order to add local storage cache, useful when running on Browsers.
 * @param {Function} loader - A file loader, a function of signature string -> Promise<string>
 * @param {string|undefined} prefix - Overrides the local storage key prefix for saving files,
 * defaults to `FPM@${FM_VERSION}/`
 * @returns {Function} - The decorated file loader, with signature string -> Promise<string>
 */
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
  with_file_system_cache,
  with_local_files,
  with_local_storage_cache
}

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