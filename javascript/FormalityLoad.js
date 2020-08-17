var fms = require("./FormalitySynt.js");
var fml = require("./FormalityLang.js");

module.exports = ({XMLHttpRequest, fs, localStorage}) => {
  // On node, create .fmc directory if it doesn't exist
  if (fs && !fs.existsSync(".fmc")) {
    fs.mkdirSync(".fmc");
  }

  var default_urls = ["http://localhost/c/","http://moonad.org/c/"];

  // Loads a core definition from moonad.org
  function load_code({name, urls}) {
    urls = urls || default_urls;
    return new Promise((resolve, reject) => {
      function try_from(urls) {
        if (urls.length === 0) {
          reject("Couldn't load term.");
        } else {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', urls[0]+name);
          xhr.send();
          xhr.onload = function() {
            if ( xhr.status === 200
              && xhr.responseText
              && xhr.responseText[0] !== "-") {
              resolve(xhr.responseText);
            } else {
              try_from(urls.slice(1));
            }
          };
          xhr.onerror = function() {
            try_from(urls.slice(1));
          };
        };
      };
      try_from(urls);
    });
  };

  // Destroys the cache if the Moonad server signals the global version of the
  // lib directory changed. This only happens once on the application. If lib
  // changes during execution, you must refresh. When Moonad finally uses hashes
  // (no worries, John will never read this) this will improve considerably!
  async function destroy_outdated_cache({urls}) {
    urls = urls || default_urls;
    // On node, invalidate cache when version changed
    if (fs) {
      var file_path = "./.fmc/Version.fmc";
      if (fs.existsSync(file_path,"utf8")) {
        var last_check = new Date() - fs.statSync(file_path).mtime;
        // How much time (in milliseconds) until we check the cache again
        var cache_life = 1000 * 60 * 60 * 3; // 3 hours
        if (last_check < cache_life) {
          return;
        }
        var cached_version = fs.readFileSync(file_path,"utf8");
      } else {
        var cached_version = "<no_cache>";
      }
      var global_version = await load_code({name: "Version", urls});
      if (global_version !== cached_version) {
        await destroy_cache();
      }
      fs.writeFileSync("./.fmc/Version.fmc", global_version);
    }
    // On browser, invalidate cache when version changed
    if (localStorage) {
      var global_version = await load_code({name: "Version", urls});
      var cached_version = localStorage.getItem(".fmc/Version.fmc");
      if (global_version !== cached_version) {
        await destroy_cache();
      }
      localStorage.setItem(".fmc/Version.fmc", global_version);
    }
  };

  // Removes all cache files
  async function destroy_cache() {
    if (fs) {
      var files = fs.readdirSync("./.fmc");
      for (var file of files) {
        if (file.slice(-4) === ".fmc") {
          fs.unlinkSync("./.fmc/"+file);
        }
      }
    }
    if (localStorage) {
      var remove = [];
      for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if (key.slice(-4) === ".fmc") {
          remove.push(key);
        }
      }
      for (var i = 0; i < remove.length; ++i) {
        localStorage.removeItem(remove[i]);
      }
    }
  };

  // Attempts to type-synth a term. If it fails due to an undefined reference
  // downloads the missing file from moonad.org, caches (on the .fmc directory
  // or on localStorage) and attempts again. Returns {type,term}, and alters the
  // `defs` object, adding all missing dependencies. 
  // ---------------------------------------------------------------------------
  // Note: it is impossible to find a term's dependencies before type-checking
  // it, because `case` expressions can add lambdas that depend on the type. Ex:
  //   foo(n: Nat): Nat
  //     case n:
  //     | Nat.zero;
  //     | n.pred;
  // Is `n.pred` a variable, or a missing reference? It is only possible to know
  // when type-checking, and assuming we have the definition of Nat. Because of
  // that, it is impossible to write a loader that just downloads all
  // dependencies before doing any type-checking. The best we can do is to
  // type-check and, if there is a missing reference, download it and type-check
  // again. This function can be improved if typesynth returns multiple
  // undefined references, though. That would allow downloading many references
  // in parallel and decreasing the amount of calls to typesynth. This function
  // can also be improved aesthetically by making typesynth return an error
  // object instead of a string.
  async function load_synth({
    name,                 // name of dependency to load
    defs,                 // object with known defs
    show = fml.stringify, // stringify function
    urls,                 // urls to look for dependencies
    on_dependency,        // called when an undefined reference is found
    refresh_cache = true, // destroys invalid cache before loading dependencies
  }) {
    urls = urls || default_urls;

    // Repeatedly typesynths until either it works or errors, loading found deps
    while (true) {
      try {
        // Attempts to type-synth the term
        return fms.typesynth(name, defs, show);
      } catch (e) {

        // If we got an error
        if (typeof e === "function") {
          var msg = e().msg;
          var err = "Undefined reference";

          // If that error is an undefined reference
          if (msg.slice(0, err.length) === err) {
            var dep_name = msg.slice(err.length+2, msg.indexOf("'",err.length+2));
            var dep_path = ".fmc/"+dep_name+".fmc";
            var dep_defs = null;
            try {
              // Checks if there is a local definition
              if (fs) {
                var words = dep_name.split(".");
                while (true) {
                  var file = "./"+(words.join(".")||"global")+".fm";
                  if (fs.existsSync(file)) {
                    var dep_code = fs.readFileSync(file, "utf8");
                    try {
                      var {defs: got_defs} = fml.parse(dep_code);
                      if (got_defs[dep_name]) {
                        dep_defs = got_defs;
                        break;
                      }
                    } catch (e) {}
                  }
                  if (words.length === 0) {
                    break;
                  } else {
                    words.pop();
                  }
                }
              }

              // Checks if we have the global definition cached on disk
              if (!dep_defs) {
                if (refresh_cache) {
                  await destroy_outdated_cache({urls});
                }

                if (fs && fs.existsSync(dep_path)) {
                  var dep_code = fs.readFileSync(dep_path, "utf8");

                // Checks if we have the global definition cached on localStorage
                } else if (localStorage && localStorage.getItem(dep_path)) {
                  var dep_code = localStorage.getItem(dep_path);

                // Otherwise, load the global definition from moonad.org
                } else {
                  if (on_dependency) {
                    on_dependency(dep_name);
                  }
                  var dep_code = await load_code({name: dep_name, urls});
                };

                // Parses dep
                var {defs: dep_defs} = fms.parse(dep_code);

                // Caches deps on disk
                if (fs) {
                  fs.writeFileSync(dep_path, dep_code);
                }

                // Caches deps on localStorage
                if (localStorage) {
                  localStorage.setItem(dep_path, dep_code);
                }
              }

              // Adds to the defs object
              for (var dep_def in dep_defs) {
                defs[dep_def] = dep_defs[dep_def];
                defs[dep_def].code = dep_code;
              };

              // Synths deps
              for (var dep_def in dep_defs) {
                await load_synth({
                  name: dep_def,
                  defs,
                  show,
                  urls,
                  on_dependency,
                  refresh_cache: false, // only once per call
                });
              };
            } catch (_) {
              throw e;
            }
          } else {
            throw e;
          }
        } else {
          throw e;
        }
      }
    }
  };

  return {
    load_code,
    load_synth,
    destroy_outdated_cache,
    destroy_cache,
  };
};
