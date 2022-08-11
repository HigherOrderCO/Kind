-- From https://github.com/AndrasKovacs/smalltt/

CNat : Type
CNat = (n : Type) -> (n -> n) -> n -> n

czero : CNat
czero = \ n, s, z => z

csuc : CNat -> CNat
csuc = \ a, n, s, z => s (a n s z)

CVec : Type -> CNat -> Type
CVec = \ a, n => (V : CNat -> Type) -> ({n : CNat} -> a -> V n -> V (csuc n)) -> V czero -> V n

cnil : {A:Type} -> CVec A Main.czero
cnil = \ v, c, n => n

ccons : {A:Type}->{n:CNat} -> A -> CVec A n -> CVec A (csuc n)
ccons = \ a, as, v, c, n => c a (as v c n)

vecTest : Type
vecTest =
  let foo =
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type
       (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type (ccons Type

       cnil

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

  in Type
