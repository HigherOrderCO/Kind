# MacOS

## Scheme
Currently the only way to install the scheme backend on MacOS is to build from source.

## Building from source

First you'll need to [build](https://github.com/racket/ChezScheme/blob/master/BUILDING) and install Racket's fork of ChezScheme. To do that clone the [repository](https://github.com/racket/ChezScheme) and run

```bash
git submodule init
git submodule update
./configure --disable-curses --disable-x11
make
sudo make install
```

To check that ChezScheme really is installed run

```bash
scheme --version
```

and see if it prints a version number. If it does clone [Kind](https://github.com/uwu-tech/Kind) and run

```bash
cd bin/scm
make
sudo make install
```

Now `kind-scm` is installed, great! To check that run

```bash
kind-scm
```

and see if you're greeted with help text.
