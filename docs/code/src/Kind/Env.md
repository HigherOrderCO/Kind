---
title: Env
description: 'Module that defines the environment and related operations for the Kind system'
---

# Env

This module defines the environment (`Env`) and various related operations for the Kind system. The environment is used to manage the state during term checking and compilation.

## Main Structure

- `Env`: Represents the execution environment.
- `State`: Contains the current state, including the book (`Book`), fillings (`Fill`), suspensions (`Susp`), and logs.

## Main Functions

### Environment Operations

- `envBind`: Binds an environment to a function that produces another environment.
- `envPure`: Creates a pure environment with a value.
- `envFail`: Creates a failing environment.
- `envRun`: Runs an environment with a given book.

### State Manipulation

- `envLog`: Adds information to the log.
- `envSnapshot`: Captures the current state.
- `envRewind`: Returns to the previous state.
- `envSusp`: Adds a check to the list of suspensions.
- `envFill`: Inserts a term into the fillings map.

### Accessors

- `envGetFill`: Gets the current fillings map.
- `envGetBook`: Gets the current book.
- `envTakeSusp`: Gets and clears the list of suspensions.

## Instances

The module also provides instances of `Functor`, `Applicative`, and `Monad` for `Env`, allowing the use of monadic operations with the environment.

This module is fundamental to the internal workings of the Kind system, managing the state and operations during the verification and compilation process.
