;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (akku-r7rs base)
  (export
    * + - / < <= = > >= abs and append apply assoc assq
    assv begin binary-port? boolean=? boolean? bytevector
    bytevector-append bytevector-copy bytevector-copy!
    bytevector-length bytevector-u8-ref bytevector-u8-set!
    bytevector? caar cadr call-with-current-continuation
    call-with-port call-with-values call/cc car case cdar cddr
    cdr ceiling char->integer char-ready? char<=? char<? char=?
    char>=? char>? char? close-input-port close-output-port
    close-port complex? cond cond-expand cons current-error-port
    current-input-port current-output-port define
    define-record-type define-syntax define-values denominator
    do dynamic-wind eof-object eof-object? eq? equal? eqv?
    error error-object-irritants error-object-message
    error-object? even? exact exact-integer-sqrt exact-integer?
    exact? expt features file-error? floor floor-quotient
    floor-remainder floor/ flush-output-port for-each gcd
    get-output-bytevector get-output-string guard if include
    include-ci inexact inexact? input-port-open? input-port?
    integer->char integer? lambda lcm length let let*
    let*-values let-syntax let-values letrec letrec*
    letrec-syntax list list->string list->vector list-copy
    list-ref list-set! list-tail list? make-bytevector make-list
    make-parameter make-string make-vector map max member memq
    memv min modulo negative? newline not null? number->string
    number? numerator odd? open-input-bytevector
    open-input-string open-output-bytevector open-output-string
    or output-port-open? output-port? pair? parameterize
    peek-char peek-u8 port? positive? procedure? quasiquote
    quote quotient raise raise-continuable rational? rationalize
    read-bytevector read-bytevector! read-char read-error?
    read-line read-string read-u8 real? remainder reverse round
    set! set-car! set-cdr! square string string->list
    string->number string->symbol string->utf8 string->vector
    string-append string-copy string-copy! string-fill!
    string-for-each string-length string-map string-ref
    string-set! string<=? string<? string=? string>=? string>?
    string? substring symbol->string symbol=? symbol?
    syntax-error syntax-rules textual-port? truncate
    truncate-quotient truncate-remainder truncate/ u8-ready?
    unless unquote unquote-splicing utf8->string values vector
    vector->list vector->string vector-append vector-copy
    vector-copy! vector-fill! vector-for-each vector-length
    vector-map vector-ref vector-set! vector? when
    with-exception-handler write-bytevector write-char
    write-string write-u8 zero?)
  (import
    (except (rnrs) case syntax-rules error define-record-type
            string->list string-copy string->utf8 vector->list
            vector-fill! bytevector-copy! bytevector-copy
            utf8->string
            map for-each member assoc
            vector-map read
            let-syntax
            expt flush-output-port
            string-for-each
            vector-for-each)
    (prefix (rnrs) r6:)
    (only (rnrs bytevectors) u8-list->bytevector)
    (only (rnrs control) case-lambda)
    (rnrs conditions)
    (except (rnrs io ports)
            flush-output-port)
    (rnrs mutable-pairs)
    (prefix (rnrs mutable-strings) r6:)
    (only (rnrs mutable-strings) string-set!)
    (rnrs syntax-case)
    (rnrs r5rs)
    (only (srfi :1 lists) map for-each member assoc make-list list-copy)
    (srfi :6 basic-string-ports)
    (srfi :9 records)
    (only (srfi :13 strings) string-copy!)
    (srfi :39 parameters)
    (only (srfi :43 vectors) vector-copy!)
    (for (prefix (akku metadata) akku:) expand)
    (for (akku-r7rs compat) run expand)
    (for (akku-r7rs include) expand))

(define (error message . irritants)
  (if (and (symbol? message) (pair? irritants) (string? (car irritants)))
      (apply r6:error message irritants)
      (apply r6:error #f message irritants)))

;; Based on the definition in R7RS.
(define-syntax cond-expand
  (lambda (x)
    (syntax-case x (and or not else library)
      ((_)
       (syntax-violation 'cond-expand "Unfulfilled cond-expand" x))
      ((_ (else body ...))
       #'(begin body ...))
      ((_ ((and) body ...) more-clauses ...)
       #'(begin body ...))
      ((_ ((and req1 req2 ...) body ...)
          more-clauses ...)
       #'(cond-expand
          (req1
           (cond-expand
            ((and req2 ...) body ...)
            more-clauses ...))
          more-clauses ...))
      ((_ ((or) body ...) more-clauses ...)
       #'(cond-expand more-clauses ...))
      ((_ ((or req1 req2 ...) body ...)
          more-clauses ...)
       #'(cond-expand
          (req1
           (begin body ...))
          (else
           (cond-expand
            ((or req2 ...) body ...)
            more-clauses ...))))
      ((_ ((not req) body ...)
          more-clauses ...)
       #'(cond-expand
          (req
           (cond-expand more-clauses ...))
          (else body ...)))
      ((cond-expand (id body ...)
                    more-clauses ...)
       (memq (syntax->datum #'id) (features))
       #'(begin body ...))
      ((_ ((library lib-name)
           body ...)
          more-clauses ...)
       (r6:member (syntax->datum #'lib-name) akku:installed-libraries)
       #'(begin body ...))
      ;; Fallthrough
      ((_ (feature-id body ...)
          more-clauses ...)
       #'(cond-expand more-clauses ...))
      ((_ ((library (name ...))
           body ...)
          more-clauses ...)
       #'(cond-expand more-clauses ...)))))

(define-syntax include
  (lambda (x)
    (syntax-case x ()
      ((k fn* ...)
       (include-helper 'include #'k #f (syntax->datum #'(fn* ...)))))))

(define-syntax include-ci
  (lambda (x)
    (syntax-case x ()
      ((k fn* ...)
       (include-helper 'include-ci #'k #f (syntax->datum #'(fn* ...)))))))

(define-syntax syntax-error
  (lambda (x)
    (syntax-case x ()
      ((_ message args ...)
       (syntax-violation 'syntax-error #'message '#'(args ...))))))

;; let-syntax from Kato2014.
(define-syntax let-syntax
  (lambda (x)
    (syntax-case x ()
      ((_ ((vars trans) ...) . expr)
       #'(r6:let-syntax ((vars trans) ...)
                        (let () . expr))))))

;;; SRFI-46 style syntax-rules

;; FIXME: We should use with-syntax like:
;;   http://srfi.schemers.org/srfi-93/mail-archive/msg00024.html
(define-syntax syntax-rules
  (lambda (x)
    ;; filt and emap handle ellipsis in the patterns
    (define (filt elip x)
      (if (identifier? x)
          (cond ((free-identifier=? elip x) #'(... ...))
                ((free-identifier=? #'(... ...) x) #'bogus)
                (else x))
          x))
    (define (emap elip in)
      (syntax-case in ()
        ((x . y) (cons (emap elip #'x)
                       (emap elip #'y)))
        (#(x ...) (list->vector (emap elip #'(x ...))))
        (x (filt elip #'x))))
    ;; This translates _ into temporaries and guards -weinholt
    (define (get-underscores stx)
      (syntax-case stx ()
        [(x . y)
         (let-values (((t0 p0) (get-underscores #'x))
                      ((t1 p1) (get-underscores #'y)))
           (values (append t0 t1) (cons p0 p1)))]
        [#(x* ...)
         (let lp ((x* #'(x* ...))
                  (t* '())
                  (p* '()))
           (if (null? x*)
               (values (apply append (reverse t*))
                       (list->vector (reverse p*)))
               (let-values (((t p) (get-underscores (car x*))))
                 (lp (cdr x*) (cons t t*) (cons p p*)))))]
        [x
         (and (identifier? #'x) (free-identifier=? #'x #'_))
         (let ((t* (generate-temporaries #'(_))))
           (values t* (car t*)))]
        [x
         (values '() #'x)]))
    (syntax-case x ()
      ((_ (lit ...) (pat tmpl) ...)     ;compatible with r6rs
       (not (memq '_ (syntax->datum #'(lit ...))))
       #'(r6:syntax-rules (lit ...) (pat tmpl) ...))

      ((_ (lit ...) (pat tmpl) ...)     ;_ in the literals list
       #'(syntax-rules (... ...) (lit ...) (pat tmpl) ...))

      ((_ elip (lit ...) (pat tmpl) ...)  ;custom ellipsis
       (and (identifier? #'elip)
            (not (memq '_ (syntax->datum #'(lit ...)))))
       (with-syntax (((clause ...) (emap #'elip #'((pat tmpl) ...))))
         #'(r6:syntax-rules (lit ...) clause ...)))

      ((_ elip (lit ...) (pat tmpl) ...)
       ;; Both custom ellipsis and _ in the literals list.
       (identifier? #'elip)
       (with-syntax (((clause ...) (emap #'elip #'((pat tmpl) ...)))
                     ((lit^ ...) (filter (lambda (x)
                                           (not (free-identifier=? #'_ x)))
                                         #'(lit ...))))
         (with-syntax (((clause^ ...)
                        (map (lambda (cls)
                               (syntax-case cls ()
                                 [((_unused . pattern) template)
                                  (let-values (((t p) (get-underscores #'pattern)))
                                    (if (null? t)
                                        #'((_unused . pattern)
                                           #'template)
                                        (with-syntax ((pattern^ p) ((t ...) t))
                                          #'((_unused . pattern^)
                                             (and (underscore? #'t) ...)
                                             #'template))))]))
                             #'(clause ...))))
           #'(lambda (y)
               (define (underscore? x)
                 (and (identifier? x) (free-identifier=? x #'_)))
               (syntax-case y (lit^ ...)
                 clause^ ...))))))))

;;; Case

(define-syntax %r7case-clause
  (syntax-rules (else =>)
    ((_ obj (translated ...) ())
     (r6:case obj translated ...))
    ((_ obj (translated ...) (((e0 e1 ...) => f) rest ...))
     (%r7case-clause obj (translated ... ((e0 e1 ...) (f obj))) (rest ...)))
    ((_ obj (translated ...) ((else => f) rest ...))
     (%r7case-clause obj (translated ... (else (f obj))) (rest ...)))
    ((_ obj (translated ...) (otherwise rest ...))
     (%r7case-clause obj (translated ... otherwise) (rest ...)))))

(define-syntax case
  (syntax-rules (else =>)
    ((_ key clause ...)
     (let ((obj key))
       (%r7case-clause obj () (clause ...))))))

;;;

;; R7RS error object will be mapped to R6RS condition object
(define error-object? condition?)
(define file-error? i/o-error?)
(define read-error? lexical-violation?)

(define (error-object-irritants obj)
  (and (irritants-condition? obj)
       (condition-irritants obj)))

(define (error-object-message obj)
  (and (message-condition? obj)
       (condition-message obj)))

;;; Ports

(define (open-input-bytevector bv) (open-bytevector-input-port bv))

(define (open-output-bytevector)
  (let-values (((p extract) (open-bytevector-output-port)))
    (define pos 0)
    (define buf #vu8())
    (define (read! target target-start count)
      (when (zero? (- (bytevector-length buf) pos))
        (set! buf (bytevector-append buf (extract))))  ;resets p
      (let ((count (min count (- (bytevector-length buf) pos))))
        (r6:bytevector-copy! buf pos
                             target target-start count)
        (set! pos (+ pos count))
        count))
    (define (write! bv start count)
      (put-bytevector p bv start count)
      (set! pos (+ pos count))
      count)
    (define (get-position)
      pos)
    (define (set-position! new-pos)
      (set! pos new-pos))
    (define (close)
      (close-port p))
    ;; It's actually an input/output port, but only
    ;; get-output-bytevector should ever read from it. If it was just
    ;; an output port then there would be no good way for
    ;; get-output-bytevector to read the data. -weinholt
    (make-custom-binary-input/output-port
     "bytevector" read! write! get-position set-position! close)))

(define (get-output-bytevector port)
  ;; R7RS says "It is an error if port was not created with
  ;; open-output-bytevector.", so we can safely assume that the port
  ;; was created by open-output-bytevector. -weinholt
  (set-port-position! port 0)
  (let ((bv (get-bytevector-all port)))
    (if (eof-object? bv)
        #vu8()
        bv)))

(define (exact-integer? i) (and (integer? i) (exact? i)))

(define peek-u8
  (case-lambda
    (() (peek-u8 (current-input-port)))
    ((port)
     (lookahead-u8 port))))

(define read-bytevector
  (case-lambda
    ((len) (read-bytevector len (current-input-port)))
    ((len port) (get-bytevector-n port len))))

(define read-string
  (case-lambda
    ((len) (read-string len (current-input-port)))
    ((len port) (get-string-n port len))))

(define read-bytevector!
  (case-lambda
    ((bv)
     (read-bytevector! bv (current-input-port)))
    ((bv port)
     (read-bytevector! bv port 0))
    ((bv port start)
     (read-bytevector! bv port start (bytevector-length bv)))
    ((bv port start end)
     (get-bytevector-n! port bv start (- end start)))))

(define read-line
  (case-lambda
    (() (read-line (current-input-port)))
    ((port) (get-line port))))

(define write-u8
  (case-lambda
    ((obj) (write-u8 obj (current-output-port)))
    ((obj port) (put-u8 port obj))))

(define read-u8
  (case-lambda
    (() (read-u8 (current-input-port)))
    ((port) (get-u8 port))))

(define write-bytevector
  (case-lambda
    ((bv) (write-bytevector bv (current-output-port)))
    ((bv port) (put-bytevector port bv))
    ((bv port start) (write-bytevector (%subbytevector1 bv start) port))
    ((bv port start end)
     (write-bytevector (%subbytevector bv start end) port))))

(define write-string
  (case-lambda
    ((str) (write-string str (current-output-port)))
    ((str port) (put-string port str))
    ((str port start) (write-string str port start (string-length str)))
    ((str port start end)
     (write-string (substring str start end) port))))

(define flush-output-port
  (case-lambda
    (()
     (flush-output-port (current-output-port)))
    ((port)
     (r6:flush-output-port port))))

;;; List additions

(define (list-set! l k obj)
  (define (itr cur count)
    (if (= count k)
      (set-car! cur obj)
      (itr (cdr cur) (+ count 1))))
  (itr l 0))

;;; Vector and string additions

;; FIXME: Optimize them
(define (string-map proc . strs)
  (list->string (apply map proc (map r6:string->list strs))))

(define (vector-map proc . args)
  (list->vector (apply map proc (map r6:vector->list args))))

(define (bytevector . lis)
  (u8-list->bytevector lis))

(define (bytevector-append . bvs)
  (call-with-bytevector-output-port
    (lambda (p)
      (for-each (lambda (bv) (put-bytevector p bv)) bvs))))

(define (vector-append . lis)
  (list->vector (apply append (map r6:vector->list lis))))

;;; Substring functionalities added

;; string
(define (%substring1 str start) (substring str start (string-length str)))

(define string->list
  (case-lambda
    ((str) (r6:string->list str))
    ((str start) (r6:string->list (%substring1 str start)))
    ((str start end) (r6:string->list (substring str start end)))))

(define string->vector
  (case-lambda
    ((str) (list->vector (string->list str)))
    ((str start) (string->vector (%substring1 str start)))
    ((str start end) (string->vector (substring str start end)))))

(define string-copy
  (case-lambda
    ((str) (r6:string-copy str))
    ((str start) (%substring1 str start))
    ((str start end) (substring str start end))))

(define string->utf8
  (case-lambda
    ((str) (r6:string->utf8 str))
    ((str start) (r6:string->utf8 (%substring1 str start)))
    ((str start end) (r6:string->utf8 (substring str start end)))))

(define string-fill!
  (case-lambda
    ((str fill) (r6:string-fill! str fill))
    ((str fill start) (string-fill! str fill start (string-length str)))
    ((str fill start end)
     (define (itr r)
       (unless (= r end)
         (string-set! str r fill)
         (itr (+ r 1))))
     (itr start))))

(define (string-for-each proc str . str*)
  (do ((len (fold-left min (string-length str) (map string-length str*)))
       (i 0 (+ i 1)))
      ((= i len))
    (apply proc (string-ref str i) (map (lambda (s) (string-ref s i)) str*))))

;;; vector

(define (%subvector v start end)
  (define mlen (- end start))
  (define out (make-vector (- end start)))
  (define (itr r)
    (if (= r mlen)
      out
      (begin
        (vector-set! out r (vector-ref v (+ start r)))
        (itr (+ r 1)))))
  (itr 0))

(define (%subvector1 v start) (%subvector v start (vector-length v)))

(define vector-copy
  (case-lambda
    ((v) (%subvector1 v 0))
    ((v start) (%subvector1 v start))
    ((v start end) (%subvector v start end))))

(define vector->list
  (case-lambda
    ((v) (r6:vector->list v))
    ((v start) (r6:vector->list (%subvector1 v start)))
    ((v start end) (r6:vector->list (%subvector v start end)))))

(define vector->string
  (case-lambda
    ((v) (list->string (vector->list v)))
    ((v start) (vector->string (%subvector1 v start)))
    ((v start end) (vector->string (%subvector v start end)))))

(define vector-fill!
  (case-lambda
    ((vec fill) (r6:vector-fill! vec fill))
    ((vec fill start) (vector-fill! vec fill start (vector-length vec)))
    ((vec fill start end)
     (define (itr r)
       (unless (= r end)
         (vector-set! vec r fill)
         (itr (+ r 1))))
     (itr start))))

(define (vector-for-each proc vec . vec*)
  (do ((len (fold-left min (vector-length vec) (map vector-length vec*)))
       (i 0 (+ i 1)))
      ((= i len))
    (apply proc (vector-ref vec i) (map (lambda (s) (vector-ref s i)) vec*))))

(define (%subbytevector bv start end)
  (define mlen (- end start))
  (define out (make-bytevector mlen))
  (r6:bytevector-copy! bv start out 0 mlen)
  out)

(define (%subbytevector1 bv start)
  (%subbytevector bv start (bytevector-length bv)))

(define bytevector-copy!
  (case-lambda
    ((to at from) (bytevector-copy! to at from 0))
    ((to at from start)
     (let ((flen (bytevector-length from))
           (tlen (bytevector-length to)))
       (let ((fmaxcopysize (- flen start))
             (tmaxcopysize (- tlen at)))
         (bytevector-copy! to at from start (+ start
                                               (min fmaxcopysize
                                                    tmaxcopysize))))))
    ((to at from start end)
     (r6:bytevector-copy! from start to at (- end start)))))

(define bytevector-copy
  (case-lambda
    ((bv) (r6:bytevector-copy bv))
    ((bv start) (%subbytevector1 bv start))
    ((bv start end) (%subbytevector bv start end))))

(define utf8->string
  (case-lambda
    ((bv) (r6:utf8->string bv))
    ((bv start) (r6:utf8->string (%subbytevector1 bv start)))
    ((bv start end) (r6:utf8->string (%subbytevector bv start end)))))

;;; From division library

(define-syntax %define-division
  (syntax-rules ()
    ((_ fix quo rem q+r)
     (begin
       (define (quo x y)
         (exact (fix (/ x y))))
       (define (rem x y)
         (- x (* (quo x y) y)))
       (define (q+r x y)
         (let ((q (quo x y)))
           (values q
                   (- x (* q y)))))))))

(%define-division
  floor
  floor-quotient
  floor-remainder0 ;; Most implementation has native modulo
  floor/)
(define floor-remainder modulo)

(define truncate-quotient quotient)
(define truncate-remainder remainder)
(define (truncate/ x y)
  (values (truncate-quotient x y)
          (truncate-remainder x y)))

(define (square x) (* x x))

(define (expt x y)
  (if (eqv? x 0.0)
      (inexact (r6:expt x y))
      (r6:expt x y))))
