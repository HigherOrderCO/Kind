import Prelude hiding (flip)

data Bits = O Bits | I Bits | Z deriving Show

flip :: Bits -> Bits
flip (O bs) = I (flip bs)
flip (I bs) = O (flip bs)
flip Z      = Z

go :: Int -> Bits -> Bits
go 0 x = x
go n x = go (n - 1) (flip x)

u32_zero :: Bits
u32_zero = (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O (O Z))))))))))))))))))))))))))))))))

main :: IO ()
main = print $ go (2^20) u32_zero
