#!r6rs
;; Automatically generated
;; Copyright 2019 Lassi Kortela
;; SPDX-License-Identifier: MIT
(library (srfi :175)
         (export ascii-codepoint?
                 ascii-bytevector?
                 ascii-char?
                 ascii-string?
                 ascii-control?
                 ascii-non-control?
                 ascii-whitespace?
                 ascii-space-or-tab?
                 ascii-other-graphic?
                 ascii-upper-case?
                 ascii-lower-case?
                 ascii-alphabetic?
                 ascii-alphanumeric?
                 ascii-numeric?
                 ascii-digit-value
                 ascii-upper-case-value
                 ascii-lower-case-value
                 ascii-nth-digit
                 ascii-nth-upper-case
                 ascii-nth-lower-case
                 ascii-upcase
                 ascii-downcase
                 ascii-control->graphic
                 ascii-graphic->control
                 ascii-mirror-bracket
                 ascii-ci=?
                 ascii-ci<?
                 ascii-ci>?
                 ascii-ci<=?
                 ascii-ci>=?
                 ascii-string-ci=?
                 ascii-string-ci<?
                 ascii-string-ci>?
                 ascii-string-ci<=?
                 ascii-string-ci>=?)
         (import (rnrs))
         (define (ensure-int x) (if (char? x) (char->integer x) x))
         (define (base-offset-limit x base offset limit)
           (let ((cc (ensure-int x)))
             (and (fx>=? cc base)
                  (fx<? cc (fx+ base limit))
                  (fx+ offset (fx- cc base)))))
         (define (char->int->char map-int char)
           (let ((int (map-int (char->integer char))))
             (and int (integer->char int))))
         (define (ascii-codepoint? x) (and (fixnum? x) (fx<=? 0 x 127)))
         (define (ascii-char? x) (and (char? x) (fx<? (char->integer x) 128)))
         (define (ascii-bytevector? x)
           (and (bytevector? x)
                (let check ((i (fx- (bytevector-length x) 1)))
                  (or (fx<? i 0)
                      (and (fx<? (bytevector-u8-ref x i) 128)
                           (check (fx- i 1)))))))
         (define (ascii-string? x)
           (and (string? x)
                (call-with-port (open-string-input-port x)
                  (lambda (in)
                    (let check ()
                      (let ((char (read-char in)))
                        (or (eof-object? char)
                            (and (fx<? (char->integer char) 128) (check)))))))))
         (define (ascii-control? x)
           (let ((cc (ensure-int x))) (or (fx<=? 0 cc 31) (fx=? cc 127))))
         (define (ascii-non-control? x)
           (let ((cc (ensure-int x))) (fx<=? 32 cc 126)))
         (define (ascii-whitespace? x)
           (let ((cc (ensure-int x)))
             (cond ((fx<? cc 9) #f) ((fx<? cc 14) #t) (else (fx=? cc 32)))))
         (define (ascii-space-or-tab? x)
           (let ((cc (ensure-int x))) (case cc ((9 32) #t) (else #f))))
         (define (ascii-other-graphic? x)
           (let ((cc (ensure-int x)))
             (or (fx<=? 33 cc 47)
                 (fx<=? 58 cc 64)
                 (fx<=? 91 cc 96)
                 (fx<=? 123 cc 126))))
         (define (ascii-upper-case? x)
           (let ((cc (ensure-int x))) (fx<=? 65 cc 90)))
         (define (ascii-lower-case? x)
           (let ((cc (ensure-int x))) (fx<=? 97 cc 122)))
         (define (ascii-alphabetic? x)
           (let ((cc (ensure-int x))) (or (fx<=? 65 cc 90) (fx<=? 97 cc 122))))
         (define (ascii-alphanumeric? x)
           (let ((cc (ensure-int x)))
             (or (fx<=? 48 cc 57) (fx<=? 65 cc 90) (fx<=? 97 cc 122))))
         (define (ascii-numeric? x)
           (let ((cc (ensure-int x))) (fx<=? 48 cc 57)))
         (define (ascii-digit-value x limit)
           (base-offset-limit x 48 0 (min limit 10)))
         (define (ascii-upper-case-value x offset limit)
           (base-offset-limit x 65 offset (min limit 26)))
         (define (ascii-lower-case-value x offset limit)
           (base-offset-limit x 97 offset (min limit 26)))
         (define (ascii-nth-digit n)
           (and (fx<=? 0 n 9) (integer->char (fx+ 48 n))))
         (define (ascii-nth-upper-case n)
           (integer->char (fx+ 65 (fxmod n 26))))
         (define (ascii-nth-lower-case n)
           (integer->char (fx+ 97 (fxmod n 26))))
         (define (ascii-upcase x)
           (if (char? x)
               (integer->char (ascii-upcase (char->integer x)))
               (or (ascii-lower-case-value x 65 26) x)))
         (define (ascii-downcase x)
           (if (char? x)
               (integer->char (ascii-downcase (char->integer x)))
               (or (ascii-upper-case-value x 97 26) x)))
         (define (ascii-control->graphic x)
           (if (char? x)
               (char->int->char ascii-control->graphic x)
               (or (and (fx<=? 0 x 31) (fx+ x 64)) (and (fx=? x 127) 63))))
         (define (ascii-graphic->control x)
           (if (char? x)
               (char->int->char ascii-graphic->control x)
               (or (and (fx<=? 64 x 95) (fx- x 64)) (and (fx=? x 63) 127))))
         (define (ascii-mirror-bracket x)
           (if (char? x)
               (case x
                 ((#\() #\))
                 ((#\)) #\()
                 ((#\[) #\])
                 ((#\]) #\[)
                 ((#\{) #\})
                 ((#\}) #\{)
                 ((#\<) #\>)
                 ((#\>) #\<)
                 (else #f))
               (let ((x (ascii-mirror-bracket (integer->char x))))
                 (and x (char->integer x)))))
         (define (ascii-ci-cmp char1 char2)
           (let ((cc1 (ensure-int char1)) (cc2 (ensure-int char2)))
             (when (fx<=? 65 cc1 90) (set! cc1 (fx+ cc1 32)))
             (when (fx<=? 65 cc2 90) (set! cc2 (fx+ cc2 32)))
             (cond ((fx<? cc1 cc2) -1) ((fx>? cc1 cc2) 1) (else 0))))
         (define (ascii-ci=? char1 char2) (fx=? (ascii-ci-cmp char1 char2) 0))
         (define (ascii-ci<? char1 char2) (fx<? (ascii-ci-cmp char1 char2) 0))
         (define (ascii-ci>? char1 char2) (fx>? (ascii-ci-cmp char1 char2) 0))
         (define (ascii-ci<=? char1 char2)
           (fx<=? (ascii-ci-cmp char1 char2) 0))
         (define (ascii-ci>=? char1 char2)
           (fx>=? (ascii-ci-cmp char1 char2) 0))
         (define (ascii-string-ci-cmp string1 string2)
           (call-with-port (open-string-input-port string1)
             (lambda (in1)
               (call-with-port (open-string-input-port string2)
                 (lambda (in2)
                   (let loop ()
                     (let ((char1 (read-char in1)) (char2 (read-char in2)))
                       (cond
                        ((eof-object? char1) (if (eof-object? char2) 0 -1))
                        ((eof-object? char2) 1)
                        (else
                         (let ((cc1 (char->integer char1))
                               (cc2 (char->integer char2)))
                           (when (fx<=? 65 cc1 90) (set! cc1 (fx+ cc1 32)))
                           (when (fx<=? 65 cc2 90) (set! cc2 (fx+ cc2 32)))
                           (cond ((fx<? cc1 cc2) -1)
                                 ((fx>? cc1 cc2) 1)
                                 (else (loop)))))))))))))
         (define (ascii-string-ci=? string1 string2)
           (fx=? (ascii-string-ci-cmp string1 string2) 0))
         (define (ascii-string-ci<? string1 string2)
           (fx<? (ascii-string-ci-cmp string1 string2) 0))
         (define (ascii-string-ci>? string1 string2)
           (fx>? (ascii-string-ci-cmp string1 string2) 0))
         (define (ascii-string-ci<=? string1 string2)
           (fx<=? (ascii-string-ci-cmp string1 string2) 0))
         (define (ascii-string-ci>=? string1 string2)
           (fx>=? (ascii-string-ci-cmp string1 string2) 0)))
