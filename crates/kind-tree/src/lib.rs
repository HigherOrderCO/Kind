use kind_span::Spanned;

pub struct Symbol(pub usize);

pub struct Attribute {
    pub name: Symbol
}

pub enum ExprKind {
    
}

pub type Expr = Spanned<ExprKind>;

pub struct Constructor {

}

pub struct RecordDecl {

}

pub struct SumDecl {

}

pub struct Entry {

}

pub enum TopLevel {
    SumType(SumDecl),
    RecordType(RecordDecl),
    Entry(Entry)
}

pub struct Module {

}