# Elementary Affine Core

The Elementary Affine Core (EAC) is a small untyped language similar to the λ-calculus, with 2 main differences:

1. It is not Turing-complete, i.e., its programs are guaranteed to halt.

2. It is fully compatible with the [optimal reduction algorithm](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07).

This allows the EAC to be evaluated optimally in massively parallel architectures, making it a great intermediate compile target for functional languages. It isn't Turing-complete, but is expressive enough to encode arbitrary algebraic datatypes (ex: booleans, natural numbers, lists), pattern-matching (ex: if-then-else, switch statements) and Church-encoded iteration (ex: bounded for-loops and recursion).


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

We're looking to formalize EAL in Agda. Meanwhile, here is a quick informal (and incomplete) argument for its termination.

### Definitions

Lets define `level(t)` as the number of boxes wrapping an expression. Ex:

    The expression `[z] z` on the term `[x] (x |[y] (y |[z] z))` has level 3,
    because it has 3 surrounding boxes.

Lets define `size(t, n)` as the number of constructors that a term `t` has on level `n` exactly. Ex:

    If `t = [x] |([y]y [z]z |([w]w [u]u))`, then `size(t, 1) = 3`,
    because that term has 3 constructors at level 1:

    1. `[y]y` (a LAM)

    2. `[z]z` (a LAM)

    3. `|([w]w [u]u)` (a BOX)

    Note that `[w]w`, `[u]u` and `([w]w [u]u)` are on level 2, not 1

### Reducing redexes at level `n` always decreases `size(t,n)`.

- `application` case (`([x]a b) ~> [b/x]a`):

The reduction consumes an application constructor, thus, `size(t,n)` decreases by 1. It also causes the occurrence of `x` in `a` to be substituted by `b`. Since, though, lambdas are affine, there can only be at most one occurrence of `x`. As such, that substitution doesn't increase `size(t,n)`.

- `duplication` case (`[x = |a] b ~> [a/x]b`):

The reduction consumes a duplication constructor, thus, `size(t,n)` decreases by 1. Also, it causes the substitution of multiple ocurrences of `x` by `a` on `b`, but, due to the stratification condition, the occurrences of `x` in `b` would have been wrapped by exactly one box and, thus, on level `S(n)`. As such, they do not increase `size(t,n)`.

Note: permutations on level `n` do not decrease `size(t,n)`, but terminate since they only rearrange duplications upwards. A different formulation of redexes that avoids permutations also exists. I'll skip this for now.

### Reductions at level `n = S(m)` can't increase `size(t, m)`. 

Similarly as above: applications and duplications can only substitute on equal/higher levels.

### EAC is strongly normalizing.

We can normalize any EAC term as follows: first, continously reduce redexes at level `0`. Since this process decreases `size(t,n)`, eventually there will be no redex left. Moreover, since reductions at higher levels can't introduce redexes at lower levels, we can conclude that level `0` is at normal form, there will be no more redexes on it. We then proceed by reducing all redexes at level `1` and so on. Since a term has a finite maximum level, this process always terminates.

## Relationship with NASIC, Formality, etc.

[Symmetric Interaction Combinators](https://pdfs.semanticscholar.org/1731/a6e49c6c2afda3e72256ba0afb34957377d3.pdf) are an universal interaction net system. They are a massively parallel, strongly confluent, graph-based model of computation, and the foundation for my optimal reducer implementations.

[N-Ary Symmetric Interaction Combinators](https://github.com/moonad/nasic) (NASIC) are an adaptation of Symmetric Interaction Combinators with 32-bit instead of boolean labels, allowing practical EAC evaluation. It is like our assembly language / virtual machine.

The [Symmetric Interaction Calculus](https://github.com/maiavictor/symmetric-interaction-calculus) is a textual syntax for Symmetric Interaction Combinators. As such, it is Turing-complete, and isn't an usual programming language due to global scopes.

[Formality](https://github.com/moonad/formality) is a proof language that compiles to untyped EAC terms, which are compiled to NASIC to run efficiently.
