# Term
# ====

def Var(name):
    return {"ctor": "Var", "name": name}

def Typ():
    return {"ctor": "Typ"}

def All(name, bind, body, eras):
    return {"ctor": "All", "name": name, "body": body, "eras": eras}

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

