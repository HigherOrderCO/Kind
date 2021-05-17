#!r6rs
;; SRFI-4 implementation
;;
;; Wraps a bytevector with a scheme record so that the wrapping vector
;; predicates can uniquely recognize it.  This approach is based on the one
;; suggested in the SRFI-4 write-up, with macros as helpers to generate the
;; implementation.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :4 numeric-vectors)
  (export
    s8vector? make-s8vector s8vector s8vector-length s8vector-ref s8vector-set!
    s8vector->list list->s8vector

    s16vector? make-s16vector s16vector s16vector-length s16vector-ref
    s16vector-set! s16vector->list list->s16vector

    s32vector? make-s32vector s32vector s32vector-length s32vector-ref
    s32vector-set! s32vector->list list->s32vector

    s64vector? make-s64vector s64vector s64vector-length s64vector-ref
    s64vector-set! s64vector->list list->s64vector

    u8vector? make-u8vector u8vector u8vector-length u8vector-ref u8vector-set!
    u8vector->list list->u8vector

    u16vector? make-u16vector u16vector u16vector-length u16vector-ref
    u16vector-set! u16vector->list list->u16vector

    u32vector? make-u32vector u32vector u32vector-length u32vector-ref
    u32vector-set! u32vector->list list->u32vector

    u64vector? make-u64vector u64vector u64vector-length u64vector-ref
    u64vector-set! u64vector->list list->u64vector

    f32vector? make-f32vector f32vector f32vector-length f32vector-ref
    f32vector-set! f32vector->list list->f32vector

    f64vector? make-f64vector f64vector f64vector-length f64vector-ref
    f64vector-set! f64vector->list list->f64vector)
  (import (rnrs) (srfi :28))

  (define-syntax define-integer-vector
    (lambda (x)
      (define format-id
        (lambda (tid fmt . args)
          (datum->syntax tid
            (string->symbol
              (apply format fmt args)))))
      (syntax-case x ()
        [(k signed? bit-size)
         (and (boolean? (syntax->datum #'signed?))
              (let ([bit-size (syntax->datum #'bit-size)])
                (and (integer? bit-size) (exact? bit-size))))
         (let ([signed? (syntax->datum #'signed?)]
               [bit-size (syntax->datum #'bit-size)])
           (let ([base-name (format "~a~svector" (if signed? #\s #\u) bit-size)])
             (with-syntax ([name (format-id #'k "$~a" base-name)]
                           [bv-accessor (format-id #'k "$~a-bv" base-name)]
                           [maker (format-id #'k "make-~a" base-name)]
                           [pred (format-id #'k "~a?" base-name)]
                           [litmaker (format-id #'k "~a" base-name)]
                           [len (format-id #'k "~a-length" base-name)]
                           [ref (format-id #'k "~a-ref" base-name)]
                           [set (format-id #'k "~a-set!" base-name)]
                           [->list (format-id #'k "~a->list" base-name)]
                           [list-> (format-id #'k "list->~a" base-name)]
                           [bytes (fxdiv bit-size 8)]
                           [min (if signed? (- (expt 2 (- bit-size 1))) 0)]
                           [max (if signed?
                                    (- (expt 2 (- bit-size 1)) 1)
                                    (- (expt 2 bit-size) 1))]
                           [(bytevector-ref bytevector-set!)
                            (let ([signed-char (if signed? #\s #\u)])
                              (if (fx=? bit-size 8)
                                  (list
                                    (format-id #'k "bytevector-~a~s-ref" signed-char bit-size)
                                    (format-id #'k "bytevector-~a~s-set!" signed-char bit-size))
                                  (list
                                    (format-id #'k "bytevector-~a~s-native-ref" signed-char bit-size)
                                    (format-id #'k "bytevector-~a~s-native-set!" signed-char bit-size))))])
               #'(begin
                   (define check-val
                     (lambda (who value)
                       (unless (and (and (integer? value)
                                         (exact? value))
                                    (<= min value max))
                         (error who (format "expected integer value in range ~s to ~s, but got ~s" min max value)))))
                   (define-record-type (name maker pred)
                     (nongenerative)
                     (sealed #t)
                     (opaque #t)
                     (fields (immutable bv bv-accessor))
                     (protocol
                       (lambda (new)
                         (case-lambda
                           [(size) (new (make-bytevector (fx* size bytes)))]
                           [(size value)
                            (check-val 'maker value)
                            (let ([bv-size (fx* size bytes)])
                              (let ([bv (make-bytevector bv-size)])
                                (do ([i 0 (fx+ i bytes)])
                                  ((fx=? i bv-size) (new bv))
                                  (bytevector-set! bv i value))))]))))
                   (define len
                     (lambda (v)
                       (fxdiv (bytevector-length (bv-accessor v)) bytes)))
                   (define ref
                     (lambda (v i)
                       (bytevector-ref (bv-accessor v) (fx* i bytes))))
                   (define set
                     (lambda (v i value)
                       (check-val 'set! value)
                       (bytevector-set! (bv-accessor v) (fx* i bytes) value)))
                   (define ->list
                     (lambda (v)
                       (let ([bv (bv-accessor v)])
                         (let loop ([n (bytevector-length bv)] [ls '()])
                           (if (fx=? n 0)
                               ls
                               (let ([n (fx- n bytes)])
                                 (loop n (cons (bytevector-ref bv n) ls))))))))
                   (define $list->
                     (lambda (who ls)
                       (let f ([ls ls] [bv-bytes 0])
                         (if (null? ls)
                             (maker (fxdiv bv-bytes bytes))
                             (let ([v (f (cdr ls) (fx+ bv-bytes bytes))] [val (car ls)])
                               (check-val who val)
                               (bytevector-set! (bv-accessor v) bv-bytes val)
                               v)))))
                   (define list-> (lambda (ls) ($list-> 'list-> ls)))
                   (define litmaker (lambda args ($list-> 'litmaker args)))))))])))

  (define-integer-vector #t 8)
  (define-integer-vector #t 16)
  (define-integer-vector #t 32)
  (define-integer-vector #t 64)

  (define-integer-vector #f 8)
  (define-integer-vector #f 16)
  (define-integer-vector #f 32)
  (define-integer-vector #f 64)

  (define-syntax define-float-vector
    (lambda (x)
      (define format-id
        (lambda (tid fmt . args)
          (datum->syntax tid
            (string->symbol
              (apply format fmt args)))))
      (syntax-case x ()
        [(k bit-size)
         (let ([bit-size (syntax->datum #'bit-size)])
           (and (integer? bit-size) (exact? bit-size)))
         (let ([bit-size (syntax->datum #'bit-size)])
           (let ([base-name (format "f~svector" bit-size)])
             (with-syntax ([name (format-id #'k "$~a" base-name)]
                           [bv-accessor (format-id #'k "$~a-bv" base-name)]
                           [maker (format-id #'k "make-~a" base-name)]
                           [pred (format-id #'k "~a?" base-name)]
                           [litmaker (format-id #'k "~a" base-name)]
                           [len (format-id #'k "~a-length" base-name)]
                           [ref (format-id #'k "~a-ref" base-name)]
                           [set (format-id #'k "~a-set!" base-name)]
                           [->list (format-id #'k "~a->list" base-name)]
                           [list-> (format-id #'k "list->~a" base-name)]
                           [bytes (fxdiv bit-size 8)]
                           [(bytevector-ref bytevector-set!)
                            (case bit-size
                              [(32)
                               (list #'bytevector-ieee-single-native-ref
                                     #'bytevector-ieee-single-native-set!)]
                              [(64)
                               (list #'bytevector-ieee-double-native-ref
                                     #'bytevector-ieee-double-native-set!)])])
               #'(begin
                   (define check-val
                     (lambda (who value)
                       (unless (flonum? value)
                         (error who (format "expected floating point value, but got ~s" value)))))
                   (define-record-type (name maker pred)
                     (nongenerative)
                     (sealed #t)
                     (opaque #t)
                     (fields (immutable bv bv-accessor))
                     (protocol
                       (lambda (new)
                         (case-lambda
                           [(size) (new (make-bytevector (fx* size bytes)))]
                           [(size value)
                            (check-val 'maker value)
                            (let ([bv-size (fx* size bytes)])
                              (let ([bv (make-bytevector bv-size)])
                                (do ([i 0 (fx+ i bytes)])
                                  ((fx=? i bv-size) (new bv))
                                  (bytevector-set! bv i value))))]))))
                   (define len
                     (lambda (v)
                       (fxdiv (bytevector-length (bv-accessor v)) bytes)))
                   (define ref
                     (lambda (v i)
                       (bytevector-ref (bv-accessor v) (fx* i bytes))))
                   (define set
                     (lambda (v i value)
                       (check-val 'set! value)
                       (bytevector-set! (bv-accessor v) (fx* i bytes) value)))
                   (define ->list
                     (lambda (v)
                       (let ([bv (bv-accessor v)])
                         (let loop ([n (bytevector-length bv)] [ls '()])
                           (if (fx=? n 0)
                               ls
                               (let ([n (fx- n bytes)])
                                 (loop n (cons (bytevector-ref bv n) ls))))))))
                   (define $list->
                     (lambda (who ls)
                       (let f ([ls ls] [bv-bytes 0])
                         (if (null? ls)
                             (maker (fxdiv bv-bytes bytes))
                             (let ([v (f (cdr ls) (fx+ bv-bytes bytes))] [val (car ls)])
                               (check-val who val)
                               (bytevector-set! (bv-accessor v) bv-bytes val)
                               v)))))
                   (define list-> (lambda (ls) ($list-> 'list-> ls)))
                   (define litmaker (lambda args ($list-> 'litmaker args)))))))])))

  (define-float-vector 32)
  (define-float-vector 64))
