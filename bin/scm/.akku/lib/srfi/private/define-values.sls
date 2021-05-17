#!r6rs
(library (srfi private define-values)
  (export define-values)
  (import (rnrs) (srfi private helpers))

  (define-syntax define-values
    (lambda (x)
      (syntax-case x ()
        [(_ (fmls ...) expr)
         (with-syntax ([(i ...) (enumerate  #'(fmls ...))]
                       [(t ...) (generate-temporaries #'(fmls ...))])
           #'(begin
               (define tmp
                 (let-values ([(t ...) expr])
                   (vector t ...)))
               (define fmls (vector-ref tmp i)) ...))]
        [(_ (fmls ... . rest-fml) expr)
         (with-syntax ([(t ...) (generate-temporaries #'(fmls ...))]
                       [(rest-t) (generate-temporaries #'(rest-fml))]
                       [(all-fmls ...) #'(rest-fml fmls ...)]
                       [(i ...) (enumerate #'(rest-fml fmls ...))])
           #'(begin
               (define tmp
                 (let-values ([(t ... . rest-t) expr])
                   (vector rest-t t ...)))
               (define all-fmls (vector-ref tmp i)) ...))]))))
