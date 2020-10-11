import java.util.function.BiFunction;
import java.util.function.Function;

public class FormalityCore {

	public enum CTor {VAR, REF, TYP, ALL, LAM, APP, LET, ANN, LOC, NIL, EXT}

	public static abstract class Term {
		public final CTor ctor;
		
		Term(CTor ctor) {
			this.ctor = ctor;
		}
	}

	public static final class Var extends Term {
		public final String indx;

		Var(String indx) {
			super(CTor.VAR);
			this.indx = indx;
		}
	}
	
	public static final class Ref extends Term {
		public final String name;

		Ref(String name) {
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
		public final Object eras;
		public final Object self;
		public final String name;
		public final Term bind;
		public final BiFunction<Term, Term, Term> body;

		All(Object eras, Object self, String name, Term bind, BiFunction<Term, Term, Term> body) {
			super(CTor.ALL);
			this.eras = eras;
			this.self = self;
			this.name = name;
			this.bind = bind;
			this.body = body;
		}
	}

	public static final class Lam extends Term {
		public final Object eras;
		public final String name;
		public final Function<Term, Term> body;

		Lam(Object eras, String name, Function<Term, Term> body) {
			super(CTor.LAM);
			this.eras = eras;
			this.name = name;
			this.body = body;
		}
	}

	public static final class App extends Term {
		public final Object eras;
		public final Term func;
		public final Term argm;

		App(Object eras, Term func, Term argm) {
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

		Let(String name, Term expr, Function<Term, Term> body) {
			super(CTor.LET);
			this.name = name;
			this.expr = expr;
			this.body = body;
		}
	}

	public static final class Ann extends Term {
		public final Object done;
		public final Term expr;
		public final Term type;

		Ann(Object done, Term expr, Term type) {
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

		Loc(Object from, Object upto, Term expr) {
			super(CTor.LOC);
			this.from = from;
			this.upto = upto;
			this.expr = expr;
		}
	}
	
	public static abstract class List extends Term {
		public final int size;

		List(CTor ctor, int size) {
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

		Ext(Value head, List tail) {
			super(CTor.NIL, tail.size + 1);
			this.head = head;
			this.tail = tail;
		}
	}

	public static final class Value {
		public final Object value;
		public final Object indx;
		Value(Object value, Object indx) {
			super();
			this.value = value;
			this.indx = indx;
		}
	}

	public static void main(String[] args) {
		System.out.println("FormalityCore");
	}

	/**
	* Finds first value satisfying `cond` in a list
	* @param list
	* @param cond
	* @param indx
	* @return
	 */
	public static Value find(List list, BiFunction<Object, Integer, Boolean> cond, int indx) {
		switch (list.ctor) {
			case NIL:
				return null;
			case EXT:
				Ext ext = (Ext) list;
				if (cond.apply(ext.head, indx)) {
					return new Value(ext.head, indx);
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
	public static String stringify(Term term, int depth) {
		switch (term.ctor) {
			case VAR:
				Var vterm = (Var) term;
				return vterm.indx.split("#")[0];
			case REF:
				Ref ref = (Ref) term;
				return ref.name;
			case TYP:
				Typ typ = (Typ) term;
				return "*";
			case ALL:
				All all = (All) term;
				String bind = all.eras != null ? "∀" : "Π";
				String self = all.self != null ? all.self.toString() : ("x"+(depth+0));
				String name = all.name != null ? all.name : ("x"+(depth+1));
				String type = stringify(all.bind, depth);
				String body = stringify(all.body.apply(new Var(self+"#"), new Var(name+"#")), depth+2);
				return bind + self + "(" + name + ":" + type + ") " + body;
			case LAM:
				Lam lam = (Lam) term;
				bind = lam.eras != null ? "Λ" : "λ";
				name = lam.name != null ? lam.name : ("x"+(depth+0));
				body = stringify(lam.body.apply(new Var(name+"#")), depth);
				return bind + name + " " + body;
			case APP:
				App app = (App) term;
				String open = app.eras != null ? "<" : "(";
				String func = stringify(app.func, depth);
				String argm = stringify(app.argm, depth);
				String clos = app.eras != null ? ">" : ")";
				return open + func + " " + argm + clos;
			case LET:
				Let let = (Let) term;
				name = let.name != null ? let.name : ("x"+(depth+0));
				String expr = stringify(let.expr, depth);
				body = stringify(let.body.apply(new Var(name+"#")), depth+1);
				return "$" + name + "=" + expr + ";" + body;
			case ANN:
				Ann ann = (Ann) term;
				type = stringify(ann.type, depth);
				expr = stringify(ann.expr, depth);
				return ":" + type + " " + expr;
			case LOC:
				Loc loc = (Loc) term;
				return stringify(loc.expr, depth);
			default:
				throw new RuntimeException("Illegal list");
		}
	}
}
