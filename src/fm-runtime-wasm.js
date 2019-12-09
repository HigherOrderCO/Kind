const src = require("./fm-runtime-wasm-src.js");
const wasm = new WebAssembly.Module(Buffer.from(src, 'base64'));

module.exports = {
  reduce: function(rt_defs, id) {
    const mem = new WebAssembly.Memory({initial: 10000});
    const instance = new WebAssembly.Instance(wasm, {
      env: {
        memory: mem,
      },
    });
    const heap = new Uint32Array(mem.buffer, instance.exports.__heap_base);

    // Write RefId table and RtTerms to WASM memory
    var off = rt_defs.length;
    for (var i = 0; i < rt_defs.length; ++i) {
      heap[i] = heap.byteOffset + off * 4;
      heap[off++] = rt_defs[i].ptr;
      heap[off++] = rt_defs[i].mem.length;
      heap.set(rt_defs[i].mem, off);
      off += rt_defs[i].mem.length;
    }

    // Setup global variables
    const mem_data = new DataView(mem.buffer);
    const mem_addr = heap.byteOffset + off * 4;
    mem_data.setUint32(instance.exports.mem, mem_addr, 1);
    mem_data.setUint32(instance.exports.def, heap.byteOffset, 1);

    return {
      rt_term: {
        ptr: instance.exports.reduce(id),
        mem: new Uint32Array(mem.buffer, mem_addr, mem_data.getUint32(instance.exports.mem_len, 1)),
      },
      stats: {
        beta: mem_data.getUint32(instance.exports.stats, 1),
        copy: mem_data.getUint32(instance.exports.stats + 4, 1),
      },
    };
  },
}
