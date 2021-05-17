#!r6rs
;;;; Utilities used by HAMT

;;; Copyright MMIV-MMXVII Arthur A. Gleckler.  All rights reserved.

;; Permission is hereby granted, free of charge, to any person
;; obtaining a copy of this software and associated documentation
;; files (the "Software"), to deal in the Software without
;; restriction, including without limitation the rights to use, copy,
;; modify, merge, publish, distribute, sublicense, and/or sell copies
;; of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be
;; included in all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;; NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
;; HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
;; WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
;; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
;; DEALINGS IN THE SOFTWARE.
(library (srfi :146 gleckler hamt-misc)
  (export assert do-list
	  make-string-hash-table
	  with-output-to-string)
  (import (except (rnrs) string-hash assert)
          (srfi :6)
          (srfi :39)
          (only (srfi :43) vector-copy!)
          (only (srfi :69) string-hash)
	  (only (srfi :125) make-hash-table)
	  (only (srfi :128) make-comparator))

  (define-syntax assert
    (syntax-rules ()
      ((_ (operator argument ...))
       (unless (operator argument ...)
         (error "Assertion failed:"
	        '(operator argument ...)
	        (list 'operator argument ...))))
      ((_ expression)
       (unless expression
         (error "Assertion failed:" 'expression)))))

  (define-syntax do-list
    (syntax-rules ()
      ((_ (variable list) body ...)
       (do ((remaining list (cdr remaining)))
	   ((null? remaining))
         (let ((variable (car remaining)))
	   body ...)))
      ((_ (element-variable index-variable list) body ...)
       (do ((remaining list (cdr remaining))
	    (index-variable 0 (+ index-variable 1)))
	   ((null? remaining))
         (let ((element-variable (car remaining)))
	   body ...)))))

  (define string-comparator
    (make-comparator string? string=? #f string-hash))

  (define (make-string-hash-table)
    (make-hash-table string-comparator))

  (define (with-output-to-string thunk)
    (parameterize ((current-output-port (open-output-string)))
      (thunk)
      (get-output-string (current-output-port)))))
