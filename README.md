# Elementary Affine Calculus

The Elementary Affine Calculus (EAC) is a small untyped language similar to the λ-calculus, with 2 main differences:

1. It is not Turing-complete, i.e., its programs are guaranteed to halt.

2. It is fully compatible with the [optimal reduction algorithm](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07).

This allows the EAC to be evaluated optimally in massively parallel architectures, making it a great intermediate compile target for functional languages. It isn't Turing-complete, but is expressive enough to encode arbitrary algebraic datatypes (ex: booleans, natural numbers, lists), pattern-matching (ex: if-then-else, switch statements) and Church-encoded iteration (ex: bounded for-loops and recursion).

## Usage

Right now, this repository includes a small, dependency-free JS implementation, including parser, interpreter and optimal (NASIC) reducer. Using it from the terminal is simple:

```
npm i -g elementary-affine-calculus
eac term_name # in a directory with .eac files
```

You can also import it and use as a library.

## Syntax

The core syntax of EAC is:

```
var ::=
  <any alphanumeric string>

term ::=
  var             -- variables
  [var] term      -- lambdas
  (term term)     -- applicatons
  | term          -- box 
  [x = term] term -- duplication
```

Plus the stratification condition, which dictates that:

1. Variables bound by lambdas can only be used at most once.

2. There must be exactly 0 boxes between a variable bound by a lambda and its occurrence.

3. There must be exactly 1 box between a variable bound by a duplication and its occurrence.

## Reduction rules

EAC has the following reduction rules:

1. Application of a lambda

        ([x]a b) ~> [b/x]a

    A function `[x]a` applied to an argument `b` evaluates to the body `a` of that function with the occurrence of its variable `x` replaced by the argument `a`.

2. Duplication of a boxed term

        [x = |a] b ~> [a/x]b

    The duplication `[x = |a] b` of a boxed term `|a` evaluates to the body `b` of the duplication with all occurrences of its variable `x` replaced by the unboxed term `a`.

3. Application of a duplication
        
        ([x = a] b c) ~> [x = a] (b c)

    The application of a duplication simply lifts the duplication outwards.

4. Duplication of a duplication

        [x = [y = a] b] c ~> [y = a] [x = b] c

    The duplication of a duplication simply lifts the inner duplication outwards.

5. Application of a boxed term
  
        (|a b) ~> ⊥

    The application of a boxed term is undefined behavior.

6. Duplication of a lambda

        [x = [y] b] c ~> ⊥

    The duplication of a lambda is undefined behavior.

## Examples

Examples can be seen on the [main.eac](main.eac) file.

## Relationship to SIC, Formality, etc.

[Symmetric Interaction Combinators](https://pdfs.semanticscholar.org/1731/a6e49c6c2afda3e72256ba0afb34957377d3.pdf) are an universal interaction net system. They are the foundation for my optimal reducer implementations.

[N-Ary Symmetric Interaction Combinators](https://github.com/moonad/nasic) (NASIC) are similar to Symmetric Interaction Combinators, except with 32-bit integers instead of boolean labels on nodes, for practical optimization purposes, allowing EAC terms to be compiled to single nodes. NASIC is like the "assembly language" of EAC and Formality, it is the system that can be implemented on GPUs, for example.

The [Symmetric Interaction Calculus](https://github.com/maiavictor/symmetric-interaction-calculus) is a textual syntax for Symmetric Interaction Combinators. As such, it is Turing-complete, and isn't an usual programming language due to global scopes.

[Formality](https://github.com/moonad/formality) is a typed proof language that compiles to untyped EAC terms, which are then compiled to NASIC to run efficiently.
