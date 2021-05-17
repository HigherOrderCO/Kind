;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme file)
  (export
    call-with-input-file call-with-output-file delete-file file-exists?
    open-binary-input-file open-binary-output-file
    open-input-file open-output-file with-input-from-file
    with-output-to-file)
  (import
    (rnrs))

(define (open-binary-input-file file)
  (open-file-input-port file))

(define (open-binary-output-file file)
  (open-file-output-port file)))
