-- //./Type.hs//

module Kind.Parse where

import Data.Char (ord)
import Data.Functor.Identity (Identity)
import Data.List (intercalate, isPrefixOf, uncons, unsnoc, find, transpose)
import Data.Maybe (catMaybes, fromJust, isJust)
import Data.Set (toList, fromList)
import Data.Word
import Debug.Trace
import Highlight (highlightError, highlight)
import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Prelude hiding (EQ, LT, GT)
import System.Console.ANSI
import Text.Parsec ((<?>), (<|>), getPosition, sourceLine, sourceColumn, getState, setState)
import Text.Parsec.Error (errorPos, errorMessages, showErrorMessages, ParseError, errorMessages, Message(..))
import qualified Control.Applicative as A
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Text.Parsec as P

type Uses     = [(String, String)]
type PState   = (String, Int, Uses)
type Parser a = P.ParsecT String PState Identity a
-- Types used for flattening pattern-matching equations
type Rule     = ([Pattern], Term)
data Pattern  = PVar String | PCtr (Maybe String) String [Pattern] | PNum Word64 | PSuc Word64 String

-- Helper functions that consume trailing whitespace
skip :: Parser ()
skip = P.skipMany (parseSpace <|> parseComment)
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
char c = P.char c

string :: String -> Parser String
string s = P.string s

char_skp :: Char -> Parser Char
char_skp c = P.char c <* skip

string_skp :: String -> Parser String
string_skp s = P.string s <* skip

name_init :: Parser Char
name_init = P.satisfy (`elem` "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/_.-$")

name_char :: Parser Char
name_char = P.satisfy (`elem` "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/_.-$")

name :: Parser String
name = (do
  head <- name_init
  tail <- P.many name_char
  return (head : tail)) <?> "Name"

name_skp :: Parser String
name_skp = name <* skip

digit :: Parser Char
digit = P.digit

numeric :: Parser String
numeric = (do
  head <- P.satisfy (`elem` "0123456789")
  tail <- P.many (P.satisfy (`elem` "bx0123456789abcdefABCDEF_"))
  return $ show (read (filter (/= '_') (head : tail)) :: Word64)) <?> "Number"

numeric_skp :: Parser String
numeric_skp = numeric <* skip

oneOf :: String -> Parser Char
oneOf s = P.oneOf s

noneOf :: String -> Parser Char
noneOf s = P.noneOf s

guardChoice :: [(Parser a, Parser ())] -> Parser a -> Parser a
guardChoice []          df = df
guardChoice ((p, g):ps) df = do
  guard <- P.lookAhead $ P.optionMaybe $ P.try g
  case guard of
    Just () -> p
    Nothing -> guardChoice ps df

discard :: Parser a -> Parser ()
discard p = p >> return ()

-- Main parsing functions
doParseTerm :: String -> String -> IO Term
doParseTerm filename input =
  case P.runParser (parseTerm <* P.eof) (filename, 0, []) filename input of
    Left err -> do
      showParseError filename input err
      return $ Ref "bad-parse"
    Right term -> return $ bind (genMetas term) []

doParseUses :: String -> String -> IO Uses
doParseUses filename input =
  case P.runParser (parseUses <* P.eof) (filename, 0, []) filename input of
    Left err -> do
      showParseError filename input err
      return $ []
    Right uses -> return uses

doParseBook :: String -> String -> IO Book
doParseBook filename input = do
  let parser = do
        skip
        uses <- parseUses
        setState (filename, 0, uses)
        parseBook <* P.eof
  case P.runParser parser (filename, 0, []) filename input of
    Left err -> do
      showParseError filename input err
      return M.empty
    Right book -> return book

-- Error handling
extractExpectedTokens :: ParseError -> String
extractExpectedTokens err =
    let expectedMsgs = [msg | Expect msg <- errorMessages err, msg /= "Space", msg /= "Comment"]
    in intercalate " | " expectedMsgs

showParseError :: String -> String -> P.ParseError -> IO ()
showParseError filename input err = do
  let pos = errorPos err
  let lin = sourceLine pos
  let col = sourceColumn pos
  let errorMsg = extractExpectedTokens err
  putStrLn $ setSGRCode [SetConsoleIntensity BoldIntensity] ++ "\nPARSE_ERROR" ++ setSGRCode [Reset]
  putStrLn $ "- expected: " ++ errorMsg
  putStrLn $ "- detected:"
  putStrLn $ highlightError (lin, col) (lin, col + 1) input
  putStrLn $ setSGRCode [SetUnderlining SingleUnderline] ++ filename ++
             setSGRCode [Reset] ++ " " ++ show lin ++ ":" ++ show col

-- Parsing helpers
-- FIXME: currently, this will include suffix trivia. how can we avoid that?
withSrc :: Parser Term -> Parser Term
withSrc parser = do
  ini <- getPosition
  val <- parser
  end <- getPosition
  (nam, _, _) <- P.getState
  skip
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

-- Term Parser
-- -----------

-- Main term parser
parseTerm :: Parser Term
parseTerm = do
  skip
  term <- guardChoice
    [ (parseAll,             discard $ string_skp "∀")
    , (parseSwi,             discard $ string_skp "λ" >> string_skp "{" >> string_skp "0")
    , (parseMat,             discard $ string_skp "λ" >> string_skp "{" >> string_skp "#")
    , (parseLam,             discard $ string_skp "λ")
    , (parseEra,             discard $ string_skp "λ")
    , (parseOp2,             discard $ string_skp "(" >> parseOper)
    , (parseMap,             discard $ string_skp "(Map ")
    , (parseApp,             discard $ string_skp "(")
    , (parseSlf,             discard $ string_skp "$(")
    , (parseIns,             discard $ string_skp "~")
    , (parseADT,             discard $ string_skp "#[" <|> string_skp "data[")
    , (parseNat,             discard $ string_skp "#" >> digit)
    , (parseCon,             discard $ string_skp "#" >> name)
    , ((parseUse parseTerm), discard $ string_skp "use ")
    , ((parseLet parseTerm), discard $ string_skp "let ")
    , ((parseGet parseTerm), discard $ string_skp "get ")
    , ((parsePut parseTerm), discard $ string_skp "put ")
    , (parseIf,              discard $ string_skp "if ")
    , (parseWhen,            discard $ string_skp "when ")
    , (parseMatInl,          discard $ string_skp "match ")
    , (parseSwiInl,          discard $ string_skp "switch ")
    , (parseKVs,             discard $ string_skp "{")
    , (parseDo,              discard $ string_skp "do ")
    , (parseSet,             discard $ string_skp "*")
    , (parseFloat,           discard $ string_skp "-" <|> (P.many1 digit >> string_skp "."))
    , (parseNum,             discard $ numeric)
    , (parseTxt,             discard $ string_skp "\"")
    , (parseLst,             discard $ string_skp "[")
    , (parseChr,             discard $ string_skp "'")
    , (parseHol,             discard $ string_skp "?")
    , ((parseLog parseTerm), discard $ string_skp "log ")
    , (parseRef,             discard $ name)
    ] $ fail "Term"
  skip
  parseSuffix term

-- Individual term parsers
parseAll = withSrc $ do
  string_skp "∀"
  era <- P.optionMaybe (char_skp '-')
  char_skp '('
  nam <- name_skp
  char_skp ':'
  inp <- parseTerm
  char_skp ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = withSrc $ do
  string_skp "λ"
  era <- P.optionMaybe (char_skp '-')
  nam <- name_skp
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseEra = withSrc $ do
  string_skp "λ"
  era <- P.optionMaybe (char_skp '-')
  nam <- char_skp '_'
  bod <- parseTerm
  return $ Lam "_" (\x -> bod)

parseApp = withSrc $ do
  char_skp '('
  fun  <- parseTerm
  args <- P.many $ do
    P.notFollowedBy (char ')')
    era <- P.optionMaybe (char_skp '-')
    arg <- parseTerm
    return (era, arg)
  char ')'
  return $ foldl (\f (era, a) -> App f a) fun args

parseSlf = withSrc $ do
  string_skp "$("
  nam <- name_skp
  char_skp ':'
  typ <- parseTerm
  char_skp ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = withSrc $ do
  char_skp '~'
  val <- parseTerm
  return $ Ins val

parseADT = withSrc $ do
  P.choice [string_skp "#[", string_skp "data["]
  scp <- P.many parseTerm
  char_skp ']'
  char_skp '{'
  cts <- P.many $ P.try parseADTCtr
  char '}'
  typ <- do
    skip
    char_skp ':'
    parseTerm
  return $ ADT scp cts typ

parseADTCtr :: Parser Ctr
parseADTCtr = do
  char_skp '#'
  name <- name_skp
  tele <- parseTele
  return $ Ctr name tele

parseTele :: Parser Tele
parseTele = do
  fields <- P.option [] $ do
    char_skp '{'
    fields <- P.many $ P.try $ do
      nam <- name_skp
      char_skp ':'
      typ <- parseTerm
      return (nam, typ)
    char_skp '}'
    return fields
  ret <- P.choice
    [ do
        P.try $ char_skp ':'
        parseTerm
    , do
        return (Met 0 [])
    ]
  return $ foldr (\(nam, typ) acc -> TExt nam typ (\x -> acc)) (TRet ret) fields

parseCon = withSrc $ do
  char_skp '#'
  nam <- name
  args <- P.option [] $ P.try $ do
    skip
    char_skp '{'
    args <- P.many $ do
      P.notFollowedBy (char_skp '}')
      name <- P.optionMaybe $ P.try $ do
        name <- name_skp
        char_skp ':'
        return name
      term <- parseTerm
      return (name, term)
    char '}'
    return args
  return $ Con nam args

parseMatCases :: Parser [(String, Term)]
parseMatCases = do
  cse <- P.many $ P.try $ do
    string_skp "#"
    cnam <- name_skp
    args <- P.option [] $ P.try $ do
      char_skp '{'
      names <- P.many name_skp
      char_skp '}'
      return names
    char_skp ':'
    cbod <- parseTerm
    return (cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) cbod args)
  dflt <- P.optionMaybe $ do
    dnam <- P.try $ do
      dnam <- name_skp
      string_skp ":"
      return dnam
    dbod <- parseTerm
    return (dnam, dbod)
  return $ case dflt of
    Just (dnam, dbod) -> cse ++ [("_", (Lam dnam (\_ -> dbod)))]
    Nothing           -> cse

parseSwiCases :: Parser Term
parseSwiCases = do
  cse <- P.many $ P.try $ do
    cnam <- numeric_skp
    char_skp ':'
    cbod <- parseTerm
    return (cnam, cbod)
  dflt <- P.optionMaybe $ do
    dnam <- P.try $ do
      cnam <- numeric_skp
      char_skp '+'
      dnam <- name_skp
      string_skp ":"
      return dnam
    dbod <- parseTerm
    return (dnam, dbod)
  case dflt of
    Just (dnam, dbod) -> return $ build (cse ++ [("_", (Lam dnam (\_ -> dbod)))]) 0
    Nothing           -> return $ build cse 0
  where build :: [(String, Term)] -> Int -> Term
        build []           i               = error "Switch must have at least one case."
        build (("_",t):cs) i               = t
        build ((n,t):cs)   i | read n == i = Swi t (build cs (i+1))
        build ((n,t):cs)   i | otherwise   = error "Switch cases must be in ascending order starting from 0."

parseSwiElim :: Parser Term
parseSwiElim = do
  cases <- parseSwiCases
  return cases

parseSwi = withSrc $ do
  char_skp 'λ'
  char_skp '{'
  P.lookAhead $ P.try $ char_skp '0'
  elim <- parseSwiElim
  char '}'
  return $ elim

parseMat = withSrc $ do
  char_skp 'λ'
  char_skp '{'
  cse <- parseMatCases
  char '}'
  return $ Mat cse

-- TODO: implement the Map parsers
parseMap = withSrc $ do
  string_skp "(Map "
  typ <- parseTerm
  char ')'
  return $ Map typ

parseKVs = withSrc $ do
  char_skp '{'
  kvs <- P.many parseKV
  char_skp '|'
  dft <- parseTerm
  char '}'
  return $ KVs (IM.fromList kvs) dft
  where
    parseKV = do
      key <- read <$> numeric_skp
      char_skp ':'
      val <- parseTerm
      return (key, val)

parseGet parseBody = withSrc $ do
  string_skp "get "
  got <- name_skp
  string_skp "="
  nam <- name_skp
  map <- P.option (Ref nam) $ P.try $ char_skp '@' >> parseTerm
  char_skp '['
  key <- parseTerm
  char_skp ']'
  bod <- parseBody
  return $ Get got nam map key (\x y -> bod)

parsePut parseBody = withSrc $ do
  string_skp "put "
  got <- P.option "_" $ P.try $ do
    got <- name_skp
    string_skp "="
    return got
  nam <- name_skp
  map <- P.option (Ref nam) $ P.try $ char_skp '@' >> parseTerm
  char_skp '['
  key <- parseTerm
  char_skp ']'
  string_skp ":="
  val <- parseTerm
  bod <- parseBody
  return $ Put got nam map key val (\x y -> bod)

parseRef = withSrc $ do
  name <- name
  (_, _, uses) <- P.getState
  let name' = expandUses uses name
  return $ case name' of
    "U64" -> U64
    "F64" -> F64
    "Set" -> Set
    "_"   -> Met 0 []
    _     -> Ref name'

parseLocal :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocal header ctor parseBody = withSrc $ P.choice
  [ parseLocalMch header ctor parseBody
  , parseLocalPar header ctor parseBody
  , parseLocalVal header ctor parseBody
  ]

parseLocalMch :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocalMch header ctor parseBody = do
  P.try $ string_skp (header ++ " #")
  cnam <- name_skp
  char_skp '{'
  args <- P.many name_skp
  char_skp '}'
  char_skp '='
  val <- parseTerm
  bod <- parseBody
  return $ ctor "got" val (\got ->
    App (Mat [(cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) bod args)]) got)

parseLocalPar :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocalPar header ctor parseBody = do
  P.try $ string_skp (header ++ " (")
  head <- name_skp
  tail <- P.many $ do
    char_skp ','
    name_skp
  char_skp ')'
  let (init, last) = maybe ([], head) id $ unsnoc (head : tail)
  char_skp '='
  val <- parseTerm
  bod <- parseBody
  return $ ctor "got" val (\got ->
    App (foldr (\x acc -> Mat [("Pair", Lam x (\_ -> acc))]) (Lam last (\_ -> bod)) init) got)

parseLocalVal :: String -> (String -> Term -> (Term -> Term) -> Term) -> Parser Term -> Parser Term
parseLocalVal header ctor parseBody = do
  P.try $ string_skp (header ++ " ")
  nam <- name_skp
  char_skp '='
  val <- parseTerm
  bod <- parseBody
  return $ ctor nam val (\x -> bod)

parseLet :: Parser Term -> Parser Term
parseLet = parseLocal "let" Let

parseUse :: Parser Term -> Parser Term
parseUse = parseLocal "use" Use

parseSet = withSrc $ char '*' >> return Set

parseFloat = withSrc $ P.try $ do
  -- Parse optional negative sign
  sign <- P.option id $ P.char '-' >> return negate

  -- Parse integer part
  intPart <- P.many1 digit

  -- Parse decimal part (this must succeed, or we fail the whole parser)
  decPart <- do
    char '.'
    P.many1 digit

  -- Parse optional exponent
  expPart <- P.option 0 $ P.try $ do
    oneOf "eE"
    expSign <- P.option '+' (oneOf "+-")
    exp <- read <$> P.many1 digit
    return $ if expSign == '-' then -exp else exp

  -- Combine parts into final float
  let floatStr = intPart ++ "." ++ decPart
  let value = (read floatStr :: Double) * (10 ^^ expPart)

  -- Apply the sign to the final value
  return $ Flt (sign value)

parseNum = withSrc $ do
  val <- numeric
  return $ Num (read (filter (/= '_') val))

parseOp2 = withSrc $ do
  char_skp '('
  opr <- parseOper
  fst <- parseTerm
  snd <- parseTerm
  char ')'
  return $ Op2 opr fst snd

parseLst = withSrc $ do
  char_skp '['
  elems <- P.many parseTerm
  char ']'
  return $ Lst elems

parseTxtChr :: Parser Char
parseTxtChr = P.choice
  [ P.try $ do
      char_skp '\\'
      c <- oneOf "\\\"nrtbf0/\'"
      return $ case c of
        '\\' -> '\\'
        '/'  -> '/'
        '"'  -> '"'
        '\'' -> '\''
        'n'  -> '\n'
        'r'  -> '\r'
        't'  -> '\t'
        'b'  -> '\b'
        'f'  -> '\f'
        '0'  -> '\0'
  , P.try $ do
      string_skp "\\u"
      code <- P.count 4 P.hexDigit
      return $ toEnum (read ("0x" ++ code) :: Int)
  , noneOf "\"\\"
  ]

parseTxt = withSrc $ do
  char '"'
  txt <- P.many parseTxtChr
  char '"'
  return $ Txt txt

parseChr = withSrc $ do
  char '\''
  chr <- parseTxtChr
  char '\''
  return $ Num (fromIntegral $ ord chr)

parseHol = withSrc $ do
  char_skp '?'
  nam <- name_skp
  ctx <- P.option [] $ do
    char_skp '['
    terms <- P.sepBy parseTerm (char_skp ',')
    char ']'
    return terms
  return $ Hol nam ctx

parseLog parseBody = withSrc $ do
  string_skp "log "
  msg <- parseTerm
  val <- parseBody
  return $ Log msg val

parseOper = P.choice
  [ P.try (string_skp "+") >> return ADD
  , P.try (string_skp "-") >> return SUB
  , P.try (string_skp "*") >> return MUL
  , P.try (string_skp "/") >> return DIV
  , P.try (string_skp "%") >> return MOD
  , P.try (string_skp "<<") >> return LSH
  , P.try (string_skp ">>") >> return RSH
  , P.try (string_skp "<=") >> return LTE
  , P.try (string_skp ">=") >> return GTE
  , P.try (string_skp "<") >> return LT
  , P.try (string_skp ">") >> return GT
  , P.try (string_skp "==") >> return EQ
  , P.try (string_skp "!=") >> return NE
  , P.try (string_skp "&") >> return AND
  , P.try (string_skp "|") >> return OR
  , P.try (string_skp "^") >> return XOR
  ] <?> "Binary operator"

parseSuffix :: Term -> Parser Term
parseSuffix term = guardChoice
  [ (parseSuffArr term, discard $ string_skp "->")
  , (parseSuffAnn term, discard $ string_skp "::")
  , (parseSuffEql term, discard $ string_skp "==")
  , (parseSuffPAR term, discard $ string_skp "&")
  , (parseSuffPar term, discard $ string_skp ",")
  , (parseSuffCns term, discard $ string_skp ";;")
  ] $ parseSuffVal term

parseSuffArr :: Term -> Parser Term
parseSuffArr term = do
  P.try $ string_skp "->"
  ret <- parseTerm
  return $ All "_" term (\_ -> ret)

parseSuffAnn :: Term -> Parser Term
parseSuffAnn term = do
  P.try $ string_skp "::"
  typ <- parseTerm
  return $ Ann True term typ

parseSuffEql :: Term -> Parser Term
parseSuffEql term = do
  P.try $ string_skp "=="
  other <- parseTerm
  return $ App (App (App (Ref "Equal") (Met 0 [])) term) other

parseSuffPAR :: Term -> Parser Term
parseSuffPAR fst = do
  P.try $ string_skp "&"
  snd <- parseTerm
  return $ App (App (Ref "Pair") fst) snd

parseSuffPar :: Term -> Parser Term
parseSuffPar fst = do
  P.try $ string_skp ","
  snd <- parseTerm
  return $ Con "Pair" [(Nothing, fst), (Nothing, snd)]

parseSuffCns :: Term -> Parser Term
parseSuffCns head = do
  P.try $ string_skp ";;"
  tail <- parseTerm
  return $ Con "Cons" [(Nothing, head), (Nothing, tail)]

parseSuffVal :: Term -> Parser Term
parseSuffVal term = return term

-- Book Parser
-- -----------

parseBook :: Parser Book
parseBook = M.fromList <$> P.many parseDef

parseDef :: Parser (String, Term)
parseDef = guardChoice
  [ (parseDefADT, discard $ string_skp "data ")
  , (parseDefFun, discard $ string_skp "#" <|> name_skp)
  ] $ fail "Top-level definition"

parseDefADT :: Parser (String, Term)
parseDefADT = do
  (_, _, uses) <- P.getState
  P.try $ string_skp "data "
  name <- name_skp
  let nameA = expandUses uses name
  params <- P.many $ do
    P.try $ char_skp '('
    pname <- name_skp
    char_skp ':'
    ptype <- parseTerm
    char_skp ')'
    return (pname, ptype)
  indices <- P.choice
    [ do
        P.try $ char_skp '~'
        P.many $ do
          P.notFollowedBy (char '{')
          char_skp '('
          iname <- name_skp
          char_skp ':'
          itype <- parseTerm
          char_skp ')'
          return (iname, itype)
    , return []
    ]
  char_skp '{'
  ctrs <- P.many $ P.try parseADTCtr
  char_skp '}'
  let paramTypes = map snd params
  let indexTypes = map snd indices
  let paramNames = map fst params
  let indexNames = map fst indices
  let allParams  = params ++ indices
  let selfType   = foldl (\ acc arg -> App acc (Ref arg)) (Ref nameA) (paramNames ++ indexNames)
  let typeBody   = foldr (\ (pname, ptype) acc -> All pname ptype (\_ -> acc)) Set allParams
  let newCtrs    = map (fillCtrRet selfType) ctrs -- fill ctr type when omitted
  let dataBody   = ADT (map (\ (iNam,iTyp) -> Ref iNam) indices) newCtrs selfType
  let fullBody   = foldr (\ (pname, _) acc -> Lam pname (\_ -> acc)) dataBody allParams
  let term       = bind (genMetas (Ann False fullBody typeBody)) []
  return $
    -- trace ("parsed " ++ nameA ++ " = " ++ (showTermGo False term 0))
    (nameA, term)
  where fillCtrRet  ret (Ctr nm tele)    = Ctr nm (fillTeleRet ret tele)
        fillTeleRet ret (TRet (Met _ _)) = TRet ret
        fillTeleRet _   (TRet ret)       = TRet ret
        fillTeleRet ret (TExt nm tm bod) = TExt nm tm (\x -> fillTeleRet ret (bod x)) -- FIXME: 'bod x'?

parseDefFun :: Parser (String, Term)
parseDefFun = do
  numb <- P.optionMaybe $ char_skp '#'
  name <- name_skp
  typ <- P.optionMaybe $ do
    char_skp ':'
    t <- parseTerm
    return t
  val <- guardChoice
    [ (parseDefFunSingle, discard $ char_skp '=')
    , (parseDefFunRules,  discard $ char_skp '|')
    ] parseDefFunTest
  (filename, count, uses) <- P.getState
  let name0 = expandUses uses name
  let name1 = if isJust numb then name0 ++ "#" ++ show count else name0
  P.setState (filename, if isJust numb then count + 1 else count, uses)
  case typ of
    Nothing -> return (name1, bind (genMetas val) [])
    Just t  -> return (name1, bind (genMetas (Ann False val t)) [])

parseDefFunSingle :: Parser Term
parseDefFunSingle = do
  char_skp '='
  val <- parseTerm
  return val

parseDefFunRules :: Parser Term
parseDefFunRules = withSrc $ do
  rules <- P.many1 (parseRule 0)
  let flat = flattenDef rules 0
  return
    -- $ trace ("DONE: " ++ showTerm flat)
    flat

parseDefFunTest :: Parser Term
parseDefFunTest = return (Con "Refl" [])

parseRule :: Int -> Parser Rule
parseRule dep = do
  P.try $ do
    P.count dep $ char_skp '.'
    char_skp '|'
  pats <- P.many parsePattern
  body <- P.choice 
    [ withSrc $ P.try $ do
      string_skp "with "
      wth <- P.many1 $ P.notFollowedBy (char_skp '.') >> parseTerm
      rul <- P.many1 $ parseRule (dep + 1)
      return $ flattenWith dep wth rul
    , P.try $ do
      char_skp '='
      body <- parseTerm
      return body
    ]
  return $ (pats, body)

parsePattern :: Parser Pattern
parsePattern = do
  P.notFollowedBy $ string_skp "with "
  pat <- guardChoice
    [ (parsePatPrn, discard $ string_skp "(")
    , (parsePatNat, discard $ string_skp "#" >> numeric_skp)
    , (parsePatLst, discard $ string_skp "[")
    , (parsePatCon, discard $ string_skp "#" <|> (name_skp >> string_skp "@"))
    , (parsePatTxt, discard $ string_skp "\"")
    , (parsePatSuc, discard $ numeric_skp >> char_skp '+')
    , (parsePatNum, discard $ numeric_skp)
    , (parsePatVar, discard $ name_skp)
    ] $ fail "Pattern-matching"
  parsePatSuffix pat

parsePatSuffix :: Pattern -> Parser Pattern
parsePatSuffix pat = P.choice
  [ parsePatSuffPar pat
  , parsePatSuffCns pat
  , return pat
  ]

parsePatSuffPar :: Pattern -> Parser Pattern
parsePatSuffPar fst = do
  P.try $ string_skp ","
  snd <- parsePattern
  return $ PCtr Nothing "Pair" [fst, snd]

parsePatSuffCns :: Pattern -> Parser Pattern
parsePatSuffCns head = do
  P.try $ string_skp ";;"
  tail <- parsePattern
  return $ PCtr Nothing "Cons" [head, tail]

parsePatPrn :: Parser Pattern
parsePatPrn = do
  string_skp "("
  pat <- parsePattern
  string_skp ")"
  return pat

parsePatNat :: Parser Pattern
parsePatNat = do
  char_skp '#'
  num <- numeric_skp
  let n = read num
  return $ (foldr (\_ acc -> PCtr Nothing "Succ" [acc]) (PCtr Nothing "Zero" []) [1..n])

parsePatLst :: Parser Pattern
parsePatLst = do
  char_skp '['
  elems <- P.many parsePattern
  char_skp ']'
  return $ foldr (\x acc -> PCtr Nothing "Cons" [x, acc]) (PCtr Nothing "Nil" []) elems

parsePatTxt :: Parser Pattern
parsePatTxt = do
  char '"'
  txt <- P.many parseTxtChr
  char '"'
  return $ foldr (\x acc -> PCtr Nothing "Cons" [PNum (toEnum (ord x)), acc]) (PCtr Nothing "Nil" []) txt

parsePatPar :: Parser Pattern
parsePatPar = do
  char_skp '('
  head <- parsePattern
  tail <- P.many $ do
    char_skp ','
    parsePattern
  char_skp ')'
  let (init, last) = maybe ([], head) id (unsnoc (head : tail))
  return $ foldr (\x acc -> PCtr Nothing "Pair" [x, acc]) last init

parsePatCon :: Parser Pattern
parsePatCon = do
  name <- P.optionMaybe $ P.try $ do
    name <- name_skp
    char_skp '@'
    return name
  char_skp '#'
  cnam <- name_skp
  args <- P.option [] $ P.try $ do
    char_skp '{'
    args <- P.many parsePattern
    char_skp '}'
    return args
  return $ (PCtr name cnam args)

parsePatNum :: Parser Pattern
parsePatNum = do
  num <- numeric_skp
  return $ (PNum (read num))

parsePatSuc :: Parser Pattern
parsePatSuc = do
  num <- numeric_skp
  char_skp '+'
  nam <- name_skp
  return $ (PSuc (read num) nam)

parsePatVar :: Parser Pattern
parsePatVar = do
  name <- name_skp
  return $ (PVar name)

parseUses :: Parser Uses
parseUses = P.many $ P.try $ do
  string_skp "use "
  long <- name_skp
  string_skp "as "
  short <- name_skp
  return (short, long)

expandUses :: Uses -> String -> String
expandUses ((short, long):uses) name
  | short == name                    = long
  | (short ++ "/") `isPrefixOf` name = long ++ drop (length short) name
  | otherwise                        = expandUses uses name
expandUses [] name                   = name

-- Syntax Sugars
-- -------------

parseDo :: Parser Term
parseDo = withSrc $ do
  string_skp "do "
  monad <- name_skp
  char_skp '{'
  skip
  (_, _, uses) <- P.getState
  body <- parseStmt (expandUses uses monad)
  char '}'
  return body

parseStmt :: String -> Parser Term
parseStmt monad = guardChoice
  [ (parseDoFor monad,           discard $ string_skp "for " <|> (string_skp "ask" >> name_skp >> string_skp "=" >> string_skp "for"))
  , (parseDoAsk monad,           discard $ string_skp "ask ")
  , (parseDoRet monad,           discard $ string_skp "ret ")
  , (parseLet (parseStmt monad), discard $ string_skp "let ")
  , (parseUse (parseStmt monad), discard $ string_skp "use ")
  , (parseLog (parseStmt monad), discard $ string_skp "log ")
  ] parseTerm

parseDoAsk :: String -> Parser Term
parseDoAsk monad = guardChoice
  [ (parseDoAskMch monad, discard $ string_skp "ask #")
  , (parseDoAskPar monad, discard $ string_skp "ask (" >> name_skp >> string_skp ",")
  , (parseDoAskVal monad, discard $ string_skp "ask ")
  ] $ fail "'ask' statement"

parseDoAskMch :: String -> Parser Term
parseDoAskMch monad = do
  string_skp "ask #"
  cnam <- name_skp
  char_skp '{'
  args <- P.many name_skp
  char_skp '}'
  char_skp '='
  val <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) val)
    (Lam "got" (\got ->
      App (Mat [(cnam, foldr (\arg acc -> Lam arg (\_ -> acc)) next args)]) got))

parseDoAskPar :: String -> Parser Term
parseDoAskPar monad = do
  string_skp "ask ("
  head <- name_skp
  tail <- P.many $ do
    char_skp ','
    name_skp
  char_skp ')'
  let (init, last) = maybe ([], head) id $ unsnoc (head : tail)
  char_skp '='
  val <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) val)
    (foldr (\x acc -> Mat [("Pair", Lam x (\_ -> acc))]) (Lam last (\_ -> next)) init)

parseDoAskVal :: String -> Parser Term
parseDoAskVal monad = P.choice
  [ parseDoAskValNamed monad
  , parseDoAskValAnon monad
  ]

parseDoAskValNamed :: String -> Parser Term
parseDoAskValNamed monad = P.try $ do
  string_skp "ask "
  nam <- name_skp
  char_skp '='
  exp <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam nam (\_ -> next))

parseDoAskValAnon :: String -> Parser Term
parseDoAskValAnon monad = P.try $ do
  string_skp "ask "
  exp <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam "_" (\_ -> next))

parseDoRet :: String -> Parser Term
parseDoRet monad = do
  string_skp "ret "
  exp <- parseTerm
  (_, _, uses) <- P.getState
  return $ App (App (Ref (monad ++ "/pure")) (Met 0 [])) exp

parseDoFor :: String -> Parser Term
parseDoFor monad = do
  (stt, nam, lst, loop, body) <- P.choice
    [ do
        stt <- P.try $ do
          string_skp "ask "
          stt <- name_skp
          string_skp "="
          string_skp "for"
          return stt
        nam <- name_skp
        string_skp "in"
        lst <- parseTerm
        char_skp '{'
        loop <- parseStmt monad
        char_skp '}'
        body <- parseStmt monad
        return (Just stt, nam, lst, loop, body)
    , do
        P.try $ string_skp "for "
        nam <- name_skp
        string_skp "in"
        lst <- parseTerm
        char_skp '{'
        loop <- parseStmt monad
        char_skp '}'
        body <- parseStmt monad
        return (Nothing, nam, lst, loop, body) ]
  let f0 = Ref "List/for"
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
  string_skp "if "
  cond <- parseTerm
  t <- parseBranch True
  string_skp "else"
  f <- P.choice [parseBranch False, parseIf]
  return $ App (Mat [("True", t), ("False", f)]) cond
  where
    parseBranch isIf = P.choice
      [ do
          string_skp "do "
          monad <- name_skp
          char_skp '{'
          (_, _, uses) <- P.getState
          t <- parseStmt (expandUses uses monad)
          if isIf then char_skp '}' else char '}'
          return t
      , do
          char_skp '{'
          t <- parseTerm
          if isIf then char_skp '}' else char '}'
          return t
      ]

-- When
-- ----

-- when fn x { c0: v0 c1: v1 } else { df }
-- -------------------------------------------------------- desugars to
-- if (fn x c0) { v0 } else if (fn x c1) { v1 } else { df }

parseWhen = withSrc $ do
  string_skp "when "
  fun <- parseTerm
  val <- parseTerm
  char_skp '{'
  cases <- P.many $ do
    cond <- parseTerm
    char_skp ':'
    body <- parseTerm
    return (cond, body)
  char_skp '}'
  string_skp "else"
  char_skp '{'
  elseCase <- parseTerm
  char '}'
  return $ foldr
    (\ (cond, body) acc -> App
      (Mat [("True", body), ("False", acc)])
      (App (App fun val) cond))
    elseCase
    cases

-- Match
-- -----

parseMatInl :: Parser Term
parseMatInl = withSrc $ do
  string_skp "match "
  x <- parseTerm
  char_skp '{'
  cse <- parseMatCases
  char '}'
  return $ App (Mat cse) x

parseSwiInl :: Parser Term
parseSwiInl = withSrc $ do
  string_skp "switch "
  x <- parseTerm
  char_skp '{'
  cse <- parseSwiCases
  char '}'
  return $ App cse x

-- Nat
-- ---

parseNat :: Parser Term
parseNat = withSrc $ do
  char_skp '#'
  num <- P.many1 digit
  return $ Nat (read num)

-- Flattener
-- ---------

-- FIXME: the functions below are still a little bit messy and can be improved

-- Flattener for pattern matching equations
flattenDef :: [Rule] -> Int -> Term
flattenDef rules depth =
  let (pats, bods) = unzip rules
  in flattenRules pats bods depth

flattenWith :: Int -> [Term] -> [Rule] -> Term
flattenWith dep wth rul =
  -- Wrap the 'with' arguments and patterns in Pairs since the type checker only takes one match argument.
  let wthA = foldr1 (\x acc -> Ann True (Con "Pair" [(Nothing, x), (Nothing, acc)]) (App (App (Ref "Pair") (Met 0 [])) (Met 0 []))) wth
      rulA = map (\(pat, wth) -> ([foldr1 (\x acc -> PCtr Nothing "Pair" [x, acc]) pat], wth)) rul
      bod  = flattenDef rulA (dep + 1)
  in App bod wthA

flattenRules :: [[Pattern]] -> [Term] -> Int -> Term
flattenRules ([]:mat)   (bod:bods) depth = bod
flattenRules (pats:mat) (bod:bods) depth
  | all isVar col                 = flattenVarCol col mat' (bod:bods) (depth + 1)
  | not (null (getColCtrs col))   = flattenAdtCol col mat' (bod:bods) (depth + 1)
  | isJust (fst (getColSucc col)) = flattenNumCol col mat' (bod:bods) (depth + 1)
  | otherwise                     = error "invalid pattern matching function"
  where (col,mat') = getCol (pats:mat)
flattenRules _ _ _ = error "internal error"

-- Flattens a column with only variables
flattenVarCol :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Term
flattenVarCol col mat bods depth =
  -- trace (replicate (depth * 2) ' ' ++ "flattenVarCol: col = " ++ show col ++ ", depth = " ++ show depth) $
  let nam = maybe "_" id (getVarColName col)
      bod = flattenRules mat bods depth
  in Lam nam (\x -> bod)

-- Flattens a column with constructors and possibly variables
flattenAdtCol :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Term
flattenAdtCol col mat bods depth =
  -- trace (replicate (depth * 2) ' ' ++ "flattenAdtCol: col = " ++ show col ++ ", depth = " ++ show depth) $
  let ctr = map (makeCtrCase col mat bods depth) (getColCtrs col)
      dfl = makeDflCase col mat bods depth
      nam = getMatNam col
  in case nam of
    (Just nam) -> (Lam nam (\x -> App (Mat (ctr++dfl)) (Ref nam)))
    Nothing    -> Mat (ctr++dfl)

-- Creates a constructor case: '#Name: body'
makeCtrCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> String -> (String, Term)
makeCtrCase col mat bods depth ctr =
  -- trace (replicate (depth * 2) ' ' ++ "makeCtrCase: col = " ++ show col ++ ", mat = " ++ show mat ++ ", bods = " ++ show (map showTerm bods) ++ ", depth = " ++ show depth ++ ", ctr = " ++ ctr) $
  let var           = getCtrColNames col ctr
      (mat', bods') = foldr (go var) ([], []) (zip3 col mat bods)
      bod           = flattenRules mat' bods' (depth + 1)
  in (ctr, bod)
  where go var ((PCtr nam cnam ps), pats, bod) (mat, bods)
          | cnam == ctr = ((ps ++ pats):mat, bod:bods)
          | otherwise  = (mat, bods)
        go var ((PVar "_"), pats, bod) (mat, bods) =
          let pat = map (maybe (PVar "_") PVar) var
          in ((pat ++ pats):mat, bod:bods)
        go var ((PVar nam), pats, bod) (mat, bods) =
          let vr2 = [maybe (nam++"."++show i) id vr | (vr, i) <- zip var [0..]]
              pat = map PVar vr2
              bo2 = Use nam (Con ctr (map (\x -> (Nothing, Ref x)) vr2)) (\x -> bod)
          in ((pat ++ pats):mat, bo2:bods)
        go var (_, pats, bod) (mat, bods) =
          (mat, bods)

-- Creates a default case: '#_: body'
makeDflCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> [(String, Term)]
makeDflCase col mat bods depth =
  -- trace (replicate (depth * 2) ' ' ++ "makeDflCase: col = " ++ show col ++ ", depth = " ++ show depth) $
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods) in
  if null bods' then [] else [("_", flattenRules mat' bods' (depth + 1))]
  where go ((PVar nam), pats, bod) (mat, bods) = (((PVar nam):pats):mat, bod:bods)
        go (_,          pats, bod) (mat, bods) = (mat, bods)

flattenNumCol :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Term
flattenNumCol col mat bods depth =
  -- Find the succ case with the value
  let (suc, var) = getColSucc col
      sucA       = fromJust suc
      varA       = maybe ("%n-" ++ show sucA) id var
      numCs      = map (makeNumCase col mat bods depth) [0..sucA-1]
      sucCs      = (makeSucCase col mat bods depth sucA varA)
  in foldr (\x acc -> Swi x acc) sucCs numCs

makeNumCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Word64 -> Term
makeNumCase col mat bods depth num =
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods)
  in if null bods' then error $ "missing case for " ++ show num
     else (flattenRules mat' bods' (depth + 1))
  where go ((PNum val), pats, bod) (mat, bods)
          | val == num = (pats:mat, bod:bods)
          | otherwise  = (mat, bods)
        go ((PVar "_"), pats, bod) (mat, bods) =
          (pats:mat, bod:bods)
        go ((PVar nam), pats, bod) (mat, bods) =
          let bod' = Use nam (Num num) (\x -> bod)
          in (pats:mat, bod':bods)
        go (_, pats, bod) (mat, bods) =
          (mat, bods)

makeSucCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> Word64 -> String -> Term
makeSucCase col mat bods depth suc var =
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods)
      bod           = if null bods' then error $ "missing case for " ++ show suc ++ "+" ++ var
                      else (flattenRules mat' bods' (depth + 1))
  in Lam var (\x -> bod)
  where go ((PSuc _ _), pats, bod) (mat, bods) = (pats:mat, bod:bods)
        go ((PVar "_"), pats, bod) (mat, bods) = (pats:mat, bod:bods)
        go ((PVar nam), pats, bod) (mat, bods) = 
          let bodA = Use nam (Op2 ADD (Num suc) (Ref var)) (\x -> bod)
          in (pats:mat, bodA:bods)
        go (_, pats, bod)          (mat, bods) = (mat, bods)

-- Helper Functions

isVar :: Pattern -> Bool
isVar (PVar _) = True
isVar _        = False

getCol :: [[Pattern]] -> ([Pattern], [[Pattern]])
getCol (pats:mat) = unzip (catMaybes (map uncons (pats:mat)))

getColCtrs :: [Pattern] -> [String]
getColCtrs col = toList . fromList $ foldr (\pat acc -> case pat of (PCtr _ cnam _) -> cnam:acc ; _ -> acc) [] col

getVarColName :: [Pattern] -> Maybe String
getVarColName col = foldr (A.<|>) Nothing $ map go col
  where go (PVar "_") = Nothing
        go (PVar nam) = Just nam
        go _          = Nothing

-- For a column of patterns that will become a Mat,
-- return the name of the inner fields or Nothing if they are also Mats.
getCtrColNames :: [Pattern] -> String -> [Maybe String]
getCtrColNames col ctr = 
  let mat = foldr go [] col
  in map getVarColName (transpose mat)
  where go (PCtr nam cnam ps) acc
          | cnam == ctr = ps:acc
          | otherwise   = acc
        go _ acc        = acc

getMatNam :: [Pattern] -> Maybe String
getMatNam (PCtr (Just nam) _ _:_) = Just nam
getMatNam (_:col)                 = getMatNam col
getMatNam []                      = Nothing

-- If theres a PSuc, it returns (Just val, Just nam)
-- If there a PNum a PVar but no PSuc, it returns (Just (max val + 1), Nothing)
-- Otherwise, it returns (Nothing, Nothing)
getColSucc :: [Pattern] -> (Maybe Word64, Maybe String)
getColSucc pats =
  case findSuc pats of
    Just (val, name) -> (Just val, Just name)
    Nothing          -> case (maxNum pats Nothing) of
      Just maxVal -> (Just (maxVal + 1), Nothing) 
      Nothing     -> (Nothing, Nothing)
  where
    findSuc []                = Nothing
    findSuc (PSuc val name:_) = Just (val, name)
    findSuc (_:rest)          = findSuc rest

    maxNum []            acc        = acc
    maxNum (PNum val:ps) Nothing    = maxNum ps (Just val)
    maxNum (PNum val:ps) (Just max) = maxNum ps (Just (if val > max then val else max))
    maxNum (_:ps)        acc        = maxNum ps acc
