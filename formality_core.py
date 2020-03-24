# Term
# ====

def Var(indx):
    return {"ctor": "Var", "indx": indx}

def Ref(name):
    return {"ctor": "Ref", "name": name}

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
    return {"ctor": "Slf", "type": type, "expr": expr}

def Eli(expr):
    return {"ctor": "Eli", "expr": expr}

def Ann(expr, type, done):
    return {"ctor": "Typ", "expr": expr, "type": type, "done": done}

# List
# ====

def Ext(head, tail):
    return {"ctor": "Ext", "head": head, "tail": tail}

def Nil():
    return {"ctor": "Nil"}

# Module
# ======

def Def(name, type, term):
    return {"ctor": "Def", "name": name, "type": type, "term": term}

# Parsing
# =======

# Finds a value in a list
def find(list, cond, indx = 0):
    ctor = list["ctor"]
    if ctor == "Ext":
        if cond(list["head"], indx):
            return {"value": list["head"], "index": indx}
        else:
            return find(list["tail"], cond, indx + 1)
    elif ctor == "Nil":
        return None

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
    if indx < len(code) and is_name(code[indx]):
        head = code[indx]
        [indx, tail] = parse_nam(code, indx + 1, size + 1)
        return [indx, head + tail]
    elif size > 0:
        return [indx, ""]
    else:
        raise

# Parses a parenthesis, `(<term>)`
def parse_par(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, term] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, term]

# Parses a dependent function type, `(<name> : <term>) => <term>`
def parse_all(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str(":", code, space(code, indx))
    [indx, bind] = parse_trm(code, indx, vars)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("->", code, space(code, indx))
    [indx, body] = parse_trm(code, indx, Ext(name, vars))
    return [indx, All(name, bind, body, eras)];

# Parses a dependent function value, `(<name>) => <term>`
def parse_lam(code, indx, vars):
    [indx, skip] = parse_str("(", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    [indx, skip] = parse_str("=>", code, space(code, indx))
    [indx, body] = parse_trm(code, indx, Ext(name, vars))
    return [indx, Lam(name, body, eras)]

# Parses the type of types, `Type`
def parse_typ(code, indx, vars):
    [indx, skip] = parse_str("Type", code, space(code, indx))
    return [indx, Typ()]

# Parses variables, `<name>`
def parse_var(code, indx, vars):
    [indx, name] = parse_nam(code, space(code, indx))
    got = find(vars, lambda x, i: x == name)
    if got:
        return [indx, Var(got["index"])]
    else:
        return [indx, Ref(name)]

# Parses a self type, `#{<name>} <term>`
def parse_slf(code, indx, vars):
    [indx, skip] = parse_str("#{", code, space(code, indx))
    [indx, name] = parse_nam(code, space(code, indx))
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, Ext(name, vars))
    return [indx, Slf(name, type)]

# Parses a self instantiation, `#inst{<term>}`
def parse_ins(code, indx, vars):
    [indx, skip] = parse_str("#inst{", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str("}", code, space(code, indx))
    [indx, expr] = parse_trm(code, indx, vars)
    return [indx, Ins(type, expr)]

# Parses a self elimination, `#elim{<term>}`
def parse_eli(code, indx, vars):
    [indx, skip] = parse_str("#elim{", code, space(code, indx))
    [indx, expr] = parse_trm(code, indx, vars)
    [indx, skip] = parse_str("}", code, space(code, indx))
    return [indx, Eli(expr)]

# Parses an application, `<term>(<term>)`
def parse_app(code, indx, func, vars):
    [indx, skip] = parse_str("(", code, indx)
    [indx, argm] = parse_trm(code, indx, vars)
    [indx, eras] = parse_opt(";", code, space(code, indx))
    [indx, skip] = parse_str(")", code, space(code, indx))
    return [indx, App(func, argm, eras)]

# Parses an annotation, `<term> :: <term>`
def parse_ann(code, indx, expr, vars):
    [indx, skip] = parse_str("::", code, space(code, indx))
    [indx, type] = parse_trm(code, indx, vars)
    return [indx, Ann(expr, type, False)]

# Parses a term
def parse_trm(code, indx, vars = Nil()):
    # Parses the base term, trying each variant once
    base_parse = first_valid([
        [parse_all, [code, indx, vars]],
        [parse_lam, [code, indx, vars]],
        [parse_par, [code, indx, vars]],
        [parse_typ, [code, indx, vars]],
        [parse_slf, [code, indx, vars]],
        [parse_ins, [code, indx, vars]],
        [parse_eli, [code, indx, vars]],
        [parse_var, [code, indx, vars]],
    ])

    # Parses postfix extensions, trying each variant repeatedly
    post_parse = base_parse
    while True:
        [indx, term] = post_parse
        post_parse = first_valid([
            [parse_app, [code, indx, term, vars]],
            [parse_ann, [code, indx, term, vars]],
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
        [indx, type] = parse_trm(code, space(code, indx), Nil())
        [indx, term] = parse_trm(code, space(code, indx), Nil())
        return Ext(Def(name, type, term), parse_mod(code, indx))
    except:
        return Nil()

# Stringification
# ===============

def stringify_trm(term, vars = Nil()):
    ctor = term["ctor"]
    if ctor == "Var":
        got = find(vars, lambda x, i: i == term["indx"])
        if got:
            return got["value"]
        else:
            return "#" + term["indx"]
    elif ctor == "Ref":
        return term["name"];
    elif ctor == "Typ":
        return "Type";
    elif ctor == "All": 
      name = term["name"]
      bind = stringify_trm(term["bind"], vars)
      body = stringify_trm(term["body"], Ext(name, vars))
      eras = ";" if term["eras"] else ""
      return "("+name+" : "+bind+eras+") -> "+body
    elif ctor == "Lam":
      name = term["name"]
      body = stringify_trm(term["body"], Ext(name, vars))
      eras = ";" if term["eras"] else ""
      return "("+name+eras+") => "+body
    elif ctor == "App":
      func = stringify_trm(term["func"], vars)
      argm = stringify_trm(term["argm"], vars)
      eras = ";" if term["eras"] else ""
      return "("+func+")("+argm+eras+")"
    elif ctor == "Slf":
      name = term["name"]
      type = stringify_trm(term["type"], Ext(name, vars))
      return "#{"+name+"} "+type
    elif ctor == "Ins":
      type = stringify_trm(term["type"], vars)
      expr = stringify_trm(term["expr"], vars)
      return "#inst{"+type+"} "+expr
    elif ctor == "Eli":
      expr = stringify_trm(term["expr"], vars)
      return "#elim{"+expr+"}"
    elif ctor == "Ann":
      expr = stringify_trm(term["expr"], vars)
      type = stringify_trm(term["type"], vars)
      return expr+" :: "+type

def stringify_mod(mod):
    ctor = mod["ctor"]
    if ctor == "Ext":
        name = mod["head"]["name"]
        type = stringify_trm(mod["head"]["type"], Nil())
        term = stringify_trm(mod["head"]["term"], Nil())
        defs = stringify_mod(mod["tail"])
        return name + " : " + type + "\n  " + term + "\n\n" + defs
    elif ctor == "Nil":
        return ""

