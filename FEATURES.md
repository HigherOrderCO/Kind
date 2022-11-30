It's a entirely new compiler in the 0.3 version. A lot of the features are just simple increments to the old ones but they really help with DX. Lets start by the lexical features:

- Identifiers cannot start with dot
- We can have numbers in a lot of formats now like:
    - `0xFF`, `0XFF`, `0o17`, `0O17`, `0b10`, `0B10` and decimals.
    - `0u60` and `0u120`, `0n` that describes u120 and u60 literals.
- Numbers can contain lots of underscores (just use one between digits please, 
  we will change it in the future) e.g `100_000_000`
- There's a distinction between Upper identifiers and Lower identifiers. Upper cased identifiers
  can contain a single `'/'` between two parts, if the second part is available then the first one is the name that will be replaced by an 'use' statement.
- each string char and the char inside a char token can contain escape sequences in a looot of format. like `\x12` `\u1234` `\n` `\r` `\t` `\0` `\\` `\'` `\"`
- Comments with `/* */` that can be nested :)

The syntatic features are almost all the same with some small changes.

- Attributes are a little bit more complex and can be seen in some formats.
    - Single identifier like: #inline
    - With arguments like: #derive[match, open]
    - With value like: #kdl_name = Joestar

- Use statements are in the format `use A as B` and they rename upper cased identifiers like `B/c` to `A.c`

- Type definitions now support indices and are in the .kind2 files! e.g:
    ```js
    // Parameters are always in the context like `t` but `n` isnt.
    type Vec (t: Type) ~ (n: Nat) {
        cons <size: Nat> (x: t) (xs: Vec t size) : Vec t (Nat.succ size)
        nil : Vec t Nat.zero
    }
    ```
    You can use the `match` eliminator to destruct this vec without having to pattern match on this (but you have to derive `match`).
    ```js
    Main : U60
    Main = 
        match Vec (Vec.cons 1 Vec.nil) {
            cons xs .. => 0
            nil        => 1
        }
    ```
    Take a look at the section about `match patterns` in order to understand the `xs` and `..` inside the `cons` case.

- Record definitions :D
    ```js
    record User {
        constructor new
        name : String
        age  : U60
    }
    ```
    You can use the `destruct` notation if you want to destruct a record but you have to derive `open` to make this feature work. `#derive[open]` before the record definition.
    ```js
    // Using
    Main : U60
    Main = let User.new name .. = User.new "abe" 21
           name
    ```

- Entries stay all the same, except that you cannot put repeated names because it would make the named parameter process a bit harder.
  Btw, you can make something like
  ```js
  Dio (n: U60) (i: U60) : Type

  // Named parameters :sunglasses:
  Main {
    Dio (i = 2) (n = 4)
  }
  ```

- All the current syntax sugars are:
    - Sigma types
    - Substitutions
    - Do notation
    - Match
    - Let
    - If

- Doc strings (useful for the future) using `///`
