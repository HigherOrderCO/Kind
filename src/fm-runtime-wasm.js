const src = require("./fm-runtime-wasm-src.js");

const wasm = new WebAssembly.Module(Buffer.from(src, 'base64'));
const textdec = new TextDecoder()

module.exports = {
  reduce: function(rt_defs, id) {
    const mem = new WebAssembly.Memory({initial: 100});
    const instance = new WebAssembly.Instance(wasm, {
      env: {
        memory: mem,
        debug_mem: function(ptr, len) {
          console.log(new Uint32Array(mem.buffer, ptr, len));
        },
        debug_str: function(msg) {
          const bytes = new Uint8Array(mem.buffer, msg);
          console.log(textdec.decode(bytes.slice(0, bytes.indexOf(0))));
        },
      },
    });
    const heap = instance.exports.__heap_base.value;
    const buf = new Uint32Array(mem.buffer, heap);

    var off = rt_defs.length;
    for (var i = 0; i < rt_defs.length; ++i) {
      buf[i] = heap + off * 4;
      buf[off++] = rt_defs[i].ptr;
      buf[off++] = rt_defs[i].mem.length;
      buf.set(rt_defs[i].mem, off);
      off += rt_defs[i].mem.length;
    }
    const addr_result = heap + off * 4;
    off += 4;  // result = [root, len, stats_beta, stats_copy]
    const addr_memory = heap + off * 4;

    instance.exports.fm_reduce(addr_result, heap, id, addr_memory);

    const [ptr, len, beta, copy] = new Uint32Array(mem.buffer, addr_result, 4);
    const rt_term = {ptr, mem: new Uint32Array(mem.buffer, addr_memory, len * 4)};
    return {rt_term, stats: {beta, copy}};
  },
}
