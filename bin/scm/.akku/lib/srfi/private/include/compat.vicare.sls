#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private include compat)
  (export
    (rename (library-source-search-path search-paths)))
  (import
    (only (vicare libraries) library-source-search-path)))
