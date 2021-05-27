#! /usr/bin/scheme --script
(load "./kind.so")
(let ([args (cdr (command-line))])
  (unless (null? args)
    (let ((filename (car args)))
      (run_io (Kind.api.io.check_file filename)))))
