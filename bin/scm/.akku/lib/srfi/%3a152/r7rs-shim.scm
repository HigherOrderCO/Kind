(define (string-fill! s char . maybe-start+end)
  (check-arg char? char string-fill!)
  (let-string-start+end (start end) string-fill! s maybe-start+end
    (do ((i (- end 1) (- i 1)))
	((< i start))
      (string-set! s i char))))

(define (string-copy! to tstart from . maybe-fstart+fend)
  (let-string-start+end (fstart fend) string-copy! from maybe-fstart+fend
    (check-arg integer? tstart string-copy!)
    (check-substring-spec string-copy! to tstart (+ tstart (- fend fstart)))
    (%string-copy! to tstart from fstart fend)))

;;; Library-internal routine
#;(define (%string-copy! to tstart from fstart fend)
  (if (> fstart tstart)
      (do ((i fstart (+ i 1))
	   (j tstart (+ j 1)))
	  ((>= i fend))
	(string-set! to j (string-ref from i)))

      (do ((i (- fend 1)                    (- i 1))
	   (j (+ -1 tstart (- fend fstart)) (- j 1)))
	  ((< i fstart))
	(string-set! to j (string-ref from i)))))

(define (string->list s . maybe-start+end)
  (let-string-start+end (start end) string->list s maybe-start+end
    (do ((i (- end 1) (- i 1))
	 (ans '() (cons (string-ref s i) ans)))
	((< i start) ans))))

(define (string->vector s . maybe-start+end)
  (let-string-start+end (start end) string->vector s maybe-start+end
    (let ((vector (make-vector (- end start))))
      (do ((i (- end 1) (- i 1)))
          ((< i start) vector)
        (vector-set! vector (- i start) (string-ref s i))))))

(define (vector->string vector . maybe-start+end)
  (let ((start 0) (end (vector-length vector)))
    (case (length maybe-start+end)
      ((1) (set! start (car maybe-start+end)))
      ((2) (set! end (cadr maybe-start+end))))
    (let ((s (make-string (- end start))))
      (do ((i (- end 1) (- i 1)))
          ((< i start) s)
        (string-set! s (- i start) (vector-ref vector i))))))

(define (string-map f x . rest)

  (define (string-map1 f x)
    (list->string (map f (string->list x))))

  (define (string-map2 f x y)
    (list->string (map f (string->list x) (string->list y))))

  (define (string-mapn f lists)
    (list->string (apply map f (map string->list lists))))

  (case (length rest)
    ((0)  (string-map1 f x))
    ((1)  (string-map2 f x (car rest)))
    (else (string-mapn f (cons x rest)))))

(define (string-for-each f s . rest)

  (define (for-each1 i n)
    (if (< i n)
	(begin (f (string-ref s i))
	       (for-each1 (+ i 1) n))
	(if #f #f)))

  (define (for-each2 s2 i n)
    (if (< i n)
	(begin (f (string-ref s i) (string-ref s2 i))
	       (for-each2 s2 (+ i 1) n))
	(if #f #f)))

  (define (for-each-n revstrings i n)
    (if (< i n)
        (do ((rev revstrings (cdr rev))
             (chars '() (cons (string-ref (car rev) i) chars)))
            ((null? rev)
             (apply f chars)
             (for-each-n revstrings (+ i 1) n)))
	(if #f #f)))

  (let ((n (string-length s)))
    (cond ((null? rest)
           (for-each1 0 n))
          ((and (null? (cdr rest))
                (string? (car rest))
                (= n (string-length (car rest))))
           (for-each2 (car rest) 0 n))
          (else
           (let ((args (cons s rest)))
             (do ((ss rest (cdr ss)))
                 ((null? ss)
                  (for-each-n (reverse args) 0 n))
               (let ((x (car ss)))
                 (if (or (not (string? x))
                         (not (= n (string-length x))))
                     (error
                                          "illegal-arguments"
                                          (cons f args))))))))))

(define (string-copy s . maybe-start+end)
  (let-string-start+end (start end) string-copy! s maybe-start+end
    (%substring s start end)))

(cond-expand
  (chicken
    #;imported)
  (else
    (define read-string
      (case-lambda
        ((k) (read-string k (current-input-port)))
        ((k port)
          (let loop ((i 0) (o '()))
            (if (>= i k)
              (list->string (reverse o))
              (let ((c (read-char port)))
                (if (eof-object? c)
                  (if (= i 0)
                    c
                    (list->string (reverse o)))
                  (loop (+ i 1) (cons c o)))))))))))

;; Chicken's write-string is incompatible with R7RS
(define write-string
  (case-lambda
    ((str) (display str))
    ((str port) (display str port))
    ((str port start) (write-string str port start (string-length str)))
    ((str port start end) (display (%substring str start end) port))))

#;(define (eof-object)
  (let ((port (open-input-string "")))
    (dynamic-wind
      (lambda () #f)
      (lambda () (read-char port))
      (lambda () close-input-port port))))
