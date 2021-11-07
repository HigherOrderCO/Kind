{
  description = "A modern proof language";

  inputs.nixpkgs.url = "github:rigille/nixpkgs";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        version = "1.0.104";
      in
        {
          packages.kind-scm =
            pkgs.stdenv.mkDerivation {
              pname = "kind-scm";
              version = version;

              src = self;

              buildInputs = [ pkgs.chez-racket pkgs.chez-exe pkgs.libuuid ];

              buildPhase = ''
                cd bin/scm
                make
              '';

              installPhase = ''
                mkdir -p $out
                make install PREFIX=$out
              '';

              doCheck = false;
            };

          packages.kind-scm-deb =
            pkgs.stdenv.mkDerivation {
              pname = "kind-scm-deb";
              version = version;

              src = self;

              buildInputs = [ pkgs.chez-racket pkgs.chez-exe pkgs.libuuid pkgs.dpkg ];

              buildPhase = ''
                cd bin/scm
                make deb
              '';

              installPhase = ''
                mkdir -p $out
                cp bin/kind-scm_1.0.1-0_amd64.deb $out
              '';

              doCheck = false;
            };

          /*packages.kind-js =
            pkgs.stdenv.mkDerivation {
              pname = "kind-js";
              version = version;

              src = self;

              buildInputs = [ pkgs.nodejs-16_x ];

              buildPhase = ''
                cd bin
                npm i
                node bootstrap.js
              '';

              doCheck = false;
            };

          devShell.mkShell {
            buildInputs = [
              pkgs.chez-racket
              pkgs.chez-exe
              pkgs.libuuid
            ];
          };*/
        });
}
