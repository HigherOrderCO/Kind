# Scheme

The Scheme backend handles recursion better than the default Javascript backend. That means it never stack overflows in deep recursions.

# Prebuilt binaries

Kind is distributed as a single binary executable. You can download it [here](https://github.com/uwu-tech/Kind/releases).

# Building from source

**1.** Go to the root of the repository, pull the latest version, and run:

```shell
cd bin/scm
git submodule update --init --recursive
make
```

It may take some time. You can grab a cup of coffee while you wait. At the end you should see the `kind-scm` executable inside `bin/scm/bin/`.  Try running it:

```shell
./bin/kind-scm
```

You can install it wherever you want. If you're fine placing it in `/usr/local/bin/` then run.

```shell
sudo make install
```

To update repeat those same steps, it'll probably be much faster.

If something doesn't work, [let us know](https://github.com/uwu-tech/Kind/issues) ;)
