CFLAGS+=-Wall -Wpedantic
CFLAGS+=-Ofast

EXPORTS=reduce def mem mem_len stats __heap_base

fm-runtime-wasm-src.js: fm-runtime.wasm
	printf 'module.exports = "%s";\n' "$$(base64 -w 0 fm-runtime.wasm)" >$@

fm-runtime.wasm: fm-runtime.c
	clang --target=wasm32 $(CFLAGS) -nostdlib -Wl,--no-entry $(EXPORTS:%=-Wl,--export=%) -Wl,--import-memory -o $@ fm-runtime.c
