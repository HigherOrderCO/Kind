#!r6rs
(library (srfi :34 exception-handling)
  (export with-exception-handler guard raise)
  (import (except (rnrs) with-exception-handler guard raise error) (srfi :23))

  ;; reference implementation from srfi :34 documentation (though it closely matches the existing rnrs facility)

  ;; Copyright (C) Richard Kelsey, Michael Sperber (2002). All Rights Reserved.
  ;;
  ;; Permission is hereby granted, free of charge, to any person obtaining a
  ;; copy of this software and associated documentation files (the "Software"),
  ;; to deal in the Software without restriction, including without limitation
  ;; the rights to use, copy, modify, merge, publish, distribute, sublicense,
  ;; and/or sell copies of the Software, and to permit persons to whom the
  ;; Software is furnished to do so, subject to the following conditions:
  ;; 
  ;; The above copyright notice and this permission notice shall be included in
  ;; all copies or substantial portions of the Software.
  ;;
  ;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  ;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  ;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
  ;; THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  ;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  ;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  ;; DEALINGS IN THE SOFTWARE.  

  (define *current-exception-handlers*
    (list (lambda (condition)
            (error "unhandled exception" condition))))

  (define (with-exception-handler handler thunk)
    (with-exception-handlers (cons handler *current-exception-handlers*)
                             thunk))

  (define (with-exception-handlers new-handlers thunk)
    (let ((previous-handlers *current-exception-handlers*))
      (dynamic-wind
        (lambda ()
          (set! *current-exception-handlers* new-handlers))
        thunk
        (lambda ()
          (set! *current-exception-handlers* previous-handlers)))))

  (define (raise obj)
    (let ((handlers *current-exception-handlers*))
      (with-exception-handlers (cdr handlers)
        (lambda ()
          ((car handlers) obj)
          (error "handler returned"
                 (car handlers)
                 obj)))))

  (define-syntax guard
    (syntax-rules ()
      ((guard (var clause ...) e1 e2 ...)
       ((call-with-current-continuation
          (lambda (guard-k)
            (with-exception-handler
              (lambda (condition)
                ((call-with-current-continuation
                   (lambda (handler-k)
                     (guard-k
                       (lambda ()
                         (let ((var condition))      ; clauses may SET! var
                           (guard-aux (handler-k (lambda ()
                                                   (raise condition)))
                                      clause ...))))))))
              (lambda ()
                (call-with-values
                  (lambda () e1 e2 ...)
                  (lambda args
                    (guard-k (lambda ()
                               (apply values args)))))))))))))

  (define-syntax guard-aux
    (syntax-rules (else =>)
      ((guard-aux reraise (else result1 result2 ...))
       (begin result1 result2 ...))
      ((guard-aux reraise (test => result))
       (let ((temp test))
         (if temp 
             (result temp)
             reraise)))
      ((guard-aux reraise (test => result) clause1 clause2 ...)
       (let ((temp test))
         (if temp
             (result temp)
             (guard-aux reraise clause1 clause2 ...))))
      ((guard-aux reraise (test))
       test)
      ((guard-aux reraise (test) clause1 clause2 ...)
       (let ((temp test))
         (if temp
             temp
             (guard-aux reraise clause1 clause2 ...))))
      ((guard-aux reraise (test result1 result2 ...))
       (if test
           (begin result1 result2 ...)
           reraise))
      ((guard-aux reraise (test result1 result2 ...) clause1 clause2 ...)
       (if test
           (begin result1 result2 ...)
           (guard-aux reraise clause1 clause2 ...))))))
