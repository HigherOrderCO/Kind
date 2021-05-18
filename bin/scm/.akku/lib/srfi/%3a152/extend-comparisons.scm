;;; Extend comparisons to 0 and 1 arguments.
;; 2017-10-04 Sudarshan S Chawathe <chaw@eip10.org>

;; For each (name . base-name) pair in arguments, define name to be
;; comparison procedure similar to base-name, but allow it to accept 0
;; or 1 arguments in addition to more (as permitted by base-name),
;; returning true in the former cases.
(define-syntax define-comparison/base/pairs
  (syntax-rules ()
    ((_ (name . base-name) ...)
     (begin
       (define (name . strs)
         (or (null? strs)
             (null? (cdr strs))
             (apply base-name strs))) ...))))

;; Extend the usual string comparison procedures as above.
(define-comparison/base/pairs
  (string=? . base-string=?)
  (string<? . base-string<?)
  (string>? . base-string>?)
  (string<=? . base-string<=?)
  (string>=? . base-string>=?)
  (string-ci=? . base-string-ci=?)
  (string-ci<? . base-string-ci<?)
  (string-ci>? . base-string-ci>?)
  (string-ci<=? . base-string-ci<=?)
  (string-ci>=? . base-string-ci>=?))

;;;
