#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private include compat)
  (export
    search-paths)
  (import
    (rnrs base)
    (primitives current-require-path getenv absolute-path-string?))
  
  (define (search-paths)
    (let ((larceny-root (getenv "LARCENY_ROOT")))
      (map (lambda (crp)
             (if (absolute-path-string? crp)
               crp
               (string-append larceny-root "/" crp)))
           (current-require-path))))

)
