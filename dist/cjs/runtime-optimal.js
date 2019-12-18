'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./errors.js');
require('./stringify.js');
require('./core-d72ddc22.js');
require('./fm-net-4e316c61.js');
var runtimeOptimal = require('./runtime-optimal-a2bb9ca1.js');



exports.compile = runtimeOptimal.compile;
exports.decompile = runtimeOptimal.decompile;
exports.norm = runtimeOptimal.norm;
exports.norm_with_stats = runtimeOptimal.norm_with_stats;
