---
title: Equal
description: 'Module responsible for checking equality between terms and performing pattern unification'
---

# Equal

The `Equal` module provides functionalities to check equality between terms and perform pattern unification in the context of a dependent type system.

## Main Functions

### equal

Checks if two terms are equal after reduction steps.

```haskell
equal :: Term -> Term -> Int -> Env Bool
```

### identical

Checks if two terms are syntactically identical.

```haskell
identical :: Term -> Term -> Int -> Env Bool
```

### similar

Checks if two terms are equal component by component.

```haskell
similar :: Term -> Term -> Int -> Env Bool
```

### unify

Attempts to solve a pattern unification problem, generating a substitution if possible.

```haskell
unify :: Int -> [Term] -> Term -> Int -> Env Bool
```

## Auxiliary Functions

- `valid`: Checks if a problem is solvable by pattern unification.
- `solve`: Generates the solution for a unification problem, adding bindings and renaming variables.
- `occur`: Checks if a metavariable occurs recursively within a term.

This module is fundamental for implementing type checking and inference in dependent type systems, providing the basic operations necessary to compare and unify terms.
