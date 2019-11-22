const fm = require("./fm-core.js");

// Converts a Formality-Core Term to a native JavaScript function
const compile = (term, opts, vars = null) => {
  var [ctor, term] = term;
  switch (ctor) {
    case "Var":
      for (var i = 0; i < term.index; ++i) {
        vars = vars[1];
      }
      return vars[0];
    case "Lam":
      return x => compile(term.body, opts, [x, vars]);
    case "App":
      var func = compile(term.func, opts, vars);
      var argm = compile(term.argm, opts, vars);
      return func(argm);
    case "Put":
      return compile(term.expr, opts, vars);
    case "Dup": 
      var expr = compile(term.expr, opts, vars);
      var body = x => compile(term.body, opts, [x,vars]);
      return body(expr);
    case "Val":
      return term.numb;
    case "Op1":
    case "Op2":
      var func = term.func;
      var num0 = compile(term.num0, opts, vars);
      var num1 = compile(term.num1, opts, vars);
      switch (func) {
        case ".+."   : return num0 + num1;
        case ".-."   : return num0 - num1;
        case ".*."   : return num0 * num1;
        case "./."   : return num0 / num1;
        case ".%."   : return num0 % num1;
        case ".**."  : return num0 ** num1;
        case ".&."   : return num0 & num1;
        case ".|."   : return num0 | num1;
        case ".^."   : return num0 ^ num1;
        case ".~."   : return ~ num1;
        case ".>>>." : return num0 >>> num1;
        case ".<<."  : return num0 << num1;
        case ".>."   : return num0 > num1;
        case ".<."   : return num0 < num1;
        case ".==."  : return num0 === num1 ? 1 : 0;
        default: throw "TODO: implement operator "
      }
    case "Ite":
      var cond = compile(term.cond, opts, vars);
      var pair = compile(term.pair, opts, vars);
      return cond ? pair[0] : pair[1];
    case "Cpy":
      var numb = compile(term.numb, opts, vars);
      var body = x => compile(term.body, opts, [x,vars]);
      return body(numb);
    case "Par":
      var val0 = compile(term.val0, opts, vars);
      var val1 = compile(term.val1, opts, vars);
      return [val0, val1];
    case "Fst":
      var pair = compile(term.pair, opts, vars);
      return pair[0];
    case "Snd":
      var pair = compile(term.pair, opts, vars);
      return pair[1];
    case "Prj":
      var nam0 = term.nam0;
      var nam1 = term.nam1;
      var pair = compile(term.pair, opts, vars);
      var body = (x,y) => compile(term.body, opts, [y,[x,vars]]);
      return body(pair[0], pair[1]);
    case "Log":
      return compile(term.expr, opts, vars);
    case "Ref":
      return compile(fm.erase((opts.defs||{})[term.name]), opts, vars);
  }
};

// Converts a native JavaScript function back to a Formality-Core term
const decompile = (func) => {
  return (function go(term, depth) {
    function APP(variable) {
      return function FM_DECOMPILE_GET(arg){
        if (arg === null) {
          return variable;
        } else {
          return APP(d => fm.App(variable(d), go(arg, d), false));
        }
      };
    };
    function VAR(d) {
      return fm.Var(d - 1 - depth);
    };
    if (typeof term === "function" && term.name === "FM_DECOMPILE_GET") {
      return term(null)(depth);
    } else if (typeof term === "object") {
      var val0 = go(term[0], depth);
      var val1 = go(term[1], depth);
      return fm.Par(val0, val1);
    } else if (typeof term === "number") {
      return fm.Val(term);
    } else if (typeof term === "function") {
      var body = go(term(APP(VAR)), depth + 1);
      return fm.Lam("x" + depth, null, body, false);
    } else if (typeof term === "string") {
      throw "[ERROR]\nThis native JS function can't be decompiled to Formality:\n\n"
        + func.toString()
        + "\n\nIt possibly uses numeric operators on free variables, which can't be decompiled yet.";
    } else {
      return term;
    }
  })(func, 0);
};

// Converts a Formality-Core Term to a native JavaScript function
const compile_to_code = (term, opts, depth = 0) => {
  var seen = {};
  var defs = "";
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
      case "Put":
        return go(term.expr, depth);
      case "Dup": 
        var expr = go(term.expr, depth);
        var body = go(term.body, depth+1);
        return "(_"+depth+"=>"+body+")("+expr+")";
        //return "(_"+depth+" = "+expr+"), "+body;
      case "Val":
        return term.numb;
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
          case ".==."  : return "(" + num0 + "===" + num1 + "?1:0)";
          default: throw "TODO: implement operator "
        }
      case "Ite":
        var cond = go(term.cond, depth);
        var pair = go(term.pair, depth);
        return "(p=>" + cond + "?p[0]():p[1]())("+pair+")";
      case "Cpy":
        var numb = go(term.numb, depth);
        var body = go(term.body, depth+1);
        return "(_"+depth+"=>"+body+")("+numb+")";
      case "Par":
        var val0 = go(term.val0, depth);
        var val1 = go(term.val1, depth);
        return "[()=>"+val0+",()=>"+val1+"]";
      case "Fst":
        var pair = go(term.pair, depth);
        return pair+"[0]()";
      case "Snd":
        var pair = go(term.pair, depth);
        return pair+"[1]()";
      case "Prj":
        var nam0 = term.nam0;
        var nam1 = term.nam1;
        var pair = go(term.pair, depth);
        var body = go(term.body, depth+2);
        return "(([_"+depth+",_"+(depth+1)+"])=>("
          +"_"+(depth+0)+"=_"+(depth+0)+"(),"
          +"_"+(depth+1)+"=_"+(depth+1)+"(),"
          +body
        +"))("+pair+")";
      case "Log":
        return go(term.expr, depth);
      case "Ref":
        var name = term.name.replace(/\./g,"_").replace(/\//g,"$").replace(/#/g,"$");
        if (!seen[term.name]) {
          seen[term.name] = true;
          var dref = go(fm.erase((opts.defs||{})[term.name]), depth);
          defs += "  var "+name+" = "+dref+";\n";
        }
        return name;
    }
  })(term, 0);
  return "(function(){\n"+defs+"  return "+result+";\n})()";
}

module.exports = {compile, decompile, compile_to_code};
