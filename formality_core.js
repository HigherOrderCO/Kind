// Term
// ====

function Var(name) {
  return {ctor: "Var", name};
};

function Typ() {
  return {ctor: "Typ"};
};

function All(name, bind, body, eras) {
  return {ctor: "All", name, bind, body, eras};
};

function Lam(name, body, eras) {
  return {ctor: "Lam", name, body, eras};
};

function App(func, argm, eras) {
  return {ctor: "App", func, argm, eras};
};

function Slf(name, type) {
  return {ctor: "Slf", name, type};
};

function Ins(type, term) {
  return {ctor: "Ins", type, term};
};

function Eli(term) {
  return {ctor: "Eli", term};
};

function Ann(term, type, done) {
  return {ctor: "Ann", term, type, done};
};

// Module
// ======

function Def(name, type, term, defs) {
  return {ctor: "Def", name, type, term, defs};
};

function Eof() {
  return {ctor: "Eof"};
};

// Parser
// ======

// Is this a space character?
function is_space(chr) {
  return chr === " " || chr === "\t" || chr === "\n";
};

// Is this a blank (space but not newline) character?
function is_blank(chr) {
  return chr === " " || chr === "\t";
};

// Is this a name-valid character?
function is_name(chr) {
  var val = chr.charCodeAt(0);
  return (val >= 48 && val < 58)   // 0-9
      || (val >= 65 && val < 91)   // A-Z
      || (val >= 95 && val < 96)   // _
      || (val >= 97 && val < 123); // a-z
};

// Returns the first function that doesn't throw, or null
function first_valid(fns) {
  for (var i = 0; i < fns.length; ++i) {
    try {
      return fns[i]();
    } catch (e) {
      continue;
    }
  };
  return null;
};

// Drop characters while a condition is met.
function drop_while(cond, code, indx) {
  while (indx < code.length && cond(code[indx])) {
    indx++;
  };
  return indx;
};

// Drop spaces
function space(code, indx) {
  return drop_while(is_space, code, indx);
};

// Skips blanks (spaces and newlines)
function blank(code, indx) {
  return drop_while(is_blank, code, indx);
};

// Drops spaces and parses an exact string
function parse_str(str, code, indx) {
  if (str.length === 0) {
    return [indx, str];
  } else if (indx < code.length && code[indx] === str[0]) {
    return parse_str(str.slice(1), code, indx+1);
  } else {
    throw new Error("Expected `" + str + "`, found `" + code.slice(indx,indx+16) + "`.");
  };
};

// Parses an optional character
function parse_opt(chr, code, indx) {
  if (code[indx] === chr) {
    return [indx + 1, true];
  } else {
    return [indx, false];
  }
};

// Parses a valid name, non-empty
function parse_nam(code, indx, len = 0) {
  if (indx < code.length) {
    var chr = code[indx];
    if (is_name(chr)) {
      var [indx, name] = parse_nam(code, indx + 1, len + 1);
      return [indx, chr + name];
    } else {
      return [indx, ""];
    }
  } else if (len > 0) {
    return [indx, ""];
  } else {
    throw new Error();
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, indx) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, term] = parse_trm(code, indx);
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, term];
};

// Parses a dependent function type, `(<name> : <term>) => <term>`
function parse_all(code, indx) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str(":", code, space(code, indx));
  var [indx, bind] = parse_trm(code, indx);
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("->", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx);
  return [indx, All(name, bind, body, eras)];
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("=>", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx);
  return [indx, Lam(name, body, eras)];
};

// Parses the type of types, `Type`
function parse_typ(code, indx) {
  var [indx, skip] = parse_str("Type", code, space(code, indx));
  return [indx, Typ()];
};

// Parses variables, `<name>`
function parse_var(code, indx) {
  var [indx, name] = parse_nam(code, space(code, indx));
  return [indx, Var(name)];
};

// Parses a self type, `#{<name>} <term>`
function parse_slf(code, indx) {
  var [indx, skip] = parse_str("#{", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx);
  return [indx, Slf(name, type)];
};

// Parses a self instantiation, `#inst{<term>}`
function parse_ins(code, indx) {
  var [indx, skip] = parse_str("#inst{", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, term] = parse_trm(code, indx);
  return [indx, Ins(type, term)];
};

// Parses a self elimination, `#elim{<term>}`
function parse_eli(code, indx) {
  var [indx, skip] = parse_str("#elim{", code, space(code, indx));
  var [indx, term] = parse_trm(code, indx);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  return [indx, Eli(term)];
};

// Parses an application, `<term>(<term>)`
function parse_app(code, indx, func) {
  var [indx, skip] = parse_str("(", code, blank(code, indx));
  var [indx, argm] = parse_trm(code, indx);
  var [indx, eras] = parse_opt(";", code, indx);
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, App(func, argm, eras)];
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, term) {
  var [indx, skip] = parse_str("::", code, blank(code, indx));
  var [indx, type] = parse_trm(code, indx);
  return [indx, Ann(term, type, false)];
};

// Parses a term
function parse_trm(code, indx) {
  // Parses the base term, trying each variant once
  var base_parse = first_valid([
    () => parse_all(code, indx),
    () => parse_lam(code, indx),
    () => parse_par(code, indx),
    () => parse_typ(code, indx),
    () => parse_slf(code, indx),
    () => parse_ins(code, indx),
    () => parse_eli(code, indx),
    () => parse_var(code, indx),
  ]);

  // Parses postfix extensions, trying each variant repeatedly
  var post_parse = base_parse;
  while (true) {
    var [indx, term] = post_parse;
    post_parse = first_valid([
      () => parse_app(code, indx, term),
      () => parse_ann(code, indx, term),
    ]);
    if (!post_parse) {
      return base_parse;
    } else {
      base_parse = post_parse;
    }
  }

  return null;
};

// Parses a module
function parse_mod(code, indx) {
  try {
    var [indx, name] = parse_nam(code, space(code, indx));
    var [indx, skip] = parse_str(":", code, space(code, indx));
    var [indx, type] = parse_trm(code, space(code, indx));
    var [indx, term] = parse_trm(code, space(code, indx));
    return Def(name, type, term, parse_mod(code, indx));
  } catch (e) {
    return Eof();
  }
};

// Stringifier
// ===========

function stringify_trm(term) {
  switch (term.ctor) {
    case "Var":
      return term.name;
    case "Typ":
      return "Type";
    case "All": 
      var name = term.name;
      var bind = stringify_trm(term.bind);
      var body = stringify_trm(term.body);
      var eras = term.eras ? ";" : "";
      return "("+name+" : "+bind+eras+") -> "+body;
    case "Lam": 
      var name = term.name;
      var body = stringify_trm(term.body);
      var eras = term.eras ? ";" : "";
      return "("+name+eras+") => "+body;
    case "App":
      var func = stringify_trm(term.func);
      var argm = stringify_trm(term.argm);
      var eras = term.eras ? ";" : "";
      return "("+func+")("+argm+eras+")";
    case "Slf":
      var name = term.name;
      var type = stringify_trm(term.type);
      return "#{"+name+"} "+type;
    case "Ins":
      var type = stringify_trm(term.type);
      var term = stringify_trm(term.term);
      return "#inst{"+type+"} "+term;
    case "Eli":
      var term = stringify_trm(term.term);
      return "#elim{"+term+"}";
    case "Ann":
      var term = stringify_trm(term.term);
      var type = stringify_trm(term.type);
      return term+" :: "+type;
  }
};

function stringify_mod(mod) {
  switch (mod.ctor) {
    case "Def":
      var name = mod.name;
      var type = stringify_trm(mod.type);
      var term = stringify_trm(mod.term);
      var defs = stringify_mod(mod.defs);
      return name + " : " + type + "\n  " + term + "\n\n" + defs;
    case "Eof":
      return "";
  }
};

module.exports = {
  Var,
  Typ,
  All,
  Lam,
  App,
  Slf,
  Ins,
  Eli,
  Ann,
  Def,
  Eof,
  is_space,
  is_blank,
  is_name,
  first_valid,
  drop_while,
  space,
  blank,
  parse_str,
  parse_opt,
  parse_nam,
  parse_par,
  parse_all,
  parse_lam,
  parse_typ,
  parse_var,
  parse_slf,
  parse_ins,
  parse_eli,
  parse_app,
  parse_ann,
  parse_trm,
  parse_mod,
  stringify_trm,
  stringify_mod,
};

