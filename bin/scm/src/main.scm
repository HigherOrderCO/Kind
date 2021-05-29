#!/usr/bin/env scheme-script
(import (kind)
        (utils)
        (chezscheme))
(let ([args (cdr (command-line))])
  (unless (null? args)
    (let ((fst_arg (car args))
          (tail_args (cdr args)))
      (if (null? tail_args)
        (if (suffix? fst_arg ".kind")
          (run_io (Kind.api.io.check_file fst_arg))
          (run_io (Kind.api.io.check_term fst_arg)))
        (let ((snd_arg (car tail_args)))
          (case snd_arg
            ("--scm"
             (display (run_io (Kind.api.io.term_to_scheme fst_arg))))
            ("--run"
             ; TODO avoid recompiling baselibs here
             (let ((code (open-string-input-port (run_io (Kind.api.io.term_to_scheme fst_arg)))))
               (run-all code)))
            ;("--show")
            ;("--norm")
            ;("--js")
            ;("--hs")
            ;("--fmc")
            (else
              (display "unrecognized cli argument: ")
              (display snd_arg))))))))
