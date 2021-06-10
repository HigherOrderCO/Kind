all: kind-scm kind-scm.deb
bootstrap:
	cd ../../base && kind-scm Kind.Comp.Target.Scheme.bootstrap --run
clean:
	rm src/*.wpo
	rm src/*.so
	rm bin/*
kind-scm:
	cd src/ && scheme compile.scm
	chmod +x bin/kind-scm
kind-scm.deb: kind-scm
	mkdir -p kind-scm_1.0.1-0_amd64/usr/local/bin/
	cp bin/kind-scm kind-scm_1.0.1-0_amd64/usr/local/bin/
	dpkg-deb --root-owner-group  --build kind-scm_1.0.1-0_amd64/ bin/kind-scm_1.0.1-0_amd64.deb
install: kind-scm
	chmod +x bin/kind-scm
	cp bin/kind-scm /usr/local/bin/
