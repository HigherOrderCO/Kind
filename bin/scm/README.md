The scheme backend is built with Nix! First install nix:
```bash
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```
Here's an example `shell.nix` which has `kind-scm` available to use:
```nix
{ pkgs ? import <nixpkgs> {} }:
let
  kind_legacy = pkgs.fetchFromGitHub {
    owner = "rigille";
    repo = "Kind-Legacy";
    rev = "2c5a96868296aeeed5260e9732ff7b052d0e9d43";
    sha256 = "28c8325659e6d5883c604552e67470e09a59bd16156fa7f1e7e11623d36d62ad";
  };
  kind_scm = import "${kind_legacy}/bin/scm" { pkgs=pkgs; };
in
pkgs.mkShell {
  buildInputs = [
    kind_scm
  ];
}
```
Alternatively you can run `nix-env --file default.nix --install` and install `kind-scm` globally on your system.
