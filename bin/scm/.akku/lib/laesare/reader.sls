;; -*- mode: scheme; coding: utf-8 -*-
;; Copyright © 2017, 2018, 2019 Göran Weinholt <goran@weinholt.se>
;; SPDX-License-Identifier: MIT

;; Permission is hereby granted, free of charge, to any person obtaining a
;; copy of this software and associated documentation files (the "Software"),
;; to deal in the Software without restriction, including without limitation
;; the rights to use, copy, modify, merge, publish, distribute, sublicense,
;; and/or sell copies of the Software, and to permit persons to whom the
;; Software is furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
;; THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
;; DEALINGS IN THE SOFTWARE.
#!r6rs

;; RnRS lexer and reader with source annotations.

;; Incomplete but useful list of lexical differences in R7RS:
;; https://github.com/larcenists/larceny/wiki/R7RSconversion

(library (laesare reader)
  (export
    get-token
    read-annotated read-datum
    detect-scheme-file-type
    reader? make-reader reader-warning
    reader-port
    reader-mode reader-mode-set!
    reader-fold-case? reader-fold-case?-set!
    reader-tolerant? reader-tolerant?-set!
    reader-line reader-column
    reader-saved-line reader-saved-column
    annotation? annotation-expression annotation-stripped annotation-source
    annotation-source->condition source-condition? source-filename
    source-line source-column)
  (import
    (rnrs arithmetic fixnums (6))
    (rnrs base (6))
    (rnrs bytevectors (6))
    (rnrs conditions (6))
    (rnrs control (6))
    (rnrs exceptions (6))
    (rnrs hashtables (6))
    (rnrs lists (6))
    (rnrs mutable-pairs (6))            ;for #<n>=
    (prefix (only (rnrs io ports (6)) lookahead-char get-char put-char eof-object?
                  call-with-string-output-port)
            rnrs:)
    (only (rnrs io simple (6)) write display newline current-error-port) ;debugging
    (rnrs records syntactic (6))
    (rnrs unicode (6)))

(define eof-object? rnrs:eof-object?)

;; Peek at the next char from the reader.
(define (lookahead-char reader)
  (rnrs:lookahead-char (reader-port reader)))

;; Get a char from the reader.
(define (get-char reader)
  (let ((c (rnrs:get-char (reader-port reader))))
    (when (eqv? c #\linefeed)
      (reader-line-set! reader (+ (reader-line reader) 1))
      (reader-column-set! reader -1))
    (reader-column-set! reader (+ (reader-column reader) 1))
    c))

;; Detects the (intended) type of Scheme source: r6rs-library,
;; r6rs-program, empty or unknown.
(define (detect-scheme-file-type port)
  (let ((reader (make-reader port "<unknown>")))
    (let-values (((type lexeme) (get-lexeme reader)))
      (case type
        ((eof)
         'empty)
        ((shebang)
         'r6rs-program)
        ((openp openb)                  ;a pair
         (let-values (((type lexeme) (get-lexeme reader)))
           (case type
             ((identifier)
              (case lexeme
                ((import) 'r6rs-program)
                ((library) 'r6rs-library)
                ((define-library) 'r7rs-library)
                (else 'unknown)))
             (else 'unknown))))
        (else 'unknown)))))

(define-record-type reader
  (fields port filename
          (mutable line) (mutable column)
          (mutable saved-line) (mutable saved-column)
          (mutable fold-case?)       ;boolean
          (mutable mode)             ;a symbol: rnrs, r5rs, r6rs, r7rs
          (mutable tolerant?))       ;tolerant to errors?
  (sealed #t) (opaque #f)
  (nongenerative reader-v0-eec5b78f-a766-4be4-9cd0-fbb52ec572dc)
  (protocol
   (lambda (p)
     (lambda (port filename)
       (p port filename 1 0 1 0 #f 'rnrs #f)))))

(define (reader-mark reader)
  (reader-saved-line-set! reader (reader-line reader))
  (reader-saved-column-set! reader (reader-column reader)))

;; As wanted by psyntax
(define-record-type annotation
  (fields expression source stripped)
  (sealed #t) (opaque #f)
  (nongenerative annotation-v0-dc9637b3-85e8-4599-9fe9-151508e9c850))

(define-condition-type &source-information &condition
                       make-source-condition source-condition?
                       (file-name source-filename)
                       (line source-line)
                       (column source-column))

(define (annotation-source->condition x)
  (if (vector? x)
      (apply make-source-condition (vector->list x))
      (condition)))

(define (reader-source reader)
  (vector (reader-filename reader)
          (reader-saved-line reader)
          (reader-saved-column reader)))

(define (annotate source stripped datum)
  #;(assert (reader? reader))
  (assert (vector? source))
  (make-annotation datum
                   source
                   stripped))

(define (read-annotated reader)
  (assert (reader? reader))
  (let ((labels (make-labels)))
    (let*-values (((type x) (get-lexeme reader))
                  ((_ d^) (handle-lexeme reader type x labels #f)))
      (resolve-labels reader labels)
      d^)))

(define (read-datum reader)
  (assert (reader? reader))
  (let ((labels (make-labels)))
    (let*-values (((type x) (get-lexeme reader))
                  ((d _) (handle-lexeme reader type x labels #f)))
      (resolve-labels reader labels)
      d)))

;;; Lexeme reader

(define (lexical-condition reader msg irritants)
  (condition
   (make-lexical-violation)
   (make-message-condition msg)
   (make-source-condition (reader-filename reader)
                          (reader-saved-line reader)
                          (reader-saved-column reader))
   (make-irritants-condition irritants)))

(define (reader-error reader msg . irritants)
  ;; Non-recoverable errors.
  (raise (lexical-condition reader msg irritants)))

(define (reader-warning reader msg . irritants)
  ;; Recoverable if the reader is in tolerant mode.
  (if (reader-tolerant? reader)
      (raise-continuable
        (condition
         (make-warning)
         (lexical-condition reader msg irritants)))
      (apply reader-error reader msg irritants)))

(define (assert-mode p msg modes)
  (unless (memq (reader-mode p) modes)
    (reader-warning p (string-append msg " is not allowed in this mode")
                    (reader-mode p))))

(define (eof-warning reader)
  (reader-warning reader "Unexpected EOF"))

(define (unicode-scalar-value? sv)
  (and (fx<=? 0 sv #x10FFFF)
       (not (fx<=? #xD800 sv #xDFFF))))

(define (char-delimiter? reader c)
  ;; Treats the eof-object as a delimiter
  (or (eof-object? c)
      (char-whitespace? c)
      (case (reader-mode reader)
        ((r6rs)
         (memv c '(#\( #\) #\[ #\] #\" #\; #\#)))
        ((r7rs)
         (memv c '(#\( #\) #\" #\; #\|)))
        (else
         (memv c '(#\( #\) #\[ #\] #\" #\; #\# #\|))))))

;; Get a line from the reader.
(define (get-line reader)
  (rnrs:call-with-string-output-port
   (lambda (out)
     (do ((c (get-char reader) (get-char reader)))
         ((or (eqv? c #\linefeed) (eof-object? c)))
       (rnrs:put-char out c)))))

;; Gets whitespace from the reader.
(define (get-whitespace reader char)
  (rnrs:call-with-string-output-port
   (lambda (out)
     (let lp ((char char))
       (rnrs:put-char out char)
       (let ((char (lookahead-char reader)))
         (when (and (char? char) (char-whitespace? char))
           (lp (get-char reader))))))))

;; Get an inline hex escape (escaped character inside an identifier).
(define (get-inline-hex-escape p)
  (reader-mark p)
  (let lp ((digits '()))
    (let ((c (get-char p)))
      (cond ((eof-object? c)
             (eof-warning p)
             #\xFFFD)
            ((or (char<=? #\0 c #\9)
                 (char-ci<=? #\a c #\f))
             (lp (cons c digits)))
            ((and (char=? c #\;) (pair? digits))
             (let ((sv (string->number (list->string (reverse digits)) 16)))
               (cond ((unicode-scalar-value? sv)
                      (integer->char sv))
                     (else
                      (reader-warning p "Inline hex escape outside valid range" sv)
                      #\xFFFD))))
            (else
             (reader-warning p "Invalid inline hex escape" c)
             #\xFFFD)))))

(define (get-identifier p initial-char pipe-quoted?)
  (let lp ((chars (if initial-char (list initial-char) '())))
    (let ((c (lookahead-char p)))
      (cond
        ((and (char? c)
              (or (char-ci<=? #\a c #\Z)
                  (char<=? #\0 c #\9)
                  (memv c '(#\! #\$ #\% #\& #\* #\/ #\: #\< #\= #\> #\? #\^ #\_ #\~
                            #\+ #\- #\. #\@))
                  (and (> (char->integer c) 127)
                       (memq (char-general-category c) ;XXX: could be done faster
                             '(Lu Ll Lt Lm Lo Mn Nl No Pd Pc Po Sc Sm Sk So Co Nd Mc Me)))
                  (and (memv (reader-mode p) '(rnrs r7rs))
                       (memv c '(#\x200C #\x200D)))))
         (lp (cons (get-char p) chars)))
        ((and pipe-quoted? (char? c) (not (memv c '(#\| #\\))))
         (lp (cons (get-char p) chars)))
        ((or (char-delimiter? p c) (and pipe-quoted? (eqv? c #\|)))
         (when (eqv? c #\|)
           (get-char p))
         (let ((id (list->string (reverse chars))))
           (if (reader-fold-case? p)
               (values 'identifier (string->symbol (string-foldcase id)))
               (values 'identifier (string->symbol id)))))
        ((char=? c #\\)           ;\xUUUU;
         (get-char p)             ;consume #\\
         (let ((c (get-char p)))  ;should be #\x
           (cond ((eqv? c #\x)
                  (lp (cons (get-inline-hex-escape p) chars)))
                 ((and pipe-quoted?
                       (assv c '((#\" . #\")
                                 (#\\ . #\\)
                                 (#\a . #\alarm)
                                 (#\b . #\backspace)
                                 (#\t . #\tab)
                                 (#\n . #\linefeed)
                                 (#\r . #\return)
                                 (#\| . #\|))))
                  => (lambda (c) (lp (cons (cdr c) chars))))
                 (else
                  (if (eof-object? c)
                      (eof-warning p)
                      (reader-warning p "Invalid character following \\"))
                  (lp chars)))))
        (else
         (reader-warning p "Invalid character in identifier" c)
         (get-char p)
         (lp chars))))))

;; Get a number from the reader.
(define (get-number p initial-chars)
  (let lp ((chars initial-chars))
    (let ((c (lookahead-char p)))
      (cond ((and (not (eqv? c #\#)) (char-delimiter? p c))
             ;; TODO: some standard numbers are not supported
             ;; everywhere, should use a number lexer.
             (let ((str (list->string (reverse chars))))
               (cond ((string->number str) =>
                      (lambda (num)
                        (values 'value num)))
                     ((and (memq (reader-mode p) '(rnrs r7rs))
                           ;; TODO: This is incomplete.
                           (not (and (pair? initial-chars)
                                     (char<=? #\0 (car initial-chars) #\9))))
                      (values 'identifier (string->symbol str)))
                     (else
                      (reader-warning p "Invalid number syntax" str)
                      (values 'identifier (string->symbol str))))))
            (else
             (lp (cons (get-char p) chars)))))))

;; Get a string datum from the reader.
(define (get-string p)
  (let lp ((chars '()))
    (let ((c (lookahead-char p)))
      (cond ((eof-object? c)
             (eof-warning p)
             c)
            ((char=? c #\")
             (get-char p)
             (list->string (reverse chars)))
            ((char=? c #\\)           ;escapes
             (get-char p)             ;consume #\\
             (let ((c (lookahead-char p)))
               (cond ((eof-object? c)
                      (eof-warning p)
                      c)
                     ((or (memv c '(#\tab #\linefeed #\x85 #\x2028))
                          (eq? (char-general-category c) 'Zs))
                      ;; \<intraline whitespace>*<line ending>
                      ;; <intraline whitespace>*
                      (letrec ((skip-intraline-whitespace*
                                (lambda ()
                                  (let ((c (lookahead-char p)))
                                    (cond ((eof-object? c)
                                           (eof-warning p)
                                           c)
                                          ((or (char=? c '#\tab)
                                               (eq? (char-general-category c) 'Zs))
                                           (get-char p)
                                           (skip-intraline-whitespace*))))))
                               (skip-newline
                                (lambda ()
                                  (let ((c (get-char p)))
                                    ;; XXX: it appears that the port
                                    ;; transcoder is meant to
                                    ;; replace all these linefeeds
                                    ;; with #\linefeed.
                                    (cond ((eof-object? c) c)
                                          ((memv c '(#\linefeed #\x85 #\x2028)))
                                          ((char=? c #\return)
                                           (when (memv (lookahead-char p)
                                                       '(#\linefeed #\x85))
                                             (get-char p)))
                                          (else
                                           (reader-warning p "Expected a line ending" c)))))))
                        (skip-intraline-whitespace*)
                        (skip-newline)
                        (skip-intraline-whitespace*)
                        (lp chars)))
                     (else
                      (lp (cons
                           (case (get-char p)
                             ((#\") #\")
                             ((#\\) #\\)
                             ((#\a) #\alarm)
                             ((#\b) #\backspace)
                             ((#\t) #\tab)
                             ((#\n) #\linefeed)
                             ((#\v) (assert-mode p "\\v" '(rnrs r6rs)) #\vtab)
                             ((#\f) (assert-mode p "\\f" '(rnrs r6rs)) #\page)
                             ((#\r) #\return)
                             ((#\|) (assert-mode p "\\|" '(rnrs r7rs)) #\|)
                             ((#\x) (get-inline-hex-escape p))
                             (else
                              (reader-warning p "Invalid escape in string" c)
                              #\xFFFD))
                           chars))))))
            (else
             (lp (cons (get-char p) chars)))))))

;; Gets a nested comment from the reader.
(define (get-nested-comment reader)
  ;; The reader is immediately after "#|".
  (rnrs:call-with-string-output-port
   (lambda (out)
     (let lp ((levels 1) (c0 (get-char reader)))
       (let ((c1 (get-char reader)))
         (cond ((eof-object? c0)
                (eof-warning reader))
               ((and (eqv? c0 #\|) (eqv? c1 #\#))
                (unless (eqv? levels 1)
                  (rnrs:put-char out c0)
                  (rnrs:put-char out c1)
                  (lp (- levels 1) (get-char reader))))
               ((and (eqv? c0 #\#) (eqv? c1 #\|))
                (rnrs:put-char out c0)
                (rnrs:put-char out c1)
                (lp (+ levels 1) (get-char reader)))
               (else
                (rnrs:put-char out c0)
                (lp levels c1))))))))

;; Gets a #! !# comment from the reader.
(define (get-!-comment reader)
  ;; The reader is immediately after "#!".
  (rnrs:call-with-string-output-port
   (lambda (out)
     (let lp ((c0 (get-char reader)))
       (let ((c1 (get-char reader)))
         (cond ((eof-object? c0)
                (eof-warning reader))
               ((and (eqv? c0 #\!) (eqv? c1 #\#))
                #f)
               (else
                (rnrs:put-char out c0)
                (lp c1))))))))

;; Get a comment from the reader (including the terminating whitespace).
(define (get-comment reader)
  ;; The reader is immediately after #\;.
  (rnrs:call-with-string-output-port
   (lambda (out)
     (let lp ()
       (let ((c (get-char reader)))
         (unless (eof-object? c)
           (rnrs:put-char out c)
           (cond ((memv c '(#\linefeed #\x85 #\x2028 #\x2029)))
                 ((char=? c #\return)
                  ;; Weird line ending. This lookahead is what forces
                  ;; the procedure to include the terminator.
                  (when (memv (lookahead-char reader) '(#\linefeed #\x85))
                    (rnrs:put-char out (get-char reader))))
                 (else
                  (lp)))))))))

;; Whitespace and comments can appear anywhere.
(define (atmosphere? type)
  (memq type '(directive whitespace comment inline-comment nested-comment)))

;; Get the next lexeme from the reader, ignoring anything that is
;; like a comment.
(define (get-lexeme p)
  (let-values (((type lexeme) (get-token p)))
    (if (atmosphere? type)
        (get-lexeme p)
        (values type lexeme))))

;; Get the next token. Can be a lexeme, directive, whitespace or comment.
(define (get-token p)
  (assert (reader? p))
  (reader-mark p)
  (let ((c (get-char p)))
    (cond
      ((eof-object? c)
       (values 'eof c))
      ((char-whitespace? c)
       (values 'whitespace (get-whitespace p c)))
      ((char=? c #\;)                 ;a comment like this one
       (values 'comment (get-comment p)))
      ((char=? c #\#)                 ;the mighty octothorpe
       (let ((c (get-char p)))
         (case c
           ((#\() (values 'vector #f))
           ((#\') (values 'abbrev 'syntax))
           ((#\`) (values 'abbrev 'quasisyntax))
           ((#\,)
            (case (lookahead-char p)
              ((#\@)
               (get-char p)
               (values 'abbrev 'unsyntax-splicing))
              (else (values 'abbrev 'unsyntax))))
           ((#\v)                       ;r6rs
            (let* ((c1 (and (eqv? (lookahead-char p) #\u) (get-char p)))
                   (c2 (and (eqv? c1 #\u) (eqv? (lookahead-char p) #\8) (get-char p)))
                   (c3 (and (eqv? c2 #\8) (eqv? (lookahead-char p) #\() (get-char p))))
              (cond ((and (eqv? c1 #\u) (eqv? c2 #\8) (eqv? c3 #\())
                     (assert-mode p "#vu8(" '(rnrs r6rs))
                     (values 'bytevector #f))
                    (else
                     (reader-warning p "Expected #vu8(")
                     (get-token p)))))
           ((#\u #\U)                   ;r7rs
            (let* ((c1 (and (eqv? (lookahead-char p) #\8) (get-char p)))
                   (c2 (and (eqv? c1 #\8) (eqv? (lookahead-char p) #\() (get-char p))))
              (cond ((and (eqv? c1 #\8) (eqv? c2 #\())
                     (assert-mode p "#u8(" '(rnrs r7rs))
                     (values 'bytevector #f))
                    (else
                     (reader-warning p "Expected #u8(")
                     (get-token p)))))
           ((#\;)                     ;s-expr/datum comment
            (let lp ((atmosphere '()))
              (let-values (((type token) (get-token p)))
                (cond ((eq? type 'eof)
                       (eof-warning p)
                       (values 'inline-comment (cons (reverse atmosphere) p)))
                      ((atmosphere? type)
                       (lp (cons (cons type token) atmosphere)))
                      (else
                       (let-values ([(d _) (handle-lexeme p type token #f #t)])
                         (values 'inline-comment (cons (reverse atmosphere) d))))))))
           ((#\|)                     ;nested comment
            (values 'nested-comment (get-nested-comment p)))
           ((#\!)                     ;#!r6rs etc
            (let ((next-char (lookahead-char p)))
              (cond ((and (= (reader-saved-line p) 1) (memv next-char '(#\/ #\space)))
                     (let ((line (reader-saved-line p))
                           (column (reader-saved-column p)))
                       (values 'shebang `(,line ,column ,(get-line p)))))
                    ((and (char? next-char) (char-alphabetic? next-char))
                     (let-values (((type id) (get-token p)))
                       (cond
                         ((eq? type 'identifier)
                          (case id
                            ((r6rs)          ;r6rs.pdf
                             (assert-mode p "#!r6rs" '(rnrs r6rs))
                             (reader-mode-set! p 'r6rs))
                            ((fold-case)     ;r6rs-app.pdf
                             (assert-mode p "#!fold-case" '(rnrs r6rs r7rs))
                             (reader-fold-case?-set! p #t))
                            ((no-fold-case)  ;r6rs-app.pdf
                             (assert-mode p "#!no-fold-case" '(rnrs r6rs r7rs))
                             (reader-fold-case?-set! p #f))
                            ((r7rs)          ;oddly missing in r7rs
                             (assert-mode p "#!r7rs" '(rnrs))
                             (reader-mode-set! p 'r7rs))
                            ((false)         ;r2rs
                             (assert-mode p "#!false" '(rnrs r2rs)))
                            ((true)          ;r2rs
                             (assert-mode p "#!true" '(rnrs r2rs)))
                            (else
                             (reader-warning p "Invalid directive" type id)))
                          (cond ((assq id '((false . #f) (true . #t)))
                                 => (lambda (x) (values 'value (cdr x))))
                                (else
                                 (values 'directive id))))
                         (else
                          (reader-warning p "Expected an identifier after #!")
                          (get-token p)))))
                    ((eq? (reader-mode p) 'rnrs)
                     ;; Guile compat.
                     (get-token p)
                     (values 'comment (get-!-comment p)))
                    (else
                     (reader-warning p "Expected an identifier after #!")
                     (get-token p)))))
           ((#\b #\B #\o #\O #\d #\D #\x #\X #\i #\I #\e #\E)
            (get-number p (list c #\#)))
           ((#\t #\T)
            (unless (char-delimiter? p (lookahead-char p))
              (if (memq (reader-mode p) '(rnrs r7rs))
                  (let* ((c1 (and (memv (lookahead-char p) '(#\r #\R)) (get-char p)))
                         (c2 (and c1 (memv (lookahead-char p) '(#\u #\U)) (get-char p)))
                         (c3 (and c2 (memv (lookahead-char p) '(#\e #\E)) (get-char p))))
                    (unless (and c1 c2 c3 (char-delimiter? p (lookahead-char p)))
                      (reader-warning p "Expected #true")))
                  (reader-warning p "A delimiter is expected after #t")))
            (values 'value #t))
           ((#\f #\F)
            (unless (char-delimiter? p (lookahead-char p))
              (if (memq (reader-mode p) '(rnrs r7rs))
                  (let* ((c1 (and (memv (lookahead-char p) '(#\a #\A)) (get-char p)))
                         (c2 (and c1 (memv (lookahead-char p) '(#\l #\L)) (get-char p)))
                         (c3 (and c2 (memv (lookahead-char p) '(#\s #\S)) (get-char p)))
                         (c4 (and c3 (memv (lookahead-char p) '(#\e #\E)) (get-char p))))
                    (unless (and c1 c2 c3 c4 (char-delimiter? p (lookahead-char p)))
                      (reader-warning p "Expected #false" c1 c2 c3 c4)))
                  (reader-warning p "A delimiter is expected after #f")))
            (values 'value #f))
           ((#\\)
            (let lp ((char* '()))
              (let ((c (lookahead-char p)))
                (cond ((and (pair? char*) (char-delimiter? p c))
                       (let ((char* (reverse char*)))
                         (cond ((null? char*)
                                (reader-warning p "Empty character name")
                                (values 'value #\xFFFD))
                               ((null? (cdr char*)) (values 'value (car char*)))
                               ((char=? (car char*) #\x)
                                (cond ((for-all (lambda (c)
                                                  (or (char<=? #\0 c #\9)
                                                      (char-ci<=? #\a c #\f)))
                                                (cdr char*))
                                       (let ((sv (string->number (list->string (cdr char*)) 16)))
                                         (cond ((unicode-scalar-value? sv)
                                                (values 'value (integer->char sv)))
                                               (else
                                                (reader-warning p "Hex-escaped character outside valid range" sv)
                                                (values 'value #\xFFFD)))))
                                      (else
                                       (reader-warning p "Invalid character in hex-escaped character"
                                                       (list->string (cdr char*)))
                                       (values 'value #\xFFFD))))
                               (else
                                (let ((char-name (list->string char*))
                                      (char-names '(("nul" #\nul r6rs)
                                                    ("null" #\nul r7rs)
                                                    ("alarm" #\alarm r6rs r7rs)
                                                    ("backspace" #\backspace r6rs r7rs)
                                                    ("tab" #\tab r6rs r7rs)
                                                    ("linefeed" #\linefeed r6rs)
                                                    ("newline" #\linefeed r5rs r6rs r7rs)
                                                    ("vtab" #\vtab r6rs)
                                                    ("page" #\page r6rs)
                                                    ("return" #\return r6rs r7rs)
                                                    ("esc" #\esc r6rs)
                                                    ("escape" #\esc r7rs)
                                                    ("space" #\space r5rs r6rs r7rs)
                                                    ("delete" #\delete r6rs r7rs))))
                                  (cond
                                    ((or (assoc char-name char-names)
                                         (and (reader-fold-case? p)
                                              (assoc (string-foldcase char-name)
                                                     char-names)))
                                     => (lambda (char-data)
                                          (assert-mode p char-name (cons 'rnrs (cddr char-data)))
                                          (values 'value (cadr char-data))))
                                    (else
                                     (reader-warning p "Invalid character name" char-name)
                                     (values 'value #\xFFFD))))))))
                      ((and (null? char*) (eof-object? c))
                       (eof-warning p)
                       (values 'value #\xFFFD))
                      (else
                       (lp (cons (get-char p) char*)))))))
           ((#\0 #\1 #\2 #\3 #\4 #\5 #\6 #\7 #\8 #\9)
            (assert-mode p "#<n>=<datum> and #<n>#" '(rnrs r7rs))
            (let lp ((char* (list c)))
              (let ((next (lookahead-char p)))
                (cond
                  ((eof-object? next)
                   (eof-warning p)
                   (get-char p))
                  ((char<=? #\0 next #\9)
                   (lp (cons (get-char p) char*)))
                  ((char=? next #\=)
                   (get-char p)
                   (values 'label (string->number (list->string (reverse char*)) 10)))
                  ((char=? next #\#)
                   (get-char p)
                   (values 'reference (string->number (list->string (reverse char*)) 10)))
                  (else
                   (reader-warning p "Expected #<n>=<datum> or #<n>#" next)
                   (get-token p))))))
           (else
            (reader-warning p "Invalid #-syntax" c)
            (get-token p)))))
      ((char=? c #\")
       (values 'value (get-string p)))
      ((memv c '(#\0 #\1 #\2 #\3 #\4 #\5 #\6 #\7 #\8 #\9))
       (get-number p (list c)))
      ((memv c '(#\- #\+))            ;peculiar identifier
       (cond ((and (char=? c #\-) (eqv? #\> (lookahead-char p))) ;->
              (get-identifier p c #f))
             ((char-delimiter? p (lookahead-char p))
              (values 'identifier (if (eqv? c #\-) '- '+)))
             (else
              (get-number p (list c)))))
      ((char=? c #\.)                 ;peculiar identifier
       (cond ((char-delimiter? p (lookahead-char p))
              (values 'dot #f))
             ((and (eq? (reader-mode p) 'r6rs)
                   (eqv? #\. (lookahead-char p)))
              (get-char p)            ;consume second dot
              (unless (eqv? #\. (get-char p)) ;consume third dot
                (reader-warning p "Expected the ... identifier"))
              (unless (char-delimiter? p (lookahead-char p))
                (reader-warning p "Expected the ... identifier"))
              (values 'identifier '...))
             (else
              (get-number p (list c)))))
      ((or (char-ci<=? #\a c #\Z) ;<constituent> and <special initial>
           (memv c '(#\! #\$ #\% #\& #\* #\/ #\: #\< #\= #\> #\? #\^ #\_ #\~))
           (and (memv (reader-mode p) '(rnrs r7rs))
                (or (eqv? c #\@) (memv c '(#\x200C #\x200D))))
           (and (> (char->integer c) 127)
                (memq (char-general-category c)
                      '(Lu Ll Lt Lm Lo Mn Nl No Pd Pc Po Sc Sm Sk So Co))))
       (get-identifier p c #f))
      ((char=? c #\\)                 ;<inline hex escape>
       (let ((c (get-char p)))
         (cond ((eqv? c #\x)
                (get-identifier p (get-inline-hex-escape p) #f))
               (else
                (cond ((eof-object? c)
                       (eof-warning p))
                      (else
                       (reader-warning p "Invalid character following \\")))
                (get-token p)))))
      (else
       (case c
         ((#\() (values 'openp #f))
         ((#\)) (values 'closep #f))
         ((#\[) (values 'openb #f))
         ((#\]) (values 'closeb #f))
         ((#\') (values 'abbrev 'quote))
         ((#\`) (values 'abbrev 'quasiquote))
         ((#\,)
          (case (lookahead-char p)
            ((#\@)
             (get-char p)
             (values 'abbrev 'unquote-splicing))
            (else (values 'abbrev 'unquote))))
         ((#\|)
          (assert-mode p "Quoted identifiers" '(rnrs r7rs))
          (get-identifier p #f 'pipe))
         (else
          (reader-warning p "Invalid leading character" c)
          (get-token p)))))))

;;; Datum reader

;; <datum> → <lexeme datum>
;;          | <compound datum>
;; <lexeme datum> → <boolean> | <number>
;;          | <character> | <string> | <symbol>
;; <symbol> → <identifier>
;; <compound datum> → <list> | <vector> | <bytevector>
;; <list> → (<datum>*) | [<datum>*]
;;          | (<datum>+ . <datum>) | [<datum>+ . <datum>]
;;          | <abbreviation>
;; <abbreviation> → <abbrev prefix> <datum>
;; <abbrev prefix> → ' | ` | , | ,@
;;          | #' | #` | #, | #,@
;; <vector> → #(<datum>*)
;; <bytevector> → #vu8(<u8>*)
;; <u8> → 〈any <number> representing an exact
;;                    integer in {0, ..., 255}〉

(define (get-compound-datum p src terminator type labels)
  (define vec #f)                     ;TODO: ugly, should be rewritten
  (define vec^ #f)
  (let lp ((head '()) (head^ '()) (prev #f) (prev^ #f) (len 0))
    (let-values (((lextype x) (get-lexeme p)))
      (case lextype
        ((closep closeb eof)
         (unless (eq? lextype terminator)
           (if (eof-object? x)
               (eof-warning p)
               (reader-warning p "Mismatched parenthesis/brackets" lextype x terminator)))
         (case type
           ((vector)
            (let ((s (list->vector head))
                  (s^ (list->vector head^)))
              (set! vec s)
              (set! vec^ (annotate src s s^))
              (values vec vec^)))
           ((list)
            (values head (annotate src head head^)))
           ((bytevector)
            (let ((s (u8-list->bytevector head)))
              (values s (annotate src s s))))
           (else
            (reader-error p "Internal error in get-compound-datum" type))))
        ((dot)                          ;a dot like in (1 . 2)
         (cond
           ((eq? type 'list)
            (let*-values (((lextype x) (get-lexeme p))
                          ((d d^) (handle-lexeme p lextype x labels #t)))
              (let-values (((termtype _) (get-lexeme p)))
                (cond ((eq? termtype terminator))
                      ((eq? termtype 'eof)
                       (eof-warning p))
                      (else
                       (reader-warning p "Improperly terminated dot list"))))
              (cond ((pair? prev)
                     (cond ((eq? d^ 'reference)
                            (register-reference p labels d
                                                (lambda (d d^)
                                                  (set-cdr! prev d)
                                                  (set-cdr! prev^ d^))))
                           (else
                            (set-cdr! prev d)
                            (set-cdr! prev^ d^))))
                    (else
                     (reader-warning p "Unexpected dot")))
              (values head (annotate src head head^))))
           (else
            (reader-warning p "Dot used in non-list datum")
            (lp head head^ prev prev^ len))))
        (else
         (let-values (((d d^) (handle-lexeme p lextype x labels #t)))
           (cond
             ((and (eq? type 'bytevector)
                   (or (eq? d^ 'reference)
                       (not (and (fixnum? d) (fx<=? 0 d 255)))))
              (reader-warning p "Invalid datum in bytevector" x)
              (lp head head^ prev prev^ len))
             (else
              (let ((new-prev (cons d '()))
                    (new-prev^ (cons d^ '())))
                (when (pair? prev)
                  (set-cdr! prev new-prev)
                  (set-cdr! prev^ new-prev^))
                (when (eq? d^ 'reference)
                  (register-reference p labels d
                                      (if (eq? type 'vector)
                                          (lambda (d d^)
                                            (vector-set! vec len d)
                                            (vector-set! (annotation-expression vec^)
                                                         len d^))
                                          (lambda (d d^)
                                            (set-car! new-prev d)
                                            (set-car! new-prev^ d^)))))
                (if (pair? head)
                    (lp head head^ new-prev new-prev^ (fx+ len 1))
                    (lp new-prev new-prev^ new-prev new-prev^ (fx+ len 1))))))))))))

(define (handle-lexeme p lextype x labels allow-refs?)
  (let ((src (reader-source p)))
    (case lextype
      ((openp)
       (get-compound-datum p src 'closep 'list labels))
      ((openb)
       (assert-mode p "Square brackets" '(rnrs r6rs))
       (get-compound-datum p src 'closeb 'list labels))
      ((vector)
       (get-compound-datum p src 'closep 'vector labels))
      ((bytevector)
       ;; TODO: open-bytevector-output-port would be faster
       (get-compound-datum p src 'closep 'bytevector labels))
      ((value eof identifier)
       (values x (annotate src x x)))
      ((abbrev)
       (let-values (((type lex) (get-lexeme p)))
         (cond ((eq? type 'eof)
                (eof-warning p)
                (values lex lex))
               (else
                (let-values (((d d^) (handle-lexeme p type lex labels #t)))
                  (let ((s (list x d)))
                    (values s (annotate src s (list x d^)))))))))
      ((label)
       ;; The object that follows this label can be referred
       ;; back from elsewhere.
       (let*-values (((lextype lexeme) (get-lexeme p))
                     ((d d^) (handle-lexeme p lextype lexeme labels allow-refs?)))
         (register-label p labels x d d^)
         (values d d^)))
      (else
       (cond ((and allow-refs? (eq? lextype 'reference))
              (values x 'reference))    ;XXX: different return types
             (else
              ;; Ignore the shebang ("#!/" or "#! " at the start of files).
              ;; FIXME: should only work for programs.
              (unless (and (eq? lextype 'shebang) (eqv? (car x) 1) (eqv? (cadr x) 0))
                (reader-warning p "Unexpected lexeme" lextype x))
              (let-values (((lextype x) (get-lexeme p)))
                (handle-lexeme p lextype x labels allow-refs?))))))))

;;; Shared/circular data

(define (make-labels)
  (make-eqv-hashtable))

(define (register-label p labels label datum annotated-datum)
  (when labels
    (hashtable-update! labels label (lambda (old)
                                      (when (car old)
                                        (reader-warning p "Duplicate label" label))
                                      (cons (cons datum annotated-datum)
                                            (cdr old)))
                       (cons #f '()))))

(define (register-reference _p labels label setter)
  (when labels
    (hashtable-update! labels label (lambda (old)
                                      (cons (car old)
                                            (cons setter (cdr old))))
                       (cons #f '()))))

(define (resolve-labels p labels)
  (let-values (((ids datum/refs*) (hashtable-entries labels)))
    (vector-for-each
     (lambda (id datum/refs)
       (let ((datum (car datum/refs))
             (refs (cdr datum/refs)))
         (unless datum
           (reader-warning p "Missing label" id))
         (for-each (lambda (ref)
                     (ref (car datum) (cdr datum)))
                   refs)))
     ids datum/refs*))))
