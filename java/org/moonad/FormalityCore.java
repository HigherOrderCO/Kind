package org.moonad;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;

public class FormalityCore {

	public enum CTor {VAR, REF, TYP, ALL, LAM, APP, LET, ANN, LOC, NIL, EXT}

	public static abstract class Term {
		public final CTor ctor;
		
		Term(final CTor ctor) {
			this.ctor = ctor;
		}

		public String toString() {
			return stringify(this);
		}
	}

	public static final class Var extends Term {
		public final String indx;

		Var(final String indx) {
			super(CTor.VAR);
			this.indx = indx;
		}
	}
	
	public static final class Ref extends Term {
		public final String name;

		Ref(final String name) {
			super(CTor.REF);
			this.name = name;
		}
	}

	public static final class Typ extends Term {

		Typ() {
			super(CTor.TYP);
		}
	}

	public static final class All extends Term {
		public final boolean eras;
		public final String self;
		public final String name;
		public final Term bind;
		public final BiFunction<Term, Term, Term> body;

		All(final boolean eras, final String self, final String name, final Term bind, final BiFunction<Term, Term, Term> body) {
			super(CTor.ALL);
			this.eras = eras;
			this.self = self;
			this.name = name;
			this.bind = bind;
			this.body = body;
		}
	}

	public static final class Lam extends Term {
		public final boolean eras;
		public final String name;
		public final Function<Term, Term> body;

		Lam(final boolean eras, final String name, final Function<Term, Term> body) {
			super(CTor.LAM);
			this.eras = eras;
			this.name = name;
			this.body = body;
		}
	}

	public static final class App extends Term {
		public final boolean eras;
		public final Term func;
		public final Term argm;

		App(final boolean eras, final Term func, final Term argm) {
			super(CTor.APP);
			this.eras = eras;
			this.func = func;
			this.argm = argm;
		}
	}

	public static final class Let extends Term {
		public final String name;
		public final Term expr;
		public final Function<Term, Term> body;

		Let(final String name, final Term expr, final Function<Term, Term> body) {
			super(CTor.LET);
			this.name = name;
			this.expr = expr;
			this.body = body;
		}
	}

	public static final class Ann extends Term {
		public final boolean done;
		public final Term expr;
		public final Term type;

		Ann(final boolean done, final Term expr, final Term type) {
			super(CTor.ANN);
			this.done = done;
			this.expr = expr;
			this.type = type;
		}
	}

	public static final class Loc extends Term {
		public final Object from;
		public final Object upto;
		public final Term expr;

		Loc(final Object from, final Object upto, final Term expr) {
			super(CTor.LOC);
			this.from = from;
			this.upto = upto;
			this.expr = expr;
		}
	}
	
	public static abstract class List extends Term {
		public final int size;

		List(final CTor ctor, final int size) {
			super(ctor);
			this.size = size;
		}
	}
	public static final class Nil extends List {

		Nil() {
			super(CTor.NIL, 0);
		}
	}

	public static final class Ext extends List {
		public final Value head;
		public final List tail;

		Ext(final Value head, final List tail) {
			super(CTor.NIL, tail.size + 1);
			this.head = head;
			this.tail = tail;
		}
	}

	public static final class Value {
		public final String name;
		public final Term term;
		Value(final String name, final Term term) {
			super();
			this.name = name;
			this.term = term;
		}
	}


	public static final class IndexedValue {
		public final Value value;
		public final int index;
		IndexedValue(final Value value, final int index) {
			super();
			this.value = value;
			this.index = index;
		}
	}

	public static final class TypedValue {
		public final Term type;
		public final Term value;
		TypedValue(final Term type, final Term value) {
			this.type = type;
			this.value = value;
		}
	}

	public static class Either<T,U> {
		public final T first;
		public final U second;
		
		private Either(final T t, final U u) {
			first = t;
			second = u;
		}

		public static <T,U> Either<T, U> right(final U u) {
			return new Either<T,U>(null, u);
		}

		public static <T,U> Either<T, U> left(final T t) {
			return new Either<T,U>(t, null);
		}
	}

	public static void main(final String[] args) {
		System.out.println("FormalityCore");
	}

	/**
	 * Finds first value satisfying `cond` in a list
	 * @param list
	 * @param cond
	 * @param indx
	 * @return
	 */
	public static Optional<IndexedValue> find(final List list, final BiFunction<Value, Integer, Boolean> cond, final int indx) {
		switch (list.ctor) {
			case NIL:
				return Optional.empty();
			case EXT:
				final Ext ext = (Ext) list;
				if (cond.apply(ext.head, indx)) {
					return Optional.of(new IndexedValue(ext.head, indx));
				} else {
					return find(ext.tail, cond, indx + 1);
				}
			default:
				break;
		}
		throw new RuntimeException("Illegal list");
	}


	/** Syntax
	*/
	public static String stringify(final Term term) {
		return stringify(term, 0);
	}

	static String stringify(final Term term, final int depth) {
		switch (term.ctor) {
			case VAR:
				final Var vterm = (Var) term;
				return vterm.indx.split("#")[0];
			case REF:
				final Ref ref = (Ref) term;
				return ref.name;
			case TYP:
				//final Typ typ = (Typ) term;
				return "*";
			case ALL:
				final All all = (All) term;
				String bind = all.eras ? "∀" : "Π";
				final String self = all.self != null ? all.self.toString() : ("x"+(depth+0));
				String name = all.name != null ? all.name : ("x"+(depth+1));
				String type = stringify(all.bind, depth);
				String body = stringify(all.body.apply(new Var(self+"#"), new Var(name+"#")), depth+2);
				return bind + self + "(" + name + ":" + type + ") " + body;
			case LAM:
				final Lam lam = (Lam) term;
				bind = lam.eras ? "Λ" : "λ";
				name = !lam.name.isEmpty() ? lam.name : ("x"+(depth+0));
				body = stringify(lam.body.apply(new Var(name+"#")), depth);
				return bind + name + " " + body;
			case APP:
				final App app = (App) term;
				final String open = app.eras ? "<" : "(";
				final String func = stringify(app.func, depth);
				final String argm = stringify(app.argm, depth);
				final String clos = app.eras ? ">" : ")";
				return open + func + " " + argm + clos;
			case LET:
				final Let let = (Let) term;
				name = let.name != null ? let.name : ("x"+(depth+0));
				String expr = stringify(let.expr, depth);
				body = stringify(let.body.apply(new Var(name+"#")), depth+1);
				return "$" + name + "=" + expr + ";" + body;
			case ANN:
				final Ann ann = (Ann) term;
				type = stringify(ann.type, depth);
				expr = stringify(ann.expr, depth);
				return ":" + type + " " + expr;
			case LOC:
				final Loc loc = (Loc) term;
				return stringify(loc.expr, depth);
			default:
				throw new RuntimeException("Illegal list");
		}
	}

	public static boolean is_name(final String chr) {
		final int val = chr.charAt(0);
		return (val >= 46 && val < 47)   // .
			|| (val >= 48 && val < 58)   // 0-9
			|| (val >= 65 && val < 91)   // A-Z
			|| (val >= 95 && val < 96)   // _
			|| (val >= 97 && val < 123); // a-z
	}

	public static class Parser {
		private int indx;
		public final String code;

		private Parser(final String code) {
			this.code = code;
			this.indx = 0;
		}

		public String parse_name() {
			if (indx < code.length() && is_name(code.substring(indx))) {
				return code.charAt(indx+1) + parse_name();
			} else {
				return "";
			}
		}
		
		public void parse_nuls() {
			while (code.charAt(indx) == ' ' || code.charAt(indx) == '\n') {
				++indx;
			};
		}

		public void parse_char(final char chr) {
			if (indx >= code.length()) {
				throw new RuntimeException("Unexpected eof.");
			} else if (code.charAt(indx) != chr) {
				throw new RuntimeException("Expected \""+chr+"\", found "+
						code.charAt(indx)+" at "+indx+".");
			}
			++indx;
		}
		public Function<List, Term> parse_term() {
			parse_nuls();
			final char chr = code.charAt(indx++);
			switch (chr) {
				case '*':
					return (ctx) -> new Typ();
				case '∀':
				case 'Π':
					boolean eras = chr == '∀';
					final String self = parse_name();
					parse_char('(');
					String name = parse_name();
					parse_char(':');
					final Function<List, Term> bind = parse_term();
					parse_char(')');
					Function<List, Term> body = parse_term();
					return (ctx) -> new All(eras, self, name, bind.apply(ctx),
							(s,x) -> body.apply(
								new Ext(new Value(name,x),
									new Ext(new Value(self,s),
								ctx))
							));
				case 'λ':
				case 'Λ':
					eras = chr == 'Λ';
					name = parse_name();
					body = parse_term();
					return (ctx) -> new Lam(eras, name, (x) -> 
							body.apply(new Ext(new Value(name,x), ctx))
							);
				case '(':
				case '<':
					eras = chr == '<';
					final Function<List, Term> func = parse_term();
					final Function<List, Term> argm = parse_term();
					parse_char(eras ? '>' : ')');
					return (ctx) -> new App(eras, func.apply(ctx), argm.apply(ctx));
				case '$':
					name = parse_name();
					parse_char('=');
					Function<List, Term> expr = parse_term();
					parse_char(';');
					body = parse_term();
					final Function<List, Term> ret = (ctx) -> new Let(name, expr.apply(ctx), 
							(x) -> body.apply(new Ext(new Value(name, x), ctx)
							));
					return ret;
				case ':':
					   final Function<List, Term> type = parse_term();
					   expr = parse_term();
					   return (ctx) -> new Ann(false, expr.apply(ctx), type.apply(ctx));
				default:
					   if (is_name(String.valueOf(chr))) {
						   name = chr + parse_name();
						   return (ctx) -> {
							   final Optional<IndexedValue> got = find(ctx, (x, index) -> x.name.equals(name), 0);
							   return got.isPresent() ? got.get().value.term : new Ref(name);
						   };
					   } else {
						   throw new RuntimeException("Unexpected symbol: '" + chr + "'.");
					   }
			}
		}
		
		public Map<String, TypedValue> parse_defs() {
			final HashMap<String, TypedValue> defs = new HashMap<String, TypedValue>();
			parse_nuls();
			final String name = parse_name();
			if (name.length() > 0) {
				parse_char(':');
				final Term type = parse_term().apply(new Nil());
				final Term term = parse_term().apply(new Nil());
				defs.put(name, new TypedValue(type, term));
				parse_defs();
			}
			return defs;
		}

		public static Either<Term, Map<String, TypedValue>> parse(final String code, final int indx, final String mode) {
			final Parser parser = new Parser(code);

			if (mode.equals("defs")) {
				return Either.right(parser.parse_defs());
			} else {
				return Either.left(parser.parse_term().apply(new Nil()));
			}
		}
	}



	// Evaluation
	// ==========

	public static Term reduce(Term term, Map<String, TypedValue> defs) {
		return reduce(term, defs, false);
	}

	public static Term reduce(Term term, Map<String, TypedValue> defs, boolean erased) {
		switch (term.ctor) {
			case VAR:
				Var var = (Var) term;
				return new Var(var.indx);
			case REF:
				Ref ref = (Ref) term;
				if (defs.containsKey(ref.name)) {
					Term got = defs.get(ref.name).value;
					if (got.ctor == CTor.LOC &&
						((Loc) got).expr.ctor == CTor.REF &&
						((Ref) ((Loc) got).expr).name == ref.name) {
						return got;
					} else {
						return reduce(got, defs, erased);
					}
				} else {
					return ref;
				}
			case TYP:
				return term;
			case ALL:
				All all = (All) term;
				boolean eras = all.eras;
				String self = all.self;
				String name = all.name;
				Term bind = all.bind;
				BiFunction<Term, Term, Term> body = all.body;
				return new All(eras, self, name, bind, body);
			case LAM:
				Lam lam = (Lam) term;
				if (erased && lam.eras) {
					return reduce(lam.body.apply(new Lam(false, "", x -> x)), defs, erased);
				} else {
					eras = lam.eras;
					name = lam.name;
					Function<Term, Term> lamBody = lam.body;
					return new Lam(eras, name, lamBody);
				}
			case APP:
				App app = (App) term;
				if (erased && app.eras) {
					return reduce(app.func, defs, erased);
				} else {
					eras = app.eras;
					Term func = reduce(app.func, defs, erased);
					switch (func.ctor) {
						case LAM:
							return reduce(((Lam) func).body.apply(app.argm), defs, erased);
						default:
							return new App(eras, func, app.argm);
					}
				}
			case LET:
				Let let = (Let) term;
				name = let.name;
				Term expr = let.expr;
				Function<Term, Term> letBody = let.body;
				return reduce(letBody.apply(expr), defs, erased);
			case ANN:
				Ann ann = (Ann) term;
				return reduce(ann.expr, defs, erased);
			case LOC:
				return reduce(((Loc) term).expr, defs, erased);
			default:
				throw new IllegalArgumentException("Term " + term.ctor);
		}
	}

	public static Term normalize(Term term, Map<String, TypedValue> defs) {
		return normalize(term, defs, false, new HashSet<Term>());
	}

	public static Term normalize(Term term, Map<String, TypedValue> defs, boolean erased) {
		return normalize(term, defs, erased, new HashSet<Term>());
	}

	static Term normalize(Term term, Map<String, TypedValue> defs, boolean erased, Set<Term> seen) {
		var norm = reduce(term, defs, erased);
		if (seen.contains(term) || seen.contains(norm)) {
			return term;
		} else {
			seen.add(term);
			seen.add(norm);
			switch (norm.ctor) {
				case VAR:
					return new Var(((Var)norm).indx);
				case REF:
					return new Ref(((Ref)norm).name);
				case TYP:
					return new Typ();
				case ALL:
					All all = (All) norm;
					var eras = all.eras;
					var self = all.self;
					var name = all.name;
					var bind = normalize(all.bind, defs, erased, seen);
					BiFunction<Term, Term, Term> body = (s,x) ->
						normalize(all.body.apply(s,x), defs, erased, seen);
					return new All(eras, self, name, bind, body);
				case LAM:
					Lam lam = (Lam) norm;
					eras = lam.eras;
					name = lam.name;
					Function<Term, Term> lamBody = x -> normalize(lam.body.apply(x), defs, erased, seen);
					return new Lam(eras, name, lamBody);
				case APP:
					App app = (App) norm;
					eras = app.eras;
					var func = normalize(app.func, defs, erased, seen);
					var argm = normalize(app.argm, defs, erased, seen);
					return new App(eras, func, argm);
				case LET:
					return normalize(((Let)norm).body.apply(((Let) norm).expr), defs, erased, seen);
				case ANN:
					return normalize(((Ann) norm).expr, defs, erased, seen);
				case LOC:
					return normalize(((Loc)norm).expr, defs, erased, seen);
				default:
					throw new IllegalArgumentException("Term " + term.ctor);
			}
		}
	}


	// Equality
	// ========

	// Computes the hash of a term. JS strings are hashed, so we just return one.

	public static String hash(Term term) {
		return hash(term, 0);
	}

	static String hash(Term term, int dep) {
		switch (term.ctor) {
			case VAR:
				var indx = Integer.parseInt(((Var)term).indx.split("#")[1]);
				if (indx < 0) {
					return "^"+(dep+indx);
				} else {
					return "#"+indx;
				}
			case REF:
				return "$" + ((Ref) term).name;
			case TYP:
				return "Type";
			case ALL:
				All all = (All) term;
				var bind = hash(all.bind, dep);
				var body = hash(all.body.apply(new Var("#"+(-dep-1)), new Var("#"+(-dep-2))), dep+2);
				return "Π" + all.self + bind + body;
			case LAM:
				var lamBody = hash(((Lam)term).body.apply(new Var("#"+(-dep-1))), dep+1);
				return "λ" + lamBody;
			case APP:
				App app = (App) term;
				var func = hash(app.func, dep);
				var argm = hash(app.argm, dep);
				return "@" + func + argm;
			case LET:
				Let let = (Let) term;
				var expr = hash(let.expr, dep);
				var letBody = hash(let.body.apply(new Var("#"+(-dep-1))), dep+1);
				return "$" + expr + letBody;
			case ANN:
				Ann ann = (Ann) term;
				expr = hash(ann.expr, dep);
				return expr;
			case LOC:
				expr = hash(((Loc)term).expr, dep);
				return expr;
			default:
				throw new IllegalArgumentException("Term " + term.ctor);
		}
	}


	// Are two terms equal?
	public static boolean equal(Term a, Term b, Map<String, TypedValue> defs) {
		return equal(a, b, defs, 0);
	}
	public static boolean equal(Term a, Term b, Map<String, TypedValue> defs, int dep) {
		return equal(a, b, defs, dep, new HashSet<String>());
	}

	static boolean equal(Term a, Term b, Map<String, TypedValue> defs, int dep, Set<String> seen) {
		Term a1 = reduce(a, defs, true);
		Term b1 = reduce(b, defs, true);
		var ah = hash(a1);
		var bh = hash(b1);
		var id = ah + "==" + bh;
		if (ah.equals(bh) || seen.contains(id)) {
			return true;
		} else {
			seen.add(id);
			if (a1.ctor == b1.ctor) {
				switch (a1.ctor) {
					case ALL:
						All all_a1 = (All) a1;
						All all_b1 = (All) b1;
						var a1_body = all_a1.body.apply(new Var("#"+(dep)), new Var("#"+(dep+1)));
						var b1_body = all_b1.body.apply(new Var("#"+(dep)), new Var("#"+(dep+1)));
						return all_a1.eras == all_b1.eras
							&& all_a1.self == all_b1.self
							&& equal(all_a1.bind, all_b1.bind, defs, dep+0, seen)
							&& equal(a1_body, b1_body, defs, dep+2, seen);
					case LAM:
						Lam lam_a1 = (Lam) a1;
						Lam lam_b1 = (Lam) b1;
						a1_body = lam_a1.body.apply(new Var("#"+(dep)));
						b1_body = lam_b1.body.apply(new Var("#"+(dep)));
						return lam_a1.eras == lam_b1.eras
							&& equal(a1_body, b1_body, defs, dep+1, seen);
					case APP:
						App app_a1 = (App) a1;
						App app_b1 = (App) b1;
						return app_a1.eras == app_b1.eras
							&& equal(app_a1.func, app_b1.func, defs, dep, seen)
							&& equal(app_a1.argm, app_b1.argm, defs, dep, seen);
					case LET:
						Let let_a1 = (Let) a1;
						Let let_b1 = (Let) b1;
						a1_body = let_a1.body.apply(new Var("#"+(dep)));
						b1_body = let_b1.body.apply(new Var("#"+(dep)));
						return equal(let_a1.expr, let_b1.expr, defs, dep+0, seen)
							&& equal(a1_body, b1_body, defs, dep+1, seen);
					case ANN:
						return equal(((Ann)a1).expr, ((Ann)b1).expr, defs, dep, seen);
					case LOC:
						return equal(((Loc)a1).expr, ((Loc)b1).expr, defs, dep, seen);
						
					default:
						throw new IllegalArgumentException("Term " + a1.ctor);
				}
			} else {
				return false;
			}
		}
	}

	// Type-Checking
	// =============


	public static final class Err extends RuntimeException {
		public final Object loc;
		public final Object ctx;
		public final String msg;
		public static final long serialVersionUID = 12345;

		Err(Object loc, Object ctx, String msg) {
			super(msg);
			this.loc = loc;
			this.ctx = ctx;
			this.msg = msg;
		}
	}

	/**
	 *
	 */
	public static Term typeinfer(Term term, Map<String, TypedValue> defs) {
		return typeinfer(term, defs, FormalityCore::stringify, new Nil(), null);
	}

	public static Term typeinfer(Term term, Map<String, TypedValue> defs, Function<Term, String> show, List ctx) {
		return typeinfer(term, defs, show, ctx, null);
	}

	static Term typeinfer(Term term, Map<String, TypedValue> defs, Function<Term, String> show, List ctx, Object locs) {
		switch (term.ctor) {
			case VAR:
				return new Var(((Var) term).indx);
			case REF:
				Ref ref = (Ref) term;
				if (defs.containsKey(ref.name)) {
					var got = defs.get(ref.name);
					return got.type;
				} else {
					throw new Err(locs, ctx, "Undefined reference '" + ref.name + "'.");
				}
			case TYP:
				return new Typ();
			case APP:
				App app = (App) term;
				var func_typ = reduce(typeinfer(app.func, defs, show, ctx), defs);
				switch (func_typ.ctor) {
					case ALL:
						var self_var = new Ann(true, app.func, func_typ);
						var name_var = new Ann(true, app.argm, ((All)func_typ).bind);
						typecheck(app.argm, ((All)func_typ).bind, defs, show, ctx);
						var app_typ = ((All) func_typ).body.apply(self_var, name_var);
						if (func_typ.ctor == CTor.ALL && app.eras != ((All) func_typ).eras) {
							throw new Err(locs, ctx, "Mismatched erasure.");
						}
						return app_typ;
					default:
						throw new Err(locs, ctx, "Non-function application.");
				}
			case LET:
				Let let = (Let) term;
				var expr_typ = typeinfer(let.expr, defs, show, ctx);
				var expr_var = new Ann(true, new Var(let.name+"#"+(ctx.size+1)), expr_typ);
				var body_ctx = new Ext(new Value(let.name, expr_var.type), ctx);
				var body_typ = typeinfer(let.body.apply(expr_var), defs, show, body_ctx);
				return body_typ;
			case ALL:
				All all = (All) term;
				var self_var = new Ann(true, new Var(all.self+"#"+ctx.size), all);
				var name_var = new Ann(true, new Var(all.name+"#"+(ctx.size+1)), all.bind);
				body_ctx = new Ext(new Value(all.self, self_var.type), ctx);
				body_ctx = new Ext(new Value(all.name, name_var.type), body_ctx);
				typecheck(all.bind, new Typ(), defs, show, ctx);
				typecheck(all.body.apply(self_var, name_var), new Typ(), defs, show, body_ctx);
				return new Typ();
			case ANN:
				Ann ann = (Ann) term;
				if (!ann.done) {
					typecheck(ann.expr, ann.type, defs, show, ctx);
				}
				return ann.type;
			case LOC:
				Loc loc = (Loc) term;
				locs = new Loc(loc.from, loc.upto, null);
				return typeinfer(loc.expr, defs, show, ctx, locs);
			default:
				throw new Err(locs, ctx, "Can't infer type.");
		}
	}

	public static TypedValue typecheck(Term term, Term type, Map<String, TypedValue> defs) {
		return typecheck(term, type, defs, FormalityCore::stringify, new Nil());
	}

	public static TypedValue typecheck(Term term, Term type, Map<String, TypedValue> defs, Function<Term,String> show, List ctx) {
		return typecheck(term, type, defs, show, ctx, null);
	}
	
	public static TypedValue typecheck(Term term, Term type, Map<String, TypedValue> defs, Function<Term,String> show, List ctx, Object locs) {
		var typv = reduce(type, defs);
		switch (term.ctor) {
			case LAM:
				Lam lam = (Lam) term;
				if (typv.ctor == CTor.ALL) {
					var self_var = new Ann(true, lam, type);
					var name_var = new Ann(true, new Var(lam.name+"#"+(ctx.size+1)), ((All) typv).bind);
					var body_typ = ((All)typv).body.apply(self_var, name_var);
					if (lam.eras != ((All) typv).eras) {
						throw new Err(locs, ctx, "Type mismatch.");
					}
					var body_ctx = new Ext(new Value(lam.name, name_var.type), ctx);
					typecheck(lam.body.apply(name_var), body_typ, defs, show, body_ctx);
				} else {
					throw new Err(locs, ctx, "Lambda has a non-function type.");
				}
				break;
			case LET:
				Let let = (Let) term;
				var expr_typ = typeinfer(let.expr, defs, show, ctx);
				var expr_var = new Ann(true, new Var(let.name+"#"+(ctx.size+1)), expr_typ);
				var body_ctx = new Ext(new Value(let.name, expr_var.type), ctx);
				typecheck(let.body.apply(expr_var), type, defs, show, body_ctx);
				break;
			case LOC:
				Loc loc = (Loc) term;
				locs = new Loc(loc.from, loc.upto, null);
				typecheck(loc.expr, type, defs, show, ctx, locs);
				break;
			default:
				var infr = typeinfer(term, defs, show, ctx);
				boolean eq = equal(type, infr, defs, ctx.size);
				if (!eq) {
					// TODO add ctx
					var type0_str = show.apply(normalize(type, new HashMap<String, TypedValue>(), true));
					var infr0_str = show.apply(normalize(infr, new HashMap<String, TypedValue>(), true));
					throw new Err(locs, ctx,
							"Found type... \u001b[2m"+infr0_str+"\u001b[0m\n" +
							"Instead of... \u001b[2m"+type0_str+"\u001b[0m");
				}
				break;
		};
		return new TypedValue(type, term);
	}
}
