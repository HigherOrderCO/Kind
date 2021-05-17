#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private vanish)
  (export
    vanish-define)
  (import
    (rnrs)
    (for (only (rnrs base) begin) (meta -1)))

  (define-syntax vanish-define
    (lambda (stx)
      (syntax-case stx ()
        ((_ def (vanish ...))
         (for-all identifier? #'(def vanish ...))
         #'(make-vanish-define (syntax def) (syntax vanish) ...)))))

  (define (make-vanish-define def . to-vanish)
    (lambda (stx)
      (define (vanish? id)
        (memp (lambda (x) (free-identifier=? id x))
              to-vanish))
      (syntax-case stx ()
        ((_ name . _)
         (and (identifier? #'name)
              (vanish? #'name))
         #'(begin))
        ((_ (name . _) . _)
         (and (identifier? #'name)
              (vanish? #'name))
         #'(begin))
        ((_ . r)
         (cons def #'r)))))
)
