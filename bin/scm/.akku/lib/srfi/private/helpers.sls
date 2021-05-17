#!r6rs
(library (srfi private helpers)
  (export enumerate)
  (import (rnrs))
  
  (define enumerate
    (lambda (ls)
      (let f ([ls ls] [i 0])
        (if (null? ls)
            '()
            (cons i (f (cdr ls) (fx+ i 1))))))))
