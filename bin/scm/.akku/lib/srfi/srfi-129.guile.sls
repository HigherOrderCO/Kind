#!r6rs
(library (srfi srfi-129)
  (export char-title-case? char-titlecase string-titlecase)
  (import (except (rnrs) char-titlecase char-title-case? string-titlecase)
          (srfi private include))
  (include/resolve ("srfi" "%3a129") "titlemaps.scm")
  (include/resolve ("srfi" "%3a129") "titlecase-impl.scm"))
