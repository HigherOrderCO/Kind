#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :42 eager-comprehensions)
  (export
    do-ec list-ec append-ec string-ec string-append-ec vector-ec
    vector-of-length-ec sum-ec product-ec min-ec max-ec any?-ec
    every?-ec first-ec last-ec fold-ec fold3-ec
    : :list :string :vector :integers :range :real-range :char-range
    :port :dispatched :do :let :parallel :while :until
    :-dispatch-ref :-dispatch-set! make-initial-:-dispatch
    dispatch-union :generator-proc)
  (import
    (except (rnrs) error)
    (rnrs r5rs)
    (srfi :39 parameters)
    (srfi :23 error)
    (for (srfi private vanish) expand)
    (srfi private include))

  (define-syntax :-dispatch
    (identifier-syntax
      (_ (:-dispatch-param))
      ((set! _ expr) (:-dispatch-param expr))))

  (let-syntax ((define (vanish-define define (:-dispatch))))
    (include/resolve ("srfi" "%3a42") "ec.scm"))

  (define :-dispatch-param (make-parameter (make-initial-:-dispatch)))
)
