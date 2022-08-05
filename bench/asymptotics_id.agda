{-# OPTIONS --type-in-type #-}
-- From https://github.com/AndrasKovacs/smalltt/
-- OOM after some minutes

id : ∀ {A : Set} → A → A;id
 = λ x → x

idTest : ∀ {A} → A → A;idTest
  = id id id id id id id id id id id id id id id id id id id id
    id id id id id id id id id id id id id id id id id id id id

