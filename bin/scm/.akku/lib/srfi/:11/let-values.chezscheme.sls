#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :11 let-values)
  (export 
    let-values
    let*-values)
  (import 
    (only (rnrs) let-values let*-values))  
)
