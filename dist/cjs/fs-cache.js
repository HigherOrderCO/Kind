'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var _tslib = require('./_tslib-cfb3c16c.js');
var version = require('./version.js');
var path = _interopDefault(require('path'));
var util = require('util');

var async_read_file = util.promisify(fs.readFile);
var async_write_file = util.promisify(fs.writeFile);
/**
 * Transforms a file loader in order to add local file system cache.
 * Useful when using Formality in a NodeJS environment.
 * @param loader The base loader to add cache on top of.
 * @param cache_dir_path The file system directory to save cached files.
 * Defaults to "./fm_modules".
 * @returns The transformed loader.
 */
var with_file_system_cache = function (loader, cache_dir_path) { return function (file) { return _tslib.__awaiter(void 0, void 0, void 0, function () {
    var dir_path, version_file_path, has_cache_dir, has_version_file, correct_version, files, i, cached_file_path, code;
    return _tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir_path = cache_dir_path || path.join(process.cwd(), "fm_modules");
                version_file_path = path.join(dir_path, "version");
                has_cache_dir = fs.existsSync(dir_path);
                has_version_file = has_cache_dir && fs.existsSync(version_file_path);
                correct_version = has_version_file && fs.readFileSync(version_file_path, "utf8") === version;
                if (!has_cache_dir || !has_version_file || !correct_version) {
                    if (has_cache_dir) {
                        files = fs.readdirSync(dir_path);
                        for (i = 0; i < files.length; ++i) {
                            fs.unlinkSync(path.join(dir_path, files[i]));
                        }
                        fs.rmdirSync(dir_path);
                    }
                    fs.mkdirSync(dir_path);
                    fs.writeFileSync(version_file_path, version);
                }
                cached_file_path = path.join(dir_path, file + ".fm");
                if (!fs.existsSync(cached_file_path)) return [3 /*break*/, 2];
                return [4 /*yield*/, async_read_file(cached_file_path, "utf8")];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, loader(file)];
            case 3:
                code = _a.sent();
                return [4 /*yield*/, async_write_file(cached_file_path, code, "utf8")];
            case 4:
                _a.sent();
                return [2 /*return*/, code];
        }
    });
}); }; };

module.exports = with_file_system_cache;
