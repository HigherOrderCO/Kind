#!r6rs
(library (srfi :156 predicate-combiners)
  (export is isnt)
  (import (rnrs) (srfi private include))

  (include/resolve ("srfi" "%3a156") "srfi-156-impl.scm"))
