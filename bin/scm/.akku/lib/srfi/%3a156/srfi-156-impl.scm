;; Reference Implementation from SRFI 156
;;
;; Copyright (C) Panicz Maciej Godek (2017). All Rights Reserved.
;;
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to
;; deal in the Software without restriction, including without limitation the
;; rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
;; sell copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;;
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;;
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
;; IN THE SOFTWARE.
;;
;; 12/31/2017 - AWK - shimmed extract-placehoders to allow for _ in R6RS scheme

(define-syntax infix/postfix
  (syntax-rules ()
    ((infix/postfix x somewhat?)
     (somewhat? x))

    ((infix/postfix left related-to? right)
     (related-to? left right))

    ((infix/postfix left related-to? right . likewise)
     (let ((right* right))
       (and (infix/postfix left related-to? right*)
            (infix/postfix right* . likewise))))))

(define-syntax extract-placeholders
  (lambda (x)
    (syntax-case x ()
      [(_ final () () body) #'(final (infix/postfix . body))]
      [(_ final () args body) #'(lambda args (final (infix/postfix . body)))]
      [(k final (underscore op . rest) (args ...) (body ...))
       (eq? (syntax->datum #'underscore) '_)
       #'(k final rest (args ... arg) (body ... arg op))]
      [(k final (arg op . rest) args (body ...))
       #'(k final rest args (body ... arg op))]
      [(k final (underscore) (args ...) (body ...))
       (eq? (syntax->datum #'underscore) '_)
       #'(k final () (args ... arg) (body ... arg))]
      [(k final (arg) args (body ...))
       #'(k final () args (body ... arg))])))

#;(define-syntax extract-placeholders
  (syntax-rules (_)
    ((extract-placeholders final () () body)
     (final (infix/postfix . body)))

    ((extract-placeholders final () args body)
     (lambda args (final (infix/postfix . body))))

    ((extract-placeholders final (_ op . rest) (args ...) (body ...))
     (extract-placeholders final rest (args ... arg) (body ... arg op)))

    ((extract-placeholders final (arg op . rest) args (body ...))
     (extract-placeholders final rest args (body ... arg op)))

    ((extract-placeholders final (_) (args ...) (body ...))
     (extract-placeholders final () (args ... arg) (body ... arg)))

    ((extract-placeholders final (arg) args (body ...))
     (extract-placeholders final () args (body ... arg)))))

(define-syntax identity-syntax
  (syntax-rules ()
    ((identity-syntax form)
     form)))

(define-syntax is
  (syntax-rules ()
    ((is . something)
     (extract-placeholders identity-syntax something () ()))))

(define-syntax isnt
  (syntax-rules ()
    ((isnt . something)
     (extract-placeholders not something () ()))))
