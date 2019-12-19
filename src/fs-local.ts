import fs from "fs";
import path from "path";
import { promisify } from "util";
import { Loader } from "./loader";

const async_read_file = promisify(fs.readFile);

// Transforms a file loader in order to add local files for development.
// It receives the file loader and optionally, a path where the files are

/**
 * Transforms a file loader in order to add local files for development.
 * The way it works is that if a file isn't found in the local directory (specified by
 * local_dir_path) then it will fallback to the received loader. That way, local files overrides
 * remote files (from FPM, for example). This is basically useful on a development environment.
 * @param loader The base loader to fallback when there isn't a local file.
 * @param local_dir_path Where to look for local files.
 * @returns The transformed loader.
 */
const with_local_files = (
  loader: Loader,
  local_dir_path?: string
): Loader => async file => {
  const dir_path = local_dir_path || process.cwd();
  const local_file_path = path.join(dir_path, file + ".fm");
  const has_local_file = fs.existsSync(local_file_path);

  if (has_local_file) {
    return await async_read_file(local_file_path, "utf8");
  }

  return await loader(file);
};

export default with_local_files;
