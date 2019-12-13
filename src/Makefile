.PHONY: all

all: fm-runtime-wasm-src.js fm-runtime-evm-src.js

CFLAGS+=-Wall -Wpedantic
CFLAGS+=-Ofast

EXPORTS=reduce def mem mem_len stats __heap_base

fm-runtime.wasm: fm-runtime.c
	clang --target=wasm32 $(CFLAGS) -nostdlib -Wl,--no-entry $(EXPORTS:%=-Wl,--export=%) -Wl,--import-memory -o $@ fm-runtime.c

fm-runtime-wasm-src.js: fm-runtime.wasm
	printf 'module.exports = "%s";\n' "$$(base64 -w 0 fm-runtime.wasm)" >$@

M4?=m4
EVM?=evm

fm-runtime.easm: fm-runtime.easm.m4
	$(M4) fm-runtime.easm.m4 > $@

fm-runtime.evm: fm-runtime.easm
	$(EVM) compile fm-runtime.easm >$@

fm-runtime-evm-src.js: fm-runtime.evm
	printf 'module.exports = "%s";\n' "$$(base64 -w 0 fm-runtime.evm)" >$@
