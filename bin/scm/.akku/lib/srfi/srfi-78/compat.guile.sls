#!r6rs
(library (srfi srfi-78 compat)
  (export (rename (pretty-print check:write)))
  (import (only (ice-9 pretty-print) pretty-print)))
