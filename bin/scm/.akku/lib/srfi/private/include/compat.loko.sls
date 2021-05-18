;; Copyright © 2019 Göran Weinholt
;; SPDX-License-Identifier: MIT
#!r6rs

(library (srfi private include compat)
  (export (rename (library-directories search-paths)))
  (import (only (loko) library-directories)))
