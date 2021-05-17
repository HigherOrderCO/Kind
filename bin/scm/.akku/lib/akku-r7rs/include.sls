;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (akku-r7rs include)
  (export
    include-helper)
  (import
    (rnrs)
    (srfi private include compat)
    (akku metadata)
    (laesare reader))

;; Include, with inspiration from chez-srfi and chez.

(define (include-helper who ctxt foldcase? fn*)
  (define (read-file filename)
    (call-with-input-file filename
      (lambda (p)
        (let ((reader (make-reader p filename)))
          (reader-fold-case?-set! reader foldcase?)
          (let lp ()
            (let ((x (read-datum reader)))
              (if (eof-object? x)
                  '()
                  (cons (datum->syntax ctxt x) (lp)))))))))
  (define (read-include filename)
    (let lp ((dir* (search-paths)))
      (if (null? dir*)
          (error 'include "File not found" filename (search-paths))
          (let ((fn (string-append (car dir*) "/" filename)))
            (if (file-exists? fn)
                (read-file fn)
                (lp (cdr dir*)))))))
  (cond ((assoc (cons who fn*) installed-assets)
         => (lambda (asset)    ;(original-include filenames . _)
              (let ((filenames (cadr asset)))
                #`(begin #,@(apply append (map read-include filenames))))))
        (else
         (syntax-violation who "The include is missing from (akku metadata)"
                           fn*)))))
