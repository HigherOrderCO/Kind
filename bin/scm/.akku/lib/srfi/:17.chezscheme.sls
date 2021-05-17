#!r6rs
;; SRFI-17 r6rs library entry
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

(library (srfi :17)
  (export getter-with-setter set!
          car cdr
          caar cadr cdar cddr
          caaar caadr cadar caddr cdaar cdadr cddar cdddr
          caaaar caaadr caadar caaddr cadaar cadadr caddar cadddr
          cdaaar cdaadr cdadar cdaddr cddaar cddadr cdddar cddddr
          string-ref vector-ref
          bytevector-ieee-double-native-ref bytevector-ieee-double-ref
          bytevector-ieee-single-native-ref bytevector-ieee-single-ref
          bytevector-s16-native-ref bytevector-s16-ref bytevector-s24-ref
          bytevector-s32-native-ref bytevector-s32-ref bytevector-s40-ref
          bytevector-s48-ref bytevector-s56-ref bytevector-s64-native-ref
          bytevector-s64-ref bytevector-s8-ref bytevector-sint-ref
          bytevector-u16-native-ref bytevector-u16-ref bytevector-u24-ref
          bytevector-u32-native-ref bytevector-u32-ref bytevector-u40-ref
          bytevector-u48-ref bytevector-u56-ref bytevector-u64-native-ref
          bytevector-u64-ref bytevector-u8-ref bytevector-uint-ref
          foreign-ref fxvector-ref hashtable-ref eq-hashtable-ref
          symbol-hashtable-ref list-ref)
  (import (srfi :17 generalized-set!)))
