---
title: cabal.project
description: 'Cabal project configuration for the Kind compiler'
---

# cabal.project

This file contains the Cabal project configuration for the Kind compiler.

## Content

```
packages: .

-- Enable -O2 optimization for all packages
package *
  optimization: 2
```

## Details

1. `packages: .`: Indicates that the package is located in the current directory.

2. `package *`: This line starts a configuration section that applies to all packages.

3. `optimization: 2`: Sets the optimization level to 2 (equivalent to -O2) for all packages. This instructs the compiler to perform more aggressive optimizations during compilation, potentially improving the performance of the generated code.

This configuration ensures that all packages in the project are compiled with level 2 optimizations, which can result in more efficient code, although it may increase compilation time.
