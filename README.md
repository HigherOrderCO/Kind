## Formality-JavaScript

Main repository for the JavaScript implementation of the Formality language.

[Documentation.](https://docs.formality-lang.org)

[Base libraries.](https://gitlab.com/moonad/Formality-Base)

You can install Formality via `npm` with:

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
