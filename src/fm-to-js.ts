import * as core from "./core";

// Converts a Formality-Core Term to a native JavaScript function
const compile = (term: core.Term, defs: core.Defs = {}): string => {
  var seen = {};
  var code = "";
  var result = (function go(term: core.Term, depth: number): string {
    switch (term[0]) {
      case "Var":
        return "_" + (depth - term[1].index - 1);
      case "Lam":
        var body = go(term[1].body, depth + 1);
        return "(_" + depth + "=>" + body + ")";
      case "App":
        var func = go(term[1].func, depth);
        var argm = go(term[1].argm, depth);
        return func + "(" + argm + ")";
      case "Val":
        return String(term[1].numb);
      case "Op1":
      case "Op2":
        var func = term[1].func;
        var num0 = go(term[1].num0, depth);
        var num1 = go(term[1].num1, depth);
        switch (func) {
          case ".+.":
            return "(" + num0 + "+" + num1 + ")";
          case ".-.":
            return "(" + num0 + "-" + num1 + ")";
          case ".*.":
            return "(" + num0 + "*" + num1 + ")";
          case "./.":
            return "(" + num0 + "/" + num1 + ")";
          case ".%.":
            return "(" + num0 + "%" + num1 + ")";
          case ".**.":
            return "(" + num0 + "**" + num1 + ")";
          case ".&.":
            return "(" + num0 + "&" + num1 + ")";
          case ".|.":
            return "(" + num0 + "|" + num1 + ")";
          case ".^.":
            return "(" + num0 + "^" + num1 + ")";
          case ".~.":
            return "(~" + num1 + ")";
          case ".>>>.":
            return "(" + num0 + ">>>" + num1 + ")";
          case ".<<.":
            return "(" + num0 + "<<" + num1 + ")";
          case ".>.":
            return "(" + num0 + ">" + num1 + ")";
          case ".<.":
            return "(" + num0 + "<" + num1 + ")";
          case ".==.":
            return "(" + num0 + "===" + num1 + "? 1 : 0)";
          default:
            throw "TODO: implement operator ";
        }
      case "Ite":
        var cond = go(term[1].cond, depth);
        var if_t = go(term[1].if_t, depth);
        var if_f = go(term[1].if_f, depth);
        return "(" + cond + "?" + if_t + ":" + if_f + ")";
      case "Log":
        return go(term[1].expr, depth);
      case "Ref":
        var name = term[1].name
          .replace(/\./g, "_")
          .replace(/\//g, "$")
          .replace(/#/g, "$");
        if (!seen[term[1].name]) {
          seen[term[1].name] = true;
          var dref = go(core.erase(defs[term[1].name]), depth);
          code += "  var _" + name + " = " + dref + ";\n";
        }
        return "_" + name;
    }
  })(term, 0);
  return "(function(){\n" + code + "  return " + result + ";\n})()";
};

export { compile };
