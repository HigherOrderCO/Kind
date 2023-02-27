//! Describes the concrete AST with all of the sugars.
//! It's useful to pretty printing and resugarization
//! from the type checker.

use std::fmt::Display;

use kind_span::{NodeId, Span, Symbol};
use num_bigint::BigUint;
use thin_vec::ThinVec;

/// A data structure that has an identifier. It's useful to keep track of
/// some information on LSP.
pub struct Item<T> {
    pub data: T,
    pub span: Span,
}

impl<T> Item<T> {
    pub fn map<U>(self, f: fn(T) -> U) -> Item<U> {
        Item {
            data: f(self.data),
            span: self.span,
        }
    }
}

/// The "argument" part of the attribute. It can be used either in
/// the value after an equal or in the arguments e.g
/// ```kind
/// #name = "Vaundy"
/// #derive[match]
/// ```
pub enum AttributeStyle {
    String(Symbol),
    Number(u64),
    Identifier(Ident),
    List(ThinVec<AttributeStyle>),
}

pub struct IdentFrame {
    pub data: ThinVec<Item<Symbol>>,
}

/// An identifier is a symbol with an id.
pub type Ident = Item<IdentFrame>;

/// A qualified identifier describes names in the language
/// that are separated by dots e.g "Data.List"
pub struct QualifiedIdent {
    pub data: Item<ThinVec<Item<Symbol>>>,
}
pub struct AttributeKind {
    pub name: Ident,
    pub value: Option<AttributeStyle>,
    pub arguments: ThinVec<AttributeStyle>,
}

/// An attribute is a special compiler flag.
pub type Attribute = Item<AttributeKind>;

pub enum LiteralKind {
    /// The universe of types (e.g. Type)
    Type,
    /// The help operator that prints the context
    /// and the goal (e.g. ?)
    Help(Symbol),
    /// The type literal of 60 bit numbers (e.g. 2 : U60)
    NumTypeU60,
    NumTypeF60,
    // Char literal
    Char(char),
    /// A 60 bit number literal (e.g 32132)
    NumU60(u64),
    // A 120 bit number literal
    NumU120(u128),
    // A 60 bit floating point number literal
    NumF60(f64),
    // Naturals represented by u64
    Nat(BigUint),
    // A String literal
    String(Symbol),
}

/// A variable node.
pub struct VarNode {
    pub name: Ident,
}

/// A node that renames a field
pub enum Rename {
    Named { field: Ident, to: Ident },
    Unnamed(Ident),
}

/// A named or unnamed argument.
pub enum Binding {
    Named { name: Ident, expr: Expr },
    Unnamed(Expr),
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Erased {
    Yes,
    No,
}

impl From<bool> for Erased {
    fn from(value: bool) -> Self {
        if value {
            Erased::Yes
        } else {
            Erased::No
        }
    }
}

/// Erasable nodes that are used in arguments of
/// [AppNode] and [ConstructorNode].
pub struct Erasable<T> {
    pub data: T,
    pub erased: Erased,
}

impl<T> Erasable<T> {
    pub fn new(data: T, erased: Erased) -> Self {
        Erasable { data, erased }
    }
}

/// Application of a top level definition.
pub struct ConstructorNode {
    pub name: QualifiedIdent,
    pub args: ThinVec<Erasable<Item<Binding>>>,
}

/// Application of an expression.
pub struct AppNode {
    pub fun: Box<Expr>,
    pub args: ThinVec<Erasable<Expr>>,
}

/// Pi type node. e.g (x: T) -> U
pub struct AllNode {
    pub param: Option<Ident>,
    pub typ: Box<Expr>,
    pub body: Box<Expr>,
}

/// Sigma type node. e.g [a: T] -> U
pub struct SigmaNode {
    pub param: Option<Ident>,
    pub typ: Box<Expr>,
    pub body: Box<Expr>,
}

pub struct LambdaNode {
    pub param: Erasable<Ident>,
    pub typ: Option<Box<Expr>>,
    pub body: Box<Expr>,
}

pub struct LetNode {
    pub param: Ident,
    pub body: Box<Expr>,
    pub next: Box<Expr>,
}

/// Type annotation judgment
pub struct AnnNode {
    pub expr: Box<Expr>,
    pub typ: Box<Expr>,
}

pub struct BinaryNode {
    pub operator: OperatorKind,
    pub left: Box<Expr>,
    pub right: Box<Expr>,
}

/// Tuple
pub struct PairNode {
    pub left: Box<Expr>,
    pub right: Box<Expr>,
}

pub enum SttmKind {
    Expr(Box<Expr>, Box<Sttm>),
    Ask(Ident, Box<Expr>, Box<Sttm>),
    Let(Ident, Box<Expr>, Box<Sttm>),
    Return(Box<Expr>),
    RetExpr(Box<Expr>),
}

/// Statement of do notation.
pub type Sttm = Item<SttmKind>;

/// Monadic notation
pub struct DoNode {
    pub typ: QualifiedIdent,
    pub sttm: Sttm,
}

pub struct IfNode {
    pub cond: Box<Expr>,
    pub r#if: Box<Expr>,
    pub r#else: Box<Expr>,
}

/// A case of a match
pub struct Case {
    pub constructor: Ident,
    pub bindings: ThinVec<Rename>,
    pub value: Box<Expr>,
}

/// Dependent eliminator
pub struct MatchNode {
    pub typ: QualifiedIdent,
    pub scrutinee: Ident,
    pub value: Option<Box<Expr>>,
    pub with_vars: ThinVec<(Ident, Option<Expr>)>,
    pub cases: ThinVec<Case>,
    pub motive: Option<Box<Expr>>,
}

/// Dependent eliminator with one constructor
pub struct OpenNode {
    pub type_name: QualifiedIdent,
    pub var_name: Ident,
    pub motive: Option<Box<Expr>>,
    pub next: Box<Expr>,
}

/// A substitution changes a variable with a value.
pub struct SubstNode {
    pub name: Ident,
    pub redx: usize,
    pub indx: usize,
    pub expr: Box<Expr>,
}

/// List node operation.
pub struct ListNode {
    pub elements: ThinVec<Expr>,
}

/// The operation that is used at the [AccessNode]
pub enum AccessOperation {
    Set(Box<Expr>),
    Mut(Box<Expr>),
    Get,
}

/// Dot syntax for records. It's really useful to update,
/// get or set fields without being so verbose.
pub struct AccessNode {
    pub typ: Box<Expr>,
    pub expr: Box<Expr>,
    pub fields: ThinVec<Ident>,
    pub operation: AccessOperation,
}

pub enum ExprKind {
    /// Variable
    Var(VarNode),

    /// An application of a local variable.
    App(AppNode),

    /// The dependent function space (e.g. (x : Int) -> y)
    All(AllNode),

    /// The dependent product space (e.g. [x : Int] -> y)
    Sigma(SigmaNode),

    /// A anonymous function that receives one argument
    Lambda(LambdaNode),

    /// Declaration of a local variable
    Let(LetNode),

    /// Type annotation judgment
    Ann(AnnNode),

    /// Literal node
    Lit(LiteralKind),

    /// Binary operation
    Binary(BinaryNode),

    /// Pair term
    Pair(PairNode),

    /// Do notation expression
    Do(DoNode),

    /// If expression
    If(IfNode),

    /// Match expression / Dependent eliminator
    Match(MatchNode),

    /// Open expression / Dependent eliminator with one constructor
    Open(OpenNode),

    /// Substitution expression
    Subst(SubstNode),

    /// List expression
    List(ListNode),

    /// Acesssor expression
    Access(AccessNode),

    /// Parenthesis node (it's useful as a CST)
    Paren(Box<Expr>),

    /// Sentinel error token
    Err,
}

pub type Expr = Item<ExprKind>;

/// An argument is the left side piece of a pi type. It's used
/// in entries and in constructors.
pub struct ArgumentKind {
    pub hidden: bool,
    pub erased: bool,
    pub name: Ident,
    pub typ: Option<Box<Expr>>,
}

pub type Argument = Item<ArgumentKind>;

/// Constructor of a sum type.
pub struct ConstructorKind {
    pub name: Ident,
    pub docs: ThinVec<String>,
    pub attrs: ThinVec<Attribute>,
    pub args: ThinVec<Argument>,
    pub typ: Option<Box<Expr>>,
}

pub type Constructor = Item<ConstructorKind>;

/// Field of a record type definition.
pub struct FieldKind {
    pub name: Ident,
    pub typ: Box<Expr>,
    pub id: NodeId,
}

pub type Field = Item<FieldKind>;

/// Record type declaration. It's like a struct.
pub struct RecordDecl {
    pub name: QualifiedIdent,
    pub docs: ThinVec<Ident>,
    pub parameters: ThinVec<Argument>,
    pub constructor: Option<Ident>,
    pub fields: ThinVec<Field>,
    pub attrs: ThinVec<Attribute>,
    pub cons_attrs: ThinVec<Attribute>,
}

/// Sum type declaration.
pub struct SumDecl {
    pub name: QualifiedIdent,
    pub docs: ThinVec<Ident>,
    pub parameters: ThinVec<Argument>,
    pub indices: ThinVec<Argument>,
    pub constructors: ThinVec<Constructor>,
    pub attrs: ThinVec<Attribute>,
}

pub enum PatKind {
    /// Name of a variable
    Var(VarNode),
    /// Application of a constructor
    App(QualifiedIdent, Vec<Box<Pat>>),
    /// 60 bit unsigned integer
    U60(u64),
    /// 120 bit unsigned integer
    U120(u128),
    /// 60 bit floating point number
    F60(u64),
    /// Pair
    Pair(PairNode),
    /// List literal
    List(ListNode),
    /// Str literal
    Str(String),
    /// Char literal
    Char(char),
    /// Wildcard
    Hole,
    /// Absurd pattern
    Absurd,
    /// Error sentinel value
    Err,
}

/// A pattern for pattern matching
pub type Pat = Item<PatKind>;

/// Right hand side of a rule.
pub enum RuleRHS {
    Impossible,
    Value(Box<Expr>),
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns and on the
/// right hand side a value.
pub struct Rule {
    pub name: QualifiedIdent,
    pub pats: Vec<Box<Pat>>,
    pub body: RuleRHS,
}

/// A type signature of a function
pub struct Signature {
    pub name: QualifiedIdent,
    pub args: ThinVec<Argument>,
    pub typ: Box<Expr>,
}

pub struct Function {
    pub name: QualifiedIdent,
    pub args: ThinVec<Argument>,
    pub typ: Option<Box<Expr>>,
    pub body: Box<Expr>,
}

pub struct Command {
    pub name: Ident,
    pub value: Box<Expr>,
}

pub enum TopLevelKind {
    SumType(SumDecl),
    RecordType(RecordDecl),
    Command(Command),

    Function(Function),
    Signature(Signature),
    Rule(Rule),
}

pub struct TopLevel {
    docs: ThinVec<String>,
    attrs: ThinVec<Attribute>,
    data: Item<TopLevelKind>,
}

pub struct Module {
    pub declarations: ThinVec<TopLevel>,
}

/// Enum of binary operators.
#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub enum OperatorKind {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    And,
    Or,
    Xor,
    Shl,
    Shr,
    Ltn,
    Lte,
    Eql,
    Gte,
    Gtn,
    Neq,
}

struct Intersperse<'a, T>(&'static str, &'a [T]);

impl<'a, T: Display> Display for Intersperse<'a, T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if !self.0.is_empty() {
            write!(f, "{}", self.1[0])?;
            for ident in &self.1[1..] {
                write!(f, "{}{ident}", self.0)?;
            }
        }

        Ok(())
    }
}

struct Spaced<'a, T>(&'static str, &'a [T]);

impl<'a, T: Display> Display for Spaced<'a, T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for ident in self.1 {
            write!(f, "{}{ident}", self.0)?;
        }
        Ok(())
    }
}

impl Display for IdentFrame {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", Intersperse(".", &self.data))
    }
}

impl<T: Display> Display for Item<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data)
    }
}

impl Display for AttributeStyle {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use AttributeStyle::*;
        match self {
            String(str) => write!(f, "\"{}\"", str),
            Number(n) => write!(f, "{n}"),
            Identifier(n) => write!(f, "{}", n),
            List(ls) => write!(f, "[{}]", Intersperse(", ", ls)),
        }
    }
}

impl Display for QualifiedIdent {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", Intersperse(".", &self.data.data))?;
        Ok(())
    }
}

impl Display for AttributeKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "@{}", self.name)?;

        if !self.arguments.is_empty() {
            write!(f, "[{}]", Intersperse(",", &self.arguments))?;
        }

        if let Some(argument) = &self.value {
            write!(f, " = {argument}")?;
        }

        Ok(())
    }
}

impl Display for LiteralKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use LiteralKind::*;
        match self {
            Type => write!(f, "Type"),
            Help(help) => write!(f, "?{help}"),
            NumTypeU60 => write!(f, "U60"),
            NumTypeF60 => write!(f, "F60"),
            Char(char) => write!(f, "'{char}'"),
            NumU60(num) => write!(f, "{num}"),
            NumU120(num) => write!(f, "{num}u120"),
            NumF60(float) => write!(f, "{float}"),
            Nat(nat) => write!(f, "{nat}n"),
            String(str) => write!(f, "\"{str}\""),
        }
    }
}

impl Display for Binding {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Binding::Named { name, expr } => write!(f, "({name} = {expr})"),
            Binding::Unnamed(name) => write!(f, "{name}"),
        }
    }
}

impl Display for Rename {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Rename::Named { field, to } => write!(f, "({field} = {to})"),
            Rename::Unnamed(name) => write!(f, "{name}"),
        }
    }
}

impl<T: Display> Display for Erasable<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}{}",
            if self.erased == Erased::Yes { "-" } else { "" },
            self.data
        )
    }
}

impl Display for ConstructorNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}", self.name)?;

        for arg in &self.args {
            write!(f, " {}", arg)?;
        }

        write!(f, ")")
    }
}

impl Display for AppNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}", self.fun)?;

        for arg in &self.args {
            write!(f, " {}", arg)?;
        }

        write!(f, ")")
    }
}

impl Display for AllNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(param) = &self.param {
            write!(f, "({param} : {})", self.typ)?;
        } else {
            write!(f, "{}", self.typ)?;
        }
        write!(f, " -> {}", self.body)
    }
}

impl Display for SigmaNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(param) = &self.param {
            write!(f, "[{param} : {}]", self.typ)?;
        } else {
            write!(f, "[{}]", self.typ)?;
        }
        write!(f, " -> {}", self.body)
    }
}

impl Display for LambdaNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(typ) = &self.typ {
            write!(f, "({} : {})", self.param, typ)?;
        } else {
            write!(f, "{}", self.param)?;
        }
        write!(f, " => {}", self.body)
    }
}

impl Display for LetNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "let {} = {}; {}", self.param, self.body, self.next)
    }
}

impl Display for AnnNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} :: {}", self.expr, self.typ)
    }
}

impl Display for BinaryNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({} {} {})", self.operator, self.left, self.right)
    }
}

impl Display for SttmKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use SttmKind::*;
        match self {
            Expr(expr, next) => write!(f, "{expr}; {next}"),
            Ask(name, val, next) => write!(f, "ask {name} = {val}; {next}"),
            Let(name, val, next) => write!(f, "let {name} = {val}; {next}"),
            Return(res) => write!(f, "return {res}"),
            RetExpr(res) => write!(f, "{res}"),
        }
    }
}

impl Display for DoNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "do {} {{{}}}", self.typ, self.sttm)
    }
}

impl Display for IfNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "if {} {{{}}} else {{{}}}",
            self.cond, self.r#if, self.r#else
        )
    }
}

impl Display for Case {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}{} => {}",
            self.constructor,
            Spaced(" ", &self.bindings),
            self.value
        )
    }
}

impl Display for MatchNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "match {} {}", self.typ, self.scrutinee)?;

        if let Some(value) = &self.value {
            write!(f, " = {value}")?;
        }

        if !self.with_vars.is_empty() {
            write!(f, "with ")?;
            for (var, typ) in &self.with_vars {
                if let Some(typ) = typ {
                    write!(f, "({var} : {typ}) ")?;
                } else {
                    write!(f, "{var} ")?;
                }
            }
        }

        write!(f, "{{")?;

        for case in &self.cases {
            write!(f, "{};", case)?;
        }

        write!(f, "}}")?;

        if let Some(motive) = &self.motive {
            write!(f, " : {}", motive)?;
        }

        Ok(())
    }
}

impl Display for OpenNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "open {} {}", self.type_name, self.var_name)?;
        if let Some(motive) = &self.motive {
            write!(f, " : {}", motive)?;
        }
        write!(f, "{}", self.next)
    }
}

impl Display for SubstNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "substitute {} in #{} into {}",
            self.name, self.redx, self.expr
        )
    }
}

impl Display for AccessNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "! ({}) {}{}",
            self.typ,
            self.expr,
            Spaced(" .", &self.fields)
        )?;
        match &self.operation {
            AccessOperation::Set(val) => write!(f, " = {val}"),
            AccessOperation::Mut(val) => write!(f, " @= {val}"),
            AccessOperation::Get => Ok(()),
        }
    }
}

impl Display for VarNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

impl Display for PairNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "$ {} {}", self.left, self.right)
    }
}

impl Display for ListNode {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}]", Intersperse(", ", &self.elements))
    }
}

impl Display for ExprKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ExprKind::Var(node) => write!(f, "{node}"),
            ExprKind::App(node) => write!(f, "({node})"),
            ExprKind::All(node) => write!(f, "({node})"),
            ExprKind::Sigma(node) => write!(f, "({node})"),
            ExprKind::Lambda(node) => write!(f, "({node})"),
            ExprKind::Let(node) => write!(f, "({node})"),
            ExprKind::Ann(node) => write!(f, "({node})"),
            ExprKind::Lit(node) => write!(f, "({node})"),
            ExprKind::Binary(node) => write!(f, "({node})"),
            ExprKind::Pair(node) => write!(f, "({node})"),
            ExprKind::Do(node) => write!(f, "({node})"),
            ExprKind::If(node) => write!(f, "({node})"),
            ExprKind::Match(node) => write!(f, "({node})"),
            ExprKind::Open(node) => write!(f, "({node})"),
            ExprKind::Subst(node) => write!(f, "({node})"),
            ExprKind::List(node) => write!(f, "{node}"),
            ExprKind::Access(node) => write!(f, "({node})"),
            ExprKind::Paren(node) => write!(f, "({node})"),
            ExprKind::Err => write!(f, "ERR"),
        }
    }
}

impl Display for OperatorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OperatorKind::Add => write!(f, "+"),
            OperatorKind::Sub => write!(f, "-"),
            OperatorKind::Mul => write!(f, "*"),
            OperatorKind::Div => write!(f, "/"),
            OperatorKind::Mod => write!(f, "%"),
            OperatorKind::And => write!(f, "&"),
            OperatorKind::Or => write!(f, "|"),
            OperatorKind::Xor => write!(f, "^"),
            OperatorKind::Shl => write!(f, ">>"),
            OperatorKind::Shr => write!(f, "<<"),
            OperatorKind::Ltn => write!(f, "<"),
            OperatorKind::Lte => write!(f, "<="),
            OperatorKind::Eql => write!(f, "=="),
            OperatorKind::Gte => write!(f, ">"),
            OperatorKind::Gtn => write!(f, ">="),
            OperatorKind::Neq => write!(f, "!="),
        }
    }
}

impl Display for ArgumentKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
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

impl Display for RuleRHS {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            RuleRHS::Impossible => write!(f, "impossible"),
            RuleRHS::Value(value) => write!(f, "= {value}"),
        }
    }
}

impl Display for Signature {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {}", self.name, Spaced(" ", &self.args))
    }
}

impl Display for Command {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "@{} {}", self.name, self.value)
    }
}

impl Display for ConstructorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}{}", self.name, Spaced(" ", &self.args))?;

        if let Some(typ) = &self.typ {
            write!(f, ": {}", typ)?;
        }

        Ok(())
    }
}

impl Display for SumDecl {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "type {}{}", self.name, Spaced(" ", &self.parameters))?;

        if !self.indices.is_empty() {
            write!(f, " ~{}", Spaced(" ", &self.indices))?;
        }

        write!(f, " {{{}", Spaced("\n", &self.constructors))?;
        write!(f, "\n}}")
    }
}

impl Display for FieldKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} : {}", self.name, self.typ)
    }
}

impl Display for RecordDecl {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "record {}{} {{",
            self.name,
            Spaced(" ", &self.parameters)
        )?;

        write!(f, "{}", Spaced("\n", &self.fields))?;
        write!(f, "\n}}")
    }
}

impl Display for TopLevel {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for doc in &self.docs {
            writeln!(f, "///{}", doc)?;
        }

        for attr in &self.attrs {
            writeln!(f, "{attr}")?;
        }

        writeln!(f, "{}", self.data)
    }
}

impl Display for Rule {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        writeln!(f, "{}{}{}", self.name, Spaced(" ", &self.pats), self.body)
    }
}

impl Display for Function {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.body)
    }
}

impl Display for TopLevelKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use TopLevelKind::*;
        match self {
            SumType(res) => write!(f, "{}", res),
            RecordType(res) => write!(f, "{}", res),
            Signature(res) => write!(f, "{}", res),
            Command(res) => write!(f, "{}", res),
            Rule(res) => write!(f, "{}", res),
            Function(res) => write!(f, "{}", res),
        }
    }
}

impl Display for PatKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PatKind::Var(var) => write!(f, "{var}"),
            PatKind::App(head, spine) => write!(f, "({head}{})", Spaced(" ", spine)),
            PatKind::U60(n) => write!(f, "{n}"),
            PatKind::U120(n) => write!(f, "{n}"),
            PatKind::F60(n) => write!(f, "{n}"),
            PatKind::Pair(p) => write!(f, "{p}"),
            PatKind::List(l) => write!(f, "{l}"),
            PatKind::Str(s) => write!(f, "\"{s}\""),
            PatKind::Char(c) => write!(f, "'{c}'"),
            PatKind::Hole => write!(f, "_"),
            PatKind::Absurd => write!(f, "(.)"),
            PatKind::Err => write!(f, "ERR"),
        }
    }
}

impl Display for Module {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", Spaced("\n", &self.declarations))
    }
}
