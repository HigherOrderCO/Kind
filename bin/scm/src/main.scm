#!/usr/bin/env scheme-script
(import (kind)
        (chezscheme))
(let ([args (cdr (command-line))])
  (if (null? args)
    (print-lines
    '("# kind-scm 1.0.83"
      ""
      "Usage:"
      ""
      "  kind-scm Module/               # type-checks a module (TODO)"
      "  kind-scm Module/file.kind      # type-checks a file"
      "  kind-scm full_term_name --run  # runs a term"
      "  kind-scm full_term_name --show # prints a term"
      "  kind-scm full_term_name --norm # prints a term's λ-normal form"
      "  kind-scm full_term_name --scm  # compiles a term to Scheme"
      "  kind-scm full_term_name --js   # compiles a term to JavaScript"
      "  kind-scm full_term_name --fmc  # compiles a term to FormCore"
      ""
      "Examples:"
      ""
      "  # Run the 'Main' term (outputs 'Hello, world'):"
      "  kind-scm Main --run"
      ""
      "  # Type-check all files inside the 'Nat' module:"
      "  kind-scm Nat/"
      ""
      "  # Type-check the 'Nat/add.kind' file:"
      "  kind-scm Nat/add.kind"
      ""
      "  # Type-check the 'Nat.add' term:"
      "  kind-scm Nat.add"
      ""
      "  # Compile the 'Nat.add' term to JavaScript:"
      "  kind-scm Nat.add --js"
      ""
      "  # Print the λ-encoding of Nat:"
      "  kind-scm Nat --show"
      ""
      "  # Print the λ-normal form of 2 + 2:"
      "  kind-scm Example.two_plus_two --norm"))
    (let ((fst_arg (car args))
          (tail_args (cdr args)))
      (if (null? tail_args)
        (if (suffix? fst_arg ".kind")
          (run_io (Kind.api.io.check_file fst_arg))
          (if (suffix? fst_arg "/")
            (run_io (Kind.api.io.check_files (find-all-kind-files fst_arg)))
            (run_io (Kind.api.io.check_term fst_arg))))
        (let ((snd_arg (car tail_args)))
          (case snd_arg
            ("--scm"
             (display (run_io (Kind.api.io.term_to_scheme fst_arg))))
            ("--run"
             (let ((code (open-string-input-port (run_io (Kind.api.io.term_to_scheme fst_arg)))))
               (run-all code)))
            ("--show"
              (display (run_io (Kind.api.io.show_term fst_arg))))
            ("--norm"
              (display (run_io (Kind.api.io.show_term_normal fst_arg))))
            ("--js"
              (let ((ports (process (string-append "fmc " (string-append "--js " fst_arg)))))
                (let ((input_port (car ports))
                      (output_port (car (cdr ports))))
                  (display
                    (run_io (Kind.api.io.term_to_core fst_arg))
                    output_port)
                  (flush-output-port)
                  (close-output-port output_port)
                  (display (get-string-all input_port)))))
            ;("--hs")
            ("--fmc"
              (display (run_io (Kind.api.io.term_to_core fst_arg))))
            (else
              (display "unrecognized cli argument: ")
              (display snd_arg))))))))
