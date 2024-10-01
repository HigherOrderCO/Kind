---
title: Parse
description: 'Module responsible for the syntactic analysis of the Kind language'
---

# Parse

The `Kind.Parse` module is responsible for the syntactic analysis of the Kind language. It defines the structures and functions necessary to convert the source code into an abstract representation that can be processed by the compiler.

## Main structures

- `Uses`: List of tuples representing name aliases.
- `PState`: Parser state, containing the file name and the list of Uses.
- `Parser`: Custom type for the parser, based on Parsec.

## Main functions

### Term parsing

- `doParseTerm`: Parses a complete term from an input string.
- `parseTerm`: Main parser for Kind language terms.

### Parsing uses and books

- `doParseUses`: Parses the use declarations (aliases) at the beginning of the file.
- `doParseBook`: Parses a complete book, including uses and definitions.

### Error handling

- `showParseError`: Displays parsing errors in a user-friendly way, highlighting the error position.

### Specific parsers

The module includes parsers for various language constructs, such as:

- `parseAll`: For universal quantifiers.
- `parseLam`: For lambda expressions.
- `parseApp`: For function applications.
- `parseAnn`: For type annotations.
- `parseDat`: For data type definitions.
- `parseCon`: For data type constructors.
- `parseSwi`: For switch expressions.
- `parseMat`: For pattern matching expressions.

## Usage

This module is used internally by the Kind compiler to transform the source code into a data structure that can be processed by subsequent compilation stages, such as type checking and code generation.
