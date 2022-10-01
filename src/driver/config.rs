use std::fmt::Display;

#[derive(Clone, Debug, PartialEq)]
pub enum Target {
    Kdl,
    Hvm,
    // It's useful for some operations that doesnt really
    // care about attributes at all.
    All,
}

impl Display for Target {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Target::Kdl => write!(f, "kdl"),
            Target::Hvm => write!(f, "hvm"),
            Target::All => write!(f, "all"),
        }
    }
}

// The configuration needed to customize
// the compiler experience
#[derive(Clone, Debug)]
pub struct Config {
    pub no_high_line: bool,
    pub color_output: bool,
    pub kind2_path: String,
    pub target: Target,
}
