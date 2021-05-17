;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme complex)
  (export
    angle imag-part magnitude make-polar make-rectangular real-part)
  (import
    (rnrs)))
