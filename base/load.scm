(parameterize ([compile-profile #t]) (load "./main.scm"))
(profile-dump-html)
