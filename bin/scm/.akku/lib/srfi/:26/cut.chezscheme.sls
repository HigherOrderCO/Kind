#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :26 cut)
  (export cut cute <> <...>)
  (import (rnrs) (srfi private include))

  (include/resolve ("srfi" "%3a26") "cut-impl.scm")
)
