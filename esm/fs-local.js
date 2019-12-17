import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const async_read_file = promisify(fs.readFile);

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
};

export default with_local_files;
