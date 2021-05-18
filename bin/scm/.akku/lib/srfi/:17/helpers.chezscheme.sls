#!r6rs
;; SRFI-17 Chez Scheme helpers
;;
;; This file contains wrappers for some of the built-in setters used
;; by the generalized set! syntax.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :17 helpers)
  (export $list-set!
          $hashtable-set! $eq-hashtable-set! $symbol-hashtable-set!
          $set-caar! $set-cadr! $set-cdar! $set-cddr!
          $set-caaar! $set-caadr! $set-cadar! $set-caddr!
          $set-cdaar! $set-cdadr! $set-cddar! $set-cdddr!
          $set-caaaar! $set-caaadr! $set-caadar! $set-caaddr!
          $set-cadaar! $set-cadadr! $set-caddar! $set-cadddr!
          $set-cdaaar! $set-cdaadr! $set-cdadar! $set-cdaddr!
          $set-cddaar! $set-cddadr! $set-cdddar! $set-cddddr!
          $bytevector-ieee-double-set! $bytevector-ieee-single-set!
          $bytevector-s16-set! $bytevector-s24-set! $bytevector-s32-set!
          $bytevector-s40-set! $bytevector-s48-set! $bytevector-s56-set!
          $bytevector-s64-set! $bytevector-u16-set! $bytevector-u24-set!
          $bytevector-u32-set! $bytevector-u40-set! $bytevector-u48-set!
          $bytevector-u56-set! $bytevector-u64-set!
          $bytevector-sint-set! $bytevector-uint-set!)
  (import (chezscheme))

  (define-syntax define-$set-c...r!
    (lambda (x)
      (define (build-defs-for-level k cnt defs)
        (let ([ls (list "a" "d")])
          (let loop ([i 1] [names ls])
            (if (fx= i (fx- cnt 1))
                (fold-left
                  (lambda (defs name)
                    (fold-left
                      (lambda (defs a)
                        (with-syntax ([base-getter (datum->syntax #'* (string->symbol (string-append "c" name "r")))]
                                      [base-setter (datum->syntax #'* (string->symbol (string-append "set-c" a "r!")))]
                                      [full-setter (datum->syntax k (string->symbol (string-append "$set-c" a name "r!")))])
                          (cons
                            #'(define full-setter
                                (lambda (x v)
                                  (base-setter (base-getter x) v)))
                            defs)))
                      defs ls))
                  defs names)
                (loop (fx+ i 1)
                      (fold-left
                        (lambda (new-names a)
                          (fold-left
                            (lambda (new-names name)
                              (cons (string-append a name) new-names))
                            new-names names))
                        '() ls))))))
      (define (build-defs k s e)
        (do ([i s (fx+ i 1)]
             [defs '() (build-defs-for-level k i defs)])
             ((fx> i e) defs)))
      (syntax-case x ()
        [(k s e)
         (and (and (integer? (datum s)) (exact? (datum s)))
              (and (integer? (datum e)) (exact? (datum s))))
         (with-syntax ([(defs ...) (build-defs #'k (datum s) (datum e))])
           #'(begin defs ...))])))

  (define-$set-c...r! 2 4)

  (define-syntax define-hashtable-set!
    (lambda (x)
      (define (build-def k)
        (lambda (name)
          (with-syntax ([out-name (datum->syntax k (string->symbol (string-append "$" name "hashtable-set!")))]
                        [name (datum->syntax #'* (string->symbol (string-append name "hashtable-set!")))])
            #'(define-syntax out-name
                (syntax-rules ()
                  [(_ ht k dv v) (name ht k v)])))))
      (syntax-case x ()
        [(k name ...) (andmap string? (datum (name ...)))
         (with-syntax ([(defs ...) (map (build-def #'k) (datum (name ...)))])
           #'(begin defs ...))])))

  (define-hashtable-set! "" "eq-" "symbol-")

  (define $list-set!
    (lambda (ls orig-idx v)
      (let loop ([ls ls] [idx orig-idx])
        (if (fx= idx 0)
            (set-car! ls v)
            (if (null? ls)
                (errorf 'list-ref "~s index out of range" orig-idx)
                (loop (cdr ls) (fx+ idx 1)))))))
  
  (define-syntax define-$bv-set!
    (lambda (x)
      (define (build-defs k)
        (lambda (name)
          (let ([name (symbol->string (syntax->datum name))])
            (with-syntax ([bv-set! (datum->syntax #'* (string->symbol (string-append "bytevector-" name "-set!")))]
                          [$bv-set! (datum->syntax k (string->symbol (string-append "$bytevector-" name "-set!")))])
              #'(define-syntax $bv-set!
                  (syntax-rules ()
                    [(_ bv idx eness v) (bv-set! bv idx v eness)]))))))
      (syntax-case x ()
        [(k name ...)
         (with-syntax ([(defs ...) (map (build-defs #'k) #'(name ...))])
           #'(begin defs ...))])))

  (define-$bv-set! ieee-double ieee-single s16 s24 s32 s40 s48 s56 s64 u16 u24 u32 u40 u48 u56 u64)

  (define-syntax define-$bv-int-set!
    (lambda (x)
      (define (build-defs k)
        (lambda (name)
          (let ([name (symbol->string (syntax->datum name))])
            (with-syntax ([bv-set! (datum->syntax #'* (string->symbol (string-append "bytevector-" name "-set!")))]
                          [$bv-set! (datum->syntax k (string->symbol (string-append "$bytevector-" name "-set!")))])
              #'(define-syntax $bv-set!
                  (syntax-rules ()
                    [(_ bv idx eness size v) (bv-set! bv idx v eness size)]))))))
      (syntax-case x ()
        [(k name ...)
         (with-syntax ([(defs ...) (map (build-defs #'k) #'(name ...))])
           #'(begin defs ...))])))

  (define-$bv-int-set! sint uint))
