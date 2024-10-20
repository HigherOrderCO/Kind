-- //./Type.hs//

module Kind.Parse where

import Data.Char (ord)
import Data.Functor.Identity (Identity)
import Data.List (intercalate, isPrefixOf, uncons, find)
import Data.Maybe (catMaybes, fromJust)
import Data.Set (toList, fromList)
import Debug.Trace
import Highlight (highlightError, highlight)
import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Prelude hiding (EQ, LT, GT)
import System.Console.ANSI
import System.Exit (die)
import Text.Parsec ((<?>), (<|>), getPosition, sourceLine, sourceColumn, getState, setState)
import Text.Parsec.Error (errorPos, errorMessages, showErrorMessages, ParseError, errorMessages, Message(..))
import qualified Control.Applicative as A
import qualified Data.Map.Strict as M
import qualified Text.Parsec as P

type Uses     = [(String, String)]
type PState   = (String, Uses)
type Parser a = P.ParsecT String PState Identity a
data Pattern  = PVar String | PCtr String [Pattern] deriving Show

-- Helper functions that consume trailing whitespace
parseTrivia :: Parser ()
parseTrivia = P.skipMany (parseSpace <|> parseComment)
  where
    parseSpace = (P.try $ do
      P.space
      return ()) <?> "Space"
    parseComment = (P.try $ do
      P.string "//"
      P.skipMany (P.noneOf "\n")
      P.char '\n'
      return ()) <?> "Comment"

char :: Char -> Parser Char
char c = P.char c <* parseTrivia

string :: String -> Parser String
string s = P.string s <* parseTrivia

letter :: Parser Char
letter = P.letter

parseNameChar :: Parser Char
parseNameChar = P.satisfy (`elem` "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/_.-$")

digit :: Parser Char
digit = P.digit

oneOf :: String -> Parser Char
oneOf s = P.oneOf s

noneOf :: String -> Parser Char
noneOf s = P.noneOf s

-- Main parsing functions
doParseTerm :: String -> String -> IO Term
doParseTerm filename input =
  case P.runParser (parseTerm <* P.eof) (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right term -> return $ bind (genMetas term) []

doParseUses :: String -> String -> IO Uses
doParseUses filename input =
  case P.runParser (parseUses <* P.eof) (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right uses -> return uses

doParseBook :: String -> String -> IO Book
doParseBook filename input = do
  let parser = do
        uses <- parseUses
        setState (filename, uses)
        parseBook <* P.eof
  case P.runParser parser (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right book -> return book

-- Error handling
extractExpectedTokens :: ParseError -> String
extractExpectedTokens err =
    let expectedMsgs = [msg | Expect msg <- errorMessages err, msg /= "Space", msg /= "Comment"]
    in intercalate " | " expectedMsgs

showParseError :: String -> String -> P.ParseError -> IO ()
showParseError filename input err = do
  let pos = errorPos err
  let line = sourceLine pos
  let col = sourceColumn pos
  let errorMsg = extractExpectedTokens err
  putStrLn $ setSGRCode [SetConsoleIntensity BoldIntensity] ++ "\nPARSE_ERROR" ++ setSGRCode [Reset]
  putStrLn $ "- expected: " ++ errorMsg
  putStrLn $ "- detected:"
  putStrLn $ highlightError (line, col) (line, col + 1) input
  putStrLn $ setSGRCode [SetUnderlining SingleUnderline] ++ filename ++
             setSGRCode [Reset] ++ " " ++ show line ++ ":" ++ show col

-- Parsing helpers
-- FIXME: currently, this will include suffix trivia. how can we avoid that?
withSrc :: Parser Term -> Parser Term
withSrc parser = do
  ini <- getPosition
  val <- parser
  end <- getPosition
  (nam, _) <- P.getState
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

-- Term Parser
-- -----------

-- Main term parser
parseTerm :: Parser Term
parseTerm = (do
  parseTrivia
  term <- P.choice
    [ parseAll
    , parseSwi
    , parseMat
    , parseLam
    , parseEra
    , parseOp2
    , parseApp
    , parseAnn
    , parseSlf
    , parseIns
    , parseDat
    , parseNat
    , parseCon
    , (parseUse parseTerm)
    , (parseLet parseTerm)
    , parseIf
    , parseWhen
    , parseMatInl
    , parseSwiInl
    , parseDo
    , parseSet
    , parseNum
    , parseTxt
    , parseLst
    , parseChr
    , parseHol
    , parseMet
    , parseRef
    ] <* parseTrivia
  parseSuffix term) <?> "Term"

-- Individual term parsers
parseAll = withSrc $ do
  string "∀"
  era <- P.optionMaybe (char '-')
  char '('
  nam <- parseName
  char ':'
  inp <- parseTerm
  char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = withSrc $ do
  string "λ"
  era <- P.optionMaybe (char '-')
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseEra = withSrc $ do
  string "λ"
  era <- P.optionMaybe (char '-')
  nam <- char '_'
  bod <- parseTerm
  return $ Lam "_" (\x -> bod)

parseApp = withSrc $ do
  char '('
  fun <- parseTerm
  args <- P.many $ do
    P.notFollowedBy (char ')')
    era <- P.optionMaybe (char '-')
    arg <- parseTerm
    return (era, arg)
  char ')'
  return $ foldl (\f (era, a) -> App f a) fun args

parseAnn = withSrc $ do
  char '{'
  val <- parseTerm
  char ':'
  chk <- P.option False (char ':' >> return True)
  typ <- parseTerm
  char '}'
  return $ Ann chk val typ

parseSlf = withSrc $ do
  string "$("
  nam <- parseName
  char ':'
  typ <- parseTerm
  char ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = withSrc $ do
  char '~'
  val <- parseTerm
  return $ Ins val

parseDat = withSrc $ do
  P.try $ P.choice [string "#[", string "data["]
  scp <- P.many parseTerm
  char ']'
  char '{'
  cts <- P.many $ P.try $ do
    char '#'
    nm <- parseName
    tele <- parseTele
    return $ Ctr nm tele
  char '}'
  return $ Dat scp cts

parseTele :: Parser Tele
parseTele = do
  fields <- P.option [] $ do
    char '{'
    fields <- P.many $ P.try $ do
      nam <- parseName
      char ':'
      typ <- parseTerm
      return (nam, typ)
    char '}'
    return fields
  char ':'
  ret <- parseTerm
  return $ foldr (\(nam, typ) acc -> TExt nam typ (\x -> acc)) (TRet ret) fields

parseCon = withSrc $ do
  char '#'
  nam <- parseName
  args <- P.option [] $ P.try $ do
    char '{'
    args <- P.many $ do
      P.notFollowedBy (char '}')
      name <- P.optionMaybe $ P.try $ do
        name <- parseName
        char ':'
        return name
      term <- parseTerm
      return (name, term)
    char '}'
    return args
  return $ Con nam args

parseCases :: String -> Parser [(String, Term)]
parseCases prefix = do
  cse <- P.many $ P.try $ do
    string prefix
    cnam <- parseName
    args <- P.option [] $ P.try $ do
      char '{'
      names <- P.many parseName
      char '}'
      return names
    char ':'
    cbod <- parseTerm
    return (cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) cbod args)
  dflt <- P.optionMaybe $ do
    dnam <- P.try $ do
      dnam <- parseName
      string ":"
      return dnam
    dbod <- parseTerm
    return (dnam, dbod)
  return $ case dflt of
    Just (dnam, dbod) -> cse ++ [("_", (Lam dnam (\_ -> dbod)))]
    Nothing           -> cse

parseSwiElim :: Parser (Term, Term)
parseSwiElim = do
  zero <- do
    P.try $ do
      char '0'
      char ':'
    parseTerm
  succ <- do
    string "_"
    pred <- P.optionMaybe $ do
      char '{'
      name <- parseName
      char '}'
      return name
    char ':'
    succ <- parseTerm
    return $ maybe succ (\name -> Lam name (\_ -> succ)) pred
  return (zero, succ)

parseMatCases :: Parser [(String, Term)]
parseMatCases = parseCases "#"

parseSwiCases :: Parser [(String, Term)]
parseSwiCases = parseCases ""

parseSwi = withSrc $ do
  P.try $ do
    char 'λ'
    char '{'
    P.lookAhead $ P.try $ do
      P.char '0'
  (zero, succ) <- parseSwiElim
  char '}'
  return $ Swi zero succ

parseMat = withSrc $ do
  P.try $ do
    string "λ"
    string "{"
  cse <- parseMatCases
  char '}'
  return $ Mat cse

parseRef = withSrc $ do
  name <- parseName
  (_, uses) <- P.getState
  let name' = expandUses uses name
  return $ case name' of
    "U32" -> U32
    _     -> Ref name'

parseLocal :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocal header ctor parseBody = withSrc $ P.choice
  [ parseLocalMch header ctor parseBody
  , parseLocalVal header ctor parseBody
  ]

parseLocalMch :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocalMch header ctor parseBody = do
  P.try $ string (header ++ " #")
  cnam <- parseName
  char '{'
  args <- P.many parseName
  char '}'
  char '='
  val <- parseTerm
  bod <- parseBody
  return $ ctor "got" val (\got ->
    App (Mat [(cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) bod args)]) got)

parseLocalVal :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocalVal header ctor parseBody = do
  P.try $ string (header ++ " ")
  nam <- parseName
  char '='
  val <- parseTerm
  bod <- parseBody
  return $ ctor nam val (\x -> bod)

parseLet :: Parser Term -> Parser Term
parseLet = parseLocal "let" Let

parseUse :: Parser Term -> Parser Term
parseUse = parseLocal "use" Use

parseSet = withSrc $ char '*' >> return Set

parseNum = withSrc $ Num . read <$> P.many1 digit

parseOp2 = withSrc $ do
  opr <- P.try $ do
    char '('
    parseOper
  fst <- parseTerm
  snd <- parseTerm
  char ')'
  return $ Op2 opr fst snd

parseLst = withSrc $ do
  char '['
  elems <- P.many parseTerm
  char ']'
  return $ Lst elems

parseTxtChr :: Parser Char
parseTxtChr = P.choice
  [ P.try $ do
      char '\\'
      c <- oneOf "\\\"nrtbf"
      return $ case c of
        '\\' -> '\\'
        '"'  -> '"'
        'n'  -> '\n'
        'r'  -> '\r'
        't'  -> '\t'
        'b'  -> '\b'
        'f'  -> '\f'
  , P.try $ do
      string "\\u"
      code <- P.count 4 P.hexDigit
      return $ toEnum (read ("0x" ++ code) :: Int)
  , noneOf "\"\\"
  ]

parseChr = withSrc $ do
  char '\''
  chr <- parseTxtChr
  char '\''
  return $ Num (fromIntegral $ ord chr)

parseTxt = withSrc $ do
  char '"'
  txt <- P.many parseTxtChr
  char '"'
  return $ Txt txt

parseHol = withSrc $ do
  char '?'
  nam <- parseName
  ctx <- P.option [] $ do
    char '['
    terms <- P.sepBy parseTerm (char ',')
    char ']'
    return terms
  return $ Hol nam ctx

parseMet = withSrc $ do
  char '_'
  return $ Met 0 []

parseName :: Parser String
parseName = do
  head <- letter
  tail <- P.many parseNameChar
  parseTrivia
  return (head : tail)

parseOper = P.choice
  [ P.try (string "+") >> return ADD
  , P.try (string "-") >> return SUB
  , P.try (string "*") >> return MUL
  , P.try (string "/") >> return DIV
  , P.try (string "%") >> return MOD
  , P.try (string "<<") >> return LSH
  , P.try (string ">>") >> return RSH
  , P.try (string "<=") >> return LTE
  , P.try (string ">=") >> return GTE
  , P.try (string "<") >> return LT
  , P.try (string ">") >> return GT
  , P.try (string "==") >> return EQ
  , P.try (string "!=") >> return NE
  , P.try (string "&") >> return AND
  , P.try (string "|") >> return OR
  , P.try (string "^") >> return XOR
  ]

parseSuffix :: Term -> Parser Term
parseSuffix term = P.choice
  [ parseSuffArr term
  , parseSuffAnn term
  , parseSuffVal term
  ]

parseSuffArr :: Term -> Parser Term
parseSuffArr term = do
  P.try $ string "->"
  ret <- parseTerm
  return $ All "_" term (\_ -> ret)

parseSuffAnn :: Term -> Parser Term
parseSuffAnn term = do
  P.try $ string "::"
  typ <- parseTerm
  return $ Ann False term typ

parseSuffVal :: Term -> Parser Term
parseSuffVal term = return term

-- Book Parser
-- -----------

parseBook :: Parser Book
parseBook = M.fromList <$> P.many parseDef

parseDef :: Parser (String, Term)
parseDef = do
  name <- parseName
  typ <- P.optionMaybe $ do
    char ':'
    t <- parseTerm
    return t
  val <- P.choice
    [ do
        char '='
        val <- parseTerm
        return val
    , do
        rules <- P.many1 $ do
          char '|'
          pats <- P.many parsePattern
          char '='
          body <- parseTerm
          return (pats, body)
        let (mat, bods) = unzip rules
        let flat = flattenDef mat bods 0 0
        return
          -- $ trace ("DONE: " ++ termShow flat)
          flat
    ]
  (_, uses) <- P.getState
  let name' = expandUses uses name
  case typ of
    Nothing -> return (name', val)
    Just t  -> return (name', bind (genMetas (Ann False val t)) [])

parsePattern :: Parser Pattern
parsePattern = do
  P.choice [
    do
      name <- parseName
      return (PVar name),
    do
      char '#'
      name <- parseName
      args <- P.option [] $ P.try $ do
        char '{'
        args <- P.many parsePattern
        char '}'
        return args
      return (PCtr name args)
    ]

parseUses :: Parser Uses
parseUses = P.many $ P.try $ do
  string "use "
  long <- parseName
  string "as "
  short <- parseName
  return (short, long)

expandUses :: Uses -> String -> String
expandUses uses name =
  case filter (\(short, _) -> short `isPrefixOf` name) uses of
    (short, long):_ -> long ++ drop (length short) name
    []              -> name

-- Syntax Sugars
-- -------------

parseDo :: Parser Term
parseDo = withSrc $ do
  P.try $ string "do "
  monad <- parseName
  char '{'
  parseTrivia
  (_, uses) <- P.getState
  body <- parseStmt (expandUses uses monad)
  char '}'
  return body

parseStmt :: String -> Parser Term
parseStmt monad = P.choice
  [ parseDoFor monad
  , parseDoAsk monad
  , parseDoRet monad
  , parseLet (parseStmt monad)
  , parseUse (parseStmt monad)
  , parseTerm
  ]

parseDoAsk :: String -> Parser Term
parseDoAsk monad = P.choice
  [ parseDoAskMch monad
  , parseDoAskVal monad
  ]

parseDoAskMch :: String -> Parser Term
parseDoAskMch monad = do
  P.try $ string "ask #"
  cnam <- parseName
  char '{'
  args <- P.many parseName
  char '}'
  char '='
  val <- parseTerm
  next <- parseStmt monad
  (_, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) val)
    (Lam "got" (\got ->
      App (Mat [(cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) next args)]) got))

parseDoAskVal :: String -> Parser Term
parseDoAskVal monad = P.choice
  [ parseDoAskValNamed monad
  , parseDoAskValAnon monad
  ]

parseDoAskValNamed :: String -> Parser Term
parseDoAskValNamed monad = do
  nam <- P.try $ do
    string "ask "
    nam <- parseName
    char '='
    return nam
  exp <- parseTerm
  next <- parseStmt monad
  (_, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam nam (\_ -> next))

parseDoAskValAnon :: String -> Parser Term
parseDoAskValAnon monad = do
  P.try $ string "ask "
  exp <- parseTerm
  next <- parseStmt monad
  (_, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam "_" (\_ -> next))

parseDoRet :: String -> Parser Term
parseDoRet monad = do
  P.try $ string "ret "
  exp <- parseTerm
  (_, uses) <- P.getState
  return $ App (App (Ref (monad ++ "/pure")) (Met 0 [])) exp

parseDoFor :: String -> Parser Term
parseDoFor monad = do
  (stt, nam, lst, loop, body) <- P.choice
    [ do
        stt <- P.try $ do
          string "ask "
          stt <- parseName
          string "="
          string "for"
          return stt
        nam <- parseName
        string "in"
        lst <- parseTerm
        char '{'
        loop <- parseStmt monad
        char '}'
        body <- parseStmt monad
        return (Just stt, nam, lst, loop, body)
    , do
        P.try $ string "for "
        nam <- parseName
        string "in"
        lst <- parseTerm
        char '{'
        loop <- parseStmt monad
        char '}'
        body <- parseStmt monad
        return (Nothing, nam, lst, loop, body) ]
  let f0 = Ref "Base/List/for-given"
  let f1 = App f0 (Met 0 [])
  let f2 = App f1 (Ref (monad ++ "/Monad"))
  let f3 = App f2 (Met 0 [])
  let f4 = App f3 (Met 0 [])
  let f5 = App f4 lst
  let f6 = App f5 (maybe (Num 0) Ref stt)
  let f7 = App f6 (Lam (maybe "" id stt) (\s -> Lam nam (\_ -> loop)))
  let b0 = Ref (monad ++ "/bind")
  let b1 = App b0 (Met 0 [])
  let b2 = App b1 (Met 0 [])
  let b3 = App b2 f7
  let b4 = App b3 (Lam (maybe "" id stt) (\_ -> body))
  return b4

-- If-Then-Else
-- ------------

-- if cond { t } else { f } 
-- --------------------------------- desugars to
-- match cond { #True: t #False: f }

parseIf = withSrc $ do
  P.try $ string "if "
  cond <- parseTerm
  char '{'
  t <- parseTerm
  char '}'
  string "else"
  f <- P.choice
    [ P.try $ do
        char '{'
        f <- parseTerm
        char '}'
        return f
    , parseIf
    ]
  return $ App (Mat [("True", t), ("False", f)]) cond

-- When
-- ----

-- when fn x { c0: v0 c1: v1 _: df }
-- -------------------------------------------------------- desugars to
-- if (fn x c0) { v0 } else if (fn x c1) { v1 } else { df }

parseWhen = withSrc $ do
  P.try $ string "when "
  fun <- parseTerm
  val <- parseTerm
  char '{'
  cases <- P.many $ do
    P.notFollowedBy (char '_')
    cond <- parseTerm
    char ':'
    body <- parseTerm
    return (cond, body)
  defaultCase <- do
    char '_'
    char ':'
    body <- parseTerm
    return $ body
  char '}'
  return $ foldr
    (\ (cond, body) acc -> App
      (Mat [("True", body), ("False", acc)])
      (App (App fun val) cond))
    defaultCase
    cases

-- Match
-- -----

parseMatInl :: Parser Term
parseMatInl = withSrc $ do
  P.try $ string "match "
  x <- parseTerm
  char '{'
  cse <- parseMatCases
  char '}'
  return $ App (Mat cse) x

parseSwiInl :: Parser Term
parseSwiInl = withSrc $ do
  P.try $ string "switch "
  x <- parseTerm
  char '{'
  P.choice
    [ do
        (zero, succ) <- parseSwiElim
        char '}'
        return $ App (Swi zero succ) x
    , do
        cases <- parseSwiCases
        char '}'
        -- TODO: this should desugar to a chain of if-then-elses. Example:
        -- switch x { 24: a 42: b _: d }
        -- ----------------------------------------------------------------- desugars to
        -- if (U60.eq x 24) { a } else { if (U60.eq x 42) { b } else { d } }
        -- Your goal is to desugar the 'cases : [(String,Term)]' object.
        -- Note that a default case ("_") is mandatory here. If it isn't
        -- present, we should raise a parse error saying that numeric 
        -- switch demands a default case. Do it now:
        let defaultCase = find (\(name, _) -> name == "_") cases
        case defaultCase of
          Nothing -> error "Numeric switch requires a default case"
          Just (_, defaultBody) -> do
            let nonDefaultCases = filter (\(name, _) -> name /= "_") cases
                buildIfChain [] = defaultBody
                buildIfChain ((num, body):rest) = App
                  (Mat [("True", body), ("False", buildIfChain rest)])
                  (App (App (Ref "Base/U32/eq") x) (Num (read num)))
            return $ buildIfChain nonDefaultCases
    ]

-- Nat
-- ---

parseNat :: Parser Term
parseNat = withSrc $ P.try $ do
  char '#'
  num <- P.many1 digit
  return $ Nat (read num)

-- Flattener
-- ---------

-- FIXME: the functions below are still a little bit messy and can be improved

-- Flattener for pattern matching equations
flattenDef :: [[Pattern]] -> [Term] -> Int -> Int -> Term
flattenDef pats bods fresh depth =
  -- trace (replicate (depth * 2) ' ' ++ "flattenDef: pats = " ++ show pats ++ ", bods = " ++ show (map termShow bods) ++ ", fresh = " ++ show fresh) $
  go pats bods fresh depth
  where
    go ([]:mat)   (bod:bods) fresh depth = bod
    go (pats:mat) (bod:bods) fresh depth
      | all isVar col  = flattenVarCol col mat' (bod:bods) fresh (depth + 1)
      | otherwise      = flattenAdtCol col mat' (bod:bods) fresh (depth + 1)
      where (col,mat') = getCol (pats:mat)
    go _ _ _ _ = error "internal error"

-- Flattens a column with only variables
flattenVarCol :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Int -> Term
flattenVarCol col mat bods fresh depth =
  -- trace (replicate (depth * 2) ' ' ++ "flattenVarCol: col = " ++ show col ++ ", fresh = " ++ show fresh) $
  let nam = maybe ("%x" ++ show fresh) id (getColName col)
      bod = flattenDef mat bods (fresh + 1) depth
  in Lam nam (\x -> bod)

-- Flattens a column with constructors and possibly variables
flattenAdtCol :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Int -> Term
flattenAdtCol col mat bods fresh depth = 
  -- trace (replicate (depth * 2) ' ' ++ "flattenAdtCol: col = " ++ show col ++ ", fresh = " ++ show fresh) $
  let nam = maybe ("%f" ++ show fresh) id (getColName col)
      ctr = map (makeCtrCase col mat bods (fresh+1) nam depth) (getColCtrs col)
      dfl = makeDflCase col mat bods fresh depth
  in Mat (ctr++dfl)

-- Creates a constructor case: '#Name: body'
makeCtrCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> String -> Int -> String -> (String, Term)
makeCtrCase col mat bods fresh var depth ctr = 
  -- trace (replicate (depth * 2) ' ' ++ "makeCtrCase: col = " ++ show col ++ ", mat = " ++ show mat ++ ", bods = " ++ show (map termShow bods) ++ ", fresh = " ++ show fresh ++ ", var = " ++ var ++ ", ctr = " ++ ctr) $
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods)
      bod           = flattenDef mat' bods' fresh (depth + 1)
  in (ctr, bod)
  where go ((PCtr nam ps), pats, bod) (mat, bods)
          | nam == ctr = ((ps ++ pats):mat, bod:bods)
          | otherwise  = (mat, bods)
        go ((PVar nam), pats, bod) (mat, bods) =
          let ar = getArity $ fromJust $ find (\case PCtr c _ | c == ctr -> True ; _ -> False) col
              ps = [PVar (nam++"."++show i) | i <- [0..ar-1]]
          in ((ps ++ pats) : mat, bod:bods)

-- Creates a default case: '#_: body'
makeDflCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Int -> [(String, Term)]
makeDflCase col mat bods fresh depth =
  -- trace (replicate (depth * 2) ' ' ++ "makeDflCase: col = " ++ show col ++ ", fresh = " ++ show fresh) $
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods) in
  if null bods' then [] else [("_", flattenDef mat' bods' (fresh+1) (depth + 1))]
  where go ((PVar nam), pats, bod) (mat, bods) = (((PVar nam):pats):mat, bod:bods)
        go (ctr,        pats, bod) (mat, bods) = (mat, bods)

-- Helper Functions

isVar :: Pattern -> Bool
isVar (PVar _) = True
isVar _        = False

getArity :: Pattern -> Int
getArity (PCtr _ pats) = length pats
getArity _             = 0

getCol :: [[Pattern]] -> ([Pattern], [[Pattern]])
getCol (pats:mat) = unzip (catMaybes (map uncons (pats:mat)))

getColCtrs :: [Pattern] -> [String]
getColCtrs col = toList . fromList $ foldr (\pat acc -> case pat of (PCtr nam _) -> nam:acc ; _ -> acc) [] col

getColName :: [Pattern] -> Maybe String
getColName col = foldr (A.<|>) Nothing $ map (\case PVar nam -> Just nam; _ -> Nothing) col
