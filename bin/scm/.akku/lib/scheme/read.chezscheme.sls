#!r6rs
;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0

(library (scheme read)
  (export
    read)
  (import
    (except (rnrs) read)
    (laesare reader))

(define read
  (case-lambda
    (() (read (current-input-port)))
    ((port)
     (let ((reader (make-reader port #f)))
       (reader-mode-set! reader 'r7rs)
       (read-datum reader))))))
