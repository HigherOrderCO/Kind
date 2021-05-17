;; Modified by Derick Eddington to improve the print-outs.  All lines of printed
;; expected results (for failed checks) are commented-out so they don't break
;; syntactic-datum delimiting, so a print-out can be programmatically read and
;; processed.  When a non-default equality predicate is used, (=> <expr>) is
;; printed.

; <PLAINTEXT>
; Copyright (c) 2005-2006 Sebastian Egner.
; 
; Permission is hereby granted, free of charge, to any person obtaining
; a copy of this software and associated documentation files (the
; ``Software''), to deal in the Software without restriction, including
; without limitation the rights to use, copy, modify, merge, publish,
; distribute, sublicense, and/or sell copies of the Software, and to
; permit persons to whom the Software is furnished to do so, subject to
; the following conditions:
; 
; The above copyright notice and this permission notice shall be
; included in all copies or substantial portions of the Software.
; 
; THE SOFTWARE IS PROVIDED ``AS IS'', WITHOUT WARRANTY OF ANY KIND,
; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
; LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
; OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
; WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
; 
; -----------------------------------------------------------------------
; 
; Lightweight testing (reference implementation)
; ==============================================
;
; Sebastian.Egner@philips.com
; in R5RS + SRFI 23 (error) + SRFI 42 (comprehensions)
;
; history of this file:
;   SE, 25-Oct-2004: first version based on code used in SRFIs 42 and 67
;   SE, 19-Jan-2006: (arg ...) made optional in check-ec
;
; Naming convention "check:<identifier>" is used only internally.

; -- portability --

; PLT:      (require (lib "23.ss" "srfi") (lib "42.ss" "srfi"))
; Scheme48: ,open srfi-23 srfi-42 

; -- utilities --

(define check:write write)

(define (print/header/padded x header padding)
  (define (print/lines)
    (let* ((str (call-with-string-output-port
                  (lambda (sop) (check:write x sop))))
           (sip (open-string-input-port str)))
      (let loop ((lines '()))
        (let ((l (get-line sip)))
          (if (eof-object? l)
            (reverse lines)
            (loop (cons l lines)))))))
  (let ((lines (print/lines)))
    (display header)
    (display (car lines))
    (let loop ((lines (cdr lines)))
      (unless (null? lines)
        (newline)
        (display padding)
        (display (car lines))
        (loop (cdr lines))))))

; You can also use a pretty printer if you have one.
; However, the output might not improve for most cases
; because the pretty printers usually output a trailing
; newline.

; PLT:      (require (lib "pretty.ss")) (define check:write pretty-print)
; Scheme48: ,open pp (define check:write p)

; -- mode --

(define check:mode #f)

(define (check-set-mode! mode)
  (set! check:mode
        (case mode
          ((off)           0)
          ((summary)       1)
          ((report-failed) 10)
          ((report)        100)
          (else (error "unrecognized mode" mode)))))

; -- state --

(define check:correct #f)
(define check:failed   #f)

(define (check-reset!)
  (set! check:correct 0)
  (set! check:failed   '()))

(define (check:add-correct!)
  (set! check:correct (+ check:correct 1)))

(define (check:add-failed! expression actual-result expected-result pred)
  (set! check:failed
        (cons (list expression actual-result expected-result pred)
              check:failed)))

; -- reporting --

(define (check:report-expression expression pred)
  (newline)
  (check:write expression)
  (if pred
    (begin (print/header/padded pred "(=> " "    ")
           (display ")"))
    (display "=>"))
  (newline))

(define (check:report-actual-result actual-result)
  (check:write actual-result)
  (display ";; "))

(define (check:report-correct cases)
  (display "correct")
  (if (not (= cases 1))
      (begin (display " (")
             (display cases)
             (display " cases checked)")))
  (newline))

(define (check:report-failed expected-result)
  (display "*** failed ***")
  (newline)
  (print/header/padded expected-result ";; expected result: "
                                       ";;                  ")
  (newline))

(define (check-report)
  (if (>= check:mode 1)
      (begin
        (newline)
        (display ";; *** checks *** : ")
        (display check:correct)
        (display " correct, ")
        (display (length check:failed))
        (display " failed.")
        (if (or (null? check:failed) (<= check:mode 1))
            (newline)
            (let* ((w (car (reverse check:failed)))
                   (expression (car w))
                   (actual-result (cadr w))
                   (expected-result (caddr w))
                   (pred (cadddr w)))                  
              (display " First failed example:")
              (newline)
              (check:report-expression expression pred)
              (check:report-actual-result actual-result)
              (check:report-failed expected-result))))))

(define (check-passed? expected-total-count)
  (and (= (length check:failed) 0)
       (= check:correct expected-total-count)))
       
; -- simple checks --

(define (check:proc expression thunk equal equal-expr expected-result)
  (define equal-expr*
    (and (not (eq? equal? equal))
         equal-expr))
  (case check:mode
    ((0) #f)
    ((1)
     (let ((actual-result (thunk)))
       (if (equal actual-result expected-result)
           (check:add-correct!)
           (check:add-failed!
            expression actual-result expected-result equal-expr*))))
    ((10)
     (let ((actual-result (thunk)))
       (if (equal actual-result expected-result)
           (check:add-correct!)
           (begin
             (check:report-expression expression equal-expr*)
             (check:report-actual-result actual-result)
             (check:report-failed expected-result)
             (check:add-failed!
              expression actual-result expected-result equal-expr*)))))
    ((100)
     (check:report-expression expression equal-expr*)
     (let ((actual-result (thunk)))
       (check:report-actual-result actual-result)
       (if (equal actual-result expected-result)
           (begin (check:report-correct 1)
                  (check:add-correct!))
           (begin (check:report-failed expected-result)
                  (check:add-failed!
                   expression actual-result expected-result equal-expr*)))))
    (else (error "unrecognized check:mode" check:mode)))
  (if #f #f))

(define-syntax check
  (syntax-rules (=>)
    ((check expr => expected)
     (check expr (=> equal?) expected))
    ((check expr (=> equal) expected)
     (if (>= check:mode 1)
	 (check:proc 'expr (lambda () #F expr) equal 'equal expected)))))

; -- parametric checks --

(define (check:proc-ec w)
  (let ((correct? (car w))
        (expression (cadr w))
        (actual-result (caddr w))
        (expected-result (cadddr w))
	(cases (car (cddddr w)))
        (equal-expr (cadr (cddddr w))))
    (if correct?
        (begin (if (>= check:mode 100)
                   (begin (check:report-expression expression equal-expr)
                          (check:report-actual-result actual-result)
                          (check:report-correct cases)))
               (check:add-correct!))
        (begin (if (>= check:mode 10)
                   (begin (check:report-expression expression equal-expr)
                          (check:report-actual-result actual-result)
                          (check:report-failed expected-result)))
               (check:add-failed!
                expression actual-result expected-result equal-expr)))))

(define-syntax check-ec:make
  (syntax-rules (=>)
    ((check-ec:make qualifiers expr (=> equal) expected (arg ...))
     (if (>= check:mode 1)
         (check:proc-ec
	  (let* ((cases 0)
                 (eq-p equal)
                 (equal-expr (and (not (eq? equal? eq-p))
                                  'equal)))
	    (let ((w (first-ec 
		      #f
		      qualifiers
		      (:let equal-pred eq-p)
		      (:let expected-result expected)
		      (:let actual-result
                            (let ((arg arg) ...) ; (*)
                              expr))
		      (begin (set! cases (+ cases 1)))
		      (if (not (equal-pred actual-result expected-result)))
		      (list (list 'let (list (list 'arg arg) ...) 'expr)
			    actual-result
			    expected-result
			    cases
                            equal-expr))))
	      (if w
		  (cons #f w)
		  (list #t 
			'(check-ec qualifiers 
				   expr (=> equal) 
				   expected (arg ...))
			(if #f #f)
		        (if #f #f)
			cases
                        equal-expr)))))))))

; (*) is a compile-time check that (arg ...) is a list
; of pairwise disjoint bound variables at this point.

(define-syntax check-ec
  (syntax-rules (nested =>)
    ((check-ec expr => expected)
     (check-ec:make (nested) expr (=> equal?) expected ()))
    ((check-ec expr (=> equal) expected)
     (check-ec:make (nested) expr (=> equal) expected ()))
    ((check-ec expr => expected (arg ...))
     (check-ec:make (nested) expr (=> equal?) expected (arg ...)))
    ((check-ec expr (=> equal) expected (arg ...))
     (check-ec:make (nested) expr (=> equal) expected (arg ...)))

    ((check-ec qualifiers expr => expected)
     (check-ec:make qualifiers expr (=> equal?) expected ()))
    ((check-ec qualifiers expr (=> equal) expected)
     (check-ec:make qualifiers expr (=> equal) expected ()))
    ((check-ec qualifiers expr => expected (arg ...))
     (check-ec:make qualifiers expr (=> equal?) expected (arg ...)))
    ((check-ec qualifiers expr (=> equal) expected (arg ...))
     (check-ec:make qualifiers expr (=> equal) expected (arg ...)))

    ((check-ec (nested q1 ...) q etc ...)
     (check-ec (nested q1 ... q) etc ...))
    ((check-ec q1 q2             etc ...)
     (check-ec (nested q1 q2)    etc ...))))


(check-set-mode! 'report)
(check-reset!)
