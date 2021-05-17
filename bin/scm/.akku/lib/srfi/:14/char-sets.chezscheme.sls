;; -*- mode: scheme; coding: utf-8 -*-
;; Copyright © 2018 Göran Weinholt <goran@weinholt.se>
;; SPDX-License-Identifier: (MIT OR BSD-3-Clause OR LicenseRef-LICENSE)
#!r6rs

(library (srfi :14 char-sets)
  (export
    ; Predicates & comparison
    char-set? char-set= char-set<= char-set-hash
    ; Iterating over character sets
    char-set-cursor char-set-ref char-set-cursor-next end-of-char-set?
    char-set-fold char-set-unfold char-set-unfold!
    char-set-for-each char-set-map
    ; Creating character sets
    char-set-copy char-set
    list->char-set  string->char-set
    list->char-set! string->char-set!
    char-set-filter  ucs-range->char-set
    char-set-filter! ucs-range->char-set!
    (rename (x->char-set ->char-set))
    ; Querying character sets
    char-set->list char-set->string
    char-set-size char-set-count char-set-contains?
    char-set-every char-set-any
    ; Character-set algebra
    char-set-adjoin  char-set-delete
    char-set-adjoin! char-set-delete!
    char-set-complement  char-set-union  char-set-intersection
    char-set-complement! char-set-union! char-set-intersection!
    char-set-difference  char-set-xor  char-set-diff+intersection
    char-set-difference! char-set-xor! char-set-diff+intersection!
    ; Standard character sets
    char-set:lower-case  char-set:upper-case  char-set:title-case
    char-set:letter      char-set:digit       char-set:letter+digit
    char-set:graphic     char-set:printing    char-set:whitespace
    char-set:iso-control char-set:punctuation char-set:symbol
    char-set:hex-digit   char-set:blank       char-set:ascii
    char-set:empty       char-set:full)
  (import
    (except (rnrs) define-record-type)
    (rnrs mutable-strings)
    (rnrs r5rs)
    (rename (only (srfi :1 lists) partition)
            (partition partition-list))
    (srfi :9 records)
    (srfi private include)
    (srfi private let-opt)
    (srfi :14 char-sets inversion-list))

  (define-syntax define-record-discloser
    (syntax-rules ()
      ((_ type discloser)
       (define dummy #f))))

  (define (make-immutable! obj)
    #f)

  (define char->scalar-value char->integer)
  (define scalar-value->char integer->char)

  (define make-byte-vector make-bytevector)
  (define byte-vector-ref bytevector-u8-ref)
  (define byte-vector-set! bytevector-u8-set!)
  (define byte-vector=? bytevector=?)
  (define copy-bytes! bytevector-copy!)
  (define byte-vector-length bytevector-length)

  (define (unspecific) (if #f #f))

  (define-syntax opt-lambda
    (lambda (x)
      (define (split-args args)
        (syntax-case args ()
          [(name . rest)
           (identifier? #'name)
           (let-values (((names opt-args) (split-args #'rest)))
             (values (cons #'name names) opt-args))]
          [(opt-args ...)
           (values '() #'(opt-args ...))]))

      (syntax-case x ()
        [(_ (args ...) body ...)
         (let-values (((fixed-args opt-args) (split-args #'(args ...))))
           (with-syntax (((fixed-args ...) fixed-args)
                         ((opt-args ...) opt-args))
             #'(lambda (fixed-args ... . rest)
                 (let-optionals* rest (opt-args ...) body ...))))])))

  (include/resolve ("srfi" "%3a14") "srfi-14.scm")
  (include/resolve ("srfi" "%3a14") "srfi-14-base-char-sets.scm")
  (include/resolve ("srfi" "%3a14") "srfi-14-char-sets.scm"))
