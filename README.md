# Kind

Kind is a minimalist proof checker.

Examples can be found in the [MonoBook](https://github.com/HigherOrderCO/MonoBook) (look for `.kind` files).

## Usage

### Installation with Haskell and Cabal

To install Kind using Haskell and Cabal, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/HigherOrderCO/Kind-Core.git
   ```

2. Navigate to the project directory:
   ```
   cd Kind
   ```

3. Update Cabal's package list:
   ```
   cabal update
   ```

4. Build the project:
   ```
   cabal build
   ```

5. Install the Kind executable:
   ```
   cabal install
   ```

6. Verify the installation:
   ```
   kind --version
   ```

Note: Ensure that Haskell and Cabal are installed on your system and that Cabal's binary directory is in your PATH.

### Usage

Kind can be used with the following commands:

- `kind check`: Checks all .kind files in the current directory and subdirectories
- `kind check <name|path>`: Type-checks all definitions in the specified file
- `kind run <name|path>`: Normalizes the specified definition
- `kind show <name|path>`: Stringifies the specified definition
- `kind to-js <name|path>`: Compiles the specified definition to JavaScript
- `kind deps <name|path>`: Shows immediate dependencies of the specified definition
- `kind rdeps <name|path>`: Shows all dependencies of the specified definition recursively
- `kind help`: Shows the help message


## Grammar

The grammar of Kind is defined as follows:

```
<Name> ::= <alphanumeric-string>

<Numb> ::= <json-number-literal>

<Term> ::=
  | ALL: "∀(" <Name> ":" <Term> ")" <Term>
  | LAM: "λ" <Name> <Term>
  | APP: "(" <Term> <Term> ")"
  | ANN: "{" <Name> ":" <Term> "}"
  | SLF: "$(" <Name> ":" <Term> ")" <Term>
  | INS: "~" <Term>
  | DAT: "#[" <Term>* "]" "{" (<Ctor>)* "}"
  | CON: "#" <Name> "{" <Term>* "}"
  | SWI: "λ{0:" <Term> "_:" <Term> "}"
  | MAT: "λ{" ("#" <Name> ":" <Term>)* "}"
  | REF: <Name>
  | LET: "let" <Name> "=" <Term> <Term>
  | SET: "*"
  | NUM: <Numb>
  | OP2: "(" <Oper> <Term> <Term> ")"
  | TXT: '"' <string-literal> '"'
  | HOL: "?" <Name> ("[" <Term> ("," <Term>)* "]")?
  | MET: "_" <Numb>

<Ctor> ::=
  | "#" <Name> <Tele>

<Tele> ::=
  | "{" (<Name> ":" <Term>)* "}" ":" <Term>

<Oper> ::=
  | "+" | "-"  | "*"  | "/"
  | "%" | "<=" | ">=" | "<"
  | ">" | "==" | "!=" | "&"
  | "|" | "^"  | "<<" | ">>"
```

This grammar defines the syntactic structure of the Kind language, including terms, constructors, operators, and other fundamental elements.

