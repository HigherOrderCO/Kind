#!r6rs
;; SRFI-143 r6rs library implementation
;;
;; Implements the fixnum operators specified in SRFI-143 using a combination of
;; R6RS sepcified version and Chez Scheme provided operators where R6RS does
;; not include them.  These are in the helpers library and non-Chez Scheme
;; versions are included for supporting other R6RS implementations.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep
;; Copyright (c) 2020 Amirouche Boubekki

(library (srfi :143 fixnums)
  (export
    fx-width fx-greatest fx-least

    fixnum? fx=? fx<? fx>? fx<=? fx>=? fxzero? fxpositive? fxnegative? fxodd?
    fxeven? fxmax fxmin

    fx+ fx- fxneg fx* fxquotient fxremainder fxabs fxsquare fxsqrt

    fx+/carry fx-/carry fx*/carry

    fxnot fxand fxior fxxor fxarithmetic-shift fxarithmetic-shift-left
    fxarithmetic-shift-right fxbit-count fxlength fxif fxbit-set? fxcopy-bit
    fxfirst-set-bit fxbit-field fxbit-field-rotate fxbit-field-reverse)
  (import (except (rnrs) fxbit-set? fxcopy-bit)
          (prefix (only (rnrs) fxbit-set? fxcopy-bit) r6:)
          (srfi :143 helpers))

  (define fx-width (fixnum-width))
  (define fx-greatest (greatest-fixnum))
  (define fx-least (least-fixnum))

  (define (fxbit-set? index b)
    (r6:fxbit-set? b index))

  (define (fxcopy-bit index i c)
    (if (fxnegative? index)
        (r6:fxcopy-bit i (fx+ fx-width index) (if c 1 0))
        (r6:fxcopy-bit i index (if c 1 0))))

  (define fxneg (lambda (i) (fx- i)))

  (define fxsquare (lambda (i) (fx* i i)))

  (define fxsqrt (lambda (i) (exact-integer-sqrt i)))

  (define fxfirst-set-bit (lambda (i) (fxfirst-bit-set i)))

  (define (fxbit-field-rotate i count start end)
    (if (fxnegative? count)
      (fxrotate-bit-field i start end (+ count (- end start)))
      (fxrotate-bit-field i start end count)))

  (define fxbit-field-reverse (lambda (i s e) (fxreverse-bit-field i s e))))
