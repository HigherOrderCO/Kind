#!r6rs
;; SRFI-145 chez scheme implmentation
;;
;; Uses Chez Scheme's meta-cond to suppress generating the assumption code when
;; compilled at optimize-level 3.  Otherwise it uses the Chez Scheme errorf
;; procedure to raise a nicely formatted exception when the assumption fails.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :145 assumptions)
  (export assume)
  (import (chezscheme))

  (define-syntax assume
    (syntax-rules ()
      [(_ expression messages ...)
       (meta-cond
         [(fx=? (optimize-level) 3) (void)]
         [else (unless expression
                 (let ([msgs (list messages ...)])
                   (errorf #f "invalid assumption ~s~@[ with message~p ~{~a~#[~;, and ~:;, ~]~}~]"
                           'expression (and (not (null? msgs)) (length msgs)) msgs)))])])))
