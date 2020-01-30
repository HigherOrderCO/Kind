// WARNING: here shall be dragons!
// This is the parser for Formality-Lang. This is NOT fm-core, which is meant
// to be small, elegant and portable. Instead, it is our user-facing language,
// which is meant to be big and fully-featured, including several syntax-sugars
// meant to make programming easier. As such, this file is complex and involves
// hard transformations of terms, Bruijn-index shifts, crazy parsing flows.
// You've been warned (:

import {
  Var, Typ, All, Lam,
  App, Slf, New, Use,
  Ann, Log, Hol, Ref,
  Num, Val, Op1, Op2, Ite,
  subst,
  shift,
  subst_many,
  Term,
  Defs,
} from "./core";
import {load_file, Loader} from "./loader";
import {marked_code, random_excuse} from "./errors";
import {show as stringify} from "./stringify";

// :::::::::::::
// :: Parsing ::
// :::::::::::::

export interface Opts {
  file?: string;
  loader?: Loader;
  tokenify?: boolean;
}

export type TokenType = "???" | "cmm" | "def" | "doc" | "imp" | "sym" | "txt" | "var" | "nop" | "ref";
export type Token = [TokenType, string] | [TokenType, string, string];

export interface Adt {
  adt_pram: [string, Term, boolean][];
  adt_indx: [string, Term, boolean][];
  adt_ctor: [string, [string, Term, boolean][], Term][];
  adt_name: string;
}

export interface Parsed {
  defs: Defs;
  adts: Record<string, Adt>;
  tokens: Token[];
  local_imports: Record<string, boolean>;
  qual_imports: Record<string, string>;
  open_imports: Record<string, boolean>;
}

// Converts a string to a term
export const parse = async (
  code: string,
  opts: Opts = {},
  root = true,
  loaded: Record<string, any> = {}
): Promise<Parsed> => {
  const file = opts.file || "main";
  const loader = opts.loader || load_file;
  const tokenify = opts.tokenify;

  // Imports a local/global file, merging its definitions
  async function do_import(import_file) {
    if (import_file.indexOf("#") === -1) {
      local_imports[import_file] = true;
    }
    if (!loaded[import_file]) {
      try {
        var file_code = await loader(import_file);
        loaded[import_file] = await parse(file_code, {file: import_file, tokenify, loader}, false, loaded);
      } catch (e) {
        throw e;
      }
    }
    var {defs: file_defs
      , adts: file_adts
      , open_imports: file_open_imports
      } = loaded[import_file];
    for (let term_path in file_defs) {
      defs[term_path] = file_defs[term_path];
    }
    for (let term_path in file_adts) {
      adts[term_path] = file_adts[term_path];
    }
    for (let open_import in file_open_imports) {
      open_imports[open_import] = true;
    }
    return true;
  }

  // Finds all imports with a given name
  function find_name_in_imports(name) {
    var found = [];
    for (var open_import in open_imports) {
      if (defs[open_import + "/" + name]) {
        found.push(open_import + "/" + name);
      }
    }
    return found;
  }

  // Returns current location
  function loc(len = 1) {
    return {idx: idx - len, col, row, len, file, code};
  }

  // Attempts to resolve a name into a full path
  function ref_path(str) {
    var result = (function () {
      if (str.indexOf("/") === -1) {
        var [str_file, str_name] = [null, str];
      } else {
        var [str_file, str_name] = str.split("/");
      }
      // If the reference includes the file...
      if (str_file) {
        // If it points to a qualified import, expand it
        if (qual_imports[str_file]) {
          return qual_imports[str_file] + "/" + str_name;
        // Otherwise, return an undefined reference, as written
        } else {
          return str_file + "/" + str_name;
        }
      // Otherwise, if the reference is missing the file...
      } else {
        // If there is a local definition with that name, point to it
        if (defs[file + "/" + str_name]) {
          return file + "/" + str_name;
        }
        // Otherwise, if there are many defs with that name, it is ambiguous
        var found = find_name_in_imports(str_name);
        if (found.length > 1) {
          var err_str = "Ambiguous reference: '" + str + "' could refer to:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
          err_str += "\nType its full name to prevent this error.";
          error(err_str);
        }
        // Otherwise, if there is exactly 1 open def with that name, point to it
        if (found.length === 1) {
          return found[0];
        }
      }
      // Otherwise, return an undefined reference to hte same file
      return file + "/" + str_name;
    })();
    return result;
  }

  // Makes a ref given a name
  function ref(str) {
    return Ref(ref_path(str), false, loc(str.length));
  }

  // Attempts to make a `ref` to a known base-lib term
  function base_ref(str) {
    var path = ref_path(str);
    if (defs[path]) {
      return Ref(path, false, loc(str.length));
    } else {
      error("Attempted to use a syntax-sugar which requires `" + str + "` to be in scope, but it isn't.\n"
          + "To solve that, add `import Base#` at the start of your file. This imports the official base libs.\n"
          + "See https://github.com/moonad/Formality/blob/master/DOCUMENTATION.md for more info.");
    }
  }

  // Defines a top-level term
  function define(path, term) {
    if (root) {
      var name = path.replace(new RegExp("^[\\w.]*\/"), "");
      var found = find_name_in_imports(name);
      if (found.length > 0 || defs[ref_path(name)]) {
        var err_str = "Attempted to re-define '" + name + "', which is already defined";
        if (found.length > 0) {
          err_str += " as:";
          for (var i = 0; i < found.length; ++i) {
            err_str += "\n- " + found[i];
          }
        } else {
          err_str += " on this file.";
        }
        error(err_str);
      }
    }
    defs[path] = term;
  }

  // Creates a new hole name
  function new_hole_name() {
    return "_" + file + "/line" + row + "_" + (hole_count++);
  }

  // Builds a lookup table
  function build_charset(chars)
  : [((chr: any) => boolean), Array<string>] {
    var charset = {};
    for (var i = 0; i < chars.length; ++i) {
      charset[chars[i]] = 1;
    }
    var query = chr => charset[chr] === 1;
    var array = Object.keys(charset);
    return [query, array];
  }

  // Some handy lookup tables
  const is_native_op =
    { "+"    : 1
    , "-"    : 1
    , "*"    : 1
    , "\\"   : 1
    , "%"    : 1
    , "**"   : 1
    , "&&"   : 1
    , "||"   : 1
    , "^"    : 1
    , "~"    : 1
    , ">>>"  : 1
    , "<<"   : 1
    , ">"    : 1
    , "<"    : 1
    , "==="  : 1
    , "sin"  : 1
    , "cos"  : 1
    , "tan"  : 1
    , "asin" : 1
    , "acos" : 1
    , "atan" : 1
  };

  const [is_num_char, num_chars]   = build_charset("0123456789");
  const [is_hex_char, hex_chars]   = build_charset("0123456789abcdefABCDEF");
  const [is_name_char, name_chars] = build_charset("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.#@/");
  const [is_op_char, op_chars]     = build_charset("-+*%^!<>=&|\\");
  const [is_spacy, spacys]         = build_charset(" \t\n\r");
  const [is_space, spaces]         = build_charset(" ");
  const [is_newline, newlines]     = build_charset("\n");

  // Advances the cursor 1 step forward
  function next() {
    if (tokens) {
      tokens[tokens.length - 1][1] += code[idx] || "";
    }
    if (is_newline(code[idx])) {
      row += 1;
      col = 0;
    } else {
      col += 1;
    }
    idx += 1;
  }

  // Advances the cursor until it finds a parseable char, skipping spaces and comments
  function next_char(is_space = is_spacy) {
    skip_spaces(is_space);
    var head = code.slice(idx, idx + 2);
    // Skips comments
    while (head === "//" || head === "--" || head === "/*" || head === "{-") {
      // Single-line comments
      if (head === "//" || head === "--") {
        if (tokens) tokens.push(["cmm", ""]);
        while (code[idx] !== "\n" && idx < code.length) {
          next();
        }
        next();
      // Multi-line comments (docs)
      } else {
        if (tokens) tokens.push(["doc", ""]);
        while (code.slice(idx, idx + 2) !== "*/" && code.slice(idx, idx + 2) !== "-}" && idx < code.length) {
          next();
        }
        next();
        next();
      }
      if (tokens) tokens.push(["txt", ""]);
      skip_spaces(is_space);
      var head = code.slice(idx, idx + 2);
    }
  }

  // Skips space chars
  function skip_spaces(is_space = is_spacy) {
    while (idx < code.length && is_space(code[idx])) {
      next();
    }
  }

  // Attempts to match a specific string
  function match_here(string) {
    if (code.slice(idx, idx + 2) === "//" || code.slice(idx, idx + 2) === "--") {
      return false;
    } else {
      var sliced = code.slice(idx, idx + string.length);
      if (sliced === string) {
        if (tokens) tokens.push(["sym", ""]);
        for (var i = 0; i < string.length; ++i) {
          next();
        }
        if (tokens) tokens.push(["txt", ""]);
        return true;
      }
      return false;
    }
  }

  // Seeks next non-whitespace, non-comment
  function seek(is_space = is_spacy) {
    var i = idx;
    while (i < code.length) {
      // Skips spaces
      if (is_space(code[i])) {
        ++i;
      // Skips comments
      } else if (code.slice(i, i + 2) === "//" || code.slice(i, i + 2) === "--") {
        while (i < code.length && code[i] !== "\n") {
          ++i;
        };
      // Done
      } else {
        break;
      }
    }
    return i;
  }

  // Checks if next non-whitespace, non-comment matches
  function next_is(string, is_space = is_spacy) {
    var i = seek(is_space);
    return code.slice(i, i + string.length) === string;
  }

  // If next non-space char is string, consume it
  // Otherwise, don't affect the state
  function match(string, is_space = is_spacy) {
    if (next_is(string, is_space)) {
      next_char(is_space);
      match_here(string);
      return true;
    } else {
      return false;
    }
  }

  // Throws a parse error at this location
  function error(error_message) {
    var part = "";
    var text = "";
    text += "[PARSE-ERROR]\n";
    text += error_message;
    text += "\n\nI noticed the problem on line " + (row+1) + ", col " + col + ", file \x1b[4m" + file + ".fm\x1b[0m:\n\n";
    text += marked_code(loc());
    text += "\nBut it could have happened a little earlier.\n";
    text += random_excuse();
    throw text;
  }

  // Constructs an INat
  function build_inat(name) {
    if (!defs[name+"N"]) {
      var numb = name === "" ? Math.pow(2,48) - 1 : Number(name);
      var bits = numb.toString(2);
      var bits = bits === "0" ? "" : bits;
      var term: Term = base_ref("izero");
      for (var i = 0; i < bits.length; ++i) {
        term = App(base_ref("imul2"), term, false);
        if (bits[i] === "1") {
          term = App(base_ref("isucc"), term, false);
        }
      }
      define(name+"N", term);
    }
    return Ref(name+"N", false, loc(name.length + 1));
  }

  // Constructs a Bits
  function build_bits(name) {
    if (!defs[name+"b"]) {
      var term: Term = base_ref("be");
      for (var i = 0; i < name.length; ++i) {
        term = App(base_ref(name[name.length - i - 1] === "0" ? "b0" : "b1"), term, false);
      }
      define(name+"b", term);
    }
    return Ref(name+"b", false, loc(name.length + 1));
  }

  // Constructs an IBits
  function build_ibits(name) {
    if (!defs[name+"B"]) {
      var term: Term = base_ref("ibe");
      for (var i = 0; i < name.length; ++i) {
        term = App(base_ref(name[name.length - i - 1] === "0" ? "ib0" : "ib1"), term, false);
      }
      define(name+"B", term);
    }
    return Ref(name+"B", false, loc(name.length + 1));
  }

  // Constructs a string
  function build_str(text, init = 0) {
    var nums = [];
    for (var i = 0; i < text.length; ++i) {
      nums.push(text.charCodeAt(i));
    }
    var term: Term = App(base_ref("nil"), Num(), true);
    for (var i = nums.length - 1; i >= 0; --i) {
      //var bits = build_bits(nums[i].toString(2));
      var bits = Val(nums[i]);
      term = App(App(App(base_ref("cons"), Num(), true), bits, false), term, false);
    }
    return Ann(base_ref("String"), term, false, loc(idx - init));
  }

  // Constructs a nat
  function build_nat(name) {
    if (!defs["n"+name]) {
      var term: Term = base_ref("zero");
      var numb = Number(name);
      for (var i = 0; i < numb; ++i) {
        term = App(base_ref("succ"), term, false);
      }
      define("n"+name, term);
    }
    return Ref("n"+name, false, loc(name.length + 1));
  }

  // Parses an exact string, errors if it isn't there
  function parse_exact(string) {
    if (!match(string)) {
      var text = "";
      var part = "";
      error("Expected '" + string + "', but found '" + (code[idx] || "(end of file)") + "' instead.");
    }
  }

  // Parses characters until `fn` is false
  function parse_string_here(fn = is_name_char) {
    var name = "";
    while (idx < code.length && fn(code[idx])) {
      name = name + code[idx];
      next();
    }
    return name;
  }

  // Skips spaces and calls parse_string_here
  function parse_string(fn = is_name_char) {
    next_char();
    return parse_string_here(fn);
  }

  // Parses an alphanumeric name
  function parse_name() {
    if (match("-")) {
      return "-" + parse_string();
    } else {
      return parse_op() || parse_string();
    }
  }

  // Parses an operator name
  function parse_op() {
    for (var str of op_chars) {
      // Prevents parsing case "|" as operator
      if (str === "|" ? next_is("||") : next_is(str)) {
        return parse_string(is_op_char);
      }
    }
    return null;
  }

  // Parses a term that demands a name
  function parse_named_term(nams): [string, Term] {
    // Parses matched term
    var term = parse_term(nams);

    // If no name given, attempts to infer it from term
    var name: string;
    if (match("as ")) {
      name = parse_string();
    } else if (term[0] === "Var" && (term[1] as any).__name) {
      name = (term[1] as any).__name;
    } else if (term[0] === "Ref") {
      name = term[1].name.slice(term[1].name.indexOf("/")+1);
    } else {
      error("The term \x1b[2m" + stringify(term, nams) + "\x1b[0m requires an explicit name.\n"
          + "Provide it with the 'as' keyword. Example: \x1b[2m" + stringify(term, nams) + " as x\x1b[0m");
    }

    return [name, term]
  }

  // Parses a number, variable, inline operator or reference
  function parse_ref(nams) {
    var term: Term | null = null;
    if (tokens) tokens.push(["???", ""]);
    var name = parse_name();
    if (name.length === 0) {
      next();
      error("Unexpected symbol.");
    }
    var last = name[name.length - 1];
    var is_hex = name.slice(0, 2) === "0x";
    var is_bin = name.slice(0, 2) === "0b";
    var is_num = !isNaN(Number(name)) && !/[a-zA-Z]/.test(last);
    var is_lit = name.length > 1 && !isNaN(Number(name.slice(0,-1))) && /[a-zA-Z]/.test(last);
    if (is_hex || is_bin || is_num) {
      term = Val(Number(name), loc(name.length));
    } else if (is_lit && last === "N") {
      term = build_inat(name.slice(0,-1));
    } else if (is_lit && last === "n") {
      term = build_nat(name.slice(0,-1));
    } else if (is_lit && last === "B") {
      term = build_ibits(name.slice(0,-1));
    } else if (is_lit && last === "b") {
      term = build_bits(name.slice(0,-1));
    } else {
      // Parses bruijn index
      var skip = 0;
      while (match_here("^")) {
        skip += 1;
      }
      // Finds variable in context
      for (var i = nams.length - 1; i >= 0; --i) {
        if (nams[i] === name) {
          if (skip === 0) break;
          else skip -= 1;
        }
      }
      // Variable
      if (i !== -1) {
        term = Var(nams.length - i - 1, loc(name.length));
        (term[1] as any).__name = name;
        if (tokens) tokens[tokens.length - 1][0] = "var";
      // Inline binary operator
      } else if (is_native_op[name]) {
        term = Lam("x", Num(), Lam("y", Num(), Op2(name, Var(1), Var(0)), false), false);
        if (tokens) tokens[tokens.length - 1][0] = "nop";
      // Reference
      } else {
        term = Ref(ref_path(name), false, loc(name.length));
        if (tokens) {
          tokens[tokens.length - 1][0] = "ref";
          tokens[tokens.length - 1][2] = term[1].name;
        }
      }
    }
    if (tokens) tokens.push(["txt", ""]);
    return term;
  }

  // Parses a grouping par, `(...)`
  function parse_grp(nams) {
    if (match("(")) {
      var term = parse_term(nams);
      parse_exact(")");
      return term;
    }
  }

  // Parses the type of types, `Type`
  function parse_typ(nams) {
    if (match("Type")) {
      return Typ(loc(4));
    }
  }

  // Parses a hole, `?name`
  function parse_hol(nams) {
    var init = idx;
    if (match("?")) {
      var name = parse_string_here();
      if (name === "") {
        name = new_hole_name();
      }
      if (used_hole_name[name]) {
        error("Reused hole name: " + name);
      } else {
        used_hole_name[name] = true;
      }
      return Hol(name, loc(idx - init));
    }
  }

  // Parses a lambda `{x : A} t` or a forall `{x : A} -> B`
  function parse_lam(nams) {
    function is_lam_or_all() {
      // TODO: this is ugly, improve
      var i = idx;
      if (i < code.length && code[i] === "(")          { ++i; } // skips `(`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      //if (code[i] === "~")                             { ++i; } // skips `~`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ":")                             { ++i; } // skips `:`
      if (code[i] === " ") return true;                         // found ` `
      if (code[i] === ";") return true;                         // found `,`
      if (code[i] === ",") return true;                         // found `,`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code[i] === ")")                             { ++i; } // skips `)`
      while (i < code.length && is_space(code[i]))     { ++i; } // skips ` `
      if (code.slice(i,i+2) === "=>") return true;              // finds `>`
      return false;
    }
    var init = idx;
    if (is_lam_or_all() && match("(")) {
      var erass = [];
      var names = [];
      var types = [];
      while (idx < code.length) {
        var name = parse_string();
        var type = match(":") ? parse_term(nams.concat(names)) : null;
        var eras = match(";");
        match(",");
        erass.push(eras);
        names.push(name);
        types.push(type);
        if (match(")")) break;
      }
      var isall = match("->");
      if (!isall) {
        parse_exact("=>");
      }
      var parsed = parse_term(nams.concat(names));
      for (var i = names.length - 1; i >= 0; --i) {
        if (isall) {
          parsed = All(names[i], types[i] || Hol(new_hole_name()), parsed, erass[i], loc(idx - init));
        } else {
          parsed = Lam(names[i], types[i] || null, parsed, erass[i], loc(idx - init));
        }
      }
      return parsed;
    }
  }

  // Parses the type of numbers, `Number`
  function parse_num(nams) {
    if (match("Number")) {
      return Num(loc(4));
    }
  }

  // Parses a let, `let x = t; u`
  function parse_let(nams) {
    if (match("let ")) {
      var name = parse_string();
      parse_exact("=");
      var copy = parse_term(nams);
      match(";");
      var body = parse_term(nams.concat([name]));
      return subst(body, copy, 0);
    }
  }

  // Parses a string literal, `"foo"`
  function parse_str(nams) {
    var init = idx;
    if (match("\"")) {
      // Parses text
      var text = "";
      while (idx < code.length && code[idx] !== "\"") {
        text += code[idx];
        next();
      }
      next();
      return build_str(text);
    }
  }

  // Parses a char literal, `'x'`
  function parse_chr(nams) {
    var init = idx;
    if (match("'")) {
      var name = code[idx];
      next();
      parse_exact("'");
      return Val(name.charCodeAt(0));
    }
  }

  // Parses an if-then-else, `if then t else u`
  function parse_ite(nams) {
    var init = idx;
    if (match("if ")) {
      var cond = parse_term(nams);
      parse_exact("then");
      var val0 = parse_term(nams);
      parse_exact("else");
      var val1 = parse_term(nams);
      return Ite(cond, val0, val1, loc(idx - init));
    }
  }

  // Parses a pair type `#{A,B}` or value `#[a,b]`
  function parse_par(nams) {
    var init = idx;
    var parsed: Term;
    // Pair
    if (match("#{")) {
      var types = [];
      while (idx < code.length) {
        var type = parse_term(nams);
        types.push(type);
        if (match("}")) break;
        parse_exact(",");
      }
      parsed = types.pop();
      for (var i = types.length - 1; i >= 0; --i) {
        parsed = App(App(base_ref("Pair"), types[i], false), parsed, false);
      }
      return parsed;
    }
    // pair
    if (match("#[")) {
      var erass = [];
      var terms = [];
      while (idx < code.length) {
        var term = parse_term(nams);
        terms.push(term);
        if (match("]")) break;
        parse_exact(",");
      }
      parsed = terms.pop();
      for (var i = terms.length - 1; i >= 0; --i) {
        var apps = App(base_ref("pair"), Hol(new_hole_name()), true);
        var apps = App(apps, Hol(new_hole_name()), true);
        parsed = App(App(apps, terms[i], false), parsed, false);
      }
      return parsed;
    }
  }

  // Parses a pair projection, `get [x, y] = t`
  function parse_get(nams) {
    var init = idx;
    var parsed: Term;
    if (match("get ")) {
      parse_exact("#[");
      var names = [];
      while (idx < code.length) {
        var name = parse_string();
        names.push(name);
        if (match("]")) break;
        parse_exact(",");
      }
      parse_exact("=");
      var pair = parse_term(nams);
      match(";");
      parsed = parse_term(nams.concat(names));
      for (var i = names.length - 2; i >= 0; --i) {
        var nam1 = names[i];
        var nam2 = i === names.length - 2 ? names[i + 1] : "aux";
        var expr = i === 0 ? pair : Var(0);
        var body = i === 0 ? parsed : shift(parsed, 1, 2);
        parsed = App(App(Use(expr),
          Lam("", null, Hol(new_hole_name()), false), true),
          Lam(nam1, null, Lam(nam2, null, body, false), false), false);
      }
      return parsed;
    }
  }

  // Parses log, `log(t)`
  function parse_log(nams) {
    var init = idx;
    if (match("log(")) {
      var msge = parse_term(nams);
      parse_exact(")");
      var expr = parse_term(nams);
      return Log(msge, expr, loc(idx - init));
    }
  }

  // Parses a self type, `$x P(x)`
  function parse_slf(nams) {
    var init = idx;
    if (match("${")) {
      var name = parse_string();
      parse_exact("}");
      var type = parse_term(nams.concat([name]));
      return Slf(name, type, loc(idx - init));
    }
  }

  // Parses a self intro, `new(A) t`
  function parse_new(nams) {
    var init = idx;
    if (match("new(")) {
      var type = parse_term(nams);
      parse_exact(")");
      var expr = parse_term(nams);
      return New(type, expr, loc(idx - init));
    }
  }

  // Parses a self elim, `%t`
  function parse_use(nams) {
    var init = idx;
    if (match("use(")) {
      var expr = parse_term(nams);
      parse_exact(")");
      return Use(expr, loc(idx - init));
    }
  }

  // Parses unary operators
  function parse_una(nams) {
    var init = idx;
    var fns = ["sin","cos","tan","asin","acos","atan","~"];
    for (var fn of fns) {
      if (match(fn+"(")) {
        var expr = parse_term(nams);
        parse_exact(")");
        return Op2(fn, Val(0), expr, loc(idx - init));
      }
    }
  }

  // Parses a case expression, `case/T | A => <term> | B => <term> : <term>`
  function parse_cse(nams) {
    if (match("case ")) {
      // Attempts to parse this case expression with each ADTs in scope
      for (var adt_name in adts) {
        var parse_state = save_parse_state();

        try {
          // Parses matched name, if available
          var [term_name, term] = parse_named_term(nams);

          // Finds ADT
          if (!adt_name || !adts[ref_path(adt_name)]) {
            error("Used case-syntax on undefined type `" + (adt_name || "?") + "`.");
          }
          var {adt_name, adt_pram, adt_indx, adt_ctor} = adts[ref_path(adt_name)];

          // Parses 'move' expressions
          var moves = [];
          while (match("with ")) {
            var move_init = idx;
            var [move_name, move_term] = parse_named_term(nams);
            var move_skip = parse_exact(":");
            var move_type = parse_term(nams
              .concat(adt_indx.map(([name,type]) => term_name + "." + name))
              .concat([term_name])
              .concat(moves.map(([name,term,type]) => name)));
            moves.push([move_name, move_term, move_type, loc(idx - init)]);
          }

          // Parses matched cases
          var case_term = [];
          var case_loc  = [];
          for (var c = 0; c < adt_ctor.length; ++c) {
            var init = idx;
            try {
              parse_exact("|");
              parse_exact(adt_ctor[c][0]);
              if (!match_here("\n") && !match_here(" ")) {
                throw "";
              }
              match("=>");
            } catch (e) {
              throw "WRONG_ADT";
            }
            var ctors = adt_ctor[c][1];
            case_term[c] = parse_term(nams
              .concat(adt_ctor[c][1].map(([name,type]) => term_name + "." + name))
              .concat(moves.map(([name,term,type]) => name)));
            for (var i = moves.length - 1; i >= 0; --i) {
              case_term[c] = Lam(moves[i][0], null, case_term[c], false);
            }
            for (var i = 0; i < ctors.length; ++i) {
              case_term[c] = Lam(term_name + "." + ctors[ctors.length - i - 1][0], null, case_term[c], ctors[ctors.length - i - 1][2]);
            }
            case_loc[c] = loc(idx - init);
          }

          // Parses matched motive
          var moti_init = idx;
          var moti_term: Term;
          if (match(":")) {
            moti_term = parse_term(nams
              .concat(adt_indx.map(([name,type]) => term_name + "." + name))
              .concat([term_name])
              .concat(moves.map(([name,term,type]) => name)));
          } else if (match(";") || adt_ctor.length > 0) {
            moti_term = Hol(new_hole_name());
          } else {
            throw "WRONG_ADT";
          }
          var moti_loc = loc(idx - moti_init);
          for (var i = moves.length - 1; i >= 0; --i) {
            moti_term = All(moves[i][0], moves[i][2], moti_term, false, moves[i][3]);
          }
          moti_term = moti_term;
          moti_term = Lam(term_name, null, moti_term, false, moti_loc);
          for (var i = adt_indx.length - 1; i >= 0; --i) {
            moti_term = Lam(term_name + "." + adt_indx[i][0], null, moti_term, false, moti_loc);
          }

          // Builds the matched term using self-elim ("Use")
          var targ = term;
          term = Use(term);
          term = App(term, moti_term, true, moti_loc);
          for (var i = 0; i < case_term.length; ++i) {
            term = App(term, case_term[i], false, case_loc[i]);
          }
          for (var i = 0; i < moves.length; ++i) {
            term = App(term, moves[i][1], false, moves[i][3]);
          }

          return term;
        } catch (e) {
          if (e !== "WRONG_ADT") {
            throw e;
          } else {
            load_parse_state(parse_state);
          }
        }
      }
      // If no ADT matches this pattern-match, raise error
      error("Couldn't find the ADT for this pattern-match.\n"
          + "Make sure the cases have the correct name and order.");
    }
  }

  // Parses an application, `f(x, y, z...)`
  function parse_app(parsed, init, nams) {
    var app = match("(", is_space);
    var term: Term;
    if (app) {
      term = parsed;
      while (idx < code.length) {
        if (match("_")) {
          term = App(term, Hol(new_hole_name()), true, loc(idx - init));
          if (match(")")) break;
        } else {
          var argm = parse_term(nams);
          var eras = match(";");
          term = App(term, argm, eras, loc(idx - init));
          match(",");
          if (match(")")) break;
        }
      }
      return term;
    }
  }

  // Parses a list literal, `[t, u, v, ...]`
  function parse_lst(nams) {
    var init = idx;
    if (match("[", is_space)) {
      var list = [];
      while (idx < code.length && !match("]")) {
        list.push(parse_term(nams));
        if (match("]")) break; else parse_exact(",");
      }
      var type = Hol(new_hole_name());
      var term = App(base_ref("nil"), type, true, loc(idx - init));
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
      }
      return term;
    }
    if (match("{", is_space)) {
      var list = [];
      while (idx < code.length && !match("}")) {
        var mkey = parse_term(nams);
        parse_exact(":");
        var mval = parse_term(nams);
        list.push(App(App(App(App(base_ref("pair"), Hol(new_hole_name()), true), Hol(new_hole_name()), true), mkey, false), mval, false));
        if (match("}")) break; else parse_exact(",");
      }
      var type = Hol(new_hole_name());
      var term = App(base_ref("nil"), type, true, loc(idx - init));
      for (var i = list.length - 1; i >= 0; --i) {
        var term = App(App(App(base_ref("cons"), type, true), list[i], false), term, false, loc(idx - init));
      }
      return term;
    }
  }

  // Parses the do notation
  function parse_blk(nams) {
    function is_bind() {
      // TODO: this is ugly, improve
      var i = idx;
      while (i < code.length && is_spacy(code[i]))     { ++i; } // skips ` `
      while (i < code.length && is_name_char(code[i])) { ++i; } // skips `x`
      while (i < code.length && is_spacy(code[i]))     { ++i; } // skips ` `
      if (code[i] === ":") return true;                         // found `:`
      if (code[i] === "=") return true;                         // found `=`
      return false;
    }
    var init = idx;
    var typed = false;
    if (match("do{", is_space) || match("do {", is_space)) {
      var type = Hol(new_hole_name());
      const parse_do_statement = (nams) => {
        var vtyp: Term;
        if (match("var")) {
          var name = parse_name();
          if (match(":")) {
            vtyp = parse_term(nams);
          } else {
            vtyp = Hol(new_hole_name());
          }
          parse_exact("=");
          var call = parse_term(nams);
          match(";");
          var body = parse_do_statement(nams.concat([name]));
          return App(App(App(App(base_ref("bind"), vtyp, true), type, true), call, false), Lam(name, null, body, false), false);
        } else if (match("throw;")) {
          parse_exact("}");
          return App(base_ref("throw"), Hol(new_hole_name()), true);
        } else if (match("return ")) {
          var term = parse_term(nams);
          match(";");
          parse_exact("}");
          return App(App(base_ref("return"), Hol(new_hole_name()), true), term, false);
        } else {
          var term = parse_term(nams);
          match(";");
          if (match("}")) {
            return term;
          } else {
            var body = parse_do_statement(nams.concat([name]));
            vtyp = Hol(new_hole_name());
            return App(App(App(App(base_ref("bind"), vtyp, true), type, true), term, false), Lam("x", null, body, false), false);
          }
        }
      };
      var result = parse_do_statement(nams);
      return result;
    }
  }

  // Parses an effectful for-loop
  function parse_for(nams) {
    if (match("for ")) {
      var name = parse_string();
      var skip = parse_exact("=");
      var val0 = parse_term(nams);
      var skip = parse_exact("~");
      var val1 = parse_term(nams);
      var body = parse_term(nams.concat([name]));
      var func = Lam(name, null, body, false);
      var term: Term;
      term = base_ref("for");
      term = App(term, val0, false);
      term = App(term, val1, false);
      term = App(term, func, false);
      return term;
    }
  }

  // Parses an annotation `t :: T` and a rewrite `t :: rewrite P(.) with e`
  function parse_ann(parsed, init, nams) {
    if (match("::", is_space)) {
      if (match("rewrite", is_space)) {
        var type = parse_term(nams.concat(["."]));
        parse_exact("with");
        var prof = parse_term(nams);
        var term: Term = base_ref("rewrite");
        term = App(term, Hol(new_hole_name()), true);
        term = App(term, Hol(new_hole_name()), true);
        term = App(term, Hol(new_hole_name()), true);
        term = App(term, prof, false);
        term = App(term, Lam("", null, type, false), true);
        term = App(term, parsed, false);
        return term;
      } else {
        var type = parse_term(nams);
        return Ann(type, parsed, false, loc(idx - init));
      }
    }
  }

  // Parses an equality, `a == b`
  function parse_eql(parsed, init, nams) {
    if (match("== ", is_space)) {
      var rgt = parse_term(nams);
      return App(App(App(base_ref("Equal"), Hol(new_hole_name()), false), parsed, false), rgt, false);
    }
  }

  // Parses an non-equality, `a != b`
  function parse_dif(parsed, init, nams) {
    if (match("!= ", is_space)) {
      var rgt = parse_term(nams);
      return App(base_ref("Not"), App(App(App(base_ref("Equal"), Hol(new_hole_name()), false), parsed, false), rgt, false), false);
    }
  }

  // Parses an arrow, `A -> B`
  function parse_arr(parsed, init, nams) {
    if (match("->", is_space)) {
      var rett = parse_term(nams.concat("_"));
      return All("", parsed, rett, false, loc(idx - init));
    }
  }

  // Parses operators, including:
  // - Numeric operators: `t + u`, `t * u`, etc.
  // - User-defined operators: `t +foo u`
  function parse_ops(parsed, init, nams) {
    var op = parse_op();
    if (op) {
      if (tokens) tokens.pop();
      if (tokens) tokens.push(["txt", ""]);
      var argm = parse_term(nams);
      if (is_native_op[op]) {
        return Op2(op, parsed, argm, loc(idx - init));
      } else if (op !== "|") { // `|` can't be a op
        return App(App(ref(op), parsed, false), argm, false, loc(idx - init));
      }
    }
  }

  // Parses a free variable
  function parse_var(nams) {
    var init = idx;
    if (match("^")) {
      var idx = Number(parse_name());
      return Var(idx, loc(idx - init));
    }
  }

  // Parses a term
  function parse_term(nams): Term {
    var parsed: Term;

    skip_spaces();
    var init = idx;

    // Parses base term
    if      (parsed = parse_lam(nams)) {}
    else if (parsed = parse_grp(nams)) {}
    else if (parsed = parse_typ(nams)) {}
    else if (parsed = parse_slf(nams)) {}
    else if (parsed = parse_new(nams)) {}
    else if (parsed = parse_use(nams)) {}
    else if (parsed = parse_hol(nams)) {}
    else if (parsed = parse_let(nams)) {}
    else if (parsed = parse_num(nams)) {}
    else if (parsed = parse_str(nams)) {}
    else if (parsed = parse_chr(nams)) {}
    else if (parsed = parse_ite(nams)) {}
    else if (parsed = parse_par(nams)) {}
    else if (parsed = parse_get(nams)) {}
    else if (parsed = parse_log(nams)) {}
    else if (parsed = parse_cse(nams)) {}
    else if (parsed = parse_var(nams)) {}
    else if (parsed = parse_una(nams)) {}
    else if (parsed = parse_lst(nams)) {}
    else if (parsed = parse_blk(nams)) {}
    else if (parsed = parse_for(nams)) {}
    else if (parsed = parse_ref(nams)) {}

    // Parses spaced operators
    var new_parsed: Term | true | null = true;
    while (new_parsed) {
      if      (new_parsed = parse_app(parsed, init, nams)){}
      else if (new_parsed = parse_ann(parsed, init, nams)){}
      else if (new_parsed = parse_arr(parsed, init, nams)){}
      else if (new_parsed = parse_eql(parsed, init, nams)){}
      else if (new_parsed = parse_dif(parsed, init, nams)){}
      else if (new_parsed = parse_ops(parsed, init, nams)){}
      if (new_parsed) parsed = new_parsed;
    }

    return parsed;
  }

  // Parses a top-level import
  async function do_parse_import() {
    if (match("import ")) {
      if (tokens) tokens.push(["imp", ""]);
      var impf = parse_string();
      if (tokens) tokens.push(["txt", ""]);
      var qual = match("as ") ? parse_string() : null;
      var open = match("open");
      if (open) {
        error("The `open` keyword is obsolete. Remove it.");
      }
      if (qual) qual_imports[qual] = impf;
      qual_imports[impf] = impf;
      open_imports[impf] = true;
      await do_import(impf);
      return true;
    }
  }

  // Parses a top-level datatype:
  // T name {param0 : A, ...} (index0 : B, ...)
  // | ctor0 {field0 : C, ...} (index0, ...)
  // | ctor1 {field0 : C, ...} (index0, ...)
  async function do_parse_datatype() {
    if (match("T ")) {
      var adt_pram = [];
      var adt_indx = [];
      var adt_ctor = [];
      var adt_name = parse_string();
      var adt_nams = [adt_name];
      var adt_typs = [null];

      // Datatype parameters
      if (match("{")) {
        while (idx < code.length) {
          let eras = false;
          let name = parse_string();
          let type: Term;
          if (match(":")) {
            type = await parse_term(adt_pram.map((([name,type]) => name)));
          } else {
            type = Typ();
          }
          adt_pram.push([name, type, eras]);
          if (match("}")) break;
          else parse_exact(",");
        }
      }

      // Datatype indices
      var adt_nams = adt_nams.concat(adt_pram.map(([name,type]) => name));
      var adt_typs = adt_typs.concat(adt_pram.map(([name,type]) => type));
      if (match("(")) {
        while (idx < code.length) {
          //var eras = match("~");
          let eras = false;
          let name = parse_string();
          let type: Term
          if (match(":")) {
            type = await parse_term(adt_nams.concat(adt_indx.map((([name,type]) => name))));
          } else {
            type = Typ();
          }
          adt_indx.push([name, type, eras]);
          if (match(")")) break; else parse_exact(",");
        }
      }

      // Datatype constructors
      while (match("|")) {
        // Constructor name
        var ctor_name = parse_string();
        // Constructor fields
        var ctor_flds = [];
        var ctor_type: Term;
        if (match("(")) {
          while (idx < code.length) {
            let name = parse_string();
            let type: Term;
            let eras: boolean
            if (match(":")) {
              type = await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
            } else {
              type = Hol(new_hole_name());
            }
            eras = match(";");
            match(",");
            ctor_flds.push([name, type, eras]);
            if (match(")")) break;
          }
        }
        // Constructor type (written)
        if (match(":")) {
          ctor_type = parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name)));
        // Constructor type (auto-filled)
        } else {
          var ctor_indx = [];
          //if (match("(")) {
            //while (idx < code.length) {
              //ctor_indx.push(await parse_term(adt_nams.concat(ctor_flds.map(([name,type]) => name))));
              //if (match(")")) break; else parse_exact(",");
            //}
          //}
          ctor_type = Var(-1 + ctor_flds.length + adt_pram.length + 1);
          for (var p = 0; p < adt_pram.length; ++p) {
            ctor_type = App(ctor_type, Var(-1 + ctor_flds.length + adt_pram.length - p), false);
          }
          for (var i = 0; i < ctor_indx.length; ++i) {
            ctor_type = App(ctor_type, ctor_indx[i], false);
          }
        }
        adt_ctor.push([ctor_name, ctor_flds, ctor_type]);
      }
      var adt = {adt_pram, adt_indx, adt_ctor, adt_name};
      define(file+"/"+adt_name, derive_adt_type(file, adt));
      for (var c = 0; c < adt_ctor.length; ++c) {
        define(file+"/"+adt_ctor[c][0], derive_adt_ctor(file, adt, c));
      }
      adts[file+"/"+adt_name] = adt;

      return true;
    }
  }

  // Parses a top-level `?defs` util
  async function do_parse_defs_util() {
    if (match("?defs")) {
      var filt = match("/") ? parse_string(x => x !== "/") : "";
      var regx = new RegExp(filt, "i");
      console.log("Definitions:");
      for (var def in defs) {
        if (def[0] !== "$" && regx.test(def)) {
          console.log("- " + def);
        }
      }
      return true;
    }
  }

  // Parses a top-level definition:
  //
  //    name(arg0 : A, arg1 : B, ...) : RetType
  //      <body>
  //
  async function do_parse_def() {
    // Parses definition name
    if (tokens) tokens.push(["def", ""]);
    var name = parse_name();

    if (name.length === 0) {
      error("Expected a definition.");
    }
    if (tokens) tokens[tokens.length - 1][2] = file+"/"+name;
    if (tokens) tokens.push(["txt", ""]);

    // If name is empty, stop
    if (name.length === 0) return false;

    // Parses argument names and types
    var erass = [];
    var names = [];
    var types = [];
    if (match_here("(")) {
      while (idx < code.length) {
        var arg_name = parse_string();
        var arg_type = match(":") ? await parse_term(names) : Hol(new_hole_name());
        var arg_eras = match(";");
        var arg_skip = match(",");
        erass.push(arg_eras);
        names.push(arg_name);
        types.push(arg_type);
        if (match(")")) break;
      }
    }

    // Parses return type, if any
    var type: Term | null = match(":") ? await parse_term(names) : null;
    match(";");

    // Parses the term
    if (name[0] === "@") {
      var term: Term = Hol(name);
    } else {
      var term: Term = await parse_term(names);
    }

    // Fills foralls and lambdas of arguments
    for (var i = names.length - 1; i >= 0; --i) {
      type = type && All(names[i], types[i], type, erass[i]);
      term = Lam(names[i], type ? null : types[i], term, erass[i]);
    }

    // Defines the top-level term
    define(file+"/"+name, type ? Ann(type, term, name[0] === "@") : term);

    return true;
  }

  function save_parse_state() {
    return {idx, row, col, tokens_length: tokens && tokens.length};
  }

  function load_parse_state(state) {
    idx = state.idx;
    row = state.row;
    col = state.col;
    while (state.tokens_length && tokens.length > state.tokens_length) {
      tokens.pop();
    }
  }

  // Parses all definitions
  var open_imports = {};
  var qual_imports = {};
  var local_imports = {};
  var file_version = {};
  var used_hole_name = {};
  var hole_count = 0;
  var tokens: Token[] = tokenify ? [["txt",""]] : null;
  var idx = 0;
  var row = 0;
  var col = 0;
  var defs = {};
  var adts = {};
  while (idx < code.length) {
    next_char();
    if      (await do_parse_import()){}
    else if (await do_parse_datatype()){}
    else if (await do_parse_defs_util()){}
    else if (!(await do_parse_def())) break;
    next_char();
  }

  return {
    defs,
    adts,
    tokens,
    local_imports,
    qual_imports,
    open_imports
  };
}

// :::::::::::::::::::
// :: Syntax Sugars ::
// :::::::::::::::::::

// Syntax sugars for datatypes. They transform a statement like:
//
//   data ADT <p0 : Param0, p1 : Param1...> {i0 : Index0, i1 : Index1}
//   | ctr0 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ctr1 {ctr_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} : Cr0Type
//   | ...
//
// on its corresponding self-encoded datatype:
//
//   def ADT
//   = {p0 : Param0, p1 : Param1, ..., i0 : Index0, i1 : Index1, ...} =>
//     : Type
//     $ self
//     {~P   : {i0 : Index0, i1 : Index1, ..., wit : (ADT i0 i1...)} -> Type} ->
//     {ctr0 : {ctr0_fld0 : Ctr0_Fld0, ctr0_fld1 : Ctr0_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr0 Param0 Param1... ctr0_fld0 ctr0_fld1 ...))} ->
//     {ctr1 : {ctr1_fld0 : Ctr1_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} -> (Ctr0Type[ADT <- P] (ADT.ctr1 Param0 Param1... ctr1_fld1 ctr0_fld1 ...))} ->
//     ... ->
//     (P i0 i1... self)
//
//   def ADT.ctr0
//   = {~p0 : Param0, ~p1 : Param1, ..., ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} =>
//     : Ctr0Type
//     @ Ctr0Type
//       {~P, ctr0, ctr1, ...} =>
//       (ctr0 ctr0_fld0 ctr0_fld1 ...)
//
//   (...)
const derive_adt_type = (file, {adt_pram, adt_indx, adt_ctor, adt_name}) => {
  return (function adt_arg(p, i) {
    // ... {p0 : Param0, p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], adt_arg(p + 1, i), adt_pram[p][2]);
    // ... {i0 : Index0, i1 : Index...} ...
    } else if (i < adt_indx.length) {
      var substs: Term[] = [Ref(file+"/"+adt_name)];
      for (var P = 0; P < p; ++P) {
        substs.push(Var(-1 + i + p - P));
      }
      return Lam(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), adt_arg(p, i + 1), adt_indx[i][2]);
    } else {
      return (
        // ... : Type ...
        Ann(Typ(),
        // ... $ self ...
        Slf("self",
        // ... P : ...
        All("P",
          (function motive(i) {
            // ... {i0 : Index0, i1 : Index1...} ...
            if (i < adt_indx.length) {
              var substs: Term[] = [Ref(file+"/"+adt_name)];
              for (var P = 0; P < p; ++P) {
                substs.push(Var(-1 + i + 1 + adt_indx.length + p - P));
              }
              return All(adt_indx[i][0], subst_many(adt_indx[i][1], substs, i), motive(i + 1), adt_indx[i][2]);
            // ... {wit : (ADT i0 i1...)} -> Type ...
            } else {
              var wit_t: Term = Ref(file+"/"+adt_name);
              for (var P = 0; P < adt_pram.length; ++P) {
                wit_t = App(wit_t, Var(-1 + i + 1 + i + adt_pram.length - P), adt_pram[P][2]);
              }
              for (var I = 0; I < i; ++I) {
                wit_t = App(wit_t, Var(-1 + i - I), adt_indx[I][2]);
              }
              return All("wit", wit_t, Typ(), false);
            }
          })(0),
        (function ctor(i) {
          if (i < adt_ctor.length) {
            // ... ctrX : ...
            return All(adt_ctor[i][0], (function field(j) {
              var subst_prams = [];
              for (var P = 0; P < adt_pram.length; ++P) {
                subst_prams.push(Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P));
              }
              // ... {ctrX_fldX : CtrX_FldX, ctrX_fld1 : CtrX_Fld1, ...} -> ...
              if (j < adt_ctor[i][1].length) {
                let sub = [Ref(file+"/"+adt_name)].concat(subst_prams);
                let typ = subst_many(adt_ctor[i][1][j][1], sub, j);
                return All(adt_ctor[i][1][j][0], typ, field(j + 1), adt_ctor[i][1][j][2]);
              // ... (CtrXType[ADT <- P] (ADT.ctrX ParamX Param1... ctrX_fldX ctrX_fld1 ...)) -> ...
              } else {
                let typ = adt_ctor[i][2];
                let sub = [Var(-1 + j + i + 1)].concat(subst_prams);
                typ = subst_many(adt_ctor[i][2], sub, j);
                let rem = typ;
                for (var I = 0; I < adt_indx.length; ++I) {
                  rem = rem[1].func;
                }
                rem[0] = "Var";
                rem[1] = {index: -1 + i + j + 1};
                let wit: Term = Ref(file+"/"+adt_ctor[i][0]);
                for (var P = 0; P < adt_pram.length; ++P) {
                  wit = App(wit, Var(-1 + j + i + 1 + 1 + adt_indx.length + adt_pram.length - P), true);
                }
                for (var F = 0; F < adt_ctor[i][1].length; ++F) {
                  wit = App(wit, Var(-1 + j - F), adt_ctor[i][1][F][2]);
                }
                return App(typ, wit, false);
              }
            })(0),
            ctor(i + 1),
            false);
          } else {
            // ... (P i0 i1... self)
            let ret: Term = Var(adt_ctor.length + 1 - 1);
            for (var i = 0; i < adt_indx.length; ++i) {
              ret = App(ret, Var(adt_ctor.length + 1 + 1 + adt_indx.length - i - 1), adt_indx[i][2]);
            }
            ret = App(ret, Var(adt_ctor.length + 1 + 1 - 1), false);
            return ret;
          }
        })(0),
        true))));
    }
  })(0, 0);
}

const derive_adt_ctor = (file, {adt_pram, adt_indx, adt_ctor, adt_name}, c) => {
  return (function arg(p, i, f) {
    var substs: Term[] = [Ref(file+"/"+adt_name)];
    for (var P = 0; P < p; ++P) {
      substs.push(Var(-1 + f + p - P));
    }
    // {~p0 : Param0, ~p1 : Param1...} ...
    if (p < adt_pram.length) {
      return Lam(adt_pram[p][0], adt_pram[p][1], arg(p + 1, i, f), true);
    // ... {ctr0_fld0 : Ctr0_Fld0, ctr1_fld1 : Ctr1_Fld1, ...} ...
    } else if (f < adt_ctor[c][1].length) {
      return Lam(adt_ctor[c][1][f][0], subst_many(adt_ctor[c][1][f][1], substs, f), arg(p, i, f + 1), adt_ctor[c][1][f][2]);
    } else {
      var type = subst_many(adt_ctor[c][2], substs, f);
      // ... : CtrXType {~P} ...
      return Ann(type, New(type, Lam("P", null, (function opt(k) {
        // ... {ctr0, ctr1...} ...
        if (k < adt_ctor.length) {
          return Lam(adt_ctor[k][0], null, opt(k + 1), false);
        // (ctrX ctrX_fld0 ctrX_fld1 ...)
        } else {
          let sel: Term = Var(-1 + adt_ctor.length - c);
          for (var F = 0; F < adt_ctor[c][1].length; ++F) {
            let fld = Var(-1 + adt_ctor.length + 1 + adt_ctor[c][1].length - F);
            sel = App(sel, fld, adt_ctor[c][1][F][2]);
          }
          return sel;
        }
      })(0), true)), false);
    }
  })(0, adt_indx.length, 0);
}
