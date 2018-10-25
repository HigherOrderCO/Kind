// NATIVE DATATYPES

// Bitstring
const O = x => ["0", x];
const I = x => ["1", x];
const z = ["z"];

// Natural Number
const succ = x => ["succ", x];
const zero = ["zero"];

// List of Bitstrings
const cons = x => xs => ["cons", x, xs];
const nil  = ["nil"];

// LAMBDA-ENCODED DATATYPES

// Bitstring
const s_z = P => O => I => z => z;
const s_O = bs => P => O => I => z => O(bs);
const s_I = bs => P => O => I => z => I(bs);

// Natural Number
const s_zero = P => s => z => z;
const s_succ = n => P => s => z => s(n);

// List of Bitstrings
const s_nil = P => c => n => n;
const s_cons = x => xs => P => c => n => c(x)(xs);

// Converts a lambda-encoded bitstring to a native bitstring
const s_Bits_to_Bits = (function s_Bits_to_Bits() {
  return bs => bs(null)
    (bs => f => O(f(bs)))
    (bs => f => I(f(bs)))
    (f => z)
    (s_Bits_to_Bits());
})();

// Converts a lambda-encoded list to a native list
const s_List_to_List = (function s_List_to_List() {
  return xs => xs(null)
    (x => xs => cons(s_Bits_to_Bits(x))(s_List_to_List()(xs)))
    (nil);
})();

// FUNCTIONS

// Increments a bitstring by 1
const inc = (function inc() {
  return bs =>
    P => O => I => z =>
      bs(null)(I)(bs => O(inc()(bs)))(z);
  
})();

// Maps a function over a list
const map = (function map() {
  return f => xs =>
    P => c => n =>
      xs(null)(x => xs => c(f(x))(map()(f)(xs)))(n);
})();

// Applies a function 2^n times to a value
const apply_pow2n_times = (function apply_pow2n_times() {
  return n =>
    n (null)
      (n => f => apply_pow2n_times()(n)(x => f(f(x))))
      (f => x => f(x));
})();
    
module.exports = {O, I, z, succ, zero, cons, nil, s_z, s_O, s_I, s_zero, s_succ, s_nil, s_cons, s_Bits_to_Bits, s_List_to_List, inc, map, apply_pow2n_times};
