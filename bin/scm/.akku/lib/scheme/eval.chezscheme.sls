;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme eval)
  (export environment eval)
  (import
    (rnrs)
    (only (akku-r7rs compat) eval)
    (prefix (rnrs eval) r6:))

(define (environment . lib*)
  (apply r6:environment
         (map (lambda (lib)
                (map (lambda (id)
                       (if (integer? id)
                           (string->symbol (string-append ":" (number->string id)))
                           id))
                     lib))
              lib*))))
