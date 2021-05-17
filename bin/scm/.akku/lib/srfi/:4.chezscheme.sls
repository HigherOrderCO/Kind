#!r6rs
;; SRFI-4 r6rs library entry
;;
;; Copyright (c) 2018 - 2020 Andrew W. Keep
;;
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to
;; deal in the Software without restriction, including without limitation the
;; rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
;; sell copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;;
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;;
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
;; THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
;; DEALINGS IN THE SOFTWARE.

(library (srfi :4)
  (export
    s8vector? make-s8vector s8vector s8vector-length s8vector-ref s8vector-set!
    s8vector->list list->s8vector

    s16vector? make-s16vector s16vector s16vector-length s16vector-ref
    s16vector-set! s16vector->list list->s16vector

    s32vector? make-s32vector s32vector s32vector-length s32vector-ref
    s32vector-set! s32vector->list list->s32vector

    s64vector? make-s64vector s64vector s64vector-length s64vector-ref
    s64vector-set! s64vector->list list->s64vector
    
    u8vector? make-u8vector u8vector u8vector-length u8vector-ref u8vector-set!
    u8vector->list list->u8vector

    u16vector? make-u16vector u16vector u16vector-length u16vector-ref
    u16vector-set! u16vector->list list->u16vector

    u32vector? make-u32vector u32vector u32vector-length u32vector-ref
    u32vector-set! u32vector->list list->u32vector

    u64vector? make-u64vector u64vector u64vector-length u64vector-ref
    u64vector-set! u64vector->list list->u64vector

    f32vector? make-f32vector f32vector f32vector-length f32vector-ref
    f32vector-set! f32vector->list list->f32vector

    f64vector? make-f64vector f64vector f64vector-length f64vector-ref
    f64vector-set! f64vector->list list->f64vector)
  (import (srfi :4 numeric-vectors)))
