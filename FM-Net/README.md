## Formality Net (FM-NET)

Formality's interaction net system. It is designed to be an efficient runtime for [FM-CORE](https://github.com/moonad/formality-core). It extends [EA-NET](https://github.com/moonad/elementary-affine-net) with native pairs and 32-bit numeric primitives. It is designed to be a space/time efficient runtime, with each pair/lambda node using 128 bits, erasure/numeric nodes being unboxed, and all operations taking constant space/time. We aim to optimize FM-NET as much as possible, implementing low level LLVM/CUDA/FPGA targets. 

[Check its documentation!](https://github.com/moonad/formality-core/wiki/Formality-Net)
