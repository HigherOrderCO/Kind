Inductive Nat : Type :=
  | Z
  | S : Nat -> Nat.

(* Inductive The : Nat -> Type :=
   | val : forall (x : Nat), The x. *)

Inductive The : Nat -> Prop :=
  | val (x : Nat) : The x.

Fixpoint add (m : Nat) (n : Nat) : Nat :=
  match m, n with
  | m, Z     => m
  | m, (S n) => S (add m n)
  end.

Fixpoint mul (m : Nat) (n : Nat) : Nat :=
  match m, n with
  | m, Z     => Z
  | m, (S n) => (add m (mul m n))
  end.

Fixpoint exp (m : Nat) (n : Nat) : Nat :=
  match m, n with
  | m, Z     => (S Z)
  | m, (S n) => (mul m (exp m n))
  end.

Fixpoint nul (n : Nat) : Nat :=
  match n with
  | Z     => Z
  | (S n) => nul n
  end.

Definition work : The (nul (exp (S (S (S Z))) (S (S (S (S (S (S (S (S Z)))))))))) :=
   val Z.
