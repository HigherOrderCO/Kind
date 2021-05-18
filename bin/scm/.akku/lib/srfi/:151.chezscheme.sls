#!r6rs
;; SRFI-151 r6rs library entry
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
;;
;; This implementation contains code from the SRFI-151 example implementation:
;;
;; Copyright (C) John Cowan (2016). All Rights Reserved.
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
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
;; IN THE SOFTWARE.
;;
;; Which in turn includes some code from the Olin Shiver's SRFI-33 implementation:
;;
;; Olin Shivers is the sole author of this code, and he has placed it in the
;; public domain.
;;
;; Licenses are noted inline.  The majority of the rest of the code is simply
;; wrappers around R6RS functions, or simple extensions.

(library (srfi :151)
  (export
    bitwise-not
    bitwise-and   bitwise-ior 
    bitwise-xor   bitwise-eqv
    bitwise-nand  bitwise-nor 
    bitwise-andc1 bitwise-andc2
    bitwise-orc1  bitwise-orc2 

    arithmetic-shift bit-count 
    integer-length bitwise-if 

    bit-set? copy-bit bit-swap
    any-bit-set? every-bit-set?
    first-set-bit

    bit-field bit-field-any? bit-field-every?
    bit-field-clear bit-field-set
    bit-field-replace  bit-field-replace-same
    bit-field-rotate bit-field-reverse

    bits->list list->bits bits->vector vector->bits
    bits
    bitwise-fold bitwise-for-each bitwise-unfold
    make-bitwise-generator)
  (import (srfi :151 bitwise-operations)))
