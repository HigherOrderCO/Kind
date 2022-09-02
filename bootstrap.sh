#!/bin/sh

set -e

CURRENT=$(realpath .)
KIND2=$(realpath $CURRENT/target/release/kind2)
CHECKER=$(realpath ../)

#echo "Building Kind2 without the new checker.hvm"
#cargo build --release

echo "Building Kind2 type checker"

# Probably we should just use git clone in Wikind?
cd ../Wikind
#$KIND2 check Kind/TypeChecker.kind2
$KIND2 to-hvm Kind/TypeChecker.kind2 > ../Kind2/src/checker.hvm

cargo install --path $CURRENT

#cd $CURRENT
#cargo build --release
