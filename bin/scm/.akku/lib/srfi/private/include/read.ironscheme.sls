#!r6rs

(library (srfi private include read)
  (export
    (rename (read-annotated read)))
  (import
    (only (ironscheme reader) read-annotated))
)
