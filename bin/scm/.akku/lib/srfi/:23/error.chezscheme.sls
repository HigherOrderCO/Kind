#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :23 error)
  (export
    error)
  (import 
    (rename (rnrs base) (error rnrs:error)))
    
  (define (error . args)
    (apply rnrs:error #F args))
)
