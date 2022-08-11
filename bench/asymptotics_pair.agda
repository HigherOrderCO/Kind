{-# OPTIONS --type-in-type #-}
-- From https://github.com/AndrasKovacs/smalltt/blob/master/bench/asymptotics.agda
-- OOM after a long time

Pair : Set → Set → Set;Pair
  = λ A B → (P : Set) → (A → B → P) → P

dup : ∀ {A : Set} → A → Pair A A;dup
  = λ a P p → p a a

pairTest =
  let x0  = dup Set
      x1  = dup x0
      x2  = dup x1
      x3  = dup x2
      x4  = dup x3
      x5  = dup x4
      x6  = dup x5
      x7  = dup x6
      x8  = dup x7
      x9  = dup x8
      x10 = dup x9
      x11 = dup x10
      x12 = dup x11
      x13 = dup x12
      x14 = dup x13
      x15 = dup x14
      x16 = dup x15
      x17 = dup x16
      x18 = dup x17
      x19 = dup x18
      x20 = dup x19
  in x20
