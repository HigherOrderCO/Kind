pub mod term;
use term::*;

/*
data Nat : Type
| succ(x : Nat) : Nat
| zero          : Nat

data Bool : Type
| true  : Bool
| false : Bool

data Fin : (n : Nat) -> Type
| zer : (n : Nat) -> Fin (suc n)
| suc : (n : Nat, i : Fin n) -> Fin (suc n)

def Bool_ind(P : (Bool -> *), t : P(tru), f : P(fal), b : Bool)
    match b : Bool to P(self)
    | tru => t
    | fal => f

def ind(P : (Nat -> Type), s : (n : Nat, P n -> P(Nat.succ(n))), z : P(Nat.zero), n : Nat)
    case Nat n to P(self)
    | succ(x) => s(x, induce(x)) -- for any x:TYPE, ind(x) -> P(x)
    | zero    => z
    
def is_zero(a : Nat)
    case Nat a to Bool
    | succ(pred) false
    | zero       true

def add(a : Nat, b : Nat)
    fold Nat a to Nat
    | succ(add_a) (b : Nat) -> Suc(add_a(b))
    | zero        (b : Nat) -> Zer

data List(T : Type)
    | cons : ...
    | nil  : ...
*/

// Simple datatype declaration
data Nat
| succ(n : Nat) -> Nat
| zero          -> Nat

// Simple function
def double(n : Nat)
    match Nat n : Nat
    | succ(x : Nat) => succ(succ(id(x)))
    | zero          => zero

// Datatype declaration
data Vec(T : Set, len : Nat)
| cons(T : Set, len : Nat, x : T, xs : Vec(T,n)) -> Vec(T, succ n)
| nil(T : Set)                                   -> Vec(T, zero)

// Function
def id(T : Set, len : Nat, vec : Vec T len)
    match Vec(T, len) vec : (T : Set, len : Nat) => Vect T len
    | cons(T : Set, len : Nat, x : T, xs : Vect(T,len)) => cons(T, len, x, id(T, len, xs))
    | nil(T : Set)                                      => zero


fn main() -> Result<(), std::string::String> {
    let (term, defs) = from_string_slice("
        /False
            $False *

        /True
            $True *
            |unit True
        /unit .unit True

        /Nat $Nat *
            |succ @pred Nat Nat
            |zero Nat
        /succ .succ Nat
        /zero .zero Nat
        /Nat_ind
            #P @n Nat *
            #S @n Nat @i :P n :P :succ n
            #Z :P zero
            #n Nat
            ~Nat n #n Nat :P n
            |succ #n Nat ::S n ::::Nat_ind P S Z n
            |zero Z

        /Bool $Bool *
            |true  Bool
            |false Bool
        /true  .true Bool
        /false .false Bool
        /Bool_ind
            #P @b Bool *
            #T :P true
            #F :P false
            #b Bool
            ~Bool b #x Bool :P x
            |true  T
            |false F

        /IsTrue $IsTrue @ Bool *
        |ist :IsTrue true 
        /ist .ist IsTrue

        /IsFalse $IsFalse @ Bool *
        |isf :IsFalse false 
        /isf .isf IsFalse

        /IsTrue_rect
            #P @b Bool @ :IsTrue b *
            #k ::P true ist
            #b Bool
            #i :IsTrue b
            ~:IsTrue b i #b Bool #i :IsTrue b Bool
            |ist true

        /typ
            #b Bool
            #it :IsTrue b
            ~Bool b #b Bool *
            |true True
            |false False
        
        /test
            #b Bool
            #f :IsTrue false
            ~:IsTrue false f typ
            |ist unit

        /pest
            #b Bool
            #f :IsTrue true
            ~:IsTrue true f typ
            |ist unit

        test
    ");

    println!("term {}", to_string(&term, &mut Vec::new()));

    for (nam,val) in defs.iter() {
        match infer(&val, &defs, false) {
            Ok(_) => {},
            Err(err) => println!("When checking `{}`:\n- {}\n", String::from_utf8_lossy(nam), err)
        }
    }

    let mut ty : Term = infer(&term, &defs, true).unwrap();
    reduce(&mut ty, &defs, true);
    println!("type {}", to_string(&ty, &mut Vec::new()));

    let mut nf = term.clone();
    weak_reduce(&mut nf, &defs, true);
    reduce(&mut nf, &defs, false);
    println!("norm {}", to_string(&nf, &mut Vec::new()));



    Ok(())
}
