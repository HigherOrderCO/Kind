---
title: src
description: 'Main directory containing the source code of the Kind project'
---

# src

This directory contains the main source code of the Kind project. Here you will find the essential modules that make up the core of the Kind language and compiler.

## Structure

The `src` directory is organized as follows:

- `Kind.hs`: Main module that likely exports the core functionalities of the Kind language.
- `Kind/`: Subdirectory containing specific modules:
  - `API.hs`: Application programming interface.
  - `Check.hs`: Type checker implementation.
  - `Compile.hs`: Compilation logic.
  - `Env.hs`: Environment management.
  - `Equal.hs`: Equality implementation.
  - `Parse.hs`: Syntactic analyzer.
  - `Reduce.hs`: Reduction mechanism.
  - `Show.hs`: Display and formatting functions.
  - `Type.hs`: Type definitions.

Each of these files plays a crucial role in the functioning of the Kind compiler and language. To fully understand the project, it is recommended to examine each of these modules individually.
