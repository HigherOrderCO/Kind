//! Describes the concrete tree with all of the sugars. It's useful
//! to pretty printing and resugarization from the type checker.
//! It stores some tokens inside the tree in order to make it easier
//! to reconstruct the entire program.

use num_bigint::BigUint;
use thin_vec::ThinVec;

use kind_lexer::tokens::Token;

use crate::lexemes;
use crate::lexemes::{
    AngleBracket, Brace, Bracket, Colon, Either, Equal, Ident, Item, Paren, QualifiedIdent,
    Tokenized,
};

#[derive(Debug)]
pub enum AttributeStyleKind {
    String(Tokenized<String>),
    Number(Tokenized<u64>),
    Identifier(Ident),
    List(Bracket<ThinVec<AttributeStyle>>),
}

/// The "argument" part of the attribute. It can be used both in
/// the value after an equal or in the arguments e.g
///
/// ```kind
/// #name = "Vaundy"
/// #derive[match]
/// ```
///
pub type AttributeStyle = Item<AttributeStyleKind>;

#[derive(Debug)]
pub struct AttributeKind {
    pub r#hash: lexemes::Hash,
    pub name: Ident,
    pub value: Option<Equal<AttributeStyle>>,
    pub arguments: Option<Bracket<ThinVec<AttributeStyle>>>,
}

/// An attribute is a special compiler flag.
pub type Attribute = Item<AttributeKind>;

/// A type binding is a type annotation for a variable.
pub struct TypeBinding {
    pub name: Ident,
    pub typ: Colon<Box<Expr>>,
}

pub type ArgumentBinding = Either<AngleBracket<Param>, Paren<Param>>;

/// An argument of a type signature.
pub struct Argument {
    pub minus: Option<lexemes::Minus>,
    pub plus: Option<lexemes::Plus>,
    pub binding: ArgumentBinding,
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
}

/// A param is a variable or a type binding.
/// i.e.
/// ```kind
/// (x : Int)
/// // or
/// x
/// ```
pub enum Param {
    Named(Paren<TypeBinding>),
    Expr(Box<Expr>),
}

/// A all node is a dependent function type.
pub struct PiExpr {
    pub r#tilde: lexemes::Tilde,
    pub param: Param,
    pub r#arrow: lexemes::RightArrow,
    pub body: Box<Expr>,
}

/// A sigma node is a dependent pair type. It express
/// the dependency of the type of the second element
/// of the pair on the first one.
pub struct SigmaExpr {
    pub param: Bracket<TypeBinding>,
    pub r#arrow: lexemes::RightArrow,
    pub body: Box<Expr>,
}

/// A lambda expression (an anonymous function).
pub struct LambdaExpr {
    pub r#tilde: Option<lexemes::Tilde>,
    pub param: Param,
    pub r#arrow: lexemes::FatArrow,
    pub body: Box<Expr>,
}

pub struct Rename(pub Ident, pub Equal<Box<Expr>>);

pub enum NamedBinding {
    Named(Paren<Rename>),
    Expr(Box<Expr>),
}

pub struct Binding {
    pub r#tilde: Option<lexemes::Tilde>,
    pub value: NamedBinding,
}

/// Application of a function to a sequence of arguments.
pub struct AppExpr {
    pub fun: Box<Expr>,
    pub arg: ThinVec<Binding>,
}

/// Let binding expression.
pub struct LetExpr {
    pub r#let: lexemes::Let,
    pub name: Ident,
    pub value: Equal<Box<Expr>>,
    pub r#semi: Option<lexemes::Semi>,
    pub next: Box<Expr>,
}

/// A type annotation.
pub struct AnnExpr {
    pub value: Box<Expr>,
    pub r#colon: lexemes::ColonColon,
    pub typ: Box<Expr>,
}

/// A literal is a constant value that can be used in the program.
pub enum Literal {
    U60(Tokenized<u64>),
    F60(Tokenized<f64>),
    U120(Tokenized<u128>),
    Nat(Tokenized<BigUint>),
    String(Tokenized<String>),
    Char(Tokenized<char>),
}

// TODO: Rename
pub enum TypeExpr {
    Help(Tokenized<String>),
    Type(lexemes::Type),
    TypeU60(Token),
    TypeU120(Token),
    TypeF60(Token),
}

pub enum Operation {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    Eq,
    Neq,
    Lt,
    Gt,
    Leq,
    Geq,
    And,
    Or,
    Xor,
    Not,
    Shl,
    Shr,
}

/// A binary operation.
pub struct BinaryExpr {
    pub left: Box<Expr>,
    pub op: Tokenized<Operation>,
    pub right: Box<Expr>,
}

/// Monadic binding without a variable name.
pub struct NextStmt {
    pub left: Box<Expr>,
    pub r#semi: Option<lexemes::Semi>,
    pub next: Box<Stmt>,
}

/// An ask statement is a monadic binding inside the `do` notation
/// with a name.
pub struct AskStmt {
    pub r#ask: lexemes::Ask,
    pub name: Ident,
    pub value: Equal<Box<Expr>>,
    pub next: Box<Stmt>,
}

/// A let binding inside the `do` notation.
pub struct LetStmt {
    pub r#let: lexemes::Let,
    pub name: Ident,
    pub value: Equal<Box<Expr>>,
    pub next: Box<Stmt>,
}

/// The "pure" function of the `A` monad.
pub struct ReturnStmt {
    pub r#return: lexemes::Return,
    pub value: Box<Expr>,
    pub next: Box<Stmt>,
}

/// An expression without the "pure" function.
pub struct ReturnExprStmt {
    pub value: Box<Expr>,
}

/// An statement is a "single line" of code inside the
/// do notation. It can be either an expression, a let
/// binding, a return statement or a return expression.
/// i.e.
///
/// ```kind
/// do A {
///    ask a = 2      // Monadic binding of the `A` monad
///    let a = 2      // A simple let expression
///    return a + 2   // The "pure" functoin of the `A` monad
/// }
/// ```
pub enum StmtKind {
    /// Monadic binding without a variable name.
    Next(NextStmt),
    /// Monadic binding with a variable name.
    Ask(AskStmt),
    /// A simple let expression.
    Let(LetStmt),
    /// The "pure" function of the `A` monad.
    Return(ReturnStmt),
    /// An expression without the "pure" function.
    ReturnExpr(ReturnExprStmt),
}

pub type Stmt = Item<StmtKind>;

/// A DoNode is similar to the haskell do notation.
/// i.e.
///
/// ```kind
/// do A {
///     ask a = 2;
///     ask b = 3;
///     return a + b;
/// }
/// ```
pub struct DoNode {
    pub r#do: lexemes::Do,
    pub typ: Option<Ident>,
    pub value: Brace<Stmt>,
}

/// Conditional expression.
pub struct IfExpr {
    pub cond: Tokenized<Box<Expr>>,
    pub then: Brace<Box<Expr>>,
    pub otherwise: Tokenized<Brace<Box<Expr>>>,
}

/// A Pair node represents a dependent pair. i.e.
///
/// ```kind
/// $ a b
/// ```
pub struct PairNode<T> {
    pub r#sign: lexemes::Sign,
    pub left: Box<T>,
    pub right: Box<T>,
}

/// A substitution expression is a substitution of a value inside the context.
/// i.e.
///
/// ```kind
/// specialize a into #0 in a
/// ```
pub struct SubstExpr {
    pub r#specialize: lexemes::Specialize,
    pub name: Ident,
    pub r#into: Token,
    pub r#hash: lexemes::Hash,
    pub num: u64,
    pub r#in: Token,
    pub value: Box<Expr>,
}

/// A List expression represents a list of values.
pub struct ListNode<T> {
    pub bracket: Bracket<ThinVec<T>>,
}

/// A Case is a single case in a match node.
pub struct CaseNode {
    pub name: Ident,
    pub r#arrow: lexemes::FatArrow,
    pub value: Box<Expr>,
}

/// A match expression is a case analysis on a value (dependent eliminator)
/// i.e.
///
/// ```kind
/// match List a {
///     nil  => 0
///     cons => a.head
/// }
/// ```
pub struct MatchExpr {
    pub r#match: lexemes::Match,
    pub typ: Option<Ident>,
    pub with: Option<(lexemes::With, ThinVec<Param>)>,
    pub scrutinee: Box<Expr>,
    pub cases: Brace<ThinVec<CaseNode>>,
    pub motive: Option<Colon<Box<Expr>>>,
}

/// An OpenNode introduces each field of a constructor as variables
/// into the context so we can program like the dot notation of object
/// oriented programming languages. i.e.
///
/// ```kind
/// open List a
/// a.head
/// ```
///
pub struct OpenExpr {
    pub r#open: lexemes::Open,
    pub typ: Ident,

    /// The concrete syntax tree allows some more flexibility in order
    /// to improve error messages. So, the name should be an identifier
    /// but the parser will allow any expression.
    pub name: Box<Expr>,
    pub motive: Option<Colon<Box<Expr>>>,
    pub body: Brace<ThinVec<Stmt>>,
}

/// A node that express the operation after accessing fields
/// of a record.
pub enum AccessOperation {
    Set(Token, Box<Expr>),
    Mut(Token, Box<Expr>),
    Get,
}

/// A node for accessing and modifying fields of a record.
pub struct AccessExpr {
    pub typ: Box<Expr>,
    pub expr: Box<Expr>,
    pub fields: ThinVec<(lexemes::Dot, Ident)>,
    pub operation: AccessOperation,
}

/// An expression is a piece of code that can be evaluated.
pub enum ExprKind {
    Local(Box<LocalExpr>),
    Pi(Box<PiExpr>),
    Sigma(Box<SigmaExpr>),
    Lambda(Box<LambdaExpr>),
    App(Box<AppExpr>),
    Let(Box<LetExpr>),
    Ann(Box<AnnExpr>),
    Binary(Box<BinaryExpr>),
    Do(Box<DoNode>),
    If(Box<IfExpr>),
    Literal(Box<Literal>),
    Constructor(Box<ConstructorExpr>),
    Pair(Box<PairNode<Expr>>),
    List(Box<ListNode<Expr>>),
    Subst(Box<SubstExpr>),
    Match(Box<MatchExpr>),
    Open(Box<OpenExpr>),
    Access(Box<AccessExpr>),
    Type(Box<TypeExpr>),
    Paren(Box<Paren<Expr>>),
    Error,
}

pub type Expr = Item<ExprKind>;

/// A constructor node is the name of a global function.
pub struct ConstructorPat {
    pub name: QualifiedIdent,
    pub args: ThinVec<Argument>,
}

/// A pattern is part of a rule. It is a structure that matches an expression.
pub enum PatKind {
    Ident(Ident),
    Pair(PairNode<Pat>),
    Constructor(ConstructorPat),
    List(ListNode<Pat>),
    Literal(Literal),
}

pub type Pat = Item<PatKind>;

/// A type signature is a top-level structure that says what is the type
/// of a function i.e.
///
/// ```kind
/// Add (n: Nat) (m: Nat) : Nat
/// ```
pub struct Signature {
    pub name: Ident,
    pub arguments: ThinVec<Argument>,
    pub colon: Colon<ThinVec<Expr>>,
}

/// A rule is a top-level structure that have pattern match rules. It does
/// not include the neither type signature nor other rules i.e.
///
/// ```kind
/// Add Nat.zero m = m
/// ```
pub struct Rule {
    pub name: Ident,
    pub patterns: ThinVec<Pat>,
    pub value: Equal<Expr>,
}

/// A function is a top-level structure that dont have pattern match rules
/// i.e.
///
/// ```kind
/// Add (n: Nat) (m: Nat) : Nat {
///    n + m
/// }
/// ```
pub struct Function {
    pub name: Ident,
    pub arguments: ThinVec<Argument>,
    pub return_typ: Option<Colon<Expr>>,
    pub value: Brace<Expr>,
}

/// Commands are top level structures that will run at compile time.
/// It's useful for evaluating expressions and making widgets without
/// compromising the structure of the program too much. i.e.
///
/// ```kind
/// @eval (+ 1 1)
/// ```
pub struct Command {
    pub at: Token,
    pub name: Ident,
    pub arguments: ThinVec<Expr>,
}

/// A constructor is a structure that defines a data constructor of a type
/// family. i.e.
///
/// ```kind
///    some (value: a) : Maybe a
/// ```
pub struct Constructor {
    pub name: Ident,
    pub arguments: ThinVec<Argument>,
    pub typ: Option<Colon<ThinVec<Expr>>>,
}

/// A type definition is a top-level structure that defines a type family
/// with multiple constructors that named fields, indices and parameters.
pub struct TypeDef {
    pub name: QualifiedIdent,
    pub constructors: ThinVec<Constructor>,
    pub params: ThinVec<Argument>,
    pub indices: ThinVec<Argument>,
}

/// A record definition is a top-level structure that defines a type with
/// a single constructor that has named fields with named fields.
pub struct RecordDef {
    pub name: QualifiedIdent,
    pub fields: ThinVec<TypeBinding>,
    pub params: ThinVec<Argument>,
    pub indices: ThinVec<Argument>,
}

/// A top-level item is a item that is on the outermost level of a
/// program. It includes functions, commands, signatures and rules.
pub enum TopLevelKind {
    Function(Function),
    Commmand(Command),
    Signature(Signature),
    Record(RecordDef),
    Type(TypeDef),
    Rule(Rule),
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
    pub shebang: Option<String>,
    pub items: ThinVec<TopLevel>,
    pub eof: Token,
}
