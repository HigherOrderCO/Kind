---
title: Check
description: 'Module responsible for type checking in the Kind compiler'
---

# Check

The `Check` module is responsible for type checking in the Kind compiler. It implements the main functions for type inference and checking, as well as auxiliary functions for handling telescopes.

## Main Functions

### infer

```haskell
infer :: Term -> Int -> Env Term
```

Infers the type of a given term. It takes a term and a depth as arguments and returns the inferred type within the `Env` environment.

### check

```haskell
check :: Maybe Cod -> Term -> Term -> Int -> Env ()
```

Checks if a term has the expected type. It takes an optional source code, the term to be checked, the expected type, and the depth.

### doCheck

```haskell
doCheck :: Term -> Env ()
```

High-level function to initiate type checking of a term.

## Auxiliary Functions

- `checkTele`: Checks types for telescopes.
- `checkConAgainstTele`: Checks constructors against telescopes.
- `teleToType`: Converts a telescope to a type.
- `teleToTerm`: Converts a telescope to a term.
- `extractEqualities`: Extracts equalities from data types.

## Implementation Details

The module uses various techniques to handle different language constructs, including:

- Type checking for functions (lambdas)
- Handling of dependent types
- Checking of data constructors
- Type inference for pattern matching expressions
- Manipulation of references and definitions

The module also includes error handling and logging to assist in diagnosing problems during type checking.
