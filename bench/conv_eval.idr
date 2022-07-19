CBool : Type
CBool = (B : Type) -> B -> B -> B

toBool : CBool -> Bool
toBool = \b => b Bool True False

ctrue : CBool
ctrue = \b, t, f => t

and : CBool -> CBool -> CBool
and = \a, b, bb, t, f => a bb (b bb t f) f

CNat : Type
CNat = (n : Type) -> (n -> n) -> n -> n

add : CNat -> CNat -> CNat
add = \a, b, n, s, z => a n s (b n s z)

cmul : CNat -> CNat -> CNat
cmul = \a, b, n, s => a n (b n s)

suc : CNat -> CNat
suc = \a, n, s, z => s (a n s z)

CEq : {A : Type} -> A -> A -> Type
CEq = \x, y => (P : A -> Type) -> P x -> P y

crefl : {A : Type} -> {x : A} -> CEq {A} x x
crefl = \p, px => px

n2 : CNat
n2 = \n, s, z => s (s z)

n3 : CNat
n3 = \n, s, z => s (s (s z))

n4 : CNat
n4 = \n, s, z => s (s (s (s z)))

n5 : CNat
n5 = \n, s, z => s (s (s (s (s z))))

n10 : CNat
n10  = cmul n2 n5

n10b : CNat
n10b = cmul n5 n2

n15 : CNat
n15 = add n10  n5

n15b : CNat
n15b   = add n10b n5

n18 : CNat
n18    = add n15  n3

n18b : CNat
n18b   = add n15b n3

n19 : CNat
n19    = add n15  n4

n19b : CNat
n19b   = add n15b n4

n20 : CNat
n20    = cmul n2 n10

n20b : CNat
n20b   = cmul n2 n10b

n21 : CNat
n21    = suc n20

n21b : CNat
n21b   = suc n20b

n22 : CNat
n22    = suc n21

n22b : CNat
n22b   = suc n21b

n23 : CNat
n23    = suc n22

n23b : CNat
n23b   = suc n22b

n100 : CNat
n100   = cmul n10   n10

n100b : CNat
n100b  = cmul n10b  n10b

n10k : CNat
n10k   = cmul n100  n100

n10kb : CNat
n10kb  = cmul n100b n100b

n100k : CNat
n100k  = cmul n10k  n10

n100kb : CNat
n100kb = cmul n10kb n10b

n1M : CNat
n1M    = cmul n10k  n100

n1Mb : CNat
n1Mb   = cmul n10kb n100b

n5M : CNat
n5M    = cmul n1M   n5

n5Mb : CNat
n5Mb   = cmul n1Mb  n5

n10M : CNat
n10M   = cmul n5M   n2

n10Mb : CNat
n10Mb  = cmul n5Mb  n2

Tree : Type
Tree = (T : Type) -> (T -> T -> T) -> T -> T

leaf : Tree
leaf = \t, n, l => l

node : Tree -> Tree -> Tree
node = \t1, t2, t, n, l => n (t1 t n l) (t2 t n l)

fullTree : CNat -> Tree
fullTree = \n => n Tree (\t => node t t) leaf

-- full tree with given trees at bottom level
fullTreeWithLeaf : Tree -> CNat -> Tree
fullTreeWithLeaf = \bottom, n => n Tree (\t => node t t) bottom

forceTree : Tree -> CBool
forceTree = \t => t CBool and ctrue

t15 : Tree
t15  = fullTree n15
t15b : Tree
t15b = fullTree n15b
t18 : Tree
t18  = fullTree n18
t18b : Tree
t18b = fullTree n18b
t19 : Tree
t19  = fullTree n19
t19b : Tree
t19b = fullTree n19b
t20 : Tree
t20  = fullTree n20
t20b : Tree
t20b = fullTree n20b
t21 : Tree
t21  = fullTree n21
t21b : Tree
t21b = fullTree n21b
t22 : Tree
t22  = fullTree n22
t22b : Tree
t22b = fullTree n22b
t23 : Tree
t23  = fullTree n23
t23b : Tree
t23b = fullTree n23b

-- CNat conversion
--------------------------------------------------------------------------------

convn1M : CEq Main.n1M Main.n1Mb
convn1M = crefl

-- convn5M : CEq Main.n5M Main.n5Mb
-- convn5M = crefl

-- convn10M : CEq Main.n10M Main.n10Mb
-- convn10M = crefl

-- Full tree conversion
--------------------------------------------------------------------------------

-- convt15  : CEq Main.t15  Main.t15b
-- convt15  = crefl
-- convt18  : CEq Main.t18  Main.t18b
-- convt18  = crefl
-- convt19  : CEq Main.t19  Main.t19b
-- convt19  = crefl
-- convt20  : CEq Main.t20  Main.t20b
-- convt20  = crefl
-- convt21  : CEq Main.t21  Main.t21b
-- convt21  = crefl
-- convt22  : CEq Main.t22  Main.t22b
-- convt22  = crefl
-- convt23  : CEq Main.t23  Main.t23b
-- convt23  = crefl

-- Full meta-containing tree conversion
--------------------------------------------------------------------------------

-- convmt15 : CEq Main.t15b  (fullTreeWithLeaf ? Main.n15 )
-- convmt15 = crefl
-- convmt18 : CEq Main.t18b  (fullTreeWithLeaf ? Main.n18 )
-- convmt18 = crefl
-- convmt19 : CEq Main.t19b  (fullTreeWithLeaf ? Main.n19 )
-- convmt19 = crefl
-- convmt20 : CEq Main.t20b  (fullTreeWithLeaf ? Main.n20 )
-- convmt20 = crefl
-- convmt21 : CEq Main.t21b  (fullTreeWithLeaf ? Main.n21 )
-- convmt21 = crefl
-- convmt22 : CEq Main.t22b  (fullTreeWithLeaf ? Main.n22 )
-- convmt22 = crefl
-- convmt23 : CEq Main.t23b  (fullTreeWithLeaf ? Main.n23 )
-- convmt23 = crefl

-- Full tree forcing
--------------------------------------------------------------------------------

-- forcet15 : CEq (toBool (forceTree Main.t15)) True
-- forcet15 = crefl
-- forcet18 : CEq (toBool (forceTree Main.t18)) True
-- forcet18 = crefl
-- forcet19 : CEq (toBool (forceTree Main.t19)) True
-- forcet19 = crefl
-- forcet20 : CEq (toBool (forceTree Main.t20)) True
-- forcet20 = crefl
-- forcet21 : CEq (toBool (forceTree Main.t21)) True
-- forcet21 = crefl
--forcet22 : CEq (toBool (forceTree Main.t22)) True
--forcet22 = crefl
-- forcet23 : CEq (toBool (forceTree Main.t23)) True
-- forcet23 = crefl
