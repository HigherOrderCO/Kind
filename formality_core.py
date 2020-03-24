# Term
# ====

def Var(name):
    return {"ctor": "Var", "name": name}

def Typ():
    return {"ctor": "Typ"}

def All(name, bind, body, eras):
    return {"ctor": "All", "name": name, "bind": bind, "body": body, "eras": eras}

def Lam(name, body, eras):
    return {"ctor": "Lam", "name": name, "body": body, "eras": eras}

def App(func, argm, eras):
    return {"ctor": "App", "func": func, "argm": argm, "eras": eras}

def Slf(name, type):
    return {"ctor": "Slf", "name": name, "type": type}

def Ins(type, term):
    return {"ctor": "Slf", "type": type, "term": term}

def Eli(term):
    return {"ctor": "Eli", "term": term}

def Ann(term, type, done):
    return {"ctor": "Typ", "term": term, "type": type, "done": done}

# Module
# ======

def Def(name, type, term, defs):
    return {"ctor": "Def", "name": name, "type": type, "term": term, "defs": defs}

def Eof():
    return {"ctor": "Eof"}

# Parse
# =====

# Is this a space character?
def is_space(val):
    return val == " " or val == "\t" or val == "\n"

# Is this a name-valid character?
def is_name(val):
    val = ord(val)
    return ((val >= 48 and val < 58)   # 0-9
        or  (val >= 65 and val < 91)   # A-Z
        or  (val >= 95 and val < 96)   # _
        or  (val >= 97 and val < 123)) # a-z

# Returns the first function that doesn't raise, or None
def first_valid(fns):
    for [fn, args] in fns:
        try:
            return fn(*args)
        except:
            continue
    return None

# Drop characters while a condition is met.
def drop_while(cond, code, indx):
    while indx < len(code) and cond(code[indx]):
        indx += 1
    return indx

# Drop spaces
def space(code, indx):
    return drop_while(is_space, code, indx)

# Drops spaces and parses an exact string
def parse_str(str, code, indx):
    if len(str) == 0:
        return [indx, str]
    elif indx < len(code) and code[indx] == str[0]:
        return parse_str(str[1:], code, indx+1)
    else:
        raise RuntimeError()

# Parses an optional character
def parse_opt(val, code, indx):
    if code[indx] == val:
        return [indx + 1, True]
    else:
        return [indx, False]

# Parses a valid name, non-empty
def parse_nam(code, indx, size = 0):
    if indx < len(code):
        val = code[indx]
        if is_name(val):
            [indx, name] = parse_nam(code, indx + 1, size + 1)
            return [indx, val + name]
        else:
            return [indx, ""]
    elif len(code) > 0:
        return [indx, ""]
    else:
        raise

# Parses a parenthesis, `(<term>)`
def parse_par(code, indx):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, term] = parse_trm(code, indx)
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, term]

# Parses a dependent function type, `(<name> : <term>) => <term>`
def parse_all(code, indx):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str(":", code, space(code, indx))
    [indx, bind] = parse_trm(code, indx)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("->", code, space(code, indx))
    [indx, body] = parse_trm(code, indx)
    return [indx, All(name, bind, body, eras)];

# Parses a dependent function value, `(<name>) => <term>`
def parse_lam(code, indx):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("=>", code, space(code, indx))
    [indx, body] = parse_trm(code, indx)
    return [indx, Lam(name, body, eras)]

# Parses the type of types, `Type`
def parse_typ(code, indx):
    [indx, skip] = parse_str("Type", code, space(code, indx))
    return [indx, Typ()]

# Parses variables, `<name>`
def parse_var(code, indx):
    [indx, name] = parse_nam(code, space(code, indx))
    return [indx, Var(name)]

# Parses a self type, `#{<name>} <term>`
def parse_slf(code, indx):
    [indx, skip] = parse_str("#{", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, type] = parse_trm(code, indx)
    return [indx, Slf(name, type)]

# Parses a self instantiation, `#inst{<term>}`
def parse_ins(code, indx):
    [indx, skip] = parse_str("#inst{", code, space(code, indx))
    [indx, type] = parse_trm(code, indx)
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, term] = parse_trm(code, indx)
    return [indx, Ins(type, term)]

# Parses a self elimination, `#elim{<term>}`
def parse_eli(code, indx):
    [indx, skip] = parse_str("#elim{", code, space(code, indx))
    [indx, term] = parse_trm(code, indx)
    [indx, skip] = parse_str("}", code, space(code, indx))
    return [indx, Eli(term)]

# Parses an application, `<term>(<term>)`
def parse_app(code, indx, func):
    [indx, skip] = parse_str("(", code, indx)
    [indx, argm] = parse_trm(code, indx)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, App(func, argm, eras)]

# Parses an annotation, `<term> :: <term>`
def parse_ann(code, indx, term):
    [indx, skip] = parse_str("::", code, space(code, indx))
    [indx, type] = parse_trm(code, indx)
    return [indx, Ann(term, type, False)]

# Parses a term
def parse_trm(code, indx):
    # Parses the base term, trying each variant once
    base_parse = first_valid([
        [parse_all, [code, indx]],
        [parse_lam, [code, indx]],
        [parse_par, [code, indx]],
        [parse_typ, [code, indx]],
        [parse_slf, [code, indx]],
        [parse_ins, [code, indx]],
        [parse_eli, [code, indx]],
        [parse_var, [code, indx]],
    ])

    # Parses postfix extensions, trying each variant repeatedly
    post_parse = base_parse
    while True:
        [indx, term] = post_parse
        post_parse = first_valid([
            [parse_app, [code, indx, term]],
            [parse_ann, [code, indx, term]],
        ])
        if not post_parse:
            return base_parse
        else:
            base_parse = post_parse

    return None

# Parses a module
def parse_mod(code, indx):
    try:
        [indx, name] = parse_nam(code, space(code, indx))
        [indx, skip] = parse_str(":", code, space(code, indx))
        [indx, type] = parse_trm(code, space(code, indx))
        [indx, term] = parse_trm(code, space(code, indx))
        return Def(name, type, term, parse_mod(code, indx))
    except:
        return Eof()

# Stringify
# =========

def stringify_trm(term):
    if term["ctor"] == "Var":
        return term["name"];
    elif term["ctor"] == "Typ":
        return "Type";
    elif term["ctor"] == "All": 
      name = term["name"]
      bind = stringify_trm(term["bind"])
      body = stringify_trm(term["body"])
      eras = ";" if term["eras"] else ""
      return "("+name+" : "+bind+eras+") -> "+body
    elif term["ctor"] == "Lam":
      name = term["name"]
      body = stringify_trm(term["body"])
      eras = ";" if term["eras"] else ""
      return "("+name+eras+") => "+body
    elif term["ctor"] == "App":
      func = stringify_trm(term["func"])
      argm = stringify_trm(term["argm"])
      eras = ";" if term["eras"] else ""
      return "("+func+")("+argm+eras+")"
    elif term["ctor"] == "Slf":
      name = term["name"]
      type = stringify_trm(term["type"])
      return "#{"+name+"} "+type
    elif term["ctor"] == "Ins":
      type = stringify_trm(term["type"])
      term = stringify_trm(term["term"])
      return "#inst{"+type+"} "+term
    elif term["ctor"] == "Eli":
      term = stringify_trm(term["term"])
      return "#elim{"+term+"}"
    elif term["ctor"] == "Ann":
      term = stringify_trm(term["term"])
      type = stringify_trm(term["type"])
      return term+" :: "+type

def stringify_mod(mod):
    if mod["ctor"] == "Def":
        name = mod["name"]
        type = stringify_trm(mod["type"])
        term = stringify_trm(mod["term"])
        defs = stringify_mod(mod["defs"])
        return name + " : " + type + "\n  " + term + "\n\n" + defs
    elif mod["ctor"] == "Eof":
        return "";

