#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :13 strings)
  (export
    string-map string-map!
    string-fold       string-unfold
    string-fold-right string-unfold-right
    string-tabulate string-for-each string-for-each-index
    string-every string-any
    string-hash string-hash-ci
    string-compare string-compare-ci
    string=    string<    string>    string<=    string>=    string<>
    string-ci= string-ci< string-ci> string-ci<= string-ci>= string-ci<>
    string-downcase  string-upcase  string-titlecase
    string-downcase! string-upcase! string-titlecase!
    string-take string-take-right
    string-drop string-drop-right
    string-pad string-pad-right
    string-trim string-trim-right string-trim-both
    string-filter string-delete
    string-index string-index-right
    string-skip  string-skip-right
    string-count
    string-prefix-length string-prefix-length-ci
    string-suffix-length string-suffix-length-ci
    string-prefix? string-prefix-ci?
    string-suffix? string-suffix-ci?
    string-contains string-contains-ci
    string-copy! substring/shared
    string-reverse string-reverse! reverse-list->string
    string-concatenate string-concatenate/shared string-concatenate-reverse
    string-concatenate-reverse/shared
    string-append/shared
    xsubstring string-xcopy!
    string-null?
    string-join
    string-tokenize
    string-replace
    ; R5RS extended:
    string->list string-copy string-fill!
    ; R5RS re-exports:
    string? make-string string-length string-ref string-set!
    string string-append list->string
    ; Low-level routines:
    #;(make-kmp-restart-vector string-kmp-partial-search kmp-step
    string-parse-start+end
    string-parse-final-start+end
    let-string-start+end
    check-substring-spec
    substring-spec-ok?)
    )
  (import
    (except (rnrs) string-copy string-for-each string->list
                   string-upcase string-downcase string-titlecase string-hash)
    (except (rnrs mutable-strings) string-fill!)
    (rnrs r5rs)
    (srfi :23 error tricks)
    (srfi :8 receive)
    (srfi :14 char-sets)
    (srfi private check-arg)
    (srfi private let-opt)
    (srfi private include))

  (define (char-cased? c)
    (char-upper-case? (char-upcase c)))

  (SRFI-23-error->R6RS "(library (srfi :13 strings))"
   (include/resolve ("srfi" "%3a13") "srfi-13.scm"))
)
