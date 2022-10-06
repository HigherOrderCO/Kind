mod book;

use crate::book::name::Ident;
use crate::book::Book;
pub use crate::codegen::kdl::book::*;

use rand::Rng;
use std::collections::{HashMap, HashSet};

pub const KDL_NAME_LEN: usize = 12;

pub fn to_kdl_term(kdl_names: &HashMap<Ident, Ident>, term: &CompTerm) -> Result<String, String> {
    let term = match term {
        CompTerm::Var { name } => name.to_string(),
        CompTerm::Lam { name, body } => {
            let body = to_kdl_term(kdl_names, body)?;
            format!("@{} {}", name, body)
        }
        CompTerm::App { func, argm } => {
            let func = to_kdl_term(kdl_names, func)?;
            let argm = to_kdl_term(kdl_names, argm)?;
            format!("({} {})", func, argm)
        }
        CompTerm::Dup { nam0, nam1, expr, body } => {
            let expr = to_kdl_term(kdl_names, expr)?;
            let body = to_kdl_term(kdl_names, body)?;
            format!("dup {} {} = {}; {}", nam0, nam1, expr, body)
        }
        CompTerm::Let { name, expr, body } => {
            let expr = to_kdl_term(kdl_names, expr)?;
            let body = to_kdl_term(kdl_names, body)?;
            format!("let {} = {}; {}", name, expr, body)
        }
        CompTerm::Ctr { name, args } => {
            let kdl_name = kdl_names.get(name).unwrap_or_else(|| panic!("{}", name));
            let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
            let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
            format!("{{{}{}}}", kdl_name, args)
        }
        CompTerm::Fun { name, args } => {
            let kdl_name = kdl_names.get(name).unwrap_or_else(|| panic!("{}", name));
            let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
            let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
            format!("({}{})", kdl_name, args)
        }
        CompTerm::Num { numb } => {
            format!("#{}", numb)
        }
        CompTerm::Op2 { oper, val0, val1 } => {
            let val0 = to_kdl_term(kdl_names, val0)?;
            let val1 = to_kdl_term(kdl_names, val1)?;
            format!("({} {} {})", oper, val0, val1)
        }
        CompTerm::Nil => {
            return Err("Found nil term in compiled term while converting to kindelia".to_string());
        }
    };
    Ok(term)
}

pub fn to_kdl_rule(kdl_names: &HashMap<Ident, Ident>, rule: &CompRule) -> Result<String, String> {
    let name = &rule.name;
    let kdl_name = kdl_names.get(name).unwrap();
    let mut pats = vec![]; // stringified pattern args
    for pat in rule.pats.iter() {
        let pat = to_kdl_term(kdl_names, pat)?;
        pats.push(" ".to_string());
        pats.push(pat);
    }
    let body = to_kdl_term(kdl_names, &rule.body)?;
    let rule = format!("({}{}) = {}", kdl_name, pats.join(""), body);
    Ok(rule)
}

pub fn to_kdl_entry(book: &Book, kdl_names: &HashMap<Ident, Ident>, comp_book: &CompBook, entry: &CompEntry) -> Result<String, String> {
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
            rules.push(format!("\n  {}", to_kdl_rule(kdl_names, rule)?));
        }
        match entry.get_attribute("kdl_state") {
            // If the function has an initial state, compile the state together with it
            Some(attr) => {
                let state_fn_name = attr.value.unwrap();
                let state_fn = comp_book.entrs.get(&state_fn_name).ok_or(format!("Initial state function \"{}\" for function \"{}\" not found.", state_fn_name, entry.name))?;
                let state_term = state_fn.rules[0].body.clone();  // This is checked when validating the attributes
                let init_state = to_kdl_term(kdl_names, &*state_term)?;
                format!("fun ({}{}) {{{}\n}} with {{\n  {}\n}}\n\n", kdl_name, args_names, rules.join(""), init_state)
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

pub fn to_kdl_book(book: &Book, kdl_names: &HashMap<Ident, Ident>, comp_book: &CompBook) -> Result<String, String> {
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
            let stmnt = format!("run {{\n  {}\n}}\n\n", to_kdl_term(kdl_names, &*entry.rules[0].body)?);
            run.push_str(&stmnt);
            continue;
        }
        // Initial state for functions is compiled by the function itself
        if init_funs.contains(name) {
            continue;
        }
        lines.push(to_kdl_entry(book, kdl_names, comp_book, entry)?);
    }
    Ok(lines.join("") + &run)
}

// Utils
// -----

// Returns a map of kind names to kindelia names
// Returns an err if any of the names can't be converted
pub fn get_kdl_names(book: &CompBook, namespace: &Option<String>) -> Result<HashMap<Ident, Ident>, String> {
    // Fits a name to the max size allowed by kindelia.
    // If the name is too large, truncates and replaces the last characters by random chars.
    fn rand_shorten(name: &Ident, ns: &str) -> Ident {
        let max_fn_name = KDL_NAME_LEN - ns.len();
        // If the name doesn't fit, truncate and insert some random characters at the end
        let name = if name.len() > max_fn_name {
            let n_rnd_chrs = usize::min(3, max_fn_name);
            let name_cut = name.0[..max_fn_name - n_rnd_chrs].to_string();
            let mut rng = rand::thread_rng();
            let rnd_chrs = (0..n_rnd_chrs).map(|_| rng.gen_range(0..63)).map(encode_base64).collect::<String>();
            Ident(format!("{}{}", name_cut, rnd_chrs))
        } else {
            name.clone()
        };
        Ident(format!("{}{}", ns, name))
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
                rand_shorten(&kdln, ns)
            }
        }
        // Otherwise, try to fit the normal kind name
        else {
            let fixed_name = Ident(kind_name.0.replace('.', "_"));
            rand_shorten(&fixed_name, ns)
        };
        Ok(kdln)
    }

    fn encode_base64(num: u8) -> char {
        match num {
            0..=9 => (num + b'0') as char,
            10..=35 => (num - 10 + b'A') as char,
            36..=61 => (num - 36 + b'a') as char,
            62.. => '_',
        }
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
