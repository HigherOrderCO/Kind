# choose whether to use kind or kind-scm for bootstrapping
KIND := kind-scm
PREFIX := /usr/local/bin/
CHEZ-EXE := compile-chez-program

all: bin/kind-scm

deb: kind-scm.deb

# compiles kind files to scheme
# do this after modifying the compiler source-code
bootstrap:
	cd ../../base && $(KIND) Kind.Comp.Target.Scheme.bootstrap --run

clean:
	rm src/*.wpo
	rm src/*.so
	rm src/*.chez
	rm src/*.generated.c
	rm bin/*

bin/kind-scm:
	$(CHEZ-EXE) --full-chez --libdirs src --optimize-level 2 src/main.scm
	mv src/main bin/kind-scm
	chmod +x bin/kind-scm

kind-scm.deb: bin/kind-scm
	mkdir -p kind-scm_1.0.1-0_amd64/usr/local/bin/
	cp bin/kind-scm kind-scm_1.0.1-0_amd64/usr/local/bin/
	dpkg-deb --root-owner-group  --build kind-scm_1.0.1-0_amd64/ bin/kind-scm_1.0.1-0_amd64.deb

install: bin/kind-scm
	chmod +x bin/kind-scm
	cp bin/kind-scm $(PREFIX)
test:
	echo $(PREFIX)
