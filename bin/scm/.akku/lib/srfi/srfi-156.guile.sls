#!r6rs
(library (srfi srfi-156)
  (export is isnt)
  (import (rnrs) (srfi private include))

  (include/resolve ("srfi" "%3a156") "srfi-156-impl.scm"))
