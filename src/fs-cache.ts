import fs from "fs";
import path from "path";
import { promisify } from "util";
import { version } from "./version";
import { Loader } from "./loader";

const async_read_file = promisify(fs.readFile);
const async_write_file = promisify(fs.writeFile);

/**
 * Transforms a file loader in order to add local file system cache.
 * Useful when using Formality in a NodeJS environment.
 * @param loader The base loader to add cache on top of.
 * @param cache_dir_path The file system directory to save cached files.
 * Defaults to "./fm_modules".
 * @returns The transformed loader.
 */
export const with_file_system_cache = (
  loader: Loader,
  cache_dir_path?: string
): Loader => async file => {
  const dir_path = cache_dir_path || path.join(process.cwd(), "fm_modules");

  // Setup Cache dir
  const version_file_path = path.join(dir_path, "version");
  const has_cache_dir = fs.existsSync(dir_path);
  const has_version_file = has_cache_dir && fs.existsSync(version_file_path);
  const correct_version =
    has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
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
  if (fs.existsSync(cached_file_path)) {
    return await async_read_file(cached_file_path, "utf8");
  }

  const code = await loader(file);

  await async_write_file(cached_file_path, code, "utf8");

  return code;
};
