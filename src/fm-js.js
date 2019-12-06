const fm = require("./fm-core.js");

// Converts a Formality-Core Term to a native JavaScript function
const compile = (term, defs = {}, depth = 0) => {
  var seen = {};
  var code = "";
  var result = (function go(term, depth) {
    var [ctor, term] = term;
    switch (ctor) {
      case "Var":
        return "_" + (depth - term.index - 1);
      case "Lam":
        var body = go(term.body, depth + 1);
        return "(_"+depth+"=>"+body+")";
      case "App":
        var func = go(term.func, depth);
        var argm = go(term.argm, depth);
        return func+"("+argm+")";
      case "Log":
        return go(term.expr, depth);
      case "Ref":
        var name = term.name.replace(/\./g,"_").replace(/\//g,"$").replace(/#/g,"$");
        if (!seen[term.name]) {
          seen[term.name] = true;
          var dref = go(fm.erase(defs[term.name]), depth);
          code += "  var "+name+" = "+dref+";\n";
        }
        return name;
    }
  })(term, 0);
  return "(function(){\n"+code+"  return "+result+";\n})()";
};

module.exports = {compile};
