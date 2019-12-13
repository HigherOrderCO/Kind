const code = Buffer.from(require("./fm-runtime-evm-src.js"), 'base64');
const { execFileSync } = require('child_process');

module.exports = {
  reduce: function(rt_defs, id) {
    var input = [id]

    // Write RefId table and RtTerms to call data
    var off = 1 + 3 * rt_defs.length;
    input[off - 1] = 0;
    for (var i = 0; i < rt_defs.length; ++i) {
      input[1 + 3 * i] = rt_defs[i].ptr;
      input[2 + 3 * i] = rt_defs[i].mem.length;
      input[3 + 3 * i] = 4 * off;
      input.push(...rt_defs[i].mem);
      off += rt_defs[i].mem.length;
    }

    input = input.map(x => x.toString(16).padStart(8, '0')).join('');

    try {
      var result = execFileSync('evm', ['--code', code, '--input', input, '--statdump', 'run']);
    } catch (e) {
      console.log(new TextDecoder().decode(e.stdout))
    }

    const buf = Buffer.from(new TextDecoder().decode(result.slice(2)), 'hex');

    // EVM uses big-endian encoding, so we have to byte-swap here
    var mem = []
    for (var i = 4; i < buf.length; i += 4) {
       mem.push(buf.readUInt32BE(i))
    }

    return {
      rt_term: {
        ptr: buf.readUInt32BE(0),
        mem,
      },
      stats: {
        beta: 0,
        copy: 0,
      },
    };
  },
}
