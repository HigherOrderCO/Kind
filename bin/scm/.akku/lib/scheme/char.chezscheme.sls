;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme char)
  (export
    char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=?
    char-ci>? char-downcase char-foldcase char-lower-case?
    char-numeric? char-upcase char-upper-case? char-whitespace?
    digit-value string-ci<=? string-ci<? string-ci=?
    string-ci>=? string-ci>? string-downcase string-foldcase
    string-upcase)
  (import
    (rnrs)
    (only (srfi :43 vectors) vector-binary-search))

;; The table can be extracted with:
;; awk -F ';' '/ZERO;Nd/ {print "#x"$1}' UnicodeData.txt
;; Up to date with Unicode 11.0.0

(define *decimal-zeroes* '#(#x0030 #x0660 #x06F0 #x07C0 #x0966 #x09E6
  #x0A66 #x0AE6 #x0B66 #x0BE6 #x0C66 #x0CE6 #x0D66 #x0DE6 #x0E50
  #x0ED0 #x0F20 #x1040 #x1090 #x17E0 #x1810 #x1946 #x19D0 #x1A80
  #x1A90 #x1B50 #x1BB0 #x1C40 #x1C50 #xA620 #xA8D0 #xA900 #xA9D0
  #xA9F0 #xAA50 #xABF0 #xFF10 #x104A0 #x10D30 #x11066 #x110F0 #x11136
  #x111D0 #x112F0 #x11450 #x114D0 #x11650 #x116C0 #x11730 #x118E0
  #x11C50 #x11D50 #x11DA0 #x16A60 #x16B50 #x1D7CE #x1D7D8 #x1D7E2
  #x1D7EC #x1D7F6 #x1E950))

(define (digit-value char)
  (define (cmp zero ch)
    (if (integer? ch)
        (- (cmp zero ch))
        (let ((i (char->integer ch)))
          (cond ((< i zero) 1)
                ((> i (+ zero 9)) -1)
                (else 0)))))
  (unless (char? char)
    (assertion-violation 'digit-value "Expected a char" char))
  (cond
    ((char<=? #\0 char #\9)             ;fast case
     (- (char->integer char) (char->integer #\0)))
    ((vector-binary-search *decimal-zeroes* char cmp)
     => (lambda (zero)
          (- (char->integer char)
             (vector-ref *decimal-zeroes* zero))))
    (else #f))))
