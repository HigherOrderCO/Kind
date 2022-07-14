data Nat : Set where
  zero : Nat
  succ : Nat -> Nat

data The : (x : Nat) -> Set where
  val : (x : Nat) -> The x

double : (x : Nat) -> Nat
double (succ x) = (succ (succ (double x)))
double zero     = zero

power2 : (x : Nat) -> Nat
power2 (succ x) = (double (power2 x))
power2 zero     = (succ zero)

destroy : (x : Nat) -> Nat
destroy (succ n) = (destroy n)
destroy zero     = zero

slowNumber : Nat
slowNumber =
  (destroy (power2
    (succ (succ (succ (succ
    (succ (succ (succ (succ
    (succ (succ (succ (succ
    (succ (succ (succ (succ
    (succ (succ (succ (succ
    (succ (succ (succ (succ
    zero
    ))))
    ))))
    ))))
    ))))
    ))))
    ))))
  ))

main : The slowNumber
main = val zero
