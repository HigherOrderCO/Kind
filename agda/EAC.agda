-- Elementary Affine Calculus

open import Data.Empty
open import Data.Unit
open import Data.Bool
open import Data.Nat
open import Data.Product

module EAC where

data Path : Set where
  go0 : Path -> Path
  go1 : Path -> Path
  end : Path

data Expr : Set where
  lam : Path -> Expr -> Expr
  app : Expr -> Expr -> Expr
  dup : Path -> Path -> Expr -> Expr
  box : Expr -> Expr
  var : Expr

-- Check if two paths are different.
diff : Path -> Path -> Bool
diff (go0 a) (go0 b) = diff a b
diff (go1 a) (go1 b) = diff a b
diff end     end     = false
diff a       b       = true

-- Check if the variable at `path` and level `lvl` is free.
is-free : ℕ -> Path -> Expr -> Bool
is-free lvl       path       (lam bind body)      = diff path bind ∧ is-free lvl path body
is-free lvl       path       (dup cpy0 cpy1 body) = diff path cpy0 ∧ diff path cpy1 ∧ is-free lvl path body
is-free (suc lvl) path       (box term)           = is-free lvl path term
is-free lvl       (go0 path) (app func argm)      = is-free lvl path func
is-free lvl       (go1 path) (app func argm)      = is-free lvl path argm
is-free zero      end        var                  = true
is-free lvl       path       expr                 = false

-- Checks if a term is well scoped.
well-scoped : Expr -> Bool
well-scoped (lam bind body)      = well-scoped body ∧ is-free 0 bind body
well-scoped (app func argm)      = well-scoped func ∧ well-scoped argm
well-scoped (dup cpy0 cpy1 body) = well-scoped body ∧ diff cpy0 cpy1 ∧ is-free 1 cpy0 body ∧ is-free 1 cpy1 body
well-scoped (box term)           = well-scoped term
well-scoped var                  = true

Term : Set
Term = ∃ (λ x → T (well-scoped x))
