//! Describes the concrete AST with all of the sugars.
//! It's useful to pretty printing and resugarization
//! from the type checker.

use std::fmt::{Display, Error, Formatter};

use crate::symbol::{Ident, QualifiedIdent};
use expr::Expr;
use fxhash::FxHashMap;
use kind_span::{Locatable, Range};
use linked_hash_map::LinkedHashMap;

use self::pat::Pat;

pub mod expr;
pub mod pat;
pub mod visitor;

pub use expr::*;

/// A sequence of arguments that depends on the previous sequence
/// it's similar to a iterated sigma type.
#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct Telescope<T>(Vec<T>);

impl<T> Default for Telescope<T> {
    fn default() -> Self {
        Self(Default::default())
    }
}

impl<T> Telescope<T> {
    pub fn new(vec: Vec<T>) -> Telescope<T> {
        Telescope(vec)
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn push(&mut self, el: T) {
        self.0.push(el)
    }

    pub fn as_slice(&self) -> &[T] {
        self.0.as_slice()
    }

    pub fn to_vec(self) -> Vec<T> {
        self.0
    }
}

/// A value of a attribute
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum AttributeStyle {
    Ident(Range, Ident),
    String(Range, String),
    Number(Range, u64),
    List(Range, Vec<AttributeStyle>),
}

/// A attribute is a kind of declaration
/// that usually is on the top of a declaration
/// and can be attached to a function declaration
/// it express some compiler properties
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Attribute {
    pub name: Ident,
    pub value: Option<AttributeStyle>,
    pub range: Range,
}

/// An argument is a 'binding' of a name to a type
/// it has some other options like
/// eras: that express the erasure of this type when
/// compiled.
/// hide: that express a implicit argument (that will
/// be discovered through unification).
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Argument {
    pub hidden: bool,
    pub erased: bool,
    pub name: Ident,
    pub typ: Option<Box<Expr>>,
    pub range: Range,
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns @pats@ and on the
/// right hand side a value.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Rule {
    pub name: QualifiedIdent,
    pub pats: Vec<Box<Pat>>,
    pub body: Box<Expr>,
    pub range: Range,
}

/// An entry describes a function that is typed
/// and has rules. The type of the function
/// consists of the arguments @args@ and the
/// return type @typ@.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Entry {
    pub name: QualifiedIdent,
    pub docs: Vec<String>,
    pub args: Telescope<Argument>,
    pub typ: Box<Expr>,
    pub rules: Vec<Box<Rule>>,
    pub range: Range,
    pub attrs: Vec<Attribute>,
}

/// A single cosntructor inside the algebraic data
/// type definition.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Constructor {
    pub name: Ident,
    pub docs: Vec<String>,
    pub args: Telescope<Argument>,
    pub typ: Option<Box<Expr>>,
}

/// An algebraic data type definition that supports
/// parametric and indexed data type definitions.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct SumTypeDecl {
    pub name: QualifiedIdent,
    pub docs: Vec<String>,
    pub parameters: Telescope<Argument>,
    pub indices: Telescope<Argument>,
    pub constructors: Vec<Constructor>,
    pub attrs: Vec<Attribute>,
}

/// A single constructor data type.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct RecordDecl {
    pub name: QualifiedIdent,
    pub docs: Vec<String>,
    pub constructor: Ident,
    pub parameters: Telescope<Argument>,
    pub fields: Vec<(Ident, Vec<String>, Box<Expr>)>,
    pub attrs: Vec<Attribute>,
}

/// All of the structures
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum TopLevel {
    SumType(SumTypeDecl),
    RecordType(RecordDecl),
    Entry(Entry),
}

impl TopLevel {
    pub fn is_record(&self) -> bool {
        matches!(self, TopLevel::RecordType(_))
    }

    pub fn is_sum_type(&self) -> bool {
        matches!(self, TopLevel::SumType(_))
    }

    pub fn is_definition(&self) -> bool {
        matches!(self, TopLevel::Entry(_))
    }
}

/// A module is a collection of top level entries
/// that contains syntatic sugars. In the future
/// it will contain a HashMap to local renames.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Module {
    pub entries: Vec<TopLevel>,
    pub uses: FxHashMap<String, String>
}

/// Metadata about entries, it's really useful when we
/// are trying to desugar something that does not contains
/// a lot of information like a record definition or a sum
/// type definition.
#[derive(Debug, Clone)]
pub struct EntryMeta {
    pub hiddens: usize,
    pub erased: usize,
    pub arguments: Telescope<Argument>,
    pub is_ctr: bool,
    pub range: Range,
}

/// A book stores definitions by name. It's generated
/// by joining a bunch of books that are already resolved.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub names: LinkedHashMap<String, QualifiedIdent>, // Ordered hashset
    pub entries: FxHashMap<String, TopLevel>,         // Probably deterministic order everytime
    pub count: FxHashMap<String, EntryMeta>, // Stores some important information in order to desugarize
}

impl Book {
    pub fn get_count_garanteed(&self, name: &str) -> &EntryMeta {
        self.count
            .get(name)
            .unwrap_or_else(|| panic!("Internal Error: Garanteed count {:?} failed", name))
    }

    pub fn get_entry_garanteed(&self, name: &str) -> &TopLevel {
        self.entries
            .get(name)
            .unwrap_or_else(|| panic!("Internal Error: Garanteed entry {:?} failed", name))
    }
}

// Display

impl Display for Constructor {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for doc in &self.docs {
            writeln!(f, "  /// {}", doc)?;
        }
        write!(f, "{}", self.name)?;
        for arg in &self.args.0 {
            write!(f, " {}", arg)?;
        }
        if let Some(res) = &self.typ {
            write!(f, " : {}", res)?;
        }
        Ok(())
    }
}

impl Display for TopLevel {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            TopLevel::SumType(sum) => {
                for doc in &sum.docs {
                    writeln!(f, "/// {}", doc)?;
                }
                for attr in &sum.attrs {
                    writeln!(f, "{}", attr)?;
                }
                write!(f, "type {}", sum.name)?;
                for arg in &sum.parameters.0 {
                    write!(f, " {}", arg)?;
                }
                if !sum.indices.is_empty() {
                    write!(f, " ~")?;
                }
                for arg in &sum.indices.0 {
                    write!(f, " {}", arg)?;
                }
                writeln!(f, " {{")?;
                for cons in &sum.constructors {
                    writeln!(f, "  {},", cons)?;
                }
                writeln!(f, "}}\n")
            }
            TopLevel::RecordType(rec) => {
                for doc in &rec.docs {
                    writeln!(f, "/// {}", doc)?;
                }
                for attr in &rec.attrs {
                    writeln!(f, "{}", attr)?;
                }
                write!(f, "record {}", rec.name)?;
                for arg in &rec.parameters.0 {
                    write!(f, " {}", arg)?;
                }
                writeln!(f, " {{")?;
                for (name, docs, cons) in &rec.fields {
                    for doc in docs {
                        writeln!(f, "  /// {}", doc)?;
                    }
                    writeln!(f, "  {}: {}, ", name, cons)?;
                }
                writeln!(f, "}}\n")
            }
            TopLevel::Entry(entr) => writeln!(f, "{}", entr),
        }
    }
}

impl Display for Module {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for entr in &self.entries {
            write!(f, "{}", entr)?;
        }
        Ok(())
    }
}

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for (_, entr) in &self.entries {
            write!(f, "{}", entr)?;
        }
        Ok(())
    }
}

impl Display for Argument {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        let (open, close) = match (self.erased, self.hidden) {
            (false, false) => ("(", ")"),
            (false, true) => ("+<", ">"),
            (true, false) => ("-(", ")"),
            (true, true) => ("<", ">"),
        };
        match &self.typ {
            Some(typ) => write!(f, "{}{}: {}{}", open, self.name, typ, close),
            None => write!(f, "{}{}{}", open, self.name, close),
        }
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for doc in &self.docs {
            writeln!(f, "/// {}", doc)?;
        }

        for attr in &self.attrs {
            writeln!(f, "{}", attr)?;
        }

        write!(f, "{}", self.name.clone())?;

        for arg in &self.args.0 {
            write!(f, " {}", arg)?;
        }

        write!(f, " : {}\n", &self.typ)?;

        for rule in &self.rules {
            write!(f, "{}\n", rule)?
        }

        Ok(())
    }
}

impl Display for AttributeStyle {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            AttributeStyle::Ident(_, i) => write!(f, "{}", i),
            AttributeStyle::String(_, s) => write!(f, "{:?}", s),
            AttributeStyle::Number(_, n) => write!(f, "{}", n),
            AttributeStyle::List(_, l) => write!(
                f,
                "[{}]",
                l.iter()
                    .map(|x| format!("{}", x))
                    .collect::<Vec<String>>()
                    .join(", ")
            ),
        }
    }
}

impl Display for Attribute {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "#{}", self.name)?;
        if let Some(res) = &self.value {
            write!(f, " = {}", res)?;
        }
        Ok(())
    }
}

impl Display for Rule {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.name)?;
        for pat in &self.pats {
            write!(f, " {}", pat)?;
        }
        write!(f, " = {}", self.body)
    }
}

impl Locatable for AttributeStyle {
    fn locate(&self) -> Range {
        match self {
            AttributeStyle::Ident(r, _) => *r,
            AttributeStyle::String(r, _) => *r,
            AttributeStyle::Number(r, _) => *r,
            AttributeStyle::List(r, _) => *r,
        }
    }
}

impl<A> Telescope<A> {
    pub fn extend(&self, other: &Telescope<A>) -> Telescope<A>
    where
        A: Clone,
    {
        Telescope([self.0.as_slice(), other.0.as_slice()].concat())
    }

    pub fn map<B, F>(&self, f: F) -> Telescope<B>
    where
        F: FnMut(&A) -> B,
    {
        Telescope(self.0.iter().map(f).collect())
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn iter(&self) -> std::slice::Iter<A> {
        self.0.iter()
    }

    pub fn iter_mut(&mut self) -> std::slice::IterMut<A> {
        self.0.iter_mut()
    }
}

impl<A> IntoIterator for Telescope<A> {
    type Item = A;

    type IntoIter = std::vec::IntoIter<A>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl Telescope<Argument> {
    pub fn count_implicits(&self) -> (usize, usize) {
        let mut hiddens = 0;
        let mut erased = 0;
        for arg in &self.0 {
            if arg.hidden {
                hiddens += 1;
            }
            if arg.erased {
                erased += 1;
            }
        }
        (hiddens, erased)
    }
}

impl SumTypeDecl {
    pub fn extract_book_info(&self) -> EntryMeta {
        let mut arguments = Telescope::default();
        let mut hiddens = 0;
        let mut erased = 0;

        let (hiddens_, erased_) = self.parameters.count_implicits();
        hiddens += hiddens_;
        erased += erased_;

        arguments = arguments.extend(&self.parameters);

        let (hiddens_, erased_) = self.indices.count_implicits();
        hiddens += hiddens_;
        erased += erased_;

        arguments = arguments.extend(&self.indices);

        EntryMeta {
            hiddens,
            erased,
            arguments,
            is_ctr: true,
            range: self.name.range,
        }
    }
}

impl Constructor {
    pub fn extract_book_info(&self, def: &SumTypeDecl) -> EntryMeta {
        let mut arguments = Telescope::default();
        let mut hiddens = 0;
        let mut erased = 0;

        hiddens += def.parameters.0.len();
        erased += def.parameters.0.len();

        arguments = arguments.extend(&def.parameters.map(|x| x.to_implicit()));

        // It tries to use all of the indices if no type
        // is specified.
        if self.typ.is_none() {
            hiddens += def.indices.0.len();
            erased += def.indices.0.len();
            arguments = arguments.extend(&def.indices.map(|x| x.to_implicit()));
        }

        for arg in &self.args.0 {
            if arg.erased {
                erased += 1;
            }
            if arg.hidden {
                hiddens += 1;
            }
        }

        arguments = arguments.extend(&self.args.clone());

        EntryMeta {
            hiddens,
            erased,
            arguments,
            is_ctr: true,
            range: self.name.range,
        }
    }
}

impl RecordDecl {
    pub fn fields_to_arguments(&self) -> Telescope<Argument> {
        Telescope(
            self.fields
                .iter()
                .map(|(name, _docs, typ)| {
                    Argument::new_explicit(
                        name.clone(),
                        typ.clone(),
                        name.locate().mix(typ.locate()),
                    )
                })
                .collect(),
        )
    }

    pub fn extract_book_info(&self) -> EntryMeta {
        let mut arguments = Telescope::default();
        let mut hiddens = 0;
        let mut erased = 0;

        let (hiddens_, erased_) = self.parameters.count_implicits();
        hiddens += hiddens_;
        erased += erased_;

        arguments = arguments.extend(&self.parameters);

        EntryMeta {
            hiddens,
            erased,
            arguments,
            is_ctr: true,
            range: self.name.range,
        }
    }

    pub fn extract_book_info_of_constructor(&self) -> EntryMeta {
        let mut arguments = Telescope::default();
        let mut hiddens = 0;
        let mut erased = 0;

        hiddens += self.parameters.0.len();
        erased += self.parameters.0.len();
        arguments = arguments.extend(&self.parameters);

        let field_args: Vec<Argument> = self
            .fields
            .iter()
            .map(|(name, _docs, typ)| {
                Argument::new_explicit(name.clone(), typ.clone(), name.locate().mix(typ.locate()))
            })
            .collect();

        arguments = arguments.extend(&Telescope(field_args));

        EntryMeta {
            hiddens,
            erased,
            arguments,
            is_ctr: true,
            range: self.name.range,
        }
    }
}

impl Entry {
    pub fn extract_book_info(&self) -> EntryMeta {
        let mut arguments = Telescope::default();
        let mut hiddens = 0;
        let mut erased = 0;

        let (hiddens_, erased_) = self.args.count_implicits();
        hiddens += hiddens_;
        erased += erased_;

        arguments = arguments.extend(&self.args);

        EntryMeta {
            hiddens,
            erased,
            arguments,
            is_ctr: false,
            range: self.name.range,
        }
    }
}

impl Argument {
    pub fn new_explicit(name: Ident, typ: Box<Expr>, range: Range) -> Argument {
        Argument {
            hidden: false,
            erased: false,
            name,
            typ: Some(typ),
            range,
        }
    }

    pub fn to_implicit(&self) -> Argument {
        Argument {
            hidden: true,
            erased: true,
            name: self.name.clone(),
            typ: self.typ.clone(),
            range: self.range,
        }
    }
}

impl<A> std::ops::Index<usize> for Telescope<A> {
    type Output = A;

    fn index(&self, index: usize) -> &Self::Output {
        &self.0[index]
    }
}
