# Term

def Var(name):
    return {"ctor": "Var", "name": name}

def Ref(name):
    return {"ctor": "Ref", "name": name}

def Typ():
    return {"ctor": "Typ"}

def All(name, bind, body, eras):
    return {"ctor": "All", "name": name, "body": body, "eras": eras}

def Lam(name, body, eras):
    return {"ctor": "Lam", "name": name, "body": body, "eras": eras}

def Slf(name, expr):
    return {"ctor": "Slf", "name": name, "expr": expr}

def Ins(expr):
    return {"ctor": "Slf", "expr": expr}

def Eli(expr):
    return {"ctor": "Eli", "expr": expr}

def Ann(type, expr, done):
    return {"ctor": "Typ", "expr": expr, "done": done}

# Module

def Def(name, ttyp, tval, defs):
    return {"ctor": "Def", "name": name, "ttyp": ttyp, "tval": tval, "defs": defs}

def Eof():
    return {"ctor": "Eof"}
