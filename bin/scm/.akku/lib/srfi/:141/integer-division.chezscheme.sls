#!r6rs
(library (srfi :141 integer-division)
  (export
    ceiling/ ceiling-quotient ceiling-remainder
    floor/ floor-quotient floor-remainder
    truncate/ truncate-quotient truncate-remainder
    round/ round-quotient round-remainder
    euclidean/ euclidean-quotient euclidean-remainder
    balanced/ balanced-quotient balanced-remainder)
  (import (rnrs) (rnrs r5rs) (srfi private include))

  (include/resolve ("srfi" "%3a141") "srfi-141-impl.scm"))
