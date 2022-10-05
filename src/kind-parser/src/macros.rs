macro_rules! match_single {
    ($pattern:pat) => {
        |x| match x {
            $pattern => Some(()),
            _ => None,
        }
    };

    ($pattern:pat => $then:expr) => {
        |x| match x {
            $pattern => Some($then),
            _ => None,
        }
    };
}

macro_rules! eat_single {
    ($x:expr, $pattern:pat) => { $x.eat(match_single!($pattern)) };
    ($x:expr, $pattern:pat => $then:expr) => { $x.eat(match_single!($pattern => $then)) }
}

pub(crate) use eat_single;
pub(crate) use match_single;