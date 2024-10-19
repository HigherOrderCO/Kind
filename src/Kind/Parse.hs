-- //./Type.hs//

module Kind.Parse where

import Data.Char (ord)
import Data.Functor.Identity (Identity)
import Data.List (intercalate, isPrefixOf, uncons)
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
    , parseNat -- sugar
    , parseCon
    , (parseUse parseTerm)
    , (parseLet parseTerm)
    , (parseMch parseTerm) -- sugar
    , parseDo -- sugar
    , parseSet
    , parseNum
    , parseTxt -- sugar
    , parseLst -- sugar
    , parseChr -- sugar
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
  P.try $ string "#["
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
  char '{'
  fields <- P.many $ P.try $ do
    nam <- parseName
    char ':'
    typ <- parseTerm
    return (nam, typ)
  char '}'
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

parseSwi = withSrc $ do
  P.try $ string "λ{0:"
  zero <- parseTerm
  string "_:"
  succ <- parseTerm
  char '}'
  return $ Swi zero succ

parseCse :: Parser [(String, Term)]
parseCse = do
  cse <- P.many $ P.try $ do
    char '#'
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

parseMat = withSrc $ do
  P.try $ string "λ{"
  cse <- parseCse
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

parseTxt = withSrc $ do
  char '"'
  txt <- P.many parseTxtChr
  char '"'
  return $ Txt (concat txt)

parseTxtChr :: Parser String
parseTxtChr = P.choice
  [ P.try $ do
      char '\\'
      c <- oneOf "\\\"nrtbf"
      return $ case c of
        '\\' -> "\\"
        '"'  -> "\""
        'n'  -> "\n"
        'r'  -> "\r"
        't'  -> "\t"
        'b'  -> "\b"
        'f'  -> "\f"
  , P.try $ do
      string "\\u"
      code <- P.count 4 P.hexDigit
      return [toEnum (read ("0x" ++ code) :: Int)]
  , fmap (:[]) (noneOf "\"\\")
  ]

parseLst = withSrc $ do
  char '['
  elems <- P.many parseTerm
  char ']'
  return $ Lst elems

parseChr = withSrc $ do
  char '\''
  chr <- parseEscaped <|> noneOf "'\\"
  char '\''
  return $ Num (fromIntegral $ ord chr)
  where
    parseEscaped :: Parser Char
    parseEscaped = do
      char '\\'
      c <- oneOf "\\\'nrt"
      return $ case c of
        '\\' -> '\\'
        '\'' -> '\''
        'n'  -> '\n'
        'r'  -> '\r'
        't'  -> '\t'

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
        let flat = clean (flattenDef mat bods 0) 0
        return $ trace ("DONE: " ++ termShow flat) flat
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
      char '{'
      args <- P.many parsePattern
      char '}'
      return (PCtr name args)
    ]

-- Flattener
-- ---------

colName :: [Pattern] -> Maybe String
colName col = foldr (A.<|>) Nothing $ map (\case PVar nam -> Just nam; _ -> Nothing) col

isVar :: Pattern -> Bool
isVar (PVar _) = True
isVar _        = False

countSubPatterns :: Pattern -> Int
countSubPatterns (PCtr _ pats) = length pats
countSubPatterns _             = 0

extractConstructors :: [Pattern] -> [String]
extractConstructors = foldr (\pat acc -> case pat of (PCtr nam _) -> nam:acc ; _ -> acc) []

-- Flattener for pattern matching equations
flattenDef :: [[Pattern]] -> [Term] -> Int -> Term
flattenDef (pats:mat) (bod:bods) fresh = 
  trace ("Flattening definition with " ++ show (length (pats:mat)) ++ " rows") $
  if null pats 
    then trace "No patterns left, returning body" bod
    else 
      let bods' = bod:bods
          (col, mat') = unzip (catMaybes (map uncons (pats:mat)))
      in if all isVar col
           then trace "All patterns are variables, flattening variables" $ flattenVar col mat' bods' fresh
           else trace "ADT patterns found, flattening ADT" $ flattenAdt col mat' bods' fresh
flattenDef _ _ fresh = trace "Error: No patterns or bodies left" $ Hol "flatten error" []

-- Handle variable patterns
flattenVar :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Term
flattenVar col mat bods fresh = 
  trace ("Flattening variable patterns: " ++ show col) $
  let var'   = "%x" ++ show fresh ++ "-LAM"
      fresh' = fresh + 1
      var    = maybe var' id (colName col)
      bods'  = zipWith useVarInBody col bods
      bod    = flattenDef mat bods' fresh'
  in Lam var (\x -> bod)

useVarInBody :: Pattern -> Term -> Term
useVarInBody (PVar nam) bod = Use nam (Ref nam) (\x -> bod)
useVarInBody _          bod = bod

-- Handle ADT patterns
flattenAdt :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Term
flattenAdt col mat bods fresh = 
  trace ("Flattening ADT patterns: " ++ show col ++ " name: " ++ maybe ("%x" ++ show fresh ++ "-ADT") id (colName col)) $
  let var'  = "%x" ++ show fresh ++ "-ADT"
      fresh'= fresh + 1
      var   = maybe var' id (colName col)
      ctrs' = toList (fromList (extractConstructors col))
      nPats = maximum (map countSubPatterns col)
      cse   = map (processCtr col mat bods nPats fresh' var) ctrs'
      dfl   = processDefaultCase col mat bods var
      cse'  = if null (snd dfl) then cse else cse ++ [("_", flattenDef (fst dfl) (snd dfl) fresh')]
      bod   = App (Mat cse') (Ref var)
  in Lam var (\x -> bod)

processCtr :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Int -> String -> String -> (String, Term)
processCtr col mat bods nPats fresh' var ctr = 
  trace ("Processing constructor: " ++ ctr) $
  let (mat', bods') = foldr (processPattern ctr nPats var) ([], []) (zip3 col mat bods)
      bod           = flattenDef mat' bods' fresh'
  in (ctr, bod)

processPattern :: String -> Int -> String -> (Pattern, [Pattern], Term) -> ([[Pattern]], [Term]) -> ([[Pattern]], [Term])
processPattern ctr nPats var (pat, pats, bod) (mat, bods) = case pat of
  (PCtr nam newPats) -> 
    if nam == ctr
      then ((newPats ++ pats):mat, bod:bods)
      else (mat, bods)
  (PVar nam) -> 
    let newPats = [PVar (nam ++ "." ++ show i) | i <- [0..nPats-1]]
        bod' = Use nam (Ref var) (\x -> bod)
    in ((newPats ++ pats):mat, bod':bods)

processDefaultCase :: [Pattern] -> [[Pattern]] -> [Term] -> String -> ([[Pattern]], [Term])
processDefaultCase col mat bods var = 
  trace "Processing default case" $
  foldr processDefaultPattern ([], []) (zip3 col mat bods)

processDefaultPattern :: (Pattern, [Pattern], Term) -> ([[Pattern]], [Term]) -> ([[Pattern]], [Term])
processDefaultPattern (pat, pats, bod) (mat', bods') =
  -- TODO: make the log above more expressive, by also logging all terms in bods'
  -- write below the updated 'trace' statement
  trace ("Processing default pattern: " ++ show pat ++ ", " ++ show pats ++ ", " ++ termShow bod ++ ", bods': " ++ show (map termShow bods')) $
  case pat of
    PVar nam -> 
      let bod' = Use nam (Ref nam) (\x -> bod)
      in ((pat:pats):mat', bod':bods')
    _ -> (mat', bods')

-- FIXME: refactor the flattener to avoid needing this
clean :: Term -> Int -> Term
clean term dep = {-trace ("clean " ++ termShower False term dep) $-} maybe (go term dep) id (fix term dep) where

  fix (Lam nam bod) dep
    | App (Mat cse) (Ref arg) <- bod (Var nam dep)
    , nam == arg
    = Just (clean (Mat cse) dep)
  fix (Use nam (Ref val) bod) dep
    | nam == val
    = Just (clean (bod (Ref "??")) dep)
  fix other dep
    = Nothing

  go (All nam typ bod) dep =
    let typ' = clean typ dep
        bod' = \x -> clean (bod x) (dep+1)
    in All nam typ' bod'
  go (Lam nam bod) dep = 
    let bod' = \x -> clean (bod x) (dep+1)
    in Lam nam bod'
  go (App fun arg) dep =
    let fun' = clean fun dep
        arg' = clean arg dep
    in App fun' arg'
  go (Ann chk val typ) dep =
    let val' = clean val dep
        typ' = clean typ dep
    in Ann chk val' typ'
  go (Slf nam typ bod) dep =
    let typ' = clean typ dep
        bod' = \x -> clean (bod x) (dep+1)
    in Slf nam typ' bod'
  go (Ins val) dep =
    let val' = clean val dep
    in Ins val'
  go (Dat scp cts) dep =
    let scp' = map (\t -> clean t dep) scp
        cts' = map (\(Ctr n t) -> Ctr n (cleanTele t dep)) cts
    in Dat scp' cts'
  go (Con nam args) dep =
    let args' = map (\(n, t) -> (n, clean t dep)) args
    in Con nam args'
  go (Mat cse) dep =
    let cse' = map (\(n, t) -> (n, clean t dep)) cse
    in Mat cse'
  go (Use nam val bod) dep =
    let val' = clean val dep
        bod' = \x -> clean (bod x) (dep+1)
    in Use nam val' bod'
  go (Let nam val bod) dep =
    let val' = clean val dep
        bod' = \x -> clean (bod x) (dep+1)
    in Let nam val' bod'
  go (Op2 op a b) dep =
    let a' = clean a dep
        b' = clean b dep
    in Op2 op a' b'
  go (Swi zero succ) dep =
    let zero' = clean zero dep
        succ' = clean succ dep
    in Swi zero' succ'
  go (Hol nam ctx) dep =
    let ctx' = map (\t -> clean t dep) ctx
    in Hol nam ctx'
  go (Met idx ctx) dep =
    let ctx' = map (\t -> clean t dep) ctx
    in Met idx ctx'
  go (Src cod term) dep =
    let term' = clean term dep
    in Src cod term'
  go (Ref name) dep = Ref name
  go Set dep = Set
  go U32 dep = U32
  go (Num n) dep = Num n
  go (Txt s) dep = Txt s
  go (Lst ts) dep =
    let ts' = map (\t -> clean t dep) ts
    in Lst ts'
  go (Nat n) dep = Nat n
  go (Var nam idx) dep = Var nam idx


cleanTele :: Tele -> Int -> Tele
cleanTele (TRet term) dep = TRet (clean term dep)
cleanTele (TExt nam typ tele) dep =
  let typ'  = clean typ dep
      tele' = \x -> cleanTele (tele x) (dep+1)
  in TExt nam typ' tele'

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
parseDoAskVal monad = do
  P.try $ string "ask "
  nam <- P.optionMaybe parseName
  exp <- case nam of
    Just var -> char '=' >> parseTerm
    Nothing  -> parseTerm
  next <- parseStmt monad
  (_, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam (maybe "_" id nam) (\_ -> next))

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

-- Match
-- -----

parseMch :: Parser Term -> Parser Term
parseMch parseBody = withSrc $ do
  P.try $ string "match "
  x <- parseTerm
  char '{'
  cse <- parseCse
  char '}'
  return $ App (Mat cse) x

-- Match
-- -----

parseNat :: Parser Term
parseNat = withSrc $ P.try $ do
  char '#'
  num <- P.many1 digit
  return $ Nat (read num)
