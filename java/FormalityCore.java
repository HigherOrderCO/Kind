public class FormalityCore {

	public enum CTor {VAR, REF, TYP, ALL, LAM, APP, LET, ANN, LOC}

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
			super(CTor.TYP);
			this.indx = indx;
		}
	}

	public static final class Typ extends Term {

		Typ() {
			super(CTor.TYP);
		}
	}

	public static void main(String[] args) {

	}

	public static Value find(Term list, cond, indx) {
		switch (list.ctor) {
			case "Nil":
				return null;
			case "Ext":
				if (cond(list.head, indx)) {
					return {value:list.head, index:indx};
				} else {
					return find(list.tail, cond, indx + 1);
				};
		};
	}
}
