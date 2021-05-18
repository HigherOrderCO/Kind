#!/usr/bin/env scheme-script
;; Copied by Akku from "./srfi-135/texts-search-test.sps" !#
#!r6rs
(import (scheme base) (scheme char) (scheme write)
  (scheme time) (only (srfi :27) random-integer) (srfi :135))
(define (writeln . xs) (for-each write xs) (newline))
(define (displayln . xs) (for-each display xs) (newline))
(define (fail token . more)
  (displayln "Error: test failed: ")
  (writeln token)
  (if (not (null? more)) (for-each writeln more))
  (newline)
  #f)
(define-syntax test
  (syntax-rules ()
    [(_ expr expected)
     (let ([actual expr])
       (or (equal? actual expected)
           (fail 'expr actual expected)))]))
(define-syntax test-assert
  (syntax-rules () [(_ expr) (or expr (fail 'expr))]))
(define-syntax test-deny
  (syntax-rules () [(_ expr) (or (not expr) (fail 'expr))]))
(define (timed-test name thunk expected)
  (define name (if (string? name) (string->symbol name) name))
  (define (rounded jiffies)
    (let* ([usec (round
                   (/ (* 1000000.0 jiffies) (jiffies-per-second)))])
      (/ usec 1000000.0)))
  (let* ([j0 (current-jiffy)]
         [result (thunk)]
         [j1 (current-jiffy)])
    (if (not (equal? result expected))
        (begin
          (fail name result expected)
          (write
            (map char->integer (string->list (textual->string *txt1*))))
          (newline)
          (write
            (map char->integer (string->list (textual->string *txt2*))))
          (newline)
          (newline)))
    (rounded (- j1 j0))))
(define (seconds->milliseconds t)
  (exact (round (* 1000.0 t))))
(define (textual-contains:naive txt1 txt2)
  (%textual-contains:naive txt1 txt2 0 (text-length txt1) 0
    (text-length txt2)))
(define (textual-contains:rabin-karp txt1 txt2)
  (textual-contains txt1 txt2 0 (text-length txt1) 0
    (text-length txt2)))
(define (textual-contains:boyer-moore txt1 txt2)
  (%textual-contains:boyer-moore txt1 txt2 0
    (text-length txt1) 0 (text-length txt2)))
(define (make-random-string n) (make-random-ascii-string n))
(define (make-random-ascii-string n)
  (do ([s (make-string n)] [i 0 (+ i 1)])
      ((= i n) s)
    (string-set! s i (integer->char (random-integer 126)))))
(define (make-random-unicode-string n)
  (do ([s (make-string n)] [i 0 (+ i 1)])
      ((= i n) s)
    (let loop ([bits (random-integer 1114111)])
      (if (or (<= 55296 bits 57343) (= bits (char->integer #\~)))
          (loop (random-integer 32768))
          (string-set! s i (integer->char bits))))))
(define *txt1* (text))
(define *txt2* (text))
(define name:length 22)
(define (random-search testname make-random-string m n)
  (let* ([n1 (random-integer n)]
         [n2 (max 1 (- n n1 1))]
         [m1 (random-integer (max 1 (- m n)))]
         [m2 (max 1 (- m m1 n))]
         [P (string-append
              (make-random-string n1)
              "~"
              (make-random-string n2))]
         [T (string-append
              (make-random-string m1)
              P
              (make-random-string m2))]
         [txt1 (string->text T)]
         [txt2 (string->text P)]
         [ignored (begin (set! *txt1* txt1) (set! *txt2* txt2))]
         [expected m1]
         [name (string-append
                 testname
                 (number->string m)
                 " "
                 (number->string n))]
         [t1 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:naive txt1 txt2))))
               expected)]
         [t2 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:rabin-karp txt1 txt2))))
               expected)]
         [t3 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:boyer-moore txt1 txt2))))
               expected)]
         [t4 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains txt1 txt2))))
               expected)]
         [t0 (min t1 t2 t3)])
    (display name)
    (display
      (make-string (- name:length (string-length name)) #\space))
    (display
      (cond
        [(= t0 t1) "naive        "]
        [(= t0 t2) "Rabin-Karp   "]
        [(= t0 t3) "Boyer-Moore  "]))
    (write
      (cons
        (/ (round (* 10.0 (/ t4 t0))) 10.0)
        (map seconds->milliseconds (list t1 t2 t3 t4))))
    (newline)))
(define (random-search-failing testname make-random-string m
         n)
  (let* ([n1 (random-integer n)]
         [n2 (max 1 (- n n1 1))]
         [P (string-append
              (make-random-string n1)
              "~"
              (make-random-string n2))]
         [T (string-append (make-random-string m))]
         [txt1 (string->text T)]
         [txt2 (string->text P)]
         [ignored (begin (set! *txt1* txt1) (set! *txt2* txt2))]
         [name (string-append
                 testname
                 (number->string m)
                 " "
                 (number->string n))]
         [t1 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:naive txt1 txt2))))
               #f)]
         [t2 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:rabin-karp txt1 txt2))))
               #f)]
         [t3 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains:boyer-moore txt1 txt2))))
               #f)]
         [t4 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work m)
                   (lambda () (textual-contains txt1 txt2))))
               #f)]
         [t0 (min t1 t2 t3)])
    (display name)
    (display
      (make-string (- name:length (string-length name)) #\space))
    (display
      (cond
        [(= t0 t1) "naive        "]
        [(= t0 t2) "Rabin-Karp   "]
        [(= t0 t3) "Boyer-Moore  "]))
    (write
      (cons
        (/ (round (* 10.0 (/ t4 t0))) 10.0)
        (map seconds->milliseconds (list t1 t2 t3 t4))))
    (newline)))
(define (hard-case left/right make-random-string m n)
  (let* ([P (make-string (- n 1) #\a)]
         [P (case left/right
              [(R) (string-append P "b")]
              [(L) (string-append "b" P)])]
         [T (string-append (make-string (- m n) #\a) P)]
         [txt1 (string->text T)]
         [txt2 (string->text P)]
         [ignored (begin (set! *txt1* txt1) (set! *txt2* txt2))]
         [expected (- m n)]
         [name (string-append "hard(" (symbol->string left/right)
                 "): " (number->string m) " " (number->string n))]
         [t1 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work (* m n))
                   (lambda () (textual-contains:naive txt1 txt2))))
               expected)]
         [t2 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work (* m n))
                   (lambda () (textual-contains:rabin-karp txt1 txt2))))
               expected)]
         [t3 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work (* m n))
                   (lambda () (textual-contains:boyer-moore txt1 txt2))))
               expected)]
         [t4 (timed-test
               name
               (lambda ()
                 (dotimes
                   (quotient total-work (* m n))
                   (lambda () (textual-contains txt1 txt2))))
               expected)]
         [t0 (min t1 t2 t3)])
    (display name)
    (display
      (make-string (- name:length (string-length name)) #\space))
    (display
      (cond
        [(= t0 t1) "naive        "]
        [(= t0 t2) "Rabin-Karp   "]
        [(= t0 t3) "Boyer-Moore  "]))
    (write
      (cons
        (/ (round (* 10.0 (/ t4 t0))) 10.0)
        (map seconds->milliseconds (list t1 t2 t3 t4))))
    (newline)))
(define (random-ascii-search-successful m n)
  (random-search "success: " make-random-ascii-string m n))
(define (random-ascii-search-failing m n)
  (random-search-failing
    "failure: "
    make-random-ascii-string
    m
    n))
(define (hard-case-naive-ascii-search-successful m n)
  (hard-case 'R make-random-ascii-string m n))
(define (hard-case-BM-ascii-search-successful m n)
  (hard-case 'L make-random-ascii-string m n))
(define (random-unicode-search-successful m n)
  (random-search "success: " make-random-unicode-string m n))
(define (hard-case-naive-unicode-search-successful m n)
  (hard-case 'R make-random-unicode-string m n))
(define (hard-case-BM-unicode-search-successful m n)
  (hard-case 'L make-random-unicode-string m n))
(define (dotimes n thunk)
  (if (> n 1)
      (begin (thunk) (dotimes (- n 1) thunk))
      (thunk)))
(define total-work 1000000)
(define heading
  "test                  fastest  (def/best naive Rabin-Karp Boyer-Moore def)")
(display heading)
(newline)
(newline)
(display "ASCII")
(newline)
(newline)
(define lengths1 '(1 10 100 500 1000 5000 10000 20000))
(define lengths2 '(1 2 3 4 5 10 20 50 100 1000))
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m) (hard-case-naive-ascii-search-successful m n)))
      lengths2))
  lengths1)
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m) (hard-case-BM-ascii-search-successful m n)))
      lengths2))
  lengths1)
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m) (random-ascii-search-successful m n)))
      lengths2))
  lengths1)
(newline)
(newline)
(display "Unicode")
(newline)
(newline)
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m)
            (hard-case-naive-unicode-search-successful m n)))
      lengths2))
  lengths1)
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m) (hard-case-BM-unicode-search-successful m n)))
      lengths2))
  lengths1)
(for-each
  (lambda (m)
    (for-each
      (lambda (n)
        (if (<= n m) (random-unicode-search-successful m n)))
      lengths2))
  lengths1)
