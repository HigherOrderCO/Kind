# Clean Code - Kind/Formality

## Table of Contents

1. [Introduction](#introduction)
2. [Variables](#variables)
3. [Functions](#functions)
4. [Data Structures](#data-structures)
5. [Organization](#organization)
6. [Considerations](#considerations)

## **Introduction**
Kind is a modern and cute programming language featuring formal proofs.

This simple guide describes how we've been writing Kind code and following some principles
of [`Clean Code`](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship-ebook/dp/B001GSTOAM). It's inspired by the article of [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript/blob/master/README.md). 

Join us: https://t.me/formality_lang

## **Variables**
### Use meaningful and short names. Prefer indentation of symbols like `:` and `=`.


**Bad**
```
  let hero_object = Pair.fst<_,_>(hero_pair)
  let hero_index = Pair.snd<_,_>(hero_pair)
  let adversary_object = Mons.Map.get(...)

```

**Good**
```
  let hero_obj = Pair.fst<_,_>(hero_pair)
  let hero_idx = Pair.snd<_,_>(hero_pair)
  let adve_obj = Mons.Map.get(...)
```

### Use `snake_case` over `camelCase`
**Bad**
```
Nat.toString(n: Nat): String
```
**Good**
```
Nat.to_string(n: Nat): String
```

### Use the same vocabulary for the same context
**Bad**
```
get_user_info()
get_client_data()
get_customer_record()
```
**Good**
```
get_user()
```

### Use searchable names
We will read more code than we will ever write. It's important that the code we do write is readable and searchable. By not naming variables that end up being meaningful for understanding our program, we hurt our readers. Make your names searchable.  

**Bad:**
```
set_timeout(86400)
```

**Good:**
```
// Global declaration
seconds_in_a_day: Nat
  Nat.mul(Nat.mul(60, 60), 24) //86400

// Local declaration
let seconds_in_a_day = Nat.mul(Nat.mul(60, 60), 24) //86400

set_timeout(seconds_in_a_day)
```

### Don't add unneeded context
**Bad:**
```
type Direction {
  dir_right,
  dir_up,
  dir_left,
  dir_down
}
...
set_dir(my_obj, Direction.dir_up)
```

**Good:**
```
type Direction {
  right,
  up,
  left,
  down
}
...
set_dir(my_obj, Direction.up)
```

### Global Variables
```
Mons.global_scr_mid: Pos32
  Pos32.new(2048u, 2048u, 0u)
```

### Custom Type
```
// A 2D map of game tiles
Mons.Map: Type
  Map(List(Mons.Object))

create_new_map(...): Mons.Map
```

## **Functions**
### Function arguments size
We follow a convention to avoid passing 80 characters length for lines of code. 
If your function or data type is too long, consider breaking the line.

**Bad:**
```
Mons.Game.exec_turn(hero_obj: Mons.Object, adve_obj: Mons.Object, ..., game: Mons.Game) : Mons.Game
```

**Good:**
```
Mons.Game.exec_turn(
  hero_obj: Mons.Object, 
  adve_obj: Mons.Object,
  ...
  game: Mons.Game) : Mons.Game
```

### Functions should do one thing
This is by far the most important rule in software engineering. When functions do more than one thing, they are harder to compose, test, and reason about. When you can isolate a function to just one action, it can be refactored easily and your code will read much cleaner. If you take nothing else away from this guide other than this, you'll be ahead of many developers.

**Bad:**
```
type Film {
  new(title: String, year: Nat)
}

main: List(Film)
  let films = [
    Film.new("Fight Club ", 1999), 
    Film.new("Avatar", 2009),
    Film.new("Passengers", 2016),
    Film.new("My Neighbor Totoro", 1988)
    Film.new("The Silence of the Lambs", 1991)]
  let wishlist = List.nil<Film>
  for film in films with wishlist:
    open film
    if Nat.gtn(film.year, 2008) then
      List.cons<_>(film, wishlist)
    else 
      wishlist

```

**Good:**
```
type Film {
  new(title: String, year: Nat)
}

catalog: List(Film)
  [ Film.new("Fight Club ", 1999), 
    Film.new("Avatar", 2009),
    Film.new("Passengers", 2016),
    Film.new("My Neighbor Totoro", 1988)
    Film.new("The Silence of the Lambs", 1991)]

films_newer_than(year: Nat, films: List(Film)): List(Film)
  List.filter<_>( 
    (f) open f Nat.gtn(f.year, year), // anonymous function, that is, a function without a name
    films)

main: List(Film)
  let wishlist = films_newer_than(2008, catalog)
  wishlist
```

### Avoid negative conditionals
**Bad:**
```
player_not_free_to_move(player: Player): Bool
```

**Good:**
```
is_player_free_to_move(player: Player): Bool
```

### Remove dead code 
Dead code is just as bad as duplicate code. There's no reason to keep it in your codebase. If it's not being called, get rid of it! It will still be safe in your version history if you still need it.

### Use auxiliary functions to get small information about your data
```
type Mons.Kind{
  Mons(ele: Mons.Kind.mons, boss: Bool),
  Terrain(ele: Mons.Kind.terrain),
}

type Mons.Kind.mons{
  HERO,
  MAGE,
  POISOLICK,
  EMERELDER
}

type Mons.Kind.terrain{
  VOID,
  FLOOR(lvl: U32, model: U32),
  MON_AREA
}

Mons.Kind.is_hero(kind: Mons.Kind): Bool
  case kind{
    Mons: 
    case kind.ele{
      HERO     : true,
      MAGE     : false,
      POISOLICK: false,
      EMERELDER: false,
    }
    Terrain: false
  }

Mons.Kind.is_mon_area(adve_kin: Mons.Kind): Bool
  case adve_kin{
    Mons: false
    Terrain:
    case adve_kin.ele{
      VOID    : false
      FLOOR   : false
      MON_AREA: true
    }
  }

```


## **Data Structures**
### Use getter and setter
Using getters and setters to access data could be better than simply looking for a property. "Why?" you might ask. Well, here's an unorganized list of reasons why:

- When you want to do more beyond getting an object property, you don't have to look up and change every accessor in your codebase.
- Makes adding validation simple when doing a set.
- Encapsulates the internal representation.
- Easy to add logging and error handling when getting and setting.

**Good:**
```
Pos32: Type
  U32

Pos32.new(x: U32, y: U32, z: U32): Pos32
  let pos = 0u
  let pos = U32.or(pos, x)
  let pos = U32.or(pos, U32.shl(y, 12u))
  let pos = U32.or(pos, U32.shl(z, 24u))
  pos

Pos32.get_x(pos: Pos32): U32
  U32.and(pos, 2047u)

Pos32.set_x(pos: Pos32, x: U32): U32
  Pos32.new(x, Pos32.get_y(pos), Pos32.get_z(pos))
```

### Use `new` for datatype with 1 constructor
**Bad:**
```
type Pair <A: Type, B: Type> {
  pair(fst: A, snd: B)
}

```

**Good:**
```
type Pair <A: Type, B: Type> {
  new(fst: A, snd: B)
}
```

## **Organization**
### Function callers and callees should be close
If a function calls another, keep those functions vertically close in the source file. Ideally, keep the caller right above the callee. We tend to read code from top-to-bottom, like a newspaper. Because of this, make your code read that way.

### Identation using 2 spaces
**Bad:**
```
Nat.add(n: Nat, m: Nat): Nat 
  case n { // No espace
  zero: m,
  succ: Nat.succ(Nat.add(n.pred, m)),
  }

Nat.add(n: Nat, m: Nat): Nat
    case n { // 4 espaces
        zero: m,
        succ: Nat.succ(Nat.add(n.pred, m)),
    }
```

**Good:**
```
Nat.add(n: Nat, m: Nat): Nat
  case n { // 2 espaces
    zero: m,
    succ: Nat.succ(Nat.add(n.pred, m)),
  }
```

### Type notation with reduced spaces
**Bad:**
```
Nat.add( n : Nat, m : Nat) : Nat
  case n {
    zero: m,
    succ: Nat.succ(Nat.add(n.pred , m))
  }

```
**Good:**
```
Nat.add(n: Nat, m: Nat): Nat
  case n {
    zero: m,
    succ: Nat.succ(Nat.add(n.pred, m))
  }
```

### Commas come in the end of the line
**Bad:**
```
Game.move(dir: Dir, pos: Pos32): Pos32
  case dir {
    right: Pos32.add(pos, Pos32.new(1u, 0u, 0u))
    , up: Pos32.sub(pos, Pos32.new(0u, 1u, 0u))
    , left: Pos32.sub(pos, Pos32.new(1u, 0u, 0u))
    , down: Pos32.add(pos, Pos32.new(0u, 1u, 0u))
  }
```
**Good:**
```
Game.move(dir: Dir, pos: Pos32): Pos32
  case dir {
    right: Pos32.add(pos, Pos32.new(1u, 0u, 0u)),
    up   : Pos32.sub(pos, Pos32.new(0u, 1u, 0u)),
    left : Pos32.sub(pos, Pos32.new(1u, 0u, 0u)),
    down : Pos32.add(pos, Pos32.new(0u, 1u, 0u))
  }
```

### If possible, align constructors using space
**Bad:**
```
Game.move(dir: Dir, pos: Pos32): Pos32
  case dir {
    right: Pos32.add(pos, Pos32.new(1u, 0u, 0u)),
    up: Pos32.sub(pos, Pos32.new(0u, 1u, 0u)),
    left: Pos32.sub(pos, Pos32.new(1u, 0u, 0u)),
    down: Pos32.add(pos, Pos32.new(0u, 1u, 0u))
  }
```
**Good:**
```
Game.move(dir: Dir, pos: Pos32): Pos32
  case dir {
    right: Pos32.add(pos, Pos32.new(1u, 0u, 0u)),
    up   : Pos32.sub(pos, Pos32.new(0u, 1u, 0u)),
    left : Pos32.sub(pos, Pos32.new(1u, 0u, 0u)),
    down : Pos32.add(pos, Pos32.new(0u, 1u, 0u))
  }
```

### Don't have journal comments
Remember, use version control! There's no need for dead code, commented code, and especially journal comments. Use git log to get history!  
**Bad:**
```
// 2019-10-10 Add basic Nat functions
// 2020-03-03 Change it to tail recursive
Nat.add(n: Nat, m: Nat): Nat
  case n{
    zero: m
    succ: Nat.add(n.pred, Nat.succ(m))
  }
```

**Good:**
```
Nat.add(n: Nat, m: Nat): Nat
  case n{
    zero: m
    succ: Nat.add(n.pred, Nat.succ(m))
  }
```

## **Considerations**
`Kind` is a new language constantly improving.

Contributions are welcome <3
