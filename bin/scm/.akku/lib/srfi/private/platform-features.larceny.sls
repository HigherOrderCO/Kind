#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private platform-features)
  (export
    expand-time-features
    run-time-features)
  (import
    (rnrs base)
    (rnrs lists)
    (primitives system-features)
    (srfi private OS-id-features))

  (define (expand-time-features)
    '(larceny))

  (define (run-time-features)
    (OS-id-features
     (cdr (assq 'os-name (system-features)))
     '(("linux" linux posix)
       ("solaris" solaris posix)
       ("darwin" darwin posix)
       ("bsd" bsd)
       ("freebsd" freebsd posix)
       ("openbsd" openbsd posix)
       ("windows" windows))))
)
