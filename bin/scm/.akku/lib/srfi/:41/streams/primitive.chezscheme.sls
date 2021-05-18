#!r6rs 
;;; Copyright (C) Philip L. Bewig (2007). All Rights Reserved.
;;; Permission is hereby granted, free of charge, to any person
;;; obtaining a copy of this software and associated documentation files
;;; (the "Software"), to deal in the Software without restriction,
;;; including without limitation the rights to use, copy, modify, merge,
;;; publish, distribute, sublicense, and/or sell copies of the Software,
;;; and to permit persons to whom the Software is furnished to do so,
;;; subject to the following conditions:
;;; 
;;; The above copyright notice and this permission notice shall be
;;; included in all copies or substantial portions of the Software.
;;; 
;;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;;; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
;;; BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
;;; ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
;;; CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;;; SOFTWARE.

(library (srfi :41 streams primitive)

  (export stream-null stream-cons stream? stream-null? stream-pair?
          stream-car stream-cdr stream-lambda)

  (import (rnrs) (rnrs mutable-pairs))

  (define-record-type (stream-type make-stream stream?)
    (fields (mutable box stream-promise stream-promise!)))

  (define-syntax stream-lazy
    (syntax-rules ()
      ((lazy expr)
        (make-stream
          (cons 'lazy (lambda () expr))))))

  (define (stream-eager expr)
    (make-stream
      (cons 'eager expr)))

  (define-syntax stream-delay
    (syntax-rules ()
      ((stream-delay expr)
        (stream-lazy (stream-eager expr)))))

  (define (stream-force promise)
    (let ((content (stream-promise promise)))
      (case (car content)
        ((eager) (cdr content))
        ((lazy)  (let* ((promise* ((cdr content)))
                        (content  (stream-promise promise)))
                   (if (not (eqv? (car content) 'eager))
                       (begin (set-car! content (car (stream-promise promise*)))
                              (set-cdr! content (cdr (stream-promise promise*)))
                              (stream-promise! promise* content)))
                   (stream-force promise))))))

  (define stream-null (stream-delay (cons 'stream 'null)))

  (define-record-type (stream-pare-type make-stream-pare stream-pare?)
    (fields (immutable kar stream-kar) (immutable kdr stream-kdr)))

  (define (stream-pair? obj)
    (and (stream? obj) (stream-pare? (stream-force obj))))

  (define (stream-null? obj)
    (and (stream? obj)
         (eqv? (stream-force obj)
               (stream-force stream-null))))

  (define-syntax stream-cons
    (syntax-rules ()
      ((stream-cons obj strm)
        (stream-delay (make-stream-pare (stream-delay obj) (stream-lazy strm))))))

  (define (stream-car strm)
    (cond ((not (stream? strm)) (error 'stream-car "non-stream"))
          ((stream-null? strm) (error 'stream-car "null stream"))
          (else (stream-force (stream-kar (stream-force strm))))))

  (define (stream-cdr strm)
    (cond ((not (stream? strm)) (error 'stream-cdr "non-stream"))
          ((stream-null? strm) (error 'stream-cdr "null stream"))
          (else (stream-kdr (stream-force strm)))))

  (define-syntax stream-lambda
    (syntax-rules ()
      ((stream-lambda formals body0 body1 ...)
        (lambda formals (stream-lazy (let () body0 body1 ...)))))))
