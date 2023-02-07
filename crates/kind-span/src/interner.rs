use crate::Symbol;
use fxhash::FxHashMap;
use std::cell::RefCell;

type Lock<T> = RefCell<T>;

#[derive(Default)]
pub struct Interner {
    arena: bumpalo::Bump,
    names: Lock<FxHashMap<&'static str, usize>>,
    strings: Lock<Vec<&'static str>>,
}

thread_local! {
    pub static GLOBAL_INTERNER: Interner = Default::default();
}

impl Interner {
    pub fn intern(str: &str) -> Symbol {
        GLOBAL_INTERNER.with(|interner| {
            let id = {
                let names = interner.names.borrow();
                names.get(str).map(|x| Symbol(*x as u32))
            };

            id.unwrap_or_else(|| {
                let str: &str = *interner.arena.alloc(str);
                let str: &'static str = unsafe { &*(str as *const str) };

                let id = {
                    let mut strs = interner.strings.borrow_mut();
                    let id = strs.len();
                    strs.push(str);
                    id
                };

                interner.names.borrow_mut().insert(str, id);
                Symbol(id as u32)
            })
        })
    }

    pub fn get_string(symbol: &Symbol) -> &'static str {
        GLOBAL_INTERNER
            .with(|interner| unsafe { *interner.strings.borrow().get_unchecked(symbol.0 as usize) })
    }
}
