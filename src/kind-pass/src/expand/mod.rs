use fxhash::FxHashMap;
use kind_derive::matching::derive_match;
use kind_derive::open::derive_open;
use kind_tree::concrete::{
    self, expr::Expr, Argument, Binding, Book, Entry, ExprKind, Literal, RecordDecl, SumTypeDecl,
    Telescope, TopLevel, EntryMeta,
};
/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.
pub mod uses;

pub fn expand_record_type(book: &mut FxHashMap<String, (Entry, EntryMeta)>, rec_type: &RecordDecl) {
    let type_constructor = Entry {
        name: rec_type.name.clone(),
        args: rec_type.parameters.clone(),
        docs: rec_type.docs.clone(),
        typ: Box::new(Expr {
            data: ExprKind::Lit(Literal::Type),
            range: rec_type.name.range,
        }),
        rules: Vec::new(),
        range: rec_type.name.range,
        attrs: rec_type.attrs.clone(),
    };

    book.insert(rec_type.name.to_string(), (type_constructor, rec_type.extract_book_info()));

    let irrelevant_params = rec_type.parameters.map(|x| x.to_implicit());

    let args = irrelevant_params
        .iter()
        .map(|x| {
            Binding::Positional(Box::new(Expr {
                data: ExprKind::Var(x.name.clone()),
                range: x.range,
            }))
        })
        .collect::<Vec<Binding>>();

    let typ = Box::new(Expr {
        data: ExprKind::Constr(rec_type.name.clone(), args),
        range: rec_type.name.range,
    });

    let cons_ident = rec_type.name.add_segment(rec_type.constructor.to_str());

    let data_constructor = Entry {
        name: cons_ident.clone(),
        args: irrelevant_params.extend(&Telescope::new(rec_type.fields.clone()).map(
            |(ident, _, ty)| Argument {
                hidden: false,
                erased: false,
                name: ident.clone(),
                typ: Some(ty.clone()),
                range: ident.range,
            },
        )),
        typ,
        rules: Vec::new(),
        range: rec_type.constructor.range,
        attrs: Vec::new(),
        docs: vec![],
    };

    book.insert(cons_ident.to_string(), (data_constructor, rec_type.extract_book_info_of_constructor()));
}

pub fn expand_sum_type(book: &mut FxHashMap<String, (Entry, EntryMeta)>, sum_type: &SumTypeDecl) {
    let params = sum_type.parameters.clone();
    let indices = sum_type.indices.clone();

    let type_constructor = Entry {
        name: sum_type.name.clone(),
        args: sum_type.parameters.extend(&sum_type.indices),
        docs: sum_type.docs.clone(),
        typ: Box::new(Expr {
            data: ExprKind::Lit(Literal::Type),
            range: sum_type.name.range,
        }),
        rules: Vec::new(),
        range: sum_type.name.range,
        attrs: sum_type.attrs.clone(),
    };

    let extracted = sum_type.extract_book_info();
    book.insert(sum_type.name.to_string(), (type_constructor, extracted));

    let irrelevant_params = params.map(|x| x.to_implicit());
    let irelevant_indices = indices.map(|x| x.to_implicit());

    for cons in &sum_type.constructors {
        let cons_ident = sum_type.name.add_segment(cons.name.to_str());

        let pre_indices = if cons.typ.is_none() {
            irelevant_indices.clone()
        } else {
            Telescope::new(vec![])
        };

        let typ = cons.typ.clone().unwrap_or_else(|| {
            let args = params.extend(&pre_indices).map(|x| {
                concrete::Binding::Positional(Box::new(Expr {
                    data: ExprKind::Var(x.name.clone()),
                    range: x.range,
                }))
            });

            Box::new(Expr {
                data: ExprKind::Constr(sum_type.name.clone(), args.to_vec()),
                range: sum_type.name.range,
            })
        });

        let data_constructor = Entry {
            name: cons_ident.clone(),
            args: irrelevant_params.extend(&pre_indices).extend(&cons.args),
            typ,
            rules: Vec::new(),
            attrs: Vec::new(),
            docs: vec![],
            range: cons_ident.range,
        };

        let book_info = cons.extract_book_info(&sum_type);
        book.insert(cons_ident.to_string(), (data_constructor, book_info));
    }
}

pub fn expand_book(book: &mut Book) {
    let mut entries = FxHashMap::default();
    for entry in book.entries.values() {
        match entry {
            TopLevel::SumType(sum) => {
                let res = derive_match(sum.name.range, sum);
                let info = res.extract_book_info();
                entries.insert(res.name.to_string(), (res, info));
            }
            TopLevel::RecordType(rec) => {
                let res = derive_open(rec.name.range, rec);
                let info = res.extract_book_info();
                entries.insert(res.name.to_string(), (res, info));
            }
            TopLevel::Entry(_) => (),
        }
    }
    for (name, (tl, count)) in entries {
        book.count.insert(name.clone(), count);
        book.names.insert(name.clone().to_string(), tl.name.clone());
        book.entries.insert(name.clone(), TopLevel::Entry(tl));
    }
}
