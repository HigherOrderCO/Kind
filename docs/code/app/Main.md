---
title: Main
description: 'Main module that initiates the execution of the Kind compiler'
---

# Main

This module is the entry point for the Kind compiler. It imports and executes the `main` function from the `Kind` module.

## Structure

The `Main` module consists of:

1. A module declaration
2. An import of the `Kind` module
3. A definition of the `main` function

## Main function

```haskell
main :: IO ()
main = Kind.main
```

The `main` function is defined with the type `IO ()`, indicating that it performs input/output operations. It simply calls the `main` function from the `Kind` module, delegating all the compiler's execution logic to that module.

This structure allows for a clear separation between the program's entry point and the main logic of the compiler, which is contained in the `Kind` module.
