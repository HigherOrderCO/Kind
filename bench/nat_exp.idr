data NAT : Type where
  Z : NAT
  S : NAT -> NAT

data The : NAT -> Type where
  Val : (x : NAT) -> The x

add : NAT -> NAT -> NAT
add a (S b) = S (add a b)
add a Z     = a

mul : NAT -> NAT -> NAT
mul a (S b) = add a (mul a b)
mul a Z     = Z

exp : NAT -> NAT -> NAT
exp a (S b) = mul a (exp a b)
exp a     Z = S Z

nul : NAT -> NAT
nul (S a) = nul a
nul Z     = Z

work : The (nul (exp (S (S (S Z))) (S (S (S (S (S (S (S (S Z))))))))))
work = Val Z

