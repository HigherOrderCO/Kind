chezdir := ChezScheme
chezexedir := chez-exe
# choose wether to use kind or kind-scm for bootstrapping
kind := kind-scm

all: bin/kind-scm

deb: kind-scm.deb

# compiles kind files to scheme
# do this after modifying the compiler source-code
bootstrap:
	cd ../../base && $(kind) Kind.Comp.Target.Scheme.bootstrap --run

clean:
	rm src/*.wpo
	rm src/*.so
	rm src/*.chez
	rm src/*.generated.c
	rm bin/*

bin/kind-scm: scheme/bin/compile-chez-program scheme/bin/scheme
	./$(chezexedir)/compile-chez-program --full-chez --libdirs src --optimize-level 2 src/main.scm
	mv src/main bin/kind-scm
	chmod +x bin/kind-scm

kind-scm.deb: bin/kind-scm
	mkdir -p kind-scm_1.0.1-0_amd64/usr/local/bin/
	cp bin/kind-scm kind-scm_1.0.1-0_amd64/usr/local/bin/
	dpkg-deb --root-owner-group  --build kind-scm_1.0.1-0_amd64/ bin/kind-scm_1.0.1-0_amd64.deb

install: bin/kind-scm
	chmod +x bin/kind-scm
	cp bin/kind-scm /usr/local/bin/

scheme/bin/scheme:
	cd $(chezdir) && git submodule init && git submodule update
	cd $(chezdir) && ./configure --pb --kernelobj --disable-curses --disable-iconv --disable-x11
	cd $(chezdir) && make auto.bootquick
	cd $(chezdir) && ./configure --kernelobj --disable-curses --disable-iconv --disable-x11  --installprefix=$(PWD)/scheme
	cd $(chezdir) && make && make install

scheme/bin/compile-chez-program: scheme/bin/scheme
	cd $(chezexedir) && ./../scheme/bin/scheme --script gen-config.ss --scheme $(PWD)/scheme/bin/scheme --bootpath $$(dirname $$(find ../scheme -name kernel.o)) --prefix $(PWD)/scheme
	cd $(chezexedir) && make install
