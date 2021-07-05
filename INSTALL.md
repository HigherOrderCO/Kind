# Scheme

The Scheme backend handles recursion better than the default Javascript backend. That means it never stack overflows in deep recursions.

## Linux

If you're using a Debian-based distro, like Ubuntu or Mint, you could download the [latest debian binary package](https://github.com/uwu-tech/Kind/releases) and install it by double-clicking the file. In other cases building from source is the way to go.

### Building from source 

**1.** First [install chezscheme](https://command-not-found.com/scheme). To check if you succeeded run.

```shell
scheme --version
```

**2.** Go to the Kind directory, pull the latest version, and run:

```shell
cd bin/scm
make
```

if you're fine installing the binary in `/usr/local/bin/`

```shell
sudo make install
```

**3.** To check if the install succeeded, navigate to the `Kind/base` folder and run

```shell
kind-scm
```

If you're greeted with a help message then `kind-scm` is installed. :slightly_smiling_face:

## MacOS

Currently, the only way to install the Scheme backend on macOS is to build from the source.

### Building from source

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

If you have any problem, [let us know](https://github.com/uwu-tech/Kind/issues).

### Update
Go to the Kind directory, pull the latest version, and run:
```bash
cd bin/scm
make
sudo make install
```
