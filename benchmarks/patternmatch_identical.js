const {to_Bits, apply_pow2n_times_bits, n20, flip_unfusible, u32_zero} = require("./base.js");

console.log(JSON.stringify(to_Bits(apply_pow2n_times_bits(n20)(flip_unfusible)(u32_zero))));
