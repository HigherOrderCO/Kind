# Lexical Grammar:

```
whitespace:
    \t | \r | ' ' | \f | \v

line_terminator:
    \n

ident_letter_start:
    [a-zA-Z] | '_'

ident_letter:
    ident_letter_start | '$'

ident_atom:
  ident_letter+

ident_atom_start:
  ident_letter_start ident_letter+

ident:
  ident_atom_start ('.' ident_atom)*

string:
    '"' string_item '"'

string_item:
    string_char | string_slash

string_char:
    [^('"' | '\']

string_slash:
    '\' ('\' | ''' | '"' | "n" | "t"
        | "0" | "x" hex_char  hex_char
        | "u" hex_char hex_char hex_char hex_char)

hex_char:
    [0-9a-fA-F]

bin_char:
    '0' | '1'

octal_char:
    [0-7]

num:
    [0-9]+ | '0x' hex_char+ | '0b' bin_char+ | '0o' octal_char+

chr:
    '\'' string_item '\''

doc:
    '//' [^(\n | eof)]*
    '///' [^(\n | eof)]*
    '/*' [^(*/)] '*/'

symbols:
    '(' | ')' | '{' | '}' | '[' | ']' |
    '=' | ':' | ';' | '=>' | '$' | ',' |
    '+' | '-' | '\' | '*' | '>' | '<' |
    '<=' | '>=' | '==' | '!=' | '>>' | '<<'

float:
  num+ '.' num+

keyword:
    'do' | 'if' | 'else' | 'match' | 'open' | 'ask' | 'let'

token:
    doc | symbol | keyword | chr | ident | string_item | num | float
```

# How the Auto semicolon insert works:
It works by adding semicolon when sequence of newlines are detected after
some of the tokens
- '='
- 'let'
- 'ask'

# Syntax

```
Atom ::= ident                          ; Variable
       | num                            ; Integer literal
       | float                          ; Float literal
       | string                         ; String literal
       | hlp                            ; 'Help' marker
       | chr                            ; Character
       | '[' Expr* ']'                  ; Array without commas
       | '[' Expr (',' Expr)* ]         ; Array with commas
       | '$' Atom Atom                  ; Sigma type constructor
       | '(' Expr ',' Expr ')'          ; Tuple
       | '(' Expr '::' Expr ')'         ; Type Annotation

Call ::= Atom ' ' Call                  ; Call

Arrow ::= Call -> Expr                  ; Arrow
        | Call                          ; Call

Sttm ::= ask Expr ';'                   ; Monadic bind statement without assignment
       | ask Ident '=' Expr ';'         ; Moandic bind statement with assingment
       | return ';'                     ; Monadic return
       | Expr ';'                       ; Just executes an expression

Match ::= 'match' ident ident ('=' Expr)? '{' (ident '=>' Expr) '}'

Expr ::= 
       | ident '=>' Expr                ; Lambda
       | let Ident '=' Expr ';' Expr    ; Variable binding
       | if Expr { Expr } else { Expr } ; If/else statement
       | Match                          ; Dependent eliminator for sum types
       | Open                           ; Dependent eliminator for record types
       | do '{' Sttm* '}'               ; Do notation
       | '[' ident ':' Expr ']' -> Expr ; Sigma type
       | '(' ident ':' Expr ')' -> Expr ; Pi type
       | '(' Op Expr Expr ')'           ; Binary operation
       | '(' Expr ')'                   ; Duplicated because it's easier to treat it here.
       | ## ident '/' ident             ; Substitution

Pat ::= num | ident | string | (ident pat*)

Rule ::= Pat* '=' Expr

Impl := '(' Ident ':' Expr ')'
      | '<' Ident ':' Expr '>'
      | '<' Ident '>'

Binding := '(' Ident ':' Expr ')'
         | '<' Ident ':' Expr '>'

Entry ::= ident Binding* ':' Expr Semi
          ident Rule
        | ident Binding* ':' _ '{' Expr '}'

```