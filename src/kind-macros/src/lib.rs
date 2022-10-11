use proc_macro::{self, TokenStream};
use quote::quote;
use syn::ItemTrait;
use syn::{parse_macro_input, PatIdent, Receiver};
use syn::{Error};

#[derive(Debug)]
struct TraitPat {
    methods: Vec<(syn::Ident, Vec<syn::FnArg>, syn::ReturnType)>,
}

fn methods_to_pat(trait_item: &ItemTrait) -> syn::Result<TraitPat> {
    let mut pat = TraitPat { methods: Vec::new() };
    for item in &trait_item.items {
        match item {
            syn::TraitItem::Method(method) => {
                if method.sig.inputs.is_empty() {
                    return Err(Error::new(method.sig.ident.span(), "expected `&self`"));
                }
                match method.sig.inputs[0] {
                    syn::FnArg::Receiver(Receiver {
                        mutability: None,
                        self_token: _,
                        reference: Some(_),
                        ..
                    }) => {}
                    _ => return Err(Error::new(method.sig.ident.span(), "expected `&self`")),
                }
                let mut method_args = Vec::new();
                for i in 1..method.sig.inputs.len() {
                    method_args.push(method.sig.inputs[i].clone())
                }
                let name = method.sig.ident.clone();
                pat.methods.push((name, method_args, method.sig.output.clone()))
            }
            _ => return Err(Error::new(trait_item.ident.span(), "can only process methods")),
        }
    }
    Ok(pat)
}

#[proc_macro_attribute]
pub fn make_provider(_attr: TokenStream, input: TokenStream) -> TokenStream {
    let mut ast: ItemTrait = parse_macro_input!(input);

    let cache = syn::Ident::new(&format!("{}Cache", ast.ident), ast.ident.span());
    let provider = syn::Ident::new(&format!("{}Provider", ast.ident), ast.ident.span());
    let store = syn::Ident::new(&format!("{}Database", ast.ident), ast.ident.span());
    let ident = ast.ident.clone();

    let pat = match methods_to_pat(&ast) {
        Ok(res) => res,
        Err(err) => return err.to_compile_error().into(),
    };

    let mut defs = Vec::new();

    for (ident, _, ret) in &pat.methods {
        match ret {
            syn::ReturnType::Type(_, ty) => {
                defs.push(quote! {
                    pub #ident: std::sync::Arc<dashmap::DashMap<u64, #ty>>,
                });
            }
            _ => (),
        }
    }

    let mut fields = Vec::new();

    for (ident, args, ret) in &pat.methods {
        fields.push(quote! {
            pub #ident: fn(&#store, #(#args),*) #ret,
        });
    }

    let mut impls = Vec::new();

    for i in 0..pat.methods.len() {
        let mut new_args: Vec<PatIdent> = Vec::new();
        let (ident, args, ret) = &pat.methods[i];

        for arg in args {
            match arg {
                syn::FnArg::Typed(syn::PatType { pat, .. }) => match *pat.clone() {
                    syn::Pat::Ident(id) => new_args.push(id),
                    _ => return quote! {compile_error!("pattern type not supported yet"); }.into(),
                },
                _ => return quote! {compile_error!("cannot use &self in the middle of parameters yet"); }.into(),
            }
        }

        impls.push(quote! {
            fn #ident(&self, #(#args),*) #ret {
                self.run_query((#(#new_args)* as u64), self.cache.#ident.clone(), #i as u8, |db| {
                    (db.provider.#ident)(db, #(#new_args),*)
                })
            }
        });
    }

    for entry in &mut ast.items {
        match entry {
            syn::TraitItem::Method(met) => {
                met.attrs = Vec::new();
            }
            _ => (),
        }
    }

    let mut match_fields = Vec::new();

    for i in 0..pat.methods.len() {
        let (ident, _, _) = &pat.methods[i];
        let u = i as u8;
        match_fields.push(quote! {
            #u => {self.cache.#ident.remove(&hash);},
        });
    }

    quote! {
        #ast

        #[derive(Default)]
        pub struct #cache {
            #(#defs)*
        }

        pub struct #provider {
            #(#fields)*
        }

        #[derive(Clone)]
        pub struct #store {
            provider: std::sync::Arc<#provider>,
            cache: std::sync::Arc<#cache>,
            dep_graph: crate::graph::DepGraph,
            input_hash: u64,
            parent: Option<u64>
        }

        impl #store {
            pub fn new(provider: std::sync::Arc<#provider>) -> #store {
                #store {
                    provider,
                    cache: Default::default(),
                    dep_graph: Default::default(),
                    input_hash: Default::default(),
                    parent: None,
                }
            }
        }

        impl crate::store::Session for #store {
            fn delete_from_cache(&self, hash: u64, db_idx: u8) {
                match db_idx {
                    #(#match_fields)*
                    _ => panic!("Do not use it directly"),
                }
            }

            fn get_parent(&self) -> Option<u64> {
                self.parent.clone()
            }

            fn set_parent(&mut self, hash: u64) {
                self.parent = Some(hash);
            }

            fn dependency_graph(&self) -> crate::graph::DepGraph {
                self.dep_graph.clone()
            }
        }

        impl #ident for #store {
            #(#impls)*
        }
    }
    .into()
}
