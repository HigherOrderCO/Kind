#!r6rs
;; SRFI-60 r6rs library entry
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

(library (srfi :60)
  (export logand bitwise-and logior bitwise-ior logxor bitwise-xor lognot
          bitwise-not bitwise-if bitwise-merge logtest any-bits-set?  logcount
          bit-count integer-length log2-binary-factors first-set-bit logbit?
          bit-set?  copy-bit bit-field copy-bit-field ash arithmetic-shift
          rotate-bit-field reverse-bit-field integer->list
          list->integer booleans->integer)
  (import (srfi :60 integer-bits)))
