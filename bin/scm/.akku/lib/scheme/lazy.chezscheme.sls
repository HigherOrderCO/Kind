;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme lazy)
  (export
    delay force
    (rename (eager make-promise)
            (lazy delay-force))
    promise?)
  (import
    (rnrs)
    (srfi :45 lazy))

;; Uses the fact that chez-srfi promises are based on records.
(define (promise? x)
  (and (record? x)
       (eq? (record-rtd x)
            (record-rtd (eager #f))))))
