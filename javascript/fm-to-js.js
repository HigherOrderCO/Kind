const fmc = require("./fm-core.js");

// Converts a Formality-Core Term to a native JavaScript function
const compile = ([ctor, term], defs, vars) => {
  switch (ctor) {
    case "Var":
      for (var i = 0; i < term.index; ++i) {
        vars = vars[1];
      }
      return vars[0];
    case "Lam":
      return x => compile(term.body, defs, [x, vars]);
    case "App":
      var func = compile(term.func, defs, vars);
      var argm = compile(term.argm, defs, vars);
      return func(argm);
    case "Put":
      return compile(term.expr, defs, vars);
    case "Dup": 
      var expr = compile(term.expr, defs, vars);
      var body = x => compile(term.body, defs, [x,vars]);
      return body(expr);
    case "Num":
      return term.numb;
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = compile(term.num0, defs, vars);
      var num1 = compile(term.num1, defs, vars);
      switch (func) {
        case "+"  : return (num0 + num1) >>> 0;
        case "-"  : return (num0 - num1) >>> 0;
        case "*"  : return (num0 * num1) >>> 0;
        case "/"  : return (num0 / num1) >>> 0;
        case "%"  : return (num0 % num1) >>> 0;
        case "**" : return (num0 ** num1) >>> 0;
        case "^^" : return (num0 ** (num1 / (2 ** 32))) >>> 0;
        case "&"  : return (num0 & num1) >>> 0;
        case "|"  : return (num0 | num1) >>> 0;
        case "^"  : return (num0 ^ num1) >>> 0;
        case "~"  : return (~ num1) >>> 0;
        case ">>" : return (num0 >>> num1) >>> 0;
        case "<<" : return (num0 << num1) >>> 0;
        case ">"  : return (num0 > num1) >>> 0;
        case "<"  : return (num0 < num1) >>> 0;
        case "==" : return (num0 === num1) >>> 0;
      }
    case "Ite":
      var cond = compile(term.cond, defs, vars);
      var pair = compile(term.pair, defs, vars);
      return cond ? pair[0] : pair[1];
    case "Cpy":
      var numb = compile(term.numb, defs, vars);
      var body = x => compile(term.body, defs, [x,vars]);
      return body(numb);
    case "Par":
      var val0 = compile(term.val0, defs, vars);
      var val1 = compile(term.val1, defs, vars);
      return [val0, val1];
    case "Fst":
      var pair = compile(term.pair, defs, vars);
      return pair[0];
    case "Snd":
      var pair = compile(term.pair, defs, vars);
      return pair[1];
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = compile(term.pair, defs, vars);
      var body = (x,y) => compile(term.body, defs, [y,[x,vars]]);
      return body(pair[0], pair[1]);
    case "Ref":
      return compile(defs[term.name], defs, vars);
  }
};

// Converts a native JavaScript function back to a Formality-Core term
const decompile = (func) => {
  return (function go(term, depth) {
    function APP(variable) {
      return function FMC_DECOMPILE_GET(arg){
        if (arg === null) {
          return variable;
        } else {
          return APP(d => fmc.App(variable(d), go(arg, d)));
        }
      };
    };
    function VAR(d) {
      return fmc.Var(d - 1 - depth);
    };
    if (typeof term === "function" && term.name === "FMC_DECOMPILE_GET") {
      return term(null)(depth);
    } else if (typeof term === "object") {
      var val0 = go(term[0], depth);
      var val1 = go(term[1], depth);
      return fmc.Par(val0, val1);
    } else if (typeof term === "number") {
      return fmc.Num(term);
    } else if (typeof term === "function") {
      var body = go(term(APP(VAR)), depth + 1);
      return fmc.Lam(fmc.gen_name(depth), body);
    } else if (typeof term === "string") {
      throw "[ERROR]\nThis native JS function can't be decompiled to FMC:\n\n"
        + func.toString()
        + "\n\nIt possibly uses numeric operators on free variables, which can't be decompiled yet.";
    } else {
      return term;
    }
  })(func, 0);
};

module.exports = {compile, decompile};
