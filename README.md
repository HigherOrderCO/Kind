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
    - [1.0.0. Syntax](#100-syntax)
    - [1.0.1. Evaluation](#101-evaluation)
    - [1.0.2. Type-Checking](#102-type-checking)
- [2. Formality-Lang](#2-formality-lang)
- [3. Formality-Comp](#3-formality-comp)
- [4. Examples](#4-examples)
- [5. Problems](#5-problems)
- [6. Implementations](#6-implementations)
    - [6.0. Formality-Core](#60-formality-core)
        - [6.0.0. Haskell](#600-haskell)
        - [6.0.1. Python](#601-python)
        - [6.0.2. JavaScript](#602-javascript)

## 1. Formality-Core

Formality-Core is the minimal core behind Formality. If you see Formality as a
programming language, then Core is the minimal amount of features required to
derive everything else as libraries. If you see it as a proof language, then
Core is the set of axioms from which all of mathematics derive. On this section,
we'll specify it informally. Reference implementations using popular languages
are provided later. 

#### 1.0.0. Syntax

Formality-Core programs are split as modules (`Module`), each module containing
a number of definitions, each definition containing 2 expressions (`Term`), one
for its type and one for its value, each expression containing a number of
variables, references and other terms. The syntax of a `Term` is defined as
follows:

syntax                        | variant | meaning
----------------------------- | ------- | -------
`<name>`                      | Var     | a variable
`<name>`                      | Ref     | a reference
`Type`                        | Typ     | type of types
`(<var> : <term>) -> <term>`  | All     | dependent function type
`(<var> : <term>;) -> <term>` | All     | dependent function type (erased)
`(<var>) => <term>`           | Lam     | dependent function value
`(<var>;) => <term>`          | Lam     | dependent function value (erased)
`<term>(<term>)`              | App     | dependent function application
`<term>(<term>;)`             | App     | dependent function application (erased)
`${<name>} <term>`            | Slf     | self type
`$inst{<term>} <term>`        | Ins     | self value
`$elim{<term>}`               | Eli     | self elimination
`<term> :: <term>`            | Ann     | inline annotation
`(<term>)`                    | -       | parenthesis

So, for example, `Type` is a valid term of variant `Typ`, `(A : Type) -> Type`
is a valid term of variant `All` containing a two valid terms of variant `Typ`,
`foo(bar)` is a valid term of variant `App` containing two valid terms of
variant `Ref`. References and variables are both parsed as `<name>`, and
desambiguated based on context. The syntax for a `<name>` is defined as a
sequence of ASCII characters on the following set: 

```
a b c d e f g h i j k l m n o p q r s t u v w x y z
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
0 1 2 3 4 5 6 7 8 9 _
```

In the reference implementations, terms and modules are represented with
algebraic datatypes, when available, or as a JSON emulating a tagged union, when
not. For example, in Haskell, we use `data`:

```haskell
(TODO)
```

In Python and JavaScript, we use functions that return a JSON with the contained
fields, and an additional "ctor" field to track the selected variant.

```python
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
```

The `Var` variant represents a variable bound by a function value (`Lam`), a
function type (`All`), or a self type (`Slf`). It stores a number representing
how many binders there are between its location and the location where it is
bound. 

The `Ref` variant represents a reference, which is the usage of a top-level
definition. The `name` field stores the name of the referenced definition.

The `All` variant represents a function type, also known as an universal
quantification, or "forall". The `name` field stores its bound variable name,
the `bind` field stores the type of its argument, the `body` field stores
its return type, and the `eras` field represents its computational relevance
(more on that later).

The `Lam` variant represents a pure function, also known as a lambda. The `name`
field stores its bound variable name, the `body` field stores its returned
expression, and the `eras` field represents its computational relevance.

The `App` variant represents a function application. The `func` field stores the
function to be applied, and the `argm` field stores the argument. 

The `Slf` variant represents a self type. The `name` field stores its bound
variable name and the `type` field stores a type that can refer to itself. Self
types will be explained in more details later.

The `Ins` variant represents a self value. The `type` field stores the type of
that value and the `expr` field represents the value itself.

The `Eli` variant represents the use, or inspection, of a self value. The `expr`
field stores the value to be inspected.

The `Ann` variant represents an inline type annotation. The `expr` field
represents the annotated expression, and the `type` field represents its type.

As an example, the `(a) => (b) => (c) => a(b)(c)` term would be represented as:

```json
{
  "ctor": "Lam",
  "name": "a",
  "body": {
    "ctor": "Lam",
    "name": "b",
    "body": {
      "ctor": "Lam",
      "name": "c",
      "body": {
        "ctor": "App",
        "func": {
          "ctor": "App",
          "func": {
            "ctor": "Var",
            "indx": 2
          },
          "argm": {
            "ctor": "Var",
            "indx": 1
          },
          "eras": false
        },
        "argm": {
          "ctor": "Var",
          "indx": 0
        },
        "eras": false
      },
      "eras": false
    },
    "eras": false
  },
  "eras": false
}
```

And the `(A : Type;) -> (x : A) -> A` term would be represented as:

```json
{
  "ctor": "All",
  "name": "A",
  "bind": {
    "ctor": "Typ"
  },
  "body": {
    "ctor": "All",
    "name": "x",
    "bind": {
      "ctor": "Var",
      "indx": 0
    },
    "body": {
      "ctor": "Var",
      "indx": 1
    },
    "eras": false
  },
  "eras": true
}
```

In reference implementations, parsing is done through a combination of small
backtracking parsers that receive the code to be parsed and return either a pair
with the leftover code and parsed value, or throw if the parser failed. The term
parser is divided in two phases: first, a base term is parsed, including the
variants `Var`, `Typ`, `All`, `Lam`, `Slf`, `Ins` and `Eli`. Afterwards, the
term is extended by postfix parsers, including the variants `App` and `Ann`.
Parsing involves subtle details that could differ among implementations. To
prevent that, the reference implementations included should be considered the
specification.

The syntax of a `Module` is defined as follows:

syntax                     | variant | meaning
-------------------------- | ------- | -------
`<term> : <term> <module>` | Def     | a top-level definition
`<eof>`                    | Eof     | the end of a module

Modules often coincide with files, so, the end of a module should be parsed as
the end of the file. Whitespaces (newlines, tabs and spaces) are ignored. Here
is an example module:

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

In reference implementations, module are represented as lists of `(name, type,
term)` unions. That is, in Python:

```python
def Ext(head, tail):
    return {"ctor": "Ext", "head": head, "tail": tail}

def Nil():
    return {"ctor": "Nil"}

def Def(name, type, term):
    return {"ctor": "Def", "name": name, "type": type, "term": term}
```

Here, `Nil` and `Ext` are list constructors. `Nil()` represents an empty list,
and `Ext(x, xs)` represents the list `xs` extended with the `x` value.

#### 1.0.1. Evaluation

Formality-Core is, essentially, the Lambda Calculus, which is just a fancy name
for the subset of JavaScript and Python that has only functions. Its only
primitive operation is the beta-reduction, which is just a fancy name for
"function application". It says that, to evaluate a term in the shape
`((x) => <body>)(<argm>)`, one must replace every occurrence of `x` by `<argm>`
in `<body>` in a name-capture-avoiding manner. Formally:

```
((x) => f)(a)
------------- beta-reduction
f[x <- a]
```

Evaluating Formality-Core programs means applying functions repeatedly until
there is nothing left to do. That is a pure operation that can't output messages
nor write files to disk; instead, it merely transforms an expression into
another, not unlike calling eval in a JavaScript expression containing only
numbers and arithmetic operations. As an example, `((x) => x(x))(y)` is
evaluated to `y(y)` after one beta-reduction. Since there are no more
beta-reductions left, the evaluation is complete: it is in "normal form".

Substitution is the most delicate part of beta-reduction. It is technically
simple, but can be tricky to get right due to "name capture". For example, the
`(x) => ((a) => (x) => a)(x)` term, if reduced naively, would result in
`(x) => (x) => x`, which would be wrong, since `x` was supposed to refer to the
outermost `(x) =>` lambda, not the innermost one. The right result would be `(x)
=> (y) => x`: the inner `(x) =>` was renamed as `(y) =>` to avoid the capture.
If that process isn't clear, check the appendix for an overview of the Lambda
Calculus.

Formality-Core doesn't define any evaluation order. It could be evaluated
strictly as in JavaScripy and Python, lazily as in Haskell, or optimally through
interaction nets. This subject will be covered on the Formality-Comp section.

The reference implementation of evaluation uses high-order abstract syntax
(HOAS). That is, the syntax tree, usually stored as a JSON, is converted into a
representation that uses functions for binders like `Lam`. For example, the term
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

Is converted into a new "high-order" format that uses native functions instead
of variables:
    
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

It is then evaluated by finding redexes, that is, sub-terms in the shape:

```
{"ctor": "App", "func": {"ctor": "Lam", "body": x => <BODY>}, "argm": <ARGM>}
```

And replacing them by `(x => <BODY>)(<ARGM>)`. The example above becomes:

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

Which can then be converted back to a low-order term corresponding to
`(b) => b((x) => x)`, the normal form (result) of the example. Since this
process uses native functions under the hoods, it is both fast and simple to
implement. Note there are other ways to evaluate Formality-Core terms; this is
just the one used on the reference implementations.

### 1.0.2. Type-Checking

Type-checking is the act of preventing runtime errors by statically checking
that certain expectations hold. For example, if a function assumes an `Int`
argument, calling it with a `String` would be incorrect. Without types, that
would result in a (potentially disastrous) runtime bug. Type-checking would
prevent it by statically asserting that all functions are called with the type
of arguments they expect.

In Formality, types and programs coexist in the same level, there isn't a
distinction between them. Types are not different from numbers or strings. They
can be stored in tuples, returned from functions and so on. This flexibility
gives it unrestricted static checking capabilities, allowing programmers to go
as far as proving complex mathematical theorems about the runtime behavior of
their programs, if they wish to.

For example, suppose you want to write a safe division function. In untyped
languages, you could do it as:

```javascript
function safe_div(a, b) {
  // Prevents non-numeric dividends
  if (typeof a !== "number") {
    throw "Dividend is not a number.";
  };

  // Prevent non-numeric divisors
  if (typeof a !== "number") {
    throw "Divisor is not a number.";
  };

  // Prevents division by zero
  if (b === 0) {
    throw "Attempted to divide by zero.";
  };

  return a / b;
};
```

While this prevents divisions of strings, or division by zero, it does so
through runtime checks. There would not only be extra costs, but the program
would still crash if the caller of `safe_div` didn't treat the exceptions.
Most statically typed languages such as TypeScript allow us to do better:

```typescript
function safe_div(a : Number, b : Number): Number {
  // Prevents division by zero
  if (b === 0) {
    throw "Attempted to divide by zero.";
  };

  return a / b;
};
```

Here, `a` and `b` are statically checked to be numbers, so we don't need to
check their types at runtime. Writing `safe_div("foo","bar")` would be a
compile-time error and never go undetected to production. Problem is, we still
need to check if `b` is zero. That's because the type-system of TypeScript (and
most statically typed languages) has an expressivity barrier that doesn't allow
it to reason about values of computations. Fixing that lack of expressivity is
the main benefit of merging types and values on the same level. In Formality,
we could write:

```
safe_div(a : Number, b : NonZero(Number)): Number
  a / b
```

Here, `NonZero(Number)` would be statically, symbolically checked to be
different from zero. No runtime checks would be needed, no runtime errors would
be possible, and calling `safe_div` incorrectly would be immediately reported as
a compile error. In a similar fashion, we could use types to express arbitrarily
precise invariants and expectations, allowing us to go as far as proving
mathematical theorems about the behavior of our programs. Of course, all this
power is optional: one can use Formality as TypeScript by simply writting less
precise types.

As complex as it looks, type-checking Formality-COre expressions is actually
surprisingly simple; arguably orders of magnitude simpler than doing so for
TypeScript. Here is the type-checker from the JavaScript reference
implementation:

```javascript
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

(... to be continued ...)

## 6. Implementations

(Check the other files on this repository for the reference implementations.
Those will be added to this paper when finished!)
