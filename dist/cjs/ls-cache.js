'use strict';

var version = require('./version.js');

// Transforms a file loader in order to add local file system cache.

const with_local_storage_cache = (loader, prefix = `FPM@${version}/`) => async (file) => {
  const cached = window.localStorage.getItem(prefix + file);
  if(cached) {
    return cached;
  }

  const code = await loader(file);

  window.localStorage.setItem(prefix + file, code);

  return code;
};

module.exports = with_local_storage_cache;
