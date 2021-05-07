export class Out<T> extends Array<T> {
	Out?: T;
	constructor(Out?: T) {
		super();
		if (Out != null) {
			this.Out = Out;
		}
	}
	public static Default(): Out<any> {
		return new Out();
	}
}
