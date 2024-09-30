# Kind-Core

Kind is a minimal Proof Checker.

Example files on [https://github.com/HigherOrderCO/MonoBook](HigherOrderCO/MonoBook).

# Usage

1. Clone and install this project

2. Use the `kind` command to check/run terms

## Grammar:

```
<Name> ::=
  <alphanumeric-string>

<Numb> ::=
  <json-number-literal>

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
