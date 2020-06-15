var {XMLHttpRequest} = require("xmlhttprequest");
module.exports = require("./Formality.js")({XMLHttpRequest, fs: require("fs"), localStorage: null});
