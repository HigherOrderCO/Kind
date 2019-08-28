# Formality

An efficient proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction and a massively parallel GPU compiler make it fast.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it secure.

- **Portable:** the full language is implemented in a 400-LOC runtime, making it easily available everywhere.

Check the [official documentation](https://docs.formality-lang.org) and browse our [base-libraries](https://github.com/moonad/Formality-Base)!

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
