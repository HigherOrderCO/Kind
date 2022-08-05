{-# OPTIONS --type-in-type #-}
-- From https://github.com/AndrasKovacs/smalltt/

Nat : Set;Nat
 = (n : Set) → (n → n) → n → n

zero : Nat;zero
 = λ n s z → z

suc : Nat → Nat;suc
 = λ a n s z → s (a n s z)

Vec : Set → Nat → Set;Vec
 = λ A n → (V : Nat → Set) → (∀{n} → A → V n → V (suc n)) → V zero → V n

nil : ∀ {A : Set} → Vec A zero;nil
 = λ V c n → n

cons : ∀ {A : Set}{n : Nat} → A → Vec A n → Vec A (suc n);cons
 = λ a as V c n → c a (as V c n)

vecTest
 =
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set
   (cons Set (cons Set (cons Set (cons Set (cons Set (cons Set

   nil

   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
   ))))))))))))))))))))))))))))))
