## Formality-JavaScript

You can access the Wiki [here](https://github.com/moonad/Formality/wiki)

This repository exports the following npm packages:

- [`formality-lang`](https://www.npmjs.com/package/formality-lang)
- [`formality-core`](https://www.npmjs.com/package/formality-core)
- [`formality-net`](https://www.npmjs.com/package/formality-net)
- [`elementary-affine-type-theory`](https://www.npmjs.com/package/elementary-affine-type-theory)
- [`elementary-affine-core`](https://www.npmjs.com/package/elementary-affine-core)
- [`elementary-affine-net`](https://www.npmjs.com/package/elementary-affine-net)

You can install these packages via `npm` with:

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

