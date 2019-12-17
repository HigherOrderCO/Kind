import * as core from "./core.js";

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
    case "Val":
      return String(term.numb);
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = go(term.num0, depth);
      var num1 = go(term.num1, depth);
      switch (func) {
        case ".+."   : return "(" + num0 + "+" + num1 + ")";
        case ".-."   : return "(" + num0 + "-" + num1 + ")";
        case ".*."   : return "(" + num0 + "*" + num1 + ")";
        case "./."   : return "(" + num0 + "/" + num1 + ")";
        case ".%."   : return "(" + num0 + "%" + num1 + ")";
        case ".**."  : return "(" + num0 + "**" + num1 + ")";
        case ".&."   : return "(" + num0 + "&" + num1 + ")";
        case ".|."   : return "(" + num0 + "|" + num1 + ")";
        case ".^."   : return "(" + num0 + "^" + num1 + ")";
        case ".~."   : return "(~" + num1 + ")";
        case ".>>>." : return "(" + num0 + ">>>" + num1 + ")";
        case ".<<."  : return "(" + num0 + "<<" + num1 + ")";
        case ".>."   : return "(" + num0 + ">" + num1 + ")";
        case ".<."   : return "(" + num0 + "<" + num1 + ")";
        case ".==."  : return "(" + num0 + "===" + num1 + "? 1 : 0)";
        default: throw "TODO: implement operator "
      }
    case "Ite":
      var cond = go(term.cond, depth);
      var if_t = go(term.if_t, depth);
      var if_f = go(term.if_f, depth);
      return "(" + cond + "?" + if_t + ":" + if_f + ")";
    case "Log":
      return go(term.expr, depth);
    case "Ref":
      var name = term.name.replace(/\./g,"_").replace(/\//g,"$").replace(/#/g,"$");
      if (!seen[term.name]) {
        seen[term.name] = true;
        var dref = go(core.erase(defs[term.name]), depth);
        code += "  var _"+name+" = "+dref+";\n";
      }
      return "_"+name;
    }
  })(term, 0);
  return "(function(){\n"+code+"  return "+result+";\n})()";
};

export {compile};
