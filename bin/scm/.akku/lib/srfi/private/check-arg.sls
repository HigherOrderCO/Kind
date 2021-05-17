#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

;; If your Scheme system doesn't have a stack-tracing debugger, you can change
;; this to use the version which actually does check.

(library (srfi private check-arg)
  (export
    check-arg)
  (import
    (rnrs))

#;(define (check-arg pred val who)
    (if (pred val)
      val
      (assertion-violation #F "check-arg failed" who pred val)))

  (define-syntax check-arg
    (syntax-rules ()
      ((_ pred val who)
       val)))
)
