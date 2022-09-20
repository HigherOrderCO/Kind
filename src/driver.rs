mod loader;

use crate::driver::loader::{load, file};
use crate::checker::to_checker_book;
use crate::parser::new_type;
use crate::book::new_type::Derived;
use crate::book::name::Ident;
use crate::book::Book;
use crate::codegen;

const CHECKER_HVM: &str = include_str!("checker.hvm");

pub struct RunResult {
    output: String,
    rewrites: u64,
}

pub fn readback_string(rt: &hvm::Runtime, host: u64) -> String {
    let str_cons = rt.get_id("String.cons");
    let str_nil = rt.get_id("String.nil");
    let mut term = rt.at(host);
    let mut text = String::new();
    loop {
        if hvm::get_tag(term) == hvm::CTR {
            let fid = hvm::get_ext(term);
            if fid == str_cons {
                let head = rt.at(hvm::get_loc(term, 0));
                let tail = rt.at(hvm::get_loc(term, 1));
                if hvm::get_tag(head) == hvm::NUM {
                    text.push(std::char::from_u32(hvm::get_num(head) as u32).unwrap_or('?'));
                    term = tail;
                    continue;
                }
            }
            if fid == str_nil {
                break;
            }
        }
        panic!("Invalid output: {} {}", hvm::get_tag(term), rt.show(host));
    }

    text
}

fn inject_highlights(file: &[File], target: &str) -> String {
    let mut code = String::new();
    let mut cout = target;
    // Replaces file ids by names
    loop {
        let mut injected = false;
        if let (Some(init_file_index), Some(last_file_index)) = (cout.find("{{#F"), cout.find("F#}}")) {
            let file_text = &cout[init_file_index + 4..last_file_index];
            let file_numb = file_text.parse::<u64>().unwrap() as usize;
            code.push_str(&cout[0..init_file_index]);
            code.push_str(&file[file_numb].path);
            cout = &cout[last_file_index + 4..];
            injected = true;
        }
        if let (Some(init_range_index), Some(last_range_index)) = (cout.find("{{#R"), cout.find("R#}}")) {
            let range_text = &cout[init_range_index + 4..last_range_index];
            let range_text = range_text.split(':').map(|x| x.parse::<u64>().unwrap()).collect::<Vec<u64>>();
            let range_file = range_text[0] as usize;
            let range_init = range_text[1] as usize;
            let range_last = range_text[2] as usize;
            code.push_str(&cout[0..init_range_index]);
            code.push_str(&highlight_error::highlight_error(range_init, range_last, &file[range_file].code));
            cout = &cout[last_range_index + 4..];
            injected = true;
        }
        if !injected {
            break;
        }
    }
    code.push_str(cout);
    code
}

// Generates a .hvm checker for a Book
pub fn gen_checker(book: &Book) -> String {
    // Compile the Kind2 file to HVM checker
    let base_check_code = to_checker_book(book);
    let mut check_code = CHECKER_HVM.to_string();
    check_code.push_str(&base_check_code);
    check_code
}

pub fn run_with_hvm(code: &str, main: &str, read_string: bool) -> Result<RunResult, String> {
    let mut rt = hvm::Runtime::from_code(code)?;
    let main = rt.alloc_code(main)?;
    rt.run_io(main);
    rt.normalize(main);
    Ok(RunResult {
        output: if read_string { readback_string(&rt, main) } else { rt.show(main) },
        rewrites: rt.get_rewrites(),
    })
}

pub fn cmd_to_hvm(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    let result = codegen::hvm::to_hvm_book(&loaded.book);
    print!("{}", result);
    Ok(())
}

pub fn cmd_show(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    println!("{}", loaded.book);
    Ok(())
}

pub fn cmd_gen_checker(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    let gen_path = format!("{}.hvm", path.replace(".kind2", ".check"));
    println!("Generated '{}'.", gen_path);
    std::fs::write(gen_path, gen_checker(&loaded.book)).ok();
    Ok(())
}

pub fn cmd_derive(path: &str) -> Result<(), String> {
    let newcode = match std::fs::read_to_string(&path) {
        Err(_) => {
            return Err(format!("File not found: '{}'.", path));
        }
        Ok(code) => code,
    };
    let newtype = match new_type::read_newtype(&newcode) {
        Err(err) => {
            return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err));
        }
        Ok(book) => book,
    };
    fn save_derived(path: &str, derived: &Derived) {
        let dir = std::path::Path::new(&derived.path.0);
        let txt = format!("// Automatically derived from {}\n{}", path, derived.entr);
        println!("\x1b[4m\x1b[1mDerived '{}':\x1b[0m", derived.path);
        println!("{}\n", txt);
        std::fs::create_dir_all(dir.parent().unwrap()).unwrap();
        std::fs::write(dir, txt).ok();
    }
    save_derived(path, &new_type::derive_type(&newtype));
    for i in 0..newtype.ctrs.len() {
        save_derived(path, &new_type::derive_ctr(&newtype, i));
    }
    save_derived(path, &new_type::derive_match(&newtype));
    Ok(())
}

pub fn cmd_check_all(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    let result = run_with_hvm(&gen_checker(&loaded.book), "Kind.API.check_all", true)?;
    print!("{}", inject_highlights(&loaded.file, &result.output));
    println!("Rewrites: {}", result.rewrites);
    Ok(())
}

// Evaluates Main on Kind2
pub fn cmd_eval_main(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    if loaded.book.entrs.contains_key(&Ident("Main".to_string())) {
        let result = run_with_hvm(&gen_checker(&loaded.book), "Kind.API.eval_main", true)?;
        print!("{}", result.output);
        println!("Rewrites: {}", result.rewrites);
        Ok(())
    } else {
        Err("Main not found.".to_string())
    }
}

pub fn cmd_run_main(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    if loaded.book.entrs.contains_key(&Ident("Main".to_string())) {
        let result = codegen::hvm::to_hvm_book(&loaded.book);
        let result = run_with_hvm(&result, "Main", false)?;
        println!("{}", result.output);
        println!("Rewrites: {}", result.rewrites);
        Ok(())
    } else {
        Err("Main not found.".to_string())
    }
}

pub fn cmd_to_kdl(path: &str) -> Result<(), String> {
    let loaded = load(path)?;
    let comp_book = codegen::kdl::compile_book(&loaded.book)?;
    let kdl_names = codegen::kdl::get_kdl_names(&comp_book)?;
    let result = codegen::kdl::to_kdl_book(&loaded.book, &kdl_names, &comp_book)?;
    print!("{}", result);
    Ok(())
}
