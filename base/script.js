var fs = require("fs");

function go(dir) {
  var files = fs.readdirSync(dir);
  for (var path of files) {
    var full_path = dir+"/"+path;
    if (path.slice(-3) === ".fm") {
      fs.renameSync(full_path, full_path.replace(".fm", ".kind"));
    } else if (path.indexOf(".") === -1) {
      go(full_path);
    }
  }
}

go(".");
