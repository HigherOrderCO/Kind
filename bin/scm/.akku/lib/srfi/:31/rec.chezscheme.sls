#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :31 rec)
  (export rec)
  (import (rnrs))
  
  ;; Taken directly from the SRFI-31
  (define-syntax rec
    (syntax-rules ()
      ((rec (NAME . VARIABLES) . BODY)
       (letrec ( (NAME (lambda VARIABLES . BODY)) ) NAME))
      ((rec NAME EXPRESSION)
       (letrec ( (NAME EXPRESSION) ) NAME))))  
  
)
