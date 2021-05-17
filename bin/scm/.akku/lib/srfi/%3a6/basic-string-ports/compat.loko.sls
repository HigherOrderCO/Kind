;; Copyright © 2019 Göran Weinholt
;; SPDX-License-Identifier: MIT
#!r6rs

(library (srfi :6 basic-string-ports compat)
  (export open-output-string get-output-string)
  (import (only (loko) open-output-string get-output-string)))
