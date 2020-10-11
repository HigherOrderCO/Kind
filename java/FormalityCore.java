import java.util.function.BiFunction;

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
		public final String indx;

		Ref(String indx) {
			super(CTor.REF);
			this.indx = indx;
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
		public final Object bind;
		public final Object body;

		All(Object eras, Object self, String name, Object bind, Object body) {
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
		public final Object body;

		Lam(Object eras, String name, Object body) {
			super(CTor.LAM);
			this.eras = eras;
			this.name = name;
			this.body = body;
		}
	}

	public static final class App extends Term {
		public final Object eras;
		public final Object func;
		public final Object argm;

		App(Object eras, Object func, Object argm) {
			super(CTor.APP);
			this.eras = eras;
			this.func = func;
			this.argm = argm;
		}
	}

	public static final class Let extends Term {
		public final String name;
		public final Object expr;
		public final Object body;

		Let(String name, Object expr, Object body) {
			super(CTor.LET);
			this.name = name;
			this.expr = expr;
			this.body = body;
		}
	}

	public static final class Ann extends Term {
		public final Object done;
		public final Object expr;
		public final Object type;

		Ann(Object done, Object expr, Object type) {
			super(CTor.ANN);
			this.done = done;
			this.expr = expr;
			this.type = type;
		}
	}

	public static final class Loc extends Term {
		public final Object from;
		public final Object upto;
		public final Object expr;

		Loc(Object from, Object upto, Object expr) {
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

	public static Value find(List list, BiFunction<Object, Integer, Boolean> cond, int indx) {
		switch (list.ctor.toString()) {
			case "Nil":
				return null;
			case "Ext":
				Ext ext = (Ext) list;
				if (cond.apply(ext.head, indx)) {
					return new Value(ext.head, indx);
				} else {
					return find(ext.tail, cond, indx + 1);
				}
		}
		throw new RuntimeException("Illegal list");
	}
}
