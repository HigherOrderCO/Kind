---
title: kind-lang.cabal
description: 'Cabal configuration file for the kind-lang project'
---

# kind-lang.cabal

This file is the Cabal configuration file for the kind-lang project. It defines the package specifications, dependencies, and project structure.

## Package Details

- **Name**: kind-lang
- **Version**: 0.1.0.0
- **License**: MIT
- **Author**: Victor Taelin
- **Maintainer**: victor.taelin@gmail.com
- **Category**: Language

## Library

The library exposes the following modules:

- Kind
- Kind.API
- Kind.Check
- Kind.Compile
- Kind.Env
- Kind.Equal
- Kind.Parse
- Kind.Reduce
- Kind.Show
- Kind.Type

Main dependencies:

- base ^>=4.20.0.0
- containers ==0.7
- parsec ==3.1.17.0
- ansi-terminal==1.1.1
- directory==1.3.8.3
- hs-highlight == 1.0.3
- filepath==1.5.2.0

## Executable

The project also defines an executable called "kind" with the following characteristics:

- **Main file**: Main.hs
- **Dependencies**: Includes the kind-lang library itself and other dependencies shared with the library.

## Common Settings

- The project uses GHC2024 as the default language.
- Warnings are enabled for both the library and executable.

This Cabal file provides a clear overview of the kind-lang project's structure and dependencies, facilitating its compilation and distribution.
