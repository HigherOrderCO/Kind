#!r6rs
;; SRFI-60 R6RS implementation
;;
;; Builds out the SRFI-60 specified bitwise operators using the set of bitwise
;; operators that is part of the standard R6RS library.  In some cases these
;; could directly use Chez Scheme library procedures directly, but this library
;; does not do that yet.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :60 integer-bits)
  (export logand bitwise-and logior bitwise-ior logxor bitwise-xor lognot
          bitwise-not bitwise-if bitwise-merge logtest any-bits-set? logcount
          bit-count integer-length log2-binary-factors first-set-bit logbit?
          bit-set? copy-bit bit-field copy-bit-field ash arithmetic-shift
          rotate-bit-field reverse-bit-field integer->list
          list->integer booleans->integer)
  (import (rnrs))

  (define logand
    (case-lambda
      [() (bitwise-and)]
      [(i) i]
      [(i j) (bitwise-and i j)]
      [(i j k) (bitwise-and i j k)]
      [args (apply bitwise-and args)]))

  (define logior
    (case-lambda
      [() (bitwise-ior)]
      [(i) i]
      [(i j) (bitwise-ior i j)]
      [(i j k) (bitwise-ior i j k)]
      [args (apply bitwise-ior args)]))
  
  (define logxor
    (case-lambda
      [() (bitwise-xor)]
      [(i) i]
      [(i j) (bitwise-xor i j)]
      [(i j k) (bitwise-xor i j k)]
      [args (apply bitwise-xor args)]))

  (define lognot (lambda (n) (bitwise-not n)))

  (define bitwise-merge (lambda (m n0 n1) (bitwise-if m n0 n1)))

  (define logtest (lambda (j k) (not (zero? (logand j k)))))
  (define any-bits-set? (lambda (j k) (not (zero? (logand j k)))))

  (define logcount
    (lambda (n)
      (if (< n 0)
          (bitwise-bit-count (bitwise-not n))
          (bitwise-bit-count n))))

  (define bit-count
    (lambda (n)
      (if (< n 0)
          (bitwise-bit-count (bitwise-not n))
          (bitwise-bit-count n))))

  (define integer-length (lambda (n) (bitwise-length n)))

  (define log2-binary-factors (lambda (n) (bitwise-first-bit-set n)))
  (define first-set-bit (lambda (n) (bitwise-first-bit-set n)))

  (define logbit? (lambda (i n) (bitwise-bit-set? n i)))
  (define bit-set? (lambda (i n) (bitwise-bit-set? n i))) 

  (define copy-bit (lambda (i n b) (bitwise-copy-bit n i (if b 1 0))))

  (define bit-field (lambda (n s e) (bitwise-bit-field n s e)))

  (define copy-bit-field
    (lambda (to from s e)
      (bitwise-copy-bit-field to s e from)))

  (define ash (lambda (n count) (bitwise-arithmetic-shift n count)))
  (define arithmetic-shift
    (lambda (n count)
      (bitwise-arithmetic-shift n count)))

  (define rotate-bit-field
    (lambda (n count start end)
      (bitwise-rotate-bit-field n start end count)))

  (define reverse-bit-field
    (lambda (n start end)
      (bitwise-reverse-bit-field n start end)))

  (define integer->list
    (case-lambda
      [(k len) (let loop ([i len] [ls '()])
                 (if (fx=? i 0)
                     ls
                     (let ([i (fx- i 1)])
                       (loop i (cons (bitwise-bit-set? k i) ls)))))]
      [(k) (integer->list k (bitwise-length k))]))

  (define list->integer
    (lambda (ls)
      (let loop ([ls ls] [i 0] [n 0])
        (if (null? ls)
            n
            (loop (cdr ls) (fx+ i 1) (bitwise-copy-bit n i (if (car ls) 1 0)))))))

  (define booleans->integer
    (lambda args
      (list->integer args))))
