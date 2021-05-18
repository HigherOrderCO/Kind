;; Copyright © 2020 Göran Weinholt
;; SPDX-License-Identifier: MIT
#!r6rs

;; SRFI 5: let form with define-style syntax and rest arguments

(library (srfi :5 let)
  (export let)
  (import (rename (rnrs) (let rnrs:let)))

(define-syntax let
  (lambda (x)
    (define (let-args x)
      (syntax-case x ()
        ;; Push lhs and rhs to the end of lhs* and rhs*, respectively
        [(_ ((lhs rhs) . x*) (lhs* ...) (rhs* ...))
         (identifier? #'lhs)
         (let-args #'(_ x* (lhs* ... lhs) (rhs* ... rhs)))]
        ;; Finally handle the rest arguments, if any
        [(_ (rest arg* ...) (lhs* ...) (rhs* ...))
         (identifier? #'rest)
         #'((lhs* ... . rest) (rhs* ... arg* ...))]
        [(_ () lhs* rhs*) #'(lhs* rhs*)]))
    (syntax-case x ()
      ;; Named let
      [(_ name bindings body ...)
       (identifier? #'name)
       (with-syntax ([(lhs* rhs*) (let-args #'(let-args bindings () ()))])
         #'((letrec ((name (lambda lhs* body ...))) name)
            . rhs*))]
      ;; Define-style named let
      [(_ (name . bindings) body ...)
       (identifier? #'name)
       #'(let name bindings body ...)]
      ;; Let, possibly with rest arguments
      [(_ bindings body ...)
       (with-syntax ([(lhs* rhs*) (let-args #'(let-args bindings () ()))])
         #'((lambda lhs* body ...) . rhs*))]))))
