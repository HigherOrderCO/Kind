#!r6rs
;; SRFI-143 r6rs library entry
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep
;;
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to
;; deal in the Software without restriction, including without limitation the
;; rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
;; sell copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;;
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;;
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
;; THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
;; DEALINGS IN THE SOFTWARE.

(library (srfi :143)
  (export
    fx-width fx-greatest fx-least

    fixnum? fx=? fx<? fx>? fx<=? fx>=? fxzero? fxpositive? fxnegative? fxodd?
    fxeven? fxmax fxmin

    fx+ fx- fxneg fx* fxquotient fxremainder fxabs fxsquare fxsqrt

    fx+/carry fx-/carry fx*/carry

    fxnot fxand fxior fxxor fxarithmetic-shift fxarithmetic-shift-left
    fxarithmetic-shift-right fxbit-count fxlength fxif fxbit-set? fxcopy-bit
    fxfirst-set-bit fxbit-field fxbit-field-rotate fxbit-field-reverse)
  (import (srfi :143 fixnums)))
