#!r6rs
;; SRFI-143 Chez Scheme helper implementation
;;
;; Imports the fxabs, fxremainder, and fxquotient procedures from Chez Scheme
;; for the SRFI-143 functions.
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :143 helpers)
  (export fxabs fxremainder fxquotient)
  (import (chezscheme)))
