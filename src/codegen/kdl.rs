mod book;
pub mod passes;

use crate::book::name::Ident;
use crate::book::Book;
pub use crate::codegen::kdl::book::*;

use std::collections::{HashMap, HashSet};
use tiny_keccak::Hasher;

pub const KDL_NAME_LEN: usize = 12;

pub fn stringify_kdl_term(kdl_names: &HashMap<Ident, Ident>, term: &CompTerm) -> Result<String, String> {
    let term = match term {
        CompTerm::Var { name } => name.to_string(),
        CompTerm::Lam { name, body } => {
            let body = stringify_kdl_term(kdl_names, body)?;
            format!("@{} {}", name, body)
        }
        CompTerm::App { func, argm } => {
            let func = stringify_kdl_term(kdl_names, func)?;
            let argm = stringify_kdl_term(kdl_names, argm)?;
            format!("(!{} {})", func, argm)
        }
        CompTerm::Dup { nam0, nam1, expr, body } => {
            let expr = stringify_kdl_term(kdl_names, expr)?;
            let body = stringify_kdl_term(kdl_names, body)?;
            format!("dup {} {} = {};\n    {}", nam0, nam1, expr, body)
        }
        CompTerm::Let { name, expr, body } => {
            let expr = stringify_kdl_term(kdl_names, expr)?;
            let body = stringify_kdl_term(kdl_names, body)?;
            format!("let {} = {};\n    {}", name, expr, body)
        }
        CompTerm::Ctr { name, args } => {
            let kdl_name = kdl_names.get(name).unwrap_or_else(|| panic!("{}", name));
            let args = args.iter().map(|x| stringify_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
            let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
            format!("{{{}{}}}", kdl_name, args)
        }
        CompTerm::Fun { name, args } => {
            let kdl_name = kdl_names.get(name).unwrap_or_else(|| panic!("{}", name));
            let args = args.iter().map(|x| stringify_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
            let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
            format!("({}{})", kdl_name, args)
        }
        CompTerm::Num { numb } => {
            format!("#{}", numb)
        }
        CompTerm::Op2 { oper, val0, val1 } => {
            let val0 = stringify_kdl_term(kdl_names, val0)?;
            let val1 = stringify_kdl_term(kdl_names, val1)?;
            format!("({} {} {})", oper, val0, val1)
        }
        CompTerm::Nil => {
            return Err("Found nil term in compiled term while converting to kindelia".to_string());
        }
    };
    Ok(term)
}

pub fn stringify_kdl_rule(kdl_names: &HashMap<Ident, Ident>, rule: &CompRule) -> Result<String, String> {
    let name = &rule.name;
    let kdl_name = kdl_names.get(name).unwrap();
    let mut pats = vec![]; // stringified pattern args
    for pat in rule.pats.iter() {
        let pat = stringify_kdl_term(kdl_names, pat)?;
        pats.push(" ".to_string());
        pats.push(pat);
    }
    let body = stringify_kdl_term(kdl_names, &rule.body)?;
    let rule = format!("({}{}) =\n    {}", kdl_name, pats.join(""), body);
    Ok(rule)
}

pub fn stringify_kdl_entry(book: &Book, kdl_names: &HashMap<Ident, Ident>, comp_book: &CompBook, entry: &CompEntry) -> Result<String, String> {
    let kdl_name = kdl_names.get(&entry.name).unwrap();
    let args_names = entry.args.iter().map(|arg| format!(" {}", arg)).collect::<String>();
    // If this entry existed in the original kind code, add some annotations as comments
    let cmnt = if let Some(kind_entry) = book.entrs.get(&entry.name) {
        let args_typed = kind_entry
            .args
            .iter()
            .map(|arg| format!(" {}({}: {})", if arg.eras { "-" } else { "" }, arg.name, &arg.tipo))
            .collect::<String>();
        format!("// {}{} : {}\n", entry.name, args_typed, &kind_entry.tipo)
    } else {
        String::new()
    };
    // Entries with no rules become constructors
    // Entries with rules become functions
    let fun = if entry.rules.is_empty() {
        format!("ctr {{{}{}}}\n\n", kdl_name, args_names)
    } else {
        let mut rules = vec![];
        for rule in &entry.rules {
            rules.push(format!("\n  {}", stringify_kdl_rule(kdl_names, rule)?));
        }
        match entry.get_attribute("kdl_state") {
            // If the function has an initial state, compile the state together with it
            Some(attr) => {
                let state_fn_name = attr.value.unwrap();
                let state_fn = comp_book.entrs.get(&state_fn_name).ok_or(format!("Initial state function \"{}\" for function \"{}\" not found.", state_fn_name, entry.name))?;
                let state_term = state_fn.rules[0].body.clone();  // This is checked when validating the attributes
                let init_state = stringify_kdl_term(kdl_names, &*state_term)?;
                format!("fun ({}{}) {{{}\n}} with {{\n    {}\n}}\n\n", kdl_name, args_names, rules.join(""), init_state)
            }
            // Otherwise just compile the function as normal
            None => {
                format!("fun ({}{}) {{{}\n}}\n\n", kdl_name, args_names, rules.join(""))
            }
        }
    };
    let entry = cmnt + &fun;
    Ok(entry)
}

pub fn stringify_kdl_book(book: &Book, kdl_names: &HashMap<Ident, Ident>, comp_book: &CompBook) -> Result<String, String> {
    let mut lines = vec![];
    let mut run = String::new();
    let mut init_funs: HashSet<Ident> = HashSet::new(); // Functions that are the initial state to some other function
    for name in &comp_book.names {
        let entry = comp_book.entrs.get(name).unwrap();
        if let Some(attr) = entry.get_attribute("kdl_state") {
            init_funs.insert(attr.value.unwrap());
        }
    }
    for name in &comp_book.names {
        let entry = comp_book.entrs.get(name).unwrap();
        // Functions with attribute "kdl_erase" are not compiled
        // This is useful for not redefining things in the genesis block, or for creating aliases
        if entry.get_attribute("kdl_erase").is_some() {
            continue;
        }
        if entry.get_attribute("kdl_run").is_some() {
            let stmnt = format!("run {{\n    {}\n}}\n\n", stringify_kdl_term(kdl_names, &*entry.rules[0].body)?);
            run.push_str(&stmnt);
            continue;
        }
        // Initial state for functions is compiled by the function itself
        if init_funs.contains(name) {
            continue;
        }
        lines.push(stringify_kdl_entry(book, kdl_names, comp_book, entry)?);
    }
    Ok(lines.join("") + &run)
}

pub fn to_kdl_book(book: Book, namespace: &Option<String>) -> Result<String, String> {
    let book = passes::erase_funs(book)?;
    let comp_book = passes::erase_terms(&book)
                    .and_then(passes::inline)
                    .and_then(passes::remove_u120_opers)
                    .and_then(passes::convert_u120_uses)
                    .and_then(passes::flatten)
                    .and_then(passes::linearize_rules)?;
    let kdl_names = get_kdl_names(&comp_book, namespace)?;
    stringify_kdl_book(&book, &kdl_names, &comp_book)
}

// Utils
// -----

// Returns a map of kind names to kindelia names
// Returns an err if any of the names can't be converted
pub fn get_kdl_names(book: &CompBook, namespace: &Option<String>) -> Result<HashMap<Ident, Ident>, String> {
    // Fits a name to the max size allowed by kindelia.
    // If the name is too large, uses the hash of the name instead
    fn hash_shorten(name: &Ident, ns: &str) -> Ident {
        let max_fn_name = KDL_NAME_LEN - ns.len();
        let name = if name.len() > max_fn_name {
            let name_hash = keccak128(name.0.as_bytes());
            let name_hash = u128::from_le_bytes(name_hash);
            let name_hash = u128_to_kdl_name(name_hash);
            name_hash[..max_fn_name].to_string()
        } else {
            name.0.clone()
        };
        Ident(format!("{}{}", ns, name))
    }

    fn keccak128(data: &[u8]) -> [u8; 16] {
        let mut hasher = tiny_keccak::Keccak::v256();
        let mut output = [0u8; 16];
        hasher.update(data);
        hasher.finalize(&mut output);
        output
      }

    fn get_kdl_name(entry: &CompEntry, ns: &str) -> Result<Ident, String> {
        let kind_name = &entry.name;
        // If the entry uses a kindelia name, use it
        let kdln = if let Some(kdln_attr) = entry.get_attribute("kdl_name") {
            let kdln = kdln_attr.value.unwrap();
            if !kdln.0.chars().next().unwrap().is_uppercase() {
                let err = format!("Kindelia name \"{}\" doesn't start with an uppercase letter.", kdln);
                return Err(err);
            }
            if entry.orig {
                let max_len = KDL_NAME_LEN - ns.len();
                if kdln.len() > max_len {
                    let mut err = format!("Kindelia name \"{}\" for \"{}\" has more than {} characters.", kdln, kind_name, max_len);
                    if ns.len() > 0 {
                        err = format!("{} (Namespace \"{}\" has {})", err, ns, ns.len());
                    }
                    return Err(err);
                }
                Ident(format!("{}{}", ns, kdln))
            } else {
                // For entries created by the flattener, we shorten even the kindelia name
                hash_shorten(&kdln, ns)
            }
        }
        // Otherwise, try to fit the normal kind name
        else {
            let fixed_name = Ident(kind_name.0.replace('.', "_"));
            hash_shorten(&fixed_name, ns)
        };
        Ok(kdln)
    }

    fn encode_base64_u8(num: u8) -> char {
        match num {
            0..=9 => (num + b'0') as char,
            10..=35 => (num - 10 + b'A') as char,
            36..=61 => (num - 36 + b'a') as char,
            62.. => '_',
        }
    }

    fn u128_to_kdl_name(mut num: u128) -> String {
        let mut encoded = [0 as char; 12];
        for i in 0..12 {
            encoded[i] = encode_base64_u8((num & 0x3f) as u8);
            num >>= 6;
        }
        encoded.into_iter().collect()
    }

    let mut errors = Vec::new();
    let mut kdl_names = HashMap::new();
    let ns = namespace.as_ref().map_or(String::new(), |ns| format!("{}.", ns));
    for name in &book.names {
        let entry = book.entrs.get(name).unwrap();
        let kdln = get_kdl_name(entry, &ns);
        match kdln {
            Ok(kdln) => kdl_names.insert(name.clone(), kdln).map(|_| ()).unwrap_or(()),
            Err(err) => errors.push(err),
        }
    }

    if errors.is_empty() {
        Ok(kdl_names)
    } else {
        Err(errors.join("\n"))
    }
}
