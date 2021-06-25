/**
 * Out Support Class
 */
export class Out<T> {
	Out?: T;
	constructor(Out?: T) {
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
