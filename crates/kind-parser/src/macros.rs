macro_rules! eat_single {
    ($x:expr, $pattern:pat) => {
        $x.eat(|x| match x {
            $pattern => Some(()),
            _ => None,
        })
    };
    ($x:expr, $pattern:pat => $then:expr) => {
        $x.eat(|x| match x {
            $pattern => Some($then),
            _ => None,
        })
    };
}

pub(crate) use eat_single;
