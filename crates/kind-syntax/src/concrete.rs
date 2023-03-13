//! Describes the concrete tree with all of the sugars. It's useful
//! to pretty printing and resugarization from the type checker.
//! It stores some tokens inside the tree in order to make it easier
//! to reconstruct the entire program.

use kind_span::Span;
use thin_vec::ThinVec;

use kind_lexer::tokens::Token;

// Lexemes

type Hash = Token;
type Minus = Token;
type Plus = Token;
type Semi = Token;
type RightArrow = Token;
type Tilde = Token;
type FatArrow = Token;
type ColonColon = Token;
type Let = Token;
type Type = Token;
type Help = Token;
type With = Token;
type Dot = Token;

pub enum Either<A, B> {
    Left(A),
    Right(B),
}

// Compounds
#[derive(Debug)]
pub struct Parenthesis<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Bracket<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Brace<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct AngleBracket<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Equal<T>(pub Token, pub T);

#[derive(Debug)]
pub struct Colon<T>(pub Token, pub T);

#[derive(Debug)]
pub struct Tokenized<T>(pub Token, pub T);

// Concrete syntax tree

#[derive(Debug)]
pub struct Ident(pub Item<Tokenized<String>>);

#[derive(Debug)]
pub struct QualifiedIdent(pub Item<Tokenized<String>>);

/// A localized data structure, it's useful to keep track of source code
/// location.
#[derive(Debug)]
pub struct Item<T> {
    pub data: T,
    pub span: Span,
}


impl<T> Item<T> {
    pub fn new(data: T, span: Span) -> Item<T> {
        Item { data, span }
    }

    pub fn map<U>(self, fun: fn(T) -> U) -> Item<U> {
        Item {
            data: fun(self.data),
            span: self.span,
        }
    }
}

#[derive(Debug)]
pub enum AttributeStyleKind {
    String(Tokenized<String>),
    Number(Tokenized<u64>),
    Identifier(Item<Ident>),
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
    pub hash: Hash,
    pub name: Item<Ident>,
    pub value: Option<Equal<AttributeStyle>>,
    pub arguments: Option<Bracket<ThinVec<AttributeStyle>>>,
}

/// An attribute is a special compiler flag.
pub type Attribute = Item<AttributeKind>;

/// A type binding is a type annotation for a variable.
pub struct TypeBinding {
    pub name: Ident,
    pub typ: Colon<Box<Expr>>
}

pub type ArgumentBinding = Either<AngleBracket<Param>, Parenthesis<Param>>;

/// An argument of a type signature.
pub struct Argument {
    pub minus: Option<Minus>,
    pub plus: Option<Plus>,
    pub binding: ArgumentBinding
}

/// A lower cased variable.
pub struct VarNode {
    pub name: Ident
}

/// A constructor node is an application of a series of arguments
/// to a global function.
pub struct ConstructorNode<T> {
    pub name: QualifiedIdent,
    pub arguments: ThinVec<T>
}

/// A param is a variable or a type binding.
/// i.e.
/// ```kind
/// (x : Int)
/// // or
/// x
/// ```
pub enum Param {
    Named(Parenthesis<TypeBinding>),
    Expr(Box<Expr>)
}

/// A all node is a dependent function type.
pub struct AllNode {
    pub tilde: Tilde,
    pub param: Param,
    pub arrow: RightArrow,
    pub body: Box<Expr>
}

/// A sigma node is a dependent pair type. It express
/// the dependency of the type of the second element
/// of the pair on the first one.
pub struct SigmaNode {
    pub param: Bracket<TypeBinding>,
    pub arrow: RightArrow,
    pub body: Box<Expr>
}

/// A lambda expression (an anonymous function).
pub struct LambdaNode {
    pub tilde: Tilde,
    pub param: Param,
    pub arrow: FatArrow,
    pub body: Box<Expr>
}

/// Application of a function to a sequence of arguments.
pub struct AppNode {
    pub fun: Box<Expr>,
    pub arg: ThinVec<Expr>
}

/// Let binding expression.
pub struct LetNode {
    pub lett: Let,
    pub name: Ident,
    pub val: Equal<Box<Expr>>,
    pub semi: Option<Semi>,
    pub next: Box<Expr>,
}

/// A type annotation.
pub struct AnnNode {
    pub val: Box<Expr>,
    pub colon: ColonColon,
    pub typ: Box<Expr>
}

/// A literal is a constant value that can be used in the program.
pub enum LiteralNode {
    Help(Tokenized<Help>),

    Type(Type),
    TypeU60(Token),
    TypeU120(Token),
    TypeF60(Token),

    U60(Tokenized<u64>),
    F60(Tokenized<f64>),
    U120(Tokenized<u128>),

    Nat(Tokenized<u128>),
    String(Tokenized<String>),
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
pub struct BinaryNode {
    pub left: Box<Expr>,
    pub op: Tokenized<Operation>,
    pub right: Box<Expr>
}

    /// Monadic binding without a variable name.
pub struct NextSttmNode {
    pub left: Box<Expr>,
    pub semi: Option<Semi>,
    pub next: Box<Sttm>
}

/// An ask statement is a monadic binding inside the `do` notation
/// with a name.
pub struct AskSttmNode {
    pub ask: Token,
    pub name: Ident,
    pub colon: Equal<Box<Expr>>,
    pub next: Box<Sttm>
}

/// A let binding inside the `do` notation.
pub struct LetSttmNode {
    pub lett: Token,
    pub name: Ident,
    pub colon: Equal<Box<Expr>>,
    pub next: Box<Sttm>
}

/// The "pure" function of the `A` monad.
pub struct ReturnNode {
    pub ret: Token,
    pub value: Box<Expr>,
    pub next: Box<Sttm>
}

/// An expression without the "pure" function.
pub struct ReturnExprNode {
    pub value: Box<Expr>,
    pub next: Box<Expr>
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
pub enum SttmKind {
    /// Monadic binding without a variable name.
    Next(NextSttmNode),
    /// Monadic binding with a variable name.
    Ask(AskSttmNode),
    /// A simple let expression.
    Let(LetSttmNode),
    /// The "pure" function of the `A` monad.
    Return(ReturnNode),
    /// An expression without the "pure" function.
    RetExpr(ReturnExprNode),
}

pub type Sttm = Item<SttmKind>;

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
    pub do_: Token,
    pub typ: Option<Ident>,
    pub body: Brace<Sttm>
}

/// Conditional expression.
pub struct IfNode {
    pub ift: Token,
    pub cond: Box<Expr>,
    pub then: Brace<Box<Expr>>,
    pub elset: Token,
    pub else_: Brace<Box<Expr>>,
}

/// A PairNode represents a dependent pair. i.e.
///
/// ```kind
/// $ a b
/// ```
pub struct PairNode<T> {
    pub dollar: Token,
    pub left: Box<T>,
    pub right: Box<T>,
}

/// A substitution node is a substitution of a value inside the context.
/// i.e.
///
/// ```kind
/// specialize a into #0 in a
/// ```
pub struct SubstNode {
    pub specialize: Token,
    pub name: Ident,
    pub into: Token,
    pub hash: Hash,
    pub num: u64,
    pub in_: Token,
    pub expr: Box<Expr>,
}

/// A ListNode represents a list of values.
pub struct ListNode<T> {
    pub bracket: Bracket<ThinVec<T>>
}

/// A Case is a single case in a match node.
pub struct Case {
    pub name: Ident,
    pub fat_arrow: FatArrow,
    pub body: Box<Expr>
}

/// A MatchNode is a case analysis on a value (dependent eliminator)
/// i.e.
///
/// ```kind
/// match List a {
///     nil  => 0
///     cons => a.head
/// }
/// ```
pub struct MatchNode {
    pub match_: Token,
    pub typ: Ident,
    pub with: Option<(With, ThinVec<Param>)>,
    pub scrutinee: Box<Expr>,
    pub body: Brace<ThinVec<Case>>,
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
pub struct OpenNode {
    pub open: Token,
    pub typ: Ident,

    /// The concrete syntax tree allows some more flexibility in order
    /// to improve error messages. So, the name should be an identifier
    /// but the parser will allow any expression.
    pub name: Box<Expr>,
    pub motive: Option<Colon<Box<Expr>>>,
    pub body: Brace<ThinVec<Sttm>>,
}

/// A node that express the operation after accessing fields
/// of a record.
pub enum AccessOperation {
    Set(Token, Box<Expr>),
    Mut(Token, Box<Expr>),
    Get,
}

/// A node for accessing and modifying fields of a record.
pub struct AccessNode {
    pub type_: Box<Expr>,
    pub expr: Box<Expr>,
    pub fields: ThinVec<(Dot, Ident)>,
    pub operation: AccessOperation
}

/// An expression is a piece of code that can be evaluated.
pub enum ExprKind {
    Var(VarNode),
    All(AllNode),
    Sigma(SigmaNode),
    Lambda(LambdaNode),
    App(AppNode),
    Let(LetNode),
    Ann(AnnNode),
    Binary(BinaryNode),
    Do(DoNode),
    If(IfNode),
    Literal(LiteralNode),
    Constructor(ConstructorNode<Expr>),
    Pair(PairNode<Expr>),
    List(ListNode<Expr>),
    Subst(SubstNode),
    Match(MatchNode),
    Open(OpenNode),
    Access(AccessNode),
    Err
}

pub type Expr = Item<ExprKind>;

/// A pattern is part of a rule. It is a structure that matches an expression.
pub enum PatKind {
    Ident(Ident),
    Pair(PairNode<Pat>),
    Constructor(ConstructorNode<Pat>),
    List(ListNode<Pat>),
    Literal(LiteralNode),
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
    pub colon: Option<Colon<Expr>>,
    pub value: Brace<Expr>
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

/// A top-level item is a item that is on the outermost level of a
/// program. It includes functions, commands, signatures and rules.
pub enum TopLevelKind {
    Function(Function),
    Commmand(Command),
    Signature(Signature),
    Rule(Rule)
}

pub type TopLevel = Item<TopLevelKind>;

/// A collection of top-level items. This is the root of the CST and
/// is the result of parsing a module.
pub struct Module {
    pub shebang: String,
    pub items: ThinVec<TopLevel>,
    pub eof: Token
}