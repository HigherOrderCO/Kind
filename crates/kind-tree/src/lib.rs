use kind_span::{Symbol, NodeId, Identified};

pub enum AttributeStyle {
    String(String),
    Number(u64),
    Identifier(String)
}

pub struct Ident {
    pub symbol: Symbol,
    pub id: NodeId
}

pub struct QualifiedIdent {
    pub symbols: Vec<Symbol>,
    pub id: NodeId
}

pub struct Attribute {
    pub name: Symbol,
    pub value: Option<AttributeStyle>,
    pub arguments: Vec<AttributeStyle>,
}

pub enum Literal {
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
    NumF60(u64),
    // Naturals represented by u128
    Nat(u128),
    // A String literal
    String(String),
}

pub struct VarNode {
    name: Ident
}

pub enum Binding {
    Named { field: Ident, to: Ident, erased: bool },
    Unnamed { erased: bool },
}

pub struct ConstructorNode {
    name: QualifiedIdent,
    args: Vec<Binding>
}

pub struct AppBinding {
    erased: bool,
    data: Expr
}

pub struct AppNode {

}
pub struct AllNode {

}
pub struct SigmaNode {

}
pub struct LambdaNode {

}
pub struct LetNode {

}
pub struct AnnNode {

}
pub struct BinaryNode {

}
pub struct PairNode {

}
pub struct DoNode {

}
pub struct IfNode {

}
pub struct MatchNode {

}
pub struct OpenNode {

}
pub struct SubstNode {

}
pub struct ListNode {

}
pub struct AccessNode {

}

pub enum ExprKind {
    Var(VarNode),
    Constructor(ConstructorNode),
    App(AppNode),
    All(AllNode),
    Sigma(SigmaNode),
    Lambda(LambdaNode),
    Let(LetNode),
    Ann(AnnNode),
    Lit(Literal),
    Binary(BinaryNode),
    Pair(PairNode),
    Do(DoNode),
    If(IfNode),
    Match(MatchNode),
    Open(OpenNode),
    Subst(SubstNode),
    List(ListNode),
    Access(AccessNode),
    Hole,
}

pub type Expr = Identified<ExprKind>;

pub struct Constructor {}

pub struct RecordDecl {}

pub struct SumDecl {}

pub struct Function {}

pub enum TopLevel {
    SumType(SumDecl),
    RecordType(RecordDecl),
    Function(Function),
}

pub struct Module {}
