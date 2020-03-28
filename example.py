from FormalityCore import *

code = """
  Bool : Type
    (A : Type;) -> (t : A) -> (f : A) -> A

  true : Bool
    (A;) => (t) => (f) => t

  false : Bool
    (A;) => (t) => (f) => f
"""

print stringify_mod(parse_mod(code, 0))
