#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private include compat)
  (export
    (rename (scheme-library-paths search-paths)))
  (import
    (only (core) scheme-library-paths))
)
