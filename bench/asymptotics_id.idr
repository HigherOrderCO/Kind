-- From https://github.com/AndrasKovacs/smalltt/
-- OOM after a couple of minutes

mid : {A:Type} -> A -> A
mid = \ x => x

idTest : {A:Type} -> A -> A
idTest =
    mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid
    mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid mid
