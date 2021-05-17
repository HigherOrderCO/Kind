#!r6rs
;;; LET-OPTIONALS macros
;;; Copyright (c) 2001 by Olin Shivers.

;;; Copyright (c) 1993-2003 Richard Kelsey and Jonathan Rees
;;; Copyright (c) 1994-2003 by Olin Shivers and Brian D. Carlstrom.
;;; Copyright (c) 1999-2003 by Martin Gasbichler.
;;; Copyright (c) 2001-2003 by Michael Sperber.
;;;
;;; All rights reserved.
;;;
;;; Redistribution and use in source and binary forms, with or without
;;; modification, are permitted provided that the following conditions
;;; are met:
;;; 1. Redistributions of source code must retain the above copyright
;;;    notice, this list of conditions and the following disclaimer.
;;; 2. Redistributions in binary form must reproduce the above copyright
;;;    notice, this list of conditions and the following disclaimer in the
;;;    documentation and/or other materials provided with the distribution.
;;; 3. The name of the authors may not be used to endorse or promote products
;;;    derived from this software without specific prior written permission.
;;;
;;; THIS SOFTWARE IS PROVIDED BY THE AUTHORS ``AS IS'' AND ANY EXPRESS OR
;;; IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
;;; OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
;;; IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY DIRECT, INDIRECT,
;;; INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
;;; NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
;;; DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
;;; THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
;;; (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
;;; THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

;;; Made into an R6RS library by Derick Eddington.

(library (srfi private let-opt)
  (export
    let-optionals* :optional)
  (import
    (rename (except (rnrs) error) (assertion-violation error)))

;;; (:optional rest-arg default-exp [test-pred])
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; This form is for evaluating optional arguments and their defaults
;;; in simple procedures that take a *single* optional argument. It is
;;; a macro so that the default will not be computed unless it is needed.
;;; 
;;; REST-ARG is a rest list from a lambda -- e.g., R in
;;;     (lambda (a b . r) ...)
;;; - If REST-ARG has 0 elements, evaluate DEFAULT-EXP and return that.
;;; - If REST-ARG has 1 element, return that element.
;;; - If REST-ARG has >1 element, error.
;;;
;;; If there is an TEST-PRED form, it is a predicate that is used to test
;;; a non-default value. If the predicate returns false, an error is raised.

(define-syntax :optional
  (syntax-rules ()
    ([_ rest default-exp]
     (let ((maybe-arg rest))
       (if (pair? maybe-arg)
	   (if (null? (cdr maybe-arg)) (car maybe-arg)
	       (error ':optional "too many optional arguments" maybe-arg))
	   default-exp)))
    ([_ rest default-exp arg-test]
     (let ((maybe-arg rest))
       (if (pair? maybe-arg)
	   (if (null? (cdr maybe-arg))
	       (let ((val (car maybe-arg)))
		 (if (arg-test val) val
		     (error ':optional "optional argument failed test" val)))
	       (error ':optional "too many optional arguments" maybe-arg))
	   default-exp)))))
 ; erutcurts-enifed

;;; Here is a simpler but less-efficient version of LET-OPTIONALS*.
;;; It redundantly performs end-of-list checks for every optional var,
;;; even after the list runs out.
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-syntax let-optionals*
  (syntax-rules ()
    ((let-optionals* arg (opt-clause ...) body ...)
     (let ((rest arg))
       (%let-optionals* rest (opt-clause ...) body ...)))))

;;; The arg-list expression *must* be a variable.
;;; (Or must be side-effect-free, in any event.)

(define-syntax %let-optionals*
  (syntax-rules ()
    ((%let-optionals* arg (((var ...) xparser) opt-clause ...) body ...)
     (call-with-values (lambda () (xparser arg))
       (lambda (rest var ...)
         (%let-optionals* rest (opt-clause ...) body ...))))
    
    ((%let-optionals* arg ((var default) opt-clause ...) body ...)
     (call-with-values (lambda () (if (null? arg) (values default '())
				      (values (car arg) (cdr arg))))
       (lambda (var rest)
	 (%let-optionals* rest (opt-clause ...) body ...))))

    ((%let-optionals* arg ((var default test) opt-clause ...) body ...)
     (call-with-values (lambda ()
			 (if (null? arg) (values default '())
			     (let ((var (car arg)))
			       (if test (values var (cdr arg))
				   (error 'let-optionals* "arg failed LET-OPT test" var)))))
       (lambda (var rest)
	 (%let-optionals* rest (opt-clause ...) body ...))))

    ((%let-optionals* arg ((var default test supplied?) opt-clause ...) body ...)
     (call-with-values (lambda ()
			 (if (null? arg) (values default #f '())
			     (let ((var (car arg)))
			       (if test (values var #t (cdr arg))
				   (error 'let-optionals* "arg failed LET-OPT test" var)))))
       (lambda (var supplied? rest)
	 (%let-optionals* rest (opt-clause ...) body ...))))

    ((%let-optionals* arg (rest) body ...)
     (let ((rest arg)) body ...))

    ((%let-optionals* arg () body ...)
     (if (null? arg) (begin body ...)
	 (error 'let-optionals* "too many arguments in let-opt" arg)))))
; erutcurts-enifed

)
