---
title: Show
description: 'Module responsible for displaying and formatting terms and information in the Kind compiler'
---

# Show

The `Kind.Show` module is responsible for providing functions to display and format terms, contexts, and information in the Kind compiler. It defines various helper functions to convert internal data structures into readable string representations.

## Main Functions

### termShower

```haskell
termShower :: Bool -> Term -> Int -> String
```

This function is the core of term display. It takes a boolean to control the level of detail, a term, and a depth, and returns a string representation of the term.

### contextShow

```haskell
contextShow :: Book -> Fill -> [Term] -> Int -> String
```

Displays a context (list of terms) with annotations.

### infoShow

```haskell
infoShow :: Book -> Fill -> Info -> IO String
```

Formats different types of information (such as goals, errors, solutions) for display.

## Helper Functions

- `unwrapApp`: Unpacks nested function applications.
- `termShow`: Simplified version of `termShower`.
- `operShow`: Converts operators to their string representations.
- `teleShower`: Displays telescopes (data structures for dependent parameters).

## Error Handling

The module includes functions for reading source files and resolving absolute paths, which are used to display error information with source code context.

## Notes

- The module makes extensive use of string concatenation to build representations.
- It uses ANSI codes to color the output in the terminal.
- Integrates with a syntax highlighting module (`Highlight`) to improve error display.

This module is crucial for providing readable and useful feedback during compilation and type checking in the Kind compiler.
