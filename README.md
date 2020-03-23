Formality
=========

Formality is a proof and programming language, as well as a standard format for
algorithms and proofs. It exists to fill a hole in the current market: there
aren't many programming languages featuring theorem proving that are 1. simple,
2. efficient and 3. accessible.

**Simplicity** makes it easy to understand and implement. We accomplish that by
building the whole language on top of a very simple type-theory based on
self-types that can be understood by a regular developer in a working day.

**Efficiency** is required if we want the language to be used for production
software. We accomplish that by compiling Formality to a massively parallel,
non-garbage-collected, Lévy-optimal functional runtime.

**Accessibility** makes it usable by regular developers, not just experts. We
accomplish it by translating advanced concepts to a familiar syntaxes that
resembles popular languages and takes inspiration from the [Zen of Python](https://www.python.org/dev/peps/pep-0020/).

## 0. Table of Contents

This paper is split in 5 sections:

1. [Formality-Core](#formality-core): our minimal core, specified and
   implemented in Haskell, Python and JavaScript.

2. Formality-Lang: the user-facing language, specified and implemented in
   Formality-Core.

3. Formality-Comp, the efficient runtime, specified and implemented in
   Formality-Core.

4. Examples: example programs and proofs, compilation and interop.

5. Problems: two open problems will be related and discussed.

## 1. Formality-Core

Formality-Core is the minimal core behind Formality. If you see Formality as a
programming language, then Core is the minimal amount of features required to
derive everything else as libraries. If you see it as a proof language, then
Core is the set of axioms from which all of mathematics derive. On this
section, we'll specify and implement it in 3 popular languages: Haskell, Python
and JavaScript.

### Syntax definition

Formality-Core programs are split as modules (`Module`), each module containing
a number of definitions, each definition containing 2 expressions (`Term`) for
its type and value respectively, each expression containing a number of
variables, references and other terms. The syntax of a `Term` is defined as
follows:

syntax                       | variant | meaning
---------------------------- | ------- | -------
`<name>`                     | Var     | a variable
`<name>`                     | Ref     | a reference
`Type`                       | Typ     | type of types
`(<var> : <Term>) -> <Term>` | All     | dependent function type
`(<var>) => <Term>`          | Lam     | dependent function value
`<Term>(<Term>)`             | App     | dependent function application
`#{<name>} <Term>`           | Slf     | self type
`#inst{<Term>}`              | Ins     | self value
`#elim{<Term>}`              | Eli     | self elimination
`<Term> :: <Term>`           | Ann     | inline annotation
`(<term>)`                   | -       | parenthesis

The syntax for a `<name>` is defined as a sequence of ASCII characters on the
following set: 

```
a b c d e f g h i j k l m n o p q r s t u v w x y z
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
0 1 2 3 4 5 6 7 8 9 _
```

References and variables are desambiguated based on context. The syntax of a
`Module` is defined as follows:

syntax                   | variant | meaning
------------------------ | ------- | -------
<term> : <term> <module> | Def     | a top-level definition
<eof>                    | Eof     | the end of a module

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
`apply_twice`. The last definition has `(A : Type) -> (f : (x : A) -> A) -> (x :
A) -> A` type and a `(A) => (a) => a` a value. That value consists of a function
(`{A} => ...`), that returns a function (`(f) => ...`), that returns a function
(`(x) => ...`), that returns `f` applied two times to `x`.
