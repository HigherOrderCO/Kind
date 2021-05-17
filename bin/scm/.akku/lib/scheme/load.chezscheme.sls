;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme load)
  (export
    load)
  (import
    (rnrs)
    (only (akku-r7rs compat) interaction-environment eval)
    (laesare reader))

(define load
  (case-lambda
    ((fn)
     (load fn (interaction-environment)))
    ((fn env)
     (call-with-input-file fn
       (lambda (p)
         (let ((reader (make-reader p fn)))
           (reader-mode-set! reader 'r7rs)
           (let lp ()
             (let ((x (read-datum reader)))
               (unless (eof-object? x)
                 (eval x env)
                 (lp)))))))))))
