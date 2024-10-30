-- //./Type.hs//

module Kind.Parse where

import Data.Char (ord)
import Data.Functor.Identity (Identity)
import Data.List (intercalate, isPrefixOf, uncons, find, transpose)
import Data.Maybe (catMaybes, fromJust, isJust)
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
type PState   = (String, Int, Uses)
type Parser a = P.ParsecT String PState Identity a
-- Types used for flattening pattern-matching equations
type Rule     = ([Pattern], With)
data Pattern  = PVar String | PCtr String [Pattern] deriving Show
data With     = WBod Term | WWit [Term] [Rule]

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

char_end :: Char -> Parser Char
char_end c = P.char c

string_end :: String -> Parser String
string_end s = P.string s

char_skp :: Char -> Parser Char
char_skp c = P.char c <* skip

string_skp :: String -> Parser String
string_skp s = P.string s <* skip

name_init :: Parser Char
name_init = P.satisfy (`elem` "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/_.-$")

name_char :: Parser Char
name_char = P.satisfy (`elem` "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/_.-$")

name_end :: Parser String
name_end = do
  head <- name_init
  tail <- P.many name_char
  return (head : tail)

name_skp :: Parser String
name_skp = name_end <* skip

digit :: Parser Char
digit = P.digit

oneOf :: String -> Parser Char
oneOf s = P.oneOf s

noneOf :: String -> Parser Char
noneOf s = P.noneOf s

-- Main parsing functions
doParseTerm :: String -> String -> IO Term
doParseTerm filename input =
  case P.runParser (parseTerm <* P.eof) (filename, 0, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right term -> return $ bind (genMetas term) []

doParseUses :: String -> String -> IO Uses
doParseUses filename input =
  case P.runParser (parseUses <* P.eof) (filename, 0, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
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
  (nam, _, _) <- P.getState
  skip
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

-- Term Parser
-- -----------

-- Main term parser
parseTerm :: Parser Term
parseTerm = (do
  skip
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
    , parseADT
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
    , parseFloat
    , parseNum
    , parseTxt
    , parseLst
    , parseChr
    , parseHol
    , (parseLog parseTerm)
    , parseRef
    ] <* skip
  parseSuffix term) <?> "Term"

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
  fun <- parseTerm
  args <- P.many $ do
    P.notFollowedBy (char_end ')')
    era <- P.optionMaybe (char_skp '-')
    arg <- parseTerm
    return (era, arg)
  char_end ')'
  return $ foldl (\f (era, a) -> App f a) fun args

parseAnn = withSrc $ do
  char_skp '{'
  val <- parseTerm
  char_skp ':'
  chk <- P.option False (char_skp ':' >> return True)
  typ <- parseTerm
  char_end '}'
  return $ Ann chk val typ

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
  P.try $ P.choice [string_skp "#[", string_skp "data["]
  scp <- P.many parseTerm
  char_skp ']'
  char_skp '{'
  cts <- P.many $ P.try parseADTCtr
  char_end '}'
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
  nam <- name_end
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
    char_end '}'
    return args
  return $ Con nam args

parseCases :: String -> Parser [(String, Term)]
parseCases prefix = do
  cse <- P.many $ P.try $ do
    string_skp prefix
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

parseSwiElim :: Parser (Term, Term)
parseSwiElim = do
  zero <- do
    P.try $ do
      char_skp '0'
      char_skp ':'
    parseTerm
  succ <- do
    string_skp "_"
    pred <- P.optionMaybe $ do
      char_skp '{'
      name <- name_skp
      char_skp '}'
      return name
    char_skp ':'
    succ <- parseTerm
    return $ maybe succ (\name -> Lam name (\_ -> succ)) pred
  return (zero, succ)

parseMatCases :: Parser [(String, Term)]
parseMatCases = parseCases "#"

parseSwiCases :: Parser [(String, Term)]
parseSwiCases = parseCases ""

parseSwi = withSrc $ do
  P.try $ do
    char_skp 'λ'
    char_skp '{'
    P.lookAhead $ P.try $ do
      char_skp '0'
  (zero, succ) <- parseSwiElim
  char_end '}'
  return $ Swi zero succ

parseMat = withSrc $ do
  P.try $ do
    string_skp "λ"
    string_skp "{"
  cse <- parseMatCases
  char_end '}'
  return $ Mat cse

parseRef = withSrc $ do
  name <- name_end
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

parseSet = withSrc $ char_end '*' >> return Set


parseFloat = withSrc $ P.try $ do
  -- Parse optional negative sign
  sign <- P.option id $ P.char '-' >> return negate

  -- Parse integer part
  intPart <- P.many1 digit

  -- Parse decimal part (this must succeed, or we fail the whole parser)
  decPart <- do
    char_end '.'
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

parseNum = withSrc $ Num . read <$> P.many1 digit

parseOp2 = withSrc $ do
  opr <- P.try $ do
    char_skp '('
    parseOper
  fst <- parseTerm
  snd <- parseTerm
  char_end ')'
  return $ Op2 opr fst snd

parseLst = withSrc $ do
  char_skp '['
  elems <- P.many parseTerm
  char_end ']'
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
  char_end '"'
  txt <- P.many parseTxtChr
  char_end '"'
  return $ Txt txt

parseChr = withSrc $ do
  char_end '\''
  chr <- parseTxtChr
  char_end '\''
  return $ Num (fromIntegral $ ord chr)

parseHol = withSrc $ do
  char_skp '?'
  nam <- name_skp
  ctx <- P.option [] $ do
    char_skp '['
    terms <- P.sepBy parseTerm (char_skp ',')
    char_end ']'
    return terms
  return $ Hol nam ctx

parseLog parseBody = withSrc $ do
  P.try $ string_skp "log"
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
  ]

parseSuffix :: Term -> Parser Term
parseSuffix term = P.choice
  [ parseSuffArr term
  , parseSuffAnn term
  , parseSuffEql term
  , parseSuffVal term
  ]

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

parseSuffVal :: Term -> Parser Term
parseSuffVal term = return term

-- Book Parser
-- -----------

parseBook :: Parser Book
parseBook = M.fromList <$> P.many parseDef

parseDef :: Parser (String, Term)
parseDef = P.choice
  [ parseDefADT
  , parseDefFun
  ]

parseDefADT :: Parser (String, Term)
parseDefADT = do
  P.try $ string_skp "data "
  name <- name_skp
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
          P.notFollowedBy (char_end '{')
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
  let selfType   = foldl (\ acc arg -> App acc (Ref arg)) (Ref name) (paramNames ++ indexNames)
  let typeBody   = foldr (\ (pname, ptype) acc -> All pname ptype (\_ -> acc)) Set allParams
  let newCtrs    = map (fillCtrRet selfType) ctrs -- fill ctr type when omitted
  let dataBody   = ADT (map (\ (iNam,iTyp) -> Ref iNam) indices) newCtrs selfType
  let fullBody   = foldr (\ (pname, _) acc -> Lam pname (\_ -> acc)) dataBody allParams
  let term       = bind (genMetas (Ann False fullBody typeBody)) []
  return $
    -- trace ("parsed " ++ name ++ " = " ++ (showTermGo False term 0))
    (name, term)
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
  val <- P.choice
    [ do
        char_skp '='
        val <- parseTerm
        return val
    , do
        rules <- P.many1 (parseRule 0)
        let flat = flattenDef rules 0
        return
          -- $ trace ("DONE: " ++ showTerm flat)
          flat
    , do
        return (Con "Refl" [])
    ]
  (filename, count, uses) <- P.getState
  let name0 = expandUses uses name
  let name1 = if isJust numb then name0 ++ "#" ++ show count else name0
  P.setState (filename, if isJust numb then count + 1 else count, uses)
  case typ of
    Nothing -> return (name1, bind (genMetas val) [])
    Just t  -> return (name1, bind (genMetas (Ann False val t)) [])

parseRule :: Int -> Parser Rule
parseRule dep = P.try $ do
  P.count dep $ char_skp '.'
  char_skp '|'
  pats <- P.many parsePattern
  with <- P.choice 
    [ P.try $ do
      string_skp "with"
      wth <- P.many1 $ P.notFollowedBy (char_skp '.') >> parseTerm
      rul <- P.many1 $ parseRule (dep + 1)
      return $ WWit wth rul
    , P.try $ do
      char_skp '='
      body <- parseTerm
      return $ WBod body
    ]
  return $ (pats, with)

parsePattern :: Parser Pattern
parsePattern = do
  P.notFollowedBy $ string_skp "with"
  P.choice [
    parsePatternNat,
    parsePatternCtr,
    parsePatternVar
    ]

parsePatternNat :: Parser Pattern
parsePatternNat = do
  num <- P.try $ do
    char_skp '#'
    P.many1 digit
  skip
  let n = read num
  return $ (foldr (\_ acc -> PCtr "Succ" [acc]) (PCtr "Zero" []) [1..n])

parsePatternCtr :: Parser Pattern
parsePatternCtr = do
  name <- P.try $ do
    char_skp '#'
    name_skp
  args <- P.option [] $ P.try $ do
    char_skp '{'
    args <- P.many parsePattern
    char_skp '}'
    return args
  return $ (PCtr name args)

parsePatternVar :: Parser Pattern
parsePatternVar = do
  name <- P.try $ name_skp
  return $ (PVar name)

parseUses :: Parser Uses
parseUses = P.many $ P.try $ do
  string_skp "use "
  long <- name_skp
  string_skp "as "
  short <- name_skp
  return (short ++ "/", long ++ "/")

expandUses :: Uses -> String -> String
expandUses uses name =
  case filter (\(short, _) -> short `isPrefixOf` name) uses of
    (short, long):_ -> long ++ drop (length short) name
    []              -> name

-- Syntax Sugars
-- -------------

parseDo :: Parser Term
parseDo = withSrc $ do
  P.try $ string_skp "do "
  monad <- name_skp
  char_skp '{'
  skip
  (_, _, uses) <- P.getState
  body <- parseStmt (expandUses uses monad)
  char_end '}'
  return body

parseStmt :: String -> Parser Term
parseStmt monad = P.choice
  [ parseDoFor monad
  , parseDoAsk monad
  , parseDoRet monad
  , parseLet (parseStmt monad)
  , parseUse (parseStmt monad)
  , parseLog (parseStmt monad)
  , parseTerm
  ]

parseDoAsk :: String -> Parser Term
parseDoAsk monad = P.choice
  [ parseDoAskMch monad
  , parseDoAskVal monad
  ]

parseDoAskMch :: String -> Parser Term
parseDoAskMch monad = do
  P.try $ string_skp "ask #"
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

parseDoAskVal :: String -> Parser Term
parseDoAskVal monad = P.choice
  [ parseDoAskValNamed monad
  , parseDoAskValAnon monad
  ]

parseDoAskValNamed :: String -> Parser Term
parseDoAskValNamed monad = do
  nam <- P.try $ do
    string_skp "ask "
    nam <- name_skp
    char_skp '='
    return nam
  exp <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam nam (\_ -> next))

parseDoAskValAnon :: String -> Parser Term
parseDoAskValAnon monad = do
  P.try $ string_skp "ask "
  exp <- parseTerm
  next <- parseStmt monad
  (_, _, uses) <- P.getState
  return $ App
    (App (App (App (Ref (monad ++ "/bind")) (Met 0 [])) (Met 0 [])) exp)
    (Lam "_" (\_ -> next))

parseDoRet :: String -> Parser Term
parseDoRet monad = do
  P.try $ string_skp "ret "
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
  P.try $ string_skp "if "
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
          t <- parseStmt monad
          if isIf then char_skp '}' else char_end '}'
          return t
      , do
          char_skp '{'
          t <- parseTerm
          if isIf then char_skp '}' else char_end '}'
          return t
      ]

-- When
-- ----

-- when fn x { c0: v0 c1: v1 _: df }
-- -------------------------------------------------------- desugars to
-- if (fn x c0) { v0 } else if (fn x c1) { v1 } else { df }

parseWhen = withSrc $ do
  P.try $ string_skp "when "
  fun <- parseTerm
  val <- parseTerm
  char_skp '{'
  cases <- P.many $ do
    P.notFollowedBy (char_skp '_')
    cond <- parseTerm
    char_skp ':'
    body <- parseTerm
    return (cond, body)
  defaultCase <- do
    char_skp '_'
    char_skp ':'
    body <- parseTerm
    return $ body
  char_end '}'
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
  P.try $ string_skp "match "
  x <- parseTerm
  char_skp '{'
  cse <- parseMatCases
  char_end '}'
  return $ App (Mat cse) x

parseSwiInl :: Parser Term
parseSwiInl = withSrc $ do
  P.try $ string_skp "switch "
  x <- parseTerm
  char_skp '{'
  P.choice
    [ do
        (zero, succ) <- parseSwiElim
        char_end '}'
        return $ App (Swi zero succ) x
    , do
        cases <- parseSwiCases
        char_end '}'
        let defaultCase = find (\(name, _) -> name == "_") cases
        case defaultCase of
          Nothing -> do
            error "Numeric switch requires a default case"
          Just (_, defaultBody) -> do
            let nonDefaultCases = filter (\(name, _) -> name /= "_") cases
                buildIfChain [] = defaultBody
                buildIfChain ((num,body):rest) = App
                  (Mat [("True", body), ("False", buildIfChain rest)])
                  (App (App (Ref "Base/U64/eq") x) (Num (read num)))
            return $ buildIfChain nonDefaultCases
    ]

-- Nat
-- ---

parseNat :: Parser Term
parseNat = withSrc $ P.try $ do
  char_skp '#'
  num <- P.many1 digit
  return $ Nat (read num)

-- Flattener
-- ---------

-- FIXME: the functions below are still a little bit messy and can be improved

-- Flattener for pattern matching equations
flattenDef :: [Rule] -> Int -> Term
flattenDef rules depth =
  let (pats, with) = unzip rules
      bods         = map (flattenWith 0) with
  in flattenRules pats bods depth

flattenWith :: Int -> With -> Term
flattenWith dep (WBod bod)     = bod
flattenWith dep (WWit wth rul) =
  let bod = flattenDef rul (dep + 1)
  in foldl App bod wth

flattenRules :: [[Pattern]] -> [Term] -> Int -> Term
flattenRules ([]:mat)   (bod:bods) depth = bod
flattenRules (pats:mat) (bod:bods) depth
  | all isVar col  = flattenVarCol col mat' (bod:bods) (depth + 1)
  | otherwise      = flattenAdtCol col mat' (bod:bods) (depth + 1)
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
  in Mat (ctr++dfl)

-- Creates a constructor case: '#Name: body'
makeCtrCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> String -> (String, Term)
makeCtrCase col mat bods depth ctr =
  -- trace (replicate (depth * 2) ' ' ++ "makeCtrCase: col = " ++ show col ++ ", mat = " ++ show mat ++ ", bods = " ++ show (map showTerm bods) ++ ", depth = " ++ show depth ++ ", ctr = " ++ ctr) $
  let var           = getCtrColNames col ctr
      (mat', bods') = foldr (go var) ([], []) (zip3 col mat bods)
      bod           = flattenRules mat' bods' (depth + 1)
  in (ctr, bod)
  where go var ((PCtr nam ps), pats, bod) (mat, bods)
          | nam == ctr = ((ps ++ pats):mat, bod:bods)
          | otherwise  = (mat, bods)
        go var ((PVar "_"), pats, bod) (mat, bods) =
          let pat = map (maybe (PVar "_") PVar) var
          in ((pat ++ pats):mat, bod:bods)
        go var ((PVar nam), pats, bod) (mat, bods) =
          let vr2 = [maybe (nam++"."++show i) id vr | (vr, i) <- zip var [0..]]
              pat = map PVar vr2
              bo2 = Use nam (Con ctr (map (\x -> (Nothing, Ref x)) vr2)) (\x -> bod)
          in ((pat ++ pats):mat, bo2:bods)

-- Creates a default case: '#_: body'
makeDflCase :: [Pattern] -> [[Pattern]] -> [Term] -> Int -> [(String, Term)]
makeDflCase col mat bods depth =
  -- trace (replicate (depth * 2) ' ' ++ "makeDflCase: col = " ++ show col ++ ", depth = " ++ show depth) $
  let (mat', bods') = foldr go ([], []) (zip3 col mat bods) in
  if null bods' then [] else [("_", flattenRules mat' bods' (depth + 1))]
  where go ((PVar nam), pats, bod) (mat, bods) = (((PVar nam):pats):mat, bod:bods)
        go (ctr,        pats, bod) (mat, bods) = (mat, bods)

-- Helper Functions

isVar :: Pattern -> Bool
isVar (PVar _) = True
isVar _        = False

getCol :: [[Pattern]] -> ([Pattern], [[Pattern]])
getCol (pats:mat) = unzip (catMaybes (map uncons (pats:mat)))

getColCtrs :: [Pattern] -> [String]
getColCtrs col = toList . fromList $ foldr (\pat acc -> case pat of (PCtr nam _) -> nam:acc ; _ -> acc) [] col

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
  where go (PCtr nam ps) acc
          | nam == ctr  = ps:acc
          | otherwise   = acc
        go _ acc        = acc
