var fs = require("fs");
var path = require("path");
var cachedir = path.join(__dirname, "../.fmcache");
var memo_path = key => path.join(cachedir, key);

function get(key) {
  var mpath = memo_path(key);
  if (fs.existsSync(mpath)) {
    return fs.readFileSync(mpath, "utf8");
  } else {
    return null;
  }
}

function set(key,val) {
  var mpath = memo_path(key);
  if (!fs.existsSync(cachedir)) {
    fs.mkdirSync(cachedir);
  }
  fs.writeFileSync(mpath, val);
  return null;
}

function del(key) {
  var mpath = memo_path(key);
  if (fs.existsSync(mpath)) {
    fs.unlinkSync(mpath);
  }
}

module.exports = {get, set, del};

/*
        var cache = require("./cache.js");
        if (_done$6) {
          var new_cached_term = Fm$Term$show(_term$4);
          var new_cached_type = Fm$Term$show(_type$5);
          cache.set(_name$3+".cached.term", new_cached_term);
          cache.set(_name$3+".cached.type", new_cached_type);
          //console.log("");
          //console.log("CACHE ", _name$3);
          //console.log("new_cached_type", new_cached_type);
          //console.log("new_cached_term", new_cached_term);
          return Fm$set(_name$3)(Fm$Def$new(_file$1)(_code$2)(_name$3)(_term$4)(_type$5)(_stat$9))(_defs$7)
        } else {
          var old_cached_term = cache.get(_name$3+".cached.term");
          var old_cached_type = cache.get(_name$3+".cached.type");
          var old_source_term = cache.get(_name$3+".source.term");
          var old_source_type = cache.get(_name$3+".source.type");
          var new_source_term = Fm$Term$show(_term$4);
          var new_source_type = Fm$Term$show(_type$5);
          //console.log("");
          //console.log("DEFINE ", _name$3);
          //console.log("old_source_type", old_source_type);
          //console.log("new_source_type", new_source_type);
          //console.log("old_cached_type", old_cached_type);
          //console.log("old_source_term", old_source_term);
          //console.log("new_source_term", new_source_term);
          //console.log("old_cached_term", old_cached_term);
          cache.set(_name$3+".source.term", new_source_term);
          cache.set(_name$3+".source.type", new_source_type);
          cache.del(_name$3+".cached.term");
          cache.del(_name$3+".cached.type");
          if ( old_source_term === new_source_term
            && old_source_type === new_source_type
            && old_cached_term
            && old_cached_type) {
            console.log("CACHED!",_name$3);
            try {
              console.log("cached:", old_cached_term);
              var cached_type = Fm$Term$read(old_cached_type).value;
              var cached_term = Fm$Term$read(old_cached_term).value;
              console.log("cached:", Fm$Term$show(cached_term));
              var cached_type = Fm$Term$bind(List$nil)(Bits$i)(cached_type);
              var cached_term = Fm$Term$bind(List$nil)(Bits$o)(cached_term);
              console.log("cached:", Fm$Term$show(cached_term));
              console.log("-------");
              return Fm$set(_name$3)(Fm$Def$new(_file$1)(_code$2)(_name$3)(cached_term)(cached_type)(_stat$9))(_defs$7)
            } catch (e) {
              console.log(e);
            }
          }
        }

*/
