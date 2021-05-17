#!r6rs
(library (srfi :111 boxes)
  (export box box? unbox set-box!)
  (import (only (chezscheme) box box? unbox set-box!)))
