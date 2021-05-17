#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :19 time not-implemented)
  (export
    cumulative-thread-time
    cumulative-process-time
    cumulative-gc-time)
  (import
    (rnrs base))

  (define (NI who)
    (lambda _ (assertion-violation who "not implemented")))

  (define-syntax not-implemented
    (syntax-rules ()
      ((_ name ...)
       (begin
         (define name (NI 'name))
         ...))))

  (not-implemented
   cumulative-thread-time
   cumulative-process-time
   cumulative-gc-time)
)
