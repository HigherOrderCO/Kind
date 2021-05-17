#!r6rs
;; Copyright (c) 2009-2015 Alex Shinn
;; All rights reserved.
;;
;; Redistribution and use in source and binary forms, with or without
;; modification, are permitted provided that the following conditions
;; are met:
;; 1. Redistributions of source code must retain the above copyright
;;    notice, this list of conditions and the following disclaimer.
;; 2. Redistributions in binary form must reproduce the above copyright
;;    notice, this list of conditions and the following disclaimer in the
;;    documentation and/or other materials provided with the distribution.
;; 3. The name of the author may not be used to endorse or promote products
;;    derived from this software without specific prior written permission.
;;
;; THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
;; IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
;; OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
;; IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
;; INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
;; NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
;; DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
;; THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
;; (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
;; THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

;; Converted from lib/chibi/regexp.sld to R6RS by Göran Weinholt.

(library (srfi :115 regexp)
  (export regexp regexp? valid-sre? rx regexp->sre char-set->sre
          regexp-matches regexp-matches? regexp-search
          regexp-replace regexp-replace-all
          regexp-fold regexp-extract regexp-split regexp-partition
          regexp-match? regexp-match-count
          regexp-match-submatch regexp-match-submatch/list
          regexp-match-submatch-start regexp-match-submatch-end
          regexp-match->list regexp-match->sexp)
  (import (rename (except (rnrs) define-record-type string-ci-hash string-hash
                          error)
                  (exists any))
          (only (rnrs r5rs) quotient)
          (rnrs mutable-pairs)
          (srfi :9 records)
          (srfi :14 char-sets)
          (srfi :23 error)
          (srfi :69 basic-hash-tables)
          (srfi :115 regexp boundary)
          (srfi private include))

  (define %char-set:letter
    (char-set-intersection char-set:ascii char-set:letter))
  (define %char-set:lower-case
    (char-set-intersection char-set:ascii char-set:lower-case))
  (define %char-set:upper-case
    (char-set-intersection char-set:ascii char-set:upper-case))
  (define %char-set:digit
    (char-set-intersection char-set:ascii char-set:digit))
  (define %char-set:letter+digit
    (char-set-intersection char-set:ascii char-set:letter+digit))
  (define %char-set:punctuation
    (char-set-intersection char-set:ascii char-set:punctuation))
  (define %char-set:symbol
    (char-set-intersection char-set:ascii char-set:symbol))
  (define %char-set:graphic
    (char-set-intersection char-set:ascii char-set:graphic))
  (define %char-set:whitespace
    (char-set-intersection char-set:ascii char-set:whitespace))
  (define %char-set:printing
    (char-set-intersection char-set:ascii char-set:printing))
  (define %char-set:iso-control
    (char-set-intersection char-set:ascii char-set:iso-control))

  (define (string-start-arg s o)
    (if (pair? o) (string-index->cursor s (car o)) 0))
  (define (string-end-arg s o)
    (if (pair? o) (string-index->cursor s (car o)) (string-length s)))
  (define string-cursor? integer?)
  (define string-cursor=? =)
  (define string-cursor<? <)
  (define string-cursor<=? <=)
  (define string-cursor>? >)
  (define string-cursor>=? >=)
  (define string-cursor-ref string-ref)
  (define (string-cursor-next s i) (+ i 1))
  (define (string-cursor-prev s i) (- i 1))
  (define substring-cursor substring)
  (define (string-cursor->index str off) off)
  (define (string-index->cursor str i) i)
  (define (string-concatenate ls) (apply string-append ls))
  (define (string-concatenate-reverse ls)
    (string-concatenate (reverse ls)))

  ;; Replaced |\|| with \x7C;.
  (include/resolve ("srfi" "%3a115") "regexp-impl.scm"))
