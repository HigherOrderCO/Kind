cargo build --release
# Probably we should just use git clone in Wikind?
cd ../Wikind
../Kind2/target/release/kind2 to-hvm Kind/TypeChecker.kind2 >> ../Kind2/src/checker.hvm