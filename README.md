Formality
=========

Formality is a proof and programming language, as well as a standard format for
algorithms and proofs. It exists to fill a hole in the current market: there
aren't many programming languages featuring theorem proving that are 1.
portable, 2. efficient, 3. accessible.

**Portability** makes it available everywhere, like a JSON of code. We
accomplish that by bootstrapping: we design a minimal core that can be quickly
implemented anywhere, and build the rest of the language on top of it.

**Efficiency** is required if we want the language to be used for production
software. We accomplish that by compiling Formality to a massively parallel,
non-garbage-collected, Lévy-optimal functional runtime.

**Accessibility** makes it usable by regular developers, not just experts. We
accomplish it by translating advanced concepts to familiar syntaxes that
resembles popular languages and takes inspiration from the [Zen of
Python](https://www.python.org/dev/peps/pep-0020/).

## 0. Table of Contents

- [0. Table of Contents](#0-table-of-contents)
- [1. Formality-Core](#1-formality-core)
    - [1.0. Specification](#10-specification)
        - [1.0.0. Syntax](#100-syntax)
        - [1.0.1. Operations](#101-operations)
        - [1.0.2. Type-System](#102-type-system)
    - [1.1. Implementation](#11-implementation)
        - [1.1.0. Terms and Modules](#110-terms-and-modules)
            - [1.1.0.0. JavaScript](#1100-JavaScript)
            - [1.1.0.1. Python](#1101-Python)
            - [1.1.0.2. Haskell](#1102-Haskell)
        - [1.1.1. Parsing](#111-parsing)
            - [1.1.1.0. JavaScript](#1110-JavaScript)
            - [1.1.1.1. Python](#1111-Python)
            - [1.1.1.2. Haskell](#1112-Haskell)
        - [1.1.2. Stringification](#112-stringification)
            - [1.1.2.0. JavaScript](#1120-JavaScript)
            - [1.1.2.1. Python](#1121-Python)
            - [1.1.2.2. Haskell](#1122-Haskell)
        - [1.1.3. Substitution](#113-substitution)
            - [1.1.3.0. JavaScript](#1130-JavaScript)
            - [1.1.3.1. Python](#1131-Python)
            - [1.1.3.2. Haskell](#1132-Haskell)
        - [1.1.4. Evaluation](#114-evaluation)
            - [1.1.4.0. JavaScript](#1140-JavaScript)
            - [1.1.4.1. Python](#1141-Python)
            - [1.1.4.2. Haskell](#1142-Haskell)
        - [1.1.5. Equality](#115-equality)
            - [1.1.5.0. JavaScript](#1150-JavaScript)
            - [1.1.5.1. Python](#1151-Python)
            - [1.1.5.2. Haskell](#1152-Haskell)
        - [1.1.6. Type-Checking](#116-type-checking)
            - [1.1.6.0. JavaScript](#1160-JavaScript)
            - [1.1.6.1. Python](#1161-Python)
            - [1.1.6.2. Haskell](#1162-Haskell)
- [2. Formality-Lang](#2-formality-lang)
- [3. Formality-Comp](#3-formality-comp)
- [4. Examples](#4-examples)
- [5. Problems](#5-problems)

## 1. Formality-Core

Formality-Core is the minimal core behind Formality. If you see Formality as a
programming language, then Core is the minimal amount of features required to
derive everything else as libraries. If you see it as a proof language, then
Core is the set of axioms from which all of mathematics derive. On this
section, we'll specify and implement it in 3 popular languages: Haskell, Python
and JavaScript.

### 1.0. Specification

#### 1.0.0. Syntax

Formality-Core programs are split as modules (`Module`), each module containing
a number of definitions, each definition containing 2 expressions (`Term`) for
its type and value respectively, each expression containing a number of
variables, references and other terms. The syntax of a `Term` is defined as
follows:

syntax                        | variant | meaning
----------------------------- | ------- | -------
`<name>`                      | Var     | a variable
`Type`                        | Typ     | type of types
`(<var> : <term>) -> <term>`  | All     | dependent function type
`(<var> : <term>;) -> <term>` | All     | dependent function type (erased)
`(<var>) => <term>`           | Lam     | dependent function value
`(<var>;) => <term>`          | Lam     | dependent function value (erased)
`<term>(<term>)`              | App     | dependent function application
`<term>(<term>;)`             | App     | dependent function application (erased)
`#{<name>} <term>`            | Slf     | self type
`#inst{<term>} <term>`        | Ins     | self value
`#elim{<term>}`               | Eli     | self elimination
`<term> :: <term>`            | Ann     | inline annotation
`(<term>)`                    | -       | parenthesis

The syntax for a `<name>` is defined as a sequence of ASCII characters on the
following set: 

```
a b c d e f g h i j k l m n o p q r s t u v w x y z
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
0 1 2 3 4 5 6 7 8 9 _
```

References and variables are desambiguated based on context. The syntax of a
`Module` is defined as follows:

syntax                     | variant | meaning
-------------------------- | ------- | -------
`<term> : <term> <module>` | Def     | a top-level definition
`<eof>                     | Eof     | the end of a module

Modules coincide with files, so, the end of a module should be parsed as the end
of the file. Whitespaces (newline, tab and space) are ignored. Here is an
example module:

```
identity : (A : Type) -> (a : A) -> A
  (A) => (a) => a

const : (A : Type) -> (a : A) -> (b : B) -> B
  (A) => (a) => (b) => B

apply_twice : (A : Type) -> (f : (x : A) -> A) -> (x : A) -> A
  (A) => (f) => (x) => f(f(x))
```

This module declares 3 top-level definitions, `identity`, `const` and
`apply_twice`. The last definition has `(A : Type) -> (f : (x : A) -> A) -> (x : A) -> A`
type and a `(A) => (a) => a` a value. That value consists of a function
(`{A} => ...`), that returns a function (`(f) => ...`), that returns a function
(`(x) => ...`), that returns `f` applied two times to `x`.

#### 1.0.1. Operations

Formality-Core is, essentially, the Lambda Calculus, which is just a fancy name
for the subset of JavaScript and Python that has only functions. Its only
primitive operation is the beta reduction, which is just a fancy name for
"function application". It says that, to evaluate a term in the shape `((x) => <body>)(<argm>)`,
one must 1. make sure that `<argm>` doesn't have any variable
named `x`, 2. replace every occurrence of `x` by `<argm>` in `<body>`, 3. return
`<body>`.

Evaluating Formality-Core programs means applying functions repeatedly until
there is nothing left to do. That is a pure operation that can't output messages
nor write files to disk; instead, it merely transforms an expression into
another, not unlike calling `eval` in a JavaScript expression containing only
numbers and arithmetic operations.

For example, this program: `(k) => ((x) => (t) => t(x)(x))((y) => y)` is
evaluated to `(k) => (t) => t((y) => y)((y) => y)` after one beta-reduction.
Since there are no more beta-reductions left, the evaluation is complete: the
term is in "normal form". If that process isn't clear, a separate study of the
Lambda Calculus might be helpful.

Formality-Core doesn't define any evaluation order or strategy. It could be
evaluated strictly as in JavaScripy and Python, lazily as in Haskell, or
optimally through interaction nets. This subject will be covered on the
Formality-Comp section.

#### 1.0.2. Type-System

Formality's type system is (... TODO ...).

### 1.1. Implementation

#### 1.1.0. Terms and Modules

Each variant of a term is implemented as a separate function that returns a JSON
determining which variant it is (in a field we call `ctor`), plus its contents
(in separate fields). For example, `(a) => a`, is a function (the `Lam` variant)
with a variable (the `Var` variant), as is represented as `{"ctor": "Lam",
"body": {"ctor": "Var", "name": "a"}}`. Lists are also represented in a similar
manner, and modules are represented as lists of name, type and term tuples.

##### 1.1.0.0. JavaScript

```javascript
// Term
// ====

function Var(indx) {
  return {ctor: "Var", indx};
};

function Ref(name) {
  return {ctor: "Ref", name};
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

function Ins(type, expr) {
  return {ctor: "Ins", type, expr};
};

function Eli(expr) {
  return {ctor: "Eli", expr};
};

function Ann(expr, type, done) {
  return {ctor: "Ann", expr, type, done};
};

// List
// ====

function Ext(head, tail) {
  return {ctor: "Ext", head, tail};
};

function Nil() {
  return {ctor: "Nil"};
};

// Module
// ======

function Def(name, type, term) {
  return {ctor: "Def", name, type, term};
};
```

##### 1.1.0.1. Python

```python
# Term
# ====

def Var(indx):
    return {"ctor": "Var", "indx": indx}

def Ref(name):
    return {"ctor": "Ref", "name": name}

def Typ():
    return {"ctor": "Typ"}

def All(name, bind, body, eras):
    return {"ctor": "All", "name": name, "bind": bind, "body": body, "eras": eras}

def Lam(name, body, eras):
    return {"ctor": "Lam", "name": name, "body": body, "eras": eras}

def App(func, argm, eras):
    return {"ctor": "App", "func": func, "argm": argm, "eras": eras}

def Slf(name, type):
    return {"ctor": "Slf", "name": name, "type": type}

def Ins(type, term):
    return {"ctor": "Slf", "type": type, "expr": expr}

def Eli(expr):
    return {"ctor": "Eli", "expr": expr}

def Ann(expr, type, done):
    return {"ctor": "Typ", "expr": expr, "type": type, "done": done}

# List
# ====

def Ext(head, tail):
    return {"ctor": "Ext", "head": head, "tail": tail}

def Nil():
    return {"ctor": "Nil"}

# Module
# ======

def Def(name, type, term):
    return {"ctor": "Def", "name": name, "type": type, "term": term}
```

##### 1.1.0.2. Haskell

```haskell
-- TODO
```

#### 1.1.1. Parsing

Parsing is done through a combination of small backtracking parsers that receive
the code to be parsed and return either a pair with the leftover code and parsed
value, or throw if the parser failed. The term parser is divided in two phases:
first, a base term is parsed, including the variants `Var`, `Typ`, `All`, `Lam`,
`Slf`, `Ins` and `Eli`. Afterwards, the term is extended by postfix parsers,
including the variants `App` and `Ann`. Note that, to avoid ambiguities, postfix
parsers must be on the same line as the base parser. The code below should be
considered specifications, up to the tiniest details.

##### 1.1.1.0. JavaScript:

```javascript
// Parsing
// =======

// Finds a value in a list
function find(list, cond, indx = 0) {
  switch (list.ctor) {
    case "Ext":
      if (cond(list.head, indx)) {
        return {value: list.head, index: indx};
      } else {
        return find(list.tail, cond, indx + 1);
      }
    case "Nil":
      return null;
  };
};

// Is this a space character?
function is_space(chr) {
  return chr === " " || chr === "\t" || chr === "\n";
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
function parse_nam(code, indx, size = 0) {
  if (indx < code.length && is_name(code[indx])) {
    var head = code[indx];
    var [indx, tail] = parse_nam(code, indx + 1, size + 1);
    return [indx, head + tail];
  } else if (size > 0) {
    return [indx, ""];
  } else {
    throw new Error();
  }
};

// Parses a parenthesis, `(<term>)`
function parse_par(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, term] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, term];
};

// Parses a dependent function type, `(<name> : <term>) => <term>`
function parse_all(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str(":", code, space(code, indx));
  var [indx, bind] = parse_trm(code, indx, vars);
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("->", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, All(name, bind, body, eras)];
};

// Parses a dependent function value, `(<name>) => <term>`
function parse_lam(code, indx, vars) {
  var [indx, skip] = parse_str("(", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  var [indx, skip] = parse_str("=>", code, space(code, indx));
  var [indx, body] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Lam(name, body, eras)];
};

// Parses the type of types, `Type`
function parse_typ(code, indx, vars) {
  var [indx, skip] = parse_str("Type", code, space(code, indx));
  return [indx, Typ()];
};

// Parses variables, `<name>`
function parse_var(code, indx, vars) {
  var [indx, name] = parse_nam(code, space(code, indx));
  var got = find(vars, (x,i) => x === name);
  if (got) {
    return [indx, Var(got.index)];
  } else {
    return [indx, Ref(name)];
  };
};

// Parses a self type, `#{<name>} <term>`
function parse_slf(code, indx, vars) {
  var [indx, skip] = parse_str("#{", code, space(code, indx));
  var [indx, name] = parse_nam(code, space(code, indx));
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, Ext(name, vars));
  return [indx, Slf(name, type)];
};

// Parses a self instantiation, `#inst{<term>}`
function parse_ins(code, indx, vars) {
  var [indx, skip] = parse_str("#inst{", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  var [indx, expr] = parse_trm(code, indx, vars);
  return [indx, Ins(type, expr)];
};

// Parses a self elimination, `#elim{<term>}`
function parse_eli(code, indx, vars) {
  var [indx, skip] = parse_str("#elim{", code, space(code, indx));
  var [indx, expr] = parse_trm(code, indx, vars);
  var [indx, skip] = parse_str("}", code, space(code, indx));
  return [indx, Eli(expr)];
};

// Parses an application, `<term>(<term>)`
function parse_app(code, indx, func, vars) {
  var [indx, skip] = parse_str("(", code, indx);
  var [indx, argm] = parse_trm(code, indx, vars);
  var [indx, eras] = parse_opt(";", code, space(code, indx));
  var [indx, skip] = parse_str(")", code, space(code, indx));
  return [indx, App(func, argm, eras)];
};

// Parses an annotation, `<term> :: <term>`
function parse_ann(code, indx, expr, vars) {
  var [indx, skip] = parse_str("::", code, space(code, indx));
  var [indx, type] = parse_trm(code, indx, vars);
  return [indx, Ann(expr, type, false)];
};

// Parses a term
function parse_trm(code, indx, vars = Nil()) {
  // Parses the base term, trying each variant once
  var base_parse = first_valid([
    () => parse_all(code, indx, vars),
    () => parse_lam(code, indx, vars),
    () => parse_par(code, indx, vars),
    () => parse_typ(code, indx, vars),
    () => parse_slf(code, indx, vars),
    () => parse_ins(code, indx, vars),
    () => parse_eli(code, indx, vars),
    () => parse_var(code, indx, vars),
  ]);

  // Parses postfix extensions, trying each variant repeatedly
  var post_parse = base_parse;
  while (true) {
    var [indx, term] = post_parse;
    post_parse = first_valid([
      () => parse_app(code, indx, term, vars),
      () => parse_ann(code, indx, term, vars),
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
    var [indx, type] = parse_trm(code, space(code, indx), Nil());
    var [indx, term] = parse_trm(code, space(code, indx), Nil());
    return Ext(Def(name, type, term), parse_mod(code, indx));
  } catch (e) {
    return Nil();
  }
};
```

##### 1.1.1.1. Python:

```python
# Parsing
# =======

# Finds a value in a list
def find(list, cond, indx = 0):
    ctor = list["ctor"]
    if ctor == "Ext":
        if cond(list["head"], indx):
            return {"value": list["head"], "index": indx}
        else:
            return find(list["tail"], cond, indx + 1)
    elif ctor == "Nil":
        return None

# Is this a space character?
def is_space(val):
    return val == " " or val == "\t" or val == "\n"

# Is this a name-valid character?
def is_name(val):
    val = ord(val)
    return ((val >= 48 and val < 58)   # 0-9
        or  (val >= 65 and val < 91)   # A-Z
        or  (val >= 95 and val < 96)   # _
        or  (val >= 97 and val < 123)) # a-z

# Returns the first function that doesn't raise, or None
def first_valid(fns):
    for [fn, args] in fns:
        try:
            return fn(*args)
        except:
            continue
    return None

# Drop characters while a condition is met.
def drop_while(cond, code, indx):
    while indx < len(code) and cond(code[indx]):
        indx += 1
    return indx

# Drop spaces
def space(code, indx):
    return drop_while(is_space, code, indx)

# Drops spaces and parses an exact string
def parse_str(str, code, indx):
    if len(str) == 0:
        return [indx, str]
    elif indx < len(code) and code[indx] == str[0]:
        return parse_str(str[1:], code, indx+1)
    else:
        raise RuntimeError()

# Parses an optional character
def parse_opt(val, code, indx):
    if code[indx] == val:
        return [indx + 1, True]
    else:
        return [indx, False]

# Parses a valid name, non-empty
def parse_nam(code, indx, size = 0):
    if indx < len(code) and is_name(code[indx]):
        head = code[indx]
        [indx, tail] = parse_nam(code, indx + 1, size + 1)
        return [indx, head + tail]
    elif size > 0:
        return [indx, ""]
    else:
        raise

# Parses a parenthesis, `(<term>)`
def parse_par(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, term] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, term]

# Parses a dependent function type, `(<name> : <term>) => <term>`
def parse_all(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str(":", code, space(code, indx))
    [indx, bind] = parse_trm(code, indx, vars)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("->", code, space(code, indx))
    [indx, body] = parse_trm(code, indx, Ext(name, vars))
    return [indx, All(name, bind, body, eras)];

# Parses a dependent function value, `(<name>) => <term>`
def parse_lam(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("=>", code, space(code, indx))
    [indx, body] = parse_trm(code, indx, Ext(name, vars))
    return [indx, Lam(name, body, eras)]

# Parses the type of types, `Type`
def parse_typ(code, indx, vars):
    [indx, skip] = parse_str("Type", code, space(code, indx))
    return [indx, Typ()]

# Parses variables, `<name>`
def parse_var(code, indx, vars):
    [indx, name] = parse_nam(code, space(code, indx))
    got = find(vars, lambda x, i: x == name)
    if got:
        return [indx, Var(got["index"])]
    else:
        return [indx, Ref(name)]

# Parses a self type, `#{<name>} <term>`
def parse_slf(code, indx, vars):
    [indx, skip] = parse_str("#{", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, Ext(name, vars))
    return [indx, Slf(name, type)]

# Parses a self instantiation, `#inst{<term>}`
def parse_ins(code, indx, vars):
    [indx, skip] = parse_str("#inst{", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, expr] = parse_trm(code, indx, vars)
    return [indx, Ins(type, expr)]

# Parses a self elimination, `#elim{<term>}`
def parse_eli(code, indx, vars):
    [indx, skip] = parse_str("#elim{", code, space(code, indx))
    [indx, expr] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str("}", code, space(code, indx))
    return [indx, Eli(expr)]

# Parses an application, `<term>(<term>)`
def parse_app(code, indx, func, vars):
    [indx, skip] = parse_str("(", code, indx)
    [indx, argm] = parse_trm(code, indx, vars)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, App(func, argm, eras)]

# Parses an annotation, `<term> :: <term>`
def parse_ann(code, indx, expr, vars):
    [indx, skip] = parse_str("::", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, vars)
    return [indx, Ann(expr, type, False)]

# Parses a term
def parse_trm(code, indx, vars = Nil()):
    # Parses the base term, trying each variant once
    base_parse = first_valid([
        [parse_all, [code, indx, vars]],
        [parse_lam, [code, indx, vars]],
        [parse_par, [code, indx, vars]],
        [parse_typ, [code, indx, vars]],
        [parse_slf, [code, indx, vars]],
        [parse_ins, [code, indx, vars]],
        [parse_eli, [code, indx, vars]],
        [parse_var, [code, indx, vars]],
    ])

    # Parses postfix extensions, trying each variant repeatedly
    post_parse = base_parse
    while True:
        [indx, term] = post_parse
        post_parse = first_valid([
            [parse_app, [code, indx, term, vars]],
            [parse_ann, [code, indx, term, vars]],
        ])
        if not post_parse:
            return base_parse
        else:
            base_parse = post_parse

    return None

# Parses a module
def parse_mod(code, indx):
    try:
        [indx, name] = parse_nam(code, space(code, indx))
        [indx, skip] = parse_str(":", code, space(code, indx))
        [indx, type] = parse_trm(code, space(code, indx), Nil())
        [indx, term] = parse_trm(code, space(code, indx), Nil())
        return Ext(Def(name, type, term), parse_mod(code, indx))
    except:
        return Nil()
```

##### 1.1.1.2. Haskell:

```haskell
-- TODO
```

#### 1.1.2. Stringification

Stringification is considerably simpler than parsing. It simply requires us to
recursively scan the term and convert variants to their respective textual
representations.

##### 1.1.2.0. JavaScript:

```javascript
// Stringification
// ===============

function stringify_trm(term, vars = Nil()) {
  switch (term.ctor) {
    case "Var":
      var got = find(vars, (x,i) => i === term.indx);
      if (got) {
        return got.value;
      } else {
        return "#" + term.indx;
      };
    case "Ref":
      return term.name;
    case "Typ":
      return "Type";
    case "All": 
      var name = term.name;
      var bind = stringify_trm(term.bind, vars);
      var body = stringify_trm(term.body, Ext(name, vars));
      var eras = term.eras ? ";" : "";
      return "("+name+" : "+bind+eras+") -> "+body;
    case "Lam": 
      var name = term.name;
      var body = stringify_trm(term.body, Ext(name, vars));
      var eras = term.eras ? ";" : "";
      return "("+name+eras+") => "+body;
    case "App":
      var func = stringify_trm(term.func, vars);
      var argm = stringify_trm(term.argm, vars);
      var eras = term.eras ? ";" : "";
      return "("+func+")("+argm+eras+")";
    case "Slf":
      var name = term.name;
      var type = stringify_trm(term.type, Ext(name, vars));
      return "#{"+name+"} "+type;
    case "Ins":
      var type = stringify_trm(term.type, vars);
      var expr = stringify_trm(term.expr, vars);
      return "#inst{"+type+"} "+expr;
    case "Eli":
      var expr = stringify_trm(term.expr, vars);
      return "#elim{"+expr+"}";
    case "Ann":
      var expr = stringify_trm(term.expr, vars);
      var type = stringify_trm(term.type, vars);
      return expr+" :: "+type;
  }
};

function stringify_mod(mod) {
  switch (mod.ctor) {
    case "Ext":
      var name = mod.head.name;
      var type = stringify_trm(mod.head.type, Nil());
      var term = stringify_trm(mod.head.term, Nil());
      var defs = stringify_mod(mod.tail);
      return name + " : " + type + "\n  " + term + "\n\n" + defs;
    case "Nil":
      return "";
  }
};
```

##### 1.1.2.1. Python

```python
# Stringification
# ===============

def stringify_trm(term, vars = Nil()):
    ctor = term["ctor"]
    if ctor == "Var":
        got = find(vars, lambda x, i: i == term["indx"])
        if got:
            return got["value"]
        else:
            return "#" + term["indx"]
    elif ctor == "Ref":
        return term["name"];
    elif ctor == "Typ":
        return "Type";
    elif ctor == "All": 
      name = term["name"]
      bind = stringify_trm(term["bind"], vars)
      body = stringify_trm(term["body"], Ext(name, vars))
      eras = ";" if term["eras"] else ""
      return "("+name+" : "+bind+eras+") -> "+body
    elif ctor == "Lam":
      name = term["name"]
      body = stringify_trm(term["body"], Ext(name, vars))
      eras = ";" if term["eras"] else ""
      return "("+name+eras+") => "+body
    elif ctor == "App":
      func = stringify_trm(term["func"], vars)
      argm = stringify_trm(term["argm"], vars)
      eras = ";" if term["eras"] else ""
      return "("+func+")("+argm+eras+")"
    elif ctor == "Slf":
      name = term["name"]
      type = stringify_trm(term["type"], Ext(name, vars))
      return "#{"+name+"} "+type
    elif ctor == "Ins":
      type = stringify_trm(term["type"], vars)
      expr = stringify_trm(term["expr"], vars)
      return "#inst{"+type+"} "+expr
    elif ctor == "Eli":
      expr = stringify_trm(term["expr"], vars)
      return "#elim{"+expr+"}"
    elif ctor == "Ann":
      expr = stringify_trm(term["expr"], vars)
      type = stringify_trm(term["type"], vars)
      return expr+" :: "+type

def stringify_mod(mod):
    ctor = mod["ctor"]
    if ctor == "Ext":
        name = mod["head"]["name"]
        type = stringify_trm(mod["head"]["type"], Nil())
        term = stringify_trm(mod["head"]["term"], Nil())
        defs = stringify_mod(mod["tail"])
        return name + " : " + type + "\n  " + term + "\n\n" + defs
    elif ctor == "Nil":
        return ""
```

##### 1.1.2.2. Haskell

```haskell
-- TODO
```

#### 1.1.3. Substitution

Substitution is the process of (... TODO: explain bruijn indices and name
capture ...).

##### 1.1.3.0. JavaScript

```javascript
// Substitution
// ============

function shift(term, inc, dep) {
  switch (term.ctor) {
    case "Var":
      if (term.indx < dep) {
        return Var(term.indx);
      } else {
        return Var(term.indx + inc);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = shift(term.bind, inc, dep);
      var body = shift(term.body, inc, dep + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = shift(term.body, inc, dep + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = shift(term.func, inc, dep);
      var argm = subst(term.argm, inc, dep);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = shift(term.type, inc, dep + 1);
      return Slf(name, type);
    case "Ins":
      var name = term.name;
      var type = shift(term.type, inc, dep);
      var expr = shift(term.expr, inc, dep);
      return Ins(name, type, expr);
    case "Ann":
      var expr = shift(term.expr, inc, dep); 
      var type = shift(term.type, inc, dep);
      var done = term.done;
      return Ann(expr, type, done);
  };
};

function subst(term, val, dep) {
  switch (term.ctor) {
    case "Var":
      if (term.indx < dep) {
        return Var(term.indx);
      } else if (term.indx === dep) {
        return val;
      } else {
        return Var(term.indx - 1);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = subst(term.bind, val, dep);
      var body = subst(term.body, shift(val,1,0), dep + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = subst(term.body, shift(val,1,0), dep + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = subst(term.func, val, dep);
      var argm = subst(term.argm, val, dep);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = subst(term.type, shift(val,1,0), dep + 1);
      return Slf(name, type);
    case "Ins":
      var name = term.name;
      var type = subst(term.type, val, dep);
      var expr = subst(term.expr, val, dep);
      return Ins(name, type, term);
    case "Ann":
      var expr = subst(term.expr, val, dep); 
      var type = subst(term.type, val, dep);
      var done = term.done;
      return Ann(expr, type, done);
  };
};
```

#### 1.1.4. Evaluation

The reference implementation of evaluation uses the high-order abstract syntax
strategy. That is, the syntax tree, usually stored as a JSON, is converted
into a representation that uses functions on binders. For example, the term 
`((a) => (b) => b(a))(x => x)`, which would be represented as:

```json
{
  "ctor": "App",
  "func": {
    "ctor": "Lam",
    "name": "a",
    "body": {
      "ctor": "Lam",
      "name": "b",
      "body": {
        "ctor": "App",
        "func": {"ctor": "Var", "name": "b"},
        "argm": {"ctor": "Var", "name": "a"}
      }
    }
  },
  "func": {
    "ctor": "Lam",
    "name": "x",
    "body": {"ctor": "Var", "name": "x"}
  }
}
```

Is converted into a new "high-order" format by replacing variables by native functions:
    
```
{
  "ctor": "App",
  "func": {
    "ctor": "Lam",
    "name": "a",
    "body": a => {
      "ctor": "Lam",
      "name": "b",
      "body": b => {
        "ctor": "App",
        "func": b,
        "argm": a
      }
    }
  },
  "func": {
    "ctor": "Lam",
    "name": "x",
    "body": x => x
  }
}
```

That format is then evaluated by finding redexes, that is, sub-terms in the shape:

```
{"ctor": "App", "func": {"ctor": "Lam", "body": x => <BODY>}, "argm": <ARGM>}
```

And replacing them by `(x => <BODY>)(<ARGM>)`. This results in:

```
{
  "ctor": "Lam",
  "name": "b",
  "body": b => {
    "ctor": "App",
    "func": b,
    "argm": {"ctor": "Lam", "name": "x", "body": x => x}
  }
}
```

Which can then be converted back to a low-order term corresponding to `(b) =>
b((x) => x)`, the normal form (result) of this example input. Since this process
uses native functions under the hoods, it is both fast and simple to implement.
Note there are other ways to evaluate Formality-Core terms; this is just the one
used on the reference code.

We'll need 7 new functions: `find`, which searches a variable in a module,
`to_high_order` and `to_low_order`, which converts a term between the formats
described above, and `normalize_high_order` and `reduce_high_order`, which finds
and rewrites redexes on high-order terms, with and without going under binders,
respectivelly, and `normalize` and `reduce`, the same functions for the
low-order formats.

##### 1.1.4.0. JavaScript

```javascript
// Evaluation
// ==========

function to_high_order(term, vars = Nil()) {
  switch (term.ctor) {
    case "Var":
      var got = find(vars, (x,i) => i === term.indx);
      if (got) {
        return got.value;
      } else {
        return Var(term.indx);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All": 
      var name = term.name;
      var bind = to_high_order(term.bind, vars);
      var body = x => to_high_order(term.body, Ext(x, vars));
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam": 
      var name = term.name;
      var body = x => to_high_order(term.body, Ext(x, vars));
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = to_high_order(term.func, vars);
      var argm = to_high_order(term.argm, vars);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = term.name;
      var type = x => to_high_order(term.type, Ext(x, vars));
      return Slf(name, type)
    case "Ins":
      var type = to_high_order(term.type, vars);
      var expr = to_high_order(term.expr, vars);
      return Ins(type, expr);
    case "Eli":
      var expr = to_high_order(term.expr, vars);
      return Eli(expr);
    case "Ann":
      var expr = to_high_order(term.expr, vars);
      var type = to_high_order(term.type, vars);
      return Ann(expr, type);
  }
};

function to_low_order(term, depth = 0) {
  switch (term.ctor) {
    case "Var":
      if (term.indx < depth) {
        return Var(depth - term.indx - 1);
      } else {
        return Var(term.indx);
      }
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All": 
      var name = "x" + depth;
      var bind = to_low_order(term.bind, depth);
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = "x" + depth;
      var body = to_low_order(term.body(Var(depth)), depth + 1);
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = to_low_order(term.func, depth);
      var argm = to_low_order(term.argm, depth);
      var eras = term.eras;
      return App(func, argm, eras);
    case "Slf":
      var name = "x" + depth;
      var type = to_low_order(term.type(Var(depth)), depth + 1);
      return Slf(name, type);
    case "Ins":
      var type = to_low_order(term.type, depth);
      var expr = to_low_order(term.expr, depth);
      return Ins(type, expr);
    case "Eli":
      var expr = to_low_order(term.expr, depth);
      return Eli(expr);
    case "Ann":
      var expr = to_low_order(term.expr, depth);
      var type = to_low_order(term.type, depth);
      return Ann(expr, type);
  }
};

function reduce_high_order(term) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = term.bind;
      var body = term.body;
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = term.body;
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func);
      switch (func.ctor) {
        case "Lam":
          return reduce_high_order(func.body(term.argm));
        default:
          return App(func, reduce_high_order(term.argm));
      };
    case "Slf":
      var name = term.name;
      var type = term.type;
      return Slf(name, type);
    case "Ins":
      return reduce_high_order(term.expr);
    case "Eli":
      return reduce_high_order(term.expr);
    case "Ann":
      return reduce_high_order(term.expr);
  };
};

function normalize_high_order(term) {
  switch (term.ctor) {
    case "Var":
      return Var(term.indx);
    case "Ref":
      return Ref(term.name);
    case "Typ":
      return Typ();
    case "All":
      var name = term.name;
      var bind = normalize_high_order(term.bind);
      var body = x => normalize_high_order(term.body(x));
      var eras = term.eras;
      return All(name, bind, body, eras);
    case "Lam":
      var name = term.name;
      var body = x => normalize_high_order(term.body(x));
      var eras = term.eras;
      return Lam(name, body, eras);
    case "App":
      var func = reduce_high_order(term.func);
      switch (func.ctor) {
        case "Lam":
          return normalize_high_order(func.body(term.argm));
        default:
          return App(func, normalize_high_order(term.argm));
      };
    case "Slf":
      var name = term.name;
      var type = normalize_high_order(term.type);
      return Slf(name, type);
    case "Ins":
      return normalize_high_order(term.expr);
    case "Eli":
      return normalize_high_order(term.expr);
    case "Ann":
      return normalize_high_order(term.expr);
  };
};

function reduce(term) {
  return to_low_order(reduce_high_order(to_high_order(term, Nil())), 0);
};

function normalize(term) {
  return to_low_order(normalize_high_order(to_high_order(term, Nil())), 0);
};
```

#### 1.1.6.0. Type-Checking

TODO: explain how type-checking is implemented with contexts, a bidirectional
flow and weak normal forms.

##### 1.1.6.1. JavaScript

```javascript
// Type-Checking
// =============

function typecheck(term, type = null, ctx = Nil()) {
  var type = type ? reduce(type) : null;
  switch (term.ctor) {
    case "Var":
      var got = find(ctx, (x,i) => i === term.indx);
      if (got) {
        return shift(got.value, got.index + 1, 0);
      } else {
        throw new Error();
      }
    case "Typ":
      return Typ();
    case "All":
      var bind_typ = typecheck(term.bind, Typ(), ctx);
      var body_ctx = Ext(term.bind, ctx);
      var body_typ = typecheck(term.body, Typ(), body_ctx);
      return Typ();
    case "Lam":
      switch (type.ctor) {
        case "All":
          var body_ctx = Ext(type.bind, ctx);
          var body_typ = typecheck(term.body, type.body, body_ctx);
          return All(term.name, type.bind, body_typ, term.eras);
        default:
          throw "Lambda has a non-function type.";
      }
    case "App":
      var func_typ = reduce(typecheck(term.func, null, defs, ctx));
      switch (func_typ.ctor) {
        case "All":
          var argm_typ = typecheck(term.argm, func_typ.bind, ctx);
          var term_typ = reduce(subst(func_typ, term.argm));
          return term_typ;
        default:
          throw "Non-function application.";
      };
    case "Slf":
      var type_ctx = Ext(term, ctx);
      var type_typ = typecheck(term.type, typ, ctx);
      return Typ();
    case "Ins":
      var term_typ = reduce(term.type);
      switch (term_typ.ctor) {
        case "Slf":
          var self_typ = subst(term_typ.type, Ann(term.type, term, true), 0);
          var expr_typ = typecheck(term.expr, self_typ, ctx);
          return term.type;
        default:
          throw "Non-self instantiation.";
      };
    case "Eli":
      var expr_typ = reduce(typecheck(term.expr, null, ctx));
      switch (expr_typ.ctor) {
        case "Slf":
          return subst(expr_typ.type, term.expr, 0);
        default:
          throw "Non-self elimination.";
      };
    case "Ann":
      if (term.done) {
        return term.type;
      } else {
        return typecheck(term.expr, term.type, ctx);
      }
  };
};
```

### 1.1.X.0. Exporting

```javascript
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
  Ext,
  Nil,
  Def,
  is_space,
  is_name,
  first_valid,
  drop_while,
  space,
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
  find,
  shift,
  subst,
  to_high_order,
  to_low_order,
  reduce_high_order,
  normalize_high_order,
  reduce,
  normalize,
  typecheck,
};
```
