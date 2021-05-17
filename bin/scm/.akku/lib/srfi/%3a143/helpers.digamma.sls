#!r6rs
;; SRFI-143 r6rs helper implementation
;;
;; Implemnts the fxabs, fxremainder, and fxquotient procedures for the SRFI-143
;; functions, using the provided r6rs generics or simple functions.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :143 helpers)
  (export fxabs fxremainder fxquotient)
  (import (rnrs) (rnrs r5rs))

  (define fxabs (lambda (i) (if (fx<? i 0) (fx- i) i)))

  (define fxremainder (lambda (n d) (remainder n d)))

  (define fxquotient (lambda (n d) (quotient n d))))
