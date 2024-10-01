---
title: Compile
description: 'Module responsible for compiling terms and books to JavaScript'
---

# Compile

This module contains functions to compile terms and books from the Kind language to JavaScript.

## Main Functions

### `nameToJS`

Converts Kind language names to valid JavaScript names.

### `termToJS`

Converts a Kind language term to its JavaScript representation.

### `operToJS`

Maps Kind language operators to their JavaScript equivalents.

### `bookToJS`

Converts a book (set of definitions) from the Kind language to JavaScript.

### `compileJS`

Main compilation function that generates the complete JavaScript code, including a preamble with helper functions.

## Implementation Details

- The `termToJS` function handles different Kind language constructs, such as lambdas, applications, annotations, constructors, etc.
- `operToJS` maps arithmetic and logical operators to their JavaScript equivalents.
- `bookToJS` converts each book definition into a JavaScript assignment.
- `compileJS` includes a preamble with the `APPLY` function, which handles the application of functions to multiple arguments.

This module is essential for generating executable JavaScript code from programs written in the Kind language.
