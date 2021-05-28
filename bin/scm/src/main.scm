#!/usr/bin/env -S scheme --script
(load "~/repositories/kind/bin/scm/src/kind.scm")
(define suffix?
  (lambda (str suff)
    (let ((suff_length (string-length suff))
          (str_length (string-length str)))
      (if (<= suff_length str_length)
        (string=?
          (substring str (- str_length suff_length) str_length)
          suff)
        #f))))

(define prefix?
  (lambda (str pref)
    (let ((pref_length (string-length pref))
          (str_length (string-length str)))
      (if (<= pref_length str_length)
        (string=?
          (substring str 0 pref_length)
          pref)
        #f))))

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
              (let ((code (run_io (Kind.api.io.term_to_scheme fst_arg)))
                    (file "./.tmp.scm"))
                (set_file file code)
                (load-program file)
                (delete-file file)))
            ;("--show")
            ;("--norm")
            ;("--js")
            ;("--hs")
            ;("--fmc")
            (else
              (display "unrecognized cli argument: ")
              (display snd_arg))))))))
