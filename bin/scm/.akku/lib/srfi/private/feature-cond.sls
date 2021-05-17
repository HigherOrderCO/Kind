#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private feature-cond)
  (export
    feature-cond)
  (import
    (rnrs)
    (only (srfi private registry) available-features))

  (define-syntax feature-cond
    (lambda (stx)
      (define (identifier?/name=? x n)
        (and (identifier? x)
             (symbol=? n (syntax->datum x))))
      (define (make-test f)
        (define (invalid)
          (syntax-violation #F "invalid feature syntax" stx f))
        (syntax-case f ()
          ((c x ...)
           (identifier?/name=? (syntax c) (quote and))
           (cons (syntax and) (map make-test (syntax (x ...)))))
          ((c x ...)
           (identifier?/name=? (syntax c) (quote or))
           (cons (syntax or) (map make-test (syntax (x ...)))))
          ((c x ...)
           (identifier?/name=? (syntax c) (quote not))
           (if (= 1 (length (syntax (x ...))))
             (list (syntax not) (make-test (car (syntax (x ...)))))
             (invalid)))
          (datum
           (not (memq (syntax->datum (syntax datum))
                      (quote (and or not else))))
           (syntax (and (member (quote datum) available-features) #T)))
          (_ (invalid))))
      (syntax-case stx ()
        ((_ (feature . exprs) ... (e . eexprs))
         (identifier?/name=? (syntax e) (quote else))
         (with-syntax (((test ...) (map make-test (syntax (feature ...)))))
           (syntax (cond (test . exprs) ... (else . eexprs)))))
        ((kw (feature . exprs) ...)
         (syntax (kw (feature . exprs) ... (else (no-clause-true))))))))

  (define (no-clause-true)
    (assertion-violation (quote feature-cond) "no clause true"))
)
