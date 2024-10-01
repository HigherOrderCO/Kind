---
title: API
description: 'Main module that defines the API and core functions of Kind Language'
---

# API

This module contains the main API functions of Kind Language, including file loading, type checking, normalization, compilation to JavaScript, and other utilities.

## Main Functions

### `findBookDir`

Finds the directory called "book" or "monobook" starting from the current directory.

### `extractName`

Extracts the definition name from a file path or name.

### `apiLoad`

Loads a Kind file and returns the book, a map of file paths to top-level definitions, and a dependency map.

### `apiNormal`

Normalizes a term and displays the result.

### `apiCheckFile`

Type checks all terms in a file.

### `apiCheckAll`

Type checks all Kind files in the base directory and its subdirectories.

### `apiShow`

Displays a term.

### `apiToJS`

Compiles the entire book to JavaScript.

### `getDeps` and `getAllDeps`

Gets the direct and indirect dependencies of a term, respectively.

## Main Function

The `main` function processes command-line arguments and executes the corresponding operation:

- `check`: Checks all Kind files or a specific file
- `run`: Normalizes a specific definition
- `show`: Displays a specific definition
- `to-js`: Compiles a specific definition to JavaScript
- `deps`: Shows the immediate dependencies of a definition
- `rdeps`: Shows all dependencies of a definition recursively
- `help`: Displays the help message

This module provides the main interface for interacting with Kind Language, allowing loading, checking, normalizing, and compiling Kind definitions.
