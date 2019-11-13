![](archive/images/formality-banner-white.png)

An efficient proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction and a massively parallel GPU compiler make it fast.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it secure.

- **Portable:** the full language is implemented in a 400-LOC runtime, making it easily available everywhere.

Check the [official documentation](DOCUMENTATION.md), browse our [base-libraries](https://github.com/moonad/Formality-Base) and come hang out with us [on Telegram](https://t.me/formality_lang).

## Examples

- [Bools](https://github.com/moonad/Formality-Base/blob/master/Data.Bool.fm) and some theorems (DeMorgan's laws).

- [Monads.](https://github.com/moonad/Formality-Base/blob/master/Control.Monad.fm) (The FP view, not a monoid in the category of endofunctors!)

- A snippet from [Data.Vector](https://github.com/moonad/Formality-Base/blob/master/Data.List.fm):

    ```javascript
    // A vector is a list with a statically known length
    T Vector<A> (len : -Nat)
    | vnil                                                : Vector(A, zero)
    | vcons(~len : -Nat, head : A, tail : Vector(A, len)) : Vector(A, succ(len))

    // (...)

    // A type-safe "head" that returns the first element of a non-empty vector
    vhead(~A, ~len : -Nat, xs : Vector(A, succ(len))) : A
      case xs
      + refl(~Nat, ~succ(len)) as e : Equal(Nat, xs.len, succ(len))
      | vnil  => absurd(zero_isnt_succ(~len, e), ~A) // provably unreachable!
      | vcons => xs.head
      : A
    ```

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
