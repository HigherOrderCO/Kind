var fms = require("./FormalitySynt.js");
var fml = require("./FormalityLang.js");

module.exports = ({XMLHttpRequest, fs, localStorage}) => {
  // On node, create .fmc directory if it doesn't exist
  if (fs && !fs.existsSync(".fmc")) {
    fs.mkdirSync(".fmc");
  }

  var version = null;

  async function validate_cache(urls) {
    try {
      if (!version) {
        version = await load_code_from_moonad("Version", urls);
      }
    } catch (e) {
      return;
    }

    // On node, invalidate cache when version changed
    if (fs && (!fs.existsSync("./.fmc/Version.fmc","utf8") || fs.readFileSync("./.fmc/Version.fmc","utf8") !== version)) {
      var files = fs.readdirSync("./.fmc");
      for (var file of files) {
        if (file.slice(-4) === ".fmc") {
          fs.unlinkSync("./.fmc/"+file);
        }
      }
      fs.writeFileSync("./.fmc/Version.fmc", version);
    }

    // On browser, invalidate cache when version changed
    if (localStorage && localStorage.getItem("./.fmc/Version.fmc") !== version) {
      for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if (key.slice(-4) === ".fmc") {
          localStorage.removeItem(key);
        }
      }
      localStorage.setItem("./.fmc/Version.fmc", version);
    }
  };

  // Loads a core definition from moonad.org
  function load_code_from_moonad(name, urls) {
    urls = urls || ["http://localhost/c/","http://moonad.org/c/"];
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

  // Attempts to type-synth a term. If it fails due to an undefined reference
  // downloads the missing file from moonad.org, caches (on the .fmc directory
  // or on localStorage) and attempts again.  Note: it is impossible to find a
  // term's dependencies before type-checking it, because `case` expressions can
  // add lambdas that depend on the type. For example:
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
  async function load_and_typesynth(name, defs, show = fml.stringify, debug = false, urls) {
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
            var dep_name = msg.slice(err.length + 2, -2);
            var dep_path = ".fmc/"+dep_name+".fmc";
            try {
              // Checks if we have it on disk
              if (fs && fs.existsSync(dep_path)) {
                var dep_code = fs.readFileSync(dep_path, "utf8");

              // Checks if we have it on localStorage
              } else if (localStorage && localStorage.getItem(dep_path)) {
                var dep_code = localStorage.getItem(dep_path);

              // Otherwise, load it from moonad.org
              } else {
                await validate_cache();
                if (debug) console.log("... downloading http://moonad.org/c/"+dep_name);
                var dep_code = await load_code_from_moonad(dep_name, urls);
              };

              // Parses dep
              var {defs: new_defs} = fms.parse(dep_code);

              // Caches deps on disk
              if (fs) {
                fs.writeFileSync(dep_path, dep_code);
              }

              // Caches deps on localStorage
              if (localStorage) {
                localStorage.setItem(dep_path, dep_code);
              }

              // Adds to the defs object
              for (var new_def in new_defs) {
                defs[new_def] = new_defs[new_def];
              };

              // Synths deps
              for (var new_def in new_defs) {
                await load_and_typesynth(new_def, defs, show, debug, urls);
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
    load_code_from_moonad,
    load_and_typesynth,
  };
};
