;; -*- mode: scheme; coding: utf-8 -*-
;; Copyright © 2018 Göran Weinholt <goran@weinholt.se>
;; SPDX-License-Identifier: (MIT OR BSD-3-Clause OR LicenseRef-LICENSE)
#!r6rs

(library (srfi :14 char-sets inversion-list)
  (export
    inversion-list?
    make-empty-inversion-list
    number->inversion-list
    numbers->inversion-list
    range->inversion-list
    ranges->inversion-list

    inversion-list=?
    inversion-list-adjoin
    inversion-list-complement
    inversion-list-copy
    inversion-list-difference
    inversion-list-fold/done?
    inversion-list-hash
    inversion-list-intersection
    inversion-list-member?
    inversion-list-remove
    inversion-list-size
    inversion-list-union

    inversion-list-cursor
    inversion-list-cursor?
    inversion-list-cursor-ref
    inversion-list-cursor-next
    inversion-list-cursor-at-end?)
  (import
    (except (rnrs) define-record-type)
    (rnrs r5rs)
    (srfi :9 records)
    (srfi private include))

  (define-syntax define-record-discloser
    (syntax-rules ()
      ((_ type discloser)
       (define dummy #f))))

  (let-syntax ((define-record-type
                   (lambda (x)
                     (syntax-case x ()
                       ((_ tag typename (constructor field-init* ...) etc ...)
                        #'(define-record-type typename
                            (constructor field-init* ...) etc ...))))))

    (include/resolve ("srfi" "%3a14" "char-sets") "inversion-list-impl.scm")))
