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
const to_Bits = (function to_Bits() {
  return bs => bs(null)
    (bs => f => O(f(bs)))
    (bs => f => I(f(bs)))
    (f => z)
    (to_Bits());
})();

// Converts a lambda-encoded list to a native list
const to_List = (function to_List() {
  return xs => xs(null)
    (x => xs => cons(to_Bits(x))(to_List()(xs)))
    (nil);
})();

// VALUES

// Some natural numbers
const n0 = s_zero;
const n1 = s_succ(s_zero);
const n2 = s_succ(s_succ(s_zero));
const n3 = s_succ(s_succ(s_succ(s_zero)));
const n4 = s_succ(s_succ(s_succ(s_succ(s_zero))));
const n5 = s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))));
const n6 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))));
const n7 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))));
const n8 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))));
const n9 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))));
const n10 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))));
const n11 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))));
const n12 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))));
const n13 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))))));
const n14 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))))));
const n15 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))))))));
const n16 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))))))));
const n17 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))))))))));
const n18 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))))))))));
const n19 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))))))))))));
const n20 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))))))))))));
const n21 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero)))))))))))))))))))));
const n22 = s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_succ(s_zero))))))))))))))))))))));

// A string of 32 bits, all zeroes
const u32_zero = s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O( s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_z))))))))))))))))))))))))))))))));

// A list with 100 strings of 32 bits, all zeroes
const list_with_100_zeros =
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
  s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(s_cons(u32_zero)(
    s_nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));


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

// Applies a function 2^n times to a value
const apply_pow2n_times_bits = (function apply_pow2n_times_bits() {
  return n =>
    n (null)
      (n => f => apply_pow2n_times_bits()(n)(x => f(f(x))))
      (f => x => f(x));
})();

// Doubles the size of a list
const double_size = (function double_size() {
  return xs =>
    xs(null)
      (x => xs => s_cons(x)(s_cons(x)(double_size()(xs))))
      (s_nil);
})();

// Computes the length of a list
const length = (function length() {
  const length_aux = (function length_aux() {
    return xs =>
      xs(null)
        (x => xs => r => length_aux()(xs)(inc(r)))
        (r => r);
  })();
  return xs => length_aux(xs)(u32_zero);
})();

// Flips every bit of a bitstring. Not fusible, in order to force it
// pattern-matches as many times as expected without being optimized away
const flip_unfusible = (function flip_unfusible() {
  return bs => bs(null)
    (bs => f => s_I(f(bs)))
    (bs => f => s_O(f(bs)))
    (f => s_z)
    (flip_unfusible());
})();


module.exports = {O, I, z, succ, zero, cons, nil, s_z, s_O, s_I, s_zero, s_succ, s_nil, s_cons, to_Bits, to_List, inc, map, apply_pow2n_times, apply_pow2n_times_bits, double_size, length, flip_unfusible, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16, n17, n18, n19, n20, n21, n22, u32_zero, list_with_100_zeros};
