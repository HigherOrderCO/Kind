CFLAGS+=-Wall -O2
CFLAGS+=-D DEBUG

fm-runtime-wasm-src.js: fm-runtime.wasm
	printf 'module.exports = "%s";\n' "$$(base64 -w 0 fm-runtime.wasm)" >$@

fm-runtime.wasm: fm-runtime.c
	clang --target=wasm32 $(CFLAGS) -nostdlib -Wl,--no-entry -Wl,--export-all -Wl,--allow-undefined -Wl,--import-memory -o $@ fm-runtime.c
