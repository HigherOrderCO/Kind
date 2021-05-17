#!r6rs
(library (srfi :51 rest-values)
  (export rest-values arg-and arg-ands err-and err-ands arg-or arg-ors err-or err-ors)
  (import (except (rnrs) error) (only (srfi :1) every append-reverse)
          (srfi :23) (srfi private include))

  (include/resolve ("srfi" "%3a51") "srfi-51-impl.scm"))
