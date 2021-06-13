/**
 * Out Support Class
 */
export class Out<T> extends Array<T> {
	Out?: T;
	constructor(Out?: T) {
		super();
		if (Out != null) {
			this.Out = Out;
		}
	}
	/**
	 * Because Typescript can be wonky
	 */
	public static Default(): Out<any> {
		return new Out();
	}
}
