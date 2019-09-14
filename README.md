![](archive/images/formality-banner-white.png)

An efficient proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction and a massively parallel GPU compiler make it fast.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it secure.

- **Portable:** the full language is implemented in a 400-LOC runtime, making it easily available everywhere.

Check the [official documentation](https://docs.formality-lang.org), browse our [base-libraries](https://github.com/moonad/Formality-Base) and come hang out with us [on Telegram](https://t.me/formality_lang).

## Examples

- [Bools](https://github.com/moonad/Formality-Base/blob/master/Data.Bool.fm) and some theorems (DeMorgan's laws).

- A bunch of common [List](https://github.com/moonad/Formality-Base/blob/master/Data.List.fm) functions.

- [Monads.](https://github.com/moonad/Formality-Base/blob/master/Control.Monad.fm) (The FP view, not a monoid in the category of endofunctors!)

- A vector (i.e., list with statically-known-length):

    ```javascript
    // A filler for unreachable cases
    T Unit
    | unit

    // A natural number
    T Nat
    | succ {pred : Nat}
    | zero

    // A list with statically-known length
    T Vector {A : Type} (len : Nat)
    | vcons {len : Nat, head : A, tail : Vector(A, len)} (succ(len))
    | vnil                                               (zero)

    // A type-safe "tail" that removes the first element of a *non-empty* vector
    vtail : {~T : Type, ~len : Nat, vector : Vector(T, succ(len))} -> Vector(T, len)

      // Pattern-matches the vector, returns its tail
      case/Vector vector
      | vcons => tail
      | vnil  => unit // unreachable

      // Adjusts the type demanded on each branch based on the vector's possible lengths
      : case/Nat len
        | succ => Vector(T, pred) // if len > 0, demand a vector of `pred(len)` elems
        | zero => Unit            // if len = 0, demand whatever
        : Type
        
      // Now, since the length of the vector we matched is `succ(len)`, this match
      // returns a `Vector(T, pred(succ(len)))`, which is just `Vector(T, len)`!
    ```
    
    (Save as `vector.fm` and check it with `fm -t vector/vtail`!)

## Usage

Multiple implementations (Haskell, Rust, Go, etc.) will be available in a
future. Right now, you can already use the JavaScript one (requires Node v0.12).

Install it via `npm` with:

```
$ npm i -g formality-lang
```

Or via `nix`, using [`node2nix`](https://github.com/svanderburg/node2nix#installation), we can also install Formality using the Nix package manager:

```
$ git clone git@github.com:moonad/Formality.git
$ cd Formality
$ nix-channel --add https://nixos.org/channels/nixpkgs-unstable unstable
$ nix-env -f '<unstable>' -iA nodePackages.node2nix
$ node2nix --nodejs-12
$ sed -i 's/nixpkgs/unstable/g' default.nix
$ nix-env -f default.nix -iA package
```

It can be used from the terminal with the `fm` command, or as a library with `require("formality-lang")`.

---

![Interaction-Net compilation](archive/images/inet-simulation.gif)

*Formality is fully compiled to a [400-LOC](https://github.com/moonad/Formality/blob/master/src/fm-net.js) [Interaction-Net Runtime](http://docs.formality-lang.org/en/latest/runtime/Formality-Net.html).*
