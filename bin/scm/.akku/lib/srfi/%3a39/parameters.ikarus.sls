#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :39 parameters)
  (export 
    make-parameter 
    parameterize)
  (import 
    (only (ikarus) make-parameter parameterize))
)
