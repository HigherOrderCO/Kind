// Similarly to mapinc.js, this overflows at n17. Time is extrapolated from the step between n15 and n16.

const {n20, s_Bits_to_Bits, length, double_size, apply_pow2n_times, s_cons, s_z, s_nil} = require("./base.js");

console.log(JSON.stringify(s_Bits_to_Bits(length(apply_pow2n_times(n20)(s_cons(s_z))(s_nil)))));
