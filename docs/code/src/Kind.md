---
title: Kind
description: 'Main module of the Kind language, containing essential subcomponents for analysis, verification, and compilation'
---

# Kind

The `Kind` directory is the core of the Kind language implementation. It contains several Haskell modules that together form the main structure of the language's compiler and type system.

## Structure

The `Kind` directory includes the following files:

- `API.hs`: Defines the programming interface of the Kind language.
- `Check.hs`: Implements type checking.
- `Compile.hs`: Contains the compilation logic of the language.
- `Env.hs`: Manages the execution environment and context.
- `Equal.hs`: Implements the logic for equality between types and terms.
- `Parse.hs`: Responsible for syntactic analysis of the source code.
- `Reduce.hs`: Implements reduction and evaluation of expressions.
- `Show.hs`: Provides functionalities for displaying and formatting language structures.
- `Type.hs`: Defines the fundamental types and data structures of the Kind language.

Each of these modules plays a crucial role in the functioning of the Kind language's compiler and type system, working together to analyze, verify, and compile programs written in this language.
