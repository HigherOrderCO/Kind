#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :98 os-environment-variables)
  (export
    (rename (getenv get-environment-variable)
            (environ get-environment-variables)))
  (import
    (only (ikarus) getenv environ)))
