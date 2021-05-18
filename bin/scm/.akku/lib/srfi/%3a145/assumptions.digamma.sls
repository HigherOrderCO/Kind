#!r6rs
;; SRFI-145 r6rs implemntation
;;
;; Copyright (C) Marc Nieper-Wißkirchen (2016). All Rights Reserved.
;;
;; Slight modifications by Andy Keep.  This uses the SRFI-0 cond-expand and
;; SRFI-23 error in place of the R7RS versions from the SRFI sample
;; implementation.

(library (srfi :145 assumptions)
  (export assume)
  (import (except (rnrs) error) (srfi :0) (srfi :23))

  (define-syntax assume
    (syntax-rules ()
      [(_ expression message ...)
       (cond-expand
         [debug
          (unless expression
            (error "invalid assumption" 'expression message ...))]
         [else (if #f #f)])])))

