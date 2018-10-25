// Note: Scott encodings are still used here despite being unusual in
// JavaScript because our benchmarks are meant to test identical code. Not
// using them would speed it up, but that'd *not* be enough to make things
// different. Other benchmarks not using Scott encodings should be done to be
// more fair to JS!

// Note: sadly, this stack-overflows quickly. By adjusting the stack size,
// I managed to get to 2^9 calls at most. I had to extrapolate, but that was
// hard with such a small number. 2^8 calls took 0.2s and 2^9 calls took 0.4s;
// if the trend continued, 2^20 calls would take 819s.

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
    
// TEST VALUES

// The natural number 20
const n =
  s_succ(s_succ(s_succ(s_succ(
  s_succ(s_succ(s_succ(s_succ(
  s_succ(s_succ(s_succ(s_succ(
  s_succ(s_succ(s_succ(s_succ(
  s_succ(s_succ(s_succ(s_succ(
    s_zero
  ))))
  ))))
  ))))
  ))))
  ))));

// A string of 32 bits, all zeroes
const zeroes =
  s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(
  s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(
  s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(
  s_O(s_O(s_O(s_O(s_O(s_O(s_O(s_O(
    s_z
  ))))))))
  ))))))))
  ))))))))
  ))))))))

// A list with 1000 strings of 32 bits, all zeroes
const list =
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
  s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(s_cons(zeroes)(
    s_nil
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))))
  ))))))))));

// MAIN

// Maps `inc` 2^20 times to `list`; in total, `inc` is applied 2^20*1000 = 1,048,576,000 = about 1 billion times
console.log(
  JSON.stringify(
  s_List_to_List(
  apply_pow2n_times(n)(map(inc))(list))));
