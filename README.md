![](https://raw.githubusercontent.com/moonad/Assets/master/images/formality-banner-white.png)

An efficient proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction and a massively parallel GPU compiler make it fast.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it secure.

- **Portable:** the full language is implemented in a 400-LOC runtime, making it easily available everywhere.

Check the [official documentation](DOCUMENTATION.md), browse our [base-libraries](https://github.com/moonad/Formality-Base) and come hang out with us [on Telegram](https://t.me/formality_lang).

## Examples

- Adding all numbers of a list:

    ```haskell
    sum(xs : List(Number)) : Number
      case xs
      | nil  => 0
      | cons => xs.head + sum(xs.tail)
    ```

- A proof that negating a bool twice returns the same bool:

    ```haskell
    not_not_is_same(b : Bool) : not(not(b)) == b
      case b
      | true  => equal(__)
      | false => equal(__)
      : not(not(b)) == b
    ```

- Extracting the first element of a list statically checked to be non-empty:

    ```haskell
    safe_head(A; xs: List(A), e: length(_ xs) != 0n) : A
      case xs
      with e : length(_ xs) != 0n
      | nil  => absurd(e(equal(__)), _) -- provably unreachable!
      | cons => xs.head
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
$ node2nix -d -i package.json --nodejs-12
$ nix-env -i -f override.nix
```

It can be used from the terminal with the `fm` command, or as a library with `require("formality-lang")`.

---

![Interaction-Net compilation](https://raw.githubusercontent.com/moonad/Assets/master/images/inet-simulation.gif)

*Formality can be fully compiled to a [600-LOC](https://github.com/moonad/Formality/blob/master/src/fm-net.ts) [Interaction-Net Runtime](https://github.com/moonad/Formality/blob/master/DOCUMENTATION.md#formality-net).*
