import { Out } from "./Out";
import { Enumerator } from "./Enumerator";

/**
 * List Class
 */
export class List<T> extends Array {
	constructor(...props: T[]) {
		super();
		if (props.length === 0) {
			return;
		}
		for (const item of props) {
			this.Add(item);
		}
	}
	/**
	 * Add a value
	 */
	public Add(Value: T): number {
		return this.push(Value);
	}
	/**
	 * Turn a List to an arrau
	 */
	public static ToList(Props: any[]): List<any> {
		const t: List<any> = new List();
		for (const item of Props) {
			t.Add(item);
		}
		return t;
	}
	/**
	 * Clear the list
	 */
	public Clear(): void {
		this.splice(0, this.length);
	}
	/**
	 * Check if the list contains a value
	 */
	public Contains(item: T): boolean {
		return this.includes(item);
	}
	/**
	 * Get the count of items in the list.
	 */
	public get Count(): number {
		return this.length;
	}
	/**
	 * Remove the First instance of a value.
	 * if no value returns -1
	 */
	public Remove(iValue: number): number {
		const iIndex = this.indexOf(iValue);
		if (~iIndex) {
			this.RemoveAt(iIndex);
		}
		return iIndex;
	}
	/**
	 * Remove a value at a given index
	 */
	public RemoveAt(iIndex: number): T {
		const vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		return vItem;
	}
	/**
	 * Attempt to get a given value.
	 * @deprecated This is useless, use ContainsValue
	 */
	public TryGetValue(Value: T, out: Out<T>): boolean {
		if (Value == null) return false;
		if (this.includes(Value)) return false;
		if (out) out.Out = Value;
		return true;
	}
	/**
	 * Remove and return a Random value
	 */
	public TakeRandom(): T {
		return this.RemoveAt(~~(Math.random() * this.Count));
	}
	/**
	 * Get a random value
	 */
	public GetRandom(): T {
		return this[~~(Math.random() * this.Count)]
	}
	/**
	 * Get the enumerator for the class
	 */
	public GetEnumerator(): Enumerator<List<T>> {
		return new Enumerator(this);
	}
}
