# MacOS

## Scheme

The Scheme backend handles recursion better than the default Javascript backend. That means it never stack overflows in deep recursions.

Currently, the only way to install the Scheme backend on macOS is to build from the source.

## Building from source

**1.** First you'll need to [build](https://github.com/racket/ChezScheme/blob/master/BUILDING) and install [Racket's fork](https://github.com/racket/ChezScheme) of ChezScheme:

```shell
git clone https://github.com/racket/ChezScheme.git
cd ChezScheme
```

**2.** Then install the dependencies and configure:

```bash
git submodule init
git submodule update
./configure --pb --disable-curses --disable-x11
```

- For Macbook chip M1 run `make tarm64osx.bootquick`. It should output `Configuring for tarm64osx`.

- For Macbook chip Intel run `make ta6osx.bootquick`. It should run without errors.

```bash
./configure --disable-curses --disable-x11
make
sudo make install
```

**3.** To check if ChezScheme was successfully installed run:

```bash
scheme --version
```

it should print the version, like `9.5.5`.

**4.** Go to the Kind directory (if you don't have it yet, just clone it) and run:

```bash
cd bin/scm
make
sudo make install
```

It may take some time. You can grab a cup of coffee while it finishes.

**5.** Now `kind-scm` is installed, great! Run `kind-scm` inside the `Kind` repository and see if you're greeted with help text.

   Obs: we just can't typecheck a module with Scheme (`kind-scm Module/`), all other commands are working.

If you have any problem, [let us know](https://github.com/uwu-tech/Kind/issues).
