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

fn main() -> Result<(), std::string::String> {
    let (term, defs) = from_string_slice("
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
        Nat_ind

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




        Nat
        /not #bbb Bool
            ~Bool bbb #x Bool Bool
            |true  false
            |false true

        not

        /Nat $Nat *
            |succ @ Nat Nat
            |zero Nat
        /succ .succ Nat
        /zero .zero Nat

        /isZero #n Nat
            ~Nat n #n Nat Bool
            |succ #n Nat false
            |zero true

        isZero
            
            :succ :succ zero

        main
        
        #x * x

        /Inf @P * @c @ Bool @ Inf P P
        /inf #P * #c @ Bool @ Inf P ::c true 
             #P * #c @ Bool @ Inf P ::c false
             inf
        /fst #x Inf ::x Bool #b Bool #bs Inf b 
        /snd #x Inf ::x Inf  #b Bool #bs Inf bs 

        /Bool $Bool *
            |true  Bool
            |false Bool
        /true  .true Bool
        /false .false Bool

        /Bool_ind
            #P @ Bool *
            #t :P true
            #f :P false
            #b Bool
            ~Bool b :P self
            |true t
            |false f

        /Nat $Nat *
            |succ @x Nat Nat
            |zero Nat
        /succ .succ Nat
        /zero .zero Nat
        /pred #n Nat
            ~Nat n Nat
            |succ #n Nat n
            |zero zero
        /0 zero
        /1 :succ 0
        /2 :succ 1
        /3 :succ 2
        /4 :succ 3

        /Nat_ind
            #P @ Nat *
            #n Nat
            #s @n Nat @ :P n :P :succ n
            #z :P zero
            ~Nat n :P self
            |succ #x Nat ::s x ::::Nat_ind P x s z
            |zero z

        /double
            #n Nat
            ::::Nat_ind
                #x Nat Nat n
                #n Nat #r Nat :succ :succ r
                zero
                
        :pred :double 2
    ");

    println!("term {}", to_string(&term, &mut Vec::new()));

    for (nam,val) in defs.iter() {
        match infer(&val, &defs, false) {
            Ok(_) => {},
            Err(err) => println!("When checking `{}`:\n- {}\n", String::from_utf8_lossy(nam), err)
        }
    }

    let mut ty : Term = infer(&term, &defs, true).unwrap();
    reduce(&mut ty, &defs, false);
    println!("type {}", to_string(&ty, &mut Vec::new()));

    let mut nf = term.clone();
    weak_reduce(&mut nf, &defs, true);
    reduce(&mut nf, &defs, false);
    println!("norm {}", to_string(&nf, &mut Vec::new()));



    Ok(())
}
