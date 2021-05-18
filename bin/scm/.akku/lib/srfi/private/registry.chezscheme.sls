#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi private registry)
  (export
    expand-time-features
    run-time-features
    available-features)
  (import
    (rnrs)
    (srfi private registry-names)
    (for (prefix (srfi private platform-features) platform-)
         run expand))

  (define-syntax make-expand-time-features
    (lambda (_)
      (define (SRFI-names x)
        (define number car)
        (define mnemonic cdr)
        (define (make-symbol . args)
          (string->symbol (apply string-append
                                 (map (lambda (a)
                                        (if (symbol? a) (symbol->string a) a))
                                      args))))
        (let* ((n-str (number->string (number x)))
               (colon-n (make-symbol ":" n-str))
               (srfi-n (make-symbol "srfi-" n-str))
               (srfi-n-m (apply make-symbol srfi-n
                                (map (lambda (m) (make-symbol "-" m))
                                     (mnemonic x)))))
          ;; The first two are recommended by SRFI-97.
          ;; The last two are the two types of SRFI-97 library name.
          (list srfi-n
                srfi-n-m
                `(srfi ,colon-n)
                `(srfi ,colon-n . ,(mnemonic x)))))
      (let ((s (apply append (map SRFI-names SRFIs)))
            (h (platform-expand-time-features))
            (o '(r6rs)))
        #`(quote #,(datum->syntax #'ignored (append s h o))))))

  (define expand-time-features (make-expand-time-features))

  (define run-time-features (platform-run-time-features))

  (define available-features (append run-time-features expand-time-features))
)
