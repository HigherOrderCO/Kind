use proc_macro::{self, TokenStream};
use proc_macro2::Span;
use proc_macro2::TokenStream as TknStream;
use quote::quote;
use syn::parse_quote;
use syn::spanned::Spanned;
use syn::Error;
use syn::Ident;
use syn::ItemTrait;
use syn::{parse_macro_input, PatIdent, Receiver};

#[derive(Debug)]
struct Method {
    name: syn::Ident,
    args: Vec<syn::FnArg>,
    memoizable: bool,
    meta_info: bool,
    ret: syn::ReturnType,
    meta_ret: syn::ReturnType,
}

#[derive(Debug)]
struct TraitPat {
    methods: Vec<Method>,
}

fn method_args(method: &syn::TraitItemMethod) -> syn::Result<Vec<syn::FnArg>> {
    if method.sig.inputs.is_empty() {
        return Err(Error::new(method.sig.ident.span(), "expected `&self`"));
    }

    match &method.sig.inputs[0] {
        syn::FnArg::Receiver(Receiver {
            mutability: None,
            self_token: _,
            reference: Some(_),
            ..
        }) => {}
        id => return Err(Error::new(id.span(), "expected `&self`")),
    }

    let mut iter = method.sig.inputs.iter();
    iter.next();

    Ok(iter.cloned().collect())
}

fn methods_to_pat(trait_item: &mut ItemTrait) -> syn::Result<TraitPat> {
    let mut pat = TraitPat { methods: Vec::new() };
    for item in &mut trait_item.items {
        match item {
            syn::TraitItem::Method(method) => {
                let mut memoizable = false;
                let mut meta_info = false;
                for attr in &method.attrs {
                    let span = attr.path.span();
                    match attr.path.get_ident() {
                        Some(path) => {
                            if path == &Ident::new("memoize", Span::call_site()) {
                                memoizable = true;
                            } else if path == &Ident::new("memoize_info", Span::call_site()) {
                                meta_info = true;
                                memoizable = true;
                            } else {
                                return Err(Error::new(span, "unrecognized query attribute"));
                            }
                        }
                        _ => return Err(Error::new(span, "invalid query attribute")),
                    }
                }
                method.attrs = Vec::new();
                let args = method_args(method)?;
                let name = method.sig.ident.clone();

                let old = method.sig.output.clone();

                if meta_info {
                    match &mut method.sig.output {
                        syn::ReturnType::Default => method.sig.output = parse_quote!(quote! { -> ((), bool) }),
                        syn::ReturnType::Type(_, ty) => *ty = Box::new(parse_quote!((#ty, bool))),
                    }
                }

                pat.methods.push(Method {
                    name,
                    args,
                    memoizable,
                    ret: old,
                    meta_info,
                    meta_ret: method.sig.output.clone(),
                })
            }
            _ => return Err(Error::new(trait_item.ident.span(), "can only process methods")),
        }
    }
    Ok(pat)
}

fn append_ident(ident: &syn::Ident, str: &str) -> syn::Ident {
    syn::Ident::new(&format!("{}{}", ident, str), ident.span())
}

fn mk_ident(ident: &str) -> syn::Ident {
    syn::Ident::new(ident, Span::call_site())
}

fn make_cache_struct(pat: &TraitPat, ident_cache: &syn::Ident) -> syn::Result<TknStream> {
    let mut defs = Vec::new();

    for Method { ret, memoizable, name, .. } in &pat.methods {
        if let syn::ReturnType::Type(_, ty) = ret {
            if *memoizable {
                    defs.push(quote! {
                        pub #name: std::sync::Arc<dashmap::DashMap<u64, #ty>>,
                    });
            }
        }
    }

    let struct_quoted = quote! {
        #[derive(Default)]
        pub struct #ident_cache {
            #(#defs)*
        }
    };

    Ok(struct_quoted)
}

fn make_provider_struct(pat: &TraitPat, ident_provider: &syn::Ident, ident_store: &syn::Ident) -> syn::Result<TknStream> {
    let mut fields = Vec::new();

    for Method { name, args, ret, .. } in &pat.methods {
        fields.push(quote! {
            pub #name: fn(&#ident_store, #(#args),*) #ret,
        });
    }

    let quoted = quote! {
        pub struct #ident_provider {
            #(#fields)*
        }
    };

    Ok(quoted)
}

fn make_storage_struct(pat: &TraitPat, ident_provider: &syn::Ident, ident_cache: &syn::Ident, ident_storage: &syn::Ident, conf: Option<syn::Path>) -> syn::Result<TknStream> {
    let mut match_fields = Vec::new();

    for i in 0..pat.methods.iter().filter(|e| e.memoizable).count() {
        let Method { name, .. } = &pat.methods[i];
        let u = i as u8;
        match_fields.push(quote! {
            #u => {self.cache.#name.remove(&hash);},
        });
    }

    let config = match &conf {
        Some(res) => quote! { config: #res },
        None => quote! {},
    };

    let conf_def = match conf {
        Some(_) => quote! { config },
        None => quote! {},
    };

    let res = quote! {
        #[derive(Clone)]
        pub struct #ident_storage {
            provider: std::sync::Arc<#ident_provider>,
            cache: std::sync::Arc<#ident_cache>,
            dep_graph: crate::core::graph::DepGraph,
            input_hash: u64,
            parent: Option<u64>,
            #config
        }

        impl #ident_storage {
            pub fn new(provider: std::sync::Arc<#ident_provider>, #config) -> #ident_storage {
                #ident_storage {
                    provider,
                    cache: Default::default(),
                    dep_graph: Default::default(),
                    input_hash: Default::default(),
                    parent: None,
                    #conf_def
                }
            }
        }

        use crate::core::store::Session;

        impl crate::core::store::Session for #ident_storage {
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

            fn dependency_graph(&self) -> crate::core::graph::DepGraph {
                self.dep_graph.clone()
            }
        }
    };

    Ok(res)
}

fn make_impl(pat: &TraitPat, ident: &syn::Ident, ident_storage: &syn::Ident) -> syn::Result<TknStream> {
    let mut impls = Vec::new();

    let mut counter = 0;
    for i in 0..pat.methods.len() {
        let mut new_args: Vec<PatIdent> = Vec::new();
        let Method {
            name,
            args,
            memoizable,
            ret,
            meta_info,
            meta_ret,
            ..
        } = &pat.methods[i];

        for arg in args {
            match arg {
                syn::FnArg::Typed(syn::PatType { pat, .. }) => match *pat.clone() {
                    syn::Pat::Ident(id) => new_args.push(id),
                    pat => return Err(Error::new(pat.span(), "pattern matching not supported yet")),
                },
                pat => return Err(Error::new(pat.span(), "cannot use self in this position")),
            }
        }

        let run_memoized = mk_ident("run_query_memoized");
        let run_flat = mk_ident("run_query_flat");

        let meta = if *meta_info {
            quote! {}
        } else {
            quote! { .0 }
        };

        if *memoizable {
            impls.push(quote! {
                fn #name(&self, #(#args),*) #meta_ret {
                    self.#run_memoized(fxhash::hash64(&(#i+1, #(&#new_args),*)), self.cache.#name.clone(), #counter as u8, |db| {
                        (db.provider.#name)(db, #(#new_args),*)
                    })#meta
                }
            });
            counter += 1;
        } else {
            impls.push(quote! {
                fn #name(&self, #(#args),*) #ret {
                    self.#run_flat(fxhash::hash64(&(#i+1, #(&#new_args),*)), |db| {
                        (db.provider.#name)(db, #(#new_args),*)
                    })
                }
            });
        }
    }

    Ok(quote! {
        impl #ident for #ident_storage {
            #(#impls)*
        }
    })
}

fn make_provider_strutures(ast: &mut ItemTrait, ident: &syn::Ident, attr_vec: Vec<syn::NestedMeta>) -> syn::Result<TknStream> {
    let cache = append_ident(ident, "Cache");
    let provider = append_ident(ident, "Provider");
    let storage = append_ident(ident, "Database");
    let trait_pat = methods_to_pat(ast)?;
    let attr = parse_config(attr_vec)?;

    let cache_struct = make_cache_struct(&trait_pat, &cache)?;
    let provider_struct = make_provider_struct(&trait_pat, &provider, &storage)?;
    let storage_struct = make_storage_struct(&trait_pat, &provider, &cache, &storage, attr)?;

    let impl_for_struct = make_impl(&trait_pat, ident, &storage)?;

    let res = quote! {
        #ast
        #cache_struct
        #provider_struct
        #storage_struct
        #impl_for_struct
    };

    Ok(res)
}

fn parse_config(ast: Vec<syn::NestedMeta>) -> syn::Result<Option<syn::Path>> {
    if ast.len() == 1 {
        let ast = &ast[0];
        match ast {
            syn::NestedMeta::Meta(meta) => match meta {
                syn::Meta::Path(path) => Ok(Some(path.clone())),
                _ => Err(Error::new(ast.span(), "cannot use type")),
            },
            syn::NestedMeta::Lit(_) => Err(Error::new(ast.span(), "cannot parse type")),
        }
    } else if ast.is_empty() {
        Ok(None)
    } else {
        Err(Error::new(Span::call_site(), "too many arguments for the attribute"))
    }
}

#[proc_macro_attribute]
pub fn make_provider(attr_inp: TokenStream, input: TokenStream) -> TokenStream {
    let mut ast: ItemTrait = parse_macro_input!(input);

    for attr in &ast.attrs {
        println!("{:?}", attr);
    }

    let ident = ast.ident.clone();
    make_provider_strutures(&mut ast, &ident, parse_macro_input!(attr_inp))
        .map_or_else(|x| x.into_compile_error(), |x| x)
        .into()
}
