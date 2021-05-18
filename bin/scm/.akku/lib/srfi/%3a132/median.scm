;;;; Finding the median of a vector
;; This involves sorting the vector, which is why it's part
;; of this package.

(define (vector-find-median < v knil . maybe-mean)
  (define mean (if (null? maybe-mean)
                   (lambda (a b) (/ (+ a b) 2))
                   (car maybe-mean)))
  (define len (vector-length v))
  (define newv (vector-sort < v))
  (cond
    ((= len 0) knil)
    ((odd? len) (vector-ref newv (/ (- len 1) 2)))
    (else (mean
            (vector-ref newv (- (/ len 2) 1))
            (vector-ref newv (/ len 2))))))

(define (vector-find-median! < v knil . maybe-mean)
  (define mean (if (null? maybe-mean)
                   (lambda (a b) (/ (+ a b) 2))
                   (car maybe-mean)))
  (define len (vector-length v))
  (define newv (vector-sort! < v))
  (cond
    ((= len 0) knil)
    ((odd? len) (vector-ref newv (/ (- len 1) 2)))
    (else (mean
            (vector-ref newv (- (/ len 2) 1))
            (vector-ref newv (/ len 2))))))

