// Transforms a file loader in order to add local file system cache.
// It receives the file loader and optionally, a prefix for the local storage key
// defaulting to `FPM@${FM_VERSION}/`
//
// with_local_storage_cache(
//   loader: String -> Promise<String>,
//   prefix?: String
// ) -> Promise<String>
const with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
  const cached = window.localStorage.getItem(prefix + file);
  if(cached) {
    return cached;
  }

  const code = await loader(file);

  window.localStorage.setItem(prefix + file, code);

  return code;
};

export default with_local_storage_cache;
