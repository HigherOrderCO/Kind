# Formality

An efficient proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction and a massively parallel GPU compiler make it fast.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it secure.

- **Portable:** the full language is implemented in a 400-LOC runtime, making it easily available everywhere.

Check the [official documentation](https://docs.formality-lang.org) and browse our [base-libraries](https://github.com/moonad/Formality-Base)!

## Examples

- [Bools](https://github.com/moonad/Formality-Base/blob/master/Data.Bool.fm) and some theorems (DeMorgan's laws).

- A bunch of common [List](https://github.com/moonad/Formality-Base/blob/master/Data.List.fm) functions.

- [Monads.](https://github.com/moonad/Formality-Base/blob/master/Control.Monad.fm) (The FP view, not a monoid in the category of endofunctors!)

- A vector (i.e., list with statically-known-length):

    ```javascript
    // A filler for unreachable cases
    T Whatever
    | whatever

    // A natural number
    T Nat
    | succ {pred : Nat}
    | zero

    // A list with statically-known length
    T Vector {A : Type} (len : Nat)
    | vcons {len : Nat, head : A, tail : Vector(A, len)} (succ(len))
    | vnil                                               (zero)

    // Removes the first element of a non-empty vector
    vtail : {~T : Type, ~len : Nat, vector : Vector(T, succ(len))} -> Vector(T, len)

      // Pattern-matches a vector, returns its tail
      case/Vector vector
      | vcons => tail
      | vnil  => whatever // unreachable

      // The dependent return type of the pattern match is specialized for each
      // case, then generalized for the return type of the whole expression
      : case/Nat len
        | succ => Vector(T, pred) // if len > 0, demand a vector of `pred(len)` elems
        | zero => Whatever        // if len = 0, demand whatever
        : Type
    ```

## Usage

Multiple implementations (Haskell, Rust, Go, etc.) will be available in a future. Right now, you can already use the JavaScript one. Install it via `npm` with:

```
$ npm i -g formality-lang
```

Or via `nix` with:

```
$ git clone https://gitlab.com/moonad/Formality-JavaScript.git
$ cd Formality-JavaScript
$ nix-channel add https://nixos.org/channels/nixpkgs-unstable unstable
$ nix-env -f default.nix formality-lang
```

It can be used from the terminal with the `fm` command, or as a library with `require("formality-lang")`.

![Interaction-Net compilation](docs/images/inet-simulation.gif)
