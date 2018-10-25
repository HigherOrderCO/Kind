// Note: Scott encodings are still used here despite being unusual in
// JavaScript because our benchmarks are meant to test identical code. Not
// using them would speed it up, but that'd *not* be enough to make things
// different. Other benchmarks not using Scott encodings should be done to be
// more fair to JS!

// Note: sadly, this stack-overflows quickly. By adjusting the stack size,
// I managed to get to 2^9 calls at most. I had to extrapolate, but that was
// hard with such a small number. 2^8 calls took 0.2s and 2^9 calls took 0.4s;
// if the trend continued, 2^20 calls would take 819s.
// TEST VALUES

const {s_succ, s_zero, s_O, s_z, s_cons, s_nil, to_List, apply_pow2n_times, map, inc, n20, u32_zero, list_with_100_zeros} = require("./base.js");

console.log(JSON.stringify(to_List(apply_pow2n_times(n20)(map(inc))(list_with_100_zeros))));
