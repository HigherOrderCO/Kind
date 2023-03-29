//! Describes the abstract tree without sugars. It's useful to compile

use thin_vec::ThinVec;

use crate::lexemes::Item;

pub type Ident = Item<String>;

pub type QualifiedIdent = Item<String>;

#[derive(Debug)]
pub enum AttributeStyleKind {
    String(String),
    Number(u64),
    Identifier(Ident),
    List(ThinVec<AttributeStyle>),
}

/// The "argument" part of the attribute. It can be used both in
/// the value after an equal or in the arguments e.g
///
/// ```kind
/// #name = "Vaundy"
/// #derive[match]
/// ```
pub type AttributeStyle = Item<AttributeStyleKind>;

#[derive(Debug)]
pub struct AttributeKind {
    pub name: Ident,
    pub value: Option<AttributeStyle>,
    pub arguments: Option<ThinVec<AttributeStyle>>,
}

/// An attribute is a special compiler flag.
pub type Attribute = Item<AttributeKind>;

/// A type binding is a type annotation for a variable.
pub struct TypeBinding {
    pub generated: bool,
    pub name: Ident,
    pub typ: Expr,
}

/// An argument of a type signature.
pub struct Argument {
    pub erased: bool,
    /// Implicit
    pub hidden: bool,
    pub binding: TypeBinding,
}

/// A local expression is a reference atom to a local declaration.
/// * Always starts with a lower case letter.
pub struct LocalExpr {
    pub name: Ident,
}

/// A constructor expression is a reference atom to a top level declaration.
/// * Always starts with an upper case letter.
pub struct ConstructorExpr {
    pub name: QualifiedIdent,
    pub arguments: ThinVec<Argument>,
}
/// A all node is a dependent function type.
pub struct PiExpr {
    pub param: TypeBinding,
    pub body: Expr,
}

/// A lambda expression (an anonymous function).
pub struct LambdaExpr {
    pub param: TypeBinding,
    pub body: Expr,
}

pub struct Binding {
    pub value: Expr,
}

/// Application of a function to a sequence of arguments.
pub struct AppExpr {
    pub fun: Expr,
    pub arg: ThinVec<Binding>,
}

/// Let binding expression.
pub struct LetExpr {
    pub name: Ident,
    pub value: Expr,
    pub next: Expr,
}

/// A type annotation.
pub struct AnnExpr {
    pub value: Expr,
    pub typ: Expr,
}

/// A literal is a constant value that can be used in the program.
pub enum Literal {
    U60(u64),
    F60(f64),
    U120(u128),
    String(String),
}

// TODO: Rename
pub enum TypeExpr {
    Help(String),
    Type,
    TypeU60,
    TypeU120,
    TypeF60,
}

/// A binary operation.
pub struct BinaryExpr {
    pub left: Expr,
    pub op: crate::concrete::Operation,
    pub right: Expr,
}

/// A substitution expression is a substitution of a value inside the context.
/// i.e.
///
/// ```kind
/// specialize a into #0 in a
/// ```
pub struct SubstExpr {
    pub name: Ident,
    pub num: u64,
    pub value: Box<Expr>,
}

/// An expression is a piece of code that can be evaluated.
pub enum ExprKind {
    Local(Box<LocalExpr>),
    Pi(Box<PiExpr>),
    Lambda(Box<LambdaExpr>),
    App(Box<AppExpr>),
    Let(Box<LetExpr>),
    Ann(Box<AnnExpr>),
    Binary(Box<BinaryExpr>),
    Literal(Box<Literal>),
    Constructor(Box<ConstructorExpr>),
    Subst(Box<SubstExpr>),
    Type(Box<TypeExpr>),
}

pub type Expr = Item<ExprKind>;

/// A type signature is a top-level structure that says what is the type
/// of a function i.e.
///
/// ```kind
/// Add (n: Nat) (m: Nat) : Nat
/// ```
pub struct Signature {
    pub name: Ident,
    pub arguments: ThinVec<Argument>,
    pub return_typ: ThinVec<Expr>,
}

/// A rule is a top-level structure that have pattern match rules. It does
/// not include the neither type signature nor other rules i.e.
///
/// ```kind
/// Add Nat.zero m = m
/// ```
pub struct Rule {
    pub name: Ident,
    pub patterns: ThinVec<Expr>,
    pub value: Expr,
}

/// Commands are top level structures that will run at compile time.
/// It's useful for evaluating expressions and making widgets without
/// compromising the structure of the program too much. i.e.
///
/// ```kind
/// @eval (+ 1 1)
/// ```
pub struct Command {
    pub name: Ident,
    pub arguments: ThinVec<Expr>,
}

/// A top-level item is a item that is on the outermost level of a
/// program. It includes functions, commands, signatures and rules.
pub enum TopLevelKind {
    Entry(Signature, ThinVec<Rule>),
    Commmand(Command),
}

pub struct Attributed<T> {
    pub attributes: ThinVec<Attribute>,
    pub data: T,
}

/// A top level structure with attributes.
pub type TopLevel = Attributed<Item<TopLevelKind>>;

/// A collection of top-level items. This is the root of the CST and
/// is the result of parsing a module.
pub struct Module {
    pub items: ThinVec<TopLevel>,
}
