use std::fmt::{Display, Error, Formatter};

#[derive(Clone, Debug)]
pub struct EncodedName(u64);

#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Ident(pub String);

#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Qualified {
    pub path: Ident,
    pub name: Ident,
}

impl EncodedName {
    pub fn u64_to_name(&self) -> String {
        let mut name = String::new();
        let mut num = self.0;
        while num > 0 {
            let chr = (num % 64) as u8;
            let chr = match chr {
                0 => '.',
                1..=10 => (chr - 1 + b'0') as char,
                11..=36 => (chr - 11 + b'A') as char,
                37..=62 => (chr - 37 + b'a') as char,
                63 => '_',
                64.. => panic!("impossible character value"),
            };
            name.push(chr);
            num = num / 64;
        }
        name.chars().rev().collect()
    }

    pub fn encode(name: &str) -> EncodedName {
        fn char_to_u64(chr: char) -> u64 {
            match chr {
                '.' => 0,
                '0'..='9' => 1 + chr as u64 - '0' as u64,
                'A'..='Z' => 11 + chr as u64 - 'A' as u64,
                'a'..='z' => 37 + chr as u64 - 'a' as u64,
                '_' => 63,
                _ => panic!("Invalid name character."),
            }
        }

        let mut num: u64 = 0;
        for (i, chr) in name.chars().enumerate() {
            if i < 10 {
                num = (num << 6) + char_to_u64(chr);
            }
        }

        return EncodedName(num);
    }
}

impl Qualified {
    #[inline]
    pub fn new(path: String, name: String) -> Qualified {
        Qualified {
            path: Ident(path),
            name: Ident(name),
        }
    }

    #[inline]
    pub fn new_raw(path: &str, name: &str) -> Qualified {
        Qualified {
            path: Ident(path.to_string()),
            name: Ident(name.to_string()),
        }
    }

    #[inline]
    pub fn from_str(str: &str) -> Qualified {
        let mut path = str
            .split(".")
            .map(|x| x.to_string())
            .collect::<Vec<String>>();
        let name = path.pop().unwrap_or("".to_string());
        Qualified {
            path: Ident(path.join(".")),
            name: Ident(name),
        }
    }

    pub fn to_string(&self) -> String {
        format!("{}.{}", self.path, self.name)
    }

    pub fn encode(&self) -> EncodedName {
        EncodedName::encode(&self.to_string())
    }
}

impl Ident {
    pub fn encode(&self) -> EncodedName {
        EncodedName::encode(&self.0)
    }
}

impl Display for Qualified {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}.{}", self.path, self.name)
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.0)
    }
}
