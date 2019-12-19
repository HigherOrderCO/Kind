import { a as __awaiter, b as __generator } from './_tslib-02025546.js';
import version from './version.js';

/**
 * Transforms a file loader in order to cache using local storage.
 * Useful when using formality in a browser.
 * @param loader The base loader to add cache on top of
 * @param prefix The prefix for local storage keys.
 * Defaults to "FPM@" + current version of Formality to burn cache if Formality itself updates.
 * @returns The transformed loader.
 */
var with_local_storage_cache = function (loader, prefix) {
    if (prefix === void 0) { prefix = "FPM@" + version + "/"; }
    return function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var cached, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cached = window.localStorage.getItem(prefix + file);
                    if (cached) {
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, loader(file)];
                case 1:
                    code = _a.sent();
                    window.localStorage.setItem(prefix + file, code);
                    return [2 /*return*/, code];
            }
        });
    }); };
};

export default with_local_storage_cache;
