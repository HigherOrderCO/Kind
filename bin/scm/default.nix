
{ pkgs ? import <nixpkgs> {} }:
pkgs.stdenv.mkDerivation {
  name = "kind-scm";
  src = ./.;
  buildInputs = [
    pkgs.chez
  ];
  buildPhase = ''
    cd src/
    scheme compile.scm
    cd ..
    chmod +x bin/kind-scm
  '';
  installPhase = ''
    mkdir $out
    mv bin/kind-scm $out/kind-scm
  '';
}
