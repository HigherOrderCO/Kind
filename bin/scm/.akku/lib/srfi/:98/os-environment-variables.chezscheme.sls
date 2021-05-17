#!r6rs
;;; Copyright (c) 2012 Aaron W. Hsu <arcfide@sacrideo.us>
;;; 
;;; Permission to use, copy, modify, and distribute this software for
;;; any purpose with or without fee is hereby granted, provided that the
;;; above copyright notice and this permission notice appear in all
;;; copies.
;;; 
;;; THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
;;; WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
;;; WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
;;; AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
;;; DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
;;; OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
;;; TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
;;; PERFORMANCE OF THIS SOFTWARE.

(library (srfi :98 os-environment-variables)
  (export get-environment-variables
        (rename (getenv get-environment-variable)))
  (import (rnrs) (rnrs mutable-strings)
          (only (chezscheme) getenv string-copy! foreign-ref foreign-entry
                foreign-procedure machine-type load-shared-object ftype-sizeof))

  (define (get-environment-variables)
    (read-environ (get-environ-pointer)))

  (define-record-type text-buffer (nongenerative)
    (fields (mutable b) (mutable i))
    (protocol (lambda (new) (lambda () (new (make-string 20) 0)))))

  (define extend-buffer!
    (let ()
      (define (finish tb b i c)
        (string-set! b i c)
        (text-buffer-i-set! tb (fx+ i 1)))
      (lambda (tb c)
        (let ([b (text-buffer-b tb)]
              [i (text-buffer-i tb)])
          (if (fx=? i (string-length b))
              (let ([new-b (make-string (* i i))])
                (string-copy! b 0 new-b 0 i)
                (text-buffer-b-set! tb new-b)
                (finish tb new-b i c))
              (finish tb b i c))))))

  (define extract-and-clear-buffer!
    (lambda (tb)
      (let ([i (text-buffer-i tb)])
        (text-buffer-i-set! tb 0)
        (substring (text-buffer-b tb) 0 i))))

  (define read-entry
    (let ()
      (define (s0 ptr offset tb)
        (let ([c (foreign-ref 'char ptr offset)])
          (cond
            [(char=? c #\nul)
             (values (cons (extract-and-clear-buffer! tb) #f)
                     (fx+ offset (ftype-sizeof char)))]
            [(char=? c #\=)
             (s1 ptr (fx+ offset (ftype-sizeof char))
                 tb (extract-and-clear-buffer! tb))]
            [else
             (extend-buffer! tb c) 
             (s0 ptr (fx+ offset (ftype-sizeof char)) tb)])))
      (define (s1 ptr offset tb key)
        (let ([c (foreign-ref 'char ptr offset)])
          (cond
            [(char=? c #\nul)
             (values (cons key (extract-and-clear-buffer! tb))
                     (fx+ offset (ftype-sizeof char)))]
            [else
             (extend-buffer! tb c)
             (s1 ptr (fx+ offset (ftype-sizeof char)) tb key)])))
      s0))

  (define read-environ
    (if (memq (machine-type) '(i3nt a6nt ti3nt ta6nt))
        (lambda (ptr)
          (let ([tb (make-text-buffer)])
            (let loop ([offset 0] [ls '()])
              (let ([c (foreign-ref 'char ptr offset)])
                (if (char=? c #\nul)
                    ls
                    (let-values ([(entry offset) (read-entry ptr offset tb)])
                      (loop offset (cons entry ls))))))))
        (lambda (ptr)
          (let ([tb (make-text-buffer)])
            (let loop ([offset 0] [ls '()])
              (let ([entry-ptr (foreign-ref 'void* ptr offset)])
                (if (= entry-ptr 0)
                    ls
                    (let-values ([(entry char-offset)
                                  (read-entry entry-ptr 0 tb)])
                      (loop (fx+ offset (ftype-sizeof void*))
                            (cons entry ls))))))))))
            
  (define get-environ-pointer
    (case (machine-type)
      [(i3nt a6nt ti3nt ta6nt)
       (load-shared-object "msvcrt.dll")
       (load-shared-object "kernel32.dll")
       (foreign-procedure "GetEnvironmentStrings" () void*)]
      [(i3osx a6osx ti3osx ta6osx)
       (load-shared-object "libc.dylib")
       (let ([p (foreign-procedure "_NSGetEnviron" () void*)])
         (lambda ()
           (let ([ptr-to-ptr (p)])
             (if (= ptr-to-ptr 0)
                 0
                 (foreign-ref 'void* ptr-to-ptr 0)))))]
      [(i3le a6le ti3le ta6le arm32le ppc32le)
       (load-shared-object "libc.so.6")
       (lambda ()
         (let ([ptr-to-ptr (foreign-entry "environ")])
           (if (= ptr-to-ptr 0)
               0
               (foreign-ref 'void* ptr-to-ptr 0))))]
      [(i3ob a6ob ti3ob ta6ob i3nb a6nb ti3nb ta6nb)
       (load-shared-object "libc.so")
       (lambda ()
         (let ([ptr-to-ptr (foreign-entry "environ")])
           (if (= ptr-to-ptr 0)
               0
               (foreign-ref 'void* ptr-to-ptr 0))))]
      [else (error 'get-environment-variables
                   "currently unsupoorted on ~s" (machine-type))])))
