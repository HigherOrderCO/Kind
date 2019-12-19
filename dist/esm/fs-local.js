import fs from 'fs';
import { a as __awaiter, b as __generator } from './_tslib-02025546.js';
import path from 'path';
import { promisify } from 'util';

var async_read_file = promisify(fs.readFile);
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
var with_local_files = function (loader, local_dir_path) { return function (file) { return __awaiter(void 0, void 0, void 0, function () {
    var dir_path, local_file_path, has_local_file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir_path = local_dir_path || process.cwd();
                local_file_path = path.join(dir_path, file + ".fm");
                has_local_file = fs.existsSync(local_file_path);
                if (!has_local_file) return [3 /*break*/, 2];
                return [4 /*yield*/, async_read_file(local_file_path, "utf8")];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, loader(file)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); }; };

export default with_local_files;
