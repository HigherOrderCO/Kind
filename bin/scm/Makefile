all: bin/kind-scm

deb: kind-scm.deb

# compiles kind files to scheme you could replace kind-scm with kind
bootstrap:
	cd ../../base && kind-scm Kind.Comp.Target.Scheme.bootstrap --run

clean:
	rm src/*.wpo
	rm src/*.so
	rm src/*.chez
	rm src/*.generated.c
	rm bin/*

bin/kind-scm:
	cd src/ && scheme compile.scm
	chmod +x bin/kind-scm

kind-scm.deb: bin/kind-scm
	mkdir -p kind-scm_1.0.1-0_amd64/usr/local/bin/
	cp bin/kind-scm kind-scm_1.0.1-0_amd64/usr/local/bin/
	dpkg-deb --root-owner-group  --build kind-scm_1.0.1-0_amd64/ bin/kind-scm_1.0.1-0_amd64.deb

install: bin/kind-scm
	chmod +x bin/kind-scm
	cp bin/kind-scm /usr/local/bin/

chez: scheme/bin/scheme
  cd ChezScheme
	./configure --pb
	make -j auto.bootquick
	./configure --kernelobj --disable-curses --disable-iconv --disable-x11  --installprefix=$PWD/../scheme
	make -j
	make install
