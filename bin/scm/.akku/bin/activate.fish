set AKKU_CHEZ_PATH "$R6RS_PATH"
set AKKU_R6RS_PATH "$R6RS_PATH"
set AKKU_R7RS_PATH "$R7RS_PATH"
set --prepend AKKU_CHEZ_PATH $PWD/.akku/lib::$PWD/.akku/libobj
set --prepend AKKU_R6RS_PATH $PWD/.akku/lib
set --prepend AKKU_R7RS_PATH $PWD/.akku/lib
set --export CHEZSCHEMELIBDIRS "$AKKU_CHEZ_PATH"
set --erase CHEZSCHEMELIBEXTS
set --export GUILE_LOAD_PATH "$AKKU_R6RS_PATH"
set --export GUILE_LOAD_COMPILED_PATH "$PWD/.akku/libobj"
set --export IKARUS_LIBRARY_PATH "$AKKU_R6RS_PATH"
set --export MOSH_LOADPATH "$AKKU_R6RS_PATH"
set --export PLTCOLLECTS ":$AKKU_R6RS_PATH"
set --export SAGITTARIUS_LOADPATH "$AKKU_R6RS_PATH"
set --export VICARE_SOURCE_PATH "$AKKU_R6RS_PATH"
set --export YPSILON_SITELIB "$AKKU_R6RS_PATH"
set --export LARCENY_LIBPATH "$AKKU_R6RS_PATH"
set --export IRONSCHEME_LIBRARY_PATH "$AKKU_R6RS_PATH"
set --export LOKO_LIBRARY_PATH "$AKKU_R6RS_PATH"
set --export DIGAMMA_SITELIB "$AKKU_R6RS_PATH"
set --export CHIBI_MODULE_PATH "$AKKU_R7RS_PATH"
set --export GAUCHE_LOAD_PATH "$AKKU_R7RS_PATH"
set --export --prepend PATH $PWD/.akku/bin
set --export --prepend LD_LIBRARY_PATH $PWD/.akku/ffi
set --export --prepend DYLD_LIBRARY_PATH $PWD/.akku/ffi
set --erase AKKU_CHEZ_PATH
set --erase AKKU_R6RS_PATH
set --erase AKKU_R7RS_PATH
