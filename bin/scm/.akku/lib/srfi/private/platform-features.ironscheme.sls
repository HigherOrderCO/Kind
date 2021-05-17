#!r6rs
;; Copyright (c) 2009 Derick Eddington.  All rights reserved.  Licensed under an
;; MIT-style license.  My license is in the file named LICENSE from the original
;; collection this file is distributed with.  If this file is redistributed with
;; some other collection, my license must also be included.

(library (srfi private platform-features)
  (export
    expand-time-features
    run-time-features)
  (import
    (rnrs)
    (srfi private OS-id-features))
  
  (define (run-time-features)
    (OS-id-features
     "windows" ;; fixme!
     '(("windows" windows))))
  
  (define (expand-time-features)
    '(ironscheme))
)
