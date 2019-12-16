'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

function _interopNamespace(e) {
  if (e && e.__esModule) { return e; } else {
    var n = {};
    if (e) {
      Object.keys(e).forEach(function (k) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      });
    }
    n['default'] = e;
    return n;
  }
}

var xhr = _interopDefault(require('xhr-request-promise'));
var version = require('./version.js');

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

// :::::::::::::::::::::::::::::
// :: Env-specific decorators ::
// :::::::::::::::::::::::::::::
// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a path to save the files
//
// with_file_system_cache(
//   loader: String -> Promise<String>,
//   cache_dir_path?: String
// ) -> Promise<String>


// Transforms a file loader in order to add local files for development.
// It receives the file loader and optionally, a path where the files are
//
// with_local_files(
//   loader: String -> Promise<String>,
//   local_dir_path?: String
// ) -> Promise<String>


// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a prefix for the local storage key
// defaulting to `FPM@${FM_VERSION}/`
//
// with_local_storage_cache(
//   loader: String -> Promise<String>,
//   prefix?: String
// ) -> Promise<String>


if(typeof window === "object") {
  exports.with_local_files = exports.with_file_system_cache = () => {
    throw "Only available when running in NodeJS"
  };

  exports.with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
    const cached = window.localStorage.getItem(prefix + file);
    if(cached) {
      return cached;
    }
  
    const code = await loader(file);
  
    window.localStorage.setItem(prefix + file, code);
  
    return code;
  };
}
else {
  exports.with_local_storage_cache = () => {
    throw "Only available when running in Browser"
  };

  const fs_promise = new Promise(function (resolve) { resolve(_interopNamespace(require('fs'))); });
  const path_promise = new Promise(function (resolve) { resolve(_interopNamespace(require('path'))); });
  const util_promise = new Promise(function (resolve) { resolve(_interopNamespace(require('util'))); });

  const imports = (async () => {
    const fs = await fs_promise;
    const path = await path_promise;
    const {promisify} = await util_promise;

    const async_read_file = promisify(fs.readFile);
    const async_write_file = promisify(fs.writeFile);

    return {fs, path, async_read_file, async_write_file};
  })();

  exports.with_file_system_cache = (loader, cache_dir_path) => async (file) => {
    const {fs, path, async_read_file, async_write_file} = await imports;

    const dir_path = cache_dir_path || path.join(process.cwd(), "fm_modules");

    // Setup Cache dir
    const version_file_path = path.join(dir_path, "version");
    const has_cache_dir = fs.existsSync(dir_path);
    const has_version_file = has_cache_dir && fs.existsSync(version_file_path);
    const correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
    if (!has_cache_dir || !has_version_file || !correct_version) {
      if (has_cache_dir) {
        const files = fs.readdirSync(dir_path);
        for (var i = 0; i < files.length; ++i) {
          fs.unlinkSync(path.join(dir_path, files[i]));
        }
        fs.rmdirSync(dir_path);
      }
      fs.mkdirSync(dir_path);
      fs.writeFileSync(version_file_path, version);
    }

    const cached_file_path = path.join(dir_path, file + ".fm");
    if(fs.existsSync(cached_file_path)) {
      return await async_read_file(cached_file_path, "utf8");
    }
    
    const code = await loader(file);

    await async_write_file(cached_file_path, code, "utf8");

    return code;
  };

  exports.with_local_files = (loader, local_dir_path) => async (file) => {
    const {fs, path, async_read_file} = await imports;
    const dir_path = local_dir_path || process.cwd();
    const local_file_path = path.join(dir_path, file + ".fm");
    const has_local_file = fs.existsSync(local_file_path);

    if(has_local_file) {
      return await async_read_file(local_file_path, "utf8");
    }

    return await loader(file);
  };

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

var loader = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load_file_parents: load_file_parents,
  load_file: load_file,
  save_file: save_file,
  get with_file_system_cache () { return exports.with_file_system_cache; },
  get with_local_files () { return exports.with_local_files; },
  get with_local_storage_cache () { return exports.with_local_storage_cache; }
});

exports.load_file = load_file;
exports.load_file_parents = load_file_parents;
exports.loader = loader;
exports.save_file = save_file;
