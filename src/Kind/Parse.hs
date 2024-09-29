module Kind.Parse where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import Highlight (highlightError, highlight)

import Data.Char (ord)
import qualified Data.Map.Strict as M
import Data.Functor.Identity (Identity)

import System.Exit (die)

import Text.Parsec ((<|>), getPosition, sourceLine, sourceColumn, getState, setState)
import Text.Parsec.Error (errorPos, errorMessages, showErrorMessages, ParseError, errorMessages, Message(..))
import qualified Text.Parsec as P

import Data.List (intercalate, isPrefixOf)

import System.Console.ANSI

type Uses     = [(String, String)]
type PState   = (String, Uses)
type Parser a = P.ParsecT String PState Identity a

doParseTerm :: String -> String -> IO Term
doParseTerm filename input =
  case P.runParser (withSrc parseTerm) (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right term -> return $ bind (genMetas term) []

doParseUses :: String -> String -> IO Uses
doParseUses filename input =
  case P.runParser parseUses (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right uses -> return uses

doParseBook :: String -> String -> IO Book
doParseBook filename input = do
  let parser = do
        uses <- parseUses
        setState (filename, uses)
        parseBook
  case P.runParser parser (filename, []) filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right book -> return book

extractExpectedTokens :: ParseError -> String
extractExpectedTokens err =
    let expectedMsgs = [msg | Expect msg <- errorMessages err]
    in intercalate ", " expectedMsgs

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

withSrc :: Parser Term -> Parser Term
withSrc parser = do
  ini <- getPosition
  val <- parser
  end <- getPosition
  (nam, _) <- P.getState
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

parseTrivia :: Parser ()
parseTrivia = P.skipMany (parseSpace <|> parseComment) where
  parseSpace = P.try $ do
    P.space
    return ()
  parseComment = P.try $ do
    P.string "//"
    P.skipMany (P.noneOf "\n")
    P.char '\n'
    return ()

parseTerm :: Parser Term
parseTerm = do
  parseTrivia
  P.choice
    [ parseAll
    , parseSwi
    , parseMat
    , parseLam
    , parseOp2
    , parseApp
    , parseAnn
    , parseSlf
    , parseIns
    , parseDat
    , parseCon
    , parseUse
    , parseLet
    , parseSet
    , parseNum
    , parseTxt
    , parseHol
    , parseMet
    , parseRef
    ]

parseAll = withSrc $ do
  P.string "∀"
  era <- P.optionMaybe (P.char '-')
  P.char '('
  nam <- parseName
  P.char ':'
  inp <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = withSrc $ do
  P.string "λ"
  era <- P.optionMaybe (P.char '-')
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseApp = withSrc $ do
  P.char '('
  fun <- parseTerm
  args <- P.many $ do
    era <- P.optionMaybe (P.char '-')
    arg <- parseTerm
    return (era, arg)
  P.char ')'
  return $ foldl (\f (era, a) -> App f a) fun args

parseAnn = withSrc $ do
  P.char '{'
  val <- parseTerm
  parseTrivia
  P.char ':'
  chk <- P.option False (P.char ':' >> return True)
  typ <- parseTerm
  parseTrivia
  P.char '}'
  return $ Ann chk val typ

parseSlf = withSrc $ do
  P.string "$("
  nam <- parseName
  P.char ':'
  typ <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = withSrc $ do
  P.char '~'
  val <- parseTerm
  return $ Ins val

parseDat = withSrc $ do
  P.try $ P.string "#["
  scp <- do
    indices <- P.many $ P.try $ parseTerm
    return indices
  parseTrivia
  P.char ']'
  P.char '{'
  cts <- P.many $ P.try $ do
    parseTrivia
    P.char '#'
    nm <- parseName
    parseTrivia
    tele <- parseTele
    return $ Ctr nm tele
  parseTrivia
  P.char '}'
  return $ Dat scp cts

parseTele :: Parser Tele
parseTele = do
  P.char '{'
  parseTrivia
  fields <- P.many $ P.try $ do
    nam <- parseName
    parseTrivia
    P.char ':'
    parseTrivia
    typ <- parseTerm
    parseTrivia
    return (nam, typ)
  P.char '}'
  parseTrivia
  P.char ':'
  parseTrivia
  ret <- parseTerm
  return $ foldr (\(nam, typ) acc -> TExt nam typ (\x -> acc)) (TRet ret) fields

parseCon = withSrc $ do
  P.char '#'
  nam <- parseName
  parseTrivia
  P.char '{'
  arg <- P.many $ P.try $ parseTerm
  parseTrivia
  P.char '}'
  return $ Con nam arg

parseSwi = withSrc $ do
  P.try $ do
    P.string "λ{"
    parseTrivia
    P.string "0:"
  zero <- parseTerm
  parseTrivia
  P.string "_:"
  succ <- parseTerm
  parseTrivia
  P.char '}'
  return $ Swi zero succ

parseMat = withSrc $ do
  P.try $ P.string "λ{"
  cse <- P.many $ do
    cnam <- P.try $ do
      parseTrivia
      P.char '#'
      parseName
    parseTrivia
    P.char ':'
    cbod <- parseTerm
    return (cnam, cbod)
  parseTrivia
  P.char '}'
  return $ Mat cse

parseRef = withSrc $ do
  name <- parseName
  (_, uses) <- P.getState
  let name' = expandUses uses name
  return $ case name' of
    "U32" -> U32
    _     -> Ref name'

parseUse = withSrc $ do
  P.try (P.string "use ")
  nam <- parseName
  parseTrivia
  P.char '='
  val <- parseTerm
  bod <- parseTerm
  return $ Use nam val (\x -> bod)

parseLet = withSrc $ do
  P.try (P.string "let ")
  nam <- parseName
  parseTrivia
  P.char '='
  val <- parseTerm
  bod <- parseTerm
  return $ Let nam val (\x -> bod)

parseSet = withSrc $ P.char '*' >> return Set

parseNum = withSrc $ Num . read <$> P.many1 P.digit

parseOp2 = withSrc $ do
  opr <- P.try $ do
    P.string "("
    opr <- parseOper
    return opr
  fst <- parseTerm
  snd <- parseTerm
  P.char ')'
  return $ Op2 opr fst snd

parseTxt = withSrc $ do
  P.char '"'
  txt <- P.many (P.noneOf "\"")
  P.char '"'
  return $ Txt txt

parseHol = withSrc $ do
  P.char '?'
  nam <- parseName
  ctx <- P.option [] $ do
    P.char '['
    terms <- P.sepBy parseTerm (P.char ',')
    P.char ']'
    return terms
  return $ Hol nam ctx

parseMet = withSrc $ do
  P.char '_'
  -- uid <- read <$> P.many1 P.digit
  return $ Met 0 []

parseName :: Parser String
parseName = do
  parseTrivia
  head <- P.letter
  tail <- P.many (P.alphaNum <|> P.char '/' <|> P.char '.' <|> P.char '_' <|> P.char '-')
  return (head : tail)

parseOper = P.choice
  [ P.try (P.string "+") >> return ADD
  , P.try (P.string "-") >> return SUB
  , P.try (P.string "*") >> return MUL
  , P.try (P.string "/") >> return DIV
  , P.try (P.string "%") >> return MOD
  , P.try (P.string "<=") >> return LTE
  , P.try (P.string ">=") >> return GTE
  , P.try (P.string "<") >> return LT
  , P.try (P.string ">") >> return GT
  , P.try (P.string "==") >> return EQ
  , P.try (P.string "!=") >> return NE
  , P.try (P.string "&") >> return AND
  , P.try (P.string "|") >> return OR
  , P.try (P.string "^") >> return XOR
  , P.try (P.string "<<") >> return LSH
  , P.try (P.string ">>") >> return RSH
  ]

parseBook :: Parser Book
parseBook = do
  defs <- P.many parseDef
  return $ M.fromList defs

parseDef :: Parser (String, Term)
parseDef = do
  name <- parseName
  parseTrivia
  typ <- P.optionMaybe $ do
    P.char ':'
    t <- parseTerm
    parseTrivia
    return t
  P.char '='
  val <- parseTerm
  parseTrivia
  (_, uses) <- P.getState
  let name' = expandUses uses name
  case typ of
    Nothing -> return (name', val)
    Just t  -> return (name', bind (genMetas (Ann False val t)) [])

parseUses :: Parser Uses
parseUses = P.many $ P.try $ do
  parseTrivia
  P.string "use "
  long <- P.many1 (P.alphaNum <|> P.char '/')
  parseTrivia
  P.string "as "
  short <- P.many1 (P.alphaNum <|> P.char '/')
  parseTrivia
  return (short, long)

expandUses :: Uses -> String -> String
expandUses uses name =
  case filter (\(short, _) -> short `isPrefixOf` name) uses of
    (short, long):_ -> long ++ drop (length short) name
    []              -> name






-- PROBLEM: when parsing a file like:

-- main
-- : ∀(n: Nat)
  -- Nat
-- = λ{
  -- #s: λpred #z
  -- #z: #z{}
-- }

-- we get the following error:

-- PARSE_ERROR
-- - expected: space, "//", "}"
-- - detected:
-- 5 |   #s: λpred #z

-- /Users/v/vic/dev/kind2hs/book/main.kind 5:3

-- which is blaming the first # character of the '#s: λpred #z' line. the problem is, the error is actually that we're missing a {} after #z on the end of the line.

-- seems like this happens because, for some reason, the parser backtracks all the way to #s: ... once the 'λpred #z' part fails to parse. but that should NEVER happen.

-- instead, the desired behavior is that, when an "uniquely defining" part of a parser parses, then we never backtrack. so, for example, when we parse:

-- #s:

-- inside the λ-match, we should parse this case's body (another term), and never backtrack further.

-- similarly, when we parse the header of a lambda (λpred), we should parse this lambda's body (another term), and never backtrack.

-- similarly, when we parse '#name', we know we're in a constructor, and we should never backtrack.

-- in other words, backtracking should be used only to disambiguate parses that could be ambiguous.

-- for example, parseSwi and parseMat share the same beginning:

-- λ{

-- but parseSwi parses a '0:', while parseMat parses a '#name:'

-- I'm not familiar with parsec, so, I wrote the parser above, which works fine. but this backtracking behavior is going too far.

-- how can I improve the parser to result in the desired behavior?

-- remember: all parses should start by "checking" if we start with the proper header-part (for example, on swi, the header is 'λ{' then '0:'). and, once the "header" is parsed, then, all parses after that are mandatory. the backtracking occurs only on the "header-part" of each parser. and this applies to ALL parsers.


-- To achieve the desired behavior of limiting backtracking to only the "header" part of each parser, you can use the `P.try` combinator selectively. Here's how you can modify the parsers:

-- 1. Modify the `parseTerm` function to use `P.try` only for the initial part of each parser:

-- ```haskell
-- parseTerm = do
  -- parseTrivia
  -- P.choice
    -- [ P.try parseAll
    -- , P.try parseSwi
    -- , P.try parseMat
    -- , P.try parseLam
    -- , P.try parseOp2
    -- , P.try parseApp
    -- , P.try parseAnn
    -- , P.try parseSlf
    -- , P.try parseIns
    -- , P.try parseDat
    -- , P.try parseCon
    -- , P.try parseUse
    -- , P.try parseLet
    -- , P.try parseSet
    -- , P.try parseNum
    -- , P.try parseTxt
    -- , P.try parseHol
    -- , P.try parseMet
    -- , parseRef  -- No need for P.try here as it's the last choice
    -- ]
-- ```

-- 2. Modify individual parsers to use `P.try` only for the header part. For example:

-- ```haskell
-- parseSwi = withSrc $ do
  -- P.try $ do
    -- P.string "λ{"
    -- parseTrivia
    -- P.string "0:"
  -- zero <- parseTerm
  -- parseTrivia
  -- P.string "_:"
  -- succ <- parseTerm
  -- parseTrivia
  -- P.char '}'
  -- return $ Swi zero succ

-- parseMat = withSrc $ do
  -- P.try $ P.string "λ{"
  -- cse <- P.many $ P.try $ do
    -- parseTrivia
    -- P.char '#'
    -- cnam <- parseName
    -- parseTrivia
    -- P.char ':'
    -- cbod <- parseTerm
    -- return (cnam, cbod)
  -- parseTrivia
  -- P.char '}'
  -- return $ Mat cse

-- parseCon = withSrc $ do
  -- P.try $ P.char '#'
  -- nam <- parseName
  -- parseTrivia
  -- P.char '{'
  -- arg <- P.many $ P.try $ parseTerm
  -- parseTrivia
  -- P.char '}'
  -- return $ Con nam arg
-- ```

-- 3. For parsers that don't need backtracking at all, remove `P.try` completely:

-- ```haskell
-- parseRef = withSrc $ do
  -- name <- parseName
  -- (_, uses) <- P.getState
  -- let name' = expandUses uses name
  -- return $ case name' of
    -- "U32" -> U32
    -- _     -> Ref name'
-- ```

-- These changes will ensure that backtracking only occurs at the beginning of each parser, allowing for better error reporting and preventing excessive backtracking.

























