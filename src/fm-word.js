// Float conversions
let arrbuf = new ArrayBuffer(4);
var u32buf = new Uint32Array(arrbuf);
var f32buf = new Float32Array(arrbuf);
const put_float_on_word = num => { f32buf[0] = num; return u32buf[0]; };
const get_float_on_word = num => { u32buf[0] = num; return f32buf[0]; };

module.exports = {put_float_on_word, get_float_on_word};
