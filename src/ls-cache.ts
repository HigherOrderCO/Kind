import version from "./version";
import { Loader } from "./loader";

/**
 * Transforms a file loader in order to cache using local storage.
 * Useful when using formality in a browser.
 * @param loader The base loader to add cache on top of
 * @param prefix The prefix for local storage keys.
 * Defaults to "FPM@" + current version of Formality to burn cache if Formality itself updates.
 * @returns The transformed loader.
 */
const with_local_storage_cache = (
  loader: Loader,
  prefix = `FPM@${version}/`
): Loader => async file => {
  const cached = window.localStorage.getItem(prefix + file);
  if (cached) {
    return cached;
  }

  const code = await loader(file);

  window.localStorage.setItem(prefix + file, code);

  return code;
};

export default with_local_storage_cache;
