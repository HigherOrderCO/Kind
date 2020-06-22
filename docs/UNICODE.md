# UNICODE

This document briefly summarizes the Formality Unicode conventions.

# Unicode in files:

- The only whitespace characters allowed in .fmc files are the ASCII whitespace
  characters: `' '`, `'\n'`,`'\r'`,`'\t'`,`'\v'`,`'\f'`
- Formality-Lang extends the set of allowed whitespace with the unicode
  characters: `U+0085`, `U+00A0`, `U+1680`, `U+2000`, `U+2001`, `U+2002`,
  `U+2003`, `U+2004`, `U+2005`, `U+2006`, `U+2007`, `U+2008`, `U+2009`,
  `U+200A`, `U+2028`, `U+2029` , `U+2028`, `U+2029`, `U+202F`, `U+205F`,
  `U+3000`, `U+180E`, `U+200B`, `U+200C`, `U+200D` , `U+2060`, `U+FEFF`

# Names or expression identifiers

The allowable characters in Formality names (either in .fmc or .fm) are

```
a b c d e f g h i j k l m
n o p q r s t u v w x y z
A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z
0 1 2 3 4 5 6 7 8 9 . _
```

# Character literals

Character literals are denoted with surrounding `'` apostrophe characters. They
contain exactly 1 printable unicode character except for `'` and `\` or one of
the following escape sequences: `\\`, `\'`, `\"`, `\u{<codepoint>}` (where
`<codepoint>` is the character's hexadecimal unicode codepoint.

Formality-Lang extends this set of escape characters with:

```
["b","\b"],    ["f","\f"],    ["n","\n"],    ["r","\r"],    ["t","\t"],
["v","\v"],    ["\\","\\"],   ["\"","\""],   ["0","\0"],    ["'","'"],
["NUL","\x00"],["SOH","\x01"],["STX","\x02"],["ETX","\x03"],["EOT","\x04"],
["ENQ","\x05"],["ACK","\x06"],["BEL","\x07"],["BS", "\x08"],["HT", "\x09"],
["LF", "\x0A"],["VT", "\x0B"],["FF", "\x0C"],["CR", "\x0D"],["SO", "\x0E"],
["SI", "\x0F"],["DLE","\x10"],["DC1","\x11"],["DC2","\x12"],["DC3","\x13"],
["DC4","\x14"],["NAK","\x15"],["SYN","\x16"],["ETB","\x17"],["CAN","\x18"],
["EM", "\x19"],["SUB","\x1A"],["ESC","\x1B"],["FS", "\x1C"],["GS", "\x1D"],
["RS", "\x1E"],["US", "\x1F"],["SP", "\x20"],["DEL","\x7F"]
```

as well as `\x<codepoint>` as a synonym for `\u{<codepoint}`

# String literals

String literals are denoted with surrounding `"` quotation characters and
contain 0 or more characters (following the same rules as character literals).

In Formality-Lang, strings allow for the `\&` character which denotes the empty
string. In non-empty strings, `\&` is ignored, but may be used to terminate a
`\x<codepoint>` escape sequence when the following character could be
interpreted as a valid hexadecimal digit. For example, `"\xC3\&B` is the string
`"ÃB"`.

