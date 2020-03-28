{-# LANGUAGE BangPatterns #-}
{-# OPTIONS_GHC -funbox-strict-fields #-}
module FormalityCore where

import           Data.List           hiding (all, find)
import qualified Data.Map.Strict     as M
import           Data.Maybe
import           Data.Foldable       hiding (all, find)
import qualified Data.IntMap         as IM

import           Control.Applicative
import           Control.Monad

import           Prelude             hiding (all, mod)

type Name = String
type Done = Bool
type Eras = Bool

data Term
  = Var Int                       -- Variable
  | Ref Name                      -- Reference
  | Typ                           -- Type type
  | All Eras Name Name Term Term  -- Forall
  | Lam Eras Name Term            -- Lambda
  | App Eras Term Term            -- Application
  | Ann Bool Term Term            -- Type annotation
  deriving (Eq, Show, Ord)

data Def = Def { _name :: Name, _type :: Term, _term :: Term } deriving Show

type Module = M.Map Name Def

data Parser a = Parser { runParser :: String -> Maybe (String, a) }

type Vars = [Name]

instance Functor Parser where
  fmap f p = Parser $ \i -> case runParser p i of
    Just (i', a) -> Just (i', f a)
    Nothing      -> Nothing

instance Applicative Parser where
  pure a       = Parser $ \i -> Just (i, a)
  (<*>) fab fa = Parser $ \i -> case runParser fab i of
    Just (i', f) -> runParser (f <$> fa) i'
    Nothing      -> Nothing

instance Alternative Parser where
  empty     = Parser $ \i -> Nothing
  (<|>) a b = Parser $ \i -> case runParser a i of
    Just (i', x) -> Just (i', x)
    Nothing      -> runParser b i

instance Monad Parser where
  return a  = Parser $ \i -> Just (i, a)
  (>>=) p f = Parser $ \i -> case runParser p i of
    Just (i', a) -> runParser (f a) i'
    Nothing      -> Nothing

instance MonadPlus Parser where
  mzero = empty
  mplus = (<|>)

isSpace :: Char -> Bool
isSpace c = c `elem` " \t\n"

isName :: Char -> Bool
isName c = c `elem` (['0'..'9'] ++ ['a'..'z'] ++ ['A'..'Z'] ++ "_")

choice :: [Parser a] -> Parser a
choice = asum

takeWhileP :: (Char -> Bool) -> Parser String
takeWhileP f = Parser $ \i -> Just (dropWhile f i, takeWhile f i)

takeWhile1P :: (Char -> Bool) -> Parser String
takeWhile1P f = Parser $ \i -> case i of
  (x : xs) -> if f x then runParser (takeWhileP f) i else Nothing
  _        -> Nothing

satisfy :: (Char -> Bool) -> Parser Char
satisfy f = Parser $ \i -> case i of
  (x:xs) -> if f x then Just (xs, x) else Nothing
  _       -> Nothing

anyChar :: Parser Char
anyChar = satisfy (const True)

whitespace :: Parser ()
whitespace = takeWhile1P isSpace >> return ()

lineComment :: Parser ()
lineComment = sym "//" >> takeWhileP (/= '\n') >> return ()

manyTill :: Parser a -> Parser end -> Parser [a]
manyTill p end = go
  where
    go = ([] <$ end) <|> ((:) <$> p <*> go)

blockComment :: Parser ()
blockComment = string "/*" >> manyTill anyChar (string "*/") >> return ()

skipMany :: Parser a -> Parser ()
skipMany p = go
  where
    go = (p *> go) <|> pure ()

-- space and comment consumer
space :: Parser ()
space = skipMany $ choice [whitespace, lineComment, blockComment]

string :: String -> Parser String
string str = Parser $ \i -> case stripPrefix str i of
  Just i' -> Just (i', str)
  Nothing -> Nothing

sym :: String -> Parser String
sym s = string s <* space

opt :: Char -> Parser Bool
opt c = isJust <$> optional (string (c:[]))

nam :: Parser String
nam = do
  n <- takeWhileP isName
  case n of
    "" -> empty
    _  -> return n

par :: Vars -> Parser Term
par vs = string "(" >> space >> trm vs <* space <* string ")"

all :: Vars -> Parser Term
all vs = do
  s <- maybe "" id <$> (optional nam)
  n <- sym "(" >> nam <* space
  t <- sym ":" >> trm vs <* space
  e <- opt ';' <* space <* sym ")"
  b <- sym "->" >> trm (n : vs)
  return $ All e s n t b

lam :: Vars -> Parser Term
lam vs = do
  n <- sym "(" >> nam <* space
  e <- opt ';' <* space <* sym ")"
  b <- sym "=>" >> trm (n : vs)
  return $ Lam e n b

var :: Vars -> Parser Term
var vs = (\n -> maybe (Ref n) Var (elemIndex n vs)) <$> nam

typ :: Parser Term
typ = string "Type" >> return Typ

app :: Vars -> Term -> Parser Term
app vs f = foldl (\t (a,e) -> App e t a) f <$> (some $ arg vs)
  where
  arg vs = (,) <$> (sym "(" >> trm vs) <*> (opt ';' <* space <* string ")")

ann :: Vars -> Term -> Parser Term
ann vs x = do
  space >> sym "::"
  t <- trm vs
  return $ Ann False t x

trm :: Vars -> Parser Term
trm vs = do
  t <- choice [all vs, lam vs, typ, var vs, par vs]
  t <- app vs t <|> return t
  ann vs t <|> return t

parseTerm :: String -> Maybe Term
parseTerm str = snd <$> runParser (trm []) str

def :: Parser Def
def = Def <$> (nam <* space) <*> (sym ":" >> trm []) <*> (space >> trm [])

mod :: Parser Module
mod = M.fromList <$> fmap (\d -> (_name d, d)) <$> many (def <* space)

testString1 = intercalate "\n"
  [ "identity : (A : Type) -> (a : A) -> A"
  , "(A) => (a) => a"
  , ""
  , "const : (A : Type) -> (a : A) -> (b : B) -> B"
  , "(A) => (a) => (b) => B"
  , ""
  , "apply_twice : (A : Type) -> (f : (x : A) -> A) -> (x : A) -> A"
  , "(A) => (f) => (x) => f(f(x))"
  ]

stringifyTerm :: Term -> String
stringifyTerm t = go [] t
  where
  cat = concat
  sem e = if e then ";" else ""
  go :: Vars -> Term -> String
  go vs t = case t of
    Var i         -> vs !! i
    Ref n         -> n
    Typ           -> "Type"
    All e s n h b -> cat [s,"(", n, " : ", go vs h, sem e,") -> ", go (n:vs) b]
    Lam e n b     -> cat ["(", n, sem e, ") => ", go (n:vs) b]
    App e f a     -> case f of
      (Ref n) -> cat [n, "(", go vs a, sem e, ")"]
      (Var i) -> cat [vs !! i, "(", go vs a, sem e, ")"]
      f       -> cat ["(", go vs f, ")(", go vs a, sem e, ")"]
    Ann d x y     -> cat [go vs y, " :: ", go vs x]

stringifyDef :: Def -> String
stringifyDef (Def n t d) =
  concat [n," : ", stringifyTerm t, "\n", stringifyTerm d]

stringifyMod :: Module -> String
stringifyMod = foldl (\s d -> s ++ stringifyDef d ++ "\n\n") ""

-- Substitution
shift :: Int -> Int -> Term -> Term
shift inc dep term = let go x = shift inc dep x in case term of
  Var i         -> Var (if i < dep then i else (i + inc))
  Ref n         -> Ref n
  Typ           -> Typ
  All e s n h b -> All e s n (shift inc (dep + 1) h) (shift inc (dep + 2) b)
  Lam e n b     -> Lam e n (shift inc (dep + 1) b)
  App e f a     -> App e (go f) (go a)
  Ann d t x     -> Ann d (go t) (go x)

-- substitute a value for an index at a certain depth in a term
subst :: Term -> Int -> Term -> Term
subst v dep term =
  let v'   = shift 1 0 v
      v''  = shift 2 0 v
      go x = subst v dep x
  in case term of
  Var i         -> if i == dep then v else Var (i - if i > dep then 1 else 0)
  Ref n         -> Ref n
  Typ           -> Typ
  All e s n h b -> All e s n (subst v'' (dep + 2) h) (subst v' (dep + 1) b)
  Lam e n b     -> Lam e n (subst v' (dep + 1) b)
  App e f a     -> App e (go f) (go a)
  Ann d t x     -> Ann d (go t) (go x)

-- Erase computationally irrelevant terms
erase :: Term -> Term
erase term = let go = erase in case term of
  All e s n h b  -> All e s n (go h) (go b)
  Lam True n b   -> (subst (Ref "<erased>") 0 b)
  Lam e    n b   -> Lam e n (go b)
  App True f a   -> go f
  App e    f a   -> App e (go f) (go a)
  Ann d t x      -> go x
  _              -> term

-- lookup the value of an expression in a module
deref :: Name -> Module -> Term
deref n defs = maybe (Ref n) _term (M.lookup n defs)

-- lower-order interpreter
evalTerm :: Term -> Module -> Term
evalTerm term mod = go term
  where
  go :: Term -> Term
  go t = case t of
    All e s n h b -> All e s n h b
    Lam e n b     -> Lam e n (go b)
    App e f a     -> case go f of
      Lam e n b -> go (subst a 0 b)
      f         -> App e f (go a)
    Ann d t x     -> go x
    Ref n         -> case (deref n mod) of
      Ref m -> if n == m then Ref m else go (deref n mod)
      x     -> go x
    _           -> term

data TermH
  = VarH Int
  | RefH Name
  | TypH
  | AllH Eras Name Name (TermH -> TermH) (TermH -> TermH -> TermH)
  | LamH Eras Name (TermH -> TermH)
  | AppH Eras TermH TermH
  | AnnH Bool TermH TermH

toTermH :: Term -> TermH
toTermH t = go [] t
  where
    go :: [TermH] -> Term -> TermH
    go vs t = case t of
      Var i         -> if i < length vs then vs !! i else VarH i
      Ref n         -> RefH n
      Typ           -> TypH
      All e s n h b -> AllH e s n (\x -> go (x:vs) h) (\x y -> go (y:x:vs) b)
      Lam e n b     -> LamH e n (\x -> go (x:vs) b)
      App e f a     -> AppH e (go vs f) (go vs a)
      Ann d t x     -> AnnH d (go vs t) (go vs x)

fromTermH :: TermH -> Term
fromTermH t = go 0 t
  where
    go :: Int -> TermH -> Term
    go dep t = case t of
      VarH n         -> Var (dep - n)
      RefH n         -> Ref n
      TypH           -> Typ
      AllH e s n h b -> All e s n (go (dep + 1) (h $ VarH dep)) $
         go (dep + 2) (b (VarH $ dep + 1) (VarH $ dep + 1))
      LamH e n b     -> Lam e n (go (dep + 1) (b $ VarH dep))
      AppH e f a     -> App e (go dep f) (go dep a)
      AnnH d t x     -> Ann d (go dep t) (go dep x)

reduceTermH :: Module -> TermH -> TermH
reduceTermH defs t = go t
  where
    go :: TermH -> TermH
    go t = case t of
      RefH n         -> case deref n defs of
        Ref m -> RefH m
        x     -> go (toTermH x)
      LamH True n b  -> (b $ RefH "<erased>")
      AppH True f a  -> go f
      AppH False f a -> case go f of
        LamH e n b -> go (b a)
        f          -> AppH False f (go a)
      AnnH d t x     -> go x
      _              -> t

normalizeTermH :: Module -> TermH -> TermH
normalizeTermH defs t = go t
  where
    go :: TermH -> TermH
    go t = case t of
      AllH e s n h b -> AllH e s n (\x -> go $ h x) (\x y -> go $ b x y)
      LamH e n b   -> LamH e n (\x -> go $ b x)
      AppH e f a   -> AppH e (go f) (go a)
      AnnH d t x   -> go x
      _            -> t

reduce :: Module -> Term -> Term
reduce defs = fromTermH . reduceTermH defs . toTermH

normalize :: Module -> Term -> Term
normalize defs = fromTermH . normalizeTermH defs . toTermH

type Hash = Int

-- Term for equality
data TermE
  = VarE Hash Int                       -- Variable
  | RefE Hash Name                      -- Reference
  | TypE Hash                           -- Type type
  | AllE Hash Eras Name Name Term Term  -- Forall
  | LamE Hash Eras Name Term            -- Lambda
  | AppE Hash Eras Term Term            -- Application
  | AnnE Hash Bool Term Term            -- Type annotation
  deriving (Eq, Show, Ord)

-- adapted from https://hackage.haskell.org/package/union-find
data Points a = Points !Int (IM.IntMap (Elem a)) deriving Show
data Elem a = Elem !Int a | Link !Int deriving Show

-- new_disjoint_set
newPoints :: Points a
newPoints = Points 0 IM.empty

fresh :: Points a -> a -> (Points a, Int)
fresh (Points next eqs) a =
  (Points (next + 1) (IM.insert next (Elem 0 a) eqs), next)

-- disjoint_set_find
find :: Points a -> Int -> (Int -> Int -> a -> r) -> r
find (Points _next eqs) n k = go n
  where
    go !i = case eqs IM.! i of
      Link i' -> go i'
      Elem r a -> k i r a

-- disjoint_set_union
union :: Points a -> Int -> Int -> Points a
union ps@(Points next eqs) p1 p2 =
  find ps p1 $ \i1 r1 _a1 ->
  find ps p2 $ \i2 r2 a2 ->
  if i1 == i2 then ps else
    case r1 `compare` r2 of
      LT -> let !eqs1 = IM.insert i1 (Link i2) eqs in Points next eqs1
      EQ ->
        let !eqs1 = IM.insert i1 (Link i2) eqs
            !eqs2 = IM.insert i2 (Elem (r2 + 1) a2) eqs1 
         in Points next eqs2
      GT ->
        let !eqs1 = IM.insert i1 (Elem r2 a2) eqs
            !eqs2 = IM.insert i2 (Link i1) eqs1 
         in Points next eqs2

descriptor :: Points a -> Int -> a
descriptor ps p = find ps p (\_ _ a -> a)

equivalent :: Points a -> Int -> Int -> Bool
equivalent ps p1 p2 = find ps p1 $ \i1 _ _ -> find ps p2 $ \i2 _ _ -> i1 == i2


--function bind_free_vars(term, initial_depth) {
--  function go(term, depth) {
--    switch (term.ctor) {
--    case "Var":
--      if (term.index < depth){
--        return Var(term.index);
--      } else {
--        return Ref(initial_depth - 1 - (term.index - depth));
--      }
--    case "Ref":
--      return Ref(term.name);
--    case "Typ":
--      return Typ();
--    case "All":
--      var self = term.self;
--      var name = term.name;
--      var bind = go(term.bind, depth);
--      var body = go(term.body, depth+1);
--      var eras = term.eras;
--      return All(eras, self, name, bind, body);
--    case "Lam":
--      var name = term.name;
--      var body = go(term.body, depth+1);
--      var eras = term.eras;
--      return Lam(eras, name, body);
--    case "App":
--      var func = go(term.func, depth);
--      var argm = go(term.argm, depth);
--      var eras = term.eras;
--      return App(eras,func, argm);
--    case "Ann":
--      var expr = go(term.expr, depth);
--      var type = go(term.type, depth);
--      var done = term.done;
--      return Ann(done, expr, type);
--    default:    return term;
--    }
--  }
--  return go(term, 0);
--};



