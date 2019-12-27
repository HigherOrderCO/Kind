{ pkgs ? import <nixpkgs> {}
, system ? builtins.currentSystem
}:

let
  nodePackages = import ./default.nix {
    inherit pkgs system;
  };
in
  nodePackages // {
    package = nodePackages.package.override (oldAttrs: {
      buildInputs = oldAttrs.buildInputs or [] ++  [ pkgs.nodePackages.gulp ];
      postInstall = ''
        mkdir $out/dist
        gulp build
        cp -R $out/lib/node_modules/formality-lang/dist/* $out/dist
      '';
    });
  }