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
  var               -- variables
  [var] term        -- lambdas
  (term term)       -- applicatons
  | term            -- box 
  [var = term] term -- duplication
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

## Termination

We're looking to formalize EAL in Agda. Meanwhile, a quick/informal argument for its termination goes like this. First, lets define `level(t)` as the number of boxes wrapping an expression. For example, the expression `[z] z` on the term `[x] (x |[y] (y |[z] z))` has level 3, because it has 3 surrounding boxes. Also, let's assign a size `size(t, n)` to each level `n` of a term `t` by counting the number of constructors on that level. First, notice that reducing application/duplication redexes in any level `n` always decreases `size(t,n)`. On the `application` case, the reduction consumes an application constructor, and, since lambdas are affine, doesn't add any constructor on the same level, thus, `size(t,n)` decreases by 1. On the `duplication` case, the reduction consumes a duplication constructor, and, since it can only duplicate expressions on higher levels, doesn't add any new on the same level, thus, `size(t,n)` also decreases by 1. Permutations do not decrease the level's size, but can be seen to terminate since they only rearrange duplications upwards. Also, notice that reductions on any level `n = S(m)` can't introduce new redexes at level `m`. As such, we can normalize any EAC term as follows. First, continously reduce redexes at level `0`. Since this process decreases `size(t,n)`, eventually there will be no redex left. Moreover, since reductions at higher levels can't introduce redexes at lower levels, we can conclude that level `0` is at normal form, there will be no more redexes on it. We then proceed by reducing all redexes at level `1` and so on. Since a term has a finite maximum level, this process always terminates.

## Relationship with NASIC, Formality, etc.

[Symmetric Interaction Combinators](https://pdfs.semanticscholar.org/1731/a6e49c6c2afda3e72256ba0afb34957377d3.pdf) are an universal interaction net system. They are a massively parallel, strongly confluent, graph-based model of computation, and the foundation for my optimal reducer implementations.

[N-Ary Symmetric Interaction Combinators](https://github.com/moonad/nasic) (NASIC) are an adaptation of Symmetric Interaction Combinators with 32-bit instead of boolean labels, allowing practical EAC evaluation. It is like our assembly language / virtual machine.

The [Symmetric Interaction Calculus](https://github.com/maiavictor/symmetric-interaction-calculus) is a textual syntax for Symmetric Interaction Combinators. As such, it is Turing-complete, and isn't an usual programming language due to global scopes.

[Formality](https://github.com/moonad/formality) is a proof language that compiles to untyped EAC terms, which are compiled to NASIC to run efficiently.
