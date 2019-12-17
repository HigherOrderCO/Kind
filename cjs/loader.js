'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('xhr-request-promise');
require('./version.js');
var loader$1 = require('./loader-04d65ab6.js');



exports.load_file = loader$1.load_file;
exports.load_file_parents = loader$1.load_file_parents;
exports.save_file = loader$1.save_file;
Object.defineProperty(exports, 'with_file_system_cache', {
	enumerable: true,
	get: function () {
		return loader$1.with_file_system_cache;
	}
});
Object.defineProperty(exports, 'with_local_files', {
	enumerable: true,
	get: function () {
		return loader$1.with_local_files;
	}
});
Object.defineProperty(exports, 'with_local_storage_cache', {
	enumerable: true,
	get: function () {
		return loader$1.with_local_storage_cache;
	}
});
