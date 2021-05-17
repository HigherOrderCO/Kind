#!r6rs
(library (srfi srfi-48 compat)
  (export pretty-print)
  (import (only (ice-9 pretty-print) pretty-print)))
