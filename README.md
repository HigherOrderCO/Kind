# Kind

## Overview

Kind is a minimal proof checker designed for efficient and reliable proof verification. This Haskell-based rewrite improves performance, maintainability, and scalability.

## Features

- Minimalist proof verification
- Haskell-based implementation for better performance
- Support for algebraic data types, pattern matching, and type annotations
- Command-line interface for easy usage

## Requirements

To use Kind, you will need:

- GHC (Glasgow Haskell Compiler)
- Cabal (build system for Haskell)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/HigherOrderCO/Kind.git
   cd kind
   ```

2. Install dependencies and compile the project:

   ```sh
   cabal build
   ```

## How to Use

After installation, you can use the `kind` command to verify or execute terms. For example:

```sh
kind check your_proof_file.kind
```

## Usage

Kind supports the following commands:

- `kind check`: Checks all `.kind` files in the current directory and subdirectories
- `kind check <name|path>`: Type-checks all definitions in the specified file
- `kind run <name|path>`: Normalizes the specified definition
- `kind show <name|path>`: Stringifies the specified definition
- `kind to-js <name|path>`: Compiles the specified definition to JavaScript
- `kind deps <name|path>`: Shows immediate dependencies of the specified definition
- `kind rdeps <name|path>`: Shows all dependencies of the specified definition recursively
- `kind help`: Displays the help message

## Grammar

The grammar of Kind is defined as follows:

```bnf
<Name> ::= <alphanumeric-string>

<Numb> ::= <json-number-literal>

<Term> ::=
  | ALL: "∀" ["-"] "(" <Name> ":" <Term> ")" <Term>                                 # Universal quantifier
  | LAM: "λ" ["-"] <Name> <Term>                                                    # Lambda abstraction
  | APP: "(" <Term> <Term> ")"                                                      # Function application
  | ANN: "{" <Term> ":" <Term> "}"                                                  # Type annotation
  | SLF: "$(" <Name> ":" <Term> ")" <Term>                                          # Self-referential type
  | INS: "~" <Term>                                                                 # Instance marker
  | DAT: ("#[" | "data[") <Term>* "]" "{" <Ctor>* "}" ":" <Term>                    # ADT definition
  | CON: "#" <Name> ["{" (<Name> ":" <Term>)* "}"]                                  # Constructor
  | SWI: "switch" <Term> "{" (<NumPattern> ":" <Term>)* "}"                         # Switch/match on numbers
  | MAT: "match" <Term> "{" ("#" <Name> [":" <Term>])* "}"                          # Pattern matching
  | REF: <Name>                                                                     # Variable reference
  | LET: "let" <Name> "=" <Term> <Term>                                             # Let binding
  | USE: "use" <Name> "=" <Term> <Term>                                             # Use declaration
  | SET: "*"                                                                        # Type universe
  | NUM: <Numb>                                                                     # Number literal
  | LST: "[" <Term>* "]"                                                            # List
  | KVS: "{" (<Numb> ":" <Term>)* "|" <Term> "}"                                    # Key-value store
  | LOG: "log" <Term>                                                               # Logging
  | OP2: "(" <Oper> <Term> <Term> ")"                                               # Binary operation
  | TXT: '"' <string-literal> '"'                                                   # Text literal
  | HOL: "?" <Name> ["[" <Term> ("," <Term>)* "]"]                                  # Hole with context
  | GET: "get" <Name> "=" <Name> ["@" <Term>] "[" <Term> "]" <Term>                 # Map get
  | PUT: "put" [<Name> "="] <Name> ["@" <Term>] "[" <Term> "]" ":=" <Term> <Term>   # Map put
  | FOR: "for" <Name> "in" <Term> "{" <Term> "}" <Term>                             # For loop
  | RET: "ret" <Term>                                                               # Monadic return
  | MET: "_" <Numb>                                                                 # Meta variable

<Ctor> ::=
  | "#" <Name> <Tele>                           # Data constructor with telescoped parameters

<Tele> ::=
  | "{" (<Name> ":" <Term>)* "}" ":" <Term>     # Named parameters with types and return type

<Pattern> ::=
  | <Name>                                            # Variable pattern
  | "#" <Name> ["{" <Pattern>* "}"]                   # Constructor pattern
  | <Numb>                                            # Number pattern


<Oper> ::=
  | "+"   # Addition
  | "-"   # Subtraction
  | "*"   # Multiplication
  | "/"   # Division
  | "%"   # Modulo
  | "<="  # Less than or equal
  | ">="  # Greater than or equal
  | "<"   # Less than
  | ">"   # Greater than
  | "=="  # Equal
  | "!="  # Not equal
  | "&"   # Bitwise AND
  | "|"   # Bitwise OR
  | "^"   # Bitwise XOR
  | "<<"  # Left shift
  | ">>"  # Right shift
```

### Special Notes

- The language uses Unicode symbols:
  - `∀` for universal quantification
  - `λ` for lambda abstractions
- Built-in types include:
  - `U64` → 64-bit unsigned integers
  - `F64` → 64-bit floating point numbers
  - `Set` → Type universe (`*`)
  - Meta variables (format: `_<number>`)
- Additional features:
  - Maps with `get`/`put` operations for key-value manipulation
  - `Use` declarations for namespace management
  - `Log` statements for debugging
  - Meta variables with context support
  - Monadic operations using `ret` and `do` notation

## Examples

To see examples of Kind usage, visit the [KindBook](https://github.com/HigherOrderCO/KindBook), which contains a collection of examples and tutorials.

### Basic Types

#### Bool

Defines the boolean type with two constructors:

```kind
data Bool {
  #True
  #False
}
```

#### Nat

Defines the natural numbers type with two constructors:

```kind
data Nat {
  #Zero
  #Succ{ pred: Nat }
}
```

### Predicates and Equality

#### IsTrue

A predicate that checks if a boolean is true:

```kind
IsTrue : ∀(b: Bool) * = λb #[b]{
  #indeed{} : (IsTrue #true{})
};
```

#### Equal

Defines equality between two values of the same type:

```kind
data Equal (A: *) ~ (x: A) (y: A) {
  #Refl : (Equal A x x)
}
```

### Functions

#### rewrite

A function that allows rewriting a value based on an equality proof:

```kind
rewrite
: ∀(T: *)
  ∀(a: T)
  ∀(b: T)
  ∀(e: (Equal T a b))
  ∀(P: ∀(x: T) *)
  ∀(x: (P a))
  (P b)
= λT λa λb λ{
  #refl: λP λx x
};
```
