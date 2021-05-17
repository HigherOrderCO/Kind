#!r6rs
;; Copyright (C) 2009 Andreas Rottmann. All rights reserved. Licensed
;; under an MIT-style license. See the file LICENSE in the original
;; collection this file is distributed with.

(library (srfi :69 basic-hash-tables)
  (export
    ;; Type constructors and predicate
    make-hash-table hash-table? alist->hash-table

    ;; Reflective queries
    hash-table-equivalence-function hash-table-hash-function

    ;; Dealing with single elements
    hash-table-ref hash-table-ref/default hash-table-set!
    hash-table-delete! hash-table-exists?
    hash-table-update! hash-table-update!/default

    ;; Dealing with the whole contents
    hash-table-size hash-table-keys hash-table-values hash-table-walk
    hash-table-fold hash-table->alist hash-table-copy hash-table-merge!

    ;; Hashing
    hash string-hash string-ci-hash hash-by-identity)
  (import
    (rename (rnrs)
            (string-hash rnrs:string-hash)
            (string-ci-hash rnrs:string-ci-hash)))

(define make-hash-table
  (case-lambda
    ((eql? hash)
     (make-hashtable hash eql?))
    ((eql?)
     (cond ((eq? eql? eq?)
            (make-eq-hashtable))
           ((eq? eql? eqv?)
            (make-eqv-hashtable))
           ((eq? eql? equal?)
            (make-hashtable equal-hash eql?))
           ((eq? eql? string=?)
            (make-hashtable rnrs:string-hash eql?))
           ((eq? eql? string-ci=?)
            (make-hashtable rnrs:string-ci-hash eql?))
           (else
            (assertion-violation 'make-hash-table
             "unrecognized equivalence predicate" eql?))))
    (()
     (make-hashtable equal-hash equal?))))

(define hash-table? hashtable?)

(define not-there (list 'not-there))

(define (alist->hash-table alist . args)
  (let ((table (apply make-hash-table args)))
    (for-each (lambda (entry)
                (hashtable-update! table
                                   (car entry)
                                   (lambda (x)
                                     (if (eq? x not-there) (cdr entry) x))
                                   not-there))
              alist)
    table))

(define hash-table-equivalence-function hashtable-equivalence-function)
(define hash-table-hash-function hashtable-hash-function)

(define (failure-thunk who key)
  (lambda ()
    (assertion-violation who "no association for key" key)))

(define hash-table-ref
  (case-lambda
    ((table key thunk)
     (let ((val (hashtable-ref table key not-there)))
       (if (eq? val not-there)
           (thunk)
           val)))
    ((table key)
     (hash-table-ref table key (failure-thunk 'hash-table-ref key)))))

(define hash-table-ref/default hashtable-ref)
(define hash-table-set! hashtable-set!)
(define hash-table-delete! hashtable-delete!)
(define hash-table-exists? hashtable-contains?)

(define hash-table-update!
  (case-lambda
    ((table key proc thunk)
     (hashtable-update! table
                        key
                        (lambda (val)
                          (if (eq? val not-there)
                              (thunk)
                              (proc val)))
                        not-there))
    ((table key proc)
     (hash-table-update! table key proc (failure-thunk 'hash-table-update! key)))))

(define hash-table-update!/default hashtable-update!)

(define hash-table-size hashtable-size)

(define (hash-table-keys table)
  (vector->list (hashtable-keys table)))

(define (hash-table-values table)
  (let-values (((keys values) (hashtable-entries table)))
    (vector->list values)))

(define (hash-table-walk table proc)
  (let-values (((keys values) (hashtable-entries table)))
    (vector-for-each proc keys values)))

(define (hash-table-fold table kons knil)
  (let-values (((keys values) (hashtable-entries table)))
    (let ((size (vector-length keys)))
      (let loop ((i 0)
                 (val knil))
        (if (>= i size)
            val
            (loop (+ i 1)
                  (kons (vector-ref keys i) (vector-ref values i) val)))))))

(define (hash-table->alist table)
  (hash-table-fold table
                   (lambda (k v l)
                     (cons (cons k v) l))
                   '()))

(define hash-table-copy hashtable-copy)

(define (hash-table-merge! table1 table2)
  (hash-table-walk table2 (lambda (k v)
                            (hashtable-set! table1 k v)))
  table1)

(define (make-hasher hash-proc)
  (case-lambda
    ((obj)
     ;; R6RS doesn't guarantee that the result of the hash procedure
     ;; is non-negative, so we use mod.
     (mod (hash-proc obj) (greatest-fixnum)))
    ((obj bound)
     (mod (hash-proc obj) bound))))

(define hash (make-hasher equal-hash))
(define hash-by-identity (make-hasher equal-hash))  ;; Very slow.
(define string-hash (make-hasher rnrs:string-hash))
(define string-ci-hash (make-hasher rnrs:string-ci-hash))

)
