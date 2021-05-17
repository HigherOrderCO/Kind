;; Helper returns #t if any element of list is null or #f if none
(define (any-null? list)
  (cond
    ((null? list) #f)
    ((null? (car list)) #t)
    (else (any-null? (cdr list)))))

;; gappend procedure cloned from SRFI 121
(define (gappend . args)
        (lambda () (if (null? args)
                       (eof-object)
                       (let loop ((v ((car args))))
                                 (if (eof-object? v)
                                     (begin (set! args (cdr args))
                                            (if (null? args)
                                                (eof-object)
                                                (loop ((car args)))))
                                     v)))))

;;; Convert a generator (procedure with no arguments) to an lseq
;;; This is the basic constructor for lseqs, since every proper list
;;; is already an lseq and so list->lseq is not needed
(define (generator->lseq gen)
  (let ((value (gen)))
    ;; See what starts off the generator:
    ;; if it's already exhausted, the lseq is empty,
    ;; otherwise, return an improper list with one value and the generator
    ;; in the tail, which is how we represent unrealized lseqs
    (if (eof-object? value)
       '()
       (cons value gen))))

;;; Car on lseqs is the same as on lists
(define (lseq-car lseq) (car lseq))
(define (lseq-first lseq) (car lseq))

;;; Lseq-cdr expands the generator if it's there, or falls back to regular cdr
(define (lseq-cdr lseq)
  ;; We assume lseq is a pair, because it is an error if it isn't
  ;; If it's a procedure, we assume it's a generator and invoke it
  (if (procedure? (cdr lseq))
    (let ((obj ((cdr lseq))))
      (cond
        ;; If the generator is exhausted, replace it with () and return ()
        ((eof-object? obj)
         (set-cdr! lseq '())
         '())
        ;; Otherwise, make a new pair of the value and the generator
        ;; and patch it in to the cdr
        (else (let ((result (cons obj (cdr lseq))))
                (set-cdr! lseq result)
                result))))
      ;; If there is no procedure, return the ordinary cdr
      (cdr lseq)))

(define (lseq-rest lseq) (lseq-cdr lseq))

;;; Returns #t if argument is an lseq
;;; Note that without arity inspection, we can't be sure a procedure in the
;;; tail is really a generator, so we assume it is
(define (lseq? obj)
  (cond
    ;; null list is a lseq
    ((null? obj) #t)
    ;; non-list is not an lseq
    ((not (pair? obj)) #f)
    ;; improper list with procedure in the tail is (presumed to be) an lseq
    ((procedure? (cdr obj)) #t)
    ;; otherwise keep looking
    (else (lseq? (cdr obj)))))

;;; Compare lseqs for equality
(define (lseq=? = lseq1 lseq2)
  (cond
    ((and (null? lseq1) (null? lseq2))
     #t)
    ((or (null? lseq1) (null? lseq2))
     #f)
    ((= (lseq-car lseq1) (lseq-car lseq2))
     (lseq=? = (lseq-cdr lseq1) (lseq-cdr lseq2)))
    (else #f)))

;;; Take the first n elements of lseq and return as a list
(define (lseq-take lseq i)
  (generator->lseq
    (lambda ()
      (if (= i 0)
        (eof-object)
        (let ((result (lseq-car lseq)))
          (set! lseq (lseq-cdr lseq))
          (set! i (- i 1))
          result)))))

;; Drop the first n arguments of lseq
;; No reason not to do it eagerly
(define (lseq-drop lseq i)
  (let loop ((i i) (lseq lseq))
    (if (= i 0)
      lseq
      (loop (- i 1) (lseq-cdr lseq)))))

;; Get the nth argument of lseq
(define (lseq-ref lseq i) (lseq-car (lseq-drop lseq i)))

;;; Convert lseq to a list by lseq-cdr-ing down it to the end
(define (lseq-realize lseq)
  (let loop ((next lseq))
    (if (null? next)
      lseq
      (loop (lseq-cdr next)))))

;;; Realize an lseq and return its length
(define (lseq-length lseq) (length (lseq-realize lseq)))

;; Return a generator that steps through the elements of the lseq
(define (lseq->generator lseq)
  (lambda ()
    (if (null? lseq)
      (eof-object)
      (let ((result (lseq-car lseq)))
        (set! lseq (lseq-cdr lseq))
        result))))

;; lseq-append converts lseqs to generators and gappends them

(define (lseq-append . lseqs)
  (generator->lseq (apply gappend (map lseq->generator lseqs))))

;; Safe version of lseq-cdr that returns () if the argument is ()
(define (safe-lseq-cdr obj)
  (if (null? obj)
    obj
    (lseq-cdr obj)))

;; Lazily map lseqs through a proc to produce another lseq
(define (lseq-map proc . lseqs)
  (generator->lseq
    (lambda ()
      (if (any-null? lseqs)
        (eof-object)
        (let ((result (apply proc (map lseq-car lseqs))))
          (set! lseqs (map safe-lseq-cdr lseqs))
          result)))))

;; Zip cars of lseqs into a list and return an lseq of those lists
(define (lseq-zip . lseqs) (apply lseq-map list lseqs))

;; Eagerly apply a proc to the elements of lseqs
;; Included because it's a common operation, even though it is trivial
(define (lseq-for-each proc . lseqs)
  (apply for-each proc (map lseq-realize lseqs)))

;; Filter an lseq lazily to include only elements that satisfy pred
(define (lseq-filter pred lseq)
  (generator->lseq
    (lambda ()
      (let loop ((lseq1 lseq))
        (if (null? lseq1)
          (eof-object)
          (let ((result (lseq-car lseq1)))
            (cond
              ((pred result)
               (set! lseq (lseq-cdr lseq1))
               result)
              (else
                (loop (lseq-cdr lseq1))))))))))


;; Negated filter
(define (lseq-remove pred lseq)
  (lseq-filter (lambda (x) (not (pred x))) lseq))

;; Find an element that satisfies a pred, or #f if no such element
(define (lseq-find pred lseq)
  (cond
    ((null? lseq) #f)
    ((pred (lseq-car lseq)) (lseq-car lseq))
    (else (lseq-find pred (lseq-cdr lseq)))))

;; Find the tail of an lseq whose car satisfies a pred, or #f if no such
(define (lseq-find-tail pred lseq)
  (cond
    ((null? lseq) #f)
    ((pred (lseq-car lseq)) lseq)
    (else (lseq-find-tail pred (lseq-cdr lseq)))))

;; Return initial elements of lseq that satisfy pred
(define (lseq-take-while pred lseq)
  (generator->lseq
    (lambda ()
      (if (not (pred (lseq-car lseq)))
        (eof-object)
        (let ((result (lseq-car lseq)))
          (set! lseq (lseq-cdr lseq))
          result)))))


;; Return all but initial of lseq that satisfy pred
;; No reason not to do it eagerly
(define (lseq-drop-while pred lseq)
  (let loop ((lseq lseq))
    (if (not (pred (lseq-car lseq)))
      lseq
      (loop (lseq-cdr lseq)))))

;; Apply predicate across lseqs, returning result if it is true
(define (lseq-any pred . lseqs)
  (let loop ((lseqs lseqs))
    (if (any-null? lseqs)
      #f
      (let ((result (apply pred (map lseq-car lseqs))))
        (if result
          result
          (loop (map lseq-cdr lseqs)))))))

;; Apply predicate across lseqs, returning false if predicate does
(define (lseq-every pred . lseqs)
  (let loop ((lseqs lseqs) (last-result #t))
    (if (any-null? lseqs)
      last-result
      (let ((result (apply pred (map lseq-car lseqs))))
        (if result
           (loop (map lseq-cdr lseqs) result)
           #f)))))

;; Return the index of the first element of lseq that satisfies pred
(define (lseq-index pred . lseqs)
  (let loop ((lseqs lseqs) (n 0))
    (cond
      ((any-null? lseqs) #f)
      ((apply pred (map lseq-car lseqs)) n)
      (else (loop (map safe-lseq-cdr lseqs) (+ n 1))))))

;; Return tail of lseq whose first element is x in the sense of = (default equal?)
(define lseq-member
  (case-lambda
    ((x lseq) (lseq-member x lseq equal?))
    ((x lseq =) (cond
                   ((null? lseq) #f)
                   ((= x (lseq-car lseq)) lseq)
                   (else (lseq-member x (lseq-cdr lseq) =))))))


;; Member using eqv?
(define (lseq-memv x lseq) (lseq-member x lseq eqv?))

;; Member using eq?
(define (lseq-memq x lseq) (lseq-member x lseq eq?))
