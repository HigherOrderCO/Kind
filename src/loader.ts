// This module is responsible for loading and publishing files from the Forall repository
// For now this is using the deprecated moonad.org/api repository, but will be updated to the newer
// Forall API once the service is deployed and ready to be used.
import xhr from "xhr-request-promise";

/**
 * A Loader is basically a function that returns the code for a name asynchronously.
 */
type Loader = (file: string) => Promise<string>;

// load_file receives the name of the file and returns the code asyncronously
//
// load_file(file: String) -> Promise<String>

/**
 * Returns the code saved on FPM given by a full file name (file name with hash).
 * It fails if the file does not exist.
 * @param file The full file name to be loaded, with hash
 */
const load_file: Loader = file => {
  return post("load_file", { file });
};

/**
 * Saves a code to FPM using `file` as name. It may fail. The resulting
 * @param name The name of the file to be saved
 * @param code The content of the file, aka the code
 * @returns The full file name saved to FPM, which is basically the `file` with a hash concatenated.
 */
const save_file = (file: string, code: string): Promise<string> =>
  post("save_file", { file, code });

/**
 * Returns a list of parents for a given file name. A parent is a file which depends on this file.
 * @param file The file name to fetch parents
 * @returns A list of parents for a given file name
 */
const load_file_parents = (file: string): Promise<string[]> =>
  post("load_file_parents", { file });

export { Loader, load_file_parents, load_file, save_file };

// The current API is just a simple RPC, so this function helps a lot
const post = (func, body) => {
  return xhr("https://forall.fm/api/" + func, {
    method: "POST",
    json: true,
    body
  }).then(res => {
    if (res[0] === "ok") {
      return res[1];
    } else {
      throw res[1];
    }
  });
};
