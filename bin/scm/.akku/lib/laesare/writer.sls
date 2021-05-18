;; -*- mode: scheme; coding: utf-8 -*-
;; Copyright © 2019 Göran Weinholt <goran@weinholt.se>
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

;; RnRS writer

(library (laesare writer)
  (export
    put-token
    make-writer writer?
    writer-port writer-filename
    writer-mode writer-mode-set!)
  (import
    (rnrs (6)))

(define-record-type writer
  (fields port filename
          (mutable mode))
  (sealed #t) (opaque #f)
  (nongenerative writer-v0-d2dafa98-4344-400d-ba4d-633e6a1e9133)
  (protocol
   (lambda (p)
     (lambda (port filename)
       (p port filename 'rnrs)))))

(define (assert-mode writer modes type token)
  (unless (memq (writer-mode writer) modes)
    (assertion-violation 'put-token
                         "Token type is not supported in this mode"
                         type token (writer-mode writer))))

(define r7rs-char-names
  '((#\nul . "null")
    (#\alarm . "alarm")
    (#\backspace . "backspace")
    (#\tab . "tab")
    (#\linefeed . "newline")
    (#\vtab . #f)
    (#\page . #f)
    (#\return . "return")
    (#\esc . "escape")
    (#\space . "space")
    (#\delete . "delete")))

(define (put-token writer type token)
  (let ((p (writer-port writer)))
    (case type
      ((identifier)
       ;; FIXME: quoting according to R7RS
       (write token p))
      ((value)
       (cond
         ((and (eq? (writer-mode writer) 'r7rs)
               (assq token r7rs-char-names))
          => (lambda (name)
               (cond ((cdr name)
                      (put-string p "#\\")
                      (put-string p (cdr name)))
                     (else
                      (put-string p "#\\x")
                      (put-string p (string-downcase (number->string (char->integer token) 16)))))))
         ((eqv? token #\linefeed)
          (put-string p "#\\linefeed"))
         ((eqv? token #\esc)
          (if (eq? (writer-mode writer) 'r6rs)
              (put-string p "#\\esc")   ;workaround for Larceny 1.3
              (put-string p "#\\x1b")))
         ((and (char? token) (memq (char-general-category token) '(Cf Zp So)))
          (put-string p "#\\x")
          (put-string p (string-downcase (number->string (char->integer token) 16))))
         (else
          (write token p))))
      ((bytevector)
       (case (writer-mode writer)
         ((r6rs) (put-string p "#vu8("))
         ((r7rs) (put-string p "#u8("))
         (else
          (assertion-violation 'put-token "Bytevectors are not supported in this mode"
                               type token (writer-mode writer)))))
      ((directive)
       (put-string p "#!")
       (display token p)
       (case token
         ((r6rs) (writer-mode-set! writer 'r6rs))
         ((r7rs) (writer-mode-set! writer 'r7rs))
         (else (values))))

      ((openb)
       (case (writer-mode writer)
         ((r6rs) (put-char p #\[))
         (else (put-char p #\())))
      ((closeb)
       (case (writer-mode writer)
         ((r6rs) (put-char p #\]))
         (else (put-char p #\)))))

      ((abbrev)
       (case token
         ((quote) (put-string p "'"))
         ((quasiquote) (put-string p "`"))
         ((unquote) (put-string p ","))
         ((unquote-splicing) (put-string p ",@"))
         ((syntax)
          (assert-mode writer '(rnrs r6rs) type token)
          (put-string p "#'"))
         ((quasisyntax)
          (assert-mode writer '(rnrs r6rs) type token)
          (put-string p "#`"))
         ((unsyntax)
          (assert-mode writer '(rnrs r6rs) type token)
          (put-string p "#,"))
         ((unsyntax-splicing)
          (assert-mode writer '(rnrs r6rs) type token)
          (put-string p "#,@"))
         (else
          (assertion-violation 'put-token "Unrecognized abbreviation"
                               type token))))

      ((label reference)
       (assert-mode writer '(rnrs r7rs) type token)
       (put-string p "#")
       (display token p)
       (if (eq? type 'label)
           (put-string p "=")
           (put-string p "#")))

      ;; Mode independent

      ((dot)
       (put-char p #\.))
      ((inline-comment)
       (let ((atmosphere (car token))
             (datum (cdr token)))
         (put-string p "#;")
         (for-each (lambda (t+t)
                     (put-token writer (car t+t) (cdr t+t)))
                   atmosphere)
         (write datum p)))
      ((whitespace)
       (put-string p token))
      ((openp) (put-char p #\())
      ((closep) (put-char p #\)))
      ((vector) (put-string p "#("))
      ((shebang)
       (put-string p "#!")
       (put-string p (caddr token))
       (put-char p #\newline))
      ((comment)
       (put-char p #\;)
       (put-string p token))
      ((nested-comment)
       (put-string p "#|")
       (put-string p token)
       (put-string p "|#"))
      (else
       (assertion-violation 'put-token "Unrecognized token type"
                            type token))))))
