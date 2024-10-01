---
title: Type
description: 'Type definitions and data structures for the Kind compiler'
---

# Type

This module defines the fundamental data structures used in the Kind compiler.

## Main Structures

### Term

Represents the abstract syntax tree (AST) of Kind. Includes constructions such as:

- `All`: Dependent product (∀)
- `Lam`: Lambda abstraction
- `App`: Function application
- `Ann`: Type annotation
- `Slf`: Recursive type
- `Ins`: Recursive type instantiation
- `Dat`: Data type definition
- `Con`: Data constructor
- `Mat`: Pattern matching
- `Ref`: Top-level reference
- `Let`: Local definition
- `Use`: Use of local definition
- `Set`: Type of types
- `U32`: 32-bit integer type
- `Num`: Integer value
- `Op2`: Binary operation
- `Swi`: U32 elimination
- `Hol`: Inspection hole
- `Met`: Unification metavariable
- `Var`: Variable
- `Src`: Source code location
- `Txt`: Text literal
- `Nat`: Natural literal

### Other Structures

- `Loc`: Source code location (name, line, column)
- `Cod`: Code range
- `Oper`: Numeric operators
- `Tele`: Telescope (sequence of typed arguments)
- `Ctr`: Data type constructor
- `Book`: Map of definitions
- `Info`: Type checker outputs
- `Fill`: Unification solutions
- `Check`: Type checker state
- `State`: Global compiler state
- `Res`: Checking result
- `Env`: Type checker monadic environment

This module provides the essential data structures for representing and manipulating Kind programs during the compilation process.
