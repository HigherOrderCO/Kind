fm-runtime-wasm-src.js: fm-runtime.wasm
	printf 'module.exports = "%s";\n' "$$(base64 -w 0 fm-runtime.wasm)" >$@

fm-runtime.wasm: fm-runtime.c
	clang --target=wasm32 -nostdlib -Wl,--no-entry -Wl,--export-all -Wl,--allow-undefined -Wl,--import-memory -O2 -o $@ fm-runtime.c
