---
title: Introduction to Kind-Core
description: 'A guide to get started with Kind, a minimalist proof checker'
---

# Introduction to Kind-Core

Kind-Core is a minimalist proof checker. This project provides a powerful tool for verifying and executing terms in a dependent type system.

## Overview

Kind-Core is designed to be a lean and efficient implementation of a proof checker. It supports a rich grammar that allows the expression of complex concepts in type theory, including universal quantification, lambda abstraction, function application, type annotations, recursive types, and much more.

## About the Project

The project is structured into several main parts:

- `src/Kind`: Contains the main modules of the proof checker.
- `app`: Contains the application entry point.
- `cabal.project` and `kind-lang.cabal`: Haskell project configuration files.

## How to Run

To start using Kind-Core:

1. Clone this repository.
2. Install the project following the Haskell setup instructions.
3. Use the `kind` command to verify or execute terms.

## Requirements

- GHC (Glasgow Haskell Compiler)
- Cabal or Stack for Haskell package management

## Examples

Examples of Kind usage can be found in the [MonoBook](https://github.com/HigherOrderCO/MonoBook) repository. Look for files with the `.kind` extension.

## Grammar

Kind-Core uses a specific grammar to define terms. The complete grammar can be found in the project's README, including constructions for universal quantifiers, lambda abstractions, applications, type annotations, recursive types, data constructors, and more.

For more details on the grammar and advanced usage, refer to the project's full documentation.
