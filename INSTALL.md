# Scheme

The Scheme backend handles recursion better than the default Javascript backend. That means it never stack overflows in deep recursions.

# Prebuilt binaries

Kind is distributed as a single binary executable. You can download it [here](https://github.com/uwu-tech/Kind/releases).

# Building from source

**1.** There are many dependencies involved to build the Scheme release and we use nix to manage them. So first you need to install the [latest version](https://github.com/numtide/nix-unstable-installer) of nix.

**2.** After installing nix enable the flakes feature by adding

```
experimental-features = nix-command flakes 
```

to either `~/.config/nix/nix.conf` or `/etc/nix/nix.conf`. Restart your terminal for the change to take effect.

**3.** To build `kind-scm` navigate to the root of the repository and type

```
nix build .#kind-scm
```

Nix will build all the dependencies and place the executable inside the `result` folder. Subsequent builds will be much faster because the dependencies are already built.

If something doesn't work, [let us know](https://github.com/uwu-tech/Kind/issues) ;)
