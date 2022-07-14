data Nat : Set where
  z : Nat
  s : Nat -> Nat

data The : (x : Nat) -> Set where
  val : (x : Nat) -> The x

add : Nat -> Nat -> Nat
add a (s b) = s (add a b)
add a z     = a

mul : Nat -> Nat -> Nat
mul a (s b) = add a (mul a b)
mul a z     = z

exp : Nat -> Nat -> Nat
exp a (s b) = mul a (exp a b)
exp a     z = s z

nul : Nat -> Nat
nul (s a) = (nul a)
nul z     = z

work : The (nul (exp (s (s (s z))) (s (s (s (s (s (s (s (s z))))))))))
work = val z
