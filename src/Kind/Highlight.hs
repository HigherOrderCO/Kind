module Kind.Highlight (highlightError, highlight, underline, bold, italic, parenthesize, strikethrough, inverse, getColor) where

highlightError :: (Int, Int) -> (Int, Int) -> String -> String
highlightError (startLine, startCol) (endLine, endCol) content =
  highlight (startLine, startCol) (endLine, endCol) "red" content underline

highlight :: (Int, Int) -> (Int, Int) -> String -> String -> (String -> String) -> String
highlight (startLine, startCol) (endLine, endCol) color content effect =
    assert (startLine <= endLine && (startLine /= endLine || startCol <= endCol)) "Start position must be before or equal to end position" $
    let (lineIndices, lineNumbers) = calculateIndicesAndLineNumbers content (startLine, startCol) (endLine, endCol)
        displayText = buildDisplayText lineIndices lineNumbers (startLine, startCol) (endLine, endCol) color effect
    in displayText

-- Auxiliary function to calculate indices and line numbers
calculateIndicesAndLineNumbers :: String -> (Int, Int) -> (Int, Int) -> ([(Int, String)], [Int])
calculateIndicesAndLineNumbers content (startLine, startCol) (endLine, endCol) =
    let linesWithNumbers = zip [1..] $ lines content
        relevantLines = takeWhile (\(n, _) -> n <= endLine) $ dropWhile (\(n, _) -> n < startLine) linesWithNumbers
        lineIndices = scanl (\acc (_, l) -> acc + length l + 1) 0 relevantLines
        lineNumbers = map fst relevantLines
    in (zip lineIndices (map snd relevantLines), lineNumbers)

-- Auxiliary function to build display text
buildDisplayText :: [(Int, String)] -> [Int] -> (Int, Int) -> (Int, Int) -> String -> (String -> String) -> String
buildDisplayText lineIndices lineNumbers (startLine, startCol) (endLine, endCol) colorStr effect =
    let maxLineNumWidth = length $ show $ maximum lineNumbers
        formatLineNum n = pad maxLineNumWidth (show n)
        
        highlightLine :: Int -> Int -> String -> String
        highlightLine lineNum lineStart line =
            let lineEnd = if lineNum == endLine then endCol - 1 else length line
                startCol' = if lineNum == startLine then startCol - 1 else 0
                (before, highlight) = splitAt startCol' line
                (toHighlight, after) = splitAt (lineEnd - startCol') highlight
            in formatLineNum lineNum ++ " | " ++ before ++ color ++ (effect toHighlight) ++ reset ++ after

        color = getColor colorStr
        reset = "\x1b[0m"

    in unlines $ zipWith3 highlightLine lineNumbers (map fst lineIndices) (map snd lineIndices)

-- | Pads a string with spaces to the left
pad :: Int -> String -> String
pad len txt = replicate (max (len - length txt) 0) ' ' ++ txt

-- | Simple assertion function
assert :: Bool -> String -> a -> a
assert True _ x = x
assert False msg _ = error msg

getColor :: String -> String
getColor color = case color of
    "red"    -> "\x1b[31m"
    "green"  -> "\x1b[32m"
    "yellow" -> "\x1b[33m"
    "blue"   -> "\x1b[34m"
    "magenta" -> "\x1b[35m"
    "cyan"   -> "\x1b[36m"
    "white"  -> "\x1b[37m"
    _        -> "\x1b[0m"  -- defaults to reset

-- | Simple underline function using ANSI escape codes
underline :: String -> String
underline text = "\x1b[4m" ++ text ++ "\x1b[24m"

-- | Simple bold function using ANSI escape codes
bold :: String -> String
bold text = "\x1b[1m" ++ text ++ "\x1b[22m"

-- | Simple italic function using ANSI escape codes
italic :: String -> String
italic text = "\x1b[3m" ++ text ++ "\x1b[23m"

-- | Simple parenthesize function
parenthesize :: String -> String
parenthesize text = "(" ++ text ++ ")"

-- | Simple strikethrough function using ANSI escape codes
strikethrough :: String -> String
strikethrough text = "\x1b[9m" ++ text ++ "\x1b[29m"

-- | Simple inverse (reverse video) function using ANSI escape codes
inverse :: String -> String
inverse text = "\x1b[7m" ++ text ++ "\x1b[27m"
