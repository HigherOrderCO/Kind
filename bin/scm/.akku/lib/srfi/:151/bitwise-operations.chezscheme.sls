#!r6rs
;; SRFI-151 r6rs library implementation
;;
;; The following contains a combination of R6RS implementation along with
;; implementations pulled from the SRFI-151 implementation.
;;
;; The R6RS wrappers and simple functions are:
;; Copyright (c) 2018 - 2020 Andrew W. Keep
;;
;; The bitwise-eqv implementation is based on the Olin Shiver's SRFI-33
;; implementation from the SRFI-151 example library:
;; Olin Shivers is the sole author of this code, and he has placed it in the
;; public domain.
;;
;; The bitwise-fold, bitwise-for-each, bitwise-unfold, and
;; make-bitwise-generator functions are pulled from John Cowan's SRFI-151
;; implementation and are:
;; Copyright John Cowan 2017

(library (srfi :151 bitwise-operations)
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
  (import (rnrs))

  ;;; The bitwise-eqv implmentation is based on the one in the SRFI-151
  ;;; implementation, which extracted it from the SRFI-33 implementation which
  ;;; carried the following copyright information:
  ;;;
  ;;; Olin Shivers is the sole author of this code, and he has placed it in
  ;;; the public domain.
  ;;;
  ;;; A good implementation might choose to provide direct compiler/interpreter
  ;;; support for these derived functions, or might simply define them to be
  ;;; integrable -- i.e., inline-expanded.
  ;;;
  ;;; This is a general definition, but less than efficient.  It should also
  ;;; receive primitive compiler/interpreter support so that the expensive
  ;;; n-ary mechanism is not invoked in the standard cases -- that is,
  ;;; an application of BITWISE-EQV should be rewritten into an equivalent
  ;;; tree applying some two-argument primitive to the arguments, in the
  ;;; same manner that statically-known n-ary applications of associative
  ;;; operations such as + and * are handled efficiently:
  ;;;   (bitwise-eqv)         => -1
  ;;;   (bitwise-eqv i)       => i
  ;;;   (bitwise-eqv i j)     => (%bitwise-eqv i j)
  ;;;   (bitwise-eqv i j k)   => (%bitwise-eqv (%bitwise-eqv i j) k)
  ;;;   (bitwise-eqv i j k l) => (%bitwise-eqv (%bitwise-eqv (%bitwise-eqv i j) k) l)
  ;;;
  ;;; Note: this implementation takes the advice of the comment avove and
  ;;; implemets this using case lambade, though Chez Scheme's source optimizer
  ;;; is relied upon to produce the constants.
  (define bitwise-eqv
    (case-lambda
      [() (bitwise-not (bitwise-xor))]
      [(i) (bitwise-not (bitwise-xor i))]
      [(i j) (bitwise-not (bitwise-xor i j))]
      [(i . more)
       (let loop ([i i] [more more])
         (if (null? more)
             i
             (loop (bitwise-not (bitwise-xor i (car more))) (cdr more))))]))

  (define bitwise-nand  (lambda (i j) (bitwise-not (bitwise-and i j))))
  (define bitwise-nor   (lambda (i j) (bitwise-not (bitwise-ior i j))))
  (define bitwise-andc1 (lambda (i j) (bitwise-and (bitwise-not i) j)))
  (define bitwise-andc2 (lambda (i j) (bitwise-and i (bitwise-not j))))
  (define bitwise-orc1  (lambda (i j) (bitwise-ior (bitwise-not i) j)))
  (define bitwise-orc2  (lambda (i j) (bitwise-ior i (bitwise-not j))))

  (define arithmetic-shift (lambda (i c) (bitwise-arithmetic-shift i c)))

  (define bit-count
    (lambda (i)
      (if (< i 0)
          (bitwise-bit-count (bitwise-not i))
          (bitwise-bit-count i))))

  (define integer-length (lambda (i) (bitwise-length i)))

  (define bit-set? (lambda (index i) (bitwise-bit-set? i index)))

  (define copy-bit
    (lambda (index i bool)
      (bitwise-copy-bit i index (if bool 1 0))))

  (define bit-swap
    (lambda (idx1 idx2 i)
      (if (bitwise-bit-set? i idx1)
          (if (bitwise-bit-set? i idx2)
              i
              (bitwise-copy-bit (bitwise-copy-bit i idx2 1) idx1 0))
          (if (bitwise-bit-set? i idx2)
              (bitwise-copy-bit (bitwise-copy-bit i idx2 0) idx1 1)
              i))))

  (define any-bit-set?  (lambda (bits i) (not (zero? (bitwise-and bits i)))))
  (define every-bit-set?  (lambda (bits i) (= (bitwise-and bits i) bits)))

  (define first-set-bit (lambda (i) (bitwise-first-bit-set i)))

  (define bit-field (lambda (i s e) (bitwise-bit-field i s e)))

  (define bit-field-any?
    (lambda (i s e)
      (not (zero? (bitwise-bit-field i s e)))))

  (define bit-field-every?
    (lambda (i s e)
      (= (bitwise-bit-field i s e) (- (expt 2 (- e s)) 1))))

  (define bit-field-clear
    (lambda (i s e)
      (bitwise-copy-bit-field i s e 0)))

  (define bit-field-set
    (lambda (i s e)
      (bitwise-copy-bit-field i s e -1)))

  (define bit-field-replace
    (lambda (dest src s e)
      (bitwise-copy-bit-field dest s e src)))

  (define bit-field-replace-same
    (lambda (dest src s e)
      (bitwise-copy-bit-field dest s e (bitwise-bit-field src s e))))

  (define bit-field-rotate
    (lambda (i count start end)
      (if (negative? count)
          (bitwise-rotate-bit-field i start end (fx+ count (fx- end start)))
          (bitwise-rotate-bit-field i start end count))))

  (define bit-field-reverse
    (lambda (i start end)
      (bitwise-reverse-bit-field i start end)))

  (define bits->list
    (case-lambda
      [(i)
       (if (< i 0)
           (bits->list i (integer-length i))
           (let f ([i i])
             (if (zero? i)
                 '()
                 (cons (odd? i) (f (bitwise-arithmetic-shift-right i 1))))))]
      [(i n)
       (let loop ([n n] [ls '()])
         (if (fx=? n 0)
             ls
             (let ([n (fx- n 1)])
               (loop n (cons (bitwise-bit-set? i n) ls)))))]))

  (define bits->vector
    (case-lambda
      [(i)
       (if (< i 0)
           (bits->vector i (integer-length i))
           (let f ([i i] [c 0])
             (if (fx=? i 0)
                 (make-vector c)
                 (let ([v (f (bitwise-arithmetic-shift-right i 1) (fx+ c 1))])
                   (vector-set! v c (odd? i))))))]
      [(i n)
       (let ([v (make-vector n)])
         (let loop ([n n])
           (unless (fx=? n 0)
             (let ([n (fx- n 1)])
               (vector-set! v n (bitwise-bit-set? i n))
               (loop n))))
         v)]))

  (define list->bits
    (lambda (ls)
      (let loop ([ls ls] [idx 0] [i 0])
        (if (null? ls)
            i
            (loop (cdr ls) (fx+ idx 1)
              (bitwise-copy-bit i idx (if (car ls) 1 0)))))))

  (define vector->bits
    (lambda (v)
      (let loop ([n (vector-length v)] [i 0])
        (if (fx=? n 0)
            i
            (let ([n (fx- n 1)])
              (loop n (bitwise-copy-bit i n (if (vector-ref v n) 1 0))))))))

  (define bits (lambda args (list->bits args)))

  ;; ---- from SRFI-151 other ---
  ;; The following functions: bitwise-fold, bitwise-for-each, bitwise-unfold,
  ;; and make-bitwise-generator are taken from John Cowan's implemtation
  ;; functions from the SRFI-151.
  ;;
  ;; Copyright John Cowan 2017
  ;;
  (define bitwise-fold
    (lambda (proc seed i)
      (let ([n (integer-length i)])
        (let loop ([idx 0] [r seed])
          (if (fx=? idx n)
              r
              (loop (fx+ idx 1) (proc (bitwise-bit-set? i idx) r)))))))

  (define bitwise-for-each
    (lambda (proc i)
      (let ([n (integer-length i)])
        (let loop ([idx 0])
          (unless (fx=? idx n)
            (proc (bitwise-bit-set? i idx))
            (loop (fx+ idx 1)))))))

  (define bitwise-unfold
    (lambda (stop? mapper successor seed)
      (do ([state seed (successor state)]
           [idx 0 (fx+ idx 1)]
           [i 0 (bitwise-copy-bit i idx (if (mapper state) 1 0))])
        ((stop? state) i))))

  (define make-bitwise-generator
    (lambda (i)
      (let ([idx 0])
        (lambda ()
          (let ([r (bitwise-bit-set? i idx)])
            (set! idx (fx+ idx 1))
            r)))))
  ;; ---- END from SRFI-151 other ---
)
