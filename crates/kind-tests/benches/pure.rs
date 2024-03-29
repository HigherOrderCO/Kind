#![feature(test)]

extern crate test;
use std::{fs, path::PathBuf};

use driver::resolution;
use kind_driver::session::Session;
use kind_pass::{
    desugar, erasure,
    expand::{self, uses::expand_uses},
};
use test::Bencher;

use kind_driver as driver;

fn new_session() -> Session {
    let (rx, _) = std::sync::mpsc::channel();

    let root = PathBuf::from("./suite/lib").canonicalize().unwrap();

    Session::new(root, rx, false)
}

fn exp_paths() -> Vec<&'static str> {
    vec![
        "./suite/eval/Getters.kind2",
        "./suite/eval/Setters.kind2",
        "./suite/eval/DoNotation.kind2",
        "./suite/eval/User.kind2",
    ]
}

#[bench]
fn bench_exp_pure_parsing(b: &mut Bencher) {
    let paths = exp_paths();
    let paths: Vec<_> = paths
        .iter()
        .map(|x| fs::read_to_string(x).unwrap())
        .collect();

    b.iter(|| {
        paths
            .iter()
            .map(|input| {
                let session = new_session();
                kind_parser::parse_book(session.diagnostic_sender.clone(), 0, input)
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_use_expansion(b: &mut Bencher) {
    let paths = exp_paths();

    let mut paths: Vec<_> = paths
        .iter()
        .map(|path| {
            let input = fs::read_to_string(path).unwrap();
            let (rx, _) = std::sync::mpsc::channel();
            let (modu, failed) = kind_parser::parse_book(rx, 0, &input);
            assert!(!failed);
            modu
        })
        .collect();

    b.iter(|| {
        paths
            .iter_mut()
            .map(|module| {
                let (rx, _) = std::sync::mpsc::channel();
                expand_uses(module, rx);
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_derive_expansion(b: &mut Bencher) {
    let paths = exp_paths();

    let mut books: Vec<_> = paths
        .iter()
        .map(|path| {
            let input = fs::read_to_string(path).unwrap();
            let (rx, _) = std::sync::mpsc::channel();
            let (mut module, failed) = kind_parser::parse_book(rx.clone(), 0, &input);
            assert!(!failed);
            expand_uses(&mut module, rx);
            module
        })
        .collect();

    b.iter(|| {
        books
            .iter_mut()
            .map(|module| {
                let (rx, tx) = std::sync::mpsc::channel();
                expand::expand_module(rx, module);
                assert!(tx.iter().collect::<Vec<_>>().is_empty())
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_check_unbound(b: &mut Bencher) {
    let paths = exp_paths();
    let mut books: Vec<_> = paths
        .iter()
        .map(|path| {
            let mut session = new_session();
            let book = resolution::new_book_from_entry_file(&mut session, &path.into()).unwrap();
            (session, book)
        })
        .collect();

    b.iter(|| {
        books
            .iter_mut()
            .map(|(session, book)| {
                let result = resolution::check_unbounds(session, book);
                assert!(result.is_ok());
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_desugar(b: &mut Bencher) {
    let paths = exp_paths();
    let mut books: Vec<_> = paths
        .iter()
        .map(|path| {
            let mut session = new_session();
            let mut book = resolution::new_book_from_entry_file(&mut session, &path.into()).unwrap();
            let result = resolution::check_unbounds(&mut session, &mut book);
            assert!(result.is_ok());
            (session, book)
        })
        .collect();

    b.iter(|| {
        books
            .iter_mut()
            .map(|(session, book)| {
                desugar::desugar_book(session.diagnostic_sender.clone(), book).unwrap()
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_erase(b: &mut Bencher) {
    let paths = exp_paths();

    let books: Vec<_> = paths
        .iter()
        .map(|path| {
            let mut session = new_session();
            let mut book = resolution::new_book_from_entry_file(&mut session, &path.into()).unwrap();
            let result = resolution::check_unbounds(&mut session, &mut book);
            let book = desugar::desugar_book(session.diagnostic_sender.clone(), &book).unwrap();
            assert!(result.is_ok());

            (session, book)
        })
        .collect();

    b.iter(|| {
        books
            .iter()
            .map(|(session, book)| {
                erasure::erase_book(
                    book,
                    session.diagnostic_sender.clone(),
                    vec!["Main".to_string()],
                )
                .unwrap();
            })
            .count()
    })
}

#[bench]
fn bench_exp_pure_to_hvm(b: &mut Bencher) {
    let paths = exp_paths();

    let books: Vec<_> = paths
        .iter()
        .map(|path| {
            let mut session = new_session();
            let mut book = resolution::new_book_from_entry_file(&mut session, &path.into()).unwrap();
            let result = resolution::check_unbounds(&mut session, &mut book);
            let book = desugar::desugar_book(session.diagnostic_sender.clone(), &book).unwrap();
            assert!(result.is_ok());

            let book = erasure::erase_book(
                &book,
                session.diagnostic_sender.clone(),
                vec!["Main".to_string()],
            )
            .unwrap();

            (session, book)
        })
        .collect();

    b.iter(move || {
        books
            .iter()
            .map(move |(_, book)| kind_target_hvm::compile_book(book.to_owned(), false))
            .count()
    })
}

#[bench]
fn bench_exp_pure_gen_checker(b: &mut Bencher) {
    let paths = exp_paths();

    let books: Vec<_> = paths
        .iter()
        .map(|path| {
            let mut session = new_session();
            let mut book = resolution::new_book_from_entry_file(&mut session, &path.into()).unwrap();
            let result = resolution::check_unbounds(&mut session, &mut book);
            let book = desugar::desugar_book(session.diagnostic_sender.clone(), &book).unwrap();
            assert!(result.is_ok());

            (session, book)
        })
        .collect();

    b.iter(move || {
        books
            .iter()
            .map(move |(_, book)| {
                kind_checker::gen_checker(book, true, book.names.keys().cloned().collect())
            })
            .count()
    })
}
