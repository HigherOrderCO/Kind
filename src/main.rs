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

data Nat : Type
| succ(x : Nat) : Nat
| zero          : Nat

def add(a : Nat, b : Nat)
    fold Nat a to Nat
    | succ(add_a) (b : Nat) -> Suc(add_a(b))
    | zero        (b : Nat) -> Zer
*/

fn main() -> Result<(), std::string::String> {

    //J : (A : Set) 
        //-> (C : (x y : A) -> Id x y -> Set)
        //-> ((x : A) -> C x x Refl)
        //-> (M N : A) (P : Id M N) -> C M N P

    let (term, defs) = from_string_slice("
        /Bool
            #b :Bool b
            @P @b :Bool b *
            @T :P True
            @F :P False
            :P b

        /True
            #P @b :Bool b *
            #T :P True
            #F :P False
            T

        /False
            #P @b :Bool b *
            #T :P True
            #F :P False
            F

        /B
            @P *
            @T P
            @F P
            P


        /Silly
            @P *
            @V @f @s Silly B P
            P

        /V
            #f @s Silly B
            #P *
            #V @f @s Silly B P
            :V f

        /bad
            #v Silly
            ::v B #f @ Silly B :f :V f

        /foo
            :bad :V bad

        foo




        /ID
            #P * P

        /Eq
            #A *
            #x A
            #y A
            #e ::::Eq A x y e
            @P @x A
               @y A
               @e ::::Eq A x y e
               *
            @R @x A
               :::P x x ::Refl A x
            :::P x y e



        /unbad
            #a Bad
            ::a @ Bad Bad
                #f @ Bad Bad f 

        /omega
            ::unbad
                :bad #x Bad ::unbad x x
                :bad #x Bad ::unbad x x








        /Refl
            #A *
            #x A
            #P  @x A
                @y A
                @e ::::Eq A x y e
                *
            #R  @x A
                :::P x x ::Refl A x
            :R x

        /Bad
            #T *
            @P *
            @B @f @ Bad Bad P
            P

        /bad
            #f @ Bad Bad
            #P *
            #B @f @ Bad Bad P
            :B f

        /unbad
            #a Bad
            ::a @ Bad Bad
                #f @ Bad Bad f 

        /omega
            ::unbad
                :bad #x Bad ::unbad x x
                :bad #x Bad ::unbad x x

        omega




        /main
            #b :Bool b
            :Refl :Bool b

        main


        
        /Nat
            #n :Nat n
            @P @n :Nat n *
            @S @n :Nat n :P :Succ n
            @Z :P Zero
            :P n


        /Succ
            #n :Nat n
            #P @n :Nat n *
            #S @n :Nat n :P :Succ n
            #Z :P Zero
            :S n

        /Zero
            #P @n :Nat n *
            #S @n :Nat n :P :Succ n
            #Z :P Zero
            Z

        fal
    ");

    //- Expected : :Nat Zero
    //- Actual   :
        //@P' @n' :Nat n' *
        //@S' @n' :Nat n' :P' :Succ n'
        //@Z' :P' Zero
        //:P' Zero

    //let (term, defs) = from_string_slice("
        ///Inf @P * @c @ Bool @ Inf P P
        ///inf #P * #c @ Bool @ Inf P ::c true 
             //#P * #c @ Bool @ Inf P ::c false
             //inf
        ///fst #x Inf ::x Bool #b Bool #bs Inf b 
        ///snd #x Inf ::x Inf  #b Bool #bs Inf bs 

        ///Bool $Bool *
            //|true  Bool
            //|false Bool
        ///true  .true Bool
        ///false .false Bool

        ///IsTrue $IsTrue @ Bool *
            //|ItIsTrue :IsTrue true

        ///main
            //#b Bool
            //#p :IsTrue b 
            //#P @b Bool @ :P b *
            //#k ::P true :IsTrue true
            //~IsTrue p ::P b p
            //|ItIsTrue * 

        //main


        //elimIsTrue (p: IsTrue b) (P: forall b, P b -> Set) -> P true (TrueIsTrue: IsTrue true) -> P b p

        ///Bool_ind
            //#P @ Bool *
            //#t :P true
            //#f :P false
            //#b Bool
            //~Bool b :P self
            //|true t
            //|false f

        ///Nat $Nat *
            //|succ @x Nat Nat
            //|zero Nat
        ///succ .succ Nat
        ///zero .zero Nat
        ///pred #n Nat
            //~Nat n Nat
            //|succ #n Nat n
            //|zero zero
        ///0 zero
        ///1 :succ 0
        ///2 :succ 1
        ///3 :succ 2
        ///4 :succ 3

        ///Nat_ind
            //#P @ Nat *
            //#n Nat
            //#s @n Nat @ :P n :P :succ n
            //#z :P zero
            //~Nat n :P self
            //|succ #x Nat ::s x ::::Nat_ind P x s z
            //|zero z

        ///double
            //#n Nat
            //::::Nat_ind
                //#x Nat Nat n
                //#n Nat #r Nat :succ :succ r
                //zero

        ///Fin
            //$Fin @ Nat *
            //|fs @n Nat @i :Fin n :Fin :succ n 
            //|fz @n Nat :Fin :succ n
        ///fs .fs Fin
        ///fz .fz Fin


        ///IsTrue
            //$IsTrue @ Bool *
            //|ItIs :IsTrue true

        ///main
            //#b Bool
            //#is :IsTrue b
            //~IsTrue is self
            //|ItIs *


        //main




        ///main ::fs 3 :fz 2
        //main

        //@i :Fin 2 :Fin :.succ Nat 2
        

        ///Eq $Eq @A * @ A @ A *
            //|refl @A * @x A :::Eq A x x

        ///refl .refl Eq


        ///sym
            //#A *
            //#B *
            //#f @ A B
            //#x A
            //#y A
            //#e :::Eq A x y
            //::refl B :f x

        //sym

        
        ///add
            //#a Nat
            //#b Nat
            //~Nat a Nat
            //|succ #a Nat :succ ::add a b
            //|zero b


        //::add 2 1


        //:double :pred :double 2
    //");

    println!("term {}", to_string(&term, &mut Vec::new()));

    for (nam,val) in defs.iter() {
        match infer(&val, &defs, false) {
            Ok(_) => {},
            Err(err) => println!("When checking `{}`:\n- {}\n", String::from_utf8_lossy(nam), err)
        }
    }

    let mut nf = term.clone();
    reduce(&mut nf, &defs);
    println!("norm {}", to_string(&nf, &mut Vec::new()));

    let ty : Term = infer(&term, &defs, true).unwrap();
    println!("type {}", to_string(&ty, &mut Vec::new()));


    Ok(())
}
